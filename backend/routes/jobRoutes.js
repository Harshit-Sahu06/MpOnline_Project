import express from 'express';
import { getVerifiedOpportunities } from '../services/opportunitySources.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router=express.Router();
let cache={at:0,payload:null};
const CACHE_MS=10*60*1000;
async function load(){if(cache.payload&&Date.now()-cache.at<CACHE_MS)return cache.payload;const payload=await getVerifiedOpportunities();cache={at:Date.now(),payload};return payload;}

router.get('/jobs',verifyToken,async(req,res)=>{const payload=await load();return res.json({success:true,jobs:payload.jobs,source:payload.source,freshness:payload.source.fetchedAt});});
router.get('/govt-schemes',verifyToken,async(req,res)=>{const payload=await load();const schemes=payload.jobs.map(job=>({...job,category:job.type||'Government Opportunity',agency:job.company,stipend:'See official notice',duration:'See official notice',eligibility:'See official notice',deadline:'See official notice'}));return res.json({success:true,schemes,source:payload.source,freshness:payload.source.fetchedAt});});
router.get('/sources',verifyToken,async(req,res)=>{const payload=await load();return res.json({success:true,sources:[payload.source]});});
export default router;
