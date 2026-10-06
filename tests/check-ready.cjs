const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const app=path.resolve(__dirname,'../app');
let now=new Date('2026-10-05T12:00:00'),memory=new Map();
class ClockDate extends Date {constructor(...args){super(...(args.length?args:[now.getTime()]));}static now(){return now.getTime();}}
class Element{
 constructor(attrs={}){this.attrs=attrs;this.value=attrs.value||'';this.dataset={};for(const [k,v] of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5)]=v;this.checked='checked' in attrs;this.disabled='disabled' in attrs;this.textContent='';this.classList={add(){},remove(){}};this._html='';}
 set innerHTML(s){this._html=s;const list=[];for(const match of s.matchAll(/<(input|button|select|option)[^>]*>/g)){const attrs={};for(const a of match[0].matchAll(/([\w-]+)(?:="([^"]*)")?/g))attrs[a[1]]=a[2]||'';const el=new Element(attrs);list.push(el);if(attrs.id)document.ids.set(attrs.id,el);}document.dynamic.set(this,list);}
 get innerHTML(){return this._html;}
 checkValidity(){const n=Number(this.value);return this.attrs.type!=='number'||(this.value!==''&&Number.isFinite(n)&&(!this.attrs.min||n>=Number(this.attrs.min))&&(!this.attrs.max||n<=Number(this.attrs.max)));}
 reportValidity(){return true;}addEventListener(){}scrollIntoView(){}reset(){}click(){if(this.onclick)this.onclick();}
}
const document={ids:new Map(),dynamic:new Map(),hidden:false,
 querySelector(s){if(s.startsWith('#'))return this.ids.get(s.slice(1));return this.querySelectorAll(s)[0];},
 querySelectorAll(s){if(!s.startsWith('[data-'))return [];const match=s.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);return [...this.dynamic.values()].flat().filter(e=>match[1] in e.attrs&&(match[2]===undefined||e.attrs[match[1]]===match[2]));},
 addEventListener(){},createElement(){return new Element();}
};
for(const m of fs.readFileSync(path.join(app,'index.html'),'utf8').matchAll(/id="([^"]+)"/g))document.ids.set(m[1],new Element());
const context=vm.createContext({document,Date:ClockDate,structuredClone,crypto:require('crypto').webcrypto,Blob,URL,setTimeout,clearInterval,setInterval,requestAnimationFrame(){},cancelAnimationFrame(){},navigator:{},prompt(){},location:{reload(){}},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)}});
context.window=context;
const run=s=>vm.runInContext(s,context);
for(const f of ['program.js','app.js','ready.js'])run(fs.readFileSync(path.join(app,f),'utf8'));
assert.equal(run('BAMF.length'),7);assert(run('BAMF.every(day=>day.exercises.every(ex=>ex.weeks.length===8))'));
assert.equal(run('session().sets["Push ups"].length'),3,'three programmed set fields');
assert.equal(run('session().sets["Chest fly machine"].length'),3);
assert.equal(run('getRecipe(READY_MEALS[1]).name'), 'Chicken + rice + vegetables');
assert.equal(run('getRecipe(READY_MEALS[2]).name'), 'Chicken + rice + vegetables');
const click=s=>{const b=document.querySelector(s);assert(b,'missing '+s);b.onclick();};
click('[data-logmeal="breakfast"]');
assert.equal(run('entries().length'),2);assert.equal(run('total("calories")'),225);assert.equal(run('total("protein")'),25.3);
assert(run('entries().every(x=>x.estimated===true)'));
click('[data-logmeal="lunch"]');assert.equal(run('total("calories")'),770);
for(const [selector,value] of [['[data-weight="0:0"]','25'],['[data-reps="0:0"]','12']]){const input=document.querySelector(selector);input.value=value;input.onchange();}
const done=document.querySelector('[data-done="0:0"]');done.checked=true;done.onchange();
assert.equal(JSON.parse(memory.get('lockin-v02')).builder.sessions['2026-10-05|1|0'].sets['Push ups'][0].weight,25);
document.ids.get('completeWorkout').onclick();assert.equal(run('session().completed'),true);
const xp=run('state.xp');document.ids.get('completeWorkout').onclick();assert.equal(run('state.xp'),xp,'XP is not duplicated');
run('readyWeek=5;readyDay=0;render();');assert.equal(run('session().sets["Chest fly machine"].length'),4,'week 5 set progression');
run('readyWeek=3;readyDay=1;render();');assert.equal(run('BAMF[1].exercises.find(e=>e.name==="Front squat").weeks[2]'),null,'blank prescription preserved');
run('readyWeek=1;readyDay=0;render(); document.querySelector("#weightUnit").value="kg"; document.querySelector("#weightUnit").onchange({target:document.querySelector("#weightUnit")});');
assert.equal(run('session().sets["Push ups"][0].weight'),11.34,'unit conversion preserves load');
click('[data-food="built"]');assert.equal(document.ids.get('foodCarbs').value,'','missing bar macros stay empty');
document.ids.get('foodCarbs').value='35';document.ids.get('foodFat').value='5';document.ids.get('saveFoodValues').onclick();
assert.equal(run('foodById("built").requiresLabel'),false);
run('state.builder.mealChoices.sweet="puffFruit";render();');click('[data-logmeal="sweet"]');
assert(run('entries().some(e=>e.name.includes("BUILT")&&!e.estimated)'),'saved label values reused');
run('clearFood()');assert.equal(run('activeReadyFood'),null,'barcode/manual entry cannot overwrite previous food preset');
run('selectedBarcode="123456789012";');
document.ids.get('foodName').value='My scanned food';
document.ids.get('foodAmount').value='100';document.ids.get('foodCalories').value='200';document.ids.get('foodProtein').value='20';document.ids.get('foodCarbs').value='10';document.ids.get('foodFat').value='5';
document.ids.get('saveFoodValues').onclick();assert.equal(run('foodById("custom-123456789012").name'),'My scanned food','scanned food can be saved and reused');
const snapshot=JSON.parse(memory.get('lockin-v02'));
assert.equal(snapshot.builder.sessions['2026-10-05|1|0'].sets['Push ups'][0].reps,'12');
now=new Date('2026-10-06T12:00:00');run('render()');assert.equal(run('readyDay'),1,'schedule advances next day');assert.equal(run('entries().length'),0,'new day has separate food log');assert.equal(run('state.foodLogs["2026-10-05"].length'),7);
run('state.builder.mealChoices.sweet="puffFruit";render();');
(async()=>{
 const backup={app:'lockin-ready',version:1,state:JSON.parse(memory.get('lockin-v02'))};
 await document.ids.get('importData').onchange({target:{files:[{size:10000,text:async()=>JSON.stringify(backup)}]}});
 assert.equal(document.ids.get('backupStatus').textContent,'','own backup passes validation');
 assert(memory.has('lockin-before-restore'),'restore retains previous state');
 console.log('PASS: 8-week prescriptions, set fields, food totals, saved labels, session persistence, unit conversion, daily rollover, duplicate XP protection, backup restore.');
})().catch(e=>{console.error(e);process.exitCode=1});

