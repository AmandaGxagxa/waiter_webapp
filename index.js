let express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var Greetings = require('./greet');
let app = express();
app.use(express.static('public'));

app.use(bodyParser());
//it corvert data to be  usable
app.use(bodyParser.json());
const greetings = Greetings();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.get("/", function(req, res){
  var greetMe = greetings.msgGet();
  console.log(greetMe)
  res.render('home');
});
app.post("/greetings", function(req,res){
  let greetName = req.body.name.toUpperCase();
  let lang = req.body.language;
console.log(greetName);
greetings.language(lang);
  greetings.funcGreet(greetName);
  var getMsg= greetings.msgGet();

  // console.log(getMsg);
  res.render('home',{getMsg})
  // res.redirect('/');

} )
app.get('/greetings/:name/', function (req, res) {
  let greetedName = req.params.name;
    greetings.funcGreet(greetedName);
  let getMsg = greetings.msgGet();
  res.render('home', {getMsg })
})

let PORT = process.env.PORT || 4010;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});
