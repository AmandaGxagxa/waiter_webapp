const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Greetings = require('./greet');
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


app.get("/", async function(req, res) {
  let greetName = req.body.name;
  let lang = req.body.language;
  let getMsg = greetings.funcGreet(greetName, lang);
  let count = await pool.query('select count(*) from greet');
    count = count.rows[0].count;
  res.render('home', {
    count,
    getMsg
  });
});


app.post("/greetings", async function(req, res){
  
    let greetName = req.body.name;
    let lang = req.body.language;

    if (greetName == "" && lang == undefined){
      console.log('here')
     req.flash('info', 'Please enter your name and select the language');
    }
    
      else{
      let db = await pool.query('SELECT * FROM greet');
      let found = false;
      for (var i = 0; i < db.rows.length; i++) {
        if( db.rows[i].name === greetName){
          found =true;
          let increment =  db.rows[i].count +1;
          await pool.query('update greet set count = $1 where name=$2',[increment, greetName])
        }

      }
      if(!found){
        await pool.query('insert into greet (name, language, count) values ($1,$2,$3) ', [greetName, lang, 1])
      }
    }
    let getMsg = greetings.funcGreet(greetName, lang);
    let count = await pool.query('select count(*) from greet');
    count = count.rows[0].count;
    res.render('home', {getMsg, count});

    
});
app.get('/greetings/:name/:lang', async function (req, res) {
  try{
    let name = req.params.name.toUpperCase();
    let lang = req.params.lang;
    if (name !== "" || lang !== undefined){
      let db = await pool.query('SELECT * FROM greet');
      let found = false;
      for (var i = 0; i < db.rows.length; i++) {
        if( db.rows[i].name === name){
          found =true;
          let increment =  db.rows[i].count +1;
          await pool.query('update greet set count = $1 where name=$2',[increment, name])
        }

      }
      if(!found){
        await pool.query('insert into greet (name, language, count) values ($1,$2,$3) ', [name, lang, 1])
      }


    }
    let getMsg = greetings.funcGreet(name, lang);
    let count = await pool.query('select count(*) from greet');
    count = count.rows[0].count;
    res.render('home', {getMsg, count})

  } catch(err){
    res.send(err);
  }

  // let getMsg =  await greetings.msgGet();

})
app.get('/greeted', async function (req,res) {
try {
  let greetedNames = await pool.query('SELECT * FROM greet')
  let nameKept = greetedNames.rows;
  res.render('greeted', {nameKept});
} catch (err) {
res.send(err);
}

})
app.get('/reset', async function(req,res){
  await pool.query('delete from greet');
res.redirect('/');
});



let PORT = process.env.PORT || 4010;

app.listen(PORT, function() {
  console.log('App starting on port', PORT);
});
