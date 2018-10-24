module.exports = function (pool) {
    async function getWaiter (username) {
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

    async function createShift (username, selectedDays) {

        if (typeof selectedDays === 'string') {
            selectedDays = [selectedDays];
        }
        console.log('selected', selectedDays);
        
        let userID = await pool.query('select id from waiter where names = $1', [username]);
        if (userID.rowCount < 1) {
            await pool.query('insert into waiter(names) values($1)', [username]);
            userID = await pool.query('select id from waiter where names = $1', [username]);
        }

        // for (let day of selectedDays) {
        //     let dayID = await pool.query('select id from weekdays where weekdays = $1', [day]);
        //     weekdayIDs.push(dayID.rows[0].id);
        // }

        for (let weekday of selectedDays) {
            await pool.query('insert into shifts(names_id, weekdays_id) values($1, $2)', [userID.rows[0].id, weekday]);
        }
    }

    return {
    // createOrAddWaiter,
        getDays,
        getWaiter,
        createShift

    };
};
