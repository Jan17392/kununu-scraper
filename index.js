import request from 'request'
import cheerio from 'cheerio'
import moment from 'moment'
import fs from 'fs'
import { Promise } from 'bluebird'

let kununuBaseprint = [
  'Firma',
  'Branche',
  'Gesamtbewertung',
  'Empfehlung',
  'Anzahl Bewertungen',
  'Arbeitsatmosphäre',
  'Vorgesetztenverhalten',
  'Kollegenzusammenhalt',
  'Interessante Aufgaben',
  'Kommunikation',
  'Arbeitsbedingungen',
  'Umwelt- / Sozialbewusstsein',
  'Work-Life-Balance',
  'Gleichberechtigung',
  'Umgang mit älteren Kollegen',
  'Karriere / Weiterbildung',
  'Gehalt / Sozialleistungen',
  'Image'
]


const scrapeKununuPage = (rawCompanyName) => {
  return new Promise(function(resolve, reject){
    request('https://www.kununu.com/de/' + rawCompanyName + '/kommentare', function(error, response, body) {
      if(!error && typeof body !== 'undefined'){
        let $ = cheerio.load(body);

        let excelRow = ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
        let companyName = $('.company-name').text().trim()
        let industry = $('.company-profile-sub-title').children().last().text().trim()
        let totalScore = $('.review-rating-value').text().trim()
        let recommendationScore = $('.review-recommend-value').text().trim()
        let numberOfReviews = $('.company-profile-subnav').find('.title-number').first().text().trim()

        excelRow[0] = typeof companyName !== 'undefined' ? companyName : rawCompanyName
        excelRow[1] = typeof industry !== 'undefined' ? industry : '-'
        excelRow[2] = typeof totalScore !== 'undefined' ? totalScore.replace(',', '.') : '-'
        excelRow[3] = typeof recommendationScore !== 'undefined' ? recommendationScore : '-'
        excelRow[4] = typeof numberOfReviews !== 'undefined' ? numberOfReviews : '-'


        $('.company-profile-rating-group').find('.rating-group').each(function( index ) {
          let ratingTitle = $(this).find('.rating-title').text().trim()
          let ratingValue = $(this).find('.rating-badge').text().trim()
          let excelRowIndex = kununuBaseprint.indexOf(ratingTitle)

          if(typeof ratingValue !== 'undefined' && excelRowIndex !== -1){
            excelRow[excelRowIndex] = ratingValue.replace(',', '.')
          }
        })

        resolve(excelRow)
      }else{
        reject()
      }
    })
  })
}

fs.writeFile('./excelFile.csv', kununuBaseprint + '\n', function(err) {
  if(err) {
    return console.log(err)
  }
    console.log("Excel file created!")
})

let rawCompanyNames = ['movinga', 'trumpf', 'bmw']

for(let rawCompanyName in rawCompanyNames){
  let currentCompanyName = rawCompanyNames[rawCompanyName]

  scrapeKununuPage(currentCompanyName)
  .then(result => {
    fs.appendFile('./excelFile.csv', result + '\n', function(err) {
      if(err) {
        return console.log(err)
      }
      console.log(currentCompanyName + " was written to excel file!")
    })
  })
  .catch(err => {
    console.log(err)
  })
}
