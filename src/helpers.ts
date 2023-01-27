import * as vscode from 'vscode';

var fs = require('fs');
var path = require('path');
var rootPath = __dirname + '/../src/stubs/';

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
export function copyFile( source: string, target: string, newExtention: string ): void {

    let targetFile = target;

    if ( fs.existsSync( target ) ) {
        
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
    
    /** takeout .stub and put newExtention variable */
    targetFile = changeExtentionFile(targetFile, newExtention);

    fs.writeFileSync(targetFile, fs.readFileSync(source));
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

/** Copy Folders Recursively with FIles 
 * @param source string (path source)
 * @param target string (path target)
 * @return void
*/
export function copyFolderRecursive( source: string, target: string | undefined, extention: string ): void {
    let files = [];
    let targetFolder = path.join( target, path.basename( source ) );

    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    if ( fs.lstatSync( source ).isDirectory() ) {

        files = fs.readdirSync( source );
        files.forEach( function ( file: string ) {

            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursive( curSource, targetFolder, extention ); // call recursive
            } else {
                copyFile( curSource, targetFolder, extention );
            }

        } );
    }
}
/**
 * 
 * @param patternClicked 
 * @return void
 */
export function copyPattern(patternClicked?: any, extention?: string|boolean): void {

    let ext: string = "";

    if(extention !== undefined) {
        ext = extention.toString();
    }        

    let source = rootPath + '/' + patternClicked;
		let target = getPatch();

    if(target === undefined) {
      vscode.window.showWarningMessage('Target not defined...');
    }
    
	copyFolderRecursive( source, target, ext);

    vscode.window.showInformationMessage('Copy Pattern: ' + patternClicked + ' To: ' + target || "");
  }

