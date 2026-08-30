const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const htmlSource = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function functionBlock(source, name, nextName) {
  const start = source.indexOf(`function ${name}`);
  const end = source.indexOf(`function ${nextName}`, start + 1);
  return source.slice(start, end > start ? end : undefined);
}

function sourceBetween(start, end) {
  const startIndex = appSource.indexOf(start);
  const endIndex = appSource.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return appSource.slice(startIndex, endIndex);
}

test('pet home renders purchases only for the active pet exclusive equipment', () => {
  assert.match(appSource, /function renderPetExclusiveShop\(student\)/);
  assert.match(appSource, /renderPetExclusiveShop\(student\);/);
  assert.match(htmlSource, /id="owned-equipment-panel"/);
  assert.match(htmlSource, /owned-equipment-panel-compact/);
  assert.doesNotMatch(htmlSource, /MY EQUIPMENT/);
  assert.match(htmlSource, />我的装备</);
  const homeShop = functionBlock(appSource, 'renderPetExclusiveShop', 'renderOwnedEquipment');
  assert.match(homeShop, /getExclusiveItemsForPet\(student\.petType\)/);
  assert.match(homeShop, /getVisibleExclusiveItemsForPet\(student, student\.petType, exclusiveItems\)/);
  assert.match(homeShop, /getLockedExclusiveItemsForPet\(student, student\.petType, exclusiveItems\)/);
  assert.match(homeShop, /data-buy-item/);
});

test('equipped gear is locked instead of removable from the pet page', () => {
  const grid = functionBlock(appSource, 'renderEquipmentGrid', 'getExclusiveSetProgress');
  const owned = functionBlock(appSource, 'renderOwnedEquipment', 'renderEquipmentSlot');
  const homeShop = functionBlock(appSource, 'renderPetExclusiveShop', 'renderOwnedEquipment');
  const equipmentSlotClick = sourceBetween("const equipmentSlot = event.target.closest('[data-equipment-slot]')", "const shopCard = event.target.closest('[data-shop-item-card]')");
  assert.match(grid, /equipped-locked/);
  assert.match(grid, /slot-action locked/);
  assert.doesNotMatch(grid, /data-unequip-item/);
  assert.doesNotMatch(owned, /data-unequip-item/);
  assert.doesNotMatch(homeShop, /data-unequip-item/);
  assert.match(owned, /equipped-lock-badge/);
  assert.match(homeShop, /equipped-lock-badge/);
  assert.match(equipmentSlotClick, /showToast\(localize\('为了保护进化进度，已装备的物品不能卸下。'\)\)/);
  assert.doesNotMatch(equipmentSlotClick, /unequipItem\(item\.id\)/);
});

test('pet shop is series-based and keeps gear purchases on the pet home', () => {
  const shop = functionBlock(appSource, 'renderShop', 'getStatLabel');
  const petShop = functionBlock(appSource, 'renderPetShop', 'messageWallUsesGas');
  assert.doesNotMatch(shop, /data-buy-item/);
  assert.match(petShop, /PET_SERIES_GROUPS/);
  assert.match(petShop, /data-pet-series/);
  assert.match(petShop, /pet-shop-gear-panel/);
  assert.match(petShop, /回到宠物主页购买/);
});

test('buyAndEquipItem rejects general and other-pet equipment', () => {
  const buyAndEquipItem = functionBlock(appSource, 'buyAndEquipItem', 'buyPet');
  assert.match(buyAndEquipItem, /!item\.exclusivePetId/);
  assert.match(buyAndEquipItem, /item\.exclusivePetId !== student\.petType/);
  assert.match(buyAndEquipItem, /isExclusiveItemUnlockedForStudent\(student, item\)/);
});

test('buyAndEquipItem purchases and equips current pet gear with one save', () => {
  const buyAndEquipItem = functionBlock(appSource, 'buyAndEquipItem', 'buyPet');
  assert.match(buyAndEquipItem, /record\.ownedItems = \[/);
  assert.match(buyAndEquipItem, /student\.equippedItems\[item\.slot\] = itemId/);
  assert.match(buyAndEquipItem, /syncActivePetRecord\(student\);[\s\S]*commitStudentState/);
  assert.match(buyAndEquipItem, /type: 'purchaseAndEquipItem'/);
});

test('empty home equipment slots equip an owned matching item instead of jumping to shop', () => {
  assert.match(appSource, /function getBestOwnedEquipmentForSlot\(student, slot\)/);
  assert.match(appSource, /async function equipFirstOwnedItemForSlot\(slot\)/);
  const equipmentSlotClick = sourceBetween("const equipmentSlot = event.target.closest('[data-equipment-slot]')", "const shopCard = event.target.closest('[data-shop-item-card]')");
  assert.match(equipmentSlotClick, /await runEquipmentAction\(equipmentSlot, \(\) => equipFirstOwnedItemForSlot\(slot\)\)/);
  assert.doesNotMatch(equipmentSlotClick, /switchView\('shop-view'\)/);
  assert.match(functionBlock(appSource, 'renderEquipmentGrid', 'getExclusiveSetProgress'), /Click to equip owned/);
});

test('equipment actions are guarded against rapid repeated taps', () => {
  assert.match(appSource, /let equipmentActionLocked = false;/);
  assert.match(appSource, /async function runEquipmentAction\(button, task, label = '保存中'\)/);
  const clickHandler = sourceBetween("const buyButton = event.target.closest('[data-buy-item]')", "const buyPetButton = event.target.closest('[data-buy-pet]')");
  assert.match(clickHandler, /runEquipmentAction\(buyButton, \(\) => buyAndEquipItem/);
});
