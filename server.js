var path = require('path')
var fs = require('fs')
var express = require('express')
var pdfPrinter = require('pdfmake')
var bodyParser = require('body-parser')
var cors = require('cors')
var GUID = require('node-uuid')
var port = process.env.PORT || 3000;

var app = express()
app.use(cors())
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
    var filename = GUID.v4();
    
    doc.pipe(fs.createWriteStream(`./pdfs/${filename}.pdf`))
    doc.end()
    callback(`localhost:3000/pdfs/${filename}.pdf`)
}

app.post('/pdfmake', (req, res) => {
    var docData = req.body
    createPdf(docData, (result) => {
        // res.contentType('application/pdf')
        res.send(result)
    }, (err) => res.render('index.ejs', { data: err }) )    
})

var server = app.listen(port, () => console.log(`Started on PORT ${port}`))
