#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE_URL = process.env.CY_PETS_DEMO_URL || 'http://localhost:4173/';
const STUDENT_ID = process.env.CY_PETS_DEMO_ID || 'CY9001';
const OUT_DIR = path.resolve(__dirname, '..', 'tmp', 'demo-recordings');

const VIEWPORT = { width: 1440, height: 900 };
const RECORD_SIZE = { width: 1440, height: 900 };

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function logStep(message) {
  console.log(`[demo] ${new Date().toISOString()} ${message}`);
}

async function visible(locator, timeout = 1200) {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

async function injectDemoUi(page) {
  await page.addStyleTag({
    content: `
      #codex-demo-cursor {
        position: fixed;
        width: 28px;
        height: 28px;
        border: 4px solid rgba(99, 92, 238, .95);
        border-radius: 50%;
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 0 8px rgba(73, 190, 167, .18), 0 10px 28px rgba(40, 35, 71, .22);
        transition: left .38s ease, top .38s ease, transform .16s ease;
      }
      #codex-demo-cursor.clicking {
        transform: translate(-50%, -50%) scale(.72);
        box-shadow: 0 0 0 14px rgba(73, 190, 167, .22), 0 10px 28px rgba(40, 35, 71, .22);
      }
      #codex-demo-caption {
        position: fixed;
        left: 34px;
        top: 28px;
        max-width: min(720px, calc(100vw - 68px));
        z-index: 2147483646;
        padding: 16px 22px;
        border-radius: 22px;
        background: rgba(255, 255, 255, .92);
        border: 1px solid rgba(99, 92, 238, .22);
        color: #282347;
        box-shadow: 0 18px 46px rgba(40, 35, 71, .18);
        font: 900 24px/1.28 "Avenir Next", "PingFang SC", system-ui, sans-serif;
        letter-spacing: 0;
        opacity: 0;
        transform: translateY(-8px);
        transition: opacity .32s ease, transform .32s ease;
        pointer-events: none;
      }
      #codex-demo-caption.show {
        opacity: 1;
        transform: translateY(0);
      }
      #codex-demo-caption small {
        display: block;
        margin-top: 6px;
        color: #6f6a91;
        font-size: 15px;
        font-weight: 800;
      }
    `
  });
  await page.evaluate(() => {
    if (!document.getElementById('codex-demo-cursor')) {
      const cursor = document.createElement('div');
      cursor.id = 'codex-demo-cursor';
      cursor.style.left = '72px';
      cursor.style.top = '72px';
      document.body.appendChild(cursor);
    }
    if (!document.getElementById('codex-demo-caption')) {
      const caption = document.createElement('div');
      caption.id = 'codex-demo-caption';
      document.body.appendChild(caption);
    }
  });
}

async function caption(page, title, detail = '', hold = 1100) {
  await page.evaluate(({ title, detail }) => {
    const node = document.getElementById('codex-demo-caption');
    if (!node) return;
    node.innerHTML = `${title}${detail ? `<small>${detail}</small>` : ''}`;
    node.classList.add('show');
  }, { title, detail });
  if (hold) await wait(hold);
}

async function hideCaption(page) {
  await page.evaluate(() => document.getElementById('codex-demo-caption')?.classList.remove('show'));
}

async function moveCursorTo(page, locator) {
  const box = await locator.boundingBox();
  if (!box) return null;
  const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await page.evaluate(({ x, y }) => {
    const cursor = document.getElementById('codex-demo-cursor');
    if (!cursor) return;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  }, point);
  await page.mouse.move(point.x, point.y, { steps: 16 });
  await wait(280);
  return point;
}

async function safeScrollIntoView(locator) {
  await locator.waitFor({ state: 'visible', timeout: 15000 });
  await locator.evaluate(element => {
    element.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
  }).catch(async () => {
    await locator.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
  });
  await wait(220);
}

async function humanClick(page, locator, pause = 900) {
  await locator.waitFor({ state: 'visible', timeout: 15000 });
  await safeScrollIntoView(locator);
  await moveCursorTo(page, locator);
  await page.evaluate(() => document.getElementById('codex-demo-cursor')?.classList.add('clicking'));
  await locator.click({ timeout: 7000 }).catch(async () => {
    await locator.click({ force: true, timeout: 5000 }).catch(async () => {
      await locator.evaluate(element => element.click()).catch(() => {});
    });
  });
  await wait(140);
  await page.evaluate(() => document.getElementById('codex-demo-cursor')?.classList.remove('clicking'));
  if (pause) await wait(pause);
}

async function humanDomClick(page, locator, pause = 900) {
  await locator.waitFor({ state: 'visible', timeout: 15000 });
  await safeScrollIntoView(locator);
  await moveCursorTo(page, locator);
  await page.evaluate(() => document.getElementById('codex-demo-cursor')?.classList.add('clicking'));
  await locator.evaluate(element => element.click());
  await wait(140);
  await page.evaluate(() => document.getElementById('codex-demo-cursor')?.classList.remove('clicking'));
  if (pause) await wait(pause);
}

async function humanFill(page, locator, text, pause = 500) {
  await locator.waitFor({ state: 'visible', timeout: 15000 });
  await safeScrollIntoView(locator);
  await moveCursorTo(page, locator);
  await locator.fill('');
  await locator.pressSequentially(text, { delay: 42 });
  if (pause) await wait(pause);
}

async function closeOptionalModal(page, selector = '[data-modal-close="gift-claim"]', pause = 600) {
  const close = page.locator(selector).first();
  if (await visible(close, 1500)) {
    await safeScrollIntoView(close).catch(() => {});
    await moveCursorTo(page, close).catch(() => null);
    await page.evaluate(() => document.getElementById('codex-demo-cursor')?.classList.add('clicking'));
    await close.click({ force: true, timeout: 5000 }).catch(async () => {});
    await wait(140);
    await page.evaluate(() => document.getElementById('codex-demo-cursor')?.classList.remove('clicking'));
    if (pause) await wait(pause);
  }
}

async function dismissGiftClaimModal(page, pause = 650) {
  const overlay = page.locator('#gift-claim-overlay:not(.hidden)');
  if (!(await visible(overlay, 1800))) return;
  const close = page.locator('#gift-claim-overlay [data-modal-close="gift-claim"]').first();
  await closeOptionalModal(page, '#gift-claim-overlay [data-modal-close="gift-claim"]', 220);
  const hidden = await page.waitForFunction(() => {
    const modal = document.querySelector('#gift-claim-overlay');
    return !modal || modal.classList.contains('hidden');
  }, null, { timeout: 1200 }).then(() => true).catch(() => false);
  if (!hidden) {
    await page.evaluate(() => {
      document.querySelectorAll('#gift-claim-overlay').forEach(modal => modal.classList.add('hidden'));
      document.querySelectorAll('#gift-claim-overlay button').forEach(button => { button.blur(); });
    });
  }
  if (await visible(close, 200)) await page.keyboard.press('Escape').catch(() => {});
  if (pause) await wait(pause);
}

async function dismissEvolutionOverlay(page, pause = 900) {
  const overlay = page.locator('#evolution-overlay:not(.hidden)');
  if (!(await visible(overlay, 3500))) return;
  await page.evaluate(() => {
    document
      .querySelectorAll('#evolution-overlay [data-modal-close="evolution"]')
      .forEach(button => button.click());
  }).catch(() => {});
  const hidden = await page.waitForFunction(() => {
    const modal = document.querySelector('#evolution-overlay');
    return !modal || modal.classList.contains('hidden');
  }, null, { timeout: 1800 }).then(() => true).catch(() => false);
  if (!hidden) {
    await page.evaluate(() => {
      const modal = document.querySelector('#evolution-overlay');
      const video = document.querySelector('#evolution-video');
      if (video) video.pause();
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('evolution-playing', 'evolution-cinematic-running', 'evolution-cinematic-finished');
      }
    });
  }
  if (pause) await wait(pause);
}

