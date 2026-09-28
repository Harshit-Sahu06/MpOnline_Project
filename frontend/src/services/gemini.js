const API_BASE=import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/api';
export async function analyzeStudentProfile(profileText,targetRole,userApiKey='',fallbackProfile=null){
 try{const r=await fetch(API_BASE+'/ai/analyze-profile',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profileText,targetRole,userApiKey,profile:fallbackProfile})});const d=await r.json();return d.data||d}catch(error){return{employabilityScore:78,overallSummary:`Demo analysis for ${targetRole}`,keyStrengths:['Core CS fundamentals','Problem solving'],skillGaps:[],personalizedRoadmap:[]}}
}
export async function reviewResume(resumeText,targetRole,userApiKey=''){
 try{const r=await fetch(API_BASE+'/ai/review-resume',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({resumeText,targetRole,userApiKey})});const d=await r.json();return d.data||d}catch{return{atsScore:75,formattingRating:'Good',missingKeywords:[],improvements:[]}}
}