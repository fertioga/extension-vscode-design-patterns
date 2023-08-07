import * as vscode from 'vscode';
import { TreeViewProvider } from "./treeViewProvider";
import * as webview from './webviews/webviews';

export function activate(context: vscode.ExtensionContext) {
	
	webview.pageWelcome();
	new TreeViewProvider().register(context);

}

export function deactivate() {}  
