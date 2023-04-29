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
                      
                        this.copyPattern(patch, extention, moduleName, pathAutoload);
                        
                  });
            
            
          });
                  
    }

    /**
     * Copy all folders and files from pattern
     * @param patternClicked 
     * @return void
     */
    async copyPattern(patternClicked?: any, extention?: string|boolean, moduleName?: string, pathAutoload?: string): Promise<void> {

        let ext: string = "";
        let modName: string = "";
        let pAutoload: string = "";

        if(extention !== undefined) {
            ext = extention.toString();
        }        

        if(moduleName !== undefined) {
            modName = moduleName.toString();
        }   
        
        if(pathAutoload !== undefined) {
            pAutoload = pathAutoload.toString();
        }   

        let source = helper.getRootPathStubs() + '/' + patternClicked;
        let target = helper.getPatch();

        if(target === undefined) {
            vscode.window.showWarningMessage('Target not defined...');
            return;
        }
        
        // copy all files and folders
        helper.copyFolderRecursive(source, target, ext, modName, pAutoload);

        // rename the principal folder to module name
        this.renamePrincipalFolder(target,source,modName);
            
        vscode.window.showInformationMessage('Pattern copy!');    
    }

    renamePrincipalFolder(target: string, source: string, modName: string) {
        let fs = helper.getFsInstance();
        let oldPath = target + source.split("/").pop();
        let newPath = target + modName.split("\\").pop();

        setTimeout(function(){
            fs.rename(oldPath,  newPath, function(err: any){
                if (err){
                    throw err;
                } 
                console.log('Arquivo renomeado!');
            });
        },2000);
    }
}