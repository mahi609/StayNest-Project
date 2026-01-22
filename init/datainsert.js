const mongoose = require('mongoose');
const listening = require("../models/listening");
const initdb = require("./data.js");


main().then(()=>{
    console.log("connection suucesful")
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/ainnb');
}
 


const insertdb = async () =>{
//   await listening.deleteMany({});
 initdb.data =  initdb.data.map((obj)=>({...obj, owner: "69690f132c781fd380adebce"}));
  let data = await listening.insertMany(initdb.data);
  console.log(data);
}

insertdb();