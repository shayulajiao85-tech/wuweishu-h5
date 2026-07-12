// 八字计算引擎 v2 - 支持农历输入
const TG=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const DZ=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const WX_MAP={甲:"木",乙:"木",丙:"火",丁:"火",戊:"土",己:"土",庚:"金",辛:"金",壬:"水",癸:"水",子:"水",丑:"土",寅:"木",卯:"木",辰:"土",巳:"火",午:"火",未:"土",申:"金",酉:"金",戌:"土",亥:"水"};
const YIN_YANG={甲:1,乙:0,丙:1,丁:0,戊:1,己:0,庚:1,辛:0,壬:1,癸:0,子:1,丑:0,寅:1,卯:0,辰:1,巳:0,午:1,未:0,申:1,酉:0,戌:1,亥:0};
const CG={子:["癸"],丑:["己","癸","辛"],寅:["甲","丙","戊"],卯:["乙"],辰:["戊","乙","癸"],巳:["丙","庚","戊"],午:["丁","己"],未:["己","丁","乙"],申:["庚","壬","戊"],酉:["辛"],戌:["戊","辛","丁"],亥:["壬","甲"]};
const SHENG_OBJ={木:"火",火:"土",土:"金",金:"水",水:"木"};
const KE_OBJ={木:"土",土:"水",水:"火",火:"金",金:"木"};
const SHENG_BY={木:"水",火:"木",土:"火",金:"土",水:"金"};
const KE_BY={木:"金",火:"水",土:"木",金:"火",水:"金"};
const MONTH_ZHI=["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"];
// 节气近似日期 {month:公历月, day:日}
const JIEQI_APPROX = [
{m:2,d:4},{m:3,d:6},{m:4,d:5},{m:5,d:6},{m:6,d:6},{m:7,d:7},
{m:8,d:8},{m:9,d:8},{m:10,d:8},{m:11,d:7},{m:12,d:7},{m:1,d:6}
];
// 获取月柱: 输入公历年月日, 返回[天干, 地支]
function getMonthGZ(solarY, solarM, solarD){
let bd = new Date(solarY, solarM-1, solarD);
let mi = -1;
for(let i=0; i<12; i++){
let jqM = JIEQI_APPROX[i].m;
let jqD = JIEQI_APPROX[i].d;
let jqY = (jqM >= 2) ? solarY : solarY;
let jqDate = new Date(jqY, jqM-1, jqD);
let ni = (i+1)%12;
let njqM = JIEQI_APPROX[ni].m;
let njqD = JIEQI_APPROX[ni].d;
let njqY = (njqM >= 2 || ni===0) ? solarY : solarY+1;
let nextJq = new Date(njqY, njqM-1, njqD);
if(bd >= jqDate && bd < nextJq){mi=i; break;}
}
if(mi===-1){
let decJq = new Date(solarY, 11, 7);
mi = (bd >= decJq) ? 11 : 0;
}
// 用年干推算月干（五虎遁）
let yg = getYearGan(solarY, solarM, solarD);
let ygIdx = TG.indexOf(yg);
let group = ygIdx % 5;
let baseStart = [2,4,6,8,0][group]; // 丙戊庚壬甲
let moGan = TG[(baseStart + mi) % 10];
return {gan: moGan, zhi: MONTH_ZHI[mi], idx: mi};
}
// 获取年天干 (考虑立春边界)
function getYearGan(solarY, solarM, solarD){
let lichun = new Date(solarY, 1, 4);
let bd = new Date(solarY, solarM-1, solarD);
let y = (bd < lichun) ? solarY-1 : solarY;
return TG[(y-4)%10];
}
// 获取年柱
function getYearGZ(solarY, solarM, solarD){
let lichun = new Date(solarY, 1, 4);
let bd = new Date(solarY, solarM-1, solarD);
let y = (bd < lichun) ? solarY-1 : solarY;
return {gan: TG[(y-4)%10], zhi: DZ[(y-4)%12]};
}
// 获取日柱 (基于1900-01-01甲戌日)
function getDayGZ(solarY, solarM, solarD){
let base = new Date(1900, 0, 1);
let target = new Date(solarY, solarM-1, solarD);
let diff = Math.round((target - base) / 86400000);
return {gan: TG[(diff+10)%10], zhi: DZ[(diff+12)%12]};
}
// 获取时柱
function getHourGZ(dg, hourIdx){
let dgIdx = TG.indexOf(dg);
let group = dgIdx % 5;
let baseStart = [0,2,4,6,8][group];
return {gan: TG[(baseStart + hourIdx) % 10], zhi: DZ[hourIdx]};
}
// 十神
function getShiShen(riGan, gan){
let ri=TG.indexOf(riGan), g=TG.indexOf(gan);
let riYY=YIN_YANG[riGan], gYY=YIN_YANG[gan];
let diff=(g-ri+10)%10;
if(diff===0) return riYY===gYY?"比肩":"劫财";
if(diff===1||diff===2) return riYY===gYY?"食神":"伤官";
if(diff===3||diff===4||diff===5) return riYY===gYY?"偏财":"正财";
if(diff===6||diff===7) return riYY===gYY?"七杀":"正官";
return riYY===gYY?"偏印":"正印";
}
// 主计算函数
function calcBazi(solarY, solarM, solarD, hourIdx, gender){
let yg = getYearGZ(solarY, solarM, solarD);
let mg = getMonthGZ(solarY, solarM, solarD);
let dg = getDayGZ(solarY, solarM, solarD);
let hg = getHourGZ(dg.gan, hourIdx);
let pillars=[
{label:"年柱",gan:yg.gan,zhi:yg.zhi,wxG:WX_MAP[yg.gan],wxZ:WX_MAP[yg.zhi],ss:getShiShen(dg.gan, yg.gan),cg:CG[yg.zhi]},
{label:"月柱",gan:mg.gan,zhi:mg.zhi,wxG:WX_MAP[mg.gan],wxZ:WX_MAP[mg.zhi],ss:getShiShen(dg.gan, mg.gan),cg:CG[mg.zhi]},
{label:"日柱",gan:dg.gan,zhi:dg.zhi,wxG:WX_MAP[dg.gan],wxZ:WX_MAP[dg.zhi],ss:"日主",cg:CG[dg.zhi]},
{label:"时柱",gan:hg.gan,zhi:hg.zhi,wxG:WX_MAP[hg.gan],wxZ:WX_MAP[hg.zhi],ss:getShiShen(dg.gan, hg.gan),cg:CG[hg.zhi]}
];
return {riGan:dg.gan, riZhi:dg.zhi, riWx:WX_MAP[dg.gan], gender, pillars, solarY, solarM, solarD};
}
// === 大运计算 ===
// 获取精确的节气日期（近似值基础上微调）
function getJieQiDate(year, jqIdx){
let jq = JIEQI_APPROX[jqIdx];
let m = jq.m, d = jq.d;
if(jqIdx === 11 && m === 1) year += 1;
return new Date(year, m-1, d);
}
// 计算起运年龄和起运日期
function calcQiYun(solarY, solarM, solarD, gender, yearGan){
let birthday = new Date(solarY, solarM-1, solarD);
let yearYY = YIN_YANG[yearGan]; // 年干阴阳: 1=阳, 0=阴
let isMale = (gender === 'male');
let shunPai = (yearYY === 1 && isMale) || (yearYY === 0 && !isMale);
let daysDiff = 0;
if(shunPai){
for(let i=0; i<12; i++){
let jqDate = getJieQiDate(solarY, i);
if(jqDate > birthday){
daysDiff = Math.round((jqDate - birthday) / 86400000);
break;
}
}
if(daysDiff === 0) daysDiff = 15;
}else{
for(let i=11; i>=0; i--){
let jqDate = getJieQiDate(solarY, i);
if(i === 11 && solarM === 1){ jqDate = getJieQiDate(solarY-1, 11); }
if(jqDate < birthday){
daysDiff = Math.round((birthday - jqDate) / 86400000);
break;
}
}
if(daysDiff === 0) daysDiff = 15;
}
let qiYunAge = Math.round(daysDiff / 3);
if(qiYunAge < 1) qiYunAge = 1;
let qiYunDate = new Date(birthday);
qiYunDate.setFullYear(qiYunDate.getFullYear() + qiYunAge);
return {qiYunAge, shunPai, qiYunYear: qiYunDate.getFullYear()};
}
// 生成大运列表（从起运年开始，排8个大运，每个10年）
function genDaYun(monthGz, qiYun, startYear){
let daYunList = [];
let ganIdx = TG.indexOf(monthGz.gan);
let zhiIdx = DZ.indexOf(monthGz.zhi);
let dir = qiYun.shunPai ? 1 : -1;
let age = qiYun.qiYunAge;
for(let i=0; i<8; i++){
let nextGanIdx = (ganIdx + dir + 10) % 10;
let nextZhiIdx = (zhiIdx + dir + 12) % 12;
daYunList.push({
gan: TG[nextGanIdx], zhi: DZ[nextZhiIdx],
startAge: age, endAge: age + 9,
startYear: startYear + (i * 10)
});
ganIdx = nextGanIdx; zhiIdx = nextZhiIdx;
age += 10;
}
return daYunList;
}
// === 流年分析 ===
// 天干五合
const TG_HE = {甲:"己",己:"甲",乙:"庚",庚:"乙",丙:"辛",辛:"丙",丁:"壬",壬:"丁",戊:"癸",癸:"戊"};
// 地支六合
const DZ_HE = {子:"丑",丑:"子",寅:"亥",亥:"寅",卯:"戌",戌:"卯",辰:"酉",酉:"辰",巳:"申",申:"巳",午:"未",未:"午"};
// 地支六冲
const DZ_CHONG = {子:"午",午:"子",丑:"未",未:"丑",寅:"申",申:"寅",卯:"酉",酉:"卯",辰:"戌",戌:"辰",巳:"亥",亥:"巳"};
// 分析单个流年
function analyzeLiuNian(bazi, yearGan, yearZhi){
let riGan = bazi.riGan, riZhi = bazi.riZhi;
let events = [];
// 天干合
if(TG_HE[yearGan] === riGan) events.push({type:"合", level:"吉", desc:"流年天干与日主相合，今年人缘好，易有合作或姻缘机会。"});
// 地支冲
if(DZ_CHONG[yearZhi] === riZhi) events.push({type:"冲", level:"凶", desc:"流年地支冲日支（夫妻宫），今年感情或家庭变动较大，注意情绪稳定。"});
// 地支合
if(DZ_HE[yearZhi] === riZhi) events.push({type:"合", level:"吉", desc:"流年合日支，今年感情婚姻运不错，也可能有搬家或环境变动。"});
// 太岁关系
bazi.pillars.forEach((p, i) => {
let label = p.label;
if(yearZhi === p.zhi){
if(i === 0) events.push({type:"值", level:"中", desc:"流年地支与年柱伏吟，今年注意长辈健康或家庭事务。"});
else if(i === 2) events.push({type:"伏", level:"中", desc:"流年地支与日柱伏吟，今年个人情绪波动大，宜静不宜动。"});
}
if(DZ_CHONG[yearZhi] === p.zhi) events.push({type:"冲", level:"凶", desc:"流年冲"+label+"，注意相关领域的变动。"});
});
// 十神
let yearSS = getShiShen(riGan, yearGan);
if(yearSS === "正财" || yearSS === "偏财") events.push({type:"财", level:"吉", desc:"今年财运有起色，正财偏财都有机会，但偏财年也要注意控制风险。"});
if(yearSS === "正官" || yearSS === "七杀") events.push({type:"官", level:"中", desc:"今年事业上有压力也有机会，利于考试、求职、晋升，但七杀年压力更大。"});
if(yearSS === "正印" || yearSS === "偏印") events.push({type:"印", level:"吉", desc:"今年学习运不错，容易得到贵人帮助，适合进修和考证书。"});
if(yearSS === "食神" || yearSS === "伤官") events.push({type:"食", level:"中", desc:"今年创作灵感多，适合表现自己，但伤官年注意言行不要太张扬。"});
if(yearSS === "比肩" || yearSS === "劫财") events.push({type:"比", level:"中", desc:"今年社交活跃，朋友多，但也要注意竞争和借钱不还的情况。"});
return {gan: yearGan, zhi: yearZhi, ss: yearSS, events};
}
// === 纳音五行 ===
const NA_YIN = [
"海中金","炉中火","大林木","路旁土","剑锋金","山头火",
"涧下水","城头土","白蜡金","杨柳木","泉中水","屋上土",
"霹雳火","松柏木","流年水","砂石金","山下火","平地木",
"壁上土","金箔金","覆灯火","天河水","大驿土","钗钏金",
"桑柘木","柘榴木","大海水","石榴木","大海水"
];
// === 冲合刑害 ===
function checkPillarInteraction(yGan, yZhi, pGan, pZhi){
let res = [];
// 天干五合
if(TG_HE[yGan] === pGan) res.push({type:"天合", level:"吉", desc:"天干相合，此"+pGan+"与流年"+yGan+"合，相关领域顺利"});
// 地支六合
if(DZ_HE[yZhi] === pZhi) res.push({type:"地合", level:"吉", desc:"地支相合，稳定和谐"});
// 地支六冲
if(DZ_CHONG[yZhi] === pZhi) res.push({type:"六冲", level:"凶", desc:"地支六冲！变动大、不稳定，凡事三思"});
// 地支相刑（简化：子卯、寅巳申、丑戌未、辰午酉亥自刑）
let xingMap = {子:["卯"],卯:["子"],寅:["巳","申"],巳:["寅","申"],申:["寅","巳"],丑:["戌","未"],戌:["丑","未"],未:["丑","戌"]};
if(xingMap[yZhi] && xingMap[yZhi].includes(pZhi)) res.push({type:"相刑", level:"凶", desc:"地支相刑，易有口舌是非、小人在侧"});
// 自刑
if(yZhi === pZhi && ["辰","午","酉","亥"].includes(yZhi)) res.push({type:"自刑", level:"中", desc:"自刑，内心纠结，容易自己跟自己过不去"});
// 地支三合
let sanheMap = {"申子辰":["申","子","辰"],"亥卯未":["亥","卯","未"],"寅午戌":["寅","午","戌"],"巳酉丑":["巳","酉","丑"]};
for(let k in sanheMap){if(k.includes(yZhi) && sanheMap[k].includes(pZhi) && yZhi !== pZhi) res.push({type:"三合", level:"吉", desc:"地支三合局，合力强大，事业感情有贵人相助"});}
return res;
}
// 按月干支：年上起月法
function getMonthGZ_byYearGan(yearGan, monthIdx){
let ygIdx = TG.indexOf(yearGan);
let baseG = [2,4,6,8,0][ygIdx % 5]; // 丙戊庚壬甲
return {gan: TG[(baseG + monthIdx) % 10], zhi: MONTH_ZHI[monthIdx]};
}
// 幸运数字
function getLuckyInfo(riWx, strongWx, weakWx){
let numMap = {木:[3,8],火:[2,7],土:[5,0],金:[4,9],水:[1,6]};
let colorMap = {木:"青色、绿色",火:"红色、紫色",土:"黄色、棕色",金:"白色、银色",水:"黑色、蓝色"};
let itemMap = {木:"木质饰品、绿植、书",火:"红色手绳、蜡烛、电子设备",土:"陶瓷、黄水晶、石头",金:"金属饰品、白水晶、刀具（注意安全）",水:"黑曜石、鱼缸、水杯"};
let xiShen = weakWx.length > 0 ? weakWx[0] : riWx;
return {
xiShen: xiShen,
numbers: numMap[xiShen],
colors: colorMap[xiShen],
items: itemMap[xiShen],
avoidWx: strongWx.length > 0 ? strongWx[0] : null,
avoidColors: strongWx.length > 0 ? colorMap[strongWx[0]] : "无特别忌讳"
};
}
function getNaYin(gan, zhi){
let gIdx = TG.indexOf(gan), zIdx = DZ.indexOf(zhi);
let idx = (gIdx + zIdx) % 60;
return NA_YIN[Math.floor(idx / 2)] || "未知";
}
// === 神煞 ===
function calcShenSha(pillars, riGan, riZhi, gender){
let allZhi = pillars.map(p => p.zhi);
let yearZhi = pillars[0].zhi, monthZhi = pillars[1].zhi;
let dayZhi = pillars[2].zhi, hourZhi = pillars[3].zhi;
let shenSha = [];
// 天乙贵人
let tianYiMap = {甲:["丑","未"],乙:["子","申"],丙:["亥","酉"],丁:["亥","酉"],戊:["丑","未"],己:["子","申"],庚:["寅","午"],辛:["寅","午"],壬:["卯","巳"],癸:["卯","巳"]};
let tyZhi = tianYiMap[riGan] || [];
allZhi.forEach((z,i) => {
if(tyZhi.includes(z)) shenSha.push({name:"天乙贵人", desc:"逢凶化吉，易得贵人相助，人缘好有人帮", pillar: pillars[i].label});
});
// 文昌星
let wcMap = {甲:"巳",乙:"午",丙:"申",丁:"酉",戊:"申",己:"酉",庚:"亥",辛:"子",壬:"寅",癸:"卯"};
let wcZhi = wcMap[riGan];
allZhi.forEach((z,i) => {
if(z === wcZhi) shenSha.push({name:"文昌星", desc:"聪明好学，有文采，考试运不错", pillar: pillars[i].label});
});
// 桃花
let thMap = {"申子辰":"酉","亥卯未":"子","寅午戌":"卯","巳酉丑":"午"};
function findTH(zhi){ for(let k in thMap){ if(k.includes(zhi)) return thMap[k]; } return null; }
let thZhi = findTH(dayZhi);
allZhi.forEach((z,i) => {
if(z === thZhi) shenSha.push({name:"桃花", desc:"异性缘好，有魅力，但也要注意烂桃花", pillar: pillars[i].label});
});
// 驿马
let ymMap = {"申子辰":"寅","亥卯未":"巳","寅午戌":"申","巳酉丑":"亥"};
function findYM(zhi){ for(let k in ymMap){ if(k.includes(zhi)) return ymMap[k]; } return null; }
let ymZhi = findYM(dayZhi);
allZhi.forEach((z,i) => {
if(z === ymZhi) shenSha.push({name:"驿马", desc:"一生多动，适合外出发展，不宜久居一地", pillar: pillars[i].label});
});
// 华盖
let hgMap = {"申子辰":"辰","亥卯未":"未","寅午戌":"戌","巳酉丑":"丑"};
function findHG(zhi){ for(let k in hgMap){ if(k.includes(zhi)) return hgMap[k]; } return null; }
let hgZhi = findHG(dayZhi);
allZhi.forEach((z,i) => {
if(z === hgZhi) shenSha.push({name:"华盖", desc:"有艺术天赋，喜欢独处思考，对玄学命理有悟性", pillar: pillars[i].label});
});
// 羊刃
let yrMap = {甲:"卯",乙:"辰",丙:"午",丁:"未",戊:"午",己:"未",庚:"酉",辛:"戌",壬:"子",癸:"丑"};
let yrZhi = yrMap[riGan];
allZhi.forEach((z,i) => {
if(z === yrZhi) shenSha.push({name:"羊刃", desc:"个性刚强，有魄力，但容易冲动惹事，需要注意克制", pillar: pillars[i].label, type:"凶"});
});
// 天德贵人（以月支查）
let tdMap = {寅:"丁",卯:"申",辰:"壬",巳:"辛",午:"亥",未:"甲",申:"癸",酉:"寅",戌:"丙",亥:"乙",子:"巳",丑:"庚"};
let tdGan = tdMap[monthZhi];
if(tdGan && allZhi.some((z,i) => pillars[i].gan === tdGan || CG[z]?.includes(tdGan))) {
shenSha.push({name:"天德贵人", desc:"逢凶化吉之星，遇难成祥，一辈子有老天爷照应着，关键时刻总能化险为夷", type:"吉"});
}
// 月德贵人（以月支查）
let ydMap = {寅午戌:"丙",亥卯未:"甲",申子辰:"壬",巳酉丑:"庚"};
function findYD(zhi){ for(let k in ydMap){ if(k.includes(zhi)) return ydMap[k]; } return null; }
let ydGan = findYD(monthZhi);
if(ydGan && pillars.some(p => p.gan === ydGan)) {
shenSha.push({name:"月德贵人", desc:"心地善良，人缘好，女命更吉。一辈子没大灾大难，即使遇事也有人帮", type:"吉"});
}
// 福星贵人（以日干查）
let fxMap = {甲:"丑",乙:"寅",丙:"子",丁:"酉",戊:"申",己:"未",庚:"午",辛:"巳",壬:"辰",癸:"卯"};
let fxZhi = fxMap[riGan];
allZhi.forEach((z,i) => {
if(z === fxZhi) shenSha.push({name:"福星贵人", desc:"一生吃穿不愁，福气好，比上不足比下有余，是个有福之人", pillar: pillars[i].label, type:"吉"});
});
// 太极贵人（以日干年干查）
let tjMap = {甲:"子午",乙:"子午",丙:"卯酉",丁:"卯酉",戊:"辰戌丑未",己:"辰戌丑未",庚:"寅亥",辛:"寅亥",壬:"巳申",癸:"巳申"};
let tjZhis = (tjMap[riGan]||"").split("");
allZhi.forEach((z,i) => {
if(tjZhis.includes(z)) shenSha.push({name:"太极贵人", desc:"对玄学命理有天赋，喜欢钻研神秘事物，第六感比常人强", pillar: pillars[i].label, type:"吉"});
});
// 禄神（以日干查）
let luMap = {甲:"寅",乙:"卯",丙:"巳",丁:"午",戊:"巳",己:"午",庚:"申",辛:"酉",壬:"亥",癸:"子"};
let luZhi = luMap[riGan];
allZhi.forEach((z,i) => {
if(z === luZhi) shenSha.push({name:"禄神", desc:"有稳定饭碗，不缺吃穿，正财稳定。在哪一柱就在哪个阶段生活安稳", pillar: pillars[i].label, type:"吉"});
});
// 劫煞（以日支查）
let jsMap = {"申子辰":"巳","亥卯未":"申","寅午戌":"亥","巳酉丑":"寅"};
function findJS(zhi){ for(let k in jsMap){ if(k.includes(zhi)) return jsMap[k]; } return null; }
let jsZhi = findJS(dayZhi);
allZhi.forEach((z,i) => {
if(z === jsZhi) shenSha.push({name:"劫煞", desc:"犯小人！容易被人背后使绊子、借钱不还、合伙被坑。交友要擦亮眼，合同要写清楚", pillar: pillars[i].label, type:"凶"});
});
// 灾煞（以日支查，劫煞对冲）
let zsMap = {"申子辰":"午","亥卯未":"酉","寅午戌":"子","巳酉丑":"卯"};
function findZS(zhi){ for(let k in zsMap){ if(k.includes(zhi)) return zsMap[k]; } return null; }
let zsZhi = findZS(dayZhi);
allZhi.forEach((z,i) => {
if(z === zsZhi) shenSha.push({name:"灾煞", desc:"容易遭意外之灾，比如车祸、伤病、官司。平时多注意安全，别做冒险的事", pillar: pillars[i].label, type:"凶"});
});
// 孤辰/寡宿
let gcMap = {亥子丑:"寅",寅卯辰:"巳",巳午未:"申",申酉戌:"亥"}; // 孤辰
let gsMap = {亥子丑:"戌",寅卯辰:"丑",巳午未:"辰",申酉戌:"未"}; // 寡宿
function findGC(zhi){ for(let k in gcMap){ if(k.includes(zhi)) return gcMap[k]; } return null; }
function findGS(zhi){ for(let k in gsMap){ if(k.includes(zhi)) return gsMap[k]; } return null; }
let gcZhi = findGC(dayZhi);
let gsZhi = findGS(dayZhi);
allZhi.forEach((z,i) => {
if(z === gcZhi) shenSha.push({name:"孤辰", desc:"性格比较独，喜欢一个人待着。感情上容易晚婚，或者婚后也觉得孤单。学会主动跟人交流", pillar: pillars[i].label, type:"凶"});
if(z === gsZhi) shenSha.push({name:"寡宿", desc:"跟孤辰类似，感情路上不太顺，容易觉得没人懂自己。但不是命中注定孤独——主动改变就能破", pillar: pillars[i].label, type:"凶"});
});
// 空亡（以日柱旬查）
let xunStart = Math.floor(TG.indexOf(riGan) / 2) * 2;
let xunGans = TG.slice(xunStart, xunStart+10);
let xunEnd = (xunStart + 10) % 10;
let kwZhis = [DZ[(xunStart+10)%12], DZ[(xunStart+11)%12]];
allZhi.forEach((z,i) => {
if(kwZhis.includes(z)) shenSha.push({name:"空亡", desc:"对应领域容易落空——付出多回报少，或者计划赶不上变化。在"+pillars[i].label+"，"+pillars[i].label.replace("柱","")+"方面的事要多留后手", pillar: pillars[i].label, type:"凶"});
});
return shenSha;
}
// 五行统计
function countWuxing(pillars){
let cnt={木:0,火:0,土:0,金:0,水:0};
pillars.forEach(p=>{
cnt[p.wxG]++; cnt[p.wxZ]++;
if(p.cg) p.cg.forEach(c=>cnt[WX_MAP[c]]=(cnt[WX_MAP[c]]||0)+0.5);
});
return cnt;
}
// 五行分析
function analyzeWuxing(cnt, riWx){
let total=Object.values(cnt).reduce((a,b)=>a+b,0);
let strong=[], weak=[], balanced=[];
Object.entries(cnt).forEach(([wx,val])=>{
let pct=val/total;
if(pct>0.28) strong.push(wx);
else if(pct<0.13) weak.push(wx);
else balanced.push(wx);
});
let xi=[];
if(strong.length>2) xi.push("命局五行偏旺，需要平衡。");
if(weak.includes(riWx)) xi.push("日主偏弱，喜"+SHENG_BY[riWx]+"来生扶，也喜"+riWx+"来帮身。");
else if(strong.includes(riWx)) xi.push("日主较强，喜"+KE_BY[riWx]+"来克制，也喜"+KE_OBJ[riWx]+"来泄秀。");
else xi.push("日主中和，五行较平衡。");
return {cnt, strong, weak, balanced, xi};
}
// 梅花易数引擎
