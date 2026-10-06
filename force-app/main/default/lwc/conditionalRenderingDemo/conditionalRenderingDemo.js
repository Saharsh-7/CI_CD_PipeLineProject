import { LightningElement, wire, track } from 'lwc';
import getPatientInfo from '@salesforce/apex/PatientController.getPatientInfo';

export default class ConditionalRenderingDemo extends LightningElement {


    @track patientList = [];

    @wire(getPatientInfo)
    patientList;
}