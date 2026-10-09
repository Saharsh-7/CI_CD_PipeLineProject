import { LightningElement } from 'lwc';

export default class CarousalDemo extends LightningElement {


    imageArray = [
        {   "id" : "1",
            "src" : "https://images.pexels.com/photos/39442944/pexels-photo-39442944.jpeg",
            "header" : "First Card",
            "description" : "First Card Description", 
            "alternative-text": "First card accessible description." , 
            "href" : "javascript:void(0);"
        }, 
        {
            "id" : "2", 
            "src" : "https://images.pexels.com/photos/40089620/pexels-photo-40089620.jpeg",
            "header" : "Second Card", 
            "description" : "Second Card Description",
            "alternative-text" : "Second card accssible description.",
            "href" : "javascript:void(0);"
        }, 
        {
            "id" : "3",
            "src" : "https://images.pexels.com/photos/39894669/pexels-photo-39894669.jpeg", 
            "header" : "Third Card",
            "description" : "Third Card Description",
            "href" : "javascript:void(0);"
        }
    ];
}