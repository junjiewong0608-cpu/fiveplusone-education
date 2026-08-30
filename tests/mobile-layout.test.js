const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const cssSource = fs.readFileSync(path.join(projectRoot, 'styles.css'), 'utf8');
const htmlSource = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const appSource = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');

function assertCss(pattern, message) {
  assert.ok(pattern.test(cssSource), message);
}

function sourceBetween(start, end, source = appSource) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing start marker ${start}`);
  assert.notEqual(endIndex, -1, `missing end marker ${end}`);
  return source.slice(startIndex, endIndex);
}

function readPngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  assert.equal(buffer.subarray(1, 4).toString('ascii'), 'PNG', `${filePath} should be a PNG image`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

test('mobile layout prevents horizontal page dragging', () => {
  assertCss(/html,\s*body\s*\{[^}]*overflow-x:\s*hidden/s, 'page should clip horizontal overflow');
  assertCss(/\.page-shell,\s*\.teacher-shell,\s*\.login-card,\s*\.panel-card,\s*\.pet-card,\s*\.pet-stage,\s*\.pet-skills-panel,\s*\.pet-stats-under-card,\s*\.owned-equipment-panel,\s*\.pet-collection-panel\s*\{[^}]*max-width:\s*100%;[^}]*min-width:\s*0/s, 'major layout containers should not exceed the viewport');
  assertCss(/\.dashboard-grid\s*>\s*\*,\s*\.home-top-panels\s*>\s*\*,\s*\.pet-dashboard-grid\s*>\s*\*[\s\S]*min-width:\s*0/s, 'grid children should be allowed to shrink on phones');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.main-nav\s*\{[^}]*flex-wrap:\s*wrap[^}]*overflow-x:\s*visible/s, 'mobile nav should wrap instead of scrolling sideways');
});

test('student-facing typography enlarges important reading text without flattening hierarchy', () => {
  assertCss(/body\s*\{\s*font-size:\s*18px;\s*\}/, 'desktop base text should be more comfortable');
  assertCss(/\.primary-button,\s*\.secondary-button\s*\{[^}]*font-size:\s*17px/s, 'main actions should be larger than helper labels');
  assertCss(/\.question-card\s+h3\s*\{[^}]*font-size:\s*clamp\(26px/s, 'quiz questions should be prominent');
  assertCss(/\.eyebrow\s*\{[^}]*font-size:\s*13px/s, 'decorative eyebrow labels may remain smaller');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*body\s*\{\s*font-size:\s*17px;\s*\}/, 'mobile base text should stay readable');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.primary-button,\s*\.secondary-button\s*\{[^}]*font-size:\s*16px/s, 'mobile action buttons should stay readable without crowding');
});

test('mobile pet skill explanations use the full available width', () => {
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.pet-skills-content\s*\{[^}]*grid-template-columns:\s*1fr/s, 'mobile skills should be single-column');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.pet-skill-icon-button\s*\{[^}]*grid-template-columns:\s*86px\s+minmax\(0,\s*1fr\)/s, 'mobile skill cards should use a wide label area');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.pet-skill-explanation\s+p\s*\{[^}]*font-size:\s*15px/s, 'mobile skill explanations should be readable');
});

test('mobile pet art hides equipment overlay badges', () => {
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.equipped-layer\s*\{\s*display:\s*none;\s*\}/, 'mobile pet art should not show equipped overlay badges');
});

test('pet interaction stage uses generated scenes and bounded mobile motion', () => {
  assertCss(/\.pet-interaction-stage\s*\{[^}]*overflow:\s*hidden/s, 'pet interaction stage should clip moving pets inside the scene');
  assertCss(/\.kuromi-room-stage\s*\{[^}]*min-height:\s*0/s, 'Kuromi demo should keep a true 16:9 canvas instead of a tall squeezed stage');
  assertCss(/\.kuromi-room-controls\s*\{[^}]*left:\s*18px;[\s\S]*right:\s*18px;[\s\S]*justify-content:\s*space-between/s, 'Kuromi movement controls should split walking and action buttons to the screen sides');
  assertCss(/\.kuromi-control-button\s*\{[^}]*-webkit-user-select:\s*none;[\s\S]*touch-action:\s*none/s, 'Kuromi controls should prevent long-press text selection on mobile');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*and\s*\(orientation:\s*portrait\)[\s\S]*\.kuromi-room-controls\s*\{[^}]*bottom:\s*-58px/s, 'portrait mode should move controls below the game view');
  assertCss(/body\.kuromi-room-fullscreen-mode\s+\.kuromi-room-panel\s*\{[^}]*position:\s*fixed;[\s\S]*width:\s*100dvw;[\s\S]*height:\s*100dvh/s, 'Kuromi room should support a full-screen game layout');
  assertCss(/body\.kuromi-room-fullscreen-mode\s+\.kuromi-room-fullscreen-button\s*\{[^}]*position:\s*fixed;[\s\S]*z-index:\s*10120/s, 'Kuromi fullscreen mode should keep an obvious exit button above the mobile game canvas');
  assertCss(/body\.kuromi-room-fullscreen-mode\s+\.kuromi-room-orientation-hint\s*\{[^}]*display:\s*none/s, 'Kuromi fullscreen mode should hide the portrait hint so it does not block the game view');
  assert.match(htmlSource, /id="kuromi-room-canvas"/, 'single-player pet wall demo should render a canvas stage');
  assert.match(htmlSource, /id="interaction-room-lobby"/, 'interaction area should start with a room lobby');
  assert.match(htmlSource, /data-kuromi-control="lie"/, 'interaction controls should include a lie-down action');
  assert.match(appSource, /data-interaction-room-create-form/, 'interaction area should let students create a room');
  assert.match(appSource, /inputmode="numeric"[^>]*pattern="\[0-9\]\*"[^>]*maxlength="4"/, 'password boxes should open the numeric keyboard and allow only 4 digits');
  assert.match(appSource, /function getKuromiRoomSpriteProfileForPet/, 'interaction room should support pet-specific sprites');
  assert.match(appSource, /assets\/8bit\/characters-run-right\/\$\{fileName\}/, 'interaction room should use the right-facing running 8-bit sprite folder');
  assert.match(appSource, /loadKuromiRoomSpriteImages\(spriteProfile\)/, 'interaction room should load the current pet sprite instead of fixed Kuromi art');
  assert.match(appSource, /data-interaction-room-refresh/, 'room list should include a refresh action for current member counts');
  assert.match(appSource, /playerAction:\s*action/, 'room heartbeat should send playerAction so it cannot overwrite the backend action name');
  assert.doesNotMatch(appSource, /player\.sitting\s*\?\s*'sit'/, 'room heartbeat should not send the removed sitting state');
  assert.doesNotMatch(appSource, /function getNearestKuromiRoomSeat/, 'temporary room build should not include chair/sofa seat detection');
  assert.doesNotMatch(appSource, /characters-sit/, 'temporary room build should not load sitting sprite folders');
  assert.doesNotMatch(appSource, /seats:\s*\[/, 'temporary room maps should not define sitting hotspots');
  assert.match(sourceBetween('function getKuromiRoomPlayerAction', 'function getKuromiRoomPlayerHeight'), /if \(player\?\.lying\) return 'lie'/, 'room heartbeat should send lying state');
  assert.match(sourceBetween('function getInteractionRoomHeartbeatPayload', 'function getInteractionRoomHeartbeatSignature'), /const action = getKuromiRoomPlayerAction\(player\)/, 'room heartbeat should reuse the shared action resolver');
  assertCss(/\.kuromi-control-button-text\s*\{[^}]*font-size:\s*18px;[^}]*letter-spacing:\s*0/s, 'text action controls should fit inside the mobile buttons');
  assert.match(appSource, /lobbyRefreshTimer/, 'room lobby should auto-refresh while students wait outside rooms');
  assert.match(appSource, /isInteractionRoomLobbyInputActive/, 'room lobby auto-refresh should avoid interrupting kids while they type');
  assert.match(appSource, /loadInteractionRooms\(true,\s*\{\s*silent:\s*true\s*\}\)/, 'quiet lobby refresh should update room counts without noisy loading states');
  assert.match(appSource, /chatDraft:\s*''/, 'room chat should keep an app-state draft instead of relying on the current input node');
  assert.match(appSource, /interactionRoomState\.chatDraft\s*=\s*String\(kuromiRoomChatInput\.value\s*\|\|\s*''\)/, 'room chat input should update the draft while students type');
  assert.match(appSource, /const draft\s*=\s*interactionRoomState\.chatDraft\s*\|\|\s*''/, 'room chat render should restore the draft after heartbeat refreshes');
  assert.match(appSource, /setSelectionRange\(safeStart,\s*safeEnd\)/, 'room chat render should restore the cursor when the input is focused');
  assert.match(appSource, /const INTERACTION_ROOM_MOVING_HEARTBEAT_MS\s*=\s*350/, 'moving multiplayer pets should sync frequently enough to avoid teleporting');
  assert.match(appSource, /const INTERACTION_ROOM_IDLE_HEARTBEAT_MS\s*=\s*1500/, 'idle multiplayer pets should sync less often to protect Redis and Supabase fallback');
  assert.match(appSource, /lastHeartbeatPayload/, 'room heartbeats should remember the last payload to avoid duplicate writes while idle');
  assert.match(appSource, /leaveActiveInteractionRoom/, 'leaving the page should remove the user from the room');
  assert.doesNotMatch(appSource, /写一句话让 Kuromi 说出来/, 'chat prompt should not be locked to Kuromi');
  assertCss(/\.interaction-room-password-row\[hidden\]\s*\{[^}]*display:\s*none/s, 'password field should stay hidden until students choose password mode');
  assertCss(/blank-meadow-builder\.png/, 'home scene should use the generated blank meadow builder background');
  assert.doesNotMatch(cssSource, /sunny-meadow\.png/, 'extra pet wall scenes should be hidden for now');
  assert.doesNotMatch(cssSource, /starry-bedroom\.png/, 'extra pet wall scenes should be hidden for now');
  assert.doesNotMatch(cssSource, /candy-playground\.png/, 'extra pet wall scenes should be hidden for now');
  assert.doesNotMatch(cssSource, /magic-courtyard\.png/, 'extra pet wall scenes should be hidden for now');
  assertCss(/@keyframes\s+creeper-explode/, 'Creeper should have a dedicated cute explosion animation');
  assertCss(/@keyframes\s+creeper-walk/, 'Creeper should have a walk animation');
  assertCss(/prefers-reduced-motion:\s*reduce/, 'pet motion should respect reduced motion settings');
});

test('mobile fullscreen interaction room keeps the game centered and leaves safely', () => {
  assert.match(htmlSource, /data-kuromi-chat-toggle/, 'mobile fullscreen room should expose a compact chat button instead of always showing the input');
  assert.match(appSource, /function toggleKuromiRoomChatPanel/, 'chat input should open only when students tap the chat button');
  assert.match(appSource, /if \(isKuromiRoomFullscreenMode\(\)\) await exitKuromiRoomFullscreen\(\{ restartDemo: false \}\);/, 'leaving a room in fullscreen should first clear fullscreen mode');
  assertCss(/body\.kuromi-room-fullscreen-mode\s+\.kuromi-room-stage\s*\{[^}]*height:\s*100dvh/s, 'fullscreen room stage should use the full viewport once the chat bar is hidden');
  assertCss(/body\.kuromi-room-fullscreen-mode\s+\.kuromi-room-canvas\s*\{[^}]*width:\s*min\(100dvw,\s*calc\(100dvh\s*\*\s*16\s*\/\s*9\)\);[\s\S]*height:\s*min\(100dvh,\s*calc\(100dvw\s*\*\s*9\s*\/\s*16\)\)/s, 'fullscreen room canvas should stay 16:9, centered, and never stretch');
  assertCss(/body\.kuromi-room-fullscreen-mode:not\(\.kuromi-room-chat-open\)\s+\.kuromi-room-chat-panel\s*\{[^}]*display:\s*none/s, 'mobile fullscreen chat panel should stay closed until the chat button is tapped');
  assertCss(/body\.kuromi-room-fullscreen-mode\s+\.kuromi-room-chat-toggle\s*\{[^}]*display:\s*grid/s, 'mobile fullscreen should show a chat icon near the left controls');
  assertCss(/body\.kuromi-room-fullscreen-mode\s+\.kuromi-room-chat-status\s*\{[^}]*display:\s*none/s, 'mobile fullscreen should hide the leave-room status row to prevent accidental exits');
  assertCss(/body\.mini-game-fullscreen-mode\s+#mini-game-embedded-page::backdrop,[\s\S]*\{[^}]*background:\s*#070817\s*!important/s, 'mini-game fullscreen backdrop should stay dark instead of exposing a white browser strip');
  assertCss(/body\.kuromi-room-fullscreen-mode\s+\.kuromi-room-panel::backdrop\s*\{[^}]*background:\s*#080411\s*!important/s, 'room fullscreen backdrop should stay dark behind the canvas');
});

test('role artwork thumbnails preserve the full before and evolved character art', () => {
  assertCss(/\.initial-pet-card\s+\.initial-pet-art\s*\{[^}]*object-fit:\s*contain/s, 'initial pet choices should show the complete role artwork');
  assertCss(/\.pet-shop-art\s+img\s*\{[^}]*object-fit:\s*contain/s, 'pet shop cards should not crop role artwork');
  assertCss(/\.pet-status-image\s*\{[^}]*object-fit:\s*contain/s, 'owned pet status cards should not crop role artwork');
  assertCss(/\.pet-collection-card\s+img\s*\{[^}]*object-fit:\s*contain/s, 'compact pet collection thumbnails should not crop role artwork');
  assertCss(/\.evolution-image-wrap\s+img\s*\{[^}]*object-fit:\s*contain/s, 'evolution result should show the complete evolved role artwork');
});

test('non-hero role artwork uses optimized thumbnails to keep mobile loads light', () => {
  const manifestPath = path.join(projectRoot, 'assets', 'optimized', 'role-thumbs', 'role-thumbs-manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'optimized role thumbnail manifest should exist');
  const thumbPath = path.join(projectRoot, 'assets', 'optimized', 'role-thumbs', 'new-character-sanrio-cinnamoroll-cinnamoroll-before.webp');
  const thumbBuffer = fs.readFileSync(thumbPath);
  assert.equal(thumbBuffer.subarray(0, 4).toString('ascii'), 'RIFF', 'role thumbnail should be a WebP asset');
  assert.match(appSource, /function getRolePreviewAsset\(src\)/, 'app should expose a thumbnail helper for non-hero previews');
  assert.match(appSource, /assets\/optimized\/role-thumbs\/\$\{slug \|\| 'role-card'\}\.webp/, 'thumbnail helper should map role card paths to the optimized thumbnail folder');
  assert.match(appSource, /class="role-card-art" src="\$\{escapeHtml\(displayImage\)\}"/, 'main pet homepage card should keep the full-resolution display image');
  assert.match(appSource, /renderPetShop[\s\S]*getRolePreviewAsset\(pet\.image\)/, 'pet shop should use optimized role thumbnails');
  assert.match(appSource, /renderMessageWall[\s\S]*getRolePreviewAsset\(post\.petImage\)/, 'message wall cards should use optimized role thumbnails');
  assert.match(appSource, /renderFriendProfile[\s\S]*displayPreviewImage = getRolePreviewAsset\(displayImage\)/, 'friend profile preview should use optimized role thumbnails');
  assert.match(appSource, /openEvolutionChoiceModal[\s\S]*getRolePreviewAsset\(getPetCuteEvolvedImage\(pet\)\)/, 'evolution route previews should use optimized role thumbnails');
});

test('skill and equipment thumbnails preserve complete artwork inside fixed frames', () => {
  assertCss(/\.pet-skill-image-wrap\s*\{[^}]*overflow:\s*hidden/s, 'skill image frame should clip only outside the fixed frame');
  assertCss(/\.pet-skill-icon-button\s+img\s*\{[^}]*object-fit:\s*contain/s, 'skill icons should show the whole uploaded artwork');
  assert.doesNotMatch(cssSource, /\.pet-skill-icon-button\s+img\s*\{[^}]*object-fit:\s*cover/s, 'skill icons should not use a square cover crop');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.pet-skill-image-wrap\s*\{[^}]*width:\s*86px;[^}]*height:\s*86px;[^}]*overflow:\s*hidden/s, 'mobile skill frame should have fixed square dimensions');
  assertCss(/\.item-art,\s*\.owned-equipment-art,\s*\.equipped-tag\s*\{[^}]*overflow:\s*hidden/s, 'equipment art frames should clip only outside the fixed frame');
  assertCss(/\.item-art\s*\{[^}]*aspect-ratio:\s*1;[^}]*min-height:\s*0/s, 'shop equipment artwork should use a square frame instead of a long strip');
  assertCss(/\.slot-image,\s*\.item-art\s+img,\s*\.owned-equipment-art\s+img,\s*\.equipped-tag\s+img\s*\{[^}]*object-fit:\s*contain/s, 'equipment images should fit inside their frames');
});

test('buttons show an inline spinner while saving to Sheet', () => {
  assertCss(/button\.is-loading\s*\{[^}]*display:\s*inline-flex;[^}]*cursor:\s*wait/s, 'loading buttons should show stable inline content');
  assertCss(/\.button-spinner\s*\{[^}]*border-right-color:\s*transparent;[^}]*animation:\s*button-spin/s, 'loading spinner should animate inside the button');
  assertCss(/@keyframes\s+button-spin\s*\{[^}]*rotate\(360deg\)/s, 'spinner keyframes should rotate once per cycle');
});

test('legacy Sheet refresh control is removed from the mobile page chrome', () => {
  assert.doesNotMatch(htmlSource, /id="sync-sheet-button"/);
  assert.doesNotMatch(htmlSource, /data-sync-sheet/);
  assert.doesNotMatch(cssSource, /\.sync-sheet-button/);
});

test('pet shop series selector uses compact mobile controls before rendering pet cards', () => {
  assertCss(/\.pet-series-buttons\s*\{[^}]*display:\s*flex/s, 'desktop shop should show series buttons');
  assertCss(/\.pet-series-select\s*\{[^}]*min-height:\s*54px/s, 'mobile series select should be touch-friendly');
  assertCss(/@media\s*\(max-width:\s*720px\)\s*\{[\s\S]*\.pet-series-buttons\s*\{[^}]*display:\s*none/s, 'mobile shop should hide long series button rows');
  assertCss(/@media\s*\(max-width:\s*720px\)\s*\{[\s\S]*\.pet-series-select-wrap\s*\{[^}]*display:\s*grid/s, 'mobile shop should show the compact series dropdown');
});

test('modal close buttons sit at the top right without crowding mobile content', () => {
  assert.match(htmlSource, /class="modal-close-button/);
  assertCss(/\.modal-close-button\s*\{[^}]*position:\s*absolute;[^}]*top:\s*16px;[^}]*right:\s*16px/s, 'close button should sit at the top right of modals');
  assertCss(/\.modal-close-button\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px/s, 'close button should be easy to tap');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.modal-close-button\s*\{[^}]*top:\s*10px;[^}]*right:\s*10px/s, 'mobile close button should stay inside the card edge');
});

test('language toggle and english text stay within mobile-width controls', () => {
  assert.match(htmlSource, /class="language-toggle"/);
  assertCss(/\.language-toggle\s*\{[^}]*position:\s*fixed;[^}]*left:\s*50%;[^}]*transform:\s*translateX\(-50%\)/s, 'language toggle should stay centered at the page top');
  assertCss(/\.app-mode\s+\.language-toggle,\s*\.teacher-mode\s+\.language-toggle\s*\{[^}]*z-index:\s*140/s, 'app language toggle should sit above sticky app chrome on every view');
  assertCss(/\.language-button\s*\{[^}]*min-width:\s*48px/s, 'language buttons should keep a stable tap target');
  assertCss(/\.primary-button,\s*\.secondary-button,\s*\.nav-button,\s*\.text-button\s*\{[^}]*white-space:\s*normal;[^}]*overflow-wrap:\s*anywhere/s, 'long English button text should wrap instead of overflowing');
  assertCss(/\.pet-selection-card,\s*\.level-up-card,\s*\.evolution-card\s*\{[^}]*overflow-wrap:\s*anywhere/s, 'modal copy should wrap safely in English');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.language-toggle\s*\{[^}]*top:\s*8px/s, 'mobile language toggle should sit high enough above content');
});

test('mobile message wall presets collapse into a dropdown instead of long button rows', () => {
  assertCss(/\.wall-preset-select-wrap\s*\{[^}]*display:\s*none/s, 'desktop can keep preset buttons while dropdown starts hidden');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.wall-preset-button-row\s*\{[^}]*display:\s*none/s, 'mobile should hide long preset button rows');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.wall-preset-select-wrap\s*\{[^}]*display:\s*block/s, 'mobile should show the compact preset dropdown');
});

test('late mobile pass uses full-width game panels instead of squeezed desktop cards', () => {
  assertCss(/Late mobile pass:[\s\S]*@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.page-shell\s*\{[^}]*width:\s*100%;[^}]*padding:\s*12px\s+6px/s, 'phone app shell should use almost the full screen width');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.main-nav\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s, 'phone nav should be a compact no-scroll grid');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.wall-post-card\s*\{[^}]*grid-template-columns:\s*1fr/s, 'phone wall cards should become single-column');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.wall-image-button\s*\{[^}]*width:\s*100%;[^}]*aspect-ratio:\s*16\s*\/\s*10/s, 'phone wall card images should become large inspectable panels');
  assertCss(/@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*\.friend-gift-card,[\s\S]*\.gift-claim-card,[\s\S]*\.pet-selection-card[\s\S]*width:\s*calc\(100%\s*-\s*12px\)/s, 'phone modals should use nearly full screen width');
});

test('login screen uses the character wallpaper, translucent left panel and center logo', () => {
  const wallpaperPath = path.join(projectRoot, 'assets/backgrounds/login-characters-wallpaper.png');
  const logoPath = path.join(projectRoot, 'assets/brand/center-logo.png');
  assert.deepEqual(readPngSize(wallpaperPath), { width: 1920, height: 1080 });
  assert.ok(fs.existsSync(logoPath), 'center logo should be copied into project assets');
  assert.match(htmlSource, /<img class="center-logo" src="assets\/brand\/center-logo\.png"/);
  assertCss(/\.login-screen\s*\{[^}]*place-items:\s*center start/s, 'login panel should sit on the left side of the wallpaper');
  assertCss(/\.login-screen::before\s*\{[^}]*background-image:\s*url\('assets\/backgrounds\/login-characters-wallpaper\.png'\)/s, 'login screen should use the generated character wallpaper');
  assertCss(/\.login-card\s*\{[^}]*background:\s*rgba\(255,\s*255,\s*255,\s*\.74\)/s, 'login panel should be translucent');
  assertCss(/\.center-logo\s*\{[^}]*position:\s*absolute;[^}]*top:/s, 'center logo should be positioned over the wallpaper');
  assertCss(/\.center-logo\s*\{[^}]*right:/s, 'center logo should sit at the top right');
});

test('front-end cache version is bumped for the mobile layout update', () => {
  ['styles.css', 'equipment-catalog.js', 'app.js'].forEach(assetName => {
    const match = htmlSource.match(new RegExp(`${assetName.replace('.', '\\.')}\\?v=(\\d{8})-(\\d+)`));
    assert.ok(match, `${assetName} should include a cache-busting version`);
    const versionDate = Number(match[1]);
    const versionBuild = Number(match[2]);
    assert.ok(
      versionDate > 20260812 || (versionDate === 20260812 && versionBuild >= 4),
      `${assetName} should keep at least the 20260812-4 mobile layout cache version`
    );
  });
});
