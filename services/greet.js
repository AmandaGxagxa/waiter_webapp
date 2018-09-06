module.exports = function(pool){

    async function selectAll() {
        let names = await pool.query('select * from greet');
        return names.rows;
    }
    async function insert(greetName,lang){
    await pool.query('insert into greet (name, language, count) values ($1,$2,$3) ', [greetName, lang, 1])
        
    }
    async function selectCount(){
        let counter = await pool.query('select count(*) from greet');
        return parseInt(counter.rows[0].count);
    }
    
    async function updating(count,language,name){
        await pool.query('update greet set count = $1, language =$2 where name=$3',[count,language,name])
            
    }
    async function selectUser(name) {
        let currentCount = await pool.query('select * from greet where name = $1',[name])
        return currentCount.rows;
    }
    async function selectLang(language) {
        let currentCount = await pool.query('select * from greet where language = $1',[language])
        return currentCount.rows;
    }
    async function addUserOrIncrement(names, languages){
    let users = await selectUser(names);
        if (users.length != 0) {
            let increment = users[0].count +1;
            await updating( increment,languages,names);
        }else{
            await insert( names,languages);
        }
    }
    async function reset(){

       await pool.query('delete from greet');
    
    }
    return{
        selectAll,
        selectCount,
        updating,
        reset,
        selectUser,
        selectLang,
        addUserOrIncrement
    };
    
    };