const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const baseUrl = 'https://www.bestwordlist.com'
const startingPath = '/allwords.htm'
const allWords = {/* a: [...], b: [...], c: [...], ... */}


/*
  List of words:
    document.querySelectorAll('.tp')[1]
      .querySelectorAll('p')[3]

  Last page (links):
    document.querySelectorAll('.tp')[1]
      .querySelectorAll('p')[4]
      .querySelectorAll('a') // textContent of the last link
*/

let nextPage = 2
let lastPage = null
scrapePage(`${baseUrl}${startingPath}`)

function scrapePage(url) {
  axios(url).then(res => {
    const nextUrl = `${baseUrl}/allwordspage${nextPage}.htm`
    const html = res.data;
    const $ = cheerio.load(html)
    let words = $($($('.tp')[1]).find('p')[nextPage > 2 ? 4 : 3]).text().toLowerCase()
    const currentLetter = words[0]
    words = words.split(' ')

    // Only once.
    if (lastPage === null) {
      lastPage = Number($($($($('.tp')[1]).find('p'))[4]).find('a').last().text())
      console.log('Calculated last page:', lastPage)
    }

    // Store the words in our object. The page may have words from different letters.
    words.forEach(word => {
      const letter = word[0]
      if (allWords[letter]) {
        allWords[letter].push(word)
      } else {
        allWords[letter] = [word]
      }
    })

    const time = nextPage % 10 === 0 ? 3000 : Math.random() < .5 ? 1200 : 1000
    fs.writeFileSync('all-words.json', JSON.stringify(allWords))
    console.log(`Page ${nextPage - 1} of ${lastPage} scraped | ${currentLetter} | <${time}>`)

    if (nextPage === lastPage + 1) {
      console.log('WORD LIST SCRAPE COMPLETE!!!')
      process.exit()
    }

    nextPage++
    setTimeout(() => {
      scrapePage(nextUrl)
    }, time)
  })
  .catch(e => console.log('OH NO!', e))
}
