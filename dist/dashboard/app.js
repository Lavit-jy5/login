const metrics=[
  {label:'登录完成人数',value:'16,842',change:'+4.8%',up:true,base:'较上一周期',color:'#3157d5'},
  {label:'平台登录完成率',value:'96.2%',change:'+1.2%',up:true,base:'较上一周期',color:'#5f79e4'},
  {label:'新增注册用户数',value:'2,316',change:'+6.4%',up:true,base:'较上一周期',color:'#27b3c7'},
  {label:'新用户完整注册率',value:'76.8%',change:'-0.7%',up:false,base:'较上一周期',color:'#e89a3c'},
  {label:'有效开户用户数',value:'1,481',change:'+8.2%',up:true,base:'较上一周期',color:'#22a06b'},
  {label:'开户整体完成率',value:'60.7%',change:'+2.1%',up:true,base:'较上一周期',color:'#30ad7a'},
  {label:'新用户当天开户率',value:'35.1%',change:'+1.3%',up:true,base:'较上一周期',color:'#7d68dc'},
  {label:'首次激活成功用户',value:'386',change:'-2.3%',up:false,base:'较上一周期',color:'#df5b63'}
];
const spark=[4,8,6,11,9,15,18,16];
let demoState={scale:1,rateDelta:0,label:'全部用户'};
document.querySelector('#metricGrid').innerHTML=metrics.map((m,i)=>`<article class="metric-card" style="--accent:${m.color}" data-index="${i}">
  <div class="metric-label"><span>${m.label}</span><span class="metric-help">?</span></div>
  <div class="metric-value">${m.value}</div><div class="metric-foot"><span class="change ${m.up?'up':'down'}">${m.up?'↑':'↓'} ${m.change}</span><small>${m.base}</small></div><small class="metric-period">统计：10/22–10/28</small>
  <svg class="spark" viewBox="0 0 72 27"><polyline fill="none" stroke="${m.color}" stroke-width="2" points="${spark.map((v,j)=>`${j*10},${27-v-(i%3)}`).join(' ')}"/></svg></article>`).join('');

const structures=[
  {name:'已开户用户',value:11243,pct:60.3,color:'#3157d5'},
  {name:'新用户',value:3216,pct:17.3,color:'#27b3c7'},
  {name:'已注册未开户',value:2684,pct:14.4,color:'#e89a3c'},
  {name:'状态识别失败/其他',value:1499,pct:8.0,color:'#a8afbd'}
];
let offset=0;const segments=structures.map(x=>{const start=offset;offset+=x.pct;return `${x.color} ${start}% ${offset}%`}).join(',');
document.querySelector('#userDonut').style.background=`conic-gradient(${segments})`;
document.querySelector('#structureList').innerHTML=structures.map(x=>`<div class="structure-row"><span class="name"><i style="background:${x.color}"></i>${x.name}</span><b>${x.pct}%</b><small>${x.value.toLocaleString()} 人</small></div>`).join('');

const paths=[
  {name:'新用户注册后开户',sub:'new_register',count:674,rate:61.2,cls:''},
  {name:'未开户用户补开户',sub:'registered_unopened',count:421,rate:52.8,cls:'alt'},
  {name:'首次激活开户',sub:'activation',count:386,rate:71.3,cls:'warm'}
];
const max=Math.max(...paths.map(x=>x.count));
document.querySelector('#pathChart').innerHTML=paths.map(x=>`<div class="path-row"><div class="path-name"><b>${x.name}</b><small>${x.sub}</small></div><div class="bar-track"><div class="bar-fill ${x.cls}" style="width:${x.count/max*100}%"></div></div><div class="path-stat"><b>${x.count} 人</b><span>完成率 ${x.rate}%</span></div></div>`).join('');

