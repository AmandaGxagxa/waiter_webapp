module.exports = function (pool) {
    async function getWaiter(username) {
        let user = null;
        let userResults = await pool.query('select * from waiter where names = $1', [username]);
        if (userResults.rows.length > 0) {
            user = userResults.rows[0];
        } else {
            // user should be added
            await pool.query('insert into waiter (names) values ($1)', [username]);
        }
        return user;
    }

    const getDays = async () => {
        let weekdays = await pool.query('select * from weekdays');
        if (weekdays.rowCount === 0) {
            return;
        }
        return weekdays.rows;
    };

    async function createShift(username, selectedDays) {
        if (typeof selectedDays === 'string') {
            selectedDays = [selectedDays];
        }
        console.log('selected', selectedDays);

        let userID = await pool.query('select id from waiter where names = $1', [username]);
        if (userID.rowCount < 1) {
            await pool.query('insert into waiter(names) values($1)', [username]);
            userID = await pool.query('select id from waiter where names = $1', [username]);
        }

        for (let weekday of selectedDays) {
            await pool.query('insert into shifts(names_id, weekdays_id) values($1, $2)', [userID.rows[0].id, weekday]);
        }
    }
    async function getUserShifts (username) {
        let userShifts = [];

        let userID = await pool.query('select id from waiter where names = $1', [username]);
        if (userID.rowCount < 1) {
            return 'unknown user';
        }

        let shifts = await pool.query('select weekdays_id from shifts where names_id=$1', [userID.rows[0].id]);
        if (shifts.rowCount > 0) {
            let allDays = await getDays();
            for (let day of allDays) {
                let today = {
                    id: day.id,
                    weekdays: day.weekdays
                };

                shifts.rows.forEach(shift => {
                    if (shift.weekdays_id === day.id) {
                        today.checked = 'checked';
                    }
                });
                userShifts.push(today);
            }
            return userShifts;
        }
    }

    return {
        // createOrAddWaiter,
        getDays,
        getWaiter,
        createShift,
        getUserShifts

    };
};
