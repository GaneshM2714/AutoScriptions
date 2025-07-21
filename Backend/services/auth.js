const jwt = require('jsonwebtoken')

require("dotenv").config();

const authenticatetoken = async(req,res,next)=>{
    const authHeader = req.headers['authorization']
    const TOKEN = authHeader && authHeader.split(' ')[1] // BEARER TOKEN

    if(!TOKEN){
        return res.status(403).json({
            success: false,
            message: "Access token required"
        })
    }

    jwt.verify(TOKEN , process.env.JWT_SECRET, (error,decoded)=> {
        if(error) return res.status(403).json({
            success:false,
            message: "Invalid or expired token"
        });


        req.user = {
            id : decoded.id,
            phone : decoded.phone
        };

        next();

        
    })
};


module.exports = authenticatetoken;