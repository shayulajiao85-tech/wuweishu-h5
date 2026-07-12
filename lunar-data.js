// 农历数据表 1900-2100
// 编码规则: (leapMon << 20) | (leapLen << 16) | monthInfo
// monthInfo低12bit: 1=大月30天, 0=小月29天, bit0=正月, bit11=腊月
// leapMon: 0=无闰月, 1-12=闰几月; leapLen: 0=闰月29天, 1=闰月30天
// 中国新年对应公历: newYearSolar = [月, 日] (公历)
const LUNAR_DATA = [
0x04bd8,[1,31], 0x04ae0,[2,19], 0x0a570,[2,8], 0x054d5,[1,29], 0x0d260,[2,16], 0x0d950,[2,4], 0x16554,[1,25], 0x056a0,[2,13], 0x09ad0,[2,2], 0x055d2,[1,22],
0x04ae0,[2,10], 0x0a5b6,[1,30], 0x0a4d0,[2,18], 0x0d250,[2,6], 0x1d255,[1,26], 0x0b540,[2,14], 0x0d6a0,[2,3], 0x0ada2,[1,23], 0x095b0,[2,11], 0x14977,[2,1],
0x04970,[2,20], 0x0a4b0,[2,8], 0x0b4b5,[1,28], 0x06a50,[2,16], 0x06d40,[2,5], 0x1ab54,[1,25], 0x02b60,[2,13], 0x09570,[2,2], 0x052f2,[2,20], 0x04970,[2,9],
0x06566,[1,30], 0x0d4a0,[2,17], 0x0ea50,[2,6], 0x06e95,[1,26], 0x05ad0,[2,14], 0x02b60,[2,4], 0x186e3,[1,24], 0x092e0,[2,11], 0x1c8d7,[1,31], 0x0c950,[2,19],
0x0d4a0,[2,8], 0x1d8a6,[1,29], 0x0b550,[2,17], 0x056a0,[2,6], 0x1a5b4,[1,26], 0x025d0,[2,14], 0x092d0,[2,3], 0x0d2b2,[2,21], 0x0a950,[2,10], 0x0b557,[1,30],
0x06ca0,[2,17], 0x0b550,[2,6], 0x15355,[1,27], 0x04da0,[2,15], 0x0a5b0,[2,5], 0x14573,[1,25], 0x052b0,[2,13], 0x0a9a8,[2,2], 0x0e950,[2,20], 0x06aa0,[2,9],
0x0aea6,[1,29], 0x0ab50,[2,17], 0x04b60,[2,6], 0x0aae4,[1,27], 0x0a570,[2,14], 0x05260,[2,4], 0x0f263,[1,24], 0x0d950,[2,12], 0x05b57,[2,1], 0x056a0,[2,20],
0x096d0,[2,9], 0x04dd5,[1,29], 0x04ad0,[2,17], 0x0a4d0,[2,7], 0x0d4d4,[1,27], 0x0d250,[2,15], 0x0d558,[2,5], 0x0b540,[1,25], 0x0b6a0,[2,13], 0x195a6,[2,2],
0x095b0,[2,20], 0x049b0,[2,9], 0x0a974,[1,30], 0x0a4b0,[2,17], 0x0b27a,[2,7], 0x06a50,[1,27], 0x06d40,[2,15], 0x0af46,[2,4], 0x0ab60,[2,20], 0x09570,[2,9],
0x04af5,[1,29], 0x04970,[2,17], 0x064b0,[2,6], 0x074a3,[1,27], 0x0ea50,[2,14], 0x06b58,[2,4], 0x05ac0,[1,23], 0x0ab60,[2,12], 0x096d5,[1,31], 0x092e0,[2,19],
0x0c960,[2,8], 0x0d954,[1,28], 0x0d4a0,[2,16], 0x0da50,[2,5], 0x07552,[1,26], 0x056a0,[2,14], 0x0abb7,[2,3], 0x025d0,[2,21], 0x092d0,[2,10], 0x0cab5,[1,30],
0x0a950,[2,17], 0x0b4a0,[2,7], 0x0baa4,[1,28], 0x0ad50,[2,16], 0x055d9,[2,5], 0x04ba0,[2,23], 0x0a5b0,[2,12], 0x15176,[1,31], 0x052b0,[2,18], 0x0a930,[2,8],
0x07954,[1,29], 0x06aa0,[2,16], 0x0ad50,[2,5], 0x05b52,[1,26], 0x04b60,[2,13], 0x0a6e6,[2,3], 0x0a4e0,[2,21], 0x0d260,[2,10], 0x0ea65,[1,30], 0x0d530,[2,18],
0x05aa0,[2,7], 0x076a3,[1,28], 0x096d0,[2,15], 0x04afb,[2,4], 0x04ad0,[2,22], 0x0a4d0,[2,10], 0x1d0b6,[1,31], 0x0d250,[2,18], 0x0d520,[2,7], 0x0dd45,[1,28],
0x0b5a0,[2,15], 0x056d0,[2,5], 0x055b2,[1,25], 0x049b0,[2,12], 0x0a577,[2,2], 0x0a4b0,[2,20], 0x0aa50,[2,9], 0x1b255,[1,30], 0x06d20,[2,17], 0x0ada0,[2,6],
0x14b63,[1,27], 0x09370,[2,15], 0x049f8,[2,4], 0x04970,[2,22], 0x064b0,[2,11], 0x168a6,[1,31], 0x0ea50,[2,19], 0x06aa0,[2,9], 0x1a6c4,[1,29], 0x0aae0,[2,17],
0x092e0,[2,6], 0x0d2e3,[1,27], 0x0c960,[2,14], 0x0d557,[2,3], 0x0d4a0,[2,21], 0x0da50,[2,10], 0x05d55,[1,30], 0x056a0,[2,18], 0x0a6d0,[2,7], 0x055d4,[1,28],
0x052d0,[2,15], 0x0a9b8,[2,5], 0x0a950,[2,22], 0x0b4a0,[2,11], 0x0b6a6,[1,31], 0x0ad50,[2,19], 0x055a0,[2,8], 0x0aba4,[1,29], 0x0a5b0,[2,17], 0x052b0,[2,6],
0x0b273,[1,27], 0x06930,[2,14], 0x07337,[2,4], 0x06aa0,[2,22], 0x0ad50,[2,11], 0x14b55,[1,31], 0x04b60,[2,18], 0x0a570,[2,8], 0x054e4,[1,29], 0x0d160,[2,16],
0x0e968,[2,6], 0x0d520,[2,23], 0x0daa0,[2,12], 0x16aa6,[2,1], 0x056d0,[2,19], 0x04ae0,[2,8], 0x0a9d4,[1,29], 0x0a2d0,[2,17], 0x0d150,[2,6], 0x0f252,[2,23],
0x0d520,[2,12]
];
// 农历转公历: lunarM 1-12=正常月, 13-24=闰月(13=闰1月, 14=闰2月...)
function lunarToSolar(lunarY, lunarM, lunarD){
let baseIdx = (lunarY - 1900) * 2;
if(baseIdx < 0 || baseIdx >= LUNAR_DATA.length) return null;
let info = LUNAR_DATA[baseIdx];
let nySolar = LUNAR_DATA[baseIdx + 1];
let nyMonth = nySolar[0], nyDay = nySolar[1];
let leapMon = (info >> 20) & 0xf;
let leapLen = (info >> 16) & 0x1;
let monthInfo = info & 0xfff;
let isLeap = (lunarM > 12);
let realM = isLeap ? (lunarM - 12) : lunarM;
let totalDays = 0;
for(let m = 1; m <= 12; m++){
if(m === realM && isLeap){
let leapDays = 29 + leapLen;
totalDays += leapDays;
}
if(m >= realM) break;
let days = (monthInfo & 1) ? 30 : 29;
totalDays += days;
monthInfo >>= 1;
if(leapMon > 0 && m === leapMon){
let leapDays = 29 + leapLen;
totalDays += leapDays;
}
}
totalDays += (lunarD - 1);
let solarDate = new Date(lunarY, nyMonth - 1, nyDay);
solarDate.setDate(solarDate.getDate() + totalDays);
return {year: solarDate.getFullYear(), month: solarDate.getMonth() + 1, day: solarDate.getDate()};
}
// 获取某年农历月份列表 value: 1-12=正常月, 13-24=闰月
function getLunarMonths(lunarY){
let baseIdx = (lunarY - 1900) * 2;
if(baseIdx < 0 || baseIdx >= LUNAR_DATA.length) return [];
let info = LUNAR_DATA[baseIdx];
let leapMon = (info >> 20) & 0xf;
let months = [];
for(let m = 1; m <= 12; m++){
months.push({label: m + "月", value: m});
if(leapMon > 0 && m === leapMon) months.push({label: "闰" + m + "月", value: m + 12});
}
return months;
}
// 获取某年某月的天数 lunarM: 1-12=正常, 13-24=闰
function getLunarMonthDays(lunarY, lunarM){
let baseIdx = (lunarY - 1900) * 2;
if(baseIdx < 0 || baseIdx >= LUNAR_DATA.length) return 30;
let info = LUNAR_DATA[baseIdx];
let leapMon = (info >> 20) & 0xf;
let monthInfo = info & 0xfff;
let isLeap = (lunarM > 12);
let realM = isLeap ? (lunarM - 12) : lunarM;
if(realM >= 1 && realM <= 12) return ((monthInfo >> (realM - 1)) & 1) ? 30 : 29;
return 30;
}
