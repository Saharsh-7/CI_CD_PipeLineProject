import { LightningElement,track } from 'lwc';

export default class TrackPropertyDemo extends LightningElement {

    @track fullName = {firstName : '', lastName : ''};

    handleChange(event){
        const field = event.target.label;
        console.log('Field value is : ', field);

        if(field === 'First Name'){
            this.fullName.firstName = event.target.value;
            console.log('First Name : ', this.fullName.firstName);
        } else if(field === 'Last Name'){
            this.fullName.lastName = event.target.value;
            console.log('Last Name : ', this.fullName.lastName);
        }
        
    }
}