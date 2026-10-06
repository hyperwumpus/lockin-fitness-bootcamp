const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const DEFAULT={xp:0,xpToday:0,streak:0,lastCompletedDate:null,vault:0,weight:190,weights:[],workout:"A",quests:{},meals:{},exerciseChecks:[],foodLogs:{},content:[],day:todayKey()};
const $=s=>document.querySelector(s);
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]);
const stored=key=>{try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}};
let state=stored("lockin-v02");
if(!state){const old=stored("lockin-v01");state={...structuredClone(DEFAULT),...(old||{})};if(old){state.legacyDaily={protein:old.protein||0,quests:old.quests||{}};state.quests={};state.meals={};state.xpToday=0}state.foodLogs={};state.exerciseChecks=[];state.day=todayKey()}
state.foodLogs=state.foodLogs&&typeof state.foodLogs==="object"?state.foodLogs:{};
const save=()=>localStorage.setItem("lockin-v02",JSON.stringify(state));
function rollDay(){const day=todayKey();if(state.day===day)return;const previous=new Date(`${day}T12:00:00`);previous.setDate(previous.getDate()-1);const y=`${previous.getFullYear()}-${String(previous.getMonth()+1).padStart(2,"0")}-${String(previous.getDate()).padStart(2,"0")}`;if(state.lastCompletedDate!==y)state.streak=0;state.day=day;state.quests={};state.meals={};state.exerciseChecks=[];state.xpToday=0;save()}
const entries=()=>Array.isArray(state.foodLogs[state.day])?state.foodLogs[state.day]:[];
const total=key=>entries().reduce((sum,item)=>sum+(Number(item[key])||0),0);
const format=n=>Number(n||0).toFixed(1).replace(/\.0$/,"");
const quests=[
 ["breakfast","Morning fuel","Protein shake + banana",25],
 ["training","Body Mission","BAMF Builder / Recovery / Minimum Mission",150],
 ["lunch","Midday meal","Chicken / tilapia / easy frozen meal",35],
 ["dinner","Dinner","Your selected easy meal",35],
 ["sweet","Snack check","Yogurt + fruit or a shake",20]
];
const meals=[
 ["breakfast","BREAKFAST","Shake providing ~40–50g protein + banana"],
 ["lunch","LUNCH","~6 oz chicken/tilapia + ~1 cup rice + vegetables"],
 ["dinner","DINNER","~6 oz protein + ¾–1 cup rice + vegetables"],
 ["sweet","SWEET CHECK","Greek yogurt + fruit; shake if protein is low"]
];
const A=["Squat — 2×8–12","Push — 2×8–12","Row — 2×8–12","Romanian deadlift — 2×8–12","Assisted pull-up / pulldown — 2×8–12","Plank — 2×20–30 sec"];
const B=["Squat / leg press — 2×8–12","Incline press — 2×8–12","Seated / DB row — 2×8–12","Split squat — 2×8–12/leg","Assisted pull-up / pulldown — 2×8–12","Dead bug — 2×8–12/side"];
function addXP(n,reason){state.xp+=n;state.xpToday+=n;capture("WIN",`${reason} (+${n} XP)`);save();render();}
function capture(type,text){state.content.unshift({type,text,at:new Date().toLocaleString()});state.content=state.content.slice(0,40);}
function modal(title,text){$("#modalTitle").textContent=title;$("#modalText").textContent=text;$("#systemModal").classList.remove("hidden")}
function completeQuest(id,xp){rollDay();if(state.quests[id])return;state.quests[id]=true;if(id==="training"&&window.finishReadySession)window.finishReadySession();if(meals.some(m=>m[0]===id))state.meals[id]=true;if(quests.every(q=>state.quests[q[0]])&&state.lastCompletedDate!==state.day){state.streak=(state.streak||0)+1;state.lastCompletedDate=state.day}addXP(xp,`${quests.find(q=>q[0]===id)?.[1]||id} completed`);modal("QUEST COMPLETE",`Mission confirmed. +${xp} XP.`)}
function rank(){const l=Math.floor(state.xp/500)+1;const ranks=["E-RANK","D-RANK","C-RANK","B-RANK","A-RANK","S-RANK"];return {l,r:ranks[Math.min(ranks.length-1,Math.floor((l-1)/4))]}}
function render(){
 rollDay();const rr=rank();$("#level").textContent=`LV ${rr.l}`;$("#rankName").textContent=rr.r;$("#xpToday").textContent=state.xpToday;$("#vaultCount").textContent=state.vault;$("#proteinTotal").textContent=format(total("protein"));$("#weightDisplay").textContent=Number(state.weight).toFixed(1);$("#streakDisplay").textContent=state.streak;$("#totalXP").textContent=state.xp;
 $("#questList").innerHTML=quests.map(q=>`<div class="quest ${state.quests[q[0]]?'done':''}"><button data-q="${q[0]}">${state.quests[q[0]]?'✓':'○'}</button><div><div class="name">${q[1]}</div><div class="sub">${q[2]} • +${q[3]} XP</div></div></div>`).join("");
 document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>completeQuest(b.dataset.q,quests.find(q=>q[0]===b.dataset.q)[3]));
 const next=quests.find(q=>!state.quests[q[0]]);$("#directive").textContent=next?`NEXT MISSION: ${next[1]} — ${next[2]}`:"ALL REQUIRED MISSIONS COMPLETE. Recover. Prepare tomorrow.";
 $("#mealList").innerHTML=meals.map(m=>`<div class="meal ${state.meals[m[0]]?'done':''}"><button data-meal="${m[0]}">${state.meals[m[0]]?'✓':'○'}</button><div><div class="name">${m[1]}</div><div class="sub">${m[2]}</div></div></div>`).join("");
 document.querySelectorAll("[data-meal]").forEach(b=>b.onclick=()=>completeQuest(b.dataset.meal,quests.find(q=>q[0]===b.dataset.meal)?.[3]||10));
 if(window.renderReady) window.renderReady();
 $("#weightHistory").innerHTML=state.weights.slice(0,8).map(w=>`<div>${safe(w.at)} — <strong>${safe(w.value)} lb</strong></div>`).join("")||"No entries yet.";
 $("#contentFeed").innerHTML=state.content.map(c=>`<div class="content-item"><strong>[${safe(c.type)}] ${safe(c.text)}</strong><small>${safe(c.at)}</small></div>`).join("")||"Complete a mission, fail a mission, log weight, or add a side quest. The System will build your story log here.";
 $("#foodDate").textContent=state.day;$("#calorieTotal").textContent=format(total("calories"));$("#proteinMacro").textContent=format(total("protein"));$("#carbTotal").textContent=format(total("carbs"));$("#fatTotal").textContent=format(total("fat"));
 $("#foodEntries").innerHTML=entries().length?entries().map(item=>`<div class="food-entry"><div><strong>${safe(item.name)}</strong><small>${safe(item.meal)} · ${item.portion?safe(item.portion):`${format(item.amount)} g/ml`}${item.estimated?" · ESTIMATE":""} · ${format(item.calories)} kcal · P ${format(item.protein)} · C ${format(item.carbs)} · F ${format(item.fat)}</small></div><button class="ghost" data-remove="${safe(item.id)}" aria-label="Remove ${safe(item.name)}">REMOVE</button></div>`).join(""):"No food logged today. Scan a barcode or enter a food below.";
 document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{state.foodLogs[state.day]=entries().filter(e=>e.id!==b.dataset.remove);save();render()});
 save();
}

