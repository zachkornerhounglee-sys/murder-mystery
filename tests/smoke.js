// Run: node tests/smoke.js [path/to/index.html]
const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync(process.argv[2]||'index.html','utf8');
const src=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).sort((a,b)=>b.length-a.length)[0];
process.on('unhandledRejection',()=>{});
const mk=()=>{const st={},f=function(){};return new Proxy(f,{get:(t,k)=>{if(k===Symbol.toPrimitive)return()=>0;if(k==='then')return undefined;if(!(k in st))st[k]=mk();return st[k]},set:(t,k,v)=>{st[k]=v;return true},apply:()=>mk(),construct:()=>mk()})};
const res=[];const sb={THREE:mk(),document:mk(),window:mk(),navigator:mk(),Peer:mk(),AudioContext:mk(),Image:mk(),FileReader:mk(),Blob:mk(),indexedDB:mk(),
 localStorage:{getItem:()=>null,setItem(){}},location:{href:'http://x/',search:'',hash:''},innerWidth:1280,innerHeight:720,devicePixelRatio:1,performance,console,
 setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,requestAnimationFrame:()=>0,addEventListener(){},fetch:()=>Promise.reject(new Error('offline')),URL,
 __mk:mk,__t:(n,ok,info)=>res.push([n,!!ok,info||''])};
const tests=`
let tLAST=null;showOver=d=>{tLAST=d;G.state='over'};
const mkPl=(id,role,x,z)=>({id,conn:null,x,z,ry:0,m:0,a:1,role,ready:true,k:0,name:'P'+id,ms:{st:'ok'}});
function tSetup(){G.state='play';G.net='host';G.test=0;players=new Map([[0,mkPl(0,'sheriff',0,0)],[1,mkPl(1,'murderer',10,0)],[2,mkPl(2,'murderer',20,0)]]);me=players.get(0);sheriffId=0;C=[];V={c:[],p:{0:__mk(),1:__mk(),2:__mk()}};ROOM.strikes=0;ROOM.ks=0;ROOM.kd=0;ROOM.time=0;ROOM.as=0;G.tEnd=0;STK=0;tLAST=null;tickN=0;HIST=[];LQ=[];seqN=0}
const TT=(n,f)=>{try{tSetup();const r=f();__t(n,r!==false,'')}catch(e){__t(n,false,String(e&&e.message||e))}};
TT('drop: one of two murderers leaves -> game continues',()=>{drop(2);return G.state==='play'});
TT('drop: last murderer leaves -> sheriff wins',()=>{drop(1);drop(2);return tLAST&&tLAST.win==='sheriff'});
TT('drop: sheriff leaves -> murderers win',()=>{drop(0);return tLAST&&tLAST.win==='murderer'});
TT('idle clients are not dropped at round start (regression)',()=>{players.get(1).seen=performance.now()-60000;players.get(2).seen=performance.now()-60000;hostTick();return players.size===3&&G.state==='play'});
TT('timer expiry -> sheriff wins',()=>{ROOM.time=1;G.tEnd=performance.now()-5;hostTick();return tLAST&&tLAST.win==='sheriff'});
TT('points are awarded when a round ends',()=>{drop(0);return players.get(1).pts>0});
TT('sheriff shooting a murderer: round continues while one is left',()=>{players.get(1).x=5;doShoot(0,Math.PI/2,0);return players.get(1).a===0&&G.state==='play'});
TT('sheriff shooting the last murderer -> sheriff wins',()=>{drop(2);players.get(1).x=5;doShoot(0,Math.PI/2,0);return tLAST&&tLAST.win==='sheriff'});
TT('murderer cannot kill sheriff by default',()=>{players.get(1).x=1;doStab(1,-Math.PI/2,0);return players.get(0).a===1&&G.state==='play'});
TT('murderer can kill sheriff when enabled',()=>{ROOM.ks=1;G.t0=0;players.get(1).x=1;doStab(1,-Math.PI/2,0);return tLAST&&tLAST.win==='murderer'});
TT('sheriff kill setting respects the delay',()=>{ROOM.ks=1;ROOM.kd=60;G.t0=performance.now();players.get(1).x=1;doStab(1,-Math.PI/2,0);return players.get(0).a===1});
TT('shooting the deputy is a mistake (0 allowed -> murderers win)',()=>{players.get(1).role='deputy';players.get(1).x=5;doShoot(0,Math.PI/2,0);return tLAST&&tLAST.win==='murderer'});
TT('snapshots: far NPCs are throttled per client, near NPCs and players always sent',()=>{simCivs=()=>{};const sent=[];players.get(1).conn={open:true,send:d=>sent.push(d)};players.get(1).x=10;players.get(1).z=0;
 C=[{x:14,z:0,ry:0,m:1,a:1,panic:0},{x:300,z:0,ry:0,m:1,a:1,panic:0}];V.c=[__mk(),__mk()];tickN=3;hostTick();
 const dv=new DataView(sent.find(d=>typeof d!=='string')),n=dv.getUint16(5),ids=[];for(let i=0;i<n;i++)ids.push(dv.getUint16(7+i*8));return ids.includes(0)&&!ids.includes(1)&&ids.includes(1000)&&ids.includes(1001)});
TT('snapshots: everything is resent on the periodic full tick',()=>{simCivs=()=>{};const sent=[];players.get(1).conn={open:true,send:d=>sent.push(d)};players.get(1).x=10;
 C=[{x:14,z:0,ry:0,m:1,a:1,panic:0},{x:300,z:0,ry:0,m:1,a:1,panic:0}];V.c=[__mk(),__mk()];tickN=20;hostTick();return new DataView(sent.find(d=>typeof d!=='string')).getUint16(5)>=4});
`;
const ctx=vm.createContext(sb);
try{vm.runInContext(src+'\n'+tests,ctx,{filename:'game'})}catch(e){res.push(['script loads and runs tests',false,String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')])}
let bad=0;for(const[n,ok,i]of res){console.log((ok?'PASS':'FAIL')+'  '+n+(i?'  -> '+i:''));if(!ok)bad++}
console.log(bad?bad+' failed':'all '+res.length+' passed');process.exit(bad?1:0);
