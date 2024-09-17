const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req,res,next)=>{
    const token = req.header('Authorization')?.replace('Bearer',"");
    if(!token) return res.status(401).send('Access Denied');
    try{
        const decode = jwt.verify(token);
        req.user = await User.findById(decode.id);
        next();
    }catch (err){
        res.status(401).send('Invalid Token');
    }
}

