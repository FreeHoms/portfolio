const express = require('express') // loads the express package
const { engine } = require('express-handlebars'); // loads handlebars for Express
const port = 8080 // defines the port
const app = express() // creates the Express application

// defines handlebars engine
app.engine('handlebars', engine());
// defines the view engine to be handlebars
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');

// define static directory "public" to access css/ and img/
app.use(express.static('public'))

// CONTROLLER (THE BOSS)
// defines route "/"
app.get('/', function(req, res){
  res.render('home')
})

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/projects', (req, res) => {
  res.render('projects');
});

app.get('/blog', (req, res) => {
  res.render('blog');
});

app.get('/faq', (req, res) => {
  res.render('faq');
});

app.get('/login', (req, res) => {
  res.render('login');
});


// defines the final default route 404 NOT FOUND
app.use(function(req,res){
  res.status(404).render('404.handlebars');
});

// sends back a SVG image if asked for "/favicon.ico"
app.get('/favicon.ico', (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml")
  res.sendFile(__dirname + "/img/jl.svg")
});

// runs the app and listens to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`)
})

