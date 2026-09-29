import pdfParse from 'pdf-parse';

const MAX_PDF_BYTES=5*1024*1024;
export async function parseResumePdf(buffer){
 if(!Buffer.isBuffer(buffer)||buffer.length===0)throw new Error('Empty PDF file.');
 if(buffer.length>MAX_PDF_BYTES)throw new Error('PDF exceeds the 5 MB upload limit.');
 const parsed=await pdfParse(buffer);
 const text=parsed.text.replace(/\u0000/g,'').trim();
 if(!text)throw new Error('No readable text was found in the PDF.');
 return{text,pages:parsed.numpages,info:parsed.info||{}};
}
