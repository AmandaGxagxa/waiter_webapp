const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Greetings = require('./greet');
const routs  = require('./routes/greetings')
const app = express();
app.use(express.static('public'));
const session = require('express-session');
const flash = require('express-flash');
const pg = require('pg');
const Pool = pg.Pool;

//should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/my_greetings';

const pool = new Pool({
  connectionString,
  ssl: useSSL
});

app.use(session({
  secret: 'heloo world',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// app.use(bodyParser());

app.use(bodyParser.urlencoded({ extended: false }))
//it corvert data to be  usable
 app.use(bodyParser.json());
const greetings = Greetings();
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
const greetRouts = routs(pool);

app.get("/",greetRouts.toHomePage) ;
app.post("/greetings",greetRouts.postRoute);
app.get('/greetings/:name/:lang', greetRouts.greetUrl);
app.get('/greeted', greetRouts.greetedRoute);
app.get('/reset', greetRouts.resert);



let PORT = process.env.PORT || 4010;

app.listen(PORT, function() {
  console.log('App starting on port', PORT);
});
