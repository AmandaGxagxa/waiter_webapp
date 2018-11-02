module.exports = function (waiterSev) {

    async function home (req, res) {
        res.render('home');
    }

    async function login (req, res) {
        try {
            let names = req.body.names;
            let name = names.toUpperCase();
            if (name === '') {
                req.flash('info', 'Please enter your name.');
                req.render('home');
                return;
            } else {
                req.flash('info', 'Hello ' + name + ', please select which days will you be available in.');
                // let weekdays = weekdaysResults;
                res.redirect('/waiters/' + name);
            }
        } catch (err) {
            res.send(err);
        }
    }
    async function selectDays (req, res) {
        try {
            let names = req.params.names;
            let name = names.toUpperCase();
            // req.flash('info', 'Hello ' + name + ', please select which days will you be available in.');
            let weekdaysResults = await waiterSev.getDays();
            let weekdays = weekdaysResults;
            res.render('weekdays', {
                weekdays
            });
        } catch (err) {
            res.send(err);
        }
    }

    async function addWaiter (req, res) {
        try {
            console.log('body', req.body);

            let daySelected = req.body.day;

            let names = req.params.names;
            let name = names.toUpperCase();
           
            if (name === '') {
                req.flash('err', 'Please select your shift day');
            }
            if (daySelected === undefined) {
                return req.flash('err', 'Please select your shift day');
            } else {
                let weekdaysResults = await waiterSev.getDays();
                let weekdays = weekdaysResults;
                req.flash('info', name + ', has selected these days.');
                let waiterResults = await waiterSev.getWaiter(name);
                await waiterSev.createShift(name, daySelected);

                res.redirect('/shifts/' + name);
            }
        } catch (err) {
            res.send(err.stack);
        }
    }

    async function shiftDays (req, res) {
        try {
            let names = req.params.names;
            let name = names.toUpperCase();

            let daysSelected = await waiterSev.getUserShifts(name);
            console.log(daysSelected);

            res.render('shiftdays', {
                daysSelected
            });
        } catch (err) {
            res.send(err.stack);
        }
    }

    async function roster (req, res) {
        let shifts = await waiterSev.getAllShifts();
        res.render('roster', { shifts });
    }

    return {
        home,
        login,
        selectDays,
        addWaiter,
        shiftDays,
        roster
    };
};
