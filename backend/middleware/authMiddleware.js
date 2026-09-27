import jwt from 'jsonwebtoken';
const JWT_SECRET=process.env.JWT_SECRET||'hackathon_campus_to_corporate_jwt_secret_2026';
export const verifyToken=(req,res,next)=>{
 const authHeader=req.headers['authorization'];
 const token=authHeader&&authHeader.split(' ')[1];
 if(!token)return res.status(401).json({success:false,error:'Access denied. No JWT token provided.'});
 try{req.user=jwt.verify(token,JWT_SECRET);next();}
 catch(err){return res.status(403).json({success:false,error:'Invalid or expired JWT token.'});}
};