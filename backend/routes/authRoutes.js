import express from 'express';
import jwt from 'jsonwebtoken';
import { readDatabase,updateDatabase } from '../database/store.js';
import { newUserId,sanitizeUser,seedDatabase } from '../database/seed.js';
import { hashPassword,verifyPassword } from '../security/password.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { rateLimit } from '../middleware/rateLimiter.js';

const router=express.Router();
const JWT_SECRET=process.env.JWT_SECRET;
const JWT_ISSUER=process.env.JWT_ISSUER||'campus-to-corporate';
const JWT_AUDIENCE=process.env.JWT_AUDIENCE||'c2c-web';
const COOKIE_NAME='c2c_session';
const COOKIE_MAX_AGE=60*60*1000;
if(!JWT_SECRET&&process.env.NODE_ENV==='production')throw new Error('JWT_SECRET must be configured in production.');
const signingSecret=JWT_SECRET||'development-only-change-me';
const authLimiter=rateLimit({windowMs:15*60*1000,max:10});

function cookieOptions(){const sameSite=process.env.COOKIE_SAME_SITE||'lax';const secure=process.env.COOKIE_SECURE==='true'||process.env.NODE_ENV==='production';return `Path=/; Max-Age=${COOKIE_MAX_AGE/1000}; HttpOnly; SameSite=${sameSite}${secure?'; Secure':''}`;}
function setSessionCookie(res,token){res.setHeader('Set-Cookie',`${COOKIE_NAME}=${encodeURIComponent(token)}; ${cookieOptions()}`);}
function clearSessionCookie(res){res.setHeader('Set-Cookie',`${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=lax`);}
function issueToken(user){return jwt.sign({sub:user.id,role:user.role},signingSecret,{expiresIn:'1h',issuer:JWT_ISSUER,audience:JWT_AUDIENCE});}
function emailIsValid(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);}

await seedDatabase();

router.post('/register',authLimiter,async(req,res)=>{
 const{name,email,password,targetRole,degree,cgpa}=req.body||{};
 if(!name||!email||!password)return res.status(400).json({success:false,error:'Name, email, and password are required.'});
 if(!emailIsValid(email))return res.status(400).json({success:false,error:'Please provide a valid email address.'});
 if(String(password).length<8)return res.status(400).json({success:false,error:'Password must contain at least 8 characters.'});
 const db=await readDatabase();
 if(db.users.some(user=>user.email.toLowerCase()===email.toLowerCase()))return res.status(409).json({success:false,error:'User with this email already exists.'});
 const user={id:newUserId(),name:String(name).trim(),email:email.toLowerCase().trim(),passwordHash:await hashPassword(password),role:'student',degree:degree||'B.Tech in Computer Science',year:'Final Year',cgpa:cgpa||'8.0 / 10',targetRole:targetRole||'Software Engineer (Backend)',skills:[],academicHistory:[],resumeText:''};
 await updateDatabase(current=>({...current,users:[...current.users,user]}));
 setSessionCookie(res,issueToken(user));
 return res.status(201).json({success:true,user:sanitizeUser(user)});
});

router.post('/login',authLimiter,async(req,res)=>{
 const{email,password}=req.body||{};
 const db=await readDatabase();
 const user=db.users.find(candidate=>candidate.email===String(email||'').toLowerCase().trim());
 if(!user||!(await verifyPassword(String(password||''),user.passwordHash)))return res.status(401).json({success:false,error:'Invalid credentials provided.'});
 setSessionCookie(res,issueToken(user));
 return res.json({success:true,user:sanitizeUser(user)});
});

router.post('/logout',(req,res)=>{clearSessionCookie(res);res.json({success:true});});

router.patch('/profile',verifyToken,async(req,res)=>{
 const allowed=['name','degree','year','cgpa','targetRole','skills','academicHistory','resumeText'];
 const updates=Object.fromEntries(Object.entries(req.body||{}).filter(([key])=>allowed.includes(key)));
 const db=await readDatabase();
 const user=db.users.find(candidate=>candidate.id===req.user.sub);
 if(!user)return res.status(404).json({success:false,error:'User not found.'});
 Object.assign(user,updates);
 await updateDatabase(()=>db);
 return res.json({success:true,user:sanitizeUser(user)});
});

router.get('/verify',verifyToken,async(req,res)=>{
 const db=await readDatabase();
 const user=db.users.find(candidate=>candidate.id===req.user.sub);
 if(!user)return res.status(404).json({success:false,error:'User not found.'});
 return res.json({success:true,valid:true,user:sanitizeUser(user)});
});

router.get('/personas',verifyToken,requireRole('admin'),async(req,res)=>{
 const db=await readDatabase();
 return res.json({success:true,users:db.users.map(sanitizeUser)});
});

export default router;
