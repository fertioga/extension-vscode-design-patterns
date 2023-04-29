import * as vscode from 'vscode';
import { TreeViewProvider } from "./treeViewProvider";
import * as helper from './helpers';

export function activate(context: vscode.ExtensionContext) {
	
	helper.pageWebViewIframe("https://refactoring.guru/design-patterns");
	new TreeViewProvider().register(context);
}

export function deactivate() {}  
