const mongoose = require("mongoose");

const connectdb = async () => {
  try{
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/USERAUTH', {})
    console.log(`MongoDB Connected : ${conn.connection.host}`)
  }catch (error){
    console.log(error);
    process.exit(1)
  }  
}
module.exports = connectdb