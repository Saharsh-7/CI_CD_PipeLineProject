import { LightningElement, track } from 'lwc';
import getContact from '@salesforce/apex/ContactController.getContact';
const page_Size = 50;

export default class PaginationByRecordId extends LightningElement {

    lastRecordId;
    isLoading = false;
    hasMoreRecords = true;
    @track displayData = [];


    Columns = [{label : 'FirstName', fieldName : 'FirstName', type : 'text'},
        {label : 'LastName', fieldName : 'LastName', type : 'text'},
        {label:'Email',fieldName:'Email',type:'text'}, 
        {label:'Phone',fieldName:'Phone',type:'text'}, 
        {label:'AccountName',fieldName: 'AccountName',type:'text'}
    ];

    connectedCallback(){
       this.loadRecord();
    }

    loadRecord(){

         if(this.isLoading || !this.hasaMoreRecords){
            return;
        }
        this.isLoading = true;

         getContact({lastRecordId : this.lastRecordId, pagesize : page_Size})
         .then((result) => {

            if(result && result.length > 0){
                this.displayData = [...this.displayData, ...result];

                this.lastRecordId = result=[result.length - 1].Id;

                if(result.length < page_Size){
                    this.hasMoreRecords = false;
                }
             } else {
                this.hasMoreRecords = false;
             }
         })
         .catch((error) => {
            console.log('Error is this : ' + JSON.stringify(error));
         })
         .finally(() => {
            this.isLoading = false;
         });

    }

    handleLoadMore(event){
        this.loadRecord();
    }

    


}