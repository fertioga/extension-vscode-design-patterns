import * as vscode from 'vscode';
import { TreeViewProvider } from "./treeViewProvider";

export function activate(context: vscode.ExtensionContext) {
	
	new TreeViewProvider().register(context);
}

export function deactivate() {}
