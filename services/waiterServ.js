module.exports = function (pool) {

  async function getWaiter(username) {
    let user = null;
    let userResults = await pool.query('select * from waiter where names = $1', [username])
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
  }

  async function createShift(waiter_id, weekday_id) {
    let results = await pool.query('insert into shifts (names_id, weekdays_id) values ($1,$2)',
      [waiter_id, weekday_id]);

    return results.rows;

  }

  return {
    // createOrAddWaiter,
    getDays,
    getWaiter,
    createShift

  }

}