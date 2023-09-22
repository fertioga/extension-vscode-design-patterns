
import * as vscode from 'vscode';

const TITLE = "Design Pattern Plugin";

/** Template for all pages 
 * @param content string - Content of page
 * @return string
*/
export function page(content: string): void {

    const panel = vscode.window.createWebviewPanel(TITLE,TITLE,1);
	panel.webview.html = 
 `
	<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
            </head>
            <body>
            <div class="container text-center">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="alert alert-danger" role="alert">
                            Important: We aren't related with the website below. It is just a study indication.
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-12">
                        ${content}
                    </div>
                </div>              
            </div>
            </body>
	</html>`;
}


// export function pageWelcome() {

//     return page(welcome.default);

// }

export  function pageReadme() {

    const panel = vscode.window.createWebviewPanel(TITLE,TITLE,1);
	panel.webview.html = 
 `
	<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
            </head>
            <body style="background-color:#000000">
            <div class="container text-center">
                <div class="row">
                    <div class="col-sm-12">
                        <iframe src="https://marketplace.visualstudio.com/items?itemName=fertioga.design-patterns" width="100%" height="1000px"></iframe>
                    </div>
                </div>              
            </div>
            </body>
	</html>`;

}   
