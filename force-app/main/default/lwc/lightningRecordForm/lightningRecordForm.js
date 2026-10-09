import { LightningElement,api } from 'lwc';
import FIRST_NAME from "@salesforce/schema/Patient__c.First_Name__c";
import LAST_NAME from "@salesforce/schema/Patient__c.Last_Name__c";
import PHONE from "@salesforce/schema/Patient__c.Phone__c";
import GENDER from "@salesforce/schema/Patient__c.Gender__c";

export default class LightningRecordForm extends LightningElement {

    @api recordId;
    @api objectApiName;
    Fields = [FIRST_NAME, LAST_NAME, PHONE, GENDER];


}