var http = require('http');
var fs = require('fs');
const PORT = 3000;

// Imports
const express = require('express')
const app = express()
const port = 3000

// Static Files
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'))
app.use('/style.css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))


// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    res.render('index', { text: 'This is EJS'})
})

//  Listen on port 3000
app.listen(port, () => console.info(`Listening on port ${PORT}`))
