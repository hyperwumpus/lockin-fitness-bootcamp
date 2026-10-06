// Ready-to-track additions; reuses the original browser state and XP system.
state.builder ||= {start:todayKey(),sessions:{},mealChoices:{},unit:"lb"};
state.builder.sessions ||= {};
state.builder.mealChoices ||= {};
state.builder.foodPresets ||= {};
const dayNumber = date => {const [y,m,d]=date.split("-").map(Number);return Date.UTC(y,m-1,d)/86400000;};
const programOffset = () => Math.floor(dayNumber(todayKey())-dayNumber(state.builder.start));
let readyWeek = Math.min(8,Math.max(1,Math.floor(programOffset()/7)+1));
let readyDay = Math.max(0,programOffset())%7;
let readyDate=todayKey();
const currentSessionKey = () => todayKey()+"|"+readyWeek+"|"+readyDay;
const session = () => {
 const key=currentSessionKey();
 return state.builder.sessions[key] ||= {date:todayKey(),week:readyWeek,day:readyDay,unit:state.builder.unit||"lb",sets:{},notes:"",completed:false};
};
const getRecipe = meal => READY_RECIPES[state.builder.mealChoices[meal.id]||meal.defaultRecipe];
const foodById = id => state.builder.foodPresets?.[id] || READY_FOODS.find(f=>f.id===id);
const recipeTotals = recipe => recipe.foods.reduce((a,id)=>{const f=foodById(id);a.c+=f.c;a.p+=f.p;return a;},{c:0,p:0});
let activeReadyFood=null;
window.resetReadyFood=()=>{activeReadyFood=null;};
function prefillReadyFood(f){
 clearFood();activeReadyFood=f.id;window.foodPresetEstimate=f.estimated!==false;
 $("#foodName").value=f.name;$("#foodAmount").value=f.grams;
 for(const [field,value] of Object.entries({foodCalories:f.c,foodProtein:f.p,foodCarbs:f.carb,foodFat:f.f}))$("#"+field).value=value===null?"":(value/f.grams*100).toFixed(2);
 $("#foodSource").textContent=(f.estimated===false?"Saved label values":"Estimate / example: check your package")+" for "+f.portion+". Save your food values once to reuse them.";
 $("#saveFoodValues").disabled=false;
 $("#foodForm").scrollIntoView({behavior:"smooth",block:"center"});
}
function downloadBackup(){
 const blob=new Blob([JSON.stringify({app:"lockin-ready",version:1,savedAt:new Date().toISOString(),state},null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="lockin-backup-"+todayKey()+".json";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function previousPerformance(name){
 const list=Object.entries(state.builder.sessions).filter(([key,s])=>key!==currentSessionKey()&&s.sets?.[name]?.some(row=>row.done)).sort((a,b)=>b[1].date.localeCompare(a[1].date));
 if(!list.length)return "First recorded session";
 const last=list[0][1];return "Last "+last.date+": "+last.sets[name].filter(r=>r.done).map(r=>(r.weight!==""?r.weight+" "+last.unit+" × ":"")+r.reps).join(", ");
}
function renderTraining(){
 if(readyDate!==todayKey()){readyDate=todayKey();readyWeek=Math.min(8,Math.max(1,Math.floor(programOffset()/7)+1));readyDay=Math.max(0,programOffset())%7;}
 const current=session(),plan=BAMF[readyDay];
 $("#programStart").value=state.builder.start;
 $("#programWeek").innerHTML=Array.from({length:8},(_,i)=>'<option value="'+(i+1)+'">Week '+(i+1)+'</option>').join("");
 $("#programWeek").value=readyWeek;
 $("#programDay").innerHTML=BAMF.map((d,i)=>'<option value="'+i+'">Day '+(i+1)+' · '+safe(d.name)+'</option>').join("");
 $("#programDay").value=readyDay;
 $("#workoutTitle").textContent="WEEK "+readyWeek+" · "+plan.name.toUpperCase();
 const offset=programOffset();
 $("#programNote").textContent=(offset<0?"Program has not started yet. Previewing week 1. ":offset>=56?"Eight-week schedule finished. Select a week/day to review or repeat. ":"")+"BAMF Builder from your PDF. Record actual sets below; entries save when you leave a field. Blank PDF targets remain unspecified.";
 $("#exerciseList").innerHTML=plan.exercises.length?'<label class="unit-label">Weight unit<select id="weightUnit"><option>lb</option><option>kg</option></select></label>'+plan.exercises.map((ex,i)=>{
  const target=ex.weeks[readyWeek-1],planned=target?.match(/^(\d+) ×/),count=planned?Number(planned[1]):1;
  current.sets[ex.name] ||= Array.from({length:count},()=>({weight:"",reps:"",done:false}));
  const rows=current.sets[ex.name];
  return '<article class="exercise-log"><h3>'+safe(ex.name)+'</h3><p class="target">'+safe(target||"Target unspecified in PDF")+'</p>'+(ex.note?'<p class="muted">'+safe(ex.note)+'</p>':'')+'<p class="last-set">'+safe(previousPerformance(ex.name))+'</p><div class="set-head"><span>Set</span><span>Weight ('+safe(current.unit)+')</span><span>Reps / time</span><span>Done</span></div>'+rows.map((r,j)=>'<div class="set-row"><span>'+(j+1)+'</span><input type="number" min="0" max="2000" step="0.5" data-weight="'+i+':'+j+'" aria-label="'+safe(ex.name)+' set '+(j+1)+' weight" value="'+safe(r.weight)+'" placeholder="BW = 0" /><input maxlength="30" data-reps="'+i+':'+j+'" aria-label="'+safe(ex.name)+' set '+(j+1)+' reps or time" value="'+safe(r.reps)+'" placeholder="e.g. 12 / 30s" /><input type="checkbox" data-done="'+i+':'+j+'" aria-label="'+safe(ex.name)+' set '+(j+1)+' done" '+(r.done?'checked':'')+' /></div>').join("")+'<button class="ghost" data-addset="'+i+'">ADD SET</button></article>';
 }).join(""):'<p>Recovery day. No lifting session is prescribed. Use this day to rest and prepare your food.</p>';
 if($("#weightUnit")){
  $("#weightUnit").value=current.unit;
  $("#weightUnit").onchange=e=>{const next=e.target.value;if(next!==current.unit){for(const rows of Object.values(current.sets))for(const row of rows)if(row.weight!=="")row.weight=Math.round(Number(row.weight)*(next==="kg"?1/2.2046226218:2.2046226218)*100)/100;current.unit=next;state.builder.unit=next;save();render();}};
 }
 for(const kind of ["weight","reps","done"])document.querySelectorAll("[data-"+kind+"]").forEach(input=>input.onchange=()=>{
  const [i,j]=input.dataset[kind].split(":").map(Number),row=current.sets[plan.exercises[i].name][j];
  if(kind==="weight"){if(!input.checkValidity())return;row.weight=input.value===""?"":Number(input.value);}
  else if(kind==="reps")row.reps=input.value.slice(0,30);
  else row.done=input.checked;
  save();$("#sessionStatus").textContent="Saved in this browser.";
 });
 document.querySelectorAll("[data-addset]").forEach(b=>b.onclick=()=>{const ex=plan.exercises[Number(b.dataset.addset)];if(current.sets[ex.name].length>=20)return;current.sets[ex.name].push({weight:"",reps:"",done:false});save();render();});
 $("#completeWorkout").textContent=current.completed?"SESSION RECORDED":"COMPLETE "+(readyDay===6?"RECOVERY":"TRAINING")+" +150 XP";
 $("#completeWorkout").disabled=current.completed;
 $("#sessionStatus").textContent=current.completed?"Session recorded · "+current.date:"Entries save in this browser.";
}
window.finishReadySession=()=>{session().completed=true;};
window.renderReady=()=>{
 renderTraining();
 $("#mealList").innerHTML=READY_MEALS.map(meal=>{
  const recipe=getRecipe(meal),totals=recipeTotals(recipe);
  return '<article class="meal-plan"><div class="eyebrow">'+safe(meal.name)+'</div><select data-recipe="'+meal.id+'" aria-label="'+safe(meal.name)+' meal choice">'+meal.choices.map(id=>'<option value="'+id+'" '+(READY_RECIPES[id]===recipe?'selected':'')+'>'+safe(READY_RECIPES[id].name)+'</option>').join("")+'</select><ul>'+recipe.foods.map(id=>{const f=foodById(id);return '<li>'+safe(f.name)+' · '+safe(f.portion)+'</li>';}).join("")+'</ul><p>'+safe(recipe.prep)+'</p><p class="muted">Estimate: '+Math.round(totals.c)+' kcal · '+Math.round(totals.p)+' g protein. These portions are a starting menu, not a prescribed daily intake.</p><div class="row"><label>Portion multiplier<input data-portion="'+meal.id+'" type="number" value="1" min="0.1" max="10" step="0.1" /></label><button data-logmeal="'+meal.id+'">LOG THIS MEAL</button></div></article>';
 }).join("");
 document.querySelectorAll("[data-recipe]").forEach(input=>input.onchange=()=>{state.builder.mealChoices[input.dataset.recipe]=input.value;save();render();});
 document.querySelectorAll("[data-logmeal]").forEach(button=>button.onclick=()=>{
  rollDay();const meal=READY_MEALS.find(m=>m.id===button.dataset.logmeal),recipe=getRecipe(meal),input=document.querySelector('[data-portion="'+meal.id+'"]'),multiplier=Number(input.value);
  if(!input.checkValidity())return;
  const needsLabel=recipe.foods.map(foodById).find(f=>f.requiresLabel);if(needsLabel){prefillReadyFood(needsLabel);modal("SAVE YOUR LABEL ONCE","Enter the missing nutrition from your package, then use SAVE FOOD VALUES. After that this meal is ready for one-tap logging.");return;}
  const items=recipe.foods.map(id=>{const f=foodById(id);return {id:crypto.randomUUID(),name:f.name,meal:meal.meal,amount:f.grams*multiplier,portion:format(multiplier)+" × "+f.portion,barcode:null,estimated:f.estimated!==false,calories:Math.round(f.c*multiplier*10)/10,protein:Math.round(f.p*multiplier*10)/10,carbs:Math.round(f.carb*multiplier*10)/10,fat:Math.round(f.f*multiplier*10)/10};});
  state.foodLogs[state.day] ||= [];state.foodLogs[state.day].push(...items);
  capture("FUEL","Logged "+recipe.name+" (estimate)");
  if(!state.quests[meal.id])completeQuest(meal.id,quests.find(q=>q[0]===meal.id)[3]);else {save();render();modal("MEAL LOGGED","Added to today's food log. You can remove entries below.");}
 });
 const shopping={};for(const meal of READY_MEALS)for(const id of getRecipe(meal).foods){shopping[id]=(shopping[id]||0)+1;}
 $("#shoppingList").innerHTML='<p class="muted">For your selected menu. Buy several days of the ready-to-eat and frozen options you prefer.</p><ul>'+Object.entries(shopping).map(([id,count])=>{const f=foodById(id);return '<li>'+safe(f.name)+' · '+count+' × '+safe(f.portion)+' per day</li>';}).join("")+'</ul><p class="muted">Sunday shortcut: cook rice, portion it, put shakes and easy meals where you can see them. Keep tuna as a backup and rotate your protein choices.</p>';
 $("#quickFoods").innerHTML=[...READY_FOODS,...Object.values(state.builder.foodPresets).filter(f=>f.id.startsWith("custom-"))].map(f=>'<button class="ghost" data-food="'+f.id+'">'+safe(f.name)+'</button>').join("");
 document.querySelectorAll("[data-food]").forEach(button=>button.onclick=()=>prefillReadyFood(foodById(button.dataset.food)));
 const history=Object.values(state.builder.sessions).filter(s=>s.completed||Object.values(s.sets).some(rows=>rows.some(r=>r.done||r.reps||r.weight!==""))).sort((a,b)=>b.date.localeCompare(a.date)||b.week-a.week);
 $("#trainingHistory").innerHTML=history.length?history.slice(0,25).map(s=>'<details><summary>'+safe(s.date)+' · Week '+s.week+' · '+safe(BAMF[s.day]?.name||"Training")+' · '+(s.completed?'completed':'in progress')+'</summary>'+Object.entries(s.sets).filter(([name,rows])=>rows.some(r=>r.done||r.reps||r.weight!=="")).map(([name,rows])=>'<p><strong>'+safe(name)+'</strong><br>'+rows.map((r,i)=>'Set '+(i+1)+': '+(r.weight!==""?safe(r.weight)+" "+safe(s.unit)+" × ":"")+safe(r.reps||"—")+(r.done?" ✓":"")).join("<br>")+'</p>').join("")+'</details>').join(""):"Your recorded sessions will appear here.";
};
$("#programStart").onchange=e=>{if(!e.target.value)return;state.builder.start=e.target.value;readyWeek=Math.min(8,Math.max(1,Math.floor(programOffset()/7)+1));readyDay=Math.max(0,programOffset())%7;save();render();};
$("#programWeek").onchange=e=>{readyWeek=Number(e.target.value);render();};
$("#programDay").onchange=e=>{readyDay=Number(e.target.value);render();};
$("#completeWorkout").onclick=()=>{rollDay();window.finishReadySession();if(!state.quests.training)completeQuest("training",150);else {save();render();modal("SESSION RECORDED","Your training has been saved. Training XP is awarded once per day.");}};
$("#saveFoodValues").onclick=()=>{
 if(!$("#foodForm").reportValidity())return;
 const presetId=activeReadyFood||"custom-"+(selectedBarcode||crypto.randomUUID());
 const original=foodById(presetId)||{id:presetId},amount=Number($("#foodAmount").value),values=["foodCalories","foodProtein","foodCarbs","foodFat"].map(id=>Number($("#"+id).value)*amount/100);
 state.builder.foodPresets[presetId]={...original,name:$("#foodName").value.trim(),grams:amount,portion:format(amount)+" g/ml (saved portion)",c:values[0],p:values[1],carb:values[2],f:values[3],requiresLabel:false,estimated:false};
 window.foodPresetEstimate=false;save();render();$("#foodSource").textContent="Saved your food values. This portion is ready to reuse.";
};
$("#exportData").onclick=downloadBackup;
$("#importData").onchange=async e=>{
 try{
  const file=e.target.files[0];if(!file)return;if(file.size>5000000)throw Error("Backup is too large.");
  const parsed=JSON.parse(await file.text()),s=parsed.state;
  if(parsed.app!=="lockin-ready"||parsed.version!==1||!s||!Array.isArray(s.weights)||!Array.isArray(s.content)||!s.foodLogs||typeof s.foodLogs!=="object"||Array.isArray(s.foodLogs)||!s.builder?.sessions||!/^\d{4}-\d{2}-\d{2}$/.test(s.builder.start)||!Number.isFinite(s.xp)||s.xp<0||!Number.isFinite(s.weight)||s.weight<=0||!s.quests||!s.meals||!Array.isArray(s.exerciseChecks))throw Error("This is not a valid LOCK//IN backup.");
  for(const day of Object.values(s.foodLogs)){if(!Array.isArray(day)||day.some(item=>!item||typeof item.name!=="string"||!["calories","protein","carbs","fat","amount"].every(k=>Number.isFinite(item[k])&&item[k]>=0)))throw Error("Invalid food entries.");}
  for(const sess of Object.values(s.builder.sessions)){if(!Number.isInteger(sess.day)||sess.day<0||sess.day>6||!Number.isInteger(sess.week)||sess.week<1||sess.week>8||typeof sess.date!=="string"||!sess.sets||typeof sess.sets!=="object"||!["lb","kg"].includes(sess.unit))throw Error("Invalid training session.");for(const rows of Object.values(sess.sets))if(!Array.isArray(rows)||rows.length>20||rows.some(r=>typeof r.reps!=="string"||typeof r.done!=="boolean"||(r.weight!==""&&!Number.isFinite(r.weight))))throw Error("Invalid set data.");}
  for(const [id,recipe] of Object.entries(s.builder.mealChoices||{}))if(!READY_MEALS.some(m=>m.id===id&&m.choices.includes(recipe)))throw Error("Invalid meal choice.");
  for(const [id,f] of Object.entries(s.builder.foodPresets||{}))if((!READY_FOODS.some(x=>x.id===id)&&!/^custom-[0-9a-f-]+$/.test(id))||f.id!==id||typeof f.name!=="string"||typeof f.portion!=="string"||!["grams","c","p","carb","f"].every(k=>Number.isFinite(f[k])&&f[k]>=0)||f.grams<=0)throw Error("Invalid saved food.");
  localStorage.setItem("lockin-before-restore",JSON.stringify(state));
  state=s;state.builder.foodPresets ||= {};save();location.reload();
 }catch(error){$("#backupStatus").textContent=error.message||"Backup could not be restored.";e.target.value="";}
};
render();

