module.exports = function Greetings() {
  var counter = 0;
  var msg = "";
  var nameMap = {};

  function greetMe(name,lang) {
      if (name === '' || lang === undefined){

      }
      else{
        if(nameMap[name] === undefined){
          nameMap[name] = 0;
          if (lang == "english") {
            msg = 'HELLO, ' + name + '!';
          } else if (lang == "afrikaans") {
            msg = 'HALLO, '  + name + '!' ;
          } else if (lang == "isiXhosa") {
            msg = 'MOLO, ' + name + '!';
          }
        }
          return msg;     
      }

  }

  function setLang(value) {
    lang = value;
  }

  function countNum() {
    return Object.keys(nameMap).length;
  }

  function returnGreet() {
    return greetMe;
  }
  function resetCount() {
      counter = 0;
  }
  return {
    funcGreet: greetMe,
     counter: countNum,
    language: setLang,
    resetCounter :resetCount
  }
}
