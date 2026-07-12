// 瞎子算命解释引擎 v3 — 深度重写
// ===== 工具函数 =====
function _isYang(gan){return "甲丙戊庚壬".indexOf(gan)>=0;}
function _isYinZhi(zhi){return "丑卯巳未酉亥".indexOf(zhi)>=0;}
function _inArray(arr,val){return arr.indexOf(val)>=0;}
// ===== 父母缘分 =====
function analyzeParents(bazi){
var nianGan=bazi.pillars[0].gan,nianZhi=bazi.pillars[0].zhi;
var yueZhi=bazi.pillars[1].zhi,riGan=bazi.riGan;
var ss=bazi.pillars.map(function(p){return p.ss;});
var wxAll=countWuxing(bazi.pillars);
var nianChong=checkPillarInteraction("甲",nianZhi,nianGan,nianZhi);
var hasNianChong=nianChong.some(function(c){return c.type==="六冲"||c.type==="相刑";});
var yinWx=(_inArray(["甲","乙"],riGan)?"水":_inArray(["丙","丁"],riGan)?"木":_inArray(["戊","己"],riGan)?"火":_inArray(["庚","辛"],riGan)?"土":"金");
var caiWx=(_inArray(["甲","乙"],riGan)?"土":_inArray(["丙","丁"],riGan)?"金":_inArray(["戊","己"],riGan)?"水":_inArray(["庚","辛"],riGan)?"木":"火");
var motherScore=0,fatherScore=0;
bazi.pillars.forEach(function(p,i){
if(p.ss==="正印"||p.ss==="偏印"){motherScore+=(i===0?2:i===1?1.5:1);if(p.cg){p.cg.forEach(function(c){if(WX_MAP[c]===yinWx)motherScore+=0.5;});}}
if(p.ss==="偏财"){fatherScore+=(i===0?2:i===1?1.5:1);if(p.cg){p.cg.forEach(function(c){if(WX_MAP[c]===caiWx)fatherScore+=0.5;});}}
});
motherScore+=wxAll[yinWx]||0;fatherScore+=wxAll[caiWx]||0;
var result={};
if(hasNianChong){result.whoFirst="年柱为父母宫，你的年柱受冲克，说明与父母缘分偏薄，或父母身体不太好，或早年离家。具体谁先走——";}
else{result.whoFirst="从命局来看——";}
if(motherScore<1.5&&fatherScore<1.5){result.whoFirst+="父母双亲在命局中都不够得力，身子骨偏弱，需要子女多费心。谁先走要看大运流年冲克。";}
else if(motherScore>=fatherScore+1){result.whoFirst+="母亲方面比较得力，父亲偏弱。父亲的身体需要多关注，尤其是大运流年冲克年柱的时候。";}
else if(fatherScore>=motherScore+1){result.whoFirst+="父亲方面比较得力，母亲偏弱。母亲的身体需要多关注，尤其是大运流年冲克年柱的时候。";}
else{result.whoFirst+="父母双亲在命局中都算得力，寿元不错。但人上了年纪，做子女的多回家看看比什么都强。";}
var mYears=[];
bazi.pillars.forEach(function(p,i){
if(i===0){p.cg.forEach(function(c){var wx=WX_MAP[c];if(wx===yinWx)result.whoFirst+=" 年支藏有母星"+c+"，母亲根基还算扎实。";if(wx===caiWx)result.whoFirst+=" 年支藏有父星"+c+"，父亲根基还算扎实。";});}
});
var qiYunTmp=calcQiYun(bazi.solarY,bazi.solarM,bazi.solarD,bazi.gender,nianGan);
var daYun=genDaYun(bazi.pillars[1],qiYunTmp,bazi.solarY);
daYun.forEach(function(dy){
var chong=checkPillarInteraction(dy.gan,dy.zhi,nianGan,nianZhi);
var isChong=chong.some(function(c){return c.type==="六冲"||c.type==="相刑";});
if(isChong)mYears.push({age:dy.startAge,desc:dy.startAge+"岁至"+(dy.startAge+9)+"岁，"+dy.gan+dy.zhi+"运冲年柱，此运中要特别注意父母身体健康。"});
});
result.mourning=mYears;
return result;
}
// ===== 婚姻缘分 =====
function analyzeMarriage(bazi){
var riZhi=bazi.riZhi,riGan=bazi.riGan,gender=bazi.gender,riPillar=bazi.pillars[2];
var ss=bazi.pillars.map(function(p){return p.ss;});
var zhWx=WX_MAP[riZhi];
var result={count:1,descs:[],score:0};
// 1. 日支（配偶宫）核心分析
var zhPts=0;
if(_inArray(["子","午","卯","酉"],riZhi)){result.descs.push("日坐桃花（"+riZhi+"），你的配偶长得不错，有魅力，但桃花重了也容易招蜂引蝶。婚姻上要多给对方安全感。");zhPts+=1;}
var chongMap={"子":"午","午":"子","丑":"未","未":"丑","寅":"申","申":"寅","卯":"酉","酉":"卯","辰":"戌","戌":"辰","巳":"亥","亥":"巳"};
var hasChong=false;
bazi.pillars.forEach(function(p,i){
if(i!==2&&p.zhi===chongMap[riZhi]){hasChong=true;}
});
if(hasChong){result.descs.push("日支"+riZhi+"在原局被冲——这是婚姻不稳的信号。你的一辈子，夫妻关系容易有波折，大运流年再来冲的时候，就是婚姻的关口。");zhPts+=2;result.count=Math.max(result.count,2);}
var heMap={"子":"丑","丑":"子","寅":"亥","亥":"寅","卯":"戌","戌":"卯","辰":"酉","酉":"辰","巳":"申","申":"巳","午":"未","未":"午"};
var hasHe=false;
bazi.pillars.forEach(function(p,i){
if(i!==2&&p.zhi===heMap[riZhi]){hasHe=true;}
});
if(hasHe){result.descs.push("日支"+riZhi+"在原局有合——你这个人异性缘不错，但也容易有感情纠葛。合代表牵扯，有时候是好事有时候是麻烦。");zhPts+=1;}
// 2. 配偶星分析
if(gender==="male"){
var zhengCai=ss.filter(function(s){return s==="正财";}).length;
var pianCai=ss.filter(function(s){return s==="偏财";}).length;
if(zhengCai>0&&pianCai>0){result.descs.push("感情上不会太顺——正财偏财都有，说明你不是只谈一段就结婚的人。第一段多半是来教你东西的，不是来陪你一辈子的。别纠结，经历了就过了。");result.count=Math.max(result.count,2);zhPts+=2;}
else if(zhengCai>0){result.descs.push("妻星到位了。你是那种认真处对象的人，不玩虚的。找踏实过日子的，她也不会亏待你。");zhPts-=1;}
else if(pianCai>0){result.descs.push("偏财是妾星——不是说你要找小的，是说你这人自由惯了，不想被管太死。这也行，但要碰对人——愿意给你空间的人，才绑不住你。");zhPts+=1;}
else{result.descs.push("财星不显，你对感情这件事不太敏感。不是找不到，是缘分来得晚。建议三十以后再看婚姻，反而更稳。");zhPts+=1;}
}else{
var zhengGuan=ss.filter(function(s){return s==="正官";}).length;
var qiSha=ss.filter(function(s){return s==="七杀";}).length;
if(zhengGuan>0&&qiSha>0){result.descs.push("官杀都有——你感情上可能走两段。头一段容易碰上不合适的人，不是你的错，是那个人刚好在那个时间出现在那里。第二段才是安稳的。");result.count=Math.max(result.count,2);zhPts+=2;}
else if(zhengGuan>0){result.descs.push("夫星稳了。你适合找那种靠谱的、不花里胡哨的。他不用多浪漫——能把答应你的事一件件做到的，就是对的人。");zhPts-=1;}
else if(qiSha>0){result.descs.push("七杀是偏夫星。你容易被有个性、有能力的男人吸引。但这种男人不好驾驭，感情里容易起波澜。自己要有主心骨。");zhPts+=1;}
else{result.descs.push("官星不显，你的缘分比较淡。但这不是坏事——晚婚的人反而更清楚自己要什么。");zhPts+=1;}
}
// 3. 配偶星落哪柱
bazi.pillars.forEach(function(p,i){
var labels=["年","月","日","时"];
if(gender==="male"&&(p.ss==="正财"||p.ss==="偏财")){
if(i===0)result.descs.push("妻星落在年柱，容易早恋或者对方年纪跟你差比较多。");
else if(i===3)result.descs.push("妻星落在时柱，你属于晚婚型，三十五以后婚姻才稳定。");
}
if(gender==="female"&&(p.ss==="正官"||p.ss==="七杀")){
if(i===0)result.descs.push("夫星落在年柱，容易早恋或者对方年纪跟你差比较多。");
else if(i===3)result.descs.push("夫星落在时柱，你属于晚婚型，三十五以后婚姻才稳定。");
}
});
// 4. 日支与月支时支关系
if(riZhi===bazi.pillars[1].zhi)result.descs.push("日支与月支相同（伏吟），夫妻关系容易沉闷，或者对方身体不太好。");
if(chongMap[riZhi]===bazi.pillars[3].zhi)result.descs.push("日支被时支冲，晚年婚姻有波动，或者子女的事情影响夫妻感情。");
result.score=zhPts;
return result;
}
// ===== 财运走势 =====
function analyzeWealth(bazi){
var ss=bazi.pillars.map(function(p){return p.ss;});
var riWx=bazi.riWx,riGan=bazi.riGan;
var wxAll=countWuxing(bazi.pillars);
var wxAna=analyzeWuxing(wxAll,riWx);
var caiCount=ss.filter(function(s){return s==="正财"||s==="偏财";}).length;
var shiShangCount=ss.filter(function(s){return s==="食神"||s==="伤官";}).length;
var biJieCount=ss.filter(function(s){return s==="比肩"||s==="劫财";}).length;
var descs=[];
var riStrong=!wxAna.weak.includes(riWx);
// 身强才能担财
if(!riStrong&&caiCount>=2){descs.push("你财星是有的，但问题是——日主偏弱。就好像一个小身板的人突然中了大奖，钱来了你兜不住。《千里命稿》里讲这叫'财多身弱，富屋贫人'。先把自己的本事操练扎实了，钱来了才接得住。");}
else if(riStrong&&caiCount>=2){descs.push("命里带财，底子也够。你能挣也能守。钱的事不用太操心。");}
else if(caiCount===1){descs.push("财运中等，正财为主。不适合赌，不适合投机，就适合老老实实学一门手艺、找一个稳定饭碗。细水长流比什么都强。");}
else{descs.push("财星不显，这不一定穷——你可以靠手艺、靠技术、靠脑子吃饭。食伤生财才是你真正该走的路。");}
// 食伤生财
if(shiShangCount>=2)descs.push("命里有食伤来生财——这是好事！有技术、有手艺、有创意，这些东西才是你真正的饭碗。别羡慕别人赚快钱，你那条路虽然慢，但是走得稳。");
// 比劫夺财
if(biJieCount>=2&&caiCount>0)descs.push("比劫多——注意了。朋友多、社交广是好事，但比劫重的人容易被人借钱不还，或者合伙做生意闹掰。讲义气是好事，但钱的事写清楚。");
// 财星落哪柱
bazi.pillars.forEach(function(p,i){
var labels=["祖业","自己挣","中年","晚年"];
if(p.ss==="正财"||p.ss==="偏财")descs.push("财星在"+["年柱","月柱","日柱","时柱"][i]+"——"+(i===0?"祖上给你留了些底子":i===1?"你的钱是自己挣的，白手起家":"你的财运在"+labels[i]+"最好")+"。");
});
// 财库
var hasCaiKu=false;
bazi.pillars.forEach(function(p){
if(p.zhi==="辰"||p.zhi==="戌"||p.zhi==="丑"||p.zhi==="未"){if(p.cg){p.cg.forEach(function(c){if(WX_MAP[c]==="土"||(riGan==="壬"||riGan==="癸"?WX_MAP[c]==="火":""))hasCaiKu=true;});}}
});
if(hasCaiKu)descs.push("你命局里有财库（辰戌丑未），说明你存得住钱。不像有些人挣多少花多少，你好歹能攒下来。");
return descs;
}
// ===== 事业前程 =====
function analyzeCareer(bazi){
var ss=bazi.pillars.map(function(p){return p.ss;});
var riWx=bazi.riWx;
var descs=[];
var qiShaCount=ss.filter(function(s){return s==="七杀";}).length;
var zhengGuanCount=ss.filter(function(s){return s==="正官";}).length;
var yinCount=ss.filter(function(s){return s==="正印"||s==="偏印";}).length;
var shangGuanCount=ss.filter(function(s){return s==="伤官";}).length;
var shiShenCount=ss.filter(function(s){return s==="食神";}).length;
// 七杀有制化
if(qiShaCount>=1&&yinCount>=1){descs.push("你命里七杀有印星来化——这是'杀印相生'的好格局。《滴天髓》说'七杀有制化为权'。你适合在体制内、大公司，或者自己当老板管人。手里有权，但压力也不小。");}
else if(qiShaCount>=1&&shiShenCount>=1){descs.push("七杀有食神压着——你骨头硬、做事不怕事。创业、销售、当兵当警察这些硬朗的行当，你干得动。");}
else if(qiShaCount>=1){descs.push("七杀无制——注意了。你这个人有冲劲、有魄力，但容易莽撞。《子平真诠》讲'七杀无制，其凶可知'。不是说你不好，是说你要学会约束自己，不能由着性子来。");}
// 官杀混杂
if(zhengGuanCount>0&&qiShaCount>0){descs.push("命局官杀混杂，正官七杀都有——你在事业上容易犹豫，又想按规矩来，又想打破规矩。这种内心拉扯会让你在事业上走弯路。选定一条路就走到黑最好。");}
else if(zhengGuanCount>=1){descs.push("正官到位——你适合在正经单位里干，体制内、大公司、有规矩的地方。领导看你是靠谱的人，慢慢熬能上去。");}
else if(qiShaCount===0&&zhengGuanCount===0){descs.push("官星不显——你不是当官管人的命。但不代表没出息。走技术路线、自由职业，或者自己干个体户，反而更自在。");}
// 伤官见官
if(shangGuanCount>=1&&zhengGuanCount>=1){descs.push("伤官见官——这是事业上要注意的大事。你太有主见了，太不服管了。跟领导对着干，吃亏的是自己。《三命通会》说'伤官见官，为祸百端'。学会收敛锋芒，别太张扬。");}
// 贵人
if(yinCount>=2)descs.push("印星得力——你有贵人运。长辈、领导、老师愿意帮你。多考几个证、多结交比你强的人，对你的前程大有好处。");
return descs;
}
// ===== 家庭运程 =====
function analyzeFamily(bazi){
var riZhi=bazi.riZhi,riWx=bazi.riWx,riGan=bazi.riGan;
var yueZhi=bazi.pillars[1].zhi,shiZhi=bazi.pillars[3].zhi,shiGan=bazi.pillars[3].gan;
var ss=bazi.pillars.map(function(p){return p.ss;});
var descs=[];
var zhWx=WX_MAP[riZhi];
// 1. 配偶
if(riWx===zhWx){descs.push("你和你那口子性格差不多，好起来像一个人，吵起来谁也不低头。婚姻就是搭伙过日子，有时候你让一步，对方也让一步，日子就顺了。");}
else if(SHENG_OBJ[riWx]===zhWx){descs.push("在家里你是操心多的那个人。啥事都是你张罗，啥活都是你干。累是累点，但你这样的人，家里离了你就转不动。");}
else if(KE_OBJ[riWx]===zhWx){descs.push("你在家里说话算话。不是那种大男子主义或者河东狮吼，而是对方习惯听你的。但管太紧了也容易出事，给对方留点空间。");}
else if(SHENG_OBJ[zhWx]===riWx){descs.push("你那位对你好，是真心实意的那种好。但有时候好得太过了，你也别理所当然，记得对对方也好一点。");}
// 2. 日支稳定性
var chongMap={"子":"午","午":"子","丑":"未","未":"丑","寅":"申","申":"寅","卯":"酉","酉":"卯","辰":"戌","戌":"辰","巳":"亥","亥":"巳"};
if(bazi.pillars.some(function(p,i){return i!==2&&p.zhi===chongMap[riZhi];})){descs.push("你夫妻宫被冲，家庭关系不是那种风平浪静的。有时候吵吵闹闹反而是好事，总比冷战强。");}
// 3. 子女
var shiSS=bazi.pillars[3].ss;
if(shiSS==="食神"||shiSS==="伤官"){descs.push("时柱是食伤——食伤代表子女。看来你晚年的福气在子女身上。孩子孝顺，老了有人管。");}
else{descs.push("时柱是"+shiSS+"——子女这块不用太操心。儿孙自有儿孙福，你该做的做到了就行。");}
var shiWx=WX_MAP[shiZhi];
if(SHENG_OBJ[riWx]===shiWx)descs.push("时柱子女宫对你有情，孩子跟你亲，老了享子女的福。");
if(KE_BY[riWx]===shiWx)descs.push("子女这事多少有点操心，但不算大问题。孩子有孩子的路，你少管一点反而更好。");
// 4. 比劫
var biJieCount=ss.filter(function(s){return s==="比肩"||s==="劫财";}).length;
if(biJieCount>=2)descs.push("你命里比劫多，兄弟姐妹或者朋友多。好处是有人帮衬，坏处是家里面容易有争执。记住一句话：亲兄弟明算账。");
return descs;
}
// ===== 5年运段 =====
function gen5YearLuck(bazi,qiYun,solarY){
var daYun=genDaYun(bazi.pillars[1],qiYun,solarY+qiYun.qiYunAge);
var fiveYear=[];
daYun.forEach(function(dy){
fiveYear.push({gan:dy.gan,zhi:dy.zhi,startAge:dy.startAge,endAge:dy.startAge+4,startYear:dy.startYear,label:dy.gan+dy.zhi+"(前)"});
fiveYear.push({gan:dy.gan,zhi:dy.zhi,startAge:dy.startAge+5,endAge:dy.startAge+9,startYear:dy.startYear+5,label:dy.gan+dy.zhi+"(后)"});
});
return fiveYear;
}

