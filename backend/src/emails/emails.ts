import { MAIL_FROM } from "../config/base"

const keys = require('../config/keys')

export default class Emails {

      static forgotPassword(email: string) {
            return {
                  to: email,
                  from: MAIL_FROM,
                  subject: 'Login success',
                  html: `<h1>Login success</h1>`
            }


      }
}