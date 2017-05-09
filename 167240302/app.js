var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();
var mongoURI = process.env.MONGODB_URI;

// mongodb connection
mongoose.connect(mongoURI);
var db = mongoose.connection;

// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// use sessions for tracking logins
app.use(session({
    secret: '167240302',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// make user ID available in templates
// (allows navbar to change based on logged in/ logged out status)
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});

// Initialize app
 var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname+'/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

//error handler
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        
    });
});



  const requests = require('request');

requests('http://ipinfo.io', function(error, res, body) {
  console.log(JSON.parse(body))
  var location =  JSON.parse(body);
  
var URL = 'http://api.openweathermap.org/data/2.5/weather?q='+ location.city+'&units=metric&appid=3dc309f081792492d7ff7a157f6fd84a'


  const requests = require('request');

requests(URL, function(error, res, body) {
  console.log(JSON.parse(body))
 var display =  JSON.parse(body);
 var output = ('Your Loaction is ' + location.city + ', the country is '+ display.sys.country +  ' and the Temp is ' + display.main.temp);
    console.log(JSON.parse(JSON.stringify(output)))
     res.write (JSON.parse(JSON.stringify(output)));
  });  
});