// 本心中道体系——底层视角总论

function renderBenXin(bazi, wx) {
var riWx = bazi.riWx, riGan = bazi.riGan, gender = bazi.gender;
var wxAll = countWuxing(bazi.pillars);
var wxAna = analyzeWuxing(wxAll, riWx);
var riStrong = !wxAna.weak.includes(riWx);
var ss = bazi.pillars.map(function(p) { return p.ss; });
var mg = bazi.pillars[1];
var parts = [];
// ========== 开篇：作者自序 ==========
parts.push("我帮你仔细看了这个八字。先说句掏心窝子的话——命不是迷信，是天地阴阳五行的规律。你这一生的起起落落、酸甜苦辣，都写在这八个字里了。");
// ========== 第一章：知命——看清你的底牌 ==========
parts.push("【知命篇】先说你的命格底色。");
parts.push("你这命，日主是" + riWx + "，生在" + mg.zhi + "月。按《道德经》里一句话：'人法地，地法天，天法道，道法自然。'——你的命就是你这一生的'自然'。不是老天爷偏心，是每个人出生那天气场不同，就像有的树长在山上、有的树长在水边，各有各的活法。");
if (!riStrong) {
parts.push("你这个八字，日主偏弱。啥叫日主偏弱？就是说你这个人，天生底气不足。别人一天能干完的活，你得干三天；别人遇事有人帮，你遇事只能自己扛。这不是你不行——《道德经》里说：'天下之至柔，驰骋天下之至坚。'最柔软的水，能滴穿最硬的石头。身弱的人，骨子里有一股韧劲，是那些身强的人比不了的。");
parts.push("《本心八字》有一句话说得特别对：身弱无依者，天生贵人少、无人托举，凡事只能靠自己，早年多孤苦、少年多漂泊。但身弱不是坏事——身弱的人心性更坚韧、更懂人情冷暖、更容易悟透人生。所有大彻大悟，都是从磨难中来的。");
} else {
parts.push("你这个八字，日主还算硬朗，天生底气比别人足。但《道德经》说了：'强梁者不得其死。'太刚强的人容易折。你这个人做事有魄力、不服输，这是好事——但也容易因为太自信而摔跟头。记住了，刚中要带柔，硬中要带软。");
}
var wxTalk = "";
if (wxAna.strong.length > 0) wxTalk += "五行里" + wxAna.strong.join("、") + "偏旺，这些方面你天生比别人强，不用费太大劲就能出成绩。";
if (wxAna.weak.length > 0) wxTalk += wxAna.weak.join("、") + "偏弱，这些方面是你的短板，得比别人多下功夫。";
if (wxTalk) parts.push(wxTalk);
parts.push("这就是你的命——你的底牌。底牌不是让你认命的，是让你知道自己手上的牌是什么。知道了，才好打。");
// ========== 第二章：释怀——放下你改变不了的 ==========
parts.push("【释怀篇】再说说你心里那些过不去的坎。");
var letGoAdvice = [];
if (!riStrong) letGoAdvice.push("你从小到大，是不是总觉得自己不如别人？看着别人轻松就能做到的事，自己却要费九牛二虎之力？今天我跟你说：你不用跟任何人比。佛家讲'万般带不走，唯有业随身'——你这一生经历的苦难，不是白受的。每一份苦，都在你的命格里刻下了一道印，这些印最终会变成你独一无二的智慧。");
if (ss.filter(function(s) { return s === "七杀" || s === "正官"; }).length >= 2) letGoAdvice.push("你命里官杀重，说明你对自己要求太高了。啥事都想做到最好，啥事都放不下来。王阳明说过：'破山中贼易，破心中贼难。'外面的事好解决，心里那个坎最难过去。你得学着放下——不是放弃，是看淡。");
if (ss.filter(function(s) { return s === "伤官"; }).length >= 1) letGoAdvice.push("你命带伤官，聪明是聪明，但有时候锋芒太露。《道德经》里讲：'大巧若拙。'真正的高手看起来都笨笨的。你不是非得证明自己比别人强，低调一点、藏一点，反而走得更远。");
if (letGoAdvice.length === 0) letGoAdvice.push("《金刚经》说：'一切有为法，如梦幻泡影，如露亦如电，应作如是观。'你现在愁的那些事——工作不顺、感情波折、钱不够花——过五年回头看，可能真就不是啥大事。人生就是这样，当下觉得过不去的坎，回头看都是故事。");
parts = parts.concat(letGoAdvice);
parts.push("释怀不是认怂，是放过自己。命里注定没有的东西，你硬去够，够不着还伤了自己。但命里该有的东西，你不用着急，它自己会来。");
// ========== 第三章：顺势——看清你的运势 ==========
parts.push("【顺势篇】说说你现在该往哪走。");
var qiYunTmp = calcQiYun(bazi.solarY, bazi.solarM, bazi.solarD, bazi.gender, bazi.pillars[0].gan);
var daYunList = genDaYun(bazi.pillars[1], qiYunTmp, bazi.solarY + qiYunTmp.qiYunAge);
var currentYear = new Date().getFullYear();
var currentDY = null;
daYunList.forEach(function(dy) {
if (currentYear >= dy.startYear && currentYear <= dy.startYear + 9) currentDY = dy;
});
if (currentDY) {
parts.push("你现在正走" + currentDY.gan + currentDY.zhi + "大运（" + currentDY.startAge + "岁到" + (currentDY.startAge + 9) + "岁）。这个大运是" + (currentDY.gan === riGan ? "帮你的——这十年是你的黄金期，想干啥就去干，别犹豫。" : "考验你的——这十年会有些波折，但不是坏事。人在低谷学到的，比高峰多得多。") + "");
} else {
parts.push("你现在还没到行大运的年龄，或者已经过了行运期。《道德经》说：'大器晚成。'别着急，好东西在后面。你现在要做的就是蓄力——像弹簧一样，压得越低，弹得越高。");
}
parts.push("王阳明讲'知行合一'——你知道了自己运势的走向，就得照着去做。运势好的时候别躺平，运势差的时候别瞎折腾。顺势而为，比逆天改命强一万倍。");
// ========== 第四章：改运——你能改变的东西 ==========
parts.push("【改运篇】最后说点你能做的事。");
var changeAdvice = [];
changeAdvice.push("改运不是说烧香拜佛，是实实在在的改变自己。王阳明一辈子就讲一件事：'致良知。'啥意思？就是听你自己心里的声音。你知道自己哪里不好、哪里该改，你心里清楚得很，就是不去做。知道了不去做，等于不知道。");
if (!riStrong) changeAdvice.push("你的日主偏弱——这就是你一辈子要补的东西。怎么补？第一，别一个人扛，学着找人帮你。第二，做你擅长的事，别眼红别人赚钱快。第三，身体是革命的本钱，你身子骨本来就弱，少熬夜、少应酬、多休息。");
if (wxAna.weak.includes("水")) changeAdvice.push("你命里水弱。东北有句话叫'上善若水'——水代表智慧、代表变通。补水的办法：多学习、多思考、多跟聪明人聊天。别一天到晚闷头干活，抬头看看路。");
if (wxAna.weak.includes("火")) changeAdvice.push("你命里火弱。火代表热情、代表行动力。补火的办法：多晒太阳、多运动、多跟积极的人在一起。别老闷在家里，出去走走，人精神了运气自然会好。");
if (wxAna.weak.includes("木")) changeAdvice.push("你命里木弱。木代表成长、代表仁爱。《道德经》说：'上仁为之而无以为。'最高境界的仁爱，是做了好事不求回报。补木的办法：多帮助别人、多接触大自然、坚持一件事把它做透。");
if (wxAna.weak.includes("金")) changeAdvice.push("你命里金弱。金代表决断、代表义气。补金的办法：做事果断一点、说话算话、答应别人的事一定做到。义气这个东西，你越讲义气，别人越敬你。");
if (wxAna.weak.includes("土")) changeAdvice.push("你命里土弱。土代表信用、代表稳重。《道德经》说：'信言不美，美言不信。'实在话不好听，好听的话不实在。补土的办法：做人踏实、说话算数、一步一个脚印。");
parts = parts.concat(changeAdvice);
// ========== 结尾：本心寄语 ==========
parts.push("【本心寄语】");
parts.push("说了这么多，最后送你一句掏心窝子的话——也是《本心八字》最根本的道理：命是车，运是路，人是开车的人。车有车的性能，路有路的好坏，但方向盘始终在你手里。");
parts.push("《道德经》最后一句话：'天之道，利而不害；圣人之道，为而不争。'老天爷的规律是利万物而不伤害，做人的最高境界是努力做事但不跟人争。");
parts.push("你这个人，比你的八字厉害得多。记住：知命不认命，悟道改人生。");
return parts;
}


