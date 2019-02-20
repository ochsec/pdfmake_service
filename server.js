var path = require('path')
var fs = require('fs')
var express = require('express')
var pdfPrinter = require('pdfmake')
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000;

var app = express()
app.use(express.static('public'))
app.use(bodyParser.json({ limit: '10mb' }))
app.set('view engine', 'ejs')

createPdf = (docData, callback) => {
    var fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'            
        }
    }

    console.log(docData);

    var printer = new pdfPrinter(fonts);
    var doc = printer.createPdfKitDocument(docData);

    // var chunks = [];
    // var result;
    // doc.on('data', (chunk) => chunks.push(chunk))
    // doc.on('end', () => {
    //     result = Buffer.concat(chunks)
    //     callback('data:application/pdf;base64,' + result.toString('base64'))
    // })
    // doc.end()
    doc.pipe(fs.createWriteStream('./pdfs/test.pdf'))
    doc.end()
    callback('success')
}

app.post('/pdfmake', (req, res) => {
    var docData = req.body
    createPdf(docData, (result) => {
        //res.contentType('application/pdf')
        res.send(result)
    }, (err) => res.render('index.ejs', { data: err }) )    
})

var server = app.listen(port, () => console.log(`Started on PORT ${port}`))