const datasets={
  count:{labels:['10/22','10/23','10/24','10/25','10/26','10/27','10/28'],series:[
    {name:'登录完成',color:'#3157d5',values:[14820,15240,15110,15920,16150,16410,16842]},
    {name:'新增注册',color:'#27b3c7',values:[1910,2030,1995,2120,2210,2250,2316]},
    {name:'有效开户',color:'#22a06b',values:[1102,1148,1206,1265,1320,1394,1481]}]},
  rate:{labels:['10/22','10/23','10/24','10/25','10/26','10/27','10/28'],series:[
    {name:'平台登录完成率',color:'#3157d5',values:[93.1,93.8,94.2,94.9,95.4,95.8,96.2]},
    {name:'完整注册率',color:'#27b3c7',values:[75.1,76.0,76.4,75.8,77.2,77.5,76.8]},
    {name:'开户完成率',color:'#22a06b',values:[55.1,56.0,56.7,57.5,58.3,59.4,60.7]}]}
};
let currentMode='count';
function renderTrend(){
  const source=datasets[currentMode],data={labels:source.labels,series:source.series.map(s=>({...s,values:s.values.map(v=>currentMode==='count'?Math.round(v*demoState.scale):Math.max(0,Math.min(100,+(v+demoState.rateDelta).toFixed(1))))}))},svg=document.querySelector('#trendChart'),w=760,h=240,p={l:46,r:18,t:16,b:34};
  const vals=data.series.flatMap(s=>s.values),min=currentMode==='rate'?Math.floor(Math.min(...vals)/10)*10:0,max=currentMode==='rate'?100:Math.max(...vals)*1.1;
  const x=i=>p.l+i*(w-p.l-p.r)/(data.labels.length-1),y=v=>p.t+(max-v)/(max-min)*(h-p.t-p.b);
  let html='';
  for(let i=0;i<5;i++){const yy=p.t+i*(h-p.t-p.b)/4,val=Math.round(max-i*(max-min)/4);html+=`<line x1="${p.l}" y1="${yy}" x2="${w-p.r}" y2="${yy}" stroke="#edf0f5"/><text x="${p.l-9}" y="${yy+4}" text-anchor="end" fill="#98a1b2" font-size="9">${currentMode==='rate'?val+'%':(val/1000).toFixed(val>=1000?0:1)+'k'}</text>`}
  data.labels.forEach((d,i)=>html+=`<text x="${x(i)}" y="${h-10}" text-anchor="middle" fill="#8f98aa" font-size="9">${d}</text>`);
  data.series.forEach(s=>{const points=s.values.map((v,i)=>`${x(i)},${y(v)}`).join(' ');html+=`<polyline fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${points}"/>`;s.values.forEach((v,i)=>html+=`<circle class="trend-point" data-series="${s.name}" data-value="${v}" data-date="${data.labels[i]}" cx="${x(i)}" cy="${y(v)}" r="4" fill="#fff" stroke="${s.color}" stroke-width="2"/>`) });
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.innerHTML=html;
  document.querySelector('#trendLegend').innerHTML=data.series.map(s=>`<span><i style="background:${s.color}"></i>${s.name}</span>`).join('');
  const tip=document.querySelector('#trendTooltip');svg.querySelectorAll('.trend-point').forEach(p=>{p.addEventListener('mouseenter',e=>{tip.innerHTML=`<b>${p.dataset.date}</b><br>${p.dataset.series}：${Number(p.dataset.value).toLocaleString()}${currentMode==='rate'?'%':' 人'}`;tip.style.left=`${e.offsetX+12}px`;tip.style.top=`${e.offsetY-10}px`;tip.style.opacity=1});p.addEventListener('mouseleave',()=>tip.style.opacity=0)});
}
renderTrend();
document.querySelectorAll('#trendTabs button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('#trendTabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');currentMode=btn.dataset.mode;renderTrend()}));

function toast(text){const t=document.createElement('div');t.className='toast';t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),2100)}
document.querySelector('#refreshBtn').addEventListener('click',()=>{toast('数据已刷新至 09:32');document.querySelector('#refreshBtn').animate([{transform:'rotate(0)'},{transform:'rotate(360deg)'}],{duration:500})});

const pageMeta={overview:['核心经营总览','核心指标与趋势'],login:['登录与注册分析','登录、注册与生物识别'],opening:['开户转化分析','开户路径、入口与步骤']};
let currentPage='overview';
function switchPage(page){
  if(!pageMeta[page]){toast('该专项页将在下一阶段完成');return}
  document.querySelectorAll('.page-view').forEach(v=>v.classList.toggle('active',v.id===`${page}Page`));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.page===page));
  document.querySelector('#pageTitle').textContent=pageMeta[page][0];document.querySelector('#pageSubtitle').textContent=pageMeta[page][1];
  currentPage=page;document.querySelectorAll('.opening-only-filter').forEach(x=>x.classList.toggle('visible',page==='opening'));
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.nav-item').forEach(n=>n.addEventListener('click',()=>switchPage(n.dataset.page)));

