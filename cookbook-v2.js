/* 家的味道 2.0 · 静态数据增强，不依赖服务端 */
(function () {
"use strict";
const SEASONS = {
"春笋":[3,4,5],"冬笋":[12,1,2],"蒜薹":[4,5,6],"苋菜":[5,6,7,8,9],
"空心菜":[5,6,7,8,9,10],"丝瓜":[6,7,8,9],"茄子":[6,7,8,9],
"黄瓜":[5,6,7,8,9],"冬瓜":[6,7,8,9,10],"茭白":[5,6,9,10],
"莲藕":[9,10,11,12,1,2,3],"芋艿":[9,10,11,12],"板栗":[9,10,11],
"白萝卜":[10,11,12,1,2,3],"白菜":[10,11,12,1,2,3],
"番茄":[5,6,7,8,9],"青椒":[5,6,7,8,9],"西葫芦":[5,6,7,8,9],
"青菜":[10,11,12,1,2,3,4],"生菜":[3,4,5,10,11],
"西兰花":[10,11,12,1,2,3],"包心菜":[3,4,5,10,11,12],
"胡萝卜":[10,11,12,1,2,3],"青豆":[5,6,7],"高笋":[5,6,9,10]
};
const ALIAS = {
"五花肉":"猪五花","猪肉":"猪肉","瘦肉":"猪肉","里脊肉":"猪里脊","肉丝":"猪里脊","肉末":"猪肉末",
"肥肠":"大肠","翅中":"鸡翅","鸡翅中":"鸡翅","鸡":"鸡肉","鸭":"鸭肉",
"藕":"莲藕","笋丝":"春笋","笋":"春笋","蒜苔":"蒜薹","白萝卜丝":"白萝卜",
"萝卜丝":"白萝卜","萝卜":"白萝卜","青椒":"青椒","葱":"大葱","姜":"生姜","蒜":"大蒜",
"娃娃菜":"白菜","海蛎":"生蚝","虾仁":"虾","斑节虾":"虾","河虾":"虾",
"包浆豆腐":"豆腐","豆腐泡":"油豆腐","香菇":"菌菇","蘑菇":"菌菇","蟹味菇":"菌菇",
"高笋":"茭白","番薯":"红薯","紫菜":"紫菜","裙带菜":"海带",
"牛坑腩":"牛腩","牛肋条":"牛肉","牛排":"牛肉","羊腩":"羊肉","羊排":"羊肉",
"猪大排":"猪肉","排骨":"猪排骨","筒骨":"猪排骨","肉饼":"猪肉",
"油豆腐":"油豆腐","黄鱼鲞":"黄鱼","鲳鱼":"鱼","黄鱼":"鱼","鲈鱼":"鱼",
"鲫鱼":"鱼","带鱼":"鱼","鳗鱼":"鱼","笋壳鱼":"鱼","杂鱼":"鱼",
"乌冬面":"面条","意面":"面条","米饭":"大米","糯米":"大米","粥底":"大米",
"海蛎":"生蚝","虾皮":"虾皮","生姜":"生姜"
};
const GROUPS = {
"蔬菜":["青菜","生菜","空心菜","苋菜","茄子","黄瓜","冬瓜","丝瓜","番茄","白萝卜","白菜","包心菜","西兰花","胡萝卜","青椒","莲藕","茭白","春笋","冬笋","蒜薹","西葫芦","青豆","豆芽","绿豆芽","洋葱","大葱"],
"菌菇":["菌菇","虫草花"],
"肉类":["猪肉","猪五花","猪里脊","猪肉末","猪排骨","大肠","猪肚","猪蹄","牛肉","牛腩","牛肉丸","羊肉","腊肉","腊肠","咸肉","酱油肉","卤肉"],
"禽类":["鸡肉","鸡翅","鸡爪","鸭肉","鸭舌"],
"水产":["鱼","虾","虾皮","生蚝","蛤蜊","墨鱼","墨鱼干","鲍鱼","青蟹","田蟹","海瓜子","水潺","蛏子","红绿头","沙蒜","温州鱼饼","明珠鱼片"],
"蛋类":["鸡蛋","皮蛋"],
"豆制品":["豆腐","豆腐干","油豆腐","黄豆","绿豆"],
"谷薯":["大米","面条","粉丝","年糕","面粉","饺子皮","红薯","土豆","芋艿","山药"],
"水果坚果":["苹果","柠檬","桂圆","荔枝干","葡萄干","提子","板栗","坚果","牛油果"],
"调味加工":["榨菜","咸菜","雪菜","梅干菜","辣白菜","酸菜","腐乳","紫菜","海带","菜干","白芝麻","大蒜","生姜","大葱","八角","水"]
};
const groups = new Map(Object.entries(GROUPS).flatMap(([g,items])=>items.map(item=>[item,g])));
const strongProtein = new Set(["猪肉","猪五花","猪里脊","猪肉末","猪排骨","猪肚","猪蹄","大肠","牛肉","牛腩","牛肉丸","羊肉","鸡肉","鸡翅","鸡爪","鸭肉","鸭舌","鱼","虾","生蚝","蛤蜊","墨鱼","墨鱼干","鲍鱼","青蟹","田蟹","海瓜子","水潺","蛏子","沙蒜","鸡蛋","皮蛋","豆腐","豆腐干","油豆腐","黄豆","温州鱼饼","明珠鱼片"]);
const vegetable = new Set([...GROUPS["蔬菜"],...GROUPS["菌菇"]].filter(x=>!["洋葱","大葱","青豆"].includes(x)));
const starchy = new Set(GROUPS["谷薯"]);
const weakVegetable = new Set(["洋葱","大葱","青豆","豆芽","绿豆芽","菌菇","春笋","冬笋"]);
const seasonal = name => SEASONS[name] || [];
const fallbackSeason = [1,2,3,4,5,6,7,8,9,10,11,12];
const storage = {
get(key, fallback){try { return JSON.parse(localStorage.getItem("cookbook_v2_"+key)) ?? fallback; } catch {return fallback;}},
set(key,value){try{localStorage.setItem("cookbook_v2_"+key,JSON.stringify(value));}catch{}}
};
function normalize(s){
 const clean=String(s).trim().replace(/(?:约)?\d+(?:\.\d+)?\s*(?:kg|g|克|斤|根|小根|个|片|勺|ml|L)$/i,"").replace(/^约/,"").trim();
 return ALIAS[clean]||clean;
}
function parseIngredients(raw){
 return String(raw||"").replace(/饼皮：|馅：|纯肉馅：/g,"").split(/[、，,；;\n]/).map(x=>x.trim()).filter(Boolean)
 .map(token=>{
   const choices=token.split("/").map(normalize).filter(Boolean);
   return {name:choices[0],choices:[...new Set(choices)],raw:token};
 }).filter(x=>x.name&&!/^(?:--|水)$/.test(x.name));
}
function ingredientCategory(n){return groups.get(n)||(/鱼|虾|蟹|蛤|蚝/.test(n)?"水产":/肉|排骨/.test(n)?"肉类":"待分类");}
function classify(r){
 const refs=parseIngredients(r.ingredients);
 const names=refs.map(x=>x.name);
 const proteins=names.filter(n=>strongProtein.has(n));
 const vegs=names.filter(n=>vegetable.has(n)&&!weakVegetable.has(n));
 const starch=names.filter(n=>starchy.has(n));
 const soup=/汤|羹|粥/.test(r.name);
 const condiment=r.category==="酱汁";
 const processing=/炸|椒盐|腊|咸菜|榨菜/.test(r.name);
 return {...r,refs,names,proteins,vegs,starch,soup,condiment,processing,
  roles:[...(proteins.length?["蛋白质"]:[]),...(vegs.length?["蔬菜"]:[]),...(starch.length?["主食"]:[])]};
}
const modeled=recipes.map(classify);
const ingredientMap=new Map();
for(const r of modeled)for(const item of r.refs)for(const n of item.choices){
 if(!ingredientMap.has(n))ingredientMap.set(n,{name:n,category:ingredientCategory(n),months:seasonal(n),recipeIds:new Set()});
 ingredientMap.get(n).recipeIds.add(r.id);
}
const pantry=[{name:"米饭",ingredients:["大米"],roles:["主食"],base:true}];
let view=null, month=new Date().getMonth()+1, familyCount=2, selectedCategory="全部", foodQuery="", excluded=new Set();
let menus=[], shopping=storage.get("shopping",[]), savedMenus=storage.get("savedMenus",[]);
const $2=s=>document.querySelector(s);
function esc(s){return escapeHTML(String(s??""));}
function seasonScore(r){
 const active=r.vegs.filter(n=>seasonal(n).includes(month)).length;
 return active*12 + r.vegs.length*3-(r.processing?8:0);
}
function pickWeighted(list, fn){
 if(!list.length)return null;
 const weighted=list.map(x=>({x,w:Math.max(1,fn(x))}));
 const sum=weighted.reduce((a,b)=>a+b.w,0);
 let p=Math.random()*sum;
 for(const {x,w} of weighted){p-=w;if(p<=0)return x;}
 return weighted.at(-1).x;
}
function eligible(r) {
 return !r.condiment && !r.refs.some(ref=>ref.choices.some(n=>excluded.has(n)||excluded.has(ingredientCategory(n))));
}
function countCovered(items){
 return {protein:items.some(x=>x.proteins?.length),veg:items.some(x=>x.vegs?.length),
 starch:items.some(x=>x.starch?.length||x.base)};
}
function generate(preserved=[]){
 const chosen=[...preserved];
 const has=id=>chosen.some(r=>r.id===id);
 const pool=modeled.filter(r=>eligible(r)&&!has(r.id));
 const take=(fn,prefer)=> {
  const current=chosen.flatMap(x=>x.names||[]);
  const options=pool.filter(r=>!has(r.id)&&fn(r)&&!r.names.some(n=>current.includes(n)&&r.names.length===1));
  const item=pickWeighted(options,r=>20+seasonScore(r)+(prefer?.(r)||0));
  if(item)chosen.push(item);
 };
 if(!chosen.some(r=>r.proteins?.length))take(r=>r.proteins.length && !r.soup,r=>r.proteins.length*4);
 if(!chosen.some(r=>r.vegs?.length))take(r=>r.vegs.length && !r.soup,r=>r.vegs.length*8);
 if(!chosen.some(r=>r.starch?.length))chosen.push({...pantry[0],id:"base-rice",name:"米饭（基础搭配）",names:["大米"],refs:[{name:"大米",choices:["大米"]}],proteins:[],vegs:[],starch:["大米"],soup:false});
 if(chosen.length<3)take(r=>r.soup&&r.proteins.length+r.vegs.length>0);
 if(chosen.length<3)take(r=>r.vegs.length||r.proteins.length);
 if(chosen.length<3)return null;
 const roles=countCovered(chosen);
 if(!roles.protein||!roles.veg||!roles.starch)return null;
 return {items:chosen.slice(0,4),locked:chosen.map(x=>preserved.includes(x))};
}
function regenerate(){
 const generated=[],seen=new Set();
 for(let i=0;i<160&&generated.length<3;i++){
  const m=generate();if(!m)continue;
  const key=m.items.map(x=>x.id).sort().join("|");
  if(seen.has(key))continue;seen.add(key);generated.push(m);
 }
 menus=generated;renderV2();
}
function replaceItem(mi,ii){
 const old=menus[mi];if(!old||old.locked[ii])return;
 const target=old.items[ii], others=old.items.filter((_,j)=>j!==ii);
 const candidates=modeled.filter(r=>eligible(r)&&!others.some(x=>x.id===r.id)&&r.id!==target.id
  &&(!target.base?(target.vegs.length? r.vegs.length>0:target.proteins.length?r.proteins.length>0:target.starch.length?r.starch.length>0:true):false));
 for(let attempt=0;attempt<50;attempt++){
  const r=pickWeighted(candidates,x=>20+seasonScore(x));if(!r)return;
  const next=[...old.items];next[ii]=r;
  const role=countCovered(next);
  if(role.veg&&role.protein&&role.starch){
   old.items=next;renderV2();return;
  }
 }
}
function regenerateOne(mi){
 const old=menus[mi];const preserved=old.items.filter((_,i)=>old.locked[i]);
 let next=null;
 for(let i=0;i<80;i++){
   const candidate=generate(preserved);
   if(candidate&&candidate.items.map(x=>x.id).join("|")!==old.items.map(x=>x.id).join("|")){next=candidate;break;}
 }
 if(next){ next.locked=next.items.map(x=>preserved.some(p=>p.id===x.id));menus[mi]=next;renderV2(); }
}
function mountNavigation(){
 if(!$2("#v2Nav")){
   const row=document.createElement("div");row.id="v2Nav";row.className="v2-nav";
   row.innerHTML='<button type="button" data-v2="ingredients">🌿 时令食材</button><button type="button" data-v2="planner">✦ 随机配餐</button><button type="button" data-v2="shopping">☷ 买菜清单</button>';
   $2(".toolbar").before(row);
 }
 $2("#v2Nav").querySelectorAll("button").forEach(x=>x.classList.toggle("on",x.dataset.v2===view));
}
const originalRender=render;
render=function(){
 originalRender();
 mountNavigation();
 renderV2();
};
document.addEventListener("click",e=>{
 if(e.target.closest("[data-page],[data-tag],[data-category]")){
  if(view){view=null;mountNavigation();}
 }
},true);
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-v2]");
 if(b){view=b.dataset.v2;foodQuery="";renderV2();window.scrollTo({top:0,behavior:"smooth"});return;}
 const m=e.target.closest("[data-v2-month]");
 if(m){month=Number(m.dataset.v2Month);renderV2();return;}
 const c=e.target.closest("[data-v2-cat]");
 if(c){selectedCategory=c.dataset.v2Cat;renderV2();return;}
 const i=e.target.closest("[data-v2-ingredient]");
 if(i){selectedCategory="全部";foodQuery=i.dataset.v2Ingredient;view="ingredients";renderV2();return;}
 const a=e.target.closest("[data-v2-action]");
 if(!a)return;
 const mi=Number(a.dataset.menu),ii=Number(a.dataset.item),action=a.dataset.v2Action;
 if(action==="generate")regenerate();
 if(action==="reroll")regenerateOne(mi);
 if(action==="swap")replaceItem(mi,ii);
 if(action==="lock"){menus[mi].locked[ii]=!menus[mi].locked[ii];renderV2();}
 if(action==="save"){savedMenus.unshift({date:new Date().toISOString(),names:menus[mi].items.map(x=>x.name),items:menus[mi].items.map(x=>({id:x.id,ingredients:x.refs.map(ref=>ref.name)}))});savedMenus=savedMenus.slice(0,30);storage.set("savedMenus",savedMenus);renderV2();}
 if(action==="shop"){addShopping(menus[mi]);view="shopping";renderV2();}
 if(action==="remove"){shopping.splice(ii,1);persistShopping();renderV2();}
 if(action==="clear"){shopping=[];persistShopping();renderV2();}
 if(action==="copy"){const value=shopping.map(x=>(x.done?"☑ ":"☐ ")+x.name).join("\n");navigator.clipboard?.writeText(value).then(()=>alert("已复制买菜清单")).catch(()=>prompt("复制买菜清单",value));}
 if(action==="saved"){const refs=(savedMenus[mi]?.items||[]).flatMap(x=>x.ingredients||[]);const existing=new Set(shopping.map(x=>x.name));for(const name of refs)if(!existing.has(name)){shopping.push({name,done:false});existing.add(name);}persistShopping();view="shopping";renderV2();}
 if(action==="detail"){const recipe=modeled.find(x=>x.id===ii);if(recipe)openDetail(recipe.id);}
});
document.addEventListener("change",e=>{
 const el=e.target;
 if(el.id==="v2People"){familyCount=Number(el.value);renderV2();}
 if(el.id==="v2Exclude"){excluded=new Set([...el.selectedOptions].map(x=>x.value));regenerate();}
 if(el.matches("[data-v2-check]")){shopping[Number(el.dataset.v2Check)].done=el.checked;persistShopping();}
});
document.addEventListener("input",e=>{
 if(e.target.id==="v2Search"){foodQuery=e.target.value;renderIngredients();}
});
function persistShopping(){storage.set("shopping",shopping);}
function addShopping(menu){
 const unique=new Set(shopping.map(x=>x.name));
 for(const r of menu.items)for(const item of r.refs){
   const n=item.name;if(n&&!unique.has(n)){shopping.push({name:n,done:false});unique.add(n);}
 }
 persistShopping();
}
function prep(){
 $2("#content").classList.add("v2-content");
 $2("#tagChips").style.display="none";$2("#chips").style.display="none";
 $2(".toolbar").style.display="none";
 $2("#count").textContent="";
 $2("#heading").textContent=view==="ingredients"?"时令食材":view==="planner"?"今天吃什么？":"买菜清单";
 mountNavigation();
}
function renderV2(){
 if(!view){$2(".toolbar").style.display="flex";$2("#content").classList.remove("v2-content");mountNavigation();return;}
 prep();
 if(view==="ingredients")renderIngredients();
 if(view==="planner")renderPlanner();
 if(view==="shopping")renderShopping();
}
function renderIngredients(){
 const list=[...ingredientMap.values()].filter(item=>(selectedCategory==="全部"||item.category===selectedCategory)&&(!foodQuery||item.name.includes(foodQuery)))
 .sort((a,b)=>Number(b.months.includes(month))-Number(a.months.includes(month))||a.name.localeCompare(b.name,"zh"));
 const categories=["全部",...new Set([...ingredientMap.values()].map(x=>x.category))];
 $2("#content").innerHTML='<div class="v2-intro">基于现有 '+modeled.length+' 道家常菜提取食材 · 浙江时令月份为近似参考，非市场供应保证。</div>'
 +'<div class="v2-controls"><label>月份 <select id="v2MonthSelect">'+Array.from({length:12},(_,i)=>'<option value="'+(i+1)+'" '+(month===i+1?"selected":"")+'>'+(i+1)+'月</option>').join("")+'</select></label><input id="v2Search" class="search" placeholder="搜索食材" value="'+esc(foodQuery)+'"></div>'
 +'<div class="v2-filters">'+categories.map(x=>'<button data-v2-cat="'+esc(x)+'" class="'+(x===selectedCategory?"on":"")+'">'+esc(x)+'</button>').join("")+'</div>'
 +'<div class="v2-grid">'+list.map(x=>'<article class="v2-tile"><div class="v2-line"><strong>'+esc(x.name)+'</strong><span class="'+(x.months.includes(month)?"v2-good":"v2-muted")+'">'+(x.months.includes(month)?"本月时令":x.months.length?"其他月份":"全年/待确认")+'</span></div><p>'+esc(x.category)+' · '+(x.months.length?x.months.join("、")+"月":"不限制时令")+'</p><button data-v2-ingredient="'+esc(x.name)+'" class="v2-link">'+x.recipeIds.size+' 道关联菜谱</button><div class="v2-related">'+[...x.recipeIds].map(id=>'<button data-v2-action="detail" data-item="'+id+'">'+esc(modeled[id].name)+'</button>').join("")+'</div></article>').join("")+'</div>'
 +(list.length?"":'<p class="empty">未找到对应食材</p>');
 $2("#v2MonthSelect").onchange=e=>{month=Number(e.target.value);renderIngredients();};
}
function renderPlanner(){
 $2("#content").innerHTML='<div class="v2-intro">每次为你准备 3 套不同菜单。每套确保包含蔬菜、蛋白质和主食；不计算未经核实的热量或克重。</div>'
 +'<div class="v2-controls"><label>月份 <select id="v2MonthSelect">'+Array.from({length:12},(_,i)=>'<option value="'+(i+1)+'" '+(month===i+1?"selected":"")+'>'+(i+1)+'月</option>').join("")+'</select></label><label>人数 <select id="v2People">'+[1,2,3,4,5,6].map(n=>'<option value="'+n+'" '+(n===familyCount?"selected":"")+'>'+n+' 人</option>').join("")+'</select></label><button data-v2-action="generate" class="v2-primary">✦ 随机推荐三套</button></div>'
 +'<div class="v2-intro">人数用于记录用餐场景；由于原菜谱尚无统一用量，暂不推算具体采购克数。</div>'
 +(menus.length?'<div class="v2-menu-grid">'+menus.map((menu,i)=>'<article class="v2-menu"><div class="v2-line"><h3>方案 '+(i+1)+'</h3><span class="v2-good">'+month+'月 · 时令优先</span></div>'+menu.items.map((r,j)=>'<div class="v2-menu-item"><div><strong>'+esc(r.name)+'</strong><small>'+esc(r.base?"基础主食":r.roles.join(" · ")||r.category||"家常菜")+'</small></div><div class="v2-item-actions"><button data-v2-action="lock" data-menu="'+i+'" data-item="'+j+'" title="锁定">'+(menu.locked[j]?"🔒":"♧")+'</button>'+(r.base?"":'<button data-v2-action="swap" data-menu="'+i+'" data-item="'+j+'" '+(menu.locked[j]?"disabled":"")+'>换菜</button>')+'</div></div>').join("")+'<div class="v2-menu-actions"><button data-v2-action="reroll" data-menu="'+i+'">换一套</button><button data-v2-action="save" data-menu="'+i+'">收藏套餐</button><button data-v2-action="shop" data-menu="'+i+'" class="v2-primary">生成买菜清单</button></div></article>').join(" ")+'</div>':'<div class="empty">当前条件下暂无符合全部营养角色的套餐，请调整条件。</div>')
 +'<div class="v2-saved"><h3>已保存的套餐</h3>'+(savedMenus.length?savedMenus.slice(0,5).map((s,i)=>'<div class="v2-line"><span>'+esc(s.names.join("、"))+'</span><button data-v2-action="saved" data-menu="'+i+'">加入清单</button></div>').join(""):"还没有收藏的套餐")+'</div>';
 $2("#v2MonthSelect").onchange=e=>{month=Number(e.target.value);regenerate();};
}
function renderShopping(){
 $2("#content").innerHTML='<div class="v2-intro">从配餐方案自动合并同名食材，可勾选、复制；没有统一克重的菜谱不生成虚假的采购数量。</div><div class="v2-shop-actions"><button data-v2-action="copy" class="v2-primary">复制清单</button><button data-v2-action="clear">清空</button></div>'
 +(shopping.length?'<div class="v2-shopping">'+shopping.map((x,i)=>'<div class="v2-shop-row"><label><input type="checkbox" data-v2-check="'+i+'" '+(x.done?"checked":"")+'> <span>'+esc(x.name)+'</span></label><button data-v2-action="remove" data-item="'+i+'" aria-label="删除">×</button></div>').join("")+'</div>':'<p class="empty">还没有食材，先去随机配餐生成一份吧。</p>');
}
document.addEventListener("click",e=>{
 const x=e.target.closest("#v2Nav button");if(x){$2(".toolbar").style.display="none";}
});
mountNavigation();
regenerate();
window.CookbookV2={parseIngredients,classify,ingredientMap,generate,countCovered,modeled};
})();