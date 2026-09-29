import jwt from 'jsonwebtoken';
const JWT_SECRET=process.env.JWT_SECRET||'development-only-change-me';
const JWT_ISSUER=process.env.JWT_ISSUER||'campus-to-corporate';
const JWT_AUDIENCE=process.env.JWT_AUDIENCE||'c2c-web';
const COOKIE_NAME='c2c_session';
function getCookie(req,name){const header=req.headers.cookie||'';const item=header.split(';').map(part=>part.trim()).find(part=>part.startsWith(`${name}=`));return item?decodeURIComponent(item.slice(name.length+1)):null;}
export const verifyToken=(req,res,next)=>{const bearer=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):null;const token=getCookie(req,COOKIE_NAME)||bearer;if(!token)return res.status(401).json({success:false,error:'Authentication required.'});try{req.user=jwt.verify(token,JWT_SECRET,{issuer:JWT_ISSUER,audience:JWT_AUDIENCE});next();}catch{return res.status(403).json({success:false,error:'Invalid or expired session.'});}};
