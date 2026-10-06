/**
 * @description       : Build an LWC that display related cases for an Account. If the user edits a Case inline, ensure the update reflects immediately in the UI without a full page reload
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 09-18-2026
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/


public with sharing class AccountController {
    
    @AuraEnabled (cacheable=true)
    public static List<Case> getRelatedCases(Id accountId){

        List<Case> relatedCases = [SELECT Id, CaseNumber, Subject, AccountId, Origin, Account.Name, Account.Id FROM CASE
                                    WHERE AccountId =: accountId AND Subject != NULL AND Origin != NULL
                                    ORDER BY Account.Name
                                ];

        return relatedCases;
    }

}