import { WordModel } from './../interfaces';
import fs from 'fs';
const pdf = require("pdf-creator-node");
// Read HTML Template
const options = { format: "A4", orientation: "portrait", border: "10mm" };

function createHtml(content: string) {
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
            `
}

function createDocument(html: string, path = "./output.pdf") {
      const document = {
            html,
            path,
            data: []
      };

      return document
}

function createLi(item: WordModel, keys?: string[]): string {
      const li =
            `
      <li >
            <h4>${item.word}</h4>
            <h5>${item.translation}</h5>
      </li>
      
      `

      return li
}

// function getKeys<T>(item: T, keys: string[]) {

// }
function createListForHtml(data: WordModel[], keys?: string[]): string {

      const listItems = data.map(item => createLi(item)).join('')

      const body =
            `<div>
                  <ol>
                        ${listItems}
                  </ol>
            </div>
            `

      return body
}

export const createPDFfromHTML = (dataToShowInPDF: WordModel[]) => {
      const html = createHtml(createListForHtml(dataToShowInPDF))
      const document = createDocument(html)

      return pdf.create(document, options)
            .then((res: string) => {
                  return res
            })
            .catch((error: string) => {
                  console.error(error)
            });


}