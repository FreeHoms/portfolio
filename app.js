const express = require('express') // loads the express package
const { engine } = require('express-handlebars'); // loads handlebars for Express
const port = 8080 // defines the port
const app = express() // creates the Express application
const bodyParser = require('body-parser'); 
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('my-database.db')
const { setupDatabase } = require('./project-database'); // Adjust the path accordingly
const projectRouter = require('./routers/project-router'); // Adjust the path accordingly
const { router: authRouter, isAuthenticated } = require('./routers/auth-router');
const session = require('express-session');


// defines handlebars engine
app.engine('handlebars', engine());
// defines the view engine to be handlebars
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true })); 

// define static directory "public" to access css/ and img/
app.use(express.static('public'))

// Session middleware configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));


// Setup the database


// setupDatabase();

app.use('/', authRouter);
// Use the projectRouter for CRUD operations related to projects
app.use('/', projectRouter);

// defines route "/"
app.get('/', function(req, res){
  res.render('home')
})

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/projects', (req, res) => {
  // Retrieve projects from the database
  db.all('SELECT * FROM projects', (err, projectsData) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.render('projects', { projectsData });
  });
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

