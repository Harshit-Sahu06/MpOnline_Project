const API_BASE=import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/api';
const saveSession=(user,token)=>{localStorage.setItem('c2c_user',JSON.stringify(user));localStorage.setItem('c2c_token',token)};
export const registerUser=async(name,email,password,targetRole,degree,cgpa)=>{
 try{const r=await fetch(API_BASE+'/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password,targetRole,degree,cgpa})});const d=await r.json();if(d.success)saveSession(d.user,d.token);return d}catch(error){return{success:false,error:'Backend unavailable. Start the backend server first.'}}
};
export const loginUser=async(email,password)=>{
 try{const r=await fetch(API_BASE+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});const d=await r.json();if(d.success)saveSession(d.user,d.token);return d}catch(error){return{success:false,error:'Backend unavailable. Start the backend server first.'}}
};
export const logoutSession=()=>{localStorage.removeItem('c2c_user');localStorage.removeItem('c2c_token')};
export const getStoredSession=()=>{try{return{user:JSON.parse(localStorage.getItem('c2c_user')||'null'),token:localStorage.getItem('c2c_token')}}catch{return{user:null,token:null}}};
export const verifySession=async()=>{const {token}=getStoredSession();if(!token)return{success:false};try{const r=await fetch(API_BASE+'/auth/verify',{headers:{Authorization:`Bearer ${token}`}});return await r.json()}catch{return{success:false}}};