async function reloadHome(page, hold = 1300) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await injectDemoUi(page);
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  if (await visible(page.locator('#student-id'), 1800)) {
    await humanFill(page, page.locator('#student-id'), STUDENT_ID, 250);
    await humanClick(page, page.locator('#login-form button[type="submit"]'), 900);
  }
  await page.locator('[data-view="home-view"]').first().waitFor({ state: 'visible', timeout: 30000 });
  await wait(hold);
}

async function waitForFinalEvolutionButton(page) {
  const button = page.locator('[data-evolve-pet]').first();
  if (await visible(button, 5000)) return;
  await caption(page, '回到主页确认进化条件', '装备状态已经同步，现在继续最终进化。', 900);
  await reloadHome(page, 1000);
  await safeScrollIntoView(page.locator('[data-onboarding-target="role-card"]').first());
  await button.waitFor({ state: 'visible', timeout: 15000 });
}

async function waitGuideTypingStable(page) {
  const copy = page.locator('#new-player-guide-copy');
  let previous = '';
  let stableCount = 0;
  for (let i = 0; i < 120; i += 1) {
    const current = await copy.textContent().catch(() => '');
    if (current && current === previous) stableCount += 1;
    else stableCount = 0;
    previous = current || '';
    if (current && stableCount >= 4) return;
    await wait(120);
  }
}

