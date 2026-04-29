let currentLang="en";
let records=JSON.parse(localStorage.getItem("farmData"))||[];

const seasons={
  en:["Kharif","Rabi","Zaid"],
  kn:["ಖರಿಫ್","ರಬಿ","ಜೈದ್"]
};

const t={
  en:{
    title:"🌾 FarmSaathi",
    subtitle:"Crop Expense & Profit Tracker",
    village:"Village (type or 🎤)",
    crop:"Crop (type or 🎤)",
    expense:"Expense",
    market:"Market",
    seeds:"Seeds",
    fertilizer:"Fertilizer",
    labour:"Labour",
    irrigation:"Irrigation",
    quantity:"Quantity",
    rate:"Rate",
    add:"Add",
    clear:"Clear",
    total:"Total Profit",
    top:"Top Crop",
    villageH:"Village",
    cropH:"Crop",
    seasonH:"Season",
    expenseH:"Expense",
    incomeH:"Income",
    profitH:"Profit",
    actionH:"Action"
  },
  kn:{
    title:"🌾 ಫಾರ್ಮ್ ಸಾಥಿ",
    subtitle:"ಬೆಳೆ ವೆಚ್ಚ ಮತ್ತು ಲಾಭ ಟ್ರ್ಯಾಕರ್",
    village:"ಗ್ರಾಮ (ಟೈಪ್ ಅಥವಾ 🎤)",
    crop:"ಬೆಳೆ (ಟೈಪ್ ಅಥವಾ 🎤)",
    expense:"ವೆಚ್ಚ",
    market:"ಮಾರ್ಕೆಟ್",
    seeds:"ಬೀಜ",
    fertilizer:"ರಸಗೊಬ್ಬರ",
    labour:"ಕಾರ್ಮಿಕ",
    irrigation:"ನೀರಾವರಿ",
    quantity:"ಪ್ರಮಾಣ",
    rate:"ದರ",
    add:"ಸೇರಿಸಿ",
    clear:"ಖಾಲಿ ಮಾಡಿ",
    total:"ಒಟ್ಟು ಲಾಭ",
    top:"ಅತ್ಯುತ್ತಮ ಬೆಳೆ",
    villageH:"ಗ್ರಾಮ",
    cropH:"ಬೆಳೆ",
    seasonH:"ಸೀಸನ್",
    expenseH:"ವೆಚ್ಚ",
    incomeH:"ಆದಾಯ",
    profitH:"ಲಾಭ",
    actionH:"ಕ್ರಿಯಾ"
  }
};

function updateLang(){
  let x=t[currentLang];

  title.innerText=x.title;
  subtitle.innerText=x.subtitle;

  village.placeholder=x.village;
  crop.placeholder=x.crop;

  expenseLabel.innerText=x.expense;
  marketLabel.innerText=x.market;

  seeds.placeholder=x.seeds;
  fertilizer.placeholder=x.fertilizer;
  labour.placeholder=x.labour;
  irrigation.placeholder=x.irrigation;

  quantity.placeholder=x.quantity;
  rate.placeholder=x.rate;

  addBtn.innerText=x.add;
  clearBtn.innerText=x.clear;

  totalLabel.innerHTML=x.total+": ₹ <span id='totalProfit'>0</span>";

  thVillage.innerText=x.villageH;
  thCrop.innerText=x.cropH;
  thSeason.innerText=x.seasonH;
  thExpense.innerText=x.expenseH;
  thIncome.innerText=x.incomeH;
  thProfit.innerText=x.profitH;
  thAction.innerText=x.actionH;
}

function startListening(id){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if(!SpeechRecognition){
    voiceStatus.innerText="Voice not supported";
    return;
  }

  const r=new SpeechRecognition();
  r.lang=currentLang==="kn"?"kn-IN":"en-IN";

  voiceStatus.innerText="🎤 Listening...";

  r.start();

  r.onresult=e=>{
    document.getElementById(id).value=e.results[0][0].transcript;
    voiceStatus.innerText="✔ Done";
  };

  r.onerror=e=>{
    voiceStatus.innerText="❌ Use typing";
  };

  r.onend=()=>setTimeout(()=>voiceStatus.innerText="",2000);
}

function addRecord(){
  let c=crop.value,q=+quantity.value,r=+rate.value;
  if(!c||q<=0||r<=0){alert("Enter valid");return;}

  let exp=(+seeds.value||0)+(+fertilizer.value||0)+(+labour.value||0)+(+irrigation.value||0);
  let inc=q*r;
  let p=inc-exp;

  records.push({v:village.value,c, s:season.value,exp,inc,p});
  localStorage.setItem("farmData",JSON.stringify(records));
  display();
  clearForm();
}

function display(){
  tableData.innerHTML="";
  let total=0,top={n:"-",p:-Infinity};

  records.forEach((x,i)=>{
    total+=x.p;
    if(x.p>top.p) top={n:x.c,p:x.p};

    tableData.innerHTML+=`
    <tr>
    <td>${x.v}</td>
    <td>${x.c}</td>
    <td>${x.s}</td>
    <td>₹${x.exp}</td>
    <td>₹${x.inc}</td>
    <td class="${x.p>=0?'profit':'loss'}">₹${x.p}</td>
    <td><button onclick="del(${i})">X</button></td>
    </tr>`;
  });

  totalProfit.innerText=total;
  topCropBox.innerText=t[currentLang].top+": "+top.n;
}

function del(i){
  records.splice(i,1);
  localStorage.setItem("farmData",JSON.stringify(records));
  display();
}

function clearForm(){
  document.querySelectorAll("input").forEach(i=>i.value="");
}

function loadSeason(){
  season.innerHTML="";
  seasons[currentLang].forEach(x=>season.innerHTML+=`<option>${x}</option>`);
}

function setEnglish(){currentLang="en";updateLang();loadSeason();}
function setKannada(){currentLang="kn";updateLang();loadSeason();}

setEnglish();
display();
