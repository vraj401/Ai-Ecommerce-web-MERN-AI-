import { validationResult } from "express-validator";
import userServicesService from "../services/userServices.service.js";
import userModel from "../models/user.model.js";
import BlackListToken from "../models/BlackListToken.model.js";


const Register = async (req , res)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:errors.array()[0].msg
        })
    }

    const {fullname,email,password} = req.body;
    const hashedPassword = await userModel.hashPassword(password);

    const user = await userServicesService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword
    })

    const token = user.generateAuthToken();

    res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

    res.status(201).json({token,user})
}

const loginUser = async (req,res,next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:errors.array()[0].msg
        })
    }
    
    const {email,password} = req.body;

    const user = await userModel.findOne({email}).select("+password");

    if(!user){
        console.log("user not found")
        return res.status(401).json({
            success:false,
            message:"User not found"
        })
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        console.log("invalid credentials")
        return res.status(401).json({
            success:false,
            message:"Invalid credentials"
        })
    }

  

    const token = user.generateAuthToken();

     res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
   
    res.status(200).json({token,user})

}


const logoutUser = async (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    try {
    await BlackListToken.create({ token });
} catch (err) {
    if (err.code !== 11000) { // ignore duplicate error
        throw err;
    }
}
    res.clearCookie("token");

    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })

}





export default {
    Register,
    loginUser,
    logoutUser
}