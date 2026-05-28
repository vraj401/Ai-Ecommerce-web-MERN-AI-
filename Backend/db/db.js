import mongoose from "mongoose";

function connectToDb(){
    mongoose.connect(process.env.DB_CONNECT).then(()=>{
        console.log("Connected to MongoDB");
    }).catch((err)=>{
        console.error("Error connecting to MongoDB",err);
    })

}

export default connectToDb;