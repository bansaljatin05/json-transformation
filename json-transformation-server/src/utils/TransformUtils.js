function NumberAddition(arr){
  return arr.join(" + ");
}


function StringConcat(arr){
  return arr.join("&");

}

function shift(){

}

function IfElseResolver(string){

}

function enumGenerator(enumumeration,id,field){
  var enum_String=JSON.stringify(enumumeration)
  let result = '';
  result+=`($enums${id}:= ${enum_String};$lookup($enums${id},${field}))`
  return result
}


module.exports={
  NumberAddition,
  StringConcat,
  shift,
  enumGenerator
}
