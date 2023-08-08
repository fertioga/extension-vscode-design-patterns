import * as vscode from 'vscode';

const panel = vscode.window.createWebviewPanel("Design Pattern Plugin","Design Pattern Plugin",1);

var path = require('path');

export function getFsInstance() {
    return require('fs');
}

export function getRootPathStubs() {
    return __dirname + '/../stubs';
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