function updateFilter(){document.querySelectorAll('.scenario-bar button').forEach(b=>b.classList.remove('active'));applyDemoFilters(false)}
document.querySelectorAll('.filter-bar select').forEach(s=>s.addEventListener('change',updateFilter));
document.querySelector('#resetBtn').addEventListener('click',()=>{document.querySelectorAll('.filter-bar select').forEach(s=>s.selectedIndex=0);document.querySelectorAll('.scenario-bar button').forEach((b,i)=>b.classList.toggle('active',i===0));applyDemoFilters(true)});
document.querySelectorAll('.scenario-bar button').forEach(btn=>btn.addEventListener('click',()=>{
  const configs={default:['7','全部版本','全部系统'],ios:['7','8.12.0','iOS'],android:['7','8.11.2','Android'],yesterday:['1','全部版本','全部系统']},c=configs[btn.dataset.scenario];
  document.querySelector('#rangeSelect').value=c[0];document.querySelector('#versionSelect').value=c[1];document.querySelector('#osSelect').value=c[2];document.querySelector('#pathSelect').selectedIndex=0;
  document.querySelector('#userTypeSelect').selectedIndex=0;
  document.querySelectorAll('.scenario-bar button').forEach(b=>b.classList.toggle('active',b===btn));applyDemoFilters(false);
}));

function applyDemoFilters(isReset){
  const range=document.querySelector('#rangeSelect').value,version=document.querySelector('#versionSelect').value,os=document.querySelector('#osSelect').value,userType=document.querySelector('#userTypeSelect').value,path=document.querySelector('#pathSelect').value;
  const rangeScale={7:1,30:4.18,1:.15}[range],versionScale={'全部版本':1,'8.12.0':.64,'8.11.2':.28}[version],osScale={'全部系统':1,iOS:.54,Android:.46}[os];
  const rangeDelta={7:0,30:-.6,1:.4}[range],versionDelta={'全部版本':0,'8.12.0':.8,'8.11.2':-2.4}[version],osDelta={'全部系统':0,iOS:1.1,Android:-1.2}[os];
  const extraScale={'全部用户':1,'新用户':.173,'已开户用户':.603,'已注册未实名':.144}[userType];
  const labels=[range==='7'?'最近7天':range==='30'?'最近30天':'昨日',version,os,userType,currentPage==='opening'?path:'全部路径'].filter(v=>!v.startsWith('全部'));
  demoState={scale:rangeScale*versionScale*osScale*extraScale,rateDelta:rangeDelta+versionDelta+osDelta,label:labels.join(' · ')||'全部用户'};
  updateComparisonPeriod(range);
  document.querySelector('.main-content').classList.add('is-loading');
  window.setTimeout(()=>{renderDemoData();document.querySelector('.main-content').classList.remove('is-loading');toast(isReset?'已恢复全部演示数据':`已切换：${demoState.label}`)},320);
  if(path!=='全部路径'){
    const map={'注册后开户':'register','未开户用户补开户':'supplement','首次激活开户':'activation'};activeOpeningPath=map[path];
    document.querySelectorAll('.entry-card').forEach(x=>x.classList.toggle('active',x.dataset.openingPath===activeOpeningPath));
  }
}

