import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import BlackListToken from "../models/BlackListToken.model.js";

export const authUser = async (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
 
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Unauthorized,token not found"
        })
    }

    if(await BlackListToken.findOne({token:token})){
        return res.status(401).json({
            success:false,
            message:"Unauthorized token is blacklisted"
        })
    }

    try {
          console.log("COOKIE TOKEN:", req.cookies.token);
console.log("HEADER TOKEN:", req.headers.authorization);
console.log("USED TOKEN:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        const user = await userModel.findById(decoded._id);

        req.user = user;
        return next();

}catch (error) {
    console.log("Token verification error:", error);
    return res.status(401).json({
        success:false,
        message:"Unauthorized token is invalid",
        error:error
    })
}
}