// ===== 配偶画像 =====
function analyzeSpouse(bazi) {
var riZhi = bazi.riZhi, riWx = bazi.riWx, gender = bazi.gender;
var zhWx = WX_MAP[riZhi];
var descs = [];
// 配偶性格
var wxChar = {木:"性格直爽、有主见、不轻易低头。长得清瘦，个子一般偏高。像个树一样，有韧劲。",
火:"性格热情、外向、做事风风火火。长得精神，眼睛有神。跟她在一起不会闷。",
土:"性格稳重、踏实、靠得住。长得敦厚，不花哨。是那种过日子的类型。",
金:"性格果断、讲义气、干脆利落。长得棱角分明，有气质。说话做事不拖泥带水。",
水:"性格聪明、灵活、会来事。长得秀气，皮肤好。脑子转得快，但有时候想法太多。"};
descs.push("你未来的另一半，日支坐" + riZhi + "（" + zhWx + "），" + wxChar[zhWx]);
// 配偶相貌
if (riZhi === "子" || riZhi === "午" || riZhi === "卯" || riZhi === "酉") {
descs.push("日坐桃花——你那位长相不会差，在人群里是能让人多看两眼的那种。但桃花旺的人也容易被别人惦记，自己看紧点。");
}
// 配偶家境/背景
var spStar = gender === "male" ? "正财" : "正官";
var spPillar = -1;
bazi.pillars.forEach(function(p, i) {
if (p.ss === spStar && spPillar < 0) spPillar = i;
});
if (spPillar === 0) descs.push("配偶星在年柱——对方家庭条件应该不错，或者跟你是老家认识的、家里介绍的。");
else if (spPillar === 1) descs.push("配偶星在月柱——大概率是同学、同事，或者通过工作认识的。对方家境跟你差不多，门当户对。");
else if (spPillar === 2) descs.push("配偶星在日柱——说明你的缘分在自己身边，可能是认识很久的朋友，或者是工作中朝夕相处的人。");
else if (spPillar === 3) descs.push("配偶星在时柱——你属于晚婚型，可能三十几岁才遇到。但晚婚的人反而更珍惜，质量比数量重要。");
// 配偶出现年份
var qiYunTmp = calcQiYun(bazi.solarY, bazi.solarM, bazi.solarD, bazi.gender, bazi.pillars[0].gan);
var daYunList = genDaYun(bazi.pillars[1], qiYunTmp, bazi.solarY + qiYunTmp.qiYunAge);
var yearHints = [];
daYunList.forEach(function(dy) {
var spYear = dy.startYear;
for (var i = 0; i < 10; i++) {
var yg = TG[(spYear + i - 4) % 10];
var yz = DZ[(spYear + i - 4) % 12];
if (gender === "male" && (WX_MAP[yg] === riWx || SHENG_OBJ[riWx] === WX_MAP[yg])) {
if (spYear + i >= 2000) yearHints.push(spYear + i + "年");
}
if (gender === "female" && (WX_MAP[yg] === riWx || KE_BY[riWx] === WX_MAP[yg])) {
if (spYear + i >= 2000) yearHints.push(spYear + i + "年");
}
}
});
if (yearHints.length > 0) descs.push("按大运流年推算，你遇到正缘比较可能的年份是：" + yearHints.slice(0, 3).join("、") + "前后。");
// 相处建议
if (riWx === zhWx) descs.push("你和配偶五行相同——性格相似，好的时候像一个人，吵的时候谁也不让谁。记住：有时候你低个头，不是输了，是成熟了。");
else if (SHENG_OBJ[riWx] === zhWx) descs.push("你生配偶宫——在感情里你是付出多的那个人。没啥不好，但别把自己累着了。对方也爱你，只是表达方式不一样。");
else if (KE_OBJ[riWx] === zhWx) descs.push("你克配偶宫——在关系里你占主导。但管太紧了容易反弹，给对方留点空间。");
return descs;
}
// ===== 人生关键年份（精确版）=====
function analyzeKeyYears(bazi) {
var riGan = bazi.riGan, riZhi = bazi.riZhi, gender = bazi.gender, riWx = bazi.riWx;
var qiYunTmp = calcQiYun(bazi.solarY, bazi.solarM, bazi.solarD, bazi.gender, bazi.pillars[0].gan);
var daYunList = genDaYun(bazi.pillars[1], qiYunTmp, bazi.solarY + qiYunTmp.qiYunAge);
var ss = bazi.pillars.map(function(p) { return p.ss; });
// 配偶星天干
var spouseGan = null;
if (gender === "male") {
var riIdx = TG.indexOf(riGan);
spouseGan = TG[(riIdx + 5) % 10]; // 我克且异性 = 正财, 隔5位
} else {
var riIdx2 = TG.indexOf(riGan);
spouseGan = TG[(riIdx2 - 2 + 10) % 10]; // 克我且异性 = 正官, 隔2位反向
}
// 食伤天干（我生）
var shiShangGans = [];
var riIdx3 = TG.indexOf(riGan);
shiShangGans.push(TG[(riIdx3 + 1) % 10]); // 同性=食神
shiShangGans.push(TG[(riIdx3 + 2) % 10]); // 异性=伤官
// 官星天干（克我）
var guanGans = [];
guanGans.push(TG[(riIdx3 - 2 + 10) % 10]); // 同性=七杀
guanGans.push(TG[(riIdx3 - 1 + 10) % 10]); // 异性=正官
// 印星天干（生我）
var yinGans = [];
yinGans.push(TG[(riIdx3 - 3 + 10) % 10]);
yinGans.push(TG[(riIdx3 - 4 + 10) % 10]);
// 地支合日支
var heMap = {子:"丑",丑:"子",寅:"亥",亥:"寅",卯:"戌",戌:"卯",辰:"酉",酉:"辰",巳:"申",申:"巳",午:"未",未:"午"};
var chongMap = {子:"午",午:"子",丑:"未",未:"丑",寅:"申",申:"寅",卯:"酉",酉:"卯",辰:"戌",戌:"辰",巳:"亥",亥:"巳"};
var events = [];
daYunList.forEach(function(dy) {
for (var i = 0; i < 10; i++) {
var sy = dy.startYear + i;
if (sy < 1950 || sy > 2080) continue;
var yg = TG[(sy - 4) % 10], yz = DZ[(sy - 4) % 12];
var age = dy.startAge + i;
// 结婚年：流年天干 = 配偶星 AND 流年地支合日支（引动配偶宫）
if (yg === spouseGan && yz === heMap[riZhi] && age >= 20 && age <= 45) {
events.push({year: sy, age: age, type: "婚", desc: "配偶星到位且引动夫妻宫，是结婚或确定终身伴侣的好年份"});
}
// 发财年：流年天干 = 食伤（我生）AND 地支为财星五行
var caiWx = (riWx === "木" ? "土" : riWx === "火" ? "金" : riWx === "土" ? "水" : riWx === "金" ? "木" : "火");
if (shiShangGans.indexOf(yg) >= 0 && WX_MAP[yz] === caiWx && age >= 18) {
events.push({year: sy, age: age, type: "财", desc: "食伤生财——这一年适合投资、创业、开拓新业务"});
}
// 升职年：流年天干 = 正官 AND 地支 = 印星五行
if (guanGans.indexOf(yg) >= 0) {
var yinWx = (riWx === "木" ? "水" : riWx === "火" ? "木" : riWx === "土" ? "火" : riWx === "金" ? "土" : "金");
if (WX_MAP[yz] === yinWx && age >= 22) {
events.push({year: sy, age: age, type: "官", desc: "官印到位——事业运势走高，适合跳槽、争取晋升或考取重要资质"});
}
}
// 预警年：流年地支冲日支（夫妻宫被冲）
if (yz === chongMap[riZhi]) {
var warnDesc = age < 50 ? "此年冲动夫妻宫，感情或家庭有变动，宜冷静处理，不宜做重大决定" : "此年冲动夫妻宫，注意身体健康或家庭变动，凡事以稳为主";
events.push({year: sy, age: age, type: "警", desc: warnDesc});
}
}
});
// 排序去重
events.sort(function(a, b) { return a.year - b.year; });
var seen = {};
var unique = [];
events.forEach(function(e) {
var key = e.year + e.type;
if (!seen[key]) { seen[key] = true; unique.push(e); }
});
var cy = new Date().getFullYear();
var past = unique.filter(function(e) { return e.year < cy; }).slice(-2);
var future = unique.filter(function(e) { return e.year >= cy; }).slice(0, 4);
return { past: past, future: future };
}