document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.view).classList.add("active")});
$("#closeModal").onclick=()=>$("#systemModal").classList.add("hidden");
$("#toggleWorkout").onclick=()=>{state.workout=state.workout==="A"?"B":"A";state.exerciseChecks=[];save();render()};
$("#completeWorkout").onclick=()=>completeQuest("training",150);
$("#logWeight").onclick=()=>{let n=Number($("#weightInput").value);if(n>0){state.weight=n;state.weights.unshift({value:n.toFixed(1),at:new Date().toLocaleDateString()});capture("PROGRESS",`Weigh-in: ${n.toFixed(1)} lb`);$("#weightInput").value="";save();render()}};
$("#failMission").onclick=()=>{state.vault++;capture("PENALTY",`Required mission failed. 1 Pokémon pack entered the Penalty Vault.`);save();render();modal("PENALTY QUEST ACTIVATED","One sealed Pokémon pack has been forfeited to the Penalty Vault. Record the failure, execute the safe penalty protocol, and use it as content. Do not use injury, dehydration, food restriction, or dangerous exhaustion as punishment.")};
$("#addSideQuest").onclick=()=>{const name=prompt("Side quest / challenge name:");if(name){capture("SIDE QUEST",name.slice(0,200));save();render()}};
let timer=90,interval=null;function showTimer(){let m=Math.floor(timer/60),s=timer%60;$("#timerDisplay").textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`};$("#startTimer").onclick=()=>{clearInterval(interval);interval=setInterval(()=>{timer--;showTimer();if(timer<=0){clearInterval(interval);modal("REST COMPLETE","Next set. Move.");timer=90;showTimer()}},1000)};$("#resetTimer").onclick=()=>{clearInterval(interval);timer=90;showTimer()};
let selectedBarcode=null;
function clearFood(){if(window.resetReadyFood)window.resetReadyFood();window.foodPresetEstimate=false;selectedBarcode=null;$("#foodForm").reset();$("#foodAmount").value=100;$("#foodSource").textContent="Enter food manually or look up a barcode above."}
$("#clearFood").onclick=clearFood;
$("#lookupBarcode").onclick=async()=>{
 const barcode=$("#barcodeInput").value.trim();if(!/^\d{8,14}$/.test(barcode)){$("#lookupStatus").textContent="Enter an 8–14 digit barcode.";return}
 $("#lookupStatus").textContent="Looking up food…";$("#lookupBarcode").disabled=true;
 try{
  const response=await fetch(`/api/product/${barcode}`);const product=await response.json();if(!response.ok)throw Error(product.error||"Lookup failed");
  const n=product.nutriments;clearFood();selectedBarcode=barcode;$("#foodName").value=[product.brand,product.name].filter(Boolean).join(" — ").slice(0,100);
  const numbers={foodCalories:n["energy-kcal_100g"],foodProtein:n.proteins_100g,foodCarbs:n.carbohydrates_100g,foodFat:n.fat_100g};
  for(const [id,value] of Object.entries(numbers))$("#"+id).value=value!==undefined&&value!==null&&Number.isFinite(Number(value))?Number(value):"";
  $("#foodSource").textContent=`Barcode ${barcode}${product.servingSize?` · Label serving: ${product.servingSize}`:""}. Values are per 100 g/ml; verify against the package.`;
  $("#lookupStatus").textContent="Food found. Check the numbers and amount, then add to today's log.";
 }catch(error){$("#lookupStatus").textContent=error.message||"Lookup unavailable. Add food manually."}finally{$("#lookupBarcode").disabled=false}
};
$("#barcodeInput").addEventListener("keydown",e=>{if(e.key==="Enter"){$("#lookupBarcode").click();e.preventDefault()}});
$("#foodForm").onsubmit=e=>{
 e.preventDefault();rollDay();const amount=Number($("#foodAmount").value);const per100=["foodCalories","foodProtein","foodCarbs","foodFat"].map(id=>Number($("#"+id).value));
 if(!$("#foodForm").reportValidity()||!Number.isFinite(amount)||amount<=0||per100.some(n=>!Number.isFinite(n)||n<0))return;
 const [calories,protein,carbs,fat]=per100.map(n=>Math.round(n*amount)/100);
 const item={id:globalThis.crypto?.randomUUID?.()||String(Date.now())+Math.random(),name:$("#foodName").value.trim(),meal:$("#foodMeal").value,amount,barcode:selectedBarcode,estimated:!!window.foodPresetEstimate,calories,protein,carbs,fat};
 if(!item.name)return;state.foodLogs[state.day]??=[];state.foodLogs[state.day].push(item);capture("FUEL",`Logged ${item.name}: ${format(calories)} kcal, ${format(protein)}g protein`);save();clearFood();render();
};
let stream=null,scanFrame=null,detecting=false;
function stopScanner(){if(scanFrame)cancelAnimationFrame(scanFrame);scanFrame=null;if(stream)stream.getTracks().forEach(track=>track.stop());stream=null;$("#scannerPanel").classList.add("hidden");$("#scannerVideo").srcObject=null;detecting=false}
$("#closeScanner").onclick=stopScanner;
$("#openScanner").onclick=async()=>{
 if(!("BarcodeDetector" in window)||!navigator.mediaDevices?.getUserMedia){$("#lookupStatus").textContent="Camera barcode scanning isn't supported here. Type the barcode instead.";return}
 try{
  const supported=await BarcodeDetector.getSupportedFormats();const formats=["ean_13","ean_8","upc_a","upc_e"].filter(f=>supported.includes(f));
  if(!formats.length)throw Error("No food barcode format supported. Type the barcode instead.");
  const detector=new BarcodeDetector({formats});stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
  $("#scannerVideo").srcObject=stream;$("#scannerPanel").classList.remove("hidden");await $("#scannerVideo").play();
  const scan=async()=>{if(!stream)return;if(!detecting&&$("#scannerVideo").readyState>=2){detecting=true;try{const found=await detector.detect($("#scannerVideo"));const code=found.find(x=>/^\d{8,14}$/.test(x.rawValue))?.rawValue;if(code){stopScanner();$("#barcodeInput").value=code;$("#lookupBarcode").click();return}}catch{}finally{detecting=false}}scanFrame=requestAnimationFrame(scan)};
  scanFrame=requestAnimationFrame(scan);$("#lookupStatus").textContent="Point the camera at a food barcode.";
 }catch(error){stopScanner();$("#lookupStatus").textContent=error.message||"Camera unavailable. Type the barcode instead."}
};
document.addEventListener("visibilitychange",()=>{if(document.hidden)stopScanner();else render()});
render();showTimer();