function fmtCount(n){return Math.max(1,Math.round(n*demoState.scale)).toLocaleString()}
function fmtRate(n){return `${Math.max(0,Math.min(100,n+demoState.rateDelta)).toFixed(1)}%`}
function updateComparisonPeriod(range=document.querySelector('#rangeSelect').value){
  const periodName=range==='7'?'最近7天':range==='30'?'最近30天':'昨日',previous=range==='7'?'此前连续7天':range==='30'?'此前连续30天':'前日';document.querySelector('#comparisonText').textContent=`本周期：${periodName}；对比周期：${previous}`;
}
const dateScopes={
  '7':{event:'10/22–10/28',cutoff:'10/28 24:00'},
  '30':{event:'09/29–10/28',cutoff:'10/28 24:00'},
  '1':{event:'10/28',cutoff:'10/28 24:00'}
};
function renderDateScopes(range){
  const d=dateScopes[range],metric=document.querySelectorAll('.metric-card')[6],openingKpi=document.querySelectorAll('#openingPage .opening-kpis article')[3],bio=document.querySelector('.bio-donut'),bioLegend=document.querySelectorAll('.bio-legend>div');
  document.querySelectorAll('.metric-card,.mini-kpi-grid article,.biometric-kpis article').forEach(card=>{let period=card.querySelector('.metric-period');if(!period){period=document.createElement('small');period.className='metric-period';card.appendChild(period)}period.textContent=`统计：${d.event}`});
  const sameDayRate=Math.max(0,Math.min(100,35.1+demoState.rateDelta)),sameDayDenominator=Math.max(1,Math.round(2316*demoState.scale)),sameDayNumerator=Math.round(sameDayDenominator*sameDayRate/100);
  metric.querySelector('.metric-value').textContent=`${sameDayRate.toFixed(1)}%`;metric.querySelector('.change').className='change up';metric.querySelector('.change').textContent='↑ +1.3%';metric.querySelector('.metric-foot small').textContent='较上一周期';openingKpi.querySelector('strong').textContent=`${sameDayRate.toFixed(1)}%`;openingKpi.querySelector('small:not(.metric-period)').textContent=`${sameDayNumerator.toLocaleString()} ÷ ${sameDayDenominator.toLocaleString()}`;
  document.querySelector('#userStructureSubtitle').textContent=`按账户识别结果划分 · 截至${d.cutoff}`;document.querySelector('#bioStateDate').textContent=`截至${d.cutoff}`;
  bio.classList.remove('observing');bio.querySelector('strong').textContent='37.1%';bio.querySelector('span').innerHTML=`立即开启率<br>${d.event}`;[1426,1038,822,556].forEach((v,i)=>bioLegend[i].querySelector('b').textContent=fmtCount(v));[37.1,27.0,21.4,14.5].forEach((v,i)=>bioLegend[i].querySelector('em').textContent=`${v.toFixed(1)}%`);
}
function renderDemoData(){
  document.querySelector('#activeFilterText').textContent=demoState.label;
  const metricValues=[fmtCount(16842),fmtRate(96.2),fmtCount(2316),fmtRate(76.8),fmtCount(1481),fmtRate(60.7),fmtRate(35.1),fmtCount(386)];
  document.querySelectorAll('.metric-value').forEach((el,i)=>el.textContent=metricValues[i]);
  const structureTotal=Math.round(18642*demoState.scale);document.querySelector('#userDonut strong').textContent=structureTotal.toLocaleString();
  document.querySelectorAll('.structure-row small').forEach((el,i)=>el.textContent=`${fmtCount(structures[i].value)} 人`);
  const pathRows=document.querySelectorAll('#pathChart .path-row');paths.forEach((p,i)=>{pathRows[i].querySelector('.path-stat b').textContent=`${fmtCount(p.count)} 人`;pathRows[i].querySelector('.path-stat span').textContent=`完成率 ${fmtRate(p.rate)}`});
  const miniBase=[18642,17506,16842,2316];document.querySelectorAll('#loginPage .mini-kpi-grid strong').forEach((el,i)=>el.textContent=fmtCount(miniBase[i]));
  const methodBase=[7500,6100,1760,2146];document.querySelectorAll('.method-row>strong').forEach((el,i)=>el.textContent=fmtCount(methodBase[i]));
  const registerBase=[3016,2684,2401,2316];document.querySelectorAll('.registration-funnel>div').forEach((el,i)=>{el.querySelector('b').textContent=fmtCount(registerBase[i]);const prev=i?registerBase[i-1]:registerBase[i],step=registerBase[i]/prev*100,retain=registerBase[i]/registerBase[0]*100,loss=i?prev-registerBase[i]:0;el.querySelector('small').textContent=`上步 ${step.toFixed(1)}% · 起点 ${retain.toFixed(1)}%${i?` · 流失 ${fmtCount(loss)}`:''}`});
  [1084,1012,220].forEach((v,i)=>document.querySelectorAll('.source-bars small')[i].textContent=`${fmtCount(v)} 人`);
  const openingBase=[2439,1481];const openingStrong=document.querySelectorAll('#openingPage .opening-kpis strong');openingStrong[0].textContent=fmtCount(openingBase[0]);openingStrong[1].textContent=fmtCount(openingBase[1]);openingStrong[2].textContent=fmtRate(60.7);openingStrong[3].textContent=fmtRate(35.1);openingStrong[4].textContent=fmtRate(86.4);
  const entryBase=[[1101,674,61.2],[797,421,52.8],[541,386,71.3]];document.querySelectorAll('.entry-card').forEach((c,i)=>{c.querySelector('strong').textContent=`${fmtCount(entryBase[i][0])} 人`;c.querySelector('em').textContent=fmtRate(entryBase[i][2]);c.querySelector('small').textContent=`有效开户 ${fmtCount(entryBase[i][1])} 人`});
  const bioCounts=[3842,1426,1038,822,556];document.querySelectorAll('.biometric-kpis strong').forEach((el,i)=>el.textContent=fmtCount(bioCounts[i]));
  const bioStrip=document.querySelectorAll('.bio-login-strip strong');bioStrip[0].textContent=fmtCount(4386);[48.9,95.1].forEach((v,i)=>bioStrip[i+1].textContent=fmtRate(v));
  const activationCounts=[1126,541,512,73,386];const activationTargets=[document.querySelector('.tree-root b'),...document.querySelectorAll('.tree-branch b'),document.querySelector('.activation-result strong')];activationTargets.forEach((el,i)=>{if(el)el.textContent=i===0?`${fmtCount(activationCounts[i])} 人`:i===4?`${fmtCount(activationCounts[i])} 人`:el.textContent.replace(/[\d,]+/,fmtCount(activationCounts[i]))});
  [541,431,391,386,386].forEach((v,i)=>document.querySelectorAll('.activation-summary b')[i].textContent=fmtCount(v));
  const sourceBases=[312,178,142,98,67],sourceSuccess=[174,94,72,47,34],sourceRates=[55.8,52.8,50.7,48,50.7];document.querySelectorAll('.source-entry').forEach((el,i)=>{el.querySelector('strong').textContent=fmtCount(sourceBases[i]);el.querySelector('em').textContent=`完成率 ${fmtRate(sourceRates[i])}`;el.querySelector('small').textContent=`开户贡献 ${(sourceSuccess[i]/421*100).toFixed(1)}%`;el.querySelector('i b').style.width=fmtRate(sourceRates[i])});
  document.querySelector('.supplement-entry-panel .formula-chip').textContent=`合计进入 ${fmtCount(797)} 人 · 有效开户 ${fmtCount(421)} 人`;
  renderTrend();renderLoginFunnel();renderDiagnosis(currentDiagnosis);renderOpeningFunnel(activeOpeningPath);renderReasonPanels();renderDateScopes(document.querySelector('#rangeSelect').value);
}

