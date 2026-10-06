// Transcribed from the user's BAMF Builder PDF. Empty source cells stay unspecified.
const repeat8 = value => Array(8).fill(value);
const phase = (early, late) => [...Array(4).fill(early), ...Array(4).fill(late)];
const exercise = (name, weeks, note = "") => ({name, weeks: typeof weeks === "string" ? repeat8(weeks) : weeks, note});
const BAMF = [
 {name:"Chest & Triceps", exercises:[
 exercise("Push ups",["3 × 10–15","3 × 10–15","3 × 15","3 × 15","3 × 20","3 × 20–25","3 × 20+","3 × to failure"]),
 exercise("Chest fly machine",["3 × 10–12","3 × 10–12","3 × 10–12","3 × 10–12","4 × 10–12","4 × 10–12","4 × 12","4 × 12"]),
 exercise("Barbell flat bench press",phase("3 × 10–12","4 × 10–12")),
 exercise("Incline barbell chest press",phase("3 × 10–12","4 × 10–12")),
 exercise("Low cable single arm chest fly",phase("3 × 10","4 × 10–12"),"Per arm."),
 exercise("Dumbbell chest pull overs",phase("3 × 8–10","3 × 10")),
 exercise("Tricep overhead with cable",["3 × 10–15","3 × 10–15","3 × 10–15","3 × 10–15","3 × 10–15","3 × 10–15","3 × 10–15","3 × 10 to failure"]),
 exercise("Tricep rope push downs", "3 × 10–15","PDF specifies drop set 3×."),
 exercise("Dumbbell tricep extension",["3 × 8–10","3 × 8–10","3 × 8–10","3 × 8–10","3 × 10","3 × 10","3 × 10","3 × 10 to failure"]),
 exercise("Diamond push ups","3 × to failure")
 ]},
 {name:"Legs #1",exercises:[
 exercise("Lower body warm up","10–15 reps of each","Warm-up movements are not named in this PDF."),
 exercise("Single leg extension",["3 × 8–10","3 × 8–10","3 × 10","3 × 10","4 × 8–10","4 × 8–10","4 × 10","4 × 10"],"Per leg."),
 exercise("Single leg hamstring curls",["3 × 8–10","3 × 8–10","3 × 10","3 × 10","4 × 8–10","4 × 8–10","4 × 10","4 × 10"],"Per leg."),
 exercise("Front squat",["3 × 10–12","3 × 10–12",null,null,null,null,null,null],"Weeks 3–8 are blank in the PDF. Confirm the intended prescription."),
 exercise("Leg press feet close",["3 × 10–12","3 × 10–12","3 × 10–12","3 × 10–12","3 × 10–12","3 × 10–12","3 × 10–12","4 × 10"]),
 exercise("Single leg press",phase("3 × 10–12","4 × 10–12"),"Per leg."),
 exercise("Smith machine lunges",phase("3 × 10","4 × 10–15")),
 exercise("Box step ups","3 × 10 each leg"),
 exercise("Seated calf raises","4 × 20"),
 exercise("Decline sit ups",repeat8(null),"Sets and reps are blank in the PDF.")
 ]},
 {name:"Shoulders #1",exercises:[
 exercise("Upper body warm up","3–5 minutes"),
 exercise("Seated dumbbell shoulder press",["3 × 10–12","3 × 10–12","3 × 10–12","3 × 10–12","4 × 10–15","4 × 15","4 × 15","4 × 15"]),
 exercise("Rear delt fly machine",["3 × 10","3 × 10","3 × 10","3 × 10","4 × 10","4 × 10","4 × 10–12","4 × 10–12"],"Drop the weight twice each set."),
 exercise("Bent over rear delt fly","3 × 10–15"),
 exercise("Lateral raises",["3 × 8–10","3 × 8–10","3 × 8–10","3 × 10","3 × 10","3 × 10–15","3 × 10–15","3 × 15"]),
 exercise("Dumbbell upright rows",["3 × 8–10","3 × 8–10","3 × 8–10","3 × 10","4 × 10–15","4 × 10–15","4 × 10–15","4 × 10–15"]),
 exercise("Dumbbell single arm front raises","3 × 10","Per arm."),
 exercise("Ball crunches","3 × to failure"),
 exercise("Hanging leg raises","3 × to failure")
 ]},
 {name:"Back Attack & Biceps",exercises:[
 exercise("Upper body mobility 1+2","3–5 minutes","Movement details are not included in the PDF."),
 exercise("Rope attachment row",phase("3 × 10–12","4 × 10–15")),
 exercise("Barbell bent over rows",phase("3 × 10–12","4 × 10–15")),
 exercise("Pull ups",phase("3 × 8–10","4 × 8–10")),
 exercise("Lat pull overs",phase("3 × 10","3 × 10–15")),
 exercise("Seated lat pull downs",["3 × 8–10","3 × 8–10","3 × 8–10","3 × 10","3 × 10–15","4 × 10–15","4 × 10–15","4 × 10–15"]),
 exercise("EZ bar preacher curl","3 × 10–12"),
 exercise("Dumbbell hammer curls",phase("3 × 10–15","4 × 10–15")),
 exercise("Cable single arm D ring curl",phase("3 × 10","4 × 10"),"Per arm."),
 exercise("Roman chair lifts","4 × to failure"),
 exercise("Weighted back extensions",["3 × 10–20","3 × 10–20","3 × 10–20","3 × 10–20","3 × 10–20","4 × 10–20","4 × 10–20","4 × 10–20"])
 ]},
 {name:"Leg Day #2 High Reps",exercises:[
 exercise("Lower body warm up","10–15 reps of each","Warm-up movements are not named in this PDF."),
 exercise("Leg extension",phase("3 × 10–12","4 × 10–12")),
 exercise("Hamstring curl machine",phase("3 × 10–12","4 × 10–12")),
 exercise("Barbell back squat",phase("4 × 10–15","4 × 15–20")),
 exercise("Dumbbell walking lunges",phase("3 × 10–15","3 × 15–20")),
 exercise("Wide stance leg press","4 × 10–12"),
 exercise("Barbell deadlift",phase("3 × 10","4 × 10")),
 exercise("Barbell hip thrusts","3 × 10–15"),
 exercise("Roman chair lifts","3 × to failure")
 ]},
 {name:"Shoulders #2",exercises:[
 exercise("Resistance band warm up","3–5 minutes"),
 exercise("ITY's",phase("3 × 10–12","4 × 10–12")),
 exercise("Arnold press","4 × 10–12"),
 exercise("Reverse cable flys",phase("3 × 10","4 × 10")),
 exercise("Cable D ring lateral raises",["3 × 8–10","3 × 8–10","3 × 8–10","3 × 8–10","3 × 10","3 × 10","3 × 10–12","3 × 10–12"]),
 exercise("Face pulls",phase("3 × 8–10","4 × 10–12")),
 exercise("Barbell upright row","4 × 8–10"),
 exercise("Plank",phase("3 × 1 minute","3 × to failure")),
 exercise("Decline sit ups","3 × to failure")
 ]},
 {name:"Recovery / Rest Day",exercises:[]}
];
// Generic portion estimates. Actual brands and cooked portions may differ.
const READY_FOODS = [
 {id:"powder",name:"Protein powder + water",portion:"1 scoop (30 g powder)",grams:30,c:120,p:24,carb:3,f:1.5},
 {id:"banana",name:"Banana",portion:"1 medium",grams:118,c:105,p:1.3,carb:27,f:0.4},
 {id:"shake",name:"Ready-to-drink protein shake",portion:"1 bottle (example 325 ml)",grams:325,c:160,p:30,carb:5,f:3},
 {id:"chicken",name:"Ready-to-eat cooked chicken",portion:"170 g cooked",grams:170,c:280,p:49,carb:0,f:8},
 {id:"tilapia",name:"Tilapia",portion:"170 g cooked, no added oil",grams:170,c:218,p:44,carb:0,f:4.5},
 {id:"rice",name:"Cooked rice",portion:"1 cup (158 g)",grams:158,c:205,p:4.3,carb:44.5,f:0.4},
 {id:"veg",name:"Frozen vegetables",portion:"150 g, no sauce",grams:150,c:60,p:3,carb:12,f:0.5},
 {id:"tuna",name:"Tuna in water, drained",portion:"1 can (example 113 g drained)",grams:113,c:131,p:29,carb:0,f:1.1},
 {id:"corn",name:"Canned corn, drained",portion:"80 g",grams:80,c:68,p:2,carb:15,f:1},
 {id:"mayo",name:"Mayonnaise",portion:"1 tablespoon (14 g)",grams:14,c:94,p:0,carb:0.1,f:10.3},
 {id:"frozen",name:"Frozen chicken pasta meal",portion:"1 label serving (example 300 g)",grams:300,c:400,p:20,carb:50,f:13},
 {id:"extraChicken",name:"Extra cooked chicken",portion:"100 g cooked",grams:100,c:165,p:31,carb:0,f:3.6},
 {id:"yogurt",name:"Plain nonfat Greek yogurt",portion:"200 g",grams:200,c:118,p:20,carb:7,f:0.8},
 {id:"fruit",name:"Berries",portion:"100 g",grams:100,c:50,p:1,carb:12,f:0.3},
 {id:"watermelon",name:"Watermelon",portion:"300 g chopped",grams:300,c:90,p:1.8,carb:22.8,f:0.5},
 {id:"built",name:"BUILT Puff · check flavor label",portion:"1 bar (example 40 g)",grams:40,c:140,p:17,carb:null,f:null,requiresLabel:true},
 {id:"chips",name:"Chips",portion:"28 g measured portion",grams:28,c:150,p:2,carb:15,f:10},
 {id:"chocolate",name:"Chocolate",portion:"20 g measured portion",grams:20,c:110,p:1.5,carb:12,f:7},
 {id:"popcorn",name:"Plain air-popped popcorn",portion:"3 cups (24 g), no added butter",grams:24,c:93,p:3,carb:19,f:1.1}
];
const READY_RECIPES = {
 breakfast:{name:"Shake + banana",prep:"Shake protein powder with water. Eat a banana alongside it.",foods:["powder","banana"]},
 bottled:{name:"Bottled shake + banana",prep:"Grab a ready-to-drink shake and banana.",foods:["shake","banana"]},
 chickenRice:{name:"Chicken + rice + vegetables",prep:"Use ready-to-eat chicken, rice-cooker rice, and microwave vegetables.",foods:["chicken","rice","veg"]},
 fishRice:{name:"Tilapia + rice + vegetables",prep:"Cook tilapia using the package directions; pair with rice-cooker rice and microwave vegetables. Log any added oil separately.",foods:["tilapia","rice","veg"]},
 tunaCorn:{name:"Your tuna + corn + mayo bowl",prep:"Drain tuna and corn, mix with a measured spoon of mayo, and serve with rice.",foods:["tuna","corn","mayo","rice"]},
 frozenChicken:{name:"Frozen meal + extra chicken",prep:"Heat one label serving of the frozen meal and add cooked chicken. Follow the packages' cooking instructions. Log the actual serving rather than assuming the whole bag is one.",foods:["frozen","extraChicken"]},
 yogurt:{name:"Yogurt + fruit",prep:"Open yogurt and add berries. A bottled shake is another easy option.",foods:["yogurt","fruit"]},
 puffFruit:{name:"BUILT Puff + watermelon",prep:"Grab one bar and pre-cut watermelon. Save your bar's label values once before logging this option.",foods:["built","watermelon"]},
 watermelonYogurt:{name:"Yogurt + watermelon",prep:"Open yogurt and add chopped watermelon.",foods:["yogurt","watermelon"]},
 shake:{name:"Grab-and-go shake",prep:"Open a ready-to-drink protein shake.",foods:["shake"]}
};
const READY_MEALS = [
 {id:"breakfast",name:"Morning · first fuel",meal:"Breakfast",choices:["breakfast","bottled"],defaultRecipe:"breakfast"},
 {id:"lunch",name:"Midday · easy meal",meal:"Lunch",choices:["chickenRice","fishRice","frozenChicken","tunaCorn"],defaultRecipe:"chickenRice"},
 {id:"dinner",name:"Evening · dinner",meal:"Dinner",choices:["fishRice","chickenRice","frozenChicken","tunaCorn"],defaultRecipe:"chickenRice"},
 {id:"sweet",name:"Protein / snack check",meal:"Snack",choices:["yogurt","watermelonYogurt","puffFruit","shake"],defaultRecipe:"yogurt"}
];

