import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const DATA_DIR=path.join(ROOT,'data');
const DB_FILE=path.join(DATA_DIR,'database.json');
const EMPTY_DB={version:1,users:[],opportunities:[],resumeReviews:[]};
let cache=null;
let writeQueue=Promise.resolve();

async function ensureDatabase(){await fs.mkdir(DATA_DIR,{recursive:true});try{await fs.access(DB_FILE);}catch{await fs.writeFile(DB_FILE,JSON.stringify(EMPTY_DB,null,2),'utf8');}}
export async function readDatabase(){if(cache)return structuredClone(cache);await ensureDatabase();cache=JSON.parse(await fs.readFile(DB_FILE,'utf8'));return structuredClone(cache);}
export async function writeDatabase(next){cache=structuredClone(next);writeQueue=writeQueue.then(async()=>{await ensureDatabase();const temp=`${DB_FILE}.tmp`;await fs.writeFile(temp,JSON.stringify(cache,null,2),'utf8');await fs.rename(temp,DB_FILE);});await writeQueue;return structuredClone(cache);}
export async function updateDatabase(mutator){const current=await readDatabase();const next=await mutator(current);return writeDatabase(next||current);}
export const databasePath=DB_FILE;
