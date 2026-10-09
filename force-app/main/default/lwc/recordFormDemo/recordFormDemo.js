import { LightningElement, api } from 'lwc';

import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ANNUAL_REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
    import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class RecordFormDemo extends LightningElement {
    @api recordId;
    objectApiName = ACCOUNT_OBJECT;
    accountName = ACCOUNT_NAME_FIELD;
    annualRevenueField = ANNUAL_REVENUE_FIELD;
    PhoneField = PHONE_FIELD;



    handlesuccess(event){

        const evnt = new ShowToastEvent(
            {
                title : 'Success',
                message : 'Record has been successfully edited',
                varaint : 'success'
            }
        );

        this.dispatchEvent(evnt);
        window.alert('Inside Handle Success');
    }


    
}