function analyzeZodiacMatch(bazi) {
var riZhi = bazi.riZhi, nianZhi = bazi.pillars[0].zhi;
var heMap = {子:"丑",丑:"子",寅:"亥",亥:"寅",卯:"戌",戌:"卯",辰:"酉",酉:"辰",巳:"申",申:"巳",午:"未",未:"午"};
var chongMap = {子:"午",午:"子",丑:"未",未:"丑",寅:"申",申:"寅",卯:"酉",酉:"卯",辰:"戌",戌:"辰",巳:"亥",亥:"巳"};
var sanheMap = {"申子辰":["申","子","辰"],"亥卯未":["亥","卯","未"],"寅午戌":["寅","午","戌"],"巳酉丑":["巳","酉","丑"]};
var zodNames = {子:"鼠",丑:"牛",寅:"虎",卯:"兔",辰:"龙",巳:"蛇",午:"马",未:"羊",申:"猴",酉:"鸡",戌:"狗",亥:"猪"};
var descs = [];
var heZhi = heMap[riZhi], chongZhi = chongMap[riZhi];
descs.push("你属" + zodNames[nianZhi] + "，日支是" + riZhi + "（" + zodNames[riZhi] + "）。按地支合冲关系：");
if (heZhi) descs.push("最合的属相是<span class=em>" + zodNames[heZhi] + "</span>（" + heZhi + "）——找对象、合伙做生意、交朋友，这个属相的人跟你最投缘。");
if (chongZhi) descs.push("最要注意的属相是<span class=warn>" + zodNames[chongZhi] + "</span>（" + chongZhi + "）——你们天生犯冲，容易有矛盾。谈恋爱和合伙得比别人多花心思经营。");
for (var k in sanheMap) {
if (k.indexOf(riZhi) >= 0) {
var others = sanheMap[k].filter(function(z) { return z !== riZhi; });
descs.push("三合局的属相是" + others.map(function(z) { return zodNames[z]; }).join("、") + "——这三个属相在一起力量最大，适合组团队、搭班子。");
break;
}
}
// 贵人与小人属相（基于日柱五行生克）
var riWx = bazi.riWx;
var helpWx = (riWx === "木" ? "水" : riWx === "火" ? "木" : riWx === "土" ? "火" : riWx === "金" ? "土" : "金");
var avoidWx = (riWx === "木" ? "金" : riWx === "火" ? "水" : riWx === "土" ? "木" : riWx === "金" ? "火" : "土");
var wxZodMap = {木:["虎","兔"],火:["蛇","马"],土:["牛","龙","羊","狗"],金:["猴","鸡"],水:["鼠","猪"]};
descs.push("按五行生克：喜" + helpWx + "——属" + wxZodMap[helpWx].join("、") + "的人能帮你。忌" + avoidWx + "——属" + wxZodMap[avoidWx].join("、") + "的人相处要多注意。");
return descs;
}
function BenXinZonglun(bazi,wx){var zc=document.getElementById("zonglunCard");var bx=renderBenXin(bazi,wx);zc.innerHTML="<div class=card-title><span class=\"icon icon-bazi\">道</span>本心总论</div><div class=interpret-text>"+bx.map(function(p){return "<p>"+p+"</p>";}).join("")+"</div>";}

