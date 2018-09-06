const Greetings = require('../services/greet');

module.exports = function(pool){
    const services = Greetings(pool);
    async function toHomePage(req,res){
    try {
        let count = await services.selectCount();
        res.render('home', { count});
    } catch (err) {
        
    }
}
async function postRoute(req,res) {
    try{
        let greetName = req.body.name;
        let lang = req.body.language;
    
        if (greetName == "" && lang == undefined){
         req.flash('info', 'Please enter your name and select the language!');
        }
        else if(greetName == ""){
          req.flash('info', 'Please enter your name!');
        }
        else if(lang == undefined){
          req.flash('info', 'Please select a language!');
        }
        else{
          req.flash('info', lang +", " + greetName);
         await services.addUserOrIncrement(greetName,lang);
        }
        //let getMsg = greetings.funcGreet(greetName, lang);
        let count = await services.selectCount();
        res.render('home', { count});
      }
      catch(err){
    
      }
}
async function greetUrl(req ,res) {
    try{
        let greetName = req.params.name;
        let lang = req.params.lang;
    
        if (greetName == "" && lang == undefined){
         req.flash('info', 'Please enter your name and select the language!');
        }
        else if(greetName == ""){
          req.flash('info', 'Please enter your name!');
        }
        else if(lang == undefined){
          req.flash('info', 'Please select a language!');
        }
        else{
          req.flash('info', lang +", " + greetName);
         await services.addUserOrIncrement(greetName,lang);
        }
        let count = await services.selectCount();
        res.render('home', { count});
      }
      catch(err){
    
      }
}
async function greetedRoute(req,res) {
    try {
        let nameKept = await services.selectAll()
    
        res.render('greeted', {nameKept});
      } catch (err) {
      res.send(err);
  }
};
async function resert(req, res) {
    await pool.query('delete from greet');
res.redirect('/');
}
return{
    toHomePage,
    postRoute,
    greetUrl,
    greetedRoute,
    resert
    
};
};