module.exports = function (waiterSev){
    
    async function selectDays(req, res) {
        try {
            
            
            let names = req.params.names;
            let name = names.toUpperCase();
            // console.log(names+" nali gama");
            req.flash('info',  'Hello ' + name + ', please select which days will you be available in.');
            let weekdaysResults = await waiterSev.getDays();
            let  weekdays = weekdaysResults;
            //console.log(weekdays);
            
          
           res.render('weekdays',{ weekdays})
  
        }
         catch (err) {
          res.send(err.stack);
        }
      }
      
      async function addWaiter(req, res) {
        try {
            let names = req.params.names;
            let name = names.toUpperCase();
            console.log(names);

                req.flash('info',  'Hello ' + name + ', please select which days will you be available in.');
                waiterResults = await waiterSev.createOrAddWaiter(name);
                console.log(waiterResults)
            // let count = await services.selectCount();
            res.redirect('weekdays', { waiterResults });
        } catch (err) {
            res.send(err.stack);
        }
    }

    
      return{
        selectDays,
        addWaiter
        //createOrAddWaiter

      }

}