import { Conjugation, PresentConjugation, VerbTime, VerbWithConjugations } from './../interfaces';
import puppeteer from 'puppeteer'

const verbss = [
      'לבוא',
      'לטייל',
      'לשחק',
      'לשלם',
      'לבוא',
      'לטייל',
      'לשחק',
      'לשלם',
      'לבוא',
      'לטייל',
      'לשחק',
      'לשלם',
      'לבוא',
      'לטייל',
      'לשחק',
      'לשלם',
      // 'לבוא',
      // 'לטייל',
      // 'לשחק',
      // 'לשלם',
      // 'לבוא',
      // 'לטייל',
      // 'לשחק',
      // 'לשלם',
]

const block = '> div > div > .menukad'
const I = '1s'
const WE = '1p'
const YOU_MALE = '2ms'
const YOU_FEMALE = '2fs'
const YOU_PLURAL = '2mp'
const HE = '3ms'
const SHE = '3fs'
const THEY = '3mp'

const VERB_SEARCH_BTN = '.verb-search-button > .btn.btn-primary'
export class VerbParser {
      constructor(
            private verbs: string[],
            private verbTime: VerbTime[]
      ) { }

      parseVerbs() {
            return this.launchBrowser(this.verbs)
      }

      launchBrowser = async (words: string[]) => {
            const browser = await puppeteer.launch({
                  userDataDir: './data',
                  // headless: false,
                  timeout: 45000,
                  args: ['--no-sandbox', '--disable-setuid-sandbox']
            })
            // setTimeout(() => {
            //       console.log('before close in set time out', browser.isConnected())
            //       browser.close().then(_ => console.log('Browser close by timeout', browser.isConnected()))
            // }, 60_000)
            const block = ' > div:nth-child(1) > div:nth-child(1) > span'
            const FUTURE = '#IMPF-'
            const PAST = '#PERF-'
            const PRESENT = '#AP-'

            const I = '1s'
            const WE = '1p'
            const YOU_MALE = '2ms'
            const YOU_FEMALE = '2fs'
            const YOU_PLURAL = '2mp'
            const YOU_PLURAL_PAST = '2fp'
            const HE = '3ms'
            const SHE = '3fs'
            const THEY = '3mp'
            const THEY_PAST = '3p'

            const SINGULAR_MAN = 'ms'
            const SINGULAR_FEM = 'fs'
            const PLURAL_MAN = 'mp'
            const PLURAL_FEM = 'fp'

            // const VERB_SEARCH_BTN = '.verb-search-button > .btn.btn-primary'
            const VERB_SEARCH_BTN = "body > div > div.container > div.results-by-verb > div:nth-child(2) > div.verb-search-data > div.verb-search-button > a"

            const parseVerb = async (verb: string): Promise<VerbWithConjugations | null> => {

                  // await page.screenshot({ path: verb + 'example.png' });

                  // page.waitForTimeout(3000)

                  console.log('redirected to site')
                  // await page.screenshot({ path: verb + 'example.png' });

                  // Close modal with ads on web page.
                  // Ads do not allow access to elements on page
                  // const interval = setInterval(async () => {
                  // timer++
                  // console.log(timer)
                  // if (timer > 10) {
                  //       await page.keyboard.down('Escape')

                  //       clearInterval(interval)
                  // }

                  // await page.keyboard.down('Escape')

                  // }, 1000)


                  try {

                        const page = await browser.newPage();

                        console.log('try to redirect to', `https://www.pealim.com/search/?q=${verb}`)

                        await page.goto(`https://www.pealim.com/search/?q=${verb}`);

                        await page.keyboard.down('Escape')
                        // await page.addStyleTag({ content: `iframe{display: none} .media{display: none}` })
                        console.log('try block after start')
                        await page.$eval(VERB_SEARCH_BTN, (el: Element) => console.log('BTN', el))
                        // console.log('BTN', btn)
                        // await page.waitForTimeout(3000)

                        await page.waitForSelector(VERB_SEARCH_BTN, { timeout: 2000 })
                        await page.$eval('body > div > div.container > div.results-by-verb > div:nth-child(2) > div.verb-search-data > div.verb-search-button > a', () => {
                              const aEl = document.querySelector('body > div > div.container > div.results-by-verb > div:nth-child(2) > div.verb-search-data > div.verb-search-button > a') as HTMLButtonElement
                              aEl.click()
                        })

                        // await page.click(VERB_SEARCH_BTN, { clickCount: 3, delay: 500 })
                        console.log('after click search')
                        // await page.screenshot({ path: verb + 'example.png' });

                        await page.waitForSelector('#IMPF-1s', { timeout: 4000, visible: true }).then(e => {
                              console.log('waiting for #IMPF-1s')
                              if (!e) {

                                    page.click(VERB_SEARCH_BTN, { clickCount: 3, delay: 500 })
                              }
                        })


                        const verbWithConjugation: VerbWithConjugations = await getVerbWithConjugation(page, verb, this.verbTime)

                        page.close().then(res => {
                              console.log('isCLOSED', page.isClosed())
                        })

                        const verbWithConjugationsAsPromise = new Promise<VerbWithConjugations>((resolve, reject) => resolve(verbWithConjugation))

                        return verbWithConjugationsAsPromise

                  } catch (error) {
                        console.log('ERROR IN PARSER', error)
                        return new Promise<null>((resolve, reject) => resolve(null))
                        // throw new Error('ERROR IN PARSER');
                  }
            }

            const getVerbWithConjugation = async (page: puppeteer.Page, verb: string, verbTimes: VerbTime[]): Promise<VerbWithConjugations> => {
                  const verbWithConjugation: VerbWithConjugations = {} as VerbWithConjugations



                  for await (const time of verbTimes) {
                        console.log('TIME', time)
                        if (time === 'present') {
                              const singularMan = await page.$eval(PRESENT + SINGULAR_MAN + block, (el: Element) => el.textContent as string)
                              const singularFem = await page.$eval(PRESENT + SINGULAR_FEM + block, (el: Element) => el.textContent as string)
                              const pluralMan = await page.$eval(PRESENT + PLURAL_MAN + block, (el: Element) => el.textContent as string)
                              const pluralFem = await page.$eval(PRESENT + PLURAL_FEM + block, (el: Element) => el.textContent as string)


                              const conjugation: PresentConjugation = {
                                    time,
                                    singularMan,
                                    singularFem,
                                    pluralMan,
                                    pluralFem,
                              }

                              verbWithConjugation.verb = verb
                              verbWithConjugation[time] = conjugation as PresentConjugation;

                        } else {
                              const CURRENT_TIME = time === 'future' ? FUTURE : time === 'past' ? PAST : null

                              if (!CURRENT_TIME) break;

                              const i = await page.$eval(CURRENT_TIME + I + block, (el: Element) => el.textContent as string)
                              const we = await page.$eval(CURRENT_TIME + WE + block, (el: Element) => el.textContent as string)
                              const you_male = await page.$eval(CURRENT_TIME + YOU_MALE + block, (el: Element) => el.textContent as string)
                              const you_female = await page.$eval(CURRENT_TIME + YOU_FEMALE + block, (el: Element) => el.textContent as string)
                              const you_plural = await page.$eval(CURRENT_TIME + YOU_PLURAL + block, (el: Element) => el.textContent as string)
                              const he = await page.$eval(CURRENT_TIME + HE + block, (el: Element) => el.textContent as string)
                              const she = await page.$eval(CURRENT_TIME + SHE + block, (el: Element) => el.textContent as string)
                              const they = await page.$eval(CURRENT_TIME + (time === 'future' ? THEY : THEY_PAST) + block, (el: Element) => el.textContent as string)
                              const you_plural_past = await page.$eval(CURRENT_TIME + YOU_PLURAL_PAST + block, (el: Element) => el.textContent as string)

                              const conjugation: Conjugation = {
                                    verb,
                                    time,
                                    i,
                                    we,
                                    you_male,
                                    you_female,
                                    you_plural: time === 'future' ? you_plural : `${you_plural}/${you_plural_past}`,
                                    he,
                                    she,
                                    they: they
                              }

                              verbWithConjugation.verb = verb
                              verbWithConjugation[time] = conjugation
                        }


                  }

                  return Promise.resolve(verbWithConjugation)
            }

            const verbsAsPromise: VerbWithConjugations[] = []
            for (let verb of words) {
                  const verbWithConjugations = await parseVerb(verb)
                  // console.log('VERB WITH CONJUGaTIONS', verbWithConjugations)
                  if (verbWithConjugations && verbWithConjugations.verb) {
                        await verbsAsPromise.push(verbWithConjugations)
                  }

            }

            // browser.close().then(_ => console.log('Browser close in the end'))


            return { verbsAsPromise, browser } as { verbsAsPromise: VerbWithConjugations[], browser: puppeteer.Browser }

      }
}