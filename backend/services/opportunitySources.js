const NCS_URL='https://ncs.gov.in/latest-update';
const SOURCE_TIMEOUT_MS=8000;
function clean(value=''){return value.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
async function fetchNcsJobs(){
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),SOURCE_TIMEOUT_MS);
 try{
  const response=await fetch(NCS_URL,{signal:controller.signal,headers:{'User-Agent':'CampusToCorporate/1.0'}});
  if(!response.ok)throw new Error(`NCS responded ${response.status}`);
  const html=await response.text();
  const rows=[...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>m[1]);
  const jobs=rows.map(row=>{const cells=[...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>clean(m[1]));if(cells.length<4||/organization/i.test(cells[0]))return null;return{id:`ncs-${Buffer.from(cells.join('|')).toString('base64url').slice(0,20)}`,title:cells[1],company:cells[0],location:'India',type:cells[5]||'Government Opportunity',salary:'See official notice',matchScore:null,requirements:[],source:'National Career Service (NCS)',sourceUrl:NCS_URL,verified:true,fetchedAt:new Date().toISOString(),postingDate:cells[2],vacancy:cells[3],link:cells[6]?.match(/href=["']([^"']+)/i)?.[1]||NCS_URL};}).filter(Boolean).slice(0,50);
  return{jobs,source:{id:'ncs',name:'National Career Service',url:NCS_URL,verified:true,fetchedAt:new Date().toISOString()}};
 }finally{clearTimeout(timer);}
}
export async function getVerifiedOpportunities(){try{return await fetchNcsJobs();}catch(error){return{jobs:[],source:{id:'ncs',name:'National Career Service',url:NCS_URL,verified:true,fetchedAt:new Date().toISOString(),error:error.message}};}}
