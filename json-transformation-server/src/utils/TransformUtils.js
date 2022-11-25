function NumberAddition(arr) {
  return arr.join(' + ');
}

function StringConcat(arr) {
  return arr.join('&');
}

function shift() {}

function IfElseResolver(string, merge, nestedField) {
  string = string.replace('==', '=');
  var IfEndIndex = string.search('IF') + 2;
  var ThenStartIndex = string.search('THEN');
  var ElseStartIndex = string.search('ELSE');

  var IfCondition = string.slice(IfEndIndex, ThenStartIndex);
  var ThenStatement = string.slice(ThenStartIndex + 4, ElseStartIndex !== -1 ? ElseStartIndex : string.length);
  var ElseStatement = null;
  if (ElseStartIndex != -1) {
    ElseStatement = string.slice(ElseStartIndex + 4, string.length);
    ElseStatement = ElseStatement.trim();
  }

  var newIf = IfCondition.replace('(.', '');
  newIf = newIf.replace(')', '');

  var index = newIf.indexOf('.');
  var parent = newIf.slice(0, index);
  var child = newIf.slice(index + 1);
  var iterator = child.slice(0, child.indexOf('.'));
  child = child.replace(iterator, '$' + iterator);
  IfCondition = child;
  ThenStatement = ThenStatement.trim();
  ThenStatement = ThenStatement.replace(`.${parent}.`, '');
  ThenStatement = ThenStatement.replace(iterator, '$' + iterator);
  iterator = '$' + iterator;

  let result = '';
  let conditional = '';
  if (ElseStatement) {
    conditional = `${IfCondition}?${ThenStatement}:${ElseStatement}`;
  } else {
    conditional = `${IfCondition}?${ThenStatement}`;
  }
  result += `$map(${parent},function(${iterator},$i,$a){
  ${!merge ? conditional : `$merge([${iterator},{"${nestedField}": ${conditional}}])`}
})`;
  //result+=".$string()"
  return result;
}

function enumGenerator(enumumeration, id, field) {
  var enum_String = JSON.stringify(enumumeration);
  let result = '';
  result += `($enums${id}:= ${enum_String};$lookup($enums${id},${field}))`;
  return result;
}

module.exports = {
  NumberAddition,
  StringConcat,
  shift,
  enumGenerator,
  IfElseResolver,
};
