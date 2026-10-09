import { LightningElement } from 'lwc';
import pictureDemo from '@salesforce/resourceUrl/pictureDemo';

export default class StaticResourceDemo extends LightningElement {
        imageArray = [
        {   "id" : "1",
            "src" :  "/pictureDemo/pexels-recep-kolcu-2161306727-39883034.jpg",
            "header" : "First Card",
            "description" : "First Card Description", 
            "alternative-text": "First card accessible description." , 
            "href" : "javascript:void(0);"
        }, 
        {
            "id" : "2", 
            "src" : "/pictureDemo/pexels-kassiamelox-40089620.jpg",
            "header" : "Second Card", 
            "description" : "Second Card Description",
            "alternative-text" : "Second card accssible description.",
            "href" : "javascript:void(0);"
        }, 
        {
            "id" : "3",
            "src" :   "/pictureDemo/pexels-imperioame-3720249.jpg", 
            "header" : "Third Card",
            "description" : "Third Card Description",
            "href" : "javascript:void(0);"
        }
    ];
}