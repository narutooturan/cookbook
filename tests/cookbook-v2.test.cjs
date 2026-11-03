// 运行：node --test tests/cookbook-v2.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const source = fs.readFileSync(path.join(root,'cookbook-v2.js'),'utf8');
const dataMatch=html.match(/const DATA=(\{.*?\});const recipes=/s);
assert.ok(dataMatch,'Original recipe data should exist');
const original=JSON.parse(dataMatch[1]);
const recipes=original.recipes.map((r,id)=>({...r,id}));
const definitions=source.slice(source.indexOf('const SEASONS ='),source.indexOf('let view='));
const generator=source.slice(source.indexOf('function seasonScore'),source.indexOf('function regenerate()'));
const make = new Function('recipes',definitions+'let month=11;let excluded=new Set();let ownedIngredients=new Set();let ownedOnly=false;\n'+generator+'\nreturn {parseIngredients,classify,modeled,ingredientMap,generate,countCovered,SEAFOOD_TIMING,recipeInventoryCoverage,ingredientCategory};');
const api=make(recipes);
test('保留完整的 174 道菜谱与步骤',()=>{
 assert.equal(recipes.length,174);
 assert.ok(recipes.some(r=>r.steps));
 assert.ok(html.includes('src="cookbook-v2.js'));
 assert.ok(html.includes('href="cookbook-v2.css'));
});
test('食材别名与数量标准化',()=>{
 assert.deepEqual(api.parseIngredients('白萝卜1小根、猪肉300g').map(x=>x.name),['白萝卜','猪肉']);
 assert.deepEqual(api.parseIngredients('冬笋/春笋')[0].choices,['冬笋','春笋']);
 assert.deepEqual(api.parseIngredients('青菜/生菜')[0].choices,['青菜','生菜']);
});
test('复合菜提供正确的营养角色',()=>{
 assert.ok(api.classify(recipes.find(r=>r.name==='黄瓜炒蛋')).roles.includes('蔬菜'));
 assert.ok(api.classify(recipes.find(r=>r.name==='黄瓜炒蛋')).roles.includes('蛋白质'));
 assert.ok(!api.classify(recipes.find(r=>r.name==='红烧芋艿')).roles.includes('蔬菜'));
 assert.ok(api.classify(recipes.find(r=>r.name==='意面牛排西兰花')).roles.includes('主食'));
});
test('浙江 11 月应季信息与菜谱关联',()=>{
 const item=api.ingredientMap.get('白萝卜');
 assert.ok(item.months.includes(11));
 assert.ok(item.recipeIds.size>0);
 assert.ok(api.ingredientMap.size>=80);
});
test('300次随机配餐均满足三种营养角色与菜品去重',()=>{
 for(let i=0;i<300;i++){
  const menu=api.generate();
  assert.ok(menu,'should generate menu '+i);
  const roles=api.countCovered(menu.items);
  assert.ok(roles.protein&&roles.veg&&roles.starch,'nutrient coverage '+i);
  assert.equal(new Set(menu.items.map(x=>x.id)).size,menu.items.length);
  assert.ok(menu.items.every(x=>!x.condiment));
 }
});
test('购物清单和套餐存储功能已集成',()=>{
 assert.ok(source.includes('function addShopping'));
 assert.ok(source.includes('persistShopping'));
 assert.ok(source.includes('savedMenus'));
 assert.ok(source.includes('data-v2-action="lock"'));
 assert.ok(source.includes('data-v2-action="swap"'));
});

test('排除筛选采用可取消的独立标签，并支持一键清除',()=>{
 assert.ok(source.includes('data-v2-exclude='));
 assert.ok(source.includes('data-v2-clear-exclusions'));
 assert.ok(source.includes('excluded.has(group))excluded.delete(group)'));
 assert.ok(source.includes('excluded.clear()'));
 assert.ok(source.includes('aria-pressed='));
 assert.ok(!source.includes('id="v2Exclude" multiple'));
});
test('排除食材类别时配餐算法不会选用所排除的食材',()=>{
 const forbidden=new Function('recipes',definitions+'let month=11;let excluded=new Set(["水产"]);let ownedIngredients=new Set();let ownedOnly=false;\n'+generator+'\nreturn {generate,modeled,ingredientCategory};')(recipes);
 for(let n=0;n<100;n++){
  const menu=forbidden.generate();
  assert.ok(menu);
  assert.ok(menu.items.every(r=>r.base || !r.refs.some(x=>x.choices.some(choice=>forbidden.ingredientCategory(choice)==='水产'))));
 }
});

test('已有食材优先及严格库存模式',()=>{
 const makeOwned=new Function('recipes','inventory','strict',definitions+'let month=11;let excluded=new Set();let ownedIngredients=new Set(inventory);let ownedOnly=strict;\n'+generator+'\nreturn {generate,recipeInventoryCoverage,countCovered};');
 const owned=['青菜','豆腐','鸡肉','大米','菌菇','白萝卜','牛肉','面条','番茄','鸡蛋','黄瓜'];
 const strict=makeOwned(recipes,owned,true);
 for(let i=0;i<80;i++){
  const menu=strict.generate();
  if(!menu)continue;
  const roles=strict.countCovered(menu.items);
  assert.ok(roles.veg&&roles.protein&&roles.starch);
  assert.ok(menu.items.every(item=>strict.recipeInventoryCoverage(item,new Set(owned)).missing.length===0));
 }
 const soft=makeOwned(recipes,['大米','白萝卜','鸡蛋'],false);
 assert.ok(soft.generate());
});
test('浙江海鲜赏味期保留独立物种名称，不将带鱼等归并为鱼',()=>{
 assert.ok(api.ingredientMap.has('带鱼'));
 assert.ok(api.ingredientMap.has('鲳鱼'));
 assert.ok(api.ingredientMap.has('黄鱼'));
 assert.deepEqual(api.SEAFOOD_TIMING['带鱼'].peak,[12,1]);
 assert.deepEqual(api.SEAFOOD_TIMING['大闸蟹'].peak,[10,11]);
});
test('库存输入、移除、严格模式与购物清单去重的 UI 已接入',()=>{
 for(const s of ['v2PantryInput','data-v2-pantry-suggestion','data-v2-pantry-item','data-v2-pantry-mode','ownedOnly','ownedIngredients','recipeInventoryCoverage'])assert.ok(source.includes(s));
});
