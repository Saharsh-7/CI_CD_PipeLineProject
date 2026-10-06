import { LightningElement } from 'lwc';

export default class TrueAndFalseDirectiveDemo extends LightningElement {


    labelName = 'Show';
    flag = false;

    handleClick(event){
        const buttonLabel = event.target.label;
        console.log('Button lable is : ' , buttonLabel);

        if(buttonLabel === 'Show'){
            this.labelName = 'Hide';
            this.flag = true;
        } else if(buttonLabel === 'Hide'){
            this.labelName = 'Show';
            this.flag = false;
        }
    }
}