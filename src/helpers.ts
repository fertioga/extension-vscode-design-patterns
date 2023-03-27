import * as vscode from 'vscode';
import * as webview from "./webviews";

var fs = require('fs');
var path = require('path');
var rootPath = __dirname + '/../stubs';
const panel = vscode.window.createWebviewPanel("Design Pattern Plugin","Design Pattern Plugin",1);

/**
 * Show input box info
 * @param value 
 * @param placeHolder 
 * @returns 
 */
// export async function showInputBox(value: string, placeHolder: string) {
// 	const result = await vscode.window.showInputBox({
// 		value: value,
// 		placeHolder: placeHolder,
// 		// validateInput: text => {
// 		// 	vscode.window.showInformationMessage(`Validating: ${text}`);
// 		// 	return text === '123' ? 'Not 123!' : null;
// 		// }
// 	});

// 	vscode.window.showInformationMessage(`Selected: ${result}`);

// 	return result;
// }

/** 
 * get path to apply the pattern
 * @return string | undefined
 */
export function getPatch(): string | undefined {
    
    let pathStringWithFile = vscode.window.activeTextEditor?.document.uri.toString();

    let pathArrayWithFile = pathStringWithFile?.split("/");

    let file = pathArrayWithFile?.[pathArrayWithFile.length - 1];

    let returnPatch = undefined;

    if (file !== undefined) {

        let pathWithoutFile =  pathStringWithFile?.replace(file.toString(), '');
        pathWithoutFile =  pathWithoutFile?.replace('file://'.toString(), '');

        returnPatch = pathWithoutFile;
    }

    return returnPatch;	
}

/** copy file 
 * @param source string (file source)
 * @param target string (file target)
 * @return void
*/
export function copyFile( source: string, target: string, newExtention: string): string {

    let targetFile = target;

    if ( fs.existsSync( target ) ) {
        
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
    
    /** takeout .stub and put newExtention variable */
    targetFile = changeExtentionFile(targetFile, newExtention);

    if ( !fs.existsSync(targetFile) ) {
    
        fs.writeFileSync(targetFile, fs.readFileSync(source));        
    
    }    

    return targetFile;
}

/**
 * changeExtentionFile - replace .stub to newExtenion param
 * @param targerFile string
 * @param newExtention string
 * @returns string
 */
function changeExtentionFile(targerFile: string, newExtention: string): string {
    
    return targerFile.replace('stub', newExtention);
}

/** Copy Folders Recursively with FIles and change namespace
 * @param source string (path source)
 * @param target string (path target)
 * @return void
*/
export function copyFolderRecursive( source: string, target: string | undefined, extention: string, moduleName: string, pathAutoload: string ): void {
    let files = [];

    let targetFolder = path.join( target, path.basename( source ) );

    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    if ( fs.lstatSync( source ).isDirectory() ) {

        files = fs.readdirSync( source );

        files.forEach( function ( file: string, index: any, arr: any ) {

            vscode.window.showInformationMessage(index);

            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursive( curSource, targetFolder, extention, moduleName, pathAutoload ); // call recursive
            } else {
            
            // copy file to destination 
            let targetPathFile =  copyFile( curSource, targetFolder, extention);         
            
            // change namespace and path autoload
            if(!writingInFilesToAdjustsInfos(targetPathFile, moduleName, pathAutoload)){
                console.log("Error on change namespace");
            }
                
            }

        } );
    }    
}

/**
 * Copy all folders and files from pattern
 * @param patternClicked 
 * @return void
 */
export async function copyPattern(patternClicked?: any, extention?: string|boolean, moduleName?: string, pathAutoload?: string): Promise<void> {

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

    let source = rootPath + '/' + patternClicked;
        let target = getPatch();

    if(target === undefined) {
        vscode.window.showWarningMessage('Target not defined...');
        return;
    }
    
    // copy all files and folders
    copyFolderRecursive(source, target, ext, modName, pAutoload);

    // rename the principal folder to module name
    renamePrincipalFolder(target,source,modName);
           
    vscode.window.showInformationMessage('Pattern copy!');    
}

function renamePrincipalFolder(target: string, source: string, modName: string) {

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

/**
 * Change Namespace to all files pattern select on param
 * @param pattern 
 * @param namespace 
 */
export async function writingInFilesToAdjustsInfos(file: string, namespace: string, pathAutoload: string ) {

    let readFile = await fs.readFile(file, 'utf8', function (err: any,data: string) {

        if (err) {
            console.log("changeNamespaceFile when Read" + err);
            return false;
        }

        // Replace string occurrences
        let updated =  data.replace(/YOUR_NAMESPACE/gi, namespace); // replace namespace
            updated = updated.replace(/AUTOLOAD_PATH/gi, pathAutoload); // replace path autoload.php

        let writeReplace = fs.writeFile(file, updated, 'utf-8', function (err: any) {
            if (err) {
                console.log("changeNamespaceFile when Write" + err);
                return false;
            }
        });

        fs.close(writeReplace);
        
    })(namespace);

    fs.close(readFile);

    return true;
}

/**
 * Create page view
 * @param content 
 */
export function pageWebView(content: any) {

    panel.webview.html = webview.page(content);

}

/**
 * Create a page view with a Iframe
 * @param link 
 */
export function pageWebViewIframe(link: any) {

    panel.webview.html = webview.pageWithIframe(link);

}

