/** Template for all pages 
 * @param content string - Content of page
 * @return string
*/
export function page(content: string): string {
    return `
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

/** Page expecific to load some external link into iframe 
 * @param link string - link of webpage
 * @return string
*/
export function pageWithIframe(link: string) {

    return page(`
    <iframe style='border: none; position: fixed; top: 7%; left: 0; width: 100%; height: 100%;' src='${link}'></iframe>
    `);
}