function openDrawer(title,detail){document.querySelector('#drawerTitle').textContent=title;document.querySelector('#drawerDetail').textContent=detail;document.querySelector('#drawerMask').classList.add('open');document.querySelector('#detailDrawer').classList.add('open');document.querySelector('#detailDrawer').setAttribute('aria-hidden','false')}
function closeDrawer(){document.querySelector('#drawerMask').classList.remove('open');document.querySelector('#detailDrawer').classList.remove('open');document.querySelector('#detailDrawer').setAttribute('aria-hidden','true')}
document.querySelector('#drawerClose').addEventListener('click',closeDrawer);document.querySelector('#drawerMask').addEventListener('click',closeDrawer);
function renderLoginFunnel(){
  const steps=[['登录首页到达',18642],['发起登录',17506],['登录完成',16842]],labels=['未发起','登录未完成'];
  document.querySelector('#loginFunnel').innerHTML=steps.map((x,i)=>{const count=Math.round(x[1]*demoState.scale),start=x[1]/steps[0][1]*100,prev=i?x[1]/steps[i-1][1]*100:100,loss=i?Math.round((steps[i-1][1]-x[1])*demoState.scale):0;const card=`<button class="funnel-step ${i===2?'success':''}" data-title="${x[0]}" data-detail="到达 ${count.toLocaleString()} 人；上一步转化率 ${prev.toFixed(1)}%；相对起点留存率 ${start.toFixed(1)}%。"><span>0${i+1}</span><b>${x[0]}</b><strong>${count.toLocaleString()}</strong><small>上步 ${prev.toFixed(1)}% · 起点 ${start.toFixed(1)}%${i?` · 流失 ${loss.toLocaleString()}`:''}</small></button>`;return i<2?`${card}<i>−${Math.round((steps[i][1]-steps[i+1][1])*demoState.scale).toLocaleString()}<br><em>${labels[i]}</em></i>`:card}).join('');
  document.querySelectorAll('#loginFunnel .funnel-step').forEach(s=>s.addEventListener('click',()=>openDrawer(s.dataset.title,s.dataset.detail)));
}
renderLoginFunnel();

