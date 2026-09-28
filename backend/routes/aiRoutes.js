import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();
let genAI = null;
if (process.env.GEMINI_API_KEY) genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/analyze-profile', async (req, res) => {
  const { profileText, targetRole, userApiKey } = req.body;
  const activeGenAI = userApiKey ? new GoogleGenAI({ apiKey: userApiKey }) : genAI;
  if (activeGenAI) {
    try {
      const response = await activeGenAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert AI Career Counselor. Analyze this student for target role "${targetRole}". Student details: ${profileText}. Return ONLY valid JSON with employabilityScore, overallSummary, keyStrengths, skillGaps [{skill,currentLevel,requiredLevel,urgency,recommendation}], and personalizedRoadmap [{phase,timeframe,focusArea,actionItems}].`
      });
      const match = response.text.match(/\{[\s\S]*\}/);
      if (match) return res.json({ success:true, data:JSON.parse(match[0]), source:'gemini-api' });
    } catch (err) { console.warn('Gemini profile analysis failed:', err.message); }
  }
  res.json({ success:true, source:'simulated-engine', data:{
    employabilityScore:78,
    overallSummary:`Analyzed readiness for ${targetRole}. Strong core CS fundamentals with identified gaps in system design and DevOps.`,
    keyStrengths:['DSA and problem solving','SQL and REST APIs','Core CS academics'],
    skillGaps:[
      {skill:'System Design & Distributed Architecture',currentLevel:40,requiredLevel:80,urgency:'High',recommendation:'Learn load balancing, caching, database sharding and message queues.'},
      {skill:'Docker & Kubernetes',currentLevel:35,requiredLevel:70,urgency:'High',recommendation:'Containerize applications and practice Kubernetes deployment manifests.'}
    ],
    personalizedRoadmap:[
      {phase:'Phase 1: Foundation Strengthening',timeframe:'Weeks 1 - 4',focusArea:'System Design & Cloud Basics',actionItems:['Complete a system design course','Build a multi-container Docker application']},
      {phase:'Phase 2: Project & ATS Enhancement',timeframe:'Weeks 5 - 8',focusArea:'Microservices & Portfolio',actionItems:['Refactor an API into services','Optimize resume bullet points']}
    ]
  }});
});

router.post('/review-resume', async (req, res) => {
  const { resumeText, targetRole, userApiKey } = req.body;
  const activeGenAI = userApiKey ? new GoogleGenAI({ apiKey:userApiKey }) : genAI;
  if (activeGenAI) {
    try {
      const response = await activeGenAI.models.generateContent({
        model:'gemini-2.5-flash',
        contents:`Analyze this resume for target role "${targetRole}". Return ONLY JSON with atsScore, formattingRating, missingKeywords and improvements [{original,suggested,reason}]. Resume: ${resumeText}`
      });
      const match=response.text.match(/\{[\s\S]*\}/);
      if(match) return res.json({success:true,data:JSON.parse(match[0])});
    } catch(err){ console.warn('Resume review fallback:',err.message); }
  }
  res.json({success:true,data:{atsScore:75,formattingRating:'Good',missingKeywords:['CI/CD','Kubernetes','System Design','Unit Testing','Redis'],improvements:[{original:'Built REST API in Express and PostgreSQL.',suggested:'Engineered a scalable REST API with measurable performance and caching.',reason:'Adds impact and technical specificity.'}]}});
});
export default router;