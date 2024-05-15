const jwt = require('jsonwebtoken');
const createError = require('http-errors');
require('dotenv').config()


module.exports={
    signAccessToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={
            userId: userId,
            role: userId.role,
            }
            const secret =  process.env.ACCESS_TOKEN_SECRET;
            const options={
                expiresIn: "2d",
                issuer: "shaudan.com",
                audience: userId
            }
            jwt.sign(payload, secret, options, (err, token)=>{
                if(err){
                    console.log(err.message);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            })
        })
    },
    verifyAccessToken: (req,res,next)=>{
        if(!req.headers['authorization'])
        {
            return res.status(401).send({success: false, message: "unauthorized"});
        }

        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ');
        const token= bearerToken[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,req,res)=>{
            if(err){
                if(err.name === 'JsonWebTokenError'){
                    return res.status(401).send({success: false, message: err.message});
                }else{
                return res.status(401).send({success: false, message: err.message});
            }
        
            next();
        }
    })
    },
    signRefreshToken:(userId)=>{ 
        return new Promise((resolve,reject)=>{
            const payload={
            
            }
            const secret =  process.env.REFRESH_TOKEN_SECRET;
            const options={
                expiresIn: "1y",
                issuer: "shaudan.com",
                audience: userId
            }
            jwt.sign(payload, secret, options, (err, token)=>{
                if(err){
                    console.log(err.message);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            })
        })
    },
    verfiyRefreshToken: (refreshToken)=>{
        return new Promise((resolve,reject)=>{
            jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,req,res)=>{
                if(err){return res.send(err.message)}
                const userId= payload.aud;
                resolve(userId);
            })
        })
    }

}