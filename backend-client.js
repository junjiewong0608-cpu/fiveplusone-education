(() => {
  'use strict';

  const CANONICAL_STUDENT_ID_MAP = Object.freeze({
    CY9657: 'CY0005',
    CY1006: 'CY0006',
    CY1003: 'CY0003',
    CY1004: 'CY0004',
    CY1007: 'CY0017',
    CY1008: 'CY0011',
    CY1009: 'CY0012',
    CY1010: 'CY0014'
  });

  const CANONICAL_STUDENT_NAME_MAP = Object.freeze({
    CY0005: 'Student A',
    CY0006: 'Student B',
    CY0003: 'Teacher C',
    CY0004: 'Teacher D',
    CY0017: 'Student C',
    CY0011: 'Teacher E',
    CY0012: 'Teacher J',
    CY0002: 'Teacher B',
    CY0013: 'Teacher F',
    CY0014: 'Teacher G'
  });

  function normalizeId(value) {
    const id = String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    return CANONICAL_STUDENT_ID_MAP[id] || id;
  }

  function getCanonicalStudentName(studentId, fallback = '', options = {}) {
    const id = normalizeId(studentId);
    const customName = String(fallback || '').trim();
    if (options && options.allowCustom && customName && customName !== id) return customName;
    return CANONICAL_STUDENT_NAME_MAP[id] || String(fallback || '').trim() || id;
  }

  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function toBoolean(value, fallback = false) {
    if (typeof value === 'boolean') return value;
    if (value == null || value === '') return fallback;
    const text = String(value).trim().toLowerCase();
    if (['true', '1', 'yes', 'y'].includes(text)) return true;
    if (['false', '0', 'no', 'n'].includes(text)) return false;
    return fallback;
  }

  function normalizeEvolutionStyle(value) {
    const style = String(value || '').trim();
    return style === 'cute' || style === 'heroic' ? style : '';
  }

  function normalizeEvolutionForm(value) {
    const form = String(value || '').trim();
    return ['original', 'mini', 'cute', 'heroic'].includes(form) ? form : '';
  }

  function normalizeInteractionRoomPetSize(value) {
    const size = String(value || '').trim().toLowerCase();
    return ['small', 'big', 'super'].includes(size) ? size : 'small';
  }

  function normalizeInteractionRoomPetStage(value) {
    const stage = String(value || '').trim().toLowerCase();
    return ['base', 'mini', 'final'].includes(stage) ? stage : 'base';
  }

  function normalizeInteractionRoomPetStyle(value) {
    const style = String(value || '').trim().toLowerCase();
    return style === 'cute' ? 'cute' : 'heroic';
  }

  function parseJsonField(value, fallback) {
    if (value == null || value === '') return fallback;
    if (typeof value !== 'string') return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function normalizeStringArrayField(value, fallback = []) {
    const parsed = parseJsonField(value, fallback);
    const source = Array.isArray(parsed)
      ? parsed
      : (typeof parsed === 'string' ? parsed.split(/[,\s]+/) : fallback);
    return Array.from(new Set(source
      .map(item => String(item || '').trim())
        .filter(Boolean)));
  }

  function normalizeMiniGameHighScores(...values) {
    const readScore = (source, key, alias) => Math.max(
      0,
      Math.floor(toNumber(source[key], toNumber(source[alias], 0)))
    );
    return values.reduce((merged, value) => {
      const parsed = parseJsonField(value, {});
      const source = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
      return {
        reaction: Math.max(merged.reaction, readScore(source, 'reaction', 'wheel')),
        flappy: Math.max(merged.flappy, readScore(source, 'flappy', 'jump')),
        runner: Math.max(merged.runner, readScore(source, 'runner', 'run')),
        jumpCharge: Math.max(
          merged.jumpCharge,
          readScore(source, 'jumpCharge', 'jump_charge'),
          readScore(source, 'wechatJump', 'wechat_jump')
        )
      };
    }, { reaction: 0, flappy: 0, runner: 0, jumpCharge: 0 });
  }

  function getAccountResetMarker(profile) {
    return String(profile?.accountResetAt || profile?.account_reset_at || '').trim();
  }

  function shouldIgnoreExistingProfileAfterReset(sheetStudent, existingProfile) {
    const remoteResetAt = getAccountResetMarker(sheetStudent);
    if (!remoteResetAt) return false;
    return getAccountResetMarker(existingProfile) !== remoteResetAt;
  }

  function normalizeStudent(sheetStudent = {}, classes = [], existingProfile = {}) {
    if (!sheetStudent || typeof sheetStudent !== 'object') sheetStudent = {};
    if (!existingProfile || typeof existingProfile !== 'object') existingProfile = {};
    if (shouldIgnoreExistingProfileAfterReset(sheetStudent, existingProfile)) existingProfile = {};
    const studentId = normalizeId(sheetStudent.studentId || existingProfile.studentId);
    const activeClasses = Array.isArray(classes) ? classes : [];
    const primaryClass = activeClasses.find(item => String(item?.status || 'active') !== 'archived') || activeClasses[0] || {};
    const sheetHasCustomName = Boolean(String(sheetStudent.profileNameUpdatedAt || '').trim());
    const existingHasCustomName = Boolean(String(existingProfile.profileNameUpdatedAt || '').trim());
    const customName = sheetHasCustomName
      ? String(sheetStudent.studentName || sheetStudent.name || '').trim()
      : (existingHasCustomName ? String(existingProfile.studentName || existingProfile.name || '').trim() : '');
    const rawStudentName = String(customName || sheetStudent.studentName || sheetStudent.name || existingProfile.studentName || existingProfile.name || studentId || '').trim();
    const studentName = getCanonicalStudentName(studentId, rawStudentName, { allowCustom: sheetHasCustomName || existingHasCustomName });
    const petType = String(sheetStudent.petType || existingProfile.petType || '').trim();
    const ownedItems = parseJsonField(sheetStudent.ownedItems, existingProfile.ownedItems || []);
    const equippedItems = parseJsonField(sheetStudent.equippedItems, existingProfile.equippedItems || {});
    const sheetOwnedPets = parseJsonField(sheetStudent.ownedPets, null);
    const ownedPets = Array.isArray(sheetOwnedPets)
      ? [...sheetOwnedPets]
      : (Array.isArray(existingProfile.ownedPets) ? [...existingProfile.ownedPets] : []);
    const petCollection = parseJsonField(sheetStudent.petCollection, existingProfile.petCollection || {});
    const evolvedPets = parseJsonField(sheetStudent.evolvedPets, existingProfile.evolvedPets || {});
    const petRoomDecorations = parseJsonField(sheetStudent.petRoomDecorations, existingProfile.petRoomDecorations || []);
    const collectionTitles = parseJsonField(sheetStudent.collectionTitles, existingProfile.collectionTitles || {});
    const pendingBlindBoxDuplicates = parseJsonField(sheetStudent.pendingBlindBoxDuplicates, existingProfile.pendingBlindBoxDuplicates || []);
    const checkins = parseJsonField(sheetStudent.checkins, existingProfile.checkins || []);
    const teacherRewards = parseJsonField(sheetStudent.teacherRewards, existingProfile.teacherRewards || []);
    const dailyLoginGifts = parseJsonField(sheetStudent.dailyLoginGifts, existingProfile.dailyLoginGifts || []);
    const evolutionStylePreference = normalizeEvolutionStyle(sheetStudent.evolutionStylePreference || existingProfile.evolutionStylePreference);
    const activeEvolutionForm = normalizeEvolutionForm(
      sheetStudent.activeEvolutionForm
      || sheetStudent.active_evolution_form
      || existingProfile.activeEvolutionForm
      || existingProfile.active_evolution_form
    );
    const ownedMusicTracks = normalizeStringArrayField(
      sheetStudent.ownedMusicTracks || sheetStudent.ownedMusicTrackIds || sheetStudent.owned_music_tracks,
      normalizeStringArrayField(existingProfile.ownedMusicTracks || existingProfile.ownedMusicTrackIds || existingProfile.owned_music_tracks, [])
    );
    const activeMusicTrack = String(
      sheetStudent.activeMusicTrack
      || sheetStudent.activeMusicTrackId
      || sheetStudent.active_music_track
      || existingProfile.activeMusicTrack
      || existingProfile.activeMusicTrackId
      || existingProfile.active_music_track
      || ''
    ).trim();
    const miniGameHighScores = normalizeMiniGameHighScores(
      existingProfile.miniGameHighScores || existingProfile.mini_game_scores,
      sheetStudent.miniGameHighScores || sheetStudent.mini_game_scores
    );
    if (petType && !ownedPets.includes(petType)) ownedPets.push(petType);

    return {
      ...existingProfile,
      ...sheetStudent,
      studentId,
      studentName,
      name: studentName,
      branch: String(sheetStudent.branch || existingProfile.branch || '').trim(),
      className: String(primaryClass.className || sheetStudent.className || sheetStudent.classNameLegacy || existingProfile.className || '').trim(),
      avatar: String(sheetStudent.avatar || existingProfile.avatar || '🌟'),
      petName: String(sheetStudent.petName || existingProfile.petName || ''),
      petBirthday: String(sheetStudent.petBirthday || existingProfile.petBirthday || ''),
      petType,
      petRarity: String(sheetStudent.petRarity || existingProfile.petRarity || 'A').trim() || 'A',
      petLevel: Math.max(1, Math.floor(toNumber(sheetStudent.petLevel, existingProfile.petLevel || 1))),
      experience: Math.max(0, toNumber(sheetStudent.experience, existingProfile.experience || 0)),
      coins: Math.max(0, toNumber(sheetStudent.coins, existingProfile.coins || 0)),
      totalStars: Math.max(0, toNumber(sheetStudent.totalStars, existingProfile.totalStars || 0)),
      streak: Math.max(0, toNumber(sheetStudent.streak, existingProfile.streak || 0)),
      lastCheckinDate: String(sheetStudent.lastCheckinDate || existingProfile.lastCheckinDate || ''),
      ownedItems: Array.isArray(ownedItems) ? ownedItems : [],
      equippedItems: equippedItems && typeof equippedItems === 'object' && !Array.isArray(equippedItems) ? equippedItems : {},
      status: String(sheetStudent.status || existingProfile.status || 'active'),
      classes: activeClasses,
      demoMode: false,
      checkins: Array.isArray(checkins) ? checkins : [],
      teacherRewards: Array.isArray(teacherRewards) ? teacherRewards : [],
      ownedPets,
      petCollection: petCollection && typeof petCollection === 'object' && !Array.isArray(petCollection) ? petCollection : {},
      evolvedPets: evolvedPets && typeof evolvedPets === 'object' && !Array.isArray(evolvedPets) ? evolvedPets : {},
      petRoomDecorations: Array.isArray(petRoomDecorations) ? petRoomDecorations : [],
      blindBoxes: Math.max(0, Math.floor(toNumber(sheetStudent.blindBoxes, existingProfile.blindBoxes || 0))),
      ownedMusicTracks,
      activeMusicTrack,
      miniGameHighScores,
      collectionTitles: collectionTitles && typeof collectionTitles === 'object' && !Array.isArray(collectionTitles) ? collectionTitles : {},
      drawnCollectionTitle: String(sheetStudent.drawnCollectionTitle || existingProfile.drawnCollectionTitle || ''),
      titleDrawAvailable: toBoolean(sheetStudent.titleDrawAvailable, Boolean(existingProfile.titleDrawAvailable)),
      titleDrawCompleted: toBoolean(sheetStudent.titleDrawCompleted, Boolean(existingProfile.titleDrawCompleted)),
      dailyLoginGifts: Array.isArray(dailyLoginGifts) ? dailyLoginGifts : [],
      lastDailyLoginGiftDate: String(sheetStudent.lastDailyLoginGiftDate || existingProfile.lastDailyLoginGiftDate || ''),
      lastDailyLoginGiftAmount: Math.max(0, toNumber(sheetStudent.lastDailyLoginGiftAmount, existingProfile.lastDailyLoginGiftAmount || 0)),
      pendingBlindBoxDuplicates: Array.isArray(pendingBlindBoxDuplicates) ? pendingBlindBoxDuplicates : [],
      evolutionStylePreference,
      activeEvolutionForm: activeEvolutionForm || 'original',
      petEvolved: toBoolean(sheetStudent.petEvolved, Boolean(existingProfile.petEvolved)),
      petDrawsAvailable: Math.max(0, toNumber(sheetStudent.petDrawsAvailable, existingProfile.petDrawsAvailable || 0)),
      evolutionReady: toBoolean(sheetStudent.evolutionReady, Boolean(existingProfile.evolutionReady)),
      exclusiveEvolutionReady: toBoolean(sheetStudent.exclusiveEvolutionReady, Boolean(existingProfile.exclusiveEvolutionReady)),
      petItemsMigrated: toBoolean(sheetStudent.petItemsMigrated, Boolean(existingProfile.petItemsMigrated)),
      equipmentExperienceMigrated: toBoolean(sheetStudent.equipmentExperienceMigrated, Boolean(existingProfile.equipmentExperienceMigrated)),
      dailyCheckinGuideLastSeenDate: String(sheetStudent.dailyCheckinGuideLastSeenDate || existingProfile.dailyCheckinGuideLastSeenDate || ''),
      dailyCheckinGuideLastSeenAt: String(sheetStudent.dailyCheckinGuideLastSeenAt || existingProfile.dailyCheckinGuideLastSeenAt || '')
    };
  }

  function getBackendMode(config = {}) {
    return String(config.backendMode || 'local').trim().toLowerCase();
  }

  function isGasMode(config = {}) {
    const mode = getBackendMode(config);
    return (mode === 'gas' || mode === 'hybrid') && Boolean(config.backendUrl);
  }

  function isSupabaseMode(config = {}) {
    const mode = getBackendMode(config);
    const functionUrl = String(config.supabaseFunctionUrl || '').trim();
    const anonKey = String(config.supabaseAnonKey || '').trim();
    return (mode === 'supabase' || mode === 'hybrid')
      && Boolean(functionUrl)
      && Boolean(anonKey)
      && !functionUrl.includes('YOUR_SUPABASE_PROJECT_REF')
      && !anonKey.includes('YOUR_PUBLIC_FUNCTION_KEY');
  }

  function hasRemoteBackend(config = {}) {
    return isGasMode(config) || isSupabaseMode(config);
  }

  function createClient(config = {}, fetchImpl) {
    const fetcher = fetchImpl || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    const configuredTimeoutMs = Number(config.requestTimeoutMs);
    const timeoutMs = Number.isFinite(configuredTimeoutMs) && configuredTimeoutMs > 0 ? configuredTimeoutMs : 30000;
    const configuredRetryCount = Number(config.requestRetryCount);
    const retryCount = Number.isFinite(configuredRetryCount) && configuredRetryCount >= 0 ? Math.floor(configuredRetryCount) : 2;
    const configuredRetryDelayMs = Number(config.requestRetryDelayMs);
    const retryDelayMs = Number.isFinite(configuredRetryDelayMs) && configuredRetryDelayMs >= 0 ? configuredRetryDelayMs : 500;
    const configuredSupabaseTimeoutMs = Number(config.supabaseRequestTimeoutMs);
    const supabaseTimeoutMs = Number.isFinite(configuredSupabaseTimeoutMs) && configuredSupabaseTimeoutMs > 0 ? configuredSupabaseTimeoutMs : Math.min(timeoutMs, 12000);
    const supabaseFunctionUrl = String(config.supabaseFunctionUrl || '').trim();
    const supabaseAnonKey = String(config.supabaseAnonKey || '').trim();
    const interactionRoomApiUrl = String(config.interactionRoomApiUrl || '/api/redis-room').trim();
    const configuredInteractionRoomTimeoutMs = Number(config.interactionRoomRequestTimeoutMs);
    const interactionRoomTimeoutMs = Number.isFinite(configuredInteractionRoomTimeoutMs) && configuredInteractionRoomTimeoutMs > 0 ? configuredInteractionRoomTimeoutMs : 8000;
    const interactionRoomFallbackCooldownMs = 60000;
    let interactionRoomFallbackOnlyUntil = 0;

    function wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function hasSupabaseJwtClockSkewError(...values) {
      return values.some(value => /PGRST303|JWT issued at future/i.test(String(value || '')));
    }

    function isSupabaseJwtClockSkewResult(result = {}) {
      if (!result || typeof result !== 'object') return false;
      return hasSupabaseJwtClockSkewError(result.error, result.message, result.details, result.errorCode);
    }

    function isRetryableResult(result = {}) {
      return Boolean(result.retryable || isSupabaseJwtClockSkewResult(result));
    }

    function isTemporaryGoogleEcho404(response) {
      const url = String(response && response.url || '');
      return response && response.status === 404 && url.includes('script.googleusercontent.com/macros/echo');
    }

    function stripTransportFields(result) {
      if (!result || typeof result !== 'object') return result;
      const clean = { ...result };
      delete clean.retryable;
      delete clean.fallbackAllowed;
      return clean;
    }

    function canFallbackToGas(result = {}) {
      return Boolean(
        result.retryable
        || result.fallbackAllowed
        || isSupabaseJwtClockSkewResult(result)
        || result.errorCode === 'SUPABASE_NOT_CONFIGURED'
        || result.errorCode === 'SUPABASE_FUNCTION_ERROR'
        || result.errorCode === 'STUDENT_NOT_FOUND'
      );
    }

    async function requestGasOnce(action, payload = {}) {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

      try {
        const response = await fetcher(config.backendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ ...payload, action }),
          signal: controller ? controller.signal : undefined
        });
        const text = await response.text();
        if (!response.ok) {
          const retryable = response.status === 429 || response.status >= 500 || isTemporaryGoogleEcho404(response);
          return { ok: false, retryable, error: `Google Sheet 连接失败（${response.status}）` };
        }
        try {
          return JSON.parse(text);
        } catch (error) {
          return { ok: false, retryable: true, error: 'Google Sheet 暂时没有回传正确资料，请刷新页面后再试。' };
        }
      } catch (error) {
        if (error && error.name === 'AbortError') {
          return { ok: false, retryable: true, error: `读取超过 ${Math.round(timeoutMs / 1000)} 秒，请刷新页面后再试。` };
        }
        return { ok: false, retryable: true, error: `暂时连接不到 Google Sheet：${error && error.message ? error.message : error}` };
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    }

    async function requestSupabaseOnce(action, payload = {}) {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), supabaseTimeoutMs) : null;

      try {
        const response = await fetcher(supabaseFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify({ ...payload, action }),
          signal: controller ? controller.signal : undefined
        });
        const text = await response.text();
        if (!response.ok) {
          const retryable = response.status === 429 || response.status >= 500 || hasSupabaseJwtClockSkewError(text);
          return { ok: false, retryable, fallbackAllowed: retryable, error: `Supabase 暂时连接失败（${response.status}）` };
        }
        try {
          const result = JSON.parse(text);
          if (result && typeof result === 'object') {
            const retryable = Boolean(result.retryable || isSupabaseJwtClockSkewResult(result));
            return {
              source: 'supabase',
              ...result,
              retryable,
              fallbackAllowed: Boolean(result.fallbackAllowed || retryable)
            };
          }
          return { ok: false, retryable: true, fallbackAllowed: true, error: 'Supabase 暂时没有回传正确资料，请刷新页面后再试。' };
        } catch (error) {
          return { ok: false, retryable: true, fallbackAllowed: true, error: 'Supabase 暂时没有回传正确资料，请刷新页面后再试。' };
        }
      } catch (error) {
        if (error && error.name === 'AbortError') {
          return { ok: false, retryable: true, fallbackAllowed: true, error: `Supabase 读取超过 ${Math.round(supabaseTimeoutMs / 1000)} 秒，正在尝试备用通道。` };
        }
        return { ok: false, retryable: true, fallbackAllowed: true, error: `暂时连接不到 Supabase：${error && error.message ? error.message : error}` };
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    }

    async function requestWithRetry(requestOnce, action, payload = {}) {
      if (!fetcher) return { ok: false, error: 'Fetch is not available' };
      let lastResult = null;
      for (let attempt = 0; attempt <= retryCount; attempt += 1) {
        lastResult = await requestOnce(action, payload);
        if (lastResult.ok || !isRetryableResult(lastResult) || attempt >= retryCount) break;
        await wait(retryDelayMs * (attempt + 1));
      }
      return lastResult;
    }

    async function request(action, payload = {}) {
      const mode = getBackendMode(config);
      const canUseSupabase = isSupabaseMode(config);
      const canUseGas = isGasMode(config);

      if (!canUseSupabase && !canUseGas) return { ok: true, mode: 'local' };
      if (!fetcher) return { ok: false, error: 'Fetch is not available' };

      if (canUseSupabase) {
        const supabaseResult = await requestWithRetry(requestSupabaseOnce, action, payload);
        if (supabaseResult.ok) return stripTransportFields(supabaseResult);
        if (!(mode === 'hybrid' && canUseGas && canFallbackToGas(supabaseResult))) {
          return stripTransportFields(supabaseResult);
        }
        const gasResult = await requestWithRetry(requestGasOnce, action, payload);
        return { ...stripTransportFields(gasResult), fallbackFrom: 'supabase' };
      }

      const gasResult = await requestWithRetry(requestGasOnce, action, payload);
      return stripTransportFields(gasResult);
    }

    async function requestGas(action, payload = {}) {
      if (!isGasMode(config)) return { ok: false, error: 'Google Sheet 后端没有设置。' };
      if (!fetcher) return { ok: false, error: 'Fetch is not available' };
      return stripTransportFields(await requestWithRetry(requestGasOnce, action, payload));
    }

    async function requestSupabase(action, payload = {}) {
      if (!isSupabaseMode(config)) return { ok: false, error: 'Supabase 后端没有设置。' };
      if (!fetcher) return { ok: false, error: 'Fetch is not available' };
      return stripTransportFields(await requestWithRetry(requestSupabaseOnce, action, payload));
    }

    async function requestInteractionRoomOnce(action, payload = {}) {
      if (interactionRoomFallbackOnlyUntil && Date.now() < interactionRoomFallbackOnlyUntil) {
        return { ok: false, source: 'redis-room', retryable: true, fallbackAllowed: true, error: '互动区高速通道正在恢复，先使用备用通道。' };
      }
      if (!interactionRoomApiUrl) return { ok: false, retryable: true, fallbackAllowed: true, error: '互动区高速通道没有设置。' };
      if (!fetcher) return { ok: false, retryable: true, fallbackAllowed: true, error: 'Fetch is not available' };
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), interactionRoomTimeoutMs) : null;

      try {
        const response = await fetcher(interactionRoomApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, action }),
          signal: controller ? controller.signal : undefined
        });
        const text = await response.text();
        let result = null;
        try {
          result = JSON.parse(text);
        } catch (error) {
          result = { ok: false, retryable: true, fallbackAllowed: true, error: '互动区高速通道暂时没有回传正确资料。' };
        }
        if (!response.ok && result && typeof result === 'object') {
          return {
            ok: false,
            source: 'redis-room',
            retryable: response.status === 429 || response.status >= 500 || Boolean(result.retryable),
            fallbackAllowed: response.status === 429 || response.status >= 500 || Boolean(result.fallbackAllowed),
            error: result.error || `互动区高速通道连接失败（${response.status}）`
          };
        }
        return { source: 'redis-room', ...(result || {}) };
      } catch (error) {
        if (error && error.name === 'AbortError') {
          return { ok: false, source: 'redis-room', retryable: true, fallbackAllowed: true, error: `互动区高速通道超过 ${Math.round(interactionRoomTimeoutMs / 1000)} 秒。` };
        }
        return { ok: false, source: 'redis-room', retryable: true, fallbackAllowed: true, error: `暂时连接不到互动区高速通道：${error && error.message ? error.message : error}` };
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    }

    async function requestInteractionRoom(redisAction, fallbackAction, payload = {}) {
      if (getBackendMode(config) === 'local') return request(fallbackAction, payload);
      const redisResult = await requestInteractionRoomOnce(redisAction, payload);
      if (redisResult.ok) {
        if (redisResult.fallbackFrom === 'redis-room' && redisResult.source === 'supabase') {
          interactionRoomFallbackOnlyUntil = Date.now() + interactionRoomFallbackCooldownMs;
        }
        return stripTransportFields(redisResult);
      }
      if (!redisResult.fallbackAllowed) return stripTransportFields(redisResult);
      interactionRoomFallbackOnlyUntil = Date.now() + interactionRoomFallbackCooldownMs;
      const fallbackResult = await request(fallbackAction, payload);
      if (fallbackResult.ok) return { ...stripTransportFields(fallbackResult), fallbackFrom: 'redis-room' };
      return stripTransportFields(redisResult);
    }

    return {
      request,
      requestGas,
      requestSupabase,
      getStudent(studentId, options = {}) {
        const payload = { studentId: normalizeId(studentId) };
        if (options && options.includeClasses === false) payload.includeClasses = false;
        return request('getStudent', payload);
      },
      getStudentFromGas(studentId, options = {}) {
        const payload = { studentId: normalizeId(studentId) };
        if (options && options.includeClasses === false) payload.includeClasses = false;
        return requestGas('getStudent', payload);
      },
      saveStudentState(student, event = {}) {
        return request('saveStudentState', { studentId: normalizeId(student?.studentId), student, event });
      },
      registerStudent(profile = {}) {
        return requestSupabase('registerStudent', {
          studentId: normalizeId(profile.studentId),
          studentName: String(profile.studentName || profile.name || '').trim(),
          sincereFriendId: normalizeId(profile.sincereFriendId || profile.referrerId || profile.friendId)
        });
      },
      submitCheckin(record, student) {
        return request('submitCheckin', { record, studentId: normalizeId(student?.studentId || record?.studentId), student });
      },
      listTeacherClasses(teacherId) {
        return request('listTeacherClasses', { teacherId: normalizeId(teacherId) });
      },
      getClassStudents(teacherId, classId) {
        return request('getClassStudents', { teacherId: normalizeId(teacherId), classId: String(classId || '').trim() });
      },
      rewardStudents(payload = {}) {
        return request('rewardStudents', {
          ...payload,
          teacherId: normalizeId(payload.teacherId),
          classId: String(payload.classId || '').trim(),
          studentIds: Array.isArray(payload.studentIds) ? payload.studentIds.map(normalizeId).filter(Boolean) : []
        });
      },
      bulkImportStudents(payload = {}) {
        const body = {
          ...payload,
          teacherId: normalizeId(payload.teacherId),
          defaultBranch: String(payload.defaultBranch || '').trim(),
          defaultClassName: String(payload.defaultClassName || '').trim(),
          defaultTeacherId: normalizeId(payload.defaultTeacherId || payload.assignedTeacherId || payload.underTeacherId),
          rows: Array.isArray(payload.rows) ? payload.rows : []
        };
        return getBackendMode(config) === 'local'
          ? request('bulkImportStudents', body)
          : requestSupabase('bulkImportStudents', body);
      },
      listWallPosts() {
        return request('listWallPosts');
      },
      listLeaderboardStudents() {
        return request('listLeaderboardStudents');
      },
      createWallPost(post = {}) {
        return request('createWallPost', {
          post: {
            ...post,
            studentId: normalizeId(post.studentId)
          }
        });
      },
      likeWallPost(postId, studentId) {
        return request('likeWallPost', { postId: String(postId || ''), studentId: normalizeId(studentId) });
      },
      commentWallPost(postId, comment = {}) {
        return request('commentWallPost', {
          postId: String(postId || ''),
          comment: {
            ...comment,
            studentId: normalizeId(comment.studentId)
          }
        });
      },
      searchFriends(studentId, query) {
        return request('searchFriends', { studentId: normalizeId(studentId), query: String(query || '') });
      },
      sendFriendRequest(requesterStudentId, receiverStudentId) {
        return request('sendFriendRequest', {
          requesterStudentId: normalizeId(requesterStudentId),
          receiverStudentId: normalizeId(receiverStudentId)
        });
      },
      respondFriendRequest(studentId, requestId, response) {
        return request('respondFriendRequest', {
          studentId: normalizeId(studentId),
          requestId: String(requestId || ''),
          response: String(response || '')
        });
      },
      listFriends(studentId) {
        return request('listFriends', { studentId: normalizeId(studentId) });
      },
      getFriendProfile(studentId, friendId) {
        return request('getFriendProfile', { studentId: normalizeId(studentId), friendId: normalizeId(friendId) });
      },
      listNotifications(studentId) {
        return request('listNotifications', { studentId: normalizeId(studentId) });
      },
      sendGift(payload = {}) {
        return request('sendGift', {
          ...payload,
          senderStudentId: normalizeId(payload.senderStudentId),
          receiverStudentId: normalizeId(payload.receiverStudentId)
        });
      },
      sendBlindBoxDuplicateGift(payload = {}) {
        return request('sendBlindBoxDuplicateGift', {
          ...payload,
          senderStudentId: normalizeId(payload.senderStudentId),
          receiverStudentId: normalizeId(payload.receiverStudentId),
          duplicateId: String(payload.duplicateId || '')
        });
      },
      claimGift(studentId, giftId) {
        return request('claimGift', { studentId: normalizeId(studentId), giftId: String(giftId || '') });
      },
      markNotificationRead(studentId, notificationId) {
        return request('markNotificationRead', { studentId: normalizeId(studentId), notificationId: String(notificationId || '') });
      },
      clearReadNotifications(studentId) {
        return request('clearReadNotifications', { studentId: normalizeId(studentId) });
      },
      listRooms(studentId) {
        return request('listRooms', { studentId: normalizeId(studentId) });
      },
      listRoom(studentId, roomOwnerStudentId) {
        return request('listRoom', { studentId: normalizeId(studentId), roomOwnerStudentId: normalizeId(roomOwnerStudentId || studentId) });
      },
      joinRoomByCode(studentId, roomCode) {
        return request('joinRoomByCode', {
          studentId: normalizeId(studentId),
          roomCode: String(roomCode || '').trim().toUpperCase()
        });
      },
      requestRoomJoin(studentId, roomOwnerStudentId) {
        return request('requestRoomJoin', {
          studentId: normalizeId(studentId),
          roomOwnerStudentId: normalizeId(roomOwnerStudentId)
        });
      },
      respondRoomJoinRequest(studentId, roomOwnerStudentId, requesterStudentId, decision) {
        return request('respondRoomJoinRequest', {
          studentId: normalizeId(studentId),
          roomOwnerStudentId: normalizeId(roomOwnerStudentId || studentId),
          requesterStudentId: normalizeId(requesterStudentId),
          decision: String(decision || '').trim().toLowerCase()
        });
      },
      updateRoomScene(studentId, roomOwnerStudentId, sceneId) {
        return request('updateRoomScene', { studentId: normalizeId(studentId), roomOwnerStudentId: normalizeId(roomOwnerStudentId || studentId), sceneId: String(sceneId || '') });
      },
      updateRoomSettings(payload = {}) {
        return request('updateRoomSettings', {
          ...payload,
          studentId: normalizeId(payload.studentId),
          roomOwnerStudentId: normalizeId(payload.roomOwnerStudentId || payload.studentId),
          roomName: String(payload.roomName || ''),
          isClosed: Boolean(payload.isClosed)
        });
      },
      closeRoom(studentId, roomOwnerStudentId) {
        return request('closeRoom', {
          studentId: normalizeId(studentId),
          roomOwnerStudentId: normalizeId(roomOwnerStudentId || studentId)
        });
      },
      addRoomPet(payload = {}) {
        return request('addRoomPet', {
          ...payload,
          studentId: normalizeId(payload.studentId),
          roomOwnerStudentId: normalizeId(payload.roomOwnerStudentId || payload.studentId),
          guestStudentId: normalizeId(payload.guestStudentId || payload.studentId)
        });
      },
      removeRoomPet(studentId, roomOwnerStudentId, slotIndex) {
        return request('removeRoomPet', { studentId: normalizeId(studentId), roomOwnerStudentId: normalizeId(roomOwnerStudentId || studentId), slotIndex });
      },
      removeRoomMember(studentId, roomOwnerStudentId, memberStudentId) {
        return request('removeRoomMember', {
          studentId: normalizeId(studentId),
          roomOwnerStudentId: normalizeId(roomOwnerStudentId || studentId),
          memberStudentId: normalizeId(memberStudentId)
        });
      },
      placeRoomDecoration(payload = {}) {
        return request('placeRoomDecoration', {
          ...payload,
          studentId: normalizeId(payload.studentId),
          roomOwnerStudentId: normalizeId(payload.roomOwnerStudentId || payload.studentId)
        });
      },
      removeRoomDecoration(studentId, roomOwnerStudentId, decorationId) {
        return request('removeRoomDecoration', {
          studentId: normalizeId(studentId),
          roomOwnerStudentId: normalizeId(roomOwnerStudentId || studentId),
          decorationId: String(decorationId || '')
        });
      },
      resetRoom(studentId, roomOwnerStudentId) {
        return request('resetRoom', { studentId: normalizeId(studentId), roomOwnerStudentId: normalizeId(roomOwnerStudentId || studentId) });
      },
      sendRoomMessage(payload = {}) {
        return request('sendRoomMessage', {
          ...payload,
          studentId: normalizeId(payload.studentId),
          roomOwnerStudentId: normalizeId(payload.roomOwnerStudentId || payload.studentId),
          text: String(payload.text || '')
        });
      },
      listInteractionRooms(studentId) {
        return requestInteractionRoom('listRooms', 'listInteractionRooms', { studentId: normalizeId(studentId) });
      },
      listFriendInteractionRooms(studentId, friendIds = []) {
        const normalizedFriendIds = Array.from(new Set((Array.isArray(friendIds) ? friendIds : [friendIds])
          .map(normalizeId)
          .filter(Boolean)))
          .slice(0, 80);
        return requestInteractionRoom('listFriendRooms', 'listFriendInteractionRooms', {
          studentId: normalizeId(studentId),
          friendIds: normalizedFriendIds
        });
      },
      createInteractionRoom(payload = {}) {
        return requestInteractionRoom('createRoom', 'createInteractionRoom', {
          ...payload,
          studentId: normalizeId(payload.studentId),
          studentName: String(payload.studentName || payload.ownerName || ''),
          ownerName: String(payload.ownerName || payload.studentName || ''),
          petId: String(payload.petId || ''),
          petName: String(payload.petName || ''),
          petStage: normalizeInteractionRoomPetStage(payload.petStage || payload.pet_stage || payload.evolutionStage || payload.evolution_stage),
          petStyle: normalizeInteractionRoomPetStyle(payload.petStyle || payload.pet_style || payload.evolutionStyle || payload.evolution_style),
          petSize: normalizeInteractionRoomPetSize(payload.petSize || payload.pet_size),
          roomName: String(payload.roomName || ''),
          mapSetId: String(payload.mapSetId || 'cy-town').trim().toLowerCase(),
          isLocked: Boolean(payload.isLocked),
          password: String(payload.password || '').replace(/\D/g, '').slice(0, 4)
        });
      },
      joinInteractionRoom(payload = {}) {
        return requestInteractionRoom('joinRoom', 'joinInteractionRoom', {
          ...payload,
          studentId: normalizeId(payload.studentId),
          studentName: String(payload.studentName || ''),
          petId: String(payload.petId || ''),
          petName: String(payload.petName || ''),
          petStage: normalizeInteractionRoomPetStage(payload.petStage || payload.pet_stage || payload.evolutionStage || payload.evolution_stage),
          petStyle: normalizeInteractionRoomPetStyle(payload.petStyle || payload.pet_style || payload.evolutionStyle || payload.evolution_style),
          petSize: normalizeInteractionRoomPetSize(payload.petSize || payload.pet_size),
          roomId: String(payload.roomId || '').trim().toUpperCase(),
          password: String(payload.password || '').replace(/\D/g, '').slice(0, 4)
        });
      },
      getInteractionRoom(studentId, roomId) {
        return requestInteractionRoom('heartbeat', 'getInteractionRoom', {
          studentId: normalizeId(studentId),
          roomId: String(roomId || '').trim().toUpperCase()
        });
      },
      heartbeatInteractionRoom(payload = {}) {
        return requestInteractionRoom('heartbeat', 'heartbeatInteractionRoom', {
          ...payload,
          studentId: normalizeId(payload.studentId),
          studentName: String(payload.studentName || ''),
          petId: String(payload.petId || ''),
          petName: String(payload.petName || ''),
          petStage: normalizeInteractionRoomPetStage(payload.petStage || payload.pet_stage || payload.evolutionStage || payload.evolution_stage),
          petStyle: normalizeInteractionRoomPetStyle(payload.petStyle || payload.pet_style || payload.evolutionStyle || payload.evolution_style),
          petSize: normalizeInteractionRoomPetSize(payload.petSize || payload.pet_size),
          roomId: String(payload.roomId || '').trim().toUpperCase(),
          mapId: String(payload.mapId || 'home'),
          playerAction: String(payload.playerAction || payload.action || 'idle'),
          message: Object.prototype.hasOwnProperty.call(payload, 'message') ? String(payload.message || '') : undefined
        });
      },
      leaveInteractionRoom(studentId, roomId) {
        return requestInteractionRoom('leaveRoom', 'leaveInteractionRoom', {
          studentId: normalizeId(studentId),
          roomId: String(roomId || '').trim().toUpperCase()
        });
      },

      // =========================================================
      // EDUVERSE CLIENT METHODS
      // =========================================================
      listTeachers() {
        return requestSupabase('listTeachers', {});
      },
      async teacherLogin(payload = {}) {
        if (getBackendMode(config) !== 'local') {
          if (!isSupabaseMode(config)) {
            return { ok: false, errorCode: 'SUPABASE_NOT_CONFIGURED', error: 'Supabase 后端尚未配置。' };
          }
          return requestSupabase('teacherLogin', payload);
        }
        const teacherId = payload.teacherId || 'TCH01_JIE';
        const teacherNames = {
          TCH01_JIE: '杰老师',
          TCH02_RACHEL: 'Rachel老师',
          TCH03_HUANG: '黄老师',
          TCH04_TIAN: '天老师',
          TCH05_EN: '恩老师',
          TCH06_DU: '杜老师',
          TCH07_HUI: '橞老师',
          TCH08_YI: '宜老师',
          TCH09_QI: '淇老师',
          TCH10_YI2: '奕老师',
          TCH11_HU: '胡老师',
          TCH12_WEN: '汶老师'
        };
        const name = teacherNames[teacherId] || '教师';
        return {
          ok: true,
          source: 'local-fallback',
          teacher: {
            teacherId,
            name,
            avatar: '🧑‍🏫',
            role: 'teacher'
          }
        };
      },
      changeTeacherPassword(payload = {}) {
        return requestSupabase('changeTeacherPassword', payload);
      },
      getTeacherProfile(teacherId) {
        return requestSupabase('getTeacherProfile', { teacherId });
      },
      async registerStudentPhone(payload = {}) {
        if (getBackendMode(config) !== 'local') {
          if (!isSupabaseMode(config)) {
            return { ok: false, errorCode: 'SUPABASE_NOT_CONFIGURED', error: 'Supabase 后端尚未配置。' };
          }
          return requestSupabase('registerStudentPhone', payload);
        }
        const studentId = '51' + String(payload.phone || '1001').slice(-4);
        return {
          ok: true,
          source: 'local-fallback',
          student: {
            studentId,
            studentName: payload.name || '新学员',
            phone: payload.phone || '',
            form: payload.form || 'Form 2',
            level: 1,
            experience: 0,
            currentStreak: 1,
            coins: 100,
            petType: 'pikachu',
            petName: '小皮卡',
            demoMode: false
          }
        };
      },
      async loginStudentPhone(payload = {}) {
        if (getBackendMode(config) !== 'local') {
          if (!isSupabaseMode(config)) {
            return { ok: false, errorCode: 'SUPABASE_NOT_CONFIGURED', error: 'Supabase 后端尚未配置。' };
          }
          return requestSupabase('loginStudentPhone', payload);
        }
        const isF3 = String(payload.phone || '').includes('9876');
        const studentId = isF3 ? '511002' : '511001';
        const studentName = isF3 ? '陈思琪 (Form 3)' : '林子轩 (Form 2)';
        const form = isF3 ? 'Form 3' : 'Form 2';
        const petType = isF3 ? 'kurumi-magic' : 'pikachu';
        const petName = isF3 ? '库洛米' : '皮卡丘';
        return {
          ok: true,
          source: 'local-fallback',
          student: {
            studentId,
            studentName,
            phone: payload.phone || '0123456789',
            form,
            level: isF3 ? 14 : 12,
            experience: isF3 ? 4200 : 3500,
            currentStreak: isF3 ? 15 : 12,
            coins: isF3 ? 680 : 520,
            petType,
            petName,
            demoMode: true
          }
        };
      },
      listSubjects() {
        return requestSupabase('listSubjects', {});
      },
      listChapters(payload = {}) {
        return requestSupabase('listChapters', payload);
      },
      listQuestions(payload = {}) {
        return requestSupabase('listQuestions', payload);
      },
      saveQuestion(payload = {}) {
        return requestSupabase('saveQuestion', payload);
      },
      publishQuestion(payload = {}) {
        return requestSupabase('publishQuestion', payload);
      },
      getDailyChallenge(payload = {}) {
        return requestSupabase('getDailyChallenge', payload);
      },
      createDailyChallenge(payload = {}) {
        return requestSupabase('createDailyChallenge', payload);
      },
      submitQuestResult(payload = {}) {
        return requestSupabase('submitQuestResult', payload);
      },
      getGloryLeaderboard(payload = {}) {
        return requestSupabase('getGloryLeaderboard', payload);
      },
      listAchievements(studentId) {
        return requestSupabase('listAchievements', { studentId: normalizeId(studentId) });
      },
      getTeacherAnalytics(payload = {}) {
        return requestSupabase('getTeacherAnalytics', payload);
      },
      bulkImportQuestions(payload = {}) {
        return requestSupabase('bulkImportQuestions', payload);
      },
      syncGoogleSheetsData(payload = {}) {
        return requestSupabase('syncGoogleSheetsData', payload);
      },
      getGoogleSheetSyncStatus() {
        return requestSupabase('getGoogleSheetSyncStatus', {});
      }
    };
  }

  function normalizePhoneNumber(rawPhone) {
    if (!rawPhone) return '';
    let phone = String(rawPhone).trim().replace(/[^0-9+]/g, '');
    if (phone.startsWith('+')) phone = phone.slice(1);
    if (phone.startsWith('01')) {
      phone = '60' + phone.slice(1);
    } else if (phone.startsWith('1')) {
      phone = '60' + phone;
    }
    return phone;
  }

  function isValidMalaysianPhone(phone) {
    const normalized = normalizePhoneNumber(phone);
    return /^601[0-9]{7,9}$/.test(normalized);
  }

  const api = {
    normalizeId,
    getCanonicalStudentName,
    toNumber,
    toBoolean,
    parseJsonField,
    normalizeStudent,
    normalizePhoneNumber,
    isValidMalaysianPhone,
    getBackendMode,
    isGasMode,
    isSupabaseMode,
    hasRemoteBackend,
    createClient
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.HolidayBackendClient = api;
})();
