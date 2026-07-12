// === 瞎子算命风格解释引擎 ===
function renderZonglun(bazi,wx){
let riWx=bazi.riWx,solarY=bazi.solarY,solarM=bazi.solarM;let ss=bazi.pillars.map(p=>p.ss);
let riZhi=bazi.riZhi;let mg=bazi.pillars[1];
let wx5=["木","火","土","金","水"];let emoji={木:"树",火:"太阳",土:"大地",金:"刀剑",水:"江河"};
let nyin=getNaYin(bazi.pillars[0].gan,bazi.pillars[0].zhi);
let shenSha=calcShenSha(bazi.pillars,bazi.riGan,bazi.riZhi,bazi.gender);
let parts=[];
parts.push("你这个八字啊，我仔细瞅了瞅。日主是"+riWx+"，"+(wx.strong.includes(riWx)?"身不算弱":"身有点偏弱")+"。生在"+mg.zhi+"月，按《穷通宝鉴》的讲法，"+riWx+"命人逢"+mg.zhi+"月，就好比"+emoji[riWx]+"遇上了合适的季节——"+(wx.balanced.length>3?"还算舒展":"有些拧巴")+"。");
parts.push("年上纳音是"+nyin+"，这个纳音啊，老话说是你这个人一辈子的底色。《三命通会》里记载了六十甲子纳音，每个都有讲究。你这个"+nyin+"，"+(nyin.includes("金")?"金命的人讲义气、说话算话":"")+(nyin.includes("木")?"木命的人有生机、能扛事":"")+(nyin.includes("水")?"水命的人灵活、会来事":"")+(nyin.includes("火")?"火命的人热情、不服输":"")+(nyin.includes("土")?"土命的人稳重、靠得住":"")+"。");
let jiStars=shenSha.filter(s=>s.type!=="凶");
let xiongStars=shenSha.filter(s=>s.type==="凶");
if(jiStars.length>0) parts.push("你这八字里头啊，带了几颗贵人星——"+jiStars.map(s=>s.name).join("、")+"。这说明你这人还是有些福气的，关键时刻老天爷不会不管。");
if(xiongStars.length>0) parts.push("但是话说回来——"+xiongStars.map(s=>s.name).join("、")+"这几颗凶星也在了。不是说不好，是说提醒你：有些坑得绕着走，有些人得防着点，有些事不能硬来。");
let ts=shenSha.find(s=>s.name==="天乙贵人");
if(ts) parts.push("带天乙贵人，这是最大的贵人星！《渊海子平》里说'天乙贵人，人君之象'，就是说你这辈子关键时刻总有人拉你一把。");
if(shenSha.find(s=>s.name==="天德贵人")) parts.push("天德贵人到位了——老话说'天德照命，一生无大难'。你这个人吧，逢凶化吉的能耐比一般人强。");
if(shenSha.find(s=>s.name==="劫煞")) parts.push("劫煞这个星呢，说白了就是犯小人。《三命通会》里写了：'劫煞为灾不可当，徒然奔走名利场'。防着点身边那些表面热情背地使绊子的人。合作的事、借钱的事，多个心眼。");
if(shenSha.find(s=>s.name==="灾煞")) parts.push("灾煞星动，提醒你平时多注意安全——开车慢点，别冒险，别以身犯险。不是说一定会出事，是这个星提示你要比一般人更注意。");
if(shenSha.find(s=>s.name==="孤辰")||shenSha.find(s=>s.name==="寡宿")) parts.push("孤辰寡宿这俩星呢，不是说你注定孤独终老，是说你这个人比较独，不太会主动跟人热络。感情上容易慢热，或者觉得没人理解你。这事得自己主动去破——多交流，多表达。");
parts.push("总的来说呢，你这个八字啊，喜"+(wx.weak.length>0?wx.weak.join("、"):"中和")+"，忌"+(wx.strong.length>0?wx.strong.join("、"):"无特别之忌")+"。下面我给你分开唠唠。");
document.getElementById("zonglunCard").innerHTML='<h3>总论——瞎子给你叨咕叨咕</h3><div class="interpret">'+parts.map(p=>"<p>"+p+"</p>").join("")+'</div>';
}
function renderShenShaCard(bazi){
let shenSha=calcShenSha(bazi.pillars,bazi.riGan,bazi.riZhi,bazi.gender);
let nyin=getNaYin(bazi.pillars[0].gan,bazi.pillars[0].zhi);
let html='<h3>神煞——命中带哪些星</h3><div class="interpret">';
html+='<p>纳音：<span class="hl">'+nyin+'</span></p>';
if(shenSha.length===0){html+='<p>此命不带明显神煞，平平淡淡也是福。</p>';}
else{
let jiStars=shenSha.filter(s=>s.type!=="凶");
let xiongStars=shenSha.filter(s=>s.type==="凶");
if(jiStars.length>0){
html+='<p style="font-weight:700;color:#4caf50;margin-top:8px">吉星贵人——帮你的</p>';
jiStars.forEach(s=>{
html+='<p style="margin-left:8px"><span class="tag" style="background:#4caf50;color:#fff">'+s.name+'</span>'+(s.pillar?' <span style="color:#8b7355;font-size:12px">在'+s.pillar+'</span>':'')+'——'+s.desc+'</p>';
});
}
if(xiongStars.length>0){
html+='<p style="font-weight:700;color:#c0392b;margin-top:8px">凶星小人——防着点的</p>';
xiongStars.forEach(s=>{
html+='<p style="margin-left:8px"><span class="tag" style="background:#c0392b;color:#fff">'+s.name+'</span>'+(s.pillar?' <span style="color:#8b7355;font-size:12px">在'+s.pillar+'</span>':'')+'——'+s.desc+'</p>';
});
}
}
html+='</div>';
document.getElementById("shenshaCard").innerHTML=html;
}
function renderPersonality2(bazi,wx){
let riWx=bazi.riWx;let ss=bazi.pillars.map(p=>p.ss);
let talk={木:"你这人啊，像棵树。啥意思呢？就是有股子往上窜的劲儿，不服输，有自己的想法。别人说东，你觉得不对就是不对，不轻易改主意。好处是有主心骨，坏处嘛——有时候犟起来十头牛都拉不回来。",火:"你这个性子呢，热乎！走到哪儿都是中心，说话有感染力，朋友愿意跟你混。做事风风火火不磨叽。但是啊，火大了容易燎着别人也烧着自己——脾气上来压不住，事后又后悔。得学会给自己降降温。",土:"你这人踏实。老话讲'土能生万物'，你就是那种让人放心的类型。答应的事肯定办，朋友借钱你不好意思不借。不过呢，有时候太实在了，容易吃亏。而且不太爱折腾，守成有余，开拓不足。",金:"你这个人啊，干脆！说话不绕弯子，行就行不行拉倒。朋友敬你是条汉子，有正义感。但是金太硬了容易折——你有时候说话太直得罪人，自己还不知道。圆融一点不是坏事。",水:"你聪明，这没得说。学啥都快，见人说人话见鬼说鬼话，到哪儿都能混得开。但是水无常形——你有时候自己也搞不清楚到底想要啥。想法太多，变来变去，别人跟不上你的节奏。"};
let extra=[];
if(ss.filter(s=>s==="正官"||s==="七杀").length>=2) extra.push("你这个人吧，骨子里有股子正气，做事讲规矩。但也给自己太大压力了，有时候放松点没啥不好。《渊海子平》里把这个叫'官杀混杂'，意思是既想守规矩又想突破，心里头老打架。");
if(ss.filter(s=>s==="正印"||s==="偏印").length>=2) extra.push("学习这块你不用愁，脑子好使。而且你这人有个好处——长辈、领导愿意帮你，这是贵人运。《滴天髓》叫'印绶得势，文星显达'。");
if(ss.filter(s=>s==="食神"||s==="伤官").length>=2) extra.push("你有才！不管是写东西、画画、还是做手艺活，反正有一样拿得出手的本事。不过伤官重的人有时候嘴毒，说话容易得罪人，自己注意点。");
if(ss.filter(s=>s==="正财"||s==="偏财").length>=2) extra.push("你对钱这事儿敏感，赚钱的意识比一般人强。但《千里命稿》里韦千里老先生提醒过：'财多身弱，富屋贫人'——意思是财运来了你接不住也是白搭，先把身子骨和能力练扎实了。");
if(ss.filter(s=>s==="比肩"||s==="劫财").length>=2) extra.push("你朋友多，这没毛病。但是交朋友这块我给你提个醒——劫财重的人容易被人借钱不还，或者合伙做生意闹掰。讲义气是好事，但钱的事还是写清楚。");
document.getElementById("personalityCard").innerHTML='<h3>你这人啥脾气</h3><div class="interpret"><p>'+talk[riWx]+'</p>'+extra.map(e=>"<p>"+e+"</p>").join("")+'</div>';
}
function renderCareer2(bazi,wx){
let ss=bazi.pillars.map(p=>p.ss);let riWx=bazi.riWx;
let parts=[];
parts.push("说到挣钱吃饭这个事啊，我跟你掰扯掰扯。");
if(ss.some(s=>s==="正官")) parts.push("你适合在正儿八经的单位里干，体制内、大公司、有规矩的地方。你这种人守纪律，领导放心。慢慢熬，能上去。");
if(ss.some(s=>s==="七杀")) parts.push("你这人有闯劲！《滴天髓》说'七杀有制化为权'——你要是能管住自己的脾气，这股子冲劲就是你最大的本钱。适合创业、销售、军警这类硬朗的行当。但压力也是真的大，自己得学会排解。");
if(ss.some(s=>s==="正财")) parts.push("正财嘛，就是老实挣钱。你不适合赌，不适合投机，就适合一门手艺、一份工作踏踏实实干。细水长流，积少成多。《子平真诠》里说'正财为用，勤俭致富'。");
if(ss.some(s=>s==="偏财")) parts.push("偏财星动了，说明你有捞偏门的机会——投资、副业、提成、意外之财。但是偏财这东西来得快去得也快。《千里命稿》韦千里说了：'偏财者，众人之财也'，意思是这钱是流动的，你得有本事抓住还得有本事留住。");
if(ss.some(s=>s==="食神")) parts.push("食神生财——你有手艺、有技术，这就是你的饭碗。不管干哪行，有一技傍身比啥都强。");
if(ss.some(s=>s==="伤官")) parts.push("伤官的人聪明，但有一样——不服管。你不适合在太死板的地方待着，自由职业、创意行业更适合你。但记住了，伤官见官，祸患百端——别跟上司对着干，吃亏的是自己。");
if(ss.some(s=>s==="正印")) parts.push("正印是你的贵人星，适合教育、文化、研究、公务员这类稳当的工作。而且你学习能力强，多考几个证对你有好处。");
let wxAdvice="";
if(wx.strong.includes(riWx)) wxAdvice="你八字里"+riWx+"偏旺，干"+KE_OBJ[riWx]+"或者"+KE_BY[riWx]+"的行业对你有利。";
else if(wx.weak.includes(riWx)) wxAdvice="你日主不够壮实，干"+SHENG_BY[riWx]+"或者"+riWx+"的行业能补你的短板。";
parts.push(wxAdvice);
parts.push("行业参考：木=教育文化医药、火=能源网络传媒、土=地产建筑农业、金=金融法律机械、水=物流贸易旅游。这是老祖宗传下来的五行配行业，不是瞎编的。");
document.getElementById("careerCard").innerHTML='<h3>挣钱吃饭——事业财运</h3><div class="interpret">'+parts.map(p=>"<p>"+p+"</p>").join("")+'</div>';
}
function renderMarriage2(bazi,wx){
let riZhi=bazi.riZhi;let riWx=bazi.riWx;let gender=bazi.gender;
let zhWx=WX_MAP[riZhi];let shiShen=bazi.pillars.map(p=>p.ss);
let parts=[];
parts.push("婚姻这个事呢，我得跟你唠实在的，好赖都摆桌面上。");
parts.push("你八字里的夫妻宫——就是日支，坐的是"+riZhi+"（"+zhWx+"）。这说明你找的另一半啊，多少带点"+zhWx+"的特质。");
if(riWx===zhWx) parts.push("你和配偶五行一样。好的方面呢，两个人性格合得来，像是照镜子。不好的方面——两个人都倔，谁也不肯先低头，吵架的时候容易杠上。");
else if(SHENG_OBJ[riWx]===zhWx) parts.push("你生配偶宫——就是说在感情里，你是那个付出更多、操心更多的人。没啥不好，但别把自己累着了。");
else if(KE_OBJ[riWx]===zhWx) parts.push("你克配偶宫——在关系里你占上风，对方听你的多。但管太紧也容易反弹，给对方留点空间。");
if(gender==="male"){
if(shiShen.some(s=>s==="正财")) parts.push("命里正财星到位，正财是妻星。《渊海子平》说'正财为妻，得位则贤'——你娶的老婆应该是踏实本分、能过日子的类型。婚姻稳定，不用太操心。");
if(shiShen.some(s=>s==="偏财")) parts.push("偏财星动了，你这人异性缘不差。但是——偏财多了心就花了。记住，《滴天髓》有言'财多身弱，则为祸端'——感情上专一比啥都强。");
if(!shiShen.some(s=>s==="正财"||s==="偏财")) parts.push("财星不太明显。不是说找不到对象，是缘分来得晚一点。建议你别着急，三十以后反而更稳。");
}else{
if(shiShen.some(s=>s==="正官")) parts.push("正官到位了，正官是夫星。《三命通会》里说'正官得位，夫荣子贵'——你找的对象应该是正经人，有责任心，对你不错。");
if(shiShen.some(s=>s==="七杀")) parts.push("七杀是偏夫星。你喜欢那种有个性、有能力的男人，但是——这种男人不好管，感情里容易有波折。你自己得有主心骨，别太依赖对方。");
if(!shiShen.some(s=>s==="正官"||s==="七杀")) parts.push("夫星不显，不用急。缘分到了自然就有了。你这个人吧，其实更适合晚婚，先把自己活明白了再找人搭伙过日子。");
}
if(riZhi==="子"||riZhi==="午"||riZhi==="卯"||riZhi==="酉") parts.push("你这日支是桃花位。说白了就是异性缘分好，走到哪儿都有人喜欢。但是桃花多了也麻烦——不是每个人都是真心，自己得擦亮眼睛。");
document.getElementById("marriageCard").innerHTML='<h3>婚姻大事——好赖都说说</h3><div class="interpret">'+parts.map(p=>"<p>"+p+"</p>").join("")+'</div>';
}
function renderHealth2(wx){
let map={木:["肝胆","筋骨","少熬夜，多去山里走走，比吃啥保健品都强"],火:["心血管","眼睛","少生气，心平气和比啥都好使"],土:["脾胃","消化","按时吃饭是大事，别饥一顿饱一顿的"],金:["肺部","呼吸道","少抽烟，雾霾天戴口罩，别拿肺不当回事"],水:["肾脏","泌尿","多喝水不是客套话，你真得喝"]};
let parts=[];parts.push("身体这块，我给你挑要紧的说。");
if(wx.balanced.length>3) parts.push("你五行还算均衡，底子不差。只要不瞎折腾，身体应该没啥大毛病。");
wx.weak.forEach(w=>{
let info=map[w]||["","",""];parts.push(w+"偏弱，重点注意"+info[0]+"和"+info[1]+"。"+info[2]+"。");
});
if(wx.strong.length>2){let sw=wx.strong.join("、");parts.push(sw+"偏旺，对应的身体系统容易出毛病。《穷通宝鉴》里讲'太过不及，皆为病也'——不是说你现在就有病，是说这些地方得比别人更留心。");}
parts.push("<span style='font-size:12px;color:#a0896e'>说一千道一万，身子不舒服了去看大夫，别拿命理当诊断书。命理是提醒，看病得靠医生。</span>");
document.getElementById("healthCard").innerHTML='<h3>身子骨咋样</h3><div class="interpret">'+parts.map(p=>"<p>"+p+"</p>").join("")+'</div>';
}
function renderMonthlyWarnings(bazi,solarY){
let cy = new Date().getFullYear();
let yg = TG[(cy-4)%10], yz = DZ[(cy-4)%12];
let html = '<h3>'+cy+'年——十二个月逐月提醒</h3>';
html += '<p style="font-size:13px;color:#8b7355;margin-bottom:8px">今年是<span class="hl">'+yg+yz+'年</span>，每个月对你的八字影响不同。以下是按月详批：</p>';
let dangerMonths = [], goodMonths = [];
for(let mi=0; mi<12; mi++){
let mgz = getMonthGZ_byYearGan(yg, mi);
let interactions = [];
bazi.pillars.forEach((p,i) => {
let res = checkPillarInteraction(mgz.gan, mgz.zhi, p.gan, p.zhi);
res.forEach(r => interactions.push({...r, pillar: p.label}));
});
let hasXiong = interactions.some(r=>r.level==="凶");
let hasJi = interactions.some(r=>r.level==="吉");
if(hasXiong) dangerMonths.push(mi+1);
if(hasJi && !hasXiong) goodMonths.push(mi+1);
html += '<div style="margin:6px 0;padding:6px 10px;border-radius:4px;font-size:13px;'+(hasXiong?'background:#fff5f5;border-left:3px solid #c0392b':(hasJi?'background:#f0fff0;border-left:3px solid #4caf50':'background:#fdfaf5'))+'">';
html += '<span style="font-weight:700">'+(mi+1)+'月</span> '+mgz.gan+mgz.zhi;
if(interactions.length===0){html += ' — 此月平顺，按部就班即可';}
else{interactions.forEach(r=>{let c=r.level==="凶"?"#c0392b":(r.level==="吉"?"#4caf50":"#ff9800");html+=' <span style="color:'+c+';font-size:11px">['+r.type+':'+r.pillar+']</span>';});}
html += '</div>';
}
if(dangerMonths.length>0) html += '<p style="margin-top:8px;color:#c0392b;font-size:13px">今年需要特别注意的月份：'+dangerMonths.join('月、')+'月。这些月份冲动你的八字，做事多留个心眼。</p>';
if(goodMonths.length>0) html += '<p style="margin-top:4px;color:#4caf50;font-size:13px">今年比较顺的月份：'+goodMonths.join('月、')+'月。大事可以安排在这些月份。</p>';
document.getElementById("monthlyCard").innerHTML = html;
}
function renderTravelAdvice(bazi,wx){
let lucky = getLuckyInfo(bazi.riWx, wx.strong, wx.weak);
let dirWx = {木:"东方",火:"南方",土:"中央/本地",金:"西方",水:"北方"};
let dirMap = {木:"东",火:"南",土:"本地",金:"西",水:"北"};
let xiShen = lucky.xiShen;
let xiDir = dirWx[xiShen];
let avoidWx = lucky.avoidWx;
let avoidDir = avoidWx ? dirWx[avoidWx] : "无";
let parts = [];
parts.push("出行这块，我跟你说实在的。");
parts.push("你的喜用神是<span class='hl'>"+xiShen+"</span>，所以——");
parts.push("适合去的方向：<span class='hl'>"+xiDir+"</span>。想换工作、搬家、旅游，往"+dirMap[xiShen]+"边走，运气会好一些。");
if(avoidWx) parts.push("尽量少去的方向：<span class='wr'>"+avoidDir+"</span>。不是不能去，是去之前多做准备，去了也别久留。");
parts.push("出行月份建议：避开那些冲你八字的月份（见上面的月度提醒），选合你八字的月份出门。");
parts.push("出行时间的话，按你的日主"+bazi.riWx+"来看，上午"+(bazi.riWx==="木"||bazi.riWx==="火"?"辰时到午时（7-13点）":bazi.riWx==="金"||bazi.riWx==="水"?"申时到亥时（15-23点）":"巳时到未时（9-15点）")+"出门比较顺。");
document.getElementById("travelCard").innerHTML = '<h3>出行宜忌——往哪儿走</h3><div class="interpret">'+parts.map(p=>"<p>"+p+"</p>").join("")+'</div>';
}
function renderTalismanAdvice(bazi,wx){
let lucky = getLuckyInfo(bazi.riWx, wx.strong, wx.weak);
let parts = [];
parts.push("身上带点啥、家里摆点啥，这是有讲究的。不是迷信——是五行补益，跟中医一个道理。");
parts.push("幸运颜色：<span class='hl'>"+lucky.colors+"</span>。买衣服、选车、装修，往这些颜色上靠。");
if(lucky.avoidColors) parts.push("少用的颜色：<span class='wr'>"+lucky.avoidColors+"</span>。不是不能碰，是别让它占主导。");
parts.push("幸运数字：<span class='hl'>"+lucky.numbers.join("、")+"</span>。选号码、定日子，带这些数字的优先考虑。");
parts.push("适合佩戴/摆放：<span class='hl'>"+lucky.items+"</span>。随身带或者放办公桌上，心里也踏实。");
parts.push("按《千里命稿》韦千里的讲法，五行补益不在多——在'恰到好处'。别一下子弄一大堆，挑一两样顺眼的，长期带着，慢慢就有效果了。");
document.getElementById("talismanCard").innerHTML = '<h3>佩戴与禁忌——带点啥补补</h3><div class="interpret">'+parts.map(p=>"<p>"+p+"</p>").join("")+'</div>';
}
function renderDirection2(bazi){
let riWx=bazi.riWx;let dirWx={木:"东",火:"南",土:"中",金:"西",水:"北"};
let wxAnalysis=analyzeWuxing(countWuxing(bazi.pillars),bazi.riWx);
let xiDir="",jiDir="";
if(wxAnalysis.weak.includes(riWx)){xiDir=dirWx[riWx]+"、"+dirWx[SHENG_BY[riWx]];jiDir=dirWx[KE_BY[riWx]]+"、"+dirWx[KE_OBJ[riWx]];}
else if(wxAnalysis.strong.includes(riWx)){xiDir=dirWx[KE_BY[riWx]]+"、"+dirWx[KE_OBJ[riWx]];jiDir=dirWx[riWx]+"、"+dirWx[SHENG_BY[riWx]];}
else{xiDir=dirWx[riWx]+"、"+dirWx[SHENG_BY[riWx]];jiDir="没啥大忌讳";}
let colorMap={木:"青色绿色",火:"红色紫色",土:"黄色棕色",金:"白色银色",水:"黑色蓝色"};
let parts=["风水方位这个吧，我给你叨咕两句。","适合你的方向：<span class='hl'>"+xiDir+"</span>。选房子、找工作，往这些方向去，顺当些。","不太得劲的方向：<span class='wr'>"+jiDir+"</span>。也不是不能去，就是费劲些。","颜色上，多穿"+colorMap[riWx]+"和"+colorMap[SHENG_BY[riWx]]+"的衣服，提气的。"];
parts.push("<span style='font-size:12px;color:#a0896e'>以上方位都是五行生克推出来的，不是迷信。你信就参考，不信就当听个乐。</span>");
document.getElementById("directionCard").innerHTML='<h3>风水方位——往哪儿走顺当</h3><div class="interpret">'+parts.map(p=>"<p>"+p+"</p>").join("")+'</div>';
}
// === 命理忠告 ===
function renderLifeAdvice(bazi,wx,qiYun,shenSha){
let riWx=bazi.riWx,ss=bazi.pillars.map(p=>p.ss);
let daYun=genDaYun(bazi.pillars[1],qiYun,bazi.solarY+qiYun.qiYunAge);
let currentDY=daYun.find(dy=>new Date().getFullYear()>=dy.startYear&&new Date().getFullYear()<=dy.endYear);
let advices=[];
advices.push({title:"核心提醒",desc:"你是"+riWx+"命，生在"+bazi.pillars[1].zhi+"月。《滴天髓》有言：'欲识三元万法宗，先观帝载与神功。'你这一辈子，记住一句话——"+(wx.strong.includes(riWx)?"你是个有主见的人，但这种主见有时候也害了你。该低头的时候低低头，没啥丢人的。":"你这个人啊，需要傍着点东西。找个靠山、找个平台、学个过硬的本事，别单打独斗。")});
if(currentDY) advices.push({title:"当前大运提醒",desc:"你现在正走"+currentDY.gan+currentDY.zhi+"大运（"+currentDY.startAge+"-"+currentDY.endAge+"岁，"+currentDY.startYear+"-"+currentDY.endYear+"年）。这个大运是"+(currentDY.gan===bazi.riGan?"帮你的":"考验你的")+"，"+(currentDY.startYear<=new Date().getFullYear()?"正在进行中":"马上要来了")+"。这十年里，抓住前半段，后半段守住成果就行。"});
let xiongStars=shenSha.filter(s=>s.type==="凶");
if(xiongStars.length>0) advices.push({title:"防小人提醒",desc:"你八字里"+xiongStars.map(s=>s.name).join("、")+"，这几颗星不是吓唬人的。《三命通会》说'神煞不可不察'。平时多留个心眼——合同要看清楚，合伙要挑对人，借钱这事能免则免。"});
advices.push({title:"婚姻忠告",desc:bazi.gender==="male"?"男人嘛，挣钱养家是本分，但也别光顾着挣钱忘了家里。《千里命稿》韦千里说：'夫妻之道，贵在相敬'。多跟媳妇说说话，比啥都强。":"女人啊，婚姻这事不能太要强也不能太软弱。找个靠得住的人比找个有钱的重要得多。《命理探原》里袁树珊说了：'女命以夫为贵，非以夫为奴。'互相尊重才是长久之道。"});
advices.push({title:"钱财忠告",desc:ss.some(s=>s==="偏财")?"你偏财运是有的，但偏财这东西来得快去得也快。记住了——见好就收，别贪。赚了钱先存起来，别急着花。":"你正财运为主，适合稳扎稳打。别羡慕别人赚快钱，你那套路子虽然慢但是稳。《子平真诠》讲得好：'正财为用，勤俭致富'。"});
advices.push({title:"健康叮嘱",desc:wx.weak.length>0?"你五行"+wx.weak.join("、")+"偏弱，对应的身体部位要注意。"+wx.weak.map(w=>{let m={木:"肝胆",火:"心血管",土:"脾胃",金:"肺",水:"肾"};return m[w];}).join("、")+"这块别不当回事。按时体检，别硬扛。":"五行还算均衡，但别觉得自己底子好就瞎折腾。岁数大了该保养还得保养。记住老中医那句话：'上医治未病'——等病了再治就晚了。"});
advices.push({title:"贵人方向",desc:"你这辈子"+(shenSha.some(s=>s.name.includes("贵人"))?"贵人运是有的，":"贵人运一般，")+"但这贵人不是天上掉下来的。《渊海子平》说'贵人得地，不扶自直'——你得先把自己立起来，贵人才会看得上你。平时多出去走动、多认识人，别闷在家里。"});
advices.push({title:"最重要的忠告",desc:"说了这么多，最后跟你说句掏心窝子的话：命是命，人是人。命理学是古人智慧的结晶，但它不是让你认命的。我跟你说的这些，好的你当鼓励，不好的你当提醒。《周易》讲'天行健，君子以自强不息'——该努力努力，该认怂认怂，但别把什么事都推给命。记住：你这个人，比你的八字厉害。"});
let html='<h3>瞎子给你几句实在话</h3><div class="interpret">';
advices.forEach((a,i)=>{
html+='<div style="margin-bottom:12px;padding:10px;background:#fdfaf5;border-radius:6px;border-left:3px solid #8b4513">';
html+='<div style="font-weight:700;color:#8b4513;margin-bottom:4px">'+(i+1)+'. '+a.title+'</div>';
html+='<p style="font-size:14px;text-indent:2em">'+a.desc+'</p></div>';
});
html+='</div>';
document.getElementById("adviceCard").innerHTML=html;
}
// === 梅花易数占卜 ===
function doMeiHua(){
let question=document.getElementById("mhQuestion").value.trim();
let n1=parseInt(document.getElementById("mhNum1").value)||0;
let n2=parseInt(document.getElementById("mhNum2").value)||0;
let n3=parseInt(document.getElementById("mhNum3").value)||0;
if(n1===0&&n2===0&&n3===0){let r=qiGuaByTime();document.getElementById("mhNum1").value=r.upIdx+1;document.getElementById("mhNum2").value=r.dnIdx+1;document.getElementById("mhNum3").value=r.yaoIdx;n1=r.upIdx+1;n2=r.dnIdx+1;n3=r.yaoIdx;}
let gua=qiGua(n1,n2,n3);
let upName=GUA_YAO[gua.upIdx]+"（"+GUA_WUXING[gua.upIdx]+"）";
let dnName=GUA_YAO[gua.dnIdx]+"（"+GUA_WUXING[gua.dnIdx]+"）";
let yaoPos=["初爻","二爻","三爻","四爻","五爻","上爻"][gua.yaoIdx-1];
let html='<div style="background:#fdfaf5;border-radius:8px;padding:16px;margin-top:12px;border:1px solid #d4c5a9">';
html+='<div style="text-align:center;margin-bottom:12px"><span style="font-size:24px;font-weight:700;color:#8b4513">'+gua.name+'</span></div>';
html+='<div class="interpret">';
if(question) html+='<p>问的事：<span class="hl">'+question+'</span></p>';
html+='<p>上卦：'+upName+'  |  下卦：'+dnName+'  |  动爻：'+yaoPos+'</p>';
html+='<p>体卦：<span class="hl">'+GUA_YAO[gua.tiIdx]+'（'+gua.tiWx+'）</span>  |  用卦：<span class="hl">'+GUA_YAO[gua.yongIdx]+'（'+gua.yongWx+'）</span></p>';
html+='<p>体用关系：<span class="hl">'+gua.shengKe+'</span> —— '+gua.skAdvice+'</p>';
html+='<p style="margin-top:8px;font-size:13px;color:#8b7355">卦辞解读：'+gua.jiedu+'</p>';
let skMap={比和:"<span style='color:#4caf50'>顺利</span>",用生体:"<span style='color:#4caf50'>大吉</span>",体克用:"<span style='color:#ff9800'>需努力</span>",体生用:"<span style='color:#ff9800'>有耗损</span>",用克体:"<span style='color:#c0392b'>有阻碍</span>"};
html+='<p style="margin-top:8px;font-weight:700">综合判断：'+skMap[gua.shengKe]+'</p>';
html+='</div></div>';
document.getElementById("meihuaResult").innerHTML=html;
}
function autoMeiHua(){
let r=qiGuaByTime();
document.getElementById("mhNum1").value=r.upIdx+1;
document.getElementById("mhNum2").value=r.dnIdx+1;
document.getElementById("mhNum3").value=r.yaoIdx;
doMeiHua();
}
