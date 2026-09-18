import { LightningElement,wire } from 'lwc';
import getRelatedCases from '@salesforce/apex/AccountController.getRelatedCases';

export default class RelatedCaseComponent extends LightningElement {

    columns = [

        {label: 'Case Number ', fieldName : 'CaseNumber', type: 'text', editable : true}, 
        {label : 'Subject', fieldName : 'Subject', type :'text', editable : true}, 
        {label : 'Origin', fieldName : 'Origin', type : 'text',editable : true},
        {label : 'Account Name', fieldName : 'AccountName', type : 'text', editable : true}

    ];

    data = [];


    @wire(getRelatedCases)
    wiredCases({data,error}){
        if(data){
            this.data = data.map( caseRecord => {
                 return {Id : caseRecord.Id, CaseNumber : caseRecord.CaseNumber, Subject : caseRecord.Subject, Origin : caseRecord.Origin, AccountName : caseRecord.Account.Name}; 
            });
        } else if(error){
            console.log('Error is this : ' + JSON.stringify(error));
        }
    }
}