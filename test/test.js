const assert = require('assert');
const Greetings = require('../services/greet');
const pg = require('pg');
const Pool = pg.Pool;

// should we use a SSL connection
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
describe('The basic database web app', function () {
    beforeEach(async function () {
        await pool.query('delete from greet');
    });

    it('should be able to ', async function () {
        // the Factory Function is called CategoryService
        const greetings = Greetings(pool);
        let results = await greetings.selectAll();
        assert.deepStrictEqual(0, results.length);
    });

    it('should to return the number of people greeted', async function () {
        const greetings = Greetings(pool);
        await greetings.addUserOrIncrement('amanda', 'molo');
        await greetings.addUserOrIncrement('asanda', 'hallo');
        let results = await greetings.selectAll();
        assert.deepStrictEqual(2, results.length);
    });

    it('should to be able to count number people greeted', async function () {
        const greetings = Greetings(pool);
        await greetings.addUserOrIncrement('amanda', 'molo');
        await greetings.addUserOrIncrement('asanda', 'hallo');
        let results = await greetings.selectCount();

        assert.strictEqual(2, results);
    });

    it('should to be able to return the name of the user greeted', async function () {
        const greetings = Greetings(pool);
        await greetings.addUserOrIncrement('amanda', 'molo');
        await greetings.addUserOrIncrement('phindi', 'hallo');
        let results = await greetings.selectUser('phindi');
        assert.strictEqual('phindi', results[0].name);
    });

    it('should to be able to return the language that the user greeted with', async function () {
        // the Factory Function is called CategoryService
        const greetings = Greetings(pool);
        await greetings.addUserOrIncrement('amanda', 'molo');
        await greetings.addUserOrIncrement('phindi', 'hallo');
        let results = await greetings.selectLang('molo');
        assert.strictEqual('molo', results[0].language);
    });

    after(function () {
        pool.end();
    });
});
