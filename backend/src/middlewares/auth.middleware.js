import jwt from 'jsonwebtoken';
import tokenBlacklistModel from '../models/blacklist.model.js';
import cookieParser from 'cookie-parser';



async function authUser(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    });
    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Token is blacklisted"
        });
    }
    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        req.user= decoded;
        next();
    }
    catch(err){
        return res.status(401).json({
            message: "Invalid token"
        });
    }

}
export default authUser;

