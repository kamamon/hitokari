'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const base=process.cwd(),mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
function server(){return http.createServer((req,res)=>{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/,'')||'index.html';const file=path.resolve(base,name);if(!file.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(e,data)=>{if(e){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data);});});}
async function serve(){const s=server();await new Promise(r=>s.listen(0,'127.0.0.1',r));return {url:'http://127.0.0.1:'+s.address().port+'/',close:()=>s.close()};}
function report(name,data){fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/'+name+'.json',JSON.stringify(data,null,2));console.log(name,JSON.stringify(data));}
module.exports={serve,report};