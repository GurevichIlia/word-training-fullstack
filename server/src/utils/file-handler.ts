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

      pathToSave(): string {
            return process.env.NODE_ENV === 'production' ? '/tmp' : './tmp/'
      }
}