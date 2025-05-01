 
const mongoose=require("mongoose");
const connect=mongoose.connect("mongodb://localhost:27017/shyam");

//check database connection or not

connect.then(() => {
    console.log('database connected sucessfully');

})
.catch(() =>{
    console.log('database not connected');

})

//create schems
const loginSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const collection=new mongoose.model("users",loginSchema);

module.exports=collection;