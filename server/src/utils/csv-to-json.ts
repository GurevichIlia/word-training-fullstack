// const csv = require('csvtojson')
import csvtojson from 'csvtojson'
import { afterCSV } from '../interfaces';

export class CSVtoJson {


      static async createJsonArray(file: any) {
            const csvFile = file
            console.log('CSV FILE', file)
            csvtojson()
                  .fromFile(csvFile)
                  // .then((jsonObj: any) => {
                  //       console.log(jsonObj);
                  //       /**
                  //        * [
                  //        * 	{a:"1", b:"2", c:"3"},
                  //        * 	{a:"4", b:"5". c:"6"}
                  //        * ]
                  //        */
                  // })

            const jsonArray = await csvtojson().fromFile(csvFile);
            return jsonArray 
          
      }

}