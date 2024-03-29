import * as vscode from 'vscode';
import * as helper from "../helpers";
import { HandlerAbstract } from './HandlerAbstract';
var path = require('path');
export class Php extends HandlerAbstract {

    handler(path: string | undefined, extention: string | boolean | undefined): void {
        
        /** Verify if is PHP language */
        if(extention === "php" ) {
            this.askMoreInfos(path, extention);
        }

        if(this.next) {
            return this.next.handler(path, extention); // call next handler if not PHP language
        }            
    }

    /**
     * Get patterns PHP
     * @param path 
     * @param extention 
     */
    async askMoreInfos(path: string | undefined, extention: string) {

        vscode.window.showInputBox({
            placeHolder: "ex: src\\Validate... (PSR4)",
            prompt: "Type your namespace here.",
            value: "src\\YOUR_NAMESPACE"
          })
          .then(moduleName => {
               
                vscode.window.showInputBox({
                    placeHolder: "../../vendor/autoload.php",
                    prompt: "Put your autoload path to use UseCase.php",
                    value: "../../vendor/autoload.php"
                  })
                  .then(pathAutoload => {
                      
                        this.configurePattern(path, extention, moduleName, pathAutoload);
                        
                  });
          });     
    }

    /**
     * Copy all folders and files from pattern
     * @param patternClicked 
     * @return void
     */
    configurePattern(patternClicked?: any, extention?: string|boolean, moduleName?: string, pathAutoload?: string): void {

        let ext: string = "";
        let modName: string = "";
        let pAutoload: string = "";
        let target = undefined;

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

        // Open dialog to select folder to apply the pattern 
        vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select folder when you want apply the pattern'
        }).then(fileUri => {
            
            if (fileUri && fileUri[0]) {
    
                target = fileUri[0].fsPath;

                // copy all files and folders (looping recursive)
                this.copyFolderRecursive(source, target, ext, modName, pAutoload);

                // when is over, rename folder (using namespace as a param)
                this.renamePrincipalFolder(target, source, modName);

                const header = "Worked like a charm!";
                const options: vscode.MessageOptions = { detail: 'Run composer dump-autoload to recognize the new classes. \n\n And then, execute php UseCase.php file.', modal: true };
                vscode.window.showInformationMessage(header, options, ...["Ok"]).then((item)=>{

                    if(item !== undefined) {
                        
                        // refresh menu
                        vscode.commands.executeCommand('designpatterns.refreshEntry');

                        // uncollapsed treeview
                        vscode.commands.executeCommand('workbench.files.action.treeview.uncollapsed'); 

                        //vscode.commands.executeCommand('workbench.files.action.uncollapsedExplorerFolders');

                        // redirect to explorator crt + shift + e
                        vscode.commands.executeCommand('workbench.files.action.showActiveFileInExplorer');
                    } 
                    
                });
    
            }
        });
    }

    /** Copy Folders Recursively with FIles and change namespace
     * @param source string (path origin)
     * @param target string (path target)
     * @param extention string (extension files)
     * @param namespace string 
     * @param autoloadPath string 
     * @return void
    */
    copyFolderRecursive( source: string, target: string | undefined, extention: string, namespace: string, autoloadPath: string ): void {
        let files = [];
        let fs = helper.getFsInstance();
        let targetFolder = path.join( target, path.basename( source ) );

        if ( !fs.existsSync( targetFolder ) ) {
            fs.mkdirSync( targetFolder );
        }

        if ( fs.lstatSync( source ).isDirectory() ) {

            files = fs.readdirSync( source );

            files.forEach(  ( file: string, index: any, arr: any ) => {

                vscode.window.showInformationMessage(index);

                var curSource = path.join( source, file );

                /** if is directory, open the directory*/
                if ( fs.lstatSync( curSource ).isDirectory() ) {
                
                    this.copyFolderRecursive( curSource, targetFolder, extention, namespace, autoloadPath ); // call recursive
                
                } else {
                
                    // copy file to destination 
                    let targetPathFile =  helper.copyFile( curSource, targetFolder, extention);         
                    
                    // if is a file
                    if(! this.writingInFilesToAdjustsInfos(targetPathFile, namespace, autoloadPath)){
                        console.log("Error on change namespace");
                    }                    
                }

            } );
        }    
    }

    /**
     * Change Namespace to all files pattern select on param
     * @param pattern 
     * @param namespace 
     */
    async writingInFilesToAdjustsInfos(file: string, namespace: string, pathAutoload: string ) {

        let fs = helper.getFsInstance();
        
        let readFile = await fs.readFile(file, 'utf8', function (err: any,data: string) {        

            if (err) {
                console.log("writingInFilesToAdjustsInfos when Read" + err);
                return false;
            }

            // Replace string occurrences
            let updated =  data.replace(/YOUR_NAMESPACE/gi, namespace); // replace namespace
                updated = updated.replace(/AUTOLOAD_PATH/gi, pathAutoload); // replace path autoload.php

            let writeReplace = fs.writeFile(file, updated, 'utf-8', function (err: any) {
                if (err) {
                    console.log("writingInFilesToAdjustsInfos when Write" + err);
                    return false;
                }
            });

            fs.close(writeReplace);
            
        })(namespace);

        fs.close(readFile);

        return true;
    }

    renamePrincipalFolder(target: string, source: string, modName: string) {

        let fs = helper.getFsInstance();
        let oldPath = target + "/" + source.split("/").pop();
        let newPath = target + "/" + modName.split("\\").pop();

        setTimeout(function(){
            fs.rename(oldPath,  newPath, function(err: any){
                if (err){
                    throw err;
                } 
            });
        },2000);
    }
}