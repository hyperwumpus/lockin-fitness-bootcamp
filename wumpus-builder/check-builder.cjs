const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const base=path.resolve(process.argv[2]||path.join(__dirname,'source/app'));
const B=require(path.join(base,'engine.js'));
assert.equal(B.schedule('2026-10-05','2026-10-05').day,0);
assert.deepEqual(B.schedule('2026-10-05','2026-10-12'),{week:2,day:0,finished:false,upcoming:false});
assert.equal(B.schedule('2026-10-05','2026-11-30').finished,true);
assert.equal(B.schedule('2026-10-05','2026-10-04').upcoming,true);
assert.equal(B.display(B.toKg(135,'lb'),'lb'),135);
assert.equal(B.count('4 × 10–15'),4);assert.equal(B.count(null),1);
assert.equal(B.macros([{c:100,p:10,carb:12,f:3,qty:2}]).p,20);
assert.equal(B.program({name:'Custom',days:[{name:'One',exercises:[{name:'Pull up',prescription:'3 × 5'}]}]}).days.length,7);
assert.throws(()=>B.program({name:'Invalid',days:[{name:'One',exercises:[{name:'x',weeks:['3 × 5']}]}]}));
assert.throws(()=>B.validate({...B.fresh(),unit:'oz'}));
assert.throws(()=>B.validate({...B.fresh(),archives:[{}]}));
assert.throws(()=>B.validate({...B.fresh(),photos:[{data:'javascript:alert(1)'}]}));
assert.equal(B.esc('<img onerror="x">'),'&lt;img onerror=&quot;x&quot;&gt;');
const results=[],asyncChecks=[];
for(const edition of ['personal','demo','public']){
 const elements=new Map(),listeners={},stored=new Map(),downloads=[];let failStorage=false;
 const element=id=>{if(!elements.has(id))elements.set(id,{id,innerHTML:'',textContent:'',hidden:false,open:false,dataset:{},value:'',classList:{add(){},remove(){},toggle(){}},addEventListener(){},focus(){},showModal(){this.open=true},close(){this.open=false},click(){},setAttribute(){},removeAttribute(){}});return elements.get(id)};
 const document={getElementById:element,querySelectorAll(){return []},addEventListener(name,fn){listeners[name]=fn},createElement(){return {click(){downloads.push(this.download)}}}};
 class FormData{constructor(form){this.values=form.values}get(key){return this.values[key]??null}}
 const ctx=vm.createContext({console,CONFIG:{edition},document,location:{hash:'#today'},window:{addEventListener(){},scrollTo(){}},navigator:{},crypto:require('node:crypto').webcrypto,structuredClone,localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>{if(failStorage)throw Error('full');stored.set(k,v)}},setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},URL:{createObjectURL:()=>'',revokeObjectURL(){}},Blob,Date,FormData,AbortSignal});
 for(const file of ['program.js','engine.js','app.js'])vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),ctx,{filename:file});
 const run=source=>vm.runInContext(source,ctx);
 assert.equal(run('completed()'),edition==='demo'?12:0);
 for(const page of ['today','train','fuel','progress','about']){run(`location.hash='#${page}';render()`);assert.ok(element('main').innerHTML.length>400);assert.ok(!element('main').innerHTML.includes('undefined'));if(edition==='demo'&&['today','about'].includes(page)){assert.ok(element('main').innerHTML.includes('Shop with my ambassador link'));assert.ok(element('main').innerHTML.includes('https://bckd.co/Ks6tlzm'));assert.ok(element('main').innerHTML.includes('Product details'));assert.ok(element('main').innerHTML.includes('rel="noopener sponsored"'));}else assert.ok(!element('main').innerHTML.includes('Shop with my ambassador link'));}
 run("location.hash='#train';week=1;day=0;render()");
 assert.ok(element('main').innerHTML.includes('Barbell flat bench press'));
 assert.equal(run('sessionFor().exercises.length'),10);
 // Real change handlers: values persist and convert correctly.
 listeners.change({target:{id:'',dataset:{set:'2:0:kg'},value:'135'}});
 listeners.change({target:{id:'',dataset:{set:'2:0:reps'},value:'10'}});
 listeners.change({target:{id:'',dataset:{set:'2:0:done'},checked:true}});
 assert.equal(run('B.display(sessionFor().exercises[2].sets[0].kg,state.unit)'),135);
 assert.equal(run('sessionFor().exercises[2].sets[0].done'),true);
 const persisted=JSON.parse(stored.get('wumpus-builder-'+edition+'-v1'));B.validate(persisted,run('BAMF'));
 // Recipe logging with doubled rice and an explicit zero portion.
 run("mealDialog(['chicken','rice','veg'],'Test meal','Lunch')");
 element('log-meal').onsubmit({preventDefault(){},target:{values:{'qty-0':'1','qty-1':'2','qty-2':'0',meal:'Lunch'}}});
 assert.equal(run('state.logs[B.dateKey()].at(-1).qty'),2);
 assert.equal(run('state.logs[B.dateKey()].at(-1).name'),'Cooked rice');
 // Label values must exist before the puff can be logged.
 run("mealDialog(['built'],'Puff','Snack')");assert.ok(element('modal-content').innerHTML.includes('Edit your food label'));
 // Unsafe text is escaped in imported program preview/render.
 run("state.custom=B.program({name:'<img src=x>',days:[{name:'<b>Test</b>',exercises:[{name:'<script>x</script>',prescription:'3 × 5'}]}]});state.sessions={};week=1;day=0;location.hash='#train';render()");
 assert.ok(element('main').innerHTML.includes('&lt;script&gt;'));assert.ok(!element('main').innerHTML.includes('<script>x'));
 // A failed storage write preserves previous in-memory records.
 const before=run('JSON.stringify(state)');failStorage=true;run("change(n=>n.targets.c='900')");assert.equal(run('JSON.stringify(state)'),before);failStorage=false;
 // Archive preserves the former chapter, meals and preferences.
 run("newRun()");element('run-confirm').onclick();assert.equal(run('state.archives.length'),1);assert.ok(run('state.logs[B.dateKey()].length')>0);assert.equal(run('completed()'),0);
 run('backup()');assert.ok(downloads.some(x=>x.endsWith('.json')));
 B.validate(JSON.parse(stored.get('wumpus-builder-'+edition+'-v1')),run('BAMF'));
 if(edition==='public'){run('importProgram()');assert.ok(element('modal-content').innerHTML.includes('No payment'));}
 ctx.fetch=async url=>({ok:true,json:async()=>url.startsWith('https://')?{status:1,product:{product_name:'Test label',serving_size:'1 bottle',nutriments:{proteins_serving:30}}}:{name:'Proxy label',nutriments:{}}});
 run('CONFIG.staticHosting=true');asyncChecks.push(run('lookupFood("12345678")').then(r=>assert.equal(r.name,'Test label')));
 results.push(`${edition}: page rendering, set logging, meal portions, label fallback, XSS escaping, storage failure, archive/export passed`);
}
Promise.all(asyncChecks).then(()=>{console.log('Engine validation, scheduling and unit conversion passed.');console.log(results.join('\n'));console.log('Static-hosted barcode lookup mapping passed (stubbed external API).');}).catch(e=>{console.error(e);process.exitCode=1});
