var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path  = require('path');
var log = require('./libs/log')(module);
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var passport = require('passport');
var servicesRoutes = require('./libs/routes/servicesRoutes');
var ordersRoutes = require('./libs/routes/ordersRoutes');
var dishesRoutes = require('./libs/routes/dishesRoutes');
var personRoutes = require('./libs/routes/personRoutes');
var kitchensRoutes = require('./libs/routes/kitchensRoutes');

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(path.join(__dirname, "public")));

/**DAABASE **/
mongoose.connect('mongodb://127.0.0.1:27017/lenka');
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info('Connected to DB!');
});

/** auth **/
app.use(passport.initialize());
const localSignupStrategy = require('./libs/passport/local-signup');
const localLoginStrategy = require('./libs/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

/**routes**/
const authRoutes = require('./libs/routes/authRoutes');
app.use('/auth', authRoutes);
app.use('/api', servicesRoutes.router);
app.use('/api', ordersRoutes.router);
app.use('/api', dishesRoutes.router);
app.use('/api', personRoutes.router);
app.use('/api', kitchensRoutes.router);

 /** errors **/
app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    console.log('next')
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

app.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));
});

app.listen(3000, function(){
    log.info('Express server listening on port 3000');
});
