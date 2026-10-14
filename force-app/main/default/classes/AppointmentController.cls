/**
 * @description Controller to fetch and dynamically add picklist values to Appointment__c.Status__c
 */
public with sharing class AppointmentController {
    
    private static final String OBJECT_NAME = 'Appointment__c'; 
    private static final String FIELD_NAME = 'Status__c';

    /**
     * @description Fetches current active picklist values directly via Schema
     * @return List of label/value maps for lightning-combobox
     */
    @AuraEnabled(cacheable=false)
    public static List<Map<String, String>> getPicklistValues() {
        List<Map<String, String>> options = new List<Map<String, String>>();
        Schema.SObjectType objType = Schema.getGlobalDescribe().get(OBJECT_NAME);
        if (objType == null) {
            throw new AuraHandledException('Object not found: ' + OBJECT_NAME);
        }
        
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        Schema.DescribeFieldResult fieldDescribe = objDescribe.fields.getMap().get(FIELD_NAME).getDescribe();
        
        for (Schema.PicklistEntry entry : fieldDescribe.getPicklistValues()) {
            if (entry.isActive()) {
                options.add(new Map<String, String>{
                    'label' => entry.getLabel(),
                    'value' => entry.getValue()
                });
            }
        }
        return options;
    }

    /**
     * @description Adds a new picklist value to backend metadata using Tooling API + Named Credential
     * @param statusValue The new picklist value to add
     * @return Status message
     */
    @AuraEnabled
    public static String addPicklistValue(String statusValue) {
        try {
            if (String.isBlank(statusValue)) {
                throw new AuraHandledException('Status value is required.');
            }
            statusValue = statusValue.trim();

            String devName = FIELD_NAME.removeEndIgnoreCase('__c');

            // Step A: Query Tooling API for the CustomField
            String query = 'SELECT Id, Metadata, FullName FROM CustomField WHERE EntityDefinition.QualifiedApiName = \'' 
                         + OBJECT_NAME + '\' AND DeveloperName = \'' + devName + '\' LIMIT 1';
            
            Http http = new Http();
            HttpRequest getReq = new HttpRequest();
            getReq.setEndpoint('callout:Tooling_API_Credential/services/data/v62.0/tooling/query/?q=' + EncodingUtil.urlEncode(query, 'UTF-8'));
            getReq.setMethod('GET');
            getReq.setHeader('Content-Type', 'application/json');

            HttpResponse getRes = http.send(getReq);
            if (getRes.getStatusCode() != 200) {
                throw new AuraHandledException('Tooling API Query Failed: ' + getRes.getBody());
            }

            Map<String, Object> queryResult = (Map<String, Object>) JSON.deserializeUntyped(getRes.getBody());
            List<Object> records = (List<Object>) queryResult.get('records');
            if (records.isEmpty()) {
                throw new AuraHandledException('Custom field not found via Tooling API.');
            }

            Map<String, Object> fieldRecord = (Map<String, Object>) records[0];
            String fieldId = (String) fieldRecord.get('Id');
            Map<String, Object> rawMetadata = (Map<String, Object>) fieldRecord.get('Metadata');
            Map<String, Object> rawValueSet = (Map<String, Object>) rawMetadata.get('valueSet');

            // Check if this field uses a GlobalValueSet instead of a local valueSetDefinition
            String valueSetName = (String) rawValueSet.get('valueSetName');
            if (String.isNotBlank(valueSetName)) {
                return updateGlobalValueSet(valueSetName, statusValue, http);
            }

            Map<String, Object> rawValueSetDef = (Map<String, Object>) rawValueSet.get('valueSetDefinition');
            List<Object> rawValues = (List<Object>) rawValueSetDef.get('value');

            // Step B: Rebuild a clean list of CustomValue objects (strips null/read-only properties)
            List<Map<String, Object>> cleanValues = new List<Map<String, Object>>();
            for (Object valObj : rawValues) {
                Map<String, Object> valMap = (Map<String, Object>) valObj;
                String existingLabel = (String) valMap.get('label');
                String existingValueName = (String) valMap.get('valueName');
                
                if (statusValue.equalsIgnoreCase(existingLabel) || statusValue.equalsIgnoreCase(existingValueName)) {
                    throw new AuraHandledException('This picklist value already exists.');
                }

                Boolean isActive = valMap.get('isActive') == null ? true : (Boolean) valMap.get('isActive');
                Boolean isDefault = valMap.get('default') == null ? false : (Boolean) valMap.get('default');

                cleanValues.add(new Map<String, Object>{
                    'label' => existingLabel,
                    'valueName' => existingValueName,
                    'default' => isDefault,
                    'isActive' => isActive
                });
            }

            // Step C: Add the new picklist value
            cleanValues.add(new Map<String, Object>{
                'label' => statusValue,
                'valueName' => statusValue,
                'default' => false,
                'isActive' => true
            });

            // Step D: Build a clean Metadata payload with only valid CustomField properties
            Boolean sorted = rawValueSetDef.get('sorted') == null ? false : (Boolean) rawValueSetDef.get('sorted');
            Boolean restricted = rawValueSet.get('restricted') == null ? false : (Boolean) rawValueSet.get('restricted');

            Map<String, Object> cleanMetadata = new Map<String, Object>{
                'label' => (String) rawMetadata.get('label'),
                'type' => (String) rawMetadata.get('type'),
                'valueSet' => new Map<String, Object>{
                    'restricted' => restricted,
                    'valueSetDefinition' => new Map<String, Object>{
                        'sorted' => sorted,
                        'value' => cleanValues
                    }
                }
            };

            Map<String, Object> patchPayload = new Map<String, Object>{
                'FullName' => OBJECT_NAME + '.' + FIELD_NAME,
                'Metadata' => cleanMetadata
            };

            HttpRequest patchReq = new HttpRequest();
            patchReq.setEndpoint('callout:Tooling_API_Credential/services/data/v62.0/tooling/sobjects/CustomField/' + fieldId);
            patchReq.setMethod('PATCH');
            patchReq.setHeader('Content-Type', 'application/json');
            patchReq.setBody(JSON.serialize(patchPayload));

            HttpResponse patchRes = http.send(patchReq);

            if (patchRes.getStatusCode() != 204 && patchRes.getStatusCode() != 200) {
                throw new AuraHandledException(
                    'Failed to update picklist metadata (HTTP ' + patchRes.getStatusCode() + '): ' + patchRes.getBody()
                );
            }

            return 'Success';
        } catch (AuraHandledException e) {
            throw e;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
     * @description Fallback handler if Status__c is backed by a Global Value Set
     */
    private static String updateGlobalValueSet(String valueSetName, String statusValue, Http http) {
        String gvsQuery = 'SELECT Id, Metadata, FullName FROM GlobalValueSet WHERE DeveloperName = \'' + valueSetName + '\' LIMIT 1';
        HttpRequest getReq = new HttpRequest();
        getReq.setEndpoint('callout:Tooling_API_Credential/services/data/v62.0/tooling/query/?q=' + EncodingUtil.urlEncode(gvsQuery, 'UTF-8'));
        getReq.setMethod('GET');
        getReq.setHeader('Content-Type', 'application/json');

        HttpResponse getRes = http.send(getReq);
        Map<String, Object> queryResult = (Map<String, Object>) JSON.deserializeUntyped(getRes.getBody());
        List<Object> records = (List<Object>) queryResult.get('records');
        if (records.isEmpty()) {
            throw new AuraHandledException('Global Value Set not found: ' + valueSetName);
        }

        Map<String, Object> gvsRecord = (Map<String, Object>) records[0];
        String gvsId = (String) gvsRecord.get('Id');
        Map<String, Object> rawMetadata = (Map<String, Object>) gvsRecord.get('Metadata');
        List<Object> rawValues = (List<Object>) rawMetadata.get('customValue');

        List<Map<String, Object>> cleanValues = new List<Map<String, Object>>();
        for (Object valObj : rawValues) {
            Map<String, Object> valMap = (Map<String, Object>) valObj;
            String existingLabel = (String) valMap.get('label');
            String existingValueName = (String) valMap.get('valueName');
            if (statusValue.equalsIgnoreCase(existingLabel) || statusValue.equalsIgnoreCase(existingValueName)) {
                throw new AuraHandledException('This picklist value already exists.');
            }
            cleanValues.add(new Map<String, Object>{
                'label' => existingLabel,
                'valueName' => existingValueName,
                'default' => valMap.get('default') == null ? false : (Boolean) valMap.get('default'),
                'isActive' => valMap.get('isActive') == null ? true : (Boolean) valMap.get('isActive')
            });
        }

        cleanValues.add(new Map<String, Object>{
            'label' => statusValue,
            'valueName' => statusValue,
            'default' => false,
            'isActive' => true
        });

        Map<String, Object> cleanMetadata = new Map<String, Object>{
            'masterLabel' => (String) rawMetadata.get('masterLabel'),
            'sorted' => rawMetadata.get('sorted') == null ? false : (Boolean) rawMetadata.get('sorted'),
            'customValue' => cleanValues
        };

        Map<String, Object> patchPayload = new Map<String, Object>{
            'FullName' => (String) gvsRecord.get('FullName'),
            'Metadata' => cleanMetadata
        };

        HttpRequest patchReq = new HttpRequest();
        patchReq.setEndpoint('callout:Tooling_API_Credential/services/data/v62.0/tooling/sobjects/GlobalValueSet/' + gvsId);
        patchReq.setMethod('PATCH');
        patchReq.setHeader('Content-Type', 'application/json');
        patchReq.setBody(JSON.serialize(patchPayload));

        HttpResponse patchRes = http.send(patchReq);
        if (patchRes.getStatusCode() != 204 && patchRes.getStatusCode() != 200) {
            throw new AuraHandledException(
                'Failed to update GlobalValueSet (HTTP ' + patchRes.getStatusCode() + '): ' + patchRes.getBody()
            );
        }
        return 'Success';
    }
}