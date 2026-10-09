import { LightningElement,track, wire } from 'lwc';
import getPatientInfo from '@salesforce/apex/PatientController.getPatientDetails';


export default class ComboboxBasic extends LightningElement {
    @track value = '';
    @track optionsArray = [];

    get options() {
        return this.optionsArray;
    }

    connectedCallback(){
        getPatientInfo()
        .then(result => {
            let arr = [];
            for(let i = 0; i < result.length; i++){
                arr.push({label : result[i].Name, value : result[i].Id});
                arr.push({label: result[i].First_Name__c, value : result[i].First_Name__c})
            }
            this.optionsArray = arr; 
        })
        .catch(error => {
            console.log('Error is ', error);
        });
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}