// ===== 格局判断 =====
function analyzeGeJu(bazi) {
var riGan=bazi.riGan,riWx=bazi.riWx,yueZhi=bazi.pillars[1].zhi,yueCg=bazi.pillars[1].cg;
var allGans=bazi.pillars.map(function(p){return p.gan;});
var allSS=bazi.pillars.map(function(p){return p.ss;});
var wxAll=countWuxing(bazi.pillars);
var wxAna=analyzeWuxing(wxAll,riWx);
var riStrong=!wxAna.weak.includes(riWx);
var touChu=[];
for(var ci=0;ci<yueCg.length;ci++){var cgGan=yueCg[ci];
for(var pi=0;pi<4;pi++){if(allGans[pi]===cgGan){var ss=getShiShen(riGan,cgGan);
touChu.push({gan:cgGan,ss:ss,position:pi,label:["年干","月干","日干","时干"][pi]});break;}}}
if(touChu.length===0){var benQi=yueCg[0];touChu.push({gan:benQi,ss:getShiShen(riGan,benQi),position:-1,label:"月支本气"});}
touChu.sort(function(a,b){return (a.position===1?-2:0)-(b.position===1?-2:0)+a.position-b.position;});
var main=touChu[0];var geju=main.ss+"格";var yueShenSS=main.ss;var conditions=[];var chengGeCount=0,poGeCount=0;
var ss_count={};allSS.forEach(function(s){ss_count[s]=(ss_count[s]||0)+1;});
if(yueShenSS==="正官"){
if(ss_count["正财"]>0||ss_count["偏财"]>0){conditions.push({met:true,desc:"财星生官——财能养官，官有源头，格局不错"});chengGeCount++;}
if(ss_count["正印"]>0||ss_count["偏印"]>0){conditions.push({met:true,desc:"官印相生——印星化官生身，有贵气，能当领导"});chengGeCount+=2;}
if(ss_count["伤官"]>0){conditions.push({met:false,desc:"伤官见官——一身本事但处处碰壁，需要印星制伤护官"});poGeCount+=2;}
if(ss_count["七杀"]>0){conditions.push({met:false,desc:"官杀混杂——正官七杀同现，事业上犹豫不决"});poGeCount++;}}
else if(yueShenSS==="七杀"){
if(ss_count["食神"]>0){conditions.push({met:true,desc:"食神制杀——以食神约束七杀，化煞为权，有魄力能成事"});chengGeCount+=2;}
if(ss_count["正印"]>0||ss_count["偏印"]>0){conditions.push({met:true,desc:"杀印相生——印星化杀生身，文武双全，格局最高"});chengGeCount+=3;}
if(!riStrong&&chengGeCount===0){conditions.push({met:false,desc:"身弱杀旺无制——压力过大难以承受，需大运来印比帮身"});poGeCount+=2;}}
else if(yueShenSS==="正财"||yueShenSS==="偏财"){
var shiShang=(ss_count["食神"]||0)+(ss_count["伤官"]||0);if(shiShang>0){conditions.push({met:true,desc:"食伤生财——有手艺有技术，靠本事赚钱"});chengGeCount+=2;}
if(riStrong){conditions.push({met:true,desc:"日主强旺能担财——身强才能担得住财"});chengGeCount+=2;}
else{conditions.push({met:false,desc:"财多身弱——钱来了兜不住，需要先补身"});poGeCount+=2;}
var biJie=(ss_count["比肩"]||0)+(ss_count["劫财"]||0);if(biJie>=2){conditions.push({met:false,desc:"比劫夺财——容易被借钱不还，合伙需谨慎"});poGeCount++;}}
else if(yueShenSS==="食神"){
var caiStar=(ss_count["正财"]||0)+(ss_count["偏财"]||0);if(caiStar>0){conditions.push({met:true,desc:"食神生财——有才华能变现"});chengGeCount+=2;}
if(ss_count["偏印"]>0){conditions.push({met:false,desc:"枭神夺食——偏印克食神，才华被压抑"});poGeCount+=2;}
if(caiStar===0&&chengGeCount===0){conditions.push({met:true,desc:"食神泄秀——虽无财星配合，但才华本身也是福气"});chengGeCount++;}}
else if(yueShenSS==="伤官"){
if(ss_count["正印"]>0||ss_count["偏印"]>0){conditions.push({met:true,desc:"伤官配印——有才华又有约束，能成就大事业"});chengGeCount+=3;}
if((ss_count["正财"]||0)+(ss_count["偏财"]||0)>0){conditions.push({met:true,desc:"伤官生财——聪明才智转化为财富"});chengGeCount+=2;}
if(ss_count["正官"]>0){conditions.push({met:false,desc:"伤官见官——才华与权威对抗，容易得罪领导"});poGeCount+=2;}}
else if(yueShenSS==="正印"||yueShenSS==="偏印"){
var guanSha=(ss_count["正官"]||0)+(ss_count["七杀"]||0);if(guanSha>0){conditions.push({met:true,desc:"官印相生——事业有靠山，领导赏识"});chengGeCount+=2;}
var cs=(ss_count["正财"]||0)+(ss_count["偏财"]||0);if(cs>0&&yueShenSS==="正印"){conditions.push({met:false,desc:"财星破印——为了赚钱丢了原则，需要平衡"});poGeCount++;}
var ss2=(ss_count["食神"]||0)+(ss_count["伤官"]||0);if(ss2>=2){conditions.push({met:false,desc:"食伤泄身太过——耗费心神太多，需要收敛"});poGeCount++;}
if(guanSha===0&&chengGeCount===0){conditions.push({met:true,desc:"孤印无官——学习能力强，但仕途上缺贵人引路"});chengGeCount++;}}
var score=chengGeCount-poGeCount;var level;
if(score>=4)level="上等";else if(score>=2)level="中上";else if(score>=0)level="中等";else if(score>=-2)level="中下";else level="下等";
return{geju:geju,yueShen:main.gan,yueShenSS:yueShenSS,chengGe:chengGeCount>poGeCount,level:level,score:score,conditions:conditions};
}

