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
const make = new Function('recipes',definitions+'let month=11;let excluded=new Set();\n'+generator+'\nreturn {parseIngredients,classify,modeled,ingredientMap,generate,countCovered};');
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
