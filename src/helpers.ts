import * as vscode from 'vscode';
import * as webview from "./webviews";

const panel = vscode.window.createWebviewPanel("Design Pattern Plugin","Design Pattern Plugin",1);

var path = require('path');

export function getFsInstance() {
    return require('fs');
}

export function getRootPathStubs() {
    return __dirname + '/../stubs';
}

/** TODO: AQUI PRECISA REFATORAR PARA PEGAR O PATH A PARTIR DO DIRETORIO CLICADO E NÂO PELO ARQUIVO CLICADO
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

/** copy file and change extention file
 * @param source string (file source)
 * @param target string (file target)
 * @return void
*/
export function copyFile( source: string, target: string, newExtention: string): string {

    let fs = getFsInstance();
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
    let fs = getFsInstance();
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
 * Change Namespace to all files pattern select on param
 * @param pattern 
 * @param namespace 
 */
export async function writingInFilesToAdjustsInfos(file: string, namespace: string, pathAutoload: string ) {

    let fs = getFsInstance();
    
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

