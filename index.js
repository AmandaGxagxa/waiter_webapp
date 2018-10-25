const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Waiter = require('./routes/waiterRouts');
const WaiterServ = require('./services/waiterServ');
const postgres = require('pg');
const Pool = postgres.Pool;

const app = express();
app.use(express.static('public'));

const session = require('express-session');
const flash = require('express-flash');
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/waiterdb';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

const services = WaiterServ(pool);
const waiter = Waiter(services);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
// it corvert data to be  usable
app.use(bodyParser.json());
app.use(session({
    secret: '<add a secret string here>',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
// initialise the flash middleware

app.get('/weekdays/:names', waiter.selectDays);
app.post('/weekdays/:names', waiter.addWaiter);
app.get('/shifts/:names', waiter.shiftDays);
// app.get('/registration/reset', registrations.resert);

let PORT = process.env.PORT || 3020;

// app.get('/', function (req, res) {
//     res.render();
// });

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});