const metricDetails=[
  '服务端返回登录成功且客户端建立有效登录态的去重用户数。',
  '登录完成人数 ÷ 发起登录人数。例如 16,842 ÷ 17,506 = 96.2%；登录首页到完成率另计为90.3%。',
  '统计周期内完成账户创建的新用户去重数。',
  '新用户建立登录态人数 ÷ 登录链路识别新用户人数。例如 2,316 ÷ 3,016 = 76.8%。',
  '完成全部开户必需步骤并最终开户成功的去重用户数。',
  '有效开户用户数 ÷ 进入开户流程用户数。',
  '选定日期内注册且在注册当天完成有效开户的新用户数 ÷ 选定日期内新增注册用户数。例如10/22–10/28新增注册2,316人，其中812人在各自注册当天开户，开户率为812 ÷ 2,316 = 35.1%。',
  '首次激活入口识别为未实名，且完成开户、人脸核验并建立登录态的用户数。'
];
document.querySelectorAll('.metric-card').forEach(c=>c.addEventListener('click',e=>{const i=Number(c.dataset.index);if(e.target.classList.contains('metric-help')){openDrawer(metrics[i].label,metricDetails[i]);return}if(i<4)switchPage('login');else toast('将在开户专项页中下钻')}));

let currentDiagnosis='sms';
const diagnosis={
  sms:{title:'短信登录漏斗',sub:'验证码获取、提交与最终登录',status:'完成率 96.9%',steps:[['请求验证码',7500],['短信发送成功',7410],['提交验证码',7370],['登录完成',7268]]},
  one:{title:'一键登录漏斗',sub:'本机号码授权与最终登录',status:'完成率 97.9%',steps:[['发起一键登录',6100],['提交本机授权',6051],['登录完成',5972]]},
  password:{title:'账户密码登录漏斗',sub:'密码提交与最终登录',status:'完成率 88.7%',steps:[['进入密码登录',1760],['提交账户密码',1723],['登录完成',1561]]},
  biometric:{title:'生物识别登录漏斗',sub:'发起验证与最终登录',status:'完成率 95.1%',steps:[['发起生物识别',2146],['登录态建立',2041]]}
};
function renderDiagnosis(type){currentDiagnosis=type;const d=diagnosis[type],start=d.steps[0][1];document.querySelector('#diagnosisTitle').textContent=d.title;document.querySelector('#diagnosisSub').textContent=d.sub;document.querySelector('#diagnosisStatus').textContent=`完成率 ${fmtRate(d.steps.at(-1)[1]/start*100)}`;document.querySelector('#diagnosisFunnel').innerHTML=d.steps.map((x,i)=>{const prev=i?d.steps[i-1][1]:x[1],step=x[1]/prev*100,retain=x[1]/start*100,loss=i?prev-x[1]:0;return `<div class="compact-row"><span>${x[0]}</span><i><b style="width:${Math.min(100,retain+demoState.rateDelta)}%"></b></i><strong>${fmtCount(x[1])}<small>上步 ${step.toFixed(1)}% · 起点 ${retain.toFixed(1)}%${i?` · 流失 ${fmtCount(loss)}`:''}</small></strong></div>`}).join('')}
renderDiagnosis('sms');
document.querySelectorAll('.method-row').forEach(r=>r.addEventListener('click',()=>{document.querySelectorAll('.method-row').forEach(x=>x.classList.remove('active'));r.classList.add('active');renderDiagnosis(r.dataset.method)}));

document.querySelector('.section-heading .quiet-btn').addEventListener('click',()=>openDrawer('指标口径说明','每个结果指标均已明确业务定义、统计对象、分子分母、时间窗口和去重规则；点击具体指标卡片右上角“?”可查看单项口径。'));
document.querySelector('[data-action="export"]').addEventListener('click',()=>toast('演示数据已生成导出任务'));

