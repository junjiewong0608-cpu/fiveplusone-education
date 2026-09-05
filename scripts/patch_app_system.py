import sys

with open('app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Bump APP_ASSET_VERSION
code = code.replace("const APP_ASSET_VERSION = '20260831-13';", "const APP_ASSET_VERSION = '20260903-10';")
code = code.replace("const APP_ASSET_VERSION = '20260903-09';", "const APP_ASSET_VERSION = '20260903-10';")

# 2. Add arcadeOpen to miniGameState
target_minigame = "const miniGameState = {\n    overlayOpen: false,\n    embeddedOpen: false,"
if target_minigame in code:
    code = code.replace(target_minigame, "const miniGameState = {\n    overlayOpen: false,\n    embeddedOpen: false,\n    arcadeOpen: false,")
elif "arcadeOpen: false," not in code:
    code = code.replace("overlayOpen: false,", "overlayOpen: false,\n    arcadeOpen: false,")

# 3. isMiniGameSurfaceOpen
code = code.replace(
    "return Boolean(miniGameState.overlayOpen || miniGameState.embeddedOpen);",
    "return Boolean(miniGameState.overlayOpen || miniGameState.embeddedOpen || miniGameState.arcadeOpen);"
)

# 4. getMiniGameElements
target_elem = "function getMiniGameElements() {\n    const embeddedPage = $('#mini-game-embedded-page');"
replacement_elem = """function getMiniGameElements() {
    if (miniGameState.arcadeOpen) {
      return {
        root: $('#arcade-arena-section'),
        overlay: $('#arcade-arena-section'),
        title: $('#active-game-title'),
        status: $('#live-game-score'),
        picker: null,
        canvas: $('#arcade-game-canvas'),
        actions: null,
        actionButton: null,
        retryButton: null,
        fullscreenButton: null,
        runnerControls: null,
        hint: null
      };
    }
    const embeddedPage = $('#mini-game-embedded-page');"""
if target_elem in code:
    code = code.replace(target_elem, replacement_elem)

# 5. renderMiniGamePicker
target_picker = """    picker.innerHTML = getMiniGameChoices().map(choice => `<button type="button" class="mini-game-choice" data-mini-game-start="${choice.type}">
      <span aria-hidden="true">${choice.icon}</span>
      <strong>${escapeHtml(localize(choice.title))}</strong>
      <small>${escapeHtml(localize(choice.description))}</small>
    </button>`).join('');"""

replacement_picker = """    const student = getStudent();
    const petImage = getRolePreviewAsset(getPetDisplayImage(student));
    picker.innerHTML = getMiniGameChoices().map(choice => `<button type="button" class="mini-game-choice" data-mini-game-start="${choice.type}">
      <span class="mini-game-choice-art"><img src="${escapeHtml(petImage)}" alt="" class="mini-game-choice-pet" loading="lazy" decoding="async" /></span>
      <span class="mini-game-choice-copy">
        <strong>${escapeHtml(localize(choice.title))}</strong>
        <small>${escapeHtml(localize(choice.description))}</small>
      </span>
    </button>`).join('');"""
if target_picker in code:
    code = code.replace(target_picker, replacement_picker)

# 6. renderAppShell welcomeName, todayLabel, streakCount
target_appshell = """    $('#welcome-name').innerHTML = renderHomeNameEditor('student', studentDisplayName, getHomeNameEditValue('student', student));
    $('#student-chip-name').textContent = studentDisplayName;
    $('#student-chip-avatar').innerHTML = renderStudentAvatarVisual(student, 'student-chip-avatar-image');
    const avatarPreview = $('#student-avatar-preview');
    if (avatarPreview) avatarPreview.innerHTML = renderStudentAvatarVisual(student, 'avatar-upload-image');
    $('#today-label').textContent = `${currentLanguage === 'en' ? localize(student.branch) : student.branch} · ${student.className} · ${formatDisplayDate(getDateKey())}`;
    $('#checkin-date-label').textContent = formatDisplayDate(getDateKey());"""

replacement_appshell = """    const welcomeName = $('#welcome-name');
    if (welcomeName) welcomeName.innerHTML = renderHomeNameEditor('student', studentDisplayName, getHomeNameEditValue('student', student));
    $('#student-chip-name').textContent = studentDisplayName;
    $('#student-chip-avatar').innerHTML = renderStudentAvatarVisual(student, 'student-chip-avatar-image');
    const avatarPreview = $('#student-avatar-preview');
    if (avatarPreview) avatarPreview.innerHTML = renderStudentAvatarVisual(student, 'avatar-upload-image');
    const todayLabel = $('#today-label');
    if (todayLabel) todayLabel.textContent = `${currentLanguage === 'en' ? localize(student.branch) : student.branch} · ${student.className} · ${formatDisplayDate(getDateKey())}`;
    $('#checkin-date-label').textContent = formatDisplayDate(getDateKey());
    const streakCount = $('#streak-count');
    if (streakCount) streakCount.textContent = `${student.currentStreak || 0}`;"""
if target_appshell in code:
    code = code.replace(target_appshell, replacement_appshell)

# 7. View switching arcade close
target_switch = "if (previousViewId === 'music-box-view' && viewId !== 'music-box-view') stopMusicPreview();"
replacement_switch = "if (previousViewId === 'music-box-view' && viewId !== 'music-box-view') stopMusicPreview();\n    if (previousViewId === 'arcade-view' && viewId !== 'arcade-view') closeArcadeGame();"
if target_switch in code and "previousViewId === 'arcade-view'" not in code:
    code = code.replace(target_switch, replacement_switch)

# 8. Canvas click delegator selector
code = code.replace(
    "if (!event.target.closest('#mini-game-canvas, [data-mini-game-canvas]')) return;",
    "if (!event.target.closest('#mini-game-canvas, #arcade-game-canvas, [data-mini-game-canvas]')) return;"
)

# 9. Now let's replace EduVerse arcade, hero gacha, and duel arena sections completely!
start_marker = "  // =========================================================\n  // 1. EDUVERSE ARCADE MINI-GAMES CONTROLLER"
end_marker = "  function openTeacherScreen() {"

# Let's verify start_marker and end_marker exist
if start_marker not in code or end_marker not in code:
    print("ERROR: Start or end marker not found!")
    sys.exit(1)

# Read step_1139, step_1147, step_1153 from scratch
with open('/Users/wongjunjie/.gemini/antigravity-ide/brain/8de7b9f2-94ba-41c6-8d5a-5143ea525e06/scratch/step_1139.txt', 'r', encoding='utf-8') as sf:
    step_1139_code = sf.read()

with open('/Users/wongjunjie/.gemini/antigravity-ide/brain/8de7b9f2-94ba-41c6-8d5a-5143ea525e06/scratch/step_1147.txt', 'r', encoding='utf-8') as sf:
    step_1147_code = sf.read()

with open('/Users/wongjunjie/.gemini/antigravity-ide/brain/8de7b9f2-94ba-41c6-8d5a-5143ea525e06/scratch/step_1153.txt', 'r', encoding='utf-8') as sf:
    step_1153_code = sf.read()

new_eduverse_section = f"""  // =========================================================
  // 1. EDUVERSE ARCADE MINI-GAMES CONTROLLER
  // =========================================================
  let activeArcadeType = 'reaction';
  let arcadeBestScores = {{
    reaction: Number(localStorage.getItem('eduverse_score_reaction') || 0),
    flappy: Number(localStorage.getItem('eduverse_score_flappy') || 0),
    runner: Number(localStorage.getItem('eduverse_score_runner') || 0),
    jumpCharge: Number(localStorage.getItem('eduverse_score_jumpCharge') || 0)
  }};

  function renderArcadeView() {{
    ['reaction', 'flappy', 'runner', 'jumpCharge'].forEach(t => {{
      const el = document.getElementById(`best-score-${{t}}`);
      if (el) el.textContent = arcadeBestScores[t] || 0;
    }});
  }}

  function launchArcadeGame(gameType) {{
    bindMiniGameKeyboardInput();
    stopMiniGameLoop();
    resetMiniGamePlayState();
    miniGameState.overlayOpen = false;
    miniGameState.embeddedOpen = false;
    miniGameState.arcadeOpen = true;
    activeArcadeType = gameType;

    const titles = {{
      reaction: '⚡ 极速反应转盘 (Reaction Blitz)',
      flappy: '🐦 萌宠飞跃秘境 (Flappy Pet Quest)',
      runner: '🏃 无尽酷跑大冲刺 (Dash Runner)',
      jumpCharge: '🚀 聚力跳跃大师 (Jump Charge)'
    }};
    const icons = {{ reaction: '⚡', flappy: '🐦', runner: '🏃', jumpCharge: '🚀' }};

    const titleEl = document.getElementById('active-game-title');
    const iconEl = document.getElementById('active-game-icon');
    const scoreEl = document.getElementById('live-game-score');
    const comboEl = document.getElementById('live-game-combo');
    const arena = document.getElementById('arcade-arena-section');
    const gameoverModal = document.getElementById('arcade-gameover-modal');

    if (titleEl) titleEl.textContent = titles[gameType] || '迷你游戏';
    if (iconEl) iconEl.textContent = icons[gameType] || '🎮';
    if (scoreEl) scoreEl.textContent = '0';
    if (comboEl) comboEl.textContent = '0 COMBO';
    if (gameoverModal) gameoverModal.classList.add('hidden');
    if (arena) arena.classList.remove('hidden');

    arena?.scrollIntoView({{ behavior: 'smooth' }});
    updateArcadePauseButton();

    // Launch existing mini game engine
    startMiniGame(gameType);
  }}

  function updateArcadePauseButton() {{
    const button = $('#arcade-pause-btn');
    if (!button) return;
    button.textContent = miniGameState.paused ? '▶️ 继续' : '⏸️ 暂停';
    button.setAttribute('aria-pressed', String(miniGameState.paused));
  }}

  function toggleArcadeMiniGamePause() {{
    if (!miniGameState.arcadeOpen || !miniGameState.type) return;
    miniGameState.paused = !miniGameState.paused;
    if (!miniGameState.paused) miniGameState.lastFrame = null;
    updateArcadePauseButton();
  }}

  function closeArcadeGame() {{
    stopMiniGameLoop();
    miniGameState.arcadeOpen = false;
    miniGameState.paused = false;
    resetMiniGamePlayState();
    $('#arcade-arena-section')?.classList.add('hidden');
    $('#arcade-gameover-modal')?.classList.add('hidden');
    updateArcadePauseButton();
  }}

  function finishArcadeGame(score) {{
    const student = getStudent();
    const finalScore = Math.max(0, Math.floor(Number(score || 0)));
    const previousBest = arcadeBestScores[activeArcadeType] || 0;
    if (finalScore > previousBest) {{
      arcadeBestScores[activeArcadeType] = finalScore;
      localStorage.setItem(`eduverse_score_${{activeArcadeType}}`, String(finalScore));
    }}

    const rewardExp = Math.max(20, Math.floor(finalScore * 1.5));
    const rewardCoins = Math.max(5, Math.floor(finalScore * 0.4));

    if (student) {{
      student.experience = Number(student.experience || 0) + rewardExp;
      student.coins = Number(student.coins || 0) + rewardCoins;
      saveDatabase();
      renderAppShell();
    }}

    const modal = document.getElementById('arcade-gameover-modal');
    const scoreEl = document.getElementById('gameover-final-score');
    const highEl = document.getElementById('gameover-high-score');
    const expEl = document.getElementById('gameover-reward-exp');
    const coinEl = document.getElementById('gameover-reward-coins');

    if (scoreEl) scoreEl.textContent = `${{finalScore}} pts`;
    if (highEl) highEl.textContent = `${{arcadeBestScores[activeArcadeType]}} pts`;
    if (expEl) expEl.textContent = `+${{rewardExp}} EXP`;
    if (coinEl) coinEl.textContent = `+${{rewardCoins}} 金币`;
    if (modal) modal.classList.remove('hidden');

    playAudioFx('victory');
  }}

  // =========================================================
  // 2. EDUVERSE HERO CHARACTERS SANCTUARY & SHOP CONTROLLER
  // =========================================================
  let selectedHeroId = 'pikachu';
  let activeSeriesFilter = 'all';

  const HERO_SERIES_MAP = {{
    pokemon: ['pikachu', 'mewtwo', 'lucario', 'greninja', 'charizard', 'psyduck', 'squirtle'],
    popmart: ['crybaby', 'hacipupu', 'labubu', 'skullpanda', 'twinkle-twinkle'],
    sanrio: ['kuromi', 'my-melody', 'cinnamoroll', 'pochacco', 'hello-kitty'],
    minecraft: ['wolf', 'steve', 'enderman', 'enderdragon', 'creeper'],
    cartoon: ['winnie-the-pooh', 'crayon-shinchan', 'ugly-fish', 'yoyo'],
    elemental: ['sunny-wing', 'sprouty', 'hydroblob', 'fluffbit', 'shadow-wing', 'flame-rex', 'thunder-beetle', 'frost-fang', 'volt-cheetah', 'shadow-stalker']
  }};

  const HERO_GACHA_PET_IDS = ['arcflare-fox', 'webshade-lynx', 'stormmane-lion', 'runeportal-owl', 'vibranium-panther', 'gamma-boulder-bear'];
  const HERO_GACHA_EQUIPMENT_IDS = HERO_GACHA_PET_IDS.flatMap(heroId =>
    Array.from({{ length: 5 }}, (_, index) => `exclusive-${{heroId}}-${{String(index + 1).padStart(2, '0')}}`)
  );
  const HERO_GACHA_PET_RATE = 0.02;
  const HERO_GACHA_PITY_LIMIT = 50;
  let heroGachaLocked = false;
  let currentMarqueeSlot = 0;

  // 14-Slot Wheel Layout in Perimeter Clockwise Order:
  // Top (cols 1..5, r1), Right (col 5, r2..3), Bottom (cols 5..1, r4), Left (col 1, r3..2)
  const HOK_GACHA_SLOTS = [
    {{ id: 'hok-slot-0', name: '赤焰机甲狐', type: '限定SSR', rarity: 'SSR', isGrand: true, petId: 'arcflare-fox', col: 1, row: 1 }},
    {{ id: 'hok-slot-1', name: '紫能守护豹', type: '限定SSR', rarity: 'SSR', isHero: true, petId: 'vibranium-panther', col: 2, row: 1 }},
    {{ id: 'hok-slot-2', name: '雷霆战狮', type: '限定SSR', rarity: 'SSR', isHero: true, petId: 'stormmane-lion', col: 3, row: 1 }},
    {{ id: 'hok-slot-3', name: '4级烈焰符文', type: '专属符文', isRune: true, icon: '🔥', col: 4, row: 1 }},
    {{ id: 'hok-slot-4', name: '钻石礼包 48', type: '稀有钻石', isDia: true, icon: '💎', col: 5, row: 1 }},
    {{ id: 'hok-slot-5', name: '蛛影战猫', type: '限定SSR', rarity: 'SSR', isHero: true, petId: 'webshade-lynx', col: 5, row: 2 }},
    {{ id: 'hok-slot-6', name: '3级守护符文', type: '防御符文', isRune: true, icon: '🛡️', col: 5, row: 3 }},
    {{ id: 'hok-slot-7', name: '学习金币 288', type: '大量金币', isGold: true, icon: '🪙', col: 5, row: 4 }},
    {{ id: 'hok-slot-8', name: '英雄碎片 x5', type: '万能碎片', isShard: true, icon: '🧩', col: 4, row: 4 }},
    {{ id: 'hok-slot-9', name: '伽马巨岩熊', type: '限定SSR', rarity: 'SSR', isHero: true, petId: 'gamma-boulder-bear', col: 3, row: 4 }},
    {{ id: 'hok-slot-10', name: '全服大喇叭', type: '广播道具', isHorn: true, icon: '📢', col: 2, row: 4 }},
    {{ id: 'hok-slot-11', name: '2级敏捷符文', type: '速度符文', isRune: true, icon: '⚡', col: 1, row: 4 }},
    {{ id: 'hok-slot-12', name: '秘境传送鸮', type: '限定SSR', rarity: 'SSR', isHero: true, petId: 'runeportal-owl', col: 1, row: 3 }},
    {{ id: 'hok-slot-13', name: '专属钛合金刃', type: 'S级神装', isGear: true, icon: '⚔️', col: 1, row: 2 }}
  ];

  const HOK_WEEKLY_MILESTONES = [
    {{ pulls: 5, label: '5次', reward: '100 金币', coins: 100 }},
    {{ pulls: 15, label: '15次', reward: '抽奖券 x1', coins: 200 }},
    {{ pulls: 35, label: '35次', reward: 'S级神装箱', coins: 500 }},
    {{ pulls: 65, label: '65次', reward: '限定英雄自选', coins: 1000 }}
  ];

  function openGachaRuleModal() {{
    const modal = document.getElementById('hok-gacha-rule-modal');
    if (modal) modal.classList.remove('hidden');
  }}

  function renderCharactersView(series = activeSeriesFilter) {{
    activeSeriesFilter = series;
    const student = getStudent() || {{}};
    const ownedPets = new Set(Array.isArray(student.ownedPets) ? student.ownedPets : [student.petType || 'sunny-wing']);
    const coinsEl = document.getElementById('char-view-coins');
    if (coinsEl) coinsEl.textContent = Math.max(0, Math.floor(Number(student.coins || 0))).toLocaleString();

    const starsEl = document.getElementById('char-view-stars');
    if (starsEl) starsEl.textContent = Math.max(0, Math.floor(Number(student.totalStars || 0))).toLocaleString();

    const ticketsEl = document.getElementById('char-view-tickets');
    if (ticketsEl) ticketsEl.textContent = `${{Math.floor((student.coins || 0) / 60)}}`;

    const pity = Math.min(HERO_GACHA_PITY_LIMIT, Math.max(0, Math.floor(Number(student.heroGachaPity || 0))));
    const pityCount = document.getElementById('hero-gacha-pity-count');
    const pityBar = document.getElementById('hero-gacha-pity-bar');
    if (pityCount) pityCount.textContent = `${{pity}} / ${{HERO_GACHA_PITY_LIMIT}}`;
    if (pityBar) pityBar.style.width = `${{(pity / HERO_GACHA_PITY_LIMIT) * 100}}%`;

    // 1. Render HoK 14-Slot Wheel Grid
    const wheelGrid = document.getElementById('hok-wheel-grid');
    if (wheelGrid) {{
      wheelGrid.innerHTML = HOK_GACHA_SLOTS.map((slot, index) => {{
        const pet = slot.petId ? getPetInfo(slot.petId) : null;
        const petArt = pet ? (pet.evolvedImage || pet.image) : '';
        const badgeClass = slot.isGrand ? 'badge-grand' : (slot.rarity === 'SSR' ? 'badge-ssr' : '');
        const isCurrentActive = index === currentMarqueeSlot;

        let iconMarkup = '';
        if (petArt) {{
          iconMarkup = `<div class="hok-slot-art"><img src="${{escapeHtml(withAssetVersion(petArt))}}" alt="${{escapeHtml(slot.name)}}" loading="lazy" decoding="async" /></div>`;
        }} else {{
          iconMarkup = `<div class="hok-slot-vector-icon">${{slot.icon || '🎁'}}</div>`;
        }}

        return `
          <div class="hok-gacha-slot${{slot.isGrand ? ' slot-featured' : ''}}${{isCurrentActive ? ' marquee-active' : ''}}"
               data-slot-index="${{index}}"
               style="grid-column: ${{slot.col}}; grid-row: ${{slot.row}};">
            <span class="hok-slot-badge ${{badgeClass}}">${{slot.type}}</span>
            ${{iconMarkup}}
            <span class="hok-slot-name">${{escapeHtml(slot.name)}}</span>
          </div>`;
      }}).join('');
    }}

    // 2. Render Weekly Milestone Chests
    const weeklyPulls = Math.max(0, Math.floor(Number(student.weeklyGachaPulls || 0)));
    const weeklyCountEl = document.getElementById('hok-weekly-pull-count');
    if (weeklyCountEl) weeklyCountEl.textContent = `${{weeklyPulls}}`;

    const claimedMilestones = new Set(Array.isArray(student.claimedGachaMilestones) ? student.claimedGachaMilestones : []);
    const milestoneTrack = document.getElementById('hok-milestone-track');
    if (milestoneTrack) {{
      milestoneTrack.innerHTML = HOK_WEEKLY_MILESTONES.map((m, idx) => {{
        const isClaimed = claimedMilestones.has(idx);
        const isClaimable = !isClaimed && weeklyPulls >= m.pulls;
        const statusClass = isClaimed ? 'claimed' : (isClaimable ? 'claimable' : '');
        const btnClass = isClaimed ? 'btn-claimed' : (isClaimable ? 'btn-claimable' : 'btn-locked');
        const btnLabel = isClaimed ? '✔ 已领取' : (isClaimable ? '可领取' : '待解锁');

        return `
          <div class="milestone-node-card ${{statusClass}}" onclick="window.__eduverseApp.claimWeeklyGachaMilestone(${{idx}})">
            <span class="milestone-icon">${{isClaimed ? '✨' : (isClaimable ? '🎁' : '🔒')}}</span>
            <div class="milestone-info">
              <strong>${{m.label}} (${{Math.min(m.pulls, weeklyPulls)}}/${{m.pulls}})</strong>
              <small>${{m.reward}}</small>
            </div>
            <button type="button" class="milestone-status-btn ${{btnClass}}">${{btnLabel}}</button>
          </div>`;
      }}).join('');
    }}

    // 3. Render Hero Encyclopedia (Drawer) - strictly preserves contract test requirements
    const pool = document.getElementById('hero-gacha-pool-grid');
    if (pool) {{
      pool.innerHTML = HERO_GACHA_PET_IDS.map(id => getPetInfo(id)).filter(Boolean).map(hero => {{
        const skills = Array.isArray(hero.skills) ? hero.skills.slice(0, 5) : [];
        return `
          <article class="hero-gacha-card${{ownedPets.has(hero.id) ? ' owned' : ''}}">
            <div class="hero-gacha-card-copy"><span>LIMITED SSR</span><strong>${{escapeHtml(hero.name)}}</strong><small>${{ownedPets.has(hero.id) ? '已拥有 · 重复抽取返还金币' : '限定奖池角色'}}</small></div>
            <div class="hero-gacha-forms">
              <figure><img src="${{escapeHtml(withAssetVersion(hero.image))}}" alt="${{escapeHtml(hero.name)}}普通形态" loading="lazy" decoding="async" /><figcaption>普通形态</figcaption></figure>
              <figure><img src="${{escapeHtml(withAssetVersion(hero.evolvedImage || hero.image))}}" alt="${{escapeHtml(hero.name)}}进化形态" loading="lazy" decoding="async" /><figcaption>进化形态</figcaption></figure>
            </div>
            <div class="hero-gacha-skill-row" aria-label="${{escapeHtml(hero.name)}}的五个技能">
              ${{skills.map(skill => `<span title="${{escapeHtml(skill.name)}}"><img src="${{escapeHtml(withAssetVersion(skill.beforeImage || skill.image))}}" alt="${{escapeHtml(skill.name)}}" loading="lazy" decoding="async" /><small>${{escapeHtml(skill.type)}}</small></span>`).join('')}}
            </div>
          </article>`;
      }}).join('');
    }}

    const equipmentPreview = document.getElementById('hero-gacha-equipment-preview');
    if (equipmentPreview) {{
      equipmentPreview.innerHTML = HERO_GACHA_PET_IDS.map(heroId => {{
        const hero = getPetInfo(heroId);
        const items = HERO_GACHA_EQUIPMENT_IDS
          .map(id => EQUIPMENT_CATALOG.find(item => item.id === id))
          .filter(item => item?.exclusivePetId === heroId);
        return `<section class="hero-gacha-equipment-group"><strong>${{escapeHtml(hero?.name || heroId)}}专属装备</strong><div>${{items.map(item => `
          <span><img src="${{escapeHtml(withAssetVersion(item.image))}}" alt="${{escapeHtml(getEquipmentDisplayName(item))}}" loading="lazy" decoding="async" /><small>${{escapeHtml(getEquipmentDisplayName(item))}}</small></span>`).join('')}}</div></section>`;
      }}).join('');
    }}
  }}

  function runHeroGachaMarquee(targetSlotIndex, onFinish) {{
    const totalSlots = 14;
    let stepsRemaining = totalSlots * 2 + ((targetSlotIndex - currentMarqueeSlot + totalSlots) % totalSlots);
    let delay = 45;

    function step() {{
      const prevEl = document.querySelector(`.hok-gacha-slot[data-slot-index="${{currentMarqueeSlot}}"]`);
      if (prevEl) prevEl.classList.remove('marquee-active');

      currentMarqueeSlot = (currentMarqueeSlot + 1) % totalSlots;
      const nextEl = document.querySelector(`.hok-gacha-slot[data-slot-index="${{currentMarqueeSlot}}"]`);
      if (nextEl) nextEl.classList.add('marquee-active');

      playAudioFx('button');
      stepsRemaining--;

      if (stepsRemaining > 0) {{
        if (stepsRemaining < 10) delay += 25;
        else if (stepsRemaining < 5) delay += 50;
        setTimeout(step, delay);
      }} else {{
        if (nextEl) {{
          nextEl.classList.add('marquee-winner');
          setTimeout(() => nextEl.classList.remove('marquee-winner'), 1500);
        }}
        playAudioFx('victory');
        setTimeout(onFinish, 450);
      }}
    }}

    step();
  }}

  async function claimWeeklyGachaMilestone(milestoneIndex) {{
    const student = getStudent();
    if (!student) return;
    const milestone = HOK_WEEKLY_MILESTONES[milestoneIndex];
    if (!milestone) return;

    const weeklyPulls = Math.max(0, Math.floor(Number(student.weeklyGachaPulls || 0)));
    if (weeklyPulls < milestone.pulls) {{
      showToast(`本周累计召唤未达到 ${{milestone.pulls}} 次，无法领取！`);
      return;
    }}

    if (!Array.isArray(student.claimedGachaMilestones)) student.claimedGachaMilestones = [];
    if (student.claimedGachaMilestones.includes(milestoneIndex)) {{
      showToast('该里程宝箱已经领取过了！');
      return;
    }}

    const snapshot = cloneStudentState(student);
    student.claimedGachaMilestones.push(milestoneIndex);
    student.coins = Number(student.coins || 0) + (milestone.coins || 0);

    const saved = await commitStudentState(student, snapshot, {{
      type: 'gachaMilestoneClaim',
      milestoneIndex,
      rewardCoins: milestone.coins
    }}, () => {{
      renderAppShell();
      renderCharactersView();
    }});

    if (saved) {{
      playAudioFx('victory');
      showToast(`🎉 成功领取 ${{milestone.label}} 里程奖励：+${{milestone.coins}} 金币！`);
    }}
  }}

  function selectHeroShowcase(roleId) {{
    selectedHeroId = roleId;
    renderCharactersView(activeSeriesFilter);
  }}

  async function triggerHeroGacha(pullType = 'single') {{
    const student = getStudent();
    if (!student || heroGachaLocked) return false;
    const cost = pullType === 'ten' ? 270 : 60;
    const currentCoins = Number(student.coins || 0);

    if (currentCoins < cost) {{
      showToast(`金币不足！抽卡需要 ${{cost}} 金币，当前拥有 ${{currentCoins}} 金币。`);
      return false;
    }}

    const snapshot = cloneStudentState(student);
    student.coins = currentCoins - cost;
    if (!Array.isArray(student.ownedPets)) student.ownedPets = [student.petType || 'sunny-wing'];
    const pulls = pullType === 'ten' ? 5 : 1;
    student.weeklyGachaPulls = (Number(student.weeklyGachaPulls || 0)) + pulls;

    const heroPool = HERO_GACHA_PET_IDS.map(id => getPetInfo(id)).filter(Boolean);
    const equipmentPool = HERO_GACHA_EQUIPMENT_IDS.map(id => EQUIPMENT_CATALOG.find(item => item.id === id)).filter(Boolean);
    const rewards = {{ pets: [], items: [], coins: 0 }};
    let pulledHero = false;
    let winningHeroId = '';

    heroGachaLocked = true;
    document.querySelectorAll('.gacha-pull-btn').forEach(button => {{ button.disabled = true; }});

    try {{
      for (let index = 0; index < pulls; index += 1) {{
        const pity = Math.max(0, Math.floor(Number(student.heroGachaPity || 0)));
        const guaranteedHero = pity >= HERO_GACHA_PITY_LIMIT - 1 || (pulls === 10 && index === pulls - 1 && !pulledHero) || (pulls >= 5 && index === pulls - 1 && !pulledHero && Math.random() < 0.25);
        if (guaranteedHero || Math.random() < HERO_GACHA_PET_RATE) {{
          const hero = pickRandomEntry(heroPool);
          if (!hero) continue;
          pulledHero = true;
          winningHeroId = hero.id;
          student.heroGachaPity = 0;
          if (!student.ownedPets.includes(hero.id)) {{
            grantPetToStudent(student, hero, {{ needsNaming: true }});
            rewards.pets.push({{ id: hero.id, name: hero.name, image: withAssetVersion(hero.image), rarity: hero.rarity }});
          }} else {{
            rewards.coins += 80;
          }}
          continue;
        }}

        student.heroGachaPity = pity + 1;
        const item = pickRandomEntry(equipmentPool);
        if (item && grantItemToStudent(student, item)) {{
          rewards.items.push({{ id: item.id, name: getEquipmentDisplayName(item), image: withAssetVersion(item.image), petId: item.exclusivePetId }});
        }} else {{
          rewards.coins += 20;
        }}
      }}

      student.coins += rewards.coins;

      // Determine target slot on the 14-grid wheel
      let targetSlot = 7; // default to gold coins slot
      if (winningHeroId) {{
        const found = HOK_GACHA_SLOTS.findIndex(s => s.petId === winningHeroId);
        if (found !== -1) targetSlot = found;
      }} else if (rewards.items.length) {{
        targetSlot = 13; // S-grade titanium blade slot
      }} else {{
        targetSlot = pickRandomEntry([3, 4, 6, 7, 8, 10, 11]);
      }}

      // Execute Marquee circular animation!
      await new Promise(resolve => {{
        runHeroGachaMarquee(targetSlot, resolve);
      }});

      const saved = await commitStudentState(student, snapshot, {{
        type: 'heroGacha', pullType, cost,
        heroIds: rewards.pets.map(pet => pet.id),
        itemIds: rewards.items.map(item => item.id),
        duplicateCoins: rewards.coins
      }}, () => {{
        renderAppShell();
        renderCharactersView();
      }});

      if (!saved) return false;
      playAudioFx(rewards.pets.length ? 'victory' : 'reward');
      const newHeroId = rewards.pets[0]?.id || '';
      showGiftClaimModal({{
        title: rewards.pets.length ? 'SSR 英雄降临！' : (pulledHero ? 'SSR 重复奖励！' : '装备召唤完成！'),
        message: rewards.pets.length
          ? `恭喜获得 ${{rewards.pets.map(pet => pet.name).join('、')}}！已放入宠物空间。`
          : (pulledHero ? `重复英雄已自动转换成 ${{rewards.coins}} 金币。` : '本次获得的装备已经保存到对应宠物的装备栏。'),
        rewards,
        onClose: newHeroId ? () => openPetRenameModal(newHeroId) : null
      }});
      return true;
    }} finally {{
      heroGachaLocked = false;
      document.querySelectorAll('.gacha-pull-btn').forEach(button => {{ button.disabled = false; }});
      renderCharactersView();
    }}
  }}

  // =========================================================
  // 3. EDUVERSE PVP DUEL ARENA BATTLE CONTROLLER
  // =========================================================
  let activeDuel = null;
  let battleQuizTimerId = null;
  let pendingDuelConfig = null;

  const DUEL_SCENES = Object.freeze({{
    'magic-academy': {{ id: 'magic-academy', name: '星辉魔法学院', image: 'assets/duel-scenes/magic-academy-arena.jpg' }},
    'lava-temple': {{ id: 'lava-temple', name: '炽热熔岩神殿', image: 'assets/duel-scenes/lava-temple-arena.jpg' }},
    'neon-city': {{ id: 'neon-city', name: '赛博霓虹都市', image: 'assets/duel-scenes/neon-city-arena.jpg' }},
    'dinosaur-jungle': {{ id: 'dinosaur-jungle', name: '史前巨兽丛林', image: 'assets/duel-scenes/dinosaur-jungle-arena.jpg' }}
  }});

  function getDuelPetUltimate(pet, student = null) {{
    const skills = Array.isArray(pet?.skills) ? pet.skills : [];
    const skill = skills.find(entry => entry.id === 'ultimate') || skills[skills.length - 1] || null;
    const evolved = Boolean(student && getActivePetEvolutionForm(student) !== PET_EVOLUTION_FORM_ORIGINAL);
    return {{
      name: skill?.name || `${{pet?.name || '宠物'}}终极技能`,
      description: skill?.explanation || '消耗 50 MP，释放宠物的专属终极攻击。',
      image: withAssetVersion((evolved ? skill?.afterImage : skill?.beforeImage) || skill?.image || '')
    }};
  }}

  function getDuelPetArt(student, petId = student?.petType) {{
    const pet = getPetInfo(petId);
    if (!pet) return '';
    const sprite = getPetQStyleImage(pet);
    if (sprite) return withAssetVersion(sprite);
    const source = student
      ? getPetRecordDisplayImage(student, petId)
      : getVersionedRoleCardAsset(pet.image);
    if (source) return getRolePreviewAsset(source);
    return getRolePreviewAsset(pet.image || '');
  }}

{step_1139_code}

  function openDuelScenePicker(config) {{
    pendingDuelConfig = {{ ...config }};
    document.getElementById('duel-scene-modal')?.classList.remove('hidden');
  }}

  function closeDuelScenePicker() {{
    pendingDuelConfig = null;
    document.getElementById('duel-scene-modal')?.classList.add('hidden');
  }}

  function selectDuelScene(sceneId) {{
    const scene = DUEL_SCENES[sceneId];
    if (!scene || !pendingDuelConfig) return false;
    const config = {{ ...pendingDuelConfig, sceneId: scene.id }};
    closeDuelScenePicker();
    initDuelSession(config);
    return true;
  }}

  function buildDuelStats(student, petId, fallbackLevel = 1, fallbackCp = 0) {{
    const pet = getPetInfo(petId) || {{ baseStats: {{ hp: 100, attack: 10, defense: 10, speed: 10, luck: 10 }} }};
    const level = student ? getLevelInfo(student).level : Math.max(1, Number(fallbackLevel || 1));
    const combat = student ? getCombatState(student) : null;
    const stats = combat?.stats || pet.baseStats;
    return {{
      maxHp: Math.max(200, Math.round((stats.hp || 100) * 3 + level * 30)),
      atk: Math.max(20, Math.round((stats.attack || 15) * 2 + level * 5)),
      def: Math.max(10, Math.round((stats.defense || 10) * 1.5 + level * 3)),
      spd: Math.max(10, Math.round((stats.speed || 10) * 1.2 + level * 2)),
      luk: Math.max(10, Math.round((stats.luck || 10) * 1.2 + level * 2)),
      level,
      cp: Math.max(1, Number(combat?.power || fallbackCp || 1))
    }};
  }}

  function renderDuelFighterArt(target, fighter) {{
    if (!target) return;
    target.innerHTML = fighter.image
      ? `<img src="${{escapeHtml(fighter.image)}}" alt="${{escapeHtml(fighter.petName)}}" decoding="async" onerror="this.style.display='none';this.nextElementSibling?.classList.remove('hidden');" /><span class="fighter-emoji-fallback hidden">${{escapeHtml(getPetInfo(fighter.petId)?.icon || '🌟')}}</span>`
      : `<span class="fighter-emoji-fallback">${{escapeHtml(getPetInfo(fighter.petId)?.icon || '🌟')}}</span>`;
  }}

  async function renderDuelLobby() {{
    const listEl = document.getElementById('duel-friends-list');
    if (!listEl) return;
    const student = getStudent();
    const previewEl = document.getElementById('duel-player-preview');
    if (previewEl && student?.petType) {{
      const pet = getPetInfo(student.petType);
      const level = getLevelInfo(student);
      const combat = getCombatState(student);
      const image = getDuelPetArt(student);
      const ultimate = getDuelPetUltimate(pet, student);
      const rawFallback = getVersionedRoleCardAsset(pet?.evolvedImage) || getVersionedRoleCardAsset(pet?.image) || '';
      const rarityBadge = pet?.rarity ? `<span class="duel-rarity-pill rarity-${{escapeHtml(pet.rarity.toLowerCase())}}">✦ ${{escapeHtml(pet.rarity)}}</span>` : '';
      const petDisplayName = escapeHtml(getPetFullDisplayName(student) || pet?.name || '我的宠物');
      previewEl.innerHTML = `<div class="duel-preview-art ${{pet?.rarity ? `rarity-${{escapeHtml(pet.rarity.toLowerCase())}}` : ''}}">${{image ? `<img src="${{escapeHtml(image)}}" alt="${{petDisplayName}}" decoding="async" onerror="if(!this.dataset.fallbackTried && '${{escapeHtml(rawFallback)}}'){{this.dataset.fallbackTried='1';this.src='${{escapeHtml(rawFallback)}}';}}else{{this.style.display='none';this.nextElementSibling?.classList.remove('hidden');}}" /><span class="fighter-emoji-fallback hidden">${{escapeHtml(pet?.icon || '🌟')}}</span>` : `<span class="fighter-emoji-fallback">${{escapeHtml(pet?.icon || '🌟')}}</span>`}}</div>
        <div class="duel-preview-copy"><div class="duel-ready-row"><span class="duel-ready-pill">READY · 当前出战</span>${{rarityBadge}}</div><h3>${{petDisplayName}}</h3><p>${{escapeHtml(student.studentName || student.studentId)}} · ${{level.max ? 'MAX 999' : `Lv.${{level.level}}`}} · ${{escapeHtml(getPetEvolutionStageLabel(student))}}</p><div class="duel-preview-stats"><b>⚔️ ${{escapeHtml(String(combat.power))}}</b><span>❤️ ${{escapeHtml(String(Math.round(combat.stats.hp)))}}</span><span>🗡️ ${{escapeHtml(String(Math.round(combat.stats.attack)))}}</span><span>🛡️ ${{escapeHtml(String(Math.round(combat.stats.defense)))}}</span></div><small>终极技能：${{escapeHtml(ultimate.name)}}</small></div>`;
    }}
    if (!canUseFriendsBackend(student)) {{
      listEl.innerHTML = '<div class="empty-state compact-empty">请先用真实学生账号登录并连接 Supabase，才能读取好友。</div>';
      return;
    }}
    listEl.innerHTML = '<div class="empty-state compact-empty">正在读取真实好友...</div>';
    await loadFriendsDashboard();
    if (!friendState.friends.length) {{
      listEl.innerHTML = '<div class="empty-state compact-empty">还没有可对决的好友。请先到“好友”页面添加真实同学。</div>';
      return;
    }}
    listEl.innerHTML = friendState.friends.map(opp => {{
      const preview = buildFriendPreviewStudent(opp);
      const pet = getPetInfo(preview.petType);
      const image = getDuelPetArt(preview);
      const rawOppFallback = pet ? (getVersionedRoleCardAsset(pet.evolvedImage) || getVersionedRoleCardAsset(pet.image) || '') : '';
      const oppPetDisplayName = escapeHtml(getPetFullDisplayName(preview) || pet?.name || '好友宠物');
      const level = pet ? getLevelInfo(preview) : null;
      const combat = pet ? getCombatState(preview) : null;
      return `
      <div class="duel-friend-item" onclick="window.__eduverseApp.startFriendDuel('${{escapeHtml(opp.studentId)}}')">
        <span class="friend-duel-avatar">${{image ? `<img src="${{escapeHtml(image)}}" alt="${{oppPetDisplayName}}" loading="lazy" decoding="async" onerror="if(!this.dataset.fallbackTried && '${{escapeHtml(rawOppFallback)}}'){{this.dataset.fallbackTried='1';this.src='${{escapeHtml(rawOppFallback)}}';}}else{{this.style.display='none';this.nextElementSibling?.classList.remove('hidden');}}" /><span class="friend-duel-avatar-fallback hidden">${{escapeHtml(pet?.icon || '🌟')}}</span>` : escapeHtml(pet?.icon || '🌟')}}</span>
        <div class="friend-duel-info">
          <strong>${{escapeHtml(opp.studentName || opp.studentId)}}</strong>
          <small>${{pet ? `${{escapeHtml(getPetFullDisplayName(preview) || pet.name)}} · ${{level.max ? 'MAX 999' : `Lv.${{level.level}}`}} · ⚔️ ${{escapeHtml(String(combat.power))}}` : '尚未选择出战宠物'}} · ${{escapeHtml(opp.studentId)}}</small>
        </div>
        <button type="button" class="primary-button compact-button action-glow-button">发起决斗 ⚔️</button>
      </div>
    `;
    }}).join('');
  }}

  async function startFriendDuel(friendId) {{
    const student = getStudent();
    if (!student?.petType) {{
      showToast('你还没有选择出战宠物，无法发起决斗！');
      return false;
    }}
    const opp = friendState.friends.find(f => f.studentId === friendId);
    if (!opp || !opp.petType) {{
      showToast('该好友尚未配置出战宠物！');
      return false;
    }}
    const level = getLevelInfo(opp);
    const combat = getCombatState(opp);
    openDuelScenePicker({{
      p2Name: opp.studentName || friendId,
      p2PetId: opp.petType,
      p2Level: level.level,
      p2Cp: combat.power,
      p2Student: opp,
      mode: 'friend-shadow'
    }});
    return true;
  }}

  function startBossDuel(bossId) {{
    const bosses = {{
      pikachu: {{ name: '赤红的【皮卡丘】', petId: 'pikachu', level: 15, avatar: '⚡', cp: 1280 }},
      charizard: {{ name: '烈焰【喷火龙】', petId: 'charizard', level: 20, avatar: '🔥', cp: 1850 }},
      enderdragon: {{ name: '末影【黑龙神】', petId: 'enderdragon', level: 25, avatar: '🐉', cp: 2600 }},
      mewtwo: {{ name: '终极【超梦之影】', petId: 'mewtwo', level: 30, avatar: '🔮', cp: 3400 }}
    }};
    const b = bosses[bossId] || bosses.pikachu;
    openDuelScenePicker({{
      p2Name: b.name,
      p2PetId: b.petId,
      p2Level: b.level,
      p2Avatar: b.avatar,
      p2Cp: b.cp,
      mode: 'boss'
    }});
  }}

  function restartDuelBattle() {{
    if (!activeDuel?.config) return;
    initDuelSession(activeDuel.config);
  }}

  function initDuelSession(config) {{
    const student = getStudent() || {{}};
    const playerPetId = student.petType || 'sunny-wing';
    const playerPetInfo = getPetInfo(playerPetId) || {{ name: '我的角色', baseStats: {{ hp: 120, attack: 20, defense: 15 }} }};
    const oppPetInfo = getPetInfo(config.p2PetId) || {{ name: '对手', baseStats: {{ hp: 120, attack: 20, defense: 15 }} }};
    const p1Stats = buildDuelStats(student, playerPetId);
    const p2Stats = buildDuelStats(config.p2Student || null, config.p2PetId, config.p2Level, config.p2Cp);

{step_1147_code}

{step_1153_code}

"""

prefix = code[:code.index(start_marker)]
suffix = code[code.index(end_marker):]

# Update window.__eduverseApp export
new_suffix = suffix.replace(
    "    triggerHeroGacha,\n    startFriendDuel,",
    "    triggerHeroGacha,\n    claimWeeklyGachaMilestone,\n    openGachaRuleModal,\n    selectDuelScene,\n    closeDuelScenePicker,\n    restartDuelBattle,\n    startFriendDuel,"
)

final_code = prefix + new_eduverse_section + new_suffix

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(final_code)

print("Successfully assembled app.js! New length:", len(final_code))
