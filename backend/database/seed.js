import { randomUUID } from 'node:crypto';
import { hashPassword } from '../security/password.js';
import { readDatabase,writeDatabase } from './store.js';

const baseSkills=[{name:'Data Structures & Algorithms',level:75,category:'Core CS'},{name:'Java / Python',level:70,category:'Languages'},{name:'SQL & Databases',level:65,category:'Backend'},{name:'REST APIs',level:60,category:'Backend'},{name:'Git & Version Control',level:75,category:'Tools'}];

export async function seedDatabase(){
 const db=await readDatabase();
 if(db.users.length>0)return db;
 if(process.env.NODE_ENV==='production'&&process.env.SEED_DEMO_USERS!=='true')return db;
 const studentPassword=process.env.DEMO_STUDENT_PASSWORD||'password123';
 const adminPassword=process.env.DEMO_ADMIN_PASSWORD||'admin123';
 const [studentHash,adminHash]=await Promise.all([hashPassword(studentPassword),hashPassword(adminPassword)]);
 db.users=[
  {id:'usr_rohan',name:'Rohan Sharma',email:'rohan@campus.edu',passwordHash:studentHash,role:'student',degree:'B.Tech in Computer Science & Engineering',year:'Final Year (8th Sem)',cgpa:'8.4 / 10',targetRole:'Software Engineer (Backend)',skills:baseSkills,academicHistory:[],resumeText:''},
  {id:'usr_sarah',name:'Sarah Jenkins',email:'sarah@campus.edu',passwordHash:studentHash,role:'student',degree:'B.S. in Data Science & Machine Learning',year:'Senior Year',cgpa:'9.1 / 10',targetRole:'Data Scientist / AI Engineer',skills:baseSkills,academicHistory:[],resumeText:''},
  {id:'usr_admin',name:'Placement Administrator',email:'admin@college.edu',passwordHash:adminHash,role:'admin',degree:'Ph.D. in Computer Science',year:'Faculty Administrator',cgpa:'N/A',targetRole:'College Placement Administrator',skills:[],academicHistory:[],resumeText:''}
 ];
 return writeDatabase(db);
}
export function sanitizeUser(user){if(!user)return null;const{passwordHash,...safe}=user;return safe;}
export function newUserId(){return `usr_${randomUUID()}`;}
