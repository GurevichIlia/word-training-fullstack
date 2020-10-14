"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdf = require("pdf-creator-node");
// Read HTML Template
const options = { format: "A4", orientation: "portrait", border: "10mm" };
function createHtml(content) {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                  <mate charest="utf-8" />
                  <title>Hello world!</title>
            </head>
            <body>
                 ${content}
            </body>
            </html>
            `;
}
function createDocument(html, path = "./output.pdf") {
    const document = {
        html,
        path,
        data: []
    };
    return document;
}
function createLi(item, keys) {
    const li = `
      <li >
            <h4>${item.word}</h4>
            <h5>${item.translation}</h5>
      </li>
      
      `;
    return li;
}
// function getKeys<T>(item: T, keys: string[]) {
// }
function createListForHtml(data, keys) {
    const listItems = data.map(item => createLi(item)).join('');
    const body = `<div>
                  <ol>
                        ${listItems}
                  </ol>
            </div>
            `;
    return body;
}
exports.createPDFfromHTML = (dataToShowInPDF) => {
    const html = createHtml(createListForHtml(dataToShowInPDF));
    const document = createDocument(html);
    return pdf.create(document, options)
        .then((res) => {
        return res;
    })
        .catch((error) => {
        console.error(error);
    });
};
//# sourceMappingURL=create-pdf.js.map