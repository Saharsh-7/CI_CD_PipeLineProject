import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {
    information = 'Parent Component Property is called';

    parentMethod(){
        this.template.querySelector("c-child-component").childMethod();
        
    }
}