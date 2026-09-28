import express from 'express';
const router=express.Router();
const JOBS=[
{id:'j1',title:'Junior Backend Engineer',company:'CloudScale Technologies',location:'Remote / Bengaluru, KA',type:'Full-Time',salary:'₹10,00,000 - ₹14,00,000 / yr',matchScore:92,requirements:['REST APIs','Node.js/Python','SQL','Git']},
{id:'j2',title:'Software Engineering Intern',company:'DataDrive Labs',location:'Gurugram, HR (Hybrid)',type:'Internship',salary:'₹35,000 / month',matchScore:88,requirements:['Data Structures','Java or Python','Basic SQL']},
{id:'j3',title:'Associate Cloud & DevOps Specialist',company:'Nexus Infrastructure',location:'Pune, MH / Hyderabad',type:'Full-Time',salary:'₹8,50,000 - ₹12,00,000 / yr',matchScore:74,requirements:['Linux','Docker','Git','CI/CD fundamentals']}
];
const GOVT_SCHEMES=[
{id:'g1',title:'National Digital Talent Apprenticeship Program',agency:'Department of Education & Technology',stipend:'₹25,000 / month',duration:'12 Months',eligibility:'Final year students & fresh graduates in CS/IT/STEM',deadline:'Oct 30, 2026',category:'Apprenticeship'},
{id:'g2',title:'MP Rojgar Digital Apprenticeship Initiative',agency:'Government of Madhya Pradesh',stipend:'₹15,000 / month',duration:'6 Months',eligibility:'Graduates from MP State Recognized Colleges',deadline:'Nov 15, 2026',category:'State Apprenticeship'}
];
router.get('/jobs',(req,res)=>res.json({success:true,jobs:JOBS}));
router.get('/govt-schemes',(req,res)=>res.json({success:true,schemes:GOVT_SCHEMES}));
export default router;