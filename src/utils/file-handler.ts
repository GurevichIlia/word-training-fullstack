import fs from 'fs'

export class FileHandler {

      deleteFile(filePath: string) {
            fs.unlink(filePath, function (err) {
                  if (err) {
                        throw err
                  } else {
                        console.log("Successfully deleted the file.")
                  }
            })
      }
}