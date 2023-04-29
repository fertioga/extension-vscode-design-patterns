import { Php } from './Php';
// import { Js } from './Js'; <-- example
// import { Python } from './Py'; <-- example
import { Js } from './Js';

export class Director {

    patch: string | undefined;
    extention: string | boolean | undefined;

    constructor(path: string | undefined, extention: string | boolean | undefined) {
        this.patch = path;
        this.extention = extention;        
    }
    /** Implement Chain of Responsability to choice which is the corret class to implement */
    run() {
        /** Example when we have anothes languages 
         * let getPattern = new Php(
         *                          new Js(
         *                                  new Python(undefined)
         *                              )
         *                          );
         * getPattern.handler(this.patch, this.extention);
         * 
         * Obs: The last one need put undefined in constructor
        */
       let getPattern = new Php(new Js(undefined));
       
       getPattern.handler(this.patch, this.extention);

    }

}