// ===== 用神多维度 =====
function analyzeYongShen(bazi,wxAna,gj){
var riWx=bazi.riWx,riGan=bazi.riGan,yueZhi=bazi.pillars[1].zhi,wxAll=countWuxing(bazi.pillars),result={};
result.fuyi=wxAna.xi.join(" ");
var th={"甲寅":"取丙火暖局+癸水滋养","甲卯":"取庚金修剪+丁火炼金","甲辰":"取庚金劈甲引丁","甲巳":"首取癸水调候+庚金劈木","甲午":"必须癸水润局+庚金生水","甲未":"先用癸水润土+庚金","甲申":"先用丁火制金+庚金","甲酉":"必须丁火制杀+丙火","甲戌":"先取壬癸水润土+庚金","甲亥":"必须丙火暖局+戊土制水","甲子":"专用丙火解冻+丁火","甲丑":"丙火为先+丁火","乙寅":"丙火暖局+癸水","乙卯":"丙火照暖+癸水润根","乙辰":"癸水润土+丙火","乙巳":"急取癸水解炎","乙午":"壬癸水解炎","乙未":"癸水润土","乙申":"丙丁火制金+癸水","乙酉":"丙丁火制杀","乙戌":"癸水润土+丙火","乙亥":"丙火解冻","乙子":"丙火暖局","乙丑":"丙火","丙寅":"壬水+庚金","丙卯":"壬水调济","丙辰":"甲木疏土+壬水","丙巳":"壬水济火+庚金生水","丙午":"壬水解炎+庚金","丙未":"甲木疏土+壬水","丙申":"壬水+甲木","丙酉":"甲木生火+壬水","丙戌":"甲木疏土","丙亥":"甲木生火+戊土制水","丙子":"甲木生火+戊土","丙丑":"甲木疏土生火","丁寅":"甲木引丁+庚金","丁卯":"甲木引丁+庚金","丁辰":"甲木疏土","丁巳":"甲木生火+庚金","丁午":"壬癸水解炎","丁未":"甲木疏土","丁申":"甲木生火+庚金","丁酉":"甲木生丁+庚金","丁戌":"甲木疏土","丁亥":"甲木生火","丁子":"甲木破水生丁","丁丑":"甲木疏土生火","戊寅":"丙火化木生土","戊卯":"丙火通关","戊辰":"甲木疏土","戊巳":"癸水润土","戊午":"壬癸水润局","戊未":"癸水+甲木","戊申":"丙火补土","戊酉":"丙火暖局补土","戊戌":"甲木疏土+癸水","戊亥":"丙火解冻","戊子":"丙火暖局","戊丑":"丙火解冻","己寅":"丙火化木生土","己卯":"丙火泄木生土","己辰":"甲木+癸水","己巳":"癸水润土","己午":"壬癸水","己未":"癸水润局","己申":"丙火补土","己酉":"丙火补土","己戌":"甲木","己亥":"丙火解冻","己子":"丙火","己丑":"丙火暖局","庚寅":"戊土生金+丙火","庚卯":"戊土生金","庚辰":"甲木疏土","庚巳":"壬水解炎+戊土","庚午":"壬癸水+戊土","庚未":"壬水润土+戊土","庚申":"丁火炼金+壬水","庚酉":"丁火炼金","庚戌":"甲木疏土+壬水","庚亥":"丙火暖局","庚子":"丙火解冻","庚丑":"丙火暖局+甲木","辛寅":"丙火暖局+壬水","辛卯":"壬水润局","辛辰":"甲木疏土+壬水","辛巳":"壬水解热","辛午":"壬癸水","辛未":"壬水润土","辛申":"壬水淘洗+丁火","辛酉":"壬水泄秀","辛戌":"壬水润土","辛亥":"丙火暖局","辛子":"丙火暖局","辛丑":"丙火解冻","壬寅":"庚金发源+戊土","壬卯":"庚金生水","壬辰":"甲木疏土+庚金","壬巳":"庚金生水+癸水","壬午":"庚金发源+癸水","壬未":"庚金发源","壬申":"戊土堤防+丁火","壬酉":"甲木泄秀","壬戌":"甲木疏土","壬亥":"戊土堤防","壬子":"戊土筑堤","壬丑":"丙火解冻","癸寅":"庚金发源+辛金","癸卯":"庚辛金","癸辰":"甲木疏土","癸巳":"庚金发源","癸午":"庚金发源","癸未":"庚金","癸申":"丙火暖局+甲木","癸酉":"辛金发源","癸戌":"甲木疏土","癸亥":"丙火解冻","癸子":"丙火解冻","癸丑":"丙火"};
result.tiaohou=th[riGan+yueZhi]||"以扶抑用神为准";
var tongGuan="";var strongWx=wxAna.strong,weakWx=wxAna.weak;
for(var i=0;i<strongWx.length;i++){for(var j=0;j<weakWx.length;j++){var s=strongWx[i],w=weakWx[j];
if(KE_OBJ[s]===w){var m=SHENG_OBJ[s];if(m&&!strongWx.includes(m)&&!weakWx.includes(m)){tongGuan=s+"偏旺"+w+"偏弱，二者相克。通关需要"+m+"——"+s+"生"+m+"，"+m+"生"+w+"，三行流通则顺。";break;}}}}
result.tongguan=tongGuan;
var totalWx=0;for(var k in wxAll){totalWx+=wxAll[k];}var bingYao="";
for(var w in wxAll){if(wxAll[w]/totalWx>0.35){bingYao="五行"+w+"过旺为病（占"+Math.round(wxAll[w]/totalWx*100)+"%），需要"+KE_BY[w]+"来制约。"+w+"过旺引发的问题，只有用"+KE_BY[w]+"来平衡才能解决。";break;}}
result.bingyao=bingYao;
return result;
}

