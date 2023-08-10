
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as helper from './helpers';
import { Director } from './languages/Director';
import * as path from 'path';

export class TreeViewProvider implements vscode.TreeDataProvider<TreeItem> {
  
  private _onDidChangeTreeData: vscode.EventEmitter<undefined | void> = new vscode.EventEmitter<undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<undefined | void> = this._onDidChangeTreeData.event;

  data: TreeItem[] = [];
  pathClicked: string[] = [];

  iconLanguage = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'code.svg'),
    dark: path.join(__filename, '..', '..',  'resources', 'dark', 'code.svg')
  };

  iconLearn = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'book.svg'),
    dark: path.join(__filename, '..', '..',  'resources', 'dark', 'book.svg')
  };

  iconApply = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'fire.svg'),
    dark: path.join(__filename, '..', '..',  'resources', 'dark', 'fire.svg')
  };

  iconBehavioral = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'person.svg'),
    dark: path.join(__filename, '..', '..',  'resources', 'dark', 'person.svg')
  };

  iconCreational = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'pen.svg'),
    dark: path.join(__filename, '..', '..',  'resources', 'dark', 'pen.svg')
  };

  iconStructural = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'wall.svg'),
    dark: path.join(__filename, '..', '..',  'resources', 'dark', 'wall.svg')
  };

  constructor() {

    this.data =     
    [
      new TreeItem(
          this.iconLanguage, 'PHP', 'PHP', '',
            [               
              new TreeItem(this.iconBehavioral, 'Behavioral','PHP/Behavioral', '', 
                          [ 
                            new TreeItem("", 'ChainOfResponsability','PHP/Behavioral/ChainOfResponsability', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://refactoring.guru/design-patterns/chain-of-responsibility','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Behavioral/ChainOfResponsability','php')
                            ])
                          ]
                    ),
              new TreeItem(this.iconCreational, 'Creational','PHP/Creational', '',
                          [
                            new TreeItem("", 'Singleton','PHP/Creational/Singleton', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://refactoring.guru/design-patterns/singleton','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Creational/Singleton','php')
                            ])
                          ]
                    ),
              new TreeItem(this.iconStructural, 'Structural','PHP/Structural', '',
                          [
                            new TreeItem("", 'Proxy','PHP/Structural/Proxy', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://refactoring.guru/design-patterns/proxy','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Structural/Proxy','php')
                            ]),
                            new TreeItem("", 'Facade','PHP/Structural/Facade', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://refactoring.guru/design-patterns/facade','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Structural/Facade','php')
                            ])
                          ]
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

  constructor(
              icon: {
                light: string | vscode.Uri;
                dark: string | vscode.Uri;
              } | "", 
              label: string, 
              contextValue: string, 
              description: string, 
              children?: TreeItem[]) 
      {
    super(
        label,       
        children === undefined ? vscode.TreeItemCollapsibleState.None :
                                 vscode.TreeItemCollapsibleState.Collapsed),
        this.description = description,
        this.contextValue = contextValue,
        this.iconPath = icon,
    this.children = children;
  }
}
