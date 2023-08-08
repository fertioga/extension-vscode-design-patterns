import * as vscode from 'vscode';
import { TreeViewProvider } from "./treeViewProvider";
import * as webview from './webviews/webviews';
import * as helpers from './helpers';

export function activate(context: vscode.ExtensionContext) {
	
	//helpers.getPatch();

	webview.pageWelcome();
	new TreeViewProvider().register(context);

}

export function deactivate() {}  
