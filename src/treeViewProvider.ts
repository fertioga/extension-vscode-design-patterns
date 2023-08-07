
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as helper from './helpers';
import { Director } from './languages/Director';


export class TreeViewProvider implements vscode.TreeDataProvider<TreeItem> {
  
  private _onDidChangeTreeData: vscode.EventEmitter<undefined | void> = new vscode.EventEmitter<undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<undefined | void> = this._onDidChangeTreeData.event;

  data: TreeItem[] = [];
  pathClicked: string[] = [];

  constructor() {

    this.data =     
    [
      new TreeItem(
          'PHP', 'PHP', '',
            [ 
              new TreeItem('Behavioral','PHP/Behavioral', '', 
                          [ 
                            new TreeItem('ChainOfResponsability','PHP/Behavioral/ChainOfResponsability', '',
                            [
                              new TreeItem('Learn more','https://refactoring.guru/design-patterns/chain-of-responsibility','learn'),
                              new TreeItem('Apply','PHP/Behavioral/ChainOfResponsability','php')
                            ])
                          ]
                    ),
              new TreeItem('Creational','PHP/Creational', '',
                          []
                    ),
              new TreeItem('Structural','PHP/Structural', '',
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

    vscode.commands.registerCommand('designpatterns.refreshEntry', () => {
        this.refresh();
    });

    // create
    const tree = vscode.window.createTreeView('treePatterns', options);
    
    // setup: event when expand
    tree.onDidChangeSelection(e => {

        // validate if is the last one element
        if(e.selection[0].collapsibleState === 0) {

          /** if the last element == learn, need open the page with we can learn about that pattern */
          if(e.selection[0].contextValue, e.selection[0].description === 'learn') {  

             
              vscode.env.openExternal(vscode.Uri.parse(e.selection[0].contextValue || ""));

                   
          }
          
          /** Here is called the director when will validate wich pattern need be implementd */
          /** Call the Director to select handler will process the request */
          (new Director(e.selection[0].contextValue, e.selection[0].description)).run();
          
          // reset event to refresh the tree

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

  constructor(label: string, contextValue: string, description: string, children?: TreeItem[]) {
    super(
        label,       
        children === undefined ? vscode.TreeItemCollapsibleState.None :
                                 vscode.TreeItemCollapsibleState.Collapsed),
        this.description = description,
        this.contextValue = contextValue,
    this.children = children;
  }
}
