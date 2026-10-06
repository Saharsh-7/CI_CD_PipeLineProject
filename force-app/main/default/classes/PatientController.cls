public with sharing class PatientController {

    @AuraEnabled(cacheable=true)
    public static List<Patient__c> getPatientDetails() {

        return [
            SELECT Id,
                   Name,
                   Email__c,
                   Blood_Group__c,
                   First_Name__c,
                   Phone__c,
                   Last_Name__c,
                   Date_of_Birth__c
            FROM Patient__c
            ORDER BY Name ASC
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Patient__c> getPatientInfo(){
        List<Patient__c> patientList = [SELECT Id, Name, First_Name__c, Last_Name__c, Email__c, Phone__c FROM Patient__c];
        
        return patientList;
    }


}