import { LightningElement } from 'lwc';

export default class FunctionDemo extends LightningElement {
    num;
    result;

    getNumberHandler(event){
        console.log('inside Get Number Handler');
        this.num = event.target.value;
        console.log('Number is : ' + this.num);
        this.result = this.cubeRootCalculator(this.num);
    }


      cubeRootCalculator(number){
        console.log('inside cubeRootCalculator');
        
        return Math.cbrt(number)
    }


}