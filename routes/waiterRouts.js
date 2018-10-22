module.exports = function (waiterSev) {
    async function selectDays (req, res) {
        try {
            let names = req.params.names;
            let name = names.toUpperCase();
            req.flash('info', 'Hello ' + name + ', please select which days will you be available in.');
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
            let daySelected = req.body.shift_days;
            console.log(daySelected, 'req.body');
            let names = req.params.names;
            let name = names.toUpperCase();
            console.log(name);
            if (name == '') {
                req.flash('err', 'Please select your shift day');
            }
            if (daySelected === undefined) {
                return req.flash('err', 'Please select your shift day');
            } else {
                let weekdaysResults = await waiterSev.getDays();
                let weekdays = weekdaysResults;
                req.flash('info', name + ', has selected these days.');
                let waiterResults = await waiterSev.getWaiter(name);

                res.render('weekdays', {
                    waiterResults,
                    weekdays
                });
            }
        } catch (err) {
            res.send(err.stack);
        }
    }

    async function shiftDays (req, res) {
        try {
            let daysSelected = req.body.id;
            let names = req.params.names;
            let name = names.toUpperCase();
            for (let i = 0; i > daysSelected.length; i++) {
                if (name.id) {
                    daysSelected = await waiterSev.createShift(waiter_id, day_id);
                    console.log(daysSelected);
                };
            };
            // use the waiterName to get the waiterId from the db
            // find all the ids for the selected week day names
            // what problem
            res.render('shiftdays', {
                daysSelected
            });
        } catch (err) {
            res.send(err.stack);
        }
    }

    return {
        selectDays,
        addWaiter,
        shiftDays

    };
};