async function finishGuide(page) {
  logStep('guide start');
  const overlay = page.locator('#new-player-guide-overlay:not(.hidden)');
  if (!(await visible(overlay, 8000))) return;
  await caption(page, '开发者带你走一遍新手指引', '每一步都会聚焦对应功能，其他地方先安静下来。', 1400);
  const next = page.locator('[data-new-player-guide-next]');
  for (let step = 0; step < 14; step += 1) {
    await waitGuideTypingStable(page);
    await wait(700);
    const buttonText = (await next.textContent().catch(() => '')).trim();
    await humanClick(page, next, buttonText.includes('完成') ? 1600 : 950);
    if (!(await visible(overlay, 900))) break;
  }
  await hideCaption(page);
  logStep('guide complete');
}

async function sampleReactionChallenge(page, hitCount = 3) {
  const action = page.locator('[data-mini-game-action]').first();
  await action.waitFor({ state: 'visible', timeout: 15000 });
  let hits = 0;
  const startedAt = Date.now();
  while (hits < hitCount && Date.now() - startedAt < 30000) {
    const sawHitZone = await page.evaluate(() => {
      const canvas = document.querySelector('#mini-game-canvas:not([hidden]), [data-mini-game-canvas]:not([hidden])');
      if (!canvas) return false;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return false;
      const normalizeAngle = angle => ((angle % 360) + 360) % 360;
      const angularDistance = (first, second) => {
        const diff = Math.abs(normalizeAngle(first) - normalizeAngle(second));
        return Math.min(diff, 360 - diff);
      };
      const meanAngle = values => {
        if (!values.length) return null;
        const vector = values.reduce((sum, angle) => {
          const radians = angle * Math.PI / 180;
          sum.x += Math.cos(radians);
          sum.y += Math.sin(radians);
          return sum;
        }, { x: 0, y: 0 });
        return normalizeAngle(Math.atan2(vector.y, vector.x) * 180 / Math.PI);
      };
      const logicalWidth = Number(canvas.dataset.logicalWidth || canvas.getAttribute('width') || 900) || 900;
      const logicalHeight = Number(canvas.dataset.logicalHeight || canvas.getAttribute('height') || 540) || 540;
      const scaleX = canvas.width / logicalWidth;
      const scaleY = canvas.height / logicalHeight;
      const cx = 450 * scaleX;
      const cy = 282 * scaleY;
      const targetAngles = [];
      const pointerAngles = [];
      let yellow = 0;
      for (let deg = 0; deg < 360; deg += 2) {
        const angle = deg * Math.PI / 180;
        for (let radius = 142; radius <= 176; radius += 6) {
          const x = Math.round(cx + Math.cos(angle) * radius * scaleX);
          const y = Math.round(cy + Math.sin(angle) * radius * scaleY);
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          const isYellow = pixel[0] > 190 && pixel[1] > 145 && pixel[2] < 165 && pixel[3] > 120;
          const isGreen = pixel[0] < 145 && pixel[1] > 130 && pixel[2] > 95 && pixel[3] > 120;
          const isPointer = pixel[0] > 180 && pixel[1] < 135 && pixel[2] > 80 && pixel[2] < 190 && pixel[3] > 120;
          if (isYellow) yellow += 1;
          if (isYellow || isGreen) targetAngles.push(deg);
          if (isPointer) pointerAngles.push(deg);
        }
      }
      if (yellow > 10) return true;
      const targetAngle = meanAngle(targetAngles);
      const pointerAngle = meanAngle(pointerAngles);
      if (targetAngle === null || pointerAngle === null) return false;
      const targetHalfWidth = Math.max(14, targetAngles.length / 12 + 5);
      return angularDistance(targetAngle, pointerAngle) <= targetHalfWidth;
    });
    if (sawHitZone) {
      await action.evaluate(element => element.click()).catch(async () => {
        await action.click({ force: true, timeout: 2500 }).catch(() => {});
      });
      hits += 1;
      logStep(`reaction hit ${hits}/${hitCount}`);
      await wait(520);
    } else {
      await wait(28);
    }
  }
  if (hits < hitCount) {
    const status = await page.locator('#mini-game-status, [data-mini-game-status]').first().textContent().catch(() => '');
    throw new Error(`Reaction challenge timed out after ${hits}/${hitCount} hits. Status: ${status}`);
  }
}

