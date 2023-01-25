
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as helper from './helpers';

export class TreeViewProvider implements vscode.TreeDataProvider<TreeItem> {
  
  private _onDidChangeTreeData: vscode.EventEmitter<undefined | void> = new vscode.EventEmitter<undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<undefined | void> = this._onDidChangeTreeData.event;

  data: TreeItem[] = [];
  pathClicked: string[] = [];

  constructor() {

    this.data =     
    [
      new TreeItem(
          'PHP', 'PHP',
            [ 
              new TreeItem('Behavioal','PHP/Behavioal', 
                          [ 
                            new TreeItem('ChainOfResponsability','PHP/Behavioal/ChainOfResponsability')
                          ]
                    ),
              new TreeItem('Creational','PHP/Creational', 
                          []
                    ),
              new TreeItem('Structural','PHP/Structural', 
                          []
                    ),
            ]
      )
    ];
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  public register(context: vscode.ExtensionContext): any {
    // setup
    const options = {
        treeDataProvider: this,
        showCollapseAll: true
    };

    // build
    vscode.window.registerTreeDataProvider('treePatterns', this);

    vscode.commands.registerCommand('Update-TreeView', () => {
        this.refresh();
    });

    // create
    const tree = vscode.window.createTreeView('treePatterns', options);
    
    // setup: event when expand
    tree.onDidChangeSelection(e => {

        // validate if is the last one element
        if(e.selection[0].collapsibleState === 0) {
          helper.copyPattern(e.selection[0].contextValue);
        }

    });

    // subscribe
    context.subscriptions.push(tree);
  } 

  getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }

  listFolders( path: string ): any {

    let directory: string [] = [];

      if ( fs.lstatSync( path ).isDirectory() ) {

        directory = fs.readdirSync( path );
        
      }

      return directory;
  }

}

class TreeItem extends vscode.TreeItem {
  children: TreeItem[]|undefined;

  constructor(label: string, contextValue: string, children?: TreeItem[]) {
    super(
        label,
        
        children === undefined ? vscode.TreeItemCollapsibleState.None :
                                 vscode.TreeItemCollapsibleState.Collapsed),
        this.contextValue = contextValue,
    this.children = children;
  }
}