let activeOpeningPath='register';
const openingFunnels={
  register:{title:'注册成功后继续开户漏斗',rate:'路径完成率 61.2%',steps:[['进入开户',1101,100],['提交身份信息',1059,96.2],['绑定银行卡',973,88.4],['设置交易密码',916,83.2],['人脸核验成功',791,71.8],['开户成功',674,61.2]]},
  supplement:{title:'已注册未实名补开户漏斗',rate:'路径完成率 52.8%',steps:[['进入开户',797,100],['提交身份信息',748,93.9],['绑定银行卡',675,84.7],['设置交易密码',622,78.0],['人脸核验成功',491,61.6],['开户成功',421,52.8]]},
  activation:{title:'账户首次激活开户步骤',rate:'路径完成率 71.3%',steps:[['识别为未实名',541,100],['提交身份信息',520,96.1],['绑定银行卡',472,87.2],['设置交易密码',431,79.7],['人脸核验成功',391,72.3],['开户并登录',386,71.3]]}
};
function renderOpeningFunnel(type){
  activeOpeningPath=type;const d=openingFunnels[type];document.querySelector('#openingFunnelTitle').textContent=d.title;document.querySelector('#openingFunnelRate').textContent=`路径完成率 ${fmtRate(parseFloat(d.rate.match(/[\d.]+/)[0]))}`;
  document.querySelector('#openingFunnel').innerHTML=d.steps.map((x,i)=>{const prev=i?d.steps[i-1][1]:x[1],step=x[1]/prev*100,loss=i?prev-x[1]:0;return `<button class="open-step ${i===4?'loss':''}" data-title="${x[0]}" data-detail="${x[0]}到达 ${fmtCount(x[1])} 人；上一步转化率 ${step.toFixed(1)}%；相对起点留存率 ${x[2].toFixed(1)}%；流失 ${fmtCount(loss)} 人。"><span>步骤 ${String(i+1).padStart(2,'0')}</span><b>${x[0]}</b><strong>${fmtCount(x[1])}</strong><small>上步 ${step.toFixed(1)}%</small><small>起点 ${fmtRate(x[2])}${i?` · 流失 ${fmtCount(loss)}`:''}</small></button>`}).join('');
  document.querySelectorAll('.open-step').forEach(s=>s.addEventListener('click',()=>openDrawer(s.dataset.title,s.dataset.detail)));
}
renderOpeningFunnel('register');
document.querySelectorAll('.entry-card').forEach(c=>c.addEventListener('click',()=>{document.querySelectorAll('.entry-card').forEach(x=>x.classList.remove('active'));c.classList.add('active');renderOpeningFunnel(c.dataset.openingPath)}));
document.querySelector('#goOpeningBtn').addEventListener('click',()=>{switchPage('opening');document.querySelectorAll('.entry-card').forEach(x=>x.classList.toggle('active',x.dataset.openingPath==='activation'));renderOpeningFunnel('activation')});

const supplementSourceData={unverified_home:{name:'未实名首页',count:312,success:174,rate:55.8},asset:{name:'资产页',count:178,success:94,rate:52.8},buy:{name:'买入拦截',count:142,success:72,rate:50.7},invest:{name:'定投拦截',count:98,success:47,rate:48.0},password:{name:'密码登录拦截',count:67,success:34,rate:50.7}};
function renderSupplementSource(key){
  const d=supplementSourceData[key],base=openingFunnels.supplement.steps,ratio=d.count/797;activeOpeningPath='supplement';
  document.querySelectorAll('.source-entry').forEach(x=>x.classList.toggle('active',x.dataset.source===key));document.querySelectorAll('.entry-card').forEach(x=>x.classList.toggle('active',x.dataset.openingPath==='supplement'));
  document.querySelector('#openingFunnelTitle').textContent=`${d.name}补开户漏斗`;document.querySelector('#openingFunnelRate').textContent=`入口完成率 ${fmtRate(d.rate)}`;
  const counts=base.map((x,i)=>i===0?d.count:i===base.length-1?d.success:Math.max(d.success,Math.round(x[1]*ratio)));
  document.querySelector('#openingFunnel').innerHTML=base.map((x,i)=>{const count=counts[i],prev=i?counts[i-1]:count,step=count/prev*100,retain=count/counts[0]*100,loss=i?prev-count:0;return `<button class="open-step ${i===4?'loss':''}" data-title="${x[0]}" data-detail="${d.name}：${x[0]} ${fmtCount(count)} 人；上一步转化率 ${step.toFixed(1)}%；相对起点留存率 ${retain.toFixed(1)}%。"><span>步骤 ${String(i+1).padStart(2,'0')}</span><b>${x[0]}</b><strong>${fmtCount(count)}</strong><small>上步 ${step.toFixed(1)}%</small><small>起点 ${retain.toFixed(1)}%${i?` · 流失 ${fmtCount(loss)}`:''}</small></button>`}).join('');
  document.querySelector('#sourceDetail').innerHTML=`<b>${d.name}</b><span>进入${fmtCount(d.count)}人 · 有效开户${fmtCount(d.success)}人 · 完成率${fmtRate(d.rate)} · 开户贡献 ${(d.success/421*100).toFixed(1)}%</span>`;
  document.querySelectorAll('.open-step').forEach(s=>s.addEventListener('click',()=>openDrawer(s.dataset.title,s.dataset.detail)));
}
document.querySelectorAll('.source-entry').forEach(x=>x.addEventListener('click',()=>renderSupplementSource(x.dataset.source)));

