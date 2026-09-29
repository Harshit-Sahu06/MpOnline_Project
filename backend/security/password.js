import { randomBytes,scrypt as scryptCallback,timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt=promisify(scryptCallback);
const KEY_LENGTH=64;
export async function hashPassword(password){const salt=randomBytes(16).toString('hex');const derived=await scrypt(password,salt,KEY_LENGTH);return `scrypt$${salt}$${Buffer.from(derived).toString('hex')}`;}
export async function verifyPassword(password,encoded){if(!encoded?.startsWith('scrypt$'))return false;const[,salt,expectedHex]=encoded.split('$');try{const actual=Buffer.from(await scrypt(password,salt,KEY_LENGTH));const expected=Buffer.from(expectedHex,'hex');return expected.length===actual.length&&timingSafeEqual(expected,actual);}catch{return false;}}
