
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as helper from './helpers';
import { Director } from './languages/Director';
import * as path from 'path';
import * as webview from './webviews/webviews';

export class TreeViewProvider implements vscode.TreeDataProvider<TreeItem> {
  
  private _onDidChangeTreeData: vscode.EventEmitter<undefined | void> = new vscode.EventEmitter<undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<undefined | void> = this._onDidChangeTreeData.event;

  data: TreeItem[] = [];
  pathClicked: string[] = [];
  
  iconQuestion = {
    light: this.getPathReources('question.svg','light'),
    dark:  this.getPathReources('question.svg','dark')
  };

  iconLanguage = {
    light: this.getPathReources('code.svg','light'),
    dark:  this.getPathReources('code.svg','dark')
  };

  iconLearn = {
    light: this.getPathReources('book.svg','light'),
    dark:  this.getPathReources('book.svg','dark')
  };

  iconApply = {
    light: this.getPathReources('fire.svg','light'),
    dark:  this.getPathReources('fire.svg','dark')
  };

  iconBehavioral = {
    light: this.getPathReources('person.svg','light'),
    dark:  this.getPathReources('person.svg','dark')
  };

  iconCreational = {
    light: this.getPathReources('pen.svg','light'),
    dark:  this.getPathReources('pen.svg','dark')
  };

  iconStructural = {
    light: this.getPathReources('wall.svg','light'),
    dark:  this.getPathReources('wall.svg','dark')
  };

  constructor() {

    this.data =     
    [
      new TreeItem(this.iconQuestion, 'How it works?','', '',
      [
        new TreeItem('', '1 - Select your Language','', '',) ,
        new TreeItem('', '2 - Select the Pattern','', '',) ,
        new TreeItem('', '3 - Click in Apply','', '',) ,
        new TreeItem('', '4 - Choose the path where you want apply','', '',),
        new TreeItem('', '5 - Learn, change and use!','', '',),
        new TreeItem('', 'Readme','', 'readme',) 
      ]
       
      ),
      new TreeItem(
          this.iconLanguage, 'PHP', 'PHP', '',
            [ 
              new TreeItem(this.iconCreational, 'Creational','PHP/Creational', '',
                          [
                            new TreeItem("", 'AbstractFactory','PHP/Creational/AbstractFactory', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://fernando-franca.tec.br/d3v/plugins/vs-code/design-patterns/abstract-factory/','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Creational/AbstractFactory','php')
                            ]),
                            new TreeItem("", 'Builder','PHP/Creational/Builder', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://fernando-franca.tec.br/d3v/plugins/vs-code/design-patterns/builder/','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Creational/Builder','php')
                            ]),
                            new TreeItem("", 'Factory','PHP/Creational/Factory', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://fernando-franca.tec.br/d3v/plugins/vs-code/design-patterns/factory/','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Creational/Factory','php')
                            ]),
                            new TreeItem("", 'Prototype','PHP/Creational/Prototype', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://fernando-franca.tec.br/d3v/plugins/vs-code/design-patterns/prototype/','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Creational/Prototype','php')
                            ]),
                            new TreeItem("", 'Singleton','PHP/Creational/Singleton', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://fernando-franca.tec.br/d3v/plugins/vs-code/design-patterns/singleton/','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Creational/Singleton','php')
                            ])
                          ]
                ),

                new TreeItem(this.iconStructural, 'Structural','PHP/Structural', '',
                          [
                            new TreeItem("", 'Adapter','PHP/Structural/Adapter', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://fernando-franca.tec.br/d3v/plugins/vs-code/design-patterns/adapter/','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Structural/Adapter','php')
                            ]),
                            new TreeItem("", 'Facade','PHP/Structural/Facade', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://fernando-franca.tec.br/d3v/plugins/vs-code/design-patterns/facade/','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Structural/Facade','php')
                            ]),
                            new TreeItem("", 'Proxy','PHP/Structural/Proxy', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://fernando-franca.tec.br/d3v/plugins/vs-code/design-patterns/proxy/','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Structural/Proxy','php')
                            ]),
                            
                            
                          ]
                ),

              new TreeItem(this.iconBehavioral, 'Behavioral','PHP/Behavioral', '', 
                          [ 
                            new TreeItem('', 'ChainOfResponsability','PHP/Behavioral/ChainOfResponsability', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://fernando-franca.tec.br/d3v/plugins/vs-code/design-patterns/chain-of-responsibility/','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Behavioral/ChainOfResponsability','php')
                            ]),
                            new TreeItem('', 'Observer','PHP/Behavioral/Observer', '',
                            [
                              new TreeItem(this.iconLearn, 'Learn more','https://fernando-franca.tec.br/d3v/plugins/vs-code/design-patterns/observer/','learn'),
                              new TreeItem(this.iconApply, 'Apply','PHP/Behavioral/Observer','php')
                            ])
                          ]
                )
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

          /** Open Readme page */
          if(e.selection[0].contextValue, e.selection[0].description === 'readme') {

            webview.pageReadme();
            
          }

          /** Here is calling the director when will validate wich pattern need be implementd */
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

  getPathReources( fileName: string, theme: string): string {
    return path.join(__filename, '..', '..', 'resources', theme, fileName);
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
              children?: TreeItem[]
              ) 
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