const openingReasonData={
  all:[['人脸核验未通过',36.8,'光线、动作及公安库比对失败'],['银行卡校验失败',24.3,'卡状态、预留手机号或渠道异常'],['身份信息校验失败',18.6,'证件信息或有效期异常'],['用户主动退出',12.7,'按最后到达步骤记录'],['其他',7.6,'网络或系统服务异常']],ios:[['人脸核验未通过',34.1,'Face ID或公安库比对失败'],['银行卡校验失败',25.8,'卡状态或预留手机号异常'],['身份信息校验失败',19.5,'证件信息异常'],['用户主动退出',13.0,'按最后到达步骤记录'],['其他',7.6,'网络或系统服务异常']],android:[['人脸核验未通过',40.9,'设备兼容、光线或动作失败'],['银行卡校验失败',22.1,'卡状态或预留手机号异常'],['身份信息校验失败',17.4,'证件信息异常'],['用户主动退出',12.4,'按最后到达步骤记录'],['其他',7.2,'网络或系统服务异常']],old:[['人脸核验未通过',43.6,'旧版本设备兼容或动作失败'],['银行卡校验失败',20.4,'卡状态或渠道异常'],['身份信息校验失败',16.8,'证件信息异常'],['用户主动退出',11.7,'按最后到达步骤记录'],['其他',7.5,'网络或系统服务异常']],buy:[['人脸核验未通过',38.2,'光线、动作及公安库比对失败'],['用户主动退出',23.4,'交易被开户流程打断'],['银行卡校验失败',20.1,'卡状态或预留手机号异常'],['身份信息校验失败',12.7,'证件信息异常'],['其他',5.6,'网络或系统服务异常']],asset:[['人脸核验未通过',35.0,'光线、动作及公安库比对失败'],['银行卡校验失败',26.6,'卡状态或预留手机号异常'],['身份信息校验失败',20.2,'证件信息异常'],['用户主动退出',11.0,'按最后到达步骤记录'],['其他',7.2,'网络或系统服务异常']]
};
function renderReasonPanels(){const opening=openingReasonData[document.querySelector('#openingReasonDimension').value];document.querySelector('#openingFailureList').innerHTML=opening.map(x=>`<div><b>${x[0]}</b><span>${x[1].toFixed(1)}%</span><small>${x[2]}</small></div>`).join('')}
document.querySelectorAll('.reason-select').forEach(x=>x.addEventListener('change',renderReasonPanels));renderReasonPanels();

// 业务归属同步：生物识别并入登录，首次激活并入开户，不保留独立一级页面。
const legacyPage=document.querySelector('#activationPage');
const activationGrid=legacyPage.querySelector('.activation-grid');
const biometricPanel=legacyPage.querySelector('.biometric-panel');
const biometricBottom=legacyPage.querySelector('.biometric-bottom');
const openingBottom=document.querySelector('#openingPage .opening-bottom-grid');
document.querySelector('.path-entry-panel').after(document.querySelector('.supplement-entry-panel'));
document.querySelector('#openingPage').insertBefore(activationGrid,openingBottom.nextSibling);
activationGrid.insertAdjacentHTML('beforebegin','<div class="embedded-heading"><h2>首次激活</h2></div>');
const loginPage=document.querySelector('#loginPage');
loginPage.appendChild(biometricPanel);
biometricPanel.insertAdjacentHTML('beforebegin','<div class="embedded-heading"><h2>生物识别登录</h2></div>');
loginPage.appendChild(biometricBottom);
legacyPage.remove();
renderDateScopes(document.querySelector('#rangeSelect').value);
