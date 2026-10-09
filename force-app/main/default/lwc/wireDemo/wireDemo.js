import { LightningElement, wire } from 'lwc';
import getPatientDetails from '@salesforce/apex/PatientController.getPatientDetails';

export default class WireDemo extends LightningElement {

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'First Name', fieldName: 'First_Name__c' },
        { label: 'Last Name', fieldName: 'Last_Name__c' },
        { label: 'Email', fieldName: 'Email__c' },
        { label: 'Phone', fieldName: 'Phone__c' },
        { label: 'Blood Group', fieldName: 'Blood_Group__c' },
        { label: 'Date of Birth', fieldName: 'Date_of_Birth__c' }
    ];

    datas = [];

    @wire(getPatientDetails)
    wirePatientDetails({ data, error }) {

        if (data) {
            this.datas = data;
            console.log('Data fetched:', JSON.stringify(data));
        }

        if (error) {
            console.error('Error:', JSON.stringify(error));
        }
    }
}