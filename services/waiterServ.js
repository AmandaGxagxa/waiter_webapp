module.exports = function(pool){
    async function createOrAddWaiter(username) {

        let user = null;
        let userResults = await pool.query('select * from waiter where names = $1', [username])
        if (userResults.rows.length > 0) {
          user = userResults.rows[0];
        } else {
          // user should be added
          let userAddResults = await pool.query(`insert 
                              into waiter (names) values ($1)
                              returning id, names`, [username]);
          user = userAddResults.rows[0]
        }
        return user;
      }

const getDays = async ()=> {
  let weekdays = await pool.query('select * from weekdays');
  if (weekdays.rowCount ===0) {
      return ;
  }
  return weekdays.rows;
}



return {
    createOrAddWaiter,
    getDays
}

}