module.exports = function (pool) {

    async function getWaiter (username) {
        let userResults = await pool.query('select * from waiter where names = $1', [username]);
        let useR = userResults.rowCount;
        console.log(useR);
        if (useR === 0) {
            // user = useR[0];
            await pool.query('insert into waiter (names) values ($1)', [username]);

        };
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
        let userID = await pool.query('select id from waiter where names = $1', [username]);
        if (userID.rowCount > 0) {

          await pool.query('delete from shifts where names_id = $1', [userID.rows[0].id]);
            
        }else{

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

    async function getAllShifts () {
        let orderedShifts = await getDays();
        let shifts = await pool.query('select names,weekdays from shifts join waiter on shifts.names_id = waiter.id join weekdays on shifts.weekdays_id = weekdays.id');

        for (let shift of shifts.rows) {
            let foundShift = orderedShifts.find((currentShift) => currentShift.weekdays === shift.weekdays);
            let index = orderedShifts.indexOf(foundShift);
            if (!foundShift.waiters) {
                foundShift.waiters = [];
            }
            foundShift.waiters.push(shift.names);
            orderedShifts[index] = foundShift;
        }
       // console.log('All-shifts', orderedShifts);
        
        return orderedShifts;
    }

    return {
        // createOrAddWaiter,
        getDays,
        getWaiter,
        createShift,
        getUserShifts,
        getAllShifts

    };
};
