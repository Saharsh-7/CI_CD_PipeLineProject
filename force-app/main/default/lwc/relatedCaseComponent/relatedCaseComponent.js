import { LightningElement,wire,api } from 'lwc';
import getRelatedCases from '@salesforce/apex/AccountController.getRelatedCases';

export default class RelatedCaseComponent extends LightningElement {
    @api recordId;
    column = [

        {label: 'Case Number', fieldName : 'CaseNumber', type: 'text'}, 
        {label : 'Subject', fieldName : 'Subject', type :'text', editable : true}, 
        {label : 'Origin', fieldName : 'Origin', type : 'text',editable : true},
        {label : 'Account Name', fieldName : 'AccountName', type : 'text'}

    ];

    columnData = [];
    rowOffset = 0;
    draftValues = [];


    @wire(getRelatedCases,{accountId : '$recordId'})
    wiredCases({data,error}){
        if(data){
            try {
                this.columnData = data.map( caseRecord => {
                 return {
                    Id : caseRecord.Id, 
                    CaseNumber : caseRecord.CaseNumber, 
                    Subject : caseRecord.Subject,
                    Origin : caseRecord.Origin, 
                    AccountName : caseRecord.Account.Name
                }; 
            });
            console.log('Data is this : ' + JSON.stringify(this.columnData));
        }catch(error){
            console.log('Error encountered : ' + JSON.stringify(error));
        }
        } else if(error){
            console.log('Error is this : ' + JSON.stringify(error));
        }
    }
}