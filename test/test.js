const assert = require('assert');
const Greetings = require('../greet');
const pg = require("pg");
const Pool = pg.Pool;

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/my_greetings';

const pool = new Pool({
    connectionString
});

describe('The basic database web app', function(){

    beforeEach(async function(){
        // clean the tables before each test run
        await pool.query("delete from products;");
        await pool.query("delete from categories;");
    });

    it('should pass the db test', async function(){
        
        // the Factory Function is called CategoryService
        const greetings = Greetings(pool);
        await greetings.funcGreet({
            name : "amanda"
        });

        let greet = await greetings.funcGreet();
        assert.equal(1, categories.length);

    });

    after(function(){
        pool.end();
    })
});