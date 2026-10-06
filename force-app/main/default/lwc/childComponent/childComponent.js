import { LightningElement,api } from 'lwc';

export default class ChildComponent extends LightningElement {

     @api message = 'Calling Child component Property';

    @api childMethod(){
        this.message = 'This is parent method calling child method';
        window.alert(`${this.message}`);
    }

}