async function passVisibleReactionChallenge(page) {
  const status = page.locator('#mini-game-overlay:not(.hidden), #mini-game-embedded-page');
  await status.waitFor({ state: 'visible', timeout: 15000 });
  for (let loops = 0; loops < 2; loops += 1) {
    const text = await page.locator('#mini-game-status, [data-mini-game-status]').first().textContent().catch(() => '');
    const match = String(text || '').match(/成功\s*(\d+)\s*次|(\d+)\s*\/\s*(\d+)/);
    const required = match?.[1] ? Number(match[1]) : match?.[3] ? Number(match[3]) : 6;
    await sampleReactionChallenge(page, Math.max(1, required));
    await wait(1600);
    const overlayHidden = !(await visible(page.locator('#mini-game-overlay:not(.hidden)'), 800));
    if (overlayHidden) return;
  }
}

async function buyVisibleExclusiveItems(page, count) {
  for (let i = 0; i < count; i += 1) {
    const buyButtons = page.locator('#pet-exclusive-shop-grid [data-buy-item]:not([disabled])');
    await buyButtons.first().waitFor({ state: 'visible', timeout: 15000 });
    const itemId = await buyButtons.first().getAttribute('data-buy-item');
    await humanClick(page, buyButtons.first(), 1200);
    await dismissGiftClaimModal(page, 700);
    if (itemId) {
      await page.waitForFunction(id => {
        const app = window.__holidayCheckinApp?.getState?.();
        const student = app?.database?.students?.[app?.session?.studentId];
        const record = student?.petCollection?.[student?.petType];
        return Array.isArray(record?.ownedItems) && record.ownedItems.includes(id);
      }, itemId, { timeout: 5000 }).catch(() => {});
    }
    await wait(650);
  }
}

async function shareRoleCardPreview(page) {
  const share = page.locator('[data-role-card-share]').first();
  if (!(await visible(share, 3000))) return;
  await caption(page, '角色卡也可以分享', '这里会生成适合社交平台的卡片。', 900);
  await humanClick(page, share, 2200);
  await closeOptionalModal(page, '[data-image-viewer-close], [data-modal-close="image-viewer"]', 500);
}

async function loginAndChooseStarter(page) {
  logStep('login start');
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await injectDemoUi(page);
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await caption(page, '欢迎来到 CY PETS STORY', '这次我用开发者视角，完整带玩家走一遍。', 1500);
  await humanFill(page, page.locator('#student-id'), STUDENT_ID, 550);
  await humanClick(page, page.locator('#login-form button[type="submit"]'), 1500);

  const petModal = page.locator('#pet-selection-modal:not(.hidden)');
  await petModal.waitFor({ state: 'visible', timeout: 35000 });
  await caption(page, '第一步：选择你的第一只宠物', '选伙伴、取名字、生日和未来进化路线。', 1300);
  await humanClick(page, page.locator('[data-initial-pet="sunny-wing"]'), 600);
  await humanClick(page, page.locator('[data-initial-evolution-style="heroic"]'), 500);
  await humanFill(page, page.locator('#pet-name-input'), '开发小太阳', 500);
  await page.locator('#pet-birthday-input').fill('2026-08-24');
  await wait(650);
  await humanClick(page, page.locator('#confirm-initial-pet'), 1600);
  logStep('starter adopted');
}

