const Greetings = require('../services/greet');

module.exports = function (pool) {
    const services = Greetings(pool);
    async function toHomePage (req, res) {
        try {
            let count = await services.selectCount();
            res.render('home', { count });
        } catch (err) {

        }
    }
    async function postRoute (req, res) {
        try {
            let name = req.body.name;
            let lang = req.body.language;
            // let char = /^[A-Za-z]+$/;
            let greetName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            if (greetName === '' && lang === undefined) {
                req.flash('info', 'Please enter your name and select the language!');
            } else if (greetName === '') {
                req.flash('info', 'Please enter your name!');
            } else if (lang === undefined) {
                req.flash('info', 'Please select a language!');
            } else {
                req.flash('getMsg', lang + ', ' + greetName);
                await services.addUserOrIncrement(greetName, lang);
            }
            let count = await services.selectCount();
            res.render('home', { count });
        } catch (err) {

        }
    }
    async function greetUrl (req, res) {
        try {
            let greetName = req.params.name;
            let lang = req.params.lang;

            if (greetName === '' && lang === undefined) {
                req.flash('info', 'Please enter your name and select the language!');
            } else if (greetName === '') {
                req.flash('info', 'Please enter your name!');
            } else if (lang === undefined) {
                req.flash('info', 'Please select a language!');
            } else {
                req.flash('getMsg', lang + ', ' + greetName +"!");
                await services.addUserOrIncrement(greetName, lang);
            }
            let count = await services.selectCount();
            res.render('home', { count });
        } catch (err) {

        }
    }
    async function greetedRoute (req, res) {
        try {
            let nameKept = await services.selectAll();

            res.render('greeted', { nameKept });
        } catch (err) {
            res.send(err);
        }
    };
    async function resert (req, res) {
        await pool.query('delete from greet');
        res.redirect('/');
    }
    async function greetedTimes (req, res) {
        try {
            let userName = req.params.name;
            let results = await services.selectUser(userName);
            res.render('greetedTimes', { results });
        } catch (err) {

        }
    }
    return {
        toHomePage,
        postRoute,
        greetUrl,
        greetedRoute,
        resert,
        greetedTimes

    };
};
