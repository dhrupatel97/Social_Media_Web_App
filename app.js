const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/database');

const app = express();

//Map global promise
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect(db.mongoURI, {
  //useMongoClient:true
})
  .then(() => console.log('MongoDB Connected..!!'))
  .catch(err => console.log(err));



//hanldebars middelware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//bodyParser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//method overrode middleware
app.use(methodOverride('_method'));

//session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variable
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//how middleware works
app.use(function(req,res,next){
  //console.log(Date.now());
  //req.name = 'Dhruv'
  next();
});


//Index Route
app.get('/', (req,res) => {
  //console.log(req.name);
  const title ="Welcome";
  res.render('index', {
    title:title
  });
});


app.get('/about', (req,res) => {
  res.render('about');
});


//use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log('Starting on port '+port);
})
