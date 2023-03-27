import * as vscode from 'vscode';
import * as helper from "../helpers";
import { HandlerAbstract } from './HandlerAbstract';

export class Php extends HandlerAbstract {

    handler(patch: string | undefined, extention: string | boolean | undefined): void {
        
        /** Verify if is PHP to process */
        if(extention === "php" ) {
            this.getPattern(patch, extention);
        }

        if(this.next) {
            return this.next.handler(patch, extention);
        }
            
    }

    /**
     * Get patterns PHP
     * @param patch 
     * @param extention 
     */
    async getPattern(patch: string | undefined, extention: string) {

        vscode.window.showInputBox({
            placeHolder: "ex: src\\Validate... (PSR4)",
            prompt: "Type your namespace here.",
            value: ""
          })
          .then(moduleName => {
               
                vscode.window.showInputBox({
                    placeHolder: "../../vendor/autoload.php",
                    prompt: "Put your autoload path to use ExampleUse.php",
                    value: "../../vendor/autoload.php"
                  })
                  .then(pathAutoload => {

                      
                        helper.copyPattern(patch, extention, moduleName, pathAutoload);
                        
                  });
            
            
          });
                  
    }
}