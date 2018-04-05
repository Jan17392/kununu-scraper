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
  'Image',
  'workhours',
  'homeoffice',
  'cafeteria',
  'food',
  'childcare',
  'pension',
  'accessibility',
  'fitness',
  'medic',
  'coaching',
  'parking',
  'transportation',
  'discount',
  'car',
  'phone',
  'shares',
  'events',
  'internet',
  'dogs'
]


const scrapeKununuPage = (rawCompanyName) => {
  return new Promise(function(resolve, reject){
    request('https://www.kununu.com/de/' + rawCompanyName + '/kommentare', function(error, response, body) {
      if(!error && typeof body !== 'undefined'){
        let $ = cheerio.load(body);

        let excelRow = ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
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

        //console.log(body)
        let workhours = typeof $('.benefit-workhours').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-workhours').text().trim().split(' bei ')[1]).split(' ')[0]
        let homeoffice = typeof $('.benefit-homeoffice').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-homeoffice').text().trim().split(' bei ')[1]).split(' ')[0]
        let cafeteria = typeof $('.benefit-cafeteria').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-cafeteria').text().trim().split(' bei ')[1]).split(' ')[0]
        let food = typeof $('.benefit-food').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-food').text().trim().split(' bei ')[1]).split(' ')[0]
        let childcare = typeof $('.benefit-childcare').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-childcare').text().trim().split(' bei ')[1]).split(' ')[0]
        let pension = typeof $('.benefit-401k').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-401k').text().trim().split(' bei ')[1]).split(' ')[0]
        let accessibility = typeof $('.benefit-accessibility').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-accessibility').text().trim().split(' bei ')[1]).split(' ')[0]
        let fitness = typeof $('.benefit-fitness').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-fitness').text().trim().split(' bei ')[1]).split(' ')[0]
        let medic = typeof $('.benefit-medic').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-medic').text().trim().split(' bei ')[1]).split(' ')[0]
        let coaching = typeof $('.benefit-coaching').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-coaching').text().trim().split(' bei ')[1]).split(' ')[0]
        let parking = typeof $('.benefit-parking').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-parking').text().trim().split(' bei ')[1]).split(' ')[0]
        let transportation = typeof $('.benefit-transportation').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-transportation').text().trim().split(' bei ')[1]).split(' ')[0]
        let discount = typeof $('.benefit-discount').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-discount').text().trim().split(' bei ')[1]).split(' ')[0]
        let car = typeof $('.benefit-car').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-car').text().trim().split(' bei ')[1]).split(' ')[0]
        let phone = typeof $('.benefit-phone').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-phone').text().trim().split(' bei ')[1]).split(' ')[0]
        let shares = typeof $('.benefit-shares').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-shares').text().trim().split(' bei ')[1]).split(' ')[0]
        let events = typeof $('.benefit-events').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-events').text().trim().split(' bei ')[1]).split(' ')[0]
        let internet = typeof $('.benefit-internet').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-internet').text().trim().split(' bei ')[1]).split(' ')[0]
        let dogs = typeof $('.benefit-dogs').text().trim().split(' bei ')[1] === 'undefined' ? 0 : ($('.benefit-dogs').text().trim().split(' bei ')[1]).split(' ')[0]

        excelRow[18] = workhours
        excelRow[19] = homeoffice
        excelRow[20] = cafeteria
        excelRow[21] = food
        excelRow[22] = childcare
        excelRow[23] = pension
        excelRow[24] = accessibility
        excelRow[25] = fitness
        excelRow[26] = medic
        excelRow[27] = coaching
        excelRow[28] = parking
        excelRow[29] = transportation
        excelRow[30] = discount
        excelRow[31] = car
        excelRow[32] = phone
        excelRow[33] = shares
        excelRow[34] = events
        excelRow[35] = internet
        excelRow[36] = dogs

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

let rawCompanyNames = ['movinga']

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
