import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class ShowMessage extends LightningElement {
    showMessage = 'Welcome to Lightning Web Component!';
   

    handleclick(){
        //window.alert(this.showMessage);
       /* this.dispatchEvent(
            new ShowToastEvent({
                title:'Success',
                message: this.showMessage,
                variant:'success'
            })
        );*/
        console.log('Inside handleclick');
        this.calledFunction(this.showMessage);

    }


    calledFunction(passedMessage){
        console.log('Inside calledFunction');
        this.dispatchEvent(new ShowToastEvent({
            title: passedMessage,
            message : 'Hello',
            variant : 'success'
        }));
    }  


}