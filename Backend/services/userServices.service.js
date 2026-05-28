import userModel from "../models/user.model.js";

const createUser = async ({
    firstname,lastname,email,password
})=>{
    if(!firstname || !email || !password){
        throw new Error("Please enter all required fields")
    }

    const user = userModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password
    })

    return user;
}

export default {
   createUser
};