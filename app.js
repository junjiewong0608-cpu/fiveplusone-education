(() => {
  'use strict';

  // ===== 后续可修改的系统设置 =====
  const savedSupabaseUrl = (() => {
    try { return localStorage.getItem('fo_supabase_url') || ''; } catch { return ''; }
  })();
  const savedSupabaseKey = (() => {
    try { return localStorage.getItem('fo_supabase_anon_key') || ''; } catch { return ''; }
  })();

  const APP_CONFIG = {
    name: '5+1教育补习中心',
    holidayStart: '2026-08-01',
    holidayEnd: '2026-09-30',
    timezone: 'Asia/Kuala_Lumpur',
    enforceHolidayWindow: false,
    backendMode: 'supabase',
    backendUrl: '',
    supabaseFunctionUrl: 'https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/cy-pets-api',
    supabaseAnonKey: 'YOUR_PUBLIC_FUNCTION_KEY',
    supabaseRequestTimeoutMs: 35000,
    interactionRoomApiUrl: '/api/redis-room',
    interactionRoomRequestTimeoutMs: 8000,
    requestRetryCount: 4,
    requestRetryDelayMs: 650
  };
  if (savedSupabaseUrl) APP_CONFIG.supabaseFunctionUrl = savedSupabaseUrl;
  if (savedSupabaseKey) APP_CONFIG.supabaseAnonKey = savedSupabaseKey;
  const DEFAULT_APP_VIEW = 'dashboard-view';
  const APP_ASSET_VERSION = '20260831-01';
  const TEACHER_GLOBAL_ADMIN_IDS = new Set(['TCH01_JIE', '510000', 'FO0000', 'CY0000']);
  const TEACHER_REWARD_ADMIN_IDS = new Set(['CY0000', 'CY0001']);
  const MINI_GAME_SCORE_KEYS = ['reaction', 'flappy', 'runner', 'jumpCharge'];
  const KUROMI_ROOM_EMOJI_REACTIONS = ['😊', '😄', '😂', '😍', '😎', '🥳', '😮', '😋', '🤩', '😴'];
  const NEW_PLAYER_GUIDE_TYPE_SPEED_MS = 16;
  const AVATAR_IMAGE_SIZE = 128;
  const AVATAR_IMAGE_MAX_DATA_URL_LENGTH = 42000;
  const AVATAR_UPLOAD_MAX_FILE_BYTES = 6 * 1024 * 1024;
  const KUROMI_ROOM_DEMO = {
    viewWidth: 960,
    viewHeight: 540,
    worldWidth: 2380,
    fallbackGroundY: 444,
    playerStartX: 128,
    playerMinX: 70,
    playerMaxX: 2310,
    transitionEdgePadding: 20,
    runWidth: 116,
    runHeight: 116,
    duckWidth: 132,
    duckHeight: 88,
    lieWidth: 156,
    lieHeight: 82,
    walkSpeed: 285,
    duckSpeed: 140,
    acceleration: 2300,
    friction: 2600,
    gravity: 2300,
    jumpVelocity: -760,
    fastDropMinVelocity: 720,
    fastDropGravity: 4300,
    cameraFollow: 0.14,
    pixelRatioCap: 1.4,
    mobilePixelRatioCap: 1.15,
    walkCycleSpeed: 0.052,
    walkSettleSpeed: 14,
    walkingVelocityThreshold: 16,
    bubbleDurationMs: 10000,
    idleSwaySpeed: 0.004,
    idleSwayPixels: 2.4,
    idleBobPixels: 2,
    idleTiltRadians: 0.035,
    remoteLerpSpeed: 0.18,
    remoteMaxStepPerSecond: 720,
    remoteSnapDistance: 960,
    remoteStaleMs: 45000,
    runSrc: 'assets/room-demo/kuromi-run.png',
    duckSrc: 'assets/room-demo/kuromi-duck.png',
    defaultMapSetId: 'cy-town',
    mapSets: [
      {
        id: 'cy-town',
        name: 'CY小镇',
        subtitle: '家、学校、森林、美食街',
        previewSrc: 'assets/room-demo/map-food-street.png',
        maps: [
          {
            id: 'home',
            shortTitle: '家',
            title: '小小的家',
            subtitle: '向右去学校，向左回到美食街',
            backgroundSrc: 'assets/room-demo/kuromi-room-panorama.png',
            groundY: 444,
            fallbackTop: '#ffdbe8',
            fallbackMiddle: '#fff4c9',
            fallbackFloor: '#f4d8e5'
          },
          {
            id: 'school',
            shortTitle: '学校',
            title: '糖星学校',
            subtitle: '向右去森林小屋，向左回到家里',
            backgroundSrc: 'assets/room-demo/map-school.png',
            groundY: 456,
            fallbackTop: '#b9e6f3',
            fallbackMiddle: '#ffdbe8',
            fallbackFloor: '#f3cf9d'
          },
          {
            id: 'forest',
            shortTitle: '森林',
            title: '棉花糖森林小屋',
            subtitle: '向右去美食街，向左回到学校',
            backgroundSrc: 'assets/room-demo/map-forest.png',
            backgroundOffsetY: 48,
            groundY: 486,
            fallbackTop: '#c9efe0',
            fallbackMiddle: '#cde8b5',
            fallbackFloor: '#d9b17d'
          },
          {
            id: 'food',
            shortTitle: '美食街',
            title: '暖灯美食街',
            subtitle: '向右回到家里，向左回到森林小屋',
            backgroundSrc: 'assets/room-demo/map-food-street.png',
            groundY: 450,
            fallbackTop: '#bfe6ff',
            fallbackMiddle: '#ffe5a8',
            fallbackFloor: '#f4d8e5'
          }
        ]
      },
      {
        id: 'cy-bay',
        name: 'CY BAY',
        subtitle: '游乐园、海边、咖啡厅、餐厅',
        previewSrc: 'assets/room-demo/cy-bay-seaside.png',
        maps: [
          {
            id: 'bay-amusement',
            shortTitle: '游乐园',
            title: '糖果游乐园',
            subtitle: '向右去海边，向左回到餐厅',
            backgroundSrc: 'assets/room-demo/cy-bay-amusement.png',
            groundY: 456,
            fallbackTop: '#bfeeff',
            fallbackMiddle: '#ffdce9',
            fallbackFloor: '#fbd9a9'
          },
          {
            id: 'bay-seaside',
            shortTitle: '海边',
            title: 'CY 海湾',
            subtitle: '向右去咖啡厅，向左回到游乐园',
            backgroundSrc: 'assets/room-demo/cy-bay-seaside.png',
            backgroundOffsetY: 40,
            groundY: 486,
            fallbackTop: '#7bdcf5',
            fallbackMiddle: '#bceff4',
            fallbackFloor: '#ffe4bc'
          },
          {
            id: 'bay-cafe',
            shortTitle: '咖啡厅',
            title: '云朵咖啡厅',
            subtitle: '向右去餐厅，向左回到海边',
            backgroundSrc: 'assets/room-demo/cy-bay-cafe.png',
            backgroundOffsetY: 28,
            groundY: 478,
            fallbackTop: '#ffe4d8',
            fallbackMiddle: '#fff0d8',
            fallbackFloor: '#f6c792'
          },
          {
            id: 'bay-restaurant',
            shortTitle: '餐厅',
            title: '甜点餐厅',
            subtitle: '向右回到游乐园，向左回到咖啡厅',
            backgroundSrc: 'assets/room-demo/cy-bay-restaurant.png',
            backgroundOffsetY: 34,
            groundY: 480,
            fallbackTop: '#ffd5cb',
            fallbackMiddle: '#ffe8cf',
            fallbackFloor: '#e9ad74'
          }
        ]
      },
      {
        id: 'tokyo-night',
        name: '东京夜景',
        subtitle: '东京塔、车站、霓虹街、街角、河边',
        previewSrc: 'assets/room-demo/map-tokyo-tower-night.png',
        backgroundMode: 'single-screen',
        maps: [
          {
            id: 'tokyo-tower',
            shortTitle: '东京塔',
            title: '东京塔夜景',
            subtitle: '向右去东京车站，向左去河边夜景',
            backgroundSrc: 'assets/room-demo/map-tokyo-tower-night.png',
            groundY: 456,
            fallbackTop: '#111b56',
            fallbackMiddle: '#273278',
            fallbackFloor: '#27314f'
          },
          {
            id: 'tokyo-station',
            shortTitle: '车站',
            title: '夜色车站',
            subtitle: '向右去霓虹街，向左回到东京塔',
            backgroundSrc: 'assets/room-demo/map-tokyo-station-night.png',
            groundY: 456,
            fallbackTop: '#13205a',
            fallbackMiddle: '#25386f',
            fallbackFloor: '#32415c'
          },
          {
            id: 'tokyo-neon',
            shortTitle: '霓虹街',
            title: '霓虹小街',
            subtitle: '向右去街角，向左回到车站',
            backgroundSrc: 'assets/room-demo/map-tokyo-neon-night.png',
            groundY: 462,
            fallbackTop: '#15165a',
            fallbackMiddle: '#29317d',
            fallbackFloor: '#293257'
          },
          {
            id: 'tokyo-loop-street',
            shortTitle: '街角',
            title: '便利店街角',
            subtitle: '向右去河边，向左回到霓虹街',
            backgroundSrc: 'assets/room-demo/map-tokyo-loop-street-night.png',
            groundY: 462,
            fallbackTop: '#101a4b',
            fallbackMiddle: '#26305f',
            fallbackFloor: '#33415c'
          },
          {
            id: 'tokyo-riverside',
            shortTitle: '河边',
            title: '东京河边',
            subtitle: '向右回到东京塔，向左回到街角',
            backgroundSrc: 'assets/room-demo/map-tokyo-riverside-night.png',
            groundY: 470,
            fallbackTop: '#101a45',
            fallbackMiddle: '#153d60',
            fallbackFloor: '#39435a'
          }
        ]
      },
      {
        id: 'kl-pavilion-night',
        name: 'Pavilion KL',
        subtitle: '喷泉、武吉免登、人行桥、精品街、夜灯、城市夜景',
        previewSrc: 'assets/room-demo/01-kl-pavilion-fountain.png',
        backgroundMode: 'single-screen',
        maps: [
          {
            id: 'kl-pavilion-fountain',
            shortTitle: '喷泉',
            title: 'Pavilion 喷泉广场',
            subtitle: '向右去武吉免登步道，向左回到城市夜景',
            backgroundSrc: 'assets/room-demo/01-kl-pavilion-fountain.png',
            groundY: 360,
            fallbackTop: '#111a3e',
            fallbackMiddle: '#26315f',
            fallbackFloor: '#202134'
          },
          {
            id: 'kl-pavilion-bukit-bintang-walk',
            shortTitle: '步道',
            title: '武吉免登夜步道',
            subtitle: '向右去玻璃天桥，向左回到喷泉广场',
            backgroundSrc: 'assets/room-demo/02-kl-pavilion-bukit-bintang-walk.png',
            groundY: 360,
            fallbackTop: '#111a3e',
            fallbackMiddle: '#26315f',
            fallbackFloor: '#202134'
          },
          {
            id: 'kl-pavilion-glass-bridge',
            shortTitle: '天桥',
            title: 'Pavilion 玻璃天桥',
            subtitle: '向右去精品街，向左回到武吉免登步道',
            backgroundSrc: 'assets/room-demo/03-kl-pavilion-glass-bridge.png',
            groundY: 360,
            fallbackTop: '#111a3e',
            fallbackMiddle: '#26315f',
            fallbackFloor: '#202134'
          },
          {
            id: 'kl-pavilion-boutique-row',
            shortTitle: '精品街',
            title: '精品橱窗街',
            subtitle: '向右去夜灯街，向左回到玻璃天桥',
            backgroundSrc: 'assets/room-demo/04-kl-pavilion-boutique-row.png',
            groundY: 360,
            fallbackTop: '#111a3e',
            fallbackMiddle: '#26315f',
            fallbackFloor: '#202134'
          },
          {
            id: 'kl-pavilion-night-lights',
            shortTitle: '夜灯',
            title: 'Pavilion 夜灯街',
            subtitle: '向右去城市夜景，向左回到精品街',
            backgroundSrc: 'assets/room-demo/05-kl-pavilion-night-lights.png',
            groundY: 360,
            fallbackTop: '#111a3e',
            fallbackMiddle: '#26315f',
            fallbackFloor: '#202134'
          },
          {
            id: 'kl-pavilion-city-night',
            shortTitle: '夜城',
            title: '吉隆坡城市夜景',
            subtitle: '向右回到喷泉广场，向左回到夜灯街',
            backgroundSrc: 'assets/room-demo/06-kl-pavilion-city-night.png',
            groundY: 360,
            fallbackTop: '#111a3e',
            fallbackMiddle: '#26315f',
            fallbackFloor: '#202134'
          }
        ]
      },
      {
        id: 'sunset-farm',
        name: '日落农场',
        subtitle: '羊草地、小屋、马厩、牛牧场、菜园',
        previewSrc: 'assets/room-demo/map-farm-sheep-meadow-sunset.png',
        backgroundMode: 'single-screen',
        maps: [
          {
            id: 'farm-sheep-meadow',
            shortTitle: '羊草地',
            title: '日落羊草地',
            subtitle: '向右去农场小屋，向左去菜园',
            backgroundSrc: 'assets/room-demo/map-farm-sheep-meadow-sunset.png',
            groundY: 476,
            fallbackTop: '#f69b55',
            fallbackMiddle: '#ffd36d',
            fallbackFloor: '#6fb85e'
          },
          {
            id: 'farm-house-interior',
            shortTitle: '小屋',
            title: '暖光农场小屋',
            subtitle: '向右去马厩，向左回到羊草地',
            backgroundSrc: 'assets/room-demo/map-farm-house-interior-sunset.png',
            groundY: 470,
            fallbackTop: '#b86c45',
            fallbackMiddle: '#e4b274',
            fallbackFloor: '#98613d'
          },
          {
            id: 'farm-pony-stable',
            shortTitle: '马厩',
            title: '小马马厩',
            subtitle: '向右去牛牧场，向左回到小屋',
            backgroundSrc: 'assets/room-demo/map-farm-pony-stable-sunset.png',
            groundY: 478,
            fallbackTop: '#f3a156',
            fallbackMiddle: '#f8ca65',
            fallbackFloor: '#6da55a'
          },
          {
            id: 'farm-calf-pasture',
            shortTitle: '牛牧场',
            title: '小牛牧场',
            subtitle: '向右去菜园，向左回到马厩',
            backgroundSrc: 'assets/room-demo/map-farm-calf-pasture-sunset.png',
            groundY: 480,
            fallbackTop: '#f4a35c',
            fallbackMiddle: '#f5c765',
            fallbackFloor: '#7eac57'
          },
          {
            id: 'farm-vegetable-garden',
            shortTitle: '菜园',
            title: '南瓜菜园',
            subtitle: '向右回到羊草地，向左回到牛牧场',
            backgroundSrc: 'assets/room-demo/map-farm-vegetable-garden-sunset.png',
            groundY: 482,
            fallbackTop: '#f69b54',
            fallbackMiddle: '#f6c35e',
            fallbackFloor: '#6c9f45'
          }
        ]
      },
      {
        id: 'movie-park',
        name: '电影乐园',
        subtitle: '环球入口、影城大道、科幻区、恐龙丛林、魔法街',
        previewSrc: 'assets/room-demo/map-studio-globe-entrance.png',
        backgroundMode: 'single-screen',
        maps: [
          {
            id: 'studio-globe-entrance',
            shortTitle: '环球入口',
            title: '电影乐园入口',
            subtitle: '向右去影城大道，向左去烟花出口',
            backgroundSrc: 'assets/room-demo/map-studio-globe-entrance.png',
            groundY: 478,
            fallbackTop: '#71d5ff',
            fallbackMiddle: '#e7f2d4',
            fallbackFloor: '#e7d3a1'
          },
          {
            id: 'studio-boulevard',
            shortTitle: '影城大道',
            title: '影城大道',
            subtitle: '向右去科幻区，向左回到入口',
            backgroundSrc: 'assets/room-demo/map-studio-boulevard.png',
            groundY: 472,
            fallbackTop: '#7fd3ff',
            fallbackMiddle: '#ffe5a0',
            fallbackFloor: '#d7ad78'
          },
          {
            id: 'studio-sci-fi-zone',
            shortTitle: '科幻区',
            title: '未来科幻区',
            subtitle: '向右去恐龙丛林，向左回到影城大道',
            backgroundSrc: 'assets/room-demo/map-studio-sci-fi-zone.png',
            groundY: 470,
            fallbackTop: '#60cfff',
            fallbackMiddle: '#b5e7ff',
            fallbackFloor: '#7393a8'
          },
          {
            id: 'studio-dino-jungle',
            shortTitle: '恐龙丛林',
            title: '恐龙丛林',
            subtitle: '向右去城市片场，向左回到科幻区',
            backgroundSrc: 'assets/room-demo/map-studio-dino-jungle.png',
            groundY: 476,
            fallbackTop: '#9adfdd',
            fallbackMiddle: '#a7d36e',
            fallbackFloor: '#5c8c50'
          },
          {
            id: 'studio-city-backlot',
            shortTitle: '城市片场',
            title: '城市片场',
            subtitle: '向右去魔法街，向左回到恐龙丛林',
            backgroundSrc: 'assets/room-demo/map-studio-city-backlot.png',
            groundY: 468,
            fallbackTop: '#8ed0ff',
            fallbackMiddle: '#f2c58d',
            fallbackFloor: '#a47c58'
          },
          {
            id: 'studio-magic-street',
            shortTitle: '魔法街',
            title: '魔法街',
            subtitle: '向右去水港，向左回到城市片场',
            backgroundSrc: 'assets/room-demo/map-studio-magic-street.png',
            groundY: 472,
            fallbackTop: '#d7a96f',
            fallbackMiddle: '#8e5b8f',
            fallbackFloor: '#664166'
          },
          {
            id: 'studio-water-harbor',
            shortTitle: '水港',
            title: '电影水港',
            subtitle: '向右去烟花出口，向左回到魔法街',
            backgroundSrc: 'assets/room-demo/map-studio-water-harbor.png',
            groundY: 474,
            fallbackTop: '#72d8ff',
            fallbackMiddle: '#9ee8f8',
            fallbackFloor: '#65b4c8'
          },
          {
            id: 'studio-fireworks-exit',
            shortTitle: '烟花出口',
            title: '烟花出口',
            subtitle: '向右回到入口，向左回到水港',
            backgroundSrc: 'assets/room-demo/map-studio-fireworks-exit.png',
            groundY: 472,
            fallbackTop: '#10184d',
            fallbackMiddle: '#31306a',
            fallbackFloor: '#47365f'
          }
        ]
      },
      {
        id: 'cy-school',
        name: '5+1 智慧校园',
        subtitle: '校门、走廊、课室、食堂、礼堂、操场',
        previewSrc: 'assets/room-demo/map-school-gate.png',
        backgroundMode: 'single-screen',
        maps: [
          {
            id: 'school-gate',
            shortTitle: '校门',
            title: '5+1 智慧校门',
            subtitle: '向右去走廊，向左去操场',
            backgroundSrc: 'assets/room-demo/map-school-gate.png',
            groundY: 476,
            fallbackTop: '#bfe7ff',
            fallbackMiddle: '#e7f5ff',
            fallbackFloor: '#d5b58a'
          },
          {
            id: 'school-corridor',
            shortTitle: '走廊',
            title: '校园走廊',
            subtitle: '向右去课室，向左回到校门',
            backgroundSrc: 'assets/room-demo/map-school-corridor.png',
            groundY: 472,
            fallbackTop: '#b9ddff',
            fallbackMiddle: '#f3e5c7',
            fallbackFloor: '#cfae7a'
          },
          {
            id: 'school-classroom',
            shortTitle: '课室',
            title: '温暖课室',
            subtitle: '向右去食堂，向左回到走廊',
            backgroundSrc: 'assets/room-demo/map-school-classroom.png',
            groundY: 470,
            fallbackTop: '#c8e4ff',
            fallbackMiddle: '#f8e6bf',
            fallbackFloor: '#d7b87d'
          },
          {
            id: 'school-cafeteria',
            shortTitle: '食堂',
            title: '校园食堂',
            subtitle: '向右去礼堂，向左回到课室',
            backgroundSrc: 'assets/room-demo/map-school-cafeteria.png',
            groundY: 474,
            fallbackTop: '#c9edff',
            fallbackMiddle: '#fff1bf',
            fallbackFloor: '#ddb273'
          },
          {
            id: 'school-auditorium',
            shortTitle: '礼堂',
            title: '学校礼堂',
            subtitle: '向右去操场，向左回到食堂',
            backgroundSrc: 'assets/room-demo/map-school-auditorium.png',
            groundY: 476,
            fallbackTop: '#cad8ff',
            fallbackMiddle: '#f4d4bd',
            fallbackFloor: '#bd8f73'
          },
          {
            id: 'school-field',
            shortTitle: '操场',
            title: '阳光操场',
            subtitle: '向右回到校门，向左回到礼堂',
            backgroundSrc: 'assets/room-demo/map-school-field.png',
            groundY: 482,
            fallbackTop: '#99dbff',
            fallbackMiddle: '#d7f1c2',
            fallbackFloor: '#78b868'
          }
        ]
      },
      {
        id: 'paris-trip',
        name: '巴黎旅行',
        subtitle: '铁塔、塞纳河、咖啡街、博物馆、蒙马特、花园',
        previewSrc: 'assets/room-demo/map-paris-eiffel-riverside.png',
        backgroundMode: 'single-screen',
        maps: [
          {
            id: 'paris-eiffel-riverside',
            shortTitle: '铁塔',
            title: '巴黎铁塔河岸',
            subtitle: '向右去塞纳河桥，向左去花园广场',
            backgroundSrc: 'assets/room-demo/map-paris-eiffel-riverside.png',
            groundY: 476,
            fallbackTop: '#a9d9ff',
            fallbackMiddle: '#dff4ff',
            fallbackFloor: '#d5aa7a'
          },
          {
            id: 'paris-seine-bridge',
            shortTitle: '塞纳河',
            title: '塞纳河桥',
            subtitle: '向右去咖啡街，向左回到铁塔',
            backgroundSrc: 'assets/room-demo/map-paris-seine-bridge.png',
            groundY: 474,
            fallbackTop: '#bfe4ff',
            fallbackMiddle: '#d7eef7',
            fallbackFloor: '#c99d70'
          },
          {
            id: 'paris-cafe-street',
            shortTitle: '咖啡街',
            title: '巴黎咖啡街',
            subtitle: '向右去博物馆，向左回到塞纳河',
            backgroundSrc: 'assets/room-demo/map-paris-cafe-street.png',
            groundY: 472,
            fallbackTop: '#cfeaff',
            fallbackMiddle: '#f6ddbd',
            fallbackFloor: '#bd8761'
          },
          {
            id: 'paris-museum-courtyard',
            shortTitle: '博物馆',
            title: '博物馆庭院',
            subtitle: '向右去蒙马特，向左回到咖啡街',
            backgroundSrc: 'assets/room-demo/map-paris-museum-courtyard.png',
            groundY: 474,
            fallbackTop: '#b8dfff',
            fallbackMiddle: '#f2ead9',
            fallbackFloor: '#b99a7e'
          },
          {
            id: 'paris-montmartre-lane',
            shortTitle: '蒙马特',
            title: '蒙马特小巷',
            subtitle: '向右去花园，向左回到博物馆',
            backgroundSrc: 'assets/room-demo/map-paris-montmartre-lane.png',
            groundY: 478,
            fallbackTop: '#b6ddff',
            fallbackMiddle: '#f2ddc4',
            fallbackFloor: '#ba8a69'
          },
          {
            id: 'paris-garden-square',
            shortTitle: '花园',
            title: '巴黎花园广场',
            subtitle: '向右回到铁塔，向左回到蒙马特',
            backgroundSrc: 'assets/room-demo/map-paris-garden-square.png',
            groundY: 480,
            fallbackTop: '#b9e5ff',
            fallbackMiddle: '#d7f1c8',
            fallbackFloor: '#8ab96f'
          }
        ]
      },
      {
        id: 'xian-trip',
        name: '西安旅行',
        subtitle: '城墙、钟楼、大雁塔、秦陵、兵马俑、铜车马',
        previewSrc: 'assets/room-demo/map-xian-city-wall-gate.png',
        backgroundMode: 'single-screen',
        maps: [
          {
            id: 'xian-city-wall-gate',
            shortTitle: '城墙',
            title: '西安城墙门',
            subtitle: '向右去钟楼，向左去铜车马馆',
            backgroundSrc: 'assets/room-demo/map-xian-city-wall-gate.png',
            groundY: 476,
            fallbackTop: '#a9d8ff',
            fallbackMiddle: '#e7d6af',
            fallbackFloor: '#b48555'
          },
          {
            id: 'xian-bell-tower-street',
            shortTitle: '钟楼',
            title: '钟楼街景',
            subtitle: '向右去大雁塔，向左回到城墙',
            backgroundSrc: 'assets/room-demo/map-xian-bell-tower-street.png',
            groundY: 474,
            fallbackTop: '#b5dcff',
            fallbackMiddle: '#f4cf9b',
            fallbackFloor: '#aa7451'
          },
          {
            id: 'xian-pagoda-garden',
            shortTitle: '大雁塔',
            title: '大雁塔花园',
            subtitle: '向右去秦陵，向左回到钟楼',
            backgroundSrc: 'assets/room-demo/map-xian-pagoda-garden.png',
            groundY: 476,
            fallbackTop: '#aedfff',
            fallbackMiddle: '#d9ebb8',
            fallbackFloor: '#91b46a'
          },
          {
            id: 'xian-qin-mausoleum-park',
            shortTitle: '秦陵',
            title: '秦陵公园',
            subtitle: '向右去兵马俑，向左回到大雁塔',
            backgroundSrc: 'assets/room-demo/map-xian-qin-mausoleum-park.png',
            groundY: 480,
            fallbackTop: '#badfff',
            fallbackMiddle: '#e2c99a',
            fallbackFloor: '#8f8056'
          },
          {
            id: 'xian-terracotta-hall',
            shortTitle: '兵马俑',
            title: '兵马俑大厅',
            subtitle: '向右去铜车马馆，向左回到秦陵',
            backgroundSrc: 'assets/room-demo/map-xian-terracotta-hall.png',
            groundY: 478,
            fallbackTop: '#8da0b0',
            fallbackMiddle: '#b99d80',
            fallbackFloor: '#826c5e'
          },
          {
            id: 'xian-bronze-chariot-museum',
            shortTitle: '铜车马',
            title: '铜车马馆',
            subtitle: '向右回到城墙，向左回到兵马俑',
            backgroundSrc: 'assets/room-demo/map-xian-bronze-chariot-museum.png',
            groundY: 476,
            fallbackTop: '#9ab1c2',
            fallbackMiddle: '#d5c0a2',
            fallbackFloor: '#8b745b'
          }
        ]
      },
      {
        id: 'beijing-trip',
        name: '北京旅行',
        subtitle: '故宫、天坛、长城、胡同、颐和园、现代夜景',
        previewSrc: 'assets/room-demo/map-beijing-forbidden-city-gate.png',
        backgroundMode: 'single-screen',
        maps: [
          {
            id: 'beijing-forbidden-city-gate',
            shortTitle: '故宫',
            title: '故宫门前',
            subtitle: '向右去天坛，向左去北京夜景',
            backgroundSrc: 'assets/room-demo/map-beijing-forbidden-city-gate.png',
            groundY: 478,
            fallbackTop: '#acd8ff',
            fallbackMiddle: '#f4c087',
            fallbackFloor: '#b85a42'
          },
          {
            id: 'beijing-temple-of-heaven',
            shortTitle: '天坛',
            title: '天坛公园',
            subtitle: '向右去长城，向左回到故宫',
            backgroundSrc: 'assets/room-demo/map-beijing-temple-of-heaven.png',
            groundY: 476,
            fallbackTop: '#b7e0ff',
            fallbackMiddle: '#d7edc9',
            fallbackFloor: '#90b867'
          },
          {
            id: 'beijing-great-wall',
            shortTitle: '长城',
            title: '万里长城',
            subtitle: '向右去胡同，向左回到天坛',
            backgroundSrc: 'assets/room-demo/map-beijing-great-wall.png',
            groundY: 480,
            fallbackTop: '#bce3ff',
            fallbackMiddle: '#d0d8a5',
            fallbackFloor: '#8c7954'
          },
          {
            id: 'beijing-hutong-lane',
            shortTitle: '胡同',
            title: '北京胡同',
            subtitle: '向右去颐和园，向左回到长城',
            backgroundSrc: 'assets/room-demo/map-beijing-hutong-lane.png',
            groundY: 474,
            fallbackTop: '#c7e5ff',
            fallbackMiddle: '#e6c39e',
            fallbackFloor: '#9f6f58'
          },
          {
            id: 'beijing-summer-palace',
            shortTitle: '颐和园',
            title: '颐和园湖边',
            subtitle: '向右去现代夜景，向左回到胡同',
            backgroundSrc: 'assets/room-demo/map-beijing-summer-palace.png',
            groundY: 480,
            fallbackTop: '#b8e5ff',
            fallbackMiddle: '#d8f0cf',
            fallbackFloor: '#87b578'
          },
          {
            id: 'beijing-modern-night',
            shortTitle: '夜景',
            title: '北京现代夜景',
            subtitle: '向右回到故宫，向左回到颐和园',
            backgroundSrc: 'assets/room-demo/map-beijing-modern-night.png',
            groundY: 472,
            fallbackTop: '#101c55',
            fallbackMiddle: '#27347a',
            fallbackFloor: '#2d344c'
          }
        ]
      },
      {
        id: 'usa-trip',
        name: '美国旅行',
        subtitle: '纽约港、华盛顿、旧金山、洛杉矶、芝加哥、新奥尔良',
        previewSrc: 'assets/room-demo/map-usa-new-york-harbor.png',
        backgroundMode: 'single-screen',
        maps: [
          {
            id: 'usa-new-york-harbor',
            shortTitle: '纽约港',
            title: '纽约港口',
            subtitle: '向右去华盛顿，向左去新奥尔良',
            backgroundSrc: 'assets/room-demo/map-usa-new-york-harbor.png',
            groundY: 474,
            fallbackTop: '#a8d9ff',
            fallbackMiddle: '#d9f1ff',
            fallbackFloor: '#6f8798'
          },
          {
            id: 'usa-washington-dc-mall',
            shortTitle: '华盛顿',
            title: '华盛顿广场',
            subtitle: '向右去旧金山，向左回到纽约港',
            backgroundSrc: 'assets/room-demo/map-usa-washington-dc-mall.png',
            groundY: 476,
            fallbackTop: '#bde4ff',
            fallbackMiddle: '#e8edd2',
            fallbackFloor: '#a7a372'
          },
          {
            id: 'usa-san-francisco-bay',
            shortTitle: '旧金山',
            title: '旧金山海湾',
            subtitle: '向右去洛杉矶，向左回到华盛顿',
            backgroundSrc: 'assets/room-demo/map-usa-san-francisco-bay.png',
            groundY: 478,
            fallbackTop: '#a7dfff',
            fallbackMiddle: '#d1ecf1',
            fallbackFloor: '#6aa7a0'
          },
          {
            id: 'usa-los-angeles-beach',
            shortTitle: '洛杉矶',
            title: '洛杉矶海边',
            subtitle: '向右去芝加哥，向左回到旧金山',
            backgroundSrc: 'assets/room-demo/map-usa-los-angeles-beach.png',
            groundY: 480,
            fallbackTop: '#9fdfff',
            fallbackMiddle: '#f6d8a0',
            fallbackFloor: '#d6ad72'
          },
          {
            id: 'usa-chicago-riverwalk',
            shortTitle: '芝加哥',
            title: '芝加哥河畔',
            subtitle: '向右去新奥尔良，向左回到洛杉矶',
            backgroundSrc: 'assets/room-demo/map-usa-chicago-riverwalk.png',
            groundY: 474,
            fallbackTop: '#a8d5ff',
            fallbackMiddle: '#d9e5ef',
            fallbackFloor: '#70859a'
          },
          {
            id: 'usa-new-orleans-quarter',
            shortTitle: '新奥尔良',
            title: '新奥尔良老街',
            subtitle: '向右回到纽约港，向左回到芝加哥',
            backgroundSrc: 'assets/room-demo/map-usa-new-orleans-quarter.png',
            groundY: 472,
            fallbackTop: '#b8ddff',
            fallbackMiddle: '#ecd3a9',
            fallbackFloor: '#9f6d4f'
          }
        ]
      },
      {
        id: 'uk-trip',
        name: '英国旅行',
        subtitle: '泰晤士河、皇家花园、牛津、约克、爱丁堡、康沃尔',
        previewSrc: 'assets/room-demo/map-uk-london-thames.png',
        backgroundMode: 'single-screen',
        maps: [
          {
            id: 'uk-london-thames',
            shortTitle: '伦敦',
            title: '伦敦泰晤士河',
            subtitle: '向右去皇家花园，向左去康沃尔海港',
            backgroundSrc: 'assets/room-demo/map-uk-london-thames.png',
            groundY: 474,
            fallbackTop: '#b3dcff',
            fallbackMiddle: '#d8e7f0',
            fallbackFloor: '#80909b'
          },
          {
            id: 'uk-royal-garden',
            shortTitle: '花园',
            title: '皇家花园',
            subtitle: '向右去牛津学院，向左回到伦敦',
            backgroundSrc: 'assets/room-demo/map-uk-royal-garden.png',
            groundY: 478,
            fallbackTop: '#c5e7ff',
            fallbackMiddle: '#dff0cf',
            fallbackFloor: '#8ab572'
          },
          {
            id: 'uk-oxford-college',
            shortTitle: '牛津',
            title: '牛津学院',
            subtitle: '向右去约克古城，向左回到花园',
            backgroundSrc: 'assets/room-demo/map-uk-oxford-college.png',
            groundY: 474,
            fallbackTop: '#bddfff',
            fallbackMiddle: '#d7c1a2',
            fallbackFloor: '#866751'
          },
          {
            id: 'uk-york-old-town',
            shortTitle: '约克',
            title: '约克古城',
            subtitle: '向右去爱丁堡城堡，向左回到牛津',
            backgroundSrc: 'assets/room-demo/map-uk-york-old-town.png',
            groundY: 472,
            fallbackTop: '#b9dcff',
            fallbackMiddle: '#d2bfa1',
            fallbackFloor: '#7b6754'
          },
          {
            id: 'uk-edinburgh-castle',
            shortTitle: '爱丁堡',
            title: '爱丁堡城堡',
            subtitle: '向右去康沃尔海港，向左回到约克',
            backgroundSrc: 'assets/room-demo/map-uk-edinburgh-castle.png',
            groundY: 476,
            fallbackTop: '#a9d0f5',
            fallbackMiddle: '#c7c0ad',
            fallbackFloor: '#706b5b'
          },
          {
            id: 'uk-cornwall-harbor',
            shortTitle: '康沃尔',
            title: '康沃尔海港',
            subtitle: '向右回到伦敦，向左回到爱丁堡',
            backgroundSrc: 'assets/room-demo/map-uk-cornwall-harbor.png',
            groundY: 480,
            fallbackTop: '#a8dbff',
            fallbackMiddle: '#d1eef4',
            fallbackFloor: '#739e9a'
          }
        ]
      }
    ],
    maps: []
  };
  KUROMI_ROOM_DEMO.mapSets.forEach(mapSet => {
    const backgroundMode = String(mapSet.backgroundMode || '').trim();
    if (!backgroundMode) return;
    (mapSet.maps || []).forEach(map => {
      if (!map.backgroundMode) map.backgroundMode = backgroundMode;
    });
  });
  KUROMI_ROOM_DEMO.maps = KUROMI_ROOM_DEMO.mapSets[0]?.maps || [];

  // 经济平衡：按 60 天、每天 5 科打卡设计；每完成一个科目固定获得 10 金币。
  const ECONOMY_CONFIG = {
    subjectsPerDay: 5,
    dailySubjectCoins: 10,
    dailyLoginGiftMinCoins: 0,
    dailyLoginGiftMaxCoins: 0,
    teacherDailyRewardLimit: 250,
    completeDayBonusCoins: 0,
    completeDayStreakDays: 5,
    completeDayStreakBonusCoins: 0
  };
  const MINI_EVOLUTION_COIN_COST = 80;
  const FINAL_EVOLUTION_COIN_COST = 100;
  const MINI_EVOLUTION_BONUS_RATE = 0.35;
  const EVOLUTION_STYLE_CUTE = 'cute';
  const EVOLUTION_STYLE_HEROIC = 'heroic';
  const EVOLUTION_STYLE_PREVIEW_PET_ID = 'hydroblob';
  const PET_EVOLUTION_FORM_ORIGINAL = 'original';
  const PET_EVOLUTION_FORM_MINI = 'mini';
  const PET_EVOLUTION_FORM_OPTIONS = Object.freeze([
    PET_EVOLUTION_FORM_ORIGINAL,
    PET_EVOLUTION_FORM_MINI,
    EVOLUTION_STYLE_CUTE,
    EVOLUTION_STYLE_HEROIC
  ]);
  const CUTE_ONLY_FINAL_EVOLUTION_PET_IDS = new Set([
    'crybaby',
    'hacipupu',
    'labubu',
    'skullpanda',
  'twinkle-twinkle',
  'kuromi',
  'my-melody',
  'cinnamoroll',
  'pochacco',
  'hello-kitty'
]);

  const PET_INTERACTION_ACTIONS = ['idle', 'walk', 'run', 'sleep', 'wave', 'explode', 'feed'];
  const PET_INTERACTION_SCENES = {
    home: '空旷草原'
  };
  const PET_INTERACTION_SCENE_IMAGES = {
    home: 'assets/pet-interactions/scenes/blank-meadow-builder.png'
  };
  const PET_INTERACTION_SCENE_ALIASES = {
    grassland: 'home',
    meadow: 'home',
    bedroom: 'home',
    candy: 'home',
    courtyard: 'home',
    'open-grassland': 'home',
    'open-room': 'home',
    'starry-room': 'home',
    'candy-yard': 'home',
    'magic-courtyard': 'home'
  };
  const PET_INTERACTION_WALK_ZONES = {
    home: { minX: 24, maxX: 75, minY: 0, maxY: 22 }
  };
  const PET_INTERACTION_FLIGHT_ZONES = {
    home: { minX: 18, maxX: 82, minY: 30, maxY: 62 }
  };
  const PET_INTERACTION_SPRITES = {
    'sunny-wing': { src: 'assets/pet-interactions/pets/sunny-wing-q.png', movement: 'ground' },
    sprouty: { src: 'assets/pet-interactions/pets/sprouty-q.png', movement: 'ground' },
    hydroblob: { src: 'assets/pet-interactions/pets/hydroblob-q.png', movement: 'ground' },
    fluffbit: { src: 'assets/pet-interactions/pets/fluffbit-q.png', movement: 'ground' },
    'shadow-wing': { src: 'assets/pet-interactions/pets/shadow-wing-q.png', movement: 'fly_bounded' },
    'flame-rex': { src: 'assets/pet-interactions/pets/flame-rex-q.png', movement: 'ground' },
    'thunder-beetle': { src: 'assets/pet-interactions/pets/thunder-beetle-q.png', movement: 'ground' },
    'frost-fang': { src: 'assets/pet-interactions/pets/frost-fang-q.png', movement: 'ground' },
    'volt-cheetah': { src: 'assets/pet-interactions/pets/volt-cheetah-q.png', movement: 'fast_ground' },
    'shadow-stalker': { src: 'assets/pet-interactions/pets/shadow-stalker-q.png', movement: 'ground' },
    crybaby: { src: 'assets/pet-interactions/pets/crybaby-q.png', movement: 'ground' },
    hacipupu: { src: 'assets/pet-interactions/pets/hacipupu-q.png', movement: 'ground' },
    labubu: { src: 'assets/pet-interactions/pets/labubu-q.png', movement: 'ground' },
    skullpanda: { src: 'assets/pet-interactions/pets/skullpanda-q.png', movement: 'ground' },
    'twinkle-twinkle': { src: 'assets/pet-interactions/pets/twinkle-twinkle-q.png', movement: 'hover_bounded' },
    pikachu: { src: 'assets/pet-interactions/pets/pikachu-q.png', movement: 'fast_ground' },
    mewtwo: { src: 'assets/pet-interactions/pets/mewtwo-q.png', movement: 'hover_bounded' },
    lucario: { src: 'assets/pet-interactions/pets/lucario-q.png', movement: 'ground' },
    greninja: { src: 'assets/pet-interactions/pets/greninja-q.png', movement: 'fast_ground' },
    charizard: { src: 'assets/pet-interactions/pets/charizard-q.png', movement: 'fly_bounded' },
    psyduck: { src: 'assets/pet-interactions/pets/psyduck-q.png', movement: 'ground' },
    squirtle: { src: 'assets/pet-interactions/pets/squirtle-q.png', movement: 'ground' },
    wolf: { src: 'assets/pet-interactions/pets/wolf-q.png', movement: 'ground' },
    steve: { src: 'assets/pet-interactions/pets/steve-q.png', movement: 'ground' },
    enderman: { src: 'assets/pet-interactions/pets/enderman-q.png', movement: 'hover_bounded' },
    enderdragon: { src: 'assets/pet-interactions/pets/enderdragon-q.png', movement: 'fly_bounded' },
    creeper: { src: 'assets/pet-interactions/pets/creeper-q.png', movement: 'ground', canExplode: true },
    kuromi: { src: 'assets/pet-interactions/pets/kuromi-q.png', movement: 'ground' },
    'my-melody': { src: 'assets/pet-interactions/pets/my-melody-q.png', movement: 'ground' },
    cinnamoroll: { src: 'assets/pet-interactions/pets/cinnamoroll-q.png', movement: 'fly_bounded' },
    pochacco: { src: 'assets/pet-interactions/pets/pochacco-q.png', movement: 'fast_ground' },
    'hello-kitty': { src: 'assets/pet-interactions/pets/hello-kitty-q.png', movement: 'ground' },
    'winnie-the-pooh': { src: 'assets/pet-interactions/pets/winnie-the-pooh-q.png', movement: 'ground' },
    'crayon-shinchan': { src: 'assets/pet-interactions/pets/crayon-shinchan-q.png', movement: 'fast_ground' },
    'ugly-fish': { src: 'assets/pet-interactions/pets/ugly-fish-q.png', movement: 'ground' },
    yoyo: { src: 'assets/pet-interactions/pets/yoyo-q.png', movement: 'ground' }
  };
  const PET_INTERACTION_FOODS = [
    { id: 'apple', label: '苹果', icon: '🍎' },
    { id: 'cookie', label: '饼干', icon: '🍪' },
    { id: 'carrot', label: '胡萝卜', icon: '🥕' }
  ];
  const PET_FEED_RESPONSES = [
    { zh: '谢谢你！❤️', en: 'Thank you! ❤️' },
    { zh: '好吃好吃！', en: 'Yum yum!' },
    { zh: '还想再吃一口！', en: 'One more bite, please!' },
    { zh: '今天也元气满满！', en: 'I feel full of energy!' },
    { zh: '你对我最好啦！', en: 'You are the best!' },
    { zh: '太幸福了吧！', en: 'So happy!' },
    { zh: '这个味道我喜欢！', en: 'I love this taste!' },
    { zh: '吃饱就有力气冒险！', en: 'Now I can go adventuring!' },
    { zh: '我的心情变好了！', en: 'I feel better now!' },
    { zh: '我会继续陪你打卡！', en: 'I will keep checking in with you!' }
  ];
  const PET_INTERACTION_GRID = { rows: 10, cols: 20 };
  const PET_INTERACTION_FURNITURE = [
    { id: 'tree', label: '大树', icon: '🌳', image: 'assets/pet-interactions/furniture/tree.png', price: 8, width: 2, height: 3, layer: 3, size: 1.18 },
    { id: 'tall-grass', label: '高草', icon: '🌾', image: 'assets/pet-interactions/furniture/tall-grass.png', price: 2, width: 1, height: 1, layer: 1, size: 0.94 },
    { id: 'lounge-chair', label: '躺椅', icon: '🪑', image: 'assets/pet-interactions/furniture/lounge-chair.png', price: 6, width: 3, height: 2, layer: 2, size: 1 },
    { id: 'flower-bush', label: '花丛', icon: '🌸', image: 'assets/pet-interactions/furniture/flower-bush.png', price: 3, width: 2, height: 1, layer: 1, size: 0.9 },
    { id: 'study-mat', label: '学习垫', icon: '📚', image: 'assets/pet-interactions/furniture/study-mat.png', price: 4, width: 3, height: 1, layer: 1, size: 0.94 }
  ];
  const PET_INTERACTION_FURNITURE_LIMIT = 30;
  const PET_INTERACTION_SCENE_KEY = 'cy-pet-interaction-scene';
  const FRIEND_GIFT_AMOUNTS = [20, 50, 100, 200];
  const BLIND_BOX_PRICE = 120;
  const BLIND_BOX_IMAGE = 'assets/rewards/blind-box.png';
  const GIFT_BOX_IMAGE = 'assets/rewards/gift-box.png';
  const ROOM_MEMBER_LIMIT = 10;
  const ROOM_SCENES = [
    { id: 'open-grassland', label: '空旷草原', legacyScene: 'home' }
  ];
  const ROOM_CHAT_REFRESH_MS = 2500;
  const INTERACTION_ROOM_MOVING_HEARTBEAT_MS = 350;
  const INTERACTION_ROOM_IDLE_HEARTBEAT_MS = 1500;
  const INTERACTION_ROOM_DISCONNECT_GRACE_MS = 120000;
  const INTERACTION_ROOM_MAX_SILENT_FAILURES = 20;
  const INTERACTION_ROOM_BIG_SIZE_SCALE = 2.25;
  const INTERACTION_ROOM_SUPER_SIZE_SCALE = 2.7;
  const INTERACTION_ROOM_MAX_RENDER_SCALE = 2.8;
  const INTERACTION_ROOM_MAX_SPRITE_WIDTH_MULTIPLIER = 2.1;
  const INTERACTION_ROOM_MAX_SPRITE_HEIGHT_MULTIPLIER = 1.3;
  const INTERACTION_ROOM_PET_SIZE_STORAGE_KEY = 'cy-pets-interaction-room-pet-size';
  const INTERACTION_ROOM_DEFAULT_PET_SIZE = 'small';
  const INTERACTION_ROOM_PET_SIZE_OPTIONS = [
    { id: 'small', label: '小', title: '原版小', subtitle: '原来的可爱尺寸', scale: 1 },
    { id: 'big', label: '大', title: '大只', subtitle: '房间里更抢眼', scale: INTERACTION_ROOM_BIG_SIZE_SCALE },
    { id: 'super', label: '超大', title: '超大只', subtitle: '彩蛋主角尺寸', scale: INTERACTION_ROOM_SUPER_SIZE_SCALE }
  ];
  const PERMANENT_INTERACTION_ROOM_FALLBACKS = [
    { roomId: 'MKPRIMARY', roomName: '5+1 智慧总院', ownerStudentId: '510000', ownerName: '5+1教育补习中心', mapSetId: 'paris-trip', memberLimit: 30, isPermanent: true },
    { roomId: 'STPPRIMARY', roomName: '5+1 旗舰校区', ownerStudentId: '510000', ownerName: '5+1教育补习中心', mapSetId: 'xian-trip', memberLimit: 30, isPermanent: true },
    { roomId: 'CYMEET2026', roomName: '5+1 教师研讨室', ownerStudentId: '510000', ownerName: '5+1教育补习中心', mapSetId: 'cy-school', memberLimit: 30, isPermanent: true },
    { roomId: 'WSPRIMARY', roomName: '5+1 菁英校区', ownerStudentId: '510000', ownerName: '5+1教育补习中心', mapSetId: 'uk-trip', memberLimit: 30, isPermanent: true },
    { roomId: 'LEARNERS2026', roomName: "5+1 荣耀研习社", ownerStudentId: '510000', ownerName: '5+1教育补习中心', mapSetId: 'beijing-trip', memberLimit: 30, isPermanent: true }
  ];
  const INTERACTION_ROOM_FLY_HEIGHT_RATIO = 0.75;
  const INTERACTION_ROOM_MAX_FLOAT_OFFSET = 320;
  const INTERACTION_ROOM_LABEL_GAP = 6;
  const INTERACTION_ROOM_MIN_LABEL_Y = 52;
  const INTERACTION_ROOM_SPEECH_BUBBLE_GAP = 8;
  const INTERACTION_ROOM_FLYING_SPEECH_BODY_RATIO = 0.64;
  const INTERACTION_ROOM_FINAL_FLYING_PET_IDS = new Set(['sunny-wing', 'hydroblob']);
  const INTERACTION_ROOM_PET_RENDER_SETTINGS = {
    'shadow-wing': { floatOffset: 88, flying: true },
    'thunder-beetle': { floatOffset: 90, flying: true },
    mewtwo: { floatOffset: 96, flying: true },
    charizard: { floatOffset: 96, flying: true },
    enderman: { floatOffset: 112, flying: true, alwaysFloating: true, hoverTilt: 0.11 },
    enderdragon: { floatOffset: 112, flying: true }
  };
  const KUROMI_ROOM_SPRITE_TRIM_CACHE = new WeakMap();
  const ROOM_DECORATIONS = [
    { id: 'flower-pot', label: '小花盆', icon: '🌷', price: 8, x: 18, y: 78 },
    { id: 'study-lamp', label: '学习灯', icon: '💡', price: 12, x: 78, y: 28 },
    { id: 'soft-rug', label: '软地毯', icon: '🟩', price: 10, x: 52, y: 84 },
    { id: 'star-balloon', label: '星星气球', icon: '⭐', price: 15, x: 82, y: 18 }
  ];
  const ROOM_GUEST_POSITIONS = [
    { x: 22, y: 9 },
    { x: 42, y: 12 },
    { x: 64, y: 10 },
    { x: 80, y: 22 },
    { x: 31, y: 26 },
    { x: 52, y: 27 },
    { x: 71, y: 31 },
    { x: 17, y: 31 },
    { x: 88, y: 8 }
  ];

  // 本机演示名单只给 DEMO 账号使用；正式学生名单由 Supabase 提供。
  const DEMO_STUDENTS = {
    '511001': { name: '林子轩', branch: '5+1 智慧总院', className: 'Form 2', avatar: '🌟' },
    '511002': { name: '陈思琪', branch: '5+1 旗舰校区', className: 'Form 3', avatar: '🌈' },
    '511003': { name: '张凯文', branch: '5+1 菁英校区', className: 'Form 1', avatar: '⚡' },
    '511004': { name: '李美华', branch: '5+1 智慧总院', className: 'Form 2', avatar: '🌸' },
    '511005': { name: '黄俊杰', branch: '5+1 旗舰校区', className: 'Form 3', avatar: '🔥' },
    DEMO001: { name: '小明', branch: '5+1 智慧总院', className: 'Form 2', avatar: '🌟' },
    DEMO002: { name: '小美', branch: '5+1 旗舰校区', className: 'Form 3', avatar: '🌈' },
    DEMO003: { name: '小杰', branch: '5+1 菁英校区', className: 'Form 1', avatar: '🚀' },
    CY0000: { name: '5+1 管理员', branch: '5+1 智慧总院', className: 'Admin', avatar: '👑' },
    CY1001: { name: '林子轩', branch: '5+1 智慧总院', className: 'Form 2', avatar: '🌟' },
    CY1002: { name: '陈思琪', branch: '5+1 旗舰校区', className: 'Form 3', avatar: '🌈' }
  };

  // 稀有度规则先集中放在这里，之后可以按学校的奖励经济调整价格和条件。
  const PET_RARITIES = [
    { id: 'A', label: 'A 级', className: 'rarity-a', description: '首次登录选择的初始宠物', price: 25, requiredCheckins: 0 },
    { id: 'R', label: 'R 级', className: 'rarity-r', description: '可以在商店购买', price: 45, requiredCheckins: 3 },
    { id: 'SR', label: 'SR 级', className: 'rarity-sr', description: '可以在商店购买', price: 70, requiredCheckins: 10 },
    { id: 'SSR', label: 'SSR 级', className: 'rarity-ssr', description: '可以在商店购买', price: 100, requiredCheckins: 20 },
    { id: 'LEGEND', label: 'LEGEND', className: 'rarity-legend', description: '可以在商店购买', price: 140, requiredCheckins: 40 },
    { id: 'LIMITED', label: 'LIMITED EDITION', className: 'rarity-limited', description: '限定版宠物', price: 160, requiredCheckins: 0 },
    { id: 'MYTHIC', label: 'MYTHIC 神话级', className: 'rarity-mythic', description: '进化后的神话级宠物', price: 0, requiredCheckins: 0 }
  ];

  const EVOLUTION_RARITY_MULTIPLIERS = {
    A: 10,
    R: 14,
    SR: 18,
    SSR: 24,
    LEGEND: 32,
    LIMITED: 45,
    MYTHIC: 45
  };

  const WALL_POST_PRESETS = [
    '你们都收集几个了？',
    '我的宠物进化了！',
    '看看我的战力！',
    '我正在收集专属装备！',
    '今天也有认真打卡！',
    '今天战力又变强了！',
    '谁要和我一起打卡？',
    '我的装备快收集齐了！',
    '来看看我的新造型！',
    '我离进化更近了！',
    '今天也要冲满五科！',
    '这只伙伴太可靠了！'
  ];

  const WALL_COMMENT_PRESETS = [
    '太帅了吧！',
    '加油！',
    '我也想要这只！',
    '战力好高！',
    '一起继续打卡！',
    '好强！',
    '这个装备很酷！',
    '继续冲！'
  ];
  const WALL_POST_RETENTION_MS = 5 * 24 * 60 * 60 * 1000;

  const PET_SERIES_GROUPS = [
    { id: 'all', label: '全部系列', hint: '所有可以收集的宠物' },
    { id: 'cy-original', label: 'Bit Pets', hint: '假期学习原创伙伴' },
    { id: 'popmart', label: 'Popmart', hint: '可爱收藏系列' },
    { id: 'pokemon', label: 'Pokemon', hint: '战斗伙伴系列' },
    { id: 'minecraft', label: 'Minecraft', hint: '方块冒险系列' },
    { id: 'sanrio', label: 'Sanrio', hint: '治愈可爱系列' },
    { id: 'cartoon', label: 'Cartoon Stars', hint: '童趣伙伴系列' }
  ];

  const PET_SERIES_BY_ID = {
    crybaby: 'popmart',
    hacipupu: 'popmart',
    labubu: 'popmart',
    skullpanda: 'popmart',
    'twinkle-twinkle': 'popmart',
    pikachu: 'pokemon',
    mewtwo: 'pokemon',
    lucario: 'pokemon',
    greninja: 'pokemon',
    charizard: 'pokemon',
    psyduck: 'pokemon',
    squirtle: 'pokemon',
    wolf: 'minecraft',
    steve: 'minecraft',
    enderman: 'minecraft',
    enderdragon: 'minecraft',
    creeper: 'minecraft',
    kuromi: 'sanrio',
    'my-melody': 'sanrio',
    cinnamoroll: 'sanrio',
    pochacco: 'sanrio',
    'hello-kitty': 'sanrio',
    'winnie-the-pooh': 'cartoon',
    'crayon-shinchan': 'cartoon',
    'ugly-fish': 'cartoon',
    yoyo: 'cartoon'
  };

  const COLLECTION_TITLE_POOLS = {
    minecraft: [
      'Minecraft Legend (创世神明)',
      '像素宇宙霸主 (Pixel Overlord)',
      '顶级方块建筑师 (Supreme Block Architect)'
    ],
    popmart: [
      'Popmart Supreme (潮玩图鉴王)',
      '隐藏款收割机 (Hidden Figure Harvester)',
      '盲盒终极欧皇 (Blind Box Luck Emperor)'
    ],
    sanrio: [
      'Sanrio Guardian (梦幻守护者)',
      '童话镇长 (Mayor of Fairy Tale Town)',
      '首席萌物培育家 (Chief Cuteness Breeder)'
    ],
    minion: [
      'Minion Overlord (迷你兵团长)',
      '终极捣蛋大师 (Ultimate Mischief Master)',
      '香蕉帝国大亨 (Banana Empire Tycoon)'
    ],
    pokemon: [
      'Pokemon Master (宝可梦大师)',
      '传奇训练家 (Legendary Trainer)',
      '全能口袋培育员 (Omnipotent Pocket Breeder)'
    ],
    cartoon: [
      'Cartoon Superstar (童趣明星)',
      '快乐收藏家 (Happy Collector)',
      '童年回忆守护者 (Childhood Memory Guardian)'
    ],
    'cy-original': [
      '5+1 宠物图鉴王 (5+1 Pets Champion)',
      'Bit Pets Explorer (像素伙伴探险家)',
      '5+1 专属学习守护者 (5+1 Learning Guardian)'
    ]
  };

  const LANGUAGE_KEY = 'holiday-checkin-language-v1';
  const NEW_PLAYER_GUIDE_COMPLETION_VERSION = '20260824-26';
  const NEW_PLAYER_GUIDE_COMPLETION_KEY = 'holiday-new-player-guide-completed-v7';
  const DAILY_CHECKIN_GUIDE_ID = 'daily-checkin-reminder';
  const DAILY_CHECKIN_GUIDE_COMPLETION_VERSION = '20260828-01';
  const YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID = 'yiyan-blind-box-apology';
  const YIYAN_BLIND_BOX_APOLOGY_MAX_RUNS = 2;
  const TEACHER_NEW_MUSIC_GUIDE_ID = 'teacher-new-music';
  const TEACHER_NEW_MUSIC_GUIDE_COMPLETION_VERSION = '20260826-01';
  const TEACHER_NEW_MUSIC_GUIDE_COMPLETION_KEY = 'holiday-teacher-new-music-guide-completed-v1';
  const NEW_PLAYER_GUIDE_GREETING_PET_IDS = new Set(['sunny-wing', 'sprouty', 'hydroblob', 'fluffbit']);
  const TRANSLATIONS = {
    en: {
      'CY PETS STORY': 'CY PETS STORY',
      '语言选择': 'Language',
      '学习背景音乐': 'Learning background music',
      '5+1教育补习中心': '5+1 Tuition Center',
      'FIVE + ONE TUITION CENTER': 'FIVE + ONE TUITION CENTER',
      '5+1 朋友 ID': '5+1 Friend ID',
      '5+1 教师教学管理控制台': '5+1 Teacher Management Console',
      '进入 5+1 学习世界 🚀': 'Enter 5+1 Learning World 🚀',
      '5+1 学习乐园': '5+1 Learning Realm',
      '假期学习宠物打卡': '5+1 Pets Learning',
      '每天学习一点点，陪伴你的宠物一起成长！': 'Learn a little every day and grow with your pet!',
      '请输入学生 ID': 'Enter Student ID',
      '请输入老师给你的 ID': 'Enter the ID from your teacher',
      '进入我的学习世界': 'Enter My Learning World',
      '演示账号：': 'Demo accounts:',
      '自由搭配 Demo': 'Free Demo',
      '系统演示': 'System Demo',
      '演示学生': 'Demo Student',
      '演示分行': 'Demo Branch',
      '进入自由搭配 Demo': 'Enter Free Demo',
      '老师入口（演示版）': 'Teacher Entrance (Demo)',
      '老师奖励入口': 'Teacher Rewards',
      '课堂表现金币管理': 'Classroom reward coins',
      '退出老师入口': 'Exit Teacher Mode',
      '根据课堂表现奖励金币': 'Reward Coins For Classroom Performance',
      '选择学生后，点击一次奖励额度即可批量增加金币。每次操作都会留下老师奖励记录。': 'Select students, then tap one reward amount to add coins in batch. Every action is recorded.',
      '+2 至 +1000': '+2 to +1000',
      '+2 / +4 / +6 / +8 / +10 / +20 / +50 / +100 / +250 / +1000': '+2 / +4 / +6 / +8 / +10 / +20 / +50 / +100 / +250 / +1000',
      '快捷奖励额度 · 学生每日最多 250，CY0000/CY0001 可给老师账号无上限': 'Quick Reward Amounts · Students Max 250 Daily, CY0000/CY0001 Can Reward Teacher Accounts Without Limit',
      '快捷奖励额度': 'Quick Reward Amounts',
      '老师班级同步': 'Teacher Class Sync',
      '老师 ID': 'Teacher ID',
      '例如 T001': 'e.g. T001',
      '班级': 'Class',
      '本机演示名单': 'Local Demo List',
      '读取班级': 'Load Classes',
      'Supabase 模式会按分院和班级整理学生名单。': 'Supabase groups students by branch and class.',
      '学生名单': 'Student List',
      '演示版先读取本机演示名单；正式版会读取 Supabase 班级名单。': 'The demo loads local students first. Live mode loads Supabase class lists.',
      '全选': 'Select All',
      '给已选账号增加金币：': 'Add coins to selected accounts:',
      '+100': '+100',
      '+250': '+250',
      '+1000': '+1000',
      '演示开放中': 'Demo Open',
      '学生': 'Student',
      '退出登录': 'Log Out',
      '刷新 Sheet 数据': 'Refresh Sheet Data',
      '同步': 'Sync',
      '同步中': 'Syncing',
      '正在同步 Sheet...': 'Syncing Sheet...',
      '本机演示资料已是最新。': 'Local demo data is already up to date.',
      '已同步最新 Sheet 资料。': 'Latest Sheet data synced.',
      '你好，': 'Hello, ',
      '同学': 'Student',
      '！': '!',
      '天连续打卡': 'day streak',
      '主要页面': 'Main Pages',
      '我的宠物': 'My Pets',
      '修改名字': 'Edit Name',
      '保存名字': 'Save Name',
      '取消修改': 'Cancel Edit',
      '名字已经保存。': 'Name saved.',
      '宠物名字已经保存。': 'Pet name saved.',
      '先填写你的名字。': 'Enter your name first.',
      '关闭新手指引': 'Close Tour',
      '先自己看看': 'Explore Myself',
      '下一步': 'Next',
      '完成': 'Finish',
      '新手指引': 'Starter Tour',
      '你好啊！主人！': 'Hello, owner!',
      '玩法教学': 'How to Play',
      '宠物互动': 'Pet Wall',
      '宠物墙': 'Pet Wall',
      '分享宠物墙': 'Share Pet Wall',
      '选择宠物墙房间': 'Choose Pet Wall Room',
      '好友宠物墙房间': 'Friend Pet Wall Room',
      '好友乐园': 'Friends',
      '好友': 'Friends',
      '学习伙伴': 'Learning Friend',
      '添加好友、查看收集进度，也可以把小礼物送给同学。': 'Add friends, view collection progress, and send small gifts to classmates.',
      '刷新好友': 'Refresh Friends',
      '添加好友': 'Add Friend',
      '搜索好友名字或 ID': 'Search friend name or ID',
      '输入好友名字或 ID': 'Enter friend name or ID',
      '搜索': 'Search',
      '通知信箱': 'Mail',
      '通知状态': 'Notification status',
      '一键删除': 'Delete All',
      '好友列表': 'Friend List',
      '好友主页': 'Friend Home',
      '输入名字或 ID 后搜索好友。': 'Search by name or ID to find friends.',
      '尚未选择宠物': 'No pet chosen yet',
      '已是好友': 'Already Friends',
      '添加': 'Add',
      '正在读取好友...': 'Loading friends...',
      '还没有好友。先搜索同学 ID，等对方同意后就会出现在这里。': 'No friends yet. Search for a classmate ID, then they will appear here after accepting.',
      '进入主页': 'View Home',
      '赠送礼物': 'Send Gift',
      '进入中': 'Entering',
      '同意': 'Accept',
      '拒绝': 'Reject',
      '通知': 'Notification',
      '领取': 'Claim',
      '删除': 'Delete',
      '暂时没有新通知。': 'No new notifications right now.',
      '好友，有新通知': 'Friends, new notifications',
      '好友功能需要连接 Supabase 云端后使用。': 'Friends require the Supabase cloud connection.',
      '选择一位好友，就可以进入他的宠物主页。': 'Choose a friend to view their pet home.',
      '这位好友还没有选择宠物。': 'This friend has not chosen a pet yet.',
      '只读主页': 'Read-only home',
      '生日': 'Birthday',
      '好友装备': 'Friend Gear',
      '这只宠物尚未装备任何物品。': 'This pet has no gear equipped yet.',
      '好友其他宠物': 'Other Friend Pets',
      '宠物墙聊天': 'Pet Wall Chat',
      '互动区': 'Interaction Area',
      '分享互动区': 'Share Interaction Area',
      '互动区菜单': 'Interaction Menu',
      '加入房间': 'Join Room',
      '加入好友房间': 'Join Friend Room',
      '好友互动房间': 'Friend Interaction Room',
      '会先读取好友当前所在的房间；如果好友在线，就直接进入同一个互动房间。': 'Checks where your friend is first. If they are online, you will enter the same interaction room.',
      '好友房间需要连接云端后使用。': 'Friend rooms need the cloud connection.',
      '这位好友现在不在互动房间里。': 'This friend is not in an interaction room right now.',
      '好友在有密码的房间，请到互动区输入密码加入。': 'Your friend is in a password room. Enter the password in the interaction area to join.',
      '好友所在房间已经满了。': 'The friend room is full.',
      '看看现在开放的房间，输入密码或直接进入。': 'See open rooms, enter a password or join directly.',
      '创建房间': 'Create Room',
      '自己开一个房间，朋友可以一起进来玩。': 'Open a room so friends can play together.',
      '带宠物去玩': 'Play With Pet',
      '返回互动区': 'Back to Interaction Area',
      '← 返回互动区': '← Back to Interaction Area',
      '挑战反应轮盘、CY跳跳跳、CY跑跑跑和CY跳一跳。': 'Play reaction wheel, CY Jump, CY Run and CY Hop.',
      '房间角色大小': 'Room Pet Size',
      '朋友也会看到这个大小': 'Friends will see this size too',
      '小黄脸表情包': 'Emoji Reactions',
      '发送表情': 'Send Emoji',
      '打开表情包': 'Open Emoji Reactions',
      '关闭表情包': 'Close Emoji Reactions',
      '原版小': 'Original Small',
      '原来的可爱尺寸': 'The original cute size',
      '大只': 'Big',
      '房间里更抢眼': 'Easier to spot in rooms',
      '超大只': 'Super Big',
      '彩蛋主角尺寸': 'Spotlight easter egg size',
      '已选择': 'Selected',
      '房间连接正在恢复': 'Room Connection Recovering',
      '已保留固定房间入口，可以点刷新再试。': 'Permanent room entrances are kept here. Tap refresh to try again.',
      '返回': 'Back',
      '刷新中': 'Refreshing',
      '刷新房间列表': 'Refresh Rooms',
      '选择一个小游戏开始。': 'Choose a mini game to start.',
      'CY反应轮盘': 'CY Reaction Wheel',
      '看准发光区域，点击命中。': 'Watch the glowing zone and tap to hit.',
      'CY跳跳跳': 'CY Jump Jump',
      '让整只宠物飞过云朵空隙。': 'Fly your pet through the cloud gaps.',
      'CY跑跑跑': 'CY Run Run',
      '带宠物越过路上的障碍。': 'Help your pet jump over obstacles.',
      'CY跳一跳': 'CY Hop Hop',
      '按住蓄力，松手跳到下一块平台。': 'Hold to charge, then release to hop to the next platform.',
      'CY跳一跳排行榜': 'CY Hop Hop Leaderboard',
      '我的跳一跳最高分': 'My CY Hop Best',
      '跳一跳': 'Hop Hop',
      '按住蓄力': 'Hold To Charge',
      '建议横屏游玩；电脑可以用 Space / Enter / ↑ / W 操作，手机可以点画面或按钮。': 'Landscape mode is better. On computer, use Space / Enter / ↑ / W. On phone, tap the screen or the buttons.',
      '进化轮盘挑战': 'Evolution Wheel Challenge',
      '连续命中发光区域': 'Hit The Glowing Zone In A Row',
      '角色进化失败。可以重新挑战，或者按右上角关闭。': 'Evolution failed. Try again or press the top-right close button.',
      '挑战成功！进化继续。': 'Challenge cleared! Evolution continues.',
      '点击命中': 'Tap To Hit',
      '差一点！继续看准绿色区域。': 'So close! Keep watching the green zone.',
      '完成挑战！再玩一次可以继续练反应。': 'Challenge complete! Play again to train your reaction.',
      '点击画面，让整只宠物飞起来。': 'Tap the screen to make your pet fly.',
      '碰到了！按重新开始再挑战。': 'Oops, you hit something! Restart and try again.',
      '点击跳起，避开路上的小方块。': 'Tap jump to avoid the small blocks.',
      '点击跳起，避开路上的障碍。': 'Tap jump to avoid obstacles.',
      '撞到了！按重新开始再跑一次。': 'You bumped into it! Restart and run again.',
      '撞到了，分数收好啦。': 'You bumped into something. Score saved.',
      '差一点，马上再来。': 'So close. Try again.',
      '穿过了！继续保持节奏。': 'You passed through! Keep the rhythm.',
      '保持节奏，穿过云门。': 'Keep the rhythm and pass through the cloud gates.',
      '扑一下！': 'Flap!',
      '奔跑中！看准时机跳起。': 'Running! Time your jump.',
      '跳！': 'Jump!',
      '按住画面或 Space 蓄力，松开跳到下一块平台。': 'Hold the screen or Space to charge. Release to hop to the next platform.',
      '蓄力中，松开就跳！': 'Charging. Release to hop!',
      '跳出去了！': 'Hopping!',
      '完美落点！中心奖励到手。': 'Perfect landing! Center bonus collected.',
      '落稳了！继续看距离。': 'Nice landing! Keep reading the distance.',
      '落空了，分数收好啦。': 'Missed it. Score saved.',
      '再跳一次': 'Hop Again',
      '准备跳跃': 'Ready To Hop',
      '点击、触屏或按住 Space 蓄力': 'Click, touch, or hold Space to charge',
      '小指针醒啦': 'The pointer is awake',
      '差一点': 'So Close',
      '成功': 'Hit',
      '完成': 'Done',
      '进化失败': 'Evolution Failed',
      '跳一下': 'Flap',
      '分数': 'Score',
      '准度': 'Accuracy',
      '开始': 'Start',
      '准备起飞': 'Ready To Fly',
      '再飞一次': 'Fly Again',
      '撞到了': 'Game Over',
      '准备开跑': 'Ready To Run',
      '点击、触屏或按空格上弹': 'Click, tap, or press Space to flap',
      '点击跳起避开障碍': 'Tap jump to avoid obstacles',
      '重新挑战': 'Retry',
      '左右移动': 'Move Left And Right',
      '跳起、蹲下和躺下': 'Jump, Crouch And Lie',
      '向左走': 'Move Left',
      '向右走': 'Move Right',
      '跳起': 'Jump',
      '蹲下': 'Crouch',
      '起': 'Up',
      '站起': 'Stand Up',
      '躺': 'Lie',
      '躺下': 'Lie Down',
      '全屏横屏': 'Fullscreen',
      '× 退出': '× Exit',
      '退出全屏': 'Exit Fullscreen',
      '进入全屏横屏': 'Enter Fullscreen',
      '选择宠物场景': 'Choose Pet Scene',
      '温馨小屋': 'Cozy Room',
      '空旷草原': 'Open Meadow',
      '阳光草原': 'Sunny Grassland',
      '星空房间': 'Starry Bedroom',
      '糖果乐园': 'Candy Playground',
      '魔法庭院': 'Magic Courtyard',
      '宠物互动区': 'Pet Wall',
      '点击宠物互动': 'Tap Pet To Interact',
      'Q 版宠物': 'Q-style Pet',
      '拖拽食物喂宠物': 'Drag Food To Feed Pet',
      '选择家具': 'Choose Furniture',
      '已摆放家具': 'Placed Furniture',
      '大树': 'Tree',
      '高草': 'Tall Grass',
      '躺椅': 'Lounge Chair',
      '花丛': 'Flower Bush',
      '学习垫': 'Study Mat',
      '拿起': 'Pick Up',
      '苹果': 'Apple',
      '饼干': 'Cookie',
      '胡萝卜': 'Carrot',
      '好吃！': 'Yummy!',
      '叫它过来': 'Call It Over',
      'Q版互动开启': 'Q Pet On',
      'Q版互动关闭': 'Q Pet Off',
      '互动已开启。': 'Interaction On.',
      '互动已暂停。': 'Interaction Paused.',
      '今日打卡': 'Daily Check-in',
      '学习打卡': 'Study Check-in',
      '音乐盒': 'Music Box',
      '音乐盒即将开放': 'Music Box Coming Soon',
      '之后会在这里收集背景音乐和可爱的音效。': 'Background music and cute sound effects will be collected here later.',
      '音乐盒即将开放。': 'Music Box is coming soon.',
      '装备图鉴': 'Equipment Guide',
      '去宠物商店看看 →': 'View Pet Shop →',
      '全部系列': 'All Series',
      '所有可以收集的宠物': 'All collectible pets',
      '假期学习原创伙伴': 'Original holiday learning companions',
      '可爱收藏系列': 'Cute collectible series',
      '战斗伙伴系列': 'Battle companion series',
      '方块冒险系列': 'Block adventure series',
      '治愈可爱系列': 'Cozy cute series',
      '系列商店': 'Series Shop',
      '宠物 + 专属装备': 'Pets + Exclusive Gear',
      '按照系列查看宠物。点进分类后，可以看到每只宠物和它自己的专属装备。': 'Browse pets by series. Open a category to see each pet and its own exclusive gear.',
      '选择宠物系列': 'Choose Pet Series',
      '宠物可购买 / 切换': 'Pets Can Be Bought / Switched',
      '专属装备会显示在对应宠物的栏位里；购买装备仍在当前宠物主页完成，避免买错角色。': 'Exclusive gear appears inside the matching pet card. Gear purchases still happen on the current pet home to avoid buying for the wrong role.',
      '已买齐专属装备': 'Exclusive Gear Complete',
      '展开我的宠物': 'Show My Pets',
      '收起我的宠物': 'Hide My Pets',
      '查看全部宠物': 'View All Pets',
      '已收起，按下方按钮才会显示全部宠物。': 'Collapsed. Tap the button below to show all owned pets.',
      '专属装备': 'Exclusive Gear',
      '暂无专属装备': 'No Exclusive Gear Yet',
      '回到宠物主页购买': 'Buy On Pet Home',
      '当前宠物': 'Current Pet',
      '已拥有': 'Owned',
      '未拥有': 'Not Owned',
      '查看属性和装备': 'View Stats And Gear',
      '收起属性和装备': 'Hide Stats And Gear',
      '选择一句预设留言': 'Choose A Preset Comment',
      '发送预设留言': 'Send Preset Comment',
      '最近留言': 'Latest Comments',
      '留言墙': 'Message Wall',
      '打卡记录': 'Check-in Records',
      '先认识打卡、金币、宠物、装备、进化和留言墙。会玩以后，每一次学习都会变成看得见的成长。': 'Learn how check-ins, coins, pets, equipment, evolution and the message wall work. Every study step becomes visible growth.',
      '开始今日打卡': 'Start Daily Check-in',
      '看看宠物商店': 'View Pet Shop',
      '如何获得更多宠物': 'How To Get More Pets',
      '每天认真完成任务，金币会慢慢累积；金币足够后，就可以到宠物商店购买新的伙伴。': 'Finish tasks every day to build up coins. When you have enough coins, buy new companions in the pet shop.',
      '每日打卡实际游玩画面': 'Daily check-in gameplay screenshot',
      '第 1 步': 'Step 1',
      '完成每日打卡': 'Complete Daily Check-ins',
      'BM、BC、BI、SC、MM 每科完成后都会得到金币。每天稳定打卡，就是收集宠物最快的开始。': 'Completing BM, BC, BI, SC and MM gives coins. Steady daily check-ins are the fastest way to collect pets.',
      '去打卡': 'Start Check-in',
      '宠物商店实际游玩画面': 'Pet shop gameplay screenshot',
      '第 2 步': 'Step 2',
      '去宠物商店购买': 'Buy From The Pet Shop',
      '不同稀有度的宠物价格不同。先买想培养的角色，再回到主页为它准备专属装备。': 'Pets with different rarities cost different amounts. Buy the role you want to train, then prepare its exclusive gear on the home page.',
      '打开商店': 'Open Shop',
      '如何让宠物进化': 'How To Evolve Pets',
      '宠物会靠装备和进化阶段变强。达到条件后，进化会解锁新的形态，战斗值和属性也会明显变强。': 'Pets grow stronger through equipment and evolution stages. When the conditions are met, evolution unlocks a new form with stronger stats and combat power.',
      '宠物主页实际游玩画面': 'Pet home gameplay screenshot',
      '培养': 'Train',
      '查看等级、战力和属性': 'View Level, Power And Stats',
      '宠物主页会显示当前角色卡、等级、属性、战力、技能和装备状态。成长变化都可以在这里看到。': 'The pet home shows the role card, level, stats, combat power, skills and equipment. Growth changes appear here.',
      '回到宠物主页': 'Back To Pet Home',
      '宠物进化实际游玩画面': 'Pet evolution gameplay screenshot',
      '进化': 'Evolve',
      '达到条件后完成觉醒': 'Awaken When Ready',
      '等级、打卡和专属装备都会影响进化准备。进化后会变成更强的觉醒形态。': 'Levels, check-ins and exclusive gear all help prepare for evolution. After evolution, the pet becomes a stronger awakened form.',
      '查看进化进度': 'View Evolution Progress',
      '网站里还有什么好玩的': 'More Fun Things In The App',
      '这个 App 不只是打卡。你可以装备角色、看技能、比较战力，也可以把自己的宠物卡分享到留言墙。': 'This app is more than check-ins. Equip roles, view skills, compare power and share pet cards to the message wall.',
      '留言墙实际游玩画面': 'Message wall gameplay screenshot',
      '分享': 'Share',
      '把角色卡分享到留言墙': 'Share Role Cards To The Message Wall',
      '选择预设文字后，可以分享宠物名字、等级、战力、属性和装备。同学也可以点赞和留言鼓励。': 'Choose a preset message to share your pet name, level, power, stats and equipment. Classmates can like and leave preset comments.',
      '去留言墙': 'Go To Message Wall',
      '学习快捷信息': 'Learning Quick Info',
      '我的学习能量': 'My Learning Energy',
      '金币': 'Coins',
      '累计星星': 'Total Stars',
      '完成天数': 'Completed Days',
      '最佳成绩': 'Best Score',
      'BM、BC、BI、SC、MM 每完成一科，宠物马上获得 10 金币！': 'Each BM, BC, BI, SC or MM check-in instantly gives your pet 10 coins!',
      '我的小伙伴': 'My Companion',
      '宠物展示区': 'Pet Display Area',
      '已装备物品': 'Equipped Items',
      '宠物技能图': 'Pet Skill Images',
      '角色技能': 'Pet Skills',
      '被动 · 1 · 2 · 3 · 大招': 'Passive · 1 · 2 · 3 · Ultimate',
      '五个技能图标已从角色卡中独立裁出，点击图标查看技能解释。': 'The five skill icons are cropped from the role card. Tap an icon to view the skill explanation.',
      '宠物属性': 'Pet Stats',
      '装备和进化会让伙伴持续成长': 'Equipment and evolution help your companion grow',
      '战斗值': 'Combat Power',
      '⚔️ 战斗值': '⚔️ Combat Power',
      '分享到...': 'Share...',
      '把当前角色卡分享给同学或朋友。': 'Share your current role card with classmates or friends.',
      '把当前角色卡分享出去。': 'Share your current role card.',
      '分享到 Instagram / WhatsApp': 'Share to Instagram / WhatsApp',
      '分享角色卡': 'Share Role Card',
      '选择角色卡风格': 'Choose Role Card Style',
      '选择一个边框来分享当前角色卡。': 'Choose a frame for your current role card.',
      '帅气版': 'Heroic',
      '可爱版': 'Cute',
      '水晶、闪电和银蓝战斗感。': 'Crystal, lightning and silver-blue battle energy.',
      '蝴蝶结、星星和糖果色梦幻感。': 'Ribbons, stars and dreamy candy colors.',
      '用这个风格分享': 'Share With This Style',
      '分享互动区': 'Share Interaction Area',
      '分享互动合照': 'Share Pet Wall Photo',
      '我的互动房间合照': 'My Pet Wall Photo',
      '我的宠物墙合照': 'My Pet Wall Photo',
      '分享图片': 'Share Image',
      '分享进化对比': 'Share Evolution Compare',
      '分享进化变化': 'Share Evolution Change',
      '准备中': 'Preparing',
      '分享中': 'Sharing',
      '点击播放进化影片': 'Tap To Play Evolution Video',
      '分享到留言墙': 'Share to Message Wall',
      '选择一句话，把当前角色卡和战力分享到留言墙。': 'Choose a message and share your current role card and combat power to the message wall.',
      '选择分享文字': 'Choose Share Text',
      '宠物六个装备格': 'Six Pet Equipment Slots',
      '我已购买的装备': 'My Purchased Equipment',
      '我的装备': 'My Equipment',
      '已拥有装备': 'Owned Gear',
      '已装备': 'Equipped',
      '装备已锁定': 'Gear Locked',
      '为了保护进化进度，已装备的物品不能卸下。': 'Equipped gear cannot be removed so evolution progress stays safe.',
      '已装备 · 已锁定，不能卸下': 'Equipped · Locked, cannot be removed',
      '已购买 · 点击装备': 'Owned · Tap to equip',
      '当前宠物还没有已拥有装备': 'This pet has no owned gear yet',
      '购买专属装备或开启盲盒后，装备会出现在这里。': 'Buy exclusive gear or open blind boxes and owned gear will appear here.',
      '购买当前宠物专属装备': 'Buy Current Pet Exclusive Gear',
      '购买专属装备': 'Buy Exclusive Gear',
      '装备分类': 'Gear Category',
      '这里只显示当前宠物的专属装备，购买后也只归当前宠物使用。没有专属装备的宠物会在素材更新后显示。': 'Only this pet’s exclusive gear appears here. Bought gear belongs only to the current pet. Pets without exclusive gear will show items after assets are updated.',
      '等级 1': 'Level 1',
      '去装备图鉴看看 →': 'View Equipment Guide →',
      '这里会显示你已经拥有的全部宠物和培养状态。': 'All owned pets and training progress appear here.',
      '今天想学习什么？': 'What Would You Like To Study Today?',
      '今天的五科任务和打卡记录都在这里，完成学习后就能看到成长足迹。': 'Today’s five subject tasks and check-in records are all here. Complete your study to see your growth trail.',
      'BM、BC、BI、SC、MM 每科每天可以完成一次，每科回答 5 道示范题。': 'BM, BC, BI, SC and MM can each be completed once per day, with 5 demo questions each.',
      '这里展示全部装备资料，但不提供购买、装备或卸下操作。购买装备请回到当前宠物主页底部。': 'This page shows all equipment information, but buying, equipping and removing gear happens at the bottom of the current pet home.',
      '装备图鉴只读模式': 'Read-only Equipment Guide Mode',
      '宠物商店模式': 'Pet Shop Mode',
      '当前模式': 'Current Mode',
      '只读图鉴': 'Read-only Guide',
      '不可购买': 'Not Buyable',
      '宠物商店': 'Pet Shop',
      '宠物仍可购买': 'Pets Can Still Be Bought',
      '这里保留宠物购买和切换；装备购买已移到当前宠物主页，只能购买对应宠物的专属装备。': 'Pet buying and switching remain here. Gear buying has moved to the current pet home and only matching exclusive gear can be bought.',
      '我的打卡记录': 'My Check-in Records',
      '每一次认真学习，都会成为宠物成长的力量。': 'Every focused study session becomes power for your pet.',
      '分享你的伙伴、战力和收集进度，也给同学一点鼓励。': 'Share your companion, power and collection progress, and encourage classmates too.',
      '💬 预设留言': '💬 Preset Comments',
      '发布留言': 'Post Message',
      '选择要发布的话': 'Choose A Post Message',
      '5+1教育补习中心 · 专属学习世界': '5+1 Tuition Center · Learning World',
      '关闭弹窗': 'Close Popup',
      '关闭': 'Close',
      '选择你的 A 级初始宠物': 'Choose Your A-Rank Starter Pet',
      '选择你的第一只宠物': 'Choose Your First Pet',
      '自由选择任意角色': 'Choose Any Role Freely',
      '这是你假期学习旅程的第一位伙伴。之后可以继续升级到 R、SR、SSR 和 LEGEND！': 'This is the first companion in your holiday learning journey. Later, you can grow toward R, SR, SSR and LEGEND!',
      '初始宠物保留免费选择；请为它填写名字和生日，之后可以在商店购买更多宠物。': 'Your starter pet is free. Give it a name and birthday, then buy more pets from the shop later.',
      'Demo 模式：A、R、SR、SSR、LEGEND 全部开放。请为它填写名字和生日。': 'Demo mode: A, R, SR, SSR and LEGEND are all unlocked. Please give your pet a name and birthday.',
      '宠物名字': 'Pet Name',
      '例如：小太阳': 'e.g. Sunny',
      '宠物生日': 'Pet Birthday',
      '先选择一只宠物': 'Choose A Pet First',
      '先填写宠物名字': 'Enter A Pet Name First',
      '换一个健康名字': 'Choose A Positive Name',
      '确认购买并领养': 'Confirm Purchase And Adopt',
      '确认迎接伙伴': 'Confirm Companion',
      'CHOOSE YOUR COMPANION': 'Choose Your Companion',
      '关闭升级提示': 'Close Level-up Message',
      '属性提升': 'Stats Up',
      '关闭进化提示': 'Close Evolution Message',
      '关闭进化影片': 'Close Evolution Video',
      '觉醒进化！': 'Awakened Evolution!',
      '被动': 'Passive',
      '技能 1': 'Skill 1',
      '技能 2': 'Skill 2',
      '技能 3': 'Skill 3',
      '大招': 'Ultimate',
      '进化前': 'Before Evolution',
      '进化后': 'After Evolution',
      '技能说明待补充。': 'Skill details will be added later.',
      '生命': 'HP',
      '攻击': 'Attack',
      '防御': 'Defense',
      '速度': 'Speed',
      '幸运': 'Luck',
      '武器': 'Weapon',
      '头部': 'Head',
      '身体': 'Body',
      '手部': 'Hands',
      '脚部': 'Feet',
      '饰品': 'Accessory',
      '史诗': 'Epic',
      '神话': 'Mythic',
      '传说': 'Legendary',
      '左装备格': 'Left Slot',
      '右装备格': 'Right Slot',
      '点击去装备': 'Tap To Equip',
      '点击装备': 'Tap To Equip',
      '点击卸下': 'Tap To Remove',
      '已装备 · 点击上方装备格可卸下': 'Equipped · Tap the slot above to remove',
      '已购买 · 可以直接装备': 'Owned · Ready to equip',
      'Demo 已拥有 · 当前宠物专属': 'Demo Owned · Current Pet Exclusive',
      '已装备 · 当前宠物专属': 'Equipped · Current Pet Exclusive',
      '尚未装备 · 当前宠物专属': 'Not Equipped · Current Pet Exclusive',
      '购买后只归当前宠物使用': 'After purchase, this belongs only to the current pet',
      '卸下': 'Remove',
      '装备': 'Equip',
      '购买': 'Buy',
      '购买并装备': 'Buy & Equip',
      '还没有已购买装备': 'No Purchased Equipment Yet',
      '当前宠物的专属装备会在宠物主页下方购买；装备图鉴只提供查看。': 'Buy the current pet’s exclusive gear at the bottom of the pet home. The equipment guide is for viewing only.',
      '去装备图鉴看看': 'View Equipment Guide',
      '专属：': 'Exclusive:',
      '需': 'Needs',
      '图鉴 · 不可购买': 'Guide · Not Buyable',
      '🔎 点击查看装备资料': '🔎 Tap To View Gear Details',
      '对应角色额外 +20%': 'Matching role extra +20%',
      '还没有打卡记录': 'No Check-in Records Yet',
      '完成第一次学习挑战后，这里会留下你的成长足迹。': 'After your first learning challenge, your growth record will appear here.',
      '今天五科打卡全部完成啦！': 'All Five Subjects Are Complete Today!',
      'BM、BC、BI、SC、MM 都完成了，宠物收到了一整天的学习能量。': 'BM, BC, BI, SC and MM are complete. Your pet received a full day of learning energy.',
      '回到我的宠物 →': 'Back To My Pets →',
      '假期打卡还没有开放': 'Holiday Check-in Is Not Open Yet',
      '开放日期：': 'Open dates:',
      '今日五科进度：': 'Today’s Five-subject Progress:',
      '每科每天完成一次，可获得金币': 'Each subject can be completed once per day for coins',
      '已完成': 'Completed',
      '今日挑战': 'Today’s Challenge',
      '确认答案': 'Confirm Answer',
      '先选择一个答案，再按确认答案哦。': 'Choose an answer first, then press Confirm Answer.',
      '查看今日成果': 'View Today’s Results',
      '下一题': 'Next Question',
      '再试试看！答案还没有揭晓，想一想再选一次。': 'Try again! The answer is not revealed yet, so think and choose again.',
      '暂时连接不到云端名单：': 'Cannot connect to the cloud roster right now:',
      '暂时找不到这个学生 ID，请检查 Supabase 学生名单。': 'Student ID not found. Please check the Supabase student roster.',
      '暂时找不到这个演示 ID，请使用 DEMO001、DEMO002 或 DEMO003。': 'Demo ID not found. Please use DEMO001, DEMO002 or DEMO003.',
      '正在读取学生资料...': 'Loading student data...',
      '正在恢复上次登录...': 'Restoring last login...',
      '更换头像': 'Change Avatar',
      '调整头像位置': 'Adjust Avatar',
      '拖动图片调整位置，用滑杆放大或缩小。': 'Drag the image to reposition it. Use the slider to zoom.',
      '缩放': 'Zoom',
      '保存头像': 'Save Avatar',
      '头像已保存。': 'Avatar saved.',
      '正在处理头像...': 'Preparing avatar...',
      '请选择图片文件。': 'Choose an image file.',
      '图片太大，请选择 6MB 以下的图片。': 'Image is too large. Choose one under 6MB.',
      '头像处理失败，请换一张图片。': 'Could not process this avatar. Try another image.',
      '登录或注册': 'Log In Or Register',
      '已有 ID 登录': 'Log In With ID',
      '注册新账号': 'Register New Account',
      '学生 ID（可留空自动生成）': 'Student ID (Optional)',
      '学生 ID（可留空，或填 4 位数字）': 'Student ID (Optional, Or 4 Digits)',
      '学生 ID（只填 4 位数字）': 'Student ID (4 Digits Only)',
      '没有 ID 可以留空': 'Leave blank to auto-generate',
      '只填 4 位数字，例如 1234': 'Enter 4 digits, e.g. 1234',
      '例如 1234': 'Example: 1234',
      '玩家名字': 'Player Name',
      '请输入你的名字': 'Enter your name',
      '5+1朋友 ID': 'CY Friend ID',
      '例如 CY1234': 'Example: CY1234',
      '注册并进入': 'Register And Enter',
      '注册中': 'Registering',
      '进入中': 'Entering',
      '注册成功！你的 ID 是': 'Registered! Your ID is',
      '请记住你的学生 ID': 'Remember Your Student ID',
      '你的学生 ID': 'Your Student ID',
      '请记住这个 ID，下次登录会用到。': 'Remember this ID. You will use it next time you log in.',
      '知道了，进入我的学习世界': 'Got It, Enter My World',
      '请输入玩家名字。': 'Enter a player name.',
      '学生 ID 请填写 4 位数字。': 'Student ID must be 4 digits.',
      '请输入5+1朋友 ID。': 'Enter a CY Friend ID.',
      '找不到这个5+1朋友 ID，请检查后再注册。': 'CY Friend ID not found. Please check it before registering.',
      '暂时无法注册账号，请稍后再试。': 'Registration is unavailable right now. Please try again later.',
      '这个学生 ID 已经存在，请换一个或留空自动生成。': 'This student ID already exists. Try another or leave it blank.',
      '这个学生 ID 已经存在，请换一个四位数字。': 'This student ID already exists. Choose another 4-digit number.',
      '玩家战力排行榜': 'Player Power Leaderboard',
      '玩家战力排行': 'Power Ranking',
      '按每位玩家已收集宠物的总战力排行。': 'Ranks players by total power across collected pets.',
      '金币排行榜': 'Coin Leaderboard',
      '金币排行': 'Coin Ranking',
      '按每位玩家目前持有的金币排行。': 'Ranks players by current coin balance.',
      '反应轮盘排行榜': 'Reaction Wheel Leaderboard',
      'CY跳跳跳排行榜': 'CY Jump Jump Leaderboard',
      'CY跑跑跑排行榜': 'CY Run Run Leaderboard',
      '总战力': 'Total Power',
      '金币': 'Coins',
      '金币余额': 'Coin Balance',
      '最高分': 'High Score',
      '我的玩家总战力': 'My Total Power',
      '我的金币余额': 'My Coin Balance',
      '我的反应最高分': 'My Reaction Best',
      '我的跳跳最高分': 'My Jump Best',
      '我的跑跑最高分': 'My Run Best',
      '还没有排行榜资料。': 'No leaderboard data yet.',
      '正在读取排行榜...': 'Loading leaderboard...',
      '还没有宠物资料。': 'No pet data yet.',
      '读取中': 'Loading',
      '保存中': 'Saving',
      '发布中': 'Posting',
      '留言中': 'Commenting',
      '更新中': 'Updating',
      '演示资料已重置。': 'Demo data has been reset.',
      '请先选择一只宠物。': 'Please choose a pet first.',
      '请选择一种进化路线。': 'Please choose an evolution route.',
      '先填写宠物名字。': 'Enter a pet name first.',
      '宠物名字最多 20 个字。': 'Pet names can use up to 20 characters.',
      '名字里有不适合公开展示的词，请换一个积极一点的名字。': 'This name includes words that are not suitable for public display. Please choose a more positive name.',
      '金币还不够，先请老师奖励或继续完成学习。': 'Not enough coins yet. Ask for teacher rewards or keep studying.',
      '金币还不够，无法购买这只宠物。': 'Not enough coins to buy this pet.',
      '金币还不够，完成更多学习就可以继续购买啦！': 'Not enough coins yet. Complete more learning to keep buying.',
      '只能在当前宠物主页购买它自己的专属装备。': 'You can only buy this pet’s own exclusive gear on its pet home.',
      '保存到云端失败，刚才的操作没有完成：': 'Cloud save failed. That action was not completed:',
      '保存到云端失败，刚才的打卡没有完成：': 'Cloud save failed. That check-in was not completed:',
      '还没有集齐对应角色的': 'You have not collected the matching role’s',
      '件专属装备。': 'exclusive gear items yet.',
      '还需要装备满': 'You still need to equip',
      '个不同部位的装备。': 'gear items from different slots.',
      '可以小进化了！': 'Mini Evolution Ready!',
      '可以进化了！': 'Ready To Evolve!',
      '可以最终进化了！': 'Final Evolution Ready!',
      '小进化': 'Mini Evolve',
      '进化宠物': 'Evolve Pet',
      '宠物可以小进化了': 'Pet is ready for mini evolution',
      '宠物可以进化了': 'Pet is ready to evolve',
      '进化中': 'Evolving',
      '小进化中': 'Mini Evolving',
      '选择最终进化路线': 'Choose Final Evolution Route',
      '完成小进化并收齐专属装备后，可以选择让伙伴走可爱 Q 版路线，或保留帅气觉醒路线。': 'After mini evolution and collecting the exclusive gear set, choose a cute Q-style route or keep the heroic awakened route.',
      '必须先完成小进化，才可以开放最终进化。': 'Mini evolve first to unlock final evolution.',
      '已经收齐全套装备，但必须先完成小进化，才会开放最终进化。': 'You have the full gear set, but mini evolution must be completed before final evolution opens.',
      '查看进化路线': 'View Evolution Path',
      '小进化样子': 'Mini Evolution',
      '可以直接比较进化前、小进化和最终进化的角色卡。': 'Compare the before, mini evolution and final evolution role cards.',
      '可爱Q版进化': 'Cute Q-Style Evolution',
      '帅气觉醒进化': 'Heroic Awakening Evolution',
      '更萌、更适合低年级孩子喜欢的路线。': 'A cuter route that younger students may love.',
      '保留目前的大卡与战斗感路线。': 'Keeps the current big-card battle fantasy.',
      '小进化完成！': 'Mini Evolution Complete!',
      '终极装备已解锁': 'Final gear unlocked',
      '前半套装备已买齐': 'Mini-stage gear complete',
      '阶段装备已买齐': 'Stage gear complete',
      '继续装备和培养，就可以推动下一次进化。': 'Keep equipping and training to push toward the next evolution.',
      '终极装备': 'Final Gear',
      '小进化后开放': 'Unlocks after mini evolution',
      '先完成小进化，才会开放终极进化装备。': 'Mini evolve first to unlock final evolution gear.',
      '已完成小进化': 'Mini evolved',
      '半套小进化': 'Half-set mini evolution',
      '最终进化': 'Final evolution',
      '进化路线': 'Evolution route',
      'Q版可爱': 'Cute Q-style',
      '帅气': 'Heroic',
      '⚡ 开始进化': '⚡ Start Evolution',
      '还需要装备更多物品': 'Equip More Items',
      '稀有度觉醒加成已生效': 'rarity awakening bonus is active',
      '音乐播放器': 'Music Player',
      '正在播放': 'Now Playing',
      '播放': 'Play',
      '暂停': 'Pause',
      '下一首': 'Next Track',
      '播放模式': 'Play Mode',
      '单曲循环': 'Repeat One',
      '随机播放': 'Shuffle',
      '专辑循环': 'Repeat Album',
      '你们都收集几个了？': 'How many have you collected?',
      '我的宠物进化了！': 'My pet evolved!',
      '看看我的战力！': 'Check out my combat power!',
      '我正在收集专属装备！': 'I am collecting exclusive gear!',
      '今天也有认真打卡！': 'I checked in seriously today too!',
      '今天战力又变强了！': 'My combat power grew today!',
      '谁要和我一起打卡？': 'Who wants to check in with me?',
      '我的装备快收集齐了！': 'My gear set is almost complete!',
      '来看看我的新造型！': 'Come see my new look!',
      '我离进化更近了！': 'I am closer to evolution!',
      '今天也要冲满五科！': 'Let’s complete all five subjects today!',
      '这只伙伴太可靠了！': 'This companion is so reliable!',
      '太帅了吧！': 'So cool!',
      '加油！': 'Keep it up!',
      '我也想要这只！': 'I want this one too!',
      '战力好高！': 'Such high power!',
      '一起继续打卡！': 'Let’s keep checking in!',
      '好强！': 'So strong!',
      '这个装备很酷！': 'That gear looks cool!',
      '继续冲！': 'Keep going!',
      '写一句鼓励的话': 'Write a short cheer',
      '留言': 'Comment',
      '先写一句留言。': 'Write a comment first.',
      '留言最多 18 个字。': 'Comments can use up to 18 characters.',
      '留言里有不适合公开展示的词，请换一句积极一点的话。': 'This comment includes words that are not suitable for public display. Please write something positive.',
      '已打开分享选单。': 'Share menu opened.',
      '已打开 WhatsApp 分享；文案也已复制。': 'WhatsApp share opened. The message was copied too.',
      '已复制分享文案，可以贴到 Instagram 或 WhatsApp。': 'Share text copied. You can paste it into Instagram or WhatsApp.',
      '暂时无法打开外部分享，请稍后再试。': 'External sharing is unavailable right now. Please try again later.',
      '已打开图片，可以长按或右键保存/分享。': 'Image opened. Long-press or right-click to save/share it.',
      '暂时无法分享图片，请稍后再试。': 'Image sharing is unavailable right now. Please try again later.',
      '正在准备图片...': 'Preparing image...',
      '查看角色大图': 'View Role Image',
      '关闭大图': 'Close Image Viewer',
      '点击空白处关闭': 'Tap outside to close',
      '查看进化前': 'View Before Evolution',
      '查看进化前角色卡': 'View Before-Evolution Card',
      '进化前样子': 'Before Evolution',
      '进化后样子': 'After Evolution',
      '点赞': 'Like',
      '还没有同学留言。': 'No comments yet.',
      '留言墙还没有内容。': 'The message wall is empty.',
      '选择一句预设文字，就可以把你的宠物卡分享到这里。': 'Choose a preset message to share your pet card here.',
      '人': 'students',
      '暂无班级': 'No classes yet',
      '输入老师 ID 后读取班级，再选择学生奖励金币。': 'Enter a teacher ID, load classes, then select students to reward coins.',
      '学生每天最多从老师奖励获得 250 金币；CY0000 和 CY0001 可以给老师账号无上限加分。': 'Students can receive up to 250 teacher-reward coins per day; CY0000 and CY0001 can add unlimited coins to teacher accounts.',
      '目前不在打卡期间': 'Check-in Not Open Now',
      '假期打卡开放中': 'Holiday Check-in Open',
      '首次登录选择的初始宠物': 'Starter pet chosen on first login',
      '可以在商店购买': 'Available in the shop',
      '限定版宠物': 'Limited edition pet',
      '进化后的神话级宠物': 'Mythic pet after evolution',
      'A 级': 'A Rank',
      'R 级': 'R Rank',
      'SR 级': 'SR Rank',
      'SSR 级': 'SSR Rank',
      'LEGEND 级': 'LEGEND Rank',
      'LIMITED 级': 'LIMITED Rank',
      'MYTHIC 神话级': 'MYTHIC Rank',
      '华文': 'Chinese',
      '马来文': 'Malay',
      '英文': 'English',
      '数学': 'Math',
      '科学': 'Science',
      '阅读、词语和句子': 'Reading, words and sentences',
      '数字与计算': 'Numbers and calculations',
      '发现身边的科学': 'Explore science around us',
      '分': 'points'
    }
  };

  const TRANSLATION_PATTERNS = [
    { pattern: /^(\d+) 件$/, replace: ([, count]) => `${count} items` },
    { pattern: /^(\d+) 件装备$/, replace: ([, count]) => `${count} gear items` },
    { pattern: /^已收集 (\d+) 只宠物$/, replace: ([, count]) => `${count} pets collected` },
    { pattern: /^已收集 (\d+) \/ (\d+) 只宠物$/, replace: ([, count, total]) => `${count} / ${total} pets collected` },
    { pattern: /^生日 (.+)$/, replace: ([, date]) => `Birthday ${translateToken(date)}` },
    { pattern: /^注册成功！你的 ID 是 (.+)$/, replace: ([, id]) => `Registered! Your ID is ${id}` },
    { pattern: /^等级 (\d+)$/, replace: ([, level]) => `Level ${level}` },
    { pattern: /^Lv\.(\d+)$/, replace: ([, level]) => `Lv.${level}` },
    { pattern: /^第 (\d+) \/ (\d+) 题$/, replace: ([, current, total]) => `Question ${current} / ${total}` },
    { pattern: /^第 (\d+) 步$/, replace: ([, step]) => `Step ${step}` },
    { pattern: /^(\d+) \/ (\d+) 分$/, replace: ([, score, total]) => `${score} / ${total} points` },
    { pattern: /^⭐ (\d+)\/(\d+) 分$/, replace: ([, score, total]) => `⭐ ${score}/${total} points` },
    { pattern: /^🪙 \+(\d+) 金币$/, replace: ([, coins]) => `🪙 +${coins} coins` },
    { pattern: /^连续成功 (\d+) 次，宠物才能进化。$/, replace: ([, count]) => `Hit ${count} times in a row to evolve your pet.` },
    { pattern: /^命中！还差 (\d+) 次。$/, replace: ([, count]) => `Hit! ${count} more to go.` },
    { pattern: /^本次得分 (\d+)$/, replace: ([, score]) => `Score ${score}` },
    { pattern: /^今日五科进度：(\d+) \/ (\d+)$/, replace: ([, done, total]) => `Today’s Five-subject Progress: ${done} / ${total}` },
    { pattern: /^(\S+) · 今日挑战$/, replace: ([, subject]) => `${translateToken(subject)} · Today’s Challenge` },
    { pattern: /^(.+) 已完成$/, replace: ([, subject]) => `${translateToken(subject)} completed` },
    { pattern: /^已完成 · (\d+)\/(\d+)$/, replace: ([, score, total]) => `Completed · ${score}/${total}` },
    { pattern: /^答对了！获得 (\d+) 颗星星。$/, replace: ([, stars]) => `Correct! You earned ${stars} stars.` },
    { pattern: /^「(.+)」完成！宠物获得了 (\d+) 枚金币。(.*)$/, replace: ([, subject, coins, rest]) => `${translateToken(subject)} complete! Your pet earned ${coins} coins. ${translateToken(rest)}`.trim() },
    { pattern: /^(.+) 今天已经完成过了。$/, replace: ([, subject]) => `${translateToken(subject)} is already completed today.` },
    { pattern: /^(\d{4})年(\d{1,2})月(\d{1,2})日$/, replace: ([, year, month, day]) => formatEnglishDate(year, month, day) },
    { pattern: /^(.+) · (.+) · (\d{4})年(\d{1,2})月(\d{1,2})日$/, replace: ([, branch, className, year, month, day]) => `${branch} · ${className} · ${formatEnglishDate(year, month, day)}` },
    { pattern: /^开放日期：(\d{4})年(\d{1,2})月(\d{1,2})日 至 (\d{4})年(\d{1,2})月(\d{1,2})日$/, replace: ([, y1, m1, d1, y2, m2, d2]) => `Open dates: ${formatEnglishDate(y1, m1, d1)} to ${formatEnglishDate(y2, m2, d2)}` },
    { pattern: /^领养 (.+)$/, replace: ([, name]) => `Adopt ${name}` },
    { pattern: /^这只 (.+) 宠物售价 (\d+) 金币。购买后会独立保存自己的名字、生日、等级和装备。$/, replace: ([, rarity, price]) => `This ${translateToken(rarity)} pet costs ${price} coins. Its name, birthday, level and equipment will be saved separately.` },
    { pattern: /^(.+) 已加入你的宠物图鉴！它的装备需要单独购买。$/, replace: ([, name]) => `${name} has joined your pet collection! Its equipment must be bought separately.` },
    { pattern: /^(.+) 已成为你的学习伙伴！$/, replace: ([, name]) => `${name} is now your learning companion!` },
    { pattern: /^(.+) 已成为当前学习伙伴。$/, replace: ([, name]) => `${name} is now your active learning companion.` },
    { pattern: /^已同步 Sheet：(.+)$/, replace: ([, date]) => `Sheet synced: ${translateToken(date)}` },
    { pattern: /^购买成功！(.+) 已绑定给 (.+)。$/, replace: ([, item, pet]) => `Purchase successful! ${item} is bound to ${pet}.` },
    { pattern: /^购买成功！(.+) 已自动装备给 (.+)。(.+)?$/, replace: ([, item, pet, rest]) => `Purchase successful! ${item} is now equipped to ${pet}. ${translateToken(rest || '')}`.trim() },
    { pattern: /^(.+) 已装备到(.+)！(.*)$/, replace: ([, item, slot, rest]) => `${item} equipped to ${translateToken(slot)}! ${translateToken(rest)}`.trim() },
    { pattern: /^(.+) 已卸下，战斗值正在更新。$/, replace: ([, item]) => `${item} removed. Combat power is updating.` },
    { pattern: /^宠物升级到 Lv\.(\d+) 啦！$/, replace: ([, level]) => `Your pet leveled up to Lv.${level}!` },
    { pattern: /^五科完成奖励 \+(\d+) 金币。$/, replace: ([, coins]) => `Five-subject completion bonus +${coins} coins.` },
    { pattern: /^六件专属装备已集齐，进化条件达成！$/, replace: () => 'All six exclusive gear items are collected. Evolution is ready!' },
    { pattern: /^战斗值 (\d+) → (\d+)（\+(\d+)）$/, replace: ([, before, after, delta]) => `Combat Power ${before} → ${after} (+${delta})` },
    { pattern: /^战斗值 (\d+) → (\d+) · 终极装备已解锁$/, replace: ([, before, after]) => `Combat Power ${before} → ${after} · final gear unlocked` },
    { pattern: /^战斗值 (\d+) → (\d+) · 稀有度觉醒加成已生效$/, replace: ([, before, after]) => `Combat Power ${before} → ${after} · rarity awakening bonus is active` },
    { pattern: /^完成小进化后，会开放剩下 (\d+) 件终极进化装备。$/, replace: ([, count]) => `After mini evolution, ${count} final evolution gear items will unlock.` },
    { pattern: /^(.+)小进化形态$/, replace: ([, name]) => `${name} mini evolution form` },
    { pattern: /^(.+)进化形态$/, replace: ([, name]) => `${name} evolved form` },
    { pattern: /^金币还不够，小进化需要 (\d+) 金币。$/, replace: ([, coins]) => `Not enough coins. Mini evolution needs ${coins} coins.` },
    { pattern: /^金币还不够，最终进化需要 (\d+) 金币。$/, replace: ([, coins]) => `Not enough coins. Final evolution needs ${coins} coins.` },
    { pattern: /^(.+)已完成小进化！已扣除 (\d+) 金币，收齐全套装备后才可以进行最终进化。$/, replace: ([, name, coins]) => `${name} completed mini evolution! ${coins} coins were used. Collect the full gear set to unlock final evolution.` },
    { pattern: /^(.+)已完成觉醒进化！已扣除 (\d+) 金币，其他宠物可以直接在商店购买。$/, replace: ([, name, coins]) => `${name} has awakened and evolved! ${coins} coins were used. Other pets can be bought directly in the shop.` },
    { pattern: /^宠物进化：(.+)$/, replace: ([, name]) => `Pet Evolution: ${name}` },
    { pattern: /^(.+)，满足后即可进入觉醒形态；进化后会依照稀有度和角色特性大幅提升数值。$/, replace: ([, requirement]) => `${translateToken(requirement)}. When complete, the pet can awaken. Evolution greatly increases stats based on rarity and role traits.` },
    { pattern: /^专属：(.+) · 只在对应宠物主页显示并购买$/, replace: ([, pet]) => `Exclusive: ${pet} · shown and bought only on its pet home` },
    { pattern: /^(.+) · (.+)$/, replace: ([, left, right]) => `${translateToken(left)} · ${translateToken(right)}` },
    { pattern: /^需 (.+)$/, replace: ([, rarity]) => `Needs ${translateToken(rarity)}` },
    { pattern: /^(.+) (\+|-)(\d+)$/, replace: ([, label, sign, value]) => `${translateToken(label)} ${sign}${value}` },
    { pattern: /^(.+)级$/, replace: ([, rarity]) => `${translateToken(`${rarity} 级`)}` },
    { pattern: /^(.+) · (\d+) 人$/, replace: ([, className, count]) => `${className} · ${count} students` },
    { pattern: /^已选学生今天已达到 (\d+) 金币课堂奖励上限。$/, replace: ([, limit]) => `The selected students have reached today’s ${limit}-coin classroom reward limit.` },
    { pattern: /^已为 (\d+) 位账号增加课堂金币；部分学生今天已达到 (\d+) 金币课堂奖励上限。$/, replace: ([, count, limit]) => `Added classroom coins to ${count} accounts; some students have reached today’s ${limit}-coin classroom reward limit.` },
    { pattern: /^已为 (\d+) 位账号各增加最多 (\d+) 金币。$/, replace: ([, count, amount]) => `Added up to ${amount} coins to each of ${count} accounts.` },
    { pattern: /^点赞 · (\d+)$/, replace: ([, count]) => `Like · ${count}` },
    { pattern: /^(\d+)\/(\d+)$/, replace: ([, score, total]) => `${score}/${total}` }
  ];

  const NEW_PLAYER_GUIDE_STEPS = [
    {
      id: 'welcome',
      view: 'home-view',
      target: '',
      spotlight: false,
      title: '你好啊！主人！',
      titleEn: 'Hello, owner!',
      copyEn: student => `I am ${getNewPlayerGuidePetName(student)}, your holiday learning buddy.`,
      copy: student => `我是会和你一起度过假期的${getNewPlayerGuidePetName(student)}。`
    },
    {
      id: 'nav-pets',
      view: 'home-view',
      target: 'nav-pets',
      title: '先从这里开始！',
      titleEn: 'Let’s start here!',
      copyEn: () => 'Here you can see the pets you have collected and return to your companion home.',
      copy: () => '这里！你可以看到你收集到的宠物，也可以回到你的伙伴主页。'
    },
    {
      id: 'role-card',
      view: 'home-view',
      target: 'role-card',
      title: '这就是我啦！',
      titleEn: 'This is me!',
      copyEn: () => 'This is cute little me! Nice to meet you. This card shows my artwork, level and growth status.',
      copy: () => '哈哈，这就是可爱的我啦，很高兴认识你！这里会显示我的角色卡、等级和成长状态。'
    },
    {
      id: 'skills',
      view: 'home-view',
      target: 'skills',
      title: '我的技能在这里！',
      titleEn: 'My skills are here!',
      copyEn: () => 'These are my skills. I am pretty powerful! Tap each skill icon to read what it does.',
      copy: () => '这里，是我的技能！我超厉害的！点击技能图标就可以看到每一招的介绍。'
    },
    {
      id: 'exclusive-gear',
      view: 'home-view',
      target: 'exclusive-gear',
      title: '帮我收集装备！',
      titleEn: 'Help me collect gear!',
      guidePlacement: 'top',
      scrollBlock: 'center',
      copyEn: () => 'This lower area is where you buy my exclusive gear. When you collect my gear, I can evolve and become stronger so I can protect you.',
      copy: () => '这里是下方购买专属装备的地方！只要主人帮我收集完我的装备，我就能进行进化！变得更厉害！这样才能保护主人！'
    },
    {
      id: 'pet-collection',
      view: 'home-view',
      target: 'pet-collection',
      guidePlacement: 'top',
      title: '大家都会在这里！',
      titleEn: 'Everyone stays here!',
      copyEn: () => 'The bottom area shows all the pets you have collected. I will make friends with them, and you can choose who goes out with you.',
      copy: () => '最下面这个呢就是主人收集到的宠物们，我会好好和他们做朋友的！主人可以选择要带谁出门！'
    },
    {
      id: 'interaction-area',
      view: 'guide-view',
      target: 'interaction-area',
      extraTargets: ['nav-guide'],
      title: '这里可以一起玩！',
      titleEn: 'We can play here!',
      copyEn: () => 'In the Interaction Area, I can walk, jump and appear with friends in the same room. Come here when you want to play together.',
      copy: () => '来到互动区，我可以在房间里走路、跳跃、和朋友一起出现。以后主人想找朋友同房间玩，就来这里。'
    },
    {
      id: 'checkin',
      view: 'checkin-view',
      target: 'checkin',
      extraTargets: ['nav-checkin'],
      title: '每天学习一点点！',
      titleEn: 'Study a little every day!',
      copyEn: () => 'Study Check-in is here. Finish Chinese, Malay, English, Math and Science to earn coins, then use gear and evolution to help me grow stronger.',
      copy: () => '学习打卡在这里。完成华文、马来文、英文、数学和科学，我就会获得金币，再靠装备和进化慢慢变强。'
    },
    {
      id: 'pet-shop',
      view: 'shop-view',
      target: 'pet-shop',
      extraTargets: ['nav-shop'],
      title: '想认识新伙伴吗？',
      titleEn: 'Want to meet new friends?',
      copyEn: () => 'The Pet Shop lets you buy new characters and browse each series. Check carefully because exclusive gear belongs to each pet.',
      copy: () => '宠物商店可以购买新角色，也可以查看每个系列。记得先看清楚，专属装备是跟着不同宠物走的。'
    },
    {
      id: 'message-wall',
      view: 'wall-view',
      target: 'message-wall',
      extraTargets: ['nav-wall'],
      title: '把开心分享出去！',
      titleEn: 'Share the happy moments!',
      copyEn: () => 'On the Message Wall, you can share power, coin ranking, mini-game scores and pet progress, and encourage classmates.',
      copy: () => '留言墙可以分享战力、金币排行、小游戏成绩和宠物进度，也可以给同学一点鼓励。'
    },
    {
      id: 'friends',
      view: 'friends-view',
      target: 'friends',
      extraTargets: ['nav-friends'],
      title: '朋友也很重要！',
      titleEn: 'Friends matter too!',
      copyEn: () => 'The Friends page lets you add friends, visit their pets, send gifts, and see which room they are in.',
      copy: () => '好友页面可以添加朋友、看朋友的宠物、送礼物，也可以查看朋友现在在哪一个房间。'
    },
    {
      id: 'music-box',
      view: 'music-box-view',
      target: 'music-box',
      extraTargets: ['nav-music'],
      title: '最后，选一首歌吧！',
      titleEn: 'Finally, choose a song!',
      copyEn: () => 'The Music Box lets you listen and switch theme songs. Choose your favorite song, and I will study and adventure with you.',
      copy: () => '音乐盒可以试听和切换主题曲。主人选喜欢的歌，我就陪你一起学习和冒险！'
    }
  ];

  const DAILY_CHECKIN_GUIDE_STEPS = [
    {
      id: DAILY_CHECKIN_GUIDE_ID,
      view: 'checkin-view',
      target: 'checkin',
      extraTargets: ['nav-checkin'],
      title: '今天也一起学习吧！',
      titleEn: 'Let’s study together today!',
      copyEn: student => {
        const progress = getTodayCheckinProgress(student);
        return `Hello, owner! I am ${getNewPlayerGuidePetName(student)}. Today you have completed ${progress.completed} / ${progress.total} subjects. Finish all subjects to earn coins and help me grow stronger.`;
      },
      copy: student => {
        const progress = getTodayCheckinProgress(student);
        return `你好啊！主人！我是${getNewPlayerGuidePetName(student)}。今天已经完成 ${progress.completed} / ${progress.total} 科啦，记得把五科打卡完成，赚金币让我继续变强！`;
      }
    }
  ];

  const YIYAN_BLIND_BOX_APOLOGY_GUIDE_STEPS = [
    {
      id: 'apology-welcome',
      view: 'home-view',
      target: '',
      spotlight: false,
      title: 'Yiyan老师，对不起！',
      titleEn: 'Yiyan, we are sorry!',
      copyEn: () => 'Kiki sent you a blind box, but the system left a broken gift notice. You kept seeing the message, but could not claim it. We are truly sorry.',
      copy: () => '刚刚 Teacher C送你的盲盒被系统卡住了，让你一直看到提醒，却领取不到。真的不好意思。'
    },
    {
      id: 'apology-fixed',
      view: 'home-view',
      target: 'nav-shop',
      title: '礼物已经补好了！',
      titleEn: 'Your gift is fixed!',
      copyEn: () => 'The original blind box has been restored, and we added 2 extra blind boxes as an apology. Your account now has 3 blind boxes ready to open.',
      copy: () => '原本那颗盲盒已经补回来了，而且我们额外补送 2 个盲盒给你。现在你的账号里有 3 个可以开启的盲盒。'
    },
    {
      id: 'apology-shop',
      view: 'shop-view',
      target: 'pet-shop',
      extraTargets: ['nav-shop'],
      guidePlacement: 'top',
      title: '来这里开启盲盒！',
      titleEn: 'Open them here!',
      copyEn: () => 'Go to the Pet Shop and press Open Blind Box. I hope you get a pet and gear you really like this time.',
      copy: () => '来到宠物商店，按「开启盲盒」就可以打开。希望这次你抽到喜欢的新伙伴和装备。'
    },
    {
      id: 'apology-thanks',
      view: 'friends-view',
      target: 'friends',
      extraTargets: ['nav-friends'],
      title: '谢谢你告诉我们！',
      titleEn: 'Thank you for telling us!',
      copyEn: () => 'You helped us find a broken gift-notification case. We will make the system clearer, so every gift arrives safely.',
      copy: () => '谢谢你告诉我们这个问题。你帮我们发现了一个残留通知 bug，我们会把礼物系统做得更清楚、更稳定。'
    },
    {
      id: 'apology-finish',
      view: 'home-view',
      target: 'role-card',
      title: '重新出发吧！',
      titleEn: 'Let’s continue!',
      copyEn: student => `${getNewPlayerGuidePetName(student)} is ready to keep adventuring with you. Thank you for being patient with us.`,
      copy: student => `${getNewPlayerGuidePetName(student)}已经准备好继续陪你冒险啦。谢谢你的耐心，也谢谢你帮我们把 5+1 学习乐园 变得更好。`
    }
  ];

  const TEACHER_NEW_MUSIC_GUIDE_STEPS = [
    {
      id: 'teacher-music-welcome',
      view: 'home-view',
      target: '',
      spotlight: false,
      title: '老师，新歌上线啦！',
      titleEn: 'Teacher, new songs are live!',
      copyEn: student => `${getNewPlayerGuidePetName(student)} is here with a quick update: the Music Box has new songs from BLACKPINK, BIGBANG, BTS, IVE, SEVENTEEN, Stray Kids, TWICE and Hachimi.`,
      copy: student => `${getNewPlayerGuidePetName(student)}来通知老师：音乐盒已经加入 BLACKPINK、BTS、IVE、SEVENTEEN、Stray Kids、TWICE、Hachimi 的新歌啦！`
    },
    {
      id: 'teacher-music-box',
      view: 'music-box-view',
      target: 'music-box',
      extraTargets: ['nav-music'],
      guidePlacement: 'top',
      title: '音乐盒已经更新！',
      titleEn: 'The Music Box is updated!',
      copyEn: () => 'Teachers can preview the songs here. Songs in the same series now share the same color, so students can browse faster.',
      copy: () => '老师可以在这里试听新歌。同一个系列的歌曲已经统一颜色，学生浏览时会更清楚。'
    },
    {
      id: 'teacher-music-blind-box',
      view: 'shop-view',
      target: 'pet-shop',
      extraTargets: ['nav-shop'],
      title: '盲盒也可以抽歌！',
      titleEn: 'Blind boxes can unlock music!',
      copyEn: () => 'Blind boxes may now give students a pet they do not own or a song they do not own. Duplicate songs can also be sent to friends.',
      copy: () => '现在玩家可能会从盲盒抽到没有拥有的角色，也可能抽到没有拥有的歌曲；抽到重复歌曲时，歌曲也可以送给好友。'
    }
  ];

  const BAD_PET_NAME_WORDS = [
    '粗口', '坏话', '笨蛋', '白痴', '神经病', '垃圾', '去死', '杀',
    '色情', '裸', '毒品', 'sex',
    '傻逼', '傻b', '伞兵', '鲨比', '萨比', '虾哔', 'shabi', 'sb',
    '操你妈', '草泥马', '曹尼玛', '查理马', '吵泥马', '艹', 'cnm', 'caonima',
    '卧槽', '我操', '我草', '握草', '哇擦', '挖槽', 'woc', 'wocao', 'cao',
    '他妈的', '你妈的', '特么的', '踏马的', '尼玛', '泥马', '他喵的', 'tmd', 'nmd', 'tamade',
    '你妈死了', '柠檬熟了', '你马没了', 'nmsl', '妈的智障', '玛德智障', 'mdzz',
    '脑残', '智障', '老残', 'naocan',
    '婊子', '贱人', '绿茶婊', '碧池', '逼池', '必娶', '剑人', '贱格', 'biao', 'jianren',
    '老色批', '老色痞', '老蛇皮', 'lsp',
    '傻吊', '傻鸟', '沙雕', 'shandiao',
    '哭爸哭母', '靠北', '靠母', '考杯', '哭爸', 'kpkb', 'kaopeh', 'kaobei',
    'limpeh', '林北', '零北', '拎北', '恁爸',
    '冚家铲', '咸家铲', '喊加产', '全家铲', 'hkc', 'hamkachan',
    '肚烂', '赌烂', '堵烂', 'dulan',
    '痴线', '痴汉', 'chisin', 'chisin',
    '起笑', '疯子', '肖仔', 'siao', 'qixiao',
    '烂散', 'lansan',
    '讲鸟话', '讲干话', '贡兰交', 'gonglj', 'gonglanjiao',
    '废柴', '废材', 'feichai', 'laseh', 'sampah',
    'fuck', 'fck', 'fak', 'faq', 'fack', '法克', '发克', '花克',
    'shit', 'bullshit', '狗屎', '拔粪', '卟屎',
    'bitch', 'bch', 'bxxch', 'biatch',
    'kimak', 'kmk', 'pukimak', '奇马', '几骂',
    'lancau', 'lncau', 'lanjiao', '兰草', '烂草'
  ];

  const MODERATION_CHAR_REPLACEMENTS = {
    '0': 'o',
    '1': 'i',
    '3': 'e',
    '4': 'a',
    '5': 's',
    '7': 't',
    '8': 'b',
    '9': 'g',
    '@': 'a',
    '$': 's',
    '!': 'i',
    '|': 'i'
  };

  const PET_CATALOG = [
    { id: 'sunny-wing', name: 'Sunny Wing', rarity: 'A', icon: '🪽', image: 'assets/roles/sunny-wing-a.png', evolvedImage: 'assets/roles/evolved/sunny-wing.png', cuteEvolvedImage: 'assets/roles/cute-evolved/sunny-wing.png', skillAssets: { before: 'assets/roles/sunny wing/前.png', after: 'assets/roles/sunny wing/后.png' }, baseStats: { hp: 105, attack: 12, defense: 10, speed: 12, luck: 14 } },
    { id: 'sprouty', name: 'Sprouty', rarity: 'A', icon: '🌱', image: 'assets/roles/sprouty-a.png', evolvedImage: 'assets/roles/evolved/sprouty.png', cuteEvolvedImage: 'assets/roles/cute-evolved/sprouty.png', skillAssets: { before: 'assets/roles/sprouty/前.png', after: 'assets/roles/sprouty/后.png' }, baseStats: { hp: 180, attack: 10, defense: 55, speed: 4, luck: 12 } },
    { id: 'hydroblob', name: 'Hydroblob', rarity: 'A', icon: '💧', image: 'assets/roles/hydroblob-a.png', evolvedImage: 'assets/roles/evolved/hydroblob.png', cuteEvolvedImage: 'assets/roles/cute-evolved/hydroblob.png', skillAssets: { before: 'assets/roles/hydroblob/前.png', after: 'assets/roles/hydroblob/后.png' }, baseStats: { hp: 105, attack: 10, defense: 12, speed: 8, luck: 12 } },
    { id: 'fluffbit', name: 'Fluffbit', rarity: 'A', icon: '🐾', image: 'assets/roles/fluffbit-a.png', evolvedImage: 'assets/roles/evolved/fluffbit.png', cuteEvolvedImage: 'assets/roles/cute-evolved/fluffbit.png', skillAssets: { before: 'assets/roles/fluffbit/前.png', after: 'assets/roles/fluffbit/后.png' }, baseStats: { hp: 96, attack: 11, defense: 9, speed: 12, luck: 14 } },
    { id: 'shadow-wing', name: 'Shadow Wing', rarity: 'R', icon: '🌑', image: 'assets/roles/shadow-wing-r.png', evolvedImage: 'assets/roles/evolved/shadow-wing.png', cuteEvolvedImage: 'assets/roles/cute-evolved/shadow-wing.png', skillAssets: { before: 'assets/roles/shadow wing专属/前.png', after: 'assets/roles/shadow wing专属/后.png' }, baseStats: { hp: 82, attack: 28, defense: 8, speed: 48, luck: 16 } },
    { id: 'flame-rex', name: 'Flame Rex', rarity: 'SR', icon: '🔥', image: 'assets/roles/flame-rex-sr.png', evolvedImage: 'assets/roles/evolved/flame-rex.png', cuteEvolvedImage: 'assets/roles/cute-evolved/flame-rex.png', skillAssets: { before: 'assets/roles/flame rex 专属/前.png', after: 'assets/roles/flame rex 专属/后.png' }, baseStats: { hp: 145, attack: 52, defense: 18, speed: 6, luck: 10 } },
    { id: 'thunder-beetle', name: 'Thunder Beetle', rarity: 'SSR', icon: '⚡', image: 'assets/roles/thunder-beetle-ssr.png', evolvedImage: 'assets/roles/evolved/thunder-beetle.png', cuteEvolvedImage: 'assets/roles/cute-evolved/thunder-beetle.png', skillAssets: { before: 'assets/roles/thunder beetle 专属/前.png', after: 'assets/roles/thunder beetle 专属/后.png' }, baseStats: { hp: 145, attack: 22, defense: 20, speed: 11, luck: 12 } },
    { id: 'frost-fang', name: 'Frost Fang', rarity: 'SSR', icon: '❄️', image: 'assets/roles/frost-fang-ssr.png', evolvedImage: 'assets/roles/evolved/frost-fang.png', cuteEvolvedImage: 'assets/roles/cute-evolved/frost-fang.png', skillAssets: { before: 'assets/roles/frost fang 专属/前.png', after: 'assets/roles/frost fang 专属/后.png' }, baseStats: { hp: 132, attack: 24, defense: 15, speed: 16, luck: 12 } },
    { id: 'volt-cheetah', name: 'Volt Cheetah', rarity: 'LEGEND', icon: '🐆', image: 'assets/roles/volt-cheetah-legend.png', evolvedImage: 'assets/roles/evolved/volt-cheetah.png', cuteEvolvedImage: 'assets/roles/cute-evolved/volt-cheetah.png', skillAssets: { before: 'assets/roles/volt cheetah 专属/前.png', after: 'assets/roles/volt cheetah 专属/后.png' }, skills: [
      { id: 'passive', type: '被动', name: '雷霆感知', image: 'assets/roles/volt cheetah 专属/volt-cheetah-skill-passive.png', explanation: '闪电猎豹能提前感知空气中的电流变化。战斗开始时提升行动速度，也更容易躲开第一轮攻击。' },
      { id: 'skill-1', type: '技能 1', name: '闪电突袭', image: 'assets/roles/volt cheetah 专属/volt-cheetah-skill-1.png', explanation: '把身体化成一道蓝色闪电，瞬间冲向目标并造成快速的雷电伤害。' },
      { id: 'skill-2', type: '技能 2', name: '裂地雷爪', image: 'assets/roles/volt cheetah 专属/volt-cheetah-skill-2.png', explanation: '将电流集中到利爪，猛击地面后向前撕开电光裂痕，同时攻击前方敌人。' },
      { id: 'skill-3', type: '技能 3', name: '雷影疾行', image: 'assets/roles/volt cheetah 专属/volt-cheetah-skill-3.png', explanation: '留下数道带电残影，短时间提升移动速度，让对手难以判断真正的位置。' },
      { id: 'ultimate', type: '大招', name: '天穹落雷', image: 'assets/roles/volt cheetah 专属/volt-cheetah-ultimate.png', explanation: '召唤天空中的雷霆连续落下，覆盖大片区域，造成强力的范围雷电伤害。' }
    ], baseStats: { hp: 120, attack: 54, defense: 14, speed: 68, luck: 20 } },
    { id: 'shadow-stalker', name: 'Shadow Stalker', rarity: 'LEGEND', icon: '🦇', image: 'assets/roles/shadow-stalker-legend.png', evolvedImage: 'assets/roles/evolved/shadow-stalker.png', cuteEvolvedImage: 'assets/roles/cute-evolved/shadow-stalker.png', skillAssets: { before: 'assets/roles/shadow stalker 专属/前.png', after: 'assets/roles/shadow stalker 专属/后.png' }, baseStats: { hp: 110, attack: 88, defense: 0, speed: 26, luck: 0 } },
    { id: 'crybaby', name: 'Crybaby', rarity: 'SR', icon: '😭', image: 'assets/roles/new character/popmart/crybaby/crybaby_before.png', evolvedImage: 'assets/roles/new character/popmart/crybaby/crybaby_after.png', skillAssets: { before: 'assets/roles/new character/popmart/crybaby/skill-passive.png', after: 'assets/roles/new character/popmart/crybaby/after-skill-passive.png' }, baseStats: { hp: 112, attack: 13, defense: 10, speed: 12, luck: 16 } },
    { id: 'hacipupu', name: 'Hacipupu', rarity: 'R', icon: '🍄', image: 'assets/roles/new character/popmart/hacipupu/hacipupu_before.jpg', evolvedImage: 'assets/roles/new character/popmart/hacipupu/hacipupu_after.png', skillAssets: { before: 'assets/roles/new character/popmart/hacipupu/skill-passive.png', after: 'assets/roles/new character/popmart/hacipupu/after-skill-passive.png' }, baseStats: { hp: 118, attack: 11, defense: 15, speed: 9, luck: 13 } },
    { id: 'labubu', name: 'Labubu', rarity: 'SSR', icon: '🐰', image: 'assets/roles/new character/popmart/labubu/labubu_before.png', evolvedImage: 'assets/roles/new character/popmart/labubu/labubu_after.png', skillAssets: { before: 'assets/roles/new character/popmart/labubu/skill-passive.png', after: 'assets/roles/new character/popmart/labubu/after-skill-passive.png' }, baseStats: { hp: 106, attack: 17, defense: 9, speed: 15, luck: 15 } },
    { id: 'skullpanda', name: 'Skullpanda', rarity: 'SSR', icon: '🐼', image: 'assets/roles/new character/popmart/skullpanda/skullpanda_before.png', evolvedImage: 'assets/roles/new character/popmart/skullpanda/skullpanda_after.png', skillAssets: { before: 'assets/roles/new character/popmart/skullpanda/skill-passive.png', after: 'assets/roles/new character/popmart/skullpanda/after-skill-passive.png' }, baseStats: { hp: 114, attack: 18, defense: 11, speed: 13, luck: 14 } },
    { id: 'twinkle-twinkle', name: 'Twinkle Twinkle', rarity: 'SSR', icon: '⭐', image: 'assets/roles/new character/popmart/twinkle_twinkle/twinkle_twinkle_knight_before.png', evolvedImage: 'assets/roles/new character/popmart/twinkle_twinkle/twinkle_twinkle_after.png', skillAssets: { before: 'assets/roles/new character/popmart/twinkle_twinkle/skill-passive.png', after: 'assets/roles/new character/popmart/twinkle_twinkle/after-skill-passive.png' }, baseStats: { hp: 110, attack: 15, defense: 12, speed: 14, luck: 18 } },
    { id: 'pikachu', name: 'Pikachu', rarity: 'LIMITED', icon: '⚡', image: 'assets/roles/new character/pokemon/pikachu/pikachu_before.png', evolvedImage: 'assets/roles/new character/pokemon/pikachu/pikachu_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/pikachu.png', skillAssets: { before: 'assets/roles/new character/pokemon/pikachu/skill-passive.png', after: 'assets/roles/new character/pokemon/pikachu/after-skill-passive.png' }, baseStats: { hp: 128, attack: 58, defense: 18, speed: 72, luck: 35 } },
    { id: 'mewtwo', name: 'Mewtwo', rarity: 'LEGEND', icon: '🧠', image: 'assets/roles/new character/pokemon/mewtwo/mewtwo_before.png', evolvedImage: 'assets/roles/new character/pokemon/mewtwo/mewtwo_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/mewtwo.png', skillAssets: { before: 'assets/roles/new character/pokemon/mewtwo/skill-passive.png', after: 'assets/roles/new character/pokemon/mewtwo/after-skill-passive.png' }, baseStats: { hp: 138, attack: 27, defense: 13, speed: 19, luck: 17 } },
    { id: 'lucario', name: 'Lucario', rarity: 'SSR', icon: '🥊', image: 'assets/roles/new character/pokemon/lucario/lucario_before.jpg', evolvedImage: 'assets/roles/new character/pokemon/lucario/lucario_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/lucario.png', skillAssets: { before: 'assets/roles/new character/pokemon/lucario/skill-passive.png', after: 'assets/roles/new character/pokemon/lucario/after-skill-passive.png' }, baseStats: { hp: 126, attack: 24, defense: 16, speed: 18, luck: 12 } },
    { id: 'greninja', name: 'Greninja', rarity: 'SSR', icon: '🐸', image: 'assets/roles/new character/pokemon/greninja/greninja_before.png', evolvedImage: 'assets/roles/new character/pokemon/greninja/greninja_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/greninja.png', skillAssets: { before: 'assets/roles/new character/pokemon/greninja/skill-passive.png', after: 'assets/roles/new character/pokemon/greninja/after-skill-passive.png' }, baseStats: { hp: 118, attack: 25, defense: 11, speed: 25, luck: 14 } },
    { id: 'charizard', name: 'Charizard', rarity: 'SSR', icon: '🐉', image: 'assets/roles/new character/pokemon/chalizard/chalizard_before.png', evolvedImage: 'assets/roles/new character/pokemon/chalizard/chalizard_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/charizard.png', skillAssets: { before: 'assets/roles/new character/pokemon/chalizard/skill-passive.png', after: 'assets/roles/new character/pokemon/chalizard/after-skill-passive.png' }, baseStats: { hp: 142, attack: 28, defense: 14, speed: 17, luck: 13 } },
    { id: 'psyduck', name: 'Psyduck', rarity: 'SSR', icon: '🦆', image: 'assets/roles/new character/pokemon/psyduck/psyduck_before.png', evolvedImage: 'assets/roles/new character/pokemon/psyduck/psyduck_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/psyduck.png', skillAssets: { before: 'assets/roles/new character/pokemon/psyduck/skill-passive.png', after: 'assets/roles/new character/pokemon/psyduck/after-skill-passive.png' }, baseStats: { hp: 132, attack: 23, defense: 17, speed: 16, luck: 20 } },
    { id: 'squirtle', name: 'Squirtle', rarity: 'SSR', icon: '🐢', image: 'assets/roles/new character/pokemon/squirtle/squirtle_before.png', evolvedImage: 'assets/roles/new character/pokemon/squirtle/squirtle_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/squirtle.png', skillAssets: { before: 'assets/roles/new character/pokemon/squirtle/skill-passive.png', after: 'assets/roles/new character/pokemon/squirtle/after-skill-passive.png' }, baseStats: { hp: 148, attack: 24, defense: 28, speed: 12, luck: 15 } },
    { id: 'wolf', name: 'Wolf', rarity: 'SSR', icon: '🐺', image: 'assets/roles/new character/minecraft/wolf/wolf_before.png', evolvedImage: 'assets/roles/new character/minecraft/wolf/wolf_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/wolf.png', skillAssets: { before: 'assets/roles/new character/minecraft/wolf/skill-passive.png', after: 'assets/roles/new character/minecraft/wolf/after-skill-passive.png' }, baseStats: { hp: 130, attack: 21, defense: 15, speed: 18, luck: 12 } },
    { id: 'steve', name: 'Steve', rarity: 'SR', icon: '⛏️', image: 'assets/roles/new character/minecraft/steve/steve_before.jpg', evolvedImage: 'assets/roles/new character/minecraft/steve/steve_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/steve.png', skillAssets: { before: 'assets/roles/new character/minecraft/steve/skill-passive.png', after: 'assets/roles/new character/minecraft/steve/after-skill-passive.png' }, baseStats: { hp: 136, attack: 23, defense: 20, speed: 10, luck: 10 } },
    { id: 'enderman', name: 'Enderman', rarity: 'LEGEND', icon: '🟪', image: 'assets/roles/new character/minecraft/enderman/enderman_before.png', evolvedImage: 'assets/roles/new character/minecraft/enderman/enderman_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/enderman.png', skillAssets: { before: 'assets/roles/new character/minecraft/enderman/skill-passive.png', after: 'assets/roles/new character/minecraft/enderman/after-skill-passive.png' }, baseStats: { hp: 120, attack: 32, defense: 18, speed: 999, luck: 18 } },
    { id: 'enderdragon', name: 'Ender Dragon', rarity: 'LEGEND', icon: '🐲', image: 'assets/roles/new character/minecraft/enderdragon/enderdragon_before.png', evolvedImage: 'assets/roles/new character/minecraft/enderdragon/enderdragon_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/enderdragon.png', skillAssets: { before: 'assets/roles/new character/minecraft/enderdragon/skill-passive.png', after: 'assets/roles/new character/minecraft/enderdragon/after-skill-passive.png' }, baseStats: { hp: 210, attack: 46, defense: 95, speed: 12, luck: 16 } },
    { id: 'creeper', name: 'Creeper', rarity: 'LEGEND', icon: '💣', image: 'assets/roles/new character/minecraft/creeper/creeper_before.png', evolvedImage: 'assets/roles/new character/minecraft/creeper/creeper_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/creeper.png', skillAssets: { before: 'assets/roles/new character/minecraft/creeper/skill-passive.png', after: 'assets/roles/new character/minecraft/creeper/after-skill-passive.png' }, baseStats: { hp: 150, attack: 62, defense: 58, speed: 5, luck: 8 } },
    { id: 'kuromi', name: 'Kuromi', rarity: 'SSR', icon: '🎀', image: 'assets/roles/new character/sanrio/kuromi/kuromi_before.png', evolvedImage: 'assets/roles/new character/sanrio/kuromi/kuromi_after.png', skillAssets: { before: 'assets/roles/new character/sanrio/kuromi/skill-passive.png', after: 'assets/roles/new character/sanrio/kuromi/after-skill-passive.png' }, baseStats: { hp: 118, attack: 26, defense: 13, speed: 20, luck: 16 } },
    { id: 'my-melody', name: 'My Melody', rarity: 'SSR', icon: '🌸', image: 'assets/roles/new character/sanrio/my-melody/my-melody_before.png', evolvedImage: 'assets/roles/new character/sanrio/my-melody/my-melody_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/my-melody.png', skillAssets: { before: 'assets/roles/new character/sanrio/my-melody/skill-passive.png', after: 'assets/roles/new character/sanrio/my-melody/after-skill-passive.png' }, baseStats: { hp: 142, attack: 17, defense: 25, speed: 12, luck: 18 } },
    { id: 'cinnamoroll', name: 'Cinnamoroll', rarity: 'SSR', icon: '☁️', image: 'assets/roles/new character/sanrio/cinnamoroll/cinnamoroll_before.png', evolvedImage: 'assets/roles/new character/sanrio/cinnamoroll/cinnamoroll_after.png', skillAssets: { before: 'assets/roles/new character/sanrio/cinnamoroll/skill-passive.png', after: 'assets/roles/new character/sanrio/cinnamoroll/after-skill-passive.png' }, baseStats: { hp: 128, attack: 18, defense: 18, speed: 24, luck: 17 } },
    { id: 'pochacco', name: 'Pochacco', rarity: 'SSR', icon: '🏃', image: 'assets/roles/new character/sanrio/pochacco/pochacco_before.png', evolvedImage: 'assets/roles/new character/sanrio/pochacco/pochacco_after.png', skillAssets: { before: 'assets/roles/new character/sanrio/pochacco/skill-passive.png', after: 'assets/roles/new character/sanrio/pochacco/after-skill-passive.png' }, baseStats: { hp: 124, attack: 23, defense: 14, speed: 27, luck: 14 } },
    { id: 'hello-kitty', name: 'Hello Kitty', rarity: 'SSR', icon: '💖', image: 'assets/roles/new character/sanrio/hello-kitty/hello-kitty_before.png', evolvedImage: 'assets/roles/new character/sanrio/hello-kitty/hello-kitty_after.png', skillAssets: { before: 'assets/roles/new character/sanrio/hello-kitty/skill-passive.png', after: 'assets/roles/new character/sanrio/hello-kitty/after-skill-passive.png' }, baseStats: { hp: 136, attack: 20, defense: 22, speed: 15, luck: 20 } },
    { id: 'winnie-the-pooh', name: 'Winnie The Pooh', rarity: 'SSR', icon: '🍯', image: 'assets/roles/new character/cartoon/winnie-the-pooh/winnie-the-pooh_before-v2.png', evolvedImage: 'assets/roles/new character/cartoon/winnie-the-pooh/winnie-the-pooh_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/winnie-the-pooh.png', skillAssets: { before: 'assets/roles/new character/cartoon/winnie-the-pooh/skill-passive.png', after: 'assets/roles/new character/cartoon/winnie-the-pooh/after-skill-passive.png' }, baseStats: { hp: 168, attack: 25, defense: 34, speed: 12, luck: 30 } },
    { id: 'crayon-shinchan', name: '蜡笔小新', rarity: 'SR', icon: '🖍️', image: 'assets/roles/new character/cartoon/crayon-shinchan/crayon-shinchan_before.jpg', evolvedImage: 'assets/roles/new character/cartoon/crayon-shinchan/crayon-shinchan_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/crayon-shinchan.png', skillAssets: { before: 'assets/roles/new character/cartoon/crayon-shinchan/skill-passive.png', after: 'assets/roles/new character/cartoon/crayon-shinchan/after-skill-passive.png' }, baseStats: { hp: 122, attack: 24, defense: 18, speed: 30, luck: 24 } },
    { id: 'ugly-fish', name: '丑鱼', rarity: 'SR', icon: '🐟', image: 'assets/roles/new character/cartoon/ugly-fish/ugly-fish_before.jpg', evolvedImage: 'assets/roles/new character/cartoon/ugly-fish/ugly-fish_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/ugly-fish.png', skillAssets: { before: 'assets/roles/new character/cartoon/ugly-fish/skill-passive.png', after: 'assets/roles/new character/cartoon/ugly-fish/after-skill-passive.png' }, baseStats: { hp: 128, attack: 20, defense: 24, speed: 18, luck: 28 } },
    { id: 'yoyo', name: 'YOYO', rarity: 'SSR', icon: '💗', image: 'assets/roles/new character/cartoon/yoyo/yoyo_before.jpg', evolvedImage: 'assets/roles/new character/cartoon/yoyo/yoyo_after.png', cuteEvolvedImage: 'assets/roles/cute-evolved/yoyo.png', skillAssets: { before: 'assets/roles/new character/cartoon/yoyo/skill-passive.png', after: 'assets/roles/new character/cartoon/yoyo/after-skill-passive.png' }, baseStats: { hp: 136, attack: 28, defense: 22, speed: 18, luck: 36 } }
  ];

  const MINI_EVOLUTION_IMAGES = {
    'sunny-wing': 'assets/roles/mini-evolved/sunny-wing.png',
    sprouty: 'assets/roles/mini-evolved/sprouty.png',
    hydroblob: 'assets/roles/mini-evolved/hydroblob.png',
    fluffbit: 'assets/roles/mini-evolved/fluffbit.png',
    'shadow-wing': 'assets/roles/mini-evolved/shadow-wing.png',
    'flame-rex': 'assets/roles/mini-evolved/flame-rex.png',
    'thunder-beetle': 'assets/roles/mini-evolved/thunder-beetle.png',
    'frost-fang': 'assets/roles/mini-evolved/frost-fang.png',
    'volt-cheetah': 'assets/roles/mini-evolved/volt-cheetah.png',
    'shadow-stalker': 'assets/roles/mini-evolved/shadow-stalker.png',
    crybaby: 'assets/roles/mini-evolved/crybaby.png',
    hacipupu: 'assets/roles/mini-evolved/hacipupu.png',
    labubu: 'assets/roles/mini-evolved/labubu.png',
    skullpanda: 'assets/roles/mini-evolved/skullpanda.png',
    'twinkle-twinkle': 'assets/roles/mini-evolved/twinkle-twinkle.png',
    pikachu: 'assets/roles/mini-evolved/pikachu.png',
    mewtwo: 'assets/roles/mini-evolved/mewtwo.png',
    lucario: 'assets/roles/mini-evolved/lucario.png',
    greninja: 'assets/roles/mini-evolved/greninja.png',
    charizard: 'assets/roles/mini-evolved/charizard.png',
    psyduck: 'assets/roles/mini-evolved/psyduck.png',
    squirtle: 'assets/roles/mini-evolved/squirtle.png',
    wolf: 'assets/roles/mini-evolved/wolf.png',
    steve: 'assets/roles/mini-evolved/steve.png',
    enderman: 'assets/roles/mini-evolved/enderman.png',
    enderdragon: 'assets/roles/mini-evolved/enderdragon.png',
    creeper: 'assets/roles/mini-evolved/creeper.png',
    kuromi: 'assets/roles/mini-evolved/kuromi.png',
    'my-melody': 'assets/roles/mini-evolved/my-melody.png',
    cinnamoroll: 'assets/roles/mini-evolved/cinnamoroll.png',
    pochacco: 'assets/roles/mini-evolved/pochacco.png',
    'hello-kitty': 'assets/roles/mini-evolved/hello-kitty.png',
    'winnie-the-pooh': 'assets/roles/mini-evolved/winnie-the-pooh.png',
    'crayon-shinchan': 'assets/roles/mini-evolved/crayon-shinchan.png',
    'ugly-fish': 'assets/roles/mini-evolved/ugly-fish.png',
    yoyo: 'assets/roles/mini-evolved/yoyo.png'
  };

  const PET_EVOLUTION_NAMES = {
    'sunny-wing': { base: 'Sunny Wing', mini: 'Dawn Winglet', heroic: 'Solar Seraph', cute: 'Sunny Puffwing' },
    sprouty: { base: 'Sprouty', mini: 'Moss Sproutling', heroic: 'Ancient Groveguard', cute: 'Sprouty Leafbud' },
    hydroblob: { base: 'Hydroblob', mini: 'Hydro Wyrmling', heroic: 'Hydro Dragonlord', cute: 'Hydro Bubblebun' },
    fluffbit: { base: 'Fluffbit', mini: 'Fluff Pufflet', heroic: 'Cloudtail Guardian', cute: 'Fluffy Puffbun' },
    'shadow-wing': { base: 'Shadow Wing', mini: 'Dusk Winglet', heroic: 'Eclipse Shadowwing', cute: 'Shady Puffwing' },
    'flame-rex': { base: 'Flame Rex', mini: 'Ember Raptor', heroic: 'Inferno Rexlord', cute: 'Flame Chomplet' },
    'thunder-beetle': { base: 'Thunder Beetle', mini: 'Spark Beetlet', heroic: 'Thunder Titan Beetle', cute: 'Zap Buglet' },
    'frost-fang': { base: 'Frost Fang', mini: 'Frost Pupfang', heroic: 'Glacial Fenrir', cute: 'Snow Fangpup' },
    'volt-cheetah': { base: 'Volt Cheetah', mini: 'Volt Cubdash', heroic: 'Storm Cheetah Prime', cute: 'Zippy Cheetah Cub' },
    'shadow-stalker': { base: 'Shadow Stalker', mini: 'Shade Prowler', heroic: 'Nightfall Reaper', cute: 'Tiny Nightstalker' },
    crybaby: { base: 'Crybaby', mini: 'Tear Gemling', heroic: 'Crystal Crybaby', cute: 'Crybaby Pudding Star' },
    hacipupu: { base: 'Hacipupu', mini: 'Mushroom Pup', heroic: 'Forest Hacipupu', cute: 'Haci Mushroomling' },
    labubu: { base: 'Labubu', mini: 'Little Labubu', heroic: 'Labubu Wonderfang', cute: 'Labubu Bunny Star' },
    skullpanda: { base: 'Skullpanda', mini: 'Moon Panda', heroic: 'Dream Skullpanda', cute: 'Skullpanda Moonbun' },
    'twinkle-twinkle': { base: 'Twinkle Twinkle', mini: 'Star Squire', heroic: 'Twinkle Star Knight', cute: 'Twinkle Dreamlet' },
    pikachu: { base: 'Pikachu', mini: 'Pika Sparklet', heroic: 'Thunder Pikachu', cute: 'Pika Starbuddy' },
    mewtwo: { base: 'Mewtwo', mini: 'Mew Mindling', heroic: 'Psychic Mewtwo', cute: 'Mew Starling' },
    lucario: { base: 'Lucario', mini: 'Aura Pup', heroic: 'Aura Lucario', cute: 'Lucario Aurapup' },
    greninja: { base: 'Greninja', mini: 'Bubble Ninja', heroic: 'Shadow Greninja', cute: 'Froggy Ninja' },
    charizard: { base: 'Charizard', mini: 'Ember Charm', heroic: 'Skyfire Charizard', cute: 'Chari Puffdrake' },
    psyduck: { base: 'Psyduck', mini: 'Headache Duckling', heroic: 'Aqua Mind Duck King', cute: 'Bubble Ducky Star' },
    squirtle: { base: 'Squirtle', mini: 'Wave Shell Cub', heroic: 'Hydro Cannon Paladin', cute: 'Bubble Shell Star' },
    wolf: { base: 'Wolf', mini: 'Wolf Pup', heroic: 'Alpha Wolfguard', cute: 'Fluffy Wolfpup' },
    steve: { base: 'Steve', mini: 'Builder Steve', heroic: 'Diamond Steve', cute: 'Mini Builder Steve' },
    enderman: { base: 'Enderman', mini: 'Ender Sprite', heroic: 'Void Enderman', cute: 'Ender Peep' },
    enderdragon: { base: 'Ender Dragon', mini: 'Ender Drakelet', heroic: 'Ender Dragonlord', cute: 'Ender Puffdrake' },
    creeper: { base: 'Creeper', mini: 'Creeper Bud', heroic: 'Charged Creeper', cute: 'Creeper Puffboom' },
    kuromi: { base: 'Kuromi', mini: 'Kuromi Starlet', heroic: 'Kuromi Midnight Queen', cute: 'Kuromi Sweet Star' },
    'my-melody': { base: 'My Melody', mini: 'Melody Blossom', heroic: 'My Melody Bloom Queen', cute: 'Melody Bunny Puff' },
    cinnamoroll: { base: 'Cinnamoroll', mini: 'Cinna Cloudlet', heroic: 'Cinnamoroll Sky Prince', cute: 'Cinna Cloudpuff' },
    pochacco: { base: 'Pochacco', mini: 'Pochacco Runner', heroic: 'Pochacco Sprint Star', cute: 'Pochacco Pupstar' },
    'hello-kitty': { base: 'Hello Kitty', mini: 'Kitty Ribbon', heroic: 'Hello Kitty Heart Queen', cute: 'Kitty Ribbon Puff' },
    'winnie-the-pooh': { base: 'Winnie The Pooh', mini: 'Honey Cub', heroic: 'Honey Guardian', cute: 'Pooh Honeybun' },
    'crayon-shinchan': { base: '蜡笔小新', mini: '小新超人', heroic: '动感小新队长', cute: '小新勇气仔' },
    'ugly-fish': { base: '丑鱼', mini: '沙滩鱼仔', heroic: '海滩快乐鱼王', cute: '丑鱼泡泡仔' },
    yoyo: { base: 'YOYO', mini: 'Cloud YOYO', heroic: 'YOYO Heart Angel', cute: 'YOYO Cotton Star' }
  };

  PET_CATALOG.forEach((pet) => {
    pet.miniEvolutionImage = MINI_EVOLUTION_IMAGES[pet.id] || '';
    pet.evolutionNames = PET_EVOLUTION_NAMES[pet.id] || { base: pet.name, mini: pet.name, heroic: pet.name, cute: pet.name };
  });

  const ROLE_SKILL_COPY = {
    'sunny-wing': [
      ['被动', '轻羽感知', 'Sunny Wing 能感知风向变化，行动时更灵活，也更容易避开迎面而来的危险。'],
      ['技能 1', '羽刃旋风', '挥动翅膀射出旋转羽刃，带着清风快速攻击前方目标。'],
      ['技能 2', '云端俯冲', '飞上云端后俯冲而下，借助风势发动一次强力冲击。'],
      ['技能 3', '轻云护罩', '召唤柔软云朵形成护罩，短时间降低受到的伤害。'],
      ['大招', '晨曦重生', '释放耀眼晨光，在关键时刻点燃重生之力，让 Sunny Wing 从濒危状态重新振翅并恢复生命。']
    ],
    sprouty: [
      ['被动', '森林之心', 'Sprouty 与森林植物相连，周围有自然能量时会慢慢恢复体力。'],
      ['技能 1', '藤蔓缠绕', '从地面伸出坚韧藤蔓，缠住前方目标并限制行动。'],
      ['技能 2', '花粉治愈', '散出温暖花粉，为自己和伙伴恢复能量。'],
      ['技能 3', '古树守护', '召唤树木与菌菇组成护墙，抵挡一次强力攻击。'],
      ['大招', '远古生长', '让大地瞬间生长，巨大的自然力量覆盖区域并持续造成伤害。']
    ],
    hydroblob: [
      ['被动', '水滴核心', 'Hydroblob 能吸收周围水气，受到攻击后会快速恢复一点活力。'],
      ['技能 1', '泡泡爆裂', '发射一串水泡，命中目标后连续爆开。'],
      ['技能 2', '水流冲刺', '化作水流向前冲刺，快速穿过危险区域。'],
      ['技能 3', '潮汐护盾', '制造旋转水墙，减轻来自前方的伤害。'],
      ['大招', '海洋皇冠', '召唤巨大的潮汐和水柱，将范围内的目标卷入水流。']
    ],
    fluffbit: [
      ['被动', '柔软幸运', 'Fluffbit 的软绒毛能缓冲冲击，也会带来一点意外好运。'],
      ['技能 1', '绒球翻滚', '缩成一团高速滚动，撞开前方障碍和目标。'],
      ['技能 2', '棉花护身', '蓬松的绒毛包住身体，降低受到的伤害。'],
      ['技能 3', '幸运弹跳', '连续弹跳穿过目标，每次落地都留下轻盈的冲击波。'],
      ['大招', '云朵嘉年华', '召唤满天柔软云朵，让整个区域变成欢乐又混乱的弹跳场。']
    ],
    'shadow-wing': [
      ['被动', '暗夜感知', 'Shadow Wing 能在黑暗中看见危险，夜间行动更加敏捷。'],
      ['技能 1', '暗影羽刃', '射出带有暗影能量的羽刃，悄无声息地攻击目标。'],
      ['技能 2', '夜幕俯冲', '融入黑暗后从上方俯冲，造成快速打击。'],
      ['技能 3', '幽影护翼', '展开暗色翅膀制造分身，混淆对手的视线。'],
      ['大招', '月蚀风翼', '召唤月蚀般的黑暗风暴，让整片区域进入短暂的夜幕。']
    ],
    'flame-rex': [
      ['被动', '熔火核心', 'Flame Rex 的体内燃烧着熔火核心，攻击越连贯，火焰越旺盛。'],
      ['技能 1', '烈焰吐息', '喷出一道炽热火焰，直线烧过前方区域。'],
      ['技能 2', '熔岩利爪', '把火焰集中到爪尖，向前挥出灼热的裂痕。'],
      ['技能 3', '火旋护体', '让火焰围绕身体旋转，靠近的目标会受到灼烧。'],
      ['大招', '火山审判', '召唤火山与陨石火雨，让大地在火光中震动。']
    ],
    'thunder-beetle': [
      ['被动', '静电甲壳', 'Thunder Beetle 的甲壳会储存静电，受到攻击时释放电光反击。'],
      ['技能 1', '雷角突进', '用带电尖角向前冲撞，将电流传给碰到的目标。'],
      ['技能 2', '电弧跳跃', '在多个目标之间跳跃放电，形成连续电弧。'],
      ['技能 3', '风暴甲壳', '展开甲壳吸收雷电，短时间提升防御能力。'],
      ['大招', '雷霆坠击', '从高处带着雷光落下，制造强力范围冲击。']
    ],
    'frost-fang': [
      ['被动', '冰霜之心', 'Frost Fang 的冰霜气息会减慢靠近的危险，让它保持冷静。'],
      ['技能 1', '寒冰撕咬', '以冰牙咬住目标，将寒气注入对方体内。'],
      ['技能 2', '晶刃突袭', '借助冰晶向前跃进，留下锋利的冰刃。'],
      ['技能 3', '暴雪咆哮', '发出冰冷咆哮，召唤雪花和碎冰干扰目标。'],
      ['大招', '永恒寒冬', '让大范围区域进入极寒状态，冰晶从地面持续升起。']
    ],
    'shadow-stalker': [
      ['被动', '深渊之眼', 'Shadow Stalker 能看穿短暂的黑暗，提前发现隐藏的危险。'],
      ['技能 1', '暗影利爪', '从黑暗中伸出利爪，快速划过目标身旁。'],
      ['技能 2', '夜行突袭', '化成一道影子贴地移动，在目标背后突然出现。'],
      ['技能 3', '幽魂群舞', '召唤一群幽影迷惑目标，并从多个方向发起攻击。'],
      ['大招', '暗月降临', '召唤暗月和深渊力量，让整片区域被黑暗能量覆盖。']
    ],
    crybaby: [
      ['被动', '泪光感知', 'Crybaby 能感知伙伴的情绪，受到伤害时提高闪避并积蓄泪光能量。'],
      ['技能 1', '泪滴弹射', '连续发射晶莹泪滴，命中目标后会弹向附近的另一个目标。'],
      ['技能 2', '哭哭护盾', '把泪水凝成透明护盾，吸收伤害并为自己恢复少量生命。'],
      ['技能 3', '情绪爆发', '释放积蓄的哭声冲击波，使前方敌人短暂减速。'],
      ['大招', '天降大哭', '召唤一场泪滴暴雨，覆盖大范围区域并持续削弱敌人的攻击力。']
    ],
    hacipupu: [
      ['被动', '蘑菇共鸣', 'Hacipupu 与森林菌菇共享生命力，站在自然区域时会持续恢复体力。'],
      ['技能 1', '蘑菇弹', '抛出会弹跳的彩色蘑菇，爆开后对目标造成连续伤害。'],
      ['技能 2', '森林提灯', '点亮手中的小灯，为自己和伙伴提供护盾与幸运加成。'],
      ['技能 3', '根须跳跃', '借助地下根须瞬间跳到目标身边，并把目标短暂缠住。'],
      ['大招', '童话森林', '召唤一片发光蘑菇森林，持续治疗伙伴并攻击进入其中的敌人。']
    ],
    labubu: [
      ['被动', '淘气直觉', 'Labubu 总能先一步发现危险，第一次受到攻击时会留下一个诱饵分身。'],
      ['技能 1', '耳朵回旋镖', '甩出长耳回旋镖，绕回时再次攻击沿途目标。'],
      ['技能 2', '尖牙乱舞', '快速挥动尖牙和利爪，对近距离目标造成多段伤害。'],
      ['技能 3', '森林恶作剧', '在地面布置隐藏陷阱，使踩中的敌人失去行动机会。'],
      ['大招', '兔王狂欢', '召唤一群淘气伙伴加入战场，持续追逐并围攻所有敌人。']
    ],
    skullpanda: [
      ['被动', '月蚀感知', 'Skullpanda 能从月光变化中预判攻击，夜影状态下提升暴击率。'],
      ['技能 1', '暗星飞刃', '投掷数枚黑色星刃，命中后会在目标身上留下暗蚀标记。'],
      ['技能 2', '骷髅幻影', '召唤幻影替身承受一次攻击，并从侧面反击。'],
      ['技能 3', '黑玫瑰领域', '展开带刺黑玫瑰领域，使范围内敌人持续受到暗属性伤害。'],
      ['大招', '月蚀终章', '让月光完全变暗，短时间内连续召唤暗星轰击全场。']
    ],
    'twinkle-twinkle': [
      ['被动', '星光祝福', 'Twinkle Twinkle 的星光会照亮伙伴，队伍幸运和技能命中率小幅提升。'],
      ['技能 1', '星尘射线', '发射一束彩色星尘光线，穿过第一个目标后继续前进。'],
      ['技能 2', '彩虹步', '踏着彩虹快速移动，短时间内免疫地面陷阱。'],
      ['技能 3', '星锁结界', '用星链围出保护结界，降低结界内伙伴受到的伤害。'],
      ['大招', '银河闪耀', '召唤银河从天空落下，连续照耀并打击大范围敌人。']
    ],
    pikachu: [
      ['被动', '静电尾巴', 'Pikachu 的尾巴会储存静电，受到近身攻击时有机会麻痹敌人。'],
      ['技能 1', '电光冲刺', '化成电光向前冲刺，沿途留下短暂的带电轨迹。'],
      ['技能 2', '十万伏特', '释放强力电流攻击目标，并把电击传递给附近敌人。'],
      ['技能 3', '电气场地', '制造电气场地，提升伙伴速度并持续干扰敌方行动。'],
      ['大招', '雷霆万钧', '召唤巨型闪电从天空劈落，造成强力范围雷电伤害。']
    ],
    mewtwo: [
      ['被动', '超能预感', 'Mewtwo 能读取能量流动，战斗开始时获得一层精神屏障。'],
      ['技能 1', '念力冲击', '用念力将目标推开并造成精神伤害。'],
      ['技能 2', '精神利刃', '凝聚紫色精神能量，形成利刃快速切开前方区域。'],
      ['技能 3', '屏障重构', '重构周围能量屏障，清除一个负面状态并恢复护盾。'],
      ['大招', '破坏光线', '聚集巨大的超能力光束，贯穿直线上的所有目标。']
    ],
    lucario: [
      ['被动', '波导感知', 'Lucario 能感知生命波导，低生命值时会获得额外攻击与防御。'],
      ['技能 1', '真空波', '将波导压缩成快速气流，远距离打击前方目标。'],
      ['技能 2', '金属爪', '强化双爪并连续挥击，最后一击会击退敌人。'],
      ['技能 3', '波导弹', '凝聚不会落空的波导弹，追踪目标并造成能量伤害。'],
      ['大招', '近身真气爆发', '将全身波导集中在拳头上，近距离释放一次强力爆发。']
    ],
    greninja: [
      ['被动', '潜影', 'Greninja 在移动后会短暂进入潜影状态，降低被敌人锁定的机会。'],
      ['技能 1', '水手里剑', '投掷高速旋转的水手里剑，对目标造成连续切割伤害。'],
      ['技能 2', '影分身', '制造多个水影分身，混淆敌人并从不同方向发动攻击。'],
      ['技能 3', '水流裂步', '化作水流瞬移到目标身后，下一次攻击必定造成额外伤害。'],
      ['大招', '巨型水手里剑', '凝聚巨大的水之手里剑横扫战场，并留下持续水流区域。']
    ],
    charizard: [
      ['被动', '炽热鳞片', 'Charizard 的鳞片储存火焰能量，连续攻击会逐渐提高火属性伤害。'],
      ['技能 1', '火花冲击', '向前喷出爆裂火花，命中后会在目标附近产生小范围爆炸。'],
      ['技能 2', '龙爪', '用覆盖火焰的龙爪猛击目标，近距离造成高额伤害。'],
      ['技能 3', '喷射火焰', '持续喷出宽阔火柱，灼烧前方区域内的所有敌人。'],
      ['大招', '爆炎龙舞', '展开双翼飞入高空，再以龙炎旋舞俯冲，造成全场范围火焰伤害。']
    ],
    psyduck: [
      ['被动', '念波发呆', 'Psyduck 看起来常常在发呆，其实脑袋里一直累积神秘念波，受到攻击后更容易触发反击。'],
      ['技能 1', '浪花拍击', '举起水波轻拍目标，造成水属性伤害，并让对方短时间慢下来。'],
      ['技能 2', '头痛念波', '抱住脑袋释放念力冲击，打乱目标节奏并造成额外精神伤害。'],
      ['技能 3', '泡泡护罩', '制造一层柔软泡泡护住自己，降低下一次受到的伤害。'],
      ['大招', '心海浪潮', '把头痛积累成巨大的心海浪潮，一口气冲刷整个战场。']
    ],
    squirtle: [
      ['被动', '贝壳守护', 'Squirtle 的龟壳会自动保护身体，受到攻击时有机会降低伤害。'],
      ['技能 1', '水枪冲击', '向前喷出集中水柱，快速击中目标并造成稳定水属性伤害。'],
      ['技能 2', '滚壳突进', '缩进贝壳高速滚动，撞开前方目标并提高自身防御。'],
      ['技能 3', '潮泡护盾', '召唤潮水泡泡环绕自己和伙伴，短时间提升防御。'],
      ['大招', '海炮浪涌', '聚集强大水压发射海炮，把前方区域卷入连续浪涌。']
    ],
    wolf: [
      ['被动', '群体守护', 'Wolf 会保护身边伙伴，附近队友受到攻击时降低部分伤害。'],
      ['技能 1', '狼牙扑击', '向前扑出并咬住目标，短暂限制目标行动。'],
      ['技能 2', '冰原追踪', '锁定一名目标并留下气味标记，提高对该目标的移动速度和伤害。'],
      ['技能 3', '嚎叫鼓舞', '发出勇敢嚎叫，提升全队攻击力和抗性。'],
      ['大招', '月夜狼王', '召唤月光化身为狼王，带领狼群冲过整片战场。']
    ],
    steve: [
      ['被动', '方块生存', 'Steve 善于利用环境，受到致命伤害时会自动生成一层方块护甲。'],
      ['技能 1', '钻石镐击', '挥动钻石镐重击目标，能快速破坏敌人的护盾。'],
      ['技能 2', '钻石盾墙', '举起坚固的钻石盾牌，挡下正面冲击并保护身后的伙伴。'],
      ['技能 3', '金苹果守护', '吃下发光的金苹果，短时间提高生命恢复和防御能力。'],
      ['大招', '钻石终结', '挥出充满能量的钻石剑，对前方目标造成强力斩击。']
    ],
    enderman: [
      ['被动', '末影感知', 'Enderman 能感知空间裂缝，受到远程攻击时有机会瞬移避开。'],
      ['技能 1', '传送突袭', '瞬移到目标身边并立刻发动一次强力近身攻击。'],
      ['技能 2', '紫影长臂', '伸长末影手臂攻击远处目标，同时把目标拉向自己。'],
      ['技能 3', '末影分身', '制造多个紫色分身，分身消失时会对附近目标造成冲击。'],
      ['大招', '虚空迁跃', '撕开虚空裂缝，在多个位置连续出现并轰击整个区域。']
    ],
    enderdragon: [
      ['被动', '末影龙威', 'Ender Dragon 的龙威压制敌人，附近目标的攻击力会逐渐下降。'],
      ['技能 1', '龙息', '喷出紫色末影龙息，在地面留下持续伤害区域。'],
      ['技能 2', '翼击', '挥动巨大龙翼制造冲击风暴，将前方目标击飞。'],
      ['技能 3', '末影火球', '发射会分裂的末影火球，对多个目标造成爆炸伤害。'],
      ['大招', '终末龙灾', '飞向高空召唤末影风暴，随后以龙息和火球覆盖整片战场。']
    ],
    creeper: [
      ['被动', '爆炸感知', 'Creeper 能感知周围方块变化，靠近敌人时会逐渐积蓄爆炸能量。'],
      ['技能 1', '苦力怕冲撞', '快速冲向目标并在接触时释放小范围爆破。'],
      ['技能 2', '绿能潜伏', '暂时隐藏自己的气息，下一次爆炸伤害大幅提升。'],
      ['技能 3', '连锁引爆', '点燃场上的爆炸能量，让附近多个目标依次发生连锁爆炸。'],
      ['大招', '超级爆破', '集中所有绿能进行一次巨大爆炸，造成范围伤害并击退敌人。']
    ],
    kuromi: [
      ['被动', '星夜恶作剧', 'Kuromi 会把星夜能量藏进装备里，战斗开始时提升攻击与幸运。'],
      ['技能 1', '魔星镰舞', '挥动星月魔镰划出粉紫色弧光，快速攻击前方目标。'],
      ['技能 2', '甜梦突袭', '用披风遮住身形后突然出现，让目标被梦境星光击中。'],
      ['技能 3', '淘气护腕', '启动宝石护腕形成短暂屏障，同时反弹一部分伤害。'],
      ['大招', '月夜星冠', '释放皇冠与魔镰的力量，让整片区域落下粉紫星雨。']
    ],
    'my-melody': [
      ['被动', '花心祝福', 'My Melody 的花心装备会持续散发温柔能量，提高生命与防御。'],
      ['技能 1', '爱心花杖', '举起花心法杖释放治愈光束，攻击目标并恢复少量体力。'],
      ['技能 2', '花瓣回旋', '召唤花瓣围绕身体旋转，保护自己并推开靠近的危险。'],
      ['技能 3', '粉樱护幕', '展开透明花瓣披风，为自己和伙伴降低受到的伤害。'],
      ['大招', '玫瑰治愈阵', '在脚下展开玫瑰魔法阵，持续治疗伙伴并削弱敌人的攻击。']
    ],
    cinnamoroll: [
      ['被动', '云端乐感', 'Cinnamoroll 会跟着音符感知风向，移动时更快也更容易闪避。'],
      ['技能 1', '音符法杖', '挥动高音谱号法杖，发射一串发光音符攻击目标。'],
      ['技能 2', '云朵旋律', '召唤柔软云朵环绕身体，短时间提升防御与速度。'],
      ['技能 3', '茶杯回响', '让空中的茶杯与音符共鸣，对周围目标造成连续冲击。'],
      ['大招', '天空交响曲', '召唤云端舞台与巨大乐谱，让音符光波覆盖整个区域。']
    ],
    pochacco: [
      ['被动', '极速运动魂', 'Pochacco 的运动装备会积蓄速度能量，行动越久速度越快。'],
      ['技能 1', '香蕉冲刺', '踩着发光跑鞋向前冲刺，沿途留下蓝黄速度轨迹。'],
      ['技能 2', '冰淇淋旋击', '挥动能量冰淇淋棒旋转攻击，把目标击退。'],
      ['技能 3', '明星护具', '启动星星护具，短时间提升防御并减少受到的冲击。'],
      ['大招', '冠军疾风场', '冲入运动场中央引爆速度能量，召唤香蕉星光风暴。']
    ],
    'hello-kitty': [
      ['被动', '皇家爱心', 'Hello Kitty 的皇家装备会守护伙伴，提升幸运与防御。'],
      ['技能 1', '爱心权杖', '举起爱心权杖释放粉色光弹，命中后扩散成小范围心光。'],
      ['技能 2', '公主护盾', '展开爱心盾牌挡下正面攻击，并恢复一点生命。'],
      ['技能 3', '蝴蝶结号令', '让蝴蝶结宝石发光，提升自己和伙伴的行动效率。'],
      ['大招', '星耀皇家礼赞', '释放皇冠、披风与权杖的力量，让粉色星光照耀全场。']
    ],
    'winnie-the-pooh': [
      ['被动', '蜂蜜好运', 'Winnie The Pooh 带着蜂蜜香气，提升生命与幸运。'],
      ['技能 1', '蜂蜜星棒', '挥动蜂蜜星棒发出甜甜光波，攻击目标并恢复一点心情。'],
      ['技能 2', '云朵抱枕', '召唤软绵绵的云朵抱枕，保护自己不被击退。'],
      ['技能 3', '蜂蜜守护', '打开幸运蜂蜜罐，短时间提升防御和恢复能力。'],
      ['大招', '甜蜜森林派对', '召集森林伙伴和蜂蜜光芒，给全场带来温暖力量。']
    ],
    'crayon-shinchan': [
      ['被动', '动感能量', '蜡笔小新总能带来意想不到的勇气，提升速度与幸运。'],
      ['技能 1', '蜡笔冲刺', '拿着蜡笔向前冲刺，画出彩色轨迹攻击目标。'],
      ['技能 2', '搞怪姿势', '摆出搞怪动作干扰敌人，让对方短时间失去节奏。'],
      ['技能 3', '动感护盾', '召唤动感光圈保护自己，并弹开靠近的危险。'],
      ['大招', '动感光线', '释放满满动感能量，形成彩色光线横扫战场。']
    ],
    'ugly-fish': [
      ['被动', '沙滩勇气', '丑鱼虽然看起来特别，但拥有很强的适应力，提升生命与幸运。'],
      ['技能 1', '椰子水花', '喷出清凉水花攻击目标，让敌人行动变慢。'],
      ['技能 2', '沙中躲藏', '钻进沙地避开攻击，下一次出现时提升防御。'],
      ['技能 3', '泡泡护罩', '召唤一圈泡泡护罩，抵挡伤害并保护伙伴。'],
      ['大招', '阳光海浪', '掀起明亮海浪冲向前方，造成范围伤害并带来好运。']
    ],
    yoyo: [
      ['被动', '心愿云朵', 'YOYO 的心愿云朵会持续守护伙伴，提升幸运与生命。'],
      ['技能 1', '粉光闪闪', '释放粉色星光攻击目标，让周围充满温柔能量。'],
      ['技能 2', '棉花拥抱', '用棉花云抱住自己和伙伴，短时间提高防御。'],
      ['技能 3', '蝴蝶结守护', '让蝴蝶结光芒展开成屏障，挡住前方危险。'],
      ['大招', '爱心气球雨', '召唤大量爱心气球从天而降，治愈伙伴并攻击敌人。']
    ]
  };

  const SKILL_IMAGE_FILES = ['skill-passive.png', 'skill-1.png', 'skill-2.png', 'skill-3.png', 'skill-ultimate.png'];
  const AFTER_SKILL_IMAGE_FILES = ['after-skill-passive.png', 'after-skill-1.png', 'after-skill-2.png', 'after-skill-3.png', 'after-skill-ultimate.png'];

  function replaceSkillSourceFile(source, fileName) {
    if (!source) return '';
    if (/\/前\.png$/.test(source)) return source.replace(/\/前\.png$/, `/${fileName}`);
    return source.replace(/\/(?:skill-passive|skill-1|skill-2|skill-3|skill-ultimate)\.png$/, `/${fileName}`);
  }

  function replaceAfterSkillSourceFile(source, fileName) {
    if (!source) return '';
    if (/\/后\.png$/.test(source)) return source.replace(/\/后\.png$/, `/${fileName}`);
    return source.replace(/\/after-skill-(?:passive|1|2|3|ultimate)\.png$/, `/${fileName}`);
  }

  PET_CATALOG.forEach(pet => {
    const copy = ROLE_SKILL_COPY[pet.id] || [];
    const sourceBefore = pet.skillAssets?.before || '';
    const sourceAfter = pet.skillAssets?.after || '';
    const existingSkills = Array.isArray(pet.skills) ? pet.skills : [];
    const defaultSkillThemes = [
      ['被动', `${pet.name}天赋`, `${pet.name}的专属被动天赋。`],
      ['技能 1', `${pet.name}技能一`, `${pet.name}的第一项专属技能。`],
      ['技能 2', `${pet.name}技能二`, `${pet.name}的第二项专属技能。`],
      ['技能 3', `${pet.name}技能三`, `${pet.name}的第三项专属技能。`],
      ['大招', `${pet.name}终极技能`, `${pet.name}的终极专属技能。`]
    ];
    pet.skills = SKILL_IMAGE_FILES.map((fileName, index) => {
      const existing = existingSkills[index] || {};
      const theme = copy[index] || defaultSkillThemes[index];
      const beforeImage = replaceSkillSourceFile(sourceBefore, fileName) || existing.beforeImage || existing.image || '';
      const afterImage = replaceAfterSkillSourceFile(sourceAfter, AFTER_SKILL_IMAGE_FILES[index]) || existing.afterImage || '';
      return {
        ...existing,
        id: existing.id || ['passive', 'skill-1', 'skill-2', 'skill-3', 'ultimate'][index],
        type: existing.type || theme[0],
        name: existing.name || theme[1],
        explanation: existing.explanation || theme[2],
        beforeImage,
        afterImage,
        image: beforeImage
      };
    });
  });

  const INITIAL_PETS = PET_CATALOG.filter(pet => pet.rarity === 'A');

  // 题库先放示范资料。之后可以搬到 data/question-bank.json 或 Google Sheet。
  const QUESTION_BANK = {
    华文: [
      { id: 'cn-001', text: '“快乐”的反义词是什么？', options: ['伤心', '漂亮', '热闹', '勇敢'], answer: '伤心' },
      { id: 'cn-002', text: '小鸟在树上____地唱歌。', options: ['慢慢', '欢快', '安静', '困难'], answer: '欢快' },
      { id: 'cn-003', text: '“五颜六色”最适合形容什么？', options: ['颜色很多', '声音很大', '速度很快', '天气很冷'], answer: '颜色很多' },
      { id: 'cn-004', text: '下面哪一个是表示动作的词？', options: ['跑步', '书包', '蓝色', '学校'], answer: '跑步' },
      { id: 'cn-005', text: '我们应该怎样爱护图书？', options: ['撕破它', '保持整洁', '乱画它', '随意丢弃'], answer: '保持整洁' }
    ],
    马来文: [
      { id: 'bm-001', text: 'Apakah lawan bagi perkataan “besar”?', options: ['kecil', 'panjang', 'tinggi', 'cantik'], answer: 'kecil' },
      { id: 'bm-002', text: 'Ali ____ bola di padang.', options: ['makan', 'membaca', 'bermain', 'tidur'], answer: 'bermain' },
      { id: 'bm-003', text: '“Merah” ialah kata _____.', options: ['nama', 'warna', 'kerja', 'bilangan'], answer: 'warna' },
      { id: 'bm-004', text: 'Kita mesti menjaga _____ sekolah.', options: ['kebersihan', 'lari', 'minum', 'buku'], answer: 'kebersihan' },
      { id: 'bm-005', text: 'Apakah maksud “terima kasih”?', options: ['thank you', 'good morning', 'sorry', 'goodbye'], answer: 'thank you' }
    ],
    英文: [
      { id: 'en-001', text: 'I ____ a student.', options: ['am', 'is', 'are', 'be'], answer: 'am' },
      { id: 'en-002', text: 'The cat is ____ the table.', options: ['in', 'on', 'at', 'to'], answer: 'on' },
      { id: 'en-003', text: 'Which word means the opposite of “hot”?', options: ['warm', 'cold', 'big', 'fast'], answer: 'cold' },
      { id: 'en-004', text: 'She ____ to school every day.', options: ['go', 'going', 'goes', 'gone'], answer: 'goes' },
      { id: 'en-005', text: 'Choose the noun.', options: ['beautiful', 'quickly', 'school', 'run'], answer: 'school' }
    ],
    数学: [
      { id: 'math-001', text: '8 + 7 = ?', options: ['13', '14', '15', '16'], answer: '15' },
      { id: 'math-002', text: '20 - 6 = ?', options: ['12', '13', '14', '15'], answer: '14' },
      { id: 'math-003', text: '5 × 3 = ?', options: ['8', '15', '18', '20'], answer: '15' },
      { id: 'math-004', text: '一个星期有几天？', options: ['5', '6', '7', '8'], answer: '7' },
      { id: 'math-005', text: '哪个数最大？', options: ['29', '92', '39', '49'], answer: '92' }
    ],
    科学: [
      { id: 'sci-001', text: '植物制造食物需要什么？', options: ['阳光', '玩具', '铅笔', '鞋子'], answer: '阳光' },
      { id: 'sci-002', text: '下列哪一种是固体？', options: ['水', '空气', '石头', '果汁'], answer: '石头' },
      { id: 'sci-003', text: '我们用什么器官看东西？', options: ['耳朵', '眼睛', '鼻子', '手'], answer: '眼睛' },
      { id: 'sci-004', text: '太阳从哪一个方向升起？', options: ['东', '南', '西', '北'], answer: '东' },
      { id: 'sci-005', text: '水结冰后会变成什么？', options: ['蒸气', '冰', '泥土', '烟'], answer: '冰' }
    ]
  };

  const EQUIPMENT_CATALOG = window.EQUIPMENT_CATALOG_DATA || [];

  const SUBJECT_META = {
    华文: { icon: '🀄', hint: '阅读、词语和句子' },
    马来文: { icon: '🇲🇾', hint: 'Bahasa Melayu' },
    英文: { icon: '🔤', hint: 'Words and grammar' },
    数学: { icon: '➗', hint: '数字与计算' },
    科学: { icon: '🔬', hint: '发现身边的科学' }
  };

  const DEFAULT_MUSIC_TRACK_ID = 'cy-pets-theme';
  const MUSIC_BOX_TRACK_PRICE = 280;
  const MUSIC_BOX_PREVIEW_MS = 30000;
  const SHARE_BRAND_LOGO_SRC = 'assets/brand/center-logo.png';
  const ROLE_SHARE_STORY_WIDTH = 1080;
  const ROLE_SHARE_STORY_HEIGHT = 1920;
  const ROLE_SHARE_FRAMES = Object.freeze([
    {
      id: 'heroic',
      label: '帅气版',
      labelEn: 'Heroic',
      description: '水晶、闪电和银蓝战斗感。',
      descriptionEn: 'Crystal, lightning and silver-blue battle energy.',
      src: 'assets/share-frames/role-frame-heroic.png',
      powerSrc: 'assets/share-frames/power-frame-heroic.png'
    },
    {
      id: 'cute',
      label: '可爱版',
      labelEn: 'Cute',
      description: '蝴蝶结、星星和糖果色梦幻感。',
      descriptionEn: 'Ribbons, stars and dreamy candy colors.',
      src: 'assets/share-frames/role-frame-cute.png',
      powerSrc: 'assets/share-frames/power-frame-cute.png'
    }
  ]);
  const MUSIC_PLAYBACK_MODE_SINGLE = 'single';
  const MUSIC_PLAYBACK_MODE_SHUFFLE = 'shuffle';
  const MUSIC_PLAYBACK_MODE_SERIES = 'series';
  const MUSIC_PLAYBACK_MODES = Object.freeze([
    MUSIC_PLAYBACK_MODE_SINGLE,
    MUSIC_PLAYBACK_MODE_SHUFFLE,
    MUSIC_PLAYBACK_MODE_SERIES
  ]);
  const MUSIC_PLAYBACK_MODE_META = Object.freeze({
    [MUSIC_PLAYBACK_MODE_SINGLE]: { icon: '↻', label: '单曲循环' },
    [MUSIC_PLAYBACK_MODE_SHUFFLE]: { icon: '⇄', label: '随机播放' },
    [MUSIC_PLAYBACK_MODE_SERIES]: { icon: '◎', label: '专辑循环' }
  });
  const MUSIC_SERIES_ORDER = ['Default', 'Marvel', 'AOT', 'Demon Slayer', 'One Piece', 'Overlord', 'Minecraft', 'Pokemon', 'Sanrio', 'Popmart', 'BLACKPINK', 'BIGBANG', 'BTS', 'CORTIS', 'IVE', 'SEVENTEEN', 'Stray Kids', 'TREASURE', 'TWICE', 'Hachimi', 'Minion', 'Bit Pets'];
  const MUSIC_SERIES_ACCENTS = Object.freeze({
    Default: '#6f67f1',
    Marvel: '#cf2634',
    AOT: '#8f4c32',
    'Demon Slayer': '#27a86c',
    'One Piece': '#2f8ed8',
    Overlord: '#7a4bd8',
    Minecraft: '#4e9f64',
    Pokemon: '#3b82f6',
    Sanrio: '#ff91c8',
    Popmart: '#c77dd8',
    BLACKPINK: '#ff5a9f',
    BIGBANG: '#d8a83a',
    BTS: '#7c4dff',
    CORTIS: '#00a7c8',
    IVE: '#4776e6',
    SEVENTEEN: '#32a867',
    'Stray Kids': '#2f3348',
    TREASURE: '#1f78d1',
    TWICE: '#ff83b6',
    Hachimi: '#d69d3f',
    Minion: '#ffd14a',
    'Bit Pets': '#49bea7'
  });
  const MUSIC_BOX_TRACKS = [
    { id: DEFAULT_MUSIC_TRACK_ID, title: '5+1 学习乐园主题曲', series: 'Default', src: 'assets/bgm.mp3', accent: '#6f67f1', defaultOwned: true },
    { id: 'marvel-the-avengers', title: 'The Avengers', series: 'Marvel', src: 'assets/music-box/marvel/the-avengers-from-32s.mp3', accent: '#cf2634' },
    { id: 'marvel-sunflower-spider-verse', title: 'Sunflower', series: 'Marvel', src: 'assets/music-box/marvel/sunflower-spider-verse.mp3', accent: '#f6b135' },
    { id: 'aot-akuma-no-ko', title: 'Akuma no Ko', series: 'AOT', src: 'assets/music-box/aot/akuma-no-ko.mp3', accent: '#8f4c32' },
    { id: 'aot-call-of-silence', title: 'Call of Silence', series: 'AOT', src: 'assets/music-box/aot/call-of-silence.mp3', accent: '#8f4c32' },
    { id: 'aot-shinzou-wo-sasageyo', title: 'Shinzou wo Sasageyo', series: 'AOT', src: 'assets/music-box/aot/shinzou-wo-sasageyo.mp3', accent: '#8f4c32' },
    { id: 'demon-slayer-gurenge', title: 'Gurenge', series: 'Demon Slayer', src: 'assets/music-box/demon-slayer/gurenge.mp3', accent: '#27a86c' },
    { id: 'demon-slayer-homura', title: 'Homura', series: 'Demon Slayer', src: 'assets/music-box/demon-slayer/homura.mp3', accent: '#27a86c' },
    { id: 'demon-slayer-infinity-castle-theme', title: 'Infinity Castle Theme', series: 'Demon Slayer', src: 'assets/music-box/demon-slayer/infinity-castle-theme.mp3', accent: '#27a86c' },
    { id: 'demon-slayer-kamado-tanjiro-no-uta', title: 'Kamado Tanjiro no Uta', series: 'Demon Slayer', src: 'assets/music-box/demon-slayer/kamado-tanjiro-no-uta.mp3', accent: '#27a86c' },
    { id: 'one-piece-we-are', title: 'We Are!', series: 'One Piece', src: 'assets/music-box/one-piece/we-are.mp3', startAt: 30, accent: '#2f8ed8' },
    { id: 'one-piece-very-very-very-strongest', title: 'The Very Very Very Strongest', series: 'One Piece', src: 'assets/music-box/one-piece/very-very-very-strongest.mp3', accent: '#2f8ed8' },
    { id: 'overlord-hollow-hunger', title: 'HOLLOW HUNGER', series: 'Overlord', src: 'assets/music-box/overlord/hollow-hunger.mp3', accent: '#7a4bd8' },
    { id: 'overlord-clattanoia', title: 'Clattanoia', series: 'Overlord', src: 'assets/music-box/overlord/clattanoia.mp3', accent: '#7a4bd8' },
    { id: 'popmart-song', title: 'POP MART Song', series: 'Popmart', src: 'assets/music-box/popmart/pop-mart-song.mp3', accent: '#ff85b7' },
    { id: 'labubu-summer-pop', title: 'Labubu Summer Pop', series: 'Popmart', src: 'assets/music-box/popmart/labubu-summer-pop.mp3', accent: '#c18a4c' },
    { id: 'pokemon-gym-leader', title: 'Gym Leader Battle', series: 'Pokemon', src: 'assets/music-box/pokemon/gym-leader-battle.mp3', accent: '#4fa8ff' },
    { id: 'pokemon-zinnia', title: 'Zinnia Battle', series: 'Pokemon', src: 'assets/music-box/pokemon/zinnia-battle.mp3', accent: '#5e8cf2' },
    { id: 'sanrio-chu-chu', title: 'CHU CHU', series: 'Sanrio', src: 'assets/music-box/sanrio/chu-chu.mp3', accent: '#ff91c8' },
    { id: 'cinnamoroll-kawaii', title: 'KAWAII FESTIVAL', series: 'Sanrio', src: 'assets/music-box/sanrio/kawaii-festival-cinnamoroll.mp3', accent: '#7bcfff' },
    { id: 'kuromi-greedy', title: 'Greedy Greedy', series: 'Sanrio', src: 'assets/music-box/sanrio/kuromi-greedy-greedy.mp3', accent: '#8a61d6' },
    { id: 'minecraft-sweden', title: 'Sweden', series: 'Minecraft', src: 'assets/music-box/minecraft/sweden.mp3', accent: '#7bb971' },
    { id: 'minecraft-aria-math', title: 'Aria Math', series: 'Minecraft', src: 'assets/music-box/minecraft/aria-math.mp3', accent: '#6db7b8' },
    { id: 'minecraft-subwoofer-lullaby', title: 'Subwoofer Lullaby', series: 'Minecraft', src: 'assets/music-box/minecraft/subwoofer-lullaby.mp3', accent: '#b9a77f' },
    { id: 'blackpink-how-you-like-that', title: 'How You Like That', series: 'BLACKPINK', src: 'assets/music-box/blackpink/how-you-like-that.mp3', accent: '#ff5a9f' },
    { id: 'blackpink-kill-this-love', title: 'Kill This Love', series: 'BLACKPINK', src: 'assets/music-box/blackpink/kill-this-love.mp3', accent: '#e4436d' },
    { id: 'blackpink-ddu-du-ddu-du', title: 'DDU-DU DDU-DU', series: 'BLACKPINK', src: 'assets/music-box/blackpink/ddu-du-ddu-du.mp3', accent: '#15151f' },
    { id: 'bigbang-fantastic-baby', title: 'Fantastic Baby', series: 'BIGBANG', src: 'assets/music-box/bigbang/fantastic-baby.mp3', accent: '#d8a83a' },
    { id: 'bigbang-blue', title: 'BLUE', series: 'BIGBANG', src: 'assets/music-box/bigbang/blue.mp3', startAt: 8, accent: '#d8a83a' },
    { id: 'bigbang-lets-not-fall-in-love', title: "Let's Not Fall In Love", series: 'BIGBANG', src: 'assets/music-box/bigbang/lets-not-fall-in-love.mp3', accent: '#d8a83a' },
    { id: 'bigbang-bang-bang-bang', title: 'BANG BANG BANG', series: 'BIGBANG', src: 'assets/music-box/bigbang/bang-bang-bang.mp3', accent: '#d8a83a' },
    { id: 'bigbang-haru-haru', title: 'Haru Haru', series: 'BIGBANG', src: 'assets/music-box/bigbang/haru-haru.mp3', accent: '#d8a83a' },
    { id: 'bts-butter', title: 'Butter', series: 'BTS', src: 'assets/music-box/bts/butter.mp3', accent: '#f5c84b' },
    { id: 'bts-dynamite', title: 'Dynamite', series: 'BTS', src: 'assets/music-box/bts/dynamite.mp3', accent: '#f08a47' },
    { id: 'bts-boy-with-luv', title: 'Boy With Luv', series: 'BTS', src: 'assets/music-box/bts/boy-with-luv.mp3', accent: '#ee79bd' },
    { id: 'cortis-fashion', title: 'FaSHioN', series: 'CORTIS', src: 'assets/music-box/cortis/fashion.mp3', accent: '#00a7c8' },
    { id: 'cortis-go', title: 'GO!', series: 'CORTIS', src: 'assets/music-box/cortis/go.mp3', accent: '#00a7c8' },
    { id: 'cortis-redred', title: 'REDRED', series: 'CORTIS', src: 'assets/music-box/cortis/redred.mp3', accent: '#00a7c8' },
    { id: 'cortis-what-you-want', title: 'What You Want', series: 'CORTIS', src: 'assets/music-box/cortis/what-you-want.mp3', accent: '#00a7c8' },
    { id: 'ive-love-dive', title: 'LOVE DIVE', series: 'IVE', src: 'assets/music-box/ive/love-dive.mp3', accent: '#3b6eea' },
    { id: 'ive-after-like', title: 'After LIKE', series: 'IVE', src: 'assets/music-box/ive/after-like.mp3', accent: '#ff7b54' },
    { id: 'seventeen-super', title: 'Super', series: 'SEVENTEEN', src: 'assets/music-box/seventeen/super.mp3', accent: '#47a46b' },
    { id: 'seventeen-hot', title: 'HOT', series: 'SEVENTEEN', src: 'assets/music-box/seventeen/hot.mp3', accent: '#eb6134' },
    { id: 'seventeen-very-nice', title: 'VERY NICE', series: 'SEVENTEEN', src: 'assets/music-box/seventeen/very-nice.mp3', accent: '#ff4f80' },
    { id: 'stray-kids-maniac', title: 'MANIAC', series: 'Stray Kids', src: 'assets/music-box/stray-kids/maniac.mp3', accent: '#894fe8' },
    { id: 'stray-kids-s-class', title: 'S-Class', series: 'Stray Kids', src: 'assets/music-box/stray-kids/s-class.mp3', accent: '#2b6df0' },
    { id: 'stray-kids-gods-menu', title: 'Gods Menu', series: 'Stray Kids', src: 'assets/music-box/stray-kids/gods-menu.mp3', accent: '#242836' },
    { id: 'treasure-boy', title: 'BOY', series: 'TREASURE', src: 'assets/music-box/treasure/boy.mp3', accent: '#1f78d1' },
    { id: 'treasure-going-crazy', title: 'GOING CRAZY', series: 'TREASURE', src: 'assets/music-box/treasure/going-crazy.mp3', accent: '#1f78d1' },
    { id: 'treasure-i-love-you', title: 'I LOVE YOU', series: 'TREASURE', src: 'assets/music-box/treasure/i-love-you.mp3', accent: '#1f78d1' },
    { id: 'treasure-jikjin', title: 'JIKJIN', series: 'TREASURE', src: 'assets/music-box/treasure/jikjin.mp3', accent: '#1f78d1' },
    { id: 'twice-cheer-up', title: 'CHEER UP', series: 'TWICE', src: 'assets/music-box/twice/cheer-up.mp3', accent: '#ff83b6' },
    { id: 'twice-fancy', title: 'FANCY', series: 'TWICE', src: 'assets/music-box/twice/fancy.mp3', accent: '#ad6cf4' },
    { id: 'twice-tt', title: 'TT', series: 'TWICE', src: 'assets/music-box/twice/tt.mp3', accent: '#ff9ac7' },
    { id: 'hachimi-beauty-and-hachimi', title: 'Beauty and Hachimi', series: 'Hachimi', src: 'assets/music-box/hachimi/beauty-and-hachimi.mp3', accent: '#d69d3f' },
    { id: 'hachimi-call-of-silence', title: 'Call of Silence 哈基米版', series: 'Hachimi', src: 'assets/music-box/hachimi/call-of-silence-hachimi.mp3', accent: '#7e87d9' },
    { id: 'hachimi-wake-up', title: '哈基米起床', series: 'Hachimi', src: 'assets/music-box/hachimi/hachimi-wake-up.mp3', accent: '#4dbb93' },
    { id: 'hachimi-da-huo-ji', title: '打火基', series: 'Hachimi', src: 'assets/music-box/hachimi/da-huo-ji.mp3', accent: '#ef8645' },
    { id: 'hachimi-daily-hachimi', title: '每日一哈', series: 'Hachimi', src: 'assets/music-box/hachimi/daily-hachimi.mp3', accent: '#46a6c9' }
  ];

  const STORAGE_KEY = 'five-plus-one-pets-story-v1';
  const SESSION_KEY = 'holiday-checkin-session-v1';
  const WALL_STORAGE_KEY = 'holiday-checkin-wall-v1';
  const TEACHER_REWARD_NOTICE_STORAGE_KEY = 'holiday-teacher-reward-notices-v1';
  let database = loadDatabase();
  let session = { studentId: null, activeView: DEFAULT_APP_VIEW, quiz: null, demoFree: false, teacherMode: false };
  let teacherState = { teacherId: 'T001', classId: '', classes: [], students: [], loading: false, returnStudentId: null, importRows: [], importErrors: [], importStatus: '' };
  const homeNameEditState = { field: '', value: '' };
  let messageWallPosts = loadLocalWallPosts();
  let messageWallLoaded = false;
  let wallLeaderboardStudents = [];
  let wallLeaderboardLoaded = false;
  let expandedWallCommentPostIds = new Set();
  const pendingWallActions = new Set();
  const dailyCheckinGuideDismissedKeys = new Set();
  const friendState = {
    loaded: false,
    loading: false,
    searchResults: [],
    friends: [],
    requests: [],
    notifications: [],
    activeFriendId: '',
    activeFriend: null,
    friendPreviewPetId: '',
    activeGiftType: 'coins',
    giftTargetId: '',
    giftAmount: FRIEND_GIFT_AMOUNTS[1],
    giftItemId: '',
    giftPetId: '',
    giftMusicTrackId: '',
    roomsLoaded: false,
    roomsLoading: false,
    rooms: [],
    membershipCount: 1,
    membershipLimit: 3,
    roomOwnerStudentId: '',
    roomLoading: false,
    room: null,
    roomSlots: [],
    roomMembers: [],
    roomDecorations: [],
    roomMessages: [],
    roomRequests: [],
    roomMessageDraft: '',
    roomNameDraft: '',
    roomNameDraftDirty: false
  };
  const interactionRoomState = {
    lobbyMode: 'menu',
    roomsLoaded: false,
    roomsLoading: false,
    roomsRecovering: false,
    roomsError: '',
    roomsLastLoadedAt: 0,
    rooms: [],
    activeRoomId: '',
    room: null,
    players: [],
    creating: false,
    joiningRoomId: '',
    joiningFriendId: '',
    roomNameDraft: '',
    mapSetDraft: KUROMI_ROOM_DEMO.defaultMapSetId,
    usePassword: false,
    passwordDraft: '',
    joinPasswordDrafts: {},
    chatDraft: '',
    chatOpen: false,
    emojiOpen: false,
    heartbeatTimer: null,
    lobbyRefreshTimer: null,
    remoteRenderPlayers: new Map(),
    lastHeartbeatAt: 0,
    lastHeartbeatOkAt: 0,
    lastHeartbeatPayload: '',
    heartbeatFailureCount: 0,
    heartbeatInFlight: false
  };
  const miniGameState = {
    overlayOpen: false,
    embeddedOpen: false,
    mode: 'picker',
    type: '',
    canvas: null,
    ctx: null,
    animationFrame: null,
    lastFrame: null,
    lastDrawTime: null,
    headImage: null,
    headSrc: '',
    headPetId: '',
    spriteImages: null,
    spritePetId: '',
    challenge: null,
    result: null,
    reaction: null,
    flappy: null,
    runner: null,
    jumpCharge: null,
    jumpChargeAssets: null
  };
  const interactionRoomSpriteCache = new Map();
  let giftRevealState = null;
  const giftRevealQueue = [];
  const promptedGiftNotificationKeys = new Set();
  const promptedPetNamingKeys = new Set();
  let evolutionCinematicPrimeScheduled = false;
  let evolutionCinematicPrimeStarted = false;
  let friendAttentionSeenKey = '';
  let shareInProgress = false;
  let shareBrandLogoImagePromise = null;
  const roleShareFrameImagePromises = new Map();
  const roleSharePowerFrameImagePromises = new Map();
  let selectedWallPostPreset = WALL_POST_PRESETS[0];
  let activeWallLeaderboard = 'power';
  let musicPreviewAudio = null;
  let musicPreviewTimer = null;
  let musicPreviewSuppressBackground = false;
  let musicPlayerPausedManually = false;
  let lastBackgroundMusicStudentId = '';
  let musicBoxCloudRefreshToken = 0;
  let pendingInitialPet = '';
  let pendingPetMode = 'initial';
  let pendingEvolutionStylePreference = '';
  let pendingRegisteredStudentId = '';
  let newPlayerGuideState = {
    active: false,
    queued: false,
    index: 0,
    studentId: '',
    mode: 'new-player',
    preview: false,
    timer: null,
    typingTimer: null,
    spotlightFrame: null,
    typing: false,
    fullCopy: ''
  };
  let toastTimer = null;
  let powerFeedbackTimer = null;
  let audioContext = null;
  const backgroundMusic = document.getElementById('background-music');
  let evolutionVideoActive = false;
  let evolutionPausedBackgroundMusic = false;
  let renderedCombatState = { studentId: null, stats: null, power: null };
  let currentLanguage = loadLanguagePreference();
  let languageObserver = null;
  let languageApplying = false;
  let languageApplyQueued = false;
  let petInteractionTimer = null;
  let roomAutoRefreshTimer = null;
  let kuromiRoomDemoState = null;
  let kuromiRoomInputBound = false;
  let miniGameInputBound = false;
  let kuromiRoomNativeFullscreenActive = false;
  let miniGameNativeFullscreenActive = false;
  let petInteractionEnabled = true;
  let petInteractionTapCount = 0;
  let studentSaveQueue = Promise.resolve();
  let equipmentActionLocked = false;
  let equipmentActionQueue = Promise.resolve();
  let petFoodDragState = null;
  let avatarCropState = null;
  let selectedPetFoodId = '';
  let ignoreNextPetFoodClick = false;
  let pendingFurnitureItemId = '';
  let selectedShopSlot = (window.EQUIPMENT_SLOTS && window.EQUIPMENT_SLOTS[0]?.id) || 'weapon';
  let selectedPetSeries = 'all';
  let ownedPetCollectionOpen = false;
  let activeImageViewerShare = null;
  const imageViewerObjectUrls = new Set();
  let evolutionVideoAttempt = 0;

  function getMusicTrackById(trackId) {
    return MUSIC_BOX_TRACKS.find(track => track.id === trackId) || null;
  }

  function getMusicTrackStartTime(track) {
    return Math.max(0, Number(track?.startAt || track?.startTime || 0) || 0);
  }

  function applyMusicTrackStartTime(audio, track) {
    const startAt = getMusicTrackStartTime(track);
    if (!audio || !startAt) return;
    const applyStart = () => {
      try {
        if (Math.abs(Number(audio.currentTime || 0) - startAt) > 0.4) audio.currentTime = startAt;
      } catch (error) {
        console.info('Music start time skipped.', error);
      }
    };
    if (audio.readyState >= 1) applyStart();
    else audio.addEventListener('loadedmetadata', applyStart, { once: true });
  }

  function getMusicSeriesRank(series) {
    const index = MUSIC_SERIES_ORDER.indexOf(String(series || ''));
    return index >= 0 ? index : MUSIC_SERIES_ORDER.length;
  }

  function getMusicSeriesAccent(series) {
    return MUSIC_SERIES_ACCENTS[String(series || '')] || '';
  }

  function getMusicTrackAccent(track = {}) {
    return getMusicSeriesAccent(track.series) || String(track.accent || '#6f67f1');
  }

  function normalizeMusicPlaybackMode(mode) {
    const normalized = String(mode || '').trim();
    return MUSIC_PLAYBACK_MODES.includes(normalized) ? normalized : MUSIC_PLAYBACK_MODE_SINGLE;
  }

  function getMusicPlaybackMode(student = getStudent()) {
    if (!student) return MUSIC_PLAYBACK_MODE_SINGLE;
    student.musicPlaybackMode = normalizeMusicPlaybackMode(student.musicPlaybackMode || student.musicPlaybackModeId || student.music_playback_mode);
    return student.musicPlaybackMode;
  }

  function getSortedMusicTracks() {
    return [...MUSIC_BOX_TRACKS].sort((a, b) => getMusicSeriesRank(a.series) - getMusicSeriesRank(b.series) || a.title.localeCompare(b.title, 'en'));
  }

  function getOwnedMusicTrackObjects(student) {
    const owned = new Set(getOwnedMusicTracks(student));
    return getSortedMusicTracks().filter(track => owned.has(track.id));
  }

  function getNextMusicTrackForPlayback(student, options = {}) {
    const tracks = getOwnedMusicTrackObjects(student);
    if (!tracks.length) return getMusicTrackById(DEFAULT_MUSIC_TRACK_ID);
    const currentTrack = getActiveMusicTrack(student) || tracks[0];
    const mode = getMusicPlaybackMode(student);
    if (!options.manual && mode === MUSIC_PLAYBACK_MODE_SINGLE) return currentTrack;
    if (mode === MUSIC_PLAYBACK_MODE_SHUFFLE) {
      const candidates = tracks.length > 1 ? tracks.filter(track => track.id !== currentTrack.id) : tracks;
      return candidates[Math.floor(Math.random() * candidates.length)] || currentTrack;
    }
    const pool = mode === MUSIC_PLAYBACK_MODE_SERIES
      ? tracks.filter(track => track.series === currentTrack.series)
      : tracks;
    const safePool = pool.length ? pool : tracks;
    const currentIndex = safePool.findIndex(track => track.id === currentTrack.id);
    return safePool[(Math.max(0, currentIndex) + 1) % safePool.length] || currentTrack;
  }

  function normalizeMusicTrackIds(value, fallback = []) {
    const parsed = parseMaybeJson(value, value);
    const source = Array.isArray(parsed)
      ? parsed
      : (typeof parsed === 'string' ? parsed.split(/[,\s]+/) : fallback);
    const ids = source
      .map(id => String(id || '').trim())
      .filter(id => id && getMusicTrackById(id));
    if (!ids.includes(DEFAULT_MUSIC_TRACK_ID)) ids.unshift(DEFAULT_MUSIC_TRACK_ID);
    return Array.from(new Set(ids));
  }

  function normalizeStudentMusicState(student) {
    if (!student) return [DEFAULT_MUSIC_TRACK_ID];
    const owned = normalizeMusicTrackIds(
      student.ownedMusicTracks ?? student.ownedMusicTrackIds ?? student.owned_music_tracks,
      [DEFAULT_MUSIC_TRACK_ID]
    );
    const activeCandidate = String(student.activeMusicTrack || student.activeMusicTrackId || student.active_music_track || '').trim();
    student.ownedMusicTracks = owned;
    student.activeMusicTrack = getMusicTrackById(activeCandidate) && owned.includes(activeCandidate)
      ? activeCandidate
      : DEFAULT_MUSIC_TRACK_ID;
    getMusicPlaybackMode(student);
    return owned;
  }

  function getOwnedMusicTracks(student) {
    if (!student) return [DEFAULT_MUSIC_TRACK_ID];
    return normalizeStudentMusicState(student);
  }

  function getActiveMusicTrack(student = getStudent()) {
    const owned = getOwnedMusicTracks(student);
    const activeId = getMusicTrackById(student?.activeMusicTrack) ? student.activeMusicTrack : DEFAULT_MUSIC_TRACK_ID;
    if (student && !owned.includes(activeId)) student.activeMusicTrack = DEFAULT_MUSIC_TRACK_ID;
    return getMusicTrackById(student?.activeMusicTrack || activeId) || getMusicTrackById(DEFAULT_MUSIC_TRACK_ID);
  }

  function getBackgroundMusicStudent() {
    const currentStudent = getStudent();
    if (currentStudent) {
      lastBackgroundMusicStudentId = HolidayBackendClient.normalizeId(currentStudent.studentId || currentStudent.id);
      return currentStudent;
    }
    const returnStudentId = HolidayBackendClient.normalizeId(teacherState.returnStudentId || lastBackgroundMusicStudentId);
    return returnStudentId && database[returnStudentId] ? database[returnStudentId] : null;
  }

  function applyActiveBackgroundMusic(student = getBackgroundMusicStudent()) {
    if (!backgroundMusic) return;
    const track = getActiveMusicTrack(student);
    if (!track) return;
    backgroundMusic.loop = getMusicPlaybackMode(student) === MUSIC_PLAYBACK_MODE_SINGLE && !getMusicTrackStartTime(track);
    const nextSrc = withAssetVersion(track.src);
    if (backgroundMusic.dataset.trackId === track.id && backgroundMusic.getAttribute('src') === nextSrc) {
      if (backgroundMusic.ended) applyMusicTrackStartTime(backgroundMusic, track);
      updateMusicPlayerPlaybackUi();
      return;
    }
    const wasPlaying = !backgroundMusic.paused && !backgroundMusic.ended;
    backgroundMusic.dataset.trackId = track.id;
    backgroundMusic.setAttribute('src', nextSrc);
    backgroundMusic.load();
    applyMusicTrackStartTime(backgroundMusic, track);
    backgroundMusic.volume = 0.42;
    if ((wasPlaying || !document.hidden) && !musicPlayerPausedManually) {
      const promise = backgroundMusic.play();
      if (promise && typeof promise.catch === 'function') promise.catch(() => updateMusicPlayerPlaybackUi());
    }
    updateMusicPlayerPlaybackUi();
  }

  function stopMusicPreview({ resume = true } = {}) {
    if (musicPreviewTimer) clearTimeout(musicPreviewTimer);
    musicPreviewTimer = null;
    if (musicPreviewAudio) {
      musicPreviewAudio.pause();
      musicPreviewAudio.src = '';
      musicPreviewAudio = null;
    }
    $all('[data-music-preview]').forEach(button => {
      if (button.dataset.previewing === 'true') {
        button.dataset.previewing = 'false';
        button.textContent = localize('试听 30 秒');
      }
    });
    musicPreviewSuppressBackground = false;
    updateMusicPlayerPlaybackUi();
    if (resume) tryStartBackgroundMusic();
  }

  function previewMusicTrack(trackId, button = null) {
    const track = getMusicTrackById(trackId);
    if (!track) return false;
    const alreadyPreviewing = button?.dataset.previewing === 'true';
    stopMusicPreview({ resume: false });
    if (alreadyPreviewing) {
      tryStartBackgroundMusic();
      return true;
    }
    musicPreviewSuppressBackground = true;
    if (backgroundMusic && !backgroundMusic.paused) backgroundMusic.pause();
    updateMusicPlayerPlaybackUi();
    musicPreviewAudio = new Audio(withAssetVersion(track.src));
    musicPreviewAudio.volume = 0.58;
    musicPreviewAudio.preload = 'auto';
    applyMusicTrackStartTime(musicPreviewAudio, track);
    if (button) {
      button.dataset.previewing = 'true';
      button.textContent = localize('停止试听');
    }
    const done = () => stopMusicPreview({ resume: true });
    musicPreviewAudio.addEventListener('ended', done, { once: true });
    musicPreviewTimer = setTimeout(done, MUSIC_BOX_PREVIEW_MS);
    const promise = musicPreviewAudio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {
        stopMusicPreview({ resume: true });
        showToast('浏览器阻止了试听，请再点一次。');
      });
    }
    return true;
  }

  async function buyMusicTrack(trackId) {
    const triggerButton = buyMusicTrack.triggerButton || arguments[1] || null;
    const student = getStudent();
    const track = getMusicTrackById(trackId);
    if (!student || !track) return false;
    const owned = getOwnedMusicTracks(student);
    if (owned.includes(track.id)) return equipMusicTrack(track.id);
    if (Number(student.coins || 0) < MUSIC_BOX_TRACK_PRICE) {
      showButtonInlineError(triggerButton, '金币不足');
      return false;
    }
    const snapshot = cloneStudentState(student);
    student.coins = Math.max(0, Number(student.coins || 0) - MUSIC_BOX_TRACK_PRICE);
    student.ownedMusicTracks = [...owned, track.id];
    student.activeMusicTrack = track.id;
    musicPlayerPausedManually = false;
    return commitStudentState(student, snapshot, { type: 'buyMusicTrack', trackId: track.id }, () => {
      stopMusicPreview({ resume: false });
      applyActiveBackgroundMusic(student);
      renderAppShell();
      renderMusicBox(student);
      showToast(`已解锁并切换：${track.title}`);
    });
  }

  async function equipMusicTrack(trackId) {
    const student = getStudent();
    const track = getMusicTrackById(trackId);
    if (!student || !track) return false;
    if (!getOwnedMusicTracks(student).includes(track.id)) return buyMusicTrack(track.id);
    const snapshot = cloneStudentState(student);
    student.activeMusicTrack = track.id;
    musicPlayerPausedManually = false;
    return commitStudentState(student, snapshot, { type: 'equipMusicTrack', trackId: track.id }, () => {
      stopMusicPreview({ resume: false });
      applyActiveBackgroundMusic(student);
      renderMusicBox(student);
      showToast(`已切换主题曲：${track.title}`);
    });
  }

  async function refreshMusicBoxFromCloud() {
    const student = getStudent();
    if (!student || student.demoMode || !HolidayBackendClient.isSupabaseMode(APP_CONFIG)) return false;
    const refreshToken = ++musicBoxCloudRefreshToken;
    try {
      const result = await backend.requestSupabase('getStudent', {
        studentId: HolidayBackendClient.normalizeId(student.studentId),
        includeClasses: false
      });
      if (refreshToken !== musicBoxCloudRefreshToken || !result?.ok || !result.student) return false;
      const normalized = HolidayBackendClient.normalizeStudent(result.student, result.classes || student.classes || [], database[student.studentId]);
      database[student.studentId] = normalized;
      saveDatabase();
      applyActiveBackgroundMusic(normalized);
      renderAppShell();
      if (session.activeView === 'music-box-view') renderMusicBox(normalized);
      return true;
    } catch (error) {
      console.info('Music box cloud refresh skipped.', error);
      return false;
    }
  }

  function normalizeMiniGameScores(scores = {}) {
    const source = scores && typeof scores === 'object' && !Array.isArray(scores) ? scores : {};
    return {
      reaction: Math.max(0, Math.floor(Number(source.reaction || source.wheel || 0) || 0)),
      flappy: Math.max(0, Math.floor(Number(source.flappy || source.jump || 0) || 0)),
      runner: Math.max(0, Math.floor(Number(source.runner || source.run || 0) || 0)),
      jumpCharge: Math.max(0, Math.floor(Number(source.jumpCharge || source.jump_charge || source.wechatJump || source.wechat_jump || 0) || 0))
    };
  }

  function getStudentMiniGameScores(student = getStudent()) {
    if (!student) return normalizeMiniGameScores();
    student.miniGameHighScores = normalizeMiniGameScores(student.miniGameHighScores);
    return student.miniGameHighScores;
  }

  async function recordMiniGameScore(type, score) {
    const student = getStudent();
    const key = MINI_GAME_SCORE_KEYS.includes(type) ? type : '';
    const nextScore = Math.max(0, Math.floor(Number(score || 0)));
    if (!student || !key || nextScore <= 0) return false;
    const scores = getStudentMiniGameScores(student);
    if (nextScore <= Number(scores[key] || 0)) return false;
    const snapshot = cloneStudentState(student);
    const event = { type: 'miniGameHighScore', miniGame: key, score: nextScore };
    student.miniGameHighScores = { ...scores, [key]: nextScore };
    mergeWallLeaderboardStudent(student);
    saveDatabase();
    if (session.activeView === 'wall-view') renderWallLeaderboard(student);
    try {
      const result = await persistMiniGameHighScore(student, key, nextScore, event);
      if (!result.ok) throw new Error(result.error || '云端保存失败');
      if (result.student) {
        const normalized = HolidayBackendClient.normalizeStudent(result.student, result.classes || student.classes || [], database[student.studentId]);
        database[student.studentId] = normalized;
        mergeWallLeaderboardStudent(normalized);
        saveDatabase();
      }
      if (session.activeView === 'wall-view') renderWallLeaderboard(student);
      void loadWallLeaderboardStudents();
      showToast(`新纪录：${nextScore}！`);
      return true;
    } catch (error) {
      if (snapshot?.studentId) database[snapshot.studentId] = snapshot;
      mergeWallLeaderboardStudent(snapshot);
      saveDatabase();
      if (session.activeView === 'wall-view') renderWallLeaderboard(snapshot);
      showToast(`保存到云端失败，新纪录没有完成同步：${error.message || error}`);
      return false;
    }
  }

  function getMiniGameLeaderboardTop(type, roundScore = 0) {
    const key = MINI_GAME_SCORE_KEYS.includes(type) ? type : '';
    if (!key) return null;
    const entries = buildWallLeaderboardEntries(key, getStudent());
    const bestEntry = entries[0] || null;
    const student = getStudent();
    const safeRoundScore = Math.max(0, Math.floor(Number(roundScore || 0)));
    if (student && safeRoundScore > Number(bestEntry?.score || 0)) {
      return {
        name: getPlayerDisplayName(student) || student.studentId || localize('同学'),
        score: safeRoundScore
      };
    }
    return bestEntry ? { name: bestEntry.name || bestEntry.studentId || localize('同学'), score: Number(bestEntry.score || 0) } : null;
  }

  function getMiniGameResultStatus(type, roundScore = 0) {
    const key = MINI_GAME_SCORE_KEYS.includes(type) ? type : '';
    const safeRoundScore = Math.max(0, Math.floor(Number(roundScore || 0)));
    const student = getStudent();
    const scores = getStudentMiniGameScores(student);
    const personalBest = key ? Math.max(Number(scores[key] || 0), safeRoundScore) : safeRoundScore;
    const leaderboardTop = getMiniGameLeaderboardTop(key, safeRoundScore);
    if (currentLanguage === 'en') {
      return [
        `Round Score: ${safeRoundScore}`,
        `Personal Best: ${personalBest}`,
        `Leaderboard Best: ${leaderboardTop ? `${leaderboardTop.name} ${leaderboardTop.score}` : 'None'}`
      ].join('\n');
    }
    return [
      `当局分数：${safeRoundScore}`,
      `历史最高分：${personalBest}`,
      `排行榜最高分：${leaderboardTop ? `${leaderboardTop.name} ${leaderboardTop.score}` : '暂无'}`
    ].join('\n');
  }

  function finishMiniGameRound(type, score) {
    const safeScore = Math.max(0, Math.floor(Number(score || 0)));
    recordMiniGameScore(type, safeScore)
      .then(saved => {
        if (saved) setMiniGameStatus(getMiniGameResultStatus(type, safeScore));
      })
      .catch(error => console.info('Mini game high score sync skipped.', error));
    return getMiniGameResultStatus(type, safeScore);
  }

  function isBackgroundMusicPlaying() {
    return Boolean(backgroundMusic && !backgroundMusic.paused && !backgroundMusic.ended && !musicPreviewSuppressBackground && !evolutionVideoActive);
  }

  function updateMusicPlayerPlaybackUi() {
    const playing = isBackgroundMusicPlaying();
    const panel = $('#music-player-panel');
    if (panel) panel.classList.toggle('is-playing', playing);
    const toggleButton = $('[data-music-player-toggle]');
    if (!toggleButton) return;
    toggleButton.textContent = playing ? 'Ⅱ' : '▶';
    toggleButton.setAttribute('aria-label', localize(playing ? '暂停' : '播放'));
    toggleButton.title = localize(playing ? '暂停' : '播放');
  }

  function renderMusicPlayer(student = getStudent()) {
    const panel = $('#music-player-panel');
    if (!panel) return;
    const ownedTracks = getOwnedMusicTrackObjects(student);
    const activeTrack = getActiveMusicTrack(student) || getMusicTrackById(DEFAULT_MUSIC_TRACK_ID);
    const mode = getMusicPlaybackMode(student);
    const seriesTrackCount = ownedTracks.filter(track => track.series === activeTrack?.series).length || 1;
    const accent = getMusicTrackAccent(activeTrack);
    panel.style.setProperty('--track-accent', accent);
    panel.innerHTML = `<div class="music-player-art" aria-hidden="true">♪</div>
      <div class="music-player-copy">
        <span>${escapeHtml(localize('正在播放'))}</span>
        <h3>${escapeHtml(activeTrack?.title || localize('音乐盒'))}</h3>
        <p>${escapeHtml(activeTrack?.series || localize('音乐盒'))} · ${currentLanguage === 'en' ? `${ownedTracks.length} owned tracks` : `已拥有 ${ownedTracks.length} 首`} · ${currentLanguage === 'en' ? `${seriesTrackCount} in album` : `当前专辑 ${seriesTrackCount} 首`}</p>
      </div>
      <div class="music-player-controls" aria-label="${escapeHtml(localize('音乐播放器'))}">
        <button type="button" class="music-player-icon-button" data-music-player-toggle aria-label="${escapeHtml(localize('播放'))}" title="${escapeHtml(localize('播放'))}">▶</button>
        <button type="button" class="music-player-icon-button" data-music-player-next aria-label="${escapeHtml(localize('下一首'))}" title="${escapeHtml(localize('下一首'))}">⏭</button>
      </div>
      <div class="music-player-mode-group" aria-label="${escapeHtml(localize('播放模式'))}">
        ${MUSIC_PLAYBACK_MODES.map(playMode => {
          const meta = MUSIC_PLAYBACK_MODE_META[playMode];
          const active = playMode === mode;
          return `<button type="button" class="music-mode-button${active ? ' active' : ''}" data-music-play-mode="${escapeHtml(playMode)}" aria-pressed="${active}">
            <span aria-hidden="true">${escapeHtml(meta.icon)}</span>${escapeHtml(localize(meta.label))}
          </button>`;
        }).join('')}
      </div>`;
    updateMusicPlayerPlaybackUi();
  }

  function activateMusicTrackForPlayback(student, track, options = {}) {
    if (!student || !track) return false;
    student.activeMusicTrack = track.id;
    if (options.resume !== false) musicPlayerPausedManually = false;
    saveDatabase();
    applyActiveBackgroundMusic(student);
    if (session.activeView === 'music-box-view') renderMusicBox(student);
    else updateMusicPlayerPlaybackUi();
    return true;
  }

  function advanceBackgroundMusic(options = {}) {
    const student = getBackgroundMusicStudent();
    if (!student) return false;
    const nextTrack = getNextMusicTrackForPlayback(student, { manual: Boolean(options.manual) });
    return activateMusicTrackForPlayback(student, nextTrack, { resume: options.resume !== false });
  }

  function toggleMusicPlayerPlayback() {
    if (!backgroundMusic) return;
    stopMusicPreview({ resume: false });
    if (isBackgroundMusicPlaying()) {
      musicPlayerPausedManually = true;
      backgroundMusic.pause();
      updateMusicPlayerPlaybackUi();
      return;
    }
    musicPlayerPausedManually = false;
    tryStartBackgroundMusic();
    updateMusicPlayerPlaybackUi();
  }

  async function setMusicPlaybackMode(mode) {
    const student = getStudent();
    if (!student) return false;
    const normalized = normalizeMusicPlaybackMode(mode);
    if (getMusicPlaybackMode(student) === normalized) {
      renderMusicPlayer(student);
      return true;
    }
    const snapshot = cloneStudentState(student);
    student.musicPlaybackMode = normalized;
    if (backgroundMusic) backgroundMusic.loop = normalized === MUSIC_PLAYBACK_MODE_SINGLE && !getMusicTrackStartTime(getActiveMusicTrack(student));
    return commitStudentState(student, snapshot, { type: 'setMusicPlaybackMode', mode: normalized }, () => {
      renderMusicBox(student);
      const label = MUSIC_PLAYBACK_MODE_META[normalized]?.label || '单曲循环';
      showToast(`${localize('播放模式')}：${localize(label)}`);
    });
  }

  function renderMusicBox(student = getStudent()) {
    const grid = $('#music-box-grid');
    const ownedCount = $('#music-box-owned-count');
    if (!grid) return;
    const owned = new Set(getOwnedMusicTracks(student));
    const activeId = getActiveMusicTrack(student)?.id || DEFAULT_MUSIC_TRACK_ID;
    if (ownedCount) ownedCount.textContent = String(owned.size);
    renderMusicPlayer(student);
    const sortedTracks = getSortedMusicTracks();
    const groups = new Map();
    sortedTracks.forEach(track => {
      const series = track.series || 'Default';
      groups.set(series, [...(groups.get(series) || []), track]);
    });
    grid.innerHTML = Array.from(groups.entries()).map(([series, tracks]) => {
      const seriesAccent = getMusicSeriesAccent(series) || getMusicTrackAccent(tracks[0] || {});
      return `<section class="music-series-section" style="--track-accent:${escapeHtml(seriesAccent)}" aria-label="${escapeHtml(series)}">
      <div class="music-series-heading"><h3>${escapeHtml(series)}</h3><span>${tracks.length} ${currentLanguage === 'en' ? 'tracks' : '首歌'}</span></div>
      <div class="music-series-track-grid">${tracks.map(track => {
        const isOwned = owned.has(track.id);
        const isActive = activeId === track.id;
        const locked = !isOwned;
        const action = isActive
          ? `<button type="button" class="secondary-button" disabled>${escapeHtml(localize('使用中'))}</button>`
          : isOwned
            ? `<button type="button" class="primary-button" data-music-equip="${escapeHtml(track.id)}">${escapeHtml(localize('切换主题曲'))}</button>`
            : `<button type="button" class="primary-button" data-music-buy="${escapeHtml(track.id)}">${escapeHtml(`🪙 ${MUSIC_BOX_TRACK_PRICE} ${localize('购买')}`)}</button>`;
        const shareAction = isOwned
          ? `<button type="button" class="secondary-button" data-music-wall-share="${escapeHtml(track.id)}">${escapeHtml(localize('分享到留言墙'))}</button>`
          : '';
        return `<article class="music-track-card${isActive ? ' active' : ''}${locked ? ' locked' : ''}" style="--track-accent:${escapeHtml(getMusicTrackAccent(track))}">
          <div class="music-track-art" aria-hidden="true">🎵</div>
          <div class="music-track-copy">
            <span>${escapeHtml(track.series)}</span>
            <h3>${escapeHtml(track.title)}</h3>
            <p>${escapeHtml(isOwned ? localize('已拥有，可以随时切换。') : localize('试听 30 秒，喜欢再解锁。'))}</p>
          </div>
          <div class="music-track-actions">
            <button type="button" class="secondary-button" data-music-preview="${escapeHtml(track.id)}">${escapeHtml(localize('试听 30 秒'))}</button>
            ${action}
            ${shareAction}
          </div>
        </article>`;
      }).join('')}</div>
    </section>`;
    }).join('');
    applyLanguage(grid);
  }

  // 背景音乐沿用造句软件的兼容方式：先尝试 autoplay，
  // 再在用户第一次触摸、点击或按键时重新调用 play()，兼容手机浏览器的自动播放限制。
  function tryStartBackgroundMusic() {
    if (!backgroundMusic) return;
    if (evolutionVideoActive) return;
    if (musicPlayerPausedManually) {
      updateMusicPlayerPlaybackUi();
      return;
    }
    if (musicPreviewSuppressBackground) {
      if (!backgroundMusic.paused) backgroundMusic.pause();
      updateMusicPlayerPlaybackUi();
      return;
    }
    applyActiveBackgroundMusic();
    backgroundMusic.volume = 0.42;
    const promise = backgroundMusic.play();
    if (promise && typeof promise.catch === 'function') promise.catch(() => updateMusicPlayerPlaybackUi());
    updateMusicPlayerPlaybackUi();
  }

  tryStartBackgroundMusic();
  if (backgroundMusic) {
    backgroundMusic.addEventListener('ended', () => advanceBackgroundMusic());
    backgroundMusic.addEventListener('play', updateMusicPlayerPlaybackUi);
    backgroundMusic.addEventListener('pause', updateMusicPlayerPlaybackUi);
    backgroundMusic.addEventListener('loadedmetadata', updateMusicPlayerPlaybackUi);
  }
  window.addEventListener('pointerdown', tryStartBackgroundMusic, { passive: true });
  window.addEventListener('keydown', tryStartBackgroundMusic, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryStartBackgroundMusic();
    if (document.hidden) {
      stopPetInteractionLoop();
      stopRoomAutoRefresh();
      stopInteractionRoomLobbyRefresh();
      stopKuromiRoomDemo();
    } else if (session.activeView === 'guide-view') {
      initKuromiRoomDemo();
      if (interactionRoomState.activeRoomId) {
        startInteractionRoomHeartbeat();
        void sendInteractionRoomHeartbeat({ silent: true });
      }
    }
  });

  function pauseBackgroundMusicForEvolution() {
    evolutionVideoActive = true;
    evolutionPausedBackgroundMusic = Boolean(backgroundMusic && !backgroundMusic.paused && !backgroundMusic.ended);
    if (backgroundMusic && !backgroundMusic.paused) backgroundMusic.pause();
  }

  function restoreBackgroundMusicAfterEvolution() {
    const shouldResume = evolutionPausedBackgroundMusic;
    evolutionPausedBackgroundMusic = false;
    evolutionVideoActive = false;
    if (shouldResume) tryStartBackgroundMusic();
  }

  function waitForVideoMetadata(video) {
    if (!video || video.readyState >= 1) return Promise.resolve();
    return new Promise(resolve => {
      let finished = false;
      let timer = null;
      const cleanup = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        video.removeEventListener('loadedmetadata', cleanup);
        video.removeEventListener('error', cleanup);
        resolve();
      };
      video.addEventListener('loadedmetadata', cleanup, { once: true });
      video.addEventListener('error', cleanup, { once: true });
      timer = setTimeout(cleanup, 900);
    });
  }

  function primeEvolutionCinematic() {
    const video = $('#evolution-video');
    if (!video) return;
    if (evolutionCinematicPrimeStarted && video.readyState >= 1) return;
    evolutionCinematicPrimeStarted = true;
    try {
      video.preload = 'auto';
      video.playsInline = true;
      if (video.readyState < 1) video.load();
    } catch (error) {
      console.info('Evolution cinematic preload skipped.', error);
    }
  }

  function scheduleEvolutionCinematicPrime() {
    if (evolutionCinematicPrimeScheduled) return;
    evolutionCinematicPrimeScheduled = true;
    const run = () => primeEvolutionCinematic();
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(run, { timeout: 1200 });
    } else {
      window.setTimeout(run, 650);
    }
    window.addEventListener('pointerdown', run, { once: true, passive: true });
    window.addEventListener('keydown', run, { once: true, passive: true });
  }

  function stopEvolutionCinematic() {
    evolutionVideoAttempt += 1;
    const video = $('#evolution-video');
    const playButton = $('#evolution-video-play');
    if (video) {
      video.onended = null;
      video.onerror = null;
      video.pause();
      try {
        video.currentTime = 0;
      } catch (error) {
        console.info('Evolution video reset unavailable.', error);
      }
      video.muted = false;
    }
    if (playButton) playButton.classList.add('hidden');
  }

  async function playEvolutionCinematic() {
    const video = $('#evolution-video');
    const playButton = $('#evolution-video-play');
    const attempt = evolutionVideoAttempt + 1;
    evolutionVideoAttempt = attempt;
    evolutionVideoActive = true;
    if (playButton) playButton.textContent = localize('点击播放进化影片');
    if (!video) {
      clearTimeout(powerFeedbackTimer);
      powerFeedbackTimer = setTimeout(finishEvolutionCinematic, 700);
      return;
    }
    if (playButton) playButton.classList.add('hidden');
    video.onended = finishEvolutionCinematic;
    video.onerror = () => {
      playEvolutionSound();
      clearTimeout(powerFeedbackTimer);
      powerFeedbackTimer = setTimeout(finishEvolutionCinematic, 700);
    };
    video.pause();
    video.preload = 'auto';
    primeEvolutionCinematic();
    if (video.readyState >= 1) {
      try {
        video.currentTime = 0;
      } catch (error) {
        console.info('Evolution video seek unavailable.', error);
      }
    }
    video.volume = 1;
    video.muted = false;
    const promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(async () => {
        if (attempt !== evolutionVideoAttempt) return;
        try {
          video.muted = true;
          const mutedPromise = video.play();
          if (mutedPromise && typeof mutedPromise.catch === 'function') await mutedPromise;
        } catch (error) {
          if (playButton) playButton.classList.remove('hidden');
        }
      });
    }
  }

  function finishEvolutionCinematic() {
    evolutionVideoAttempt += 1;
    const overlay = $('#evolution-overlay');
    const video = $('#evolution-video');
    const playButton = $('#evolution-video-play');
    clearTimeout(powerFeedbackTimer);
    if (video) {
      video.pause();
      video.onended = null;
      video.onerror = null;
      try {
        video.currentTime = 0;
      } catch (error) {
        console.info('Evolution video finish reset unavailable.', error);
      }
      video.muted = false;
    }
    if (playButton) playButton.classList.add('hidden');
    if (!overlay) return;
    overlay.classList.remove('evolution-cinematic-running');
    overlay.classList.add('evolution-cinematic-finished');
    overlay.classList.remove('evolution-playing');
    void overlay.offsetWidth;
    overlay.classList.add('evolution-playing');
    playEvolutionSound();
  }

  function replayEvolutionCinematicFromButton() {
    playEvolutionCinematic();
  }

  function loadDatabase() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (error) {
      return {};
    }
  }

  function parseMaybeJson(value, fallback) {
    if (value == null || value === '') return fallback;
    if (typeof value !== 'string') return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function loadLocalWallPosts() {
    try {
      const posts = JSON.parse(localStorage.getItem(WALL_STORAGE_KEY) || '[]');
      const cutoff = Date.now() - WALL_POST_RETENTION_MS;
      return Array.isArray(posts)
        ? posts.map(normalizeWallPost).filter(post => (new Date(post.createdAt || post.updatedAt).getTime() || 0) >= cutoff)
        : [];
    } catch (error) {
      return [];
    }
  }

  function saveLocalWallPosts() {
    const cutoff = Date.now() - WALL_POST_RETENTION_MS;
    localStorage.setItem(WALL_STORAGE_KEY, JSON.stringify(messageWallPosts
      .filter(post => (new Date(post.createdAt || post.updatedAt).getTime() || 0) >= cutoff)
      .slice(0, 80)));
  }

  function createLocalId(prefix) {
    if (window.crypto?.randomUUID) return `${prefix}-${window.crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function saveLoginSession(studentId) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      studentId: HolidayBackendClient.normalizeId(studentId),
      savedAt: new Date().toISOString()
    }));
  }

  function loadLoginSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
    } catch (error) {
      return {};
    }
  }

  function clearLoginSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function saveDatabase() {
    const activeStudent = session.studentId ? database[session.studentId] : null;
    if (activeStudent) syncActivePetRecord(activeStudent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  }

  function cloneStudentState(student) {
    return JSON.parse(JSON.stringify(student || {}));
  }

  async function persistStudentState(student, event = {}) {
    return enqueueStudentSave(async () => {
      saveDatabase();
      if (!student || student.demoMode || !isGasBackend()) return { ok: true, mode: 'local' };
      const result = await backend.saveStudentState(student, event);
      if (!result.ok) throw new Error(result.error || '云端保存失败');
      if (result.student) {
        database[student.studentId] = HolidayBackendClient.normalizeStudent(result.student, result.classes || student.classes || [], database[student.studentId]);
        saveDatabase();
      }
      return result;
    });
  }

  async function persistStudentToSupabase(student, event = {}) {
    if (!HolidayBackendClient.isSupabaseMode(APP_CONFIG)) return { ok: true, skipped: true };
    try {
      return await backend.requestSupabase('saveStudentState', {
        studentId: HolidayBackendClient.normalizeId(student?.studentId),
        student,
        event
      });
    } catch (error) {
      return { ok: false, error: error?.message || String(error) };
    }
  }

  async function persistMiniGameHighScore(student, key, score, event = {}) {
    if (!student || student.demoMode || !isGasBackend()) return { ok: true, mode: 'local' };
    if (HolidayBackendClient.isSupabaseMode(APP_CONFIG)) {
      return backend.requestSupabase('recordMiniGameScore', {
        studentId: HolidayBackendClient.normalizeId(student.studentId),
        miniGame: key,
        score,
        event
      });
    }
    return backend.saveStudentState(student, event);
  }

  function enqueueStudentSave(task) {
    const run = studentSaveQueue.catch(() => null).then(task);
    studentSaveQueue = run.catch(() => null);
    return run;
  }

  async function commitStudentState(student, snapshot, event, onSuccess) {
    try {
      await persistStudentState(student, event);
      if (typeof onSuccess === 'function') onSuccess();
      return true;
    } catch (error) {
      if (snapshot?.studentId) database[snapshot.studentId] = snapshot;
      saveDatabase();
      renderedCombatState = { studentId: null, stats: null, power: null };
      renderAppShell();
      switchView(session.activeView || DEFAULT_APP_VIEW);
      showToast(`保存到云端失败，刚才的操作没有完成：${error.message || error}`);
      return false;
    }
  }

  function renderActiveStudentView() {
    const viewId = session.activeView || DEFAULT_APP_VIEW;
    if (viewId === 'dashboard-view') renderDashboardView();
    if (viewId === 'subjects-view') renderSubjectsView();
    if (viewId === 'quest-view') renderQuestView();
    if (viewId === 'leaderboard-view') renderGloryLeaderboard();
    if (viewId === 'achievements-view') renderAchievementsView();
    if (viewId === 'arcade-view') renderArcadeView();
    if (viewId === 'characters-view') renderCharactersView();
    if (viewId === 'duel-view') renderDuelView();
    if (viewId === 'guide-view') renderPetInteraction();
    if (viewId === 'home-view') renderHome();
    if (viewId === 'checkin-view') {
      renderCheckin();
      renderHistory();
    }
    if (viewId === 'shop-view') renderShop();
    if (viewId === 'wall-view') renderMessageWall(getStudent());
    if (viewId === 'friends-view') renderFriendsView();
    if (viewId === 'music-box-view') renderMusicBox(getStudent());
    if (viewId !== 'home-view') setTimeout(() => maybeQueueNewPlayerGuide(getStudent()), 540);
  }

  function createStudentProfile(studentId) {
    const isFreeDemo = studentId === 'DEMOFREE';
    const demo = DEMO_STUDENTS[studentId] || (isFreeDemo
      ? { name: '自由搭配 Demo', branch: '系统演示', className: 'Sandbox', avatar: '🧪' }
      : { name: '演示学生', branch: '演示分行', className: 'Demo Class', avatar: '🌟' });
    return {
      studentId,
      ...demo,
      demoMode: isFreeDemo,
      petName: '',
      petBirthday: '',
      petType: '',
      petRarity: 'A',
      petLevel: 1,
      experience: 0,
      coins: isFreeDemo ? 99999 : 0,
      totalStars: 0,
      streak: 0,
      lastCheckinDate: '',
      ownedItems: isFreeDemo ? EQUIPMENT_CATALOG.map(item => item.id) : [],
      equippedItems: {},
      petItemsMigrated: false,
      ownedPets: [],
      petCollection: {},
      evolvedPets: {},
      petRoomDecorations: [],
      blindBoxes: 0,
      ownedMusicTracks: [DEFAULT_MUSIC_TRACK_ID],
      activeMusicTrack: DEFAULT_MUSIC_TRACK_ID,
      musicPlaybackMode: MUSIC_PLAYBACK_MODE_SINGLE,
      miniGameHighScores: normalizeMiniGameScores(),
      collectionTitles: {},
      drawnCollectionTitle: '',
      titleDrawAvailable: false,
      titleDrawCompleted: false,
      pendingBlindBoxDuplicates: [],
      evolutionStylePreference: '',
      activeEvolutionForm: PET_EVOLUTION_FORM_ORIGINAL,
      dailyCheckinGuideLastSeenDate: '',
      dailyCheckinGuideLastSeenAt: '',
      petEvolved: false,
      miniPetEvolved: false,
      evolutionReady: false,
      miniEvolutionReady: false,
      exclusiveEvolutionReady: false,
      equipmentExperienceMigrated: false,
      teacherRewards: [],
      checkins: []
    };
  }

  function getStudent() {
    if (!session.studentId) return null;
    const student = database[session.studentId];
    if (!student) return null;
    // 兼容升级前已经存在的本机演示资料。
    if (!student.petRarity) student.petRarity = 'A';
    if (!Object.prototype.hasOwnProperty.call(student, 'petType')) student.petType = '';
    if (!Object.prototype.hasOwnProperty.call(student, 'petName')) student.petName = '';
    if (!Object.prototype.hasOwnProperty.call(student, 'petBirthday')) student.petBirthday = '';
    if (!Object.prototype.hasOwnProperty.call(student, 'demoMode')) student.demoMode = student.studentId === 'DEMOFREE';
    if (!Array.isArray(student.ownedItems)) student.ownedItems = [];
    if (!student.equippedItems || typeof student.equippedItems !== 'object') student.equippedItems = {};
    if (!Object.prototype.hasOwnProperty.call(student, 'petItemsMigrated')) student.petItemsMigrated = false;
    if (!Array.isArray(student.teacherRewards)) student.teacherRewards = [];
    student.experience = 0;
    if (!Object.prototype.hasOwnProperty.call(student, 'equipmentExperienceMigrated')) student.equipmentExperienceMigrated = true;
    if (!Array.isArray(student.ownedPets)) student.ownedPets = student.petType ? [student.petType] : [];
    if (student.petType && !student.ownedPets.includes(student.petType)) student.ownedPets.push(student.petType);
    if (!student.petCollection || typeof student.petCollection !== 'object') student.petCollection = {};
    if (!student.evolvedPets || typeof student.evolvedPets !== 'object') student.evolvedPets = {};
    if (!Array.isArray(student.petRoomDecorations)) student.petRoomDecorations = [];
    student.blindBoxes = Math.max(0, Math.floor(Number(student.blindBoxes) || 0));
    getOwnedMusicTracks(student);
    if (!getMusicTrackById(student.activeMusicTrack)) student.activeMusicTrack = DEFAULT_MUSIC_TRACK_ID;
    getMusicPlaybackMode(student);
    if (!student.collectionTitles || typeof student.collectionTitles !== 'object' || Array.isArray(student.collectionTitles)) student.collectionTitles = {};
    if (!Object.prototype.hasOwnProperty.call(student, 'drawnCollectionTitle')) student.drawnCollectionTitle = '';
    if (!Object.prototype.hasOwnProperty.call(student, 'titleDrawAvailable')) student.titleDrawAvailable = false;
    if (!Object.prototype.hasOwnProperty.call(student, 'titleDrawCompleted')) student.titleDrawCompleted = false;
    if (!Array.isArray(student.pendingBlindBoxDuplicates)) student.pendingBlindBoxDuplicates = [];
    if (isValidEvolutionStyle(student.evolutionStylePreference)) {
      student.evolutionStylePreference = normalizePetEvolutionFormForPet(student.evolutionStylePreference, student.petType);
    } else {
      student.evolutionStylePreference = '';
    }
    student.activeEvolutionForm = normalizePetEvolutionFormForPet(student.activeEvolutionForm, student.petType) || PET_EVOLUTION_FORM_ORIGINAL;
    if (!Object.prototype.hasOwnProperty.call(student, 'dailyCheckinGuideLastSeenDate')) student.dailyCheckinGuideLastSeenDate = '';
    if (!Object.prototype.hasOwnProperty.call(student, 'dailyCheckinGuideLastSeenAt')) student.dailyCheckinGuideLastSeenAt = '';
    if (!Object.prototype.hasOwnProperty.call(student, 'petEvolved')) student.petEvolved = Boolean(student.evolvedPets[student.petType]);
    if (student.petEvolved && student.petType) student.evolvedPets[student.petType] = true;
    if (!Object.prototype.hasOwnProperty.call(student, 'evolutionReady')) student.evolutionReady = false;
    if (!Object.prototype.hasOwnProperty.call(student, 'miniEvolutionReady')) student.miniEvolutionReady = false;
    if (!Object.prototype.hasOwnProperty.call(student, 'miniPetEvolved')) student.miniPetEvolved = Boolean(student.petCollection?.[student.petType]?.miniEvolved);
    if (!Object.prototype.hasOwnProperty.call(student, 'exclusiveEvolutionReady')) student.exclusiveEvolutionReady = false;
    if (student.petType) {
      student.petLevel = getLevelInfo(student).level;
      const record = ensurePetRecord(student);
      student.miniPetEvolved = Boolean(record?.miniEvolved);
      syncPetEvolutionFormState(student);
    }
    repairPetNamingState(student);
    syncCollectionTitleState(student);
    return student;
  }

  function getDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: APP_CONFIG.timezone,
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date).reduce((map, part) => {
      if (part.type !== 'literal') map[part.type] = part.value;
      return map;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function formatDate(dateKey) {
    if (!dateKey) return '—';
    const [year, month, day] = dateKey.split('-');
    return `${year}年${Number(month)}月${Number(day)}日`;
  }

  function formatDisplayDate(dateKey) {
    if (!dateKey) return '—';
    if (currentLanguage !== 'en') return formatDate(dateKey);
    const [year, month, day] = dateKey.split('-');
    return formatEnglishDate(year, month, day);
  }

  function getDailyLoginGiftAmount() {
    const min = Number(ECONOMY_CONFIG.dailyLoginGiftMinCoins || 50);
    const max = Number(ECONOMY_CONFIG.dailyLoginGiftMaxCoins || min);
    return min + Math.floor(Math.random() * (Math.max(min, max) - min + 1));
  }

  async function awardDailyLoginGift(student) {
    if (!student || student.demoMode) return false;
    const today = getDateKey();
    if (student.lastDailyLoginGiftDate === today) return false;
    const amount = getDailyLoginGiftAmount();
    if (amount <= 0) return false;
    const snapshot = cloneStudentState(student);
    student.coins = Number(student.coins || 0) + amount;
    student.lastDailyLoginGiftDate = today;
    student.lastDailyLoginGiftAmount = amount;
    student.dailyLoginGifts = Array.isArray(student.dailyLoginGifts) ? student.dailyLoginGifts : [];
    student.dailyLoginGifts.unshift({
      date: today,
      amount,
      awardedAt: new Date().toISOString()
    });
    student.dailyLoginGifts = student.dailyLoginGifts.slice(0, 30);
    return commitStudentState(student, snapshot, { type: 'dailyLoginGift', date: today, amount }, () => {
      renderAppShell();
      switchView(session.activeView || DEFAULT_APP_VIEW);
      showToast(`今日上线奖励 +${amount} 金币！`);
    });
  }

  function isHolidayOpen() {
    const today = getDateKey();
    return today >= APP_CONFIG.holidayStart && today <= APP_CONFIG.holidayEnd;
  }

  function $(selector) { return document.querySelector(selector); }
  function $all(selector) { return Array.from(document.querySelectorAll(selector)); }

  function loadLanguagePreference() {
    try {
      return localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'zh';
    } catch (error) {
      return 'zh';
    }
  }

  function saveLanguagePreference(language) {
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.info('Language preference cannot be saved.', error);
    }
  }

  function setLanguage(language) {
    currentLanguage = language === 'en' ? 'en' : 'zh';
    saveLanguagePreference(currentLanguage);
    if (newPlayerGuideState.active) {
      updateLanguageToggle();
      applyLanguage($('#new-player-guide-overlay') || document.body);
      renderNewPlayerGuideStep();
      scheduleNewPlayerGuideSpotlightUpdate();
      return;
    }
    refreshRenderedLanguageContent();
    applyLanguage();
  }

  function setScreenMode(mode) {
    document.body.classList.toggle('login-mode', mode === 'login');
    document.body.classList.toggle('app-mode', mode === 'app');
    document.body.classList.toggle('teacher-mode', mode === 'teacher');
  }

  function updateLanguageToggle() {
    $all('[data-language]').forEach(button => {
      const active = button.dataset.language === currentLanguage;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function normalizeTranslationKey(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function formatEnglishDate(year, month, day) {
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (Number.isNaN(date.getTime())) return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  }

  function translateToken(value) {
    const key = normalizeTranslationKey(value);
    if (!key) return '';
    const direct = TRANSLATIONS.en[key];
    if (direct) return direct;
    const pattern = TRANSLATION_PATTERNS.find(rule => rule.pattern.test(key));
    if (!pattern) return key;
    return key.replace(pattern.pattern, (...args) => pattern.replace(args));
  }

  function translateTextValue(value) {
    if (currentLanguage !== 'en') return value;
    const text = String(value || '');
    if (!text.trim()) return value;
    const leading = text.match(/^\s*/)?.[0] || '';
    const trailing = text.match(/\s*$/)?.[0] || '';
    const translated = translateToken(text);
    return translated === normalizeTranslationKey(text) ? value : `${leading}${translated}${trailing}`;
  }

  function getOriginalTextNodeValue(node) {
    if (!Object.prototype.hasOwnProperty.call(node, '_holidayOriginalText')) {
      node._holidayOriginalText = node.nodeValue;
    }
    return node._holidayOriginalText;
  }

  function translateTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('[data-no-translate]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node = walker.nextNode();
    while (node) {
      const original = getOriginalTextNodeValue(node);
      node.nodeValue = currentLanguage === 'zh' ? original : translateTextValue(original);
      node = walker.nextNode();
    }
  }

  function translateElementAttributes(root) {
    if (!root || root.nodeType !== Node.ELEMENT_NODE) return;
    const attributes = [
      ['placeholder', 'data-i18n-placeholder'],
      ['title', 'data-i18n-title'],
      ['aria-label', 'data-i18n-aria-label'],
      ['alt', 'data-i18n-alt']
    ];
    const elements = [root, ...root.querySelectorAll('*')];
    elements.forEach(element => {
      if (element.closest('[data-no-translate]')) return;
      attributes.forEach(([attribute, backup]) => {
        if (!element.hasAttribute(attribute)) return;
        if (!element.hasAttribute(backup)) element.setAttribute(backup, element.getAttribute(attribute));
        const original = element.getAttribute(backup);
        element.setAttribute(attribute, currentLanguage === 'zh' ? original : translateTextValue(original));
      });
    });
  }

  function applyLanguage(root = document.body) {
    if (!root) return;
    languageApplying = true;
    document.documentElement.lang = currentLanguage === 'en' ? 'en' : 'zh-CN';
    document.title = currentLanguage === 'en' ? translateToken(APP_CONFIG.name) : APP_CONFIG.name;
    updateLanguageToggle();
    const target = root.nodeType === Node.ELEMENT_NODE ? root : root.parentElement || document.body;
    translateElementAttributes(target);
    translateTextNodes(target);
    languageApplying = false;
  }

  function scheduleLanguageApply() {
    if (languageApplying || currentLanguage !== 'en' || languageApplyQueued) return;
    languageApplyQueued = true;
    window.requestAnimationFrame(() => {
      languageApplyQueued = false;
      applyLanguage();
    });
  }

  function startLanguageObserver() {
    if (languageObserver || !document.body) return;
    languageObserver = new MutationObserver(() => scheduleLanguageApply());
    languageObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label', 'alt']
    });
  }

  function refreshRenderedLanguageContent() {
    if (session.teacherMode) {
      renderTeacherControls();
      renderTeacher();
      return;
    }
    if (!session.studentId) return;
    const activeView = session.activeView || DEFAULT_APP_VIEW;
    renderAppShell();
    switchView(activeView);
  }

  function localize(value) {
    return currentLanguage === 'en' ? translateToken(value) : value;
  }

  function getPetRarityDisplayLabel(rarity) {
    return currentLanguage === 'en' ? localize(`${rarity} 级`) : `${rarity} 级`;
  }

  function getEquipmentDisplayName(item) {
    if (!item) return '';
    return currentLanguage === 'en' && item.englishName ? item.englishName : item.name;
  }

  function getEquipmentDisplayDescription(item) {
    if (!item) return '';
    if (currentLanguage !== 'en') return item.description || '';
    const stats = Object.entries(item.stats || {})
      .map(([key, value]) => `${localize(getStatLabel(key))} ${value >= 0 ? '+' : ''}${value}`)
      .join(', ');
    const roleCopy = item.exclusivePetName ? ` Exclusive gear for ${item.exclusivePetName}.` : '';
    return `${getEquipmentDisplayName(item)} boosts ${stats || 'pet stats'}.${roleCopy}`;
  }

  function getSkillDisplayEntry(pet, entry) {
    if (currentLanguage !== 'en') return entry;
    const type = localize(entry.type);
    const fallbackNames = {
      passive: `${pet.name} Talent`,
      'skill-1': `${pet.name} Skill 1`,
      'skill-2': `${pet.name} Skill 2`,
      'skill-3': `${pet.name} Skill 3`,
      ultimate: `${pet.name} Ultimate`
    };
    const fallbackCopy = {
      passive: `${pet.name}'s passive trait supports its battle style and helps it stay effective during challenges.`,
      'skill-1': `${pet.name} uses a focused first skill to pressure targets and create an opening.`,
      'skill-2': `${pet.name} follows up with a stronger skill that changes position, protects allies or adds extra damage.`,
      'skill-3': `${pet.name} uses its third skill to control the battle and keep its team safe.`,
      ultimate: `${pet.name} unleashes its ultimate move for a powerful finishing effect across the battlefield.`
    };
    return {
      ...entry,
      type,
      name: translateToken(entry.name) === entry.name ? (fallbackNames[entry.id] || `${pet.name} Skill`) : translateToken(entry.name),
      explanation: translateToken(entry.explanation) === entry.explanation ? (fallbackCopy[entry.id] || `${pet.name} uses a special companion ability.`) : translateToken(entry.explanation)
    };
  }

  function getStudentDisplayName(student) {
    if (!student) return '';
    if (currentLanguage === 'en' && (student.demoMode || /^DEMO/.test(String(student.studentId || '')))) {
      return localize(student.name);
    }
    return student.name;
  }

  function getPlayerDisplayName(student) {
    if (!student) return '';
    return String(student.studentName || student.name || student.studentId || '').trim();
  }

  function isValidStudentAvatarImage(value) {
    const text = String(value || '').trim();
    return /^data:image\/(?:png|jpe?g|webp);base64,/i.test(text) && text.length <= AVATAR_IMAGE_MAX_DATA_URL_LENGTH;
  }

  function getStudentAvatarImage(student = {}) {
    return isValidStudentAvatarImage(student?.avatarImage) ? String(student.avatarImage).trim() : '';
  }

  function getStudentAvatarFallback(student = {}) {
    return String(student?.avatar || '🌟').trim() || '🌟';
  }

  function renderStudentAvatarVisual(student = {}, imageClass = 'student-avatar-image') {
    const avatarImage = getStudentAvatarImage(student);
    if (avatarImage) return `<img class="${escapeHtml(imageClass)}" src="${escapeHtml(avatarImage)}" alt="" loading="lazy" decoding="async" />`;
    return escapeHtml(getStudentAvatarFallback(student));
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  }

  function loadImageElement(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Image load failed'));
      image.src = src;
    });
  }

  function getAvatarCropMetrics(state = avatarCropState, canvas = $('#avatar-crop-canvas')) {
    if (!state?.image || !canvas) return null;
    const image = state.image;
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const canvasSize = canvas.width;
    const baseScale = Math.max(canvasSize / sourceWidth, canvasSize / sourceHeight);
    const scale = baseScale * Math.max(1, Number(state.zoom || 1));
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    const minX = Math.min(0, canvasSize - drawWidth);
    const maxX = 0;
    const minY = Math.min(0, canvasSize - drawHeight);
    const maxY = 0;
    const x = Math.min(maxX, Math.max(minX, Number(state.offsetX || 0)));
    const y = Math.min(maxY, Math.max(minY, Number(state.offsetY || 0)));
    state.offsetX = x;
    state.offsetY = y;
    return { image, canvasSize, x, y, drawWidth, drawHeight };
  }

  function drawAvatarCropPreview() {
    const canvas = $('#avatar-crop-canvas');
    const metrics = getAvatarCropMetrics(avatarCropState, canvas);
    if (!canvas || !metrics) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(metrics.image, metrics.x, metrics.y, metrics.drawWidth, metrics.drawHeight);
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 4, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(255,255,255,.9)';
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(92,92,230,.46)';
    ctx.stroke();
    ctx.restore();
  }

  function drawAvatarImageToDataUrl(image, size, type, quality, crop = null) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    if (crop) {
      const scale = size / crop.canvasSize;
      ctx.drawImage(image, crop.x * scale, crop.y * scale, crop.drawWidth * scale, crop.drawHeight * scale);
    } else {
      const sourceWidth = image.naturalWidth || image.width;
      const sourceHeight = image.naturalHeight || image.height;
      const cropSize = Math.min(sourceWidth, sourceHeight);
      const sx = Math.max(0, Math.floor((sourceWidth - cropSize) / 2));
      const sy = Math.max(0, Math.floor((sourceHeight - cropSize) / 2));
      ctx.drawImage(image, sx, sy, cropSize, cropSize, 0, 0, size, size);
    }
    return canvas.toDataURL(type, quality);
  }

  async function prepareStudentAvatarCrop(file) {
    if (!file || !String(file.type || '').startsWith('image/')) throw new Error('请选择图片文件。');
    if (file.size > AVATAR_UPLOAD_MAX_FILE_BYTES) throw new Error('图片太大，请选择 6MB 以下的图片。');
    const sourceDataUrl = await readFileAsDataUrl(file);
    return loadImageElement(sourceDataUrl);
  }

  function createStudentAvatarImageFromCrop() {
    const canvas = $('#avatar-crop-canvas');
    const crop = getAvatarCropMetrics(avatarCropState, canvas);
    if (!avatarCropState?.image || !crop) throw new Error('头像处理失败，请换一张图片。');
    let dataUrl = drawAvatarImageToDataUrl(avatarCropState.image, AVATAR_IMAGE_SIZE, 'image/webp', 0.82, crop);
    if (!isValidStudentAvatarImage(dataUrl)) {
      dataUrl = drawAvatarImageToDataUrl(avatarCropState.image, 96, 'image/jpeg', 0.68, crop);
    }
    if (!isValidStudentAvatarImage(dataUrl)) throw new Error('头像处理失败，请换一张图片。');
    return dataUrl;
  }

  function closeAvatarCropModal() {
    const overlay = $('#avatar-crop-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
    }
    avatarCropState = null;
  }

  function getAvatarCropCanvasPoint(event) {
    const canvas = $('#avatar-crop-canvas');
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / Math.max(1, rect.width)) * canvas.width,
      y: ((event.clientY - rect.top) / Math.max(1, rect.height)) * canvas.height
    };
  }

  function startAvatarCropDrag(event) {
    if (!avatarCropState) return;
    const canvas = $('#avatar-crop-canvas');
    if (!canvas || !event.target.closest('#avatar-crop-canvas')) return;
    event.preventDefault();
    const point = getAvatarCropCanvasPoint(event);
    avatarCropState.dragging = true;
    avatarCropState.pointerId = event.pointerId;
    avatarCropState.dragStartX = point.x;
    avatarCropState.dragStartY = point.y;
    avatarCropState.startOffsetX = avatarCropState.offsetX;
    avatarCropState.startOffsetY = avatarCropState.offsetY;
    try {
      canvas.setPointerCapture?.(event.pointerId);
    } catch (error) {
      console.info('Avatar crop pointer capture skipped.', error);
    }
  }

  function moveAvatarCropDrag(event) {
    if (!avatarCropState?.dragging) return;
    if (avatarCropState.pointerId != null && event.pointerId !== avatarCropState.pointerId) return;
    event.preventDefault();
    const point = getAvatarCropCanvasPoint(event);
    avatarCropState.offsetX = Number(avatarCropState.startOffsetX || 0) + point.x - Number(avatarCropState.dragStartX || 0);
    avatarCropState.offsetY = Number(avatarCropState.startOffsetY || 0) + point.y - Number(avatarCropState.dragStartY || 0);
    drawAvatarCropPreview();
  }

  function finishAvatarCropDrag(event) {
    if (!avatarCropState?.dragging) return;
    if (avatarCropState.pointerId != null && event.pointerId !== avatarCropState.pointerId) return;
    avatarCropState.dragging = false;
    avatarCropState.pointerId = null;
  }

  function updateAvatarCropZoom(value) {
    if (!avatarCropState) return;
    const previous = Math.max(1, Number(avatarCropState.zoom || 1));
    const next = Math.max(1, Math.min(3, Number(value || 1)));
    const canvas = $('#avatar-crop-canvas');
    if (canvas && previous !== next) {
      const center = canvas.width / 2;
      avatarCropState.offsetX = center - ((center - Number(avatarCropState.offsetX || 0)) * next / previous);
      avatarCropState.offsetY = center - ((center - Number(avatarCropState.offsetY || 0)) * next / previous);
    }
    avatarCropState.zoom = next;
    drawAvatarCropPreview();
  }

  function openAvatarCropModal(image) {
    const overlay = $('#avatar-crop-overlay');
    const canvas = $('#avatar-crop-canvas');
    const zoom = $('#avatar-crop-zoom');
    if (!overlay || !canvas || !zoom) return false;
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const canvasSize = canvas.width;
    const baseScale = Math.max(canvasSize / sourceWidth, canvasSize / sourceHeight);
    const drawWidth = sourceWidth * baseScale;
    const drawHeight = sourceHeight * baseScale;
    avatarCropState = {
      image,
      zoom: 1,
      offsetX: (canvasSize - drawWidth) / 2,
      offsetY: (canvasSize - drawHeight) / 2,
      dragging: false,
      pointerId: null,
      dragStartX: 0,
      dragStartY: 0,
      startOffsetX: 0,
      startOffsetY: 0
    };
    zoom.value = '1';
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    drawAvatarCropPreview();
    return true;
  }

  async function openStudentAvatarCropFromFile(file) {
    if (!getStudent() || !file) return false;
    try {
      showToast('正在处理头像...');
      const image = await prepareStudentAvatarCrop(file);
      return openAvatarCropModal(image);
    } catch (error) {
      showToast(localize(error?.message || '头像处理失败，请换一张图片。'));
      return false;
    }
  }

  async function saveStudentAvatarFromCrop() {
    const student = getStudent();
    if (!student) return false;
    const snapshot = cloneStudentState(student);
    try {
      const avatarImage = createStudentAvatarImageFromCrop();
      student.avatarImage = avatarImage;
      student.avatarUpdatedAt = new Date().toISOString();
      database[student.studentId] = student;
      saveDatabase();
      renderAppShell();
      renderActiveStudentView();
      closeAvatarCropModal();
      const saved = await commitStudentState(student, snapshot, { type: 'updateAvatar' }, () => showToast('头像已保存。'));
      return saved;
    } catch (error) {
      if (snapshot?.studentId) database[snapshot.studentId] = snapshot;
      saveDatabase();
      renderAppShell();
      renderActiveStudentView();
      showToast(localize(error?.message || '头像处理失败，请换一张图片。'));
      return false;
    }
  }

  function normalizeModerationText(value) {
    return String(value || '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[01345789@$!|]/g, char => MODERATION_CHAR_REPLACEMENTS[char] || char)
      .replace(/[\u200b-\u200f\ufeff]/g, '')
      .replace(/[\s._\-*~`@#%^&()+=[\]{}\\:;"'<>,.?/，。？！、；：（）【】《》「」『』]/g, '');
  }

  function validatePetName(name) {
    const trimmed = String(name || '').trim();
    if (!trimmed) return { ok: false, error: '先填写宠物名字。' };
    if (trimmed.length > 20) return { ok: false, error: '宠物名字最多 20 个字。' };
    const normalized = normalizeModerationText(trimmed);
    const hasBadWord = BAD_PET_NAME_WORDS.some(word => normalized.includes(normalizeModerationText(word)));
    if (hasBadWord) return { ok: false, error: '名字里有不适合公开展示的词，请换一个积极一点的名字。' };
    return { ok: true, name: trimmed, error: '' };
  }

  function validateWallCommentText(text) {
    return validatePublicDisplayText(text, 18, '先写一句留言。', '留言');
  }

  function validatePublicDisplayText(text, maxLength, emptyError = '内容不能为空。', label = '内容') {
    const trimmed = String(text || '').trim().replace(/\s+/g, ' ');
    if (!trimmed) return { ok: false, text: '', error: emptyError };
    if (trimmed.length > maxLength) return { ok: false, text: trimmed, error: `${label}最多 ${maxLength} 个字。` };
    const normalized = normalizeModerationText(trimmed);
    const hasBadWord = BAD_PET_NAME_WORDS.some(word => normalized.includes(normalizeModerationText(word)));
    if (hasBadWord) return { ok: false, text: trimmed, error: `${label}里有不适合公开展示的词，请换一个积极一点的内容。` };
    return { ok: true, text: trimmed, error: '' };
  }

  async function saveHomeProfileName(kind, value) {
    const student = getStudent();
    const field = String(kind || '') === 'pet' ? 'pet' : (String(kind || '') === 'student' ? 'student' : '');
    if (!student || !field) return false;
    const snapshot = cloneStudentState(student);
    if (field === 'student') {
      const validation = validatePublicDisplayText(value, 18, '先填写你的名字。', '名字');
      if (!validation.ok) {
        showToast(validation.error || '名字不适合公开展示。');
        return false;
      }
      student.studentName = validation.text;
      student.name = validation.text;
      student.profileNameUpdatedAt = new Date().toISOString();
      const saved = await commitStudentState(student, snapshot, { type: 'renameStudent' }, () => {
        homeNameEditState.field = '';
        homeNameEditState.value = '';
        renderAppShell();
        renderActiveStudentView();
        showToast('名字已经保存。');
      });
      return saved;
    }
    const validation = validatePetName(value);
    if (!validation.ok) {
      showToast(validation.error || '宠物名字不适合公开展示。');
      return false;
    }
    const record = ensurePetRecord(student, student.petType);
    if (!record) return false;
    const updatedAt = new Date().toISOString();
    student.petName = validation.name;
    student.petNameUpdatedAt = updatedAt;
    record.petName = validation.name;
    record.petNameUpdatedAt = updatedAt;
    record.needsNaming = false;
    const saved = await commitStudentState(student, snapshot, { type: 'renamePet', petId: student.petType }, () => {
      homeNameEditState.field = '';
      homeNameEditState.value = '';
      renderedCombatState = { studentId: null, stats: null, power: null };
      renderAppShell();
      renderActiveStudentView();
      showToast('宠物名字已经保存。');
    });
    return saved;
  }

  function getHomeNameEditField(value) {
    const field = String(value || '');
    return field === 'student' || field === 'pet' ? field : '';
  }

  function getHomeNameEditValue(field, student = getStudent()) {
    if (!student) return '';
    if (field === 'student') return String(student.studentName || student.name || '').trim();
    if (field === 'pet') return getPetNickname(student, student.petType) || '';
    return '';
  }

  function renderHomeNameEditor(field, displayValue, rawValue = displayValue) {
    const safeField = getHomeNameEditField(field);
    const value = String(displayValue || rawValue || '').trim();
    if (!safeField) return escapeHtml(value);
    if (homeNameEditState.field !== safeField) {
      return `<button type="button" class="editable-name-button" data-home-name-edit="${escapeHtml(safeField)}" data-no-translate aria-label="${escapeHtml(localize('修改名字'))}" title="${escapeHtml(localize('修改名字'))}">${escapeHtml(value || localize('同学'))}</button>`;
    }
    const draft = homeNameEditState.value || String(rawValue || '').trim();
    const maxLength = safeField === 'student' ? 18 : 20;
    return `<form class="home-name-form" data-home-name-form="${escapeHtml(safeField)}" data-no-translate>
      <input data-home-name-input name="profileName" value="${escapeHtml(draft)}" maxlength="${maxLength}" autocomplete="off" aria-label="${escapeHtml(localize('修改名字'))}" />
      <button type="submit" class="home-name-action" aria-label="${escapeHtml(localize('保存名字'))}" title="${escapeHtml(localize('保存名字'))}">✓</button>
      <button type="button" class="home-name-action" data-home-name-cancel aria-label="${escapeHtml(localize('取消修改'))}" title="${escapeHtml(localize('取消修改'))}">×</button>
    </form>`;
  }

  function focusHomeNameInput() {
    window.requestAnimationFrame(() => {
      const input = $('[data-home-name-input]');
      if (!input) return;
      input.focus({ preventScroll: true });
      input.select();
    });
  }

  function sanitizeWallCommentText(text) {
    const validation = validateWallCommentText(text);
    return validation.ok ? validation.text : WALL_COMMENT_PRESETS[0];
  }

  function showPetNameError(message) {
    const target = $('#pet-name-error');
    if (target) target.textContent = message ? localize(message) : '';
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = translateTextValue(message);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function showButtonInlineError(button, message = '金币不足') {
    if (!button) {
      showToast(message);
      return;
    }
    const anchor = button.closest('.inline-message-anchor') || button.parentElement || button;
    if (!anchor) {
      showToast(message);
      return;
    }
    anchor.classList.add('inline-message-anchor');
    let bubble = anchor.querySelector(':scope > .button-inline-error');
    if (!bubble) {
      bubble = document.createElement('span');
      bubble.className = 'button-inline-error';
      anchor.appendChild(bubble);
    }
    bubble.textContent = translateTextValue(message);
    bubble.classList.remove('show');
    void bubble.offsetWidth;
    bubble.classList.add('show');
    clearTimeout(bubble._hideTimer);
    bubble._hideTimer = setTimeout(() => {
      bubble.classList.remove('show');
      setTimeout(() => {
        if (bubble?.parentNode) bubble.parentNode.removeChild(bubble);
      }, 180);
    }, 1500);
  }

  async function withButtonLoading(button, task, label = '保存中') {
    if (!button) return task();
    if (button.classList.contains('is-loading')) return false;
    const originalHtml = button.innerHTML;
    const wasDisabled = button.disabled;
    button.disabled = true;
    button.classList.add('is-loading');
    button.setAttribute('aria-busy', 'true');
    button.innerHTML = `<span class="button-spinner" aria-hidden="true"></span><span>${escapeHtml(translateTextValue(label))}</span>`;
    try {
      return await task();
    } finally {
      if (!button.isConnected) return;
      button.innerHTML = originalHtml;
      button.disabled = wasDisabled;
      button.classList.remove('is-loading');
      button.removeAttribute('aria-busy');
    }
  }

  async function runEquipmentAction(button, task, label = '保存中') {
    const run = equipmentActionQueue.catch(() => null).then(async () => {
      equipmentActionLocked = true;
      const actionButtons = $all('[data-buy-item], [data-equip-item], [data-unequip-item], [data-equipment-slot]');
      const buttonStates = actionButtons.map(actionButton => ({
        button: actionButton,
        disabled: actionButton.disabled,
        ariaDisabled: actionButton.getAttribute('aria-disabled')
      }));
      actionButtons.forEach(actionButton => {
        actionButton.disabled = true;
        actionButton.setAttribute('aria-disabled', 'true');
      });
      try {
        return await withButtonLoading(button, task, label);
      } finally {
        equipmentActionLocked = false;
        buttonStates.forEach(({ button: actionButton, disabled, ariaDisabled }) => {
          if (!actionButton.isConnected) return;
          actionButton.disabled = disabled;
          if (ariaDisabled == null) actionButton.removeAttribute('aria-disabled');
          else actionButton.setAttribute('aria-disabled', ariaDisabled);
        });
      }
    });
    equipmentActionQueue = run.catch(() => null);
    return run;
  }

  function getKuromiRoomSpriteCacheKey(petIdValue, stageValue = 'base', styleValue = '') {
    const petId = String(petIdValue || 'kuromi').trim().toLowerCase() || 'kuromi';
    const stage = normalizeInteractionRoomPetStage(stageValue);
    const style = normalizeInteractionRoomPetStyle(styleValue);
    return stage === 'final' ? `${petId}:final${style === EVOLUTION_STYLE_CUTE ? ':cute' : ''}` : `${petId}:base`;
  }

  function makeKuromiRoomSpritePathMap(fileName, prefix = '') {
    const basePrefix = prefix ? `${prefix.replace(/\/+$/, '')}/` : '';
    return {
      headSrc: `${basePrefix}assets/8bit/heads/${fileName}`,
      fallbackSrc: `${basePrefix}assets/8bit/characters/${fileName}`,
      idleSrc: `${basePrefix}assets/8bit/characters-idle/${fileName}`,
      idleLeftSrc: `${basePrefix}assets/8bit/characters-idle-left/${fileName}`,
      runSrc: `${basePrefix}assets/8bit/characters-run-right/${fileName}`,
      runLeftSrc: `${basePrefix}assets/8bit/characters-run-left/${fileName}`,
      jumpSrc: `${basePrefix}assets/8bit/characters-jump/${fileName}`,
      jumpLeftSrc: `${basePrefix}assets/8bit/characters-jump-left/${fileName}`,
      duckSrc: `${basePrefix}assets/8bit/characters-crouch/${fileName}`,
      duckLeftSrc: `${basePrefix}assets/8bit/characters-crouch-left/${fileName}`,
      lieSrc: `${basePrefix}assets/8bit/characters-lie/${fileName}`,
      lieLeftSrc: `${basePrefix}assets/8bit/characters-lie-left/${fileName}`
    };
  }

  function makeKuromiRoomFinalSpritePathMap(fileName, styleValue = EVOLUTION_STYLE_HEROIC) {
    const folder = normalizeInteractionRoomPetStyle(styleValue) === EVOLUTION_STYLE_CUTE ? 'cute-final' : 'final';
    return {
      headSrc: `assets/8bit/${folder}/heads/${fileName}`,
      fallbackSrc: `assets/8bit/${folder}/characters/${fileName}`,
      idleSrc: `assets/8bit/${folder}/characters-idle/${fileName}`,
      idleLeftSrc: `assets/8bit/${folder}/characters-idle-left/${fileName}`,
      runSrc: `assets/8bit/${folder}/characters-run-right/${fileName}`,
      runLeftSrc: `assets/8bit/${folder}/characters-run-left/${fileName}`,
      jumpSrc: `assets/8bit/${folder}/characters-jump/${fileName}`,
      jumpLeftSrc: `assets/8bit/${folder}/characters-jump-left/${fileName}`,
      duckSrc: `assets/8bit/${folder}/characters-crouch/${fileName}`,
      duckLeftSrc: `assets/8bit/${folder}/characters-crouch-left/${fileName}`,
      lieSrc: `assets/8bit/${folder}/characters-lie/${fileName}`,
      lieLeftSrc: `assets/8bit/${folder}/characters-lie-left/${fileName}`
    };
  }

  function getKuromiRoomSpriteSources(...sources) {
    return Array.from(new Set(sources.map(src => String(src || '').trim()).filter(Boolean)));
  }

  function getKuromiRoomProfileSourceList(profile = {}, key) {
    const listKey = `${key}s`;
    const sourceList = Array.isArray(profile[listKey]) ? profile[listKey] : [profile[key]];
    return Array.from(new Set(sourceList.map(src => String(src || '').trim()).filter(Boolean)));
  }

  function getKuromiRoomSpriteProfileForPet(petIdValue, displayName = '', ownerName = '', stageValue = 'base', styleValue = EVOLUTION_STYLE_HEROIC) {
    const fallbackPet = getPetInfo('kuromi') || getPetInfo('creeper') || PET_CATALOG[0] || null;
    const pet = getPetInfo(petIdValue) || fallbackPet;
    const petId = pet?.id || 'kuromi';
    const fileName = `${petId}-8bit.png`;
    const safeDisplayName = String(displayName || pet?.name || 'Pet').trim();
    const stage = normalizeInteractionRoomPetStage(stageValue);
    const style = normalizeInteractionRoomPetStyle(styleValue);
    const basePaths = makeKuromiRoomSpritePathMap(fileName);
    const heroicPaths = makeKuromiRoomFinalSpritePathMap(fileName, EVOLUTION_STYLE_HEROIC);
    const stagePaths = stage === 'final' ? makeKuromiRoomFinalSpritePathMap(fileName, style) : basePaths;
    return {
      petId,
      stage,
      style,
      cacheKey: getKuromiRoomSpriteCacheKey(petId, stage, style),
      name: safeDisplayName,
      ownerName: String(ownerName || '').trim(),
      speciesName: pet?.name || petId,
      ...stagePaths,
      headFallbackSrc: basePaths.headSrc,
      fallbackSrcs: getKuromiRoomSpriteSources(stagePaths.fallbackSrc, heroicPaths.fallbackSrc, basePaths.fallbackSrc),
      headSrcs: getKuromiRoomSpriteSources(stagePaths.headSrc, heroicPaths.headSrc, basePaths.headSrc),
      idleSrcs: getKuromiRoomSpriteSources(stagePaths.idleSrc, heroicPaths.idleSrc, basePaths.idleSrc),
      idleLeftSrcs: getKuromiRoomSpriteSources(stagePaths.idleLeftSrc, heroicPaths.idleLeftSrc, basePaths.idleLeftSrc),
      runSrcs: getKuromiRoomSpriteSources(stagePaths.runSrc, heroicPaths.runSrc, basePaths.runSrc),
      runLeftSrcs: getKuromiRoomSpriteSources(stagePaths.runLeftSrc, heroicPaths.runLeftSrc, basePaths.runLeftSrc),
      jumpSrcs: getKuromiRoomSpriteSources(stagePaths.jumpSrc, heroicPaths.jumpSrc, basePaths.jumpSrc),
      jumpLeftSrcs: getKuromiRoomSpriteSources(stagePaths.jumpLeftSrc, heroicPaths.jumpLeftSrc, basePaths.jumpLeftSrc),
      duckSrcs: getKuromiRoomSpriteSources(stagePaths.duckSrc, heroicPaths.duckSrc, basePaths.duckSrc),
      duckLeftSrcs: getKuromiRoomSpriteSources(stagePaths.duckLeftSrc, heroicPaths.duckLeftSrc, basePaths.duckLeftSrc),
      lieSrcs: getKuromiRoomSpriteSources(stagePaths.lieSrc, heroicPaths.lieSrc, basePaths.lieSrc),
      lieLeftSrcs: getKuromiRoomSpriteSources(stagePaths.lieLeftSrc, heroicPaths.lieLeftSrc, basePaths.lieLeftSrc)
    };
  }

  function getKuromiRoomSpriteProfile(student = getStudent()) {
    const fallbackPet = getPetInfo('kuromi') || getPetInfo('creeper') || PET_CATALOG[0] || null;
    const pet = getPetInfo(student?.petType) || fallbackPet;
    const petId = pet?.id || 'kuromi';
    const isStudentActivePet = Boolean(student?.petType && petId === student.petType);
    const displayName = isStudentActivePet
      ? (getPetNickname(student, petId) || pet?.name || 'Pet')
      : (pet?.name || 'Pet');
    return getKuromiRoomSpriteProfileForPet(
      petId,
      displayName,
      getStudentDisplayName(student) || student?.studentId || '',
      getInteractionRoomPetStage(student, petId),
      getInteractionRoomPetStyle(student, petId)
    );
  }

  async function loadKuromiRoomSpriteImage(src) {
    if (!src) return null;
    try {
      return await loadCanvasImage(withAssetVersion(src));
    } catch (error) {
      console.info('Pet wall sprite could not be loaded.', src, error);
      return null;
    }
  }

  async function loadKuromiRoomSpriteImageFromSources(srcList = []) {
    const sources = Array.isArray(srcList) ? srcList : [srcList];
    for (const src of sources) {
      const image = await loadKuromiRoomSpriteImage(src);
      if (image) return image;
    }
    return null;
  }

  async function loadKuromiRoomSpriteImages(profile) {
    const [fallback, idle, idleLeft, run, runLeft, jump, jumpLeft, duck, duckLeft, lie, lieLeft] = await Promise.all([
      loadKuromiRoomSpriteImageFromSources(getKuromiRoomProfileSourceList(profile, 'fallbackSrc')),
      loadKuromiRoomSpriteImageFromSources(getKuromiRoomProfileSourceList(profile, 'idleSrc')),
      loadKuromiRoomSpriteImageFromSources(getKuromiRoomProfileSourceList(profile, 'idleLeftSrc')),
      loadKuromiRoomSpriteImageFromSources(getKuromiRoomProfileSourceList(profile, 'runSrc')),
      loadKuromiRoomSpriteImageFromSources(getKuromiRoomProfileSourceList(profile, 'runLeftSrc')),
      loadKuromiRoomSpriteImageFromSources(getKuromiRoomProfileSourceList(profile, 'jumpSrc')),
      loadKuromiRoomSpriteImageFromSources(getKuromiRoomProfileSourceList(profile, 'jumpLeftSrc')),
      loadKuromiRoomSpriteImageFromSources(getKuromiRoomProfileSourceList(profile, 'duckSrc')),
      loadKuromiRoomSpriteImageFromSources(getKuromiRoomProfileSourceList(profile, 'duckLeftSrc')),
      loadKuromiRoomSpriteImageFromSources(getKuromiRoomProfileSourceList(profile, 'lieSrc')),
      loadKuromiRoomSpriteImageFromSources(getKuromiRoomProfileSourceList(profile, 'lieLeftSrc'))
    ]);
    const safeFallback = fallback || idle || run || jump || duck || lie || null;
    return {
      idle: idle || run || safeFallback,
      idleLeft: idleLeft || null,
      run: run || idle || safeFallback,
      runLeft: runLeft || null,
      jump: jump || run || idle || safeFallback,
      jumpLeft: jumpLeft || null,
      duck: duck || idle || run || safeFallback,
      duckLeft: duckLeft || null,
      lie: lie || idle || run || safeFallback,
      lieLeft: lieLeft || null
    };
  }

  function createKuromiRoomPlayer(x = KUROMI_ROOM_DEMO.playerStartX, groundY = KUROMI_ROOM_DEMO.fallbackGroundY) {
    return {
      petId: String(getStudent()?.petType || 'kuromi'),
      studentId: String(getStudent()?.studentId || ''),
      flightGrounded: true,
      duckHeld: false,
      ducking: false,
      lying: false,
      facing: 1,
      fastDropping: false,
      onGround: true,
      velocityX: 0,
      velocityY: 0,
      walkCycle: 0,
      idlePhaseOffset: Math.random() * Math.PI * 2,
      x,
      y: groundY - KUROMI_ROOM_DEMO.runHeight
    };
  }

  function syncKuromiRoomPlayerPetProfile(player, petId, groundY = KUROMI_ROOM_DEMO.fallbackGroundY) {
    if (!player) return;
    const nextPetId = String(petId || getStudent()?.petType || player.petId || 'kuromi').trim().toLowerCase();
    const petChanged = player.petId !== nextPetId;
    const wasFlying = isInteractionRoomFlyingPet(player);
    player.petId = nextPetId;
    player.studentId = String(getStudent()?.studentId || player.studentId || '');
    player.petStage = getInteractionRoomPetStage(getStudent(), nextPetId);
    player.petStyle = getInteractionRoomPetStyle(getStudent(), nextPetId);
    player.petSize = getInteractionRoomSelectedPetSize(getStudent());
    const petSettings = getInteractionRoomPetRenderSettings(player);
    const alwaysFloating = Boolean(petSettings.alwaysFloating);
    if (petSettings.flying) {
      if (alwaysFloating || petChanged || !wasFlying || typeof player.flightGrounded !== 'boolean') player.flightGrounded = false;
      if (player.flightGrounded === false) {
        if (!alwaysFloating) {
          player.duckHeld = false;
          player.ducking = false;
          player.lying = false;
        }
        player.fastDropping = false;
        player.onGround = true;
        player.velocityY = 0;
      }
    } else {
      player.flightGrounded = true;
    }
    if (player.onGround) player.y = groundY - getKuromiRoomPlayerHeight(player);
  }

  function createKuromiRoomKeys() {
    return { left: false, right: false, jump: false, duck: false, lie: false };
  }

  function clampKuromiRoomValue(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function approachKuromiRoomValue(value, target, step) {
    if (value < target) return Math.min(target, value + step);
    return Math.max(target, value - step);
  }

  function normalizeInteractionRoomMapSetId(value = KUROMI_ROOM_DEMO.defaultMapSetId) {
    const safeValue = String(value || '').trim().toLowerCase();
    return KUROMI_ROOM_DEMO.mapSets.some(mapSet => mapSet.id === safeValue)
      ? safeValue
      : KUROMI_ROOM_DEMO.defaultMapSetId;
  }

  function getInteractionRoomMapSetById(value = KUROMI_ROOM_DEMO.defaultMapSetId) {
    const mapSetId = normalizeInteractionRoomMapSetId(value);
    return KUROMI_ROOM_DEMO.mapSets.find(mapSet => mapSet.id === mapSetId) || KUROMI_ROOM_DEMO.mapSets[0];
  }

  function getActiveInteractionRoomMapSetId() {
    return normalizeInteractionRoomMapSetId(interactionRoomState.room?.mapSetId || interactionRoomState.mapSetDraft);
  }

  function getKuromiRoomMaps() {
    return getInteractionRoomMapSetById(getActiveInteractionRoomMapSetId())?.maps || KUROMI_ROOM_DEMO.maps;
  }

  function getKuromiRoomMapIndex(mapIndex = 0) {
    const maps = getKuromiRoomMaps();
    const mapCount = maps.length;
    if (!mapCount) return 0;
    const numericIndex = Number.isFinite(Number(mapIndex)) ? Number(mapIndex) : 0;
    return ((Math.trunc(numericIndex) % mapCount) + mapCount) % mapCount;
  }

  function getKuromiRoomMap(mapIndex = 0) {
    const maps = getKuromiRoomMaps();
    return maps[getKuromiRoomMapIndex(mapIndex)] || maps[0] || KUROMI_ROOM_DEMO.maps[0];
  }

  function getKuromiRoomMapById(mapId = 'home') {
    const safeMapId = String(mapId || 'home');
    const maps = getKuromiRoomMaps();
    return maps.find(map => map.id === safeMapId) || maps[0] || KUROMI_ROOM_DEMO.maps[0];
  }

  function getKuromiRoomActiveMap(state = kuromiRoomDemoState) {
    return getKuromiRoomMap(state?.mapIndex || 0);
  }

  function getKuromiRoomActiveGroundY(state = kuromiRoomDemoState) {
    return getKuromiRoomActiveMap(state)?.groundY || KUROMI_ROOM_DEMO.fallbackGroundY;
  }

  function isKuromiRoomSingleScreenMap(map) {
    return String(map?.backgroundMode || '') === 'single-screen';
  }

  function getKuromiRoomWorldWidthForMap(map) {
    return isKuromiRoomSingleScreenMap(map) ? KUROMI_ROOM_DEMO.viewWidth : KUROMI_ROOM_DEMO.worldWidth;
  }

  function getKuromiRoomPlayerBoundsForMap(map) {
    const worldWidth = getKuromiRoomWorldWidthForMap(map);
    const sidePadding = KUROMI_ROOM_DEMO.playerMinX;
    return {
      minX: sidePadding,
      maxX: Math.max(sidePadding, worldWidth - sidePadding)
    };
  }

  function getKuromiRoomTargetCameraX(map, playerX) {
    if (isKuromiRoomSingleScreenMap(map)) return 0;
    return clampKuromiRoomValue(
      playerX - KUROMI_ROOM_DEMO.viewWidth * 0.44,
      0,
      Math.max(0, getKuromiRoomWorldWidthForMap(map) - KUROMI_ROOM_DEMO.viewWidth)
    );
  }

  function getKuromiRoomActionHeight(action = 'idle') {
    if (action === 'duck') return KUROMI_ROOM_DEMO.duckHeight;
    if (action === 'lie') return KUROMI_ROOM_DEMO.lieHeight;
    return KUROMI_ROOM_DEMO.runHeight;
  }

  function getKuromiRoomActionWidth(action = 'idle') {
    if (action === 'duck') return KUROMI_ROOM_DEMO.duckWidth;
    if (action === 'lie') return KUROMI_ROOM_DEMO.lieWidth;
    return KUROMI_ROOM_DEMO.runWidth;
  }

  function getKuromiRoomPlayerAction(player) {
    if (player?.lying) return 'lie';
    if (player?.ducking) return 'duck';
    if (isInteractionRoomAlwaysFloatingPet(player) && Math.abs(Number(player?.velocityX || 0)) > KUROMI_ROOM_DEMO.walkingVelocityThreshold) return 'walk';
    if (player?.flightGrounded === false) return 'fly';
    if (player && !player.onGround) return 'jump';
    if (Math.abs(Number(player?.velocityX || 0)) > KUROMI_ROOM_DEMO.walkingVelocityThreshold) return 'walk';
    return 'idle';
  }

  function getKuromiRoomPlayerHeight(player) {
    return getKuromiRoomActionHeight(getKuromiRoomPlayerAction(player));
  }

  function getKuromiRoomPlayerWidth(player) {
    return getKuromiRoomActionWidth(getKuromiRoomPlayerAction(player));
  }

  function clearKuromiRoomRestPose(player, groundY = KUROMI_ROOM_DEMO.fallbackGroundY) {
    if (!player) return;
    const wasResting = player.lying;
    player.lying = false;
    if (wasResting && player.onGround) {
      player.y = groundY - getKuromiRoomPlayerHeight(player);
    }
  }

  function setKuromiRoomLie(player, lying, groundY = KUROMI_ROOM_DEMO.fallbackGroundY) {
    if (!player) return;
    player.duckHeld = false;
    player.ducking = false;
    player.fastDropping = false;
    player.lying = Boolean(lying);
    player.onGround = true;
    player.velocityX = 0;
    player.velocityY = 0;
    player.walkCycle = 0;
    player.y = groundY - getKuromiRoomPlayerHeight(player);
  }

  function setKuromiRoomDuck(player, ducking, groundY = KUROMI_ROOM_DEMO.fallbackGroundY) {
    const petSettings = getInteractionRoomPetRenderSettings(player);
    if (petSettings.flying && petSettings.alwaysFloating) {
      player.flightGrounded = false;
      player.duckHeld = Boolean(ducking);
      player.ducking = Boolean(ducking);
      player.fastDropping = false;
      if (ducking) player.lying = false;
      player.onGround = true;
      player.velocityY = 0;
      player.y = groundY - getKuromiRoomPlayerHeight(player);
      return;
    }
    if (petSettings.flying && player.flightGrounded === false) {
      if (ducking) setKuromiRoomFlightGrounded(player, true, groundY);
      return;
    }
    player.duckHeld = ducking;
    if (ducking) clearKuromiRoomRestPose(player, groundY);
    if (player.onGround) {
      player.ducking = ducking;
      player.y = groundY - getKuromiRoomPlayerHeight(player);
      return;
    }
    player.fastDropping = ducking;
    if (ducking) player.velocityY = Math.max(player.velocityY, KUROMI_ROOM_DEMO.fastDropMinVelocity);
  }

  function setKuromiRoomFlightGrounded(player, grounded, groundY = KUROMI_ROOM_DEMO.fallbackGroundY) {
    if (!player) return;
    const petSettings = getInteractionRoomPetRenderSettings(player);
    player.flightGrounded = petSettings.alwaysFloating ? false : Boolean(grounded);
    player.duckHeld = false;
    player.ducking = false;
    player.fastDropping = false;
    player.lying = false;
    player.onGround = true;
    player.velocityY = 0;
    player.y = groundY - getKuromiRoomPlayerHeight(player);
  }

  function startKuromiRoomJump(player) {
    if (isInteractionRoomFlyingPet(player)) {
      setKuromiRoomFlightGrounded(player, false, getKuromiRoomActiveGroundY(kuromiRoomDemoState));
      return;
    }
    if (!player.onGround) return;
    clearKuromiRoomRestPose(player, getKuromiRoomActiveGroundY(kuromiRoomDemoState));
    player.ducking = false;
    player.fastDropping = false;
    player.onGround = false;
    player.velocityY = KUROMI_ROOM_DEMO.jumpVelocity;
  }

  function mapKuromiRoomKeyboardKey(key) {
    if (key === 'ArrowLeft' || key.toLowerCase() === 'a') return 'left';
    if (key === 'ArrowRight' || key.toLowerCase() === 'd') return 'right';
    if (key === 'ArrowUp' || key === ' ' || key.toLowerCase() === 'w') return 'jump';
    if (key === 'ArrowDown' || key.toLowerCase() === 's') return 'duck';
    if (key.toLowerCase() === 'l') return 'lie';
    return null;
  }

  function updateKuromiRoomControlsUi() {
    const keys = kuromiRoomDemoState?.keys || {};
    const state = kuromiRoomDemoState;
    const player = state?.player || null;
    $all('[data-kuromi-control]').forEach(button => {
      const key = button.dataset.kuromiControl;
      const isFlyingPet = isInteractionRoomFlyingPet(player);
      const alwaysFloating = isInteractionRoomAlwaysFloatingPet(player);
      button.classList.toggle('is-pressed', Boolean(keys[key]));
      button.setAttribute('aria-pressed', String(Boolean(keys[key])));
      if (key === 'jump' && isFlyingPet) {
        button.textContent = '↑';
        button.setAttribute('aria-label', localize('飞回空中'));
      }
      if (key === 'duck') {
        button.textContent = '↓';
        button.setAttribute('aria-label', localize(alwaysFloating ? '下沉' : (isFlyingPet ? '回到地面' : '蹲下')));
        button.classList.remove('kuromi-control-button-text');
      }
      if (key === 'lie') {
        button.textContent = localize(player?.lying ? '起' : '躺');
        button.setAttribute('aria-label', localize(player?.lying ? '站起' : '躺下'));
        button.classList.add('kuromi-control-button-text');
      }
    });
  }

  function setKuromiRoomControl(key, value) {
    const state = kuromiRoomDemoState;
    if (!state || session.activeView !== 'guide-view') return;
    if (!Object.prototype.hasOwnProperty.call(state.keys, key)) return;
    state.keys[key] = Boolean(value);
    const groundY = getKuromiRoomActiveGroundY(state);
    if ((key === 'left' || key === 'right') && value) {
      clearKuromiRoomRestPose(state.player, groundY);
    }
    if (key === 'jump' && value) startKuromiRoomJump(state.player);
    if (key === 'duck') {
      if (value && state.player.lying) clearKuromiRoomRestPose(state.player, groundY);
      setKuromiRoomDuck(state.player, Boolean(value), groundY);
    }
    if (key === 'lie' && value) {
      setKuromiRoomLie(state.player, !state.player.lying, groundY);
      state.keys.lie = false;
    }
    updateKuromiRoomControlsUi();
  }

  function releaseKuromiRoomControls() {
    const state = kuromiRoomDemoState;
    if (!state) return;
    state.keys.left = false;
    state.keys.right = false;
    state.keys.jump = false;
    state.keys.duck = false;
    state.keys.lie = false;
    setKuromiRoomDuck(state.player, false, getKuromiRoomActiveGroundY(state));
    updateKuromiRoomControlsUi();
  }

  function getKuromiRoomControlTarget(event) {
    return event?.target?.closest?.('[data-kuromi-control]');
  }

  function isKuromiRoomFullscreenMode() {
    return document.body.classList.contains('kuromi-room-fullscreen-mode');
  }

  function isKuromiRoomChatOpen() {
    return document.body.classList.contains('kuromi-room-chat-open');
  }

  function updateKuromiRoomChatToggleUi() {
    const button = $('#kuromi-room-chat-toggle');
    if (!button) return;
    const active = isKuromiRoomChatOpen();
    button.setAttribute('aria-expanded', String(active));
    button.setAttribute('aria-label', localize(active ? '关闭聊天' : '打开聊天'));
    button.classList.toggle('is-open', active);
  }

  function setKuromiRoomChatOpen(open, options = {}) {
    interactionRoomState.chatOpen = Boolean(open);
    document.body.classList.toggle('kuromi-room-chat-open', interactionRoomState.chatOpen);
    updateKuromiRoomChatToggleUi();
    if (!interactionRoomState.chatOpen) {
      const input = $('#kuromi-room-chat-panel input[name="kuromiMessage"]');
      input?.blur?.();
      return;
    }
    if (options.focus === false) return;
    requestAnimationFrame(() => {
      const input = $('#kuromi-room-chat-panel input[name="kuromiMessage"]');
      input?.focus?.({ preventScroll: true });
    });
  }

  function toggleKuromiRoomChatPanel() {
    setKuromiRoomChatOpen(!isKuromiRoomChatOpen(), { focus: true });
  }

  function closeKuromiRoomChatFromStage(event) {
    if (!isKuromiRoomFullscreenMode() || !isKuromiRoomChatOpen()) return false;
    if (!event?.target?.closest?.('#pet-interaction-stage, #kuromi-room-canvas')) return false;
    if (event.target.closest('.kuromi-room-chat-panel, .kuromi-room-chat-toggle, .kuromi-room-controls, .kuromi-room-fullscreen-button')) return false;
    setKuromiRoomChatOpen(false, { focus: false });
    return true;
  }

  function updateKuromiRoomFullscreenUi() {
    const button = $('#kuromi-room-fullscreen-button');
    const active = isKuromiRoomFullscreenMode();
    if (button) {
      button.textContent = localize(active ? '× 退出' : '全屏横屏');
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', localize(active ? '退出全屏' : '进入全屏横屏'));
      button.classList.toggle('is-exit-mode', active);
    }
    updateKuromiRoomChatToggleUi();
  }

  async function enterKuromiRoomFullscreen() {
    const target = $('.kuromi-room-panel') || $('#pet-interaction-stage');
    if (!target) return;
    document.body.classList.add('kuromi-room-fullscreen-mode');
    updateKuromiRoomFullscreenUi();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      if (target.requestFullscreen && !document.fullscreenElement) {
        await target.requestFullscreen({ navigationUI: 'hide' });
        kuromiRoomNativeFullscreenActive = true;
      }
    } catch (error) {
      kuromiRoomNativeFullscreenActive = false;
      console.info('Native fullscreen is not available on this device.', error);
    }
    try {
      if (screen.orientation?.lock) await screen.orientation.lock('landscape');
    } catch (error) {
      console.info('Landscape orientation lock is not available on this device.', error);
    }
    initKuromiRoomDemo();
  }

  async function exitKuromiRoomFullscreen(options = {}) {
    document.body.classList.remove('kuromi-room-fullscreen-mode');
    setKuromiRoomChatOpen(false, { focus: false });
    updateKuromiRoomFullscreenUi();
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch (error) {
      console.info('Could not exit native fullscreen cleanly.', error);
    }
    try {
      if (screen.orientation?.unlock) screen.orientation.unlock();
    } catch (error) {
      console.info('Could not unlock screen orientation.', error);
    }
    kuromiRoomNativeFullscreenActive = false;
    if (options.restartDemo !== false) initKuromiRoomDemo();
  }

  function toggleKuromiRoomFullscreen() {
    if (isKuromiRoomFullscreenMode()) return exitKuromiRoomFullscreen();
    return enterKuromiRoomFullscreen();
  }

  function bindKuromiRoomDemoInput() {
    if (kuromiRoomInputBound) return;
    kuromiRoomInputBound = true;
    const preventControlDefault = event => {
      if (!getKuromiRoomControlTarget(event)) return;
      event.preventDefault();
    };
    document.addEventListener('pointerdown', event => {
      if (closeKuromiRoomChatFromStage(event)) return;
      const button = getKuromiRoomControlTarget(event);
      if (!button) return;
      event.preventDefault();
      try {
        if (event.pointerId !== undefined && button.setPointerCapture) button.setPointerCapture(event.pointerId);
      } catch (error) {
        console.info('Pointer capture is not available for this control.', error);
      }
      setKuromiRoomControl(button.dataset.kuromiControl, true);
    });
    document.addEventListener('pointerup', releaseKuromiRoomControls);
    document.addEventListener('pointercancel', releaseKuromiRoomControls);
    document.addEventListener('pointerleave', event => {
      if (getKuromiRoomControlTarget(event)) releaseKuromiRoomControls();
    }, true);
    document.addEventListener('touchstart', preventControlDefault, { passive: false, capture: true });
    document.addEventListener('touchmove', preventControlDefault, { passive: false, capture: true });
    document.addEventListener('selectstart', preventControlDefault, true);
    document.addEventListener('contextmenu', preventControlDefault, true);
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && kuromiRoomNativeFullscreenActive) {
        kuromiRoomNativeFullscreenActive = false;
        document.body.classList.remove('kuromi-room-fullscreen-mode');
        setKuromiRoomChatOpen(false, { focus: false });
        updateKuromiRoomFullscreenUi();
      }
      if (!document.fullscreenElement && miniGameNativeFullscreenActive) {
        miniGameNativeFullscreenActive = false;
        document.body.classList.remove('mini-game-fullscreen-mode');
        updateMiniGameFullscreenUi();
      }
    });
    window.addEventListener('keydown', event => {
      const activeTag = document.activeElement?.tagName;
      const editingText = Boolean(activeTag && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag));
      if (editingText) return;
      if (event.key === 'Escape' && isKuromiRoomFullscreenMode()) {
        event.preventDefault();
        exitKuromiRoomFullscreen();
        return;
      }
      const key = mapKuromiRoomKeyboardKey(event.key);
      if (!key) return;
      event.preventDefault();
      if (!kuromiRoomDemoState?.keys[key]) setKuromiRoomControl(key, true);
    });
    window.addEventListener('keyup', event => {
      const key = mapKuromiRoomKeyboardKey(event.key);
      if (!key) return;
      event.preventDefault();
      setKuromiRoomControl(key, false);
    });
  }

  function bindMiniGameKeyboardInput() {
    if (miniGameInputBound) return;
    miniGameInputBound = true;
    const isEditingText = () => {
      const activeTag = document.activeElement?.tagName;
      return Boolean(activeTag && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag));
    };
    const isJumpKey = event => (
      event.key === ' ' ||
      event.key === 'Enter' ||
      event.key === 'ArrowUp' ||
      event.code === 'Space' ||
      event.code === 'ArrowUp' ||
      event.code === 'KeyW' ||
      String(event.key || '').toLowerCase() === 'w'
    );
    const isDuckKey = event => (
      event.key === 'ArrowDown' ||
      event.code === 'ArrowDown' ||
      event.code === 'KeyS' ||
      String(event.key || '').toLowerCase() === 's'
    );
    window.addEventListener('keydown', event => {
      if (!isMiniGameSurfaceOpen() || isEditingText()) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        if (isMiniGameFullscreenMode()) void exitMiniGameFullscreen();
        else closeMiniGameOverlay();
        return;
      }
      if (miniGameState.type === 'runner') {
        if (isJumpKey(event)) {
          event.preventDefault();
          pressRunnerMiniGameJump(true);
          return;
        }
        if (isDuckKey(event)) {
          event.preventDefault();
          setRunnerMiniGameDuck(true);
          return;
        }
      } else if (miniGameState.type === 'jumpCharge') {
        if (isJumpKey(event)) {
          event.preventDefault();
          if (!event.repeat) startJumpChargeMiniGameCharge(event);
          return;
        }
      } else if (isJumpKey(event)) {
        event.preventDefault();
        runMiniGamePrimaryAction();
      }
    });
    window.addEventListener('keyup', event => {
      if (!isMiniGameSurfaceOpen()) return;
      if (miniGameState.type === 'runner') {
        if (isJumpKey(event)) {
          event.preventDefault();
          pressRunnerMiniGameJump(false);
          return;
        }
        if (isDuckKey(event)) {
          event.preventDefault();
          setRunnerMiniGameDuck(false);
        }
        return;
      }
      if (miniGameState.type === 'jumpCharge' && isJumpKey(event)) {
        event.preventDefault();
        releaseJumpChargeMiniGame();
      }
    });
  }

  function updateKuromiRoomPlayer(player, keys, delta, groundY = KUROMI_ROOM_DEMO.fallbackGroundY, map = getKuromiRoomActiveMap()) {
    const safeDelta = Math.min(delta, 0.034);
    const bounds = getKuromiRoomPlayerBoundsForMap(map);
    const movingLeft = keys.left && !keys.right;
    const movingRight = keys.right && !keys.left;
    if (player.lying && !movingLeft && !movingRight && player.onGround) {
      player.velocityX = 0;
      player.velocityY = 0;
      player.fastDropping = false;
      player.ducking = false;
      player.duckHeld = false;
      player.walkCycle = approachKuromiRoomValue(player.walkCycle, 0, KUROMI_ROOM_DEMO.walkSettleSpeed * safeDelta);
      player.y = groundY - getKuromiRoomPlayerHeight(player);
      return;
    }
    const moveSpeed = player.ducking && player.onGround ? KUROMI_ROOM_DEMO.duckSpeed : KUROMI_ROOM_DEMO.walkSpeed;
    let targetVelocity = 0;
    if (movingLeft) {
      targetVelocity = -moveSpeed;
      player.facing = -1;
    }
    if (movingRight) {
      targetVelocity = moveSpeed;
      player.facing = 1;
    }
    player.velocityX = approachKuromiRoomValue(
      player.velocityX,
      targetVelocity,
      (targetVelocity === 0 ? KUROMI_ROOM_DEMO.friction : KUROMI_ROOM_DEMO.acceleration) * safeDelta
    );
    player.x = clampKuromiRoomValue(player.x + player.velocityX * safeDelta, bounds.minX, bounds.maxX);
    const walkingOnGround = Math.abs(player.velocityX) > KUROMI_ROOM_DEMO.walkingVelocityThreshold && player.onGround && !player.ducking;
    if (walkingOnGround) {
      player.walkCycle = (player.walkCycle + Math.abs(player.velocityX) * safeDelta * KUROMI_ROOM_DEMO.walkCycleSpeed) % (Math.PI * 2);
    } else {
      player.walkCycle = approachKuromiRoomValue(player.walkCycle, 0, KUROMI_ROOM_DEMO.walkSettleSpeed * safeDelta);
    }
    if (!player.onGround) {
      if (player.fastDropping) player.velocityY = Math.max(player.velocityY, KUROMI_ROOM_DEMO.fastDropMinVelocity);
      player.velocityY += (player.fastDropping ? KUROMI_ROOM_DEMO.fastDropGravity : KUROMI_ROOM_DEMO.gravity) * safeDelta;
      player.y += player.velocityY * safeDelta;
    }
    const height = getKuromiRoomPlayerHeight(player);
    if (player.y + height >= groundY) {
      player.onGround = true;
      player.fastDropping = false;
      player.velocityY = 0;
      player.ducking = player.duckHeld;
      player.y = groundY - getKuromiRoomPlayerHeight(player);
    }
  }

  function moveKuromiRoomToMap(state, nextMapIndex, nextPlayerX) {
    if (!state) return;
    const player = state.player;
    const nextIndex = getKuromiRoomMapIndex(nextMapIndex);
    const nextMap = getKuromiRoomMap(nextIndex);
    const nextBounds = getKuromiRoomPlayerBoundsForMap(nextMap);
    state.mapIndex = nextIndex;
    player.x = clampKuromiRoomValue(nextPlayerX, nextBounds.minX, nextBounds.maxX);
    player.onGround = true;
    if (isInteractionRoomAlwaysFloatingPet(player)) player.flightGrounded = false;
    player.fastDropping = false;
    player.lying = false;
    player.velocityY = 0;
    player.ducking = player.duckHeld;
    player.y = nextMap.groundY - getKuromiRoomPlayerHeight(player);
    if (state.keys.left && !state.keys.right) {
      player.facing = -1;
      player.velocityX = -KUROMI_ROOM_DEMO.walkSpeed * 0.35;
    } else if (state.keys.right && !state.keys.left) {
      player.facing = 1;
      player.velocityX = KUROMI_ROOM_DEMO.walkSpeed * 0.35;
    } else {
      player.velocityX *= 0.28;
    }
    state.cameraX = getKuromiRoomTargetCameraX(nextMap, player.x);
    state.mapBubbleText = nextMap.shortTitle;
    state.mapBubbleUntil = performance.now() + 1500;
  }

  function handleKuromiRoomMapTransition(state) {
    if (!state) return;
    const { player } = state;
    const map = getKuromiRoomActiveMap(state);
    const bounds = getKuromiRoomPlayerBoundsForMap(map);
    const edgePadding = KUROMI_ROOM_DEMO.transitionEdgePadding;
    if (player.velocityX > 0 && player.x >= bounds.maxX - edgePadding) {
      const nextMap = getKuromiRoomMap((state.mapIndex || 0) + 1);
      const nextBounds = getKuromiRoomPlayerBoundsForMap(nextMap);
      moveKuromiRoomToMap(state, (state.mapIndex || 0) + 1, nextBounds.minX + edgePadding);
    } else if (player.velocityX < 0 && player.x <= bounds.minX + edgePadding) {
      const nextMap = getKuromiRoomMap((state.mapIndex || 0) - 1);
      const nextBounds = getKuromiRoomPlayerBoundsForMap(nextMap);
      moveKuromiRoomToMap(state, (state.mapIndex || 0) - 1, nextBounds.maxX - edgePadding);
    }
  }

  function drawKuromiRoomCoverImage(ctx, image, width, height, offsetY = 0) {
    const imageRatio = image.width / image.height;
    const targetRatio = width / height;
    let sourceWidth = image.width;
    let sourceHeight = image.height;
    let sourceX = 0;
    let sourceY = 0;
    if (imageRatio > targetRatio) {
      sourceWidth = image.height * targetRatio;
      sourceX = (image.width - sourceWidth) / 2;
    } else {
      sourceHeight = image.width / targetRatio;
      sourceY = (image.height - sourceHeight) * 0.58;
    }
    sourceY = clampKuromiRoomValue(sourceY + offsetY, 0, image.height - sourceHeight);
    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
  }

  function drawKuromiRoomFitImage(ctx, image, width, height) {
    const scale = Math.min(width / Math.max(1, image.width), height / Math.max(1, image.height));
    const drawWidth = Math.max(1, image.width * scale);
    const drawHeight = Math.max(1, image.height * scale);
    const drawX = (width - drawWidth) / 2;
    const drawY = height - drawHeight;
    ctx.drawImage(image, 0, 0, image.width, image.height, drawX, drawY, drawWidth, drawHeight);
  }

  function drawKuromiRoomFallbackBackground(ctx, map, width = KUROMI_ROOM_DEMO.worldWidth) {
    const fallback = ctx.createLinearGradient(0, 0, 0, KUROMI_ROOM_DEMO.viewHeight);
    fallback.addColorStop(0, map?.fallbackTop || '#2c2131');
    fallback.addColorStop(0.58, map?.fallbackMiddle || '#f4c7ce');
    fallback.addColorStop(1, map?.fallbackFloor || '#e6b47e');
    ctx.fillStyle = fallback;
    ctx.fillRect(0, 0, width, KUROMI_ROOM_DEMO.viewHeight);
  }

  function drawKuromiRoomBackground(ctx, image, map) {
    if (isKuromiRoomSingleScreenMap(map)) {
      drawKuromiRoomFallbackBackground(ctx, map, KUROMI_ROOM_DEMO.viewWidth);
      if (image) drawKuromiRoomFitImage(ctx, image, KUROMI_ROOM_DEMO.viewWidth, KUROMI_ROOM_DEMO.viewHeight);
      return;
    }
    if (image) {
      drawKuromiRoomCoverImage(ctx, image, KUROMI_ROOM_DEMO.worldWidth, KUROMI_ROOM_DEMO.viewHeight, map?.backgroundOffsetY || 0);
      return;
    }
    drawKuromiRoomFallbackBackground(ctx, map);
  }

  function getKuromiRoomSpriteTrimBounds(image) {
    const fallback = { topInset: 0, rightInset: 0, bottomInset: 0, leftInset: 0 };
    if (!image) return fallback;
    const cached = KUROMI_ROOM_SPRITE_TRIM_CACHE.get(image);
    if (cached) return cached;
    const width = Math.round(image.naturalWidth || image.width || 0);
    const height = Math.round(image.naturalHeight || image.height || 0);
    if (!width || !height) return fallback;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const trimCtx = canvas.getContext('2d', { willReadFrequently: true });
      if (!trimCtx) return fallback;
      trimCtx.drawImage(image, 0, 0, width, height);
      const pixels = trimCtx.getImageData(0, 0, width, height).data;
      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          if (pixels[(y * width + x) * 4 + 3] <= 8) continue;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
      const bounds = maxY >= 0
        ? { topInset: minY, rightInset: width - 1 - maxX, bottomInset: height - 1 - maxY, leftInset: minX }
        : fallback;
      KUROMI_ROOM_SPRITE_TRIM_CACHE.set(image, bounds);
      return bounds;
    } catch (error) {
      KUROMI_ROOM_SPRITE_TRIM_CACHE.set(image, fallback);
      return fallback;
    }
  }

  function drawKuromiRoomPlayer(ctx, player, sprites, groundY = KUROMI_ROOM_DEMO.fallbackGroundY, now = 0, options = {}) {
    const action = getKuromiRoomPlayerAction(player);
    const isDucking = action === 'duck';
    const isLying = action === 'lie';
    const renderScale = Math.max(0.35, Math.min(INTERACTION_ROOM_MAX_RENDER_SCALE, Number(options.scale || 1)));
    const renderFloatOffset = Math.max(0, Math.min(INTERACTION_ROOM_MAX_FLOAT_OFFSET, Number(options.floatOffset || 0)));
    const widthMultiplier = Math.max(0.6, Math.min(INTERACTION_ROOM_MAX_SPRITE_WIDTH_MULTIPLIER, Number(options.widthMultiplier || 1)));
    const heightMultiplier = Math.max(0.6, Math.min(INTERACTION_ROOM_MAX_SPRITE_HEIGHT_MULTIPLIER, Number(options.heightMultiplier || 1)));
    const baseWidth = getKuromiRoomPlayerWidth(player);
    const baseHeight = getKuromiRoomPlayerHeight(player);
    const width = baseWidth * renderScale * widthMultiplier;
    const height = baseHeight * renderScale * heightMultiplier;
    const walking = action === 'walk';
    const alwaysFloating = Boolean(options.alwaysFloating);
    const visualAirborne = action === 'fly' || !player.onGround || Boolean(options.flying);
    const flyingSprite = action === 'fly';
    const idleSwaying = action === 'idle' && player.onGround;
    const facingSign = Number(player.facing || 1) < 0 ? -1 : 1;
    const rightSprite = isLying
      ? (sprites.lie || sprites.idle || sprites.run)
      : isDucking
        ? (sprites.duck || sprites.idle || sprites.run)
        : (flyingSprite
          ? (sprites.run || sprites.jump || sprites.idle)
          : visualAirborne
          ? (sprites.jump || sprites.run || sprites.idle)
          : (walking ? (sprites.run || sprites.idle) : (sprites.idle || sprites.run)));
    const leftSprite = isLying
      ? (sprites.lieLeft || sprites.idleLeft || sprites.runLeft)
      : isDucking
        ? (sprites.duckLeft || sprites.idleLeft || sprites.runLeft)
        : (flyingSprite
          ? (sprites.runLeft || sprites.jumpLeft || sprites.idleLeft)
          : visualAirborne
          ? (sprites.jumpLeft || sprites.runLeft || sprites.idleLeft)
          : (walking ? (sprites.runLeft || sprites.idleLeft) : (sprites.idleLeft || sprites.runLeft)));
    const useLeftSprite = facingSign < 0 && Boolean(leftSprite);
    const sprite = useLeftSprite ? leftSprite : rightSprite;
    const hoverGlide = alwaysFloating && walking ? Math.min(1, Math.abs(Number(player.velocityX || 0)) / Math.max(1, KUROMI_ROOM_DEMO.walkSpeed)) : 0;
    const stepPulse = walking && !alwaysFloating ? Math.abs(Math.sin(player.walkCycle)) : 0;
    const stride = walking && !alwaysFloating ? Math.sin(player.walkCycle) : 0;
    const idlePhase = idleSwaying ? (now * KUROMI_ROOM_DEMO.idleSwaySpeed + Number(player.idlePhaseOffset || 0)) : 0;
    const idleWave = idleSwaying ? Math.sin(idlePhase) : 0;
    const idleBreath = idleSwaying ? Math.sin(idlePhase * 1.34) : 0;
    const floatPhase = now * (alwaysFloating && walking ? 0.0042 : 0.003) + Number(player.idlePhaseOffset || 0);
    const floatBob = renderFloatOffset ? Math.sin(floatPhase) * (options.flying ? (alwaysFloating ? 9 : 7) : 4) : 0;
    const defaultLiftMultiplier = renderScale > 1.05 && !renderFloatOffset ? 0.15 : 1;
    const liftMultiplier = Math.max(0, Math.min(1, Number(options.liftMultiplier ?? defaultLiftMultiplier)));
    const lift = (stepPulse * 5.5 + (idleSwaying ? Math.max(0, idleBreath) * KUROMI_ROOM_DEMO.idleBobPixels : 0)) * liftMultiplier;
    const sway = stride * 3 + idleWave * KUROMI_ROOM_DEMO.idleSwayPixels;
    const tilt = hoverGlide
      ? Number(options.hoverTilt || 0.09) * facingSign * hoverGlide
      : (walking
        ? stride * 0.04 * facingSign
        : (player.onGround ? idleWave * KUROMI_ROOM_DEMO.idleTiltRadians * facingSign : -0.055 * facingSign));
    const scaleX = walking ? 1 - stepPulse * 0.018 : (idleSwaying ? 1 + idleBreath * 0.006 : 1);
    const scaleY = walking ? 1 + stepPulse * 0.026 : (idleSwaying ? 1 - idleBreath * 0.01 : 1);
    const spriteDirectionScale = facingSign < 0 && !useLeftSprite ? -1 : 1;
    const drawCenterX = player.x + sway;
    const spriteTrimBounds = sprite ? getKuromiRoomSpriteTrimBounds(sprite) : null;
    const visibleTopOffset = sprite && sprite.height ? (spriteTrimBounds.topInset / sprite.height) * height : 0;
    const visibleBottomOffset = sprite && sprite.height ? (spriteTrimBounds.bottomInset / sprite.height) * height : 0;
    const footAnchorOffset = sprite && sprite.height ? (spriteTrimBounds.bottomInset / sprite.height) * height : 0;
    const drawBaseY = player.y + baseHeight - lift + footAnchorOffset - renderFloatOffset + floatBob;
    ctx.save();
    ctx.globalAlpha = renderFloatOffset ? 0.14 : 0.25;
    ctx.fillStyle = '#1f1824';
    ctx.beginPath();
    ctx.ellipse(player.x, groundY - 4, width * (isLying ? 0.32 : (renderFloatOffset ? 0.2 : (0.28 - stepPulse * 0.04))), isLying ? 5 : (renderFloatOffset ? 4 : 7), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(drawCenterX, drawBaseY);
    ctx.rotate(tilt);
    ctx.scale(spriteDirectionScale * scaleX, scaleY);
    if (sprite) {
      ctx.drawImage(sprite, -width / 2, -height, width, height);
    } else {
      ctx.fillStyle = '#2b2332';
      ctx.fillRect(-width / 2 + 18, -height + 18, width - 36, height - 24);
      ctx.fillStyle = '#f49abc';
      ctx.fillRect(-width / 2 + 38, -height + 48, width - 58, height - 56);
    }
    ctx.restore();
    return {
      x: drawCenterX,
      baseY: drawBaseY,
      width,
      height,
      visibleTopY: drawBaseY - height + visibleTopOffset,
      visibleBottomY: drawBaseY - visibleBottomOffset,
      renderScale,
      renderFloatOffset,
      widthMultiplier,
      heightMultiplier,
      flying: action === 'fly' || Boolean(options.flying)
    };
  }

  function drawInteractionRoomRemotePlayers(ctx, state, map, now) {
    const currentStudentId = HolidayBackendClient.normalizeId(getStudent()?.studentId);
    const mapId = String(map?.id || 'home');
    const activeKeys = new Set();
    const memberLimit = Math.max(1, Number(interactionRoomState.room?.memberLimit || ROOM_MEMBER_LIMIT));
    const players = (interactionRoomState.players || [])
      .filter(player => HolidayBackendClient.normalizeId(player.studentId) !== currentStudentId)
      .slice(0, Math.max(0, memberLimit - 1));
    const visiblePlayers = [];
    players.forEach((remote, index) => {
      const renderState = syncInteractionRoomRemoteRenderPlayer(remote, index, now);
      if (!renderState) return;
      activeKeys.add(renderState.key);
      if (String(renderState.mapId || 'home') === mapId) visiblePlayers.push({ remote, renderState, index });
    });
    pruneInteractionRoomRemoteRenderPlayers(activeKeys, now);
    visiblePlayers.forEach(({ remote, renderState, index }) => {
      const petId = String(remote.petId || 'kuromi');
      const spriteCacheKey = getKuromiRoomSpriteCacheKey(petId, getInteractionRoomPlayerPetStage(remote), getInteractionRoomPlayerPetStyle(remote));
      const sprites = interactionRoomSpriteCache.get(spriteCacheKey);
      const action = String(remote.action || 'idle');
      const height = getKuromiRoomActionHeight(action);
      const groundY = map.groundY || KUROMI_ROOM_DEMO.fallbackGroundY;
      const displayX = Number(renderState.displayX || KUROMI_ROOM_DEMO.playerStartX);
      const displayY = Number(renderState.displayY || (groundY - height));
      const remotePlayer = {
        petId,
        action,
        flightGrounded: isInteractionRoomAlwaysFloatingPet(remote) ? false : action !== 'fly',
        ducking: action === 'duck',
        lying: action === 'lie',
        onGround: isInteractionRoomAlwaysFloatingPet(remote) ? true : action !== 'jump' && action !== 'fly',
        facing: Number(renderState.facing || remote.facing || 1) < 0 ? -1 : 1,
        velocityX: Number(renderState.visualVelocityX || 0),
        velocityY: 0,
        walkCycle: Number(renderState.walkCycle || 0),
        idlePhaseOffset: Number(renderState.idlePhaseOffset || index * 0.9),
        x: displayX,
        y: displayY
      };
      const renderScale = getInteractionRoomPlayerRenderScale(remote);
      const renderFloatOffset = getInteractionRoomPlayerFloatOffset(remote, action, groundY, renderScale);
      const alwaysFloating = isInteractionRoomAlwaysFloatingPet(remote);
      const renderSettings = getInteractionRoomPetRenderSettings(remote);
      const playerBounds = drawKuromiRoomPlayer(ctx, remotePlayer, sprites || {}, groundY, now, {
        scale: renderScale,
        floatOffset: renderFloatOffset,
        flying: action === 'fly' || alwaysFloating,
        alwaysFloating,
        hoverTilt: renderSettings.hoverTilt,
        widthMultiplier: renderSettings.widthMultiplier,
        heightMultiplier: renderSettings.heightMultiplier
      });
      if (action === 'lie') drawKuromiRoomSleepZzz(ctx, displayX, displayY, now, { compact: true });
      const headName = getInteractionRoomPlayerHeadParts(remote);
      const labelY = getKuromiRoomPlayerLabelY(playerBounds, displayY - 12);
      drawKuromiRoomLabel(ctx, headName.petName, displayX, labelY, {
        subtext: headName.playerName,
        fontSize: 15,
        subFontSize: 10,
        maxWidth: 230,
        maxChars: 20,
        subMaxChars: 20,
        lineGap: 2,
        background: 'rgba(255,255,255,.9)',
        color: '#2f6e4a'
      });
      const messageUntil = Date.parse(remote.messageUntil || '');
      if (remote.message && Number.isFinite(messageUntil) && messageUntil > Date.now()) {
        const speechBubbleY = getKuromiRoomSpeechBubbleY(labelY, playerBounds);
        drawKuromiRoomLabel(ctx, remote.message, displayX, speechBubbleY, {
          fontSize: 17,
          paddingX: 16,
          paddingY: 9,
          maxWidth: 380,
          maxChars: 24,
          background: 'rgba(255, 246, 255, .95)',
          border: 'rgba(244, 194, 232, .88)',
          color: '#5b2f69'
        });
      }
    });
  }

  function drawKuromiRoomRoundedRect(ctx, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + safeRadius, y);
    ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
    ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
    ctx.arcTo(x, y + height, x, y, safeRadius);
    ctx.arcTo(x, y, x + width, y, safeRadius);
    ctx.closePath();
  }

  function drawKuromiRoomSleepZzz(ctx, x, y, now = 0, options = {}) {
    const compact = Boolean(options.compact);
    const marks = compact ? ['Z', 'z'] : ['Z', 'z', 'z'];
    const phase = now / 700;
    const baseY = y + (compact ? 22 : 26);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    marks.forEach((mark, index) => {
      const float = Math.sin(phase + index * 0.85) * 4 - index * 12;
      const drift = index * 18 + Math.cos(phase + index) * 3;
      const fontSize = (compact ? 14 : 18) - index * 2;
      const alpha = Math.max(0.48, 0.9 - index * 0.16);
      ctx.font = `1000 ${fontSize}px "Avenir Next", "PingFang SC", sans-serif`;
      ctx.lineWidth = 3;
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillStyle = `rgba(91,79,213,${alpha})`;
      ctx.strokeText(mark, x + drift, baseY + float);
      ctx.fillText(mark, x + drift, baseY + float);
    });
    ctx.restore();
  }

  function drawKuromiRoomLabel(ctx, text, x, y, options = {}) {
    const label = String(text || '').trim();
    if (!label) return;
    const fontSize = options.fontSize || 17;
    const subFontSize = options.subFontSize || Math.max(10, Math.round(fontSize * 0.72));
    const paddingX = options.paddingX || 14;
    const paddingY = options.paddingY || 7;
    const maxWidth = options.maxWidth || 320;
    const maxChars = options.maxChars || 32;
    const displayText = label.length > maxChars ? `${label.slice(0, maxChars - 1)}...` : label;
    const rawSubLabel = String(options.subtext || '').trim();
    const subLabel = rawSubLabel && rawSubLabel.toLocaleLowerCase() !== label.toLocaleLowerCase() ? rawSubLabel : '';
    const subMaxChars = options.subMaxChars || Math.max(18, maxChars);
    const subDisplayText = subLabel.length > subMaxChars ? `${subLabel.slice(0, subMaxChars - 1)}...` : subLabel;
    const lineGap = subDisplayText ? Math.max(1, Number(options.lineGap ?? 1)) : 0;
    ctx.save();
    ctx.font = `900 ${fontSize}px "Avenir Next", "PingFang SC", sans-serif`;
    const mainWidth = Math.min(ctx.measureText(displayText).width, maxWidth);
    let subWidth = 0;
    if (subDisplayText) {
      ctx.font = `800 ${subFontSize}px "Avenir Next", "PingFang SC", sans-serif`;
      subWidth = Math.min(ctx.measureText(subDisplayText).width, maxWidth);
    }
    const textWidth = Math.max(mainWidth, subWidth);
    const labelWidth = textWidth + paddingX * 2;
    const labelHeight = fontSize + (subDisplayText ? subFontSize + lineGap : 0) + paddingY * 2;
    drawKuromiRoomRoundedRect(ctx, x - labelWidth / 2, y - labelHeight, labelWidth, labelHeight, labelHeight / 2);
    ctx.fillStyle = options.background || 'rgba(255,255,255,.9)';
    ctx.fill();
    ctx.strokeStyle = options.border || 'rgba(255,255,255,.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = options.color || '#2f6e4a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (subDisplayText) {
      const mainY = y - labelHeight + paddingY + fontSize / 2 + 1;
      ctx.font = `900 ${fontSize}px "Avenir Next", "PingFang SC", sans-serif`;
      ctx.fillText(displayText, x, mainY, maxWidth);
      ctx.font = `800 ${subFontSize}px "Avenir Next", "PingFang SC", sans-serif`;
      ctx.fillStyle = options.subColor || 'rgba(54, 72, 86, .74)';
      ctx.fillText(subDisplayText, x, mainY + fontSize / 2 + lineGap + subFontSize / 2, maxWidth);
    } else {
      ctx.font = `900 ${fontSize}px "Avenir Next", "PingFang SC", sans-serif`;
      ctx.fillText(displayText, x, y - labelHeight / 2 + 1, maxWidth);
    }
    ctx.restore();
  }

  function syncKuromiRoomChatBubble(state, now) {
    if (state.localBubbleText && state.localBubbleText !== state.lastLocalBubbleText) {
      state.lastLocalBubbleText = state.localBubbleText;
      state.bubbleText = state.localBubbleText;
      state.bubbleUntil = now + KUROMI_ROOM_DEMO.bubbleDurationMs;
    }
  }

  function drawKuromiRoomMapHud(ctx, state, map, now) {
    const title = `${map.shortTitle} · ${map.subtitle}`;
    drawKuromiRoomLabel(ctx, title, 170, 38, {
      fontSize: 14,
      paddingX: 12,
      paddingY: 7,
      maxWidth: 310,
      maxChars: 24,
      background: 'rgba(255,255,255,.9)',
      border: 'rgba(255,255,255,.72)',
      color: '#3e4870'
    });
    if (state.mapBubbleText && now < state.mapBubbleUntil) {
      drawKuromiRoomLabel(ctx, state.mapBubbleText, KUROMI_ROOM_DEMO.viewWidth / 2, 72, {
        fontSize: 20,
        paddingX: 18,
        paddingY: 9,
        maxWidth: 260,
        maxChars: 12,
        background: 'rgba(255, 251, 220, .94)',
        border: 'rgba(255, 236, 142, .9)',
        color: '#6a4a12'
      });
    }
  }

  function getKuromiRoomPlayerLabelY(playerBounds, fallbackY = INTERACTION_ROOM_MIN_LABEL_Y) {
    const visibleTopY = Number(playerBounds?.visibleTopY);
    const safeFallbackY = Number.isFinite(Number(fallbackY)) ? Number(fallbackY) : INTERACTION_ROOM_MIN_LABEL_Y;
    const labelY = Number.isFinite(visibleTopY) ? visibleTopY - INTERACTION_ROOM_LABEL_GAP : safeFallbackY;
    return Math.max(INTERACTION_ROOM_MIN_LABEL_Y, labelY);
  }

  function getKuromiRoomSpeechBubbleY(labelY, playerBounds = null) {
    const safeLabelY = Number.isFinite(Number(labelY)) ? Number(labelY) : INTERACTION_ROOM_MIN_LABEL_Y;
    if (playerBounds?.flying) {
      const visibleTopY = Number(playerBounds.visibleTopY);
      const visibleBottomY = Number(playerBounds.visibleBottomY);
      if (Number.isFinite(visibleTopY) && Number.isFinite(visibleBottomY) && visibleBottomY > visibleTopY) {
        const bodyY = visibleTopY + (visibleBottomY - visibleTopY) * INTERACTION_ROOM_FLYING_SPEECH_BODY_RATIO;
        const maxBodyY = Math.max(INTERACTION_ROOM_MIN_LABEL_Y, visibleBottomY - INTERACTION_ROOM_SPEECH_BUBBLE_GAP);
        return clampKuromiRoomValue(bodyY, INTERACTION_ROOM_MIN_LABEL_Y, maxBodyY);
      }
    }
    return Math.max(INTERACTION_ROOM_MIN_LABEL_Y, safeLabelY - 42);
  }

  function drawKuromiRoomHud(ctx, state, screenX, labelY, now, options = {}) {
    const student = getStudent();
    const headName = getInteractionRoomHeadNameParts(
      state.spriteProfile?.name || 'Pet',
      state.spriteProfile?.ownerName || getStudentDisplayName(student) || student?.studentId || ''
    );
    drawKuromiRoomLabel(ctx, headName.petName, screenX, labelY, {
      subtext: headName.playerName,
      fontSize: 16,
      subFontSize: 10,
      maxWidth: 230,
      maxChars: 20,
      subMaxChars: 20,
      lineGap: 2,
      background: 'rgba(255,255,255,.9)',
      color: '#684176'
    });
    if (state.bubbleText && now < state.bubbleUntil) {
      const speechBubbleY = getKuromiRoomSpeechBubbleY(labelY, options.playerBounds);
      drawKuromiRoomLabel(ctx, state.bubbleText, screenX, speechBubbleY, {
        fontSize: 18,
        paddingX: 17,
        paddingY: 9,
        maxWidth: 430,
        maxChars: 28,
        background: 'rgba(255, 246, 255, .95)',
        border: 'rgba(244, 194, 232, .88)',
        color: '#5b2f69'
      });
    }
    if (state.player?.lying) drawKuromiRoomSleepZzz(ctx, screenX, options.sleepY || labelY, now);
  }

  function drawKuromiRoomScene(state, now) {
    const { ctx, player, images, cameraX } = state;
    const { viewWidth, viewHeight } = KUROMI_ROOM_DEMO;
    const map = getKuromiRoomActiveMap(state);
    const background = images.backgrounds?.[map.id] || null;
    ctx.clearRect(0, 0, viewWidth, viewHeight);
    ctx.save();
    ctx.translate(-cameraX, 0);
    drawKuromiRoomBackground(ctx, background, map);
    drawInteractionRoomRemotePlayers(ctx, state, map, now);
    const localRenderScale = getInteractionRoomPlayerRenderScale(player);
    const localAction = getKuromiRoomPlayerAction(player);
    const localRenderFloatOffset = getInteractionRoomPlayerFloatOffset(player, localAction, map.groundY, localRenderScale);
    const localAlwaysFloating = isInteractionRoomAlwaysFloatingPet(player);
    const localRenderSettings = getInteractionRoomPetRenderSettings(player);
    const localPlayerBounds = drawKuromiRoomPlayer(ctx, player, images, map.groundY, now, {
      scale: localRenderScale,
      floatOffset: localRenderFloatOffset,
      flying: localAction === 'fly' || localAlwaysFloating,
      alwaysFloating: localAlwaysFloating,
      hoverTilt: localRenderSettings.hoverTilt,
      widthMultiplier: localRenderSettings.widthMultiplier,
      heightMultiplier: localRenderSettings.heightMultiplier
    });
    ctx.restore();
    const vignette = ctx.createLinearGradient(0, 0, 0, viewHeight);
    vignette.addColorStop(0, 'rgba(18, 16, 29, 0.12)');
    vignette.addColorStop(0.36, 'rgba(18, 16, 29, 0)');
    vignette.addColorStop(1, 'rgba(18, 16, 29, 0.12)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, viewWidth, viewHeight);
    drawKuromiRoomMapHud(ctx, state, map, now);
    const screenX = player.x - cameraX;
    const screenY = player.y - getKuromiRoomPlayerHeight(player) * Math.max(0, localRenderScale - 1) - localRenderFloatOffset;
    const fallbackLabelY = player.y - getKuromiRoomPlayerHeight(player) * Math.max(0, localRenderScale - 1) - localRenderFloatOffset - 12;
    const localLabelY = getKuromiRoomPlayerLabelY(localPlayerBounds, fallbackLabelY);
    drawKuromiRoomHud(ctx, state, screenX, localLabelY, now, {
      playerBounds: localPlayerBounds,
      sleepY: screenY
    });
  }

  function initKuromiRoomDemo() {
    const canvas = $('#kuromi-room-canvas');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || session.activeView !== 'guide-view' || !hasActiveInteractionRoom()) {
      stopKuromiRoomDemo();
      return false;
    }
    bindKuromiRoomDemoInput();
    const spriteProfile = getKuromiRoomSpriteProfile(getStudent());
    const activeRoomId = interactionRoomState.activeRoomId || '';
    const activeMapSetId = getActiveInteractionRoomMapSetId();
    const activeMaps = getKuromiRoomMaps();
    const firstMap = activeMaps[0] || getKuromiRoomMap(0);
    if (!kuromiRoomDemoState || kuromiRoomDemoState.canvas !== canvas) {
      if (kuromiRoomDemoState?.animationFrame) cancelAnimationFrame(kuromiRoomDemoState.animationFrame);
      kuromiRoomDemoState = {
        canvas,
        ctx,
        roomId: activeRoomId,
        mapSetId: activeMapSetId,
        mapIndex: 0,
        player: createKuromiRoomPlayer(KUROMI_ROOM_DEMO.playerStartX, firstMap.groundY),
        keys: createKuromiRoomKeys(),
        images: { backgrounds: {}, duck: null, run: null, idle: null, jump: null, lie: null },
        spriteProfile,
        cameraX: 0,
        animationFrame: null,
        lastFrame: null,
        loadingImages: false,
        lastBubbleMessageId: '',
        lastLocalBubbleText: '',
        localBubbleText: '',
        bubbleText: '',
        bubbleUntil: 0,
        mapBubbleText: '',
        mapBubbleUntil: 0
      };
    } else {
      kuromiRoomDemoState.ctx = ctx;
      if (kuromiRoomDemoState.roomId !== activeRoomId || kuromiRoomDemoState.mapSetId !== activeMapSetId) {
        kuromiRoomDemoState.roomId = activeRoomId;
        kuromiRoomDemoState.mapSetId = activeMapSetId;
        kuromiRoomDemoState.mapIndex = 0;
        kuromiRoomDemoState.cameraX = 0;
        kuromiRoomDemoState.player = createKuromiRoomPlayer(KUROMI_ROOM_DEMO.playerStartX, firstMap.groundY);
        kuromiRoomDemoState.images.backgrounds = {};
        getInteractionRoomRemoteRenderStore().clear();
      }
      kuromiRoomDemoState.mapIndex = getKuromiRoomMapIndex(kuromiRoomDemoState.mapIndex || 0);
      kuromiRoomDemoState.spriteProfile = spriteProfile;
      if (!kuromiRoomDemoState.images?.backgrounds) kuromiRoomDemoState.images.backgrounds = {};
    }
    const state = kuromiRoomDemoState;
    syncKuromiRoomPlayerPetProfile(state.player, spriteProfile.petId, (getKuromiRoomActiveMap(state) || firstMap).groundY || KUROMI_ROOM_DEMO.fallbackGroundY);
    const spriteCacheKey = spriteProfile.cacheKey || getKuromiRoomSpriteCacheKey(spriteProfile.petId, spriteProfile.stage, spriteProfile.style);
    const spriteChanged = state.loadedSpriteKey !== spriteCacheKey;
    const maps = getKuromiRoomMaps();
    const missingMapArt = maps.some(map => !state.images.backgrounds?.[map.id]);
    if (!state.loadingImages && (spriteChanged || !state.images.run || !state.images.duck || !state.images.jump || !state.images.lie || missingMapArt)) {
      state.loadingImages = true;
      Promise.all([
        loadKuromiRoomSpriteImages(spriteProfile),
        ...maps.map(map => loadCanvasImage(withAssetVersion(map.backgroundSrc)))
      ]).then(([sprites, ...backgroundList]) => {
        const backgrounds = {};
        maps.forEach((map, index) => {
          backgrounds[map.id] = backgroundList[index] || null;
        });
        state.images = { backgrounds, ...sprites };
        state.loadedSpriteKey = spriteCacheKey;
        state.loadedSpritePetId = spriteProfile.petId;
        state.loadedMapSetId = activeMapSetId;
      }).catch(error => {
        console.info('Interaction room art could not be loaded.', error);
      }).finally(() => {
        state.loadingImages = false;
      });
    }
    if (state.animationFrame) return true;
    const step = time => {
      if (!kuromiRoomDemoState || kuromiRoomDemoState.canvas !== canvas || session.activeView !== 'guide-view') {
        stopKuromiRoomDemo();
        return;
      }
      const ratioCap = window.innerWidth <= 700 ? KUROMI_ROOM_DEMO.mobilePixelRatioCap : KUROMI_ROOM_DEMO.pixelRatioCap;
      const ratio = Math.min(window.devicePixelRatio || 1, ratioCap);
      const targetWidth = KUROMI_ROOM_DEMO.viewWidth * ratio;
      const targetHeight = KUROMI_ROOM_DEMO.viewHeight * ratio;
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
      state.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      state.ctx.imageSmoothingEnabled = false;
      const lastFrame = state.lastFrame ?? time;
      const delta = (time - lastFrame) / 1000;
      state.lastFrame = time;
      const activeMap = getKuromiRoomActiveMap(state);
      updateKuromiRoomPlayer(state.player, state.keys, delta, activeMap.groundY || KUROMI_ROOM_DEMO.fallbackGroundY, activeMap);
      handleKuromiRoomMapTransition(state);
      if (interactionRoomState.activeRoomId) {
        const heartbeatPayload = getInteractionRoomHeartbeatPayload();
        const heartbeatSignature = getInteractionRoomHeartbeatSignature(heartbeatPayload);
        const heartbeatInterval = getInteractionRoomHeartbeatInterval(heartbeatPayload);
        if (time - Number(interactionRoomState.lastHeartbeatAt || 0) > heartbeatInterval || heartbeatSignature !== interactionRoomState.lastHeartbeatPayload) {
          interactionRoomState.lastHeartbeatAt = time;
          interactionRoomState.lastHeartbeatPayload = heartbeatSignature;
          void sendInteractionRoomHeartbeat({ silent: true, payload: heartbeatPayload });
        }
      }
      const targetCamera = getKuromiRoomTargetCameraX(getKuromiRoomActiveMap(state), state.player.x);
      if (targetCamera === 0 && isKuromiRoomSingleScreenMap(getKuromiRoomActiveMap(state))) {
        state.cameraX = 0;
      } else {
        state.cameraX += (targetCamera - state.cameraX) * KUROMI_ROOM_DEMO.cameraFollow;
      }
      syncKuromiRoomChatBubble(state, time);
      drawKuromiRoomScene(state, time);
      state.animationFrame = requestAnimationFrame(step);
    };
    state.animationFrame = requestAnimationFrame(step);
    updateKuromiRoomControlsUi();
    return true;
  }

  function showKuromiRoomLocalMessage(text) {
    const message = String(text || '').trim();
    if (!message) return false;
    if (!kuromiRoomDemoState) initKuromiRoomDemo();
    if (kuromiRoomDemoState) {
      kuromiRoomDemoState.localBubbleText = message;
      kuromiRoomDemoState.lastLocalBubbleText = '';
      kuromiRoomDemoState.bubbleUntil = 0;
    }
    return true;
  }

  function renderKuromiRoomEmojiButtons(extraClass = '') {
    const className = ['kuromi-room-emoji-list', extraClass].filter(Boolean).join(' ');
    return `<div class="${escapeHtml(className)}" role="list" aria-label="${escapeHtml(localize('小黄脸表情包'))}">
      ${KUROMI_ROOM_EMOJI_REACTIONS.map(emoji => `<button type="button" class="kuromi-room-emoji-button" data-kuromi-room-emoji="${escapeHtml(emoji)}" aria-label="${escapeHtml(`${localize('发送表情')} ${emoji}`)}">${escapeHtml(emoji)}</button>`).join('')}
    </div>`;
  }

  function renderKuromiRoomEmojiDock() {
    const dock = $('#kuromi-room-emoji-dock');
    if (!dock) return;
    if (!hasActiveInteractionRoom()) {
      dock.hidden = true;
      dock.innerHTML = '';
      interactionRoomState.emojiOpen = false;
      return;
    }
    dock.hidden = false;
    dock.innerHTML = `<button type="button" class="kuromi-room-emoji-toggle" data-kuromi-emoji-toggle aria-expanded="${interactionRoomState.emojiOpen ? 'true' : 'false'}" aria-label="${escapeHtml(localize(interactionRoomState.emojiOpen ? '关闭表情包' : '打开表情包'))}" title="${escapeHtml(localize('小黄脸表情包'))}">😊</button>
      <div class="kuromi-room-emoji-popover${interactionRoomState.emojiOpen ? ' is-open' : ''}" ${interactionRoomState.emojiOpen ? '' : 'hidden'}>
        ${renderKuromiRoomEmojiButtons('kuromi-room-emoji-list-mobile')}
      </div>`;
  }

  function setKuromiRoomEmojiOpen(open) {
    interactionRoomState.emojiOpen = Boolean(open);
    renderKuromiRoomEmojiDock();
  }

  async function sendKuromiRoomMessageText(text, options = {}) {
    const validation = validatePublicDisplayText(text || '', 40, '先写一句话。', '聊天内容');
    if (!validation.ok) {
      if (!options.silent) showToast(validation.error || '聊天内容不适合公开展示。');
      return false;
    }
    showKuromiRoomLocalMessage(validation.text);
    const sent = await sendInteractionRoomHeartbeat({ message: validation.text, silent: true });
    interactionRoomState.chatDraft = '';
    const input = $('#kuromi-room-chat-panel input[name="kuromiMessage"]');
    if (input) input.value = '';
    if (isKuromiRoomFullscreenMode()) setKuromiRoomChatOpen(false, { focus: false });
    if (options.closeEmoji !== false) setKuromiRoomEmojiOpen(false);
    return sent;
  }

  function renderKuromiRoomChatDemo(student = getStudent()) {
    const target = $('#kuromi-room-chat-panel');
    if (!target) return;
    if (!hasActiveInteractionRoom()) {
      target.innerHTML = '';
      renderKuromiRoomEmojiDock();
      updateKuromiRoomChatToggleUi();
      return;
    }
    const existingInput = target.querySelector('input[name="kuromiMessage"]');
    const wasFocused = document.activeElement === existingInput;
    if (existingInput) interactionRoomState.chatDraft = String(existingInput.value || '');
    const draft = interactionRoomState.chatDraft || '';
    const cursorStart = wasFocused && typeof existingInput?.selectionStart === 'number' ? existingInput.selectionStart : draft.length;
    const cursorEnd = wasFocused && typeof existingInput?.selectionEnd === 'number' ? existingInput.selectionEnd : cursorStart;
    const room = interactionRoomState.room || {};
    const roomTitle = room.roomName || '互动房间';
    const roomCount = `${Number(room.memberCount || 1)}/${Number(room.memberLimit || ROOM_MEMBER_LIMIT)} 人`;
    target.innerHTML = `<div class="kuromi-room-chat-status">
      <div>
        <strong>${escapeHtml(roomTitle)}</strong>
        <small>${escapeHtml(room.roomId || '')} · ${escapeHtml(roomCount)}</small>
      </div>
      <button type="button" class="secondary-button" data-interaction-room-leave>${escapeHtml(localize('离开房间'))}</button>
    </div>
    ${renderKuromiRoomEmojiButtons('kuromi-room-emoji-list-inline')}
    <form class="kuromi-room-chat-form" data-kuromi-room-chat-form>
      <input name="kuromiMessage" maxlength="40" autocomplete="off" value="${escapeHtml(draft)}" placeholder="${escapeHtml(localize('写一句话，让宠物说出来'))}" aria-label="${escapeHtml(localize('宠物聊天内容'))}" />
      <button type="submit" class="primary-button">${escapeHtml(localize('发送'))}</button>
    </form>`;
    const nextInput = target.querySelector('input[name="kuromiMessage"]');
    if (wasFocused && nextInput) {
      nextInput.focus({ preventScroll: true });
      const safeStart = Math.min(cursorStart, nextInput.value.length);
      const safeEnd = Math.min(cursorEnd, nextInput.value.length);
      nextInput.setSelectionRange(safeStart, safeEnd);
    }
    renderKuromiRoomEmojiDock();
    updateKuromiRoomChatToggleUi();
  }

  function getMiniGameChoices() {
    return [
      {
        type: 'reaction',
        icon: '🎯',
        title: 'CY反应轮盘',
        description: '看准发光区域，点击命中。'
      },
      {
        type: 'flappy',
        icon: '☁️',
        title: 'CY跳跳跳',
        description: '让整只宠物飞过云朵空隙。'
      },
      {
        type: 'runner',
        icon: '🏃',
        title: 'CY跑跑跑',
        description: '带宠物越过路上的障碍。'
      },
      {
        type: 'jumpCharge',
        icon: '◇',
        title: 'CY跳一跳',
        description: '按住蓄力，松手跳到下一块平台。'
      }
    ];
  }

  function isMiniGameSurfaceOpen() {
    return Boolean(miniGameState.overlayOpen || miniGameState.embeddedOpen);
  }

  function getMiniGameElements() {
    const embeddedPage = $('#mini-game-embedded-page');
    if (miniGameState.embeddedOpen && embeddedPage) {
      const query = selector => embeddedPage.querySelector(selector);
      return {
        root: embeddedPage,
        overlay: embeddedPage,
        title: query('[data-mini-game-title]'),
        status: query('[data-mini-game-status]'),
        picker: query('[data-mini-game-picker]'),
        canvas: query('[data-mini-game-canvas]'),
        actions: query('[data-mini-game-actions]'),
        actionButton: query('[data-mini-game-action]'),
        retryButton: query('[data-mini-game-retry]'),
        fullscreenButton: query('[data-mini-game-fullscreen]'),
        runnerControls: query('[data-runner-mobile-controls]'),
        hint: query('[data-mini-game-hint]')
      };
    }
    return {
      root: $('#mini-game-overlay'),
      overlay: $('#mini-game-overlay'),
      title: $('#mini-game-title'),
      status: $('#mini-game-status'),
      picker: $('#mini-game-picker'),
      canvas: $('#mini-game-canvas'),
      actions: $('#mini-game-actions'),
      actionButton: $('#mini-game-overlay')?.querySelector('[data-mini-game-action]'),
      retryButton: $('#mini-game-overlay')?.querySelector('[data-mini-game-retry]'),
      fullscreenButton: null,
      runnerControls: null,
      hint: null
    };
  }

  function resetMiniGamePlayState() {
    miniGameState.mode = 'picker';
    miniGameState.type = '';
    miniGameState.result = null;
    miniGameState.reaction = null;
    miniGameState.flappy = null;
    miniGameState.runner = null;
    miniGameState.jumpCharge = null;
    miniGameState.canvas = null;
    miniGameState.ctx = null;
  }

  function isMiniGameEndedState() {
    if (miniGameState.type === 'reaction') {
      return Boolean(miniGameState.reaction?.failed || (miniGameState.reaction?.success && !miniGameState.reaction?.challenge));
    }
    if (miniGameState.type === 'flappy') return miniGameState.flappy?.phase === 'finished';
    if (miniGameState.type === 'runner') return miniGameState.runner?.phase === 'over';
    if (miniGameState.type === 'jumpCharge') return miniGameState.jumpCharge?.phase === 'ended';
    return false;
  }

  function updateMiniGameSurfaceStateClasses() {
    const { root } = getMiniGameElements();
    if (!root) return;
    const playing = miniGameState.mode === 'playing' && Boolean(miniGameState.type);
    root.classList.toggle('mini-game-playing-shell', playing);
    root.classList.toggle('mini-game-ended-shell', playing && isMiniGameEndedState());
    ['reaction', 'flappy', 'runner', 'jumpCharge'].forEach(type => {
      root.classList.toggle(`mini-game-${type}-shell`, playing && miniGameState.type === type);
    });
  }

  function renderEmbeddedMiniGameShell() {
    const target = $('#interaction-room-lobby');
    if (!target) return;
    if (miniGameState.mode === 'playing' && target.querySelector('[data-mini-game-canvas]')) return;
    target.innerHTML = `<section id="mini-game-embedded-page" class="mini-game-page" aria-label="${escapeHtml(localize('宠物小游戏'))}">
      <header class="mini-game-page-header">
        <button type="button" class="secondary-button mini-game-page-back-button" data-mini-game-close aria-label="${escapeHtml(localize('返回互动区'))}" title="${escapeHtml(localize('返回互动区'))}">←</button>
        <div>
          <p class="eyebrow">PET GAMES</p>
          <h3 data-mini-game-title>${escapeHtml(localize('带宠物去玩'))}</h3>
        </div>
        <button type="button" class="kuromi-room-fullscreen-button mini-game-fullscreen-button" data-mini-game-fullscreen aria-pressed="false" aria-label="${escapeHtml(localize('进入全屏横屏'))}" title="${escapeHtml(localize('进入全屏横屏'))}">⛶</button>
      </header>
      <p class="mini-game-status" data-mini-game-status>${escapeHtml(localize('选择一个小游戏开始。'))}</p>
      <div class="mini-game-picker" data-mini-game-picker></div>
      <canvas class="mini-game-canvas mini-game-page-canvas" data-mini-game-canvas width="900" height="540" aria-label="${escapeHtml(localize('宠物小游戏画面'))}" hidden></canvas>
      <div class="mini-game-runner-controls" data-runner-mobile-controls hidden aria-label="${escapeHtml(localize('跑跑跑控制'))}">
        <button type="button" class="mini-game-runner-control-button" data-runner-control="jump" aria-label="${escapeHtml(localize('跳起'))}">
          <span aria-hidden="true">↑</span>
        </button>
        <button type="button" class="mini-game-runner-control-button" data-runner-control="duck" aria-label="${escapeHtml(localize('蹲下'))}">
          <span aria-hidden="true">↓</span>
        </button>
      </div>
      <div class="mini-game-actions" data-mini-game-actions hidden>
        <button type="button" class="primary-button" data-mini-game-action>${escapeHtml(localize('开始'))}</button>
        <button type="button" class="secondary-button" data-mini-game-retry hidden>${escapeHtml(localize('重新挑战'))}</button>
      </div>
      <p class="mini-game-keyboard-hint" data-mini-game-hint hidden>${escapeHtml(localize('建议横屏游玩；电脑可以用 Space / Enter / ↑ / W 操作，手机可以点画面或按钮。'))}</p>
    </section>`;
    updateMiniGameFullscreenUi();
    updateMiniGameSurfaceStateClasses();
  }

  function isMiniGameFullscreenMode() {
    return document.body.classList.contains('mini-game-fullscreen-mode');
  }

  function updateMiniGameFullscreenUi() {
    const { fullscreenButton } = getMiniGameElements();
    if (!fullscreenButton) return;
    const active = isMiniGameFullscreenMode();
    fullscreenButton.textContent = active ? '×' : '⛶';
    fullscreenButton.setAttribute('aria-pressed', String(active));
    fullscreenButton.setAttribute('aria-label', localize(active ? '退出全屏' : '进入全屏横屏'));
    fullscreenButton.setAttribute('title', localize(active ? '退出全屏' : '进入全屏横屏'));
    fullscreenButton.classList.toggle('is-exit-mode', active);
  }

  async function enterMiniGameFullscreen() {
    const target = $('#mini-game-embedded-page') || $('.kuromi-room-panel');
    if (!target) return;
    document.body.classList.add('mini-game-fullscreen-mode');
    updateMiniGameFullscreenUi();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      if (target.requestFullscreen && !document.fullscreenElement) {
        await target.requestFullscreen({ navigationUI: 'hide' });
        miniGameNativeFullscreenActive = true;
      }
    } catch (error) {
      miniGameNativeFullscreenActive = false;
      console.info('Native mini-game fullscreen is not available on this device.', error);
    }
    try {
      if (screen.orientation?.lock) await screen.orientation.lock('landscape');
    } catch (error) {
      console.info('Mini-game landscape orientation lock is not available on this device.', error);
    }
  }

  async function exitMiniGameFullscreen() {
    document.body.classList.remove('mini-game-fullscreen-mode');
    updateMiniGameFullscreenUi();
    try {
      if (document.fullscreenElement && miniGameNativeFullscreenActive) await document.exitFullscreen();
    } catch (error) {
      console.info('Could not exit mini-game native fullscreen cleanly.', error);
    }
    try {
      if (screen.orientation?.unlock) screen.orientation.unlock();
    } catch (error) {
      console.info('Could not unlock mini-game screen orientation.', error);
    }
    miniGameNativeFullscreenActive = false;
  }

  function toggleMiniGameFullscreen() {
    if (isMiniGameFullscreenMode()) return exitMiniGameFullscreen();
    return enterMiniGameFullscreen();
  }

  function shouldAutoEnterPlayFullscreen() {
    return window.innerWidth <= 900 || window.matchMedia?.('(pointer: coarse)')?.matches;
  }

  function getMiniGamePetHeadProfile(student = getStudent()) {
    const profile = getKuromiRoomSpriteProfile(student);
    const petId = profile.petId || getStudent()?.petType || 'kuromi';
    return {
      petId,
      cacheKey: profile.cacheKey || getKuromiRoomSpriteCacheKey(petId, profile.stage, profile.style),
      sources: getKuromiRoomProfileSourceList(profile, 'headSrc')
    };
  }

  function getMiniGamePetHeadSrcs(student = getStudent()) {
    return getMiniGamePetHeadProfile(student).sources;
  }

  async function loadMiniGamePetHead() {
    const { petId, cacheKey, sources } = getMiniGamePetHeadProfile(getStudent());
    if (miniGameState.headPetId !== cacheKey) {
      miniGameState.headImage = null;
      miniGameState.headSrc = '';
      miniGameState.headPetId = cacheKey;
    }
    for (const src of sources) {
      if (miniGameState.headImage && miniGameState.headSrc === src && miniGameState.headPetId === cacheKey) return miniGameState.headImage;
      try {
        const image = await loadCanvasImage(withAssetVersion(src));
        if (miniGameState.headPetId !== cacheKey) return miniGameState.headImage;
        miniGameState.headImage = image;
        miniGameState.headSrc = src;
        miniGameState.headPetId = cacheKey;
        return miniGameState.headImage;
      } catch (error) {
        console.info('Mini game pet head source could not be loaded.', src, error);
      }
    }
    miniGameState.headImage = null;
    miniGameState.headSrc = '';
    miniGameState.headPetId = cacheKey || petId;
    return miniGameState.headImage;
  }

  async function loadMiniGamePetSprites() {
    const profile = getKuromiRoomSpriteProfile(getStudent());
    const petId = profile.petId || profile.id || getStudent()?.petType || 'kuromi';
    const spriteCacheKey = profile.cacheKey || getKuromiRoomSpriteCacheKey(petId, profile.stage, profile.style);
    if (miniGameState.spriteImages && miniGameState.spritePetId === spriteCacheKey) return miniGameState.spriteImages;
    try {
      miniGameState.spriteImages = await loadKuromiRoomSpriteImages(profile);
      miniGameState.spritePetId = spriteCacheKey;
      return miniGameState.spriteImages;
    } catch (error) {
      console.info('Mini game pet sprites could not be loaded.', petId, error);
      miniGameState.spriteImages = null;
      miniGameState.spritePetId = '';
      return null;
    }
  }

  function stopMiniGameLoop() {
    if (miniGameState.animationFrame) cancelAnimationFrame(miniGameState.animationFrame);
    miniGameState.animationFrame = null;
    miniGameState.lastFrame = null;
    miniGameState.lastDrawTime = null;
  }

  function setMiniGameCanvasVisible(visible) {
    const { canvas, actions } = getMiniGameElements();
    if (canvas) canvas.hidden = !visible;
    if (actions) actions.hidden = !visible;
  }

  function setRunnerControlsVisible(visible) {
    const { runnerControls } = getMiniGameElements();
    if (runnerControls) runnerControls.hidden = !visible;
  }

  function getRunnerMiniGameControlTarget(event) {
    return event?.target?.closest?.('[data-runner-control]') || null;
  }

  function releaseRunnerMiniGameControls() {
    if (!isMiniGameSurfaceOpen() || miniGameState.type !== 'runner') return;
    pressRunnerMiniGameJump(false);
    setRunnerMiniGameDuck(false);
  }

  function setMiniGameStatus(message) {
    const { status } = getMiniGameElements();
    if (status) status.textContent = localize(message);
  }

  function playMiniGameSound(kind = 'jump') {
    try {
      const context = getAudioContext();
      if (!context) return;
      const now = context.currentTime;
      const patterns = {
        charge: [
          { frequency: 164.81, endFrequency: 246.94, start: 0, duration: 0.22, gain: 0.055, type: 'sawtooth' }
        ],
        jump: [
          { frequency: 392, endFrequency: 659.25, start: 0, duration: 0.16, gain: 0.09, type: 'triangle' }
        ],
        land: [
          { frequency: 261.63, endFrequency: 196, start: 0, duration: 0.14, gain: 0.07, type: 'sine' }
        ],
        miss: [
          { frequency: 196, endFrequency: 123.47, start: 0, duration: 0.22, gain: 0.07, type: 'sawtooth' }
        ],
        perfect: [
          { frequency: 523.25, endFrequency: 783.99, start: 0, duration: 0.12, gain: 0.08, type: 'triangle' },
          { frequency: 659.25, endFrequency: 987.77, start: 0.08, duration: 0.15, gain: 0.09, type: 'triangle' },
          { frequency: 1046.5, endFrequency: 1318.51, start: 0.2, duration: 0.18, gain: 0.075, type: 'sine' }
        ]
      };
      (patterns[kind] || patterns.jump).forEach(note => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = now + note.start;
        oscillator.type = note.type;
        oscillator.frequency.setValueAtTime(note.frequency, start);
        oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, note.endFrequency || note.frequency), start + note.duration);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(note.gain, start + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + note.duration + 0.03);
      });
    } catch (error) {
      console.info('Mini game sound unavailable.', error);
    }
  }

  function drawMiniGameRoundedRect(ctx, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + safeRadius, y);
    ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
    ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
    ctx.arcTo(x, y + height, x, y, safeRadius);
    ctx.arcTo(x, y, x + width, y, safeRadius);
    ctx.closePath();
  }

  function drawContainedCanvasImage(ctx, image, centerX, centerY, maxWidth, maxHeight) {
    const sourceWidth = Number(image?.naturalWidth || image?.width || 0);
    const sourceHeight = Number(image?.naturalHeight || image?.height || 0);
    if (!sourceWidth || !sourceHeight || !maxWidth || !maxHeight) return false;
    const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    ctx.drawImage(image, centerX - drawWidth / 2, centerY - drawHeight / 2, drawWidth, drawHeight);
    return true;
  }

  function drawMiniGamePetHead(ctx, x, y, size, options = {}) {
    const image = miniGameState.headImage;
    const angle = Number(options.angle || 0);
    const pulse = Number(options.pulse || 0);
    const scale = Number(options.scale || 1) + pulse * 0.04;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false;
    if (!image || !drawContainedCanvasImage(ctx, image, 0, 0, size, size)) {
      ctx.fillStyle = '#6a63f4';
      ctx.font = `900 ${Math.round(size * 0.46)}px "Avenir Next", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐾', 0, 2);
    }
    ctx.restore();
  }

  function drawMiniGamePetSprite(ctx, x, y, width, height, options = {}) {
    const image = options.image || miniGameState.headImage;
    const angle = Number(options.angle || 0);
    const pulse = Number(options.pulse || 0);
    const scale = Number(options.scale || 1) + pulse * 0.035;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false;
    if (!image || !drawContainedCanvasImage(ctx, image, 0, 0, width, height)) {
      ctx.fillStyle = '#6a63f4';
      ctx.font = `900 ${Math.round(height * 0.56)}px "Avenir Next", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐾', 0, 0);
    }
    ctx.restore();
  }

  function drawMiniGameSky(ctx, width = 900, height = 540, groundY = 438) {
    const sky = ctx.createLinearGradient(0, 0, 0, groundY);
    sky.addColorStop(0, '#9ee7ff');
    sky.addColorStop(1, '#eefbff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, groundY);
    ctx.fillStyle = 'rgba(255,255,255,.76)';
    [[120, 80, 44], [650, 92, 54], [770, 170, 38]].forEach(([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.arc(x + r * 0.82, y + 8, r * 0.82, 0, Math.PI * 2);
      ctx.arc(x - r * 0.75, y + 10, r * 0.66, 0, Math.PI * 2);
      ctx.fill();
    });
    const ground = ctx.createLinearGradient(0, groundY, 0, height);
    ground.addColorStop(0, '#a4eb67');
    ground.addColorStop(1, '#53b95c');
    ctx.fillStyle = ground;
    ctx.fillRect(0, groundY, width, height - groundY);
  }

  function renderMiniGamePicker() {
    const { picker, canvas, actions, title, status, retryButton, actionButton, hint } = getMiniGameElements();
    if (!picker) return;
    if (title) title.textContent = localize('带宠物去玩');
    if (status) status.textContent = localize('选择一个小游戏开始。');
    picker.hidden = false;
    picker.innerHTML = getMiniGameChoices().map(choice => `<button type="button" class="mini-game-choice" data-mini-game-start="${choice.type}">
      <span aria-hidden="true">${choice.icon}</span>
      <strong>${escapeHtml(localize(choice.title))}</strong>
      <small>${escapeHtml(localize(choice.description))}</small>
    </button>`).join('');
    if (canvas) canvas.hidden = true;
    if (actions) actions.hidden = true;
    setRunnerControlsVisible(false);
    if (hint) hint.hidden = true;
    if (retryButton) retryButton.hidden = true;
    if (actionButton) actionButton.hidden = false;
    updateMiniGameSurfaceStateClasses();
  }

  function openMiniGameMenu(options = {}) {
    bindMiniGameKeyboardInput();
    stopMiniGameLoop();
    resetMiniGamePlayState();
    miniGameState.challenge = null;
    const surface = options.surface === 'overlay' ? 'overlay' : 'embedded';
    if (surface === 'overlay') {
      miniGameState.embeddedOpen = false;
      miniGameState.overlayOpen = true;
      const { overlay } = getMiniGameElements();
      if (!overlay) return;
      overlay.classList.remove('hidden');
      renderMiniGamePicker();
      applyLanguage(overlay);
      return;
    }
    stopKuromiRoomDemo();
    stopInteractionRoomLobbyRefresh();
    interactionRoomState.lobbyMode = 'games';
    miniGameState.overlayOpen = false;
    miniGameState.embeddedOpen = true;
    renderEmbeddedMiniGameShell();
    renderMiniGamePicker();
    if (!wallLeaderboardLoaded) void loadWallLeaderboardStudents();
    const { root } = getMiniGameElements();
    applyLanguage(root || $('#interaction-room-lobby'));
    root?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }

  function closeEmbeddedMiniGame() {
    stopMiniGameLoop();
    void exitMiniGameFullscreen();
    miniGameState.embeddedOpen = false;
    resetMiniGamePlayState();
    interactionRoomState.lobbyMode = 'menu';
    renderInteractionRoomLobby(getStudent());
    const stage = $('#pet-interaction-stage');
    applyLanguage(stage?.closest('.pet-interaction-panel') || stage || document.body);
  }

  function resolveEvolutionChallenge(success) {
    const challenge = miniGameState.challenge;
    if (!challenge || challenge.resolved) return;
    challenge.resolved = true;
    const resolver = challenge.resolve;
    miniGameState.challenge = null;
    if (typeof resolver === 'function') resolver(Boolean(success));
  }

  function closeMiniGameOverlay(options = {}) {
    if (miniGameState.embeddedOpen) {
      closeEmbeddedMiniGame();
      return;
    }
    const { overlay, picker, canvas, actions } = getMiniGameElements();
    stopMiniGameLoop();
    if (miniGameState.challenge && options.resolveChallenge !== false) resolveEvolutionChallenge(false);
    miniGameState.overlayOpen = false;
    miniGameState.mode = 'picker';
    miniGameState.type = '';
    miniGameState.result = null;
    miniGameState.reaction = null;
    miniGameState.flappy = null;
    miniGameState.runner = null;
    miniGameState.jumpCharge = null;
    if (picker) picker.innerHTML = '';
    if (canvas) canvas.hidden = true;
    if (actions) actions.hidden = true;
    overlay?.classList.add('hidden');
  }

  function isTouchOptimizedMiniGameDevice() {
    const coarsePointer = Boolean(window.matchMedia?.('(pointer: coarse)')?.matches);
    const touchPoints = typeof navigator !== 'undefined' ? Number(navigator.maxTouchPoints || 0) : 0;
    return coarsePointer || touchPoints > 1 || window.innerWidth <= 900;
  }

  function getMiniGamePixelRatioCap() {
    if (miniGameState.type === 'reaction') return isTouchOptimizedMiniGameDevice() ? 1.25 : 1.65;
    if (isTouchOptimizedMiniGameDevice()) return 1.35;
    return window.innerWidth <= 700 ? 1.5 : 2;
  }

  function getMiniGameFrameIntervalMs() {
    if (miniGameState.type === 'reaction' && isTouchOptimizedMiniGameDevice()) return 1000 / 30;
    return 0;
  }

  function prepareMiniGameCanvasFrame(canvas, ctx) {
    const logicalWidth = Number(canvas.dataset.logicalWidth || canvas.getAttribute('width') || 900) || 900;
    const logicalHeight = Number(canvas.dataset.logicalHeight || canvas.getAttribute('height') || 540) || 540;
    canvas.dataset.logicalWidth = String(logicalWidth);
    canvas.dataset.logicalHeight = String(logicalHeight);
    const ratioCap = getMiniGamePixelRatioCap();
    const ratio = Math.min(Math.max(1, window.devicePixelRatio || 1), ratioCap);
    const targetWidth = Math.round(logicalWidth * ratio);
    const targetHeight = Math.round(logicalHeight * ratio);
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  function startMiniGameLoop(drawFrame) {
    const { canvas } = getMiniGameElements();
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    miniGameState.canvas = canvas;
    miniGameState.ctx = ctx;
    stopMiniGameLoop();
    const step = time => {
      if (!isMiniGameSurfaceOpen() || !miniGameState.ctx) {
        stopMiniGameLoop();
        return;
      }
      const frameInterval = getMiniGameFrameIntervalMs();
      if (frameInterval && miniGameState.lastDrawTime !== null && time - miniGameState.lastDrawTime < frameInterval) {
        miniGameState.animationFrame = requestAnimationFrame(step);
        return;
      }
      const lastFrame = miniGameState.lastFrame ?? time;
      const delta = Math.min((time - lastFrame) / 1000, 0.034);
      miniGameState.lastFrame = time;
      miniGameState.lastDrawTime = time;
      prepareMiniGameCanvasFrame(canvas, ctx);
      drawFrame(ctx, time, delta);
      miniGameState.animationFrame = requestAnimationFrame(step);
    };
    miniGameState.animationFrame = requestAnimationFrame(step);
  }

  function clampMiniGame(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerpMiniGame(start, end, amount) {
    return start + (end - start) * amount;
  }

  function smoothstepMiniGame(value) {
    return value * value * (3 - 2 * value);
  }

  function distanceMiniGame(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  function randomMiniGame(min, max) {
    return min + Math.random() * (max - min);
  }

  function normalizeMiniGameAngle(angle) {
    return ((angle % 360) + 360) % 360;
  }

  function miniGameAngularDistance(a, b) {
    const diff = Math.abs(normalizeMiniGameAngle(a) - normalizeMiniGameAngle(b));
    return Math.min(diff, 360 - diff);
  }

  function circleHitsMiniGameRect(cx, cy, radius, rx, ry, rw, rh) {
    const closestX = clampMiniGame(cx, rx, rx + rw);
    const closestY = clampMiniGame(cy, ry, ry + rh);
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy <= radius * radius;
  }

  function boxesOverlapMiniGame(first, second) {
    return (
      first.x < second.x + second.width &&
      first.x + first.width > second.x &&
      first.y < second.y + second.height &&
      first.y + first.height > second.y
    );
  }

  function drawMiniGameCloud(ctx, x, y, scale = 1, alpha = 0.8) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(0, 16, 18, 0, Math.PI * 2);
    ctx.arc(22, 8, 25, 0, Math.PI * 2);
    ctx.arc(48, 16, 18, 0, Math.PI * 2);
    ctx.rect(-2, 16, 54, 20);
    ctx.fill();
    ctx.restore();
  }

  function randomizeReactionTarget(reaction) {
    let center = Math.random() * 360;
    for (let attempts = 0; attempts < 6; attempts += 1) {
      if (miniGameAngularDistance(center, reaction.targetCenter || 72) > 42) break;
      center = Math.random() * 360;
    }
    reaction.targetCenter = center;
    reaction.targetSize = Math.max(18, reaction.baseTargetSize - reaction.streak * reaction.targetShrink);
    reaction.speed = Math.min(reaction.maxSpeed || 340, reaction.baseSpeed + reaction.streak * reaction.speedGain);
    reaction.direction = Math.random() < 0.5 ? -1 : 1;
    reaction.wasInside = false;
    reaction.enteredAt = null;
  }

  function getReactionAccuracy(reaction) {
    const total = reaction.hits + reaction.misses;
    if (!total) return '100%';
    return `${Math.round((reaction.hits / total) * 100)}%`;
  }

  function drawReactionWheelGame(ctx, time, delta) {
    const reaction = miniGameState.reaction;
    if (!reaction) return;
    const width = 900;
    const height = 540;
    if (!reaction.failed && !reaction.success) {
      reaction.pointerAngle = normalizeMiniGameAngle(reaction.pointerAngle + reaction.speed * reaction.direction * delta);
      const inside = miniGameAngularDistance(reaction.pointerAngle, reaction.targetCenter) <= reaction.targetSize / 2;
      if (inside && !reaction.wasInside) reaction.enteredAt = performance.now();
      if (!inside && reaction.wasInside) reaction.enteredAt = null;
      reaction.wasInside = inside;
      reaction.pulse = Math.max(0, reaction.pulse - delta * 3.4);
    }

    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#fff8fa');
    bg.addColorStop(0.52, '#e8fbff');
    bg.addColorStop(1, '#fff1bf');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 12;
    const radius = 158;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.lineCap = 'round';
    for (let tick = 0; tick < 60; tick += 1) {
      const angle = (tick / 60) * Math.PI * 2;
      const inner = tick % 5 === 0 ? radius + 18 : radius + 24;
      const outer = radius + 33;
      ctx.strokeStyle = tick % 5 === 0 ? 'rgba(40,35,71,.32)' : 'rgba(99,92,238,.16)';
      ctx.lineWidth = tick % 5 === 0 ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
      ctx.stroke();
    }
    ctx.lineWidth = 34;
    ctx.strokeStyle = 'rgba(99,92,238,.16)';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
    const zoneStart = (reaction.targetCenter - reaction.targetSize / 2) * Math.PI / 180;
    const zoneEnd = (reaction.targetCenter + reaction.targetSize / 2) * Math.PI / 180;
    ctx.strokeStyle = reaction.wasInside ? 'rgba(255,211,80,.96)' : 'rgba(73,190,167,.9)';
    ctx.lineWidth = 38;
    ctx.beginPath();
    ctx.arc(0, 0, radius, zoneStart, zoneEnd);
    ctx.stroke();
    const pointerAngle = reaction.pointerAngle * Math.PI / 180;
    const px = Math.cos(pointerAngle) * radius;
    const py = Math.sin(pointerAngle) * radius;
    ctx.strokeStyle = '#ff5b88';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.fillStyle = '#ff5b88';
    ctx.beginPath();
    ctx.arc(px, py, 15 + reaction.pulse * 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const centerSprite = miniGameState.spriteImages?.idle || miniGameState.spriteImages?.run || miniGameState.headImage;
    drawMiniGamePetSprite(ctx, cx, cy, 132, 132, {
      image: centerSprite,
      pulse: Math.sin(time / 170) * 0.45 + reaction.pulse
    });
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#282347';
    ctx.font = '1000 34px "Avenir Next", "PingFang SC", sans-serif';
    ctx.fillText(reaction.challenge ? `${reaction.hits}/${reaction.requiredHits}` : `${reaction.hits}`, cx, 76);
    ctx.font = '900 18px "Avenir Next", "PingFang SC", sans-serif';
    ctx.fillStyle = '#7b7694';
    const remainingMisses = Math.max(0, reaction.allowedMisses - reaction.misses);
    ctx.fillText(reaction.challenge ? localize('连续命中发光区域') : localize(`剩余失误 ${remainingMisses} 次`), cx, 106);
    ctx.fillStyle = 'rgba(255,255,255,.82)';
    drawMiniGameRoundedRect(ctx, 56, 38, 176, 72, 14);
    ctx.fill();
    ctx.fillStyle = '#282347';
    ctx.textAlign = 'left';
    ctx.font = '900 20px "Avenir Next", "PingFang SC", sans-serif';
    ctx.fillText(`${localize('分数')} ${reaction.score}`, 76, 70);
    ctx.fillStyle = '#7b7694';
    ctx.font = '850 15px "Avenir Next", "PingFang SC", sans-serif';
    ctx.fillText(`${localize('准度')} ${getReactionAccuracy(reaction)}`, 76, 94);
    if (reaction.lastReaction !== null) {
      ctx.textAlign = 'right';
      ctx.fillText(`${reaction.lastReaction}ms`, width - 66, 64);
    }
    if (reaction.feedback) {
      ctx.textAlign = 'center';
      ctx.fillStyle = reaction.feedbackTone === 'miss' ? '#ff5b88' : '#49bea7';
      ctx.font = '1000 30px "Avenir Next", "PingFang SC", sans-serif';
      ctx.fillText(localize(reaction.feedback), cx, height - 56);
    }
    ctx.restore();
  }

  function showReactionFailure() {
    const { actionButton, retryButton } = getMiniGameElements();
    const challenge = Boolean(miniGameState.reaction?.challenge);
    if (miniGameState.reaction) {
      miniGameState.reaction.failed = true;
      miniGameState.reaction.feedback = challenge ? '进化失败' : '挑战结束';
      miniGameState.reaction.feedbackTone = 'miss';
    }
    setMiniGameStatus(challenge
      ? '角色进化失败。可以重新挑战，或者按右上角关闭。'
      : finishMiniGameRound('reaction', miniGameState.reaction?.score || 0));
    if (actionButton) actionButton.hidden = true;
    if (retryButton) {
      retryButton.hidden = false;
      retryButton.textContent = localize('重新挑战');
    }
    updateMiniGameSurfaceStateClasses();
  }

  function finishReactionChallenge() {
    setMiniGameStatus('挑战成功！进化继续。');
    window.setTimeout(() => {
      resolveEvolutionChallenge(true);
      closeMiniGameOverlay({ resolveChallenge: false });
    }, 520);
  }

  function attemptReactionWheel() {
    const reaction = miniGameState.reaction;
    if (!reaction || reaction.failed || reaction.success) return;
    const distance = miniGameAngularDistance(reaction.pointerAngle, reaction.targetCenter);
    const hit = distance <= reaction.targetSize / 2;
    reaction.pulse = 1;
    if (!hit) {
      reaction.misses += 1;
      reaction.streak = 0;
      reaction.score = Math.max(0, reaction.score - 25);
      reaction.lastReaction = null;
      reaction.feedback = '差一点';
      reaction.feedbackTone = 'miss';
      if (reaction.misses > reaction.allowedMisses) {
        showReactionFailure();
      } else {
        randomizeReactionTarget(reaction);
        setMiniGameStatus(reaction.challenge ? `差一点！还可以失误 ${reaction.allowedMisses - reaction.misses} 次。` : `差一点！还可以失误 ${reaction.allowedMisses - reaction.misses} 次。`);
      }
      return;
    }

    const now = performance.now();
    const responseTime = reaction.enteredAt ? Math.max(0, Math.round(now - reaction.enteredAt)) : 0;
    reaction.hits += 1;
    reaction.streak += 1;
    reaction.score += 100 + reaction.streak * 14 + Math.round(reaction.speed / 9);
    reaction.lastReaction = responseTime;
    reaction.feedback = '成功';
    reaction.feedbackTone = 'hit';
    playUiSound('gift');
    if (reaction.challenge && reaction.hits >= reaction.requiredHits) {
      reaction.success = true;
      reaction.feedback = '完成';
      finishReactionChallenge();
      return;
    }
    randomizeReactionTarget(reaction);
    setMiniGameStatus(reaction.challenge ? `命中！还差 ${reaction.requiredHits - reaction.hits} 次。` : `命中！目前累计 ${reaction.hits} 次。`);
  }

  function startReactionWheelGame(options = {}) {
    const challenge = Boolean(options.challenge || miniGameState.challenge);
    const requiredHits = challenge ? Math.max(1, Number(options.requiredHits || miniGameState.challenge?.requiredHits || 5)) : 0;
    const allowedMisses = Math.max(0, Number(options.allowedMisses ?? miniGameState.challenge?.allowedMisses ?? (challenge ? 0 : 3)));
    const { picker, actionButton, retryButton, title } = getMiniGameElements();
    if (picker) picker.hidden = true;
    setMiniGameCanvasVisible(true);
    if (title) title.textContent = localize(challenge ? '进化轮盘挑战' : 'CY反应轮盘');
    if (actionButton) {
      actionButton.hidden = false;
      actionButton.textContent = localize('点击命中');
    }
    if (retryButton) retryButton.hidden = true;
    setRunnerControlsVisible(false);
    miniGameState.type = 'reaction';
    miniGameState.reaction = {
      challenge,
      requiredHits,
      allowedMisses,
      endless: !challenge,
      hits: 0,
      misses: 0,
      streak: 0,
      score: 0,
      pointerAngle: 0,
      targetCenter: 72,
      targetSize: 56,
      baseTargetSize: challenge ? 52 : 62,
      targetShrink: challenge ? 2.5 : 1.8,
      speed: 165,
      baseSpeed: challenge ? 205 : 145,
      speedGain: challenge ? 18 : 8,
      maxSpeed: challenge ? 380 : 320,
      direction: Math.random() < 0.5 ? -1 : 1,
      failed: false,
      success: false,
      wasInside: false,
      enteredAt: null,
      lastReaction: null,
      feedback: '小指针醒啦',
      feedbackTone: 'neutral',
      pulse: 0
    };
    randomizeReactionTarget(miniGameState.reaction);
    updateMiniGameSurfaceStateClasses();
    setMiniGameStatus(challenge ? `成功 ${requiredHits} 次即可进化，可以失误 ${allowedMisses} 次。` : `看准绿色发光区域，累计命中次数。可以失误 ${allowedMisses} 次。`);
    void Promise.all([loadMiniGamePetHead(), loadMiniGamePetSprites()]);
    startMiniGameLoop(drawReactionWheelGame);
  }

  const FLAPPY_WIDTH = 900;
  const FLAPPY_HEIGHT = 540;
  const FLAPPY_GROUND_Y = 462;
  const FLAPPY_PLAYER_X = 210;
  const FLAPPY_PLAYER_RADIUS = 23;
  const FLAPPY_PLAYER_VISUAL_SIZE = 72;
  const FLAPPY_PIPE_WIDTH = 72;
  const FLAPPY_PIPE_COLLISION_INSET = 10;
  const FLAPPY_GRAVITY = 1420;
  const FLAPPY_VELOCITY = -465;
  const FLAPPY_CONFIG = { speed: 245, gap: 148, spawnEvery: 1.62 };

  function createFlappyPipe(x, id) {
    const safeTop = 86 + FLAPPY_CONFIG.gap / 2;
    const safeBottom = FLAPPY_GROUND_Y - 72 - FLAPPY_CONFIG.gap / 2;
    return {
      id,
      x,
      gapY: safeTop + Math.random() * Math.max(1, safeBottom - safeTop),
      gap: FLAPPY_CONFIG.gap,
      passed: false
    };
  }

  function createFlappyGame(phase = 'idle') {
    return {
      phase,
      playerY: 238,
      velocity: phase === 'playing' ? FLAPPY_VELOCITY : 0,
      pipes: [createFlappyPipe(720, 1)],
      score: 0,
      spawnIn: FLAPPY_CONFIG.spawnEvery,
      nextId: 2,
      cloudDrift: 0,
      statusShown: false
    };
  }

  function drawFlappyPipe(ctx, pipe) {
    const topHeight = pipe.gapY - pipe.gap / 2;
    const bottomY = pipe.gapY + pipe.gap / 2;
    ctx.save();
    ctx.fillStyle = '#58c79d';
    drawMiniGameRoundedRect(ctx, pipe.x, -12, FLAPPY_PIPE_WIDTH, topHeight + 12, 16);
    ctx.fill();
    drawMiniGameRoundedRect(ctx, pipe.x, bottomY, FLAPPY_PIPE_WIDTH, FLAPPY_GROUND_Y - bottomY, 16);
    ctx.fill();
    ctx.fillStyle = '#43ad86';
    drawMiniGameRoundedRect(ctx, pipe.x - 6, topHeight - 20, FLAPPY_PIPE_WIDTH + 12, 30, 14);
    ctx.fill();
    drawMiniGameRoundedRect(ctx, pipe.x - 6, bottomY - 10, FLAPPY_PIPE_WIDTH + 12, 30, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(32,96,75,.22)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pipe.x + 15, 12);
    ctx.lineTo(pipe.x + 15, topHeight - 28);
    ctx.moveTo(pipe.x + 15, bottomY + 32);
    ctx.lineTo(pipe.x + 15, FLAPPY_GROUND_Y - 12);
    ctx.stroke();
    ctx.restore();
  }

  function finishFlappyMiniGame(game) {
    if (!game || game.phase === 'finished') return;
    game.phase = 'finished';
    setMiniGameStatus(finishMiniGameRound('flappy', game.score));
    const { actions, retryButton, actionButton } = getMiniGameElements();
    if (actions) actions.hidden = false;
    if (actionButton) {
      actionButton.hidden = false;
      actionButton.textContent = localize('再飞一次');
    }
    if (retryButton) retryButton.hidden = true;
    updateMiniGameSurfaceStateClasses();
  }

  function startFlappyMiniGame() {
    const { picker, actions, actionButton, retryButton, title } = getMiniGameElements();
    if (picker) picker.hidden = true;
    setMiniGameCanvasVisible(true);
    if (title) title.textContent = localize('CY跳跳跳');
    if (actions) actions.hidden = true;
    if (actionButton) {
      actionButton.hidden = true;
      actionButton.textContent = localize('开始');
    }
    if (retryButton) retryButton.hidden = true;
    setRunnerControlsVisible(false);
    miniGameState.type = 'flappy';
    miniGameState.flappy = createFlappyGame('idle');
    updateMiniGameSurfaceStateClasses();
    setMiniGameStatus('点击画面或按空格，让宠物飞起来。');
    void Promise.all([loadMiniGamePetHead(), loadMiniGamePetSprites()]);
    startMiniGameLoop(drawFlappyMiniGame);
  }

  function drawFlappyMiniGame(ctx, time, delta) {
    const game = miniGameState.flappy;
    if (!game) return;
    game.cloudDrift += delta * 34;
    if (game.phase === 'playing') {
      game.velocity += FLAPPY_GRAVITY * delta;
      game.playerY += game.velocity * delta;
      game.spawnIn -= delta;
      if (game.spawnIn <= 0) {
        game.pipes.push(createFlappyPipe(FLAPPY_WIDTH + 60, game.nextId));
        game.nextId += 1;
        game.spawnIn = FLAPPY_CONFIG.spawnEvery;
      }
      game.pipes = game.pipes
        .map(pipe => ({ ...pipe, x: pipe.x - FLAPPY_CONFIG.speed * delta }))
        .filter(pipe => pipe.x > -FLAPPY_PIPE_WIDTH - 24);
      for (const pipe of game.pipes) {
        if (!pipe.passed && pipe.x + FLAPPY_PIPE_WIDTH < FLAPPY_PLAYER_X - FLAPPY_PLAYER_RADIUS) {
          pipe.passed = true;
          game.score += 1;
          setMiniGameStatus('穿过了！继续保持节奏。');
        }
        const topHeight = pipe.gapY - pipe.gap / 2;
        const bottomY = pipe.gapY + pipe.gap / 2;
        const collisionX = pipe.x + FLAPPY_PIPE_COLLISION_INSET;
        const collisionWidth = Math.max(24, FLAPPY_PIPE_WIDTH - FLAPPY_PIPE_COLLISION_INSET * 2);
        const hitTop = circleHitsMiniGameRect(
          FLAPPY_PLAYER_X,
          game.playerY,
          FLAPPY_PLAYER_RADIUS,
          collisionX,
          0,
          collisionWidth,
          Math.max(0, topHeight - FLAPPY_PIPE_COLLISION_INSET)
        );
        const hitBottom = circleHitsMiniGameRect(
          FLAPPY_PLAYER_X,
          game.playerY,
          FLAPPY_PLAYER_RADIUS,
          collisionX,
          bottomY + FLAPPY_PIPE_COLLISION_INSET,
          collisionWidth,
          Math.max(0, FLAPPY_GROUND_Y - bottomY - FLAPPY_PIPE_COLLISION_INSET)
        );
        if (hitTop || hitBottom) {
          finishFlappyMiniGame(game);
          break;
        }
      }
      if (
        game.phase === 'playing' &&
        (game.playerY - FLAPPY_PLAYER_RADIUS <= 0 || game.playerY + FLAPPY_PLAYER_RADIUS >= FLAPPY_GROUND_Y)
      ) {
        finishFlappyMiniGame(game);
      }
    }

    const sky = ctx.createLinearGradient(0, 0, 0, FLAPPY_HEIGHT);
    sky.addColorStop(0, '#bde7ff');
    sky.addColorStop(0.62, '#fff8df');
    sky.addColorStop(1, '#d8f4dc');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, FLAPPY_WIDTH, FLAPPY_HEIGHT);
    drawMiniGameCloud(ctx, 70 - (game.cloudDrift % 980), 70, 1);
    drawMiniGameCloud(ctx, 390 - ((game.cloudDrift * 0.72) % 980), 118, 0.74);
    drawMiniGameCloud(ctx, 760 - ((game.cloudDrift * 0.9) % 980), 62, 0.86);
    drawMiniGameCloud(ctx, 1050 - (game.cloudDrift % 980), 96, 1.08);
    game.pipes.forEach(pipe => drawFlappyPipe(ctx, pipe));
    ctx.fillStyle = '#8fdc9f';
    ctx.fillRect(0, FLAPPY_GROUND_Y, FLAPPY_WIDTH, FLAPPY_HEIGHT - FLAPPY_GROUND_Y);
    ctx.fillStyle = '#71c789';
    for (let x = -40; x < FLAPPY_WIDTH + 40; x += 42) {
      ctx.beginPath();
      ctx.ellipse(x - (game.cloudDrift % 42), FLAPPY_GROUND_Y + 18, 28, 9, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    const tilt = clampMiniGame(game.velocity / 620, -0.42, 0.52);
    const petSprite = miniGameState.spriteImages?.jump || miniGameState.spriteImages?.run || miniGameState.spriteImages?.idle || miniGameState.headImage;
    drawMiniGamePetSprite(ctx, FLAPPY_PLAYER_X, game.playerY, FLAPPY_PLAYER_VISUAL_SIZE, FLAPPY_PLAYER_VISUAL_SIZE, {
      image: petSprite,
      angle: game.phase === 'finished' ? 0.45 : tilt
    });
    ctx.fillStyle = 'rgba(255,255,255,.82)';
    drawMiniGameRoundedRect(ctx, 24, 20, 158, 56, 12);
    ctx.fill();
    ctx.fillStyle = '#26313d';
    ctx.font = '1000 30px "Avenir Next", "PingFang SC", sans-serif';
    ctx.fillText(`${game.score}`, 48, 58);
    ctx.font = '850 15px "Avenir Next", "PingFang SC", sans-serif';
    ctx.fillStyle = '#64707a';
    ctx.fillText(localize('分数'), 92, 58);
    if (game.phase !== 'playing') {
      ctx.fillStyle = 'rgba(255,254,250,.84)';
      drawMiniGameRoundedRect(ctx, 250, 160, 400, 160, 12);
      ctx.fill();
      ctx.fillStyle = '#26313d';
      ctx.textAlign = 'center';
      ctx.font = '1000 34px "Avenir Next", "PingFang SC", sans-serif';
      ctx.fillText(localize(game.phase === 'finished' ? '再飞一次' : '准备起飞'), 450, 216);
      ctx.font = '850 18px "Avenir Next", "PingFang SC", sans-serif';
      ctx.fillStyle = '#64707a';
      ctx.fillText(localize(game.phase === 'finished' ? `本次得分 ${game.score}` : '点击、触屏或按空格上弹'), 450, 258);
      ctx.textAlign = 'left';
    }
  }

  function flapMiniGamePet() {
    const game = miniGameState.flappy;
    if (!game) return;
    const { actions, actionButton, retryButton } = getMiniGameElements();
    if (game.phase !== 'playing') {
      miniGameState.flappy = createFlappyGame('playing');
      if (actions) actions.hidden = true;
      if (actionButton) actionButton.hidden = true;
      if (retryButton) retryButton.hidden = true;
      setMiniGameStatus('保持节奏，穿过云门。');
      return;
    }
    game.velocity = FLAPPY_VELOCITY;
    setMiniGameStatus('扑一下！');
  }

  const JUMP_CHARGE_WIDTH = 900;
  const JUMP_CHARGE_HEIGHT = 540;
  const JUMP_CHARGE_MAX_HOLD_MS = 1280;
  const JUMP_CHARGE_MIN_DISTANCE = 88;
  const JUMP_CHARGE_POWER_DISTANCE = 276;
  const JUMP_CHARGE_PLATFORM_MIN_DISTANCE = 178;
  const JUMP_CHARGE_PLATFORM_MAX_DISTANCE = 302;
  const JUMP_CHARGE_PLATFORM_SIZE = 92;
  const JUMP_CHARGE_PET_SCALE = 0.58;
  const JUMP_CHARGE_CENTER_BONUS_RADIUS = 20;
  const JUMP_CHARGE_RIPPLE_MS = 760;
  const JUMP_CHARGE_PERFECT_RINGS = 4;
  const JUMP_CHARGE_DIRECTIONS = {
    right: { x: 0.902, y: -0.432 },
    left: { x: -0.902, y: -0.432 }
  };
  const JUMP_CHARGE_ASSET_SOURCES = {
    background: 'assets/mini-games/jump-one-jump/background/sky-city.png',
    platforms: {
      right: {
        src: 'assets/mini-games/jump-one-jump/platforms/platform-right.png',
        anchorX: 0.5,
        anchorY: 0.48,
        drawScale: 2.35,
        hitScale: 0.58
      },
      left: {
        src: 'assets/mini-games/jump-one-jump/platforms/platform-left.png',
        anchorX: 0.5,
        anchorY: 0.48,
        drawScale: 2.35,
        hitScale: 0.58
      },
      round: {
        src: 'assets/mini-games/jump-one-jump/platforms/platform-round.png',
        anchorX: 0.5,
        anchorY: 0.48,
        drawScale: 2.2,
        hitScale: 0.56
      }
    }
  };

  async function loadJumpChargeMiniGameAssets() {
    if (miniGameState.jumpChargeAssets) return miniGameState.jumpChargeAssets;
    try {
      const [background, platformEntries] = await Promise.all([
        loadCanvasImage(withAssetVersion(JUMP_CHARGE_ASSET_SOURCES.background)),
        Promise.all(Object.entries(JUMP_CHARGE_ASSET_SOURCES.platforms).map(async ([key, meta]) => [
          key,
          { ...meta, image: await loadCanvasImage(withAssetVersion(meta.src)) }
        ]))
      ]);
      miniGameState.jumpChargeAssets = {
        background,
        platforms: Object.fromEntries(platformEntries)
      };
      return miniGameState.jumpChargeAssets;
    } catch (error) {
      console.info('Jump charge mini game assets could not be loaded.', error);
      miniGameState.jumpChargeAssets = { background: null, platforms: {} };
      return miniGameState.jumpChargeAssets;
    }
  }

  function resolveMiniGameActionSprite(action = 'idle', facing = 1) {
    const sprites = miniGameState.spriteImages || {};
    const useLeft = Number(facing || 1) < 0;
    if (action === 'jump') {
      return useLeft
        ? (sprites.jumpLeft || sprites.jump || sprites.runLeft || sprites.idleLeft || sprites.idle || sprites.run)
        : (sprites.jump || sprites.run || sprites.idle || sprites.jumpLeft || sprites.runLeft || sprites.idleLeft);
    }
    if (action === 'duck') {
      return useLeft
        ? (sprites.duckLeft || sprites.duck || sprites.idleLeft || sprites.idle || sprites.run)
        : (sprites.duck || sprites.idle || sprites.run || sprites.duckLeft || sprites.idleLeft);
    }
    return useLeft
      ? (sprites.idleLeft || sprites.runLeft || sprites.idle || sprites.run)
      : (sprites.idle || sprites.run || sprites.idleLeft || sprites.runLeft);
  }

  function makeJumpChargePlatform(x, y, incomingDirection, size, assetKey) {
    const meta = JUMP_CHARGE_ASSET_SOURCES.platforms[assetKey] || JUMP_CHARGE_ASSET_SOURCES.platforms[incomingDirection] || JUMP_CHARGE_ASSET_SOURCES.platforms.right;
    return {
      x,
      y,
      incomingDirection,
      assetKey,
      size,
      hitRadius: size * (meta.hitScale || 0.56),
      alpha: 1
    };
  }

  function appendJumpChargePlatform(game) {
    const previous = game.platforms[game.platforms.length - 1];
    const direction = Math.random() > 0.5 ? 'right' : 'left';
    const vector = JUMP_CHARGE_DIRECTIONS[direction];
    const jumpDistance = randomMiniGame(JUMP_CHARGE_PLATFORM_MIN_DISTANCE, JUMP_CHARGE_PLATFORM_MAX_DISTANCE);
    const size = JUMP_CHARGE_PLATFORM_SIZE * randomMiniGame(0.88, 1.08);
    const assetKey = Math.random() < 0.18 ? 'round' : direction;
    game.platforms.push(makeJumpChargePlatform(
      previous.x + vector.x * jumpDistance,
      previous.y + vector.y * jumpDistance,
      direction,
      size,
      assetKey
    ));
  }

  function setJumpChargeCameraTarget(game, immediate = false) {
    const current = game.platforms[game.currentIndex];
    if (!current) return;
    game.camera.targetX = current.x - JUMP_CHARGE_WIDTH * 0.5;
    game.camera.targetY = current.y - JUMP_CHARGE_HEIGHT * 0.68;
    if (immediate) {
      game.camera.x = game.camera.targetX;
      game.camera.y = game.camera.targetY;
    }
  }

  function updateJumpChargePetFacing(game) {
    const next = game.platforms[game.currentIndex + 1];
    game.player.facing = next?.incomingDirection === 'left' ? -1 : 1;
  }

  function ensureFutureJumpChargePlatforms(game) {
    while (game.platforms.length - game.currentIndex < 5) appendJumpChargePlatform(game);
    if (game.currentIndex > 3) {
      game.platforms.splice(0, game.currentIndex - 2);
      game.currentIndex = 2;
    }
    updateJumpChargePetFacing(game);
  }

  function createJumpChargeGame() {
    const game = {
      phase: 'ready',
      score: 0,
      combo: 0,
      platforms: [makeJumpChargePlatform(0, 0, 'right', JUMP_CHARGE_PLATFORM_SIZE, 'right')],
      currentIndex: 0,
      camera: { x: 0, y: 0, targetX: 0, targetY: 0 },
      player: { x: 0, y: 0, rotation: 0, squash: 1, shadow: 1, facing: 1 },
      charge: { active: false, startedAt: 0, value: 0 },
      jump: null,
      fall: null,
      ripples: [],
      feedback: '准备跳跃'
    };
    while (game.platforms.length < 5) appendJumpChargePlatform(game);
    const current = game.platforms[game.currentIndex];
    game.player.x = current.x;
    game.player.y = current.y;
    updateJumpChargePetFacing(game);
    setJumpChargeCameraTarget(game, true);
    return game;
  }

  function jumpChargeDistanceForValue(value) {
    return JUMP_CHARGE_MIN_DISTANCE + clampMiniGame(value, 0, 1) * JUMP_CHARGE_POWER_DISTANCE;
  }

  function jumpChargeWorldToScreen(game, point) {
    return {
      x: point.x - game.camera.x,
      y: point.y - game.camera.y
    };
  }

  function getJumpChargePlatformEntry(platform) {
    const assets = miniGameState.jumpChargeAssets?.platforms || {};
    return assets[platform.assetKey] || assets[platform.incomingDirection] || assets.right || null;
  }

  function startJumpChargeMiniGame() {
    const { picker, actions, actionButton, retryButton, title } = getMiniGameElements();
    if (picker) picker.hidden = true;
    setMiniGameCanvasVisible(true);
    if (title) title.textContent = localize('CY跳一跳');
    if (actions) actions.hidden = true;
    if (actionButton) {
      actionButton.hidden = true;
      actionButton.textContent = localize('按住蓄力');
    }
    if (retryButton) retryButton.hidden = true;
    setRunnerControlsVisible(false);
    miniGameState.type = 'jumpCharge';
    miniGameState.jumpCharge = createJumpChargeGame();
    updateMiniGameSurfaceStateClasses();
    setMiniGameStatus('按住画面或 Space 蓄力，松开跳到下一块平台。');
    void Promise.all([loadMiniGamePetSprites(), loadJumpChargeMiniGameAssets()]);
    startMiniGameLoop(drawJumpChargeMiniGame);
  }

  function startJumpChargeMiniGameCharge(event = {}) {
    const game = miniGameState.jumpCharge;
    if (!game) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (game.phase === 'ended') {
      startJumpChargeMiniGame();
      return;
    }
    if (game.phase !== 'ready') return;
    try {
      if (event.pointerId !== undefined && event.target?.setPointerCapture) event.target.setPointerCapture(event.pointerId);
    } catch (error) {
      console.info('Pointer capture is not available for jump charge.', error);
    }
    game.phase = 'charging';
    game.charge.active = true;
    game.charge.startedAt = performance.now();
    game.charge.value = 0;
    game.feedback = '蓄力中，松开就跳！';
    playMiniGameSound('charge');
    setMiniGameStatus('蓄力中，松开就跳！');
  }

  function releaseJumpChargeMiniGame() {
    const game = miniGameState.jumpCharge;
    if (!game || game.phase !== 'charging' || !game.charge.active) return;
    const current = game.platforms[game.currentIndex];
    const next = game.platforms[game.currentIndex + 1];
    if (!current || !next) return;
    const now = performance.now();
    const holdValue = clampMiniGame((now - game.charge.startedAt) / JUMP_CHARGE_MAX_HOLD_MS, 0, 1);
    game.charge.value = holdValue;
    const direction = JUMP_CHARGE_DIRECTIONS[next.incomingDirection] || JUMP_CHARGE_DIRECTIONS.right;
    const jumpDistance = jumpChargeDistanceForValue(holdValue);
    const landing = {
      x: current.x + direction.x * jumpDistance,
      y: current.y + direction.y * jumpDistance
    };
    game.phase = 'jumping';
    game.charge.active = false;
    game.player.facing = next.incomingDirection === 'left' ? -1 : 1;
    game.jump = {
      fromX: current.x,
      fromY: current.y,
      toX: landing.x,
      toY: landing.y,
      startedAt: now,
      duration: clampMiniGame(500 + jumpDistance * 1.04, 610, 860),
      arc: clampMiniGame(jumpDistance * 0.38, 82, 140)
    };
    game.feedback = '跳出去了！';
    playMiniGameSound('jump');
    setMiniGameStatus('跳出去了！');
  }

  function finishJumpChargeMiniGameJump(game) {
    const target = game.platforms[game.currentIndex + 1];
    if (!target || !game.jump) return;
    const miss = distanceMiniGame(game.jump.toX, game.jump.toY, target.x, target.y);
    game.player.x = game.jump.toX;
    game.player.y = game.jump.toY;
    game.player.rotation = 0;
    game.jump = null;
    if (miss <= target.hitRadius) {
      const perfect = miss <= JUMP_CHARGE_CENTER_BONUS_RADIUS;
      game.combo = perfect ? game.combo + 1 : 0;
      game.score += perfect ? 2 + Math.min(game.combo, 5) : 1;
      game.currentIndex += 1;
      const current = game.platforms[game.currentIndex];
      game.player.x = current.x;
      game.player.y = current.y;
      game.phase = 'ready';
      game.feedback = perfect ? '完美落点！中心奖励到手。' : '落稳了！继续看距离。';
      if (perfect) {
        game.ripples.push({ x: current.x, y: current.y, startedAt: performance.now() });
        playMiniGameSound('perfect');
      } else {
        playMiniGameSound('land');
      }
      ensureFutureJumpChargePlatforms(game);
      setJumpChargeCameraTarget(game, false);
      setMiniGameStatus(game.feedback);
      return;
    }
    game.combo = 0;
    game.phase = 'falling';
    game.fall = {
      startedAt: performance.now(),
      startX: game.player.x,
      startY: game.player.y
    };
    game.feedback = '落空了，分数收好啦。';
    playMiniGameSound('miss');
    setMiniGameStatus('落空了，分数收好啦。');
  }

  function finishJumpChargeMiniGame(game) {
    if (!game || game.phase === 'ended') return;
    game.phase = 'ended';
    game.player.rotation = 0;
    game.player.squash = 1;
    game.player.shadow = 1;
    setMiniGameStatus(finishMiniGameRound('jumpCharge', game.score));
    const { actions, actionButton, retryButton } = getMiniGameElements();
    if (actions) actions.hidden = false;
    if (actionButton) {
      actionButton.hidden = false;
      actionButton.textContent = localize('再跳一次');
    }
    if (retryButton) retryButton.hidden = true;
    setRunnerControlsVisible(false);
    updateMiniGameSurfaceStateClasses();
  }

  function updateJumpChargeMiniGame(game, time, delta) {
    const cameraEase = 1 - Math.pow(0.001, delta);
    game.camera.x = lerpMiniGame(game.camera.x, game.camera.targetX, cameraEase);
    game.camera.y = lerpMiniGame(game.camera.y, game.camera.targetY, cameraEase);
    if (game.phase === 'charging') {
      const held = (time - game.charge.startedAt) / JUMP_CHARGE_MAX_HOLD_MS;
      game.charge.value = clampMiniGame(held, 0, 1);
      game.player.squash = 1 - game.charge.value * 0.22;
      game.player.shadow = 1 + game.charge.value * 0.28;
    } else {
      game.charge.value = game.phase === 'jumping' ? game.charge.value : 0;
      game.player.squash = lerpMiniGame(game.player.squash, 1, 1 - Math.pow(0.0001, delta));
      game.player.shadow = lerpMiniGame(game.player.shadow, 1, 1 - Math.pow(0.0001, delta));
    }
    if (game.phase === 'jumping' && game.jump) {
      const raw = clampMiniGame((time - game.jump.startedAt) / game.jump.duration, 0, 1);
      const progress = smoothstepMiniGame(raw);
      game.player.x = lerpMiniGame(game.jump.fromX, game.jump.toX, progress);
      game.player.y = lerpMiniGame(game.jump.fromY, game.jump.toY, progress) - Math.sin(Math.PI * progress) * game.jump.arc;
      game.player.rotation = Math.sin(Math.PI * progress) * 0.12 * Math.sign(game.jump.toX - game.jump.fromX);
      game.player.shadow = 0.56 + Math.abs(progress - 0.5) * 0.82;
      if (raw >= 1) finishJumpChargeMiniGameJump(game);
    }
    if (game.phase === 'falling' && game.fall) {
      const raw = clampMiniGame((time - game.fall.startedAt) / 720, 0, 1);
      game.player.x = game.fall.startX + Math.sin(raw * Math.PI) * 13 * game.player.facing;
      game.player.y = game.fall.startY + raw * raw * 230;
      game.player.rotation = raw * 1.18 * game.player.facing;
      game.player.shadow = Math.max(0, 1 - raw * 1.35);
      if (raw >= 1) finishJumpChargeMiniGame(game);
    }
    game.ripples = game.ripples.filter(ripple => time - ripple.startedAt < JUMP_CHARGE_RIPPLE_MS + 220);
  }

  function drawJumpChargeCoverImage(ctx, image, width, height) {
    if (!image) {
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, '#9fe5ff');
      bg.addColorStop(0.55, '#d9fbff');
      bg.addColorStop(1, '#ffe9b5');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      return;
    }
    const sourceWidth = Number(image.naturalWidth || image.width || 0);
    const sourceHeight = Number(image.naturalHeight || image.height || 0);
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  }

  function drawJumpChargePlatform(ctx, game, platform) {
    const entry = getJumpChargePlatformEntry(platform);
    const point = jumpChargeWorldToScreen(game, platform);
    ctx.save();
    ctx.globalAlpha = platform.alpha;
    if (entry?.image) {
      const drawWidth = platform.size * (entry.drawScale || 2.2);
      const drawHeight = drawWidth * (entry.image.height / entry.image.width);
      ctx.drawImage(
        entry.image,
        point.x - drawWidth * (entry.anchorX || 0.5),
        point.y - drawHeight * (entry.anchorY || 0.48),
        drawWidth,
        drawHeight
      );
    } else {
      ctx.fillStyle = '#4fc3a7';
      ctx.beginPath();
      ctx.ellipse(point.x, point.y, platform.size * 0.78, platform.size * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#317a8e';
      ctx.beginPath();
      ctx.ellipse(point.x, point.y + platform.size * 0.18, platform.size * 0.72, platform.size * 0.28, 0, 0, Math.PI);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawJumpChargeRippleFeedback(ctx, game, time) {
    game.ripples.forEach(ripple => {
      const origin = jumpChargeWorldToScreen(game, ripple);
      for (let ring = 0; ring < JUMP_CHARGE_PERFECT_RINGS; ring += 1) {
        const offset = ring * 92;
        const progress = clampMiniGame((time - ripple.startedAt - offset) / JUMP_CHARGE_RIPPLE_MS, 0, 1);
        if (progress <= 0 || progress >= 1) continue;
        ctx.save();
        ctx.globalAlpha = (1 - progress) * 0.72;
        ctx.lineWidth = 3 + ring * 0.8;
        ctx.strokeStyle = ring % 2 ? 'rgba(68,194,178,.92)' : 'rgba(255,211,80,.92)';
        ctx.beginPath();
        ctx.ellipse(origin.x, origin.y + 8, 26 + progress * 86, 9 + progress * 28, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    });
  }

  function drawJumpChargePetSprite(ctx, game, time) {
    const point = jumpChargeWorldToScreen(game, game.player);
    const inAir = game.phase === 'jumping' || game.phase === 'falling';
    const action = inAir ? 'jump' : 'idle';
    const facing = Number(game.player.facing || 1) < 0 ? -1 : 1;
    const sprite = resolveMiniGameActionSprite(action, facing);
    const fallbackSprite = resolveMiniGameActionSprite(action, 1);
    const width = getKuromiRoomActionWidth(action) * JUMP_CHARGE_PET_SCALE;
    const height = getKuromiRoomActionHeight(action) * JUMP_CHARGE_PET_SCALE;
    const usingMirroredFallback = facing < 0 && sprite === fallbackSprite && !miniGameState.spriteImages?.jumpLeft && action === 'jump';
    const idleBreath = !inAir ? Math.sin(time * 0.008) * 0.018 : 0;
    ctx.save();
    ctx.globalAlpha = clampMiniGame(game.player.shadow, 0, 1);
    ctx.fillStyle = 'rgba(24,36,54,.22)';
    ctx.beginPath();
    ctx.ellipse(point.x, point.y + 8, width * 0.33 * game.player.shadow, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(game.player.rotation || 0);
    ctx.scale((usingMirroredFallback ? -1 : 1) * (1 + (1 - game.player.squash) * 0.24 + idleBreath), game.player.squash - idleBreath);
    ctx.imageSmoothingEnabled = false;
    if (sprite) {
      ctx.drawImage(sprite, -width / 2, -height, width, height);
    } else {
      ctx.fillStyle = '#6a63f4';
      ctx.font = '900 42px "Avenir Next", "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('◇', 0, -height * 0.42);
    }
    ctx.restore();
  }

  function drawJumpChargeHud(ctx, game) {
    ctx.save();
    ctx.fillStyle = 'rgba(255,254,250,.86)';
    drawMiniGameRoundedRect(ctx, 24, 20, 188, 64, 14);
    ctx.fill();
    ctx.fillStyle = '#25313d';
    ctx.font = '1000 30px "Avenir Next", "PingFang SC", sans-serif';
    ctx.fillText(`${game.score}`, 48, 60);
    ctx.fillStyle = '#64707a';
    ctx.font = '850 15px "Avenir Next", "PingFang SC", sans-serif';
    ctx.fillText(localize('分数'), 108, 60);
    if (game.combo > 0) {
      ctx.fillStyle = '#7d5af2';
      ctx.font = '900 16px "Avenir Next", "PingFang SC", sans-serif';
      ctx.fillText(`COMBO x${game.combo}`, 48, 78);
    }
    const meterWidth = 228;
    const meterX = JUMP_CHARGE_WIDTH - meterWidth - 28;
    const meterY = 34;
    ctx.fillStyle = 'rgba(255,254,250,.8)';
    drawMiniGameRoundedRect(ctx, meterX, meterY, meterWidth, 22, 11);
    ctx.fill();
    const fillWidth = Math.max(10, meterWidth * clampMiniGame(game.charge.value, 0, 1));
    const gradient = ctx.createLinearGradient(meterX, 0, meterX + meterWidth, 0);
    gradient.addColorStop(0, '#5d63f0');
    gradient.addColorStop(1, '#44c2b2');
    ctx.fillStyle = gradient;
    drawMiniGameRoundedRect(ctx, meterX, meterY, fillWidth, 22, 11);
    ctx.fill();
    ctx.fillStyle = '#25313d';
    ctx.font = '900 18px "Avenir Next", "PingFang SC", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(localize(game.feedback || '准备跳跃'), JUMP_CHARGE_WIDTH - 32, 86);
    ctx.restore();
  }

  function drawJumpChargeMiniGame(ctx, time, delta) {
    const game = miniGameState.jumpCharge;
    if (!game) return;
    updateJumpChargeMiniGame(game, time, delta);
    ctx.clearRect(0, 0, JUMP_CHARGE_WIDTH, JUMP_CHARGE_HEIGHT);
    drawJumpChargeCoverImage(ctx, miniGameState.jumpChargeAssets?.background, JUMP_CHARGE_WIDTH, JUMP_CHARGE_HEIGHT);
    ctx.fillStyle = 'rgba(10,28,52,.12)';
    ctx.fillRect(0, 0, JUMP_CHARGE_WIDTH, JUMP_CHARGE_HEIGHT);
    [...game.platforms]
      .sort((a, b) => a.y - b.y)
      .forEach(platform => drawJumpChargePlatform(ctx, game, platform));
    drawJumpChargeRippleFeedback(ctx, game, time);
    drawJumpChargePetSprite(ctx, game, time);
    drawJumpChargeHud(ctx, game);
    if (game.phase === 'ready' || game.phase === 'charging' || game.phase === 'ended') {
      ctx.save();
      ctx.fillStyle = 'rgba(255,254,250,.84)';
      drawMiniGameRoundedRect(ctx, 260, 420, 380, 82, 14);
      ctx.fill();
      ctx.fillStyle = '#25313d';
      ctx.textAlign = 'center';
      ctx.font = '1000 24px "Avenir Next", "PingFang SC", sans-serif';
      ctx.fillText(localize(game.phase === 'ended' ? '再跳一次' : '准备跳跃'), JUMP_CHARGE_WIDTH / 2, 454);
      ctx.fillStyle = '#64707a';
      ctx.font = '850 16px "Avenir Next", "PingFang SC", sans-serif';
      ctx.fillText(localize(game.phase === 'ended' ? `本次得分 ${game.score}` : '点击、触屏或按住 Space 蓄力'), JUMP_CHARGE_WIDTH / 2, 482);
      ctx.restore();
    }
  }

  const RUNNER_WIDTH = 900;
  const RUNNER_HEIGHT = 540;
  const RUNNER_GROUND_Y = 414;
  const RUNNER_PLAYER_X = 96;
  const RUNNER_PLAYER_SIZE = 78;
  const RUNNER_PET_SCALE = 0.48;
  const RUNNER_GRAVITY = 2350;
  const RUNNER_JUMP_VELOCITY = -720;
  const RUNNER_JUMP_HOLD_GRAVITY_SCALE = 0.52;
  const RUNNER_MAX_JUMP_HOLD_MS = 260;
  const RUNNER_FAST_DROP_GRAVITY = 5200;
  const RUNNER_FAST_DROP_MIN_VELOCITY = 920;
  const RUNNER_START_SPEED = 410;
  const RUNNER_SPEED_RAMP = 0.02;
  const RUNNER_SPEED_SOFT_CAP = 700;
  const RUNNER_MAX_SPEED = 880;
  const RUNNER_LATE_SPEED_ACCELERATION = 0.007;
  const RUNNER_LATE_DIFFICULTY_START_SCORE = 350;
  const RUNNER_LATE_DIFFICULTY_FULL_SCORE = 1000;
  const RUNNER_MIN_SPAWN_DELAY = 0.52;

  function createRunnerPlayer() {
    return {
      x: RUNNER_PLAYER_X,
      y: RUNNER_GROUND_Y - RUNNER_PLAYER_SIZE,
      width: RUNNER_PLAYER_SIZE,
      height: RUNNER_PLAYER_SIZE,
      velocityY: 0,
      jumpHeld: false,
      jumpHoldUntil: 0,
      fastDropping: false,
      onGround: true
    };
  }

  function createRunnerGame(phase = 'ready') {
    return {
      phase,
      player: createRunnerPlayer(),
      obstacles: [],
      clouds: [
        { drift: 18, scale: 1, x: 110, y: 64 },
        { drift: 25, scale: 0.78, x: 430, y: 42 },
        { drift: 20, scale: 0.92, x: 730, y: 76 }
      ],
      distance: 0,
      nextId: 1,
      score: 0,
      shake: 0,
      spawnIn: 0.9,
      speed: RUNNER_START_SPEED,
      ducking: false,
      statusShown: false
    };
  }

  function getRunnerLateDifficulty(score) {
    const span = RUNNER_LATE_DIFFICULTY_FULL_SCORE - RUNNER_LATE_DIFFICULTY_START_SCORE;
    return Math.min(1, Math.max(0, (score - RUNNER_LATE_DIFFICULTY_START_SCORE) / span));
  }

  function calculateRunnerSpeed(distance) {
    const earlySpeed = RUNNER_START_SPEED + distance * RUNNER_SPEED_RAMP;
    if (earlySpeed < RUNNER_SPEED_SOFT_CAP) return earlySpeed;
    const softCapDistance = (RUNNER_SPEED_SOFT_CAP - RUNNER_START_SPEED) / RUNNER_SPEED_RAMP;
    const lateDistance = Math.max(0, distance - softCapDistance);
    return Math.min(RUNNER_MAX_SPEED, RUNNER_SPEED_SOFT_CAP + lateDistance * RUNNER_LATE_SPEED_ACCELERATION);
  }

  function randomRunnerSpawnDelay(speed, score) {
    const difficulty = getRunnerLateDifficulty(score);
    const baseDelay = 1.3 - (speed - RUNNER_START_SPEED) / 960 - difficulty * 0.2;
    const jitter = Math.random() * (0.52 - difficulty * 0.14);
    return Math.max(RUNNER_MIN_SPAWN_DELAY, baseDelay + jitter);
  }

  function spawnRunnerObstacle(game) {
    const canFly = game.score > 12;
    const difficulty = getRunnerLateDifficulty(game.score);
    const birdChance = canFly ? Math.min(0.38, 0.18 + difficulty * 0.22) : 0;
    const treeChance = game.score > 18 ? Math.min(0.22, 0.1 + difficulty * 0.12) : 0;
    const roll = Math.random();
    const kind = roll < birdChance ? 'bird' : (roll < birdChance + treeChance ? 'tree' : 'cactus');
    if (kind === 'bird') {
      const lowFlight = Math.random() < 0.72;
      game.obstacles.push({
        kind,
        id: game.nextId,
        x: RUNNER_WIDTH + 28,
        y: RUNNER_GROUND_Y - (lowFlight ? 78 : 130),
        width: 76,
        height: 44,
        variant: lowFlight ? 1 : 0,
        passed: false
      });
    } else if (kind === 'tree') {
      const variant = 1 + Math.floor(Math.random() * 2);
      const height = 52 + variant * 10;
      game.obstacles.push({
        kind,
        id: game.nextId,
        x: RUNNER_WIDTH + 26,
        y: RUNNER_GROUND_Y - height,
        width: 38 + variant * 8,
        height,
        variant,
        passed: false
      });
    } else {
      const variant = 1 + Math.floor(Math.random() * (difficulty > 0.75 ? 4 : 3));
      const height = 58 + variant * 12;
      game.obstacles.push({
        kind,
        id: game.nextId,
        x: RUNNER_WIDTH + 26,
        y: RUNNER_GROUND_Y - height,
        width: 34 + variant * 13,
        height,
        variant,
        passed: false
      });
    }
    game.nextId += 1;
    game.spawnIn = randomRunnerSpawnDelay(game.speed, game.score);
  }

  function getRunnerObstacleBox(obstacle) {
    if (obstacle.kind === 'bird') {
      return {
        x: obstacle.x + 4,
        y: obstacle.y + 4,
        width: Math.max(30, obstacle.width - 8),
        height: Math.max(28, obstacle.height - 8)
      };
    }
    if (obstacle.kind === 'tree') {
      return {
        x: obstacle.x + obstacle.width * 0.36,
        y: obstacle.y + obstacle.height * 0.5,
        width: Math.max(12, obstacle.width * 0.28),
        height: Math.max(24, obstacle.height * 0.46)
      };
    }
    return {
      x: obstacle.x + 5,
      y: obstacle.y + 5,
      width: Math.max(16, obstacle.width - 10),
      height: Math.max(16, obstacle.height - 10)
    };
  }

  function updateRunnerGame(game, delta) {
    if (!game || game.phase !== 'running') return;
    game.distance += game.speed * delta;
    game.speed = calculateRunnerSpeed(game.distance);
    game.score = Math.floor(game.distance / 20);
    const player = game.player;
    if (!player.onGround) {
      const stillHoldingJump = player.jumpHeld && player.velocityY < 0 && performance.now() < player.jumpHoldUntil;
      const gravity = player.fastDropping
        ? RUNNER_FAST_DROP_GRAVITY
        : (stillHoldingJump ? RUNNER_GRAVITY * RUNNER_JUMP_HOLD_GRAVITY_SCALE : RUNNER_GRAVITY);
      player.velocityY += gravity * delta;
      player.y += player.velocityY * delta;
      if (player.y + player.height >= RUNNER_GROUND_Y) {
        player.y = RUNNER_GROUND_Y - player.height;
        player.velocityY = 0;
        player.onGround = true;
        player.fastDropping = false;
        player.jumpHeld = false;
      }
    }
    game.spawnIn -= delta;
    if (game.spawnIn <= 0) spawnRunnerObstacle(game);
    game.obstacles.forEach(obstacle => { obstacle.x -= game.speed * delta; });
    game.obstacles = game.obstacles.filter(obstacle => obstacle.x + obstacle.width > -80);
    game.clouds.forEach(cloud => {
      cloud.x = cloud.x - cloud.drift * delta;
      if (cloud.x < -130) cloud.x = RUNNER_WIDTH + 120;
    });
    game.shake = Math.max(0, game.shake - delta * 3);
    const duckingOnGround = Boolean(game.ducking && player.onGround);
    const visualWidth = Math.max(18, getKuromiRoomActionWidth(duckingOnGround ? 'duck' : (!player.onGround ? 'jump' : 'walk')) * RUNNER_PET_SCALE);
    const visualHeight = Math.max(18, getKuromiRoomActionHeight(duckingOnGround ? 'duck' : (!player.onGround ? 'jump' : 'walk')) * RUNNER_PET_SCALE);
    const visualLeft = player.x + player.width / 2 - visualWidth / 2;
    const visualTop = player.y + player.height - visualHeight;
    const playerBox = {
      x: visualLeft + visualWidth * 0.22,
      y: visualTop + (duckingOnGround ? visualHeight * 0.52 : visualHeight * 0.18),
      width: visualWidth * 0.56,
      height: visualHeight * (duckingOnGround ? 0.34 : 0.64)
    };
    const crashed = game.obstacles.some(obstacle => boxesOverlapMiniGame(playerBox, getRunnerObstacleBox(obstacle)));
    if (crashed) {
      game.phase = 'over';
      game.shake = 1;
      setMiniGameStatus(finishMiniGameRound('runner', game.score));
      const { actions, retryButton, actionButton } = getMiniGameElements();
      if (actions) actions.hidden = true;
      if (actionButton) actionButton.hidden = true;
      if (retryButton) retryButton.hidden = true;
      setRunnerControlsVisible(true);
      updateMiniGameSurfaceStateClasses();
    }
  }

  function drawRunnerCactus(ctx, obstacle) {
    ctx.save();
    ctx.fillStyle = '#36ad7b';
    const stemWidth = obstacle.width / (obstacle.variant + 1.4);
    const center = obstacle.x + obstacle.width / 2 - stemWidth / 2;
    drawMiniGameRoundedRect(ctx, center, obstacle.y, stemWidth, obstacle.height, 7);
    ctx.fill();
    for (let index = 0; index < obstacle.variant; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const armY = obstacle.y + 14 + index * 12;
      drawMiniGameRoundedRect(ctx, center + side * (stemWidth + 4), armY, stemWidth * 0.76, 25, 6);
      ctx.fill();
      drawMiniGameRoundedRect(ctx, center + side * (stemWidth + 4), armY - 2, stemWidth * 1.32, 9, 5);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawRunnerBird(ctx, obstacle, distance) {
    const flap = Math.sin(distance / 24 + obstacle.id) > 0 ? -7 : 7;
    ctx.save();
    ctx.fillStyle = '#3a5269';
    drawMiniGameRoundedRect(ctx, obstacle.x + 13, obstacle.y + 10, 31, 18, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(obstacle.x + 27, obstacle.y + 14);
    ctx.lineTo(obstacle.x, obstacle.y + 16 + flap);
    ctx.lineTo(obstacle.x + 24, obstacle.y + 27);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(obstacle.x + 36, obstacle.y + 14);
    ctx.lineTo(obstacle.x + 61, obstacle.y + 16 - flap);
    ctx.lineTo(obstacle.x + 39, obstacle.y + 27);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fffefa';
    ctx.beginPath();
    ctx.arc(obstacle.x + 41, obstacle.y + 15, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawRunnerTree(ctx, obstacle) {
    ctx.save();
    const trunkWidth = Math.max(13, obstacle.width * 0.24);
    const trunkX = obstacle.x + obstacle.width / 2 - trunkWidth / 2;
    ctx.fillStyle = '#8a5d36';
    drawMiniGameRoundedRect(ctx, trunkX, obstacle.y + obstacle.height * 0.42, trunkWidth, obstacle.height * 0.58, 5);
    ctx.fill();
    ctx.fillStyle = '#2fb673';
    drawMiniGameRoundedRect(ctx, obstacle.x + 4, obstacle.y + obstacle.height * 0.22, obstacle.width - 8, obstacle.height * 0.48, 12);
    ctx.fill();
    ctx.fillStyle = '#35c982';
    drawMiniGameRoundedRect(ctx, obstacle.x, obstacle.y, obstacle.width, obstacle.height * 0.42, 16);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.beginPath();
    ctx.arc(obstacle.x + obstacle.width * 0.32, obstacle.y + obstacle.height * 0.18, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawRunnerMiniGamePet(ctx, game, time) {
    const player = game?.player;
    if (!player) return;
    const duckingOnGround = Boolean(game.ducking && player.onGround);
    const action = !player.onGround ? 'jump' : (duckingOnGround ? 'duck' : (game.phase === 'running' ? 'walk' : 'idle'));
    const scaledWidth = getKuromiRoomActionWidth(action) * RUNNER_PET_SCALE;
    const scaledHeight = getKuromiRoomActionHeight(action) * RUNNER_PET_SCALE;
    const baseY = player.y + player.height;
    const roomPlayer = {
      ducking: action === 'duck',
      lying: false,
      onGround: action !== 'jump',
      facing: 1,
      velocityX: action === 'walk' ? game.speed : 0,
      velocityY: player.velocityY || 0,
      walkCycle: (game.distance / 25) % (Math.PI * 2),
      idlePhaseOffset: 0,
      x: player.x + player.width / 2,
      y: baseY - getKuromiRoomActionHeight(action)
    };
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = '#25313d';
    ctx.beginPath();
    ctx.ellipse(player.x + player.width / 2, RUNNER_GROUND_Y + 9, 31, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    if (!miniGameState.spriteImages) {
      drawMiniGamePetHead(ctx, roomPlayer.x, baseY - (RUNNER_PLAYER_SIZE * RUNNER_PET_SCALE) / 2, RUNNER_PLAYER_SIZE * RUNNER_PET_SCALE, {
        pulse: game.phase === 'ready' ? Math.sin(time / 160) * 0.4 : 0
      });
      return;
    }
    drawKuromiRoomPlayer(ctx, roomPlayer, miniGameState.spriteImages, RUNNER_GROUND_Y, time, {
      scale: RUNNER_PET_SCALE,
      liftMultiplier: 0.08
    });
    if (scaledWidth > player.width * 1.7) {
      ctx.save();
      ctx.globalAlpha = 0.001;
      ctx.fillRect(player.x, baseY - scaledHeight, scaledWidth, scaledHeight);
      ctx.restore();
    }
  }

  function drawRunnerMiniGame(ctx, time, delta) {
    const game = miniGameState.runner;
    if (!game) return;
    updateRunnerGame(game, delta);
    ctx.clearRect(0, 0, RUNNER_WIDTH, RUNNER_HEIGHT);
    const sky = ctx.createLinearGradient(0, 0, 0, RUNNER_HEIGHT);
    sky.addColorStop(0, '#dff2ff');
    sky.addColorStop(0.58, '#fff8df');
    sky.addColorStop(1, '#effaf1');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, RUNNER_WIDTH, RUNNER_HEIGHT);
    ctx.fillStyle = 'rgba(255,214,107,.9)';
    ctx.beginPath();
    ctx.arc(760, 70, 30, 0, Math.PI * 2);
    ctx.fill();
    game.clouds.forEach(cloud => drawMiniGameCloud(ctx, cloud.x, cloud.y, cloud.scale, 0.88));
    ctx.save();
    if (game.shake > 0) ctx.translate(Math.sin(game.shake * 24) * 4, 0);
    ctx.strokeStyle = '#25313d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, RUNNER_GROUND_Y + 2);
    ctx.lineTo(RUNNER_WIDTH, RUNNER_GROUND_Y + 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(37,49,61,.22)';
    ctx.lineWidth = 2;
    const dashOffset = -(game.distance % 42);
    for (let x = dashOffset; x < RUNNER_WIDTH; x += 42) {
      ctx.beginPath();
      ctx.moveTo(x, RUNNER_GROUND_Y + 22);
      ctx.lineTo(x + 18, RUNNER_GROUND_Y + 22);
      ctx.stroke();
    }
    game.obstacles.forEach(obstacle => {
      if (obstacle.kind === 'bird') drawRunnerBird(ctx, obstacle, game.distance);
      else if (obstacle.kind === 'tree') drawRunnerTree(ctx, obstacle);
      else drawRunnerCactus(ctx, obstacle);
    });
    drawRunnerMiniGamePet(ctx, game, time);
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.82)';
    drawMiniGameRoundedRect(ctx, 24, 20, 170, 58, 12);
    ctx.fill();
    ctx.fillStyle = '#26313d';
    ctx.font = '1000 28px "Avenir Next", "PingFang SC", sans-serif';
    ctx.fillText(`${game.score}`, 48, 57);
    ctx.font = '850 15px "Avenir Next", "PingFang SC", sans-serif';
    ctx.fillStyle = '#64707a';
    ctx.fillText(`x${(game.speed / RUNNER_START_SPEED).toFixed(1)}`, 106, 57);
    if (game.phase !== 'running') {
      ctx.fillStyle = 'rgba(255,254,250,.84)';
      drawMiniGameRoundedRect(ctx, RUNNER_WIDTH / 2 - 135, 150, 270, 100, 12);
      ctx.fill();
      ctx.fillStyle = '#25313d';
      ctx.font = '1000 30px "Avenir Next", "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(localize(game.phase === 'over' ? '撞到了' : '准备开跑'), RUNNER_WIDTH / 2, 194);
      ctx.font = '850 17px "Avenir Next", "PingFang SC", sans-serif';
      ctx.fillStyle = '#64707a';
      ctx.fillText(localize(game.phase === 'over' ? `本次得分 ${game.score}，点画面再跑` : '点击跳起避开障碍'), RUNNER_WIDTH / 2, 224);
      ctx.textAlign = 'left';
    }
  }

  function startRunnerMiniGame() {
    const { picker, actions, actionButton, retryButton, title } = getMiniGameElements();
    if (picker) picker.hidden = true;
    setMiniGameCanvasVisible(true);
    if (title) title.textContent = localize('CY跑跑跑');
    if (actions) actions.hidden = true;
    if (actionButton) {
      actionButton.hidden = true;
      actionButton.textContent = localize('开始');
    }
    if (retryButton) retryButton.hidden = true;
    setRunnerControlsVisible(true);
    miniGameState.type = 'runner';
    miniGameState.runner = createRunnerGame('ready');
    updateMiniGameSurfaceStateClasses();
    setMiniGameStatus('点击跳起，避开路上的障碍。长按跳得更高，空中按蹲会快速落地。');
    void loadMiniGamePetSprites();
    startMiniGameLoop(drawRunnerMiniGame);
  }

  function pressRunnerMiniGameJump(holding = true) {
    let game = miniGameState.runner;
    if (!game) return;
    const { actionButton, retryButton } = getMiniGameElements();
    if (game.phase !== 'running') {
      game = createRunnerGame('running');
      miniGameState.runner = game;
      if (actionButton) actionButton.hidden = true;
      if (retryButton) retryButton.hidden = true;
      setRunnerControlsVisible(true);
      setMiniGameStatus('奔跑中！长按跳得更高，空中按蹲快速落地。');
    }
    const player = game.player;
    if (!holding) {
      player.jumpHeld = false;
      return;
    }
    if (player.onGround) {
      player.onGround = false;
      player.fastDropping = false;
      player.jumpHeld = true;
      player.jumpHoldUntil = performance.now() + RUNNER_MAX_JUMP_HOLD_MS;
      player.velocityY = RUNNER_JUMP_VELOCITY;
      setMiniGameStatus('跳！长按会更高。');
    }
  }

  function setRunnerMiniGameDuck(ducking) {
    const game = miniGameState.runner;
    if (!game) return;
    game.ducking = Boolean(ducking);
    const player = game.player;
    if (!player) return;
    if (game.ducking && !player.onGround) {
      player.jumpHeld = false;
      player.fastDropping = true;
      player.velocityY = Math.max(player.velocityY, RUNNER_FAST_DROP_MIN_VELOCITY);
      setMiniGameStatus('快速落地！');
    } else if (!game.ducking) {
      player.fastDropping = false;
    }
  }

  function jumpRunnerMiniGamePet() {
    pressRunnerMiniGameJump(true);
    window.setTimeout(() => pressRunnerMiniGameJump(false), 90);
  }

  function startMiniGame(type, options = {}) {
    miniGameState.result = null;
    miniGameState.mode = 'playing';
    if (type === 'reaction') startReactionWheelGame(options);
    else if (type === 'flappy') startFlappyMiniGame();
    else if (type === 'runner') startRunnerMiniGame();
    else if (type === 'jumpCharge') startJumpChargeMiniGame();
    const { overlay, hint } = getMiniGameElements();
    if (hint) hint.hidden = false;
    applyLanguage(overlay);
    updateMiniGameSurfaceStateClasses();
  }

  function runMiniGamePrimaryAction() {
    if (miniGameState.type === 'reaction') attemptReactionWheel();
    if (miniGameState.type === 'flappy') flapMiniGamePet();
    if (miniGameState.type === 'runner') jumpRunnerMiniGamePet();
    if (miniGameState.type === 'jumpCharge') {
      if (miniGameState.jumpCharge?.phase === 'ended') startJumpChargeMiniGame();
      else startJumpChargeMiniGameCharge();
    }
  }

  function retryMiniGame() {
    if (miniGameState.type === 'reaction') {
      startReactionWheelGame({
        challenge: Boolean(miniGameState.challenge),
        requiredHits: miniGameState.challenge?.requiredHits || miniGameState.reaction?.requiredHits || 5,
        allowedMisses: miniGameState.challenge?.allowedMisses ?? miniGameState.reaction?.allowedMisses ?? 0
      });
    } else if (miniGameState.type === 'flappy') {
      startFlappyMiniGame();
    } else if (miniGameState.type === 'runner') {
      startRunnerMiniGame();
    } else if (miniGameState.type === 'jumpCharge') {
      startJumpChargeMiniGame();
    }
  }

  function runEvolutionChallenge(options = {}) {
    const requiredHits = Math.max(1, Number(options.requiredHits || 6));
    const allowedMisses = Math.max(0, Number(options.allowedMisses ?? 0));
    const stage = options.stage === 'final' ? 'final' : 'mini';
    primeEvolutionCinematic();
    bindMiniGameKeyboardInput();
    return new Promise(resolve => {
      miniGameState.challenge = {
        stage,
        requiredHits,
        allowedMisses: Math.max(0, Number(options.allowedMisses ?? 0)),
        resolve,
        resolved: false
      };
      miniGameState.embeddedOpen = false;
      miniGameState.overlayOpen = true;
      const { overlay } = getMiniGameElements();
      if (overlay) overlay.classList.remove('hidden');
      startMiniGame('reaction', { challenge: true, requiredHits, allowedMisses, stage });
    });
  }

  function stopKuromiRoomDemo() {
    if (!kuromiRoomDemoState) return;
    if (kuromiRoomDemoState.animationFrame) cancelAnimationFrame(kuromiRoomDemoState.animationFrame);
    kuromiRoomDemoState.animationFrame = null;
    kuromiRoomDemoState.lastFrame = null;
    releaseKuromiRoomControls();
  }

  function renderPetInteraction() {
    const stage = $('#pet-interaction-stage');
    if (!stage) return;
    stopRoomAutoRefresh();
    if (miniGameState.embeddedOpen) {
      stopInteractionRoomLobbyRefresh();
      renderEmbeddedMiniGameShell();
      if (miniGameState.mode === 'picker') renderMiniGamePicker();
      updatePetWallRoomVisibility();
      updateKuromiRoomFullscreenUi();
      updateMiniGameFullscreenUi();
      applyLanguage(stage.closest('.pet-interaction-panel') || stage);
      return;
    }
    renderInteractionRoomLobby(getStudent());
    updatePetWallRoomVisibility();
    if (hasActiveInteractionRoom()) {
      stopInteractionRoomLobbyRefresh();
      renderKuromiRoomChatDemo(getStudent());
      initKuromiRoomDemo();
    } else {
      renderKuromiRoomChatDemo(getStudent());
      stopKuromiRoomDemo();
      if (interactionRoomState.lobbyMode === 'join') {
        startInteractionRoomLobbyRefresh();
        if (!interactionRoomState.roomsLoaded && !interactionRoomState.roomsLoading) void loadInteractionRooms();
      } else {
        stopInteractionRoomLobbyRefresh();
      }
    }
    updateKuromiRoomFullscreenUi();
    applyLanguage(stage.closest('.pet-interaction-panel') || stage);
  }

  function setPetInteractionScene(scene) {
    const stage = $('#pet-interaction-stage');
    if (!stage) return;
    const sceneId = PET_INTERACTION_SCENE_ALIASES[scene] || scene;
    const nextScene = PET_INTERACTION_SCENES[sceneId] ? sceneId : 'home';
    stage.dataset.scene = nextScene;
    $all('[data-pet-scene]').forEach(button => {
      const active = button.dataset.petScene === nextScene;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    localStorage.setItem(PET_INTERACTION_SCENE_KEY, nextScene);
  }

  function setPetInteractionEnabled(enabled, options = {}) {
    petInteractionEnabled = Boolean(enabled);
    const toggle = $('#pet-animation-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(petInteractionEnabled));
      toggle.textContent = localize(petInteractionEnabled ? 'Q版互动开启' : 'Q版互动关闭');
    }
    if (petInteractionEnabled) startPetInteractionLoop();
    else {
      stopPetInteractionLoop();
      triggerPetInteractionAction('idle');
    }
    if (!options.silent) showToast(petInteractionEnabled ? '互动已开启。' : '互动已暂停。');
  }

  function prefersReducedPetMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function startPetInteractionLoop() {
    stopPetInteractionLoop();
    if (!petInteractionEnabled || session.activeView !== 'guide-view' || prefersReducedPetMotion() || !hasActivePetWallRoom()) return;
    const scheduleNext = () => {
      const delay = 1600 + Math.round(Math.random() * 1800);
      petInteractionTimer = window.setTimeout(() => {
        if (!petInteractionEnabled || session.activeView !== 'guide-view') return;
        triggerPetInteractionAction(pickPetInteractionAction());
        scheduleNext();
      }, delay);
    };
    scheduleNext();
  }

  function stopPetInteractionLoop() {
    if (!petInteractionTimer) return;
    window.clearTimeout(petInteractionTimer);
    petInteractionTimer = null;
  }

  function startRoomAutoRefresh() {
    stopRoomAutoRefresh();
    if (session.activeView !== 'guide-view' || !canUseFriendsBackend(getStudent()) || !friendState.roomOwnerStudentId) return;
    roomAutoRefreshTimer = window.setInterval(() => {
      if (document.hidden || session.activeView !== 'guide-view' || friendState.roomLoading) return;
      loadSharedRoom(friendState.roomOwnerStudentId, { silent: true }).catch(error => console.info('Room auto refresh skipped.', error));
    }, ROOM_CHAT_REFRESH_MS);
  }

  function stopRoomAutoRefresh() {
    if (!roomAutoRefreshTimer) return;
    window.clearInterval(roomAutoRefreshTimer);
    roomAutoRefreshTimer = null;
  }

  function pickPetInteractionAction() {
    const profile = getCurrentPetInteractionProfile();
    const actions = ['walk', 'walk', 'walk', 'walk', 'walk', 'walk', 'walk', 'walk', 'idle', 'run', 'sleep', 'wave', 'explode'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    if (action === 'explode' && !profile.canExplode) return 'wave';
    return action;
  }

  function getPetInteractionProfileForStudent(student = getStudent()) {
    const pet = getPetInfo(student?.petType) || getPetInfo('creeper') || PET_CATALOG.find(entry => entry.id === 'creeper');
    const sprite = PET_INTERACTION_SPRITES[pet?.id] || PET_INTERACTION_SPRITES.creeper;
    const petName = student?.petType ? (getPetNickname(student, student.petType) || pet?.name || 'Creeper') : (pet?.name || 'Creeper');
    const petStage = getInteractionRoomPetStage(student, pet?.id);
    const finalFlying = INTERACTION_ROOM_FINAL_FLYING_PET_IDS.has(pet?.id) && petStage === 'final';
    return {
      pet,
      name: petName,
      src: sprite.src,
      movement: finalFlying ? 'fly_bounded' : (sprite.movement || 'ground'),
      petStage,
      canExplode: Boolean(sprite.canExplode)
    };
  }

  function getCurrentPetInteractionProfile() {
    return getPetInteractionProfileForStudent(getStudent());
  }

  function syncPetInteractionPet(student = getStudent()) {
    const pet = $('#pet-interaction-pet');
    const stage = $('#pet-interaction-stage');
    if (!pet || !stage) return getPetInteractionProfileForStudent(student);
    const profile = getPetInteractionProfileForStudent(student);
    const nameLabel = pet.querySelector('.pet-interaction-name');
    const image = pet.querySelector('img');
    const profileSrc = withAssetVersion(profile.src);
    pet.dataset.petType = profile.pet?.id || 'creeper';
    pet.dataset.petDisplayName = profile.name;
    pet.dataset.petMovement = profile.movement;
    stage.dataset.movement = profile.movement;
    if (nameLabel) nameLabel.textContent = profile.name;
    if (image && getAssetComparisonKey(image.getAttribute('src')) !== getAssetComparisonKey(profile.src)) {
      pet.querySelector('img').src = profileSrc;
    }
    if (image) image.alt = currentLanguage === 'en' ? `Q-style ${profile.name}` : `Q 版 ${profile.name}`;
    pet.setAttribute('aria-label', currentLanguage === 'en' ? `Tap ${profile.name} to interact` : `点击 ${profile.name} 互动`);
    stage.setAttribute('aria-label', currentLanguage === 'en' ? `${profile.name} pet wall` : `${profile.name} 宠物墙`);
    return profile;
  }

  function getPetInteractionZone(profile = getCurrentPetInteractionProfile()) {
    const stage = $('#pet-interaction-stage');
    const scene = stage?.dataset.scene || 'home';
    if (profile.movement === 'fly_bounded' || profile.movement === 'hover_bounded') {
      return PET_INTERACTION_FLIGHT_ZONES[scene] || PET_INTERACTION_FLIGHT_ZONES.home;
    }
    return PET_INTERACTION_WALK_ZONES[scene] || PET_INTERACTION_WALK_ZONES.home;
  }

  function randomPetInteractionPercent(min, max) {
    return min + Math.round(Math.random() * (max - min));
  }

  function readPetInteractionPercent(element, property, fallback) {
    const value = Number.parseFloat(element.style.getPropertyValue(property));
    return Number.isFinite(value) ? value : fallback;
  }

  function readPetInteractionNumber(element, property, fallback) {
    const value = Number.parseFloat(element.style.getPropertyValue(property));
    return Number.isFinite(value) ? value : fallback;
  }

  function clampPetInteractionValue(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getPetInteractionFood(foodId) {
    return PET_INTERACTION_FOODS.find(food => food.id === foodId) || PET_INTERACTION_FOODS[0];
  }

  function getRandomPetFeedResponse() {
    const entry = PET_FEED_RESPONSES[Math.floor(Math.random() * PET_FEED_RESPONSES.length)] || PET_FEED_RESPONSES[0];
    return currentLanguage === 'en' ? entry.en : entry.zh;
  }

  function updatePetFoodSelectionUi() {
    const stage = $('#pet-interaction-stage');
    if (stage) {
      stage.classList.toggle('feeding-ready', Boolean(selectedPetFoodId));
      if (selectedPetFoodId) stage.dataset.selectedFood = selectedPetFoodId;
      else delete stage.dataset.selectedFood;
    }
    $all('[data-pet-food]').forEach(button => {
      const active = selectedPetFoodId && button.dataset.petFood === selectedPetFoodId;
      button.classList.toggle('selected', Boolean(active));
      button.setAttribute('aria-pressed', String(Boolean(active)));
    });
  }

  function setSelectedPetFood(foodId = '', options = {}) {
    const food = foodId ? getPetInteractionFood(foodId) : null;
    selectedPetFoodId = food ? food.id : '';
    if (selectedPetFoodId) setFurniturePlacementMode('');
    updatePetFoodSelectionUi();
    if (selectedPetFoodId && food && !options.silent) {
      showToast(currentLanguage === 'en'
        ? `${localize(food.label)} picked up. Tap a pet to feed it.`
        : `已拿起${food.label}，点击任意宠物喂食。`);
    }
  }

  function getSelectedPetFood() {
    return selectedPetFoodId ? getPetInteractionFood(selectedPetFoodId) : null;
  }

  function getPetInteractionFurniture(itemId) {
    return PET_INTERACTION_FURNITURE.find(item => item.id === itemId) || null;
  }

  function clampPetBuilderCell(value, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.min(max, Math.max(0, Math.floor(number)));
  }

  function normalizePetRoomDecoration(decoration = {}, index = 0) {
    const itemId = String(decoration.itemId || decoration.decorationItemId || '').trim();
    const item = getPetInteractionFurniture(itemId);
    if (!item) return null;
    const fallbackRow = index % PET_INTERACTION_GRID.rows;
    const fallbackCol = Math.floor(index / PET_INTERACTION_GRID.rows) % PET_INTERACTION_GRID.cols;
    const maxRow = Math.max(0, PET_INTERACTION_GRID.rows - Number(item.height || 1));
    const maxCol = Math.max(0, PET_INTERACTION_GRID.cols - Number(item.width || 1));
    const row = decoration.row == null ? fallbackRow : clampPetBuilderCell(decoration.row, maxRow);
    const col = decoration.col == null ? fallbackCol : clampPetBuilderCell(decoration.col, maxCol);
    return {
      decorationId: String(decoration.decorationId || decoration.id || createLocalId('furniture')),
      itemId,
      row,
      col,
      placedAt: String(decoration.placedAt || new Date().toISOString())
    };
  }

  function ensurePetRoomDecorations(student = getStudent()) {
    if (!student) return [];
    const source = Array.isArray(student.petRoomDecorations) ? student.petRoomDecorations : [];
    student.petRoomDecorations = source
      .map((decoration, index) => normalizePetRoomDecoration(decoration, index))
      .filter(Boolean)
      .slice(0, PET_INTERACTION_FURNITURE_LIMIT);
    return student.petRoomDecorations;
  }

  function getPetBuilderCellPosition(row, col, item = {}) {
    const gridLeft = 6;
    const gridBottom = 7;
    const gridWidth = 88;
    const gridHeight = 50;
    const width = Math.max(1, Number(item.width || 1));
    const height = Math.max(1, Number(item.height || 1));
    const cellWidth = gridWidth / PET_INTERACTION_GRID.cols;
    const cellHeight = gridHeight / PET_INTERACTION_GRID.rows;
    const safeRow = clampPetBuilderCell(row, Math.max(0, PET_INTERACTION_GRID.rows - height));
    const safeCol = clampPetBuilderCell(col, Math.max(0, PET_INTERACTION_GRID.cols - width));
    return {
      left: gridLeft + (safeCol + width / 2) * cellWidth,
      bottom: gridBottom + (PET_INTERACTION_GRID.rows - safeRow - height / 2) * cellHeight
    };
  }

  function renderPetBuilderGrid() {
    const grid = $('#pet-builder-grid');
    if (!grid) return;
    grid.style.setProperty('--builder-rows', PET_INTERACTION_GRID.rows);
    grid.style.setProperty('--builder-cols', PET_INTERACTION_GRID.cols);
    grid.innerHTML = Array.from({ length: PET_INTERACTION_GRID.rows * PET_INTERACTION_GRID.cols }, (_, index) => {
      const row = Math.floor(index / PET_INTERACTION_GRID.cols);
      const col = index % PET_INTERACTION_GRID.cols;
      return `<button type="button" class="pet-builder-cell" data-builder-cell data-builder-row="${row}" data-builder-col="${col}" aria-label="${escapeHtml(`第 ${row + 1} 行第 ${col + 1} 格`)}"></button>`;
    }).join('');
    grid.setAttribute('aria-hidden', pendingFurnitureItemId ? 'false' : 'true');
  }

  function renderPetFurnitureTray(student = getStudent()) {
    const tray = $('#pet-furniture-tray');
    if (!tray) return;
    const count = canUseFriendsBackend(student) && hasActivePetWallRoom()
      ? friendState.roomDecorations.length
      : ensurePetRoomDecorations(student).length;
    tray.innerHTML = PET_INTERACTION_FURNITURE.map(item => {
      const active = pendingFurnitureItemId === item.id;
      const iconMarkup = item.image
        ? `<img src="${escapeHtml(withAssetVersion(item.image))}" alt="" loading="lazy" decoding="async" />`
        : escapeHtml(item.icon);
      return `<button type="button" class="pet-furniture-button${active ? ' active' : ''}" data-furniture-item="${escapeHtml(item.id)}" aria-pressed="${active}" aria-label="${escapeHtml(`${localize('拿起')} ${localize(item.label)}`)}">
        <span class="pet-furniture-icon" aria-hidden="true">${iconMarkup}</span><span>${escapeHtml(localize(item.label))}<small>🪙 ${Number(item.price || 0)}</small></span>
      </button>`;
    }).join('')
      + (pendingFurnitureItemId ? '<button type="button" class="pet-furniture-button ghost" data-furniture-cancel>取消</button>' : '')
      + (pendingFurnitureItemId ? '<span class="pet-furniture-hint">点击蓝色格子放下装饰</span>' : '')
      + `<span class="pet-furniture-count">${count}/${PET_INTERACTION_FURNITURE_LIMIT}</span>`;
  }

  function renderPlacedFurniture(student = getStudent()) {
    const layer = $('#pet-placed-furniture-layer');
    if (!layer) return;
    const isRemoteRoom = canUseFriendsBackend(student) && hasActivePetWallRoom();
    const decorations = isRemoteRoom ? friendState.roomDecorations : ensurePetRoomDecorations(student);
    layer.innerHTML = decorations.map(decoration => {
      const item = getPetInteractionFurniture(decoration.itemId);
      if (!item) return '';
      const position = getPetBuilderCellPosition(decoration.row, decoration.col, item);
      const removeAttr = isRemoteRoom ? 'data-remove-room-decoration' : 'data-remove-furniture';
      const artMarkup = item.image
        ? `<img src="${escapeHtml(withAssetVersion(item.image))}" alt="" loading="lazy" decoding="async" />`
        : `<span aria-hidden="true">${escapeHtml(item.icon)}</span>`;
      return `<button type="button" class="placed-furniture" ${removeAttr}="${escapeHtml(decoration.decorationId)}" style="--decor-left:${position.left.toFixed(2)}%;--decor-bottom:${position.bottom.toFixed(2)}%;--decor-layer:${Number(item.layer || 1)};--decor-size:${Number(item.size || 1)};" aria-label="${escapeHtml(`${localize(item.label)}，点击移除`)}">
        ${artMarkup}
      </button>`;
    }).join('');
  }

  function setFurniturePlacementMode(itemId = '') {
    const stage = $('#pet-interaction-stage');
    const grid = $('#pet-builder-grid');
    pendingFurnitureItemId = itemId;
    if (itemId) setSelectedPetFood('');
    if (stage) {
      stage.classList.toggle('placing-furniture', Boolean(itemId));
      if (itemId) stage.dataset.placingFurniture = itemId;
      else delete stage.dataset.placingFurniture;
    }
    if (grid) grid.setAttribute('aria-hidden', itemId ? 'false' : 'true');
    renderPetFurnitureTray(getStudent());
  }

  function startFurniturePlacement(itemId) {
    const item = getPetInteractionFurniture(itemId);
    if (!item) return false;
    if (canUseFriendsBackend(getStudent()) && !hasActivePetWallRoom()) {
      showToast('请先从列表进入一个宠物墙房间。');
      return false;
    }
    setFurniturePlacementMode(item.id);
    showToast(currentLanguage === 'en' ? `${localize(item.label)} picked up. Tap a blue grid cell to place it.` : `已拿起${item.label}，点击蓝色格子放下。`);
    return true;
  }

  async function placeFurnitureAtCell(row, col) {
    const student = getStudent();
    const item = getPetInteractionFurniture(pendingFurnitureItemId);
    if (!student || !item) {
      showToast('请先选择家具。');
      return false;
    }
    if (canUseFriendsBackend(student) && !hasActivePetWallRoom()) {
      showToast('请先从列表进入一个宠物墙房间。');
      return false;
    }
    const decorations = canUseFriendsBackend(student) && hasActivePetWallRoom()
      ? friendState.roomDecorations
      : ensurePetRoomDecorations(student);
    if (decorations.length >= PET_INTERACTION_FURNITURE_LIMIT) {
      showToast('宠物墙已经放满了。');
      return false;
    }
    const maxRow = Math.max(0, PET_INTERACTION_GRID.rows - Number(item.height || 1));
    const maxCol = Math.max(0, PET_INTERACTION_GRID.cols - Number(item.width || 1));
    const decorationRow = clampPetBuilderCell(row, maxRow);
    const decorationCol = clampPetBuilderCell(col, maxCol);
    if (canUseFriendsBackend(student) && hasActivePetWallRoom()) {
      const position = getPetBuilderCellPosition(decorationRow, decorationCol, item);
      setFurniturePlacementMode('');
      const result = await backend.placeRoomDecoration({
        studentId: student.studentId,
        roomOwnerStudentId: getCurrentRoomOwnerId() || student.studentId,
        decorationItemId: item.id,
        price: Number(item.price || 0),
        xPercent: position.left,
        yPercent: 100 - position.bottom,
        gridRow: decorationRow,
        gridCol: decorationCol,
        scale: Number(item.size || 1),
        layerIndex: Number(item.layer || 1)
      });
      if (!result.ok) {
        showToast(result.error || '装饰摆放失败。');
        renderPetFurnitureTray(student);
        return false;
      }
      if (result.student) {
        database[student.studentId] = HolidayBackendClient.normalizeStudent(result.student, [], database[student.studentId]);
        saveDatabase();
        renderAppShell();
      }
      applyRoomResult(result);
      renderRoomLobby(student);
      renderSharedRoomPanel();
      renderRoomChat(student);
      renderPlacedFurniture(student);
      renderPetFurnitureTray(student);
      renderSharedRoomPets();
      showToast(currentLanguage === 'en' ? `${localize(item.label)} placed.` : `${item.label}放好了。`);
      return true;
    }
    const snapshot = cloneStudentState(student);
    const decoration = {
      decorationId: createLocalId('furniture'),
      itemId: item.id,
      row: decorationRow,
      col: decorationCol,
      placedAt: new Date().toISOString()
    };
    student.petRoomDecorations = [...decorations, decoration].slice(0, PET_INTERACTION_FURNITURE_LIMIT);
    setFurniturePlacementMode('');
    renderPlacedFurniture(student);
    const saved = await commitStudentState(student, snapshot, { type: 'placePetFurniture', itemId: item.id, row: decoration.row, col: decoration.col }, () => {
      showToast(currentLanguage === 'en' ? `${localize(item.label)} placed.` : `${item.label}放好了。`);
    });
    if (!saved) renderPetInteraction();
    return saved;
  }

  async function removePetFurniture(decorationId) {
    const student = getStudent();
    if (!student) return false;
    const decorations = ensurePetRoomDecorations(student);
    const decoration = decorations.find(item => item.decorationId === decorationId);
    if (!decoration) return false;
    const furniture = getPetInteractionFurniture(decoration.itemId);
    const snapshot = cloneStudentState(student);
    student.petRoomDecorations = decorations.filter(item => item.decorationId !== decorationId);
    renderPlacedFurniture(student);
    renderPetFurnitureTray(student);
    const saved = await commitStudentState(student, snapshot, { type: 'removePetFurniture', itemId: decoration.itemId, decorationId }, () => {
      showToast(currentLanguage === 'en' ? `${localize(furniture?.label || '家具')} removed.` : `${furniture?.label || '家具'}已移除。`);
    });
    if (!saved) renderPetInteraction();
    return saved;
  }

  async function removeRoomDecorationById(decorationId) {
    const student = getStudent();
    const id = String(decorationId || '');
    if (!student || !id) return false;
    const decoration = friendState.roomDecorations.find(item => item.decorationId === id);
    const furniture = getPetInteractionFurniture(decoration?.itemId);
    const result = await backend.removeRoomDecoration(student.studentId, getCurrentRoomOwnerId() || student.studentId, id);
    if (!result.ok) {
      showToast(result.error || '装饰移除失败。');
      return false;
    }
    applyRoomResult(result);
    renderRoomLobby(student);
    renderSharedRoomPanel();
    renderRoomChat(student);
    renderPlacedFurniture(student);
    renderPetFurnitureTray(student);
    renderSharedRoomPets();
    showToast(`${furniture?.label || '装饰'}已移除。`);
    return true;
  }

  function getPetInteractionTarget(pet, action, profile = getCurrentPetInteractionProfile()) {
    const zone = getPetInteractionZone(profile);
    const centerX = Math.round((zone.minX + zone.maxX) / 2);
    const centerY = Math.round((zone.minY + zone.maxY) / 2);
    const currentX = clampPetInteractionValue(readPetInteractionPercent(pet, '--pet-x', centerX), zone.minX, zone.maxX);
    const currentY = clampPetInteractionValue(readPetInteractionNumber(pet, '--pet-y', centerY), zone.minY, zone.maxY);
    if (action === 'feed' || action === 'idle') {
      return { x: currentX, y: currentY, zone };
    }
    if (action === 'wave') {
      return { x: centerX, y: centerY, zone };
    }
    if (action === 'explode') {
      return {
        x: randomPetInteractionPercent(Math.max(zone.minX, centerX - 6), Math.min(zone.maxX, centerX + 6)),
        y: randomPetInteractionPercent(zone.minY, centerY),
        zone
      };
    }
    return {
      x: randomPetInteractionPercent(zone.minX, zone.maxX),
      y: randomPetInteractionPercent(zone.minY, zone.maxY),
      zone
    };
  }

  function getPetInteractionScale(targetY, zone) {
    const range = Math.max(1, zone.maxY - zone.minY);
    const foregroundDepth = (targetY - zone.minY) / range;
    return (0.84 + foregroundDepth * 0.2).toFixed(2);
  }

  function triggerPetInteractionAction(action = 'idle', options = {}) {
    const pet = $('#pet-interaction-pet');
    const effects = $('#pet-interaction-effects');
    if (!pet || !effects) return;
    const profile = syncPetInteractionPet();
    let safeAction = PET_INTERACTION_ACTIONS.includes(action) ? action : 'idle';
    if (safeAction === 'explode' && !profile.canExplode) safeAction = 'wave';
    const currentX = readPetInteractionPercent(pet, '--pet-x', 50);
    const { x: targetX, y: targetY, zone } = getPetInteractionTarget(pet, safeAction, profile);
    pet.style.setProperty('--pet-x', `${targetX}%`);
    pet.style.setProperty('--pet-y', targetY);
    pet.style.setProperty('--pet-scale', getPetInteractionScale(targetY, zone));
    pet.style.setProperty('--pet-dir', targetX >= currentX ? '1' : '-1');
    effects.style.setProperty('--pet-x', `${targetX}%`);
    effects.style.setProperty('--pet-y', targetY);
    effects.style.setProperty('--pet-scale', getPetInteractionScale(targetY, zone));
    pet.dataset.petAction = safeAction;
    pet.setAttribute('data-pet-action', safeAction);
    effects.dataset.petAction = safeAction;
    effects.setAttribute('data-pet-action', safeAction);
    if (safeAction === 'explode') {
      effects.innerHTML = '<span>砰！</span><i></i><i></i><i></i><i></i><i></i>';
      window.setTimeout(() => {
        if (pet.dataset.petAction === 'explode') triggerPetInteractionAction('idle');
      }, 1700);
    } else if (safeAction === 'feed') {
      const label = options.label || localize('好吃！');
      effects.innerHTML = options.skipEffects ? '' : `<span>${escapeHtml(label)}</span><i class="pet-heart">&hearts;</i><i class="pet-heart">&hearts;</i><i class="pet-heart">&hearts;</i>`;
      window.setTimeout(() => {
        if (pet.dataset.petAction === 'feed') triggerPetInteractionAction('walk');
      }, 1300);
    } else {
      effects.innerHTML = '';
    }
  }

  function showPetFeedReaction(target, food, message) {
    if (!target || !food) return;
    const previousTimer = Number(target.dataset.feedTimer || 0);
    if (previousTimer) window.clearTimeout(previousTimer);
    target.querySelectorAll('.pet-feed-bubble, .pet-feed-hearts').forEach(element => element.remove());
    target.classList.remove('being-fed');
    void target.offsetWidth;
    target.classList.add('being-fed');
    target.insertAdjacentHTML('beforeend', `<span class="pet-feed-bubble">${escapeHtml(food.icon)} ${escapeHtml(message)}</span><span class="pet-feed-hearts" aria-hidden="true"><i>&hearts;</i><i>&hearts;</i><i>&hearts;</i></span>`);
    const token = createLocalId('feed');
    target.dataset.feedToken = token;
    const timer = window.setTimeout(() => {
      if (target.dataset.feedToken !== token) return;
      target.classList.remove('being-fed');
      target.querySelectorAll('.pet-feed-bubble, .pet-feed-hearts').forEach(element => element.remove());
      delete target.dataset.feedToken;
      delete target.dataset.feedTimer;
    }, 3000);
    target.dataset.feedTimer = String(timer);
  }

  function getPetFeedTargetFromPoint(clientX, clientY) {
    const stage = $('#pet-interaction-stage');
    if (!stage) return null;
    const target = document.elementFromPoint(clientX, clientY)?.closest('#pet-interaction-pet, .pet-interaction-guest');
    return target && stage.contains(target) ? target : null;
  }

  function feedPetInteraction(foodId, target = $('#pet-interaction-pet')) {
    const food = getPetInteractionFood(foodId);
    const targetPet = target || $('#pet-interaction-pet');
    if (!food || !targetPet) return false;
    const response = getRandomPetFeedResponse();
    const isOwnPet = targetPet.id === 'pet-interaction-pet';
    if (isOwnPet) {
      triggerPetInteractionAction('feed', { label: `${food.icon} ${response}`, skipEffects: true });
    }
    showPetFeedReaction(targetPet, food, response);
    setSelectedPetFood('', { silent: true });
    const name = targetPet.dataset.petDisplayName || getCurrentPetInteractionProfile().name;
    showToast(currentLanguage === 'en' ? `${name} is happy!` : `${name} 吃得很开心！`);
    return true;
  }

  function setupPetFoodDragAndDrop() {
    const stage = $('#pet-interaction-stage');
    const foodButtons = $all('[data-pet-food]');
    if (!stage || !foodButtons.length) return;
    foodButtons.forEach(button => {
      button.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', button.dataset.petFood);
        event.dataTransfer.effectAllowed = 'copy';
        button.classList.add('dragging');
      });
      button.addEventListener('dragend', () => {
        button.classList.remove('dragging');
        updatePetFoodSelectionUi();
      });
      button.addEventListener('pointerdown', event => startPetFoodPointerDrag(event, button));
    });
    stage.addEventListener('dragover', event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      stage.classList.add('feeding-ready');
    });
    stage.addEventListener('dragleave', event => {
      if (!stage.contains(event.relatedTarget)) stage.classList.remove('feeding-ready');
    });
    stage.addEventListener('drop', event => {
      event.preventDefault();
      const foodId = event.dataTransfer.getData('text/plain');
      const targetPet = getPetFeedTargetFromPoint(event.clientX, event.clientY);
      if (foodId && targetPet) feedPetInteraction(foodId, targetPet);
      else if (foodId) setSelectedPetFood(foodId);
    });
  }

  function startPetFoodPointerDrag(event, button) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const stage = $('#pet-interaction-stage');
    if (!stage || !button.dataset.petFood) return;
    const food = getPetInteractionFood(button.dataset.petFood);
    const ghost = document.createElement('div');
    ghost.className = 'pet-food-drag-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.innerHTML = `<span>${escapeHtml(food.icon)}</span>`;
    document.body.appendChild(ghost);
    petFoodDragState = { foodId: food.id, pointerId: event.pointerId, ghost, stage, button, didMove: false, startX: event.clientX, startY: event.clientY };
    button.setPointerCapture?.(event.pointerId);
    button.classList.add('dragging');
    movePetFoodPointerDrag(event);
    event.preventDefault();
  }

  function movePetFoodPointerDrag(event) {
    if (!petFoodDragState || event.pointerId !== petFoodDragState.pointerId) return;
    const { ghost, stage } = petFoodDragState;
    ghost.style.left = `${event.clientX}px`;
    ghost.style.top = `${event.clientY}px`;
    const stageRect = stage.getBoundingClientRect();
    const isOverStage = event.clientX >= stageRect.left
      && event.clientX <= stageRect.right
      && event.clientY >= stageRect.top
      && event.clientY <= stageRect.bottom;
    if (Math.abs(event.clientX - Number(petFoodDragState.startX || 0)) > 4 || Math.abs(event.clientY - Number(petFoodDragState.startY || 0)) > 4) {
      petFoodDragState.didMove = true;
    }
    stage.classList.toggle('feeding-ready', isOverStage);
  }

  function finishPetFoodPointerDrag(event) {
    if (!petFoodDragState || event.pointerId !== petFoodDragState.pointerId) return;
    const { foodId, stage, button, didMove } = petFoodDragState;
    const stageRect = stage.getBoundingClientRect();
    const droppedOnStage = event.clientX >= stageRect.left
      && event.clientX <= stageRect.right
      && event.clientY >= stageRect.top
      && event.clientY <= stageRect.bottom;
    cleanupPetFoodPointerDrag();
    if (droppedOnStage) {
      ignoreNextPetFoodClick = true;
      const targetPet = getPetFeedTargetFromPoint(event.clientX, event.clientY);
      if (targetPet) feedPetInteraction(foodId, targetPet);
      else setSelectedPetFood(foodId);
    } else if (!didMove && event.target.closest('[data-pet-food]') === button) {
      ignoreNextPetFoodClick = true;
      setSelectedPetFood(foodId);
    }
  }

  function cleanupPetFoodPointerDrag() {
    if (!petFoodDragState) return;
    petFoodDragState.button.classList.remove('dragging');
    petFoodDragState.stage.classList.remove('feeding-ready');
    petFoodDragState.ghost.remove();
    petFoodDragState = null;
  }

  function switchView(viewId) {
    if (viewId === 'history-view') viewId = 'checkin-view';
    const previousViewId = session.activeView;
    session.activeView = viewId;
    if (previousViewId === 'music-box-view' && viewId !== 'music-box-view') stopMusicPreview();
    if (viewId !== 'guide-view') {
      if (previousViewId === 'guide-view' && hasActiveInteractionRoom()) {
        void leaveActiveInteractionRoom({ silent: true, render: false, refresh: false });
      }
      stopPetInteractionLoop();
      stopRoomAutoRefresh();
      stopKuromiRoomDemo();
      if (isKuromiRoomFullscreenMode()) void exitKuromiRoomFullscreen();
    }
    $all('.view').forEach(view => view.classList.toggle('active', view.id === viewId));
    $all('.nav-button').forEach(button => button.classList.toggle('active', button.dataset.view === viewId));
    updateFriendNavAttention();
    renderActiveStudentView();
    if (viewId === 'wall-view') {
      loadMessageWall();
    }
    if (viewId === 'friends-view') {
      loadFriendsDashboard();
    }
    if (viewId === 'guide-view') {
      initKuromiRoomDemo();
    }
    if (viewId === 'music-box-view') {
      renderMusicBox(getStudent());
      void refreshMusicBoxFromCloud();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function isTeacherAccount(student) {
    if (!student || student.demoMode) return false;
    const branch = String(student.branch || '').trim();
    const className = String(student.className || student.classNameLegacy || '').trim();
    const name = String(student.studentName || student.name || '').trim();
    return branch === 'CY大家庭'
      || name.includes('老师')
      || /^(TEST|INTERNAL TEST)$/i.test(className)
      || className.includes('内测老师');
  }

  function getTeacherRewardTotalForDate(student, date = getDateKey()) {
    const rewards = Array.isArray(student?.teacherRewards) ? student.teacherRewards : [];
    return rewards
      .filter(reward => {
        const rewardDate = String(reward?.date || reward?.createdAt || '').slice(0, 10);
        return rewardDate === date && String(reward?.source || 'teacher') === 'teacher';
      })
      .reduce((sum, reward) => sum + Math.max(0, Math.floor(Number(reward?.amount || 0))), 0);
  }

  function getTeacherRewardNoticeId(reward) {
    const rewardId = String(reward?.rewardId || reward?.reward_id || '').trim();
    if (rewardId) return rewardId;
    const teacherId = HolidayBackendClient.normalizeId(reward?.teacherId || reward?.teacher_id || reward?.teacher || '');
    const amount = Math.max(0, Math.floor(Number(reward?.amount || 0)));
    const createdAt = String(reward?.createdAt || reward?.created_at || reward?.date || '').trim();
    return [teacherId, amount, createdAt].filter(Boolean).join(':');
  }

  function readTeacherRewardNoticeMap() {
    try {
      const parsed = JSON.parse(localStorage.getItem(TEACHER_REWARD_NOTICE_STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function writeTeacherRewardNoticeMap(map) {
    try {
      localStorage.setItem(TEACHER_REWARD_NOTICE_STORAGE_KEY, JSON.stringify(map || {}));
    } catch (error) {
      console.info('Teacher reward notice state skipped.', error);
    }
  }

  function rememberTeacherRewardNotices(studentId, rewardIds = []) {
    const normalizedStudentId = HolidayBackendClient.normalizeId(studentId);
    const ids = rewardIds.map(id => String(id || '').trim()).filter(Boolean);
    if (!normalizedStudentId || !ids.length) return;
    const map = readTeacherRewardNoticeMap();
    const current = Array.isArray(map[normalizedStudentId]) ? map[normalizedStudentId] : [];
    map[normalizedStudentId] = Array.from(new Set([...ids, ...current])).slice(0, 80);
    writeTeacherRewardNoticeMap(map);
  }

  function maybeShowTeacherRewardModal(student = getStudent()) {
    if (!student || student.demoMode || isTeacherAccount(student)) return false;
    const studentId = HolidayBackendClient.normalizeId(student.studentId || session.studentId || '');
    const rewards = Array.isArray(student.teacherRewards) ? student.teacherRewards : [];
    if (!studentId || !rewards.length) return false;
    const noticeMap = readTeacherRewardNoticeMap();
    const seen = new Set(Array.isArray(noticeMap[studentId]) ? noticeMap[studentId].map(String) : []);
    const unseenRewards = rewards
      .map(reward => ({ ...reward, noticeId: getTeacherRewardNoticeId(reward), amount: Math.max(0, Math.floor(Number(reward?.amount || 0))) }))
      .filter(reward => reward.noticeId && reward.amount > 0 && !seen.has(reward.noticeId))
      .slice(0, 5);
    if (!unseenRewards.length) return false;
    const totalCoins = unseenRewards.reduce((sum, reward) => sum + reward.amount, 0);
    const teacherNames = Array.from(new Set(unseenRewards.map(reward => {
      const teacherName = String(reward.teacherName || reward.teacher_name || reward.teacher || reward.teacherId || '老师').trim();
      return teacherName || '老师';
    })));
    const sourceText = teacherNames.length > 1 ? `${teacherNames.join('、')} 给你加了金币。` : `${teacherNames[0] || '老师'} 给你加了金币。`;
    const detailRows = unseenRewards.map(reward => {
      const teacherName = String(reward.teacherName || reward.teacher_name || reward.teacher || reward.teacherId || '老师').trim() || '老师';
      return `<span>${escapeHtml(teacherName)}：+${Math.max(0, Math.floor(Number(reward.amount || 0)))} 金币</span>`;
    }).join('');
    rememberTeacherRewardNotices(studentId, unseenRewards.map(reward => reward.noticeId));
    showGiftClaimModal({
      title: '恭喜获得老师奖励！',
      customMessageHtml: `<strong>${escapeHtml(sourceText)}</strong><small class="teacher-reward-notice-detail">${detailRows}</small>`,
      rewards: { pets: [], items: [], music: [], coins: totalCoins, duplicates: [] }
    });
    playUiSound('reward');
    return true;
  }

  function renderTeacherModeAccess(student) {
    const button = $('#teacher-mode-button');
    if (!button) return;
    const visible = isTeacherAccount(student);
    button.hidden = !visible;
    button.classList.toggle('hidden', !visible);
  }

  function renderAppShell() {
    const student = getStudent();
    if (!student) return;
    const studentDisplayName = getStudentDisplayName(student);
    $('#welcome-name').innerHTML = renderHomeNameEditor('student', studentDisplayName, getHomeNameEditValue('student', student));
    $('#student-chip-name').textContent = studentDisplayName;
    $('#student-chip-avatar').innerHTML = renderStudentAvatarVisual(student, 'student-chip-avatar-image');
    const avatarPreview = $('#student-avatar-preview');
    if (avatarPreview) avatarPreview.innerHTML = renderStudentAvatarVisual(student, 'avatar-upload-image');
    $('#today-label').textContent = `${currentLanguage === 'en' ? localize(student.branch) : student.branch} · ${student.className} · ${formatDisplayDate(getDateKey())}`;
    $('#checkin-date-label').textContent = formatDisplayDate(getDateKey());
    const holidayStatus = $('#holiday-status');
    if (holidayStatus) {
      holidayStatus.textContent = APP_CONFIG.enforceHolidayWindow
        ? (isHolidayOpen() ? '假期打卡开放中' : '目前不在打卡期间')
        : '演示开放中';
    }
    applyActiveBackgroundMusic(student);
    renderTeacherModeAccess(student);
    maybeShowPetSelection();
    setTimeout(() => maybeShowCollectionTitleChoiceModal(student), 120);
    setTimeout(() => maybePromptAnyPetNaming(student), 260);
    setTimeout(() => maybeQueueNewPlayerGuide(getStudent()), 540);
  }

  function renderHome() {
    const student = getStudent();
    if (!student) return;
    const level = getLevelInfo(student);
    const rarity = getDisplayRarity(student);
    const pet = getPetInfo(student.petType);
    const combat = getCombatState(student);
    const progress = syncEvolutionState(student);
    const activeForm = getActivePetEvolutionForm(student);
    const evolved = isPetEvolved(student);
    const activeFinalEvolved = isPetActiveFinalEvolution(student);
    const miniEvolved = isPetMiniEvolved(student);
    const activeMiniEvolved = activeForm === PET_EVOLUTION_FORM_MINI;
    const levelLabel = level.max ? 'MAX 999 LEVEL' : `Lv.${level.level}`;
    const progressPercent = progress.required ? Math.min(100, (progress.count / progress.required) * 100) : 0;
    const finalRouteTotal = Math.max(1, Number(progress.finalRouteTotal || 1) || 1);
    const evolutionProgressLabel = progress.allFinalRoutesUnlocked
      ? (finalRouteTotal > 1
        ? (currentLanguage === 'en' ? 'Both final routes unlocked' : '两条最终路线已解锁')
        : (currentLanguage === 'en' ? 'Final route unlocked' : '最终路线已解锁'))
      : progress.alreadyEvolved
        ? (currentLanguage === 'en' ? `Final route ${progress.finalRoutesUnlocked.length} / ${finalRouteTotal} unlocked` : `最终路线已解锁 ${progress.finalRoutesUnlocked.length} / ${finalRouteTotal}`)
      : miniEvolved
        ? (currentLanguage === 'en'
          ? `Final gear ${progress.count} / ${progress.required} · needs ${FINAL_EVOLUTION_COIN_COST} coins`
          : `最终装备 ${progress.count} / ${progress.required} · 需要 ${FINAL_EVOLUTION_COIN_COST} 金币`)
        : (currentLanguage === 'en'
          ? `Mini evolution ${Math.min(progress.count, progress.miniRequired)} / ${progress.miniRequired} · needs ${MINI_EVOLUTION_COIN_COST} coins`
          : `小进化 ${Math.min(progress.count, progress.miniRequired)} / ${progress.miniRequired} · 需要 ${MINI_EVOLUTION_COIN_COST} 金币`);
    const previous = renderedCombatState.studentId === student.studentId ? renderedCombatState : null;
    if (pet) {
      $('#pet-title').innerHTML = renderHomeNameEditor('pet', getPetFullDisplayNameWithTitle(student), getHomeNameEditValue('pet', student));
    } else {
      $('#pet-title').textContent = '选择你的伙伴';
    }
    $('#pet-rarity-badge').textContent = rarity.label;
    $('#pet-rarity-badge').className = `rarity-badge ${rarity.className}`;
    $('#pet-level-badge').textContent = levelLabel;
    $('#pet-level-label').textContent = levelLabel;
    $('#pet-exp-label').textContent = evolutionProgressLabel;
    $('#pet-exp-bar').style.width = `${progressPercent}%`;
    $('#coin-count').textContent = student.coins;
    const shopCoinCount = $('#shop-coin-count');
    if (shopCoinCount) shopCoinCount.textContent = student.coins;
    $('#star-count').textContent = student.totalStars;
    $('#checkin-count').textContent = getCompletedStudyDayCount(student);
    $('#streak-count').textContent = student.streak;
    $('#best-score').textContent = student.checkins.length ? `${Math.max(...student.checkins.map(item => item.score))}/${Math.max(...student.checkins.map(item => item.total))}` : '—';

    const avatar = $('#pet-avatar');
    const petStage = avatar?.closest('.pet-stage');
    const displayImage = getPetDisplayImage(student);
    avatar.classList.toggle('role-card-mode', Boolean(displayImage));
    if (petStage) {
      petStage.classList.toggle('role-card-stage', Boolean(displayImage));
      petStage.classList.toggle('role-card-form-glow', Boolean(displayImage && activeFinalEvolved));
      petStage.classList.toggle('role-card-cute-glow', Boolean(displayImage && activeForm === EVOLUTION_STYLE_CUTE));
      petStage.classList.toggle('role-card-heroic-glow', Boolean(displayImage && activeForm === EVOLUTION_STYLE_HEROIC));
    }
    avatar.classList.toggle('evolved-pet-avatar', activeFinalEvolved);
    avatar.classList.toggle('mini-evolved-pet-avatar', !activeFinalEvolved && activeMiniEvolved);
    avatar.classList.remove('evolution-ready-avatar');
    avatar.setAttribute('aria-hidden', 'true');
    avatar.removeAttribute('aria-label');
    if (displayImage) {
      avatar.innerHTML = `<img class="role-card-art" src="${escapeHtml(displayImage)}" alt="${escapeHtml(getPetSpeciesNameForStudent(student))}${activeFinalEvolved ? '进化形态' : ''}" decoding="async" />`;
    } else {
      avatar.innerHTML = `<span class="pet-emoji-display">${escapeHtml(getPetEmoji(student.petType, student.petRarity, level.level))}</span>`;
    }
    const petCardActions = [];
    if ((miniEvolved || evolved) && pet?.image) {
      petCardActions.push(`<button type="button" class="secondary-button role-card-before-button" data-evolution-before-preview>${escapeHtml(localize('查看进化路线'))}</button>`);
    }
    if (displayImage) {
      petCardActions.push(`<button type="button" class="secondary-button role-card-share-button" data-role-card-share>${escapeHtml(localize('分享角色卡'))}</button>`);
    }
    const formControls = renderPetEvolutionFormControls(student, progress);
    $('#pet-card-actions').innerHTML = formControls || petCardActions.length
      ? `<div class="pet-card-action-row">${formControls}<div class="pet-card-secondary-actions">${petCardActions.join('')}</div></div>`
      : '';

    const equipped = getEquippedItemList(student);
    $('#equipped-layer').innerHTML = equipped.map(item => `<span class="equipped-tag" title="${escapeHtml(item.name)}"><img src="${escapeHtml(withAssetVersion(item.image))}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" /></span>`).join('');
    renderEquipmentGrid(student);
    renderExclusiveSetStatus(student);
    renderOwnedEquipment(student);
    renderPetExclusiveShop(student);
    renderPetCollection(student);
    renderPetSkills(student);
    renderStatsSummary(combat.stats, previous?.stats, student.petType);
    updateCombatPowerDisplay(combat.power, previous?.power);
    if (previous && combat.power !== previous.power) showPowerFeedback(previous, combat, combat.power > previous.power ? '装备升级！' : '装备属性变化');
    renderedCombatState = { studentId: student.studentId, stats: combat.stats, power: combat.power };
  }

  function getMaxLevelInfo() {
    return { level: 999, current: 999, total: 999, required: 999, max: true };
  }

  function getLevelInfo(student) {
    if (isPetActiveFinalEvolution(student)) return getMaxLevelInfo();
    if (isPetActiveMiniEvolution(student)) return { level: 50, current: 1, total: 1, required: 1, max: false, stage: 'mini' };
    return { level: 1, current: 0, total: 0, required: 1, max: false, stage: 'base' };
  }

  function getPetInfo(petType) {
    return PET_CATALOG.find(entry => entry.id === petType) || null;
  }

  function getPetSeriesId(pet) {
    return PET_SERIES_BY_ID[pet?.id] || 'cy-original';
  }

  function getPetSeriesInfo(seriesId) {
    return PET_SERIES_GROUPS.find(series => series.id === seriesId) || PET_SERIES_GROUPS[0];
  }

  function getPetSeriesPets(seriesId) {
    return PET_CATALOG.filter(pet => seriesId === 'all' || getPetSeriesId(pet) === seriesId);
  }

  function getDisplayRarity(student, petType = student?.petType, fallbackRarity = student?.petRarity) {
    if (isPetActiveFinalEvolution(student, petType)) return getRarityInfo('MYTHIC');
    const pet = getPetInfo(petType);
    const rarityId = petType === student?.petType ? (student?.petRarity || pet?.rarity) : (fallbackRarity || pet?.rarity);
    return getRarityInfo(rarityId);
  }

  function getEvolutionMultiplier(pet) {
    return EVOLUTION_RARITY_MULTIPLIERS[pet?.rarity] || EVOLUTION_RARITY_MULTIPLIERS.A;
  }

  function getMiniEvolutionMultiplier(pet) {
    const finalMultiplier = getEvolutionMultiplier(pet);
    return 1 + ((finalMultiplier - 1) * MINI_EVOLUTION_BONUS_RATE);
  }

  function getPetQStyleImage(pet) {
    return PET_INTERACTION_SPRITES[pet?.id]?.src || '';
  }

  function isRoleCardAsset(src) {
    const value = String(src || '');
    return value.includes('assets/roles/') && !value.includes('assets/pet-interactions/');
  }

  function withAssetVersion(src) {
    const value = String(src || '').trim();
    if (!value || !value.startsWith('assets/')) return value;
    const versionToken = `v=${APP_ASSET_VERSION}`;
    if (value.includes(versionToken)) return value;
    return `${value}${value.includes('?') ? '&' : '?'}${versionToken}`;
  }

  function loadNewPlayerGuideCompletions() {
    try {
      const value = JSON.parse(localStorage.getItem(NEW_PLAYER_GUIDE_COMPLETION_KEY) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (error) {
      return {};
    }
  }

  function saveNewPlayerGuideCompletions(map) {
    try {
      localStorage.setItem(NEW_PLAYER_GUIDE_COMPLETION_KEY, JSON.stringify(map || {}));
    } catch (error) {
      console.info('New player guide completion cannot be saved locally.', error);
    }
  }

  function loadTeacherNewMusicGuideCompletions() {
    try {
      const value = JSON.parse(localStorage.getItem(TEACHER_NEW_MUSIC_GUIDE_COMPLETION_KEY) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (error) {
      return {};
    }
  }

  function saveTeacherNewMusicGuideCompletions(map) {
    try {
      localStorage.setItem(TEACHER_NEW_MUSIC_GUIDE_COMPLETION_KEY, JSON.stringify(map || {}));
    } catch (error) {
      console.info('Teacher music guide completion cannot be saved locally.', error);
    }
  }

  function getNewPlayerGuideStudentId(student) {
    return HolidayBackendClient.normalizeId(student?.studentId || student?.id || '');
  }

  function canUseLocalGuidePreview() {
    return ['localhost', '127.0.0.1', ''].includes(String(window.location.hostname || '').toLowerCase());
  }

  function getNewPlayerGuidePreviewMode() {
    if (!canUseLocalGuidePreview()) return '';
    try {
      const params = new URLSearchParams(window.location.search || '');
      const value = String(params.get('guidePreview') || params.get('guide') || '').trim();
      if (value === 'yiyan-apology' || value === YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID) return 'yiyan-apology';
      if (value === 'teacher-music' || value === TEACHER_NEW_MUSIC_GUIDE_ID) return TEACHER_NEW_MUSIC_GUIDE_ID;
      if (value === 'daily-checkin' || value === DAILY_CHECKIN_GUIDE_ID) return DAILY_CHECKIN_GUIDE_ID;
      return '';
    } catch (error) {
      return '';
    }
  }

  function getStudentApologyGuideId(student) {
    return String(student?.forceApologyGuide || student?.apologyGuide || student?.activeApologyGuide || '').trim();
  }

  function getNewPlayerGuideMode(student = getStudent()) {
    const previewMode = getNewPlayerGuidePreviewMode();
    if (previewMode) return previewMode;
    if (getStudentApologyGuideId(student) === YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID) return 'yiyan-apology';
    if (shouldShowNewPlayerOnboardingGuide(student)) return 'new-player';
    if (student?.petType && isTeacherAccount(student) && !hasCompletedTeacherNewMusicGuide(student)) return TEACHER_NEW_MUSIC_GUIDE_ID;
    if (shouldShowDailyCheckinGuide(student)) return DAILY_CHECKIN_GUIDE_ID;
    return 'new-player';
  }

  function getNewPlayerGuideSteps(student = getStudent()) {
    const mode = getNewPlayerGuideMode(student);
    if (mode === 'yiyan-apology') return YIYAN_BLIND_BOX_APOLOGY_GUIDE_STEPS;
    if (mode === TEACHER_NEW_MUSIC_GUIDE_ID) return TEACHER_NEW_MUSIC_GUIDE_STEPS;
    if (mode === DAILY_CHECKIN_GUIDE_ID) return DAILY_CHECKIN_GUIDE_STEPS;
    return NEW_PLAYER_GUIDE_STEPS;
  }

  function getApologyGuideMaxRuns(guideId) {
    return guideId === YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID ? YIYAN_BLIND_BOX_APOLOGY_MAX_RUNS : 1;
  }

  function getApologyGuideCompletionEntry(student, guideId) {
    if (!guideId) return false;
    const completions = student?.apologyGuideCompletions;
    if (completions && typeof completions === 'object' && !Array.isArray(completions)) {
      return completions[guideId] || null;
    }
    return null;
  }

  function getApologyGuideCompletedCount(student, guideId) {
    const entry = getApologyGuideCompletionEntry(student, guideId);
    if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
      const completedValue = Number(entry.completedCount ?? entry.runCount ?? entry.timesShown ?? 1);
      return Math.max(0, Math.floor(Number.isFinite(completedValue) ? completedValue : 1));
    }
    if (entry) return 1;
    return String(student?.apologyGuideCompleted || '') === guideId ? 1 : 0;
  }

  function hasCompletedApologyGuide(student, guideId) {
    if (!guideId) return false;
    return getApologyGuideCompletedCount(student, guideId) >= getApologyGuideMaxRuns(guideId);
  }

  function hasLocalNewPlayerGuideCompletion(student) {
    const studentId = getNewPlayerGuideStudentId(student);
    if (!studentId) return false;
    const entry = loadNewPlayerGuideCompletions()[studentId];
    if (!entry) return false;
    if (entry && typeof entry === 'object') return entry.version === NEW_PLAYER_GUIDE_COMPLETION_VERSION;
    return entry === NEW_PLAYER_GUIDE_COMPLETION_VERSION;
  }

  function hasLocalTeacherNewMusicGuideCompletion(student) {
    const studentId = getNewPlayerGuideStudentId(student);
    if (!studentId) return false;
    const entry = loadTeacherNewMusicGuideCompletions()[studentId];
    if (!entry) return false;
    if (entry && typeof entry === 'object') return entry.version === TEACHER_NEW_MUSIC_GUIDE_COMPLETION_VERSION;
    return entry === TEACHER_NEW_MUSIC_GUIDE_COMPLETION_VERSION;
  }

  function hasCompletedTeacherNewMusicGuide(student) {
    if (!student) return false;
    return student.teacherNewMusicGuideCompletedVersion === TEACHER_NEW_MUSIC_GUIDE_COMPLETION_VERSION
      || hasLocalTeacherNewMusicGuideCompletion(student);
  }

  function markLocalTeacherNewMusicGuideCompletion(student) {
    const studentId = getNewPlayerGuideStudentId(student);
    if (!studentId) return;
    const completions = loadTeacherNewMusicGuideCompletions();
    completions[studentId] = {
      version: TEACHER_NEW_MUSIC_GUIDE_COMPLETION_VERSION,
      completedAt: new Date().toISOString()
    };
    saveTeacherNewMusicGuideCompletions(completions);
  }

  function markLocalNewPlayerGuideCompletion(student) {
    const studentId = getNewPlayerGuideStudentId(student);
    if (!studentId) return;
    const completions = loadNewPlayerGuideCompletions();
    completions[studentId] = {
      version: NEW_PLAYER_GUIDE_COMPLETION_VERSION,
      completedAt: new Date().toISOString()
    };
    saveNewPlayerGuideCompletions(completions);
  }

  function hasCompletedNewPlayerOnboardingGuide(student) {
    if (!student?.petType) return false;
    const hasCompletedCurrentGuideVersion = student.newPlayerGuideCompletedVersion === NEW_PLAYER_GUIDE_COMPLETION_VERSION;
    return hasCompletedCurrentGuideVersion || hasLocalNewPlayerGuideCompletion(student);
  }

  function shouldShowNewPlayerOnboardingGuide(student) {
    if (!student?.petType) return false;
    const forceGuide = Boolean(student.forceNewPlayerGuide || student.forceOnboardingTour || student.newPlayerGuideEligible);
    return forceGuide || !hasCompletedNewPlayerOnboardingGuide(student);
  }

  function getDailyCheckinGuideSessionKey(student, date = getDateKey()) {
    const studentId = getNewPlayerGuideStudentId(student);
    return studentId ? `${studentId}:${date}:${DAILY_CHECKIN_GUIDE_COMPLETION_VERSION}` : '';
  }

  function hasDismissedDailyCheckinGuideThisSession(student, date = getDateKey()) {
    const key = getDailyCheckinGuideSessionKey(student, date);
    return Boolean(key && dailyCheckinGuideDismissedKeys.has(key));
  }

  function markDailyCheckinGuideDismissedForSession(student, date = getDateKey()) {
    const key = getDailyCheckinGuideSessionKey(student, date);
    if (key) dailyCheckinGuideDismissedKeys.add(key);
  }

  function shouldShowDailyCheckinGuide(student, date = getDateKey()) {
    if (!student?.petType || session.quiz) return false;
    if (isCompleteStudyDay(student, date)) return false;
    return !hasDismissedDailyCheckinGuideThisSession(student, date);
  }

  function getNewPlayerGuidePetName(student = getStudent()) {
    const name = getPetFullDisplayName(student) || getPetNickname(student) || getPetInfo(student?.petType)?.name || '学习伙伴';
    return String(name || '学习伙伴').trim();
  }

  function getNewPlayerGuidePetId(student = getStudent()) {
    return getPetInfo(student?.petType)?.id || String(student?.petType || 'sunny-wing').trim() || 'sunny-wing';
  }

  function getTeacherNewMusicGuideSprite(student = getStudent()) {
    const profile = getKuromiRoomSpriteProfile(student);
    return withAssetVersion(profile.idleSrc || profile.fallbackSrc);
  }

  function getNewPlayerGuideSprite(student = getStudent()) {
    const mode = getNewPlayerGuideMode(student);
    if (mode === TEACHER_NEW_MUSIC_GUIDE_ID || mode === DAILY_CHECKIN_GUIDE_ID) return getTeacherNewMusicGuideSprite(student);
    const petId = getNewPlayerGuidePetId(student);
    const assetGroup = NEW_PLAYER_GUIDE_GREETING_PET_IDS.has(petId) ? 'characters-greeting' : 'characters';
    return withAssetVersion(`assets/8bit/${assetGroup}/${petId}-8bit.png`);
  }

  function getNewPlayerGuideFallbackSprite(student = getStudent()) {
    return withAssetVersion(`assets/8bit/characters/${getNewPlayerGuidePetId(student)}-8bit.png`);
  }

  function preloadNewPlayerGuideSprites(student = getStudent()) {
    if (!student?.petType) return;
    [getNewPlayerGuideSprite(student), getNewPlayerGuideFallbackSprite(student)].forEach(src => {
      if (!src) return;
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
    });
  }

  function getNewPlayerGuideStepTitle(step, student = getStudent()) {
    const value = currentLanguage === 'en' && step.titleEn ? step.titleEn : step.title;
    return typeof value === 'function' ? value(student) : value;
  }

  function getNewPlayerGuideStepCopy(step, student = getStudent()) {
    const value = currentLanguage === 'en' && step.copyEn ? step.copyEn : step.copy;
    return typeof value === 'function' ? value(student) : value;
  }

  function shouldShowNewPlayerGuide(student) {
    if (!student?.petType) return false;
    const forceNewPlayerGuide = Boolean(student.forceNewPlayerGuide);
    const forceGuide = forceNewPlayerGuide || student.forceOnboardingTour || student.newPlayerGuideEligible;
    const hasCompletedCurrentGuideVersion = student.newPlayerGuideCompletedVersion === NEW_PLAYER_GUIDE_COMPLETION_VERSION;
    const mode = getNewPlayerGuideMode(student);
    if (mode === 'yiyan-apology') {
      const previewMode = getNewPlayerGuidePreviewMode();
      if (previewMode) return true;
      return !hasCompletedApologyGuide(student, YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID);
    }
    if (mode === TEACHER_NEW_MUSIC_GUIDE_ID) {
      const previewMode = getNewPlayerGuidePreviewMode();
      if (previewMode === TEACHER_NEW_MUSIC_GUIDE_ID) return true;
      return isTeacherAccount(student) && !hasCompletedTeacherNewMusicGuide(student);
    }
    if (mode === DAILY_CHECKIN_GUIDE_ID) {
      const previewMode = getNewPlayerGuidePreviewMode();
      if (previewMode === DAILY_CHECKIN_GUIDE_ID) return true;
      return shouldShowDailyCheckinGuide(student);
    }
    if (!forceGuide && (hasCompletedCurrentGuideVersion || hasLocalNewPlayerGuideCompletion(student))) return false;
    return true;
  }

  function getOnboardingTargetElement(target) {
    return target ? document.querySelector(`[data-onboarding-target="${target}"]`) : null;
  }

  function getNewPlayerGuideFocusTargets(step = {}) {
    return [step.target, ...(Array.isArray(step.extraTargets) ? step.extraTargets : [])]
      .map(getOnboardingTargetElement)
      .filter(Boolean);
  }

  function setNewPlayerGuideSpotlightRect(rect = null, target = null) {
    const overlay = $('#new-player-guide-overlay');
    if (!overlay) return;
    const viewportWidth = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    const viewportHeight = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    const edge = viewportWidth < 760 ? 8 : 14;
    const padding = viewportWidth < 760 ? 8 : 14;
    let left = edge;
    let top = edge;
    let right = viewportWidth - edge;
    let bottom = viewportHeight - edge;
    if (rect && Number(rect.width) > 0 && Number(rect.height) > 0) {
      left = Math.max(edge, Math.min(viewportWidth - edge, rect.left - padding));
      top = Math.max(edge, Math.min(viewportHeight - edge, rect.top - padding));
      right = Math.max(left + 64, Math.min(viewportWidth - edge, rect.right + padding));
      bottom = Math.max(top + 48, Math.min(viewportHeight - edge, rect.bottom + padding));
      if (right > viewportWidth - edge) {
        const overflow = right - (viewportWidth - edge);
        left = Math.max(edge, left - overflow);
        right = viewportWidth - edge;
      }
      if (bottom > viewportHeight - edge) {
        const overflow = bottom - (viewportHeight - edge);
        top = Math.max(edge, top - overflow);
        bottom = viewportHeight - edge;
      }
    }
    const radius = target?.classList?.contains('nav-button')
      ? 18
      : target?.classList?.contains('pet-skills-panel') || target?.classList?.contains('owned-equipment-panel')
        ? 24
        : 28;
    overlay.style.setProperty('--new-player-guide-spotlight-x', `${Math.round(left)}px`);
    overlay.style.setProperty('--new-player-guide-spotlight-y', `${Math.round(top)}px`);
    overlay.style.setProperty('--new-player-guide-spotlight-w', `${Math.round(Math.max(1, right - left))}px`);
    overlay.style.setProperty('--new-player-guide-spotlight-h', `${Math.round(Math.max(1, bottom - top))}px`);
    overlay.style.setProperty('--new-player-guide-spotlight-radius', `${radius}px`);
  }

  function setNewPlayerGuideNoSpotlight(noSpotlight) {
    const overlay = $('#new-player-guide-overlay');
    if (!overlay) return;
    overlay.classList.toggle('new-player-guide-no-spotlight', Boolean(noSpotlight));
  }

  function setNewPlayerGuidePlacement(placement = 'bottom') {
    const overlay = $('#new-player-guide-overlay');
    if (!overlay) return;
    overlay.dataset.guidePlacement = placement === 'top' ? 'top' : 'bottom';
  }

  function updateNewPlayerGuideSpotlight(target = null) {
    if (!newPlayerGuideState.active) return;
    const steps = getNewPlayerGuideSteps();
    const currentStep = steps[newPlayerGuideState.index] || steps[0];
    if (currentStep.spotlight === false || !currentStep.target) {
      setNewPlayerGuideNoSpotlight(true);
      return;
    }
    const element = target || getOnboardingTargetElement(currentStep.target);
    setNewPlayerGuideNoSpotlight(false);
    setNewPlayerGuideSpotlightRect(element?.getBoundingClientRect?.() || null, element);
  }

  function scheduleNewPlayerGuideSpotlightUpdate() {
    if (!newPlayerGuideState.active) return;
    if (newPlayerGuideState.spotlightFrame) cancelAnimationFrame(newPlayerGuideState.spotlightFrame);
    newPlayerGuideState.spotlightFrame = requestAnimationFrame(() => {
      newPlayerGuideState.spotlightFrame = null;
      updateNewPlayerGuideSpotlight();
    });
  }

  function isNewPlayerGuideBlockedByModal() {
    return [
      '#pet-selection-modal',
      '#gift-claim-overlay',
      '#friend-gift-overlay',
      '#avatar-crop-overlay',
      '#image-viewer-overlay',
      '#level-up-overlay',
      '#evolution-overlay',
      '#evolution-choice-overlay'
    ].some(selector => {
      const overlay = $(selector);
      return Boolean(overlay && !overlay.classList.contains('hidden'));
    });
  }

  function clearNewPlayerGuideFocus() {
    $all('.new-player-guide-focus').forEach(element => element.classList.remove('new-player-guide-focus'));
    setNewPlayerGuideSpotlightRect();
  }

  function completeNewPlayerGuideTyping() {
    const copy = $('#new-player-guide-copy');
    if (!newPlayerGuideState.typing) return false;
    if (newPlayerGuideState.typingTimer) clearInterval(newPlayerGuideState.typingTimer);
    newPlayerGuideState.typingTimer = null;
    newPlayerGuideState.typing = false;
    if (copy) copy.textContent = translateTextValue(newPlayerGuideState.fullCopy);
    return true;
  }

  function startNewPlayerGuideTyping(copyText) {
    const copy = $('#new-player-guide-copy');
    if (!copy) return;
    if (newPlayerGuideState.typingTimer) clearInterval(newPlayerGuideState.typingTimer);
    const translatedCopy = translateTextValue(copyText);
    const characters = Array.from(translatedCopy);
    let index = 0;
    newPlayerGuideState.fullCopy = copyText;
    newPlayerGuideState.typing = true;
    copy.textContent = '';
    newPlayerGuideState.typingTimer = setInterval(() => {
      index += 1;
      copy.textContent = characters.slice(0, index).join('');
      if (index >= characters.length) {
        clearInterval(newPlayerGuideState.typingTimer);
        newPlayerGuideState.typingTimer = null;
        newPlayerGuideState.typing = false;
      }
    }, NEW_PLAYER_GUIDE_TYPE_SPEED_MS);
  }

  function renderNewPlayerGuideStep() {
    const student = getStudent();
    const steps = getNewPlayerGuideSteps(student);
    const step = steps[newPlayerGuideState.index] || steps[0];
    const title = $('#new-player-guide-title');
    const stepLabel = $('#new-player-guide-step');
    const nextButton = $('[data-new-player-guide-next]');
    const petImage = $('#new-player-guide-pet');
    if (title) title.textContent = getNewPlayerGuideStepTitle(step, student);
    if (stepLabel) stepLabel.textContent = `${newPlayerGuideState.index + 1} / ${steps.length}`;
    if (nextButton) nextButton.textContent = localize(newPlayerGuideState.index >= steps.length - 1 ? '完成' : '下一步');
    if (petImage && student) {
      const fallbackSrc = getNewPlayerGuideFallbackSprite(student);
      petImage.dataset.fallbackSrc = fallbackSrc;
      petImage.alt = getNewPlayerGuidePetName(student);
      petImage.onerror = () => {
        if (petImage.dataset.fallbackSrc && petImage.getAttribute('src') !== petImage.dataset.fallbackSrc) {
          petImage.src = petImage.dataset.fallbackSrc;
        }
      };
      petImage.src = getNewPlayerGuideSprite(student);
    }
    const copy = getNewPlayerGuideStepCopy(step, student);
    startNewPlayerGuideTyping(copy || '');
  }

  function showNewPlayerGuideStep(index) {
    const steps = getNewPlayerGuideSteps();
    const step = steps[index] || steps[0];
    newPlayerGuideState.index = Math.max(0, Math.min(index, steps.length - 1));
    if (step.view && session.activeView !== step.view) switchView(step.view);
    setNewPlayerGuidePlacement(step.guidePlacement || 'bottom');
    clearNewPlayerGuideFocus();
    window.requestAnimationFrame(() => {
      const target = getOnboardingTargetElement(step.target);
      getNewPlayerGuideFocusTargets(step).forEach(element => element.classList.add('new-player-guide-focus'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: step.scrollBlock || 'center', inline: 'center' });
        setNewPlayerGuideNoSpotlight(false);
        updateNewPlayerGuideSpotlight(target);
        window.setTimeout(() => updateNewPlayerGuideSpotlight(target), 380);
      } else {
        setNewPlayerGuideNoSpotlight(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      renderNewPlayerGuideStep();
    });
  }

  function startNewPlayerGuide(student = getStudent()) {
    if (!shouldShowNewPlayerGuide(student) || newPlayerGuideState.active) return false;
    if (isNewPlayerGuideBlockedByModal()) return queueNewPlayerGuide(student);
    const overlay = $('#new-player-guide-overlay');
    if (!overlay) return false;
    preloadNewPlayerGuideSprites(student);
    if (newPlayerGuideState.timer) clearTimeout(newPlayerGuideState.timer);
    newPlayerGuideState.timer = null;
    newPlayerGuideState.queued = false;
    newPlayerGuideState.active = true;
    newPlayerGuideState.studentId = getNewPlayerGuideStudentId(student);
    newPlayerGuideState.mode = getNewPlayerGuideMode(student);
    newPlayerGuideState.preview = Boolean(getNewPlayerGuidePreviewMode());
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('new-player-guide-active');
    const steps = getNewPlayerGuideSteps(student);
    if (steps[0]?.view && session.activeView !== steps[0].view) switchView(steps[0].view);
    showNewPlayerGuideStep(0);
    return true;
  }

  function queueNewPlayerGuide(student = getStudent()) {
    if (!shouldShowNewPlayerGuide(student) || newPlayerGuideState.active) return false;
    preloadNewPlayerGuideSprites(student);
    if (newPlayerGuideState.timer) clearTimeout(newPlayerGuideState.timer);
    newPlayerGuideState.queued = true;
    newPlayerGuideState.timer = setTimeout(() => {
      newPlayerGuideState.timer = null;
      newPlayerGuideState.queued = false;
      startNewPlayerGuide(getStudent());
    }, 520);
    return true;
  }

  function maybeQueueNewPlayerGuide(student = getStudent()) {
    return queueNewPlayerGuide(student);
  }

  async function closeNewPlayerGuide(options = {}) {
    const overlay = $('#new-player-guide-overlay');
    const student = getStudent();
    const completedGuideMode = newPlayerGuideState.mode || 'new-player';
    const completedGuidePreview = Boolean(newPlayerGuideState.preview);
    if (newPlayerGuideState.timer) clearTimeout(newPlayerGuideState.timer);
    if (newPlayerGuideState.typingTimer) clearInterval(newPlayerGuideState.typingTimer);
    if (newPlayerGuideState.spotlightFrame) cancelAnimationFrame(newPlayerGuideState.spotlightFrame);
    newPlayerGuideState.timer = null;
    newPlayerGuideState.typingTimer = null;
    newPlayerGuideState.spotlightFrame = null;
    newPlayerGuideState.typing = false;
    newPlayerGuideState.active = false;
    newPlayerGuideState.queued = false;
    newPlayerGuideState.index = 0;
    newPlayerGuideState.mode = 'new-player';
    newPlayerGuideState.preview = false;
    newPlayerGuideState.fullCopy = '';
    clearNewPlayerGuideFocus();
    document.body.classList.remove('new-player-guide-active');
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.classList.remove('new-player-guide-no-spotlight');
      delete overlay.dataset.guidePlacement;
    }
    if (options.returnHome !== false && session.activeView !== DEFAULT_APP_VIEW) switchView(DEFAULT_APP_VIEW);
    if (completedGuidePreview || options.localOnly || !student?.petType) return;
    if (completedGuideMode === DAILY_CHECKIN_GUIDE_ID) {
      const today = getDateKey();
      markDailyCheckinGuideDismissedForSession(student, today);
      student.dailyCheckinGuideLastSeenDate = today;
      student.dailyCheckinGuideLastSeenAt = new Date().toISOString();
      database[student.studentId] = student;
      saveDatabase();
      try {
        await persistStudentState(student, {
          type: 'completeDailyCheckinGuide',
          guideId: DAILY_CHECKIN_GUIDE_ID,
          version: DAILY_CHECKIN_GUIDE_COMPLETION_VERSION,
          date: today
        });
      } catch (error) {
        console.info('Daily check-in guide dismissal saved locally only.', error);
      }
      return;
    }
    if (completedGuideMode === 'yiyan-apology') {
      const completions = student.apologyGuideCompletions && typeof student.apologyGuideCompletions === 'object' && !Array.isArray(student.apologyGuideCompletions)
        ? { ...student.apologyGuideCompletions }
        : {};
      const completedAt = new Date().toISOString();
      const maxRuns = getApologyGuideMaxRuns(YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID);
      const completedCount = Math.min(maxRuns, getApologyGuideCompletedCount(student, YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID) + 1);
      const previousCompletion = completions[YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID];
      completions[YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID] = {
        ...(previousCompletion && typeof previousCompletion === 'object' && !Array.isArray(previousCompletion) ? previousCompletion : {}),
        completedCount,
        maxCompletions: maxRuns,
        lastCompletedAt: completedAt
      };
      if (completedCount >= maxRuns) {
        completions[YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID].completedAt = completedAt;
      }
      student.apologyGuideCompletions = completions;
      if (completedCount >= maxRuns && getStudentApologyGuideId(student) === YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID) {
        student.forceApologyGuide = '';
        student.apologyGuide = '';
        student.activeApologyGuide = '';
      }
      database[student.studentId] = student;
      saveDatabase();
      try {
        await persistStudentState(student, {
          type: 'completeApologyGuide',
          guideId: YIYAN_BLIND_BOX_APOLOGY_GUIDE_ID,
          completedCount,
          maxCompletions: maxRuns
        });
      } catch (error) {
        console.info('Apology guide completion saved locally only.', error);
      }
      return;
    }
    if (completedGuideMode === TEACHER_NEW_MUSIC_GUIDE_ID) {
      student.teacherNewMusicGuideCompletedAt = new Date().toISOString();
      student.teacherNewMusicGuideCompletedVersion = TEACHER_NEW_MUSIC_GUIDE_COMPLETION_VERSION;
      database[student.studentId] = student;
      markLocalTeacherNewMusicGuideCompletion(student);
      saveDatabase();
      try {
        await persistStudentState(student, {
          type: 'completeTeacherNewMusicGuide',
          guideId: TEACHER_NEW_MUSIC_GUIDE_ID,
          version: TEACHER_NEW_MUSIC_GUIDE_COMPLETION_VERSION
        });
      } catch (error) {
        console.info('Teacher music guide completion saved locally only.', error);
      }
      return;
    }
    if (completedGuideMode === 'new-player') {
      student.newPlayerGuideCompletedAt = new Date().toISOString();
      student.newPlayerGuideCompletedVersion = NEW_PLAYER_GUIDE_COMPLETION_VERSION;
      student.newPlayerGuideEligible = false;
      student.forceNewPlayerGuide = false;
      student.forceOnboardingTour = false;
      database[student.studentId] = student;
      markLocalNewPlayerGuideCompletion(student);
      saveDatabase();
      try {
        await persistStudentState(student, { type: 'completeNewPlayerGuide' });
      } catch (error) {
        console.info('New player guide completion saved locally only.', error);
      }
      if (shouldShowDailyCheckinGuide(student)) {
        setTimeout(() => queueNewPlayerGuide(getStudent()), 620);
      }
    }
  }

  async function nextNewPlayerGuideStep() {
    if (completeNewPlayerGuideTyping()) return;
    const steps = getNewPlayerGuideSteps();
    if (newPlayerGuideState.index >= steps.length - 1) {
      await closeNewPlayerGuide();
      return;
    }
    showNewPlayerGuideStep(newPlayerGuideState.index + 1);
  }

  function getVersionedRoleCardAsset(src) {
    return isRoleCardAsset(src) ? withAssetVersion(src) : '';
  }

  function getRolePreviewAsset(src) {
    const raw = String(src || '').trim();
    const clean = raw.split('?')[0];
    if (!isRoleCardAsset(clean)) return withAssetVersion(clean || raw);
    const slug = clean
      .replace(/^assets\/roles\//, '')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
    return withAssetVersion(`assets/optimized/role-thumbs/${slug || 'role-card'}.webp`);
  }

  function getPetCuteEvolvedImage(pet) {
    return getVersionedRoleCardAsset(pet?.cuteEvolvedImage)
      || getVersionedRoleCardAsset(pet?.evolvedImage)
      || getVersionedRoleCardAsset(pet?.image)
      || '';
  }

  function getPetMiniEvolutionImage(pet) {
    return getVersionedRoleCardAsset(pet?.miniEvolutionImage)
      || getVersionedRoleCardAsset(pet?.image)
      || '';
  }

  function isValidEvolutionStyle(style) {
    return style === EVOLUTION_STYLE_CUTE || style === EVOLUTION_STYLE_HEROIC;
  }

  function normalizePetEvolutionForm(value) {
    const form = String(value || '').trim();
    if (form === PET_EVOLUTION_FORM_ORIGINAL || form === PET_EVOLUTION_FORM_MINI || isValidEvolutionStyle(form)) return form;
    return '';
  }

  function petSupportsHeroicEvolution(petType) {
    const petId = String(petType || '').trim().toLowerCase();
    if (!petId) return true;
    if (CUTE_ONLY_FINAL_EVOLUTION_PET_IDS.has(petId)) return false;
    const pet = getPetInfo(petId);
    if (!pet) return true;
    return Boolean(pet.cuteEvolvedImage);
  }

  function getFinalPetEvolutionForms(petType) {
    return petSupportsHeroicEvolution(petType)
      ? [EVOLUTION_STYLE_CUTE, EVOLUTION_STYLE_HEROIC]
      : [EVOLUTION_STYLE_CUTE];
  }

  function getAvailablePetEvolutionForms(petType) {
    return [
      PET_EVOLUTION_FORM_ORIGINAL,
      PET_EVOLUTION_FORM_MINI,
      ...getFinalPetEvolutionForms(petType)
    ];
  }

  function normalizePetEvolutionFormForPet(value, petType) {
    const form = normalizePetEvolutionForm(value);
    if (form === EVOLUTION_STYLE_HEROIC && !petSupportsHeroicEvolution(petType)) return EVOLUTION_STYLE_CUTE;
    return form;
  }

  function isFinalEvolutionForm(form) {
    return form === EVOLUTION_STYLE_CUTE || form === EVOLUTION_STYLE_HEROIC;
  }

  function getStudentEvolutionStylePreference(student) {
    const style = String(student?.evolutionStylePreference || '').trim();
    return isValidEvolutionStyle(style) ? style : '';
  }

  function getPreferredPetEvolutionStyle(student, petType = student?.petType) {
    const recordStyle = student?.petCollection?.[petType]?.evolutionStyle;
    if (isValidEvolutionStyle(recordStyle)) return normalizePetEvolutionFormForPet(recordStyle, petType);
    const preferred = getStudentEvolutionStylePreference(student);
    if (preferred) return normalizePetEvolutionFormForPet(preferred, petType);
    return petSupportsHeroicEvolution(petType) ? EVOLUTION_STYLE_HEROIC : EVOLUTION_STYLE_CUTE;
  }

  function getUnlockedPetEvolutionForms(student, petType = student?.petType) {
    const forms = new Set([PET_EVOLUTION_FORM_ORIGINAL]);
    if (!student || !petType) return [...forms];
    const record = student.petCollection?.[petType];
    const activePet = petType === student.petType;
    const addForms = value => {
      if (!Array.isArray(value)) return;
      value
        .map(form => normalizePetEvolutionFormForPet(form, petType))
        .filter(Boolean)
        .forEach(form => forms.add(form));
    };
    addForms(record?.unlockedEvolutionForms);
    addForms(record?.unlockedForms);
    const activeForm = normalizePetEvolutionFormForPet(record?.activeEvolutionForm || record?.selectedEvolutionForm || (activePet ? student.activeEvolutionForm : ''), petType);
    if (activeForm === PET_EVOLUTION_FORM_MINI || isFinalEvolutionForm(activeForm)) forms.add(activeForm);
    if (record?.miniEvolved || (activePet && student.miniPetEvolved)) forms.add(PET_EVOLUTION_FORM_MINI);
    const evolvedPets = student.evolvedPets && typeof student.evolvedPets === 'object' && !Array.isArray(student.evolvedPets) ? student.evolvedPets : {};
    if (record?.evolved || evolvedPets[petType] || (activePet && student.petEvolved)) {
      forms.add(getPreferredPetEvolutionStyle(student, petType));
    }
    if (isValidEvolutionStyle(record?.evolutionStyle)) forms.add(normalizePetEvolutionFormForPet(record.evolutionStyle, petType));
    return getAvailablePetEvolutionForms(petType).filter(form => forms.has(form));
  }

  function hasUnlockedPetEvolutionForm(student, petType, form) {
    const safeForm = normalizePetEvolutionFormForPet(form, petType);
    return Boolean(safeForm && getUnlockedPetEvolutionForms(student, petType).includes(safeForm));
  }

  function hasAnyFinalEvolutionUnlocked(student, petType = student?.petType) {
    return getUnlockedPetEvolutionForms(student, petType).some(isFinalEvolutionForm);
  }

  function getFallbackActivePetEvolutionForm(student, petType = student?.petType) {
    const unlocked = getUnlockedPetEvolutionForms(student, petType);
    const preferred = getPreferredPetEvolutionStyle(student, petType);
    if (unlocked.includes(preferred)) return preferred;
    const finalForm = getFinalPetEvolutionForms(petType).find(form => unlocked.includes(form));
    if (finalForm) return finalForm;
    if (unlocked.includes(PET_EVOLUTION_FORM_MINI)) return PET_EVOLUTION_FORM_MINI;
    return PET_EVOLUTION_FORM_ORIGINAL;
  }

  function getActivePetEvolutionForm(student, petType = student?.petType) {
    if (!student || !petType) return PET_EVOLUTION_FORM_ORIGINAL;
    const record = student.petCollection?.[petType];
    const activeCandidate = normalizePetEvolutionFormForPet(record?.activeEvolutionForm || record?.selectedEvolutionForm || (petType === student.petType ? student.activeEvolutionForm : ''), petType);
    const unlocked = getUnlockedPetEvolutionForms(student, petType);
    if (activeCandidate && unlocked.includes(activeCandidate)) return activeCandidate;
    return getFallbackActivePetEvolutionForm(student, petType);
  }

  function syncPetEvolutionFormState(student, petType = student?.petType) {
    if (!student || !petType) return PET_EVOLUTION_FORM_ORIGINAL;
    const record = student.petCollection?.[petType];
    if (!record) return PET_EVOLUTION_FORM_ORIGINAL;
    if (isValidEvolutionStyle(record.evolutionStyle)) {
      record.evolutionStyle = normalizePetEvolutionFormForPet(record.evolutionStyle, petType);
    }
    const unlocked = getUnlockedPetEvolutionForms(student, petType);
    record.unlockedEvolutionForms = unlocked;
    record.unlockedForms = unlocked;
    const activeCandidate = normalizePetEvolutionFormForPet(record.activeEvolutionForm || record.selectedEvolutionForm || (petType === student.petType ? student.activeEvolutionForm : ''), petType);
    const activeForm = unlocked.includes(activeCandidate)
      ? activeCandidate
      : getFallbackActivePetEvolutionForm(student, petType);
    record.activeEvolutionForm = activeForm;
    if (isFinalEvolutionForm(activeForm)) record.evolutionStyle = activeForm;
    if (petType === student.petType) {
      student.activeEvolutionForm = activeForm;
      student.miniPetEvolved = unlocked.includes(PET_EVOLUTION_FORM_MINI);
      student.petEvolved = unlocked.some(isFinalEvolutionForm);
      if (isFinalEvolutionForm(activeForm)) student.evolutionStylePreference = activeForm;
    }
    return activeForm;
  }

  function unlockPetEvolutionForm(record, form, petType = record?.petId) {
    const safeForm = normalizePetEvolutionFormForPet(form, petType);
    if (!record || !safeForm) return [];
    const forms = new Set(Array.isArray(record.unlockedEvolutionForms)
      ? record.unlockedEvolutionForms.map(value => normalizePetEvolutionFormForPet(value, petType)).filter(Boolean)
      : [PET_EVOLUTION_FORM_ORIGINAL]);
    forms.add(PET_EVOLUTION_FORM_ORIGINAL);
    forms.add(safeForm);
    record.unlockedEvolutionForms = getAvailablePetEvolutionForms(petType).filter(option => forms.has(option));
    record.unlockedForms = record.unlockedEvolutionForms;
    record.activeEvolutionForm = safeForm;
    return record.unlockedEvolutionForms;
  }

  function isPetActiveMiniEvolution(student, petType = student?.petType) {
    return getActivePetEvolutionForm(student, petType) === PET_EVOLUTION_FORM_MINI;
  }

  function isPetActiveFinalEvolution(student, petType = student?.petType) {
    return isFinalEvolutionForm(getActivePetEvolutionForm(student, petType));
  }

  function isPetEvolved(student, petType = student?.petType) {
    return hasAnyFinalEvolutionUnlocked(student, petType);
  }

  function isPetMiniEvolved(student, petType = student?.petType) {
    if (!student || !petType) return false;
    const record = student.petCollection?.[petType];
    return Boolean(record?.miniEvolved || (petType === student.petType && student.miniPetEvolved) || getUnlockedPetEvolutionForms(student, petType).includes(PET_EVOLUTION_FORM_MINI));
  }

  function getPetEvolutionStyle(student, petType = student?.petType) {
    const activeForm = getActivePetEvolutionForm(student, petType);
    if (isValidEvolutionStyle(activeForm)) return activeForm;
    return getPreferredPetEvolutionStyle(student, petType);
  }

  function getPetSpeciesName(pet, stage = 'base') {
    const names = pet?.evolutionNames || {};
    return names[stage] || names.base || pet?.name || '';
  }

  function getPetEvolutionNameStage(student, petType = student?.petType) {
    const activeForm = getActivePetEvolutionForm(student, petType);
    if (activeForm === EVOLUTION_STYLE_CUTE) return 'cute';
    if (activeForm === EVOLUTION_STYLE_HEROIC) return 'heroic';
    if (activeForm === PET_EVOLUTION_FORM_MINI) return 'mini';
    return 'base';
  }

  function getPetSpeciesNameForStudent(student, petType = student?.petType) {
    const pet = getPetInfo(petType);
    return getPetSpeciesName(pet, getPetEvolutionNameStage(student, petType));
  }

  function getPetNickname(student, petType = student?.petType) {
    const pet = getPetInfo(petType);
    if (!student) return pet?.name || '';
    const record = student?.petCollection?.[petType];
    if (petType === student?.petType) return String(student.petName || record?.petName || pet?.name || '').trim();
    return String(record?.petName || pet?.name || '').trim();
  }

  function formatPetDisplayName(nickname, speciesName) {
    const cleanNickname = String(nickname || '').trim();
    const cleanSpecies = String(speciesName || '').trim();
    if (!cleanNickname && !cleanSpecies) return '';
    if (!cleanSpecies) return cleanNickname;
    if (!cleanNickname) return cleanSpecies;
    if (cleanNickname.toLocaleLowerCase() === cleanSpecies.toLocaleLowerCase()) return cleanSpecies;
    return `${cleanNickname}【${cleanSpecies}】`;
  }

  function getPetFullDisplayName(student, petType = student?.petType) {
    return formatPetDisplayName(getPetNickname(student, petType), getPetSpeciesNameForStudent(student, petType));
  }

  function getCollectibleSeriesIds() {
    return PET_SERIES_GROUPS
      .filter(series => series.id !== 'all' && getPetSeriesPets(series.id).length > 0)
      .map(series => series.id);
  }

  function isPetOwnedByStudent(student, petType) {
    return Boolean(student?.demoMode || (Array.isArray(student?.ownedPets) && student.ownedPets.includes(petType)));
  }

  function isSeriesComplete(student, seriesId) {
    const pets = getPetSeriesPets(seriesId);
    return Boolean(pets.length && pets.every(pet => isPetOwnedByStudent(student, pet.id)));
  }

  function getSeriesDefaultTitle(seriesId) {
    const pool = COLLECTION_TITLE_POOLS[seriesId] || [];
    return pool[0] || '';
  }

  function syncCollectionTitleState(student) {
    if (!student) return false;
    if (!student.collectionTitles || typeof student.collectionTitles !== 'object' || Array.isArray(student.collectionTitles)) student.collectionTitles = {};
    const previous = JSON.stringify(student.collectionTitles || {});
    getCollectibleSeriesIds().forEach(seriesId => {
      if (isSeriesComplete(student, seriesId) && !student.collectionTitles[seriesId]) {
        student.collectionTitles[seriesId] = getSeriesDefaultTitle(seriesId);
      }
    });
    const completedEverySeries = getCollectibleSeriesIds().every(seriesId => isSeriesComplete(student, seriesId));
    if (completedEverySeries && !student.titleDrawCompleted && !student.drawnCollectionTitle) student.titleDrawAvailable = true;
    return previous !== JSON.stringify(student.collectionTitles || {});
  }

  function getPetSeriesTitleLabel(student, petType = student?.petType) {
    const seriesId = getPetSeriesId(getPetInfo(petType));
    const title = String(student?.collectionTitles?.[seriesId] || '').trim();
    return title && isSeriesComplete(student, seriesId) ? title : '';
  }

  function getDisplayCollectionTitleForPet(student, petType = student?.petType) {
    const globalTitle = String(student?.drawnCollectionTitle || '').trim();
    return globalTitle || getPetSeriesTitleLabel(student, petType);
  }

  function getPetFullDisplayNameWithTitle(student, petType = student?.petType) {
    const displayName = getPetFullDisplayName(student, petType);
    const title = getDisplayCollectionTitleForPet(student, petType);
    return title ? `${displayName} · ${title}` : displayName;
  }

  function getAllCollectionTitleCandidates(student) {
    const seriesIds = getCollectibleSeriesIds().filter(seriesId => isSeriesComplete(student, seriesId));
    return seriesIds.flatMap(seriesId => COLLECTION_TITLE_POOLS[seriesId] || []).filter(Boolean);
  }

  async function chooseCollectionTitle(titleValue) {
    const student = getStudent();
    if (!student || student.demoMode) return false;
    const candidates = getAllCollectionTitleCandidates(student);
    const title = String(titleValue || '').trim();
    if (!candidates.length) {
      showToast('还没有完成全部系列，暂时不能选择称号。');
      return false;
    }
    if (!candidates.includes(title)) {
      showToast('请选择一个可用称号。');
      return false;
    }
    const snapshot = cloneStudentState(student);
    student.drawnCollectionTitle = title;
    student.titleDrawAvailable = false;
    student.titleDrawCompleted = true;
    const saved = await commitStudentState(student, snapshot, { type: 'chooseCollectionTitle', title }, () => {
      renderAppShell();
      renderActiveStudentView();
    });
    if (!saved) return false;
    showGiftClaimModal({
      title: '称号已保存！',
      message: `恭喜你获得：${title}`,
      rewards: { pets: [], items: [], coins: 0, duplicates: [] },
      forceReplace: true
    });
    playUiSound('reward');
    return true;
  }

  function renderCollectionTitleChoiceHtml(student) {
    const candidates = getAllCollectionTitleCandidates(student);
    return `<div class="title-choice-grid">${candidates.map(title => `
      <button type="button" class="title-choice-button" data-collection-title-choice="${escapeHtml(title)}">
        <strong>${escapeHtml(title)}</strong>
        <small>选择这个称号</small>
      </button>`).join('')}</div>`;
  }

  function maybeShowCollectionTitleChoiceModal(student = getStudent()) {
    if (!student || student.demoMode || !student.titleDrawAvailable || student.titleDrawCompleted || student.drawnCollectionTitle) return;
    const overlay = $('#gift-claim-overlay');
    if (overlay && !overlay.classList.contains('hidden')) return;
    showGiftClaimModal({
      title: '全系列收集完成！',
      message: '你已经收集完全部系列，请选择一个最喜欢的特别称号。',
      customHtml: renderCollectionTitleChoiceHtml(student)
    });
  }

  function getBlindBoxDuplicatePetCoins(pet) {
    return Math.max(18, Math.round(Number(getRarityInfo(pet?.rarity).price || 25) * 0.6));
  }

  function getBlindBoxDuplicateItemCoins(item) {
    return Math.max(8, Math.round(Number(item?.price || 15) * 0.5));
  }

  function getBlindBoxDuplicateMusicCoins(track) {
    return Math.max(28, Math.round(MUSIC_BOX_TRACK_PRICE * 0.5));
  }

  function getAllBlindBoxMusicTracks() {
    return MUSIC_BOX_TRACKS.filter(track => !track.defaultOwned && track.id !== DEFAULT_MUSIC_TRACK_ID);
  }

  function createBlindBoxDuplicateReward(type, entry, coinValue) {
    const isPet = type === 'pet';
    const isMusic = type === 'music';
    const trackId = isMusic ? String(entry?.id || '') : '';
    return {
      duplicateId: createLocalId('blind-dupe'),
      type,
      itemId: isMusic ? trackId : (isPet ? '' : String(entry?.id || '')),
      trackId,
      petId: isMusic ? '' : (isPet ? String(entry?.id || '') : String(entry?.exclusivePetId || '')),
      name: isMusic ? String(entry?.title || '') : (isPet ? String(entry?.name || '') : getEquipmentDisplayName(entry)),
      image: isMusic ? '' : (isPet ? (getVersionedRoleCardAsset(entry?.image) || entry?.image || '') : String(entry?.image || '')),
      rarity: isPet ? String(entry?.rarity || 'A') : '',
      series: isMusic ? String(entry?.series || '') : '',
      src: isMusic ? String(entry?.src || '') : '',
      accent: isMusic ? getMusicTrackAccent(entry) : '',
      coinValue: Math.max(0, Math.floor(Number(coinValue) || 0)),
      createdAt: new Date().toISOString()
    };
  }

  function addPendingBlindBoxDuplicate(student, duplicate) {
    if (!student || !duplicate?.duplicateId) return;
    if (!Array.isArray(student.pendingBlindBoxDuplicates)) student.pendingBlindBoxDuplicates = [];
    student.pendingBlindBoxDuplicates = [...student.pendingBlindBoxDuplicates, duplicate].slice(-20);
  }

  function pickRandomEntry(entries = []) {
    if (!entries.length) return null;
    return entries[Math.floor(Math.random() * entries.length)] || null;
  }

  function grantPetToStudent(student, pet, options = {}) {
    if (!student || !pet) return null;
    student.ownedPets = Array.from(new Set([...(student.ownedPets || []), pet.id]));
    student.petCollection = student.petCollection && typeof student.petCollection === 'object' ? student.petCollection : {};
    const existing = student.petCollection[pet.id] && typeof student.petCollection[pet.id] === 'object' && !Array.isArray(student.petCollection[pet.id])
      ? student.petCollection[pet.id]
      : {};
    const requiresNaming = Boolean(options.needsNaming);
    const record = {
      ...existing,
      petId: pet.id,
      rarity: existing.rarity || pet.rarity,
      petLevel: Math.max(1, Number(existing.petLevel || 1)),
      experience: Math.max(0, Number(existing.experience || 0)),
      equippedItems: existing.equippedItems && typeof existing.equippedItems === 'object' ? existing.equippedItems : {},
      ownedItems: Array.isArray(existing.ownedItems) ? [...new Set(existing.ownedItems)] : [],
      petName: String(existing.petName || options.petName || (requiresNaming ? '' : pet.name) || ''),
      birthday: String(existing.birthday || (requiresNaming ? '' : options.birthday) || ''),
      miniEvolved: Boolean(existing.miniEvolved),
      evolutionStyle: String(existing.evolutionStyle || ''),
      evolved: Boolean(existing.evolved),
      unlockedEvolutionForms: Array.isArray(existing.unlockedEvolutionForms) ? existing.unlockedEvolutionForms : [PET_EVOLUTION_FORM_ORIGINAL],
      unlockedForms: Array.isArray(existing.unlockedForms) ? existing.unlockedForms : [PET_EVOLUTION_FORM_ORIGINAL],
      activeEvolutionForm: normalizePetEvolutionFormForPet(existing.activeEvolutionForm, pet.id) || PET_EVOLUTION_FORM_ORIGINAL,
      needsNaming: Boolean(existing.needsNaming || requiresNaming)
    };
    student.petCollection[pet.id] = record;
    syncPetEvolutionFormState(student, pet.id);
    if (!student.petType) {
      student.petType = pet.id;
      student.petName = record.petName;
      student.petBirthday = record.birthday;
      student.petRarity = record.rarity;
      student.petLevel = record.petLevel;
      student.experience = record.experience;
      student.ownedItems = [...record.ownedItems];
      student.equippedItems = { ...record.equippedItems };
      student.miniPetEvolved = Boolean(record.miniEvolved);
      student.petEvolved = Boolean(record.evolved);
      student.activeEvolutionForm = syncPetEvolutionFormState(student, pet.id);
    }
    return record;
  }

  function grantItemToStudent(student, item) {
    if (!student || !item?.id) return false;
    const targetPetId = item.exclusivePetId || student.petType || 'gifted-items';
    student.petCollection = student.petCollection && typeof student.petCollection === 'object' ? student.petCollection : {};
    if (!student.petCollection[targetPetId]) {
      const pet = getPetInfo(targetPetId);
      student.petCollection[targetPetId] = {
        petId: targetPetId,
        rarity: pet?.rarity || 'A',
        petLevel: 1,
        experience: 0,
        equippedItems: {},
        ownedItems: [],
        petName: pet?.name || '',
        birthday: '',
        miniEvolved: false,
        evolutionStyle: '',
        evolved: false,
        unlockedEvolutionForms: [PET_EVOLUTION_FORM_ORIGINAL],
        unlockedForms: [PET_EVOLUTION_FORM_ORIGINAL],
        activeEvolutionForm: PET_EVOLUTION_FORM_ORIGINAL
      };
    }
    const record = student.petCollection[targetPetId];
    syncPetEvolutionFormState(student, targetPetId);
    if (!Array.isArray(record.ownedItems)) record.ownedItems = [];
    if (record.ownedItems.includes(item.id)) return false;
    record.ownedItems = [...record.ownedItems, item.id];
    if (student.petType === targetPetId) student.ownedItems = [...record.ownedItems];
    return true;
  }

  function grantMusicTrackToStudent(student, track) {
    if (!student || !track?.id || track.defaultOwned) return false;
    const owned = getOwnedMusicTracks(student);
    if (owned.includes(track.id)) return false;
    student.ownedMusicTracks = [...owned, track.id];
    return true;
  }

  function rollBlindBoxRewards(student) {
    const rewards = { pets: [], items: [], music: [], coins: 0, duplicates: [] };
    const ownedPets = new Set(student.ownedPets || []);
    const unownedPets = PET_CATALOG.filter(pet => !ownedPets.has(pet.id));
    const availableMusicTracks = getAllBlindBoxMusicTracks();
    const ownedMusicTracks = new Set(getOwnedMusicTracks(student));
    const unownedMusicTracks = availableMusicTracks.filter(track => !ownedMusicTracks.has(track.id));
    const primaryCandidates = [
      ...unownedPets.map(pet => ({ type: 'pet', entry: pet })),
      ...unownedMusicTracks.map(track => ({ type: 'music', entry: track }))
    ];
    const fallbackCandidates = [
      ...PET_CATALOG.map(pet => ({ type: 'pet', entry: pet })),
      ...availableMusicTracks.map(track => ({ type: 'music', entry: track }))
    ];
    const selectedPrimaryReward = pickRandomEntry(primaryCandidates.length ? primaryCandidates : fallbackCandidates);
    if (selectedPrimaryReward?.type === 'pet') {
      const selectedPet = selectedPrimaryReward.entry;
      if (selectedPet && !ownedPets.has(selectedPet.id)) {
        grantPetToStudent(student, selectedPet, { needsNaming: true });
        rewards.pets.push({ id: selectedPet.id, name: selectedPet.name, image: getVersionedRoleCardAsset(selectedPet.image) || selectedPet.image, rarity: selectedPet.rarity });
      } else if (selectedPet) {
        const duplicate = createBlindBoxDuplicateReward('pet', selectedPet, getBlindBoxDuplicatePetCoins(selectedPet));
        rewards.duplicates.push(duplicate);
        addPendingBlindBoxDuplicate(student, duplicate);
      }
    }
    if (selectedPrimaryReward?.type === 'music') {
      const selectedMusicTrack = selectedPrimaryReward.entry;
      if (grantMusicTrackToStudent(student, selectedMusicTrack)) {
        rewards.music.push({
          id: selectedMusicTrack.id,
          name: selectedMusicTrack.title,
          series: selectedMusicTrack.series,
          accent: getMusicTrackAccent(selectedMusicTrack)
        });
      } else if (selectedMusicTrack) {
        const duplicate = createBlindBoxDuplicateReward('music', selectedMusicTrack, getBlindBoxDuplicateMusicCoins(selectedMusicTrack));
        rewards.duplicates.push(duplicate);
        addPendingBlindBoxDuplicate(student, duplicate);
      }
    }

    const availableItems = getAllGiftableShopItems();
    for (let index = 0; index < 2 && availableItems.length; index += 1) {
      const selectedItem = pickRandomEntry(availableItems);
      if (!selectedItem) break;
      const added = grantItemToStudent(student, selectedItem);
      if (added) {
        rewards.items.push({
          id: selectedItem.id,
          name: getEquipmentDisplayName(selectedItem),
          image: selectedItem.image,
          petId: selectedItem.exclusivePetId
        });
      } else {
        const duplicate = createBlindBoxDuplicateReward('item', selectedItem, getBlindBoxDuplicateItemCoins(selectedItem));
        rewards.duplicates.push(duplicate);
        addPendingBlindBoxDuplicate(student, duplicate);
      }
    }
    if (rewards.coins) student.coins = Math.max(0, Math.floor(Number(student.coins || 0))) + rewards.coins;
    syncCollectionTitleState(student);
    return rewards;
  }

  function getAssetComparisonKey(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    try {
      return new URL(raw, window.location.href).pathname.replace(/^\/+/, '').split('?')[0];
    } catch (error) {
      return raw.replace(/^https?:\/\/[^/]+\//, '').replace(/^\/+/, '').split('?')[0];
    }
  }

  function isSameAssetPath(first, second) {
    const firstKey = getAssetComparisonKey(first);
    const secondKey = getAssetComparisonKey(second);
    return Boolean(firstKey && secondKey && firstKey === secondKey);
  }

  function getWallPostSpeciesName(post) {
    const pet = getPetInfo(post?.petType);
    if (!pet) return '';
    const image = post?.petImage || '';
    if (isSameAssetPath(image, getPetMiniEvolutionImage(pet))) return getPetSpeciesName(pet, 'mini');
    if (isSameAssetPath(image, getPetCuteEvolvedImage(pet))) return getPetSpeciesName(pet, 'cute');
    if (isSameAssetPath(image, pet.evolvedImage)) return getPetSpeciesName(pet, 'heroic');
    if (String(post?.petRarity || '').includes('MYTHIC') || String(post?.petLevel || '').includes('MAX')) {
      return getPetSpeciesName(pet, 'heroic');
    }
    return getPetSpeciesName(pet, 'base');
  }

  function getWallPostDisplayName(post) {
    return String(post?.studentName || post?.name || post?.studentId || '').trim();
  }

  function renderWallPostOwnerAvatar(post = {}) {
    const avatarImage = getStudentAvatarImage({ avatarImage: post.studentAvatarImage || post.petStats?.__studentAvatarImage });
    if (avatarImage) return `<img class="wall-owner-avatar-image" src="${escapeHtml(avatarImage)}" alt="" loading="lazy" decoding="async" />`;
    return escapeHtml(String(post.avatar || '🌟').trim() || '🌟');
  }

  function getWallPostTitle(post) {
    const ownerName = getWallPostDisplayName(post) || localize('学习伙伴');
    const nickname = String(post?.petName || '').trim();
    const species = getWallPostSpeciesName(post) || getPetInfo(post?.petType)?.name || '';
    const petName = nickname || species || String(post?.petType || '').trim() || localize('宠物');
    return currentLanguage === 'en' ? `${ownerName}'s ${petName}` : `${ownerName}的${petName}`;
  }

  function getPostMiniGameScores(post = {}) {
    const direct = normalizeMiniGameScores(post.miniGameScores || post.mini_game_scores);
    const stats = post.petStats && typeof post.petStats === 'object' && !Array.isArray(post.petStats) ? post.petStats : {};
    const nested = normalizeMiniGameScores(stats.__miniGameScores || stats.miniGameScores);
    return {
      reaction: Math.max(direct.reaction, nested.reaction),
      flappy: Math.max(direct.flappy, nested.flappy),
      runner: Math.max(direct.runner, nested.runner),
      jumpCharge: Math.max(direct.jumpCharge, nested.jumpCharge)
    };
  }

  function getPostTotalCombatPower(post = {}) {
    const direct = Math.max(0, Math.floor(Number(post.totalCombatPower || post.total_combat_power || 0) || 0));
    const stats = post.petStats && typeof post.petStats === 'object' && !Array.isArray(post.petStats) ? post.petStats : {};
    const nested = Math.max(0, Math.floor(Number(stats.__totalCombatPower || stats.totalCombatPower || 0) || 0));
    return direct || nested || Math.max(0, Math.floor(Number(post.combatPower || 0) || 0));
  }

  function getStudentCombatPowerForPet(student, petType) {
    const pet = getPetInfo(petType);
    if (!student || !pet) return 0;
    const preview = cloneStudentState(student);
    syncActivePetRecord(preview);
    const record = ensurePetRecord(preview, petType);
    preview.petType = petType;
    preview.petName = record?.petName || pet.name;
    preview.petBirthday = record?.birthday || '';
    preview.petRarity = record?.rarity || pet.rarity || 'A';
    preview.petLevel = Math.max(1, Math.floor(Number(record?.petLevel || 1) || 1));
    preview.experience = Math.max(0, Number(record?.experience || 0) || 0);
    preview.equippedItems = { ...(record?.equippedItems || {}) };
    preview.ownedItems = [...(record?.ownedItems || [])];
    preview.miniPetEvolved = Boolean(record?.miniEvolved);
    preview.petEvolved = Boolean(record?.evolved || preview.evolvedPets?.[petType]);
    return Math.max(0, Math.floor(Number(getCombatState(preview).power || 0) || 0));
  }

  function getOwnedPetCombatRows(student) {
    if (!student) return [];
    const ids = Array.from(new Set([...(Array.isArray(student.ownedPets) ? student.ownedPets : []), student.petType].filter(Boolean)))
      .filter(petType => getPetInfo(petType));
    return ids.map(petType => {
      const pet = getPetInfo(petType);
      const record = ensurePetRecord(cloneStudentState(student), petType);
      return {
        petType,
        name: record?.petName || pet?.name || petType,
        species: getPetSpeciesNameForStudent(student, petType) || pet?.name || '',
        image: getRolePreviewAsset(getPetRecordDisplayImage(student, petType) || pet?.image || ''),
        power: getStudentCombatPowerForPet(student, petType)
      };
    }).sort((a, b) => b.power - a.power);
  }

  function getStudentTotalCombatPower(student) {
    return getOwnedPetCombatRows(student).reduce((total, row) => total + Number(row.power || 0), 0);
  }

  function ensurePetRecord(student, petType = student?.petType) {
    if (!student || !petType) return null;
    student.petCollection = student.petCollection && typeof student.petCollection === 'object' ? student.petCollection : {};
    const pet = getPetInfo(petType);
    const isActive = petType === student.petType;
    const legacyOwnedItems = isActive && !student.petItemsMigrated ? [...(student.ownedItems || [])] : [];
    if (!student.petCollection[petType]) {
      student.petCollection[petType] = {
        petId: petType,
        rarity: isActive ? (student.petRarity || pet?.rarity || 'A') : (pet?.rarity || 'A'),
        petLevel: isActive ? (student.petLevel || 1) : 1,
        experience: isActive ? (student.experience || 0) : 0,
        equippedItems: isActive ? { ...(student.equippedItems || {}) } : {},
        ownedItems: legacyOwnedItems,
        petName: isActive ? (student.petName || pet?.name || '') : (pet?.name || ''),
        birthday: isActive ? (student.petBirthday || '') : '',
        miniEvolved: Boolean(isActive && student.miniPetEvolved),
        evolutionStyle: '',
        evolved: isPetEvolved(student, petType),
        unlockedEvolutionForms: [PET_EVOLUTION_FORM_ORIGINAL],
        unlockedForms: [PET_EVOLUTION_FORM_ORIGINAL],
        activeEvolutionForm: PET_EVOLUTION_FORM_ORIGINAL
      };
    }
    const record = student.petCollection[petType];
    if (!record.equippedItems || typeof record.equippedItems !== 'object') record.equippedItems = {};
    if (!Array.isArray(record.ownedItems)) record.ownedItems = [];
    if (isActive && !student.petItemsMigrated) {
      record.ownedItems = [...new Set([...record.ownedItems, ...legacyOwnedItems])];
      student.ownedItems = [...record.ownedItems];
      student.petItemsMigrated = true;
    }
    if (!Object.prototype.hasOwnProperty.call(record, 'petName')) record.petName = pet?.name || '';
    if (!Object.prototype.hasOwnProperty.call(record, 'birthday')) record.birthday = '';
    if (!Object.prototype.hasOwnProperty.call(record, 'miniEvolved')) record.miniEvolved = false;
    if (!Object.prototype.hasOwnProperty.call(record, 'evolutionStyle')) record.evolutionStyle = '';
    if (!Array.isArray(record.unlockedEvolutionForms)) record.unlockedEvolutionForms = Array.isArray(record.unlockedForms) ? record.unlockedForms : [PET_EVOLUTION_FORM_ORIGINAL];
    if (!Array.isArray(record.unlockedForms)) record.unlockedForms = record.unlockedEvolutionForms;
    record.activeEvolutionForm = normalizePetEvolutionFormForPet(record.activeEvolutionForm, petType) || getFallbackActivePetEvolutionForm(student, petType);
    if (!Object.prototype.hasOwnProperty.call(record, 'needsNaming')) record.needsNaming = false;
    syncPetEvolutionFormState(student, petType);
    return record;
  }

  function recordLooksLikeUnnamedRewardPet(record, pet) {
    if (!record || !pet) return false;
    const petName = String(record.petName || '').trim();
    const birthday = String(record.birthday || '').trim();
    return !birthday && (!petName || petName === pet.name);
  }

  function repairPetNamingState(student) {
    if (!student) return false;
    const petIds = Array.from(new Set([...(student.ownedPets || []), student.petType].filter(Boolean)));
    let changed = false;
    petIds.forEach(petId => {
      const pet = getPetInfo(petId);
      const record = ensurePetRecord(student, petId);
      if (!record || !recordLooksLikeUnnamedRewardPet(record, pet)) return;
      if (!record.needsNaming) {
        record.needsNaming = true;
        changed = true;
      }
    });
    return changed;
  }

  function syncActivePetRecord(student) {
    if (!student?.petType) return;
    const record = ensurePetRecord(student);
    if (!record) return;
    const level = getLevelInfo(student);
    student.petLevel = level.level;
    record.rarity = student.petRarity || record.rarity || 'A';
    record.petLevel = level.level;
    record.experience = student.experience || 0;
    record.equippedItems = { ...(student.equippedItems || {}) };
    record.ownedItems = [...(student.ownedItems || [])];
    record.petName = student.petName || record.petName || getPetInfo(student.petType)?.name || '';
    record.birthday = student.petBirthday || record.birthday || '';
    record.miniEvolved = Boolean(record.miniEvolved || student.miniPetEvolved);
    student.miniPetEvolved = Boolean(record.miniEvolved);
    record.evolved = isPetEvolved(student);
    record.activeEvolutionForm = syncPetEvolutionFormState(student, student.petType);
  }

  async function switchActivePet(student, petType) {
    const pet = getPetInfo(petType);
    const ownedPets = Array.isArray(student?.ownedPets) ? student.ownedPets : [];
    if (!student || !pet || (!student.demoMode && !ownedPets.includes(petType))) return false;
    const snapshot = cloneStudentState(student);
    if (!ownedPets.includes(petType)) student.ownedPets = [...ownedPets, petType];
    syncActivePetRecord(student);
    const record = ensurePetRecord(student, petType);
    student.petType = petType;
    student.petName = record?.petName || pet.name;
    student.petBirthday = record?.birthday || '';
    student.petRarity = record?.rarity || pet.rarity;
    student.petLevel = record?.petLevel || 1;
    student.experience = record?.experience || 0;
    student.equippedItems = { ...(record?.equippedItems || {}) };
    student.ownedItems = [...(record?.ownedItems || [])];
    student.miniPetEvolved = Boolean(record?.miniEvolved);
    student.petEvolved = Boolean(record?.evolved || student.evolvedPets?.[petType]);
    student.activeEvolutionForm = syncPetEvolutionFormState(student, petType);
    if (isFinalEvolutionForm(student.activeEvolutionForm)) student.evolutionStylePreference = student.activeEvolutionForm;
    syncEvolutionState(student);
    try {
      await persistStudentState(student, { type: 'switchPet', petId: petType });
    } catch (error) {
      database[snapshot.studentId] = snapshot;
      saveDatabase();
      showToast(`保存到云端失败，刚才的操作没有完成：${error.message || error}`);
      return false;
    }
    return true;
  }

  function getPetDisplayImage(student) {
    const pet = getPetInfo(student?.petType);
    if (!pet) return '';
    const form = getActivePetEvolutionForm(student);
    if (form === EVOLUTION_STYLE_CUTE) return getPetCuteEvolvedImage(pet);
    if (form === EVOLUTION_STYLE_HEROIC) return getVersionedRoleCardAsset(pet.evolvedImage) || getVersionedRoleCardAsset(pet.image);
    if (form === PET_EVOLUTION_FORM_MINI) return getPetMiniEvolutionImage(pet);
    return getVersionedRoleCardAsset(pet.image);
  }

  function getPetRecordDisplayImage(student, petType) {
    const pet = getPetInfo(petType);
    if (!pet) return '';
    const form = getActivePetEvolutionForm(student, petType);
    if (form === EVOLUTION_STYLE_CUTE) return getPetCuteEvolvedImage(pet);
    if (form === EVOLUTION_STYLE_HEROIC) return getVersionedRoleCardAsset(pet.evolvedImage) || getVersionedRoleCardAsset(pet.image);
    if (form === PET_EVOLUTION_FORM_MINI) return getPetMiniEvolutionImage(pet);
    return getVersionedRoleCardAsset(pet.image);
  }

  function getPetEvolutionStageLabel(student, petType = student?.petType) {
    const form = getActivePetEvolutionForm(student, petType);
    if (form === EVOLUTION_STYLE_CUTE) return localize('Q版可爱');
    if (form === EVOLUTION_STYLE_HEROIC) return localize('帅气');
    if (form === PET_EVOLUTION_FORM_MINI) return localize('已完成小进化');
    return localize('进化前');
  }

  function getEquippedItemList(student) {
    const ids = [...new Set(Object.values(student.equippedItems || {}))];
    return ids.map(itemId => EQUIPMENT_CATALOG.find(item => item.id === itemId))
      .filter(item => item && isPetExclusiveItem(item, student.petType));
  }

  function getOwnedItemIds(student, petType = student?.petType) {
    if (!student || !petType) return [];
    const record = ensurePetRecord(student, petType);
    return [...new Set(record?.ownedItems || [])];
  }

  function isPetExclusiveItem(item, petType) {
    return Boolean(item?.exclusivePetId && item.exclusivePetId === petType);
  }

  function getEquippedItemForSlot(student, slot) {
    const direct = EQUIPMENT_CATALOG.find(item => item.id === student.equippedItems?.[slot] && isPetExclusiveItem(item, student.petType));
    if (direct) return direct;
    return getEquippedItemList(student).find(item => item.slot === slot) || null;
  }

  function getCombatState(student) {
    const pet = getPetInfo(student.petType);
    const level = getLevelInfo(student);
    const fallbackStats = { hp: 100, attack: 10, defense: 10, speed: 10, luck: 10 };
    const levelBonus = {
      hp: Math.max(0, level.level - 1) * 5,
      attack: Math.max(0, level.level - 1),
      defense: Math.max(0, level.level - 1),
      speed: Math.floor(Math.max(0, level.level - 1) / 2),
      luck: Math.floor(Math.max(0, level.level - 1) / 2)
    };
    const stats = window.EquipmentEngine.calculateStats(
      pet?.baseStats || fallbackStats,
      levelBonus,
      getEquippedItemList(student),
      { petType: student.petType }
    );
    const multiplier = isPetActiveFinalEvolution(student)
      ? getEvolutionMultiplier(pet)
      : isPetActiveMiniEvolution(student)
        ? getMiniEvolutionMultiplier(pet)
        : 1;
    const finalStats = Object.fromEntries(window.EquipmentEngine.STAT_KEYS.map(key => [key, stats[key] * multiplier]));
    const power = student.petType === 'pikachu' && isPetActiveFinalEvolution(student)
      ? 999999
      : window.EquipmentEngine.calculateCombatPower(finalStats);
    return { stats: finalStats, power };
  }

  function getEquipmentSlotInfo(slot) {
    return (window.EQUIPMENT_SLOTS || []).find(entry => entry.id === slot) || { id: slot, label: slot, icon: '✨' };
  }

  function renderEquipmentGrid(student) {
    const grid = $('#equipment-grid');
    if (!grid) return;
    grid.innerHTML = (window.EQUIPMENT_SLOTS || []).map(slot => {
      const item = getEquippedItemForSlot(student, slot.id);
      const slotLabel = localize(slot.label);
      const itemName = getEquipmentDisplayName(item);
      const aria = item
        ? (currentLanguage === 'en' ? `Equipped ${itemName}` : `${item.name}已装备`)
        : (currentLanguage === 'en' ? `Click to equip owned ${slotLabel}` : `点击装上已拥有${slot.label}装备`);
      const title = item
        ? localize('为了保护进化进度，已装备的物品不能卸下。')
        : (currentLanguage === 'en' ? 'Click to equip owned gear' : '点击会直接装上已拥有的对应装备');
      return `<button type="button" class="equipment-slot${item ? ' has-item equipped-locked' : ''}" data-equipment-slot="${slot.id}" aria-label="${escapeHtml(aria)}" title="${escapeHtml(title)}">${item
        ? `<span class="slot-label">${slot.icon} ${escapeHtml(slotLabel)}</span><img class="slot-image" src="${escapeHtml(withAssetVersion(item.image))}" alt="${escapeHtml(itemName)}" /><span class="slot-name">${escapeHtml(itemName)}</span><span class="slot-action locked">${localize('已装备')}</span>`
        : `<span class="slot-label">${slot.icon} ${escapeHtml(slotLabel)}</span><span class="slot-icon">＋</span><span class="slot-name">${localize('点击装备')}</span>`}</button>`;
    }).join('');
  }

  function getExclusiveSetProgress(student) {
    const setItems = EQUIPMENT_CATALOG.filter(item => item.exclusivePetId === student?.petType);
    const equippedIds = new Set(getEquippedItemList(student).map(item => item.id));
    const equippedSetItems = setItems.filter(item => equippedIds.has(item.id));
    return {
      setItems,
      equippedItems: equippedSetItems,
      count: equippedSetItems.length,
      total: setItems.length || 5,
      complete: setItems.length > 0 && equippedSetItems.length >= setItems.length
    };
  }

  function getMiniEvolutionRequiredCount(required) {
    return Math.max(1, Math.ceil((Number(required) || 1) / 2));
  }

  function getExclusiveItemsForPet(petType) {
    return EQUIPMENT_CATALOG.filter(item => item.exclusivePetId === petType);
  }

  function getMiniStageExclusiveItems(items = []) {
    return items.slice(0, getMiniEvolutionRequiredCount(items.length));
  }

  function isFinalGearUnlocked(student, petType = student?.petType) {
    return Boolean(isPetMiniEvolved(student, petType) || isPetEvolved(student, petType));
  }

  function getVisibleExclusiveItemsForPet(student, petType = student?.petType, items = getExclusiveItemsForPet(petType)) {
    if (!items.length) return [];
    return isFinalGearUnlocked(student, petType) ? items : getMiniStageExclusiveItems(items);
  }

  function getLockedExclusiveItemsForPet(student, petType = student?.petType, items = getExclusiveItemsForPet(petType)) {
    if (!items.length || isFinalGearUnlocked(student, petType)) return [];
    const visibleIds = new Set(getMiniStageExclusiveItems(items).map(item => item.id));
    return items.filter(item => !visibleIds.has(item.id));
  }

  function isExclusiveItemUnlockedForStudent(student, item) {
    if (!student || !item || !isPetExclusiveItem(item, student.petType)) return false;
    return getVisibleExclusiveItemsForPet(student, student.petType)
      .some(visibleItem => visibleItem.id === item.id);
  }

  function getBestOwnedEquipmentForSlot(student, slot) {
    if (!student || !slot) return null;
    const ownedIds = new Set(student.demoMode
      ? EQUIPMENT_CATALOG.map(item => item.id)
      : getOwnedItemIds(student, student.petType));
    if (!ownedIds.size) return null;
    return getVisibleExclusiveItemsForPet(student, student.petType)
      .find(item => item.slot === slot && ownedIds.has(item.id)) || null;
  }

  function getEvolutionProgress(student) {
    const exclusive = getExclusiveSetProgress(student);
    const hasExclusiveSet = exclusive.setItems.length > 0;
    const required = hasExclusiveSet ? exclusive.total : 5;
    const equippedCount = hasExclusiveSet ? exclusive.count : getEquippedItemList(student).length;
    const miniRequired = getMiniEvolutionRequiredCount(required);
    const miniAlreadyEvolved = isPetMiniEvolved(student);
    const unlockedForms = getUnlockedPetEvolutionForms(student);
    const finalRouteOptions = getFinalPetEvolutionForms(student?.petType);
    const finalRoutesUnlocked = finalRouteOptions.filter(form => unlockedForms.includes(form));
    const allFinalRoutesUnlocked = finalRoutesUnlocked.length >= finalRouteOptions.length;
    return {
      ...exclusive,
      hasExclusiveSet,
      mode: hasExclusiveSet ? 'exclusive' : 'any-five',
      count: Math.min(required, equippedCount),
      required,
      total: required,
      miniRequired,
      miniComplete: equippedCount >= miniRequired,
      miniAlreadyEvolved,
      finalReady: miniAlreadyEvolved && equippedCount >= required,
      complete: equippedCount >= required,
      alreadyEvolved: isPetEvolved(student),
      unlockedForms,
      finalRoutesUnlocked,
      finalRouteOptions,
      finalRouteTotal: finalRouteOptions.length,
      allFinalRoutesUnlocked
    };
  }

  function syncEvolutionState(student) {
    const progress = getEvolutionProgress(student);
    student.miniEvolutionReady = progress.miniComplete && !progress.miniAlreadyEvolved;
    student.evolutionReady = progress.finalReady && !progress.allFinalRoutesUnlocked;
    student.exclusiveEvolutionReady = progress.hasExclusiveSet && progress.finalReady && !progress.allFinalRoutesUnlocked;
    return progress;
  }

  function syncExclusiveEvolutionState(student) {
    return syncEvolutionState(student);
  }

  function getPetEvolutionFormMeta(form) {
    const metas = {
      [PET_EVOLUTION_FORM_ORIGINAL]: {
        label: currentLanguage === 'en' ? 'Original' : '原始',
        hint: currentLanguage === 'en' ? 'First form' : '最初形态',
        readyLabel: currentLanguage === 'en' ? 'Switch' : '切换'
      },
      [PET_EVOLUTION_FORM_MINI]: {
        label: currentLanguage === 'en' ? 'Advanced' : '进阶',
        hint: currentLanguage === 'en' ? `Mini evolution · ${MINI_EVOLUTION_COIN_COST} coins` : `小进化 · ${MINI_EVOLUTION_COIN_COST}金币`,
        readyLabel: currentLanguage === 'en' ? 'Unlock' : '解锁'
      },
      [EVOLUTION_STYLE_CUTE]: {
        label: currentLanguage === 'en' ? 'Cute Evolution' : '可爱进化',
        hint: currentLanguage === 'en' ? `Final route · ${FINAL_EVOLUTION_COIN_COST} coins` : `最终路线 · ${FINAL_EVOLUTION_COIN_COST}金币`,
        readyLabel: currentLanguage === 'en' ? 'Unlock' : '解锁'
      },
      [EVOLUTION_STYLE_HEROIC]: {
        label: currentLanguage === 'en' ? 'Heroic Evolution' : '帅气进化',
        hint: currentLanguage === 'en' ? `Final route · ${FINAL_EVOLUTION_COIN_COST} coins` : `最终路线 · ${FINAL_EVOLUTION_COIN_COST}金币`,
        readyLabel: currentLanguage === 'en' ? 'Unlock' : '解锁'
      }
    };
    return metas[form] || metas[PET_EVOLUTION_FORM_ORIGINAL];
  }

  function getPetEvolutionFormLockedReason(form, progress = getEvolutionProgress(getStudent())) {
    if (form === PET_EVOLUTION_FORM_MINI) {
      if (!progress.miniComplete) return currentLanguage === 'en' ? `Equip ${progress.miniRequired} gear first` : `先装备 ${progress.miniRequired} 件`;
      return currentLanguage === 'en' ? `${MINI_EVOLUTION_COIN_COST} coins` : `${MINI_EVOLUTION_COIN_COST}金币`;
    }
    if (isFinalEvolutionForm(form)) {
      if (!progress.miniAlreadyEvolved) return currentLanguage === 'en' ? 'Mini first' : '先小进化';
      if (!progress.finalReady) return currentLanguage === 'en' ? `Collect ${progress.required} gear` : `先收集 ${progress.required} 件装备`;
      return currentLanguage === 'en' ? `${FINAL_EVOLUTION_COIN_COST} coins` : `${FINAL_EVOLUTION_COIN_COST}金币`;
    }
    return '';
  }

  function renderPetEvolutionFormControls(student, progress = getEvolutionProgress(student)) {
    if (!student?.petType) return '';
    const activeForm = getActivePetEvolutionForm(student);
    const unlocked = new Set(getUnlockedPetEvolutionForms(student));
    const buttons = getAvailablePetEvolutionForms(student.petType).map(form => {
      const meta = getPetEvolutionFormMeta(form);
      const isUnlocked = unlocked.has(form);
      const isActive = activeForm === form;
      const canUnlockMini = form === PET_EVOLUTION_FORM_MINI && progress.miniComplete;
      const canUnlockFinal = isFinalEvolutionForm(form) && progress.finalReady;
      const canPress = isUnlocked || canUnlockMini || canUnlockFinal;
      const isFinalReadyToUnlock = isFinalEvolutionForm(form) && canUnlockFinal && !isUnlocked;
      const routeClass = form === EVOLUTION_STYLE_CUTE
        ? ' cute-route'
        : form === EVOLUTION_STYLE_HEROIC
          ? ' heroic-route'
          : '';
      const stateLabel = isActive
        ? (currentLanguage === 'en' ? 'Selected' : '已选择')
        : isUnlocked
          ? meta.readyLabel
          : getPetEvolutionFormLockedReason(form, progress);
      return `<button type="button" class="pet-form-button${routeClass}${isActive ? ' active' : ''}${isUnlocked ? ' unlocked' : ' locked'}${isFinalReadyToUnlock ? ' evolution-ready' : ''}" data-pet-evolution-form="${escapeHtml(form)}" aria-pressed="${isActive ? 'true' : 'false'}" ${canPress ? '' : 'disabled'}>
        <strong>${escapeHtml(meta.label)}</strong>
        <small>${escapeHtml(stateLabel)}</small>
      </button>`;
    }).join('');
    return `<div class="pet-form-selector" role="group" aria-label="${escapeHtml(currentLanguage === 'en' ? 'Pet form selector' : '宠物形态选择')}">${buttons}</div>`;
  }

  async function refreshActiveInteractionRoomPetAppearance() {
    if (!hasActiveInteractionRoom()) return false;
    const student = getStudent();
    if (!student || !kuromiRoomDemoState?.player) return false;
    const map = getKuromiRoomActiveMap(kuromiRoomDemoState) || getKuromiRoomMap(0);
    syncKuromiRoomPlayerPetProfile(kuromiRoomDemoState.player, student.petType, map.groundY || KUROMI_ROOM_DEMO.fallbackGroundY);
    kuromiRoomDemoState.spriteProfile = getKuromiRoomSpriteProfile(student);
    interactionRoomState.lastHeartbeatPayload = '';
    renderInteractionRoomActiveUi(student);
    return sendInteractionRoomHeartbeat({ silent: true });
  }

  async function selectPetEvolutionForm(form, triggerButton = null) {
    const student = getStudent();
    if (!student?.petType) return false;
    const safeForm = normalizePetEvolutionFormForPet(form, student.petType);
    if (!safeForm) return false;
    const petType = student.petType;
    const pet = getPetInfo(petType);
    const record = ensurePetRecord(student, petType);
    const progress = syncEvolutionState(student);
    if (!hasUnlockedPetEvolutionForm(student, petType, safeForm)) {
      if (safeForm === PET_EVOLUTION_FORM_MINI) {
        if (!progress.miniComplete) {
          showToast(progress.hasExclusiveSet ? `还需要装备至少 ${progress.miniRequired} 件专属装备才可以小进化。` : `还需要装备至少 ${progress.miniRequired} 个不同部位才可以小进化。`);
          return false;
        }
        if (!student.demoMode && Math.max(0, Math.floor(Number(student.coins || 0))) < MINI_EVOLUTION_COIN_COST) {
          showButtonInlineError(triggerButton, '金币不足');
          return false;
        }
        return miniEvolvePet(triggerButton);
      }
      if (isFinalEvolutionForm(safeForm)) {
        if (!progress.miniAlreadyEvolved) {
          showToast(localize('必须先完成小进化，才可以开放最终进化。'));
          return false;
        }
        if (!progress.finalReady) {
          showToast(progress.hasExclusiveSet ? `还没有集齐对应角色的 ${progress.required} 件专属装备。` : `还需要装备满 ${progress.required} 个不同部位的装备。`);
          return false;
        }
        if (!student.demoMode && Math.max(0, Math.floor(Number(student.coins || 0))) < FINAL_EVOLUTION_COIN_COST) {
          showButtonInlineError(triggerButton, '金币不足');
          return false;
        }
        return evolvePet(safeForm, triggerButton);
      }
    }
    if (!record) return false;
    const activeForm = getActivePetEvolutionForm(student, petType);
    if (activeForm === safeForm) {
      showToast(`${getPetFullDisplayName(student) || pet?.name || '宠物'}已经是这个形态。`);
      return true;
    }
    const before = getCombatState(student);
    const snapshot = cloneStudentState(student);
    record.activeEvolutionForm = safeForm;
    if (isFinalEvolutionForm(safeForm)) {
      record.evolutionStyle = safeForm;
      student.evolutionStylePreference = safeForm;
    }
    student.activeEvolutionForm = syncPetEvolutionFormState(student, petType);
    syncActivePetRecord(student);
    syncEvolutionState(student);
    const after = getCombatState(student);
    const saved = await commitStudentState(student, snapshot, { type: 'selectEvolutionForm', petId: petType, activeEvolutionForm: safeForm }, () => {
      renderedCombatState = { studentId: null, stats: null, power: null };
      renderAppShell();
      renderActiveStudentView();
      if (before.power !== after.power) showPowerFeedback(before, after, '形态切换！');
    });
    if (!saved) return false;
    await refreshActiveInteractionRoomPetAppearance();
    showToast(`${getPetFullDisplayName(student) || pet?.name || '宠物'}已切换到${getPetEvolutionStageLabel(student)}。`);
    return true;
  }

  function renderExclusiveSetStatus(student) {
    const target = $('#exclusive-set-status');
    if (!target) return;
    const progress = getEvolutionProgress(student);
    const evolved = progress.alreadyEvolved;
    const setName = progress.hasExclusiveSet
      ? (currentLanguage === 'en'
        ? `${progress.setItems[0].exclusivePetName || getPetInfo(student.petType)?.name || 'Pet'} Exclusive Set`
        : progress.setItems[0].exclusiveSetName)
      : '';
    const title = evolved
      ? (currentLanguage === 'en' ? '🌟 Pet Evolved!' : '🌟 宠物已经进化！')
      : progress.hasExclusiveSet
        ? `${setName}: ${progress.count} / ${progress.required}`
        : (currentLanguage === 'en' ? `Any Gear Evolution: ${progress.count} / ${progress.required}` : `任意装备进化：${progress.count} / ${progress.required}`);
    const waitingForMiniEvolution = !evolved && progress.complete && !progress.miniAlreadyEvolved;
    const copy = evolved
      ? (currentLanguage === 'en'
        ? `This pet has entered its ${getPetEvolutionStyle(student) === EVOLUTION_STYLE_CUTE ? 'cute Q-style' : 'heroic awakened'} final form.`
        : `当前宠物已经完成${getPetEvolutionStyle(student) === EVOLUTION_STYLE_CUTE ? 'Q版可爱' : '帅气'}最终进化。`)
      : waitingForMiniEvolution
        ? (currentLanguage === 'en'
          ? `The full gear set is ready, but mini evolution must be completed first. Mini evolution costs ${MINI_EVOLUTION_COIN_COST} coins.`
          : `已经收齐全套装备，但必须先完成小进化（${MINI_EVOLUTION_COIN_COST} 金币），才会开放最终进化。`)
      : progress.hasExclusiveSet
        ? (currentLanguage === 'en'
          ? `Equip ${progress.miniRequired} exclusive gear items for mini evolution (${MINI_EVOLUTION_COIN_COST} coins), then all ${progress.required} for final evolution (${FINAL_EVOLUTION_COIN_COST} coins).`
          : `装备 ${progress.miniRequired} 件专属装备可小进化（${MINI_EVOLUTION_COIN_COST} 金币），收齐 ${progress.required} 件可最终进化（${FINAL_EVOLUTION_COIN_COST} 金币）。`)
        : (currentLanguage === 'en'
          ? `Equip ${progress.miniRequired} different gear slots for mini evolution (${MINI_EVOLUTION_COIN_COST} coins), then ${progress.required} for final evolution (${FINAL_EVOLUTION_COIN_COST} coins).`
          : `装备 ${progress.miniRequired} 个不同部位可小进化（${MINI_EVOLUTION_COIN_COST} 金币），装备 ${progress.required} 个可最终进化（${FINAL_EVOLUTION_COIN_COST} 金币）。`);
    const status = evolved
      ? (currentLanguage === 'en' ? 'Final Evolution' : '最终进化')
      : progress.finalReady
        ? (currentLanguage === 'en' ? `✨ Final Ready · ${FINAL_EVOLUTION_COIN_COST} coins` : `✨ 最终进化达成 · ${FINAL_EVOLUTION_COIN_COST} 金币`)
        : waitingForMiniEvolution
          ? (currentLanguage === 'en' ? '⚡ Mini First' : '⚡ 先小进化')
        : progress.miniAlreadyEvolved
          ? (currentLanguage === 'en' ? 'Mini Evolved' : '已完成小进化')
          : progress.miniComplete
            ? (currentLanguage === 'en' ? `⚡ Mini Ready · ${MINI_EVOLUTION_COIN_COST} coins` : `⚡ 小进化达成 · ${MINI_EVOLUTION_COIN_COST} 金币`)
            : (currentLanguage === 'en' ? 'Half-set Mini Evolution' : '半套小进化');
    target.innerHTML = `<div class="exclusive-set-status${progress.finalReady || evolved ? ' complete' : ''}">
      <div class="exclusive-set-heading"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(status)}</span></div>
      <p>${escapeHtml(copy)}</p>
      <div class="exclusive-set-progress"><span><i style="width:${Math.min(100, (progress.count / progress.required) * 100)}%"></i></span><b>${Math.min(progress.required, progress.count)}/${progress.required}</b></div>
    </div>`;
  }

  function renderPetExclusiveShop(student) {
    const panel = $('#pet-exclusive-shop-panel');
    const list = $('#pet-exclusive-shop-grid');
    const count = $('#pet-exclusive-shop-count');
    if (!list || !count) return;
    const pet = getPetInfo(student?.petType);
    const exclusiveItems = pet ? getExclusiveItemsForPet(student.petType) : [];
    if (!pet) {
      if (panel) panel.hidden = false;
      count.textContent = currentLanguage === 'en' ? '0 items' : '0 件';
      list.innerHTML = '<div class="empty-state owned-equipment-empty"><strong>请先选择当前宠物</strong><p>选择宠物后，这里只会显示它自己的专属装备。</p></div>';
      return;
    }
    if (!exclusiveItems.length) {
      if (panel) panel.hidden = true;
      list.innerHTML = '';
      return;
    }

    const ownedIds = new Set(getOwnedItemIds(student));
    const allOwned = exclusiveItems.every(item => student.demoMode || ownedIds.has(item.id));
    if (allOwned) {
      if (panel) panel.hidden = true;
      count.textContent = currentLanguage === 'en' ? 'Complete' : '已买齐';
      list.innerHTML = '';
      return;
    }
    if (panel) panel.hidden = false;
    const visibleItems = getVisibleExclusiveItemsForPet(student, student.petType, exclusiveItems);
    const lockedItems = getLockedExclusiveItemsForPet(student, student.petType, exclusiveItems);
    const remainingItems = visibleItems.filter(item => !(student.demoMode || ownedIds.has(item.id)));
    const stageLocked = lockedItems.length > 0;
    count.textContent = stageLocked
      ? (currentLanguage === 'en' ? `${remainingItems.length} mini gear left` : `小进化前 ${remainingItems.length} 件`)
      : (currentLanguage === 'en' ? `${remainingItems.length} left` : `还剩 ${remainingItems.length} 件`);
    if (!remainingItems.length) {
      count.textContent = stageLocked
        ? (currentLanguage === 'en' ? 'Mini evolve next' : '等待小进化')
        : (currentLanguage === 'en' ? 'Complete' : '已买齐');
      list.innerHTML = stageLocked
        ? `<div class="empty-state owned-equipment-empty"><strong>${escapeHtml(localize('前半套装备已买齐'))}</strong><p>${escapeHtml(localize(`完成小进化后，会开放剩下 ${lockedItems.length} 件终极进化装备。`))}</p></div>`
        : `<div class="empty-state owned-equipment-empty"><strong>${escapeHtml(localize('阶段装备已买齐'))}</strong><p>${escapeHtml(localize('继续装备和培养，就可以推动下一次进化。'))}</p></div>`;
      return;
    }
    list.innerHTML = `${remainingItems.map(item => {
      const owned = student.demoMode || ownedIds.has(item.id);
      const equipped = getEquippedItemForSlot(student, item.slot)?.id === item.id;
      const slotInfo = getEquipmentSlotInfo(item.slot);
      const itemName = getEquipmentDisplayName(item);
      const slotLabel = localize(slotInfo.label);
      const itemDescription = getEquipmentDisplayDescription(item);
      const action = owned
        ? (equipped
          ? `<span class="equipped-lock-badge" aria-label="${escapeHtml(localize('装备已锁定'))}">${localize('已装备')}</span>`
          : `<button type="button" class="primary-button owned-equipment-action" data-equip-item="${item.id}">${localize('装备')}</button>`)
        : `<button type="button" class="primary-button owned-equipment-action" data-buy-item="${item.id}">${localize('购买并装备')}</button>`;
      const status = owned
        ? (student.demoMode ? localize('Demo 已拥有 · 当前宠物专属') : equipped ? localize('已装备 · 已锁定，不能卸下') : localize('尚未装备 · 当前宠物专属'))
        : localize('购买后只归当前宠物使用');
      return `<article class="owned-equipment-card pet-exclusive-equipment-card${equipped ? ' equipped' : ''}" data-pet-exclusive-item="${item.id}">
        <div class="owned-equipment-art"><img src="${escapeHtml(withAssetVersion(item.image))}" alt="${escapeHtml(itemName)}" loading="lazy" decoding="async" /></div>
        <div class="owned-equipment-info"><span class="owned-equipment-slot">${slotInfo.icon} ${escapeHtml(slotLabel)} · ${escapeHtml(pet.name)}${currentLanguage === 'en' ? ' Exclusive' : '专属'}</span><strong>${escapeHtml(itemName)}</strong><small>${escapeHtml(itemDescription || status)}<br />${escapeHtml(status)}</small></div>
        <div class="pet-exclusive-action"><span class="pet-exclusive-price">${student.demoMode ? '🧪 Demo' : `🪙 ${item.price}`}</span>${action}</div>
      </article>`;
    }).join('')}${stageLocked ? `<div class="exclusive-gear-lock-note">${escapeHtml(localize(`完成小进化后，会开放剩下 ${lockedItems.length} 件终极进化装备。`))}</div>` : ''}`;
  }

  function renderOwnedEquipment(student) {
    const panel = $('#owned-equipment-panel');
    const list = $('#owned-equipment-list');
    const count = $('#owned-equipment-count');
    if (!list || !count) return;
    if (panel) panel.hidden = false;
    const ownedItems = (student.demoMode ? EQUIPMENT_CATALOG : getOwnedItemIds(student)
      .map(itemId => EQUIPMENT_CATALOG.find(item => item.id === itemId))
      .filter(item => item && isPetExclusiveItem(item, student.petType)))
      .filter(item => isPetExclusiveItem(item, student.petType));
    count.textContent = currentLanguage === 'en' ? `${ownedItems.length} items` : `${ownedItems.length} 件`;
    if (!ownedItems.length) {
      list.innerHTML = `<div class="empty-state owned-equipment-empty compact-owned-empty"><strong>${escapeHtml(localize('当前宠物还没有已拥有装备'))}</strong><p>${escapeHtml(localize('购买专属装备或开启盲盒后，装备会出现在这里。'))}</p></div>`;
      return;
    }
    list.innerHTML = ownedItems.map(item => {
      const equipped = getEquippedItemForSlot(student, item.slot)?.id === item.id;
      const slotInfo = getEquipmentSlotInfo(item.slot);
      const itemName = getEquipmentDisplayName(item);
      const slotLabel = localize(slotInfo.label);
      const status = equipped ? localize('已装备 · 已锁定，不能卸下') : localize('已购买 · 点击装备');
      const action = equipped
        ? `<span class="equipped-lock-badge">${localize('已装备')}</span>`
        : `<button type="button" class="primary-button owned-equipment-action" data-equip-item="${item.id}">${localize('装备')}</button>`;
      return `<article class="owned-equipment-card${equipped ? ' equipped' : ''}">
        <div class="owned-equipment-art"><img src="${escapeHtml(withAssetVersion(item.image))}" alt="${escapeHtml(itemName)}" loading="lazy" decoding="async" /></div>
        <div class="owned-equipment-info"><span class="owned-equipment-slot">${slotInfo.icon} ${escapeHtml(slotLabel)}${item.exclusivePetName ? ` · ${escapeHtml(item.exclusivePetName)}${currentLanguage === 'en' ? ' Exclusive' : '专属'}` : ''}</span><strong>${escapeHtml(itemName)}</strong><small>${escapeHtml(status)}</small></div>
        ${action}
      </article>`;
    }).join('');
  }

  function renderEquipmentSlot(target, slot, item) {
    if (!target) return;
    const itemName = getEquipmentDisplayName(item);
    target.classList.toggle('has-item', Boolean(item));
    target.innerHTML = item
      ? `<span class="slot-label">${slot === 'left' ? localize('左装备格') : localize('右装备格')}</span><img class="slot-image" src="${escapeHtml(withAssetVersion(item.image))}" alt="${escapeHtml(itemName)}" /><span class="slot-name">${escapeHtml(itemName)}</span>`
      : `<span class="slot-label">${slot === 'left' ? localize('左装备格') : localize('右装备格')}</span><span class="slot-icon">＋</span><span class="slot-name">${localize('点击去装备')}</span>`;
  }

  function renderStatsSummary(stats, previousStats, petType = '') {
    const statMeta = {
      hp: ['❤️', '生命'],
      attack: ['⚔️', '攻击'],
      defense: ['🛡️', '防御'],
      speed: ['💨', '速度'],
      luck: ['🍀', '幸运']
    };
    $('#stats-summary').innerHTML = window.EquipmentEngine.STAT_KEYS.map(key => {
      const [icon, label] = statMeta[key];
      const delta = previousStats ? Number(stats[key]) - Number(previousStats[key]) : 0;
      const changeClass = delta > 0 ? 'stat-up' : delta < 0 ? 'stat-down' : '';
      return `<div class="attribute-chip ${changeClass}"><span>${icon}</span><strong>${formatStatValue(key, stats[key], petType)}</strong><small>${localize(label)}</small></div>`;
    }).join('');
  }

  function formatStatValue(key, value, petType = '') {
    if (key === 'speed' && petType === 'enderman' && Number(value) >= 999) return '∞';
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return '0';
    if (Math.abs(numericValue) >= 100) return String(Math.round(numericValue));
    const rounded = Math.round((numericValue + Number.EPSILON) * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }

  function updateCombatPowerDisplay(power, previousPower) {
    const display = $('#combat-power-display');
    const number = $('#combat-power');
    if (!display || !number) return;
    if (previousPower === null || previousPower === undefined || previousPower === power) {
      number.textContent = String(power);
      return;
    }
    display.classList.remove('power-jump');
    void display.offsetWidth;
    display.classList.add('power-jump');
    animateNumber(number, previousPower, power);
  }

  function animateNumber(element, from, to) {
    const startedAt = performance.now();
    const duration = 520;
    const step = now => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(from + (to - from) * eased));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }

  function getRarityInfo(rarityId) {
    return PET_RARITIES.find(rarity => rarity.id === rarityId) || PET_RARITIES[0];
  }

  function getPetEmoji(petType, rarity, level) {
    const selectedPet = getPetInfo(petType) || INITIAL_PETS.find(pet => pet.id === petType);
    if (selectedPet) return selectedPet.icon;
    if (level >= 5 || rarity === 'LEGEND') return '🐉';
    if (level >= 4 || rarity === 'SSR') return '🦊';
    if (level >= 3 || rarity === 'SR') return '🐯';
    if (level >= 2 || rarity === 'R') return '🐶';
    return '🐱';
  }

  function getTodayCheckins(student, date = getDateKey()) {
    return (student?.checkins || []).filter(record => record.date === date);
  }

  function getTodaySubjectRecords(student, date = getDateKey()) {
    return new Map(getTodayCheckins(student, date).map(record => [record.subject, record]));
  }

  function getTodayCheckinProgress(student, date = getDateKey()) {
    const todayRecords = getTodaySubjectRecords(student, date);
    const subjectCount = Object.keys(SUBJECT_META).length;
    return {
      completed: Math.min(subjectCount, todayRecords.size),
      total: subjectCount,
      remaining: Math.max(0, subjectCount - todayRecords.size)
    };
  }

  function isCompleteStudyDay(student, date = getDateKey()) {
    const completed = getTodaySubjectRecords(student, date);
    return Object.keys(SUBJECT_META).every(subject => completed.has(subject));
  }

  function getCompletedStudyDayCount(student) {
    const dates = new Set((student?.checkins || []).map(record => record.date));
    return [...dates].filter(date => isCompleteStudyDay(student, date)).length;
  }

  function renderCheckin() {
    const student = getStudent();
    if (!student) return;
    const target = $('#checkin-content');
    const today = getDateKey();
    const todayRecords = getTodaySubjectRecords(student, today);
    const completedCount = todayRecords.size;
    const totalSubjects = Object.keys(SUBJECT_META).length;
    if (completedCount >= totalSubjects && !session.quiz) {
      const records = [...todayRecords.values()];
      const totalScore = records.reduce((sum, record) => sum + record.score, 0);
      const totalPossible = records.reduce((sum, record) => sum + record.total, 0);
      const totalCoins = records.reduce((sum, record) => sum + record.coinsEarned, 0);
      target.innerHTML = `
        <div class="done-card">
          <div class="result-icon">🎉</div>
          <p class="eyebrow">FIVE SUBJECTS COMPLETE</p>
          <h3>今天五科打卡全部完成啦！</h3>
          <p class="muted-text">BM、BC、BI、SC、MM 都完成了，宠物收到了一整天的学习能量。</p>
          <div class="reward-row">
            <span class="reward-pill">⭐ ${totalScore}/${totalPossible} 分</span>
            <span class="reward-pill">🪙 +${totalCoins} 金币</span>
          </div>
          <button type="button" class="primary-button" data-view-target="home-view">回到我的宠物 →</button>
        </div>`;
      return;
    }
    if (APP_CONFIG.enforceHolidayWindow && !isHolidayOpen()) {
      target.innerHTML = `<div class="empty-state"><div class="result-icon">🌤️</div><h3>假期打卡还没有开放</h3><p>开放日期：${formatDate(APP_CONFIG.holidayStart)} 至 ${formatDate(APP_CONFIG.holidayEnd)}</p></div>`;
      return;
    }
    if (session.quiz) {
      renderQuiz(target);
      return;
    }
    target.innerHTML = `
      <div class="checkin-card">
        <div class="checkin-day-progress"><strong>今日五科进度：${completedCount} / ${totalSubjects}</strong><span>每科每天完成一次，可获得金币</span></div>
        <div class="subject-grid">
          ${Object.entries(SUBJECT_META).map(([subject, meta]) => {
            const record = todayRecords.get(subject);
            return record
              ? `<div class="subject-card is-complete" aria-label="${escapeHtml(subject)} 已完成"><span class="subject-icon">✅</span><strong>${escapeHtml(subject)}</strong><small>已完成 · ${record.score}/${record.total}</small></div>`
              : `<button type="button" class="subject-card" data-subject="${escapeHtml(subject)}"><span class="subject-icon">${meta.icon}</span><strong>${escapeHtml(subject)}</strong><small>${escapeHtml(meta.hint)}</small></button>`;
          }).join('')}
        </div>
      </div>`;
  }

  function renderQuiz(target) {
    const quiz = session.quiz;
    const question = quiz.questions[quiz.index];
    const percent = ((quiz.index) / quiz.questions.length) * 100;
    target.innerHTML = `
      <div class="quiz-wrap">
        <div class="quiz-topline"><span>${escapeHtml(quiz.subject)} · 今日挑战</span><span>第 ${quiz.index + 1} / ${quiz.questions.length} 题</span></div>
        <div class="quiz-progress"><div style="width:${percent}%"></div></div>
        <article class="question-card">
          <div class="question-number">QUESTION ${String(quiz.index + 1).padStart(2, '0')}</div>
          <h3>${escapeHtml(question.text)}</h3>
          <div class="options-list">
            ${question.options.map((option, index) => `
              <label class="option-label" data-option-label="${index}">
                <input type="radio" name="quiz-option" value="${escapeHtml(option)}" />
                <span>${String.fromCharCode(65 + index)}.</span>
                <strong>${escapeHtml(option)}</strong>
              </label>`).join('')}
          </div>
          <div id="question-feedback" class="feedback" aria-live="polite"></div>
          <div class="quiz-actions"><button id="submit-answer" type="button" class="primary-button">确认答案</button></div>
        </article>
      </div>`;
  }

  function startQuiz(subject) {
    const questions = (QUESTION_BANK[subject] || []).slice(0, 5).map(question => ({ ...question }));
    session.quiz = { subject, questions, index: 0, correct: 0, totalStars: 0, answers: [], startedAt: Date.now(), attempts: 0 };
    renderCheckin();
  }

  function submitAnswer() {
    const quiz = session.quiz;
    if (!quiz) return;
    const question = quiz.questions[quiz.index];
    const selected = document.querySelector('input[name="quiz-option"]:checked');
    const feedback = $('#question-feedback');
    if (!selected) {
      feedback.className = 'feedback retry';
      feedback.textContent = '先选择一个答案，再按确认答案哦。';
      return;
    }
    quiz.attempts += 1;
    const isCorrect = selected.value === question.answer;
    const label = selected.closest('.option-label');
    if (isCorrect) {
      const stars = quiz.attempts === 1 ? 3 : quiz.attempts === 2 ? 2 : 1;
      quiz.correct += 1;
      quiz.totalStars += stars;
      quiz.answers.push({ questionId: question.id, answer: selected.value, correct: true, attempts: quiz.attempts, stars });
      label.classList.add('is-correct');
      document.querySelectorAll('input[name="quiz-option"]').forEach(input => { input.disabled = true; });
      feedback.className = 'feedback good';
      feedback.textContent = `答对了！获得 ${stars} 颗星星。`;
      const submitButton = $('#submit-answer');
      submitButton.textContent = quiz.index === quiz.questions.length - 1 ? '查看今日成果' : '下一题';
      submitButton.dataset.quizAdvance = 'true';
    } else {
      label.classList.add('is-wrong');
      feedback.className = 'feedback retry';
      feedback.textContent = '再试试看！答案还没有揭晓，想一想再选一次。';
      selected.checked = false;
    }
  }

  async function nextQuestion() {
    const quiz = session.quiz;
    if (!quiz) return;
    if (quiz.index < quiz.questions.length - 1) {
      quiz.index += 1;
      quiz.attempts = 0;
      renderCheckin();
    } else {
      await finishQuiz();
    }
  }

  async function finishQuiz() {
    const student = getStudent();
    const quiz = session.quiz;
    if (!student || !quiz) return;
    const today = getDateKey();
    const todayRecords = getTodaySubjectRecords(student, today);
    if (todayRecords.has(quiz.subject)) {
      session.quiz = null;
      renderAppShell();
      switchView('checkin-view');
      showToast(`${quiz.subject} 今天已经完成过了。`);
      return;
    }

    const snapshot = cloneStudentState(student);
    const quizSnapshot = cloneStudentState(quiz);
    const subjectCoins = ECONOMY_CONFIG.dailySubjectCoins;
    student.coins += subjectCoins;
    student.totalStars += quiz.totalStars;
    const level = getLevelInfo(student);

    const record = {
      recordId: `local-${student.studentId}-${today}-${quiz.subject}`,
      studentId: student.studentId,
      date: today,
      subject: quiz.subject,
      score: quiz.correct,
      total: quiz.questions.length,
      totalStars: quiz.totalStars,
      coinsEarned: subjectCoins,
      experienceEarned: 0,
      levelBefore: level.level,
      levelAfter: level.level,
      durationSeconds: Math.round((Date.now() - quiz.startedAt) / 1000),
      answers: quiz.answers
    };
    student.checkins.unshift(record);

    const fullDayJustCompleted = isCompleteStudyDay(student, today) && student.lastCheckinDate !== today;
    let completeDayBonusCoins = 0;
    let streakBonusCoins = 0;
    if (fullDayJustCompleted) {
      const previousDate = student.lastCheckinDate;
      const yesterday = getDateKey(new Date(Date.now() - 86400000));
      student.streak = Number(student.streak) || 0;
      student.streak = previousDate === yesterday ? student.streak + 1 : 1;
      student.lastCheckinDate = today;
      completeDayBonusCoins = ECONOMY_CONFIG.completeDayBonusCoins;
      streakBonusCoins = student.streak % ECONOMY_CONFIG.completeDayStreakDays === 0
        ? ECONOMY_CONFIG.completeDayStreakBonusCoins
        : 0;
      student.coins += completeDayBonusCoins + streakBonusCoins;
      record.coinsEarned += completeDayBonusCoins + streakBonusCoins;
    }

    saveDatabase();
    const dayMessage = fullDayJustCompleted
      ? ` 五科完成奖励 +${completeDayBonusCoins + streakBonusCoins} 金币。`
      : '';
    try {
      if (!student.demoMode && isGasBackend()) {
        const result = await backend.submitCheckin(record, student);
        if (!result.ok) throw new Error(result.error || '云端保存失败');
        try {
          const latest = await backend.getStudent(student.studentId, { includeClasses: false });
          if (latest.ok && latest.student) {
            database[student.studentId] = HolidayBackendClient.normalizeStudent(latest.student, latest.classes || [], student);
          }
        } catch (syncError) {
          console.info('Check-in saved, but latest student sync failed.', syncError);
        }
      }
      session.quiz = null;
      saveDatabase();
      renderAppShell();
      switchView('checkin-view');
      showToast(`「${quiz.subject}」完成！宠物获得了 ${record.coinsEarned} 枚金币。${dayMessage}`);
    } catch (error) {
      database[snapshot.studentId] = snapshot;
      session.quiz = quizSnapshot;
      saveDatabase();
      renderCheckin();
      showToast(`保存到云端失败，刚才的打卡没有完成：${error.message || error}`);
    }
  }

  function renderShop() {
    const student = getStudent();
    if (!student) return;
    const shopCoinCount = $('#shop-coin-count');
    if (shopCoinCount) shopCoinCount.textContent = student.demoMode ? '∞' : student.coins;
    renderPetShop(student);
    const legacyGrid = $('#shop-grid');
    if (legacyGrid) legacyGrid.innerHTML = '';
  }

  function getStatLabel(key) {
    return ({ hp: '生命', attack: '攻击', defense: '防御', speed: '速度', luck: '幸运' })[key] || key;
  }

  function getPetCollectionStatus(student, petType) {
    const pet = getPetInfo(petType);
    const record = ensurePetRecord(student, petType) || {};
    const active = petType === student.petType;
    const evolved = isPetActiveFinalEvolution(student, petType);
    const everEvolved = isPetEvolved(student, petType) || Boolean(record.evolved);
    const level = evolved
      ? getMaxLevelInfo()
      : active
        ? getLevelInfo(student)
        : (isPetMiniEvolved(student, petType)
          ? { level: 50, current: 1, total: 1, required: 1, max: false, stage: 'mini' }
          : { level: 1, current: 0, total: 0, required: 1, max: false, stage: 'base' });
    const equippedItems = active ? (student.equippedItems || {}) : (record.equippedItems || {});
    const equippedIds = new Set(Object.values(equippedItems).filter(Boolean));
    const exclusiveItems = EQUIPMENT_CATALOG.filter(item => item.exclusivePetId === petType);
    const matchingExclusiveCount = exclusiveItems.filter(item => equippedIds.has(item.id)).length;
    const hasExclusiveSet = exclusiveItems.length > 0;
    const required = hasExclusiveSet ? exclusiveItems.length : 5;
    const equipmentCount = hasExclusiveSet ? matchingExclusiveCount : equippedIds.size;
	    const complete = equipmentCount >= required;
	    const miniEvolved = isPetMiniEvolved(student, petType);
	    const speciesName = getPetSpeciesNameForStudent(student, petType);
	    return {
	      pet,
	      displayName: formatPetDisplayName(record.petName || pet.name, speciesName),
	      speciesName,
	      birthday: record.birthday || '',
		      active,
		      evolved,
          everEvolved,
		      miniEvolved,
	      displayImage: getPetRecordDisplayImage(student, petType),
	      evolutionStageLabel: getPetEvolutionStageLabel(student, petType),
	      displayRarity: getDisplayRarity(student, petType, record.rarity),
	      level,
      equipmentCount: Math.min(required, equipmentCount),
      required,
      complete,
      hasExclusiveSet,
      matchingExclusiveCount,
      record
    };
  }

  function getOwnedPetHeroPoolGroups(student = getStudent()) {
    if (!student) return [];
    const activePetId = String(student.petType || '');
    const ownedIds = Array.from(new Set([
      activePetId,
      ...(Array.isArray(student.ownedPets) ? student.ownedPets : [])
    ].filter(Boolean))).filter(petId => student.demoMode || petId === activePetId || isPetOwnedByStudent(student, petId));
    const ownedById = new Set(ownedIds);
    const groups = PET_SERIES_GROUPS
      .filter(series => series.id !== 'all')
      .map(series => ({
        series,
        pets: getPetSeriesPets(series.id).filter(pet => ownedById.has(pet.id))
      }))
      .filter(group => group.pets.length);
    const groupedPetIds = new Set(groups.flatMap(group => group.pets.map(pet => pet.id)));
    const ungrouped = ownedIds
      .filter(petId => !groupedPetIds.has(petId))
      .map(petId => getPetInfo(petId))
      .filter(Boolean);
    if (ungrouped.length) {
      groups.push({
        series: { id: 'other-owned', label: currentLanguage === 'en' ? 'Other Pets' : '其他宠物', hint: '' },
        pets: ungrouped
      });
    }
    return groups;
  }

  function renderPetCollection(student) {
    const target = $('#pet-collection-content');
    const countLabel = $('#pet-collection-count');
    const summary = $('#pet-collection-summary');
    if (!target || !countLabel || !summary) return;
    const heroGroups = getOwnedPetHeroPoolGroups(student);
    const ownedPets = heroGroups.flatMap(group => group.pets);
    countLabel.textContent = `${ownedPets.length} / ${PET_CATALOG.length}`;
    summary.textContent = ownedPets.length
      ? (currentLanguage === 'en'
        ? 'Tap a hero card to switch your current companion. Rooms and mini games will follow this choice.'
        : '点击英雄池里的宠物即可切换当前伙伴；房间和迷你游戏会跟着使用这只宠物。')
      : (currentLanguage === 'en'
        ? 'After choosing your first pet, all owned pets will appear here.'
        : '完成第一次选宠物后，这里会显示你已经拥有的全部宠物。');
    if (!ownedPets.length) {
      target.innerHTML = '<div class="empty-state pet-collection-empty"><strong>还没有拥有宠物</strong><p>先选择一只学习伙伴，开始你的成长旅程吧！</p></div>';
      return;
    }
    const activePetId = String(student.petType || '');
    const groupMarkup = heroGroups.map(group => {
      const cards = group.pets.map(pet => {
        if (!student.demoMode) syncPetEvolutionFormState(student, pet.id);
        const selected = pet.id === activePetId;
        const status = getPetCollectionStatus(student, pet.id);
        const displayName = status?.displayName || getPetFullDisplayName(student, pet.id) || pet.name;
        const image = getRolePreviewAsset(status?.displayImage || getPetRecordDisplayImage(student, pet.id) || pet.image);
        const stateLabel = selected
          ? (currentLanguage === 'en' ? 'Current companion' : '当前伙伴')
          : (currentLanguage === 'en' ? 'Switch companion' : '切换伙伴');
        return `<button type="button" class="interaction-room-hero-card pet-collection-hero-card${selected ? ' selected' : ''}" data-switch-pet="${escapeHtml(pet.id)}" aria-pressed="${selected ? 'true' : 'false'}" aria-label="${escapeHtml(`${displayName} · ${stateLabel}`)}">
          <span><img src="${escapeHtml(image)}" alt="${escapeHtml(displayName)}" loading="lazy" decoding="async" /></span>
          <strong>${escapeHtml(displayName)}</strong>
          <small>${escapeHtml(stateLabel)}</small>
        </button>`;
      }).join('');
      return `<div class="interaction-room-hero-series pet-collection-hero-series">
        <div class="interaction-room-hero-series-head"><strong>${escapeHtml(localize(group.series.label))}</strong><small>${group.pets.length}</small></div>
        <div class="interaction-room-hero-grid pet-collection-hero-grid">${cards}</div>
      </div>`;
    }).join('');
    target.innerHTML = `<section class="interaction-room-hero-pool pet-collection-hero-pool" aria-label="${escapeHtml(localize('宠物英雄池'))}">
      <div class="interaction-room-size-head pet-collection-hero-head">
        <div>
          <p class="eyebrow">HERO POOL</p>
          <h4>${escapeHtml(localize('选择当前伙伴'))}</h4>
        </div>
        <span>${escapeHtml(localize('按系列排列'))}</span>
      </div>
      ${groupMarkup}
    </section>`;
  }

  function renderPetSkills(student) {
    const target = $('#pet-skills-content');
    if (!target) return;
    const pet = getPetInfo(student?.petType);
    const assets = pet?.skillAssets || {};
    const evolved = isPetEvolved(student);
    const entries = Array.isArray(pet?.skills) && pet.skills.length
      ? pet.skills
      : [
        assets.before ? { id: 'before', type: '进化前', name: '技能图', beforeImage: assets.before, explanation: `${pet?.name || '这只宠物'}的进化前技能素材。` } : null,
        assets.after ? { id: 'after', type: '进化后', name: '技能图', beforeImage: assets.after, explanation: `${pet?.name || '这只宠物'}的进化后技能素材。` } : null
      ].filter(Boolean);
    if (!pet || !entries.length) {
      target.innerHTML = '<div class="empty-state"><strong>技能图会在素材加入后显示</strong><p>目前这只宠物暂时没有可显示的技能图。</p></div>';
      return;
    }
    target.innerHTML = entries.map(entry => {
      const displayEntry = getSkillDisplayEntry(pet, entry);
      const image = evolved && entry.afterImage ? entry.afterImage : (entry.beforeImage || entry.image);
      const stageLabel = evolved && entry.afterImage ? localize('进化后') : localize('进化前');
      const skillLabel = `${pet.name} ${stageLabel} ${displayEntry.type} ${displayEntry.name}`;
      const skillAria = currentLanguage === 'en'
        ? `View ${pet.name} ${displayEntry.type} ${displayEntry.name} skill details`
        : `查看${pet.name}${entry.type}${entry.name}的技能解释`;
      return `<article class="pet-skill-card single-skill" data-skill-card>
        <button type="button" class="pet-skill-icon-button" data-skill-toggle aria-expanded="false" aria-label="${escapeHtml(skillAria)}">
          <span class="pet-skill-image-wrap"><img src="${escapeHtml(withAssetVersion(image || ''))}" alt="${escapeHtml(skillLabel)}" loading="lazy" decoding="async" /></span>
          <span class="pet-skill-label"><strong>${escapeHtml(displayEntry.type)}</strong><small>${escapeHtml(displayEntry.name)}</small></span>
        </button>
        <div class="pet-skill-explanation" data-skill-explanation hidden>
          <strong>${escapeHtml(displayEntry.type)} · ${escapeHtml(displayEntry.name)}</strong>
          <p>${escapeHtml(displayEntry.explanation || '技能说明待补充。')}</p>
        </div>
      </article>`;
    }).join('');
  }

  function renderPetShop(student) {
    const target = $('#pet-shop-grid');
    if (!target) return;
    if (!PET_SERIES_GROUPS.some(series => series.id === selectedPetSeries)) selectedPetSeries = 'all';
    const activeSeries = getPetSeriesInfo(selectedPetSeries);
    const seriesPets = getPetSeriesPets(selectedPetSeries);
    const owned = new Set(student.ownedPets || []);
    const seriesButtons = PET_SERIES_GROUPS.map(series => {
      const count = getPetSeriesPets(series.id).length;
      return `<button type="button" class="pet-series-button${series.id === selectedPetSeries ? ' active' : ''}" data-pet-series="${escapeHtml(series.id)}" aria-pressed="${series.id === selectedPetSeries ? 'true' : 'false'}">
        <strong>${escapeHtml(localize(series.label))}</strong><small>${count}</small>
      </button>`;
    }).join('');
    const seriesOptions = PET_SERIES_GROUPS.map(series => `<option value="${escapeHtml(series.id)}"${series.id === selectedPetSeries ? ' selected' : ''}>${escapeHtml(localize(series.label))} · ${getPetSeriesPets(series.id).length}</option>`).join('');
    const blindBoxCount = Math.max(0, Math.floor(Number(student.blindBoxes || 0)));
    const blindBoxCard = `<section class="blind-box-shop-panel">
      <div class="blind-box-shop-art"><img src="${escapeHtml(withAssetVersion(BLIND_BOX_IMAGE))}" alt="神秘宠物盲盒" loading="lazy" decoding="async" /></div>
      <div class="blind-box-shop-copy">
        <p class="eyebrow">MYSTERY BOX</p>
        <h3>神秘宠物盲盒</h3>
        <p>售价 ${BLIND_BOX_PRICE} 金币。开启后会随机获得 1 个未拥有宠物或音乐和 2 件随机装备；重复奖励可以换金币或送好友。</p>
        <small>当前拥有：${blindBoxCount} 个盲盒</small>
      </div>
      <div class="blind-box-shop-actions">
        <button type="button" class="primary-button" data-buy-blind-box ${student.demoMode ? 'disabled' : ''}>购买盲盒</button>
        <button type="button" class="secondary-button" data-open-blind-box ${blindBoxCount <= 0 ? 'disabled' : ''}>开启盲盒</button>
      </div>
    </section>`;
    const renderExclusiveGear = pet => {
      const items = getExclusiveItemsForPet(pet.id);
      if (!items.length) {
        return `<div class="pet-shop-gear-empty">${escapeHtml(localize('暂无专属装备'))}</div>`;
      }
      const ownedIds = new Set(getOwnedItemIds(student));
      const visibleItems = getVisibleExclusiveItemsForPet(student, pet.id, items);
      const lockedItems = getLockedExclusiveItemsForPet(student, pet.id, items);
      return `<div class="pet-shop-gear-grid">
        ${visibleItems.map(item => {
          const slotInfo = getEquipmentSlotInfo(item.slot);
          const itemName = getEquipmentDisplayName(item);
          const ownedItem = student.demoMode || ownedIds.has(item.id);
          const equipped = getEquippedItemForSlot(student, item.slot)?.id === item.id;
          const state = equipped
            ? localize('当前宠物')
            : ownedItem
              ? localize('已拥有')
              : localize('回到宠物主页购买');
          return `<span class="pet-shop-gear-item${ownedItem ? ' owned' : ''}${equipped ? ' equipped' : ''}">
            <img src="${escapeHtml(withAssetVersion(item.image))}" alt="${escapeHtml(itemName)}" loading="lazy" decoding="async" />
            <b>${escapeHtml(slotInfo.icon)} ${escapeHtml(localize(slotInfo.label))}</b>
            <strong>${escapeHtml(itemName)}</strong>
            <small>${escapeHtml(state)} · 🪙 ${item.price}</small>
          </span>`;
        }).join('')}
        ${lockedItems.length ? `<span class="pet-shop-gear-item locked"><b>🔒 ${escapeHtml(localize('终极装备'))}</b><strong>${lockedItems.length} ${currentLanguage === 'en' ? 'hidden' : '件未开放'}</strong><small>${escapeHtml(localize('小进化后开放'))}</small></span>` : ''}
      </div>`;
    };
    const petCards = seriesPets.map(pet => {
      const rarity = getRarityInfo(pet.rarity);
      const isOwned = student.demoMode || owned.has(pet.id);
      const isCurrent = pet.id === student.petType;
      const record = isOwned && !student.demoMode ? ensurePetRecord(student, pet.id) : null;
      const speciesName = record ? getPetSpeciesNameForStudent(student, pet.id) : pet.name;
      const displayName = record ? getPetFullDisplayNameWithTitle(student, pet.id) : pet.name;
      const action = isCurrent
        ? `<span class="owned-label">${currentLanguage === 'en' ? 'Current Pet' : '当前宠物'}</span>`
        : isOwned
          ? `<button type="button" class="secondary-button" data-switch-pet="${pet.id}">${currentLanguage === 'en' ? 'Switch' : '切换使用'}</button>`
          : `<button type="button" class="primary-button" data-buy-pet="${pet.id}">${currentLanguage === 'en' ? 'Buy' : '购买'}</button>`;
      return `<article class="pet-shop-card${isOwned ? ' owned' : ''}${isCurrent ? ' current' : ''}">
        <div class="pet-shop-art"><img src="${escapeHtml(getRolePreviewAsset(pet.image))}" alt="${escapeHtml(pet.name)}" loading="lazy" decoding="async" /></div>
        <div class="pet-shop-copy"><div class="pet-shop-title"><h3>${escapeHtml(displayName)}</h3><span class="rarity-badge ${rarity.className}">${escapeHtml(localize(rarity.label))}</span></div>
          <p>${escapeHtml(speciesName)} · ${isOwned && record?.birthday ? `${currentLanguage === 'en' ? 'Birthday' : '生日'} ${escapeHtml(currentLanguage === 'en' ? formatEnglishDate(...record.birthday.split('-')) : formatDate(record.birthday))}` : currentLanguage === 'en' ? 'Can be trained and equipped separately' : '可独立培养和装备'}</p></div>
        <section class="pet-shop-gear-panel" aria-label="${escapeHtml(`${pet.name} ${localize('专属装备')}`)}">
          <div class="pet-shop-gear-heading"><span>${escapeHtml(localize('专属装备'))}</span><small>${escapeHtml(localize(getPetSeriesInfo(getPetSeriesId(pet)).label))}</small></div>
          ${renderExclusiveGear(pet)}
        </section>
        <div class="pet-shop-footer"><span class="pet-price">${student.demoMode ? (currentLanguage === 'en' ? '🧪 Demo Free' : '🧪 Demo 免费') : `🪙 ${rarity.price}`}</span>${action}</div>
      </article>`;
    }).join('');
    target.innerHTML = `
      ${blindBoxCard}
      <div class="pet-series-toolbar">
        <label class="pet-series-select-wrap">
          <span>${escapeHtml(localize('选择宠物系列'))}</span>
          <select class="pet-series-select" data-pet-series-select>${seriesOptions}</select>
        </label>
        <div class="pet-series-buttons" role="group" aria-label="${escapeHtml(localize('选择宠物系列'))}">${seriesButtons}</div>
      </div>
      <section class="pet-series-section" aria-label="${escapeHtml(localize(activeSeries.label))}">
        <div class="pet-series-heading">
          <div><h3>${escapeHtml(localize(activeSeries.label))}</h3><p>${escapeHtml(localize(activeSeries.hint))}</p></div>
          <span>${seriesPets.length} ${currentLanguage === 'en' ? 'pets' : '只宠物'}</span>
        </div>
        <div class="pet-series-grid">${petCards}</div>
      </section>`;
  }

  function messageWallUsesGas(student = getStudent()) {
    return Boolean(student && !student.demoMode && isGasBackend());
  }

  function normalizeWallMessage(message) {
    const text = String(message || '').trim();
    return text ? text.slice(0, 80) : WALL_POST_PRESETS[0];
  }

  function normalizeWallMusicTrackPayload(value) {
    const parsed = parseMaybeJson(value, value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const track = getMusicTrackById(parsed.trackId || parsed.id);
    if (!track) return null;
    return {
      trackId: track.id,
      title: track.title,
      series: track.series,
      src: track.src,
      accent: getMusicTrackAccent(track)
    };
  }

  function getWallPostSharedMusicTrack(post = {}) {
    return normalizeWallMusicTrackPayload(post.musicTrack || post.music_track || post.petStats?.__sharedMusicTrack);
  }

  function normalizeWallPost(post = {}) {
    const likedBy = parseMaybeJson(post.likedBy, []);
    const comments = parseMaybeJson(post.comments, []);
    const petStats = parseMaybeJson(post.petStats, {});
    const equipment = parseMaybeJson(post.equipment, []);
    const fallbackPet = getPetInfo(post.petType);
    const normalizedStats = petStats && typeof petStats === 'object' && !Array.isArray(petStats) ? petStats : {};
    const statsAreEmpty = ['hp', 'attack', 'defense', 'speed', 'luck'].every(key => !Number(normalizedStats[key] || 0));
    const normalizedPostForMeta = { ...post, petStats: normalizedStats };
    const musicTrack = normalizeWallMusicTrackPayload(post.musicTrack || post.music_track || normalizedStats.__sharedMusicTrack);
    const studentAvatarImage = getStudentAvatarImage({
      avatarImage: post.studentAvatarImage || post.student_avatar_image || normalizedStats.__studentAvatarImage
    });
    return {
      postId: String(post.postId || createLocalId('wall-post')),
      studentId: HolidayBackendClient.normalizeId(post.studentId),
      studentName: String(post.studentName || post.name || post.studentId || '同学'),
      studentAvatarImage,
      message: normalizeWallMessage(post.message),
      petType: String(post.petType || ''),
      petName: String(post.petName || ''),
      petTitle: String(post.petTitle || post.pet_title || ''),
      petRarity: String(post.petRarity || ''),
      petLevel: String(post.petLevel || ''),
      combatPower: Math.max(0, Number(post.combatPower || 0)),
      totalCombatPower: getPostTotalCombatPower(normalizedPostForMeta),
      miniGameScores: getPostMiniGameScores(normalizedPostForMeta),
      musicTrack,
      petImage: String(post.petImage || fallbackPet?.image || ''),
      petStats: statsAreEmpty && fallbackPet?.baseStats ? fallbackPet.baseStats : normalizedStats,
      equipment: Array.isArray(equipment) ? equipment.map(item => ({
        itemId: String(item.itemId || ''),
        name: String(item.name || ''),
        slotLabel: String(item.slotLabel || ''),
        image: String(item.image || '')
      })).filter(item => item.name) : [],
      likedBy: Array.isArray(likedBy) ? likedBy.map(HolidayBackendClient.normalizeId).filter(Boolean) : [],
      comments: dedupeWallComments(Array.isArray(comments) ? comments.map(comment => ({
        commentId: String(comment.commentId || createLocalId('wall-comment')),
        studentId: HolidayBackendClient.normalizeId(comment.studentId),
        studentName: String(comment.studentName || comment.name || comment.studentId || '同学'),
        petName: String(comment.petName || comment.pet_name || comment.studentName || comment.name || comment.studentId || '同学'),
        text: sanitizeWallCommentText(comment.text),
        createdAt: String(comment.createdAt || new Date().toISOString())
      })) : []),
      createdAt: String(post.createdAt || new Date().toISOString()),
      updatedAt: String(post.updatedAt || post.createdAt || new Date().toISOString())
    };
  }

  function dedupeWallComments(comments = []) {
    const seen = new Set();
    return comments.filter(comment => {
      const commentId = String(comment.commentId || '').trim();
      const key = commentId || `${HolidayBackendClient.normalizeId(comment.studentId)}|${sanitizeWallCommentText(comment.text)}|${String(comment.createdAt || '').slice(0, 10)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function dedupeWallPosts(posts = []) {
    const byStudent = new Map();
    posts.map(normalizeWallPost).forEach(post => {
      const key = post.studentId || post.postId;
      const existing = byStudent.get(key);
      const postCreatedTime = new Date(post.createdAt || post.updatedAt).getTime() || 0;
      const existingCreatedTime = existing ? new Date(existing.createdAt || existing.updatedAt).getTime() || 0 : -1;
      const postUpdateTime = new Date(post.updatedAt || post.createdAt).getTime() || 0;
      const existingUpdateTime = existing ? new Date(existing.updatedAt || existing.createdAt).getTime() || 0 : -1;
      if (!existing || postCreatedTime > existingCreatedTime || (postCreatedTime === existingCreatedTime && postUpdateTime >= existingUpdateTime)) {
        byStudent.set(key, post);
      }
    });
    return Array.from(byStudent.values()).sort((a, b) => new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime());
  }

  function buildWallEquipmentSnapshot(student) {
    return getEquippedItemList(student).map(item => {
      const slotInfo = getEquipmentSlotInfo(item.slot);
      return {
        itemId: item.id,
        name: item.name,
        slotLabel: slotInfo.label,
        image: item.image
      };
    });
  }

  function updateWallPost(post, options = {}) {
    const normalized = normalizeWallPost(post);
    const samePost = item => item.postId === normalized.postId || (item.studentId && item.studentId === normalized.studentId);
    const existingIndex = messageWallPosts.findIndex(samePost);
    if (options.moveToTop || existingIndex < 0) {
      messageWallPosts = dedupeWallPosts([normalized, ...messageWallPosts.filter(item => !samePost(item))]);
    } else {
      const nextPosts = [...messageWallPosts];
      nextPosts[existingIndex] = normalized;
      messageWallPosts = dedupeWallPosts(nextPosts);
    }
    return normalized;
  }

  async function syncWallPostToGas(post, localPost) {
    const student = getStudent();
    try {
      const result = await backend.createWallPost(post);
      if (!result.ok) throw new Error(result.error || '留言发布失败，请稍后再试。');
      updateWallPost(result.post || localPost, { moveToTop: true });
      if (session.activeView === 'wall-view') renderMessageWall(student);
      renderHomeWallShare(student);
      showToast('留言墙同步完成。');
    } catch (error) {
      showToast(error.message || '留言墙同步失败，请稍后按同步按钮。');
    }
  }

  async function syncWallLikeToGas(postId, studentId, fallbackPost) {
    const student = getStudent();
    try {
      const result = await backend.likeWallPost(postId, studentId);
      if (!result.ok) throw new Error(result.error || '点赞失败，请稍后再试。');
      updateWallPost(result.post || fallbackPost);
      if (session.activeView === 'wall-view') renderMessageWall(student);
    } catch (error) {
      showToast(error.message || '点赞同步失败，请稍后再试。');
    }
  }

  async function syncWallCommentToGas(postId, comment, fallbackPost) {
    const student = getStudent();
    try {
      const result = await backend.commentWallPost(postId, comment);
      if (!result.ok) throw new Error(result.error || '留言失败，请稍后再试。');
      updateWallPost(result.post || fallbackPost);
      if (session.activeView === 'wall-view') renderMessageWall(student);
    } catch (error) {
      showToast(error.message || '留言同步失败，请稍后再试。');
    }
  }

  async function loadMessageWall() {
    const student = getStudent();
    if (!student) return;
    if (!messageWallUsesGas(student)) {
      messageWallPosts = loadLocalWallPosts();
      messageWallLoaded = true;
      wallLeaderboardStudents = [cloneStudentState(student)];
      wallLeaderboardLoaded = true;
      renderMessageWall(student);
      return;
    }
    try {
      const result = await backend.listWallPosts();
      if (!result.ok) throw new Error(result.error || '留言墙读取失败');
      messageWallPosts = dedupeWallPosts(Array.isArray(result.posts) ? result.posts : []);
      messageWallLoaded = true;
      renderMessageWall(student);
      void loadWallLeaderboardStudents();
    } catch (error) {
      messageWallLoaded = true;
      renderMessageWall(student);
      void loadWallLeaderboardStudents();
      showToast(`留言墙暂时读取失败：${error.message || error}`);
    }
  }

  function normalizeLeaderboardStudent(row = {}) {
    const source = row && typeof row === 'object' && !Array.isArray(row) ? row : {};
    const nestedState = source.state && typeof source.state === 'object' && !Array.isArray(source.state) ? source.state : {};
    const merged = { ...nestedState, ...source };
    const studentId = HolidayBackendClient.normalizeId(merged.studentId || merged.student_id || source.student_id);
    const studentName = String(merged.studentName || merged.student_name || merged.name || source.student_name || studentId || '').trim();
    return {
      ...merged,
      studentId,
      studentName,
      name: studentName,
      branch: String(merged.branch || source.branch || ''),
      className: String(merged.className || merged.class_name || source.class_name || ''),
      avatar: String(merged.avatar || source.avatar || '🌟'),
      coins: Math.max(0, Math.floor(Number(merged.coins || source.coins || 0) || 0)),
      totalStars: Math.max(0, Math.floor(Number(merged.totalStars || merged.total_stars || source.total_stars || 0) || 0)),
      miniGameHighScores: normalizeMiniGameScores(merged.miniGameHighScores || merged.mini_game_scores)
    };
  }

  function mergeWallLeaderboardStudent(student) {
    if (!student?.studentId) return;
    const normalized = normalizeLeaderboardStudent(cloneStudentState(student));
    const studentId = HolidayBackendClient.normalizeId(normalized.studentId);
    if (!studentId) return;
    const existingRows = Array.isArray(wallLeaderboardStudents) ? wallLeaderboardStudents : [];
    wallLeaderboardStudents = [
      normalized,
      ...existingRows.filter(row => HolidayBackendClient.normalizeId(row?.studentId || row?.student_id) !== studentId)
    ];
    wallLeaderboardLoaded = true;
  }

  async function loadWallLeaderboardStudents() {
    const student = getStudent();
    if (!student) return;
    if (!messageWallUsesGas(student)) {
      wallLeaderboardStudents = [cloneStudentState(student)];
      wallLeaderboardLoaded = true;
      renderWallLeaderboard(student);
      return;
    }
    wallLeaderboardLoaded = false;
    renderWallLeaderboard(student);
    try {
      const result = await backend.listLeaderboardStudents();
      if (!result.ok) throw new Error(result.error || '排行榜读取失败');
      wallLeaderboardStudents = Array.isArray(result.students)
        ? result.students.map(normalizeLeaderboardStudent)
        : [];
      wallLeaderboardLoaded = true;
      renderWallLeaderboard(student);
    } catch (error) {
      wallLeaderboardLoaded = Array.isArray(wallLeaderboardStudents) && wallLeaderboardStudents.length > 0;
      renderWallLeaderboard(student);
      showToast(`排行榜暂时读取失败：${error.message || error}`);
    }
  }

  function buildWallPostPayload(message) {
    const student = getStudent();
    const pet = getPetInfo(student?.petType);
    const combat = student ? getCombatState(student) : { power: 0 };
    const level = student ? getLevelInfo(student) : { level: 1, max: false };
    const rarity = student ? getDisplayRarity(student) : getRarityInfo('A');
    const totalCombatPower = student ? getStudentTotalCombatPower(student) : 0;
    const miniGameScores = student ? getStudentMiniGameScores(student) : normalizeMiniGameScores();
    return {
      studentId: HolidayBackendClient.normalizeId(student?.studentId),
      studentName: student?.studentName || student?.name || student?.studentId || '同学',
      profileNameUpdatedAt: student?.profileNameUpdatedAt || '',
      studentAvatarImage: getStudentAvatarImage(student),
      message,
      petType: student?.petType || '',
      petName: student?.petName || pet?.name || '',
      petTitle: getDisplayCollectionTitleForPet(student, student?.petType),
      petRarity: rarity.label,
      petLevel: level.max ? 'MAX 999' : `Lv.${level.level}`,
      combatPower: combat.power,
      totalCombatPower,
      miniGameScores,
      petStats: { ...(combat.stats || {}), __totalCombatPower: totalCombatPower, __miniGameScores: miniGameScores, __studentAvatarImage: getStudentAvatarImage(student) },
      equipment: buildWallEquipmentSnapshot(student),
      petImage: getPetDisplayImage(student) || pet?.image || ''
    };
  }

  async function createWallPost() {
    const student = getStudent();
    if (!student?.petType) {
      showToast('请先选择一只宠物，再分享到留言墙。');
      return;
    }
    const message = WALL_POST_PRESETS.includes(selectedWallPostPreset) ? selectedWallPostPreset : WALL_POST_PRESETS[0];
    const pendingKey = `wall-post-${HolidayBackendClient.normalizeId(student.studentId)}`;
    if (pendingWallActions.has(pendingKey)) return true;
    pendingWallActions.add(pendingKey);
    const post = buildWallPostPayload(message);
    const existingPost = messageWallPosts.find(item => item.studentId === HolidayBackendClient.normalizeId(student.studentId));
    const now = new Date().toISOString();
    const localPost = updateWallPost({
      ...post,
      postId: existingPost?.postId || createLocalId('wall-post'),
      likedBy: [],
      comments: [],
      createdAt: now,
      updatedAt: now
    }, { moveToTop: true });
    renderMessageWall(student);
    renderHomeWallShare(student);
    if (messageWallUsesGas(student)) {
      showToast('已经分享到留言墙，正在同步。');
      syncWallPostToGas(localPost, localPost).finally(() => pendingWallActions.delete(pendingKey));
      return true;
    }
    saveLocalWallPosts();
    pendingWallActions.delete(pendingKey);
    showToast('已经分享到留言墙。');
    return true;
  }

  async function shareMusicTrackToWall(trackId) {
    const student = getStudent();
    const track = getMusicTrackById(trackId);
    if (!student?.petType) {
      showToast('请先选择一只宠物，再分享到留言墙。');
      return false;
    }
    if (!track) return false;
    if (!getOwnedMusicTracks(student).includes(track.id)) {
      showToast('先购买这首歌，才能分享到留言墙。');
      return false;
    }
    const pendingKey = `wall-music-${HolidayBackendClient.normalizeId(student.studentId)}-${track.id}`;
    if (pendingWallActions.has(pendingKey)) return true;
    pendingWallActions.add(pendingKey);
    const musicTrack = {
      trackId: track.id,
      title: track.title,
      series: track.series,
      src: track.src,
      accent: getMusicTrackAccent(track)
    };
    const message = `我已拥有《${track.title}》！`;
    const post = buildWallPostPayload(message);
    post.musicTrack = musicTrack;
    post.petStats = { ...(post.petStats || {}), __sharedMusicTrack: musicTrack };
    const existingPost = messageWallPosts.find(item => item.studentId === HolidayBackendClient.normalizeId(student.studentId));
    const now = new Date().toISOString();
    const localPost = updateWallPost({
      ...post,
      postId: existingPost?.postId || createLocalId('wall-post'),
      likedBy: [],
      comments: [],
      createdAt: now,
      updatedAt: now
    }, { moveToTop: true });
    if (session.activeView === 'wall-view') renderMessageWall(student);
    if (messageWallUsesGas(student)) {
      showToast('音乐已经分享到留言墙，正在同步。');
      syncWallPostToGas(localPost, localPost).finally(() => pendingWallActions.delete(pendingKey));
      return true;
    }
    saveLocalWallPosts();
    pendingWallActions.delete(pendingKey);
    showToast('音乐已经分享到留言墙。');
    return true;
  }

  async function likeWallPost(postId) {
    const student = getStudent();
    const normalizedStudentId = HolidayBackendClient.normalizeId(student?.studentId);
    const post = messageWallPosts.find(item => item.postId === postId);
    if (!student || !post) return false;
    const pendingKey = `wall-like-${postId}-${normalizedStudentId}`;
    if (pendingWallActions.has(pendingKey)) return true;
    pendingWallActions.add(pendingKey);
    const liked = post.likedBy.includes(normalizedStudentId);
    post.likedBy = liked ? post.likedBy.filter(id => id !== normalizedStudentId) : [...post.likedBy, normalizedStudentId];
    post.updatedAt = new Date().toISOString();
    renderMessageWall(student);
    if (messageWallUsesGas(student)) {
      syncWallLikeToGas(postId, normalizedStudentId, post).finally(() => pendingWallActions.delete(pendingKey));
      return true;
    }
    saveLocalWallPosts();
    pendingWallActions.delete(pendingKey);
    return true;
  }

  async function commentWallPost(postId, text) {
    const student = getStudent();
    const post = messageWallPosts.find(item => item.postId === postId);
    if (!student || !post) return false;
    const textValidation = validateWallCommentText(text);
    if (!textValidation.ok) {
      showToast(textValidation.error);
      return false;
    }
    const pendingKey = `wall-comment-${postId}-${HolidayBackendClient.normalizeId(student.studentId)}-${textValidation.text}`;
    if (pendingWallActions.has(pendingKey)) return true;
    pendingWallActions.add(pendingKey);
    const comment = {
      commentId: createLocalId('wall-comment'),
      studentId: HolidayBackendClient.normalizeId(student.studentId),
      studentName: student.studentName || student.name || student.studentId,
      profileNameUpdatedAt: student.profileNameUpdatedAt || '',
      petName: getPetFullDisplayName(student) || student.petName || student.studentId,
      text: textValidation.text,
      createdAt: new Date().toISOString()
    };
    post.comments = dedupeWallComments([...post.comments, comment]);
    post.updatedAt = new Date().toISOString();
    renderMessageWall(student);
    if (messageWallUsesGas(student)) {
      syncWallCommentToGas(postId, comment, post).finally(() => pendingWallActions.delete(pendingKey));
      return true;
    }
    saveLocalWallPosts();
    pendingWallActions.delete(pendingKey);
    return true;
  }

  function canUseFriendsBackend(student = getStudent()) {
    return Boolean(student && !student.demoMode && HolidayBackendClient.isSupabaseMode(APP_CONFIG));
  }

  function normalizeFriendSummary(friend = {}) {
    return {
      studentId: HolidayBackendClient.normalizeId(friend.studentId || friend.student_id),
      studentName: String(friend.studentName || friend.student_name || friend.name || friend.studentId || friend.student_id || '学习伙伴'),
      avatar: String(friend.avatar || '🌟'),
      petName: String(friend.petName || friend.pet_name || ''),
      petType: String(friend.petType || friend.pet_type || ''),
      ownedPetCount: Math.max(0, Number(friend.ownedPetCount || friend.owned_pet_count || 0))
    };
  }

  function normalizeNotification(notification = {}) {
    const payload = parseMaybeJson(notification.payload, {});
    return {
      notificationId: String(notification.notificationId || notification.notification_id || ''),
      type: String(notification.type || ''),
      title: String(notification.title || ''),
      body: String(notification.body || ''),
      actorStudentId: HolidayBackendClient.normalizeId(notification.actorStudentId || notification.actor_student_id),
      payload: payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {},
      readAt: String(notification.readAt || notification.read_at || ''),
      claimedAt: String(notification.claimedAt || notification.claimed_at || ''),
      createdAt: String(notification.createdAt || notification.created_at || '')
    };
  }

  function normalizeFriendRequest(request = {}) {
    return {
      requestId: String(request.requestId || request.request_id || ''),
      requesterStudentId: HolidayBackendClient.normalizeId(request.requesterStudentId || request.requester_student_id),
      requesterStudentName: String(request.requesterStudentName || request.requester_student_name || request.requesterStudentId || request.requester_student_id || '好友'),
      receiverStudentId: HolidayBackendClient.normalizeId(request.receiverStudentId || request.receiver_student_id),
      createdAt: String(request.createdAt || request.created_at || '')
    };
  }

  function getFriendById(friendId) {
    const normalized = HolidayBackendClient.normalizeId(friendId);
    return friendState.friends.find(friend => friend.studentId === normalized)
      || friendState.searchResults.find(friend => friend.studentId === normalized)
      || null;
  }

  function renderFriendSearchResults() {
    const target = $('#friend-search-results');
    if (!target) return;
    if (!friendState.searchResults.length) {
      target.innerHTML = `<div class="empty-state compact-empty">${escapeHtml(localize('输入名字或 ID 后搜索好友。'))}</div>`;
      return;
    }
    const friendIds = new Set(friendState.friends.map(friend => friend.studentId));
    target.innerHTML = friendState.searchResults.map(friend => {
      const alreadyFriend = friendIds.has(friend.studentId);
      return `<div class="friend-result-row">
        <span class="friend-avatar">${escapeHtml(friend.avatar)}</span>
        <span class="friend-copy"><strong>${escapeHtml(friend.studentName || friend.studentId)}</strong><small>${escapeHtml(friend.studentId)}${friend.petName ? ` · ${escapeHtml(friend.petName)}` : ''} · ${escapeHtml(friend.petType || localize('尚未选择宠物'))}</small></span>
        <button type="button" class="secondary-button" data-friend-request-send="${escapeHtml(friend.studentId)}" ${alreadyFriend ? 'disabled' : ''}>${alreadyFriend ? escapeHtml(localize('已是好友')) : escapeHtml(localize('添加'))}</button>
      </div>`;
    }).join('');
  }

  function renderFriendList(target) {
    if (!target) return;
    if (friendState.loading && !friendState.loaded) {
      target.innerHTML = `<div class="empty-state compact-empty">${escapeHtml(localize('正在读取好友...'))}</div>`;
      return;
    }
    if (!friendState.friends.length) {
      target.innerHTML = `<div class="empty-state compact-empty">${escapeHtml(localize('还没有好友。先搜索同学 ID，等对方同意后就会出现在这里。'))}</div>`;
      return;
    }
    target.innerHTML = friendState.friends.map(friend => {
      const displayName = friend.studentName || friend.studentId || '好友';
      const petCopy = friend.petName ? ` · ${friend.petName}` : '';
      return `<div class="friend-card" data-friend-card="${escapeHtml(friend.studentId)}">
      <div class="friend-card-main">
        <span class="friend-avatar large">${escapeHtml(friend.avatar)}</span>
        <div><strong>${escapeHtml(displayName)}</strong><small>${escapeHtml(friend.studentId)}${escapeHtml(petCopy)} · ${escapeHtml(currentLanguage === 'en' ? `${friend.ownedPetCount} pets collected` : `已收集 ${friend.ownedPetCount} 只宠物`)}</small></div>
      </div>
      <div class="friend-card-actions">
        <button type="button" class="secondary-button" data-friend-profile="${escapeHtml(friend.studentId)}">${escapeHtml(localize('进入主页'))}</button>
        <button type="button" class="primary-button" data-friend-gift="${escapeHtml(friend.studentId)}">${escapeHtml(localize('赠送礼物'))}</button>
      </div>
    </div>`;
    }).join('');
  }

  function renderFriendNotifications(target) {
    if (!target) return;
    const requestMarkup = friendState.requests.map(request => `<div class="friend-mail-row request">
      <div><strong>${escapeHtml(request.requesterStudentName || request.requesterStudentId)}</strong><small>${escapeHtml(request.requesterStudentId)} · ${escapeHtml(formatWallDate(request.createdAt))}</small></div>
      <div class="friend-mail-actions">
        <button type="button" class="primary-button" data-friend-request-response="accepted" data-friend-request-id="${escapeHtml(request.requestId)}">${escapeHtml(localize('同意'))}</button>
        <button type="button" class="secondary-button" data-friend-request-response="rejected" data-friend-request-id="${escapeHtml(request.requestId)}">${escapeHtml(localize('拒绝'))}</button>
      </div>
    </div>`).join('');
    const notificationMarkup = friendState.notifications.map(notification => {
      const giftId = getNotificationGiftId(notification);
      const canClaim = isPendingGiftNotification(notification);
      return `<div class="friend-mail-row${notification.readAt ? '' : ' unread'}">
        <div><strong>${escapeHtml(localize(notification.title || '通知'))}</strong><small>${escapeHtml(translateTextValue(notification.body || ''))}</small></div>
        ${canClaim ? `<button type="button" class="primary-button" data-gift-claim="${escapeHtml(giftId)}">${escapeHtml(localize('领取'))}</button>` : `<button type="button" class="secondary-button" data-notification-read="${escapeHtml(notification.notificationId)}">${escapeHtml(localize('删除'))}</button>`}
      </div>`;
    }).join('');
    target.innerHTML = requestMarkup || notificationMarkup
      ? `${requestMarkup}${notificationMarkup}`
      : `<div class="empty-state compact-empty">${escapeHtml(localize('暂时没有新通知。'))}</div>`;
    const light = $('#friend-notification-light');
    const hasUnread = friendState.requests.length || friendState.notifications.some(item => !item.readAt || (item.type.startsWith('gift-') && !item.claimedAt));
    if (light) light.classList.toggle('active', Boolean(hasUnread));
    updateFriendNavAttention();
    const clearButton = $('#friend-notification-clear-button');
    if (clearButton) {
      const hasClearable = friendState.notifications.some(isNotificationClearable);
      clearButton.disabled = !hasClearable || friendState.loading;
    }
  }

  function getFriendAttentionKey() {
    const requestKeys = friendState.requests.map(request => `request:${request.requestId || request.requesterStudentId || request.createdAt || ''}`);
    const notificationKeys = friendState.notifications
      .filter(item => !item.readAt || (item.type.startsWith('gift-') && !item.claimedAt))
      .map(item => `notice:${item.notificationId || item.type || ''}:${getNotificationGiftId(item) || item.createdAt || ''}`);
    return [...requestKeys, ...notificationKeys].filter(Boolean).sort().join('|');
  }

  function updateFriendNavAttention(forceState) {
    const attentionKey = getFriendAttentionKey();
    const hasAttention = forceState === false ? false : Boolean(attentionKey);
    if (!hasAttention) friendAttentionSeenKey = '';
    if (hasAttention && session.activeView === 'friends-view') friendAttentionSeenKey = attentionKey;
    const shouldGlow = hasAttention && attentionKey !== friendAttentionSeenKey;
    $all('[data-view="friends-view"]').forEach(button => {
      button.classList.toggle('has-friend-alert', shouldGlow);
      button.setAttribute('aria-label', shouldGlow ? localize('好友，有新通知') : localize('好友'));
    });
  }

  function buildFriendPreviewStudent(friend) {
    const normalized = HolidayBackendClient.normalizeStudent(friend, [], friend);
    const preview = cloneStudentState(normalized);
    const ownedPets = [...new Set(Array.isArray(preview.ownedPets) ? preview.ownedPets : [])].filter(petId => getPetInfo(petId));
    const selectedPetId = friendState.friendPreviewPetId && ownedPets.includes(friendState.friendPreviewPetId)
      ? friendState.friendPreviewPetId
      : (preview.petType && getPetInfo(preview.petType) ? preview.petType : ownedPets[0] || '');
    if (!selectedPetId) return preview;
    if (!ownedPets.includes(selectedPetId)) ownedPets.unshift(selectedPetId);
    preview.ownedPets = ownedPets;
    preview.petCollection = preview.petCollection && typeof preview.petCollection === 'object' ? preview.petCollection : {};
    const pet = getPetInfo(selectedPetId);
    const record = preview.petCollection[selectedPetId] || {};
    const isOriginalActivePet = selectedPetId === normalized.petType;
    preview.petType = selectedPetId;
    preview.petName = String(record.petName || (isOriginalActivePet ? normalized.petName : '') || pet?.name || '');
    preview.petBirthday = String(record.birthday || (isOriginalActivePet ? normalized.petBirthday : '') || '');
    preview.petRarity = String(record.rarity || (isOriginalActivePet ? normalized.petRarity : '') || pet?.rarity || 'A');
    preview.experience = Math.max(0, Number(record.experience ?? (isOriginalActivePet ? normalized.experience : 0)) || 0);
    preview.petLevel = Math.max(1, Math.floor(Number(record.petLevel ?? (isOriginalActivePet ? normalized.petLevel : 1)) || 1));
    preview.equippedItems = { ...(record.equippedItems || (isOriginalActivePet ? normalized.equippedItems : {}) || {}) };
    preview.ownedItems = [...(Array.isArray(record.ownedItems) ? record.ownedItems : (isOriginalActivePet ? normalized.ownedItems : []))];
    preview.miniPetEvolved = Boolean(record.miniEvolved || (isOriginalActivePet && normalized.miniPetEvolved));
    preview.petEvolved = Boolean(record.evolved || preview.evolvedPets?.[selectedPetId] || (isOriginalActivePet && normalized.petEvolved));
    return preview;
  }

  function getFriendOwnedPetStatuses(preview) {
    const ids = [...new Set(Array.isArray(preview.ownedPets) ? preview.ownedPets : [])].filter(petId => getPetInfo(petId));
    if (preview.petType && !ids.includes(preview.petType)) ids.unshift(preview.petType);
    return ids.map(petId => getPetCollectionStatus(preview, petId)).filter(status => status.pet);
  }

  function renderFriendReadonlyStats(combat, petType) {
    const statMeta = [
      ['hp', '❤️', '生命'],
      ['attack', '⚔️', '攻击'],
      ['defense', '🛡️', '防御'],
      ['speed', '💨', '速度'],
      ['luck', '🍀', '幸运']
    ];
    return `<div class="friend-readonly-stats">${statMeta.map(([key, icon, label]) => `
      <span><small>${icon} ${escapeHtml(localize(label))}</small><strong>${escapeHtml(formatStatValue(key, combat.stats[key] || 0, petType))}</strong></span>
    `).join('')}</div>`;
  }

  function renderFriendReadonlyEquipment(preview) {
    const equipped = getEquippedItemList(preview);
    if (!equipped.length) return `<div class="friend-readonly-empty">${escapeHtml(localize('这只宠物尚未装备任何物品。'))}</div>`;
    return `<div class="friend-readonly-equipment">${equipped.map(item => {
      const slot = getEquipmentSlotInfo(item.slot);
      return `<span><img src="${escapeHtml(withAssetVersion(item.image))}" alt="${escapeHtml(getEquipmentDisplayName(item))}" loading="lazy" decoding="async" /><b>${slot.icon} ${escapeHtml(localize(slot.label))}</b><strong>${escapeHtml(getEquipmentDisplayName(item))}</strong></span>`;
    }).join('')}</div>`;
  }

  function renderFriendProfile(target, friend) {
    if (!target) return;
    if (!friend) {
      target.innerHTML = `<div class="empty-state compact-empty">${escapeHtml(localize('选择一位好友，就可以进入他的宠物主页。'))}</div>`;
      return;
    }
    const preview = buildFriendPreviewStudent(friend);
    const previewStudentId = HolidayBackendClient.normalizeId(preview.studentId);
    const friendRoomBusy = Boolean(previewStudentId && interactionRoomState.joiningFriendId === previewStudentId);
    const friendRoomButton = `<button type="button" class="secondary-button" data-friend-room="${escapeHtml(previewStudentId)}" ${friendRoomBusy ? 'disabled' : ''}>${escapeHtml(localize(friendRoomBusy ? '进入中' : '加入好友房间'))}</button>`;
    const pet = getPetInfo(preview.petType);
    const ownedStatuses = getFriendOwnedPetStatuses(preview);
    const currentStatus = ownedStatuses.find(status => status.pet.id === preview.petType) || ownedStatuses[0] || null;
    if (!pet || !currentStatus) {
      target.innerHTML = `<div class="friend-profile-card friend-readonly-home">
        <div class="friend-readonly-top">
          <div><p class="eyebrow">FRIEND HOME</p><h3>${escapeHtml(preview.studentName || preview.studentId || localize('好友'))}</h3><p>${escapeHtml(localize('这位好友还没有选择宠物。'))}</p></div>
          <div class="friend-profile-actions">
            <button type="button" class="primary-button" data-friend-gift="${escapeHtml(preview.studentId)}">${escapeHtml(localize('赠送礼物'))}</button>
            ${friendRoomButton}
          </div>
        </div>
        <div class="friend-room-preview"><strong>${escapeHtml(localize('好友互动房间'))}</strong><p>${escapeHtml(localize('会先读取好友当前所在的房间；如果好友在线，就直接进入同一个互动房间。'))}</p></div>
      </div>`;
      return;
    }
    const displayImage = getPetDisplayImage(preview) || currentStatus.displayImage || pet.image || '';
    const displayPreviewImage = getRolePreviewAsset(displayImage);
    const rarity = getDisplayRarity(preview);
    const level = getLevelInfo(preview);
    const combat = getCombatState(preview);
    const displayName = getPetFullDisplayName(preview);
    const petButtons = ownedStatuses.map(status => {
      const image = getRolePreviewAsset(status.displayImage || getVersionedRoleCardAsset(status.pet.image));
      const active = status.pet.id === preview.petType;
      const levelLabel = status.level.max ? 'MAX' : `Lv.${status.level.level}`;
      return `<button type="button" class="friend-pet-mini${active ? ' active' : ''}" data-friend-preview-pet="${escapeHtml(status.pet.id)}" aria-pressed="${active ? 'true' : 'false'}">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(status.displayName || status.pet.name)}" loading="lazy" decoding="async" />
        <span><strong>${escapeHtml(status.displayName || status.pet.name)}</strong><small>${escapeHtml(status.evolutionStageLabel)} · ${levelLabel}</small></span>
      </button>`;
    }).join('');
    target.innerHTML = `<div class="friend-profile-card friend-readonly-home">
      <div class="friend-readonly-top">
        <div><p class="eyebrow">FRIEND HOME</p><h3>${escapeHtml(displayName || preview.studentName || localize('学习伙伴'))}</h3><p>${escapeHtml(preview.studentName || preview.studentId)} · ${escapeHtml(localize('只读主页'))} · ${escapeHtml(currentLanguage === 'en' ? `${ownedStatuses.length} / ${PET_CATALOG.length} pets collected` : `已收集 ${ownedStatuses.length} / ${PET_CATALOG.length} 只宠物`)}</p></div>
        <div class="friend-profile-actions">
          <button type="button" class="primary-button" data-friend-gift="${escapeHtml(preview.studentId)}">${escapeHtml(localize('赠送礼物'))}</button>
          ${friendRoomButton}
        </div>
      </div>
      <div class="friend-readonly-hero">
        <img src="${escapeHtml(displayPreviewImage)}" alt="${escapeHtml(displayName || pet.name)}" loading="lazy" decoding="async" />
        <div class="friend-readonly-summary">
          <span class="rarity-badge ${escapeHtml(rarity.className)}">${escapeHtml(rarity.label)}</span>
          <span class="level-badge">${level.max ? 'MAX 999 LEVEL' : `Lv.${level.level}`}</span>
          <strong>⚔️ ${escapeHtml(String(combat.power))}</strong>
          <small>${escapeHtml(getPetSeriesInfo(getPetSeriesId(pet)).label)} · ${escapeHtml(currentStatus.evolutionStageLabel)}${currentStatus.birthday ? ` · ${escapeHtml(localize('生日'))} ${escapeHtml(formatDisplayDate(currentStatus.birthday))}` : ''}</small>
        </div>
      </div>
      ${renderFriendReadonlyStats(combat, preview.petType)}
      <div class="friend-readonly-section"><strong>${escapeHtml(localize('好友装备'))}</strong>${renderFriendReadonlyEquipment(preview)}</div>
      <div class="friend-room-preview"><strong>${escapeHtml(localize('好友互动房间'))}</strong><p>${escapeHtml(localize('会先读取好友当前所在的房间；如果好友在线，就直接进入同一个互动房间。'))}</p>${friendRoomButton}</div>
      <div class="friend-readonly-section"><strong>${escapeHtml(localize('好友其他宠物'))}</strong><div class="friend-pet-mini-grid">${petButtons}</div></div>
    </div>`;
  }

  function renderFriendsView() {
    const student = getStudent();
    const searchTarget = $('#friend-search-results');
    const listTarget = $('#friend-list');
    const notificationTarget = $('#friend-notifications');
    const profileTarget = $('#friend-profile-content');
    const countBadge = $('#friend-count-badge');
    if (!searchTarget || !listTarget || !notificationTarget || !profileTarget) return;
    if (!canUseFriendsBackend(student)) {
      const copy = `<div class="empty-state compact-empty">${escapeHtml(localize('好友功能需要连接 Supabase 云端后使用。'))}</div>`;
      searchTarget.innerHTML = copy;
      listTarget.innerHTML = copy;
      notificationTarget.innerHTML = copy;
      profileTarget.innerHTML = copy;
      updateFriendNavAttention(false);
      return;
    }
    if (countBadge) countBadge.textContent = String(friendState.friends.length);
    renderFriendSearchResults();
    renderFriendList(listTarget);
    renderFriendNotifications(notificationTarget);
    renderFriendProfile(profileTarget, friendState.activeFriend || null);
    applyLanguage($('#friends-view'));
  }

  async function loadFriendsDashboard(force = false) {
    const student = getStudent();
    if (!canUseFriendsBackend(student)) {
      friendState.loaded = true;
      renderFriendsView();
      return false;
    }
    if (friendState.loading || (friendState.loaded && !force)) {
      renderFriendsView();
      return true;
    }
    friendState.loading = true;
    renderFriendsView();
    try {
      const [friendsResult, notificationsResult] = await Promise.all([
        backend.listFriends(student.studentId),
        backend.listNotifications(student.studentId)
      ]);
      if (!friendsResult.ok) throw new Error(friendsResult.error || '好友读取失败');
      if (!notificationsResult.ok) throw new Error(notificationsResult.error || '通知读取失败');
      friendState.friends = (friendsResult.friends || []).map(normalizeFriendSummary);
      friendState.notifications = (notificationsResult.notifications || []).map(normalizeNotification);
      friendState.requests = (notificationsResult.requests || []).map(normalizeFriendRequest);
      friendState.loaded = true;
      friendState.loading = false;
      renderFriendsView();
      if (session.activeView === 'guide-view') {
        renderRoomLobby(student);
        renderSharedRoomPanel();
        renderInteractionRoomLobby(student);
      }
      maybePromptPendingGiftNotifications();
      return true;
    } catch (error) {
      friendState.loading = false;
      friendState.loaded = true;
      renderFriendsView();
      showToast(`好友资料读取失败：${error.message || error}`);
      return false;
    }
  }

  async function searchFriendsFromForm(form) {
    const student = getStudent();
    const input = form?.querySelector('#friend-search-input');
    if (!student || !input) return false;
    const query = input.value.trim();
    if (query.length < 2) {
      showToast('请输入至少 2 个字或 ID。');
      return false;
    }
    const result = await backend.searchFriends(student.studentId, query);
    if (!result.ok) {
      showToast(result.error || '搜索失败，请稍后再试。');
      return false;
    }
    friendState.searchResults = (result.results || []).map(normalizeFriendSummary);
    renderFriendSearchResults();
    return true;
  }

  async function sendFriendRequestFromButton(button) {
    const student = getStudent();
    const receiverId = HolidayBackendClient.normalizeId(button?.dataset.friendRequestSend);
    if (!student || !receiverId) return false;
    const result = await backend.sendFriendRequest(student.studentId, receiverId);
    if (!result.ok) {
      showToast(result.error || '好友申请发送失败。');
      return false;
    }
    if (result.status === 'accepted') {
      showToast('已经成为好友。');
      await loadFriendsDashboard(true);
      return true;
    }
    showToast('好友申请已送出，等待对方同意。');
    button.disabled = true;
    button.textContent = localize('已申请');
    await loadFriendsDashboard(true);
    return true;
  }

  async function respondToFriendRequest(button) {
    const student = getStudent();
    const requestId = String(button?.dataset.friendRequestId || '');
    const response = String(button?.dataset.friendRequestResponse || '');
    if (!student || !requestId || !response) return false;
    const result = await backend.respondFriendRequest(student.studentId, requestId, response);
    if (!result.ok) {
      showToast(result.error || '好友申请处理失败。');
      return false;
    }
    showToast(response === 'accepted' ? '已经成为好友。' : '已拒绝好友申请。');
    await loadFriendsDashboard(true);
    return true;
  }

  async function openFriendProfile(friendId) {
    const student = getStudent();
    const normalizedFriendId = HolidayBackendClient.normalizeId(friendId);
    if (!student || !normalizedFriendId) return false;
    friendState.activeFriendId = normalizedFriendId;
    friendState.activeFriend = getFriendById(normalizedFriendId);
    friendState.friendPreviewPetId = '';
    renderFriendsView();
    const result = await backend.getFriendProfile(student.studentId, normalizedFriendId);
    if (!result.ok) {
      showToast(result.error || '好友主页读取失败。');
      return false;
    }
    friendState.activeFriend = result.friend || friendState.activeFriend;
    const normalizedFriend = HolidayBackendClient.normalizeStudent(friendState.activeFriend || {}, [], friendState.activeFriend || {});
    const ownedPets = [...new Set(Array.isArray(normalizedFriend.ownedPets) ? normalizedFriend.ownedPets : [])].filter(petId => getPetInfo(petId));
    friendState.friendPreviewPetId = normalizedFriend.petType || ownedPets[0] || '';
    renderFriendsView();
    return true;
  }

  function getAllGiftableShopItems() {
    return EQUIPMENT_CATALOG
      .filter(item => item.exclusivePetId && Number(item.price) > 0)
      .sort((first, second) => {
        const firstPet = getPetInfo(first.exclusivePetId)?.name || first.exclusivePetId || '';
        const secondPet = getPetInfo(second.exclusivePetId)?.name || second.exclusivePetId || '';
        return `${firstPet}-${first.slot}-${first.name}`.localeCompare(`${secondPet}-${second.slot}-${second.name}`, 'zh-Hans-CN');
      });
  }

  function getAllGiftableShopPets() {
    return PET_CATALOG
      .map(pet => ({ pet, rarity: getRarityInfo(pet.rarity) }))
      .filter(entry => Number(entry.rarity.price) > 0)
      .sort((first, second) => `${getPetSeriesInfo(getPetSeriesId(first.pet)).label}-${first.pet.name}`.localeCompare(`${getPetSeriesInfo(getPetSeriesId(second.pet)).label}-${second.pet.name}`, 'zh-Hans-CN'));
  }

  function getAllGiftableMusicTracks() {
    return MUSIC_BOX_TRACKS
      .filter(track => !track.defaultOwned)
      .slice()
      .sort((first, second) => {
        const rankDiff = getMusicSeriesRank(first.series) - getMusicSeriesRank(second.series);
        if (rankDiff) return rankDiff;
        return String(first.title || '').localeCompare(String(second.title || ''), 'zh-Hans-CN');
      });
  }

  function syncGiftSelectionDefaults() {
    if (friendState.activeGiftType === 'item') {
      const items = getAllGiftableShopItems();
      const selected = items.find(item => item.id === friendState.giftItemId) || items[0];
      if (selected) {
        friendState.giftItemId = selected.id;
        friendState.giftItemPetId = selected.exclusivePetId || '';
        friendState.giftAmount = Number(selected.price || 0);
      }
    }
    if (friendState.activeGiftType === 'pet') {
      const entries = getAllGiftableShopPets();
      const selected = entries.find(entry => entry.pet.id === friendState.giftPetId) || entries[0];
      if (selected) {
        friendState.giftPetId = selected.pet.id;
        friendState.giftAmount = Number(selected.rarity.price || 0);
      }
    }
    if (friendState.activeGiftType === 'blind-box') {
      friendState.giftAmount = BLIND_BOX_PRICE;
    }
    if (friendState.activeGiftType === 'music') {
      const tracks = getAllGiftableMusicTracks();
      const selected = tracks.find(track => track.id === friendState.giftMusicTrackId) || tracks[0];
      if (selected) {
        friendState.giftMusicTrackId = selected.id;
        friendState.giftAmount = MUSIC_BOX_TRACK_PRICE;
      }
    }
  }

  function renderGiftModal() {
    const target = $('#friend-gift-content');
    const friend = getFriendById(friendState.giftTargetId);
    const student = getStudent();
    if ($('#friend-gift-target')) $('#friend-gift-target').textContent = friend ? `送给 ${friend.petName || friend.studentName}` : '';
    $all('[data-gift-type]').forEach(button => button.classList.toggle('active', button.dataset.giftType === friendState.activeGiftType));
    if (!target) return;
    if (friendState.activeGiftType === 'coins') {
      target.innerHTML = `<div class="gift-amount-grid">${FRIEND_GIFT_AMOUNTS.map(amount => `<button type="button" class="gift-choice${Number(friendState.giftAmount) === amount ? ' selected' : ''}" data-gift-amount="${amount}">🪙 ${amount}</button>`).join('')}</div>
        <p class="muted-text">你的金币：${Number(student?.coins || 0)}</p>`;
      return;
    }
    if (friendState.activeGiftType === 'item') {
      const items = getAllGiftableShopItems();
      syncGiftSelectionDefaults();
      const selected = items.find(item => item.id === friendState.giftItemId);
      target.innerHTML = items.length && selected
        ? `<label class="gift-select-label"><span>选择要帮好友购买的装备</span><select data-gift-item-select>${items.map(item => {
          const pet = getPetInfo(item.exclusivePetId);
          const slot = getEquipmentSlotInfo(item.slot);
          return `<option value="${escapeHtml(item.id)}"${item.id === selected.id ? ' selected' : ''}>${escapeHtml(pet?.name || item.exclusivePetId)} · ${slot.icon} ${escapeHtml(item.name)} · ${Number(item.price || 0)} 金币</option>`;
        }).join('')}</select></label>
        <div class="gift-shop-preview"><img src="${escapeHtml(withAssetVersion(selected.image))}" alt="${escapeHtml(selected.name)}" loading="lazy" decoding="async" /><div><strong>${escapeHtml(selected.name)}</strong><small>${escapeHtml(getPetInfo(selected.exclusivePetId)?.name || selected.exclusivePetId)} 专属 · 会扣 ${Number(selected.price || 0)} 金币</small></div></div>
        <p class="muted-text">你的金币：${Number(student?.coins || 0)}</p>`
        : '<div class="empty-state compact-empty">商店里暂时没有可赠送的装备。</div>';
      return;
    }
    if (friendState.activeGiftType === 'blind-box') {
      syncGiftSelectionDefaults();
      target.innerHTML = `<div class="gift-shop-preview blind-box-preview">
        <img src="${escapeHtml(withAssetVersion(BLIND_BOX_IMAGE))}" alt="盲盒" loading="lazy" decoding="async" />
        <div><strong>神秘宠物盲盒</strong><small>会扣 ${BLIND_BOX_PRICE} 金币。好友领取后可开出 1 个未拥有宠物或音乐和 2 件随机装备。</small></div>
      </div>
      <p class="muted-text">你的金币：${Number(student?.coins || 0)}</p>`;
      return;
    }
    if (friendState.activeGiftType === 'music') {
      const tracks = getAllGiftableMusicTracks();
      syncGiftSelectionDefaults();
      const selected = tracks.find(track => track.id === friendState.giftMusicTrackId);
      target.innerHTML = tracks.length && selected
        ? `<label class="gift-select-label"><span>选择要送给好友的音乐</span><select data-gift-music-select>${tracks.map(track => `<option value="${escapeHtml(track.id)}"${track.id === selected.id ? ' selected' : ''}>${escapeHtml(track.series)} · ${escapeHtml(track.title)} · ${MUSIC_BOX_TRACK_PRICE} 金币</option>`).join('')}</select></label>
        <div class="gift-shop-preview music-gift-preview" style="--track-accent:${escapeHtml(getMusicTrackAccent(selected))}">
          <span class="music-gift-icon" aria-hidden="true">🎵</span>
          <div><strong>${escapeHtml(selected.title)}</strong><small>${escapeHtml(selected.series)} · 会扣 ${MUSIC_BOX_TRACK_PRICE} 金币</small></div>
          <button type="button" class="secondary-button" data-music-preview="${escapeHtml(selected.id)}">试听 30 秒</button>
        </div>
        <p class="muted-text">你的金币：${Number(student?.coins || 0)}</p>`
        : '<div class="empty-state compact-empty">音乐盒暂时没有可赠送的歌曲。</div>';
      return;
    }
    const entries = getAllGiftableShopPets();
    syncGiftSelectionDefaults();
    const selectedEntry = entries.find(entry => entry.pet.id === friendState.giftPetId);
    target.innerHTML = entries.length && selectedEntry
      ? `<label class="gift-select-label"><span>选择要帮好友购买的宠物</span><select data-gift-pet-select>${entries.map(({ pet, rarity }) => {
        const series = getPetSeriesInfo(getPetSeriesId(pet));
        return `<option value="${escapeHtml(pet.id)}"${pet.id === selectedEntry.pet.id ? ' selected' : ''}>${escapeHtml(series.label)} · ${escapeHtml(pet.name)} · ${escapeHtml(rarity.label)} · ${Number(rarity.price || 0)} 金币</option>`;
      }).join('')}</select></label>
      <div class="gift-shop-preview"><img src="${escapeHtml(getRolePreviewAsset(getVersionedRoleCardAsset(selectedEntry.pet.image) || selectedEntry.pet.image))}" alt="${escapeHtml(selectedEntry.pet.name)}" loading="lazy" decoding="async" /><div><strong>${escapeHtml(selectedEntry.pet.name)}</strong><small>${escapeHtml(getPetSeriesInfo(getPetSeriesId(selectedEntry.pet)).label)} · 会扣 ${Number(selectedEntry.rarity.price || 0)} 金币</small></div></div>
      <p class="muted-text">你的金币：${Number(student?.coins || 0)}</p>`
      : '<div class="empty-state compact-empty">商店里暂时没有可赠送的宠物。</div>';
  }

  function openGiftModal(friendId) {
    friendState.giftTargetId = HolidayBackendClient.normalizeId(friendId);
    friendState.activeGiftType = 'coins';
    friendState.giftAmount = FRIEND_GIFT_AMOUNTS[1];
    friendState.giftItemId = '';
    friendState.giftItemPetId = '';
    friendState.giftPetId = '';
    friendState.giftMusicTrackId = '';
    renderGiftModal();
    $('#friend-gift-overlay')?.classList.remove('hidden');
    applyLanguage($('#friend-gift-overlay'));
  }

  function closeGiftModal() {
    $('#friend-gift-overlay')?.classList.add('hidden');
  }

  async function sendCoinGiftFromModal() {
    const student = getStudent();
    if (!student || !friendState.giftTargetId) return false;
    const payload = {
      senderStudentId: student.studentId,
      receiverStudentId: friendState.giftTargetId,
      giftType: friendState.activeGiftType
    };
    if (friendState.activeGiftType === 'coins') payload.amount = Number(friendState.giftAmount || 0);
    if (friendState.activeGiftType === 'item') {
      payload.itemId = friendState.giftItemId;
      payload.petId = friendState.giftItemPetId || '';
      payload.amount = Number(friendState.giftAmount || 0);
    }
    if (friendState.activeGiftType === 'pet') {
      const pet = getPetInfo(friendState.giftPetId);
      payload.petId = friendState.giftPetId;
      payload.amount = Number(friendState.giftAmount || 0);
      payload.petPayload = pet ? {
        petId: pet.id,
        petName: pet.name,
        rarity: pet.rarity,
        petLevel: 1,
        experience: 0,
        equippedItems: {},
        ownedItems: [],
        birthday: '',
        evolved: false,
        miniEvolved: false
      } : {};
    }
    if (friendState.activeGiftType === 'blind-box') payload.amount = BLIND_BOX_PRICE;
    if (friendState.activeGiftType === 'music') {
      payload.itemId = friendState.giftMusicTrackId;
      payload.amount = MUSIC_BOX_TRACK_PRICE;
    }
    const result = await backend.sendGift(payload);
    if (!result.ok) {
      showToast(result.error || '礼物赠送失败。');
      return false;
    }
    if (result.student) {
      database[student.studentId] = HolidayBackendClient.normalizeStudent(result.student, [], database[student.studentId]);
      saveDatabase();
      renderAppShell();
      renderActiveStudentView();
    }
    closeGiftModal();
    showToast('礼物已经送出。');
    await loadFriendsDashboard(true);
    return true;
  }

  function getNotificationGiftId(notification = {}) {
    return String(notification.payload?.giftId || notification.payload?.gift_id || '').trim();
  }

  function isPendingGiftNotification(notification = {}) {
    return String(notification.type || '').startsWith('gift-') && getNotificationGiftId(notification) && !notification.claimedAt;
  }

  function isNotificationClearable(notification = {}) {
    return Boolean(notification.notificationId) && !isPendingGiftNotification(notification);
  }

  function getGiftTypeFromNotification(notification = {}) {
    const type = String(notification.type || '');
    return type.startsWith('gift-') ? type.replace(/^gift-/, '') : '';
  }

  function getGiftRevealImageForType(giftType = '') {
    return giftType === 'blind-box' ? withAssetVersion(BLIND_BOX_IMAGE) : withAssetVersion(GIFT_BOX_IMAGE);
  }

  function getGiftSenderDisplayName(senderId = '') {
    const friend = getFriendById(senderId);
    return friend?.studentName || senderId || '好友';
  }

  function buildGiftMessageHtml(senderName, giftLabel) {
    return `你获得了来自 <span class="gift-sender-name">${escapeHtml(senderName || '好友')}</span> 赠送的 <strong>${escapeHtml(giftLabel || '礼物')}</strong>。`;
  }

  async function claimGiftById(giftId) {
    const student = getStudent();
    if (!student || !giftId) return false;
    const result = await backend.claimGift(student.studentId, giftId);
    if (!result.ok) {
      showToast(result.error || '礼物领取失败。');
      return false;
    }
    if (result.student) {
      database[student.studentId] = HolidayBackendClient.normalizeStudent(result.student, [], database[student.studentId]);
      saveDatabase();
      renderAppShell();
      renderActiveStudentView();
    }
    const giftType = String(result.gift?.gift_type || result.gift?.giftType || '');
    const senderId = HolidayBackendClient.normalizeId(result.gift?.sender_student_id || result.gift?.senderStudentId);
    const senderName = getGiftSenderDisplayName(senderId);
    const giftLabel = getGiftRewardLabel(result.gift);
    const giftedPetId = giftType === 'pet' ? String(result.gift?.pet_id || result.gift?.petId || '') : '';
    const revealConfig = giftType === 'blind-box'
      ? {
        title: '获得盲盒！',
        customMessageHtml: buildGiftMessageHtml(senderName, giftLabel),
        revealRequired: true,
        revealImage: withAssetVersion(BLIND_BOX_IMAGE),
        revealLabel: '点击开启盲盒',
        revealAction: 'openBlindBox',
        forceReplace: true
      }
      : {
        title: '恭喜获得！',
        customMessageHtml: buildGiftMessageHtml(senderName, giftLabel),
        rewards: buildGiftClaimRewardSummary(result.gift),
        onClose: giftedPetId ? () => openPetRenameModal(giftedPetId) : null,
        forceReplace: true
      };
    showGiftClaimModal({
      title: '收到礼物！',
      message: '画面中出现了一个发光的礼物，点击它看看里面是什么。',
      revealRequired: true,
      revealImage: getGiftRevealImageForType(giftType),
      revealLabel: giftType === 'blind-box' ? '点击领取盲盒' : '点击打开礼物',
      revealConfig,
      forceReplace: true
    });
    await loadFriendsDashboard(true);
    return true;
  }

  async function claimGiftFromButton(button) {
    return claimGiftById(String(button?.dataset.giftClaim || ''));
  }

  function maybePromptPendingGiftNotifications() {
    const student = getStudent();
    if (!student || !canUseFriendsBackend(student) || !friendState.loaded) return false;
    const notification = friendState.notifications.find(item => {
      const giftId = getNotificationGiftId(item);
      if (!item.type.startsWith('gift-') || !giftId || item.claimedAt) return false;
      return !promptedGiftNotificationKeys.has(`${item.notificationId}:${giftId}`);
    });
    if (!notification) return false;
    const giftId = getNotificationGiftId(notification);
    const promptKey = `${notification.notificationId}:${giftId}`;
    promptedGiftNotificationKeys.add(promptKey);
    const giftType = getGiftTypeFromNotification(notification);
    const senderName = getGiftSenderDisplayName(notification.actorStudentId);
    showGiftClaimModal({
      title: '有人送你礼物！',
      customMessageHtml: `<span class="gift-sender-name">${escapeHtml(senderName)}</span> 送了一份${giftType === 'blind-box' ? '神秘盲盒' : giftType === 'music' ? '音乐礼物' : '礼物'}给你。`,
      revealRequired: true,
      revealImage: getGiftRevealImageForType(giftType),
      revealLabel: giftType === 'blind-box' ? '点击领取盲盒' : '点击领取礼物',
      revealAction: 'claimGift',
      giftType,
      giftId
    });
    return true;
  }

  function getGiftRewardLabel(gift = {}) {
    const giftType = String(gift.gift_type || gift.giftType || '');
    if (giftType === 'coins') return `${Number(gift.amount || 0)} 金币`;
    if (giftType === 'item') {
      const item = EQUIPMENT_CATALOG.find(entry => entry.id === String(gift.item_id || gift.itemId || ''));
      return item ? getEquipmentDisplayName(item) : '一件装备';
    }
    if (giftType === 'pet') {
      const pet = getPetInfo(String(gift.pet_id || gift.petId || ''));
      return pet ? pet.name : '一只宠物';
    }
    if (giftType === 'blind-box') return '神秘宠物盲盒';
    if (giftType === 'music') {
      const track = getMusicTrackById(String(gift.item_id || gift.itemId || ''));
      return track ? `音乐《${track.title}》` : '一首音乐';
    }
    return '一份礼物';
  }

  function buildGiftClaimRewardSummary(gift = {}) {
    const giftType = String(gift.gift_type || gift.giftType || '');
    if (giftType === 'coins') return { coins: Number(gift.amount || 0), pets: [], items: [], music: [], duplicates: [] };
    if (giftType === 'item') {
      const item = EQUIPMENT_CATALOG.find(entry => entry.id === String(gift.item_id || gift.itemId || ''));
      return { coins: 0, pets: [], items: item ? [{ id: item.id, name: getEquipmentDisplayName(item), image: item.image, petId: item.exclusivePetId }] : [], music: [], duplicates: [] };
    }
    if (giftType === 'pet') {
      const pet = getPetInfo(String(gift.pet_id || gift.petId || ''));
      return { coins: 0, pets: pet ? [{ id: pet.id, name: pet.name, image: getVersionedRoleCardAsset(pet.image) || pet.image, rarity: pet.rarity }] : [], items: [], music: [], duplicates: [] };
    }
    if (giftType === 'music') {
      const track = getMusicTrackById(String(gift.item_id || gift.itemId || ''));
      return { coins: 0, pets: [], items: [], music: track ? [{ id: track.id, name: track.title, series: track.series, accent: getMusicTrackAccent(track) }] : [], duplicates: [] };
    }
    return { coins: 0, pets: [], items: [], music: [], duplicates: [] };
  }

  function renderRewardSummary(rewards = {}) {
    const pets = Array.isArray(rewards.pets) ? rewards.pets : [];
    const items = Array.isArray(rewards.items) ? rewards.items : [];
    const music = Array.isArray(rewards.music) ? rewards.music : [];
    const duplicates = Array.isArray(rewards.duplicates) ? rewards.duplicates : [];
    const coins = Math.max(0, Math.floor(Number(rewards.coins || 0)));
    const rows = [];
    pets.forEach(pet => rows.push(`<div class="reward-row reward-row-pet">
      <img src="${escapeHtml(getRolePreviewAsset(pet.image || ''))}" alt="${escapeHtml(pet.name || '宠物')}" loading="lazy" decoding="async" />
      <span><strong>${escapeHtml(pet.name || '新宠物')}</strong><small>${escapeHtml(getPetRarityDisplayLabel(pet.rarity || 'A'))} · 已加入宠物商店收藏</small></span>
    </div>`));
    items.forEach(item => rows.push(`<div class="reward-row reward-row-item">
      <img src="${escapeHtml(withAssetVersion(item.image || ''))}" alt="${escapeHtml(item.name || '装备')}" loading="lazy" decoding="async" />
      <span><strong>${escapeHtml(item.name || '新装备')}</strong><small>${escapeHtml(getPetInfo(item.petId)?.name || item.petId || '专属装备')} · 已加入对应宠物装备库</small></span>
    </div>`));
    music.forEach(track => rows.push(`<div class="reward-row reward-row-music" style="--track-accent:${escapeHtml(getMusicTrackAccent(track))}">
      <span class="reward-coin-icon">🎵</span>
      <span><strong>${escapeHtml(track.name || '新音乐')}</strong><small>${escapeHtml(track.series || '音乐盒')} · 已加入你的音乐盒</small></span>
    </div>`));
    if (coins) rows.push(`<div class="reward-row reward-row-coins"><span class="reward-coin-icon">🪙</span><span><strong>${coins} 金币</strong><small>已加入你的金币</small></span></div>`);
    duplicates.forEach(duplicate => {
      const duplicateIcon = duplicate.type === 'music' ? '🎵' : '🎁';
      const friendOptions = friendState.friends.length
        ? friendState.friends.map(friend => `<option value="${escapeHtml(friend.studentId)}">${escapeHtml(friend.petName || friend.studentName || friend.studentId)}</option>`).join('')
        : '';
      rows.push(`<div class="reward-row reward-row-duplicate" data-duplicate-row="${escapeHtml(duplicate.duplicateId)}">
        ${duplicate.image ? `<img src="${escapeHtml(getRolePreviewAsset(duplicate.image))}" alt="${escapeHtml(duplicate.name)}" loading="lazy" decoding="async" />` : `<span class="reward-coin-icon">${duplicateIcon}</span>`}
        <span><strong>重复：${escapeHtml(duplicate.name || '奖励')}</strong><small>可以换 ${Number(duplicate.coinValue || 0)} 金币，或直接送给好友。</small></span>
        <div class="duplicate-actions">
          <button type="button" class="secondary-button" data-blind-duplicate-coins="${escapeHtml(duplicate.duplicateId)}">换金币</button>
          <label><span class="sr-only">选择好友</span><select data-blind-duplicate-friend="${escapeHtml(duplicate.duplicateId)}"${friendOptions ? '' : ' disabled'}>${friendOptions || '<option>暂无好友</option>'}</select></label>
          <button type="button" class="primary-button" data-blind-duplicate-send="${escapeHtml(duplicate.duplicateId)}"${friendOptions ? '' : ' disabled'}>送好友</button>
        </div>
      </div>`);
    });
    return rows.length ? `<div class="reward-list">${rows.join('')}</div>` : '';
  }

  function showGiftClaimModal(config = {}) {
    const normalized = typeof config === 'string' ? { message: config } : { ...config };
    const overlay = $('#gift-claim-overlay');
    if (!overlay) return;
    if (!normalized.forceReplace && giftRevealState && !overlay.classList.contains('hidden')) {
      giftRevealQueue.push(normalized);
      return;
    }
    giftRevealState = normalized;
    const title = $('#gift-claim-title');
    const target = $('#gift-claim-message');
    const rewardsTarget = $('#gift-claim-rewards');
    const revealButton = $('#gift-reveal-button');
    const revealImage = $('#gift-reveal-image');
    const revealLabel = $('#gift-reveal-label');
    if (title) title.textContent = normalized.title || '恭喜获得！';
    if (target) {
      if (normalized.customMessageHtml) target.innerHTML = normalized.customMessageHtml;
      else target.textContent = normalized.message || '礼物已经收下。';
    }
    if (rewardsTarget) {
      rewardsTarget.innerHTML = normalized.customHtml || (normalized.revealRequired ? '' : renderRewardSummary(normalized.rewards || {}));
    }
    if (revealButton) {
      revealButton.classList.toggle('hidden', !normalized.revealRequired);
      revealButton.disabled = !normalized.revealRequired;
    }
    if (revealImage) revealImage.src = normalized.revealImage || withAssetVersion(GIFT_BOX_IMAGE);
    if (revealLabel) revealLabel.textContent = normalized.revealLabel || '点击打开';
    overlay.classList.remove('hidden');
    applyLanguage(overlay);
  }

  function closeGiftClaimModal() {
    const completedState = giftRevealState;
    $('#gift-claim-overlay')?.classList.add('hidden');
    giftRevealState = null;
    const next = giftRevealQueue.shift();
    if (next) {
      setTimeout(() => showGiftClaimModal({ ...next, forceReplace: true }), 140);
      return;
    }
    if (typeof completedState?.onClose === 'function') {
      setTimeout(() => completedState.onClose(), 160);
    }
  }

  async function openGiftReveal() {
    if (!giftRevealState) return false;
    if (giftRevealState.revealAction === 'openBlindBox') {
      playUiSound('blindBox');
      return openBlindBoxFromInventory({ forceReplaceModal: true });
    }
    if (giftRevealState.revealAction === 'claimGift') {
      playUiSound(giftRevealState.giftType === 'blind-box' ? 'blindBox' : 'gift');
      return claimGiftById(String(giftRevealState.giftId || ''));
    }
    playUiSound('gift');
    if (giftRevealState.revealConfig) {
      showGiftClaimModal(giftRevealState.revealConfig);
      return true;
    }
    showGiftClaimModal({ ...giftRevealState, revealRequired: false, forceReplace: true });
    return true;
  }

  async function buyBlindBox() {
    const triggerButton = buyBlindBox.triggerButton || arguments[0] || null;
    const student = getStudent();
    if (!student || student.demoMode) return false;
    if (Number(student.coins || 0) < BLIND_BOX_PRICE) {
      showButtonInlineError(triggerButton, '金币不足');
      return false;
    }
    const snapshot = cloneStudentState(student);
    student.coins = Math.max(0, Math.floor(Number(student.coins || 0))) - BLIND_BOX_PRICE;
    student.blindBoxes = Math.max(0, Math.floor(Number(student.blindBoxes || 0))) + 1;
    const saved = await commitStudentState(student, snapshot, { type: 'purchaseBlindBox', price: BLIND_BOX_PRICE }, () => {
      renderAppShell();
      renderActiveStudentView();
    });
    if (!saved) return false;
    playUiSound('gift');
    showGiftClaimModal({
      title: '获得盲盒！',
      message: '神秘宠物盲盒已经到手，点击盲盒开启。',
      revealRequired: true,
      revealImage: withAssetVersion(BLIND_BOX_IMAGE),
      revealLabel: '点击开启盲盒'
    });
    giftRevealState.revealAction = 'openBlindBox';
    return true;
  }

  async function openBlindBoxFromInventory(options = {}) {
    const student = getStudent();
    if (!student || student.demoMode) return false;
    if (Math.max(0, Math.floor(Number(student.blindBoxes || 0))) <= 0) {
      showToast('你现在没有可以开启的盲盒。');
      return false;
    }
    const snapshot = cloneStudentState(student);
    student.blindBoxes = Math.max(0, Math.floor(Number(student.blindBoxes || 0))) - 1;
    const rewards = rollBlindBoxRewards(student);
    const saved = await commitStudentState(student, snapshot, { type: 'openBlindBox', rewards }, () => {
      renderAppShell();
      renderActiveStudentView();
    });
    if (!saved) return false;
    if (rewards.duplicates?.length && canUseFriendsBackend(student)) {
      await loadFriendsDashboard(true);
    }
    const summaryParts = [
      rewards.pets?.length ? `${rewards.pets.length} 只宠物` : '',
      rewards.music?.length ? `${rewards.music.length} 首音乐` : '',
      rewards.items?.length ? `${rewards.items.length} 件装备` : '',
      rewards.duplicates?.length ? `${rewards.duplicates.length} 个重复奖励待处理` : '',
      rewards.coins ? `${rewards.coins} 金币` : ''
    ].filter(Boolean);
    const newPetId = rewards.pets?.[0]?.id || '';
    showGiftClaimModal({
      title: '盲盒开启！',
      message: summaryParts.length ? `你抽到了 ${summaryParts.join('、')}。` : '盲盒已经开启。',
      rewards,
      onClose: newPetId ? () => openPetRenameModal(newPetId) : null,
      forceReplace: Boolean(options.forceReplaceModal)
    });
    playUiSound('reward');
    return true;
  }

  function removeBlindBoxDuplicateFromLocal(student, duplicateId) {
    if (!student || !Array.isArray(student.pendingBlindBoxDuplicates)) return null;
    const duplicate = student.pendingBlindBoxDuplicates.find(entry => String(entry.duplicateId) === String(duplicateId));
    student.pendingBlindBoxDuplicates = student.pendingBlindBoxDuplicates.filter(entry => String(entry.duplicateId) !== String(duplicateId));
    return duplicate || null;
  }

  function removeDuplicateRewardRow(duplicateId) {
    const row = $all('[data-duplicate-row]').find(element => String(element.dataset.duplicateRow) === String(duplicateId));
    if (row) row.remove();
    const rewardsTarget = $('#gift-claim-rewards');
    if (rewardsTarget && !rewardsTarget.querySelector('.reward-row')) {
      rewardsTarget.innerHTML = '<p class="muted-text">重复奖励已经处理完毕。</p>';
    }
  }

  async function resolveBlindBoxDuplicateAsCoins(button) {
    const student = getStudent();
    const duplicateId = String(button?.dataset.blindDuplicateCoins || '');
    if (!student || !duplicateId) return false;
    const duplicate = student.pendingBlindBoxDuplicates?.find(entry => String(entry.duplicateId) === duplicateId);
    if (!duplicate) {
      showToast('这个重复奖励已经处理过了。');
      removeDuplicateRewardRow(duplicateId);
      return false;
    }
    const snapshot = cloneStudentState(student);
    removeBlindBoxDuplicateFromLocal(student, duplicateId);
    student.coins = Math.max(0, Math.floor(Number(student.coins || 0))) + Math.max(0, Math.floor(Number(duplicate.coinValue || 0)));
    const saved = await commitStudentState(student, snapshot, { type: 'resolveBlindBoxDuplicateCoins', duplicateId, amount: duplicate.coinValue }, () => {
      renderAppShell();
      renderActiveStudentView();
    });
    if (!saved) return false;
    removeDuplicateRewardRow(duplicateId);
    showToast(`已换成 ${Number(duplicate.coinValue || 0)} 金币。`);
    return true;
  }

  async function sendBlindBoxDuplicateToFriend(button) {
    const student = getStudent();
    const duplicateId = String(button?.dataset.blindDuplicateSend || '');
    const row = button?.closest('[data-duplicate-row]');
    const receiverId = HolidayBackendClient.normalizeId(row?.querySelector(`[data-blind-duplicate-friend]`)?.value);
    if (!student || !duplicateId || !receiverId) return false;
    if (!canUseFriendsBackend(student)) {
      showToast('送好友需要连接 Supabase 云端。');
      return false;
    }
    const result = await backend.sendBlindBoxDuplicateGift({
      senderStudentId: student.studentId,
      receiverStudentId: receiverId,
      duplicateId
    });
    if (!result.ok) {
      showToast(result.error || '重复奖励送出失败。');
      return false;
    }
    if (result.student) {
      database[student.studentId] = HolidayBackendClient.normalizeStudent(result.student, [], database[student.studentId]);
      saveDatabase();
      renderAppShell();
      renderActiveStudentView();
    }
    removeDuplicateRewardRow(duplicateId);
    showToast('重复奖励已经送给好友。');
    await loadFriendsDashboard(true);
    return true;
  }

  async function markNotificationReadFromButton(button) {
    const student = getStudent();
    const notificationId = String(button?.dataset.notificationRead || '');
    if (!student || !notificationId) return false;
    const result = await backend.markNotificationRead(student.studentId, notificationId);
    if (!result.ok) {
      showToast(result.error || '通知删除失败。');
      return false;
    }
    await loadFriendsDashboard(true);
    return true;
  }

  async function clearReadNotificationsFromButton() {
    const student = getStudent();
    if (!student) return false;
    const result = await backend.clearReadNotifications(student.studentId);
    if (!result.ok) {
      showToast(result.error || '通知清理失败。');
      return false;
    }
    friendState.notifications = (result.notifications || []).map(normalizeNotification);
    friendState.requests = (result.requests || []).map(normalizeFriendRequest);
    renderFriendsView();
    showToast('已删除通知。');
    return true;
  }

  function hasActiveInteractionRoom() {
    return Boolean(interactionRoomState.activeRoomId && interactionRoomState.room);
  }

  function normalizeInteractionPassword(value) {
    return String(value || '').replace(/\D/g, '').slice(0, 4);
  }

  function getPermanentInteractionRoomFallbackConfig(roomId) {
    const safeRoomId = String(roomId || '').trim().toUpperCase();
    return PERMANENT_INTERACTION_ROOM_FALLBACKS.find(room => room.roomId === safeRoomId) || null;
  }

  function applyPermanentInteractionRoomFallbackConfig(room = {}) {
    const roomId = String(room.roomId || room.room_id || '').trim().toUpperCase();
    const fallback = getPermanentInteractionRoomFallbackConfig(roomId);
    if (!fallback) return room;
    return {
      ...room,
      roomId: fallback.roomId,
      room_id: fallback.roomId,
      roomName: fallback.roomName,
      room_name: fallback.roomName,
      ownerStudentId: fallback.ownerStudentId,
      owner_student_id: fallback.ownerStudentId,
      ownerName: fallback.ownerName,
      owner_name: fallback.ownerName,
      mapSetId: fallback.mapSetId,
      map_set_id: fallback.mapSetId,
      memberLimit: fallback.memberLimit,
      member_limit: fallback.memberLimit,
      isLocked: false,
      is_locked: false,
      isPermanent: true,
      is_permanent: true
    };
  }

  function normalizeInteractionRoomSummary(room = {}) {
    const source = applyPermanentInteractionRoomFallbackConfig(room);
    const roomId = String(source.roomId || source.room_id || '').trim().toUpperCase();
    const memberLimit = Math.max(1, Number(source.memberLimit || source.member_limit || ROOM_MEMBER_LIMIT));
    const mapSetId = normalizeInteractionRoomMapSetId(source.mapSetId || source.map_set_id);
    const mapSet = getInteractionRoomMapSetById(mapSetId);
    const players = (Array.isArray(source.players) ? source.players : []).map(normalizeInteractionRoomPlayer).filter(player => player.studentId);
    return {
      roomId,
      roomName: String(source.roomName || source.room_name || '小小房间').trim(),
      ownerStudentId: HolidayBackendClient.normalizeId(source.ownerStudentId || source.owner_student_id || source.ownerId || source.owner_id),
      ownerName: HolidayBackendClient.getCanonicalStudentName(source.ownerStudentId || source.owner_student_id || source.ownerId || source.owner_id, source.ownerName || source.owner_name || '同学'),
      isLocked: Boolean(source.isLocked || source.is_locked),
      isPermanent: Boolean(source.isPermanent || source.is_permanent),
      mapSetId,
      mapSetName: mapSet?.name || 'CY小镇',
      memberCount: Math.max(0, Math.min(memberLimit, Number(source.memberCount || source.member_count || 0))),
      memberLimit,
      players,
      createdAt: String(source.createdAt || source.created_at || ''),
      updatedAt: String(source.updatedAt || source.updated_at || '')
    };
  }

  function getInteractionRoomFallbackRooms() {
    return PERMANENT_INTERACTION_ROOM_FALLBACKS.map(room => normalizeInteractionRoomSummary({
      ...room,
      memberCount: 0,
      players: [],
      createdAt: '',
      updatedAt: ''
    })).filter(room => room.roomId);
  }

  function mergeInteractionRoomFallbackRooms(rooms = []) {
    const roomById = new Map();
    const fallbackRooms = getInteractionRoomFallbackRooms();
    const fallbackOrder = new Map(fallbackRooms.map((room, index) => [room.roomId, index]));
    fallbackRooms.forEach(room => roomById.set(room.roomId, room));
    (Array.isArray(rooms) ? rooms : []).map(normalizeInteractionRoomSummary).forEach(room => {
      if (room.roomId) roomById.set(room.roomId, room);
    });
    return Array.from(roomById.values())
      .sort((a, b) => {
        const orderA = fallbackOrder.has(a.roomId) ? fallbackOrder.get(a.roomId) : 1000;
        const orderB = fallbackOrder.has(b.roomId) ? fallbackOrder.get(b.roomId) : 1000;
        return orderA - orderB || Number(b.memberCount > 0) - Number(a.memberCount > 0) || String(a.roomName).localeCompare(String(b.roomName));
      });
  }

  function normalizeInteractionRoomPlayer(player = {}) {
    const studentId = HolidayBackendClient.normalizeId(player.studentId || player.student_id);
    const studentName = String(player.studentName || player.student_name || '');
    const petId = String(player.petId || player.pet_id || 'kuromi');
    return {
      studentId,
      studentName,
      petId,
      petName: normalizeInteractionRoomPetName(player.petName || player.pet_name, { studentId, studentName }),
      petSize: normalizeInteractionRoomPetSize(player.petSize || player.pet_size || player.roomPetSize || player.room_pet_size),
      petStage: normalizeInteractionRoomPetStage(player.petStage || player.pet_stage || player.evolutionStage || player.evolution_stage),
      petStyle: normalizeInteractionRoomPetStyle(player.petStyle || player.pet_style || player.evolutionStyle || player.evolution_style, petId),
      mapId: String(player.mapId || player.map_id || 'home'),
      x: Number(player.x || KUROMI_ROOM_DEMO.playerStartX),
      y: Number(player.y || 0),
      facing: Number(player.facing || 1) < 0 ? -1 : 1,
      action: String(player.action || 'idle'),
      message: String(player.message || ''),
      messageUntil: String(player.messageUntil || player.message_until || ''),
      lastSeenAt: String(player.lastSeenAt || player.last_seen_at || '')
    };
  }

  function sameInteractionRoomPublicName(first = '', second = '') {
    const left = String(first || '').trim().toLocaleLowerCase();
    const right = String(second || '').trim().toLocaleLowerCase();
    return Boolean(left && right && left === right);
  }

  function normalizeInteractionRoomPetName(value = '', player = {}) {
    const petName = String(value || '').trim();
    if (!petName) return '';
    const studentName = String(player.studentName || player.student_name || '').trim();
    const studentId = HolidayBackendClient.normalizeId(player.studentId || player.student_id);
    if (sameInteractionRoomPublicName(petName, studentName) || sameInteractionRoomPublicName(petName, studentId)) return '';
    return petName;
  }

  function getInteractionRoomPlayerPetId(player = getStudent()) {
    const student = getStudent();
    return String(player?.petId || player?.pet_id || player?.petType || player?.pet_type || student?.petType || 'kuromi')
      .trim()
      .toLowerCase();
  }

  function normalizeInteractionRoomPetStage(value = 'base') {
    const stage = String(value || '').trim().toLowerCase();
    return ['base', 'mini', 'final'].includes(stage) ? stage : 'base';
  }

  function normalizeInteractionRoomPetStyle(value = EVOLUTION_STYLE_HEROIC, petId = '') {
    const style = String(value || '').trim().toLowerCase();
    return normalizePetEvolutionFormForPet(style === EVOLUTION_STYLE_CUTE ? EVOLUTION_STYLE_CUTE : EVOLUTION_STYLE_HEROIC, petId);
  }

  function getInteractionRoomPetStage(student = getStudent(), petId = student?.petType) {
    const safePetId = String(petId || student?.petType || '').trim().toLowerCase();
    if (!student || !safePetId) return 'base';
    const activeForm = getActivePetEvolutionForm(student, safePetId);
    if (isFinalEvolutionForm(activeForm)) return 'final';
    if (activeForm === PET_EVOLUTION_FORM_MINI) return 'mini';
    return 'base';
  }

  function getInteractionRoomPetStyle(student = getStudent(), petId = student?.petType) {
    return normalizeInteractionRoomPetStyle(getPetEvolutionStyle(student, petId), petId);
  }

  function getInteractionRoomPlayerPetStage(player = getStudent()) {
    const explicitStage = player?.petStage || player?.pet_stage || player?.evolutionStage || player?.evolution_stage;
    if (explicitStage) return normalizeInteractionRoomPetStage(explicitStage);
    const currentStudent = getStudent();
    const playerStudentId = HolidayBackendClient.normalizeId(player?.studentId || player?.student_id);
    const currentStudentId = HolidayBackendClient.normalizeId(currentStudent?.studentId);
    if (!player || !playerStudentId || playerStudentId === currentStudentId) {
      return getInteractionRoomPetStage(currentStudent, getInteractionRoomPlayerPetId(player));
    }
    return 'base';
  }

  function getInteractionRoomPlayerPetStyle(player = getStudent()) {
    const explicitStyle = player?.petStyle || player?.pet_style || player?.evolutionStyle || player?.evolution_style;
    if (explicitStyle) return normalizeInteractionRoomPetStyle(explicitStyle, getInteractionRoomPlayerPetId(player));
    const currentStudent = getStudent();
    const playerStudentId = HolidayBackendClient.normalizeId(player?.studentId || player?.student_id);
    const currentStudentId = HolidayBackendClient.normalizeId(currentStudent?.studentId);
    if (!player || !playerStudentId || playerStudentId === currentStudentId) {
      return getInteractionRoomPetStyle(currentStudent, getInteractionRoomPlayerPetId(player));
    }
    return normalizeInteractionRoomPetStyle(EVOLUTION_STYLE_HEROIC, getInteractionRoomPlayerPetId(player));
  }

  function getInteractionRoomPetRenderSettings(player = getStudent()) {
    const petId = getInteractionRoomPlayerPetId(player);
    const baseSettings = INTERACTION_ROOM_PET_RENDER_SETTINGS[petId] || {};
    const petStyle = getInteractionRoomPlayerPetStyle(player);
    const settings = { ...baseSettings };
    const finalFlying = INTERACTION_ROOM_FINAL_FLYING_PET_IDS.has(petId)
      && getInteractionRoomPlayerPetStage(player) === 'final';
    if (!finalFlying) return settings;
    return {
      ...settings,
      floatOffset: Math.max(Number(settings.floatOffset || 0), petId === 'hydroblob' ? 98 : 92),
      flying: true
    };
  }

  function isInteractionRoomFlyingPet(player = getStudent()) {
    return Boolean(getInteractionRoomPetRenderSettings(player).flying);
  }

  function isInteractionRoomAlwaysFloatingPet(player = getStudent()) {
    return Boolean(getInteractionRoomPetRenderSettings(player).alwaysFloating);
  }

  function normalizeInteractionRoomPetSize(value = INTERACTION_ROOM_DEFAULT_PET_SIZE) {
    const size = String(value || '').trim().toLowerCase();
    return INTERACTION_ROOM_PET_SIZE_OPTIONS.some(option => option.id === size) ? size : INTERACTION_ROOM_DEFAULT_PET_SIZE;
  }

  function getInteractionRoomPetSizeOption(value = INTERACTION_ROOM_DEFAULT_PET_SIZE) {
    const size = normalizeInteractionRoomPetSize(value);
    return INTERACTION_ROOM_PET_SIZE_OPTIONS.find(option => option.id === size) || INTERACTION_ROOM_PET_SIZE_OPTIONS[0];
  }

  function getInteractionRoomPetSizeStorageKey(student = getStudent()) {
    const studentId = HolidayBackendClient.normalizeId(student?.studentId || session.studentId);
    return studentId ? `${INTERACTION_ROOM_PET_SIZE_STORAGE_KEY}:${studentId}` : INTERACTION_ROOM_PET_SIZE_STORAGE_KEY;
  }

  function readInteractionRoomStoredPetSize(student = getStudent()) {
    try {
      return localStorage.getItem(getInteractionRoomPetSizeStorageKey(student)) || '';
    } catch (_) {
      return '';
    }
  }

  function getInteractionRoomSelectedPetSize(student = getStudent()) {
    return normalizeInteractionRoomPetSize(
      student?.interactionRoomPetSize
      || student?.interaction_room_pet_size
      || readInteractionRoomStoredPetSize(student)
    );
  }

  function setInteractionRoomSelectedPetSize(sizeId, student = getStudent()) {
    const safeSize = normalizeInteractionRoomPetSize(sizeId);
    if (student) student.interactionRoomPetSize = safeSize;
    try {
      localStorage.setItem(getInteractionRoomPetSizeStorageKey(student), safeSize);
    } catch (_) {
      // Local storage may be disabled in private browsing.
    }
    saveDatabase();
    return safeSize;
  }

  function getInteractionRoomPlayerPetSize(player = null) {
    const explicitSize = player?.petSize || player?.pet_size || player?.roomPetSize || player?.room_pet_size;
    if (explicitSize) return normalizeInteractionRoomPetSize(explicitSize);
    const currentStudent = getStudent();
    const playerStudentId = HolidayBackendClient.normalizeId(player?.studentId || player?.student_id);
    const currentStudentId = HolidayBackendClient.normalizeId(currentStudent?.studentId);
    if (!player || !playerStudentId || playerStudentId === currentStudentId) return getInteractionRoomSelectedPetSize(currentStudent);
    return INTERACTION_ROOM_DEFAULT_PET_SIZE;
  }

  function getInteractionRoomPlayerRenderScale(player = getStudent()) {
    const petSettings = getInteractionRoomPetRenderSettings(player);
    const sizeOption = getInteractionRoomPetSizeOption(getInteractionRoomPlayerPetSize(player));
    return Math.max(Number(sizeOption.scale || 1), Number(petSettings.scale || 1));
  }

  function getInteractionRoomPlayerFloatOffset(player = getStudent(), action = '', groundY = KUROMI_ROOM_DEMO.fallbackGroundY, renderScale = getInteractionRoomPlayerRenderScale(player)) {
    const petSettings = getInteractionRoomPetRenderSettings(player);
    const configuredFloatOffset = Math.max(0, Number(petSettings.floatOffset || 0));
    if (!configuredFloatOffset && !petSettings.flying) return 0;
    const alwaysFloating = Boolean(petSettings.alwaysFloating);
    if (petSettings.flying && !alwaysFloating && (player?.flightGrounded === true || (action && action !== 'fly'))) return 0;
    const safeGroundY = Math.max(KUROMI_ROOM_DEMO.runHeight, Number(groundY || KUROMI_ROOM_DEMO.fallbackGroundY));
    const safeRenderScale = Math.max(0.35, Math.min(INTERACTION_ROOM_MAX_RENDER_SCALE, Number(renderScale || 1)));
    const flyCenterY = safeGroundY * (1 - INTERACTION_ROOM_FLY_HEIGHT_RATIO);
    const flyHeightOffset = safeGroundY - flyCenterY - (getKuromiRoomActionHeight('fly') * safeRenderScale) / 2;
    const floatOffset = petSettings.flying
      ? Math.max(configuredFloatOffset, flyHeightOffset)
      : configuredFloatOffset;
    const actionFloatMultiplier = alwaysFloating && action === 'duck'
      ? 0.68
      : (alwaysFloating && action === 'lie' ? 0.78 : 1);
    return Math.max(0, Math.min(INTERACTION_ROOM_MAX_FLOAT_OFFSET, Math.round(floatOffset * actionFloatMultiplier)));
  }

  function getInteractionRoomHeadNameParts(petName = '', playerName = '') {
    const cleanPetName = String(petName || '').trim() || '朋友宠物';
    const cleanPlayerName = String(playerName || '').trim();
    return {
      petName: cleanPetName,
      playerName: (!cleanPlayerName || sameInteractionRoomPublicName(cleanPetName, cleanPlayerName)) ? '' : `（${cleanPlayerName}）`
    };
  }

  function formatInteractionRoomHeadName(petName = '', playerName = '') {
    return getInteractionRoomHeadNameParts(petName, playerName).petName;
  }

  function getInteractionRoomPlayerPetDisplayName(player = {}) {
    const petId = String(player.petId || player.pet_id || 'kuromi');
    return normalizeInteractionRoomPetName(player.petName || player.pet_name, player) || getPetInfo(petId)?.name || '朋友宠物';
  }

  function getInteractionRoomPlayerHeadName(player = {}) {
    return getInteractionRoomPlayerHeadParts(player).petName;
  }

  function getInteractionRoomPlayerHeadParts(player = {}) {
    const petName = getInteractionRoomPlayerPetDisplayName(player);
    const playerName = String(player.studentName || player.student_name || player.studentId || player.student_id || '').trim();
    return getInteractionRoomHeadNameParts(petName, playerName);
  }

  function upsertInteractionRoomSummary(room = {}, extraPlayers = []) {
    const summary = normalizeInteractionRoomSummary({
      ...room,
      players: [
        ...(Array.isArray(room.players) ? room.players : []),
        ...(Array.isArray(extraPlayers) ? extraPlayers : [])
      ]
    });
    if (!summary.roomId) return null;
    const rooms = Array.isArray(interactionRoomState.rooms) ? interactionRoomState.rooms : [];
    const existingIndex = rooms.findIndex(item => item.roomId === summary.roomId);
    summary.memberCount = Math.min(summary.memberLimit, Math.max(summary.memberCount, summary.players.length));
    if (existingIndex < 0) {
      interactionRoomState.rooms = [summary, ...rooms];
      interactionRoomState.roomsLoaded = true;
      return summary;
    }
    const existing = normalizeInteractionRoomSummary(rooms[existingIndex]);
    const playerById = new Map();
    [...(existing.players || []), ...(summary.players || [])].forEach(player => {
      const normalized = normalizeInteractionRoomPlayer(player);
      if (normalized.studentId) playerById.set(normalized.studentId, normalized);
    });
    const merged = {
      ...existing,
      ...summary,
      memberCount: Math.min(summary.memberLimit, Math.max(existing.memberCount, summary.memberCount, playerById.size)),
      players: Array.from(playerById.values())
    };
    interactionRoomState.rooms = rooms.map((item, index) => index === existingIndex ? merged : item);
    interactionRoomState.roomsLoaded = true;
    return merged;
  }

  function getInteractionRoomRemoteRenderStore() {
    if (!(interactionRoomState.remoteRenderPlayers instanceof Map)) {
      interactionRoomState.remoteRenderPlayers = new Map();
    }
    return interactionRoomState.remoteRenderPlayers;
  }

  function getInteractionRoomRemoteRenderKey(player = {}) {
    const studentId = HolidayBackendClient.normalizeId(player.studentId || player.student_id);
    if (studentId) return studentId;
    return `${String(player.petId || player.pet_id || 'pet')}:${String(player.petName || player.pet_name || '')}`;
  }

  function syncInteractionRoomRemoteRenderPlayer(remote = {}, index = 0, now = performance.now()) {
    const key = getInteractionRoomRemoteRenderKey(remote);
    if (!key) return null;
    const store = getInteractionRoomRemoteRenderStore();
    const map = getKuromiRoomMapById(remote.mapId || 'home');
    const action = String(remote.action || 'idle');
    const height = getKuromiRoomActionHeight(action);
    const bounds = getKuromiRoomPlayerBoundsForMap(map);
    const targetX = clampKuromiRoomValue(Number(remote.x || KUROMI_ROOM_DEMO.playerStartX), bounds.minX, bounds.maxX);
    const remoteY = Number(remote.y);
    const targetY = Number.isFinite(remoteY) && remoteY > 0 ? remoteY : (map.groundY || KUROMI_ROOM_DEMO.fallbackGroundY) - height;
    let renderState = store.get(key);
    if (!renderState) {
      renderState = {
        key,
        mapId: map.id,
        displayX: targetX,
        displayY: targetY,
        targetX,
        targetY,
        facing: Number(remote.facing || 1) < 0 ? -1 : 1,
        action,
        visualVelocityX: 0,
        walkCycle: (index * 0.7) % (Math.PI * 2),
        idlePhaseOffset: index * 0.9 + Math.random() * 0.8,
        lastRenderAt: now,
        lastTargetAt: now
      };
      store.set(key, renderState);
      return renderState;
    }

    const previousX = renderState.displayX;
    const previousY = renderState.displayY;
    const elapsedMs = Math.min(120, Math.max(0, now - Number(renderState.lastRenderAt || now)));
    const delta = Math.max(0.001, elapsedMs / 1000);
    const sameMap = renderState.mapId === map.id;
    renderState.mapId = map.id;
    renderState.targetX = targetX;
    renderState.targetY = targetY;
    renderState.facing = Number(remote.facing || renderState.facing || 1) < 0 ? -1 : 1;
    renderState.action = action;
    renderState.lastRenderAt = now;
    renderState.lastTargetAt = now;

    const distanceX = targetX - renderState.displayX;
    const distanceY = targetY - renderState.displayY;
    const distance = Math.hypot(distanceX, distanceY);
    if (!sameMap || distance > KUROMI_ROOM_DEMO.remoteSnapDistance || Math.abs(distanceY) > 260) {
      renderState.displayX = targetX;
      renderState.displayY = targetY;
      renderState.visualVelocityX = 0;
    } else {
      const blend = 1 - Math.pow(1 - KUROMI_ROOM_DEMO.remoteLerpSpeed, delta * 60);
      const maxStep = KUROMI_ROOM_DEMO.remoteMaxStepPerSecond * delta;
      renderState.displayX += clampKuromiRoomValue(distanceX * blend, -maxStep, maxStep);
      renderState.displayY += clampKuromiRoomValue(distanceY * blend, -maxStep, maxStep);
      renderState.visualVelocityX = (renderState.displayX - previousX) / delta;
      if (Math.abs(targetX - renderState.displayX) < 1.2) renderState.displayX = targetX;
      if (Math.abs(targetY - renderState.displayY) < 1.2) renderState.displayY = targetY;
    }

    const movingVisually = Math.abs(renderState.visualVelocityX) > 10 || Math.abs(renderState.targetX - renderState.displayX) > 4;
    const shouldWalk = action !== 'duck' && action !== 'jump' && action !== 'lie' && (action === 'walk' || action === 'run' || movingVisually);
    if (shouldWalk) {
      const speed = Math.max(120, Math.abs(renderState.visualVelocityX || 0));
      renderState.walkCycle = (Number(renderState.walkCycle || 0) + speed * delta * KUROMI_ROOM_DEMO.walkCycleSpeed) % (Math.PI * 2);
      if (Math.abs(renderState.visualVelocityX) > 14) renderState.facing = renderState.visualVelocityX < 0 ? -1 : 1;
    } else {
      renderState.walkCycle = approachKuromiRoomValue(Number(renderState.walkCycle || 0), 0, KUROMI_ROOM_DEMO.walkSettleSpeed * delta);
      renderState.visualVelocityX = 0;
    }
    if (!Number.isFinite(renderState.displayX)) renderState.displayX = previousX;
    if (!Number.isFinite(renderState.displayY)) renderState.displayY = previousY;
    return renderState;
  }

  function pruneInteractionRoomRemoteRenderPlayers(activeKeys = new Set(), now = performance.now()) {
    const store = getInteractionRoomRemoteRenderStore();
    store.forEach((renderState, key) => {
      if (!activeKeys.has(key) || now - Number(renderState.lastTargetAt || 0) > KUROMI_ROOM_DEMO.remoteStaleMs) {
        store.delete(key);
      }
    });
  }

  function preloadInteractionRoomSprites(players = []) {
    players.forEach(player => {
      const petId = String(player.petId || 'kuromi');
      const petStage = getInteractionRoomPlayerPetStage(player);
      const petStyle = getInteractionRoomPlayerPetStyle(player);
      const spriteCacheKey = getKuromiRoomSpriteCacheKey(petId, petStage, petStyle);
      if (!petId || interactionRoomSpriteCache.has(spriteCacheKey)) return;
      interactionRoomSpriteCache.set(spriteCacheKey, null);
      loadKuromiRoomSpriteImages(getKuromiRoomSpriteProfileForPet(petId, getInteractionRoomPlayerPetDisplayName(player), '', petStage, petStyle))
        .then(sprites => interactionRoomSpriteCache.set(spriteCacheKey, sprites))
        .catch(() => interactionRoomSpriteCache.delete(spriteCacheKey));
    });
  }

  function getInteractionFriendRoomLookup() {
    const lookup = new Map();
    (interactionRoomState.rooms || []).forEach(room => {
      const summary = normalizeInteractionRoomSummary(room);
      (summary.players || []).forEach(player => {
        const friendId = HolidayBackendClient.normalizeId(player.studentId);
        if (friendId && !lookup.has(friendId)) lookup.set(friendId, summary);
      });
    });
    return lookup;
  }

  function renderInteractionRoomFriendQuickJoin(student = getStudent()) {
    if (!canUseFriendsBackend(student)) return '';
    const friends = Array.isArray(friendState.friends) ? friendState.friends : [];
    if (!friends.length && (friendState.loading || interactionRoomState.roomsLoading)) {
      return `<section class="interaction-room-friend-strip" aria-live="polite">
        <div><p class="eyebrow">FRIENDS ONLINE</p><h4>${escapeHtml(localize('好友房间'))}</h4><small>${escapeHtml(localize('正在读取好友和房间状态...'))}</small></div>
      </section>`;
    }
    if (!friends.length) {
      return `<section class="interaction-room-friend-strip">
        <div><p class="eyebrow">FRIENDS ONLINE</p><h4>${escapeHtml(localize('好友房间'))}</h4><small>${escapeHtml(localize('加了好友后，这里会显示谁正在房间里。'))}</small></div>
      </section>`;
    }
    const roomByFriend = getInteractionFriendRoomLookup();
    const cards = friends.map(friend => {
      const friendId = HolidayBackendClient.normalizeId(friend.studentId || friend.friendStudentId);
      const friendName = HolidayBackendClient.getCanonicalStudentName(friendId, friend.studentName || friend.name || friend.petName || friendId);
      const room = roomByFriend.get(friendId);
      const full = Boolean(room && room.memberCount >= room.memberLimit);
      const locked = Boolean(room?.isLocked);
      const busy = Boolean(room && interactionRoomState.joiningRoomId === room.roomId);
      const canJoin = Boolean(room && !locked && !full && !busy);
      const statusText = room
        ? `${room.roomName || '小小房间'} · ${room.memberCount}/${room.memberLimit}`
        : localize('不在房间');
      const buttonText = busy ? localize('进入中') : (room ? (locked ? localize('需密码') : (full ? localize('已满') : localize('加入'))) : localize('未在线'));
      return `<article class="interaction-room-friend-card${room ? ' online' : ' offline'}">
        <span class="interaction-room-friend-avatar" aria-hidden="true">🌟</span>
        <div>
          <strong>${escapeHtml(friendName)}</strong>
          <small>${escapeHtml(statusText)}</small>
        </div>
        <button type="button" class="interaction-room-friend-join" data-interaction-room-join="${escapeHtml(room?.roomId || '')}" ${canJoin ? '' : 'disabled'}>${escapeHtml(buttonText)}</button>
      </article>`;
    }).join('');
    return `<section class="interaction-room-friend-strip">
      <div class="interaction-room-friend-strip-head">
        <div><p class="eyebrow">FRIENDS ONLINE</p><h4>${escapeHtml(localize('好友所在房间'))}</h4></div>
        <button type="button" class="secondary-button compact-button" data-interaction-room-refresh>${interactionRoomState.roomsLoading ? escapeHtml(localize('刷新中')) : escapeHtml(localize('刷新'))}</button>
      </div>
      <div class="interaction-room-friend-grid">${cards}</div>
    </section>`;
  }

  function renderInteractionRoomSizeSelector(student = getStudent()) {
    const selectedSize = getInteractionRoomSelectedPetSize(student);
    const spriteProfile = getKuromiRoomSpriteProfile(student);
    const sampleSrc = withAssetVersion(spriteProfile.headFallbackSrc || spriteProfile.headSrc || spriteProfile.idleSrc || spriteProfile.fallbackSrc);
    const cards = INTERACTION_ROOM_PET_SIZE_OPTIONS.map(option => {
      const selected = option.id === selectedSize;
      return `<button type="button" class="interaction-room-size-option${selected ? ' selected' : ''}" data-interaction-room-pet-size="${escapeHtml(option.id)}" aria-pressed="${selected ? 'true' : 'false'}" style="--sample-scale:${Number(option.scale || 1)}">
        <span class="interaction-room-size-sample" aria-hidden="true">
          <img src="${escapeHtml(sampleSrc)}" alt="" loading="lazy" />
        </span>
        <span class="interaction-room-size-copy">
          <strong>${escapeHtml(localize(option.title))}</strong>
          <small>${escapeHtml(localize(option.subtitle))}</small>
        </span>
        <span class="interaction-room-size-badge">${selected ? escapeHtml(localize('已选择')) : escapeHtml(option.label)}</span>
      </button>`;
    }).join('');
    return `<section class="interaction-room-size-panel" aria-label="${escapeHtml(localize('房间角色大小'))}">
      <div class="interaction-room-size-head">
        <div>
          <p class="eyebrow">PET SIZE</p>
          <h4>${escapeHtml(localize('房间角色大小'))}</h4>
        </div>
        <span>${escapeHtml(localize('朋友也会看到这个大小'))}</span>
      </div>
      <div class="interaction-room-size-grid">${cards}</div>
    </section>`;
  }

  function getInteractionRoomHeroPoolGroups(student = getStudent()) {
    return getOwnedPetHeroPoolGroups(student);
  }

  function renderInteractionRoomHeroPool(student = getStudent()) {
    const groups = getInteractionRoomHeroPoolGroups(student);
    if (!student || !groups.length) return '';
    const activePetId = String(student.petType || '');
    const groupMarkup = groups.map(group => {
      const cards = group.pets.map(pet => {
        if (!student.demoMode) syncPetEvolutionFormState(student, pet.id);
        const selected = pet.id === activePetId;
        const image = getRolePreviewAsset(getPetRecordDisplayImage(student, pet.id) || pet.image);
        const displayName = getPetFullDisplayName(student, pet.id) || pet.name;
        return `<button type="button" class="interaction-room-hero-card${selected ? ' selected' : ''}" data-interaction-room-switch-pet="${escapeHtml(pet.id)}" aria-pressed="${selected ? 'true' : 'false'}">
          <span><img src="${escapeHtml(image)}" alt="${escapeHtml(displayName)}" loading="lazy" decoding="async" /></span>
          <strong>${escapeHtml(displayName)}</strong>
        </button>`;
      }).join('');
      return `<div class="interaction-room-hero-series">
        <div class="interaction-room-hero-series-head"><strong>${escapeHtml(localize(group.series.label))}</strong><small>${group.pets.length}</small></div>
        <div class="interaction-room-hero-grid">${cards}</div>
      </div>`;
    }).join('');
    return `<section class="interaction-room-hero-pool" aria-label="${escapeHtml(localize('房间英雄池'))}">
      <div class="interaction-room-size-head">
        <div>
          <p class="eyebrow">HERO POOL</p>
          <h4>${escapeHtml(localize('选择出门宠物'))}</h4>
        </div>
        <span>${escapeHtml(localize('不用回主页也能换伙伴'))}</span>
      </div>
      ${groupMarkup}
    </section>`;
  }

  async function selectInteractionRoomHeroPet(petId, triggerButton = null) {
    const student = getStudent();
    const safePetId = String(petId || '').trim().toLowerCase();
    if (!student || !safePetId || (!student.demoMode && !isPetOwnedByStudent(student, safePetId))) return false;
    if (student.petType === safePetId) {
      showToast('这只宠物已经准备出门啦。');
      renderInteractionRoomLobby(student);
      return true;
    }
    const switched = await withButtonLoading(triggerButton, () => switchActivePet(student, safePetId), '切换中');
    if (!switched) return false;
    renderedCombatState = { studentId: null, stats: null, power: null };
    renderAppShell();
    switchView('guide-view');
    if (hasActiveInteractionRoom()) {
      await refreshActiveInteractionRoomPetAppearance();
      initKuromiRoomDemo();
    } else {
      renderInteractionRoomLobby(student);
    }
    showToast(`${getPetFullDisplayName(student) || student.petName || '伙伴'}已准备出门。`);
    return true;
  }

  function renderInteractionRoomLobby(student = getStudent()) {
    const target = $('#interaction-room-lobby');
    if (!target) return;
    if (miniGameState.embeddedOpen) {
      renderEmbeddedMiniGameShell();
      if (miniGameState.mode === 'picker') renderMiniGamePicker();
      return;
    }
    if (!canUseFriendsBackend(student)) {
      target.innerHTML = `<div class="interaction-room-empty">
        <strong>${escapeHtml(localize('互动区需要连接云端才可以一起玩。'))}</strong>
        <span>${escapeHtml(localize('请先确认 Supabase 连接正常。'))}</span>
      </div>`;
      return;
    }
    const mode = interactionRoomState.lobbyMode || 'menu';
    if (mode === 'menu') {
      target.innerHTML = `<div class="interaction-room-menu-grid" aria-label="${escapeHtml(localize('互动区菜单'))}">
        <button type="button" class="interaction-room-menu-card" data-interaction-lobby-mode="join">
          <span class="interaction-room-menu-icon" aria-hidden="true">🚪</span>
          <strong>${escapeHtml(localize('加入房间'))}</strong>
          <span>${escapeHtml(localize('看看现在开放的房间，输入密码或直接进入。'))}</span>
        </button>
        <button type="button" class="interaction-room-menu-card" data-interaction-lobby-mode="create">
          <span class="interaction-room-menu-icon" aria-hidden="true">🏠</span>
          <strong>${escapeHtml(localize('创建房间'))}</strong>
          <span>${escapeHtml(localize('自己开一个房间，朋友可以一起进来玩。'))}</span>
        </button>
        <button type="button" class="interaction-room-menu-card" data-mini-game-open>
          <span class="interaction-room-menu-icon" aria-hidden="true">🎮</span>
          <strong>${escapeHtml(localize('带宠物去玩'))}</strong>
          <span>${escapeHtml(localize('挑战反应轮盘、CY跳跳跳、CY跑跑跑和CY跳一跳。'))}</span>
        </button>
      </div>
      ${renderInteractionRoomSizeSelector(student)}
      ${renderInteractionRoomHeroPool(student)}
      ${renderInteractionRoomFriendQuickJoin(student)}`;
      if (!interactionRoomState.roomsLoaded && !interactionRoomState.roomsLoading) void loadInteractionRooms(false, { silent: true });
      if (!friendState.loaded && !friendState.loading) void loadFriendsDashboard(true);
      return;
    }
    const rooms = interactionRoomState.rooms;
    const roomNameValue = interactionRoomState.roomNameDraft || '';
    const passwordValue = normalizeInteractionPassword(interactionRoomState.passwordDraft);
    const selectedMapSetId = normalizeInteractionRoomMapSetId(interactionRoomState.mapSetDraft);
    const mapSetChoices = KUROMI_ROOM_DEMO.mapSets.map(mapSet => {
      const checked = mapSet.id === selectedMapSetId ? ' checked' : '';
      const sampleMapNames = mapSet.maps.map(map => map.shortTitle).join(' · ');
      return `<label class="interaction-map-choice${checked ? ' selected' : ''}">
        <input type="radio" name="interactionRoomMapSet" value="${escapeHtml(mapSet.id)}" data-interaction-room-map-set${checked} />
        <img src="${escapeHtml(withAssetVersion(mapSet.previewSrc))}" alt="${escapeHtml(mapSet.name)} sample" loading="lazy" />
        <span>
          <strong>${escapeHtml(mapSet.name)}</strong>
          <small>${escapeHtml(mapSet.subtitle || sampleMapNames)}</small>
        </span>
      </label>`;
    }).join('');
    const createDisabled = interactionRoomState.creating ? ' disabled' : '';
    const recoveryMarkup = interactionRoomState.roomsRecovering ? `<div class="interaction-room-recovery-banner">
      <strong>${escapeHtml(localize('房间连接正在恢复'))}</strong>
      <span>${escapeHtml(localize('已保留固定房间入口，可以点刷新再试。'))}</span>
    </div>` : '';
    const roomsMarkup = rooms.length ? rooms.map(room => {
      const locked = room.isLocked;
      const full = room.memberCount >= room.memberLimit;
      const joinPassword = normalizeInteractionPassword(interactionRoomState.joinPasswordDrafts[room.roomId] || '');
      const busy = interactionRoomState.joiningRoomId === room.roomId;
      return `<article class="interaction-room-card${locked ? ' locked' : ''}${full ? ' full' : ''}">
        <div class="interaction-room-card-main">
          <strong>${escapeHtml(room.roomName || '小小房间')}</strong>
          <small>${escapeHtml(room.ownerName || room.ownerStudentId || '同学')} 创建 · ${escapeHtml(room.mapSetName || 'CY小镇')} · ${room.memberCount}/${room.memberLimit} 人</small>
        </div>
        <span class="interaction-room-status">${locked ? '需要密码' : '公开房间'}</span>
        ${locked ? `<form class="interaction-room-join-form" data-interaction-room-join-form data-room-id="${escapeHtml(room.roomId)}">
          <label>
            <span>输入4个数字</span>
            <input name="interactionRoomJoinPassword" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="one-time-code" value="${escapeHtml(joinPassword)}" placeholder="4位数字" aria-label="输入4位数字密码" />
          </label>
          <button type="submit" class="primary-button" ${full || busy ? 'disabled' : ''}>${busy ? '进入中' : '输入密码进入'}</button>
        </form>` : `<button type="button" class="primary-button" data-interaction-room-join="${escapeHtml(room.roomId)}" ${full || busy ? 'disabled' : ''}>${full ? '房间已满' : (busy ? '进入中' : '进入房间')}</button>`}
      </article>`;
    }).join('') : `<div class="interaction-room-empty">
      <strong>${escapeHtml(localize('现在还没有房间。'))}</strong>
      <span>${escapeHtml(localize('你可以先创建一个，朋友刷新列表后就看得到。'))}</span>
    </div>`;
    if (mode === 'join') {
      target.innerHTML = `<div class="interaction-room-lobby-header">
        <div>
          <p class="eyebrow">JOIN ROOM</p>
          <h3>${escapeHtml(localize('加入房间'))}</h3>
        </div>
        <div class="interaction-room-lobby-actions">
          <button type="button" class="secondary-button" data-interaction-lobby-mode="menu">${escapeHtml(localize('返回'))}</button>
          <button type="button" class="secondary-button" data-interaction-room-refresh>${interactionRoomState.roomsLoading ? escapeHtml(localize('刷新中')) : escapeHtml(localize('刷新房间列表'))}</button>
        </div>
      </div>
      <div class="interaction-room-list" aria-live="polite">${recoveryMarkup}${roomsMarkup}</div>`;
      return;
    }
    target.innerHTML = `<div class="interaction-room-lobby-header">
      <div>
        <p class="eyebrow">CREATE ROOM</p>
        <h3>${escapeHtml(localize('创建房间'))}</h3>
      </div>
      <div class="interaction-room-lobby-actions">
        <button type="button" class="secondary-button" data-interaction-lobby-mode="menu">${escapeHtml(localize('返回'))}</button>
      </div>
    </div>
    <form class="interaction-room-create-form" data-interaction-room-create-form>
      <div class="interaction-room-create-main">
        <label>
          <span>${escapeHtml(localize('给房间取名字'))}</span>
          <input name="interactionRoomName" maxlength="18" autocomplete="off" value="${escapeHtml(roomNameValue)}" placeholder="例如：开心草原" aria-label="给房间取名字" />
        </label>
        <label class="interaction-room-lock-toggle">
          <input type="checkbox" name="interactionRoomLocked" data-interaction-room-lock-toggle ${interactionRoomState.usePassword ? 'checked' : ''} />
          <span>${escapeHtml(localize('我要设置密码'))}</span>
        </label>
      </div>
      <label class="interaction-room-password-row" ${interactionRoomState.usePassword ? '' : 'hidden'}>
        <span>${escapeHtml(localize('写4个数字密码'))}</span>
        <input name="interactionRoomPassword" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="one-time-code" value="${escapeHtml(passwordValue)}" placeholder="4个数字密码" aria-label="写4个数字密码" />
      </label>
      <fieldset class="interaction-map-picker">
        <legend>${escapeHtml(localize('选择地图'))}</legend>
        <div class="interaction-map-choice-grid">${mapSetChoices}</div>
      </fieldset>
      <button type="submit" class="primary-button" ${createDisabled}>${interactionRoomState.creating ? escapeHtml(localize('创建中')) : escapeHtml(localize('创建房间'))}</button>
    </form>`;
  }

  function setInteractionRoomLobbyMode(mode = 'menu') {
    const nextMode = ['menu', 'join', 'create'].includes(mode) ? mode : 'menu';
    interactionRoomState.lobbyMode = nextMode;
    renderInteractionRoomLobby(getStudent());
    if (nextMode === 'join') {
      startInteractionRoomLobbyRefresh();
      if (!interactionRoomState.roomsLoaded && !interactionRoomState.roomsLoading) void loadInteractionRooms();
    } else {
      stopInteractionRoomLobbyRefresh();
    }
  }

  async function selectInteractionRoomPetSize(sizeId) {
    const student = getStudent();
    if (!student) return false;
    const nextSize = setInteractionRoomSelectedPetSize(sizeId, student);
    if (kuromiRoomDemoState?.player) kuromiRoomDemoState.player.petSize = nextSize;
    renderInteractionRoomLobby(student);
    if (hasActiveInteractionRoom()) {
      interactionRoomState.lastHeartbeatPayload = '';
      await sendInteractionRoomHeartbeat({ silent: true });
    }
    showToast(`房间角色大小已切换为${getInteractionRoomPetSizeOption(nextSize).label}。`);
    return true;
  }

  function renderInteractionRoomActiveUi(student = getStudent()) {
    updatePetWallRoomVisibility();
    renderKuromiRoomChatDemo(student);
    updateKuromiRoomFullscreenUi();
    const panel = $('#guide-view .pet-interaction-panel');
    if (panel) applyLanguage(panel);
  }

  function applyInteractionRoomResult(result = {}, options = {}) {
    if (!result.ok) return false;
    stopInteractionRoomLobbyRefresh();
    const nextRoom = normalizeInteractionRoomSummary(result.room || {});
    if (
      interactionRoomState.activeRoomId
      && nextRoom.roomId
      && (
        interactionRoomState.activeRoomId !== nextRoom.roomId
        || normalizeInteractionRoomMapSetId(interactionRoomState.room?.mapSetId) !== nextRoom.mapSetId
      )
    ) {
      getInteractionRoomRemoteRenderStore().clear();
    }
    interactionRoomState.room = nextRoom;
    interactionRoomState.activeRoomId = interactionRoomState.room.roomId;
    const memberLimit = Math.max(1, Number(interactionRoomState.room.memberLimit || ROOM_MEMBER_LIMIT));
    interactionRoomState.players = (result.players || []).map(normalizeInteractionRoomPlayer).slice(0, memberLimit);
    preloadInteractionRoomSprites(interactionRoomState.players);
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    interactionRoomState.lastHeartbeatOkAt = now;
    interactionRoomState.heartbeatFailureCount = 0;
    if (options.render !== false) renderInteractionRoomActiveUi(getStudent());
    startInteractionRoomHeartbeat();
    return true;
  }

  function clearActiveInteractionRoom(options = {}) {
    setKuromiRoomChatOpen(false, { focus: false });
    interactionRoomState.activeRoomId = '';
    interactionRoomState.room = null;
    interactionRoomState.players = [];
    interactionRoomState.lobbyMode = options.lobbyMode || interactionRoomState.lobbyMode || 'join';
    interactionRoomState.lastHeartbeatAt = 0;
    interactionRoomState.lastHeartbeatOkAt = 0;
    interactionRoomState.lastHeartbeatPayload = '';
    interactionRoomState.heartbeatFailureCount = 0;
    interactionRoomState.heartbeatInFlight = false;
    interactionRoomState.emojiOpen = false;
    interactionRoomState.chatDraft = '';
    getInteractionRoomRemoteRenderStore().clear();
    stopInteractionRoomHeartbeat();
    if (options.stopLobbyRefresh) stopInteractionRoomLobbyRefresh();
    stopKuromiRoomDemo();
    if (options.render !== false) {
      updatePetWallRoomVisibility();
      renderInteractionRoomLobby(getStudent());
      renderKuromiRoomChatDemo(getStudent());
      startInteractionRoomLobbyRefresh();
    }
  }

  async function loadInteractionRooms(force = false, options = {}) {
    const student = getStudent();
    const silent = Boolean(options.silent);
    if (!canUseFriendsBackend(student)) {
      interactionRoomState.roomsLoaded = true;
      renderInteractionRoomLobby(student);
      return false;
    }
    if (interactionRoomState.roomsLoading || (interactionRoomState.roomsLoaded && !force)) {
      if (!silent) renderInteractionRoomLobby(student);
      return true;
    }
    interactionRoomState.roomsLoading = true;
    if (!silent) renderInteractionRoomLobby(student);
    try {
      const result = await backend.listInteractionRooms(student.studentId);
      if (!result.ok) throw new Error(result.error || '房间列表读取失败');
      interactionRoomState.rooms = mergeInteractionRoomFallbackRooms(result.rooms || []);
      interactionRoomState.roomsLoaded = true;
      interactionRoomState.roomsLoading = false;
      interactionRoomState.roomsRecovering = false;
      interactionRoomState.roomsError = '';
      interactionRoomState.roomsLastLoadedAt = Date.now();
      renderInteractionRoomLobby(student);
      return true;
    } catch (error) {
      interactionRoomState.roomsLoading = false;
      interactionRoomState.roomsLoaded = true;
      interactionRoomState.roomsRecovering = true;
      interactionRoomState.roomsError = String(error?.message || error || '房间列表读取失败');
      interactionRoomState.rooms = mergeInteractionRoomFallbackRooms(interactionRoomState.rooms);
      renderInteractionRoomLobby(student);
      if (!silent) showToast(`互动区读取失败：${error.message || error}`);
      return false;
    }
  }

  function isInteractionRoomLobbyInputActive() {
    const active = document.activeElement;
    return Boolean(active?.closest?.('#interaction-room-lobby input, #interaction-room-lobby textarea, #interaction-room-lobby select'));
  }

  function startInteractionRoomLobbyRefresh() {
    if (interactionRoomState.lobbyRefreshTimer) return;
    interactionRoomState.lobbyRefreshTimer = window.setInterval(() => {
      if (session.activeView !== 'guide-view' || hasActiveInteractionRoom()) return;
      if (interactionRoomState.lobbyMode !== 'join') return;
      if (isInteractionRoomLobbyInputActive()) return;
      void loadInteractionRooms(true, { silent: true });
    }, 7000);
  }

  function stopInteractionRoomLobbyRefresh() {
    if (!interactionRoomState.lobbyRefreshTimer) return;
    window.clearInterval(interactionRoomState.lobbyRefreshTimer);
    interactionRoomState.lobbyRefreshTimer = null;
  }

  async function createInteractionRoomFromForm(form) {
    const student = getStudent();
    if (!student || !form) return false;
    const roomNameInput = form.querySelector('input[name="interactionRoomName"]');
    const passwordInput = form.querySelector('input[name="interactionRoomPassword"]');
    const lockedInput = form.querySelector('input[name="interactionRoomLocked"]');
    const mapSetInput = form.querySelector('input[name="interactionRoomMapSet"]:checked');
    const nameValidation = validatePublicDisplayText(roomNameInput?.value || '', 18, '请先给房间取名字。', '房间名字');
    if (!nameValidation.ok) {
      showToast(nameValidation.error || '房间名字不适合公开展示。');
      return false;
    }
    const isLocked = Boolean(lockedInput?.checked);
    const password = normalizeInteractionPassword(passwordInput?.value || '');
    const mapSetId = normalizeInteractionRoomMapSetId(mapSetInput?.value || interactionRoomState.mapSetDraft);
    if (isLocked && password.length !== 4) {
      showToast('密码要写满4个数字。');
      passwordInput?.focus();
      return false;
    }
    interactionRoomState.creating = true;
    renderInteractionRoomLobby(student);
    try {
      const presence = getInteractionRoomPresencePayload(student);
      const result = await backend.createInteractionRoom({
        studentId: student.studentId,
        ...presence,
        roomName: nameValidation.text,
        mapSetId,
        isLocked,
        password
      });
      if (!result.ok) throw new Error(result.error || '房间创建失败');
      interactionRoomState.roomNameDraft = '';
      interactionRoomState.passwordDraft = '';
      interactionRoomState.mapSetDraft = mapSetId;
      interactionRoomState.usePassword = false;
      interactionRoomState.creating = false;
      applyInteractionRoomResult(result);
      await loadInteractionRooms(true);
      initKuromiRoomDemo();
      if (shouldAutoEnterPlayFullscreen()) void enterKuromiRoomFullscreen();
      showToast('房间创建好了，朋友现在可以加入。');
      return true;
    } catch (error) {
      interactionRoomState.creating = false;
      renderInteractionRoomLobby(student);
      showToast(`房间创建失败：${error.message || error}`);
      return false;
    }
  }

  async function joinInteractionRoomById(roomId, password = '', options = {}) {
    const student = getStudent();
    const safeRoomId = String(roomId || '').trim().toUpperCase();
    if (!student || !safeRoomId) return false;
    const room = interactionRoomState.rooms.find(item => item.roomId === safeRoomId);
    const safePassword = normalizeInteractionPassword(password);
    if (room?.isLocked && safePassword.length !== 4) {
      showToast('这个房间需要4个数字密码。');
      return false;
    }
    interactionRoomState.joiningRoomId = safeRoomId;
    renderInteractionRoomLobby(student);
    try {
      const result = await backend.joinInteractionRoom({ studentId: student.studentId, ...getInteractionRoomPresencePayload(student), roomId: safeRoomId, password: safePassword });
      if (!result.ok) throw new Error(result.error || '加入房间失败');
      interactionRoomState.joiningRoomId = '';
      applyInteractionRoomResult(result);
      if (options.switchToGuide && session.activeView !== 'guide-view') switchView('guide-view');
      await loadInteractionRooms(true);
      initKuromiRoomDemo();
      if (shouldAutoEnterPlayFullscreen()) void enterKuromiRoomFullscreen();
      showToast('进入房间啦。');
      return true;
    } catch (error) {
      interactionRoomState.joiningRoomId = '';
      renderInteractionRoomLobby(student);
      showToast(`加入房间失败：${error.message || error}`);
      return false;
    }
  }

  async function joinInteractionRoomFromForm(form) {
    const roomId = String(form?.dataset.roomId || '').trim().toUpperCase();
    const password = normalizeInteractionPassword(form?.querySelector('input[name="interactionRoomJoinPassword"]')?.value || '');
    return joinInteractionRoomById(roomId, password);
  }

  async function joinFriendInteractionRoom(friendId) {
    const student = getStudent();
    const safeFriendId = HolidayBackendClient.normalizeId(friendId);
    if (!student || !safeFriendId) return false;
    if (!canUseFriendsBackend(student)) {
      showToast('好友房间需要连接云端后使用。');
      return false;
    }
    interactionRoomState.joiningFriendId = safeFriendId;
    renderFriendsView();
    try {
      const result = await backend.listFriendInteractionRooms(student.studentId, [safeFriendId]);
      if (!result.ok) throw new Error(result.error || '好友房间读取失败');
      const friendRooms = Array.isArray(result.friendRooms) ? result.friendRooms : [];
      const match = friendRooms.find(item => HolidayBackendClient.normalizeId(item.friendStudentId || item.friend_student_id || item.player?.studentId || item.player?.student_id) === safeFriendId)
        || friendRooms[0]
        || null;
      const summary = upsertInteractionRoomSummary(match?.room || {}, match?.player ? [match.player] : []);
      if (!summary?.roomId) {
        showToast('这位好友现在不在互动房间里。');
        return false;
      }
      if (summary.isLocked) {
        interactionRoomState.lobbyMode = 'join';
        if (session.activeView !== 'guide-view') switchView('guide-view');
        else renderPetInteraction();
        showToast('好友在有密码的房间，请到互动区输入密码加入。');
        return false;
      }
      if (summary.memberCount >= summary.memberLimit) {
        showToast('好友所在房间已经满了。');
        return false;
      }
      clearActivePetWallRoom({ render: false });
      return joinInteractionRoomById(summary.roomId, '', { switchToGuide: true });
    } catch (error) {
      showToast(`好友房间读取失败：${error.message || error}`);
      return false;
    } finally {
      interactionRoomState.joiningFriendId = '';
      renderFriendsView();
    }
  }

  function getInteractionRoomPresencePayload(student = getStudent()) {
    const petId = String(student?.petType || 'kuromi');
    return {
      studentName: getStudentDisplayName(student) || student?.studentId || '',
      petId,
      petName: getPetNickname(student, petId) || getPetInfo(petId)?.name || '',
      petStage: getInteractionRoomPetStage(student, petId),
      petStyle: getInteractionRoomPetStyle(student, petId),
      petSize: getInteractionRoomSelectedPetSize(student)
    };
  }

  function getInteractionRoomHeartbeatPayload(options = {}) {
    const student = getStudent();
    const state = kuromiRoomDemoState;
    const map = state ? getKuromiRoomActiveMap(state) : getKuromiRoomMap(0);
    const player = state?.player || createKuromiRoomPlayer(KUROMI_ROOM_DEMO.playerStartX, map.groundY);
    const action = getKuromiRoomPlayerAction(player);
    const payload = {
      studentId: student?.studentId,
      ...getInteractionRoomPresencePayload(student),
      roomId: interactionRoomState.activeRoomId,
      mapId: map.id,
      x: Math.round(player.x),
      y: Math.round(player.y),
      facing: player.facing,
      playerAction: action
    };
    if (Object.prototype.hasOwnProperty.call(options, 'message')) payload.message = String(options.message || '');
    return payload;
  }

  function getInteractionRoomHeartbeatSignature(payload = {}) {
    return JSON.stringify({
      roomId: payload.roomId || '',
      mapId: payload.mapId || '',
      x: Math.round(Number(payload.x) || 0),
      y: Math.round(Number(payload.y) || 0),
      facing: Number(payload.facing) < 0 ? -1 : 1,
      playerAction: String(payload.playerAction || 'idle'),
      petId: String(payload.petId || ''),
      petName: String(payload.petName || ''),
      petStage: String(payload.petStage || ''),
      petStyle: String(payload.petStyle || ''),
      petSize: String(payload.petSize || '')
    });
  }

  function getInteractionRoomHeartbeatInterval(payload = {}) {
    const action = String(payload.playerAction || payload.action || 'idle');
    return action === 'idle' ? INTERACTION_ROOM_IDLE_HEARTBEAT_MS : INTERACTION_ROOM_MOVING_HEARTBEAT_MS;
  }

  function sendInteractionRoomLeaveBeacon() {
    const student = getStudent();
    const payload = {
      action: 'leaveRoom',
      roomId: interactionRoomState.activeRoomId,
      studentId: HolidayBackendClient.normalizeId(student?.studentId)
    };
    if (!payload.roomId || !payload.studentId || !canUseFriendsBackend(student)) return false;
    const body = JSON.stringify(payload);
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(APP_CONFIG.interactionRoomApiUrl, blob)) return true;
      }
    } catch (_) {
      // Some browser lifecycle events disallow parts of the Beacon API.
    }
    try {
      fetch(APP_CONFIG.interactionRoomApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
      }).catch(() => null);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function sendInteractionRoomHeartbeat(options = {}) {
    const student = getStudent();
    if (!student || !interactionRoomState.activeRoomId || !canUseFriendsBackend(student)) return false;
    const payload = options.payload || getInteractionRoomHeartbeatPayload(options);
    const hasMessage = Object.prototype.hasOwnProperty.call(payload, 'message');
    if (interactionRoomState.heartbeatInFlight && options.silent && !hasMessage) return false;
    interactionRoomState.heartbeatInFlight = true;
    try {
      const result = await backend.heartbeatInteractionRoom(payload);
      if (!result.ok) throw new Error(result.error || '房间已关闭');
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      interactionRoomState.lastHeartbeatAt = now;
      interactionRoomState.lastHeartbeatOkAt = now;
      interactionRoomState.lastHeartbeatPayload = getInteractionRoomHeartbeatSignature(payload);
      interactionRoomState.heartbeatFailureCount = 0;
      applyInteractionRoomResult(result, { render: !options.silent });
      return true;
    } catch (error) {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      interactionRoomState.heartbeatFailureCount = Math.min(99, Number(interactionRoomState.heartbeatFailureCount || 0) + 1);
      const lastOk = Number(interactionRoomState.lastHeartbeatOkAt || interactionRoomState.lastHeartbeatAt || now);
      const graceExpired = now - lastOk > INTERACTION_ROOM_DISCONNECT_GRACE_MS;
      if (options.silent && !graceExpired) {
        if (interactionRoomState.heartbeatFailureCount === 3) showToast('互动区连接有点慢，正在帮你重连。');
        return false;
      }
      clearActiveInteractionRoom({ lobbyMode: 'join' });
      if (!options.silent) showToast(`房间连接中断：${error.message || error}`);
      await loadInteractionRooms(true);
      return false;
    } finally {
      interactionRoomState.heartbeatInFlight = false;
    }
  }

  function startInteractionRoomHeartbeat() {
    if (interactionRoomState.heartbeatTimer) return;
    interactionRoomState.heartbeatTimer = window.setInterval(() => {
      if (!interactionRoomState.activeRoomId || session.activeView !== 'guide-view') return;
      void sendInteractionRoomHeartbeat({ silent: true });
    }, ROOM_CHAT_REFRESH_MS);
  }

  function stopInteractionRoomHeartbeat() {
    if (!interactionRoomState.heartbeatTimer) return;
    window.clearInterval(interactionRoomState.heartbeatTimer);
    interactionRoomState.heartbeatTimer = null;
  }

  async function leaveActiveInteractionRoom(options = {}) {
    const student = getStudent();
    const roomId = interactionRoomState.activeRoomId;
    if (isKuromiRoomFullscreenMode()) await exitKuromiRoomFullscreen({ restartDemo: false });
    clearActiveInteractionRoom({ render: options.render !== false, lobbyMode: 'join' });
    if (!student || !roomId || !canUseFriendsBackend(student)) return false;
    try {
      await backend.leaveInteractionRoom(student.studentId, roomId);
      if (!options.silent) showToast('你已经离开房间。');
      if (options.refresh !== false) await loadInteractionRooms(true);
      return true;
    } catch (error) {
      if (!options.silent) showToast(`离开房间失败：${error.message || error}`);
      return false;
    }
  }

  function getRoomSceneInfo(sceneId) {
    return ROOM_SCENES.find(scene => scene.id === sceneId || scene.legacyScene === sceneId) || ROOM_SCENES[0];
  }

  function normalizeRoomSlot(slot = {}) {
    return {
      slotIndex: Math.max(0, Math.min(ROOM_MEMBER_LIMIT - 1, Number(slot.slotIndex ?? slot.slot_index ?? 0))),
      guestStudentId: HolidayBackendClient.normalizeId(slot.guestStudentId || slot.guest_student_id),
      petId: String(slot.petId || slot.pet_id || '')
    };
  }

  function normalizeRoomDecoration(decoration = {}) {
    const itemId = String(decoration.decorationItemId || decoration.decoration_item_id || decoration.itemId || '').trim();
    return {
      decorationId: String(decoration.decorationId || decoration.decoration_id || ''),
      decorationItemId: itemId,
      itemId,
      xPercent: Number(decoration.xPercent ?? decoration.x_percent ?? 50),
      yPercent: Number(decoration.yPercent ?? decoration.y_percent ?? 70),
      row: clampPetBuilderCell(decoration.row ?? decoration.gridRow ?? decoration.grid_row ?? 0, PET_INTERACTION_GRID.rows - 1),
      col: clampPetBuilderCell(decoration.col ?? decoration.gridCol ?? decoration.grid_col ?? 0, PET_INTERACTION_GRID.cols - 1),
      scale: Number(decoration.scale || 1),
      layerIndex: Number(decoration.layerIndex ?? decoration.layer_index ?? 0),
      placedByStudentId: HolidayBackendClient.normalizeId(decoration.placedByStudentId || decoration.placed_by_student_id)
    };
  }

  function normalizeRoomSummary(room = {}) {
    const ownerId = HolidayBackendClient.normalizeId(room.roomOwnerStudentId || room.room_owner_student_id);
    return {
      roomOwnerStudentId: ownerId,
      roomId: String(room.roomId || room.room_id || '').trim().toUpperCase(),
      ownerName: String(room.ownerName || room.owner_name || ''),
      ownerStudentName: String(room.ownerStudentName || room.owner_student_name || ''),
      ownerPetName: String(room.ownerPetName || room.owner_pet_name || ''),
      ownerPetType: String(room.ownerPetType || room.owner_pet_type || ''),
      roomName: String(room.roomName || room.room_name || '').trim(),
      sceneId: String(room.sceneId || room.scene_id || 'open-grassland'),
      joined: Boolean(room.joined),
      pendingApproval: Boolean(room.pendingApproval || room.pending_approval),
      isClosed: Boolean(room.isClosed || room.is_closed),
      memberCount: Math.max(1, Number(room.memberCount || room.member_count || 1)),
      memberLimit: Math.max(1, Number(room.memberLimit || room.member_limit || ROOM_MEMBER_LIMIT)),
      isOwnRoom: Boolean(room.isOwnRoom || room.is_own_room)
    };
  }

  function normalizeRoomMessage(message = {}) {
    return {
      messageId: String(message.messageId || message.message_id || createLocalId('room-message')),
      studentId: HolidayBackendClient.normalizeId(message.studentId || message.student_id),
      studentName: String(message.studentName || message.student_name || ''),
      petName: String(message.petName || message.pet_name || message.studentName || message.student_name || ''),
      text: String(message.text || ''),
      createdAt: String(message.createdAt || message.created_at || new Date().toISOString())
    };
  }

  function normalizeRoomMember(member = {}) {
    return {
      studentId: HolidayBackendClient.normalizeId(member.studentId || member.student_id),
      studentName: String(member.studentName || member.student_name || ''),
      avatar: String(member.avatar || '🌟'),
      petName: String(member.petName || member.pet_name || ''),
      petType: String(member.petType || member.pet_type || ''),
      ownedPetCount: Number(member.ownedPetCount || member.owned_pet_count || 0),
      isOwner: Boolean(member.isOwner || member.is_owner)
    };
  }

  function normalizeRoomJoinRequest(request = {}) {
    return {
      requestId: String(request.requestId || request.request_id || ''),
      studentId: HolidayBackendClient.normalizeId(request.studentId || request.student_id),
      studentName: String(request.studentName || request.student_name || ''),
      avatar: String(request.avatar || '🌟'),
      petName: String(request.petName || request.pet_name || ''),
      petType: String(request.petType || request.pet_type || ''),
      requestedAt: String(request.requestedAt || request.requested_at || new Date().toISOString())
    };
  }

  function getCurrentRoomOwnerId() {
    const student = getStudent();
    return HolidayBackendClient.normalizeId(friendState.roomOwnerStudentId || student?.studentId);
  }

  function getRoomDisplayName(room = friendState.room) {
    const normalized = normalizeRoomSummary(room || {});
    const fallbackName = normalized.isOwnRoom
      ? '我的宠物墙'
      : `${normalized.ownerPetName || normalized.ownerName || normalized.ownerStudentName || normalized.roomOwnerStudentId}的宠物墙`;
    return normalized.roomName || fallbackName;
  }

  function isCurrentRoomOwnedByStudent(student = getStudent()) {
    return Boolean(student && getCurrentRoomOwnerId() === HolidayBackendClient.normalizeId(student.studentId));
  }

  function hasActivePetWallRoom() {
    return Boolean(friendState.room && friendState.roomOwnerStudentId);
  }

  function updatePetWallRoomVisibility() {
    const panel = $('#guide-view .pet-interaction-panel');
    if (!panel) return;
    const interactionActive = hasActiveInteractionRoom();
    const active = interactionActive || hasActivePetWallRoom();
    panel.classList.toggle('interaction-room-active', interactionActive);
    panel.classList.toggle('pet-wall-room-active', active);
    panel.classList.toggle('pet-wall-lobby-only', !active);
  }

  function clearActivePetWallRoom(options = {}) {
    friendState.room = null;
    friendState.roomOwnerStudentId = '';
    friendState.roomSlots = [];
    friendState.roomMembers = [];
    friendState.roomRequests = [];
    friendState.roomDecorations = [];
    friendState.roomMessages = [];
    friendState.roomMessageDraft = '';
    friendState.roomNameDraft = '';
    friendState.roomNameDraftDirty = false;
    pendingFurnitureItemId = '';
    setSelectedPetFood('', { silent: true });
    stopRoomAutoRefresh();
    updatePetWallRoomVisibility();
    if (options.render) {
      renderSharedRoomPanel();
      renderRoomChat(getStudent());
      renderPlacedFurniture(getStudent());
      renderPetFurnitureTray(getStudent());
      renderSharedRoomPets();
    }
  }

  function applyRoomResult(result = {}) {
    const previousOwnerStudentId = friendState.roomOwnerStudentId;
    friendState.room = result.room || friendState.room || null;
    const nextOwnerStudentId = HolidayBackendClient.normalizeId(friendState.room?.room_owner_student_id || friendState.room?.roomOwnerStudentId || friendState.roomOwnerStudentId || getStudent()?.studentId);
    if (nextOwnerStudentId && nextOwnerStudentId !== previousOwnerStudentId) {
      friendState.roomMessageDraft = '';
      friendState.roomNameDraft = '';
      friendState.roomNameDraftDirty = false;
    }
    friendState.roomOwnerStudentId = nextOwnerStudentId;
    friendState.roomSlots = (result.slots || []).map(normalizeRoomSlot).slice(0, ROOM_MEMBER_LIMIT);
    friendState.roomMembers = (result.members || []).map(normalizeRoomMember).slice(0, ROOM_MEMBER_LIMIT);
    friendState.roomRequests = (result.pendingRequests || result.roomRequests || []).map(normalizeRoomJoinRequest).slice(0, 20);
    friendState.roomDecorations = (result.decorations || []).map(normalizeRoomDecoration).slice(0, 30);
    friendState.roomMessages = (result.messages || []).map(normalizeRoomMessage).slice(-80);
    if (!friendState.roomNameDraftDirty) {
      friendState.roomNameDraft = normalizeRoomSummary(friendState.room || {}).roomName || '';
    }
    const sceneInfo = getRoomSceneInfo(String(friendState.room?.scene_id || friendState.room?.sceneId || 'open-grassland'));
    setPetInteractionScene(sceneInfo.legacyScene);
    updatePetWallRoomVisibility();
  }

  function applyRoomsResult(result = {}) {
    friendState.rooms = (result.rooms || []).map(normalizeRoomSummary);
    friendState.membershipCount = Math.max(1, Number(result.membershipCount || friendState.membershipCount || 1));
    friendState.membershipLimit = Math.max(1, Number(result.membershipLimit || friendState.membershipLimit || 3));
    friendState.roomsLoaded = true;
  }

  function renderRoomLobby(student = getStudent()) {
    const target = $('#room-lobby-panel');
    if (!target) return;
    if (!canUseFriendsBackend(student)) {
      target.innerHTML = '<div class="room-lobby-empty">宠物墙需要连接云端后使用。</div>';
      return;
    }
    if (friendState.roomsLoading && !friendState.roomsLoaded) {
      target.innerHTML = '<div class="room-lobby-empty">正在读取宠物墙房间...</div>';
      return;
    }
    const currentOwnerId = hasActivePetWallRoom() ? getCurrentRoomOwnerId() : '';
    const rooms = friendState.rooms.length ? friendState.rooms : [normalizeRoomSummary({
      roomOwnerStudentId: student?.studentId,
      ownerName: '我的房间',
      joined: true,
      isOwnRoom: true,
      sceneId: 'open-grassland'
    })];
    const limitReached = Number(friendState.membershipCount || 1) >= Number(friendState.membershipLimit || 3);
    target.innerHTML = `<div class="room-lobby-heading">
      <div><strong>选择宠物墙房间</strong><small>最多 3 间房。这里默认只显示自己的房间；朋友批准你加入后，朋友房间才会出现在这里。</small></div>
      <button type="button" class="secondary-button" data-room-list-refresh>刷新列表</button>
    </div>
    <form class="room-join-form" data-room-join-form>
      <input name="roomCode" maxlength="12" autocomplete="off" placeholder="输入房间 ID" aria-label="房间 ID" />
      <button type="submit" class="primary-button">申请加入房间</button>
    </form>
    <div class="room-lobby-empty pet-wall-lobby-guide">先点击自己的房间进入。要看朋友房间，需要朋友给你房间 ID，或在好友主页申请加入。</div>
    <div class="room-lobby-grid">${rooms.map(room => {
      const active = room.roomOwnerStudentId === currentOwnerId;
      const locked = !room.isOwnRoom && room.isClosed;
      const full = Number(room.memberCount || 1) >= Number(room.memberLimit || ROOM_MEMBER_LIMIT);
      const disabled = locked || room.pendingApproval || !room.joined || (!room.joined && (limitReached || full));
      const scene = getRoomSceneInfo(room.sceneId);
      const title = getRoomDisplayName(room);
      const status = locked ? '已关闭' : (room.pendingApproval ? '等待房主批准' : (room.joined ? '点击进入' : `${friendState.membershipCount}/${friendState.membershipLimit} 间`));
	      const closeControl = room.isOwnRoom
	        ? `<button type="button" class="room-card-close-button" data-room-list-close="${room.isClosed ? 'false' : 'true'}" data-room-list-owner="${escapeHtml(room.roomOwnerStudentId)}" aria-label="${room.isClosed ? '重新开放宠物墙' : '关闭宠物墙'}">${room.isClosed ? '↺' : '×'}</button>`
	        : '';
	      return `<div class="room-card-shell">
	        <button type="button" class="room-card${active ? ' active' : ''}${locked ? ' closed' : ''}" data-room-enter="${escapeHtml(room.roomOwnerStudentId)}" ${disabled ? 'disabled' : ''}>
	          <span class="room-card-title">${escapeHtml(title)}</span>
	          <small>房间 ID ${escapeHtml(room.roomId || '生成中')} · ${escapeHtml(room.isOwnRoom ? '我的房间' : (room.ownerStudentName || room.ownerName || room.roomOwnerStudentId))} · ${escapeHtml(scene.label)} · ${Number(room.memberCount || 1)}/${Number(room.memberLimit || ROOM_MEMBER_LIMIT)} · ${escapeHtml(full && !room.joined ? '已满员' : status)}</small>
	        </button>
	        ${closeControl}
	      </div>`;
	    }).join('')}</div>`;
  }

  function renderRoomChat(student = getStudent()) {
    const target = $('#room-chat-panel');
    if (!target) return;
    if (!canUseFriendsBackend(student) || !hasActivePetWallRoom()) {
      target.innerHTML = '';
      return;
    }
    const existingInput = target.querySelector('input[name="roomMessage"]');
    const wasFocused = document.activeElement === existingInput;
    const selectionStart = wasFocused && Number.isFinite(existingInput?.selectionStart) ? existingInput.selectionStart : null;
    const selectionEnd = wasFocused && Number.isFinite(existingInput?.selectionEnd) ? existingInput.selectionEnd : selectionStart;
    if (wasFocused) friendState.roomMessageDraft = String(existingInput.value || '');
    const messages = friendState.roomMessages.slice(-80);
    target.innerHTML = `<div class="room-chat-heading">
      <div><strong>房间聊天</strong><small>只显示最近 2 天的记录。</small></div>
      <span>${friendState.roomLoading ? '更新中...' : `${messages.length} 条`}</span>
    </div>
    <div class="room-chat-list" aria-live="polite">${messages.length ? messages.map(message => `
      <div class="room-chat-message">
        <strong>${escapeHtml(message.petName || message.studentName || message.studentId)}</strong>
        <span>${escapeHtml(message.text)}</span>
        <small>${escapeHtml(formatWallDate(message.createdAt))}</small>
      </div>`).join('') : '<div class="room-chat-empty">还没有聊天记录。</div>'}</div>
    <form class="room-chat-form" data-room-chat-form>
	      <input name="roomMessage" maxlength="60" autocomplete="off" placeholder="写一句给房间朋友的话" value="${escapeHtml(friendState.roomMessageDraft)}" />
	      <button type="submit" class="primary-button">发送</button>
	    </form>`;
    if (wasFocused) {
      const nextInput = target.querySelector('input[name="roomMessage"]');
      nextInput?.focus({ preventScroll: true });
      if (nextInput && selectionStart !== null) {
        try { nextInput.setSelectionRange(selectionStart, selectionEnd); } catch (error) {}
      }
    }
  }

  async function loadSharedRooms(force = false) {
    const student = getStudent();
    if (!canUseFriendsBackend(student)) {
      friendState.roomsLoaded = true;
      renderRoomLobby(student);
      return false;
    }
    if (friendState.roomsLoading || (friendState.roomsLoaded && !force)) {
      renderRoomLobby(student);
      return true;
    }
    friendState.roomsLoading = true;
    renderRoomLobby(student);
    try {
      const result = await backend.listRooms(student.studentId);
      if (!result.ok) throw new Error(result.error || '房间列表读取失败');
      applyRoomsResult(result);
      friendState.roomsLoading = false;
      renderRoomLobby(student);
      return true;
    } catch (error) {
      friendState.roomsLoading = false;
      friendState.roomsLoaded = true;
      renderRoomLobby(student);
      showToast(`房间列表读取失败：${error.message || error}`);
      return false;
    }
  }

  async function loadSharedRoom(roomOwnerStudentId = getStudent()?.studentId, options = {}) {
    const student = getStudent();
    if (!canUseFriendsBackend(student)) {
      renderSharedRoomPanel();
      renderSharedRoomPets();
      renderRoomChat(student);
      return false;
    }
    friendState.roomLoading = true;
    friendState.roomOwnerStudentId = HolidayBackendClient.normalizeId(roomOwnerStudentId || student.studentId);
    if (!options.silent) {
      renderRoomLobby(student);
      renderSharedRoomPanel();
      renderRoomChat(student);
    }
    try {
      const result = await backend.listRoom(student.studentId, friendState.roomOwnerStudentId);
      if (!result.ok) throw new Error(result.error || '宠物墙读取失败');
      applyRoomResult(result);
      friendState.roomLoading = false;
      if (result.student) {
        database[student.studentId] = HolidayBackendClient.normalizeStudent(result.student, [], database[student.studentId]);
        saveDatabase();
        renderAppShell();
      }
      renderRoomLobby(student);
      renderSharedRoomPanel();
      renderRoomChat(student);
      renderPlacedFurniture(student);
      renderSharedRoomPets();
      initKuromiRoomDemo();
      return true;
    } catch (error) {
      friendState.roomLoading = false;
      if (!options.silent) clearActivePetWallRoom();
      renderRoomLobby(student);
      renderSharedRoomPanel();
      renderRoomChat(student);
      if (!options.silent) showToast(`宠物墙读取失败：${error.message || error}`);
      return false;
    }
  }

  function renderSharedRoomPanel() {
    const target = $('#shared-room-panel');
    const student = getStudent();
    if (!target) return;
    if (!hasActivePetWallRoom()) {
      target.innerHTML = '';
      return;
    }
    if (!canUseFriendsBackend(student)) {
      target.innerHTML = '<div class="shared-room-empty">宠物墙需要连接 Supabase 云端后使用。</div>';
      return;
    }
    const currentOwnerId = getCurrentRoomOwnerId() || student.studentId;
    const currentRoomOption = friendState.rooms.find(room => room.roomOwnerStudentId === currentOwnerId);
    const room = normalizeRoomSummary({
      ...(currentRoomOption || {}),
      ...(friendState.room || {}),
      roomOwnerStudentId: currentOwnerId,
      isOwnRoom: currentOwnerId === student.studentId || currentRoomOption?.isOwnRoom
    });
    const currentScene = getRoomSceneInfo(String(room.sceneId || friendState.room?.scene_id || friendState.room?.sceneId || 'open-grassland')).id;
    const uniqueMemberIds = new Set(friendState.roomMembers.map(member => HolidayBackendClient.normalizeId(member.studentId)).filter(Boolean));
    const memberCount = Math.max(1, uniqueMemberIds.size || Number(room.memberCount || 1));
    const memberLimit = Number(room.memberLimit || ROOM_MEMBER_LIMIT);
    const title = getRoomDisplayName(room);
    const roomId = room.roomId || String(friendState.room?.room_id || friendState.room?.roomId || '').trim().toUpperCase() || '生成中';
    const ownerCopy = room.isOwnRoom ? '自己的宠物墙' : `${room.ownerStudentName || room.ownerName || currentOwnerId}的宠物墙`;
    const closedCopy = room.isClosed ? '已关闭' : '开放中';
    const existingRoomNameInput = target.querySelector('input[name="roomName"]');
    const roomNameWasFocused = document.activeElement === existingRoomNameInput;
    const roomNameSelectionStart = roomNameWasFocused && Number.isFinite(existingRoomNameInput?.selectionStart) ? existingRoomNameInput.selectionStart : null;
    const roomNameSelectionEnd = roomNameWasFocused && Number.isFinite(existingRoomNameInput?.selectionEnd) ? existingRoomNameInput.selectionEnd : roomNameSelectionStart;
    if (roomNameWasFocused) {
      friendState.roomNameDraft = String(existingRoomNameInput.value || '');
      friendState.roomNameDraftDirty = true;
    }
    const roomNameValue = friendState.roomNameDraftDirty ? friendState.roomNameDraft : room.roomName;
    const settingControls = room.isOwnRoom ? `<form class="room-settings-form" data-room-settings-form>
      <label><span>房间名字</span><input name="roomName" maxlength="18" value="${escapeHtml(roomNameValue)}" placeholder="例如：小太阳草原" /></label>
      <button type="submit" class="secondary-button">保存名字</button>
      <button type="button" class="secondary-button" data-room-close="${room.isClosed ? 'false' : 'true'}">${room.isClosed ? '重新开放' : '关闭房间'}</button>
      <button type="button" class="danger-lite-button" data-room-reset>重置房间</button>
    </form>` : '';
    const memberMarkup = friendState.roomMembers.length ? `<div class="room-member-list">
      ${friendState.roomMembers.map(member => {
        const pet = getPetInfo(member.petType);
        const petName = member.petName || member.studentName || pet?.name || member.studentId;
        const canRemove = room.isOwnRoom && !member.isOwner && member.studentId !== student.studentId;
        return `<div class="room-member-chip">
          <span>${escapeHtml(member.avatar || '🌟')}</span>
          <strong>${escapeHtml(petName)}</strong>
          <small>${escapeHtml(member.isOwner ? '房主' : (member.studentName || member.studentId))}</small>
          ${canRemove ? `<button type="button" class="icon-mini-button" data-room-member-remove="${escapeHtml(member.studentId)}" aria-label="${escapeHtml(`移除 ${petName}`)}">×</button>` : ''}
        </div>`;
      }).join('')}
    </div>` : '<div class="shared-room-empty">进入房间的好友会显示在这里。</div>';
    const requestMarkup = room.isOwnRoom && friendState.roomRequests.length ? `<div class="room-request-list">
      <strong>加入申请</strong>
      ${friendState.roomRequests.map(request => {
        const pet = getPetInfo(request.petType);
        const petName = request.petName || pet?.name || '还没有宠物名';
        const studentName = request.studentName || request.studentId;
        return `<div class="room-request-row">
          <span class="room-request-avatar">${escapeHtml(request.avatar || '🌟')}</span>
          <span><strong>${escapeHtml(petName)}</strong><small>${escapeHtml(studentName)} · ${escapeHtml(formatWallDate(request.requestedAt))}</small></span>
          <button type="button" class="secondary-button" data-room-request-response="reject" data-room-request-student="${escapeHtml(request.studentId)}">拒绝</button>
          <button type="button" class="primary-button" data-room-request-response="accept" data-room-request-student="${escapeHtml(request.studentId)}">批准</button>
        </div>`;
      }).join('')}
    </div>` : '';
    const sceneControl = ROOM_SCENES.length > 1
      ? `<div class="shared-room-row">
        <label><span>背景</span><select data-room-scene-select>${ROOM_SCENES.map(scene => `<option value="${escapeHtml(scene.id)}"${scene.id === currentScene ? ' selected' : ''}>${escapeHtml(scene.label)}</option>`).join('')}</select></label>
      </div>`
      : '';
    target.innerHTML = `<div class="shared-room-header">
      <div><strong>${escapeHtml(title)}</strong><small>房间 ID ${escapeHtml(roomId)} · ${escapeHtml(ownerCopy)} · ${escapeHtml(closedCopy)} · ${memberCount}/${memberLimit} · 最多 ${ROOM_MEMBER_LIMIT} 位同学</small></div>
      <button type="button" class="secondary-button" data-room-refresh>刷新房间</button>
    </div>
    ${settingControls}
    ${sceneControl}
    ${requestMarkup}
    ${memberMarkup}`;
    if (roomNameWasFocused) {
      const nextInput = target.querySelector('input[name="roomName"]');
      nextInput?.focus({ preventScroll: true });
      if (nextInput && roomNameSelectionStart !== null) {
        try { nextInput.setSelectionRange(roomNameSelectionStart, roomNameSelectionEnd); } catch (error) {}
      }
    }
  }

  async function updateCurrentRoomSettings(form) {
    const student = getStudent();
    if (!student || !form) return false;
    const roomOwnerStudentId = getCurrentRoomOwnerId() || student.studentId;
    if (roomOwnerStudentId !== HolidayBackendClient.normalizeId(student.studentId)) {
      showToast('只能修改自己创建的宠物墙。');
      return false;
    }
    const input = form.querySelector('input[name="roomName"]');
    const roomName = String(input?.value || '').trim();
    if (roomName) {
      const validation = validatePublicDisplayText(roomName, 18, '房间名字不能为空。', '房间名字');
      if (!validation.ok) {
        showToast(validation.error || '房间名字不适合公开展示。');
        return false;
      }
    }
    const isClosed = Boolean(normalizeRoomSummary(friendState.room || {}).isClosed);
    const result = await backend.updateRoomSettings({ studentId: student.studentId, roomOwnerStudentId, roomName, isClosed });
    if (!result.ok) {
      showToast(result.error || '房间名字保存失败。');
      return false;
    }
    friendState.roomNameDraft = roomName;
    friendState.roomNameDraftDirty = false;
    applyRoomResult(result);
    await loadSharedRooms(true);
    renderSharedRoomPanel();
    renderRoomChat(student);
    showToast('宠物墙名字已保存。');
    return true;
  }

  async function toggleCurrentRoomClosed(button) {
    const student = getStudent();
    const roomOwnerStudentId = getCurrentRoomOwnerId() || student?.studentId;
    if (!student || roomOwnerStudentId !== HolidayBackendClient.normalizeId(student.studentId)) {
      showToast('只能关闭自己创建的宠物墙。');
      return false;
    }
    const isClosed = String(button?.dataset.roomClose || '') === 'true';
    const roomName = String(normalizeRoomSummary(friendState.room || {}).roomName || '');
    const result = await backend.updateRoomSettings({ studentId: student.studentId, roomOwnerStudentId, roomName, isClosed });
    if (!result.ok) {
      showToast(result.error || '宠物墙状态更新失败。');
      return false;
    }
    applyRoomResult(result);
    await loadSharedRooms(true);
    renderSharedRoomPanel();
    renderRoomChat(student);
    showToast(isClosed ? '宠物墙已关闭，好友暂时不能进入。' : '宠物墙已重新开放。');
    return true;
  }

  async function toggleOwnRoomFromList(button) {
    const student = getStudent();
    const roomOwnerStudentId = HolidayBackendClient.normalizeId(button?.dataset.roomListOwner);
    if (!student || roomOwnerStudentId !== HolidayBackendClient.normalizeId(student.studentId)) {
      showToast('只能关闭自己创建的宠物墙。');
      return false;
    }
    const room = friendState.rooms.find(item => item.roomOwnerStudentId === roomOwnerStudentId) || {};
    const isClosed = String(button?.dataset.roomListClose || '') === 'true';
    const result = await backend.updateRoomSettings({
      studentId: student.studentId,
      roomOwnerStudentId,
      roomName: normalizeRoomSummary(room).roomName,
      isClosed
    });
    if (!result.ok) {
      showToast(result.error || '宠物墙状态更新失败。');
      return false;
    }
    if (hasActivePetWallRoom() && getCurrentRoomOwnerId() === roomOwnerStudentId) applyRoomResult(result);
    await loadSharedRooms(true);
    renderRoomLobby(student);
    renderSharedRoomPanel();
    renderRoomChat(student);
    showToast(isClosed ? '宠物墙已关闭，好友暂时不能进入。' : '宠物墙已重新开放。');
    return true;
  }

  async function resetCurrentRoom(button) {
    const student = getStudent();
    const roomOwnerStudentId = getCurrentRoomOwnerId() || student?.studentId;
    if (!student || roomOwnerStudentId !== HolidayBackendClient.normalizeId(student.studentId)) {
      showToast('只能重置自己创建的宠物墙。');
      return false;
    }
    if (!confirm('确定要暂时移除房间里的好友宠物吗？装饰和聊天会保留。')) return false;
    const result = await backend.resetRoom(student.studentId, roomOwnerStudentId);
    if (!result.ok) {
      showToast(result.error || '宠物墙重置失败。');
      return false;
    }
    applyRoomResult(result);
    renderRoomLobby(student);
    renderSharedRoomPanel();
    renderRoomChat(student);
    renderSharedRoomPets();
    showToast('房间里的好友宠物已暂时移除。');
    return true;
  }

  async function removeCurrentRoomMember(button) {
    const student = getStudent();
    const memberStudentId = HolidayBackendClient.normalizeId(button?.dataset.roomMemberRemove);
    const roomOwnerStudentId = getCurrentRoomOwnerId() || student?.studentId;
    if (!student || !memberStudentId) return false;
    if (roomOwnerStudentId !== HolidayBackendClient.normalizeId(student.studentId)) {
      showToast('只有房主可以移除房间成员。');
      return false;
    }
    const result = await backend.removeRoomMember(student.studentId, roomOwnerStudentId, memberStudentId);
    if (!result.ok) {
      showToast(result.error || '移除成员失败。');
      return false;
    }
    applyRoomResult(result);
    await loadSharedRooms(true);
    renderSharedRoomPanel();
    renderRoomChat(student);
    renderSharedRoomPets();
    showToast('已把这位好友暂时移出房间。');
    return true;
  }

  async function respondRoomJoinRequest(button) {
    const student = getStudent();
    const requesterStudentId = HolidayBackendClient.normalizeId(button?.dataset.roomRequestStudent);
    const decision = String(button?.dataset.roomRequestResponse || '').trim().toLowerCase();
    const roomOwnerStudentId = getCurrentRoomOwnerId() || student?.studentId;
    if (!student || !requesterStudentId || !['accept', 'reject'].includes(decision)) return false;
    if (roomOwnerStudentId !== HolidayBackendClient.normalizeId(student.studentId)) {
      showToast('只有房主可以处理加入申请。');
      return false;
    }
    const result = await backend.respondRoomJoinRequest(student.studentId, roomOwnerStudentId, requesterStudentId, decision);
    if (!result.ok) {
      showToast(result.error || '加入申请处理失败。');
      return false;
    }
    applyRoomResult(result);
    await loadSharedRooms(true);
    renderSharedRoomPanel();
    renderRoomChat(student);
    renderSharedRoomPets();
    showToast(decision === 'accept' ? '已批准加入宠物墙。' : '已拒绝这次加入申请。');
    return true;
  }

  async function sendRoomChatMessage(form) {
    const student = getStudent();
    if (!student || !form) return false;
    if (!hasActivePetWallRoom()) {
      showToast('请先进入一个宠物墙房间。');
      return false;
    }
    const input = form.querySelector('input[name="roomMessage"]');
    const text = String(input?.value || '').trim();
    const validation = validatePublicDisplayText(text, 60, '先写一句聊天内容。', '聊天内容');
    if (!validation.ok) {
      showToast(validation.error || '聊天内容不适合公开展示。');
      return false;
    }
    const result = await backend.sendRoomMessage({
      studentId: student.studentId,
      roomOwnerStudentId: getCurrentRoomOwnerId() || student.studentId,
      text: validation.text
    });
    if (!result.ok) {
      showToast(result.error || '聊天发送失败。');
      return false;
    }
    applyRoomResult(result);
    friendState.roomMessageDraft = '';
    if (input) input.value = '';
    renderRoomChat(student);
    const list = $('#room-chat-panel .room-chat-list');
    if (list) list.scrollTop = list.scrollHeight;
    return true;
  }

  async function enterPetWallRoom(roomOwnerStudentId) {
    const student = getStudent();
    const ownerId = HolidayBackendClient.normalizeId(roomOwnerStudentId);
    if (!student || !ownerId) return false;
    const loaded = await loadSharedRoom(ownerId);
    if (loaded) {
      initKuromiRoomDemo();
      startRoomAutoRefresh();
    }
    return loaded;
  }

  async function joinRoomByCode(form) {
    const student = getStudent();
    const input = form?.querySelector('input[name="roomCode"]');
    const roomCode = String(input?.value || '').trim().toUpperCase().replace(/\s+/g, '');
    if (!student || !roomCode) {
      showToast('请输入房间 ID。');
      return false;
    }
    const result = await backend.joinRoomByCode(student.studentId, roomCode);
    if (!result.ok) {
      showToast(result.error || '加入房间失败。');
      return false;
    }
    if (result.pendingApproval) {
      if (input) input.value = '';
      await loadSharedRooms(true);
      showToast(result.message || result.error || '申请已经送出，等待房主批准。');
      return true;
    }
    applyRoomResult(result);
    if (input) input.value = '';
    await loadSharedRooms(true);
    renderSharedRoomPanel();
    renderRoomChat(student);
    renderPlacedFurniture(student);
    renderPetFurnitureTray(student);
    renderSharedRoomPets();
    initKuromiRoomDemo();
    startRoomAutoRefresh();
    showToast('已加入宠物墙房间。');
    return true;
  }

  async function openFriendPetWall(friendId) {
    const student = getStudent();
    const ownerId = HolidayBackendClient.normalizeId(friendId);
    if (!student || !ownerId) return false;
    const result = await backend.requestRoomJoin(student.studentId, ownerId);
    if (!result.ok) {
      showToast(result.error || '申请加入宠物墙失败。');
      return false;
    }
    await loadSharedRooms(true);
    renderFriendsView();
    showToast(result.message || (result.pendingApproval ? '申请已经送出，等待房主批准。' : '你已经加入这个宠物墙，可以从宠物墙列表进入。'));
    return true;
  }

  function renderSharedRoomPets() {
    const track = $('#pet-interaction-stage .pet-interaction-track');
    if (!track) return;
    track.querySelectorAll('.pet-interaction-guest, .room-decoration').forEach(element => element.remove());
    if (!hasActivePetWallRoom()) return;
    const renderGuest = (petId, displayName, position, index) => {
      const pet = getPetInfo(petId);
      const sprite = PET_INTERACTION_SPRITES[petId] || PET_INTERACTION_SPRITES.creeper;
      if (!pet || !sprite) return;
      const movement = String(sprite.movement || 'ground');
      const isFlying = movement.includes('fly') || movement.includes('hover');
      const safeIndex = Math.max(0, index);
      const wanderXValues = [5, -6, 7, -5, 6, -4, 8, -7, 4];
      const groundWanderYValues = [-4, -6, -3, -5, -4, -7, -4, -6, -3];
      const flyingWanderYValues = [-18, -24, -15, -21, -17, -23, -16, -20, -18];
      const wanderX = wanderXValues[safeIndex % wanderXValues.length];
      const wanderY = (isFlying ? flyingWanderYValues : groundWanderYValues)[safeIndex % wanderXValues.length];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pet-interaction-guest';
      button.dataset.roomPetFeedTarget = petId;
      button.dataset.petDisplayName = displayName;
      button.dataset.petMovement = movement;
      button.style.setProperty('--guest-x', `${position.x}%`);
      button.style.setProperty('--guest-y', position.y);
      button.style.setProperty('--guest-dx', `${wanderX}vw`);
      button.style.setProperty('--guest-dy', `${wanderY}px`);
      button.style.setProperty('--guest-duration', `${5.2 + (safeIndex * 0.7)}s`);
      button.style.setProperty('--guest-delay', `${safeIndex * -0.55}s`);
      button.innerHTML = `<span class="pet-interaction-guest-name">${escapeHtml(displayName)}</span><img src="${escapeHtml(withAssetVersion(sprite.src))}" alt="${escapeHtml(displayName)}" loading="lazy" decoding="async" />`;
      track.appendChild(button);
    };
    const members = friendState.roomMembers.length
      ? friendState.roomMembers
      : friendState.roomSlots.slice(0, ROOM_MEMBER_LIMIT).map(slot => {
        const friend = getFriendById(slot.guestStudentId);
        return normalizeRoomMember({
          studentId: slot.guestStudentId,
          studentName: friend?.studentName || slot.guestStudentId,
          petName: friend?.petName || '',
          petType: slot.petId
        });
      });
    const currentStudentId = HolidayBackendClient.normalizeId(getStudent()?.studentId);
    members.filter(member => member.studentId !== currentStudentId).slice(0, ROOM_MEMBER_LIMIT - 1).forEach((member, index) => {
      const pet = getPetInfo(member.petType);
      if (!pet) return;
      const displayName = member.petName || member.studentName || pet.name || '好友宠物';
      renderGuest(member.petType, displayName, ROOM_GUEST_POSITIONS[index] || ROOM_GUEST_POSITIONS[0], index);
    });
  }

  async function updateSharedRoomScene(sceneId) {
    const student = getStudent();
    if (!student) return false;
    const result = await backend.updateRoomScene(student.studentId, friendState.roomOwnerStudentId || student.studentId, sceneId);
    if (!result.ok) {
      showToast(result.error || '背景更新失败。');
      return false;
    }
    applyRoomResult(result);
    renderRoomLobby(student);
    renderSharedRoomPanel();
    renderRoomChat(student);
    renderPlacedFurniture(student);
    renderSharedRoomPets();
    return true;
  }

  async function placeRoomDecorationById(decorationId) {
    const student = getStudent();
    const item = ROOM_DECORATIONS.find(entry => entry.id === decorationId);
    if (!student || !item) return false;
    const offset = friendState.roomDecorations.length % 4;
    const result = await backend.placeRoomDecoration({
      studentId: student.studentId,
      roomOwnerStudentId: friendState.roomOwnerStudentId || student.studentId,
      decorationItemId: item.id,
      price: item.price,
      xPercent: Math.max(6, Math.min(94, item.x + offset * 4)),
      yPercent: Math.max(8, Math.min(92, item.y - offset * 4)),
      scale: 1,
      layerIndex: offset
    });
    if (!result.ok) {
      showToast(result.error || '装饰摆放失败。');
      return false;
    }
    if (result.student) {
      database[student.studentId] = HolidayBackendClient.normalizeStudent(result.student, [], database[student.studentId]);
      saveDatabase();
      renderAppShell();
    }
    applyRoomResult(result);
    renderRoomLobby(student);
    renderSharedRoomPanel();
    renderRoomChat(student);
    renderPlacedFurniture(student);
    renderSharedRoomPets();
    showToast('房间装饰好了。');
    return true;
  }

  function formatWallDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  function renderWallStatGrid(stats = {}, petType = '') {
    const statMeta = [
      ['hp', '生命'],
      ['attack', '攻击'],
      ['defense', '防御'],
      ['speed', '速度'],
      ['luck', '幸运']
    ];
    return `<div class="wall-stat-grid">${statMeta.map(([key, label]) => `
      <span><small>${label}</small><strong>${escapeHtml(formatStatValue(key, stats[key] || 0, petType))}</strong></span>
    `).join('')}</div>`;
  }

  function renderWallEquipmentList(equipment = []) {
    if (!equipment.length) return '<div class="wall-equipment-list empty">尚未装备任何物品</div>';
    return `<div class="wall-equipment-list">${equipment.slice(0, 6).map(item => `
      <span>${item.image ? `<img src="${escapeHtml(withAssetVersion(item.image))}" alt="${escapeHtml(item.name)}" />` : ''}<b>${escapeHtml(item.slotLabel)}</b><strong>${escapeHtml(item.name)}</strong></span>
    `).join('')}</div>`;
  }

  function renderWallCommentSelect(postId) {
    const options = WALL_COMMENT_PRESETS.map((text, index) => `<option value="${escapeHtml(text)}"${index === 0 ? ' selected' : ''}>${escapeHtml(localize(text))}</option>`).join('');
    return `<form class="wall-comment-select-form" data-wall-preset-comment="${escapeHtml(postId)}">
      <label class="wall-comment-select-label">
        <span>${escapeHtml(localize('选择一句预设留言'))}</span>
        <select class="wall-comment-select" data-wall-comment-select>${options}</select>
      </label>
      <button type="submit" class="wall-comment-select-button">${escapeHtml(localize('发送预设留言'))}</button>
    </form>`;
  }

  function renderWallPostPresetButtons(target) {
    if (!target) return;
    const options = WALL_POST_PRESETS.map(message => `
      <option value="${escapeHtml(message)}"${message === selectedWallPostPreset ? ' selected' : ''}>${escapeHtml(localize(message))}</option>
    `).join('');
    const buttons = WALL_POST_PRESETS.map(message => `
      <button type="button" class="wall-preset-button${message === selectedWallPostPreset ? ' active' : ''}" data-wall-post-preset="${escapeHtml(message)}">${escapeHtml(localize(message))}</button>
    `).join('');
    target.innerHTML = `
      <label class="wall-preset-select-wrap">
        <span class="sr-only">${escapeHtml(localize('选择分享文字'))}</span>
        <select class="wall-preset-select" data-wall-post-select>${options}</select>
      </label>
      <div class="wall-preset-button-row">${buttons}</div>
    `;
  }

  function renderHomeWallShare(student) {
    // Legacy hook kept for slow Sheet wall sync callbacks; the home share panel was removed.
  }

  function getShareFileExtension(type, fallback = 'png') {
    if (type === 'image/jpeg') return 'jpg';
    if (type === 'image/webp') return 'webp';
    if (type === 'image/png') return 'png';
    return fallback;
  }

  function sanitizeShareFileName(value) {
    return String(value || 'your-cy-pets-project')
      .normalize('NFKC')
      .replace(/[^\w\u4e00-\u9fff-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 42) || 'your-cy-pets-project';
  }

  async function imageSourceToShareFile(src, baseName) {
    const response = await fetch(src);
    if (!response.ok) throw new Error('暂时无法分享图片，请稍后再试。');
    const blob = await response.blob();
    const type = blob.type || 'image/png';
    return new File([blob], `${sanitizeShareFileName(baseName)}.${getShareFileExtension(type)}`, { type });
  }

  async function canvasToShareFile(canvas, baseName) {
    const blob = await new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error('暂时无法分享图片，请稍后再试。')), 15000);
      canvas.toBlob(result => {
        window.clearTimeout(timeout);
        resolve(result);
      }, 'image/png', 0.92);
    });
    if (!blob) throw new Error('暂时无法分享图片，请稍后再试。');
    return new File([blob], `${sanitizeShareFileName(baseName)}.png`, { type: 'image/png' });
  }

  async function runNativeShareWithTimeout(sharePayload, timeoutMs = 15000) {
    let timeoutId;
    try {
      await Promise.race([
        navigator.share(sharePayload),
        new Promise((_, reject) => {
          timeoutId = window.setTimeout(() => {
            const error = new Error('Native share timed out.');
            error.name = 'ShareTimeoutError';
            reject(error);
          }, timeoutMs);
        })
      ]);
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
    }
  }

  async function loadCanvasImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const resolvedUrl = new URL(src, window.location.href);
      const timeout = window.setTimeout(() => {
        image.onload = null;
        image.onerror = null;
        reject(new Error('暂时无法分享图片，请稍后再试。'));
      }, 20000);
      if (resolvedUrl.origin !== window.location.origin) image.crossOrigin = 'anonymous';
      image.onload = () => {
        window.clearTimeout(timeout);
        resolve(image);
      };
      image.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error('暂时无法分享图片，请稍后再试。'));
      };
      image.src = resolvedUrl.href;
    });
  }

  function drawCanvasRoundRect(ctx, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + safeRadius, y);
    ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
    ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
    ctx.arcTo(x, y + height, x, y, safeRadius);
    ctx.arcTo(x, y, x + width, y, safeRadius);
    ctx.closePath();
  }

  function loadShareBrandLogoImage() {
    if (!shareBrandLogoImagePromise) {
      shareBrandLogoImagePromise = loadCanvasImage(withAssetVersion(SHARE_BRAND_LOGO_SRC)).catch(() => null);
    }
    return shareBrandLogoImagePromise;
  }

  function getRoleShareFrame(frameId = '') {
    return ROLE_SHARE_FRAMES.find(frame => frame.id === String(frameId || '').trim()) || null;
  }

  function loadRoleShareFrameImage(frameId = '') {
    const frame = getRoleShareFrame(frameId);
    if (!frame) return Promise.resolve(null);
    if (!roleShareFrameImagePromises.has(frame.id)) {
      roleShareFrameImagePromises.set(frame.id, loadCanvasImage(withAssetVersion(frame.src)).catch(() => null));
    }
    return roleShareFrameImagePromises.get(frame.id);
  }

  function loadRoleSharePowerFrameImage(frameId = '') {
    const frame = getRoleShareFrame(frameId);
    if (!frame?.powerSrc) return Promise.resolve(null);
    if (!roleSharePowerFrameImagePromises.has(frame.id)) {
      roleSharePowerFrameImagePromises.set(frame.id, loadCanvasImage(withAssetVersion(frame.powerSrc)).catch(() => null));
    }
    return roleSharePowerFrameImagePromises.get(frame.id);
  }

  function getDefaultRoleShareFrameId(student = getStudent()) {
    const petType = student?.petType || '';
    const style = getPetEvolutionStyle(student, petType);
    return style === EVOLUTION_STYLE_CUTE ? 'cute' : 'heroic';
  }

  function getSimpleRoleShareDisplayName(student = getStudent(), pet = getPetInfo(student?.petType)) {
    const petName = String(getPetNickname(student, student?.petType) || pet?.name || '宠物').trim();
    const playerName = getPlayerDisplayName(student);
    if (playerName && String(petName).trim().startsWith(`${playerName}的`)) return petName;
    const petOwnerPrefix = petName.match(/^(.{1,16})的/)?.[1] || '';
    const normalizeOwnerName = value => String(value || '').replace(/(老师|大师|同学|小号)$/g, '').trim().toLocaleLowerCase();
    const normalizedPlayerName = normalizeOwnerName(playerName);
    const normalizedPetOwner = normalizeOwnerName(petOwnerPrefix);
    if (normalizedPlayerName && normalizedPetOwner && (normalizedPlayerName.includes(normalizedPetOwner) || normalizedPetOwner.includes(normalizedPlayerName))) {
      return petName;
    }
    return playerName ? `${playerName}的${petName}` : petName;
  }

  function getRoleShareInviteText(student = getStudent()) {
    const inviteId = HolidayBackendClient.normalizeId(student?.studentId || session.studentId || '');
    if (!inviteId) return '';
    const playerName = getPlayerDisplayName(student);
    if (currentLanguage === 'en') return playerName ? `Add me: ${playerName}'s ${inviteId}` : `Add me: ${inviteId}`;
    return playerName ? `加好友：${playerName}的${inviteId}` : `加好友：${inviteId}`;
  }

  function drawRoleShareFrame(ctx, frameImage, width, height, options = {}) {
    if (!frameImage) return;
    const x = Number(options.x || 0);
    const y = Number(options.y || 0);
    ctx.save();
    drawImageCover(ctx, frameImage, x, y, width, height);
    ctx.restore();
  }

  function drawShareBrandLogo(ctx, logoImage, x, y, options = {}) {
    const logoHeight = options.height || 78;
    const maxLogoWidth = options.maxWidth || 340;
    const paddingX = options.paddingX ?? 22;
    const paddingY = options.paddingY ?? 12;
    const panelHeight = logoHeight + paddingY * 2;
    ctx.save();
    if (!logoImage) {
      const fallbackText = '5+1教育补习中心';
      ctx.font = '900 34px sans-serif';
      const panelWidth = Math.min(maxLogoWidth + paddingX * 2, ctx.measureText(fallbackText).width + paddingX * 2);
      drawCanvasRoundRect(ctx, x, y, panelWidth, panelHeight, Math.min(32, panelHeight / 2));
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.fill();
      ctx.fillStyle = '#4541c9';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(fallbackText, x + panelWidth / 2, y + panelHeight / 2 + 1, panelWidth - paddingX * 2);
      ctx.restore();
      return { width: panelWidth, height: panelHeight };
    }
    const logoRatio = Number(logoImage.naturalWidth || logoImage.width || 1) / Math.max(1, Number(logoImage.naturalHeight || logoImage.height || 1));
    const logoWidth = Math.min(maxLogoWidth, Math.round(logoHeight * logoRatio));
    const panelWidth = logoWidth + paddingX * 2;
    drawCanvasRoundRect(ctx, x, y, panelWidth, panelHeight, Math.min(32, panelHeight / 2));
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    ctx.fill();
    ctx.drawImage(logoImage, x + paddingX, y + paddingY, logoWidth, logoHeight);
    ctx.restore();
    return { width: panelWidth, height: panelHeight };
  }

  function drawShareSwordIcon(ctx, cx, cy, size, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    [-1, 1].forEach(direction => {
      ctx.save();
      ctx.rotate(direction * 0.72);
      ctx.lineWidth = Math.max(3, size * 0.1);
      ctx.beginPath();
      ctx.moveTo(0, size * 0.35);
      ctx.lineTo(0, -size * 0.36);
      ctx.stroke();
      ctx.lineWidth = Math.max(3, size * 0.08);
      ctx.beginPath();
      ctx.moveTo(-size * 0.16, size * 0.08);
      ctx.lineTo(size * 0.16, size * 0.08);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, size * 0.43, size * 0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  }

  function drawSharePowerBadge(ctx, power, x, y, width = 320, height = 68, options = {}) {
    const valueText = String(Math.max(0, Math.floor(Number(power || 0))));
    const labelText = String(options.label || '').trim();
    const frameImage = options.frameImage || null;
    const frameId = String(options.frameId || '').trim();
    const isHeroicFrame = frameId === 'heroic';
    ctx.save();
    const frameBleedX = frameImage ? Math.round(Math.min(58, height * 0.38)) : 0;
    const frameBleedY = frameImage ? Math.round(Math.min(44, height * 0.28)) : 0;
    if (frameImage) {
      ctx.drawImage(frameImage, x - frameBleedX, y - frameBleedY, width + frameBleedX * 2, height + frameBleedY * 2);
    } else {
      drawCanvasRoundRect(ctx, x, y, width, height, height / 2);
      ctx.fillStyle = 'rgba(255,248,194,.94)';
      ctx.fill();
    }
    const centerY = y + height / 2;
    const labelColor = frameImage
      ? (isHeroicFrame ? '#f6fbff' : '#562305')
      : '#6f520c';
    const valueColor = frameImage
      ? (isHeroicFrame ? '#fff4a8' : '#6d3208')
      : '#6f520c';
    const strokeColor = frameImage
      ? (isHeroicFrame ? 'rgba(8,26,92,.88)' : 'rgba(255,249,219,.98)')
      : 'rgba(255,255,255,0)';
    ctx.textBaseline = 'middle';
    if (labelText) {
      const iconSize = Math.min(54, height * 0.46);
      const labelFontSize = Math.min(42, Math.max(30, height * 0.34));
      const valueFontSize = Math.min(82, Math.max(46, height * 0.58 - Math.max(0, valueText.length - 6) * 4));
      const labelFont = `900 ${labelFontSize}px "Arial Black", "Noto Sans SC", "Microsoft YaHei", sans-serif`;
      const valueFont = `900 ${valueFontSize}px Impact, "Arial Black", "Noto Sans SC", sans-serif`;
      ctx.font = labelFont;
      const labelWidth = ctx.measureText(labelText).width;
      ctx.font = valueFont;
      const valueWidth = ctx.measureText(valueText).width;
      const iconGap = 20;
      const valueGap = 24;
      const clusterWidth = iconSize + iconGap + labelWidth + valueGap + valueWidth;
      const startX = x + width / 2 - clusterWidth / 2;
      ctx.shadowColor = isHeroicFrame ? 'rgba(4,21,82,.78)' : 'rgba(86,35,5,.34)';
      ctx.shadowBlur = frameImage ? (isHeroicFrame ? 16 : 8) : 0;
      ctx.shadowOffsetY = frameImage ? (isHeroicFrame ? 4 : 2) : 0;
      drawShareSwordIcon(ctx, startX + iconSize / 2, centerY + 2, iconSize, labelColor);
      ctx.textAlign = 'left';
      ctx.lineJoin = 'round';
      ctx.font = labelFont;
      ctx.lineWidth = isHeroicFrame ? 7 : 8;
      ctx.strokeStyle = strokeColor;
      if (frameImage) ctx.strokeText(labelText, startX + iconSize + iconGap, centerY + 2, width * 0.36);
      ctx.fillStyle = labelColor;
      ctx.fillText(labelText, startX + iconSize + iconGap, centerY + 2, width * 0.36);
      ctx.font = valueFont;
      ctx.lineWidth = isHeroicFrame ? 9 : 11;
      if (frameImage) ctx.strokeText(valueText, startX + iconSize + iconGap + labelWidth + valueGap, centerY + 1, width * 0.5);
      const valueGradient = ctx.createLinearGradient(0, y + height * 0.2, 0, y + height * 0.86);
      if (isHeroicFrame) {
        valueGradient.addColorStop(0, '#ffffff');
        valueGradient.addColorStop(0.48, '#fff3a0');
        valueGradient.addColorStop(1, '#f5b739');
      } else {
        valueGradient.addColorStop(0, '#a64b12');
        valueGradient.addColorStop(0.5, '#7a3108');
        valueGradient.addColorStop(1, '#4d1c03');
      }
      ctx.fillStyle = frameImage ? valueGradient : valueColor;
      ctx.fillText(valueText, startX + iconSize + iconGap + labelWidth + valueGap, centerY + 1, width * 0.5);
    } else {
      drawShareSwordIcon(ctx, x + 64, centerY + 1, 34, valueColor);
      ctx.fillStyle = valueColor;
      ctx.textAlign = 'left';
      ctx.font = `900 ${valueText.length > 7 ? 31 : 36}px Impact, "Arial Black", sans-serif`;
      ctx.fillText(valueText, x + 98, centerY + 1, width - 118);
    }
    ctx.restore();
  }

  function drawImageContain(ctx, image, x, y, width, height) {
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  }

  function drawImageCover(ctx, image, x, y, width, height) {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  }

  function drawShareNameLabel(ctx, text, x, y, options = {}) {
    const label = String(text || '').trim();
    if (!label) return;
    const fontSize = options.fontSize || 26;
    ctx.save();
    ctx.font = `900 ${fontSize}px sans-serif`;
    const paddingX = 20;
    const paddingY = 9;
    const maxWidth = options.maxWidth || 300;
    const displayText = label.length > 16 ? `${label.slice(0, 15)}...` : label;
    const textWidth = Math.min(ctx.measureText(displayText).width, maxWidth);
    const labelWidth = textWidth + paddingX * 2;
    const labelHeight = fontSize + paddingY * 2;
    drawCanvasRoundRect(ctx, x - labelWidth / 2, y - labelHeight, labelWidth, labelHeight, labelHeight / 2);
    ctx.fillStyle = options.background || 'rgba(255,255,255,.88)';
    ctx.fill();
    ctx.fillStyle = options.color || '#35328f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, x, y - labelHeight / 2 + 1, maxWidth);
    ctx.restore();
  }

  function drawSharePetSprite(ctx, image, petModel) {
    const size = petModel.size || 190;
    const x = petModel.x;
    const bottom = petModel.bottom;
    const y = bottom - size;
    drawShareNameLabel(ctx, petModel.name, x, y - 12, petModel.owner ? {
      fontSize: 30,
      background: 'rgba(255,248,194,.92)',
      color: '#5e4910',
      maxWidth: 360
    } : {});
    ctx.save();
    ctx.shadowColor = 'rgba(22,27,69,.26)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 16;
    drawImageContain(ctx, image, x - size / 2, y, size, size);
    ctx.restore();
  }

  function getPetInteractionShareGuests() {
    return friendState.roomSlots.slice(0, ROOM_MEMBER_LIMIT).map(slot => {
      const pet = getPetInfo(slot.petId);
      const sprite = PET_INTERACTION_SPRITES[slot.petId] || PET_INTERACTION_SPRITES.creeper;
      const friend = getFriendById(slot.guestStudentId);
      const displayName = friend?.petName || friend?.studentName || pet?.name || '好友宠物';
      const position = ROOM_GUEST_POSITIONS[slot.slotIndex] || ROOM_GUEST_POSITIONS[0];
      return pet && sprite ? { slot, pet, sprite, displayName, position } : null;
    }).filter(Boolean);
  }

  function getPetInteractionShareDecorations(student = getStudent()) {
    const decorations = canUseFriendsBackend(student) && hasActivePetWallRoom()
      ? friendState.roomDecorations
      : ensurePetRoomDecorations(student);
    return decorations.map(decoration => {
      const item = getPetInteractionFurniture(decoration.itemId);
      return item ? { decoration, item, position: getPetBuilderCellPosition(decoration.row, decoration.col, item) } : null;
    }).filter(Boolean);
  }

  function drawShareFurniture(ctx, furnitureModel) {
    const { item, position } = furnitureModel;
    const x = 1600 * position.left / 100;
    const bottom = 900 * (1 - position.bottom / 100);
    const size = Math.round(78 * Number(item.size || 1));
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.shadowColor = 'rgba(22,27,69,.22)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 10;
    ctx.fillText(item.icon, x, bottom);
    ctx.restore();
  }

  async function createKuromiRoomShareFile() {
    const sourceCanvas = $('#kuromi-room-canvas');
    if (!sourceCanvas) throw new Error('Kuromi 房间还没准备好。');
    const brandLogo = await loadShareBrandLogoImage();
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f7f1ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const sourceWidth = sourceCanvas.width || KUROMI_ROOM_DEMO.viewWidth;
    const sourceHeight = sourceCanvas.height || KUROMI_ROOM_DEMO.viewHeight;
    const scale = Math.max(canvas.width / sourceWidth, canvas.height / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    ctx.drawImage(
      sourceCanvas,
      (canvas.width - drawWidth) / 2,
      (canvas.height - drawHeight) / 2,
      drawWidth,
      drawHeight
    );
    const topGradient = ctx.createLinearGradient(0, 0, 0, 180);
    topGradient.addColorStop(0, 'rgba(255,255,255,.9)');
    topGradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, canvas.width, 210);
    drawShareBrandLogo(ctx, brandLogo, 64, 42, { height: 70, maxWidth: 292 });
    ctx.fillStyle = 'rgba(38,34,82,.74)';
    ctx.font = '800 25px sans-serif';
    ctx.fillText(currentLanguage === 'en' ? 'Kuromi Room 2.0 Demo' : 'Kuromi 房间 2.0 单机体验', 66, 142);
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    drawCanvasRoundRect(ctx, canvas.width - 366, canvas.height - 84, 302, 48, 24);
    ctx.fill();
    ctx.fillStyle = '#4541c9';
    ctx.font = '900 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentLanguage === 'en' ? 'Shared from Pet Wall' : '来自宠物墙分享', canvas.width - 215, canvas.height - 53);
    ctx.textAlign = 'left';
    return canvasToShareFile(canvas, 'kuromi-room-demo');
  }

  async function createPetInteractionShareFile() {
    if ($('#kuromi-room-canvas')) return createKuromiRoomShareFile();
    const student = getStudent();
    const pet = getPetInfo(student?.petType);
    if (!student || !pet) throw new Error('请先选择一只宠物，再分享宠物墙。');
    const stage = $('#pet-interaction-stage');
    const scene = stage?.dataset.scene || 'home';
    const ownerProfile = syncPetInteractionPet(student);
    const [sceneImage, ownerImage, brandLogo] = await Promise.all([
      loadCanvasImage(PET_INTERACTION_SCENE_IMAGES[scene] || PET_INTERACTION_SCENE_IMAGES.home),
      loadCanvasImage(ownerProfile.src),
      loadShareBrandLogoImage()
    ]);
    const guests = getPetInteractionShareGuests();
    const guestImages = await Promise.all(guests.map(guest => loadCanvasImage(guest.sprite.src)));
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    drawImageCover(ctx, sceneImage, 0, 0, canvas.width, canvas.height);
    const topGradient = ctx.createLinearGradient(0, 0, 0, 220);
    topGradient.addColorStop(0, 'rgba(255,255,255,.84)');
    topGradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, canvas.width, 260);
    const bottomGradient = ctx.createLinearGradient(0, canvas.height - 250, 0, canvas.height);
    bottomGradient.addColorStop(0, 'rgba(12,22,48,0)');
    bottomGradient.addColorStop(1, 'rgba(12,22,48,.22)');
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(0, canvas.height - 260, canvas.width, 260);
    drawShareBrandLogo(ctx, brandLogo, 64, 42, { height: 72, maxWidth: 300 });
    ctx.fillStyle = '#262252';
    ctx.font = '900 34px sans-serif';
    const ownerShareName = getPetNickname(student, student.petType) || pet.name || localize('我的宠物墙合照');
    ctx.fillText(ownerShareName, 64, 144);
    ctx.fillStyle = 'rgba(38,34,82,.74)';
    ctx.font = '800 24px sans-serif';
    ctx.fillText(currentLanguage === 'en'
      ? `Pet Wall photo · ${guests.length} friend pet${guests.length === 1 ? '' : 's'} joined`
      : `宠物墙合照 · 已加入 ${guests.length} 只好友宠物`, 64, 184);
    getPetInteractionShareDecorations(student)
      .sort((a, b) => (a.decoration.row - b.decoration.row) || ((a.item.layer || 1) - (b.item.layer || 1)))
      .forEach(model => drawShareFurniture(ctx, model));
    const ownerPet = $('#pet-interaction-pet');
    const ownerX = clampPetInteractionValue(readPetInteractionPercent(ownerPet, '--pet-x', 50), 12, 88);
    const ownerY = clampPetInteractionValue(readPetInteractionNumber(ownerPet, '--pet-y', 12), 0, 72);
    const ownerScale = clampPetInteractionValue(readPetInteractionNumber(ownerPet, '--pet-scale', 1), 0.8, 1.15);
    const petModels = [{
      image: ownerImage,
      name: ownerProfile.name,
      x: canvas.width * ownerX / 100,
      bottom: canvas.height * (1 - ownerY / 100),
      size: Math.round(230 * ownerScale),
      owner: true
    }];
    guests.forEach((guest, index) => {
      const movement = String(guest.sprite.movement || 'ground');
      const isFlying = movement.includes('fly') || movement.includes('hover');
      const bottomPercent = clampPetInteractionValue(Number(guest.position.y || 8) + (isFlying ? 14 : 0), 5, 70);
      petModels.push({
        image: guestImages[index],
        name: guest.displayName,
        x: canvas.width * clampPetInteractionValue(Number(guest.position.x || 50), 10, 90) / 100,
        bottom: canvas.height * (1 - bottomPercent / 100),
        size: isFlying ? 170 : 158,
        owner: false
      });
    });
    petModels
      .sort((a, b) => (a.bottom - a.size) - (b.bottom - b.size))
      .forEach(model => drawSharePetSprite(ctx, model.image, model));
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    drawCanvasRoundRect(ctx, canvas.width - 380, canvas.height - 86, 316, 48, 24);
    ctx.fill();
    ctx.fillStyle = '#4541c9';
    ctx.font = '900 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentLanguage === 'en' ? 'Shared from Pet Wall' : '来自宠物墙分享', canvas.width - 222, canvas.height - 55);
    ctx.textAlign = 'left';
    return canvasToShareFile(canvas, `${ownerShareName || pet.name || 'pet'}-pet-wall`);
  }

  async function createRoleCardShareFile(options = {}) {
    const student = getStudent();
    const pet = getPetInfo(student?.petType);
    const imageSrc = student ? getPetDisplayImage(student) || pet?.image : '';
    if (!student || !imageSrc) throw new Error('请先选择一只宠物，再分享角色卡。');
    const requestedFrame = getRoleShareFrame(options.frameId);
    const frameId = requestedFrame?.id || getDefaultRoleShareFrameId(student);
    const [image, brandLogo, frameImage, powerFrameImage] = await Promise.all([
      loadCanvasImage(imageSrc),
      loadShareBrandLogoImage(),
      loadRoleShareFrameImage(frameId),
      loadRoleSharePowerFrameImage(frameId)
    ]);
    const combat = getCombatState(student);
    const rarity = getDisplayRarity(student);
    const level = getLevelInfo(student);
    const displayName = getSimpleRoleShareDisplayName(student, pet);
    const metaText = [rarity.label, level.max ? 'MAX 999' : `Lv.${level.level}`].filter(Boolean).join(' · ');
    const titleLabel = getDisplayCollectionTitleForPet(student, student.petType);
    const friendInviteText = getRoleShareInviteText(student);
    const canvas = document.createElement('canvas');
    canvas.width = ROLE_SHARE_STORY_WIDTH;
    canvas.height = ROLE_SHARE_STORY_HEIGHT;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f7f1ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.filter = 'blur(54px) saturate(1.12) brightness(.82)';
    drawImageCover(ctx, image, -130, -130, canvas.width + 260, canvas.height + 260);
    ctx.restore();
    const pageGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    pageGradient.addColorStop(0, 'rgba(255,255,255,.58)');
    pageGradient.addColorStop(0.35, 'rgba(255,255,255,.12)');
    pageGradient.addColorStop(0.72, 'rgba(255,255,255,.18)');
    pageGradient.addColorStop(1, 'rgba(22,24,60,.5)');
    ctx.fillStyle = pageGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const topGradient = ctx.createLinearGradient(0, 0, 0, 360);
    topGradient.addColorStop(0, 'rgba(255,255,255,.9)');
    topGradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, canvas.width, 400);
    const bottomGradient = ctx.createLinearGradient(0, canvas.height - 430, 0, canvas.height);
    bottomGradient.addColorStop(0, 'rgba(22,24,60,0)');
    bottomGradient.addColorStop(1, 'rgba(22,24,60,.58)');
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(0, canvas.height - 470, canvas.width, 470);
    const logoHeight = 88;
    const logoRatio = brandLogo
      ? Number(brandLogo.naturalWidth || brandLogo.width || 1) / Math.max(1, Number(brandLogo.naturalHeight || brandLogo.height || 1))
      : 2.75;
    const logoBoxWidth = Math.min(360, Math.round(logoHeight * logoRatio)) + 48;
    const logoX = (canvas.width - logoBoxWidth) / 2;
    const logoBox = drawShareBrandLogo(ctx, brandLogo, logoX, 64, { height: logoHeight, maxWidth: 360, paddingX: 24, paddingY: 13 });
    if (friendInviteText) {
      const inviteText = friendInviteText;
      ctx.save();
      ctx.font = '900 30px sans-serif';
      const inviteWidth = Math.min(ctx.measureText(inviteText).width + 60, canvas.width - 128);
      const inviteX = (canvas.width - inviteWidth) / 2;
      drawCanvasRoundRect(ctx, inviteX, 64 + logoBox.height + 22, inviteWidth, 64, 32);
      ctx.fillStyle = 'rgba(255,255,255,.88)';
      ctx.fill();
      ctx.fillStyle = '#4541c9';
      ctx.textBaseline = 'middle';
      ctx.fillText(inviteText, inviteX + 30, 64 + logoBox.height + 54, inviteWidth - 52);
      ctx.restore();
    }

    const storyLabel = frameId === 'cute' ? '可爱路线角色卡' : '帅气路线角色卡';
    const cardX = 58;
    const cardY = 456;
    const cardWidth = canvas.width - cardX * 2;
    const cardHeight = Math.round(cardWidth * 9 / 16);
    ctx.save();
    ctx.fillStyle = frameId === 'cute' ? '#6f397e' : '#243f88';
    ctx.textAlign = 'center';
    ctx.font = '900 34px sans-serif';
    ctx.fillText(storyLabel, canvas.width / 2, cardY - 94, canvas.width - 132);
    ctx.fillStyle = 'rgba(38,34,82,.74)';
    ctx.font = '800 24px sans-serif';
    ctx.fillText('5+1教育补习中心 · 学习战报', canvas.width / 2, cardY - 52, canvas.width - 132);
    ctx.restore();
    ctx.save();
    ctx.shadowColor = 'rgba(22,24,60,.32)';
    ctx.shadowBlur = 36;
    ctx.shadowOffsetY = 24;
    drawCanvasRoundRect(ctx, cardX - 8, cardY - 8, cardWidth + 16, cardHeight + 16, 34);
    ctx.fillStyle = 'rgba(255,255,255,.86)';
    ctx.fill();
    ctx.restore();
    ctx.save();
    drawCanvasRoundRect(ctx, cardX, cardY, cardWidth, cardHeight, 30);
    ctx.clip();
    drawImageCover(ctx, image, cardX, cardY, cardWidth, cardHeight);
    const cardBottomGradient = ctx.createLinearGradient(0, cardY + cardHeight - 180, 0, cardY + cardHeight);
    cardBottomGradient.addColorStop(0, 'rgba(22,24,60,0)');
    cardBottomGradient.addColorStop(1, 'rgba(22,24,60,.24)');
    ctx.fillStyle = cardBottomGradient;
    ctx.fillRect(cardX, cardY + cardHeight - 190, cardWidth, 190);
    ctx.restore();
    const roleFrameBleed = 34;
    drawRoleShareFrame(ctx, frameImage, cardWidth + roleFrameBleed * 2, cardHeight + roleFrameBleed * 2, {
      x: cardX - roleFrameBleed,
      y: cardY - roleFrameBleed
    });
    ctx.strokeStyle = frameId === 'cute' ? 'rgba(255,192,223,.72)' : 'rgba(151,207,255,.72)';
    ctx.lineWidth = 4;
    drawCanvasRoundRect(ctx, cardX, cardY, cardWidth, cardHeight, 30);
    ctx.stroke();

    const panelX = 64;
    const panelY = cardY + cardHeight + 62;
    const panelWidth = canvas.width - panelX * 2;
    const panelHeight = 280;
    const panelTextCenterX = panelX + panelWidth / 2;
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    drawCanvasRoundRect(ctx, panelX, panelY, panelWidth, panelHeight, 34);
    ctx.fill();
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#262252';
    ctx.font = '900 58px sans-serif';
    ctx.fillText(displayName, panelTextCenterX, panelY + 76, panelWidth - 92);
    ctx.fillStyle = '#757399';
    ctx.font = '800 30px sans-serif';
    ctx.fillText(metaText, panelTextCenterX, panelY + 126, panelWidth - 104);
    ctx.restore();
    if (titleLabel) {
      ctx.save();
      ctx.font = '900 30px sans-serif';
      const badgeText = titleLabel.length > 28 ? `${titleLabel.slice(0, 27)}...` : titleLabel;
      const badgeWidth = Math.min(ctx.measureText(badgeText).width + 52, panelWidth - 72);
      const badgeX = panelX + (panelWidth - badgeWidth) / 2;
      drawCanvasRoundRect(ctx, badgeX, panelY + 164, badgeWidth, 64, 32);
      ctx.fillStyle = 'rgba(255,248,194,.94)';
      ctx.fill();
      ctx.fillStyle = '#6f520c';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, panelTextCenterX, panelY + 196, badgeWidth - 40);
      ctx.restore();
    }

    const powerY = panelY + panelHeight + 92;
    drawSharePowerBadge(ctx, combat.power, 78, powerY, canvas.width - 156, 156, {
      label: '战斗值',
      frameId,
      frameImage: powerFrameImage
    });

    return canvasToShareFile(canvas, `${displayName || pet?.name || 'pet'}-${frameId || 'role-card'}-story`);
  }

  async function createEvolutionComparisonShareFile(shareData = activeImageViewerShare) {
    const images = Array.isArray(shareData?.images) ? shareData.images.slice(0, 3) : [];
    if (images.length < 2) throw new Error('暂时无法分享图片，请稍后再试。');
    const [loadedImages, brandLogo] = await Promise.all([
      Promise.all(images.map(item => loadCanvasImage(item.src))),
      loadShareBrandLogoImage()
    ]);
    const titleLabel = String(shareData?.titleLabel || '').trim();
    const canvas = document.createElement('canvas');
    canvas.width = 1800;
    canvas.height = 1040;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f7f5ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#fff6fb');
    gradient.addColorStop(0.5, '#f2efff');
    gradient.addColorStop(1, '#edfdf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawShareBrandLogo(ctx, brandLogo, 72, 44, { height: 72, maxWidth: 300 });
    ctx.fillStyle = '#4541c9';
    ctx.font = '700 48px sans-serif';
    ctx.fillText(shareData.title || '5+1教育补习中心', 400, 92, 980);
    ctx.fillStyle = '#757399';
    ctx.font = '700 26px sans-serif';
    ctx.fillText(shareData.meta || 'Before / After Evolution', 402, 140, 980);
    if (titleLabel) {
      ctx.save();
      ctx.font = '900 26px sans-serif';
      const badgeText = titleLabel.length > 28 ? `${titleLabel.slice(0, 27)}...` : titleLabel;
      const badgeWidth = Math.min(ctx.measureText(badgeText).width + 44, 560);
      const badgeX = canvas.width - badgeWidth - 80;
      drawCanvasRoundRect(ctx, badgeX, 58, badgeWidth, 54, 27);
      ctx.fillStyle = 'rgba(255,248,194,.94)';
      ctx.fill();
      ctx.fillStyle = '#6f520c';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, badgeX + badgeWidth / 2, 93, badgeWidth - 34);
      ctx.restore();
    }
    const cardCount = loadedImages.length;
    const cardWidth = cardCount >= 3 ? 500 : 680;
    const cardHeight = Math.round(cardWidth * 9 / 16);
    const gap = cardCount >= 3 ? 50 : 80;
    const totalWidth = (cardWidth * cardCount) + (gap * (cardCount - 1));
    const startX = (canvas.width - totalWidth) / 2;
    const cards = loadedImages.map((image, index) => ({
      image,
      x: startX + index * (cardWidth + gap),
      label: images[index].label || (index === 0 ? '进化前样子' : index === 1 && cardCount >= 3 ? '小进化样子' : '进化后样子')
    }));
    cards.forEach(card => {
      ctx.save();
      drawCanvasRoundRect(ctx, card.x, 220, cardWidth, cardHeight, 34);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.clip();
      drawImageContain(ctx, card.image, card.x, 220, cardWidth, cardHeight);
      ctx.restore();
      ctx.strokeStyle = 'rgba(92, 92, 230, .22)';
      ctx.lineWidth = 4;
      drawCanvasRoundRect(ctx, card.x, 220, cardWidth, cardHeight, 34);
      ctx.stroke();
      ctx.fillStyle = '#4541c9';
      ctx.font = '800 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(localize(card.label), card.x + cardWidth / 2, 220 + cardHeight + 66);
      ctx.textAlign = 'left';
    });
    ctx.fillStyle = '#262252';
    ctx.font = '900 34px sans-serif';
    ctx.fillText('5+1教育补习中心', 80, 926);
    ctx.fillStyle = '#77759a';
    ctx.font = '700 24px sans-serif';
    ctx.fillText(currentLanguage === 'en' ? 'My pet evolved!' : '我的宠物完成进化！', 80, 964);
    return canvasToShareFile(canvas, `${shareData.title || '5plus1-tuition'}-evolution`);
  }

  function getExternalShareInviteText(student = getStudent()) {
    const id = HolidayBackendClient.normalizeId(student?.studentId || session.studentId || '');
    return id ? `来和我一起玩吧，我的id是：${id}` : '来和我一起玩 5+1 学习乐园 吧！';
  }

  async function shareImageFile(file, { title = '5+1教育补习中心', fallbackUrl = '', text = '' } = {}) {
    if (shareInProgress) {
      showToast('分享选单已经打开，请先完成这一次分享。');
      return false;
    }
    shareInProgress = true;
    try {
      const shareText = String(text || getExternalShareInviteText()).trim();
      const canShare = Boolean(navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] })));
      if (canShare) {
        try {
          await runNativeShareWithTimeout({ title, text: shareText, files: [file] });
          showToast('已打开分享选单。');
          return true;
        } catch (error) {
          if (error?.name === 'AbortError') return false;
        }
      }
      const imageUrl = fallbackUrl || URL.createObjectURL(file);
      const opened = window.open(imageUrl, '_blank', 'noopener');
      if (!fallbackUrl && opened) setTimeout(() => URL.revokeObjectURL(imageUrl), 60000);
      if (opened && shareText && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(shareText).catch(() => {});
      }
      if (!opened && !fallbackUrl) {
        imageViewerObjectUrls.add(imageUrl);
        openImageViewer({
          title,
          meta: currentLanguage === 'en' ? 'Long-press or right-click to save and share.' : '长按或右键保存图片后分享。',
          images: [{ src: imageUrl, label: currentLanguage === 'en' ? 'Share image preview' : '分享图片预览', alt: title }]
        });
        showToast('已打开图片预览，可以长按或右键保存/分享。');
        return true;
      }
      showToast(opened ? '已打开图片，可以长按或右键保存/分享。' : '暂时无法分享图片，请稍后再试。');
      return Boolean(opened);
    } finally {
      window.setTimeout(() => {
        shareInProgress = false;
      }, 500);
    }
  }

  async function shareCurrentRoleCardImage(frameId = '') {
    try {
      const student = getStudent();
      const pet = getPetInfo(student?.petType);
      const file = await createRoleCardShareFile({ frameId });
      return shareImageFile(file, { title: `${getSimpleRoleShareDisplayName(student, pet) || pet?.name || '5+1 学习乐园'} · 5+1教育补习中心` });
    } catch (error) {
      showToast(error.message || '暂时无法分享图片，请稍后再试。');
      return false;
    }
  }

  async function sharePetInteractionImage() {
    try {
      const student = getStudent();
      const pet = getPetInfo(student?.petType);
      const file = await createPetInteractionShareFile();
      return shareImageFile(file, { title: `${getPetNickname(student, student?.petType) || pet?.name || localize('我的宠物墙合照')} · 5+1教育补习中心` });
    } catch (error) {
      showToast(error.message || '暂时无法分享图片，请稍后再试。');
      return false;
    }
  }

  async function shareActiveImageViewerImage() {
    try {
      if (!activeImageViewerShare) return false;
      const file = activeImageViewerShare.type === 'evolution-comparison'
        ? await createEvolutionComparisonShareFile(activeImageViewerShare)
        : await imageSourceToShareFile(activeImageViewerShare.images?.[0]?.src || '', activeImageViewerShare.title || '5plus1-tuition');
      return shareImageFile(file, { title: activeImageViewerShare.title || '5+1教育补习中心' });
    } catch (error) {
      showToast(error.message || '暂时无法分享图片，请稍后再试。');
      return false;
    }
  }

  function getWallLeaderboardConfig(mode) {
    const key = ['power', 'coins', 'reaction', 'flappy', 'runner', 'jumpCharge'].includes(mode) ? mode : 'power';
    const configs = {
      power: {
        key,
        title: '玩家战力排行榜',
        hint: '按每位玩家已收集宠物的总战力排行。',
        scoreLabel: '总战力',
        selfLabel: '我的玩家总战力'
      },
      coins: {
        key,
        title: '金币排行榜',
        hint: '按每位玩家目前持有的金币排行。',
        scoreLabel: '金币',
        selfLabel: '我的金币余额'
      },
      reaction: {
        key,
        title: '反应轮盘排行榜',
        hint: '只记录历史最高分。',
        scoreLabel: '最高分',
        selfLabel: '我的反应最高分'
      },
      flappy: {
        key,
        title: 'CY跳跳跳排行榜',
        hint: '只记录历史最高分。',
        scoreLabel: '最高分',
        selfLabel: '我的跳跳最高分'
      },
      runner: {
        key,
        title: 'CY跑跑跑排行榜',
        hint: '只记录历史最高分。',
        scoreLabel: '最高分',
        selfLabel: '我的跑跑最高分'
      },
      jumpCharge: {
        key,
        title: 'CY跳一跳排行榜',
        hint: '只记录历史最高分。',
        scoreLabel: '最高分',
        selfLabel: '我的跳一跳最高分'
      }
    };
    return configs[key];
  }

  function buildWallLeaderboardEntries(mode, student = getStudent()) {
    const byStudent = new Map();
    const sourceStudents = [
      ...(Array.isArray(wallLeaderboardStudents) ? wallLeaderboardStudents : []),
      ...(student ? [student] : [])
    ];
    sourceStudents.forEach(sourceStudent => {
      const player = normalizeLeaderboardStudent(sourceStudent);
      const studentId = HolidayBackendClient.normalizeId(player.studentId);
      if (!studentId) return;
      const scores = getStudentMiniGameScores(player);
      const score = mode === 'power'
        ? getStudentTotalCombatPower(player)
        : (mode === 'coins' ? Math.max(0, Math.floor(Number(player.coins || 0) || 0)) : Number(scores[mode] || 0));
      if (score <= 0) return;
      const existing = byStudent.get(studentId);
      if (existing && existing.score >= score) return;
      const pet = getPetInfo(player.petType);
      const ownedCount = Array.from(new Set([
        ...(Array.isArray(player.ownedPets) ? player.ownedPets : []),
        player.petType
      ].filter(Boolean))).length;
      byStudent.set(studentId, {
        studentId,
        score,
        image: getRolePreviewAsset(getPetDisplayImage(player) || pet?.image || ''),
        name: getPlayerDisplayName(player) || studentId,
        meta: mode === 'power'
          ? `${ownedCount || 0} 只宠物`
          : (mode === 'coins' ? '金币余额' : '历史最高分')
      });
    });
    return Array.from(byStudent.values()).sort((a, b) => b.score - a.score).slice(0, 20);
  }

  function renderWallLeaderboard(student = getStudent()) {
    const panel = $('#wall-leaderboard-panel');
    if (!panel) return;
    const config = getWallLeaderboardConfig(activeWallLeaderboard);
    const entries = wallLeaderboardLoaded ? buildWallLeaderboardEntries(config.key, student) : [];
    const studentScores = getStudentMiniGameScores(student);
    const selfScore = config.key === 'power'
      ? getStudentTotalCombatPower(student)
      : (config.key === 'coins' ? Math.max(0, Math.floor(Number(student?.coins || 0) || 0)) : Number(studentScores[config.key] || 0));
    const tabs = [
      ['power', '玩家战力排行'],
      ['coins', '金币排行'],
      ['reaction', '反应轮盘'],
      ['flappy', '跳跳跳'],
      ['runner', '跑跑跑'],
      ['jumpCharge', '跳一跳']
    ].map(([key, label]) => `<button type="button" class="wall-leaderboard-tab${config.key === key ? ' active' : ''}" data-wall-leaderboard="${key}">${escapeHtml(localize(label))}</button>`).join('');
    const rankRows = entries.length
      ? entries.map((entry, index) => `<div class="wall-rank-row">
          <span class="wall-rank-number">${index + 1}</span>
          ${entry.image ? `<img class="wall-rank-art" src="${escapeHtml(entry.image)}" alt="${escapeHtml(entry.name)}" loading="lazy" decoding="async" />` : '<span class="wall-rank-art empty">🐾</span>'}
          <span class="wall-rank-copy"><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(localize(entry.meta || entry.studentId))}</small></span>
          <b class="wall-rank-score">${entry.score}</b>
        </div>`).join('')
      : `<div class="wall-leaderboard-empty">${escapeHtml(localize(wallLeaderboardLoaded ? '还没有排行榜资料。' : '正在读取排行榜...'))}</div>`;
    const detailHtml = config.key === 'power'
      ? getOwnedPetCombatRows(student).map(row => `<div class="wall-pet-breakdown-row">
          ${row.image ? `<img src="${escapeHtml(row.image)}" alt="${escapeHtml(row.name)}" loading="lazy" decoding="async" />` : '<span></span>'}
          <span><b>${escapeHtml(formatPetDisplayName(row.name, row.species))}</b><small>${escapeHtml(row.petType)}</small></span>
          <strong>${row.power}</strong>
        </div>`).join('') || `<div class="wall-leaderboard-empty">${escapeHtml(localize('还没有宠物资料。'))}</div>`
      : (config.key === 'coins'
        ? `<div class="wall-pet-breakdown-row"><span>🪙</span><span><b>${escapeHtml(localize('金币余额'))}</b><small>${escapeHtml(localize('我的金币余额'))}</small></span><strong>${selfScore}</strong></div>
          <div class="wall-pet-breakdown-row"><span>⭐</span><span><b>${escapeHtml(localize('总战力'))}</b><small>${escapeHtml(localize('我的玩家总战力'))}</small></span><strong>${getStudentTotalCombatPower(student)}</strong></div>`
        : `<div class="wall-pet-breakdown-row"><span>🎯</span><span><b>${escapeHtml(localize('反应轮盘'))}</b><small>${escapeHtml(localize('历史最高分'))}</small></span><strong>${studentScores.reaction}</strong></div>
        <div class="wall-pet-breakdown-row"><span>🐦</span><span><b>${escapeHtml(localize('CY跳跳跳'))}</b><small>${escapeHtml(localize('历史最高分'))}</small></span><strong>${studentScores.flappy}</strong></div>
        <div class="wall-pet-breakdown-row"><span>🏃</span><span><b>${escapeHtml(localize('CY跑跑跑'))}</b><small>${escapeHtml(localize('历史最高分'))}</small></span><strong>${studentScores.runner}</strong></div>
        <div class="wall-pet-breakdown-row"><span>◇</span><span><b>${escapeHtml(localize('CY跳一跳'))}</b><small>${escapeHtml(localize('历史最高分'))}</small></span><strong>${studentScores.jumpCharge}</strong></div>`);
    panel.innerHTML = `<div class="wall-leaderboard-heading">
      <div><span class="eyebrow">LEADERBOARD</span><h3>${escapeHtml(localize(config.title))}</h3><p>${escapeHtml(localize(config.hint))}</p></div>
      <div class="wall-leaderboard-tabs" role="group">${tabs}</div>
    </div>
    <div class="wall-leaderboard-layout">
      <div class="wall-rank-list" aria-label="${escapeHtml(localize(config.title))}">${rankRows}</div>
      <aside class="wall-self-card">
        <span>${escapeHtml(localize(config.selfLabel))}</span>
        <strong>${selfScore}</strong>
        <small>${escapeHtml(localize(config.scoreLabel))}</small>
        <div class="wall-pet-breakdown">${detailHtml}</div>
      </aside>
    </div>`;
    applyLanguage(panel);
  }

  function renderMessageWall(student) {
    const preview = $('#wall-card-preview');
    const presets = $('#wall-post-presets');
    const list = $('#message-wall-list');
    if (!preview || !presets || !list) return;

    const pet = getPetInfo(student?.petType);
    const combat = student?.petType ? getCombatState(student) : { power: 0 };
    const displayImage = getPetDisplayImage(student) || pet?.image || '';
    const displayPreviewImage = getRolePreviewAsset(displayImage);
    const level = student?.petType ? getLevelInfo(student) : { level: 1, max: false };
    const rarity = student?.petType ? getDisplayRarity(student) : getRarityInfo('A');
    const previewOwnerName = student?.petType ? (getPlayerDisplayName(student) || '同学') : '同学';
    const previewPetName = student?.petType ? (getPetFullDisplayName(student) || pet?.name || '宠物') : '宠物';
    const previewSpeciesName = student?.petType ? (getPetSpeciesNameForStudent(student) || pet?.name || '') : '';
    const previewTitle = student?.petType ? getDisplayCollectionTitleForPet(student, student.petType) : '';
    preview.innerHTML = student?.petType
      ? `<img src="${escapeHtml(displayPreviewImage)}" alt="${escapeHtml(pet?.name || '宠物')}" loading="lazy" decoding="async" />
        <div class="wall-preview-copy"><span>${escapeHtml(previewOwnerName)} 的角色卡</span><strong>${escapeHtml(previewOwnerName)}${previewTitle ? `<em class="collection-title-badge">${escapeHtml(previewTitle)}</em>` : ''}</strong><small>${escapeHtml(previewPetName)} · ${escapeHtml(previewSpeciesName)} · ${escapeHtml(rarity.label)} · ${level.max ? 'MAX 999' : `Lv.${level.level}`}</small><b class="wall-power-pill">⚔️ ${combat.power}</b></div>`
      : '<div class="empty-state wall-empty"><strong>请先选择宠物</strong><p>选择伙伴后，就可以把角色卡分享到留言墙。</p></div>';

    renderWallPostPresetButtons(presets);
    const shareButton = $('#share-wall-post-button');
    if (shareButton) shareButton.disabled = !student?.petType;
    renderWallLeaderboard(student);

    if (!messageWallLoaded && messageWallUsesGas(student)) {
      list.innerHTML = '<div class="empty-state wall-empty"><strong>正在读取留言墙</strong><p>请稍等一下。</p></div>';
      return;
    }

    if (!messageWallPosts.length) {
      list.innerHTML = '<div class="empty-state wall-empty"><strong>留言墙还没有内容</strong><p>成为第一个分享角色卡的同学吧。</p></div>';
      return;
    }

    const currentStudentId = HolidayBackendClient.normalizeId(student?.studentId);
    list.innerHTML = messageWallPosts.slice(0, 50).map(post => {
      const liked = post.likedBy.includes(currentStudentId);
      const comments = post.comments;
      const wallOwnerName = getWallPostDisplayName(post) || '学习伙伴';
      const wallPostTitle = getWallPostTitle(post);
      const wallSpeciesName = getWallPostSpeciesName(post) || getPetInfo(post.petType)?.name || '';
      const wallTitle = String(post.petTitle || '').trim();
      const petLabel = [wallSpeciesName, post.petRarity, post.petLevel].filter(Boolean).join(' · ');
      const canOpenImageViewer = typeof openImageViewer === 'function';
      const commentCount = post.comments.length;
      const commentsExpanded = expandedWallCommentPostIds.has(post.postId);
      const sharedMusicTrack = getWallPostSharedMusicTrack(post);
      const sharedMusicAccent = getMusicTrackAccent(getMusicTrackById(sharedMusicTrack?.trackId) || sharedMusicTrack || {});
      const sharedMusicOwned = sharedMusicTrack ? getOwnedMusicTracks(student).includes(sharedMusicTrack.trackId) : false;
      const sharedMusicActive = sharedMusicTrack ? getActiveMusicTrack(student)?.id === sharedMusicTrack.trackId : false;
      const musicShareHtml = sharedMusicTrack
        ? `<div class="wall-music-share" style="--track-accent:${escapeHtml(sharedMusicAccent)}">
            <div class="wall-music-share-art" aria-hidden="true">🎵</div>
            <div class="wall-music-share-copy">
              <span>${escapeHtml(sharedMusicTrack.series || 'Music')}</span>
              <strong>${escapeHtml(sharedMusicTrack.title)}</strong>
              <small>${escapeHtml(localize(sharedMusicOwned ? '已拥有，可以随时切换。' : '试听 30 秒，喜欢再解锁。'))}</small>
            </div>
            <div class="wall-music-share-actions">
              <button type="button" class="secondary-button" data-music-preview="${escapeHtml(sharedMusicTrack.trackId)}">${escapeHtml(localize('试听 30 秒'))}</button>
              ${sharedMusicActive
                ? `<button type="button" class="secondary-button" disabled>${escapeHtml(localize('使用中'))}</button>`
                : (sharedMusicOwned
                  ? `<button type="button" class="primary-button" data-music-equip="${escapeHtml(sharedMusicTrack.trackId)}">${escapeHtml(localize('切换主题曲'))}</button>`
                  : `<button type="button" class="primary-button" data-music-buy="${escapeHtml(sharedMusicTrack.trackId)}">${escapeHtml(`🪙 ${MUSIC_BOX_TRACK_PRICE} ${localize('购买')}`)}</button>`)}
            </div>
          </div>`
        : '';
      const commentsHtml = comments.length
        ? comments.map(comment => `<div class="wall-comment-row"><strong>${escapeHtml(comment.studentName || comment.name || comment.studentId || '同学')}</strong>: ${escapeHtml(localize(comment.text))}</div>`).join('')
        : `<div class="wall-comment-row">${escapeHtml(localize('还没有同学留言。'))}</div>`;
      return `<article class="wall-post-card" data-wall-post="${escapeHtml(post.postId)}">
        <div class="wall-post-art">
          ${post.petImage ? `<button type="button" class="wall-image-button" data-wall-image-preview="${escapeHtml(post.postId)}" aria-label="${escapeHtml(`${localize('查看角色大图')}：${wallPostTitle}`)}" title="${escapeHtml(localize('查看角色大图'))}" ${canOpenImageViewer ? '' : 'disabled'}><img src="${escapeHtml(getRolePreviewAsset(post.petImage))}" alt="${escapeHtml(wallPostTitle || '宠物')}" loading="lazy" decoding="async" /></button>` : ''}
          <span class="wall-post-power">⚔️ ${Number(post.combatPower || 0)}</span>
        </div>
        <div class="wall-post-body">
          <div class="wall-post-header"><div class="wall-post-owner"><span class="wall-owner-avatar" aria-hidden="true">${renderWallPostOwnerAvatar(post)}</span><div><h3>${escapeHtml(wallPostTitle)}${wallTitle ? `<em class="collection-title-badge">${escapeHtml(wallTitle)}</em>` : ''}</h3><p>${escapeHtml(petLabel || post.petType || '学习伙伴')}</p></div></div><span class="wall-post-time">${escapeHtml(formatWallDate(post.createdAt || post.updatedAt))}</span></div>
          <p class="wall-message-text">${escapeHtml(localize(post.message))}</p>
          ${musicShareHtml}
          <details class="wall-post-details">
            <summary>${escapeHtml(localize('查看属性和装备'))}</summary>
            ${renderWallStatGrid(post.petStats, post.petType)}
            ${renderWallEquipmentList(post.equipment)}
          </details>
          <div class="wall-post-actions">
            <button type="button" class="wall-like-button${liked ? ' liked' : ''}" data-wall-like="${escapeHtml(post.postId)}">${liked ? (currentLanguage === 'en' ? 'Liked' : '已点赞') : localize('点赞')} · ${post.likedBy.length}</button>
          </div>
          <details class="wall-comments-panel" data-wall-comments-panel="${escapeHtml(post.postId)}"${commentsExpanded ? ' open' : ''}>
            <summary class="wall-comments-summary"><span>${escapeHtml(localize('评论区'))}</span><b>${commentCount}</b></summary>
            <div class="wall-comments-content">
              ${renderWallCommentSelect(post.postId)}
              <form class="wall-custom-comment-form" data-wall-custom-comment="${escapeHtml(post.postId)}">
                <label class="sr-only" for="wall-custom-comment-${escapeHtml(post.postId)}">${escapeHtml(localize('写一句鼓励的话'))}</label>
                <input id="wall-custom-comment-${escapeHtml(post.postId)}" class="wall-custom-comment-input" maxlength="18" autocomplete="off" placeholder="${escapeHtml(localize('写一句鼓励的话'))}" />
                <button type="submit" class="wall-custom-comment-button">${escapeHtml(localize('留言'))}</button>
              </form>
              <div class="wall-comments-meta">${escapeHtml(localize('全部留言'))} · ${commentCount}</div>
              <div class="wall-comments">${commentsHtml}</div>
            </div>
          </details>
        </div>
      </article>`;
    }).join('');
  }

  function openImageViewer(options = {}) {
    const overlay = $('#image-viewer-overlay');
    const title = $('#image-viewer-title');
    const meta = $('#image-viewer-meta');
    const content = $('#image-viewer-content');
    const shareButton = $('#image-viewer-share-button');
    if (!overlay || !title || !meta || !content) return;
    const images = Array.isArray(options.images) ? options.images.filter(item => item && item.src) : [];
    if (!images.length) return;
    title.textContent = options.title || localize('查看角色大图');
    meta.textContent = options.meta || '';
    activeImageViewerShare = options.share ? { ...options.share, title: options.title || localize('查看角色大图'), meta: options.meta || '', images } : null;
    if (shareButton) {
      shareButton.hidden = !activeImageViewerShare;
      shareButton.textContent = localize(activeImageViewerShare?.type === 'evolution-comparison' ? '分享进化变化' : '分享图片');
    }
    content.innerHTML = `<div class="image-viewer-gallery">${images.map(item => `
      <figure class="image-viewer-figure">
        <img src="${escapeHtml(withAssetVersion(item.src))}" alt="${escapeHtml(item.alt || item.label || options.title || localize('查看角色大图'))}" />
        ${item.label ? `<figcaption>${escapeHtml(localize(item.label))}</figcaption>` : ''}
      </figure>
    `).join('')}</div>`;
    overlay.classList.remove('hidden');
  }

  function closeImageViewer() {
    $('#image-viewer-overlay')?.classList.add('hidden');
    activeImageViewerShare = null;
    imageViewerObjectUrls.forEach(url => URL.revokeObjectURL(url));
    imageViewerObjectUrls.clear();
  }

  function openEvolutionBeforePreview() {
    const student = getStudent();
    const pet = getPetInfo(student?.petType);
    const evolved = isPetEvolved(student);
    const miniEvolved = isPetMiniEvolved(student);
    if (!student || !pet || (!miniEvolved && !evolved)) return;
    const images = [
      { src: withAssetVersion(pet.image), label: '进化前样子', alt: `${pet.name} ${localize('进化前样子')}` }
    ];
    if (miniEvolved || evolved) {
      images.push({ src: getPetMiniEvolutionImage(pet), label: '小进化样子', alt: `${pet.name} ${localize('小进化样子')}` });
    }
    if (evolved) {
      images.push({ src: getPetDisplayImage(student) || getVersionedRoleCardAsset(pet.evolvedImage) || getVersionedRoleCardAsset(pet.image), label: '进化后样子', alt: `${pet.name} ${localize('进化后样子')}` });
    }
    openImageViewer({
      title: `${getPetFullDisplayName(student) || pet.name} · ${localize('查看进化路线')}`,
      meta: localize('可以直接比较进化前、小进化和最终进化的角色卡。'),
      share: { type: 'evolution-comparison', titleLabel: getDisplayCollectionTitleForPet(student, student.petType) },
      images
    });
  }

  function openEvolutionChoiceModal() {
    const student = getStudent();
    const pet = getPetInfo(student?.petType);
    if (!student || !pet) return;
    const progress = getEvolutionProgress(student);
    if (!progress.miniAlreadyEvolved) {
      showToast(localize('必须先完成小进化，才可以开放最终进化。'));
      return;
    }
    if (!progress.finalReady) {
      showToast(progress.hasExclusiveSet ? `还没有集齐对应角色的 ${progress.required} 件专属装备。` : `还需要装备满 ${progress.required} 个不同部位的装备。`);
      return;
    }
    const overlay = $('#evolution-choice-overlay');
    if (!overlay) return;
    const supportsHeroic = petSupportsHeroicEvolution(pet.id);
    $('#evolution-choice-pet-name').textContent = getPetFullDisplayName(student) || pet.name;
    $('#evolution-choice-cute-image').src = getRolePreviewAsset(getPetCuteEvolvedImage(pet));
    $('#evolution-choice-cute-image').alt = `${pet.name} ${localize('可爱Q版进化')}`;
    $('#evolution-choice-heroic-image').src = getRolePreviewAsset(getVersionedRoleCardAsset(pet.evolvedImage) || getVersionedRoleCardAsset(pet.image));
    $('#evolution-choice-heroic-image').alt = `${pet.name} ${localize('帅气觉醒进化')}`;
    const heroicChoice = overlay.querySelector('[data-evolution-style="heroic"]');
    if (heroicChoice) heroicChoice.hidden = !supportsHeroic;
    const copy = $('#evolution-choice-copy');
    if (copy) {
      copy.textContent = supportsHeroic
        ? localize('完成小进化并收齐专属装备后，可以选择让伙伴走可爱 Q 版路线，或保留帅气觉醒路线。')
        : localize('这只伙伴只有可爱最终路线，完成后会直接解锁 Q 版可爱形态。');
    }
    overlay.classList.remove('hidden');
    applyLanguage(overlay);
  }

  function closeEvolutionChoiceModal() {
    $('#evolution-choice-overlay')?.classList.add('hidden');
  }

  function getInitialEvolutionPreviewPet() {
    return getPetInfo(pendingInitialPet) || getPetInfo(EVOLUTION_STYLE_PREVIEW_PET_ID) || INITIAL_PETS[0] || PET_CATALOG[0];
  }

  function updateInitialEvolutionStylePreview() {
    const section = $('#initial-evolution-style-section');
    const pet = getInitialEvolutionPreviewPet();
    if (!section || !pet) return;
    section.classList.add('hidden');
  }

  function showPowerFeedback(before, after, title) {
    const deltas = window.EquipmentEngine.getStatDelta(before.stats, after.stats);
    const powerDelta = after.power - before.power;
    const change = $('#combat-power-change');
    if (change) {
      change.textContent = `${powerDelta >= 0 ? '▲' : '▼'} ${Math.abs(powerDelta)}`;
      change.className = `combat-power-change${powerDelta < 0 ? ' negative' : ''}`;
      setTimeout(() => { change.textContent = ''; }, 1300);
    }
    playPowerSound(powerDelta >= 0 ? 'up' : 'down');
    if (powerDelta <= 0) return;

    const overlay = $('#level-up-overlay');
    if (!overlay) return;
    $('#level-up-title').textContent = title;
    $('#level-up-deltas').innerHTML = Object.entries(deltas)
      .filter(([, delta]) => delta !== 0)
      .map(([key, delta]) => `<span class="level-up-delta${delta < 0 ? ' negative' : ''}">${getStatLabel(key)} ${delta > 0 ? '+' : ''}${delta}</span>`)
      .join('');
    $('#level-up-power-text').textContent = `战斗值 ${before.power} → ${after.power}（+${powerDelta}）`;
    overlay.classList.remove('hidden');
    clearTimeout(powerFeedbackTimer);
    powerFeedbackTimer = setTimeout(() => overlay.classList.add('hidden'), 1900);
  }

  function playPowerSound(direction) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioContext = audioContext || new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const now = audioContext.currentTime;
      const notes = direction === 'up' ? [523.25, 659.25, 783.99] : [392, 329.63];
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const start = now + index * 0.1;
        oscillator.type = direction === 'up' ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.12, start + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.2);
      });
    } catch (error) {
      // 浏览器禁止自动播放时，视觉反馈仍然完整保留。
      console.info('Power sound unavailable.', error);
    }
  }

  function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = audioContext || new AudioContextClass();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    return audioContext;
  }

  function playUiSound(kind = 'gift') {
    try {
      const context = getAudioContext();
      if (!context) return;
      const now = context.currentTime;
      const patterns = {
        gift: [
          { frequency: 523.25, start: 0, duration: 0.09, gain: 0.08, type: 'triangle' },
          { frequency: 659.25, start: 0.08, duration: 0.11, gain: 0.1, type: 'triangle' },
          { frequency: 987.77, start: 0.18, duration: 0.16, gain: 0.12, type: 'sine' }
        ],
        blindBox: [
          { frequency: 196, start: 0, duration: 0.12, gain: 0.07, type: 'sawtooth' },
          { frequency: 392, start: 0.1, duration: 0.12, gain: 0.09, type: 'triangle' },
          { frequency: 783.99, start: 0.22, duration: 0.2, gain: 0.13, type: 'triangle' },
          { frequency: 1174.66, start: 0.32, duration: 0.18, gain: 0.09, type: 'sine' }
        ],
        reward: [
          { frequency: 659.25, start: 0, duration: 0.12, gain: 0.09, type: 'triangle' },
          { frequency: 880, start: 0.11, duration: 0.16, gain: 0.11, type: 'triangle' },
          { frequency: 1318.51, start: 0.25, duration: 0.18, gain: 0.1, type: 'sine' }
        ]
      };
      (patterns[kind] || patterns.gift).forEach(note => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = now + note.start;
        oscillator.type = note.type;
        oscillator.frequency.setValueAtTime(note.frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(note.gain, start + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + note.duration + 0.03);
      });
    } catch (error) {
      console.info('UI sound unavailable.', error);
    }
  }

  function showEvolutionSequence(student, before, after, options = {}) {
    const overlay = $('#evolution-overlay');
    const pet = getPetInfo(student.petType);
    if (!overlay) return;
    const isMiniEvolution = options.stage === 'mini';
    pauseBackgroundMusicForEvolution();
    $('#evolution-title').textContent = localize(isMiniEvolution ? '小进化完成！' : '觉醒进化！');
    $('#evolution-pet-name').textContent = getPetFullDisplayName(student) || pet?.name || '宠物';
    $('#evolution-result-image').src = getPetDisplayImage(student) || pet?.image || '';
    $('#evolution-result-image').alt = `${pet?.name || '宠物'}${isMiniEvolution ? '小进化形态' : '进化形态'}`;
    $('#evolution-stat-text').textContent = isMiniEvolution
      ? (currentLanguage === 'en'
        ? `Power ${before.power} → ${after.power} · final gear unlocked`
        : `战斗值 ${before.power} → ${after.power} · 终极装备已解锁`)
      : (currentLanguage === 'en'
        ? `Power ${before.power} → ${after.power} · rarity awakening bonus is active`
        : `战斗值 ${before.power} → ${after.power} · 稀有度觉醒加成已生效`);
    overlay.classList.remove('hidden');
    overlay.classList.add('evolution-cinematic-running');
    overlay.classList.remove('evolution-cinematic-finished');
    overlay.classList.remove('evolution-playing');
    void overlay.offsetWidth;
    overlay.classList.add('evolution-playing');
    clearTimeout(powerFeedbackTimer);
    playEvolutionCinematic();
  }

  function closeLevelUpOverlay() {
    clearTimeout(powerFeedbackTimer);
    $('#level-up-overlay')?.classList.add('hidden');
  }

  function closeEvolutionOverlay() {
    clearTimeout(powerFeedbackTimer);
    const overlay = $('#evolution-overlay');
    if (!overlay) return;
    stopEvolutionCinematic();
    restoreBackgroundMusicAfterEvolution();
    overlay.classList.add('hidden');
    overlay.classList.remove('evolution-playing');
    overlay.classList.remove('evolution-cinematic-running');
    overlay.classList.remove('evolution-cinematic-finished');
  }

  function playEvolutionSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioContext = audioContext || new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const now = audioContext.currentTime;
      const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const start = now + index * 0.11;
        oscillator.type = index < 3 ? 'sawtooth' : 'triangle';
        oscillator.frequency.setValueAtTime(frequency * 0.72, start);
        oscillator.frequency.exponentialRampToValueAtTime(frequency, start + 0.16);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(index < 3 ? 0.06 : 0.13, start + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.38);
      });
    } catch (error) {
      console.info('Evolution sound unavailable.', error);
    }
  }

  async function miniEvolvePet() {
    const triggerButton = arguments[0] || null;
    const student = getStudent();
    if (!student || isPetMiniEvolved(student)) return false;
    const progress = getEvolutionProgress(student);
    if (!progress.miniComplete) {
      showToast(progress.hasExclusiveSet ? `还需要装备至少 ${progress.miniRequired} 件专属装备才可以小进化。` : `还需要装备至少 ${progress.miniRequired} 个不同部位才可以小进化。`);
      return false;
    }
    if (!student.demoMode && Math.max(0, Math.floor(Number(student.coins || 0))) < MINI_EVOLUTION_COIN_COST) {
      showButtonInlineError(triggerButton, '金币不足');
      return false;
    }
    const challengePassed = await runEvolutionChallenge({ stage: 'mini', requiredHits: 3, allowedMisses: 3 });
    if (!challengePassed) return false;
    const before = getCombatState(student);
    const snapshot = cloneStudentState(student);
    const petType = student.petType;
    const pet = getPetInfo(petType);
    const record = ensurePetRecord(student);
    if (!student.demoMode) student.coins = Math.max(0, Math.floor(Number(student.coins || 0))) - MINI_EVOLUTION_COIN_COST;
    unlockPetEvolutionForm(record, PET_EVOLUTION_FORM_MINI, petType);
    record.miniEvolved = true;
    record.evolutionStage = 'mini';
    record.activeEvolutionForm = PET_EVOLUTION_FORM_MINI;
    student.activeEvolutionForm = PET_EVOLUTION_FORM_MINI;
    student.miniPetEvolved = true;
    student.miniEvolutionReady = false;
    syncPetEvolutionFormState(student, petType);
    syncEvolutionState(student);
    const after = getCombatState(student);
    const saved = await commitStudentState(student, snapshot, { type: 'miniEvolvePet', petId: petType, price: student.demoMode ? 0 : MINI_EVOLUTION_COIN_COST, activeEvolutionForm: PET_EVOLUTION_FORM_MINI }, () => {
      renderedCombatState = { studentId: null, stats: null, power: null };
      $('#level-up-overlay')?.classList.add('hidden');
      renderAppShell();
      switchView('home-view');
      showEvolutionSequence(student, before, after, { stage: 'mini' });
      showToast(`${getPetFullDisplayName(student) || pet?.name || '宠物'}已完成小进化！已扣除 ${student.demoMode ? 0 : MINI_EVOLUTION_COIN_COST} 金币，收齐全套装备后才可以进行最终进化。`);
    });
    if (saved) await refreshActiveInteractionRoomPetAppearance();
    return saved;
  }

  async function evolvePet(evolutionStyle = '') {
    const triggerButton = arguments[1] || null;
    const student = getStudent();
    if (!student?.petType) return false;
    const petType = student.petType;
    const requestedStyle = normalizePetEvolutionFormForPet(evolutionStyle, student.petType);
    const finalStyle = isFinalEvolutionForm(requestedStyle)
      ? requestedStyle
      : getPreferredPetEvolutionStyle(student, petType);
    if (hasUnlockedPetEvolutionForm(student, student.petType, finalStyle)) {
      return selectPetEvolutionForm(finalStyle, triggerButton);
    }
    const progress = getEvolutionProgress(student);
    if (!progress.miniAlreadyEvolved) {
      showToast(localize('必须先完成小进化，才可以开放最终进化。'));
      return false;
    }
    if (!progress.finalReady) {
      showToast(progress.hasExclusiveSet ? `还没有集齐对应角色的 ${progress.required} 件专属装备。` : `还需要装备满 ${progress.required} 个不同部位的装备。`);
      return false;
    }
    if (!student.demoMode && Math.max(0, Math.floor(Number(student.coins || 0))) < FINAL_EVOLUTION_COIN_COST) {
      showButtonInlineError(triggerButton, '金币不足');
      return false;
    }
    const challengePassed = await runEvolutionChallenge({ stage: 'final', requiredHits: 6, allowedMisses: 3 });
    if (!challengePassed) return false;
    const before = getCombatState(student);
    const snapshot = cloneStudentState(student);
    const pet = getPetInfo(petType);
    const record = ensurePetRecord(student);
    if (!student.demoMode) student.coins = Math.max(0, Math.floor(Number(student.coins || 0))) - FINAL_EVOLUTION_COIN_COST;
    unlockPetEvolutionForm(record, PET_EVOLUTION_FORM_MINI, petType);
    unlockPetEvolutionForm(record, finalStyle, petType);
    student.evolvedPets = student.evolvedPets || {};
    student.evolvedPets[petType] = true;
    student.petEvolved = true;
    student.miniPetEvolved = true;
    student.activeEvolutionForm = finalStyle;
    student.evolutionReady = false;
    student.miniEvolutionReady = false;
    student.exclusiveEvolutionReady = false;
    record.miniEvolved = true;
    record.evolutionStage = 'final';
    record.evolutionStyle = finalStyle;
    record.evolved = true;
    record.activeEvolutionForm = finalStyle;
    student.evolutionStylePreference = finalStyle;
    syncPetEvolutionFormState(student, petType);
    const after = getCombatState(student);
    const saved = await commitStudentState(student, snapshot, { type: 'evolvePet', petId: petType, evolutionStyle: finalStyle, activeEvolutionForm: finalStyle, price: student.demoMode ? 0 : FINAL_EVOLUTION_COIN_COST }, () => {
      renderedCombatState = { studentId: null, stats: null, power: null };
      $('#level-up-overlay')?.classList.add('hidden');
      closeEvolutionChoiceModal();
      // 进化成功后留在宠物首页，首页会立即使用 pet.evolvedImage 替换原始卡图。
      renderAppShell();
      switchView('home-view');
      showEvolutionSequence(student, before, after);
      showToast(`${getPetFullDisplayName(student) || pet?.name || '宠物'}已完成觉醒进化！已扣除 ${student.demoMode ? 0 : FINAL_EVOLUTION_COIN_COST} 金币，其他宠物可以直接在商店购买。`);
    });
    if (saved) await refreshActiveInteractionRoomPetAppearance();
    return saved;
  }

  function updateAdoptionConfirmState() {
    const button = $('#confirm-initial-pet');
    const name = $('#pet-name-input')?.value.trim();
    const validation = validatePetName(name);
    const isNameReady = validation.ok;
    showPetNameError(name && !validation.ok ? validation.error : '');
    button.disabled = !pendingInitialPet || !isNameReady;
    if (!pendingInitialPet) button.textContent = localize('先选择一只宠物');
    else if (!name) button.textContent = localize('先填写宠物名字');
    else if (!isNameReady) button.textContent = localize('换一个健康名字');
    else if (pendingPetMode === 'purchase') button.textContent = localize('确认购买并领养');
    else if (pendingPetMode === 'renameGift') button.textContent = localize('保存宠物名字');
    else button.textContent = localize('确认迎接伙伴');
  }

  function setPetSelectionModalClosable(closable) {
    const closeButton = $('#pet-selection-close');
    if (!closeButton) return;
    closeButton.classList.toggle('hidden', !closable);
    closeButton.disabled = !closable;
    closeButton.setAttribute('aria-hidden', String(!closable));
  }

  function closePetSelectionModal() {
    const student = getStudent();
    if (pendingPetMode === 'initial' && !student?.petType) {
      showToast('请先选择一只宠物。');
      return;
    }
    $('#pet-selection-modal')?.classList.add('hidden');
    pendingPetMode = 'initial';
    pendingInitialPet = '';
    pendingEvolutionStylePreference = '';
    showPetNameError('');
  }

  function petRecordNeedsNaming(student, petType = student?.petType) {
    if (!student || !petType) return false;
    const record = ensurePetRecord(student, petType);
    return Boolean(record?.needsNaming || !String(record?.petName || '').trim());
  }

  function findFirstPetNeedingName(student = getStudent()) {
    if (!student) return '';
    repairPetNamingState(student);
    const petIds = Array.from(new Set([student.petType, ...(student.ownedPets || [])].filter(Boolean)));
    return petIds.find(petId => petRecordNeedsNaming(student, petId)) || '';
  }

  function openPetRenameModal(petId) {
    const modal = $('#pet-selection-modal');
    const student = getStudent();
    const pet = getPetInfo(petId);
    if (!modal || !student || !pet) return false;
    const record = ensurePetRecord(student, pet.id);
    pendingPetMode = 'renameGift';
    pendingInitialPet = pet.id;
    pendingEvolutionStylePreference = '';
    $('#pet-selection-title').textContent = translateTextValue(`为 ${pet.name} 取名字`);
    $('#pet-selection-copy').textContent = translateTextValue('这只朋友送来的宠物已经加入收藏，请帮它填写名字和生日。');
    $('#initial-pet-options').innerHTML = `<button type="button" class="initial-pet-card selected" data-initial-pet="${pet.id}">
      <img class="initial-pet-art" src="${escapeHtml(getRolePreviewAsset(getPetRecordDisplayImage(student, pet.id) || pet.image))}" alt="${escapeHtml(pet.name)}" />
      <strong>${escapeHtml(pet.name)}</strong><small>${escapeHtml(getPetRarityDisplayLabel(record?.rarity || pet.rarity))}</small>
    </button>`;
    $('#pet-name-input').value = record?.needsNaming ? '' : (getPetNickname(student, pet.id) || '');
    showPetNameError('');
    $('#pet-birthday-input').value = record?.birthday || getDateKey();
    updateInitialEvolutionStylePreview();
    updateAdoptionConfirmState();
    setPetSelectionModalClosable(true);
    modal.classList.remove('hidden');
    applyLanguage(modal);
    return true;
  }

  function maybePromptActivePetNaming(student = getStudent()) {
    if (!student?.petType || !petRecordNeedsNaming(student, student.petType)) return false;
    return maybePromptPetNaming(student.petType, student);
  }

  function maybePromptAnyPetNaming(student = getStudent()) {
    const petId = findFirstPetNeedingName(student);
    if (!petId) return false;
    return maybePromptPetNaming(petId, student);
  }

  function maybePromptPetNaming(petId, student = getStudent()) {
    if (!student || !petId || !petRecordNeedsNaming(student, petId)) return false;
    const modal = $('#pet-selection-modal');
    const giftModal = $('#gift-claim-overlay');
    if (modal && !modal.classList.contains('hidden')) return false;
    if (giftModal && !giftModal.classList.contains('hidden')) return false;
    const key = `${HolidayBackendClient.normalizeId(student.studentId)}:${petId}`;
    if (promptedPetNamingKeys.has(key)) return false;
    promptedPetNamingKeys.add(key);
    return openPetRenameModal(petId);
  }

  function renderPetSelection() {
    const modal = $('#pet-selection-modal');
    const student = getStudent();
    if (!modal || !student) return;
    const choices = student.demoMode ? PET_CATALOG : INITIAL_PETS;
    pendingPetMode = 'initial';
    pendingInitialPet = '';
    pendingEvolutionStylePreference = '';
    $('#pet-selection-title').textContent = localize(student.demoMode ? '自由选择任意角色' : '选择你的第一只宠物');
    $('#pet-selection-copy').textContent = localize(student.demoMode ? 'Demo 模式：A、R、SR、SSR、LEGEND 全部开放。请为它填写名字和生日。' : '初始宠物保留免费选择；请为它填写名字和生日，之后可以在商店购买更多宠物。');
    $('#initial-pet-options').innerHTML = choices.map(pet => `
      <button type="button" class="initial-pet-card" data-initial-pet="${pet.id}">
        ${pet.image ? `<img class="initial-pet-art" src="${escapeHtml(getRolePreviewAsset(pet.image))}" alt="${escapeHtml(pet.name)}" />` : `<span class="initial-pet-icon">${pet.icon}</span>`}
        <strong>${escapeHtml(pet.name)}</strong>
        <small>${escapeHtml(getPetRarityDisplayLabel(pet.rarity))}</small>
      </button>`).join('');
    $('#pet-name-input').value = '';
    showPetNameError('');
    $('#pet-birthday-input').value = getDateKey();
    updateInitialEvolutionStylePreview();
    updateAdoptionConfirmState();
    setPetSelectionModalClosable(false);
    modal.classList.remove('hidden');
  }

  function openPetPurchaseModal(petId) {
    const triggerButton = openPetPurchaseModal.triggerButton || arguments[1] || null;
    const modal = $('#pet-selection-modal');
    const student = getStudent();
    const pet = getPetInfo(petId);
    if (!modal || !student || !pet || (student.ownedPets || []).includes(petId)) return;
    const rarity = getRarityInfo(pet.rarity);
    if (!student.demoMode && student.coins < rarity.price) {
      showButtonInlineError(triggerButton, '金币不足');
      return;
    }
    pendingPetMode = 'purchase';
    pendingInitialPet = pet.id;
    pendingEvolutionStylePreference = '';
    $('#pet-selection-title').textContent = translateTextValue(`领养 ${pet.name}`);
    $('#pet-selection-copy').textContent = translateTextValue(`这只 ${rarity.label} 宠物售价 ${rarity.price} 金币。购买后会独立保存自己的名字、生日、等级和装备。`);
    $('#initial-pet-options').innerHTML = `<button type="button" class="initial-pet-card selected" data-initial-pet="${pet.id}">
      <img class="initial-pet-art" src="${escapeHtml(getRolePreviewAsset(pet.image))}" alt="${escapeHtml(pet.name)}" />
      <strong>${escapeHtml(pet.name)}</strong><small>${escapeHtml(getPetRarityDisplayLabel(pet.rarity))}</small>
    </button>`;
    $('#pet-name-input').value = '';
    showPetNameError('');
    $('#pet-birthday-input').value = getDateKey();
    updateInitialEvolutionStylePreview();
    updateAdoptionConfirmState();
    setPetSelectionModalClosable(true);
    modal.classList.remove('hidden');
  }

  function maybeShowPetSelection() {
    const student = getStudent();
    if (student && !student.petType) renderPetSelection();
  }

  async function chooseInitialPet() {
    const student = getStudent();
    const pet = PET_CATALOG.find(entry => entry.id === pendingInitialPet);
    const displayName = $('#pet-name-input')?.value.trim();
    const birthday = $('#pet-birthday-input')?.value || getDateKey();
    const nameValidation = validatePetName(displayName);
    if (!nameValidation.ok) {
      showPetNameError(nameValidation.error);
      showToast(nameValidation.error);
      return;
    }
    if (!student || !pet || !displayName) return;
    const snapshot = cloneStudentState(student);

    if (pendingPetMode === 'renameGift') {
      const record = ensurePetRecord(student, pet.id);
      if (!record) return;
      record.petName = displayName;
      record.birthday = birthday;
      record.needsNaming = false;
      if (student.petType === pet.id) {
        student.petName = displayName;
        student.petBirthday = birthday;
      }
      await commitStudentState(student, snapshot, { type: 'renameGiftedPet', petId: pet.id }, () => {
        $('#pet-selection-modal').classList.add('hidden');
        pendingPetMode = 'initial';
        pendingInitialPet = '';
        renderedCombatState = { studentId: null, stats: null, power: null };
        renderAppShell();
        renderActiveStudentView();
        showToast(`${displayName} 的名字已经保存。`);
        setTimeout(() => maybePromptAnyPetNaming(getStudent()), 260);
      });
      return;
    }

    if (pendingPetMode === 'purchase') {
      const rarity = getRarityInfo(pet.rarity);
      if (!student.demoMode && student.coins < rarity.price) {
        showButtonInlineError($('#confirm-initial-pet'), '金币不足');
        return;
      }
      if (!student.demoMode) student.coins -= rarity.price;
      student.ownedPets = Array.from(new Set([...(student.ownedPets || []), pet.id]));
      const record = ensurePetRecord(student, pet.id);
      record.petName = displayName;
      record.birthday = birthday;
      record.rarity = pet.rarity;
      await commitStudentState(student, snapshot, { type: 'purchasePet', petId: pet.id, itemId: pet.id, price: student.demoMode ? 0 : rarity.price }, () => {
        $('#pet-selection-modal').classList.add('hidden');
        renderAppShell();
        switchView('shop-view');
        showToast(`${displayName} 已加入你的宠物图鉴！它的装备需要单独购买。`);
      });
      return;
    }

    student.petType = pet.id;
    student.petName = displayName;
    student.petBirthday = birthday;
    student.petRarity = pet.rarity === 'A' || student.demoMode ? pet.rarity : 'A';
    student.evolutionStylePreference = '';
    student.ownedPets = Array.from(new Set([...(student.ownedPets || []), pet.id]));
    student.petEvolved = false;
    student.newPlayerGuideEligible = true;
    delete student.newPlayerGuideCompletedAt;
    const record = ensurePetRecord(student, pet.id);
    record.petName = displayName;
    record.birthday = birthday;
    record.rarity = student.petRarity;
    await commitStudentState(student, snapshot, { type: 'adoptInitialPet', petId: pet.id, itemId: pet.id, price: 0 }, () => {
      $('#pet-selection-modal').classList.add('hidden');
      renderedCombatState = { studentId: null, stats: null, power: null };
      renderAppShell();
      switchView('home-view');
      queueNewPlayerGuide(student);
      showToast(`${displayName} 已成为你的学习伙伴！`);
    });
  }

  async function buyAndEquipItem(itemId) {
    const triggerButton = buyAndEquipItem.triggerButton || arguments[1] || null;
    const student = getStudent();
    const item = EQUIPMENT_CATALOG.find(entry => entry.id === itemId);
    const ownedItems = getOwnedItemIds(student);
    if (!student || !item || student.demoMode || ownedItems.includes(itemId)) return;
    if (!item.exclusivePetId || item.exclusivePetId !== student.petType) {
      showToast('只能在当前宠物主页购买它自己的专属装备。');
      return;
    }
    if (!ownedItems.includes(itemId) && !isExclusiveItemUnlockedForStudent(student, item)) {
      showToast('先完成小进化，才会开放终极进化装备。');
      return;
    }
    if (student.coins < item.price) {
      showButtonInlineError(triggerButton, '金币不足');
      return;
    }
    const snapshot = cloneStudentState(student);
    const record = ensurePetRecord(student);
    student.coins -= item.price;
    record.ownedItems = [...new Set([...(record.ownedItems || []), itemId])];
    student.ownedItems = [...record.ownedItems];
    Object.entries(student.equippedItems || {}).forEach(([key, equippedId]) => {
      const equipped = EQUIPMENT_CATALOG.find(entry => entry.id === equippedId);
      if (key !== item.slot && equipped?.slot === item.slot) delete student.equippedItems[key];
    });
    student.equippedItems[item.slot] = itemId;
    const exclusiveProgress = syncExclusiveEvolutionState(student);
    const readyCopy = exclusiveProgress.complete ? ' 六件专属装备已集齐，进化条件达成！' : '';
    syncActivePetRecord(student);
    await commitStudentState(student, snapshot, { type: 'purchaseAndEquipItem', itemId, petId: student.petType, price: item.price }, () => {
      renderActiveStudentView();
      showToast(`购买成功！${item.name} 已自动装备给 ${getPetFullDisplayName(student) || '当前宠物'}。${readyCopy}`);
      showGiftClaimModal({
        title: `恭喜获得 ${item.name}！`,
        message: `${item.name} 已自动装备给 ${getPetFullDisplayName(student) || '当前宠物'}。`,
        rewards: { pets: [], items: [{ id: item.id, name: getEquipmentDisplayName(item), image: item.image, petId: item.exclusivePetId }], coins: 0, duplicates: [] }
      });
      playUiSound('reward');
    });
  }

  async function equipFirstOwnedItemForSlot(slot) {
    const student = getStudent();
    const item = getBestOwnedEquipmentForSlot(student, slot);
    if (!student || !item) {
      showToast('这个部位还没有可以直接装备的已拥有装备，请先去宠物商店或开启盲盒。');
      return null;
    }
    return equipItem(item.id);
  }

  async function buyPet(petId) {
    const triggerButton = buyPet.triggerButton || arguments[1] || null;
    openPetPurchaseModal.triggerButton = triggerButton;
    try {
      openPetPurchaseModal(petId);
    } finally {
      openPetPurchaseModal.triggerButton = null;
    }
  }

  async function equipItem(itemId) {
    const student = getStudent();
    const item = EQUIPMENT_CATALOG.find(entry => entry.id === itemId);
    const isOwned = student?.demoMode || getOwnedItemIds(student).includes(itemId);
    if (!student || !item || !isOwned) return;
    const currentItem = getEquippedItemForSlot(student, item.slot);
    if (currentItem?.id === itemId) return;
    const before = getCombatState(student);
    const snapshot = cloneStudentState(student);
    Object.entries(student.equippedItems || {}).forEach(([key, equippedId]) => {
      const equipped = EQUIPMENT_CATALOG.find(entry => entry.id === equippedId);
      if (key !== item.slot && equipped?.slot === item.slot) delete student.equippedItems[key];
    });
    student.equippedItems[item.slot] = itemId;
    const exclusiveProgress = syncExclusiveEvolutionState(student);
    const after = getCombatState(student);
    const slotLabel = getEquipmentSlotInfo(item.slot).label;
    const readyCopy = exclusiveProgress.complete ? ' 六件专属装备已集齐，进化条件达成！' : '';
    syncActivePetRecord(student);
    const saved = await commitStudentState(student, snapshot, { type: 'equipItem', itemId, petId: student.petType }, () => {
      renderActiveStudentView();
      showToast(`${item.name} 已装备到${slotLabel}！${readyCopy}`);
    });
    return saved ? { before, after, exclusiveProgress } : null;
  }

  async function unequipItem(itemId) {
    const student = getStudent();
    const item = EQUIPMENT_CATALOG.find(entry => entry.id === itemId);
    if (!student || !item) return;
    showToast(localize('为了保护进化进度，已装备的物品不能卸下。'));
    return null;
  }

  function renderHistory() {
    const student = getStudent();
    if (!student) return;
    const target = $('#history-list');
    if (!student.checkins.length) {
      target.innerHTML = `<div class="empty-state"><div class="result-icon">📚</div><h3>还没有打卡记录</h3><p>完成第一次学习挑战后，这里会留下你的成长足迹。</p></div>`;
      return;
    }
    target.innerHTML = student.checkins.slice(0, 30).map(record => {
      const meta = SUBJECT_META[record.subject] || { icon: '📘' };
      return `<div class="history-row"><span class="history-date">${formatDate(record.date)}</span><span class="history-subject"><span>${meta.icon}</span>${escapeHtml(record.subject)}</span><span class="history-score">${record.score}/${record.total} 分</span><span class="history-reward">🪙 +${record.coinsEarned}</span></div>`;
    }).join('');
  }

  function getTeacherStudentIds() {
    return [...new Set([...Object.keys(DEMO_STUDENTS), ...Object.keys(database)])]
      .filter(studentId => studentId !== 'DEMOFREE')
      .sort();
  }

  function getTeacherIdFromInput() {
    return HolidayBackendClient.normalizeId($('#teacher-id-input')?.value || teacherState.teacherId);
  }

  function isTeacherGlobalAdminId(teacherId) {
    return TEACHER_GLOBAL_ADMIN_IDS.has(HolidayBackendClient.normalizeId(teacherId));
  }

  function isTeacherRewardAdminId(teacherId) {
    return TEACHER_REWARD_ADMIN_IDS.has(HolidayBackendClient.normalizeId(teacherId));
  }

  function normalizeBulkImportStudentId(value) {
    const compact = String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (/^\d{4}$/.test(compact)) return `CY${compact}`;
    if (/^CY\d{4}$/.test(compact)) return HolidayBackendClient.normalizeId(compact);
    return '';
  }

  function parseTeacherImportLine(line) {
    const delimiter = line.includes('\t') && !line.includes(',') ? '\t' : ',';
    const fields = [];
    let current = '';
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"') {
        if (quoted && line[index + 1] === '"') {
          current += '"';
          index += 1;
        } else {
          quoted = !quoted;
        }
        continue;
      }
      if (char === delimiter && !quoted) {
        fields.push(current.trim());
        current = '';
        continue;
      }
      current += char;
    }
    fields.push(current.trim());
    return fields;
  }

  function normalizeTeacherImportHeader(value) {
    const key = String(value || '').trim().toLowerCase().replace(/[\s_\-:：]/g, '');
    const map = {
      id: 'studentId',
      cyid: 'studentId',
      studentid: 'studentId',
      学生id: 'studentId',
      学号: 'studentId',
      name: 'studentName',
      studentname: 'studentName',
      姓名: 'studentName',
      名字: 'studentName',
      玩家名字: 'studentName',
      branch: 'branch',
      分院: 'branch',
      学校: 'branch',
      校区: 'branch',
      campus: 'branch',
      class: 'className',
      classname: 'className',
      class_name: 'className',
      班级: 'className',
      班: 'className',
      teacher: 'teacherId',
      teacherid: 'teacherId',
      assignedteacher: 'teacherId',
      assignedteacherid: 'teacherId',
      underteacher: 'teacherId',
      underteacherid: 'teacherId',
      负责老师: 'teacherId',
      负责老师id: 'teacherId',
      老师: 'teacherId',
      老师id: 'teacherId',
      under老师: 'teacherId'
    };
    return map[key] || '';
  }

  function normalizeTeacherImportText(value, fallback = '', maxLength = 40) {
    const text = String(value || '').trim().replace(/\s+/g, ' ');
    return (text || fallback).slice(0, maxLength);
  }

  function getTeacherBulkImportDefaults() {
    const defaultBranch = normalizeTeacherImportText($('#teacher-import-default-branch')?.value || '', '');
    const defaultClassName = normalizeTeacherImportText($('#teacher-import-default-class')?.value || '', '');
    const defaultTeacherId = HolidayBackendClient.normalizeId($('#teacher-import-default-teacher')?.value || getTeacherIdFromInput());
    return { defaultBranch, defaultClassName, defaultTeacherId };
  }

  function getTeacherImportDefaultColumns(values = []) {
    if (values.length >= 5) return ['studentId', 'studentName', 'branch', 'className', 'teacherId'];
    if (values.length >= 4) return ['studentId', 'studentName', 'branch', 'className'];
    return ['studentId', 'studentName'];
  }

  function parseTeacherBulkImportRows(text, defaults = {}) {
    const lines = String(text || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const errors = [];
    const rows = [];
    const seen = new Set();
    if (!lines.length) return { rows, errors: ['请先贴上名单，或上传 CSV 文件。'] };
    if (lines.length > 501) errors.push('一次最多导入 500 位学生，请分批处理。');
    const parsed = lines.slice(0, 501).map(parseTeacherImportLine);
    const defaultColumns = getTeacherImportDefaultColumns(parsed[0] || []);
    const firstHeaders = (parsed[0] || []).map(normalizeTeacherImportHeader);
    const hasHeader = firstHeaders.some(Boolean) && !normalizeBulkImportStudentId(parsed[0]?.[0]);
    const columns = hasHeader ? firstHeaders.map((field, index) => field || defaultColumns[index] || '') : defaultColumns;
    const dataRows = hasHeader ? parsed.slice(1) : parsed;
    const startLine = hasHeader ? 2 : 1;
    const fallbackBranch = normalizeTeacherImportText(defaults.defaultBranch, '');
    const fallbackClassName = normalizeTeacherImportText(defaults.defaultClassName, '');
    const fallbackTeacherId = HolidayBackendClient.normalizeId(defaults.defaultTeacherId || '');

    dataRows.forEach((values, index) => {
      const lineNumber = startLine + index;
      const record = {};
      columns.forEach((field, fieldIndex) => {
        if (field) record[field] = values[fieldIndex] || '';
      });
      const studentId = normalizeBulkImportStudentId(record.studentId || record.id);
      if (!studentId) {
        errors.push(`第 ${lineNumber} 行：学生 ID 请填写 4 位数字或 CY+4 位数字。`);
        return;
      }
      if (seen.has(studentId)) {
        errors.push(`第 ${lineNumber} 行：${studentId} 在这次名单里重复了。`);
        return;
      }
      const nameValidation = validatePublicDisplayText(record.studentName || record.name || '', 18, '请输入玩家名字。', '名字');
      if (!nameValidation.ok) {
        errors.push(`第 ${lineNumber} 行：${nameValidation.error || '名字不适合公开展示。'}`);
        return;
      }
      const branch = normalizeTeacherImportText(record.branch, fallbackBranch);
      const className = normalizeTeacherImportText(record.className, fallbackClassName);
      if (!branch) {
        errors.push(`第 ${lineNumber} 行：请先设定学校 / 分院，或在名单里填写 branch。`);
        return;
      }
      if (!className) {
        errors.push(`第 ${lineNumber} 行：请先设定班级名字，或在名单里填写 className。`);
        return;
      }
      const teacherId = HolidayBackendClient.normalizeId(record.teacherId || fallbackTeacherId);
      if (!teacherId) {
        errors.push(`第 ${lineNumber} 行：请先设定负责老师 ID，或在名单里填写 teacherId。`);
        return;
      }
      seen.add(studentId);
      rows.push({
        studentId,
        studentName: nameValidation.text,
        branch,
        className,
        teacherId
      });
    });
    return { rows, errors };
  }

  function renderTeacherImportPreview(result = null) {
    const target = $('#teacher-import-preview');
    const status = $('#teacher-import-status');
    const submitButton = $('[data-teacher-import-submit]');
    if (!target) return;
    const rows = result?.rows || teacherState.importRows || [];
    const errors = result?.errors || teacherState.importErrors || [];
    if (submitButton) submitButton.disabled = !rows.length || Boolean(errors.length);
    if (status) status.textContent = teacherState.importStatus || (rows.length
      ? `预览完成：${rows.length} 位可导入。`
      : '格式：4 位数字或 CY+4 位数字、名字；学校、班级和负责老师可用上方默认值，也可在名单里填写。');
    if (!rows.length && !errors.length) {
      target.innerHTML = '';
      return;
    }
    const previewRows = rows.slice(0, 30).map(row => `<tr>
      <td>${escapeHtml(row.studentId)}</td>
      <td>${escapeHtml(row.studentName)}</td>
      <td>${escapeHtml(row.branch)}</td>
      <td>${escapeHtml(row.className)}</td>
      <td>${escapeHtml(row.teacherId)}</td>
    </tr>`).join('');
    const moreCount = Math.max(0, rows.length - 30);
    target.innerHTML = `
      <div class="teacher-import-summary">
        <span>可导入 ${rows.length} 位</span>
        <span>错误 ${errors.length} 个</span>
        ${moreCount ? `<span>只预览前 30 位，还有 ${moreCount} 位</span>` : ''}
      </div>
      ${rows.length ? `<table class="teacher-import-table">
        <thead><tr><th>ID</th><th>名字</th><th>分院</th><th>班级</th><th>负责老师</th></tr></thead>
        <tbody>${previewRows}</tbody>
      </table>` : ''}
      ${errors.length ? `<div class="teacher-import-errors">${errors.slice(0, 20).map(error => `<div>${escapeHtml(error)}</div>`).join('')}${errors.length > 20 ? `<div>还有 ${errors.length - 20} 个错误没有显示。</div>` : ''}</div>` : ''}
    `;
  }

  function previewTeacherBulkImport() {
    const result = parseTeacherBulkImportRows($('#teacher-import-textarea')?.value || '', getTeacherBulkImportDefaults());
    teacherState.importRows = result.rows;
    teacherState.importErrors = result.errors;
    teacherState.importStatus = result.errors.length
      ? `发现 ${result.errors.length} 个问题，请先修改后再导入。`
      : `预览完成：${result.rows.length} 位可导入。`;
    renderTeacherImportPreview(result);
    return result;
  }

  function downloadTeacherBulkTemplate() {
    const csv = 'id,name,branch,className,teacherId\n1234,小明,Demo Branch A,3M,CY0004\n5678,Student D,Demo Branch A,3M,CY0004\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cy-pets-student-import-template.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function readTeacherImportFile(file) {
    if (!file) return;
    const text = await file.text();
    const textarea = $('#teacher-import-textarea');
    if (textarea) textarea.value = text;
    previewTeacherBulkImport();
  }

  function renderTeacherControls(statusText) {
    const idInput = $('#teacher-id-input');
    const classSelect = $('#teacher-class-select');
    const defaultTeacherInput = $('#teacher-import-default-teacher');
    const status = $('#teacher-sync-status');
    const activeTeacherId = getTeacherIdFromInput();
    const canUseImport = isTeacherGlobalAdminId(activeTeacherId);
    if (idInput && !idInput.value) idInput.value = teacherState.teacherId;
    if (defaultTeacherInput && !defaultTeacherInput.value) {
      defaultTeacherInput.value = HolidayBackendClient.normalizeId(teacherState.teacherId || idInput?.value || '');
    }
    $all('[data-admin-teacher-only]').forEach(element => {
      element.hidden = !canUseImport;
      element.classList.toggle('hidden', !canUseImport);
      element.setAttribute('aria-hidden', String(!canUseImport));
    });
    if (classSelect) {
      const classes = Array.isArray(teacherState.classes) ? teacherState.classes : [];
      classSelect.innerHTML = isGasBackend()
        ? (classes.length
          ? classes.map(item => `<option value="${escapeHtml(item.classId)}"${String(item.classId) === String(teacherState.classId) ? ' selected' : ''}>${escapeHtml(item.className || item.classId)} · ${Number(item.studentCount || 0)} 人</option>`).join('')
          : '<option value="">暂无班级</option>')
        : '<option value="">本机演示名单</option>';
      classSelect.disabled = !isGasBackend() || !classes.length;
    }
    if (status) {
      status.textContent = statusText || (isGasBackend()
        ? '学生每天最多从老师奖励获得 250 金币；CY0000 和 CY0001 可以给老师账号无上限加分。'
        : 'Supabase 模式会按分院和班级整理学生名单。');
    }
  }

  function getLocalTeacherStudents() {
    return getTeacherStudentIds().map(studentId => {
      const student = database[studentId];
      const demo = DEMO_STUDENTS[studentId] || {};
      return {
        studentId,
        studentName: student?.studentName || student?.name || demo.name || studentId,
        avatar: student?.avatar || demo.avatar || '👤',
        className: student?.className || demo.className || '待同步班级',
        coins: Number(student?.coins || 0),
        petName: student?.petName || '',
        petType: student?.petType || ''
      };
    });
  }

  function renderTeacher() {
    const target = $('#teacher-student-list');
    if (!target) return;
    const students = isGasBackend() ? teacherState.students : getLocalTeacherStudents();
    if (teacherState.loading) {
      target.innerHTML = '<div class="empty-state"><div class="result-icon">⏳</div><h3>正在读取学生名单</h3><p>请稍等一下。</p></div>';
      return;
    }
    if (!students.length) {
      target.innerHTML = '<div class="empty-state"><div class="result-icon">📋</div><h3>还没有学生名单</h3><p>请确认老师 ID，或这个班级目前没有可加分学生。</p></div>';
      return;
    }
    target.innerHTML = students.map(student => {
      const studentId = HolidayBackendClient.normalizeId(student.studentId);
      const name = student.studentName || student.name || studentId;
      const coins = Number(student.coins || 0);
      const pet = student.petType ? getPetInfo(student.petType) : null;
      return `<label class="teacher-student-row">
        <input type="checkbox" data-teacher-student="${escapeHtml(studentId)}" />
        <span class="teacher-student-avatar">${escapeHtml(student.avatar || '👤')}</span>
        <span class="teacher-student-copy"><strong>${escapeHtml(name)}</strong><small>${escapeHtml(studentId)} · ${escapeHtml(student.className || '待同步班级')}</small></span>
        <span class="teacher-student-balance">🪙 ${coins}<small>${pet ? escapeHtml(getPetFullDisplayName(student) || pet.name) : '尚未选择宠物'}</small></span>
      </label>`;
    }).join('');
    $('#teacher-select-all').checked = false;
  }

  async function loadTeacherClassStudents() {
    if (!isGasBackend()) {
      teacherState.loading = false;
      renderTeacherControls();
      renderTeacher();
      return;
    }
    const teacherId = getTeacherIdFromInput();
    const classId = String($('#teacher-class-select')?.value || teacherState.classId || '').trim();
    if (!teacherId || !classId) {
      teacherState.students = [];
      teacherState.loading = false;
      renderTeacherControls('请输入老师 ID，并选择一个班级。');
      renderTeacher();
      return;
    }
    teacherState.teacherId = teacherId;
    teacherState.classId = classId;
    teacherState.loading = true;
    renderTeacherControls('正在读取班级学生...');
    renderTeacher();
    try {
      const result = await backend.getClassStudents(teacherId, classId);
      if (!result.ok) throw new Error(result.error || '读取学生名单失败');
      teacherState.students = Array.isArray(result.students) ? result.students : [];
      teacherState.loading = false;
      renderTeacherControls(`已读取 ${teacherState.students.length} 位学生。`);
      renderTeacher();
    } catch (error) {
      teacherState.students = [];
      teacherState.loading = false;
      renderTeacherControls(String(error.message || error));
      renderTeacher();
    }
  }

  async function loadTeacherClasses() {
    if (!isGasBackend()) {
      teacherState.loading = false;
      teacherState.classes = [];
      teacherState.students = [];
      renderTeacherControls('当前是 Local 演示模式，学生名单来自本机浏览器。');
      renderTeacher();
      return;
    }
    const teacherId = getTeacherIdFromInput();
    if (!teacherId) {
      renderTeacherControls('请先输入老师 ID。');
      return;
    }
    teacherState.teacherId = teacherId;
    teacherState.loading = true;
    renderTeacherControls('正在读取老师班级...');
    renderTeacher();
    try {
      const result = await backend.listTeacherClasses(teacherId);
      if (!result.ok) throw new Error(result.error || '读取班级失败');
      teacherState.classes = Array.isArray(result.classes) ? result.classes : [];
      teacherState.classId = teacherState.classes.some(item => String(item.classId) === String(teacherState.classId))
        ? teacherState.classId
        : String(teacherState.classes[0]?.classId || '');
      teacherState.loading = false;
      renderTeacherControls(teacherState.classId ? '班级已读取，正在载入学生名单...' : '这个老师 ID 暂时没有可用班级。');
      if (teacherState.classId) await loadTeacherClassStudents();
      else renderTeacher();
    } catch (error) {
      teacherState.classes = [];
      teacherState.students = [];
      teacherState.loading = false;
      renderTeacherControls(String(error.message || error));
      renderTeacher();
    }
  }

  async function rewardSelectedStudents(amount) {
    const selected = [...new Set($all('[data-teacher-student]:checked').map(input => HolidayBackendClient.normalizeId(input.dataset.teacherStudent)).filter(Boolean))];
    const teacherId = getTeacherIdFromInput();
    if (!selected.length) {
      showToast('请先选择至少一位学生。');
      return;
    }
    if (isGasBackend()) {
      const classId = String($('#teacher-class-select')?.value || teacherState.classId || '').trim();
      if (!teacherId || !classId) {
        showToast('请先输入老师 ID 并选择班级。');
        return;
      }
      const result = await backend.rewardStudents({ teacherId, classId, studentIds: selected, amount, reason: '课堂表现' });
      if (!result.ok) {
        showToast(result.error || '奖励失败，请检查老师 ID 和班级权限。');
        return;
      }
      const balances = new Map((result.balances || []).map(item => [HolidayBackendClient.normalizeId(item.studentId), Number(item.coins || 0)]));
      if (balances.size) {
        teacherState.students = teacherState.students.map(student => balances.has(HolidayBackendClient.normalizeId(student.studentId))
          ? { ...student, coins: balances.get(HolidayBackendClient.normalizeId(student.studentId)) }
          : student);
        renderTeacher();
      } else {
        await loadTeacherClassStudents();
      }
      const acceptedCount = result.accepted?.length || balances.size || 0;
      const limitedCount = Array.isArray(result.limited) ? result.limited.length : 0;
      const dailyLimit = Math.max(0, Math.floor(Number(result.dailyLimit || ECONOMY_CONFIG.teacherDailyRewardLimit || 0)));
      if (!acceptedCount && limitedCount) {
        showToast(`已选学生今天已达到 ${dailyLimit} 金币课堂奖励上限。`);
      } else if (limitedCount) {
        showToast(`已为 ${acceptedCount} 位账号增加课堂金币；部分学生今天已达到 ${dailyLimit} 金币课堂奖励上限。`);
      } else {
        showToast(`已为 ${acceptedCount || selected.length} 位账号各增加最多 ${amount} 金币。`);
      }
      return;
    }
    const today = getDateKey();
    let acceptedCount = 0;
    let limitedCount = 0;
    selected.forEach(studentId => {
      if (!database[studentId]) database[studentId] = createStudentProfile(studentId);
      const student = database[studentId];
      student.teacherRewards = Array.isArray(student.teacherRewards) ? student.teacherRewards : [];
      const teacherTarget = isTeacherAccount(student);
      const canRewardTeacherTargets = isTeacherRewardAdminId(teacherId);
      if (teacherTarget && !canRewardTeacherTargets) {
        limitedCount += 1;
        return;
      }
      const remainingDailyReward = teacherTarget
        ? amount
        : Math.max(0, ECONOMY_CONFIG.teacherDailyRewardLimit - getTeacherRewardTotalForDate(student, today));
      const appliedAmount = teacherTarget && canRewardTeacherTargets ? amount : Math.min(amount, remainingDailyReward);
      if (appliedAmount <= 0) {
        limitedCount += 1;
        return;
      }
      student.coins = Number(student.coins || 0) + appliedAmount;
      student.teacherRewards.unshift({ date: today, amount: appliedAmount, source: 'teacher', teacher: 'demo-teacher' });
      if (!teacherTarget && appliedAmount < amount) limitedCount += 1;
      acceptedCount += 1;
    });
    saveDatabase();
    renderTeacher();
    if (!acceptedCount && limitedCount) {
      showToast(`已选学生今天已达到 ${ECONOMY_CONFIG.teacherDailyRewardLimit} 金币课堂奖励上限。`);
    } else if (limitedCount) {
      showToast(`已为 ${acceptedCount} 位账号增加课堂金币；部分学生今天已达到 ${ECONOMY_CONFIG.teacherDailyRewardLimit} 金币课堂奖励上限。`);
    } else {
      showToast(`已为 ${acceptedCount} 位账号各增加最多 ${amount} 金币。`);
    }
  }

  async function importTeacherBulkStudents() {
    if (!isGasBackend()) {
      showToast('请先连接 Supabase 后端。');
      return false;
    }
    const result = previewTeacherBulkImport();
    if (result.errors.length || !result.rows.length) {
      showToast(result.errors.length ? '名单还有问题，先修正再导入。' : '请先贴上或上传学生名单。');
      return false;
    }
    const teacherId = getTeacherIdFromInput();
    if (!teacherId) {
      showToast('请先输入老师 ID。');
      $('#teacher-id-input')?.focus?.();
      return false;
    }
    if (!isTeacherGlobalAdminId(teacherId)) {
      showToast('这个账号没有批量导入权限。');
      return false;
    }
    teacherState.importStatus = '正在导入 Supabase...';
    renderTeacherImportPreview(result);
    const { defaultBranch, defaultClassName, defaultTeacherId } = getTeacherBulkImportDefaults();
    let response;
    try {
      response = await backend.bulkImportStudents({ teacherId, defaultBranch, defaultClassName, defaultTeacherId, rows: result.rows });
    } catch (error) {
      teacherState.importStatus = `导入失败：${error.message || error}`;
      renderTeacherImportPreview({ rows: result.rows, errors: [teacherState.importStatus] });
      return false;
    }
    if (!response?.ok) {
      const errors = Array.isArray(response?.errors) ? response.errors : [response?.error || '导入失败，请稍后再试。'];
      teacherState.importRows = result.rows;
      teacherState.importErrors = errors;
      teacherState.importStatus = response?.error || '导入失败，请检查名单。';
      renderTeacherImportPreview({ rows: result.rows, errors });
      showToast(teacherState.importStatus);
      return false;
    }
    teacherState.importRows = [];
    teacherState.importErrors = [];
    teacherState.importStatus = `导入完成：新增 ${Number(response.created || 0)} 位，更新 ${Number(response.updated || 0)} 位，补齐进度 ${Number(response.stateCreated || 0)} 位。`;
    renderTeacherImportPreview({ rows: [], errors: [] });
    const textarea = $('#teacher-import-textarea');
    if (textarea) textarea.value = '';
    showToast(teacherState.importStatus);
    await loadTeacherClasses();
    return true;
  }

  async function enterTeacherMode(teacherId = '') {
    teacherState.returnStudentId = session.studentId || null;
    teacherState.teacherId = HolidayBackendClient.normalizeId(teacherId || teacherState.teacherId);
    const idInput = $('#teacher-id-input');
    if (idInput && teacherState.teacherId) idInput.value = teacherState.teacherId;
    session = { studentId: null, activeView: 'teacher-screen', quiz: null, demoFree: false, teacherMode: true };
    $('#login-screen').classList.add('hidden');
    $('#app-screen').classList.add('hidden');
    $('#teacher-screen').classList.remove('hidden');
    setScreenMode('teacher');
    renderTeacherControls();
    renderTeacherImportPreview();
    await loadTeacherClasses();
  }

  function exitTeacherMode() {
    session = { studentId: null, activeView: DEFAULT_APP_VIEW, quiz: null, demoFree: false, teacherMode: false };
    $('#teacher-screen').classList.add('hidden');
    const returnStudentId = HolidayBackendClient.normalizeId(teacherState.returnStudentId);
    teacherState.returnStudentId = null;
    if (returnStudentId && database[returnStudentId]) {
      session = { studentId: returnStudentId, activeView: DEFAULT_APP_VIEW, quiz: null, demoFree: Boolean(database[returnStudentId].demoMode), teacherMode: false };
      $('#app-screen').classList.remove('hidden');
      setScreenMode('app');
      renderAppShell();
      switchView(DEFAULT_APP_VIEW);
      return;
    }
    $('#login-screen').classList.remove('hidden');
    setScreenMode('login');
    $('#student-id').focus();
  }

  function switchLoginFormMode(mode = 'login') {
    const targetMode = mode === 'register' ? 'register' : 'login';
    const loginForm = $('#login-form');
    const registerForm = $('#register-form');
    const loginButton = $('#show-login-form-button');
    const registerButton = $('#show-register-form-button');
    const showRegister = targetMode === 'register';
    if (loginForm) {
      loginForm.hidden = showRegister;
      loginForm.setAttribute('aria-hidden', String(showRegister));
      loginForm.classList.toggle('hidden', showRegister);
    }
    if (registerForm) {
      registerForm.hidden = !showRegister;
      registerForm.setAttribute('aria-hidden', String(!showRegister));
      registerForm.classList.toggle('hidden', !showRegister);
    }
    [[loginButton, !showRegister], [registerButton, showRegister]].forEach(([button, active]) => {
      if (!button) return;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const error = $('#login-error');
    if (error) error.textContent = '';
    window.setTimeout(() => {
      const focusTarget = showRegister ? $('#register-student-name') : $('#student-id');
      focusTarget?.focus?.();
    }, 0);
    applyLanguage($('#login-screen'));
  }

  function getRegisterStudentIdFromForm(form) {
    const input = form.querySelector('[name="studentIdDigits"]');
    const raw = String(input?.value || '');
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (input && input.value !== digits) input.value = digits;
    if (!/^\d{4}$/.test(digits)) return { ok: false, error: '学生 ID 请填写 4 位数字。' };
    return { ok: true, studentId: `CY${digits}` };
  }

  function showRegistrationSuccessModal(studentId) {
    pendingRegisteredStudentId = HolidayBackendClient.normalizeId(studentId);
    const overlay = $('#registration-success-modal');
    const idLabel = $('#registration-success-id');
    if (idLabel) idLabel.textContent = pendingRegisteredStudentId || studentId || '';
    if (!overlay) return false;
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    applyLanguage(overlay);
    overlay.querySelector('[data-registration-success-continue]')?.focus?.();
    return true;
  }

  async function continueRegistrationSuccessLogin() {
    const studentId = pendingRegisteredStudentId;
    if (!studentId) return false;
    const overlay = $('#registration-success-modal');
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
    }
    pendingRegisteredStudentId = '';
    return login(studentId);
  }

  async function registerStudentFromForm(form) {
    if (!HolidayBackendClient.isSupabaseMode(APP_CONFIG)) {
      const message = '暂时无法注册账号，请稍后再试。';
      $('#login-error').textContent = localize(message);
      return false;
    }
    const studentIdValidation = getRegisterStudentIdFromForm(form);
    if (!studentIdValidation.ok) {
      $('#login-error').textContent = localize(studentIdValidation.error || '学生 ID 请填写 4 位数字。');
      form.querySelector('[name="studentIdDigits"]')?.focus?.();
      return false;
    }
    const nameValidation = validatePublicDisplayText(form.querySelector('[name="studentName"]')?.value || '', 18, '请输入玩家名字。', '名字');
    if (!nameValidation.ok) {
      $('#login-error').textContent = localize(nameValidation.error || '请输入玩家名字。');
      return false;
    }
    const sincereFriendId = HolidayBackendClient.normalizeId(form.querySelector('[name="sincereFriendId"]')?.value || '');
    if (!sincereFriendId) {
      $('#login-error').textContent = localize('请输入诚意朋友 ID。');
      form.querySelector('[name="sincereFriendId"]')?.focus?.();
      return false;
    }
    $('#login-error').textContent = localize('注册中');
    let result;
    try {
      result = await backend.registerStudent({
        studentId: studentIdValidation.studentId,
        studentName: nameValidation.text,
        sincereFriendId
      });
    } catch (error) {
      $('#login-error').textContent = `${localize('暂时无法注册账号，请稍后再试。')} ${error.message || error}`;
      return false;
    }
    if (!result?.ok || !result.student) {
      const message = result?.errorCode === 'STUDENT_ID_EXISTS'
        ? '这个学生 ID 已经存在，请换一个四位数字。'
        : (result?.error || '暂时无法注册账号，请稍后再试。');
      $('#login-error').textContent = localize(message);
      return false;
    }
    const registered = HolidayBackendClient.normalizeStudent(result.student, result.classes || [], {});
    database[registered.studentId] = registered;
    saveDatabase();
    $('#student-id').value = registered.studentId;
    switchLoginFormMode('login');
    showToast(`${localize('注册成功！你的 ID 是')} ${registered.studentId}`);
    showRegistrationSuccessModal(registered.studentId);
    return true;
  }

  async function login(studentId) {
    const rawNormalized = String(studentId || '').trim().toUpperCase();
    const normalized = HolidayBackendClient.normalizeId(rawNormalized);
    if (!normalized) return false;
    const isFreeDemo = normalized === 'DEMOFREE';
    if (isGasBackend() && !isFreeDemo) {
      $('#login-error').textContent = '正在读取学生资料...';
      let result;
      try {
        result = await backend.getStudent(normalized, { includeClasses: false });
      } catch (error) {
        $('#login-error').textContent = `暂时连接不到云端名单：${error.message || error}`;
        return false;
      }
      if (!result.ok) {
        $('#login-error').textContent = result.error || '暂时找不到这个学生 ID，请检查 Supabase 学生名单。';
        return false;
      }
      const existingLocalStudent = database[normalized] || (rawNormalized !== normalized ? database[rawNormalized] : null);
      const normalizedStudent = HolidayBackendClient.normalizeStudent(result.student || {}, result.classes || [], existingLocalStudent);
      normalizedStudent.studentId = normalized;
      normalizedStudent.studentName = HolidayBackendClient.getCanonicalStudentName(
        normalized,
        normalizedStudent.studentName || normalizedStudent.name || normalized,
        { allowCustom: Boolean(String(normalizedStudent.profileNameUpdatedAt || '').trim()) }
      );
      normalizedStudent.name = normalizedStudent.studentName;
      if (rawNormalized !== normalized && database[rawNormalized]) delete database[rawNormalized];
      database[normalized] = normalizedStudent;
    } else {
      if (!database[normalized]) {
        const demoInfo = DEMO_STUDENTS[normalized] || { name: normalized, branch: '5+1 智慧总院', className: 'Form 2', avatar: '🌟' };
        database[normalized] = createStudentProfile(normalized);
        database[normalized].studentName = demoInfo.name;
        database[normalized].name = demoInfo.name;
        database[normalized].className = demoInfo.className;
        database[normalized].form = demoInfo.className;
        database[normalized].avatar = demoInfo.avatar;
      }
      if (rawNormalized !== normalized && database[rawNormalized]) {
        database[normalized] = { ...database[rawNormalized], studentId: normalized };
        delete database[rawNormalized];
      }
      database[normalized].studentName = HolidayBackendClient.getCanonicalStudentName(
        normalized,
        database[normalized].studentName || database[normalized].name || normalized,
        { allowCustom: Boolean(String(database[normalized].profileNameUpdatedAt || '').trim()) }
      );
      database[normalized].name = database[normalized].studentName;
    }
    saveDatabase();
    session = { studentId: normalized, activeView: DEFAULT_APP_VIEW, quiz: null, demoFree: isFreeDemo, teacherMode: false };
    saveLoginSession(normalized);
    renderedCombatState = { studentId: null, stats: null, power: null };
    $('#login-error').textContent = '';
    $('#login-screen').classList.add('hidden');
    $('#teacher-screen').classList.add('hidden');
    $('#app-screen').classList.remove('hidden');
    setScreenMode('app');
    renderAppShell();
    switchView(DEFAULT_APP_VIEW);
    scheduleEvolutionCinematicPrime();
    setTimeout(() => maybeQueueNewPlayerGuide(database[normalized]), 700);
    setTimeout(() => maybeShowTeacherRewardModal(database[normalized]), 980);
    awardDailyLoginGift(database[normalized]).catch(error => console.info('Daily login gift skipped.', error));
    if (canUseFriendsBackend(database[normalized])) {
      loadFriendsDashboard(true).catch(error => console.info('Login gift prompt skipped.', error));
    }
    return true;
  }

  function isGasBackend() {
    return HolidayBackendClient.isSupabaseMode(APP_CONFIG);
  }

  function startFreeDemo() {
    login('DEMOFREE');
  }

  async function restoreSavedLogin() {
    const saved = loadLoginSession();
    const studentId = HolidayBackendClient.normalizeId(saved.studentId);
    if (!studentId) return;
    const cachedStudent = database[studentId];
    $('#student-id').value = studentId;
    $('#login-error').textContent = '正在恢复上次登录...';
    const restored = await login(saved.studentId);
    if (restored) return;
    if (cachedStudent) {
      session = { studentId, activeView: DEFAULT_APP_VIEW, quiz: null, demoFree: Boolean(cachedStudent.demoMode), teacherMode: false };
      saveLoginSession(studentId);
      renderedCombatState = { studentId: null, stats: null, power: null };
      $('#login-error').textContent = '';
      $('#login-screen').classList.add('hidden');
      $('#teacher-screen').classList.add('hidden');
      $('#app-screen').classList.remove('hidden');
      setScreenMode('app');
      renderAppShell();
      switchView(DEFAULT_APP_VIEW);
      scheduleEvolutionCinematicPrime();
      showToast('云端暂时较慢，先使用本机资料。');
      return;
    }
    if (!session.studentId) clearLoginSession();
  }

  function buildYiyanApologyPreviewStudent() {
    const student = createStudentProfile('CY9884');
    student.studentName = 'Yiyan老师';
    student.name = 'Yiyan老师';
    student.branch = 'CY大家庭';
    student.className = 'CY大家庭 - 1st';
    student.teacherId = '';
    student.petType = 'winnie-the-pooh';
    student.petName = '崽小熊';
    student.blindBoxes = 3;
    student.demoMode = true;
    student.ownedPets = Array.from(new Set([...(Array.isArray(student.ownedPets) ? student.ownedPets : []), 'winnie-the-pooh']));
    student.petCollection = student.petCollection && typeof student.petCollection === 'object' && !Array.isArray(student.petCollection)
      ? student.petCollection
      : {};
    student.petCollection['winnie-the-pooh'] = {
      id: 'winnie-the-pooh',
      petName: '崽小熊',
      petLevel: Math.max(1, Number(student.petLevel || 1)),
      experience: Math.max(0, Number(student.experience || 0)),
      equippedItems: student.equippedItems || {},
      ownedItems: Array.isArray(student.ownedEquipment) ? student.ownedEquipment : [],
      birthday: student.petBirthday || '',
      evolved: Boolean(student.evolved),
      miniEvolved: Boolean(student.miniEvolved)
    };
    return student;
  }

  function buildTeacherMusicGuidePreviewStudent() {
    const student = createStudentProfile('CY0000');
    student.studentName = 'Demo Admin';
    student.name = 'Demo Admin';
    student.branch = 'CY大家庭';
    student.className = 'TEST';
    student.teacherId = '';
    student.petType = 'shadow-wing';
    student.petName = '暗影小翼';
    student.demoMode = true;
    student.ownedPets = Array.from(new Set([...(Array.isArray(student.ownedPets) ? student.ownedPets : []), 'shadow-wing']));
    student.ownedMusicTracks = [DEFAULT_MUSIC_TRACK_ID, 'marvel-the-avengers'];
    student.petCollection = student.petCollection && typeof student.petCollection === 'object' && !Array.isArray(student.petCollection)
      ? student.petCollection
      : {};
    student.petCollection['shadow-wing'] = {
      id: 'shadow-wing',
      petId: 'shadow-wing',
      petName: '暗影小翼',
      petLevel: Math.max(1, Number(student.petLevel || 1)),
      experience: Math.max(0, Number(student.experience || 0)),
      equippedItems: student.equippedItems || {},
      ownedItems: Array.isArray(student.ownedEquipment) ? student.ownedEquipment : [],
      birthday: student.petBirthday || '',
      evolved: Boolean(student.evolved),
      miniEvolved: Boolean(student.miniEvolved)
    };
    return student;
  }

  function buildDailyCheckinGuidePreviewStudent() {
    const student = createStudentProfile('CY0000');
    student.studentName = 'Demo Admin';
    student.name = 'Demo Admin';
    student.branch = 'CY大家庭';
    student.className = 'TEST';
    student.teacherId = '';
    student.petType = 'shadow-wing';
    student.petName = '暗影小翼';
    student.demoMode = true;
    student.newPlayerGuideCompletedVersion = NEW_PLAYER_GUIDE_COMPLETION_VERSION;
    student.ownedPets = Array.from(new Set([...(Array.isArray(student.ownedPets) ? student.ownedPets : []), 'shadow-wing']));
    ensurePetRecord(student, 'shadow-wing');
    return student;
  }

  function startLocalGuidePreviewFromUrl() {
    const previewMode = getNewPlayerGuidePreviewMode();
    if (!previewMode) return false;
    const previewStudent = previewMode === DAILY_CHECKIN_GUIDE_ID
      ? buildDailyCheckinGuidePreviewStudent()
      : previewMode === TEACHER_NEW_MUSIC_GUIDE_ID
        ? buildTeacherMusicGuidePreviewStudent()
        : buildYiyanApologyPreviewStudent();
    database[previewStudent.studentId] = previewStudent;
    saveDatabase();
    session = { studentId: previewStudent.studentId, activeView: DEFAULT_APP_VIEW, quiz: null, demoFree: true, teacherMode: false };
    renderedCombatState = { studentId: null, stats: null, power: null };
    $('#login-error').textContent = '';
    $('#login-screen').classList.add('hidden');
    $('#teacher-screen').classList.add('hidden');
    $('#app-screen').classList.remove('hidden');
    setScreenMode('app');
    renderAppShell();
    switchView(DEFAULT_APP_VIEW);
    scheduleEvolutionCinematicPrime();
    return true;
  }

  function logout() {
    session = { studentId: null, activeView: DEFAULT_APP_VIEW, quiz: null, demoFree: false, teacherMode: false };
    clearLoginSession();
    renderedCombatState = { studentId: null, stats: null, power: null };
    $('#app-screen').classList.add('hidden');
    $('#teacher-screen').classList.add('hidden');
    $('#login-screen').classList.remove('hidden');
    setScreenMode('login');
    $('#student-id').focus();
  }

  function resetDemo() {
    if (!confirm('确定要清除本机演示账号的进度吗？')) return;
    Object.keys(DEMO_STUDENTS).concat('DEMOFREE').forEach(id => delete database[id]);
    saveDatabase();
    if (session.studentId) {
      const id = session.studentId;
      database[id] = createStudentProfile(id);
      saveDatabase();
      renderAppShell();
      switchView(DEFAULT_APP_VIEW);
    }
    showToast('演示资料已重置。');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  // ===== 云端后端接口 =====
  const backend = HolidayBackendClient.createClient(APP_CONFIG);
  const backendClient = backend;
  let backendWarmupStarted = false;

  function warmProductionBackend() {
    if (backendWarmupStarted || APP_CONFIG.backendMode === 'local' || typeof fetch !== 'function') return;
    backendWarmupStarted = true;
    const runWarmup = () => {
      fetch('/api/warmup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
        keepalive: true
      }).catch(error => console.info('Backend warmup skipped.', error));
    };
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(runWarmup, { timeout: 1200 });
    } else {
      window.setTimeout(runWarmup, 700);
    }
  }

  $all('.demo-id').forEach(button => button.addEventListener('click', () => {
    $('#student-id').value = button.dataset.demoId;
    $('#student-id').focus();
  }));
  $('#login-form').addEventListener('submit', event => {
    event.preventDefault();
    const button = event.submitter || $('#login-form button[type="submit"]');
    withButtonLoading(button, () => login($('#student-id').value), '读取中');
  });
  $('#register-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const button = event.submitter || $('#register-form button[type="submit"]');
    withButtonLoading(button, () => registerStudentFromForm(event.currentTarget), '注册中');
  });
  $('#show-login-form-button')?.addEventListener('click', () => switchLoginFormMode('login'));
  $('#free-demo-button')?.addEventListener('click', startFreeDemo);
  $('#teacher-entry-button')?.addEventListener('click', enterTeacherMode);
  $('#teacher-mode-button')?.addEventListener('click', () => enterTeacherMode(session.studentId));
  $('#teacher-logout-button').addEventListener('click', exitTeacherMode);
  $('#teacher-refresh-button')?.addEventListener('click', loadTeacherClasses);
  $('#teacher-class-select')?.addEventListener('change', event => {
    teacherState.classId = event.target.value;
    loadTeacherClassStudents();
  });
  $('[data-teacher-import-template]')?.addEventListener('click', downloadTeacherBulkTemplate);
  $('[data-teacher-import-preview]')?.addEventListener('click', previewTeacherBulkImport);
  $('[data-teacher-import-submit]')?.addEventListener('click', event => {
    withButtonLoading(event.currentTarget, importTeacherBulkStudents, '导入中');
  });
  $('#teacher-import-file')?.addEventListener('change', event => {
    readTeacherImportFile(event.target.files?.[0]).catch(error => showToast(`读取文件失败：${error.message || error}`));
  });
  $('#logout-button').addEventListener('click', logout);
  $('#reset-demo-button')?.addEventListener('click', resetDemo);
  $('#teacher-select-all')?.addEventListener('change', event => {
    $all('[data-teacher-student]').forEach(input => { input.checked = event.target.checked; });
  });
  $('#pet-name-input').addEventListener('input', updateAdoptionConfirmState);
  $('#pet-birthday-input').addEventListener('change', updateAdoptionConfirmState);
  $all('.nav-button').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
  document.addEventListener('input', event => {
    const registerStudentIdInput = event.target.closest('#register-student-id');
    if (registerStudentIdInput) {
      registerStudentIdInput.value = String(registerStudentIdInput.value || '').replace(/\D/g, '').slice(0, 4);
      return;
    }
    const avatarZoomInput = event.target.closest('#avatar-crop-zoom');
    if (avatarZoomInput) {
      updateAvatarCropZoom(avatarZoomInput.value);
      return;
    }
    const homeNameInput = event.target.closest('[data-home-name-input]');
    if (homeNameInput) {
      homeNameEditState.value = String(homeNameInput.value || '');
      return;
    }
    const interactionRoomNameInput = event.target.closest('input[name="interactionRoomName"]');
    if (interactionRoomNameInput) {
      interactionRoomState.roomNameDraft = String(interactionRoomNameInput.value || '');
      return;
    }
    const interactionPasswordInput = event.target.closest('input[name="interactionRoomPassword"]');
    if (interactionPasswordInput) {
      const digits = normalizeInteractionPassword(interactionPasswordInput.value);
      if (interactionPasswordInput.value !== digits) interactionPasswordInput.value = digits;
      interactionRoomState.passwordDraft = digits;
      return;
    }
    const interactionJoinPasswordInput = event.target.closest('input[name="interactionRoomJoinPassword"]');
    if (interactionJoinPasswordInput) {
      const digits = normalizeInteractionPassword(interactionJoinPasswordInput.value);
      if (interactionJoinPasswordInput.value !== digits) interactionJoinPasswordInput.value = digits;
      const form = interactionJoinPasswordInput.closest('[data-interaction-room-join-form]');
      const roomId = String(form?.dataset.roomId || '').trim().toUpperCase();
      if (roomId) interactionRoomState.joinPasswordDrafts[roomId] = digits;
      return;
    }
    const kuromiRoomChatInput = event.target.closest('[data-kuromi-room-chat-form] input[name="kuromiMessage"]');
    if (kuromiRoomChatInput) {
      interactionRoomState.chatDraft = String(kuromiRoomChatInput.value || '');
      return;
    }
    const roomChatInput = event.target.closest('[data-room-chat-form] input[name="roomMessage"]');
    if (roomChatInput) {
      friendState.roomMessageDraft = String(roomChatInput.value || '');
      return;
    }
    const roomNameInput = event.target.closest('[data-room-settings-form] input[name="roomName"]');
    if (roomNameInput) {
      friendState.roomNameDraft = String(roomNameInput.value || '');
      friendState.roomNameDraftDirty = true;
    }
  });
  document.addEventListener('submit', async event => {
    const homeNameForm = event.target.closest('[data-home-name-form]');
    if (homeNameForm) {
      event.preventDefault();
      const button = homeNameForm.querySelector('button[type="submit"]');
      const input = homeNameForm.querySelector('input[name="profileName"]');
      await withButtonLoading(button, () => saveHomeProfileName(homeNameForm.dataset.homeNameForm, input?.value || ''), '保存中');
      return;
    }
    const friendSearchForm = event.target.closest('#friend-search-form');
    if (friendSearchForm) {
      event.preventDefault();
      const button = friendSearchForm.querySelector('button[type="submit"]');
      await withButtonLoading(button, () => searchFriendsFromForm(friendSearchForm), '搜索中');
      return;
    }
    const presetCommentForm = event.target.closest('[data-wall-preset-comment]');
    if (presetCommentForm) {
      event.preventDefault();
      const select = presetCommentForm.querySelector('[data-wall-comment-select]');
      const button = presetCommentForm.querySelector('.wall-comment-select-button');
      await withButtonLoading(button, () => commentWallPost(presetCommentForm.dataset.wallPresetComment, select?.value || WALL_COMMENT_PRESETS[0]), '留言中');
      return;
    }
    const interactionCreateForm = event.target.closest('[data-interaction-room-create-form]');
    if (interactionCreateForm) {
      event.preventDefault();
      const button = interactionCreateForm.querySelector('button[type="submit"]');
      await withButtonLoading(button, () => createInteractionRoomFromForm(interactionCreateForm), '创建中');
      return;
    }
    const interactionJoinForm = event.target.closest('[data-interaction-room-join-form]');
    if (interactionJoinForm) {
      event.preventDefault();
      const button = interactionJoinForm.querySelector('button[type="submit"]');
      await withButtonLoading(button, () => joinInteractionRoomFromForm(interactionJoinForm), '进入中');
      return;
    }
    const roomSettingsForm = event.target.closest('[data-room-settings-form]');
    if (roomSettingsForm) {
      event.preventDefault();
      const button = roomSettingsForm.querySelector('button[type="submit"]');
      await withButtonLoading(button, () => updateCurrentRoomSettings(roomSettingsForm), '保存中');
      return;
    }
    const roomChatForm = event.target.closest('[data-room-chat-form]');
    if (roomChatForm) {
      event.preventDefault();
      const button = roomChatForm.querySelector('button[type="submit"]');
      await withButtonLoading(button, () => sendRoomChatMessage(roomChatForm), '发送中');
      return;
    }
    const roomJoinForm = event.target.closest('[data-room-join-form]');
    if (roomJoinForm) {
      event.preventDefault();
      const button = roomJoinForm.querySelector('button[type="submit"]');
      await withButtonLoading(button, () => joinRoomByCode(roomJoinForm), '申请中');
      return;
    }
    const kuromiRoomChatForm = event.target.closest('[data-kuromi-room-chat-form]');
    if (kuromiRoomChatForm) {
      event.preventDefault();
      const input = kuromiRoomChatForm.querySelector('input[name="kuromiMessage"]');
      await sendKuromiRoomMessageText(input?.value || '');
      return;
    }
    const customCommentForm = event.target.closest('[data-wall-custom-comment]');
    if (!customCommentForm) return;
    event.preventDefault();
    const input = customCommentForm.querySelector('.wall-custom-comment-input');
    const button = customCommentForm.querySelector('.wall-custom-comment-button');
    const posted = await withButtonLoading(button, () => commentWallPost(customCommentForm.dataset.wallCustomComment, input?.value || ''), '留言中');
    if (posted && input) input.value = '';
    });
    document.addEventListener('change', async event => {
      const avatarUploadInput = event.target.closest('#student-avatar-upload');
      if (avatarUploadInput) {
        await openStudentAvatarCropFromFile(avatarUploadInput.files?.[0]);
        avatarUploadInput.value = '';
        return;
      }
      const avatarZoomInput = event.target.closest('#avatar-crop-zoom');
      if (avatarZoomInput) {
        updateAvatarCropZoom(avatarZoomInput.value);
        return;
      }
      const interactionLockToggle = event.target.closest('[data-interaction-room-lock-toggle]');
      if (interactionLockToggle) {
        interactionRoomState.usePassword = Boolean(interactionLockToggle.checked);
        renderInteractionRoomLobby(getStudent());
        return;
      }
      const interactionMapSetInput = event.target.closest('[data-interaction-room-map-set]');
      if (interactionMapSetInput) {
        interactionRoomState.mapSetDraft = normalizeInteractionRoomMapSetId(interactionMapSetInput.value);
        renderInteractionRoomLobby(getStudent());
        return;
      }
      const shopSlotSelect = event.target.closest('[data-shop-slot-filter]');
      if (shopSlotSelect) {
        selectedShopSlot = shopSlotSelect.value;
        renderShop();
        return;
      }
      const petSeriesSelect = event.target.closest('[data-pet-series-select]');
      if (petSeriesSelect) {
        selectedPetSeries = petSeriesSelect.value;
        renderPetShop(getStudent());
        return;
      }
      const roomSceneSelect = event.target.closest('[data-room-scene-select]');
      if (roomSceneSelect) {
        updateSharedRoomScene(roomSceneSelect.value);
        return;
      }
      const giftItemSelect = event.target.closest('[data-gift-item-select]');
      if (giftItemSelect) {
        const item = EQUIPMENT_CATALOG.find(entry => entry.id === giftItemSelect.value);
        friendState.giftItemId = item?.id || '';
        friendState.giftItemPetId = item?.exclusivePetId || '';
        friendState.giftAmount = Number(item?.price || 0);
        renderGiftModal();
        return;
      }
      const giftPetSelect = event.target.closest('[data-gift-pet-select]');
      if (giftPetSelect) {
        const pet = getPetInfo(giftPetSelect.value);
        friendState.giftPetId = pet?.id || '';
        friendState.giftAmount = Number(getRarityInfo(pet?.rarity).price || 0);
        renderGiftModal();
        return;
      }
      const giftMusicSelect = event.target.closest('[data-gift-music-select]');
      if (giftMusicSelect) {
        const track = getMusicTrackById(giftMusicSelect.value);
        friendState.giftMusicTrackId = track?.id || '';
        friendState.giftAmount = MUSIC_BOX_TRACK_PRICE;
        renderGiftModal();
        return;
      }
      const wallPresetSelect = event.target.closest('[data-wall-post-select]');
      if (!wallPresetSelect) return;
      selectedWallPostPreset = wallPresetSelect.value;
      renderMessageWall(getStudent());
      renderHomeWallShare(getStudent());
    });
    document.addEventListener('toggle', event => {
      const panel = event.target?.closest?.('[data-wall-comments-panel]');
      if (!panel) return;
      const postId = String(panel.dataset.wallCommentsPanel || '');
      if (!postId) return;
      if (panel.open) expandedWallCommentPostIds.add(postId);
      else expandedWallCommentPostIds.delete(postId);
    }, true);
  document.addEventListener('pointermove', movePetFoodPointerDrag);
  document.addEventListener('pointermove', moveAvatarCropDrag);
  document.addEventListener('pointerup', finishPetFoodPointerDrag);
  document.addEventListener('pointerup', finishAvatarCropDrag);
  document.addEventListener('pointerup', releaseRunnerMiniGameControls);
  document.addEventListener('pointerup', releaseJumpChargeMiniGame);
  document.addEventListener('pointercancel', cleanupPetFoodPointerDrag);
  document.addEventListener('pointercancel', finishAvatarCropDrag);
  document.addEventListener('pointercancel', releaseRunnerMiniGameControls);
  document.addEventListener('pointercancel', releaseJumpChargeMiniGame);
  window.addEventListener('scroll', scheduleNewPlayerGuideSpotlightUpdate, true);
  window.addEventListener('resize', scheduleNewPlayerGuideSpotlightUpdate);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('scroll', scheduleNewPlayerGuideSpotlightUpdate);
    window.visualViewport.addEventListener('resize', scheduleNewPlayerGuideSpotlightUpdate);
  }
  document.addEventListener('pointerdown', event => {
    if (event.target.closest('#avatar-crop-canvas')) {
      startAvatarCropDrag(event);
      return;
    }
    const runnerControl = getRunnerMiniGameControlTarget(event);
    if (runnerControl) {
      event.preventDefault();
      try {
        if (event.pointerId !== undefined && runnerControl.setPointerCapture) runnerControl.setPointerCapture(event.pointerId);
      } catch (error) {
        console.info('Pointer capture is not available for runner controls.', error);
      }
      if (runnerControl.dataset.runnerControl === 'jump') pressRunnerMiniGameJump(true);
      if (runnerControl.dataset.runnerControl === 'duck') setRunnerMiniGameDuck(true);
      return;
    }
    if (!event.target.closest('#mini-game-canvas, [data-mini-game-canvas]')) return;
    event.preventDefault();
    if (miniGameState.type === 'jumpCharge') {
      startJumpChargeMiniGameCharge(event);
      return;
    }
    runMiniGamePrimaryAction();
  });
  document.addEventListener('touchstart', event => {
    if (!getRunnerMiniGameControlTarget(event)) return;
    event.preventDefault();
  }, { passive: false, capture: true });
  document.addEventListener('touchmove', event => {
    if (!getRunnerMiniGameControlTarget(event)) return;
    event.preventDefault();
  }, { passive: false, capture: true });
  document.addEventListener('selectstart', event => {
    if (!getRunnerMiniGameControlTarget(event)) return;
    event.preventDefault();
  }, true);
  document.addEventListener('contextmenu', event => {
    if (!getRunnerMiniGameControlTarget(event)) return;
    event.preventDefault();
  }, true);
  window.addEventListener('pagehide', () => {
    sendInteractionRoomLeaveBeacon();
    stopInteractionRoomHeartbeat();
    stopKuromiRoomDemo();
  });
  window.addEventListener('beforeunload', () => {
    sendInteractionRoomLeaveBeacon();
  });
  window.addEventListener('pageshow', () => {
    if (session.activeView !== 'guide-view' || !interactionRoomState.activeRoomId) return;
    startInteractionRoomHeartbeat();
    initKuromiRoomDemo();
    void sendInteractionRoomHeartbeat({ silent: true });
  });
  document.addEventListener('click', async event => {
    const homeNameEditButton = event.target.closest('[data-home-name-edit]');
    if (homeNameEditButton) {
      const field = getHomeNameEditField(homeNameEditButton.dataset.homeNameEdit);
      if (field) {
        homeNameEditState.field = field;
        homeNameEditState.value = getHomeNameEditValue(field);
        renderAppShell();
        renderActiveStudentView();
        focusHomeNameInput();
      }
      return;
    }
    const homeNameCancelButton = event.target.closest('[data-home-name-cancel]');
    if (homeNameCancelButton) {
      homeNameEditState.field = '';
      homeNameEditState.value = '';
      renderAppShell();
      renderActiveStudentView();
      return;
    }
    const languageButton = event.target.closest('[data-language]');
      if (languageButton) {
        setLanguage(languageButton.dataset.language);
        return;
      }
      const wallLeaderboardButton = event.target.closest('[data-wall-leaderboard]');
      if (wallLeaderboardButton) {
        activeWallLeaderboard = wallLeaderboardButton.dataset.wallLeaderboard || 'power';
        renderWallLeaderboard(getStudent());
        return;
      }
      const musicPreviewButton = event.target.closest('[data-music-preview]');
      if (musicPreviewButton) {
        previewMusicTrack(musicPreviewButton.dataset.musicPreview, musicPreviewButton);
        return;
      }
      const musicPlayerToggleButton = event.target.closest('[data-music-player-toggle]');
      if (musicPlayerToggleButton) {
        toggleMusicPlayerPlayback();
        return;
      }
      const musicPlayerNextButton = event.target.closest('[data-music-player-next]');
      if (musicPlayerNextButton) {
        stopMusicPreview({ resume: false });
        advanceBackgroundMusic({ manual: true });
        return;
      }
      const musicPlaybackModeButton = event.target.closest('[data-music-play-mode]');
      if (musicPlaybackModeButton) {
        await withButtonLoading(musicPlaybackModeButton, () => setMusicPlaybackMode(musicPlaybackModeButton.dataset.musicPlayMode), '保存中');
        return;
      }
      const musicBuyButton = event.target.closest('[data-music-buy]');
      if (musicBuyButton) {
        buyMusicTrack.triggerButton = musicBuyButton;
        try {
          await withButtonLoading(musicBuyButton, () => buyMusicTrack(musicBuyButton.dataset.musicBuy), '购买中');
        } finally {
          buyMusicTrack.triggerButton = null;
        }
        return;
      }
      const musicEquipButton = event.target.closest('[data-music-equip]');
      if (musicEquipButton) {
        await withButtonLoading(musicEquipButton, () => equipMusicTrack(musicEquipButton.dataset.musicEquip), '切换中');
        return;
      }
      const musicWallShareButton = event.target.closest('[data-music-wall-share]');
      if (musicWallShareButton) {
        await withButtonLoading(musicWallShareButton, () => shareMusicTrackToWall(musicWallShareButton.dataset.musicWallShare), '分享中');
        return;
      }
      const interactionLobbyModeButton = event.target.closest('[data-interaction-lobby-mode]');
      if (interactionLobbyModeButton) {
        setInteractionRoomLobbyMode(interactionLobbyModeButton.dataset.interactionLobbyMode);
        return;
      }
      const interactionRoomHeroButton = event.target.closest('[data-interaction-room-switch-pet]');
      if (interactionRoomHeroButton) {
        await selectInteractionRoomHeroPet(interactionRoomHeroButton.dataset.interactionRoomSwitchPet, interactionRoomHeroButton);
        return;
      }
      const interactionRoomPetSizeButton = event.target.closest('[data-interaction-room-pet-size]');
      if (interactionRoomPetSizeButton) {
        await selectInteractionRoomPetSize(interactionRoomPetSizeButton.dataset.interactionRoomPetSize);
        return;
      }
      const miniGameOpenButton = event.target.closest('[data-mini-game-open]');
      if (miniGameOpenButton) {
        openMiniGameMenu({ surface: 'embedded' });
        return;
      }
      const miniGameFullscreenButton = event.target.closest('[data-mini-game-fullscreen]');
      if (miniGameFullscreenButton) {
        await toggleMiniGameFullscreen();
        return;
      }
      const miniGameStartButton = event.target.closest('[data-mini-game-start]');
      if (miniGameStartButton) {
        startMiniGame(miniGameStartButton.dataset.miniGameStart);
        return;
      }
      const miniGameCloseButton = event.target.closest('[data-mini-game-close]');
      if (miniGameCloseButton) {
        closeMiniGameOverlay();
        return;
      }
      const miniGameActionButton = event.target.closest('[data-mini-game-action]');
      if (miniGameActionButton) {
        runMiniGamePrimaryAction();
        return;
      }
      const miniGameRetryButton = event.target.closest('[data-mini-game-retry]');
      if (miniGameRetryButton) {
        retryMiniGame();
        return;
      }
      const interactionRefreshButton = event.target.closest('[data-interaction-room-refresh]');
      if (interactionRefreshButton) {
        await withButtonLoading(interactionRefreshButton, () => loadInteractionRooms(true), '刷新中');
        return;
      }
      const interactionJoinButton = event.target.closest('[data-interaction-room-join]');
      if (interactionJoinButton) {
        await withButtonLoading(interactionJoinButton, () => joinInteractionRoomById(interactionJoinButton.dataset.interactionRoomJoin), '进入中');
        return;
      }
      const interactionLeaveButton = event.target.closest('[data-interaction-room-leave]');
      if (interactionLeaveButton) {
        await withButtonLoading(interactionLeaveButton, () => leaveActiveInteractionRoom({ refresh: true }), '离开中');
        return;
      }
      const roomListCloseButton = event.target.closest('[data-room-list-close]');
      if (roomListCloseButton) {
        await withButtonLoading(roomListCloseButton, () => toggleOwnRoomFromList(roomListCloseButton), '保存中');
        return;
      }
	      const roomEnterButton = event.target.closest('[data-room-enter]');
	      if (roomEnterButton) {
	        await withButtonLoading(roomEnterButton, () => enterPetWallRoom(roomEnterButton.dataset.roomEnter), '进入中');
        return;
      }
      const roomListRefreshButton = event.target.closest('[data-room-list-refresh]');
      if (roomListRefreshButton) {
        await withButtonLoading(roomListRefreshButton, () => loadSharedRooms(true), '刷新中');
        return;
      }
      const sceneButton = event.target.closest('[data-pet-scene]');
      if (sceneButton) {
        setPetInteractionScene(sceneButton.dataset.petScene);
        triggerPetInteractionAction('walk');
        return;
      }
      const petToggleButton = event.target.closest('#pet-animation-toggle');
      if (petToggleButton) {
        setPetInteractionEnabled(petToggleButton.getAttribute('aria-pressed') !== 'true');
        return;
      }
      const callPetButton = event.target.closest('#pet-call-button');
      if (callPetButton) {
        triggerPetInteractionAction('wave');
        return;
      }
      const foodButton = event.target.closest('[data-pet-food]');
      if (foodButton) {
        if (ignoreNextPetFoodClick) {
          ignoreNextPetFoodClick = false;
          return;
        }
        setSelectedPetFood(foodButton.dataset.petFood);
        return;
      }
      const furnitureButton = event.target.closest('[data-furniture-item]');
      if (furnitureButton) {
        startFurniturePlacement(furnitureButton.dataset.furnitureItem);
        return;
      }
      const furnitureCancelButton = event.target.closest('[data-furniture-cancel]');
      if (furnitureCancelButton) {
        setFurniturePlacementMode('');
        return;
      }
      const builderCell = event.target.closest('[data-builder-cell]');
      if (builderCell) {
        await placeFurnitureAtCell(builderCell.dataset.builderRow, builderCell.dataset.builderCol);
        return;
      }
      const removeFurnitureButton = event.target.closest('[data-remove-furniture]');
      if (removeFurnitureButton) {
        await removePetFurniture(removeFurnitureButton.dataset.removeFurniture);
        return;
      }
      const removeRoomDecorationButton = event.target.closest('[data-remove-room-decoration]');
      if (removeRoomDecorationButton) {
        await removeRoomDecorationById(removeRoomDecorationButton.dataset.removeRoomDecoration);
        return;
      }
      const guestPet = event.target.closest('.pet-interaction-guest');
      if (guestPet) {
        if (selectedPetFoodId) feedPetInteraction(selectedPetFoodId, guestPet);
        return;
      }
      const interactionPet = event.target.closest('#pet-interaction-pet');
      if (interactionPet) {
        if (selectedPetFoodId) {
          feedPetInteraction(selectedPetFoodId, interactionPet);
          return;
        }
        const profile = getCurrentPetInteractionProfile();
        petInteractionTapCount += 1;
        const tapAction = profile.canExplode && petInteractionTapCount >= 4 ? 'explode' : 'wave';
        triggerPetInteractionAction(tapAction);
        if (tapAction === 'explode') petInteractionTapCount = 0;
        return;
      }
      const evolutionVideoPlayButton = event.target.closest('#evolution-video-play');
      if (evolutionVideoPlayButton) {
        replayEvolutionCinematicFromButton();
        return;
      }
      if (event.target.closest('[data-avatar-crop-cancel]') || event.target === $('#avatar-crop-overlay')) {
        closeAvatarCropModal();
        return;
      }
      if (event.target.closest('[data-new-player-guide-close]') || event.target.closest('[data-new-player-guide-skip]')) {
        await closeNewPlayerGuide();
        return;
      }
      const newPlayerGuideNextButton = event.target.closest('[data-new-player-guide-next]');
      if (newPlayerGuideNextButton) {
        await nextNewPlayerGuideStep();
        return;
      }
      const avatarCropSaveButton = event.target.closest('[data-avatar-crop-save]');
      if (avatarCropSaveButton) {
        await withButtonLoading(avatarCropSaveButton, () => saveStudentAvatarFromCrop(), '保存中');
        return;
      }
      const registrationSuccessContinueButton = event.target.closest('[data-registration-success-continue]');
      if (registrationSuccessContinueButton) {
        await withButtonLoading(registrationSuccessContinueButton, () => continueRegistrationSuccessLogin(), '进入中');
        return;
      }
      const modalCloseButton = event.target.closest('[data-modal-close]');
      if (modalCloseButton) {
      const target = modalCloseButton.dataset.modalClose;
      if (target === 'pet-selection') closePetSelectionModal();
      if (target === 'level-up') closeLevelUpOverlay();
      if (target === 'evolution') closeEvolutionOverlay();
      if (target === 'evolution-choice') closeEvolutionChoiceModal();
      if (target === 'friend-gift') closeGiftModal();
      if (target === 'gift-claim') closeGiftClaimModal();
      return;
    }
    const evolutionChoiceOverlay = $('#evolution-choice-overlay');
    if (event.target === evolutionChoiceOverlay) {
      closeEvolutionChoiceModal();
      return;
    }
    const imageViewerOverlay = $('#image-viewer-overlay');
    if (event.target.closest('[data-image-viewer-close]') || event.target === imageViewerOverlay) {
      closeImageViewer();
      return;
    }
    const imageViewerShareButton = event.target.closest('[data-image-viewer-share]');
    if (imageViewerShareButton) {
      await withButtonLoading(imageViewerShareButton, () => shareActiveImageViewerImage(), '准备中');
      return;
    }
    const friendsRefreshButton = event.target.closest('[data-friends-refresh]');
    if (friendsRefreshButton) {
      await withButtonLoading(friendsRefreshButton, () => loadFriendsDashboard(true), '刷新中');
      return;
    }
    const friendRequestButton = event.target.closest('[data-friend-request-send]');
    if (friendRequestButton) {
      await withButtonLoading(friendRequestButton, () => sendFriendRequestFromButton(friendRequestButton), '发送中');
      return;
    }
    const friendResponseButton = event.target.closest('[data-friend-request-response]');
    if (friendResponseButton) {
      await withButtonLoading(friendResponseButton, () => respondToFriendRequest(friendResponseButton), '处理中');
      return;
    }
    const friendProfileButton = event.target.closest('[data-friend-profile]');
    if (friendProfileButton) {
      await withButtonLoading(friendProfileButton, () => openFriendProfile(friendProfileButton.dataset.friendProfile), '读取中');
      return;
    }
    const friendPreviewPetButton = event.target.closest('[data-friend-preview-pet]');
    if (friendPreviewPetButton) {
      friendState.friendPreviewPetId = friendPreviewPetButton.dataset.friendPreviewPet || '';
      renderFriendsView();
      return;
    }
    const friendGiftButton = event.target.closest('[data-friend-gift]');
    if (friendGiftButton) {
      openGiftModal(friendGiftButton.dataset.friendGift);
      return;
    }
    const friendRoomButton = event.target.closest('[data-friend-room]');
    if (friendRoomButton) {
      await withButtonLoading(friendRoomButton, () => joinFriendInteractionRoom(friendRoomButton.dataset.friendRoom), '进入中');
      return;
    }
    const giftTypeButton = event.target.closest('[data-gift-type]');
    if (giftTypeButton) {
      friendState.activeGiftType = giftTypeButton.dataset.giftType || 'coins';
      renderGiftModal();
      return;
    }
    const giftAmountButton = event.target.closest('[data-gift-amount]');
    if (giftAmountButton) {
      friendState.giftAmount = Number(giftAmountButton.dataset.giftAmount || FRIEND_GIFT_AMOUNTS[1]);
      renderGiftModal();
      return;
    }
    const giftItemButton = event.target.closest('[data-gift-item]');
    if (giftItemButton) {
      friendState.giftItemId = giftItemButton.dataset.giftItem || '';
      friendState.giftItemPetId = giftItemButton.dataset.giftPet || '';
      renderGiftModal();
      return;
    }
    const giftPetButton = event.target.closest('[data-gift-pet-owned]');
    if (giftPetButton) {
      friendState.giftPetId = giftPetButton.dataset.giftPetOwned || '';
      renderGiftModal();
      return;
    }
    const giftSendButton = event.target.closest('[data-friend-gift-send]');
    if (giftSendButton) {
      await withButtonLoading(giftSendButton, () => sendCoinGiftFromModal(), '赠送中');
      return;
    }
    const giftClaimButton = event.target.closest('[data-gift-claim]');
    if (giftClaimButton) {
      await withButtonLoading(giftClaimButton, () => claimGiftFromButton(giftClaimButton), '领取中');
      return;
    }
    const giftRevealButton = event.target.closest('[data-gift-reveal-open]');
    if (giftRevealButton) {
      await withButtonLoading(giftRevealButton, () => openGiftReveal(), '开启中');
      return;
    }
    const duplicateCoinButton = event.target.closest('[data-blind-duplicate-coins]');
    if (duplicateCoinButton) {
      await withButtonLoading(duplicateCoinButton, () => resolveBlindBoxDuplicateAsCoins(duplicateCoinButton), '兑换中');
      return;
    }
    const duplicateSendButton = event.target.closest('[data-blind-duplicate-send]');
    if (duplicateSendButton) {
      await withButtonLoading(duplicateSendButton, () => sendBlindBoxDuplicateToFriend(duplicateSendButton), '送出中');
      return;
    }
    const collectionTitleChoiceButton = event.target.closest('[data-collection-title-choice]');
    if (collectionTitleChoiceButton) {
      await withButtonLoading(collectionTitleChoiceButton, () => chooseCollectionTitle(collectionTitleChoiceButton.dataset.collectionTitleChoice), '保存中');
      return;
    }
    const notificationReadButton = event.target.closest('[data-notification-read]');
    if (notificationReadButton) {
      await withButtonLoading(notificationReadButton, () => markNotificationReadFromButton(notificationReadButton), '处理中');
      return;
    }
    const notificationClearButton = event.target.closest('[data-notification-clear]');
    if (notificationClearButton) {
      await withButtonLoading(notificationClearButton, () => clearReadNotificationsFromButton(), '清理中');
      return;
    }
    const roomRefreshButton = event.target.closest('[data-room-refresh]');
    if (roomRefreshButton) {
      await withButtonLoading(roomRefreshButton, () => loadSharedRoom(friendState.roomOwnerStudentId || getStudent()?.studentId), '刷新中');
      return;
    }
    const roomCloseButton = event.target.closest('[data-room-close]');
    if (roomCloseButton) {
      await withButtonLoading(roomCloseButton, () => toggleCurrentRoomClosed(roomCloseButton), '保存中');
      return;
    }
    const roomResetButton = event.target.closest('[data-room-reset]');
    if (roomResetButton) {
      await withButtonLoading(roomResetButton, () => resetCurrentRoom(roomResetButton), '重置中');
      return;
    }
    const roomMemberRemoveButton = event.target.closest('[data-room-member-remove]');
    if (roomMemberRemoveButton) {
      await withButtonLoading(roomMemberRemoveButton, () => removeCurrentRoomMember(roomMemberRemoveButton), '移除中');
      return;
    }
    const roomRequestResponseButton = event.target.closest('[data-room-request-response]');
    if (roomRequestResponseButton) {
      const label = roomRequestResponseButton.dataset.roomRequestResponse === 'accept' ? '批准中' : '拒绝中';
      await withButtonLoading(roomRequestResponseButton, () => respondRoomJoinRequest(roomRequestResponseButton), label);
      return;
    }
    const petInteractionShareButton = event.target.closest('[data-pet-interaction-share]');
    if (petInteractionShareButton) {
      await withButtonLoading(petInteractionShareButton, () => sharePetInteractionImage(), '准备中');
      return;
    }
    const kuromiEmojiButton = event.target.closest('[data-kuromi-room-emoji]');
    if (kuromiEmojiButton) {
      event.preventDefault();
      await sendKuromiRoomMessageText(kuromiEmojiButton.dataset.kuromiRoomEmoji || '', { closeEmoji: true });
      return;
    }
    const kuromiEmojiToggleButton = event.target.closest('[data-kuromi-emoji-toggle]');
    if (kuromiEmojiToggleButton) {
      event.preventDefault();
      setKuromiRoomEmojiOpen(!interactionRoomState.emojiOpen);
      return;
    }
    const kuromiChatToggleButton = event.target.closest('[data-kuromi-chat-toggle]');
    if (kuromiChatToggleButton) {
      toggleKuromiRoomChatPanel();
      return;
    }
    const kuromiFullscreenButton = event.target.closest('[data-kuromi-fullscreen]');
    if (kuromiFullscreenButton) {
      await toggleKuromiRoomFullscreen();
      return;
    }
    const roomDecorationButton = event.target.closest('[data-room-decoration]');
    if (roomDecorationButton) {
      await withButtonLoading(roomDecorationButton, () => placeRoomDecorationById(roomDecorationButton.dataset.roomDecoration), '布置中');
      return;
    }
    const roleCardShareButton = event.target.closest('[data-role-card-share]');
    if (roleCardShareButton) {
      await withButtonLoading(roleCardShareButton, () => shareCurrentRoleCardImage(), '准备中');
      return;
    }
    const skillToggle = event.target.closest('[data-skill-toggle]');
    if (skillToggle) {
      const card = skillToggle.closest('[data-skill-card]');
      const shouldOpen = !card.classList.contains('open');
      $all('[data-skill-card]').forEach(item => {
        item.classList.remove('open');
        const toggle = item.querySelector('[data-skill-toggle]');
        const explanation = item.querySelector('[data-skill-explanation]');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        if (explanation) explanation.hidden = true;
      });
      if (shouldOpen) {
        card.classList.add('open');
        skillToggle.setAttribute('aria-expanded', 'true');
        card.querySelector('[data-skill-explanation]').hidden = false;
      }
      event.stopPropagation();
      return;
    }
    if (!event.target.closest('[data-skill-card]')) {
      $all('[data-skill-card]').forEach(item => {
        item.classList.remove('open');
        const toggle = item.querySelector('[data-skill-toggle]');
        const explanation = item.querySelector('[data-skill-explanation]');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        if (explanation) explanation.hidden = true;
      });
    }
    const equipmentSlot = event.target.closest('[data-equipment-slot]');
    if (equipmentSlot) {
      const student = getStudent();
      const slot = equipmentSlot.dataset.equipmentSlot;
      const item = student ? getEquippedItemForSlot(student, slot) : null;
      if (item) {
        showToast(localize('为了保护进化进度，已装备的物品不能卸下。'));
      } else {
        await runEquipmentAction(equipmentSlot, () => equipFirstOwnedItemForSlot(slot));
      }
      return;
    }
    const shopCard = event.target.closest('[data-shop-item-card]');
    if (shopCard && !event.target.closest('button')) shopCard.classList.toggle('revealed');
    const viewTarget = event.target.closest('[data-view-target]');
    if (viewTarget) {
      switchView(viewTarget.dataset.viewTarget);
      return;
    }
    const collectionToggle = event.target.closest('[data-pet-collection-toggle]');
    if (collectionToggle) {
      ownedPetCollectionOpen = collectionToggle.getAttribute('aria-expanded') !== 'true';
      renderPetCollection(getStudent());
      return;
    }
    const petSeriesButton = event.target.closest('[data-pet-series]');
    if (petSeriesButton) {
      selectedPetSeries = petSeriesButton.dataset.petSeries;
      renderPetShop(getStudent());
      return;
    }
    const subjectButton = event.target.closest('[data-subject]');
    if (subjectButton) {
      startQuiz(subjectButton.dataset.subject);
      return;
    }
    const buyButton = event.target.closest('[data-buy-item]');
    if (buyButton) {
      buyAndEquipItem.triggerButton = buyButton;
      try {
        await runEquipmentAction(buyButton, () => buyAndEquipItem(buyButton.dataset.buyItem));
      } finally {
        buyAndEquipItem.triggerButton = null;
      }
      return;
    }
    const blindBoxBuyButton = event.target.closest('[data-buy-blind-box]');
    if (blindBoxBuyButton) {
      buyBlindBox.triggerButton = blindBoxBuyButton;
      try {
        await withButtonLoading(blindBoxBuyButton, () => buyBlindBox(), '购买中');
      } finally {
        buyBlindBox.triggerButton = null;
      }
      return;
    }
    const blindBoxOpenButton = event.target.closest('[data-open-blind-box]');
    if (blindBoxOpenButton) {
      playUiSound('blindBox');
      await withButtonLoading(blindBoxOpenButton, () => openBlindBoxFromInventory(), '开启中');
      return;
    }
    const buyPetButton = event.target.closest('[data-buy-pet]');
    if (buyPetButton) {
      buyPet.triggerButton = buyPetButton;
      try {
        await buyPet(buyPetButton.dataset.buyPet);
      } finally {
        buyPet.triggerButton = null;
      }
      return;
    }
    const teacherRewardButton = event.target.closest('[data-teacher-reward]');
    if (teacherRewardButton) {
      await withButtonLoading(teacherRewardButton, () => rewardSelectedStudents(Number(teacherRewardButton.dataset.teacherReward)));
      return;
    }
    const equipButton = event.target.closest('[data-equip-item]');
    if (equipButton) {
      await runEquipmentAction(equipButton, () => equipItem(equipButton.dataset.equipItem));
      return;
    }
    const unequipButton = event.target.closest('[data-unequip-item]');
    if (unequipButton) {
      await runEquipmentAction(unequipButton, () => unequipItem(unequipButton.dataset.unequipItem));
      return;
    }
    const initialPetButton = event.target.closest('[data-initial-pet]');
    if (initialPetButton) {
      pendingInitialPet = initialPetButton.dataset.initialPet;
      $all('[data-initial-pet]').forEach(button => button.classList.toggle('selected', button === initialPetButton));
      updateInitialEvolutionStylePreview();
      updateAdoptionConfirmState();
      return;
    }
    const miniEvolveButton = event.target.closest('[data-mini-evolve-pet]');
    if (miniEvolveButton) {
      await withButtonLoading(miniEvolveButton, () => miniEvolvePet(miniEvolveButton), '小进化中');
      return;
    }
    const petEvolutionFormButton = event.target.closest('[data-pet-evolution-form]');
    if (petEvolutionFormButton) {
      await withButtonLoading(petEvolutionFormButton, () => selectPetEvolutionForm(petEvolutionFormButton.dataset.petEvolutionForm, petEvolutionFormButton), '切换中');
      return;
    }
    const evolveButton = event.target.closest('[data-evolve-pet]');
    if (evolveButton) {
      await withButtonLoading(evolveButton, () => openEvolutionChoiceModal(), '进化中');
      return;
    }
    const evolutionStyleButton = event.target.closest('[data-evolution-style]');
    if (evolutionStyleButton) {
      await withButtonLoading(evolutionStyleButton, () => evolvePet(evolutionStyleButton.dataset.evolutionStyle, evolutionStyleButton), '进化中');
      return;
    }
    const evolutionBeforeButton = event.target.closest('[data-evolution-before-preview]');
    if (evolutionBeforeButton) {
      openEvolutionBeforePreview();
      return;
    }
    const switchPetButton = event.target.closest('[data-switch-pet]');
    if (switchPetButton) {
      const student = getStudent();
      const nextPetType = switchPetButton.dataset.switchPet;
      const switched = student && await withButtonLoading(switchPetButton, () => switchActivePet(student, nextPetType));
      if (switched) {
        renderedCombatState = { studentId: null, stats: null, power: null };
        renderAppShell();
        switchView('home-view');
        if (petRecordNeedsNaming(student, nextPetType)) {
          openPetRenameModal(nextPetType);
          showToast('先帮这只朋友送来的宠物取名字吧。');
        } else {
          showToast(`${getPetFullDisplayName(student) || student.petName} 已成为当前学习伙伴。`);
        }
      }
      return;
    }
    const confirmInitialPetButton = event.target.closest('#confirm-initial-pet');
    if (confirmInitialPetButton) {
      await withButtonLoading(confirmInitialPetButton, () => chooseInitialPet());
      return;
    }
    const wallPresetButton = event.target.closest('[data-wall-post-preset]');
    if (wallPresetButton) {
      selectedWallPostPreset = wallPresetButton.dataset.wallPostPreset;
      renderMessageWall(getStudent());
      renderHomeWallShare(getStudent());
      return;
    }
    const wallLikeButton = event.target.closest('[data-wall-like]');
    if (wallLikeButton) {
      likeWallPost(wallLikeButton.dataset.wallLike);
      return;
    }
    const wallImageButton = event.target.closest('[data-wall-image-preview]');
    if (wallImageButton) {
      const post = messageWallPosts.find(item => item.postId === wallImageButton.dataset.wallImagePreview);
      if (post?.petImage) {
        const wallOwnerName = getWallPostTitle(post) || getPetInfo(post.petType)?.name || localize('学习伙伴');
        openImageViewer({
          title: wallOwnerName,
          meta: [getWallPostSpeciesName(post), post.petRarity, post.petLevel, Number(post.combatPower || 0) ? `⚔️ ${Number(post.combatPower || 0)}` : ''].filter(Boolean).join(' · '),
          images: [{ src: post.petImage, label: '查看角色大图', alt: wallOwnerName }]
        });
      }
      return;
    }
    const wallCommentButton = event.target.closest('[data-wall-comment]');
    if (wallCommentButton) {
      commentWallPost(wallCommentButton.dataset.wallComment, wallCommentButton.dataset.wallCommentText);
      return;
    }
    const wallShareButton = event.target.closest('#share-wall-post-button');
    if (wallShareButton) {
      createWallPost();
      return;
    }
    const submitAnswerButton = event.target.closest('#submit-answer');
    if (submitAnswerButton) {
      if (submitAnswerButton.dataset.quizAdvance === 'true') {
        const quiz = session.quiz;
        const isFinalQuestion = quiz && quiz.index >= quiz.questions.length - 1;
        if (isFinalQuestion) await withButtonLoading(submitAnswerButton, () => nextQuestion());
        else await nextQuestion();
      } else {
        submitAnswer();
      }
      return;
    }
  });

  // =========================================================
  // EDUVERSE EXPANDED FRONTEND GAMEPLAY & TEACHER ENGINE
  // =========================================================

  let audioCtx = null;
  let isAudioMuted = localStorage.getItem('eduverse_audio_muted') === 'true';

  function playAudioFx(fxType) {
    if (isAudioMuted) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (fxType === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (fxType === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (fxType === 'combo') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.22);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (fxType === 'victory') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.12);
        osc.frequency.setValueAtTime(783.99, now + 0.24);
        osc.frequency.setValueAtTime(1046.50, now + 0.38);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);
        osc.start(now);
        osc.stop(now + 0.85);
      }
    } catch (_e) {}
  }

  function toggleAudioMute() {
    isAudioMuted = !isAudioMuted;
    localStorage.setItem('eduverse_audio_muted', String(isAudioMuted));
    const btns = document.querySelectorAll('#sound-toggle-btn, #quest-sound-toggle-btn');
    btns.forEach(b => {
      b.textContent = isAudioMuted ? '🔇' : '🔊';
      b.title = isAudioMuted ? '音效已静音' : '音效已开启';
    });
    showToast(isAudioMuted ? '已静音音效' : '已开启音效');
  }

  // 12 Preset Teachers
  const PRESET_TEACHERS = [
    { teacherId: 'TCH01_JIE', name: '杰老师', avatar: '🧑‍🏫', role: 'teacher' },
    { teacherId: 'TCH02_RACHEL', name: 'Rachel老师', avatar: '👩‍🏫', role: 'teacher' },
    { teacherId: 'TCH03_HUANG', name: '黄老师', avatar: '🧑‍🏫', role: 'teacher' },
    { teacherId: 'TCH04_TIAN', name: '天老师', avatar: '👨‍🏫', role: 'teacher' },
    { teacherId: 'TCH05_EN', name: '恩老师', avatar: '👩‍🏫', role: 'teacher' },
    { teacherId: 'TCH06_DU', name: '杜老师', avatar: '🧑‍🏫', role: 'teacher' },
    { teacherId: 'TCH07_HUI', name: '橞老师', avatar: '👩‍🏫', role: 'teacher' },
    { teacherId: 'TCH08_YI', name: '宜老师', avatar: '👩‍🏫', role: 'teacher' },
    { teacherId: 'TCH09_QI', name: '淇老师', avatar: '👩‍🏫', role: 'teacher' },
    { teacherId: 'TCH10_YI2', name: '奕老师', avatar: '👨‍🏫', role: 'teacher' },
    { teacherId: 'TCH11_HU', name: '胡老师', avatar: '🧑‍🏫', role: 'teacher' },
    { teacherId: 'TCH12_WEN', name: '汶老师', avatar: '👩‍🏫', role: 'teacher' }
  ];

  let currentTeacher = null;
  let activeQuestSession = null;
  let challengeCountdownTimerId = null;

  // Active Subject Worlds Definition
  const EDUVERSE_SUBJECTS_CATALOG = [
    {
      subjectId: 'bc',
      nameZh: '华文',
      nameEn: 'Bahasa Cina',
      themeId: 'theme-bc',
      badgeIcon: '📜',
      badgeTitle: '卷轴毛笔 · 水墨东方',
      colorPrimary: '#d32f2f',
      colorSecondary: '#ffb300',
      description: '东方幻想书卷，墨韵生辉。领略古风与现代二次元的文字力量。',
      kssmBadges: ['🔥 高频考点', '⭐ 必会', '🧠 KBAT', '⚠️ 易错题']
    },
    {
      subjectId: 'bm',
      nameZh: '国文',
      nameEn: 'Bahasa Melayu',
      themeId: 'theme-bm',
      badgeIcon: '📖',
      badgeTitle: '语言勋章 · 热带冒险',
      colorPrimary: '#e65100',
      colorSecondary: '#2e7d32',
      description: '探索马来西亚热带文学秘境，掌握Tatabahasa与Komsas精髓。',
      kssmBadges: ['🔥 Tatabahasa', '⭐ Peribahasa', '🧠 KBAT', '📚 Komsas']
    },
    {
      subjectId: 'bi',
      nameZh: '英文',
      nameEn: 'English',
      themeId: 'theme-bi',
      badgeIcon: '🧙‍♂️',
      badgeTitle: '魔法书 · Fantasy Academy',
      colorPrimary: '#1565c0',
      colorSecondary: '#7b1fa2',
      description: 'Unlock the Magic Library! Expand vocabulary, master grammar, and conquer reading trials.',
      kssmBadges: ['🔥 Grammar Wizard', '⭐ Vocab Pro', '🧠 Critical Reading', '✍️ Essay Magic']
    },
    {
      subjectId: 'math',
      nameZh: '数学',
      nameEn: 'Matematik',
      themeId: 'theme-math',
      badgeIcon: '💠',
      badgeTitle: '几何水晶 · Cyber Grid',
      colorPrimary: '#00838f',
      colorSecondary: '#00e5ff',
      description: '穿梭霓虹数字矩阵，破解代数几何算法，成为赛博数理大师。',
      kssmBadges: ['🔥 代数解题', '⭐ 几何公式', '🧠 KBAT 逻辑', '⚠️ 易错陷阱']
    },
    {
      subjectId: 'science',
      nameZh: '科学',
      nameEn: 'Sains',
      themeId: 'theme-science',
      badgeIcon: '⚛️',
      badgeTitle: '原子核心 · Future Lab',
      colorPrimary: '#4527a0',
      colorSecondary: '#00b0ff',
      description: '踏入未来高能实验室，探索物质、生命细胞与能量转化的奥秘。',
      kssmBadges: ['🔥 实验探究', '⭐ 科学原理', '🧠 KBAT 假设', '🧬 生命物理']
    },
    {
      subjectId: 'sejarah',
      nameZh: '历史',
      nameEn: 'Sejarah',
      themeId: 'theme-sejarah',
      badgeIcon: '🛡️',
      badgeTitle: '古代战盾 · Ancient Empire',
      colorPrimary: '#8d6e63',
      colorSecondary: '#c62828',
      description: '展开古老帝国战图，重返马六甲王朝与早期文明传奇风云。',
      kssmBadges: ['🔥 重点年表', '⭐ 王朝体制', '🧠 历史启示', '📜 史料考证']
    },
    {
      subjectId: 'geografi',
      nameZh: '地理',
      nameEn: 'Geografi',
      themeId: 'theme-geografi',
      badgeIcon: '🧭',
      badgeTitle: '地球罗盘 · Earth Explorer',
      colorPrimary: '#2e7d32',
      colorSecondary: '#8d6e63',
      description: '手持罗盘跋涉山川河海，观察板块运动、气候变迁与全球经纬。',
      kssmBadges: ['🔥 读图技能', '⭐ 地形气候', '🧠 环境永续', '🗺️ 经纬等高线']
    },
    {
      subjectId: 'moral',
      nameZh: '道德',
      nameEn: 'Pendidikan Moral',
      themeId: 'theme-moral',
      badgeIcon: '✨',
      badgeTitle: '守护之星 · Guardian Light',
      colorPrimary: '#ad1457',
      colorSecondary: '#ffd54f',
      description: '凝聚正义与友爱之光，培养崇高品格、公民意识与关怀社会的价值观。',
      kssmBadges: ['🔥 核心价值', '⭐ 伦理情境', '🧠 道德思辨', '🤝 社区互助']
    }
  ];

  function renderTeacherQuickGrid() {
    const grid = document.getElementById('teacher-quick-select-grid');
    if (!grid) return;
    grid.innerHTML = PRESET_TEACHERS.map(t => `
      <button type="button" class="teacher-quick-btn" data-teacher-id="${t.teacherId}">
        <span class="teacher-btn-avatar">${t.avatar}</span>
        <span class="teacher-btn-name">${t.name}</span>
      </button>
    `).join('');
  }

  function selectTeacher(teacherId) {
    const teacher = PRESET_TEACHERS.find(t => t.teacherId === teacherId);
    if (!teacher) return;

    document.querySelectorAll('.teacher-quick-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.teacherId === teacherId);
    });

    const nameEl = document.getElementById('selected-teacher-name');
    const avatarEl = document.getElementById('selected-teacher-avatar');
    const idEl = document.getElementById('selected-teacher-id');
    const inputHidden = document.getElementById('teacher-selected-id-input');
    const submitBtn = document.getElementById('teacher-login-submit-btn');

    if (nameEl) nameEl.textContent = teacher.name;
    if (avatarEl) avatarEl.textContent = teacher.avatar;
    if (idEl) idEl.textContent = `ID: ${teacher.teacherId}`;
    if (inputHidden) inputHidden.value = teacher.teacherId;
    if (submitBtn) submitBtn.disabled = false;

    const pwdInput = document.getElementById('teacher-password-input');
    if (pwdInput) {
      pwdInput.focus();
    }
  }

  async function handleTeacherLogin(e) {
    e.preventDefault();
    const teacherId = document.getElementById('teacher-selected-id-input')?.value;
    const password = document.getElementById('teacher-password-input')?.value;
    const errorEl = document.getElementById('login-error');

    if (!teacherId) {
      if (errorEl) errorEl.textContent = '请先点击上方快捷选择一位老师。';
      return;
    }

    try {
      const res = await backendClient.teacherLogin({ teacherId, password });
      if (!res.ok) {
        if (errorEl) errorEl.textContent = res.error || '密码错误，请输入正确的教师密码。';
        return;
      }

      currentTeacher = res.teacher;
      localStorage.setItem('eduverse_teacher_session', JSON.stringify(currentTeacher));
      showToast(`欢迎 ${currentTeacher.name} 登录教师教学管理控制台！`);
      openTeacherScreen();
    } catch (err) {
      if (errorEl) errorEl.textContent = '登录发生异常，请稍后重试。';
    }
  }

  function openTeacherScreen() {
    document.getElementById('login-screen')?.classList.add('hidden');
    document.getElementById('app-screen')?.classList.add('hidden');
    const teacherScreen = document.getElementById('teacher-screen');
    if (teacherScreen) {
      teacherScreen.classList.remove('hidden');
      const statusLabel = document.getElementById('teacher-current-status-label');
      if (statusLabel && currentTeacher) {
        statusLabel.textContent = `教师：${currentTeacher.name} (${currentTeacher.teacherId})`;
      }
      renderTeacherDashboard();
      window.location.hash = '#/teacher/dashboard';
    }
  }

  function renderTeacherDashboard() {
    renderTeacherSubjectBars();
    renderTeacherStudentsTable();
    renderTeacherQuestionsTable();
    renderTeacherClassesTable();
    renderGoogleSheetSyncStatus();
    renderSupabaseConfigPanel();
  }

  function renderSupabaseConfigPanel() {
    const urlInput = document.getElementById('supabase-url-input');
    const keyInput = document.getElementById('supabase-key-input');
    const msgEl = document.getElementById('supabase-status-message');
    const btn = document.getElementById('test-supabase-btn');
    if (!urlInput || !keyInput || !msgEl) return;

    if (!urlInput.value) {
      urlInput.value = APP_CONFIG.supabaseFunctionUrl.includes('YOUR_SUPABASE_PROJECT_REF') ? '' : APP_CONFIG.supabaseFunctionUrl;
    }
    if (!keyInput.value) {
      keyInput.value = APP_CONFIG.supabaseAnonKey.includes('YOUR_PUBLIC_FUNCTION_KEY') ? '' : APP_CONFIG.supabaseAnonKey;
    }

    const isConnected = APP_CONFIG.supabaseFunctionUrl && !APP_CONFIG.supabaseFunctionUrl.includes('YOUR_SUPABASE_PROJECT_REF') && APP_CONFIG.supabaseAnonKey && !APP_CONFIG.supabaseAnonKey.includes('YOUR_PUBLIC_FUNCTION_KEY');
    if (isConnected) {
      msgEl.style.color = '#15803d';
      msgEl.style.background = '#f0fdf4';
      msgEl.style.borderColor = '#bbf7d0';
      msgEl.innerHTML = '🟢 <strong>已连接 Supabase 云端数据库</strong> · 当前系统处于实时云端同步模式。';
    }

    if (btn && !btn._supabaseConfigBound) {
      btn._supabaseConfigBound = true;
      btn.addEventListener('click', async () => {
        const inputUrl = (urlInput.value || '').trim();
        const inputKey = (keyInput.value || '').trim();
        if (!inputUrl || !inputKey) {
          msgEl.style.color = '#b91c1c';
          msgEl.style.background = '#fef2f2';
          msgEl.style.borderColor = '#fecaca';
          msgEl.innerHTML = '⚠️ 请先输入完整的 Supabase Function URL 与 Anon Key。';
          return;
        }

        btn.disabled = true;
        btn.textContent = '⏳ 正在测试连接...';
        msgEl.innerHTML = '⏳ 正在发起 Supabase 云端握手测试...';

        try {
          APP_CONFIG.supabaseFunctionUrl = inputUrl;
          APP_CONFIG.supabaseAnonKey = inputKey;
          try {
            localStorage.setItem('fo_supabase_url', inputUrl);
            localStorage.setItem('fo_supabase_anon_key', inputKey);
          } catch {}

          const testRes = await backend.requestSupabase('warmup', {});
          btn.disabled = false;
          btn.textContent = '⚡ 测试连接并保存';
          if (testRes && (testRes.ok || testRes.source || testRes.serverTime)) {
            msgEl.style.color = '#15803d';
            msgEl.style.background = '#f0fdf4';
            msgEl.style.borderColor = '#bbf7d0';
            msgEl.innerHTML = '🎉 <strong>Supabase 云端握手成功！</strong>已为您成功保存并立即生效实时云端存储。';
            showToast('Supabase 云端数据库连接成功！');
          } else {
            msgEl.style.color = '#b91c1c';
            msgEl.style.background = '#fef2f2';
            msgEl.style.borderColor = '#fecaca';
            msgEl.innerHTML = `⚠️ 连接返回异常：${testRes?.error || '请检查 Function URL 是否正确部署并开启 CORS。'}`;
          }
        } catch (err) {
          btn.disabled = false;
          btn.textContent = '⚡ 测试连接并保存';
          msgEl.style.color = '#b91c1c';
          msgEl.style.background = '#fef2f2';
          msgEl.style.borderColor = '#fecaca';
          msgEl.innerHTML = `⚠️ 连接失败：${err.message || '网络请求错误，请核对 Supabase URL 与 Anon Key。'}`;
        }
      });
    }
  }

  function renderTeacherSubjectBars() {
    const container = document.getElementById('teacher-subject-bars');
    if (!container) return;

    const stats = [
      { name: '华文 (BC)', acc: 78, color: '#d32f2f' },
      { name: '国文 (BM)', acc: 72, color: '#e65100' },
      { name: '英文 (BI)', acc: 81, color: '#1565c0' },
      { name: '数学 (Math)', acc: 65, color: '#00838f' },
      { name: '科学 (Science)', acc: 74, color: '#4527a0' },
      { name: '历史 (Sejarah)', acc: 69, color: '#8d6e63' },
      { name: '地理 (Geografi)', acc: 76, color: '#2e7d32' },
      { name: '道德 (Moral)', acc: 85, color: '#ad1457' }
    ];

    container.innerHTML = stats.map(s => `
      <div style="margin-bottom: 12px;">
        <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700; margin-bottom:4px;">
          <span>${s.name}</span>
          <span style="color:${s.color}">${s.acc}% 正确率</span>
        </div>
        <div style="height:10px; background:#f1f5f9; border-radius:999px; overflow:hidden;">
          <div style="width:${s.acc}%; height:100%; background:${s.color}; border-radius:999px; transition: width 0.6s ease;"></div>
        </div>
      </div>
    `).join('');
  }

  async function renderTeacherStudentsTable() {
    const tbody = document.getElementById('teacher-students-tbody');
    if (!tbody) return;
    const mockStudents = [
      { studentId: '511001', name: '林子轩', form: 'Form 2', phone: '012-3456789', level: 14, exp: 3850, streak: 15, status: 'active' },
      { studentId: '511002', name: '陈思琪', form: 'Form 3', phone: '019-8765432', level: 13, exp: 3620, streak: 12, status: 'active' },
      { studentId: '511003', name: '张凯文', form: 'Form 1', phone: '016-1122334', level: 12, exp: 3410, streak: 10, status: 'active' },
      { studentId: '511004', name: '李美华', form: 'Form 2', phone: '017-9988776', level: 11, exp: 3100, streak: 8, status: 'active' },
      { studentId: '511005', name: '黄俊杰', form: 'Form 3', phone: '011-2345678', level: 10, exp: 2950, streak: 7, status: 'active' }
    ];

    tbody.innerHTML = mockStudents.map(s => `
      <tr>
        <td><strong>${s.studentId}</strong></td>
        <td>${s.name}</td>
        <td><span class="kssm-chip">${s.form}</span></td>
        <td><span style="color:#0284c7; font-family:monospace;">${s.phone}</span></td>
        <td>Lv.${s.level}</td>
        <td>${s.exp}</td>
        <td>🔥 ${s.streak}天</td>
        <td><span style="color:#10b981; font-weight:700;">正常</span></td>
        <td>
          <button type="button" class="secondary-button compact-button" onclick="window.__eduverseApp.editStudent('${s.studentId}')">编辑</button>
        </td>
      </tr>
    `).join('');
  }

  async function renderTeacherQuestionsTable() {
    const tbody = document.getElementById('teacher-questions-tbody');
    if (!tbody) return;
    const res = await backendClient.listQuestions();
    const questions = res.questions || [];

    tbody.innerHTML = questions.map(q => `
      <tr>
        <td><small style="font-family:monospace;">${q.questionId}</small></td>
        <td><strong>${q.subjectId.toUpperCase()}</strong></td>
        <td>${q.form}</td>
        <td style="max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(q.questionText)}">${escapeHtml(q.questionText)}</td>
        <td><span style="color:#10b981; font-weight:700;">${escapeHtml(q.correctAnswer)}</span></td>
        <td><span class="kssm-chip kssm-chip-glow">${q.kssmFocus || '⭐ 必会'}</span></td>
        <td>${q.difficulty}</td>
        <td><span style="color:#10b981; font-weight:700;">已发布</span></td>
        <td>
          <button type="button" class="secondary-button compact-button" onclick="window.__eduverseApp.editQuestion('${q.questionId}')">编辑</button>
        </td>
      </tr>
    `).join('');
  }

  function renderTeacherClassesTable() {
    const tbody = document.getElementById('teacher-classes-tbody');
    if (!tbody) return;
    const mockClasses = [
      { classId: 'cls-f1-a', name: 'Form 1 卓越班 (1A)', form: 'Form 1', teacherName: '杰老师', count: 32 },
      { classId: 'cls-f2-a', name: 'Form 2 精英班 (2A)', form: 'Form 2', teacherName: 'Rachel老师', count: 35 },
      { classId: 'cls-f3-a', name: 'Form 3 冲刺班 (3A)', form: 'Form 3', teacherName: '黄老师', count: 28 }
    ];
    tbody.innerHTML = mockClasses.map(c => `
      <tr>
        <td><strong>${c.classId}</strong></td>
        <td>${c.name}</td>
        <td><span class="kssm-chip">${c.form}</span></td>
        <td>${c.teacherName}</td>
        <td>${c.count} 人</td>
        <td><span style="color:#10b981; font-weight:700;">启用</span></td>
        <td><button type="button" class="secondary-button compact-button">管理班级</button></td>
      </tr>
    `).join('');
  }

  async function renderGoogleSheetSyncStatus() {
    try {
      const res = await backendClient.getGoogleSheetSyncStatus();
      if (res && res.ok) {
        const timeEl = document.getElementById('sync-last-time-label');
        if (timeEl && res.lastSyncedAt) {
          timeEl.textContent = `上次同步时间：${new Date(res.lastSyncedAt).toLocaleTimeString()}`;
        }
        const tbody = document.getElementById('sync-logs-tbody');
        if (tbody && res.logs) {
          tbody.innerHTML = res.logs.map(log => `
            <tr>
              <td><small style="font-family:monospace;">${log.jobId}</small></td>
              <td>${log.triggeredBy || '系统'}</td>
              <td><span style="color:#10b981; font-weight:700;">Synced (成功)</span></td>
              <td>${log.rowsSynced || 120} 行</td>
              <td>${new Date(log.finishedAt).toLocaleTimeString()}</td>
            </tr>
          `).join('');
        }
      }
    } catch (_e) {}
  }

  async function triggerGoogleSheetSync() {
    const btn = document.getElementById('trigger-sheet-sync-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ 正在非阻塞同步 Google Sheet...';
    }
    try {
      const res = await backendClient.syncGoogleSheetsData({ teacherId: currentTeacher?.teacherId || 'TCH01_JIE' });
      if (res.ok) {
        showToast('Google Sheet 5 个工作表同步成功！');
        renderGoogleSheetSyncStatus();
      }
    } catch (err) {
      showToast('Google Sheet 同步未就绪，数据库正常运行中。');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = '🔄 立即同步 (SYNC NOW)';
      }
    }
  }

  // Student Phone Auth & Registration
  async function handleStudentPhoneLogin(e) {
    e.preventDefault();
    const phoneInput = document.getElementById('student-phone-input');
    const pinInput = document.getElementById('student-pin-input');
    const errorEl = document.getElementById('login-error');

    const phone = phoneInput?.value.trim();
    const pin = pinInput?.value.trim();

    if (!phone || !pin) {
      if (errorEl) errorEl.textContent = '请输入手机号码与 PIN 码。';
      return;
    }

    try {
      const res = await backendClient.loginStudentPhone({ phone, pin });
      if (!res.ok) {
        if (errorEl) errorEl.textContent = res.error || '登录失败，请检查手机号或 PIN 码。';
        return;
      }

      loginSuccess(res.student);
    } catch (err) {
      if (errorEl) errorEl.textContent = '登录发生异常，请稍后重试。';
    }
  }

  async function handleStudentRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-student-name')?.value.trim();
    const phone = document.getElementById('reg-student-phone')?.value.trim();
    const form = document.getElementById('reg-student-form')?.value;
    const pin = document.getElementById('reg-student-pin')?.value.trim();
    const errorEl = document.getElementById('login-error');

    if (!name || !phone || !pin) {
      if (errorEl) errorEl.textContent = '请填写完整的注册信息。';
      return;
    }

    try {
      const res = await backendClient.registerStudentPhone({ name, phone, form, pin });
      if (!res.ok) {
        if (errorEl) errorEl.textContent = res.error || '注册失败，请检查手机号是否已被占用。';
        return;
      }

      showToast(`恭喜 ${name} 注册成功！开启 EduVerse 学科冒险！`);
      loginSuccess(res.student);
    } catch (err) {
      if (errorEl) errorEl.textContent = '注册发生异常，请稍后重试。';
    }
  }

  function loginSuccess(student) {
    if (!student) return;
    const rawId = String(student.studentId || student.phone || '511001').trim();
    const studentId = HolidayBackendClient.normalizeId(rawId) || '511001';

    const normalizedStudent = {
      ...createStudentProfile(studentId),
      ...student,
      studentId,
      studentName: student.studentName || student.name || '5+1 学员',
      name: student.studentName || student.name || '5+1 学员',
      form: student.form || 'Form 2',
      className: student.form || 'Form 2',
      avatar: student.avatar || '🌟',
      petType: student.petType || 'pikachu',
      petName: student.petName || '皮卡丘',
      coins: Number(student.coins) || 120,
      experience: Number(student.experience) || 120
    };

    database[studentId] = normalizedStudent;
    saveDatabase();

    session = {
      studentId,
      activeView: DEFAULT_APP_VIEW,
      quiz: null,
      demoFree: Boolean(student.demoMode),
      teacherMode: false,
      currentStudent: normalizedStudent
    };
    saveLoginSession(studentId);
    localStorage.setItem('eduverse_student_session', JSON.stringify(normalizedStudent));

    renderedCombatState = { studentId: null, stats: null, power: null };
    const errorEl = document.getElementById('login-error');
    if (errorEl) errorEl.textContent = '';

    document.getElementById('login-screen')?.classList.add('hidden');
    document.getElementById('teacher-screen')?.classList.add('hidden');
    document.getElementById('app-screen')?.classList.remove('hidden');
    setScreenMode('app');

    showToast(`欢迎回来，${normalizedStudent.studentName}！`);
    renderAppShell();
    switchView(DEFAULT_APP_VIEW);
    window.location.hash = '#/dashboard';
  }

  // Dashboard & Views Renderer
  function renderDashboardView() {
    const student = getStudent() || {};
    const nameEl = document.getElementById('hub-student-name');
    const avatarEl = document.getElementById('hub-avatar-icon');
    const formTag = document.getElementById('hub-form-tag');
    const expRatio = document.getElementById('hub-exp-ratio');
    const expBar = document.getElementById('hub-exp-bar');
    const coinEl = document.getElementById('hub-coin-count');
    const starEl = document.getElementById('hub-star-count');
    const streakEl = document.getElementById('hub-streak-count');
    const levelBadge = document.getElementById('hub-level-badge');

    if (nameEl) nameEl.textContent = student.studentName || '探索者';
    if (avatarEl) avatarEl.textContent = student.avatar || '🌟';
    if (formTag) formTag.textContent = student.form || 'Form 2';
    if (coinEl) coinEl.textContent = student.coins || 80;
    if (starEl) starEl.textContent = student.totalStars || 15;
    if (streakEl) streakEl.textContent = student.streak || 3;
    if (levelBadge) levelBadge.textContent = `Lv.${student.petLevel || 1}`;

    const exp = Number(student.experience || 120);
    const maxExp = Math.max(300, (student.petLevel || 1) * 200);
    if (expRatio) expRatio.textContent = `${exp} / ${maxExp} EXP`;
    if (expBar) expBar.style.width = `${Math.min(100, Math.round((exp / maxExp) * 100))}%`;

    renderDailyChallengeCard();
    renderGloryPodium();
    renderDashboardSubjectCards();
  }

  async function renderDailyChallengeCard() {
    try {
      const res = await backendClient.getDailyChallenge({ form: getStudent()?.form || 'Form 2' });
      if (res && res.ok && res.challenge) {
        const c = res.challenge;
        const titleEl = document.getElementById('challenge-title-text');
        const descEl = document.getElementById('challenge-desc-text');
        const subPill = document.getElementById('challenge-subject-pill');
        if (titleEl) titleEl.textContent = c.title;
        if (descEl) descEl.textContent = c.description;
        if (subPill) subPill.textContent = c.subjectId.toUpperCase();

        startChallengeCountdown(c.endTime);
      }
    } catch (_err) {}
  }

  function startChallengeCountdown(endTimeStr) {
    if (challengeCountdownTimerId) clearInterval(challengeCountdownTimerId);
    const endMs = new Date(endTimeStr || (Date.now() + 1000 * 3600 * 8)).getTime();

    function update() {
      const remaining = Math.max(0, endMs - Date.now());
      const hours = String(Math.floor(remaining / 3600000)).padStart(2, '0');
      const mins = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, '0');
      const secs = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
      const timerEl = document.getElementById('challenge-countdown-timer');
      if (timerEl) timerEl.textContent = `${hours}:${mins}:${secs}`;
    }

    update();
    challengeCountdownTimerId = setInterval(update, 1000);
  }

  async function renderGloryPodium() {
    const container = document.getElementById('glory-podium-container');
    const wrap = document.getElementById('leaderboard-podium-wrap');
    try {
      const res = await backendClient.getGloryLeaderboard({ filter: 'all' });
      if (res && res.ok) {
        const top3 = res.top3 || [];
        const rank1 = top3[0] || { studentName: '林子轩', score: 3850, avatar: '🦁', form: 'Form 2' };
        const rank2 = top3[1] || { studentName: '陈思琪', score: 3620, avatar: '🦊', form: 'Form 3' };
        const rank3 = top3[2] || { studentName: '张凯文', score: 3410, avatar: '🐼', form: 'Form 1' };

        const html = `
          <!-- Rank 2 (Left) -->
          <div class="podium-card">
            <span class="podium-avatar">${rank2.avatar || '🦊'}</span>
            <span class="podium-rank-badge podium-rank-2">🥈 榜眼第 2 名</span>
            <strong class="podium-student-name">${rank2.studentName}</strong>
            <span class="podium-form-label">${rank2.form}</span>
            <span class="podium-score">${rank2.score} EXP</span>
          </div>

          <!-- Rank 1 (Center, Elevated) -->
          <div class="podium-card podium-first">
            <span class="podium-crown">👑</span>
            <span class="podium-avatar">${rank1.avatar || '🦁'}</span>
            <span class="podium-rank-badge podium-rank-1">🥇 状元第 1 名</span>
            <strong class="podium-student-name">${rank1.studentName}</strong>
            <span class="podium-form-label">${rank1.form}</span>
            <span class="podium-score">${rank1.score} EXP</span>
          </div>

          <!-- Rank 3 (Right) -->
          <div class="podium-card">
            <span class="podium-avatar">${rank3.avatar || '🐼'}</span>
            <span class="podium-rank-badge podium-rank-3">🥉 探花第 3 名</span>
            <strong class="podium-student-name">${rank3.studentName}</strong>
            <span class="podium-form-label">${rank3.form}</span>
            <span class="podium-score">${rank3.score} EXP</span>
          </div>
        `;

        if (container) container.innerHTML = html;
        if (wrap) wrap.innerHTML = html;

        // Also render full leaderboard rows
        const tbody = document.getElementById('leaderboard-tbody');
        if (tbody && res.rankings) {
          tbody.innerHTML = res.rankings.map(r => `
            <tr>
              <td><strong>#${r.rank}</strong></td>
              <td><span style="font-size:18px; margin-right:6px;">${r.avatar}</span> <strong>${r.studentName}</strong></td>
              <td><span class="kssm-chip">${r.form}</span></td>
              <td>Lv.${r.level}</td>
              <td>🔥 ${r.streak} 天</td>
              <td><span class="kssm-chip kssm-chip-glow">${r.badge || '👑 学霸之巅'}</span></td>
              <td><strong style="color:#6366f1;">${r.score} EXP</strong></td>
            </tr>
          `).join('');
        }
      }
    } catch (_err) {}
  }

  function renderDashboardSubjectCards() {
    const grid = document.getElementById('dashboard-subjects-grid');
    if (!grid) return;

    grid.innerHTML = EDUVERSE_SUBJECTS_CATALOG.map(sub => `
      <div class="subject-anime-card ${sub.themeId}" onclick="window.__eduverseApp.enterSubject('${sub.subjectId}')">
        <div class="subject-card-top">
          <div class="subject-titles">
            <h4>${sub.nameZh}</h4>
            <small>${sub.nameEn}</small>
          </div>
          <div class="subject-badge-wrap">
            <span>${sub.badgeIcon}</span>
          </div>
        </div>
        <p class="subject-card-desc">${sub.description}</p>
        <div class="subject-kssm-capsules">
          ${sub.kssmBadges.map(b => `<span class="kssm-chip">${b}</span>`).join('')}
        </div>
        <button type="button" class="subject-enter-btn">⚔️ 进入 ${sub.nameZh} 试炼殿堂</button>
      </div>
    `).join('');
  }

  async function renderSubjectsView(selectedSubId = 'math') {
    const tabs = document.getElementById('subject-selector-tabs');
    if (tabs) {
      tabs.innerHTML = EDUVERSE_SUBJECTS_CATALOG.map(s => `
        <button type="button" class="nav-button ${s.subjectId === selectedSubId ? 'active' : ''}" onclick="window.__eduverseApp.selectSubjectLobby('${s.subjectId}')">
          <span>${s.badgeIcon}</span> ${s.nameZh}
        </button>
      `).join('');
    }

    const sub = EDUVERSE_SUBJECTS_CATALOG.find(s => s.subjectId === selectedSubId) || EDUVERSE_SUBJECTS_CATALOG[0];
    const heroEl = document.getElementById('active-subject-hero');
    if (heroEl) {
      heroEl.innerHTML = `
        <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap;">
          <div class="badge-3d-wrapper badge-glowing" style="background:${sub.colorPrimary};">
            <span style="font-size:42px;">${sub.badgeIcon}</span>
          </div>
          <div>
            <div style="display:flex; gap:8px; align-items:center; margin-bottom:4px;">
              <h2 style="margin:0; font-size:24px; font-weight:900;">${sub.nameZh} · ${sub.nameEn}</h2>
              <span class="kssm-chip kssm-chip-glow">KSSM 标准课纲</span>
            </div>
            <p class="muted-text" style="margin:0 0 8px;">${sub.description}</p>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              ${sub.kssmBadges.map(b => `<span class="kssm-chip">${b}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    }

    const form = document.getElementById('lobby-form-select')?.value || getStudent()?.form || 'Form 2';
    const chaptersContainer = document.getElementById('chapters-dungeon-list');
    if (chaptersContainer) {
      const res = await backendClient.listChapters({ subjectId: selectedSubId, form });
      const chapters = (res && res.chapters && res.chapters.length) ? res.chapters : [
        { chapterId: `${selectedSubId}-f1-c1`, title: '第一单元：核心概念与基础精讲', description: '掌握核心知识点与基础题型。', kssmFocus: '🔥 高频考点', difficulty: 'Normal' },
        { chapterId: `${selectedSubId}-f1-c2`, title: '第二单元：进阶题型与综合拓展', description: '攻克高阶思维 KBAT 题型。', kssmFocus: '🧠 KBAT', difficulty: 'Hard' }
      ];

      chaptersContainer.innerHTML = chapters.map((chap, i) => `
        <div class="panel-card" style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; gap:8px; align-items:center; margin-bottom:6px;">
              <span class="question-index-badge">第 ${chap.chapterNumber || (i + 1)} 单元</span>
              <h4 style="margin:0; font-size:17px; font-weight:800;">${chap.title}</h4>
              <span class="kssm-chip kssm-chip-glow">${chap.kssmFocus || '⭐ 必会'}</span>
            </div>
            <p class="muted-text" style="margin:0;">${chap.description}</p>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:14px; font-weight:700; color:#eab308;">⭐⭐⭐</span>
            <button type="button" class="primary-button action-glow-button" onclick="window.__eduverseApp.startQuest('${chap.chapterId}', '${selectedSubId}')">⚔️ 开始试炼</button>
          </div>
        </div>
      `).join('');
    }
  }

  // Quest Gameplay Engine
  async function startQuest(chapterId, subjectId = 'math') {
    switchView('quest-view');
    window.location.hash = `#/quest/${chapterId}`;

    const sub = EDUVERSE_SUBJECTS_CATALOG.find(s => s.subjectId === subjectId) || EDUVERSE_SUBJECTS_CATALOG[3];
    const titleEl = document.getElementById('quest-subject-title');
    if (titleEl) titleEl.textContent = `${sub.nameZh} · ${chapterId}`;

    const res = await backendClient.listQuestions({ subjectId, chapterId });
    const rawQuestions = (res && res.questions && res.questions.length) ? res.questions : [
      {
        questionId: 'q-demo-01',
        questionText: 'Hitung nilai bagi: -12 + 4 × (-3) - (-8)',
        options: ['-16', '-20', '-4', '8'],
        correctAnswer: '-16',
        explanation: 'Ikut hukum BODMAS: 4 × (-3) = -12. Kemudian: -12 + (-12) - (-8) = -24 + 8 = -16.',
        kssmFocus: '🔥 代数解题',
        expReward: 40,
        coinReward: 12
      },
      {
        questionId: 'q-demo-02',
        questionText: 'Cari Faktor Sepunya Terbesar (FSTB / HCF) bagi 24, 36 dan 60.',
        options: ['12', '6', '18', '24'],
        correctAnswer: '12',
        explanation: 'Faktor bagi 24, 36, 60. FSTB = 12.',
        kssmFocus: '⭐ 几何公式',
        expReward: 35,
        coinReward: 10
      },
      {
        questionId: 'q-demo-03',
        questionText: 'Diberi jujukan nombor: 3, 7, 11, 15, ... Cari sebutan ke-10 (T10).',
        options: ['39', '36', '43', '40'],
        correctAnswer: '39',
        explanation: 'Pola ialah +4. Tn = 3 + 9(4) = 39.',
        kssmFocus: '🧠 KBAT 逻辑',
        expReward: 45,
        coinReward: 15
      }
    ];

    activeQuestSession = {
      subjectId,
      chapterId,
      questions: rawQuestions,
      currentIndex: 0,
      currentCombo: 0,
      maxCombo: 0,
      answers: [],
      mistakes: [],
      isRetryMode: false
    };

    document.getElementById('quest-question-panel')?.classList.remove('hidden');
    document.getElementById('quest-settlement-panel')?.classList.add('hidden');
    renderCurrentQuestQuestion();
  }

  function renderCurrentQuestQuestion() {
    if (!activeQuestSession) return;
    const q = activeQuestSession.questions[activeQuestSession.currentIndex];
    if (!q) {
      finishQuest();
      return;
    }

    const indexEl = document.getElementById('quest-question-index');
    const capsuleEl = document.getElementById('quest-kssm-capsule');
    const textEl = document.getElementById('quest-question-text');
    const gridEl = document.getElementById('quest-options-grid');
    const comboEl = document.getElementById('quest-combo-count');
    const progressFill = document.getElementById('quest-progress-fill');
    const feedbackBanner = document.getElementById('quest-feedback-banner');

    if (indexEl) indexEl.textContent = `第 ${activeQuestSession.currentIndex + 1} / ${activeQuestSession.questions.length} 题`;
    if (capsuleEl) capsuleEl.textContent = q.kssmFocus || '🔥 必考重点';
    if (textEl) textEl.textContent = q.questionText;
    if (comboEl) comboEl.textContent = activeQuestSession.currentCombo;
    if (feedbackBanner) feedbackBanner.classList.add('hidden');

    const progressPct = Math.round(((activeQuestSession.currentIndex) / activeQuestSession.questions.length) * 100);
    if (progressFill) progressFill.style.width = `${progressPct}%`;

    const prefixes = ['A', 'B', 'C', 'D'];
    if (gridEl) {
      gridEl.innerHTML = q.options.map((opt, i) => `
        <button type="button" class="quest-option-button" data-option-val="${escapeHtml(opt)}" onclick="window.__eduverseApp.chooseQuestOption('${escapeHtml(opt)}')">
          <span class="option-prefix-badge">${prefixes[i] || (i + 1)}</span>
          <span>${escapeHtml(opt)}</span>
        </button>
      `).join('');
    }
  }

  function chooseQuestOption(chosenOpt) {
    if (!activeQuestSession) return;
    const q = activeQuestSession.questions[activeQuestSession.currentIndex];
    const isCorrect = String(chosenOpt).trim() === String(q.correctAnswer).trim();

    const buttons = document.querySelectorAll('.quest-option-button');
    buttons.forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.optionVal === String(q.correctAnswer).trim()) {
        btn.classList.add('correct');
      } else if (btn.dataset.optionVal === chosenOpt && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    if (isCorrect) {
      activeQuestSession.currentCombo++;
      if (activeQuestSession.currentCombo > activeQuestSession.maxCombo) {
        activeQuestSession.maxCombo = activeQuestSession.currentCombo;
      }
      playAudioFx(activeQuestSession.currentCombo >= 3 ? 'combo' : 'correct');
    } else {
      activeQuestSession.currentCombo = 0;
      playAudioFx('wrong');
      activeQuestSession.mistakes.push({
        questionId: q.questionId,
        questionText: q.questionText,
        userAnswer: chosenOpt,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      });
    }

    activeQuestSession.answers.push({
      questionId: q.questionId,
      userAnswer: chosenOpt,
      isCorrect
    });

    const comboEl = document.getElementById('quest-combo-count');
    if (comboEl) comboEl.textContent = activeQuestSession.currentCombo;

    const feedbackBanner = document.getElementById('quest-feedback-banner');
    const feedbackMsg = document.getElementById('quest-feedback-message');
    if (feedbackBanner && feedbackMsg) {
      feedbackMsg.innerHTML = isCorrect
        ? `<strong style="color:#10b981; font-size:16px;">✨ 回答正确！+${q.expReward || 30} EXP ${activeQuestSession.currentCombo > 1 ? `(🔥 ${activeQuestSession.currentCombo} COMBO!)` : ''}</strong>`
        : `<strong style="color:#ef4444; font-size:16px;">❌ 回答错误！正确答案：${escapeHtml(q.correctAnswer)}</strong><p class="muted-text" style="margin:4px 0 0;">${escapeHtml(q.explanation || '')}</p>`;
      feedbackBanner.classList.remove('hidden');
    }
  }

  function nextQuestQuestion() {
    if (!activeQuestSession) return;
    activeQuestSession.currentIndex++;
    renderCurrentQuestQuestion();
  }

  async function finishQuest() {
    if (!activeQuestSession) return;
    document.getElementById('quest-question-panel')?.classList.add('hidden');
    document.getElementById('quest-settlement-panel')?.classList.remove('hidden');

    const total = activeQuestSession.questions.length;
    const correct = activeQuestSession.answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correct / Math.max(1, total)) * 100);
    const isPerfect = accuracy === 100;

    playAudioFx('victory');

    const res = await backendClient.submitQuestResult({
      studentId: session.activeStudentId || getStudent()?.studentId || 'CY1001',
      subjectId: activeQuestSession.subjectId,
      chapterId: activeQuestSession.chapterId,
      answers: activeQuestSession.answers,
      maxCombo: activeQuestSession.maxCombo,
      isRetry: activeQuestSession.isRetryMode
    });

    const settlement = res?.settlement || {
      baseExp: correct * 30,
      comboExp: Math.round(correct * 30 * 0.5),
      perfectExp: isPerfect ? 150 : 0,
      totalExp: correct * 30 + (isPerfect ? 150 : 0),
      coinsEarned: correct * 10
    };

    const accEl = document.getElementById('settlement-accuracy');
    const comboEl = document.getElementById('settlement-combo');
    const expEl = document.getElementById('settlement-total-exp');
    const coinEl = document.getElementById('settlement-coins');
    const baseExpEl = document.getElementById('breakdown-base-exp');
    const comboExpEl = document.getElementById('breakdown-combo-exp');
    const perfectExpEl = document.getElementById('breakdown-perfect-exp');
    const perfectRow = document.getElementById('breakdown-perfect-row');

    if (accEl) accEl.textContent = `${accuracy}%`;
    if (comboEl) comboEl.textContent = `${activeQuestSession.maxCombo} COMBO`;
    if (expEl) expEl.textContent = `+${settlement.totalExp} EXP`;
    if (coinEl) coinEl.textContent = `+${settlement.coinsEarned} Coins`;
    if (baseExpEl) baseExpEl.textContent = `+${settlement.baseExp} EXP`;
    if (comboExpEl) comboExpEl.textContent = `+${settlement.comboExp} EXP`;
    if (perfectExpEl) perfectExpEl.textContent = `+${settlement.perfectExp} EXP`;
    if (perfectRow) perfectRow.style.display = isPerfect ? 'flex' : 'none';

    // Mistakes review section
    const mistakesWrap = document.getElementById('settlement-mistakes-wrap');
    const mistakesList = document.getElementById('settlement-mistakes-list');
    const retryBtn = document.getElementById('settlement-retry-mistakes-btn');

    if (activeQuestSession.mistakes.length > 0) {
      if (mistakesWrap) mistakesWrap.classList.remove('hidden');
      if (retryBtn) retryBtn.classList.remove('hidden');
      if (mistakesList) {
        mistakesList.innerHTML = activeQuestSession.mistakes.map(m => `
          <div style="background:#ffffff; border:1px solid #fee2e2; border-radius:12px; padding:12px; margin-bottom:10px; text-align:left;">
            <p style="font-weight:700; color:#0f172a; margin:0 0 6px;">${escapeHtml(m.questionText)}</p>
            <p style="margin:0; font-size:13px; color:#ef4444;">你的答案：${escapeHtml(m.userAnswer)}</p>
            <p style="margin:2px 0 0; font-size:13px; color:#10b981; font-weight:700;">正确答案：${escapeHtml(m.correctAnswer)}</p>
            <p class="muted-text" style="margin:4px 0 0; font-size:12px;">解析：${escapeHtml(m.explanation || '')}</p>
          </div>
        `).join('');
      }
    } else {
      if (mistakesWrap) mistakesWrap.classList.add('hidden');
      if (retryBtn) retryBtn.classList.add('hidden');
    }
  }

  function retryWrongQuestions() {
    if (!activeQuestSession || !activeQuestSession.mistakes.length) return;
    const wrongQIds = new Set(activeQuestSession.mistakes.map(m => m.questionId));
    const retryQuestions = activeQuestSession.questions.filter(q => wrongQIds.has(q.questionId));

    activeQuestSession = {
      ...activeQuestSession,
      questions: retryQuestions,
      currentIndex: 0,
      currentCombo: 0,
      answers: [],
      mistakes: [],
      isRetryMode: true
    };

    document.getElementById('quest-question-panel')?.classList.remove('hidden');
    document.getElementById('quest-settlement-panel')?.classList.add('hidden');
    renderCurrentQuestQuestion();
  }

  async function renderAchievementsView() {
    const grid = document.getElementById('achievements-gallery-grid');
    if (!grid) return;
    try {
      const res = await backendClient.listAchievements(session.activeStudentId || 'CY1001');
      if (res && res.ok && res.achievements) {
        grid.innerHTML = res.achievements.map(ach => `
          <div class="panel-card" style="display:flex; gap:16px; align-items:center; ${ach.isUnlocked ? 'border-color:#fde047; background:linear-gradient(180deg,#fffbeb,#ffffff);' : 'opacity:0.65;'}">
            <div class="badge-3d-wrapper ${ach.isUnlocked ? 'badge-glowing' : ''}" style="width:68px; height:68px; border-radius:18px;">
              <span style="font-size:34px;">${ach.badgeIcon}</span>
            </div>
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <h4 style="margin:0; font-size:16px; font-weight:800;">${ach.title}</h4>
                <span class="kssm-chip ${ach.isUnlocked ? 'kssm-chip-glow' : ''}">${ach.rarity}</span>
              </div>
              <p class="muted-text" style="margin:0 0 6px; font-size:13px;">${ach.description}</p>
              <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700;">
                <span style="color:#6366f1;">奖励：+${ach.expReward} EXP</span>
                <span>${ach.isUnlocked ? `✅ 已解锁 (${ach.unlockedAt || '近日'})` : '🔒 未解锁'}</span>
              </div>
            </div>
          </div>
        `).join('');
      }
    } catch (_e) {}
  }

  // =========================================================
  // 1. EDUVERSE ARCADE MINI-GAMES CONTROLLER
  // =========================================================
  let activeArcadeType = 'reaction';
  let arcadeBestScores = {
    reaction: Number(localStorage.getItem('eduverse_score_reaction') || 0),
    flappy: Number(localStorage.getItem('eduverse_score_flappy') || 0),
    runner: Number(localStorage.getItem('eduverse_score_runner') || 0),
    jumpCharge: Number(localStorage.getItem('eduverse_score_jumpCharge') || 0)
  };

  function renderArcadeView() {
    ['reaction', 'flappy', 'runner', 'jumpCharge'].forEach(t => {
      const el = document.getElementById(`best-score-${t}`);
      if (el) el.textContent = arcadeBestScores[t] || 0;
    });
  }

  function launchArcadeGame(gameType) {
    activeArcadeType = gameType;

    const titles = {
      reaction: '⚡ 极速反应转盘 (Reaction Blitz)',
      flappy: '🐦 萌宠飞跃秘境 (Flappy Pet Quest)',
      runner: '🏃 无尽酷跑大冲刺 (Dash Runner)',
      jumpCharge: '🚀 聚力跳跃大师 (Jump Charge)'
    };
    const icons = { reaction: '⚡', flappy: '🐦', runner: '🏃', jumpCharge: '🚀' };

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

    arena?.scrollIntoView({ behavior: 'smooth' });

    // Launch existing mini game engine
    startMiniGame(gameType);
  }

  function finishArcadeGame(score) {
    const student = getStudent();
    const finalScore = Math.max(0, Math.floor(Number(score || 0)));
    const previousBest = arcadeBestScores[activeArcadeType] || 0;
    if (finalScore > previousBest) {
      arcadeBestScores[activeArcadeType] = finalScore;
      localStorage.setItem(`eduverse_score_${activeArcadeType}`, String(finalScore));
    }

    const rewardExp = Math.max(20, Math.floor(finalScore * 1.5));
    const rewardCoins = Math.max(5, Math.floor(finalScore * 0.4));

    if (student) {
      student.experience = Number(student.experience || 0) + rewardExp;
      student.coins = Number(student.coins || 0) + rewardCoins;
      saveDatabase();
      renderAppShell();
    }

    const modal = document.getElementById('arcade-gameover-modal');
    const scoreEl = document.getElementById('gameover-final-score');
    const highEl = document.getElementById('gameover-high-score');
    const expEl = document.getElementById('gameover-reward-exp');
    const coinEl = document.getElementById('gameover-reward-coins');

    if (scoreEl) scoreEl.textContent = `${finalScore} pts`;
    if (highEl) highEl.textContent = `${arcadeBestScores[activeArcadeType]} pts`;
    if (expEl) expEl.textContent = `+${rewardExp} EXP`;
    if (coinEl) coinEl.textContent = `+${rewardCoins} 金币`;
    if (modal) modal.classList.remove('hidden');

    playAudioFx('victory');
  }

  // =========================================================
  // 2. EDUVERSE HERO CHARACTERS SANCTUARY & SHOP CONTROLLER
  // =========================================================
  let selectedHeroId = 'pikachu';
  let activeSeriesFilter = 'all';

  const HERO_SERIES_MAP = {
    pokemon: ['pikachu', 'mewtwo', 'lucario', 'greninja', 'charizard', 'psyduck', 'squirtle'],
    popmart: ['crybaby', 'hacipupu', 'labubu', 'skullpanda', 'twinkle-twinkle'],
    sanrio: ['kuromi', 'my-melody', 'cinnamoroll', 'pochacco', 'hello-kitty'],
    minecraft: ['wolf', 'steve', 'enderman', 'enderdragon', 'creeper'],
    cartoon: ['winnie-the-pooh', 'crayon-shinchan', 'ugly-fish', 'yoyo'],
    elemental: ['sunny-wing', 'sprouty', 'hydroblob', 'fluffbit', 'shadow-wing', 'flame-rex', 'thunder-beetle', 'frost-fang', 'volt-cheetah', 'shadow-stalker']
  };

  function renderCharactersView(series = activeSeriesFilter) {
    activeSeriesFilter = series;
    const student = getStudent() || {};
    const ownedPets = Array.isArray(student.ownedPets) ? student.ownedPets : [student.petType || 'sunny-wing'];

    const coinsEl = document.getElementById('char-view-coins');
    const starsEl = document.getElementById('char-view-stars');
    const unlockedCountEl = document.getElementById('unlocked-hero-count');

    if (coinsEl) coinsEl.textContent = student.coins || 80;
    if (starsEl) starsEl.textContent = student.totalStars || 15;
    if (unlockedCountEl) unlockedCountEl.textContent = ownedPets.length;

    // Filter Series Tabs
    document.querySelectorAll('#character-series-tabs .nav-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.series === series);
    });

    const rosterGrid = document.getElementById('hero-roster-grid');
    if (!rosterGrid) return;

    let roles = PET_CATALOG;
    if (series !== 'all' && HERO_SERIES_MAP[series]) {
      const allowed = new Set(HERO_SERIES_MAP[series]);
      roles = PET_CATALOG.filter(r => allowed.has(r.id));
    }

    rosterGrid.innerHTML = roles.map(role => {
      const isOwned = ownedPets.includes(role.id) || student.demoMode;
      const isCurrentActive = student.petType === role.id;
      const isSelected = selectedHeroId === role.id;

      let rarityClass = 'tag-r';
      if (role.rarity === 'SSR') rarityClass = 'tag-ssr';
      else if (role.rarity === 'SR') rarityClass = 'tag-sr';
      else if (role.rarity === 'LEGEND' || role.rarity === 'LIMITED') rarityClass = 'tag-legend';

      return `
        <div class="roster-hero-item ${isSelected ? 'active' : ''}" onclick="window.__eduverseApp.selectHeroShowcase('${role.id}')">
          <span class="roster-hero-avatar">${role.icon || '🌟'}</span>
          <span class="roster-hero-name">${role.name}</span>
          <span class="roster-rarity-tag ${rarityClass}">${role.rarity}</span>
          ${isCurrentActive ? '<span style="display:block; font-size:10px; color:#10b981; font-weight:900;">【出战中】</span>' : (isOwned ? '<span style="display:block; font-size:10px; color:#6366f1;">已拥有</span>' : '<span style="display:block; font-size:10px; color:#94a3b8;">🔒 待解锁</span>')}
        </div>
      `;
    }).join('');

    renderHeroShowcasePanel();
  }

  function selectHeroShowcase(roleId) {
    selectedHeroId = roleId;
    renderCharactersView(activeSeriesFilter);
  }

  function renderHeroShowcasePanel() {
    const container = document.getElementById('hero-showcase-card');
    if (!container) return;

    const student = getStudent() || {};
    const role = PET_CATALOG.find(r => r.id === selectedHeroId) || PET_CATALOG[0];
    const ownedPets = Array.isArray(student.ownedPets) ? student.ownedPets : [student.petType || 'sunny-wing'];
    const isOwned = ownedPets.includes(role.id) || student.demoMode;
    const isCurrentActive = student.petType === role.id;

    const stats = role.baseStats || { hp: 120, attack: 20, defense: 15, speed: 15, luck: 15 };
    const totalCombatPower = Math.round(stats.hp * 3 + stats.attack * 8 + stats.defense * 6 + stats.speed * 4 + stats.luck * 5);

    const skills = (role.skills && role.skills.length) ? role.skills : [
      { name: '基础普攻', explanation: '发动迅猛的本能连击，造成基础物理伤害。' },
      { name: '专属被动 · 领域共鸣', explanation: '进入战场时根据自身属性获得战力与防御加成。' },
      { name: '终极奥义 · 觉醒重击', explanation: '蓄集满额能量发动绝杀大招，重创敌人并施加弱化。' }
    ];

    const bannerImg = role.evolvedImage || role.image || 'assets/roles/evolved/sunny-wing.png';

    container.innerHTML = `
      <div class="showcase-visual-banner">
        <img src="${bannerImg}" alt="${role.name}" class="showcase-banner-img" onerror="this.src='assets/roles/sunny-wing-a.png';" />
        <div class="showcase-badge-overlay">
          <span style="font-size:28px;">${role.icon || '🌟'}</span>
          <div>
            <h3 style="margin:0; font-size:18px; font-weight:900;">${role.name}</h3>
            <small style="color:#fde047; font-weight:700;">品质：${role.rarity} · 战斗值 ⚔️ ${totalCombatPower.toLocaleString()}</small>
          </div>
        </div>
      </div>

      <div class="showcase-stats-grid">
        <div class="hero-stat-bar-box"><small>生命值 (HP)</small><strong>${stats.hp}</strong></div>
        <div class="hero-stat-bar-box"><small>攻击力 (ATK)</small><strong style="color:#ef4444;">${stats.attack}</strong></div>
        <div class="hero-stat-bar-box"><small>防御力 (DEF)</small><strong style="color:#3b82f6;">${stats.defense}</strong></div>
        <div class="hero-stat-bar-box"><small>敏捷度 (SPD)</small><strong style="color:#10b981;">${stats.speed}</strong></div>
        <div class="hero-stat-bar-box"><small>幸运值 (LUCK)</small><strong style="color:#f59e0b;">${stats.luck}</strong></div>
      </div>

      <div class="hero-skills-row">
        <h4>⚡ 英雄专属技能特性：</h4>
        <div class="hero-skills-chips">
          ${skills.map(s => `
            <div class="hero-skill-chip" title="${s.explanation}">
              <span>✨</span>
              <strong>${s.name}</strong>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="hero-action-buttons-row">
        ${isOwned ? `
          <button type="button" class="primary-button action-glow-button" style="flex:2;" onclick="window.__eduverseApp.switchHeroRole('${role.id}')" ${isCurrentActive ? 'disabled' : ''}>
            ${isCurrentActive ? '✅ 当前已在出战中' : '⚔️ 立即设为主战出战'}
          </button>
          <button type="button" class="secondary-button" style="flex:1;" onclick="window.__eduverseApp.openView('home-view')">🐾 宠物家园/装备</button>
        ` : `
          <button type="button" class="primary-button action-glow-button" style="flex:2; background:linear-gradient(135deg,#f59e0b,#ea580c);" onclick="window.__eduverseApp.buyHeroRole('${role.id}')">
            🛍️ 立即购买此英雄 (🪙 200 金币)
          </button>
        `}
      </div>
    `;
  }

  async function switchHeroRole(roleId) {
    const student = getStudent();
    if (!student) return;
    const success = await switchActivePet(student, roleId);
    if (success) {
      playAudioFx('victory');
      showToast(`已成功切换主战角色为：${getPetInfo(roleId)?.name || roleId}！`);
      renderAppShell();
      renderCharactersView(activeSeriesFilter);
    }
  }

  async function buyHeroRole(roleId) {
    const student = getStudent();
    if (!student) return;
    const price = 200;
    const currentCoins = Number(student.coins || 0);

    if (currentCoins < price) {
      showToast(`金币不足！购买需要 ${price} 金币，你当前拥有 ${currentCoins} 金币。多做试炼答题或玩小游戏即可赚取！`);
      return;
    }

    student.coins = currentCoins - price;
    if (!Array.isArray(student.ownedPets)) student.ownedPets = [student.petType || 'sunny-wing'];
    if (!student.ownedPets.includes(roleId)) student.ownedPets.push(roleId);

    await switchActivePet(student, roleId);
    saveDatabase();
    playAudioFx('victory');
    showToast(`🎉 恭喜成功购买并解锁全新英雄【${getPetInfo(roleId)?.name || roleId}】！`);
    renderAppShell();
    renderCharactersView(activeSeriesFilter);
  }

  function triggerHeroGacha(pullType = 'single') {
    const student = getStudent();
    if (!student) return;
    const cost = pullType === 'ten' ? 900 : 100;
    const currentCoins = Number(student.coins || 0);

    if (currentCoins < cost) {
      showToast(`金币不足！抽卡需要 ${cost} 金币，当前拥有 ${currentCoins} 金币。`);
      return;
    }

    student.coins = currentCoins - cost;
    if (!Array.isArray(student.ownedPets)) student.ownedPets = [student.petType || 'sunny-wing'];

    const pulls = pullType === 'ten' ? 10 : 1;
    const pulledHeroes = [];

    for (let i = 0; i < pulls; i++) {
      const randomIndex = Math.floor(Math.random() * PET_CATALOG.length);
      const hero = PET_CATALOG[randomIndex];
      pulledHeroes.push(hero);

      if (!student.ownedPets.includes(hero.id)) {
        student.ownedPets.push(hero.id);
      } else {
        student.coins += 50; // Duplicate compensation
      }
    }

    saveDatabase();
    playAudioFx('victory');

    const heroNames = pulledHeroes.map(h => `【${h.name} (${h.rarity})】`).join('、');
    showToast(`🎉 盲盒扭蛋揭晓！获得：${heroNames}！`);

    renderAppShell();
    renderCharactersView(activeSeriesFilter);
  }

  // =========================================================
  // 3. EDUVERSE PVP DUEL ARENA BATTLE CONTROLLER
  // =========================================================
  let activeDuel = null;
  let battleQuizTimerId = null;

  const MOCK_CLASSMATE_OPPONENTS = [
    { studentId: 'CY1001', name: '林子轩 (Alex)', petId: 'pikachu', petName: '皮卡丘', level: 14, avatar: '🦁', cp: 1450 },
    { studentId: 'CY1002', name: '陈思琪 (Chloe)', petId: 'kuromi', petName: '库洛米', level: 13, avatar: '🦊', cp: 1380 },
    { studentId: 'CY1003', name: '张凯文 (Kevin)', petId: 'steve', petName: '史蒂夫', level: 12, avatar: '🐼', cp: 1290 },
    { studentId: 'CY1004', name: '李美华 (Sarah)', petId: 'my-melody', petName: '美乐蒂', level: 11, avatar: '🐰', cp: 1210 },
    { studentId: 'CY1005', name: '黄俊杰 (Jay)', petId: 'charizard', petName: '喷火龙', level: 10, avatar: '🐯', cp: 1180 }
  ];

  function renderDuelLobby() {
    const listEl = document.getElementById('duel-friends-list');
    if (!listEl) return;

    listEl.innerHTML = MOCK_CLASSMATE_OPPONENTS.map(opp => `
      <div class="duel-friend-item" onclick="window.__eduverseApp.startFriendDuel('${opp.studentId}')">
        <span class="friend-duel-avatar">${opp.avatar}</span>
        <div class="friend-duel-info">
          <strong>${opp.name}</strong>
          <small>出战角色：${opp.petName} · Lv.${opp.level} · 战斗值 ⚔️ ${opp.cp}</small>
        </div>
        <button type="button" class="primary-button compact-button action-glow-button">发起决斗 ⚔️</button>
      </div>
    `).join('');
  }

  function startFriendDuel(targetStudentId) {
    const opp = MOCK_CLASSMATE_OPPONENTS.find(o => o.studentId === targetStudentId) || MOCK_CLASSMATE_OPPONENTS[0];
    initDuelSession({
      p2Name: `${opp.name} 的【${opp.petName}】`,
      p2PetId: opp.petId,
      p2Level: opp.level,
      p2Avatar: opp.avatar,
      p2Cp: opp.cp
    });
  }

  function startBossDuel(bossId) {
    const bosses = {
      pikachu: { name: '赤红的【皮卡丘】', petId: 'pikachu', level: 15, avatar: '⚡', cp: 1280 },
      charizard: { name: '烈焰【喷火龙】', petId: 'charizard', level: 20, avatar: '🔥', cp: 1850 },
      enderdragon: { name: '末影【黑龙神】', petId: 'enderdragon', level: 25, avatar: '🐉', cp: 2600 },
      mewtwo: { name: '终极【超梦之影】', petId: 'mewtwo', level: 30, avatar: '🔮', cp: 3400 }
    };
    const b = bosses[bossId] || bosses.pikachu;
    initDuelSession({
      p2Name: b.name,
      p2PetId: b.petId,
      p2Level: b.level,
      p2Avatar: b.avatar,
      p2Cp: b.cp
    });
  }

  function initDuelSession(config) {
    const student = getStudent() || {};
    const playerPetId = student.petType || 'sunny-wing';
    const playerPetInfo = getPetInfo(playerPetId) || { name: '我的角色', baseStats: { hp: 120, attack: 20, defense: 15 } };
    const p1Level = student.petLevel || 1;
    const p1MaxHp = 800 + p1Level * 60 + (playerPetInfo.baseStats?.hp || 100) * 3;
    const p1Atk = 40 + p1Level * 8 + (playerPetInfo.baseStats?.attack || 15) * 2;
    const p1Def = 20 + p1Level * 5 + (playerPetInfo.baseStats?.defense || 10) * 2;

    const oppPetInfo = getPetInfo(config.p2PetId) || { name: '对手', baseStats: { hp: 120, attack: 20, defense: 15 } };
    const p2MaxHp = 750 + config.p2Level * 55 + (oppPetInfo.baseStats?.hp || 100) * 3;
    const p2Atk = 35 + config.p2Level * 7 + (oppPetInfo.baseStats?.attack || 15) * 2;
    const p2Def = 18 + config.p2Level * 4 + (oppPetInfo.baseStats?.defense || 10) * 2;

    activeDuel = {
      turn: 1,
      isPlayerTurn: true,
      p1: {
        name: student.studentName || '我方勇者',
        petName: playerPetInfo.name,
        petId: playerPetId,
        avatar: student.avatar || '🌟',
        level: p1Level,
        maxHp: p1MaxHp,
        currentHp: p1MaxHp,
        maxMp: 100,
        currentMp: 50,
        atk: p1Atk,
        def: p1Def,
        cp: config.p2Cp || 1200,
        skillName: `${playerPetInfo.name} 专属必杀`,
        isGuarding: false
      },
      p2: {
        name: config.p2Name,
        petName: oppPetInfo.name,
        petId: config.p2PetId,
        avatar: config.p2Avatar,
        level: config.p2Level,
        maxHp: p2MaxHp,
        currentHp: p2MaxHp,
        maxMp: 100,
        currentMp: 30,
        atk: p2Atk,
        def: p2Def,
        cp: config.p2Cp,
        skillName: `${oppPetInfo.name} 奥义冲袭`,
        isGuarding: false
      },
      logs: []
    };

    document.getElementById('duel-lobby-panel')?.classList.add('hidden');
    document.getElementById('duel-stage-panel')?.classList.remove('hidden');
    document.getElementById('battle-settlement-modal')?.classList.add('hidden');

    renderDuelBattleUI();
    logDuelEvent(`⚔️ 决斗正式开启！双方角色进入战斗状态！`);
    playAudioFx('combo');
  }

  function renderDuelBattleUI() {
    if (!activeDuel) return;
    const { p1, p2, turn, isPlayerTurn } = activeDuel;

    const turnLabel = document.getElementById('battle-turn-label');
    if (turnLabel) turnLabel.textContent = `第 ${turn} 回合 · ${isPlayerTurn ? '【你的行动阶段】' : '【对手行动中...】'}`;

    // P1 UI
    const p1Name = document.getElementById('p1-name');
    const p1Sprite = document.getElementById('p1-sprite');
    const p1HpText = document.getElementById('p1-hp-text');
    const p1HpFill = document.getElementById('p1-hp-fill');
    const p1MpText = document.getElementById('p1-mp-text');
    const p1MpFill = document.getElementById('p1-mp-fill');
    const p1Cp = document.getElementById('p1-cp');
    const p1SkillName = document.getElementById('p1-skill-name');

    if (p1Name) p1Name.textContent = `${p1.name} (Lv.${p1.level})`;
    if (p1Sprite) p1Sprite.textContent = p1.avatar;
    if (p1HpText) p1HpText.textContent = `${Math.max(0, p1.currentHp)} / ${p1.maxHp}`;
    if (p1HpFill) p1HpFill.style.width = `${Math.max(0, Math.round((p1.currentHp / p1.maxHp) * 100))}%`;
    if (p1MpText) p1MpText.textContent = `${p1.currentMp} / ${p1.maxMp}`;
    if (p1MpFill) p1MpFill.style.width = `${Math.min(100, Math.round((p1.currentMp / p1.maxMp) * 100))}%`;
    if (p1Cp) p1Cp.textContent = `⚔️ 战斗值 ${p1.cp}`;
    if (p1SkillName) p1SkillName.textContent = p1.skillName;

    // P2 UI
    const p2Name = document.getElementById('p2-name');
    const p2Sprite = document.getElementById('p2-sprite');
    const p2HpText = document.getElementById('p2-hp-text');
    const p2HpFill = document.getElementById('p2-hp-fill');
    const p2MpText = document.getElementById('p2-mp-text');
    const p2MpFill = document.getElementById('p2-mp-fill');
    const p2Cp = document.getElementById('p2-cp');

    if (p2Name) p2Name.textContent = p2.name;
    if (p2Sprite) p2Sprite.textContent = p2.avatar;
    if (p2HpText) p2HpText.textContent = `${Math.max(0, p2.currentHp)} / ${p2.maxHp}`;
    if (p2HpFill) p2HpFill.style.width = `${Math.max(0, Math.round((p2.currentHp / p2.maxHp) * 100))}%`;
    if (p2MpText) p2MpText.textContent = `${p2.currentMp} / ${p2.maxMp}`;
    if (p2MpFill) p2MpFill.style.width = `${Math.min(100, Math.round((p2.currentMp / p2.maxMp) * 100))}%`;
    if (p2Cp) p2Cp.textContent = `⚔️ 战斗值 ${p2.cp}`;

    // Enable/Disable command buttons
    const btns = document.querySelectorAll('.battle-cmd-btn');
    btns.forEach(b => {
      b.disabled = !isPlayerTurn;
    });

    const skillBtn = document.getElementById('battle-btn-skill');
    if (skillBtn && p1.currentMp < 50) {
      skillBtn.disabled = true;
    }
  }

  function logDuelEvent(msg) {
    if (!activeDuel) return;
    activeDuel.logs.push(msg);
    const ticker = document.getElementById('duel-combat-log-ticker');
    if (ticker) {
      ticker.innerHTML = activeDuel.logs.map(l => `<p class="log-entry">${l}</p>`).join('');
      ticker.scrollTop = ticker.scrollHeight;
    }
  }

  function executeBattleAction(actionType) {
    if (!activeDuel || !activeDuel.isPlayerTurn) return;
    const { p1, p2 } = activeDuel;
    p1.isGuarding = false;

    if (actionType === 'attack') {
      const damage = Math.max(25, Math.round(p1.atk * 1.3 - (p2.isGuarding ? p2.def * 1.5 : p2.def * 0.5)));
      p2.currentHp -= damage;
      p1.currentMp = Math.min(p1.maxMp, p1.currentMp + 20);

      playAudioFx('correct');
      logDuelEvent(`💥 【${p1.name}】发动普通攻击！造成 ${damage} 点物理伤害！(恢复 +20 MP)`);

      const card = document.getElementById('fighter-enemy');
      card?.classList.add('hurt-anim');
      setTimeout(() => card?.classList.remove('hurt-anim'), 400);
    } else if (actionType === 'skill') {
      if (p1.currentMp < 50) {
        showToast('MP 能量不足 50 点，无法施放必杀技！');
        return;
      }
      p1.currentMp -= 50;
      const damage = Math.max(80, Math.round(p1.atk * 2.8 + 60 - (p2.isGuarding ? p2.def : 0)));
      p2.currentHp -= damage;

      playAudioFx('combo');
      logDuelEvent(`⚡🔥 【${p1.name}】引爆专属必杀技【${p1.skillName}】！！造成毁灭性的 ${damage} 点超强暴击伤害！`);

      const card = document.getElementById('fighter-enemy');
      card?.classList.add('hurt-anim');
      setTimeout(() => card?.classList.remove('hurt-anim'), 500);
    } else if (actionType === 'guard') {
      p1.isGuarding = true;
      p1.currentMp = Math.min(p1.maxMp, p1.currentMp + 15);
      const heal = Math.round(p1.maxHp * 0.1);
      p1.currentHp = Math.min(p1.maxHp, p1.currentHp + heal);

      playAudioFx('correct');
      logDuelEvent(`🛡️ 【${p1.name}】展开【坚壁守御】！本回合格挡 65% 伤害，恢复 +${heal} HP 与 +15 MP！`);
    } else if (actionType === 'quiz') {
      triggerQuizBurstDuringBattle();
      return;
    }

    renderDuelBattleUI();
    checkDuelTermination();
  }

  function triggerQuizBurstDuringBattle() {
    const modal = document.getElementById('battle-quiz-modal');
    const timerEl = document.getElementById('quiz-burst-timer');
    const qText = document.getElementById('quiz-burst-question');
    const optsGrid = document.getElementById('quiz-burst-options-grid');

    const sampleQuestions = [
      { q: '5 × (-4) + 12 的值是多少？', opts: ['-8', '8', '-32', '32'], ans: '-8' },
      { q: 'Cari nilai punca kuasa dua bagi 144 (√144):', opts: ['12', '14', '16', '10'], ans: '12' },
      { q: 'Antara berikut, yang manakah Kata Ganda Penuh?', opts: ['kanak-kanak', 'lelangit', 'gunung-ganang', 'kuih-muih'], ans: 'kanak-kanak' },
      { q: 'Apakah fungsi klorofil dalam fotosintesis?', opts: ['Menyerap cahaya matahari', 'Menyerap air', 'Menghasilkan oksigen terus', 'Menyimpan kanji'], ans: 'Menyerap cahaya matahari' }
    ];
    const quiz = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];

    if (qText) qText.textContent = quiz.q;
    if (optsGrid) {
      optsGrid.innerHTML = quiz.opts.map(opt => `
        <button type="button" class="quiz-burst-opt-btn" onclick="window.__eduverseApp.submitBattleQuizAnswer('${escapeHtml(opt)}', '${escapeHtml(quiz.ans)}')">
          ${escapeHtml(opt)}
        </button>
      `).join('');
    }

    let timeLeft = 5;
    if (timerEl) timerEl.textContent = `⏳ ${timeLeft}s`;
    if (modal) modal.classList.remove('hidden');

    if (battleQuizTimerId) clearInterval(battleQuizTimerId);
    battleQuizTimerId = setInterval(() => {
      timeLeft--;
      if (timerEl) timerEl.textContent = `⏳ ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(battleQuizTimerId);
        if (modal) modal.classList.add('hidden');
        logDuelEvent(`⏰ 答题超时！未能触发学科暴击。`);
        endPlayerTurnAndTriggerEnemy();
      }
    }, 1000);
  }

  function submitBattleQuizAnswer(chosen, correct) {
    if (battleQuizTimerId) clearInterval(battleQuizTimerId);
    const modal = document.getElementById('battle-quiz-modal');
    if (modal) modal.classList.add('hidden');

    if (!activeDuel) return;
    const { p1, p2 } = activeDuel;

    if (chosen === correct) {
      const critDamage = Math.max(120, Math.round(p1.atk * 3.5 + 100));
      p2.currentHp -= critDamage;
      p1.currentMp = p1.maxMp;

      playAudioFx('victory');
      logDuelEvent(`🧠✨ 智慧答题正确！【${p1.name}】引爆【学科能量暴击涌流】！打出超强 3.0x 暴击 ${critDamage} 点伤害！MP 瞬间全满！`);

      const card = document.getElementById('fighter-enemy');
      card?.classList.add('hurt-anim');
      setTimeout(() => card?.classList.remove('hurt-anim'), 600);
    } else {
      playAudioFx('wrong');
      logDuelEvent(`❌ 答题错误！未能凝聚学科暴击能量。`);
    }

    renderDuelBattleUI();
    checkDuelTermination();
  }

  function checkDuelTermination() {
    if (!activeDuel) return;
    const { p1, p2 } = activeDuel;

    if (p2.currentHp <= 0) {
      p2.currentHp = 0;
      renderDuelBattleUI();
      finishDuelBattle(true);
      return;
    }

    if (p1.currentHp <= 0) {
      p1.currentHp = 0;
      renderDuelBattleUI();
      finishDuelBattle(false);
      return;
    }

    endPlayerTurnAndTriggerEnemy();
  }

  function endPlayerTurnAndTriggerEnemy() {
    if (!activeDuel) return;
    activeDuel.isPlayerTurn = false;
    renderDuelBattleUI();

    setTimeout(() => {
      executeEnemyBattleTurn();
    }, 850);
  }

  function executeEnemyBattleTurn() {
    if (!activeDuel) return;
    const { p1, p2 } = activeDuel;
    p2.isGuarding = false;

    // AI Decision
    if (p2.currentMp >= 50 && Math.random() > 0.4) {
      // Enemy skill
      p2.currentMp -= 50;
      const damage = Math.max(40, Math.round(p2.atk * 2.4 - (p1.isGuarding ? p1.def * 2.0 : p1.def * 0.4)));
      p1.currentHp -= damage;

      playAudioFx('wrong');
      logDuelEvent(`💥💀 对手【${p2.name}】施展大招【${p2.skillName}】！对我方造成 ${damage} 点猛烈伤害！`);
    } else {
      // Enemy basic attack
      const damage = Math.max(20, Math.round(p2.atk * 1.1 - (p1.isGuarding ? p1.def * 1.8 : p1.def * 0.4)));
      p1.currentHp -= damage;
      p2.currentMp = Math.min(p2.maxMp, p2.currentMp + 20);

      playAudioFx('wrong');
      logDuelEvent(`⚔️ 对手【${p2.name}】发动攻击！对我方造成 ${damage} 点物理伤害。`);
    }

    const card = document.getElementById('fighter-player');
    card?.classList.add('hurt-anim');
    setTimeout(() => card?.classList.remove('hurt-anim'), 400);

    if (p1.currentHp <= 0) {
      p1.currentHp = 0;
      renderDuelBattleUI();
      finishDuelBattle(false);
      return;
    }

    activeDuel.turn++;
    activeDuel.isPlayerTurn = true;
    renderDuelBattleUI();
  }

  function finishDuelBattle(isPlayerWin) {
    const student = getStudent();
    playAudioFx('victory');

    const rewardStars = isPlayerWin ? 25 : 5;
    const rewardExp = isPlayerWin ? 180 : 40;
    const rewardCoins = isPlayerWin ? 50 : 10;

    if (student) {
      student.totalStars = Number(student.totalStars || 0) + rewardStars;
      student.experience = Number(student.experience || 0) + rewardExp;
      student.coins = Number(student.coins || 0) + rewardCoins;
      saveDatabase();
      renderAppShell();
    }

    const banner = document.getElementById('settlement-result-banner');
    const starsEl = document.getElementById('duel-reward-stars');
    const expEl = document.getElementById('duel-reward-exp');
    const coinsEl = document.getElementById('duel-reward-coins');
    const turnsEl = document.getElementById('duel-total-turns');
    const modal = document.getElementById('battle-settlement-modal');

    if (banner) {
      banner.textContent = isPlayerWin ? '🏆 决斗大胜利！VICTORY!' : '💔 决斗惜败 · DEFEAT';
      banner.style.color = isPlayerWin ? '#f59e0b' : '#ef4444';
    }
    if (starsEl) starsEl.textContent = `+${rewardStars} 胜点`;
    if (expEl) expEl.textContent = `+${rewardExp} EXP`;
    if (coinsEl) coinsEl.textContent = `+${rewardCoins} 金币`;
    if (turnsEl && activeDuel) turnsEl.textContent = `${activeDuel.turn} 回合`;
    if (modal) modal.classList.remove('hidden');
  }

  // Hash Router
  function handleHashRoute() {
    const hash = window.location.hash || '#/dashboard';
    if (hash.startsWith('#/teacher')) {
      if (!currentTeacher) {
        const savedTeacher = localStorage.getItem('eduverse_teacher_session');
        if (savedTeacher) {
          try { currentTeacher = JSON.parse(savedTeacher); } catch (_e) {}
        }
      }
      if (currentTeacher) {
        openTeacherScreen();
        const tab = hash.split('/')[2] || 'dashboard';
        const targetTabId = `tab-${tab}`;
        document.querySelectorAll('.teacher-nav-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.teacherTab === targetTabId);
        });
        document.querySelectorAll('.teacher-tab-content').forEach(c => {
          c.classList.toggle('hidden', c.id !== targetTabId);
          c.classList.toggle('active', c.id === targetTabId);
        });
        return;
      }
    }

    if (hash.startsWith('#/subjects')) {
      switchView('subjects-view');
      renderSubjectsView();
    } else if (hash.startsWith('#/arcade')) {
      switchView('arcade-view');
      renderArcadeView();
    } else if (hash.startsWith('#/characters')) {
      switchView('characters-view');
      renderCharactersView();
    } else if (hash.startsWith('#/duel')) {
      switchView('duel-view');
      renderDuelLobby();
    } else if (hash.startsWith('#/leaderboard')) {
      switchView('leaderboard-view');
      renderGloryPodium();
    } else if (hash.startsWith('#/achievements')) {
      switchView('achievements-view');
      renderAchievementsView();
    } else if (hash.startsWith('#/quest/')) {
      const qId = hash.replace('#/quest/', '');
      startQuest(qId);
    } else {
      switchView('dashboard-view');
      renderDashboardView();
    }
  }

  window.addEventListener('hashchange', handleHashRoute);

  // Global EduVerse App API Hook
  window.__eduverseApp = {
    playAudioFx,
    toggleAudioMute,
    selectTeacher,
    openView: viewId => {
      switchView(viewId);
      const hash = viewId.replace('-view', '');
      window.location.hash = `#/${hash}`;
      if (viewId === 'arcade-view') renderArcadeView();
      else if (viewId === 'characters-view') renderCharactersView();
      else if (viewId === 'duel-view') renderDuelLobby();
      else if (viewId === 'dashboard-view') renderDashboardView();
      else if (viewId === 'subjects-view') renderSubjectsView();
    },
    enterSubject: subId => {
      switchView('subjects-view');
      renderSubjectsView(subId);
      window.location.hash = '#/subjects';
    },
    selectSubjectLobby: subId => renderSubjectsView(subId),
    startQuest,
    chooseQuestOption,
    nextQuestQuestion,
    retryWrongQuestions,
    triggerGoogleSheetSync,
    launchArcadeGame,
    finishArcadeGame,
    selectHeroShowcase,
    switchHeroRole,
    buyHeroRole,
    triggerHeroGacha,
    startFriendDuel,
    startBossDuel,
    executeBattleAction,
    submitBattleQuizAnswer,
    editStudent: studentId => {
      const modal = document.getElementById('teacher-student-modal');
      const idField = document.getElementById('t-student-id-field');
      const titleEl = document.getElementById('t-student-modal-title');
      if (idField) idField.value = studentId;
      if (titleEl) titleEl.textContent = `编辑学生档案 (${studentId})`;
      if (modal) modal.classList.remove('hidden');
    },
    editQuestion: qId => {
      const modal = document.getElementById('teacher-question-modal');
      const idField = document.getElementById('t-question-id-field');
      const titleEl = document.getElementById('t-question-modal-title');
      if (idField) idField.value = qId;
      if (titleEl) titleEl.textContent = `编辑试题 (${qId})`;
      if (modal) modal.classList.remove('hidden');
    }
  };

  // Event Listeners for EduVerse Auth & Navigation
  document.addEventListener('DOMContentLoaded', () => {
    const setAuthElementVisible = (elementId, visible) => {
      const element = document.getElementById(elementId);
      if (!element) return;
      element.hidden = !visible;
      element.setAttribute('aria-hidden', String(!visible));
      element.classList.toggle('hidden', !visible);
    };
    renderTeacherQuickGrid();
    handleHashRoute();

    // Sound toggle buttons
    document.querySelectorAll('#sound-toggle-btn, #quest-sound-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleAudioMute);
    });

    // Auth tabs
    document.getElementById('auth-tab-student')?.addEventListener('click', () => {
      document.getElementById('auth-tab-student')?.classList.add('active');
      document.getElementById('auth-tab-teacher')?.classList.remove('active');
      setAuthElementVisible('student-auth-panel', true);
      setAuthElementVisible('teacher-auth-panel', false);
    });

    document.getElementById('auth-tab-teacher')?.addEventListener('click', () => {
      document.getElementById('auth-tab-teacher')?.classList.add('active');
      document.getElementById('auth-tab-student')?.classList.remove('active');
      setAuthElementVisible('teacher-auth-panel', true);
      setAuthElementVisible('student-auth-panel', false);
      if (!document.getElementById('teacher-selected-id-input')?.value) {
        selectTeacher('TCH01_JIE');
      }
    });

    // Student Login Mode Switch
    document.getElementById('show-phone-login-button')?.addEventListener('click', () => {
      document.querySelectorAll('.login-mode-button').forEach(b => b.classList.remove('active'));
      document.getElementById('show-phone-login-button')?.classList.add('active');
      setAuthElementVisible('student-phone-login-form', true);
      setAuthElementVisible('student-register-form', false);
      setAuthElementVisible('login-form', false);
    });

    document.getElementById('show-register-form-button')?.addEventListener('click', () => {
      document.querySelectorAll('.login-mode-button').forEach(b => b.classList.remove('active'));
      document.getElementById('show-register-form-button')?.classList.add('active');
      setAuthElementVisible('student-register-form', true);
      setAuthElementVisible('student-phone-login-form', false);
      setAuthElementVisible('login-form', false);
    });

    document.getElementById('show-legacy-login-button')?.addEventListener('click', () => {
      document.querySelectorAll('.login-mode-button').forEach(b => b.classList.remove('active'));
      document.getElementById('show-legacy-login-button')?.classList.add('active');
      setAuthElementVisible('login-form', true);
      setAuthElementVisible('student-phone-login-form', false);
      setAuthElementVisible('student-register-form', false);
    });

    // Teacher quick click
    document.getElementById('teacher-quick-select-grid')?.addEventListener('click', e => {
      const btn = e.target.closest('.teacher-quick-btn');
      if (btn && btn.dataset.teacherId) {
        selectTeacher(btn.dataset.teacherId);
      }
    });

    // Teacher forms
    document.getElementById('teacher-login-form')?.addEventListener('submit', handleTeacherLogin);
    document.getElementById('student-phone-login-form')?.addEventListener('submit', handleStudentPhoneLogin);
    document.getElementById('student-register-form')?.addEventListener('submit', handleStudentRegister);

    // Teacher nav tabs
    document.querySelectorAll('.teacher-nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.teacherTab;
        document.querySelectorAll('.teacher-nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.teacher-tab-content').forEach(c => {
          c.classList.toggle('hidden', c.id !== targetId);
          c.classList.toggle('active', c.id === targetId);
        });
        window.location.hash = `#/teacher/${targetId.replace('tab-', '')}`;
      });
    });

    // Google Sheet Sync trigger
    document.getElementById('trigger-sheet-sync-btn')?.addEventListener('click', triggerGoogleSheetSync);

    // Teacher Switch Student View
    document.getElementById('teacher-switch-student-btn')?.addEventListener('click', () => {
      document.getElementById('teacher-screen')?.classList.add('hidden');
      loginSuccess({
        studentId: '511001',
        studentName: '林子轩 (Form 2)',
        form: 'Form 2',
        phone: '0123456789',
        level: 12,
        experience: 3500,
        currentStreak: 12,
        coins: 520,
        petType: 'pikachu',
        petName: '皮卡丘',
        demoMode: true
      });
    });

    // Teacher Password Modal
    document.getElementById('teacher-change-pwd-btn')?.addEventListener('click', () => {
      document.getElementById('teacher-pwd-change-modal')?.classList.remove('hidden');
    });

    document.getElementById('teacher-change-password-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const currentPassword = document.getElementById('pwd-current-input')?.value;
      const newPassword = document.getElementById('pwd-new-input')?.value;
      const confirmPassword = document.getElementById('pwd-confirm-input')?.value;

      if (newPassword !== confirmPassword) {
        showToast('两次输入的新密码不一致！');
        return;
      }

      const res = await backendClient.changeTeacherPassword({
        teacherId: currentTeacher?.teacherId || 'TCH01_JIE',
        currentPassword,
        newPassword
      });

      if (res.ok) {
        showToast('教师密码修改成功！');
        document.getElementById('teacher-pwd-change-modal')?.classList.add('hidden');
      } else {
        showToast(res.error || '原密码错误，修改失败。');
      }
    });

    // Modal close buttons
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal-backdrop')?.classList.add('hidden');
      });
    });

    // Daily Challenge Start button
    document.getElementById('start-daily-challenge-btn')?.addEventListener('click', () => {
      startQuest('daily-math-f1', 'math');
    });

    // Quest Next button
    document.getElementById('quest-next-btn')?.addEventListener('click', nextQuestQuestion);
    document.getElementById('quest-quit-btn')?.addEventListener('click', () => {
      switchView('dashboard-view');
      window.location.hash = '#/dashboard';
    });
    document.getElementById('settlement-back-hub-btn')?.addEventListener('click', () => {
      switchView('dashboard-view');
      window.location.hash = '#/dashboard';
    });
    document.getElementById('settlement-retry-mistakes-btn')?.addEventListener('click', retryWrongQuestions);

    // Arcade Controls
    document.getElementById('arcade-main-action-btn')?.addEventListener('click', runMiniGamePrimaryAction);
    document.getElementById('arcade-retry-btn')?.addEventListener('click', retryMiniGame);
    document.getElementById('arcade-exit-btn')?.addEventListener('click', () => {
      document.getElementById('arcade-arena-section')?.classList.add('hidden');
    });
    document.getElementById('gameover-retry-btn')?.addEventListener('click', () => {
      document.getElementById('arcade-gameover-modal')?.classList.add('hidden');
      launchArcadeGame(activeArcadeType);
    });
    document.getElementById('gameover-back-btn')?.addEventListener('click', () => {
      document.getElementById('arcade-arena-section')?.classList.add('hidden');
      document.getElementById('arcade-gameover-modal')?.classList.add('hidden');
    });

    // Character Sanctuary Series Tabs
    document.getElementById('character-series-tabs')?.addEventListener('click', e => {
      const btn = e.target.closest('.nav-button');
      if (btn && btn.dataset.series) {
        renderCharactersView(btn.dataset.series);
      }
    });

    // Gacha Machine Buttons
    document.getElementById('gacha-single-pull-btn')?.addEventListener('click', () => triggerHeroGacha('single'));
    document.getElementById('gacha-ten-pull-btn')?.addEventListener('click', () => triggerHeroGacha('ten'));

    // Duel Action Commands
    document.getElementById('battle-btn-attack')?.addEventListener('click', () => executeBattleAction('attack'));
    document.getElementById('battle-btn-skill')?.addEventListener('click', () => executeBattleAction('skill'));
    document.getElementById('battle-btn-guard')?.addEventListener('click', () => executeBattleAction('guard'));
    document.getElementById('battle-btn-quiz')?.addEventListener('click', () => executeBattleAction('quiz'));
    document.getElementById('battle-surrender-btn')?.addEventListener('click', () => {
      document.getElementById('duel-stage-panel')?.classList.add('hidden');
      document.getElementById('duel-lobby-panel')?.classList.remove('hidden');
    });
    document.getElementById('duel-settle-again-btn')?.addEventListener('click', () => {
      document.getElementById('battle-settlement-modal')?.classList.add('hidden');
      renderDuelLobby();
    });
    document.getElementById('duel-settle-back-btn')?.addEventListener('click', () => {
      document.getElementById('battle-settlement-modal')?.classList.add('hidden');
      document.getElementById('duel-stage-panel')?.classList.add('hidden');
      document.getElementById('duel-lobby-panel')?.classList.remove('hidden');
    });
    document.getElementById('duel-start-friend-btn')?.addEventListener('click', () => {
      const input = document.getElementById('duel-target-id-input');
      const targetId = input?.value.trim() || 'CY1002';
      startFriendDuel(targetId);
    });

    // Demo phone buttons
    document.querySelectorAll('.demo-phone-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const phone = btn.dataset.demoPhone;
        const phoneInput = document.getElementById('student-phone-input');
        const pinInput = document.getElementById('student-pin-input');
        if (phoneInput) phoneInput.value = phone;
        if (pinInput) pinInput.value = '1234';
        document.getElementById('student-phone-login-form')?.dispatchEvent(new Event('submit'));
      });
    });
  });

  window.__holidayCheckinApp = {
    getState: () => ({ session, database, config: APP_CONFIG }),
    getCombatState: () => {
      const student = getStudent();
      return student ? getCombatState(student) : null;
    },
    equipItem,
    unequipItem,
    evolvePet,
    switchActivePet: async petType => {
      const student = getStudent();
      if (!student || !(await switchActivePet(student, petType))) return false;
      renderAppShell();
      return true;
    },
    startFreeDemo,
    resetCurrentStudent: resetDemo,
    startQuiz
  };

  startLanguageObserver();
  setupPetFoodDragAndDrop();
  applyLanguage();
  warmProductionBackend();
  if (!startLocalGuidePreviewFromUrl()) restoreSavedLogin();
})();
