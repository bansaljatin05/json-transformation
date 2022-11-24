const csv = require('csv-parser')
var jsonata = require("jsonata");
const {NumberAddition,
  StringConcat,
  shift,enumGenerator}=require('../utils/TransformUtils');
const fs = require('fs');
const { type } = require('os');
const { bool } = require('joi');
const results = [];
const sourceJSON={
  "id": "122-34-6543",
  "firstName": "Leanne",
  "lastName": "Graham",
  "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874"
  },
  "occupation": "salaried",
  "age": 29
}


const targetJSON={}
let specJSONString="{";

fs.createReadStream('../../../data/sample_1/mapping.csv')
  .pipe(csv())
  .on('data', (data) =>{
    let str = JSON.stringify(data);
    if(str.includes("ENUM")){

      const x={}
      let enumerate = "";
      // console.log(data);
      for(let y in data){
        // console.log(y,data[y]);
        if(y==='No.' || y==="Target"){
          x[y] = data[y]
          continue;
        }else{
          if(y===" Source"){
            var i = data[y].indexOf(',');
            var source = data[y].slice(0,i);
            // console.log(data[y],source);
            // console.log(i,data[y].length-1);
            if(i===-1){
              // console.log("hu");
              x[" Source"]=data[y];
            }else{
              x[" Source"]=source;
            }

            if(!(i===-1)){
              enumerate += data[y].slice(i+1)+",";
              // console.log("ppm",enumerate);
            }

          }
          else{
            enumerate+=data[y]+",";
          }
        }
      }
      // console.log("enuma",enumerate);
      let st ={};
      if(enumerate.length!==0){
        // console.log(enumerate);
        let ap = enumerate.split(",");
        // console.log(ap);
        for(let k=0;k<ap.length;k++){
          var po = ap[k];
          let key="";
          let val="";
          let bool = 1;
          for(let m=0;m<po.length;m++){
            if(po[m]==="}"){
              break;
            }
            if(po[m]==="\"" || po[m]==="{"){
              continue;
            }
            else{
              if(po[m]==":"){
                bool=0;
                continue;
              }
              if(bool===1){
                key+=po[m];
              }else{
                val+=po[m]
              }
            }
          }
          if(key===""){
            continue;
          }
          st[key.trim()] = val.trim();

        }
      }
      // console.log(st);
      x[" Enumeration"] = st;
      results.push(x);
      // console.log(x);
      // console.log(arr);

      // for(let i=0;i<arr.length;i++){
      //   let a = arr[i];

      // }
    }else{
      results.push(data);
    }

  }
  )
  .on('end', () => {
    console.log(results);
    for(let i=0 ;i<results.length;i++){
        let value = results[i][" Source"];
        if(!value.includes('(')){
        value = value.trim();
        let a =  value.split("+").map(v=>v.trim().replace(".",""));

        let sourceObj;
        if(typeof(sourceJSON[a[0]])=="number"){

          sourceObj=NumberAddition(a);
        }else{
          sourceObj=StringConcat(a);
        }

        let ll=JSON.stringify(sourceObj)


        targetJSON[results[i].Target]=`${JSON.parse(ll)}`

        specJSONString+=`\'${results[i].Target}\'`
        specJSONString+=":";
        specJSONString+=JSON.parse(ll);
        if(i==results.length-1){
            break;
        }
        specJSONString+=",";

        // console.log(specJSONString);

    }else if(value.includes('ENUM')){
      let enum_key;
      let enumeration;
      // if(value.includes("+")){
      //   let aop = value.split("+");
      //   console.log(aop);
      //   let ek={};
      //   for(let m=0;m<aop.length;m++){
      //     let z;
      //     if(aop[m].includes("ENUM")){
      //       z = aop[m].trim().match("(?<=\.|^)[^.]+$")[0].slice(0,-1);
      //       ek["ENUM"] = z;
      //     }else if(aop[m])
      //   }
      // }

      enum_key = value.match("(?<=\.|^)[^.]+$")[0].slice(0,-1);
      console.log(enum_key);
      let enum_original_value = sourceJSON[enum_key];
      console.log(enum_original_value);
      enumeration = results[i][" Enumeration"];

      

      // let arr = enumeration.replaceAll(",\"",",");

      // enum_obj=JSON.parse(arr)


      specJSONString+=`\'${results[i].Target}\'`
      specJSONString+=":";
      specJSONString+= enumGenerator(enumeration,i,enum_key);

      // console.log(enum_obj[enum_original_value]);
      if(i==results.length-1){
          break;
      }
      specJSONString+=",";
      // console.log(typeof());

      // let a = value.split("(")
    }
}
      if(specJSONString[specJSONString.length-1]==","){
        specJSONString=specJSONString.slice(0,-1)
      }
    specJSONString+="}";

    console.log(specJSONString);

    var expression = jsonata(specJSONString);
    var result = expression.evaluate(sourceJSON);
    console.log(result)

  });
