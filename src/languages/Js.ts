import * as vscode from 'vscode';
import * as helper from "../helpers";
import { HandlerAbstract } from './HandlerAbstract';

export class Js extends HandlerAbstract {

    handler(patch: string, extention: string): void {
        
        /** Verify if is TS language */
        if(extention === "ts" ) {
            vscode.window.showInformationMessage("JAVASCRIPT");
        }

        if(this.next) {
            return this.next.handler(patch, extention);
        }
            
    }   

    async configurePattern(patternClicked?: any, extention?: string|boolean, moduleName?: string, pathAutoload?: string): Promise<void> {


    }
}