// ===== 原局合冲刑 =====
function _pillarInteractionAnalysis(bazi){
var duan=[],pillars=bazi.pillars,heC=0,chongC=0,xingC=0;
var heM={"子":"丑","丑":"子","寅":"亥","亥":"寅","卯":"戌","戌":"卯","辰":"酉","酉":"辰","巳":"申","申":"巳","午":"未","未":"午"};
var chongM={"子":"午","午":"子","丑":"未","未":"丑","寅":"申","申":"寅","卯":"酉","酉":"卯","辰":"戌","戌":"辰","巳":"亥","亥":"巳"};
var xingM={"子":"卯","卯":"子","寅":"巳","巳":"寅","丑":"戌","戌":"丑","未":"丑"};
var zhis=pillars.map(function(p){return p.zhi;});
for(var i=0;i<zhis.length;i++){for(var j=i+1;j<zhis.length;j++){
if(heM[zhis[i]]===zhis[j])heC++;if(chongM[zhis[i]]===zhis[j])chongC++;if(xingM[zhis[i]]===zhis[j])xingC++;}}
if(heC>=3)duan.push("原局多合——人缘极佳、缘分繁杂、羁绊内耗、感情纠结。");
else if(heC>=2)duan.push("原局有合——人际关系丰富，感情上容易有纠葛。");
if(chongC>=3)duan.push("原局多冲——人生多动、奔波折腾、事业跳槽、财运起伏。");
else if(chongC>=2)duan.push("原局有冲——人生中会有几次大变动，搬家、换工作。");
if(xingC>=2)duan.push("原局多刑——自我内耗、执念太深、身心磨难。凡事想太多，别太执着。");
return duan;
}

// ===== 本心盲派断语 =====
function _benXinDuanyu(wxAll){
var duan=[],wuxing=["木","火","土","金","水"],vals={},th=5;
wuxing.forEach(function(w){vals[w]=wxAll[w]||0;});
if(vals["水"]>=th&&vals["火"]<2)duan.push("水多无火——思虑过重、失眠焦虑、内耗抑郁、贵人稀少。多晒太阳多运动。");
if(vals["土"]>=th&&vals["木"]<2)duan.push("土多无木——思维固化、怀才不遇、劳碌无成。学会变通，别死磕。");
if(vals["金"]>=th&&vals["火"]<2)duan.push("金多无火——刚硬招灾、小人是非、人缘紧张。刚极易折，学会柔软一点。");
if(vals["木"]>=th&&vals["金"]<2)duan.push("木多无金——执拗固执、不懂变通、盲目折腾。方向比努力重要。");
if(vals["火"]>=th&&vals["水"]<2)duan.push("火多无水——急躁冲动、破财是非、三分钟热度。冷静五秒钟。");
return duan;
}

// ===== 宅命相配 =====
function analyzeHouseMatch(bazi){
var yearLast2=bazi.solarY%100,mingGua;
if(bazi.gender==="male"){mingGua=(100-yearLast2)%9;if(mingGua===0)mingGua=9;}
else{mingGua=(yearLast2-4)%9;if(mingGua<=0)mingGua+=9;if(mingGua===5)mingGua=8;}
var isDong=[1,3,4,9].indexOf(mingGua)>=0;
var gn=["","坎","坤","震","巽","坤","乾","兑","艮","离"];
var fm={1:"水",2:"土",3:"木",4:"木",5:"土",6:"金",7:"金",8:"土",9:"火"};
var nm={水:[1,6,11,16,21,26],火:[2,7,12,17,22,27],木:[3,8,13,18,23,28],金:[4,9,14,19,24,29],土:[5,10,15,20,25,30]};
return{mingGua:mingGua,guaName:gn[mingGua],category:isDong?"东四命":"西四命",mingWx:fm[mingGua],favFloors:nm[fm[mingGua]]||[]};
}

// ===== 化解详细建议 =====
function analyzeRemedyDetail(bazi,wxAna){
var riWx=bazi.riWx;var weakWx=wxAna.weak.slice();if(weakWx.length===0)weakWx=[riWx];
var tw=weakWx[0];
var rem={木:{m:"绿檀/小叶紫檀/雷击木（温和→强力）",p:"左手腕",c:"绿色绳或黑色绳",t:"寅卯月（农历正二月）或寅卯日开始",a:"忌金属饰品"},
火:{m:"红玛瑙/朱砂/南红（温和→强力）",p:"右手腕",c:"红色绳或绿色绳",t:"巳午月（农历四五月）或巳午日开始",a:"忌黑色饰品"},
土:{m:"黄水晶/蜜蜡/和田玉（温和→强力）",p:"脖子上（挂坠）",c:"黄色绳或红色绳",t:"辰戌丑未月（农历三六九十二月）开始",a:"忌绿色木质过重"},
金:{m:"白水晶/银饰/钛晶（温和→强力）",p:"左手腕",c:"白色绳或黄色绳",t:"申酉月（农历七八月）或申酉日开始",a:"忌红色饰品"},
水:{m:"黑曜石/海蓝宝/黑发晶（温和→强力）",p:"右手腕",c:"黑色绳或白色绳",t:"亥子月（农历十十一月）或亥子日开始",a:"忌黄色饰品"}};
var r=rem[tw];
return{targetWx:tw,remedy:r};
}

