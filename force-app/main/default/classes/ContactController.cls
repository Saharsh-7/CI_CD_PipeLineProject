public with sharing class ContactController {
   
    @AuraEnabled(cacheable=false)
    public static List<Contact> getContact(Id lastRecordId, Integer pageSize){
    

       String query = 'SELECT Id, FirstName, LastName, Phone, Email FROM Contact';

        if(String.isNotBlank(lastRecordId)){
            query += 'WHERE Id > :lastRecordId';
        }
        query += 'ORDER BY Id LIMIT : pageSize';
        return Database.query(query);
    }
}