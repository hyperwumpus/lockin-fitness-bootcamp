'use strict';
const Builder = (() => {
 const dateKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const numeric=v=>v!==null&&v!==''&&Number.isFinite(Number(v))&&Number(v)>=0;
 const macros=items=>items.reduce((sum,f)=>{for(const k of ['c','p','carb','f'])sum[k]+=Number(f[k]||0)*Number(f.qty??1);return sum},{c:0,p:0,carb:0,f:0});
 const count=rx=>{const m=String(rx||'').match(/^(\d+)\s*[×x]/);return m?Math.min(20,Number(m[1])):1};
 function schedule(start,day=dateKey()) {const delta=Math.floor((Date.parse(day+'T12:00:00Z')-Date.parse(start+'T12:00:00Z'))/86400000);return {week:Math.max(1,Math.min(8,Math.floor(Math.max(0,delta)/7)+1)),day:Math.max(0,delta)%7,finished:delta>=56,upcoming:delta<0};}
 function fresh(){return {schema:1,start:dateKey(),run:'run-'+Date.now(),unit:'lb',targets:{c:'',p:''},sessions:{},logs:{},foods:[],weights:[],photos:[],archives:[],custom:null,reminder:'18:00'};}
 function validate(s,defaultDays){
  if(!s||s.schema!==1||!/^\d{4}-\d{2}-\d{2}$/.test(s.start)||!Number.isFinite(Date.parse(s.start))||typeof s.run!=='string'||!['lb','kg'].includes(s.unit))throw Error('This is not a Builder backup.');
  for(const k of ['foods','weights','photos','archives'])if(!Array.isArray(s[k]))throw Error('Backup is missing '+k);
  if(!s.sessions||Array.isArray(s.sessions)||typeof s.sessions!=='object'||!s.logs||Array.isArray(s.logs)||typeof s.logs!=='object'||!s.targets)throw Error('Invalid tracking data.');
  for(const list of Object.values(s.logs)){if(!Array.isArray(list)||list.some(f=>typeof f.name!=='string'||!['c','p','carb','f','qty'].every(k=>numeric(f[k]))))throw Error('Invalid food logs.');}
  for(const f of s.foods)if(typeof f.name!=='string'||!['c','p','carb','f'].every(k=>numeric(f[k])))throw Error('Invalid saved food.');
  const checkSession=session=>session&&typeof session.name==='string'&&Number.isInteger(session.week)&&session.week>=1&&session.week<=8&&Number.isInteger(session.day)&&session.day>=0&&session.day<7&&typeof session.date==='string'&&typeof session.complete==='boolean'&&Array.isArray(session.exercises)&&session.exercises.every(e=>typeof e.name==='string'&&Array.isArray(e.sets)&&e.sets.length>=1&&e.sets.length<=20&&e.sets.every(x=>numeric(x.kg)&&numeric(x.reps)&&typeof x.done==='boolean'));
  for(const session of Object.values(s.sessions))if(!checkSession(session))throw Error('Invalid workout logs.');
  if(s.weights.some(w=>!numeric(w.kg)||typeof w.date!=='string'))throw Error('Invalid weight records.');
  if(s.photos.some(p=>typeof p.data!=='string'||!/^data:image\/(jpeg|png|webp);base64,/.test(p.data)))throw Error('Invalid photo records.');
  if(s.custom) s.custom=program(s.custom);
  const days=s.custom?.days||defaultDays;
  if(days)for(const session of Object.values(s.sessions))if(session.exercises.length!==days[session.day].exercises.length||session.exercises.some((e,i)=>e.name!==days[session.day].exercises[i].name))throw Error('Workout records do not match the program.');
  for(const a of s.archives)if(!a||typeof a.name!=='string'||typeof a.start!=='string'||typeof a.end!=='string'||!a.sessions||!Object.values(a.sessions).every(checkSession))throw Error('Invalid archived run.');
  return s;
 }
 function program(raw){
  if(!raw||typeof raw.name!=='string'||!raw.name.trim()||!Array.isArray(raw.days)||raw.days.length<1||raw.days.length>7)throw Error('Use a name and 1–7 days.');
  const days=raw.days.map(d=>{if(typeof d.name!=='string'||!Array.isArray(d.exercises)||d.exercises.length>30)throw Error('Each day needs a name and exercises.');return {name:d.name.slice(0,100),exercises:d.exercises.map(e=>{
   if(typeof e.name!=='string'||!e.name.trim())throw Error('Each exercise needs a name.');
   const weeks=Array.isArray(e.weeks)?e.weeks:Array(8).fill(e.prescription??null);
   if(weeks.length!==8||weeks.some(w=>w!==null&&typeof w!=='string'))throw Error('Provide eight weekly prescriptions, or one prescription.');
   return {name:e.name.slice(0,120),weeks:weeks.map(w=>w?.slice(0,150)??null),note:String(e.note||'').slice(0,500)};
  })}});
  while(days.length<7)days.push({name:'Recovery / Rest',exercises:[]});return {name:raw.name.slice(0,100),days};
 }
 const toKg=(value,unit)=>Number(value)/(unit==='lb'?2.2046226218:1);
 const display=(kg,unit)=>Math.round(kg*(unit==='lb'?2.2046226218:1)*10)/10;
 return {dateKey,esc,numeric,macros,count,schedule,fresh,validate,program,toKg,display};
})();
if(typeof module!=='undefined')module.exports=Builder;