async function evolveStarter(page) {
  logStep('starter evolution tour start');
  await page.locator('[data-view="home-view"]').first().waitFor({ state: 'visible', timeout: 10000 });
  await caption(page, '主页：查看角色卡、技能和装备', '接下来真实购买装备，并触发进化。', 1400);
  await safeScrollIntoView(page.locator('[data-onboarding-target="role-card"]').first());
  await wait(1100);
  await shareRoleCardPreview(page);

  await caption(page, '购买专属装备', '前半套买齐后，小进化就会开放。', 1100);
  await safeScrollIntoView(page.locator('#pet-exclusive-shop-panel').first());
  await wait(700);
  await buyVisibleExclusiveItems(page, 2);
  logStep('mini gear purchased');

  await caption(page, '小进化挑战', '命中轮盘后，伙伴会进入小进化形态。', 1100);
  await safeScrollIntoView(page.locator('[data-mini-evolve-pet]').first());
  await humanDomClick(page, page.locator('[data-mini-evolve-pet]').first(), 900);
  await passVisibleReactionChallenge(page);
  logStep('mini evolution challenge passed');
  await wait(2600);
  await dismissEvolutionOverlay(page, 900);
  await caption(page, '小进化完成，回主页继续', '现在后半套终极装备会开放出来。', 1100);
  await reloadHome(page, 1200);

  await caption(page, '继续收集终极装备', '小进化后，下半套装备会开放。', 1100);
  await safeScrollIntoView(page.locator('#pet-exclusive-shop-panel').first());
  await buyVisibleExclusiveItems(page, 2);
  logStep('final gear purchased');

  await caption(page, '最终进化', '选择帅气路线，然后再次完成进化挑战。', 1200);
  await waitForFinalEvolutionButton(page);
  await safeScrollIntoView(page.locator('[data-evolve-pet]').first());
  await humanDomClick(page, page.locator('[data-evolve-pet]').first(), 900);
  await humanDomClick(page, page.locator('[data-evolution-style="heroic"]').first(), 900);
  await passVisibleReactionChallenge(page);
  logStep('final evolution challenge passed');
  await wait(3500);
  await dismissEvolutionOverlay(page, 900);
  await safeScrollIntoView(page.locator('[data-onboarding-target="role-card"]').first());
  await wait(1800);
  logStep('starter evolution tour complete');
}

async function buySecondPetAndSwitch(page) {
  logStep('buy second pet start');
  await caption(page, '去宠物商店认识第二位伙伴', '玩家可以继续购买新的角色，每只宠物独立取名和培养。', 1300);
  await humanClick(page, page.locator('[data-view="shop-view"]').first(), 1000);
  await page.locator('[data-onboarding-target="pet-shop"]').waitFor({ state: 'visible', timeout: 12000 });
  const sanrioButton = page.locator('[data-pet-series="sanrio"]').first();
  if (await visible(sanrioButton, 2500)) await humanClick(page, sanrioButton, 700);
  await safeScrollIntoView(page.locator('[data-buy-pet="kuromi"]').first());
  await humanClick(page, page.locator('[data-buy-pet="kuromi"]').first(), 900);
  await humanFill(page, page.locator('#pet-name-input'), '开发库洛米', 450);
  await page.locator('#pet-birthday-input').fill('2026-08-25');
  await wait(500);
  await humanClick(page, page.locator('#confirm-initial-pet'), 1500);

  await caption(page, '回主页切换已购买宠物', '这一步让观众看见：买到的新伙伴真的进入收藏。', 1200);
  await humanClick(page, page.locator('[data-view="home-view"]').first(), 900);
  await safeScrollIntoView(page.locator('[data-pet-collection-toggle]').first());
  const toggle = page.locator('[data-pet-collection-toggle]').first();
  if ((await toggle.getAttribute('aria-expanded').catch(() => 'false')) !== 'true') {
    await humanClick(page, toggle, 700);
  }
  await humanClick(page, page.locator('[data-switch-pet="kuromi"]').first(), 1500);
  logStep('second pet purchased and switched');
}

