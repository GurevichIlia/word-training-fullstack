import { Conjugation } from './../interfaces';
import puppeteer from 'puppeteer'
// const puppeteer = require('puppeteer');
// (async () => {
//       const browser = await puppeteer.launch();
//       const page = await browser.newPage();

//       const SEARCH_INPUT = '.form-control.popup-keyboard-input.hebrew-input';
//       const SEARCH_BUTTON = '.btn.btn-primary'
//       const VERB_SEARCH_BTN = '.verb-search-button > .btn.btn-primary'

//       const FUTURE_I = 'div > .menukad'

//       await page.goto('https://www.pealim.com');
//       //   await page.waitForSelector(SEARCH_BUTTON);

//       await page.type(SEARCH_INPUT, 'ללכת')

//       await page.click(SEARCH_BUTTON);

//       await page.waitForNavigation()

//       await page.click(VERB_SEARCH_BTN)

//       await page.waitForSelector(FUTURE_I)

//       const results = await page.$(FUTURE_I);
//       const text: unknown[] = []
//       // await results.evaluate((element: ElementHandle) => {
//       //       element.textContent

//       //       text.push(element.textContent)
//       // });

//       console.log(text);

//       await page.screenshot({ path: 'example.png' });

//       await browser.close();
// })();

const block = '> div > div > .menukad'
const I = '#IMPF-1s'
const WE = '#IMPF-1p'
const YOU_MALE = '#IMPF-2ms'
const YOU_FEMALE = '#IMPF-2fs'
const YOU_PLURAL = '#IMPF-2mp'
const HE = '#IMPF-3ms'
const SHE = '#IMPF-3fs'
const THEY = '#IMPF-3mp'

const VERB_SEARCH_BTN = '.verb-search-button > .btn.btn-primary'
export class VerbParser {
      constructor(private verbs: string[]) { }

      parseVerbs(): Promise<Promise<unknown>[]> {
            return this.launchBrowser(this.verbs)
      }

      launchBrowser = async (words: string[]) => {
            const browser = await puppeteer.launch();

            const block = '> div > div > .menukad'
            const I = '#IMPF-1s'
            const WE = '#IMPF-1p'
            const YOU_MALE = '#IMPF-2ms'
            const YOU_FEMALE = '#IMPF-2fs'
            const YOU_PLURAL = '#IMPF-2mp'
            const HE = '#IMPF-3ms'
            const SHE = '#IMPF-3fs'
            const THEY = '#IMPF-3mp'

            const VERB_SEARCH_BTN = '.verb-search-button > .btn.btn-primary'

            const parseVerb = async (verb: string) => {
                  const page = await browser.newPage();
                  let timer = 0
                  await page.goto(`https://www.pealim.com/search/?q=${verb}`);

                  // Close modal with ads on web page.
                  // Ads do not allow access to elements on page
                  const interval = setInterval(async () => {
                        timer++
                        // console.log(timer)
                        if (timer > 10) {
                              await page.keyboard.down('Escape')

                              clearInterval(interval)
                        }

                        await page.keyboard.down('Escape')

                  }, 1000)


                  try {
                        await page.keyboard.down('Escape')
                        // await page.addStyleTag({ content: `iframe{display: none} .media{display: none}` })


                        await page.click(VERB_SEARCH_BTN)

                        await page.keyboard.down('Escape')
                        // await page.screenshot({ path: verb + 'example.png' });

                        await page.waitForSelector('#IMPF-1s')

                        const i = await page.$eval(I + block, (el: Element) => el.textContent)
                        const we = await page.$eval(WE + block, (el: Element) => el.textContent)
                        const you_male = await page.$eval(YOU_MALE + block, (el: Element) => el.textContent)
                        const you_female = await page.$eval(YOU_FEMALE + block, (el: Element) => el.textContent)
                        const you_plural = await page.$eval(YOU_PLURAL + block, (el: Element) => el.textContent)
                        const he = await page.$eval(HE + block, (el: Element) => el.textContent)
                        const she = await page.$eval(SHE + block, (el: Element) => el.textContent)
                        const they = await page.$eval(THEY + block, (el: Element) => el.textContent)

                        const conjugation: Conjugation = {
                              verb,
                              time: 'future',
                              i,
                              we,
                              you_male,
                              you_female,
                              you_plural,
                              he,
                              she,
                              they
                        }

                        clearInterval(interval)

                        return new Promise((resolve, reject) => {
                              resolve(conjugation)
                        })

                  } catch (error) {
                        // await browser.close()
                        clearInterval(interval)

                        console.log('ERROR IN PARSER', error)

                  }
            }

            const verbsAsPromise = []
            console.log('GETTING WORDS', words)
            for (let verb of words) {
                  await verbsAsPromise.push(await parseVerb(verb))
            }

            browser.close()

            return verbsAsPromise as Promise<unknown>[]

      }
}