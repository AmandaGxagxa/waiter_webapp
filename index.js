const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Greetings = require('./greet');
const app = express();
app.use(express.static('public'));
const session = require('express-session');
const pg = require("pg");
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
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


// app.use(bodyParser());

app.use(bodyParser.urlencoded({ extended: false }))
//it corvert data to be  usable
 app.use(bodyParser.json());
const greetings = Greetings();
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


app.get("/", function(req, res) {
  // let greetMe = greetings.msgGet();
  let count = greetings.counter();
  console.log(count)
  res.render('home', {
    count
  });
});


app.post("/greetings", async function(req, res) {
  try{
    let greetName = req.body.name;
    let lang = req.body.language;


    if (greetName !== "" || lang !== undefined){
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
    let Greet = await pool.query(greetings.funcGreet(greetName, lang));
    let count = await pool.query('select count(*) from greet');
    count = count.rows[0].count;
    res.render('home', {getMsg:Greet, count})
  } catch (err){
    res.send(err.stack);
  }

  // let count = greetings.counter();


})
app.get('/greetings/:name/:lang', async function(req, res) {
  try{
    let name = req.params.name;
    // let lang = req.body.language;
    let Greet = await pool.query(greetings.funcGreet(name, lang));
    let count = greetings.counter();
    res.render('home', {getMsg :Greet, count})
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


let PORT = process.env.PORT || 4010;

app.listen(PORT, function() {
  console.log('App starting on port', PORT);
});