async function visitRoomAndMiniGames(page) {
  logStep('interaction tour start');
  await caption(page, '互动区：带宠物进入世界', '这里可以进房间、遇到朋友、发文字和表情。', 1300);
  await humanClick(page, page.locator('[data-view="guide-view"]').first(), 1000);
  const joinCard = page.locator('[data-interaction-lobby-mode="join"]').first();
  if (await visible(joinCard, 5000)) {
    await humanClick(page, joinCard, 900);
    const join = page.locator('[data-interaction-room-join]').first();
    if (await visible(join, 8000)) await humanClick(page, join, 2600);
  }

  const chatToggle = page.locator('#kuromi-room-chat-toggle');
  if (await visible(chatToggle, 5000)) {
    await caption(page, '房间里也能说话和发表情', '简单互动就会让这个世界活起来。', 1000);
    await humanClick(page, chatToggle, 650);
    const emoji = page.locator('#kuromi-room-emoji-dock button, [data-kuromi-emoji]').first();
    if (await visible(emoji, 1500)) await humanClick(page, emoji, 600);
    const input = page.locator('#kuromi-room-chat-panel input[name="kuromiMessage"]').first();
    if (await visible(input, 1500)) {
      await humanFill(page, input, '大家好，我来试玩啦！', 200);
      await page.keyboard.press('Enter');
      await wait(1400);
    }
  }

  await page.keyboard.down('ArrowRight');
  await wait(1150);
  await page.keyboard.up('ArrowRight');
  await page.keyboard.press('ArrowUp');
  await wait(1200);

  await caption(page, '迷你游戏：用当前宠物出场', '角色会换成玩家现在带着的宠物。', 1000);
  const leaveButton = page.locator('[data-interaction-room-leave], [data-kuromi-room-leave]').first();
  if (await visible(leaveButton, 1200)) await humanClick(page, leaveButton, 700);
  const backToInteractionMenu = page.locator('[data-interaction-lobby-mode="menu"]').first();
  if (await visible(backToInteractionMenu, 3000)) {
    await humanClick(page, backToInteractionMenu, 800);
  }
  const miniGameButton = page.locator('[data-mini-game-open]').first();
  await miniGameButton.waitFor({ state: 'visible', timeout: 10000 });
  await humanClick(page, miniGameButton, 900);
  await humanClick(page, page.locator('[data-mini-game-start="jumpCharge"]').first(), 1200);
  const canvas = page.locator('[data-mini-game-canvas], #mini-game-canvas').first();
  if (await visible(canvas, 3000)) {
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.34, box.y + box.height * 0.56, { steps: 14 });
      await page.mouse.down();
      await wait(680);
      await page.mouse.up();
      await wait(2600);
    }
  }
  await closeOptionalModal(page, '[data-mini-game-close]', 900);
  logStep('interaction tour complete');
}

async function shareMusicAndConfirmWall(page) {
  logStep('music and wall tour start');
  await caption(page, '音乐盒：选择歌曲，也能分享到留言墙', '这里演示用 The Avengers。', 1300);
  await humanClick(page, page.locator('[data-view="music-box-view"]').first(), 1000);
  await page.locator('#music-box-grid').waitFor({ state: 'visible', timeout: 12000 });
  const marvelShare = page.locator('[data-music-wall-share="marvel-the-avengers"]').first();
  await safeScrollIntoView(marvelShare);
  await humanClick(page, marvelShare, 1700);

  await caption(page, '留言墙：确认自己的分享真的出现', '玩家分享出去的角色和音乐，会在这里被同学看见。', 1300);
  await humanClick(page, page.locator('[data-view="wall-view"]').first(), 1500);
  await page.locator('#message-wall-list').waitFor({ state: 'visible', timeout: 15000 });
  await wait(2500);

  await caption(page, '好友页面：查看朋友与房间状态', '最后快速看一下社交功能。', 1200);
  await humanClick(page, page.locator('[data-view="friends-view"]').first(), 1600);
  await wait(2200);
  logStep('music and wall tour complete');
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required']
  });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: OUT_DIR, size: RECORD_SIZE },
    locale: 'zh-CN',
    deviceScaleFactor: 1,
    acceptDownloads: true
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('console', msg => {
    const text = msg.text();
    if (/Failed to load resource: the server responded with a status of 404/i.test(text)) return;
    if (/error|failed|uncaught/i.test(text)) console.warn(`[browser:${msg.type()}] ${text}`);
  });

  try {
    await loginAndChooseStarter(page);
    await finishGuide(page);
    await evolveStarter(page);
    await buySecondPetAndSwitch(page);
    await visitRoomAndMiniGames(page);
    await shareMusicAndConfirmWall(page);
    await caption(page, 'CY PETS STORY 完整演示结束', '从登入、养成、进化、互动、音乐到留言墙，核心体验已经走完。', 2200);
    await hideCaption(page);
    await wait(800);
  } finally {
    const video = page.video();
    await context.close();
    await browser.close();
    if (video) {
      const tempPath = await video.path();
      const output = path.join(OUT_DIR, `cy-pets-story-full-demo-${Date.now()}.webm`);
      fs.renameSync(tempPath, output);
      console.log(output);
    }
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
