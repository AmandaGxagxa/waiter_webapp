module.exports = function Greetings(StoredNames) {
  var counter = 0;
  var msg = "";
  var nameMap = StoredNames || {};
  var lang = "";

  function greetMe(name) {
    if (name != '') {
      if (name != undefined) {
        nameMap[name] = 0;
      }
    }
    // lang = 'english';
    if (lang == "english") {
      msg = "HELLO, " + name + "!";
    } else if (lang == "afrikaans") {
      msg = "HALLO, " + name + "!" ;
    } else if (lang == "isiXhosa") {
      msg = "MOLO, " + name + "!";
    }
    // else {
    //   msg = "Good day " + name ;
    // }
  }

  function setLang(value) {
    lang = value;
  }

  function getMsg() {
    return msg;
  }

  function countNum() {
    return Object.keys(nameMap).length;
  }

  function map() {
    return nameMap;
  }
  function returnGreet() {
    return greetMe;
  }
  function resetCount() {
      counter = 0;
  }

  function resetData() {
    return nameMap = {};
  }
  return {
    funcGreet: greetMe,
    msgGet: getMsg,
    counter: countNum,
    language: setLang,
    getMap: map,
    resetNames: resetData,
    resetCounter :resetCount
  }
}
