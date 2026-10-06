import { LightningElement,track } from 'lwc';
import getPatientInfo from '@salesforce/apex/PatientController.getPatientInfo';

export default class ImperativeMethodDemo extends LightningElement {


    @track columns = [
        {label : 'Id', fieldName : 'Id'}, 
        {label : 'FirstName',fieldName : 'First_Name__c'},
        {label : 'LastName',fieldName : 'Last_Name__c'}, 
        {label : 'Email',fieldName : 'Email__c'}, 
        {label : 'Phone',fieldName : 'Phone__c'}
    ];

    @track data = [];

    connectedCallback(){
        /*getPatientInfo().then(result => {
            this.data = result;
        })
        .catch(error => {
            console.error('Error fetching patient info:', error);
        })*/

        const fetchPatientInfo = async () => { 
            try {
                const result = await getPatientInfo();
                this.data = result;
            }catch(error){
                console.log('Error is : ' + error);
            }
        }
        fetchPatientInfo();
    }

}