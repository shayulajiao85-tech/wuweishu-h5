// UI逻辑和解释引擎（精简版——仅保留综合页实际需要的函数）
var SHICHEN=[{label:"子时 (23:00-00:59)",v:0},{label:"丑时 (01:00-02:59)",v:1},{label:"寅时 (03:00-04:59)",v:2},{label:"卯时 (05:00-06:59)",v:3},{label:"辰时 (07:00-08:59)",v:4},{label:"巳时 (09:00-10:59)",v:5},{label:"午时 (11:00-12:59)",v:6},{label:"未时 (13:00-14:59)",v:7},{label:"申时 (15:00-16:59)",v:8},{label:"酉时 (17:00-18:59)",v:9},{label:"戌时 (19:00-20:59)",v:10},{label:"亥时 (21:00-22:59)",v:11}];
var DZ_NAMES=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
let currentLunarYear=0, currentLunarMonth=0, currentLunarDay=0;
function initUI(){
let yearSel=document.getElementById("lunarYear");
for(let y=2100;y>=1900;y--){
let baseIdx=(y-1900)*2;
let info=LUNAR_DATA[baseIdx], leap=(info>>20)&0xf;
let label=y+"年";
if(leap>0) label+="(闰"+leap+"月)";
yearSel.innerHTML+='<option value="'+y+'">'+label+'</option>';
}
let hourSel=document.getElementById("lunarHour");
SHICHEN.forEach(s=>hourSel.innerHTML+='<option value="'+s.v+'">'+s.label+'</option>');
setToday();
}
function setToday(){
let now=new Date();
let y=now.getFullYear(), m=now.getMonth()+1, d=now.getDate();
let found=false;
for(let ly=y-1;ly<=y+1&&!found;ly++){
for(let lm=1;lm<=12&&!found;lm++){
for(let ld=1;ld<=30&&!found;ld++){
let sd=lunarToSolar(ly,lm,ld);
if(sd&&sd.year===y&&sd.month===m&&sd.day===d){
document.getElementById("lunarYear").value=ly;
updateMonthOptions(ly);
document.getElementById("lunarMonth").value=lm;
updateDayOptions();
document.getElementById("lunarDay").value=ld;
document.getElementById("lunarHour").value=Math.floor(now.getHours()/2);
currentLunarYear=ly; currentLunarMonth=lm; currentLunarDay=ld;
updateSolarInfo();
found=true;
}
}
}
}
if(!found){
let h=Math.floor(now.getHours()/2);
document.getElementById("lunarHour").value=h;
}
}
function setNow(){
let h=Math.floor(new Date().getHours()/2);
document.getElementById("lunarHour").value=h;
}
function updateMonthOptions(year){
let sel=document.getElementById("lunarMonth");
sel.innerHTML="";
let months=getLunarMonths(year||parseInt(document.getElementById("lunarYear").value));
months.forEach(m=>sel.innerHTML+='<option value="'+m.value+'">'+m.label+'</option>');
updateDayOptions();
}
function updateDayOptions(){
let y=parseInt(document.getElementById("lunarYear").value);
let m=parseInt(document.getElementById("lunarMonth").value);
let sel=document.getElementById("lunarDay");
sel.innerHTML="";
let days=getLunarMonthDays(y,m);
for(let d=1;d<=days;d++) sel.innerHTML+='<option value="'+d+'">'+d+'</option>';
updateSolarInfo();
}
function updateSolarInfo(){
let y=parseInt(document.getElementById("lunarYear").value);
let m=parseInt(document.getElementById("lunarMonth").value);
let d=parseInt(document.getElementById("lunarDay").value);
let sd=lunarToSolar(y,m,d);
if(sd) document.getElementById("solarInfo").innerHTML="对应公历："+sd.year+"年"+sd.month+"月"+sd.day+"日";
else document.getElementById("solarInfo").innerHTML="";
}
function renderLiuNian(bazi, solarY){
let currentYear = new Date().getFullYear();
let html = '<h3>近年流年分析</h3>';
html += '<p style="font-size:13px;color:#8b7355;margin-bottom:8px">分析当前年份前后各5年的流年影响，供参考。</p>';
for(let y = currentYear - 5; y <= currentYear + 5; y++){
let yg = TG[(y-4)%10];
let yz = DZ[(y-4)%12];
let ln = analyzeLiuNian(bazi, yg, yz);
let isCurrent = (y === currentYear);
html += '<div style="margin-bottom:12px;padding:8px;border-radius:6px;' + (isCurrent ? 'background:#fff3e0;border:1px solid #ff9800' : 'background:#fdfaf5;border:1px solid #e8dcc8') + '">';
html += '<div style="font-weight:700;font-size:14px;margin-bottom:4px">' + y + '年 ' + yg + yz + '（' + ln.ss + '）' + (isCurrent ? ' <span style="color:#ff9800">● 当前</span>' : '') + '</div>';
if(ln.events.length === 0){
html += '<div style="font-size:13px;color:#a0896e">此年相对平稳，按部就班即可。</div>';
}else{
ln.events.forEach(ev => {
let color = ev.level === '吉' ? '#4caf50' : (ev.level === '凶' ? '#c0392b' : '#ff9800');
html += '<div style="font-size:13px;margin:2px 0"><span style="color:' + color + ';font-weight:700">[' + ev.type + ']</span> ' + ev.desc + '</div>';
});
}
html += '</div>';
}
document.getElementById("liunianCard").innerHTML = html;
}