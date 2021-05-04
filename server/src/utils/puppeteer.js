const puppeteer = require('puppeteer');

const verbs = [
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
    'לבוא',
    'לטייל',
    'לשחק',
    'לשלם',
    'לבוא',
    'לטייל',
    'לשחק',
    'לשלם',
]





const launchBrowser = async (words) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

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

    const parseVerb = async (verb) => {
        let timer = 0
        await page.goto(`https://www.pealim.com/search/?q=${verb}`);

        // Close modal with ads on web page
        // ads do not allow access to elements on page
        const interval = setInterval(async () => {
            timer++
            console.log(timer)
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
            await page.screenshot({ path: verb + 'example.png' });

            await page.waitForSelector('#IMPF-1s')

            const i = await page.$eval(I + block, el => el.innerText)
            const we = await page.$eval(WE + block, el => el.innerText)
            const you_male = await page.$eval(YOU_MALE + block, el => el.innerText)
            const you_female = await page.$eval(YOU_FEMALE + block, el => el.innerText)
            const you_plural = await page.$eval(YOU_PLURAL + block, el => el.innerText)
            const he = await page.$eval(HE + block, el => el.innerText)
            const she = await page.$eval(SHE + block, el => el.innerText)
            const they = await page.$eval(THEY + block, el => el.innerText)

            const conjugation = {
                verb,
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
            console.log(error)
        }
    }

    const verbsAsPromise = []
    console.log('GETTING WORDS', words)
    for (let verb of words) {
        await verbsAsPromise.push(await parseVerb(verb))
    }

    browser.close()

    await Promise.all(verbsAsPromise).then(verb => {
        console.log('VERBs', verb)

    })

    // await browser.close()


};