// ===== 增强渲染器：在BenXinZonglun之后追加新分析 =====
function enhanceZonglunAfter(bazi,wx,ssList){
var zc=document.getElementById("zonglunCard");if(!zc)return;
var html="";
var gj=analyzeGeJu(bazi);
html+="<p style=\"margin-top:12px;padding-top:8px;border-top:1px solid #e8dcc8;font-weight:700;color:#8b4513\">【格局判断】</p>";
html+="<p style=\"font-size:13px;color:#5c2d0a\">月令"+gj.yueShen+"透出——<span class=em>"+gj.geju+"</span>，层次<span class=em>"+gj.level+"</span></p>";
gj.conditions.forEach(function(cd){html+="<p style=\"font-size:13px;color:"+(cd.met?"#2e8b57":"#c0392b")+"\">"+(cd.met?"✓":"✗")+" "+cd.desc+"</p>";});

var wxAna=analyzeWuxing(countWuxing(bazi.pillars),bazi.riWx);
var ys=analyzeYongShen(bazi,wxAna,gj);
html+="<p style=\"margin-top:12px;padding-top:8px;border-top:1px solid #e8dcc8;font-weight:700;color:#8b4513\">【用神分析】</p>";
html+="<p style=\"font-size:13px;color:#5c2d0a\">调候："+ys.tiaohou+"</p>";
if(ys.tongguan)html+="<p style=\"font-size:13px;color:#2e8b57\">通关："+ys.tongguan+"</p>";
if(ys.bingyao)html+="<p style=\"font-size:13px;color:#c0392b\">病药："+ys.bingyao+"</p>";

var duan=_benXinDuanyu(countWuxing(bazi.pillars));
if(duan.length>0){html+="<p style=\"margin-top:12px;padding-top:8px;border-top:1px solid #e8dcc8;font-weight:700;color:#8b4513\">【盲派断语】</p>";duan.forEach(function(d){html+="<p style=\"font-size:13px;color:#5c2d0a\">"+d+"</p>";});}

var hd=_pillarInteractionAnalysis(bazi);
if(hd.length>0){html+="<p style=\"margin-top:12px;padding-top:8px;border-top:1px solid #e8dcc8;font-weight:700;color:#8b4513\">【合冲刑】</p>";hd.forEach(function(d){html+="<p style=\"font-size:13px;color:#5c2d0a\">"+d+"</p>";});}

var hm=analyzeHouseMatch(bazi);
html+="<p style=\"margin-top:12px;padding-top:8px;border-top:1px solid #e8dcc8;font-weight:700;color:#8b4513\">【宅命相配】</p>";
html+="<p style=\"font-size:13px;color:#5c2d0a\">命卦："+hm.guaName+"（"+hm.category+"，五行属"+hm.mingWx+"）。有利楼层尾数："+hm.favFloors.slice(0,4).join("、")+"</p>";

var rd=analyzeRemedyDetail(bazi,wxAna);
html+="<p style=\"margin-top:12px;padding-top:8px;border-top:1px solid #e8dcc8;font-weight:700;color:#8b4513\">【化解方案】</p>";
html+="<p style=\"font-size:13px;color:#5c2d0a\">补"+rd.targetWx+"——材质："+rd.remedy.m+"，"+rd.remedy.p+"，"+rd.remedy.c+"。</p>";
html+="<p style=\"font-size:13px;color:#5c2d0a\">择时："+rd.remedy.t+"。注意："+rd.remedy.a+"。</p>";

zc.innerHTML+=html;
}

// ===== 五行产品推荐引擎 =====
var PRODUCT_MAP = {
木: {
hand: ["绿檀","小叶紫檀","雷击木"], handLv: ["温和","中等","强力"],
incense: "崖柏香/檀香", incenseTip: "木主生发，点一支崖柏，像坐在老林子里",
tea: "绿茶/白茶", teaTip: "清新鲜爽，木性的人喝了通透",
food: "芹菜、菠菜、绿豆、猕猴桃", foodTip: "青色入肝，春天多吃"
},
火: {
hand: ["红玛瑙","朱砂","南红玛瑙"], handLv: ["温和","中等","强力"],
incense: "降真香/乳香", incenseTip: "火主热情，降真香暖而不燥",
tea: "红茶/正山小种", teaTip: "红茶暖胃，火弱的人适合",
food: "红枣、枸杞、桂圆、红豆", foodTip: "红色入心，下午煮点红枣水"
},
土: {
hand: ["黄水晶","蜜蜡","和田玉"], handLv: ["温和","中等","强力"],
incense: "沉香/甘松", incenseTip: "土主信，沉香厚而不腻，稳得住",
tea: "普洱熟茶/黄茶", teaTip: "熟普暖胃养脾，土性人越喝越稳",
food: "山药、小米、南瓜、红薯", foodTip: "黄色入脾，早餐来碗小米粥"
},
金: {
hand: ["白水晶","银饰","钛晶"], handLv: ["温和","中等","强力"],
incense: "龙脑香/麝香", incenseTip: "金主决断，龙脑清冽提神",
tea: "白茶/铁观音", teaTip: "白茶清润，金性人喝了嗓子舒服",
food: "白萝卜、银耳、百合、梨", foodTip: "白色入肺，秋冬多吃"
},
水: {
hand: ["黑曜石","海蓝宝","黑发晶"], handLv: ["温和","中等","强力"],
incense: "龙涎香/没药", incenseTip: "水主智，龙涎深沉绵长",
tea: "黑茶/六堡茶", teaTip: "黑茶温润养肾，水弱的人多喝",
food: "黑豆、黑芝麻、海带、桑葚", foodTip: "黑色入肾，每天一勺黑芝麻"
}
};

function genProductRecommend(bazi, wxAna) {
var weakWx = wxAna.weak.slice();
if (weakWx.length === 0) weakWx = [bazi.riWx]; // 五行平衡时选日主
var items = [];
weakWx.forEach(function(w) {
var m = PRODUCT_MAP[w];
if (m) items.push({wx: w, map: m});
});
return {weakWx: weakWx, items: items};
}

function renderProductCard(bazi, wxAna) {
var pc = document.getElementById("productCard");
if (!pc) return;
var rec = genProductRecommend(bazi, wxAna);
if (rec.items.length === 0) { pc.style.display = "none"; return; }
var weakNames = rec.items.map(function(i) { return i.wx; });
var html = '<div class="card-title"><span class="icon icon-dayun" style="background:#daa520">荐</span>五味叔的专属推荐</div>';
html += '<div class="interpret-text"><p>你的八字<span class=em>' + weakNames.join('、') + '</span>偏弱，我给你挑了几样——不是瞎编的，五行缺啥补啥，玩了二十多年手串，信我。</p>';
html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px">';
rec.items.forEach(function(item) {
var m = item.map;
html += '<div style="background:#fffdf8;border:1px solid #e8dcc8;border-radius:8px;padding:10px;text-align:center">';
html += '<div style="font-size:11px;color:#a0896e;margin-bottom:4px;letter-spacing:1px">补' + item.wx + '</div>';
html += '<div style="margin-bottom:6px"><div style="font-size:10px;color:#8b7355">🖐 手串</div><div style="font-size:12px;color:#5c2d0a;font-weight:700">' + m.hand[0] + '</div><div style="font-size:10px;color:#a0896e">' + m.hand[1] + ' / ' + m.hand[2] + '</div></div>';
html += '<div style="margin-bottom:6px"><div style="font-size:10px;color:#8b7355">👃 香道</div><div style="font-size:12px;color:#5c2d0a">' + m.incense + '</div><div style="font-size:10px;color:#a0896e">' + m.incenseTip + '</div></div>';
html += '<div style="margin-bottom:6px"><div style="font-size:10px;color:#8b7355">🍵 茶饮</div><div style="font-size:12px;color:#5c2d0a">' + m.tea + '</div><div style="font-size:10px;color:#a0896e">' + m.teaTip + '</div></div>';
html += '<div><div style="font-size:10px;color:#8b7355">🥣 食养</div><div style="font-size:12px;color:#5c2d0a">' + m.food + '</div><div style="font-size:10px;color:#a0896e">' + m.foodTip + '</div></div>';
html += '</div>';
});
html += '</div><p style="font-size:11px;color:#a0896e;margin-top:10px">手串三档：温和→中等→强力，新手从温和开始。香道和茶饮是日常可用的，食材去菜市场就有。这些东西我用了几十年，不哄你。</p></div>';
pc.innerHTML = html;
}
