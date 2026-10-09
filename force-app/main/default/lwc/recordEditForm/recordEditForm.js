import { LightningElement, api } from 'lwc';
import CLINIC_OBJECT from '@salesforce/schema/Clinic__c';
import CLINIC_RECORD_SERIAL_NUMBER from '@salesforce/schema/Clinic__c.Record_Name__c';
import TIME_ZONE from '@salesforce/schema/Clinic__c.Time_Zone__c';
import CLINIC_REGION from '@salesforce/schema/Clinic__c.Region__c';
import CLINIC_Name from '@salesforce/schema/Clinic__c.Name';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RecordEditForm extends LightningElement {
  @api recordId;
  objectApiName = CLINIC_OBJECT;
  SerialNumber = CLINIC_RECORD_SERIAL_NUMBER;
  TimeZone = TIME_ZONE;
  ClinicRegion = CLINIC_REGION;
  ClinicName = CLINIC_Name;

  handleSucess(event) {



    this.dispatchEvent(new ShowToastEvent({
      title: 'success',
      message: 'Record created',
      variant: 'success'
    })
    );


    console.log('Inside handle sucess');
  }

  handlerror(event) {


    console.log('Inside error handler');
    this.dispatchEvent(new ShowToastEvent(
      {
        title: 'error',
        message: 'Record creation is failed',
        variant: 'error'
      }
    ));

  }
}