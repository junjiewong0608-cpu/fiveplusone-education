(() => {
  const EQUIPMENT_SLOTS = [
    { id: 'weapon', label: '武器', icon: '⚔️' },
    { id: 'head', label: '头部', icon: '👑' },
    { id: 'body', label: '身体', icon: '🛡️' },
    { id: 'hands', label: '手部', icon: '🧤' },
    { id: 'feet', label: '脚部', icon: '🥾' },
    { id: 'accessory', label: '饰品', icon: '💍' }
  ];

  const tierInfo = {
    epic: { label: '史诗', requiredPetRarity: 'SR', price: 24 },
    mythic: { label: '神话', requiredPetRarity: 'SSR', price: 32 },
    legendary: { label: '传说', requiredPetRarity: 'LEGEND', price: 44 }
  };
  const exclusiveSlotOrder = ['weapon', 'head', 'body', 'hands', 'feet', 'accessory'];
  const exclusivePriceOffsets = {
    epic: [6, 4, 6, 10, 8, 12],
    mythic: [10, 8, 10, 14, 12, 16],
    legendary: [14, 16, 14, 18, 16, 20]
  };

  const exclusiveSets = [
    {
      petId: 'shadow-wing',
      petName: 'Shadow Wing',
      setName: '影翼专属套装',
      tierKey: 'epic',
      names: ['影蚀之喙', '古墓哨兵之眼', '幽冥斗篷', '魔符利爪', '静谧胫甲', '魂火指环'],
      englishNames: ['Beak of Shadow Erosion', 'Eye of the Tomb Sentinel', 'Cloak of the Nether', 'Rune Talons', 'Silent Greaves', 'Soulfire Ring'],
      descriptions: ['暗影穿刺武器，攻击附带幽灵属性。', '增加命中与暴击几率，获得虚空视界。', '大幅提高闪避，受击时有几率让攻击者陷入恐慌。', '增加物理攻击，暴击时转化部分生命值。', '增加移动速度与闪避率，移动时不留声音。', '增加法力上限与法力回复，提升幽冥属性伤害。'],
      stats: [
        { attack: 10, speed: 3 }, { hp: 8, luck: 5 }, { hp: 18, defense: 8 },
        { attack: 7, speed: 4 }, { speed: 7, luck: 2 }, { attack: 5, luck: 6 }
      ]
    },
    {
      petId: 'flame-rex',
      petName: 'Flame Rex',
      setName: '小焰暴龙专属套装',
      tierKey: 'epic',
      names: ['熔岩巨爪', '岩浆咆哮面具', '岩崩战铠', '炽炎符文爪套', '余烬之行', '熔岩心之环'],
      englishNames: ['Lava Colossus Claws', 'Magma Roar Mask', 'Rockfall Battle Armor', 'Blazing Rune Gauntlets', 'Emberstride Greaves', 'Magma Heart Ring'],
      descriptions: ['攻击附带火焰属性，有几率使目标陷入熔岩灼烧。', '增加生命与火焰抗性，赋予熔岩视界。', '大幅增加物理防御与最大生命值。', '增加物理攻击，暴击时将部分最大生命值转化为火焰伤害。', '增加移动速度与跳跃高度，在岩浆上移动无声。', '增加法力上限与法力回复，增强火焰属性伤害。'],
      stats: [
        { attack: 11, speed: 2 }, { hp: 12, defense: 4 }, { hp: 18, defense: 8 },
        { attack: 9, speed: 3 }, { speed: 7, luck: 2 }, { attack: 7, luck: 5 }
      ]
    },
    {
      petId: 'thunder-beetle',
      petName: 'Thunder Beetle',
      setName: '科技甲虫专属套装',
      tierKey: 'mythic',
      names: ['感应式甲虫战盔', '反应堆甲板', '赛博切割钳', '动力学后腿', '金色几何核心', '科技齿轮戒指'],
      englishNames: ['Sensor Beetle Helm', 'Reactor Plating', 'Cyber Cutting Claw', 'Kinetic Hindlegs', 'Golden Geometric Core', 'Tech Gear Ring'],
      descriptions: ['增强感知与战场视野，让敌人难以偷袭。', '高强度合金装甲，吸收并反应部分能量攻击。', '高速切割边缘，提升攻击与精密操作能力。', '液压动力结构，提升移动速度和跳跃高度。', '完美切割的能量核心，提升法力上限与攻击。', '微型齿轮纹理，提升反应速度与科技属性伤害。'],
      stats: [
        { attack: 16, speed: 4 }, { hp: 14, luck: 8 }, { hp: 30, defense: 18 },
        { attack: 14, speed: 6 }, { speed: 12, luck: 3 }, { attack: 10, luck: 12 }
      ]
    },
    {
      petId: 'frost-fang',
      petName: 'Frost Fang',
      setName: '冰原狼专属套装',
      tierKey: 'mythic',
      names: ['冰川之爪', '远古狼王面具', '冰晶战鞍', '虚空爪套', '极地胫甲', '风暴图腾指环'],
      englishNames: ['Glacial Claws', 'Mask of the Ancient Wolf King', 'Crystabarked War-Saddle', 'Void Talon Gauntlets', 'Arctic Greaves', 'Ring of the Storm Totem'],
      descriptions: ['攻击时有几率冻结敌人，带来寒冰攻击效果。', '免疫石化并提升全队士气，增加命中和暴击。', '吸收大量伤害并提升移动速度。', '增加攻击伤害与灵巧，暴击时附加寒冰效果。', '增加伤害可见范围、暴击和移动速度。', '在低生命值时召唤冰风暴，提升寒冰属性伤害。'],
      stats: [
        { attack: 14, speed: 6 }, { hp: 16, luck: 7 }, { hp: 28, defense: 15 },
        { attack: 12, speed: 7 }, { speed: 14, luck: 4 }, { attack: 8, luck: 13 }
      ]
    },
    {
      petId: 'volt-cheetah',
      petName: 'Volt Cheetah',
      setName: '闪电猎豹专属套装',
      tierKey: 'legendary',
      names: ['雷霆风暴眼罩', '电能猎手皮甲', '闪电利爪', '神速电涌靴', '雷鸣心核项链', '雷电球戒指'],
      englishNames: ['Thunderstorm Visor', 'Electro Hunter Armor', 'Lightning Claw', 'Volt Surge Boots', 'Thunderheart Necklace', 'Thunder Orb Ring'],
      descriptions: ['大幅增加感知和闪避，激活时可短暂致盲。', '提供能量护盾，受击时有几率释放电伤害。', '增加物理攻击速度，攻击有几率附加麻痹效果。', '极大增加移动速度和跳跃高度，落地无声。', '增加法力最大值和闪电属性，增强闪电法力伤害。', '攻击时释放雷电爆炸，法力全满时增加闪电属性伤害。'],
      stats: [
        { attack: 24, speed: 10 }, { hp: 20, luck: 10 }, { hp: 35, defense: 22 },
        { attack: 22, speed: 9 }, { speed: 15, luck: 8 }, { attack: 18, luck: 15 }
      ]
    },
    {
      petId: 'shadow-stalker',
      petName: 'Shadow Stalker',
      setName: '暗影恶魔专属套装',
      tierKey: 'legendary',
      names: ['暗影之噬', '古墓哨兵之眼', '幽冥战铠', '魔符利爪', '静谧胫甲', '魂火指环'],
      englishNames: ['Bite of Shadow', 'Eye of the Tomb Sentinel', 'Nether Battle Armor', 'Rune Talons', 'Silent Greaves', 'Soulfire Ring'],
      descriptions: ['攻击附带幽灵属性，降低目标物理防御。', '增加生命和暴击几率，获得虚空视界。', '大幅提升防御与生命，受到攻击有几率反伤。', '增加物理攻击，暴击时将部分最大生命值转化为法力。', '增加移动速度和跳跃高度，在地面移动无声。', '增加法力最大值和法力回复，法力全满时增强幽灵伤害。'],
      stats: [
        { attack: 30, speed: 10 }, { hp: 20, luck: 10 }, { hp: 40, defense: 25 },
        { attack: 24, speed: 12 }, { speed: 16, luck: 10 }, { attack: 22, luck: 18 }
      ]
    }
  ];

  function makeFourPieceSet(petId, petName, setName, tierKey, names, englishNames, theme, options = {}) {
    return {
      petId,
      petName,
      setName,
      tierKey,
      slots: ['weapon', 'head', 'body', 'accessory'],
      names,
      englishNames,
      descriptions: options.descriptions || [
        `${theme}专属武器，提升攻击与行动速度。`,
        `${theme}专属头部装备，提升生命与幸运。`,
        `${theme}专属身体装备，提升生命与防御。`,
        `${theme}专属饰品，提升攻击与幸运。`
      ],
      stats: options.stats || [
        { attack: 12, speed: 4 },
        { hp: 18, luck: 5 },
        { hp: 24, defense: 10 },
        { attack: 10, luck: 7 }
      ]
    };
  }

  const sanrioEquipmentProfiles = {
    kuromi: {
      descriptions: [
        '粉紫星光凝成的弯月镰，挥动时留下恶作剧轨迹，提升攻击与速度。',
        '镶着星星与粉晶的夜色王冠，增强幸运感知，让 Kuromi 更容易抓住反击机会。',
        '轻巧的粉紫战裙，能挡住突袭并保持灵活，提升生命与防御。',
        '封存梦境星尘的护符，技能发动时点亮粉晶，提升攻击与幸运。'
      ],
      stats: [
        { attack: 16, speed: 5 },
        { hp: 16, luck: 8 },
        { hp: 20, defense: 8 },
        { attack: 12, luck: 10 }
      ]
    },
    'my-melody': {
      descriptions: [
        '盛开爱心花瓣的治愈法杖，释放柔光时兼具攻击和恢复力量。',
        '由花瓣和爱心宝石组成的王冠，持续带来温柔守护与幸运。',
        '粉樱花瓣织成的轻甲，柔软却坚韧，大幅提升生命与防御。',
        '会发出温暖心光的吊坠，受伤时稳定气息并强化防守。'
      ],
      stats: [
        { attack: 9, luck: 7 },
        { hp: 24, luck: 6 },
        { hp: 34, defense: 16 },
        { hp: 18, defense: 8, luck: 6 }
      ]
    },
    cinnamoroll: {
      descriptions: [
        '缠绕高音谱号的云蓝法杖，挥动时音符化成光波，提升攻击与速度。',
        '茶杯与云朵组成的轻盈王冠，帮助感知风向并增加幸运。',
        '像云层一样柔软的乐袍，行动时生成气流护幕，提升生命、防御与速度。',
        '储存天空旋律的宝珠，音符环绕时让行动更轻快也更幸运。'
      ],
      stats: [
        { attack: 10, speed: 8 },
        { hp: 18, luck: 6 },
        { hp: 20, defense: 10, speed: 5 },
        { speed: 10, luck: 8 }
      ]
    },
    pochacco: {
      descriptions: [
        '充满运动能量的香蕉星棒，冲刺时爆出蓝黄轨迹，提升攻击与速度。',
        '星光护目冠会锁定路线，让 Pochacco 冲刺更稳并提高幸运。',
        '冠军风格的轻型护甲，能吸收冲撞伤害并保护身体，让连续奔跑更稳定。',
        '记录胜利瞬间的奖章，奔跑越久越亮，提升速度与攻击。'
      ],
      stats: [
        { attack: 14, speed: 8 },
        { hp: 14, speed: 5, luck: 5 },
        { hp: 22, defense: 9 },
        { attack: 10, speed: 10 }
      ]
    },
    'hello-kitty': {
      descriptions: [
        '镶着红色蝴蝶结的爱心权杖，释放皇家心光并提升幸运攻击。',
        '闪耀粉晶的皇家皇冠，带来温柔号令与高幸运守护，稳定队伍气场。',
        '粉色公主裙甲外柔内稳，守护伙伴时提升生命与防御。',
        '星光凝成的爱心护盾，能挡下危险并把勇气化成幸运加成。'
      ],
      stats: [
        { attack: 11, luck: 8 },
        { hp: 22, luck: 10 },
        { hp: 30, defense: 14 },
        { attack: 5, defense: 8, luck: 12 }
      ]
    }
  };

  const fourPieceSets = [
    makeFourPieceSet('sunny-wing', 'Sunny Wing', '晴翼专属套装', 'epic', ['晨曦羽刃', '晴空冠羽', '云光羽衣', '彩虹风铃'], ['Dawnfeather Blade', 'Skycrest Plume', 'Cloudlight Raiment', 'Rainbow Wind Chime'], 'Sunny Wing'),
    makeFourPieceSet('sprouty', 'Sprouty', '芽芽专属套装', 'epic', ['藤芽魔杖', '森林嫩冠', '古树叶甲', '绿芽护符'], ['Vinebud Wand', 'Forest Sprout Crown', 'Ancient Leafmail', 'Greenbud Charm'], 'Sprouty'),
    makeFourPieceSet('hydroblob', 'Hydroblob', '水滴专属套装', 'epic', ['潮汐水刃', '深蓝水冠', '流泉护甲', '海心吊坠'], ['Tidewater Blade', 'Deepblue Crown', 'Springflow Armor', 'Oceanheart Pendant'], 'Hydroblob'),
    makeFourPieceSet('fluffbit', 'Fluffbit', '绒绒专属套装', 'epic', ['绒球花杖', '软绒耳冠', '云棉礼衣', '幸运糖环'], ['Fluffball Staff', 'Fuzzy Ear Crown', 'Cloudcotton Dress', 'Lucky Candy Ring'], 'Fluffbit'),
    makeFourPieceSet('crybaby', 'Crybaby', 'Crybaby专属套装', 'epic', ['泪滴手杖', '哭哭光环', '软糖礼裙', '心泪吊坠'], ['Teardrop Wand', 'Crybaby Halo', 'Gummy Dress', 'Hearttear Pendant'], 'Crybaby'),
    makeFourPieceSet('hacipupu', 'Hacipupu', 'Hacipupu专属套装', 'epic', ['森林提灯', '叶芽礼帽', '蘑菇披风', '果实护符'], ['Forest Lantern', 'Leafbud Hat', 'Mushroom Cape', 'Fruit Charm'], 'Hacipupu'),
    makeFourPieceSet('labubu', 'Labubu', 'Labubu专属套装', 'epic', ['野性尖杖', '尖耳树冠', '荆棘斗篷', '森林心核'], ['Wildwood Staff', 'Pointed Ear Crown', 'Thornbark Cloak', 'Forestheart Core'], 'Labubu'),
    makeFourPieceSet('skullpanda', 'Skullpanda', 'Skullpanda专属套装', 'epic', ['蔷薇魔杖', '暗月兔冠', '星夜斗篷', '月蚀宝珠'], ['Roseveil Wand', 'Darkmoon Bunny Crown', 'Starrynight Cloak', 'Eclipse Orb'], 'Skullpanda'),
    makeFourPieceSet('twinkle-twinkle', 'Twinkle Twinkle', 'Twinkle Twinkle专属套装', 'epic', ['星辉法杖', '闪星王冠', '星轨礼服', '星锁项链'], ['Starlight Staff', 'Twinkle Crown', 'Startrail Dress', 'Starlock Necklace'], 'Twinkle Twinkle'),
    makeFourPieceSet('pikachu', 'Pikachu', 'Pikachu专属套装', 'mythic', ['雷光长矛', '电气耳冠', '闪电护甲', '雷珠项链'], ['Thunderbolt Spear', 'Electric Crest', 'Voltguard Armor', 'Thunder Orb Necklace'], 'Pikachu'),
    makeFourPieceSet('mewtwo', 'Mewtwo', 'Mewtwo专属套装', 'mythic', ['念力法杖', '超能冠冕', '心灵胸甲', '紫月核心'], ['Psyforce Staff', 'Psychic Crown', 'Mindplate Armor', 'Violet Moon Core'], 'Mewtwo'),
    makeFourPieceSet('lucario', 'Lucario', 'Lucario专属套装', 'mythic', ['波导长枪', '钢拳护盔', '波导战甲', '青焰护符'], ['Aura Lance', 'Steel Fist Helm', 'Aura Battlecoat', 'Azureflame Charm'], 'Lucario'),
    makeFourPieceSet('greninja', 'Greninja', 'Greninja专属套装', 'mythic', ['水手里剑', '忍影面罩', '潜影战衣', '水遁符石'], ['Water Shuriken', 'Ninja Veil', 'Shadowwater Suit', 'Waterstyle Rune'], 'Greninja'),
    makeFourPieceSet('charizard', 'Charizard', 'Charizard专属套装', 'mythic', ['烈焰龙弓', '火翼龙冠', '熔火龙铠', '龙心吊坠'], ['Flamewing Bow', 'Firewing Crown', 'Magma Dragonmail', 'Dragonheart Pendant'], 'Charizard'),
    makeFourPieceSet('psyduck', 'Psyduck', 'Psyduck专属套装', 'mythic', ['念波水杖', '头痛水冠', '蓝潮斗篷', '心海水珠'], ['Mindwave Staff', 'Headache Crown', 'Blue Tide Cloak', 'Mindsea Pearl'], 'Psyduck'),
    makeFourPieceSet('squirtle', 'Squirtle', 'Squirtle专属套装', 'mythic', ['浪花水炮', '贝壳王冠', '海潮龟甲', '泡泡徽章'], ['Wave Cannon', 'Shell Crown', 'Tide Shell Armor', 'Bubble Badge'], 'Squirtle'),
    makeFourPieceSet('kuromi', 'Kuromi', 'Kuromi专属套装', 'mythic', ['星月魔镰', '星夜王冠', '淘气战裙', '粉晶护符'], ['Moonstar Scythe', 'Starrynight Crown', 'Mischief Battledress', 'Pink Crystal Charm'], 'Kuromi', sanrioEquipmentProfiles.kuromi),
    makeFourPieceSet('my-melody', 'My Melody', 'My Melody专属套装', 'mythic', ['爱心花杖', '花心王冠', '粉樱裙甲', '治愈心坠'], ['Heartflower Staff', 'Bloomheart Crown', 'Cherryblossom Dressmail', 'Healing Heart Pendant'], 'My Melody', sanrioEquipmentProfiles['my-melody']),
    makeFourPieceSet('cinnamoroll', 'Cinnamoroll', 'Cinnamoroll专属套装', 'mythic', ['音符法杖', '云杯王冠', '云端乐袍', '旋律宝珠'], ['Melody Staff', 'Cloudcup Crown', 'Sky Melody Robe', 'Harmony Orb'], 'Cinnamoroll', sanrioEquipmentProfiles.cinnamoroll),
    makeFourPieceSet('pochacco', 'Pochacco', 'Pochacco专属套装', 'mythic', ['香蕉星棒', '极速护目冠', '冠军护甲', '疾风奖章'], ['Banana Star Baton', 'Speed Visor Crown', 'Champion Guard Armor', 'Gale Medal'], 'Pochacco', sanrioEquipmentProfiles.pochacco),
    makeFourPieceSet('hello-kitty', 'Hello Kitty', 'Hello Kitty专属套装', 'mythic', ['爱心权杖', '皇家皇冠', '公主裙甲', '星耀心盾'], ['Heart Scepter', 'Royal Crown', 'Princess Dressmail', 'Starlight Heart Shield'], 'Hello Kitty', sanrioEquipmentProfiles['hello-kitty']),
    makeFourPieceSet('wolf', 'Wolf', 'Wolf专属套装', 'legendary', ['寒林项圈', '月牙耳甲', '伙伴护甲', '月铃护符'], ['Frostwood Collar', 'Crescent Earguard', 'Packguard Armor', 'Moonbell Charm'], 'Wolf'),
    makeFourPieceSet('steve', 'Steve', 'Steve专属套装', 'legendary', ['钻石镐', '方块头盔', '钻石胸甲', '末影指南针'], ['Diamond Pickaxe', 'Blockhead Helmet', 'Diamond Chestplate', 'Ender Compass'], 'Steve'),
    makeFourPieceSet('enderman', 'Enderman', 'Enderman专属套装', 'legendary', ['虚空魔刃', '末影面罩', '传送披风', '末影之眼'], ['Voidblade', 'Ender Mask', 'Teleport Cloak', 'Eye of Ender'], 'Enderman'),
    makeFourPieceSet('enderdragon', 'Ender Dragon', '末影龙专属套装', 'legendary', ['末影龙爪', '末影王冠', '龙鳞战甲', '紫晶龙核'], ['Ender Dragon Claw', 'Ender Dragon Crown', 'Dragonscale Armor', 'Amethyst Dragon Core'], 'Ender Dragon'),
    makeFourPieceSet('creeper', 'Creeper', 'Creeper专属套装', 'legendary', ['苦力怕核心', '爆裂方块盔', '绿晶护甲', '红石引爆器'], ['Creeper Core', 'Blastblock Helm', 'Emerald Creeper Armor', 'Redstone Detonator'], 'Creeper'),
    makeFourPieceSet('winnie-the-pooh', 'Winnie The Pooh', 'Winnie专属套装', 'mythic', ['蜂蜜星棒', '蜜糖小冠', '云朵背心', '幸运蜂蜜罐'], ['Honey Star Baton', 'Honey Crown', 'Cloud Vest', 'Lucky Honey Jar'], 'Winnie The Pooh'),
    makeFourPieceSet('crayon-shinchan', '蜡笔小新', '蜡笔小新专属套装', 'epic', ['动感蜡笔', '小新披风', '英雄短袖', '勇气徽章'], ['Action Crayon', 'Shinchan Cape', 'Hero Tee', 'Courage Badge'], '蜡笔小新'),
    makeFourPieceSet('ugly-fish', '丑鱼', '丑鱼专属套装', 'epic', ['椰子水枪', '沙滩太阳帽', '浪花背心', '贝壳护符'], ['Coconut Water Blaster', 'Beach Sun Hat', 'Wave Vest', 'Shell Charm'], '丑鱼'),
    makeFourPieceSet('yoyo', 'YOYO', 'YOYO专属套装', 'mythic', ['爱心云杖', '粉云发冠', '棉花斗篷', '心愿气球'], ['Heartcloud Wand', 'Pink Cloud Crown', 'Cotton Cape', 'Wish Balloon'], 'YOYO')
  ];

  function makeFivePieceSet(petId, petName, setName, tierKey, names, englishNames, theme, options = {}) {
    return {
      petId,
      petName,
      setName,
      tierKey,
      slots: ['weapon', 'head', 'body', 'hands', 'accessory'],
      names,
      englishNames,
      descriptions: options.descriptions || [
        `${theme}专属神兵，凝聚极境能量，极大增强爆发攻击与行动速度。`,
        `${theme}专属战盔，强化战场超能感知，提升生命上限与暴击幸运。`,
        `${theme}专属重铠，吸收正面冲击伤害，大幅提高护甲与生命强度。`,
        `${theme}专属战爪护手，强化攻击穿透力，攻击时附加异常状态。`,
        `${theme}专属核心饰品，唤醒神兽专属命格，大幅增强全属性战力。`
      ],
      stats: options.stats || [
        { attack: 18, speed: 6 },
        { hp: 22, luck: 8 },
        { hp: 32, defense: 18 },
        { attack: 15, speed: 5 },
        { attack: 12, defense: 10, luck: 12 }
      ]
    };
  }

  const fivePieceSets = [
    makeFivePieceSet('arcflare-fox', '赤焰机甲狐', '赤炎机甲专属神装', 'mythic',
      ['赤炎脉冲刃', '高能红外战盔', '等离子阻燃胸甲', '离子喷射爪套', '炽核能量勋章'],
      ['Flame Pulse Blade', 'Infra War Helm', 'Plasma Flame Armor', 'Ion Thruster Gauntlets', 'Blazing Core Medal'],
      '赤焰机甲狐'
    ),
    makeFivePieceSet('vibranium-panther', '紫能守护豹', '振金守护专属神装', 'mythic',
      ['振金暗夜刺', '黑曜战纹面具', '纳米蓄能战甲', '虚空充能利爪', '紫能守护星环'],
      ['Vibranium Night Dagger', 'Obsidian War Mask', 'Nano Storage Battleplate', 'Void Charge Claws', 'Purple Energy Ring'],
      '紫能守护豹'
    ),
    makeFivePieceSet('stormmane-lion', '雷霆战狮', '狂雷咆哮专属神装', 'mythic',
      ['雷皇裂空枪', '雷霆金鬃冠', '风暴神威重铠', '电光震荡手铠', '九天雷神护符'],
      ['Thunder Sky Lance', 'Thunder Gold Crown', 'Storm Might Armor', 'Volt Shock Gauntlets', 'Nine Heavens Charm'],
      '雷霆战狮'
    ),
    makeFivePieceSet('webshade-lynx', '蛛影战猫', '幽影蛛罗专属神装', 'mythic',
      ['暗影合金爪', '隐匿夜行护面', '影丝轻灵战衣', '剧毒刺刃手套', '天罗蛛影之眼'],
      ['Shadow Alloy Claws', 'Stealth Night Visor', 'Shadowsilk Suit', 'Venom Blade Gloves', 'Web of Shadows Eye'],
      '蛛影战猫'
    ),
    makeFivePieceSet('gamma-boulder-bear', '伽马巨岩熊', '泰坦巨岩专属神装', 'mythic',
      ['核能破山锤', '大地岩晶重盔', '伽马钛钢堡垒甲', '撼地重岩爪套', '泰坦不灭岩核'],
      ['Nuclear Mountain Hammer', 'Earth Rock Heavy Helm', 'Gamma Fortress Armor', 'Earthshaker Gauntlets', 'Titan Eternal Core'],
      '伽马巨岩熊'
    ),
    makeFivePieceSet('runeportal-owl', '秘境传送鸮', '星界秘境专属神装', 'mythic',
      ['秘境时空权杖', '真视古符羽冠', '虚空星辰法袍', '时空跃迁羽套', '异界门扉钥匙'],
      ['Astral Portal Scepter', 'True Sight Rune Crown', 'Void Star Robe', 'Chrono Shift Featherbands', 'Otherworld Key'],
      '秘境传送鸮'
    )
  ];

  function makeExclusiveItem(set, index) {
    const tier = tierInfo[set.tierKey];
    const slotOrder = set.slots || exclusiveSlotOrder;
    const slot = slotOrder[index];
    return {
      id: `exclusive-${set.petId}-${String(index + 1).padStart(2, '0')}`,
      name: set.names[index],
      englishName: set.englishNames[index],
      category: slot,
      tier: tier.label,
      slot,
      price: tier.price + exclusivePriceOffsets[set.tierKey][index],
      icon: '✨',
      image: `assets/equipment-items/exclusive/${set.petId}/${String(index + 1).padStart(2, '0')}.png`,
      description: set.descriptions[index],
      stats: set.stats[index],
      requiredPetRarity: tier.requiredPetRarity,
      exclusivePetId: set.petId,
      exclusivePetName: set.petName,
      exclusiveSetName: set.setName,
      exclusiveBonusRate: 0.2,
      exclusiveSetIndex: index + 1,
      exclusiveSetSize: slotOrder.length
    };
  }

  const standardExclusiveSets = [...exclusiveSets, ...fourPieceSets];
  const standardExclusiveEquipment = standardExclusiveSets
    .flatMap(set => set.names.map((_, index) => makeExclusiveItem(set, index)));
  const heroExclusiveEquipment = fivePieceSets
    .flatMap(set => set.names.map((_, index) => makeExclusiveItem(set, index)));

  window.EQUIPMENT_SLOTS = EQUIPMENT_SLOTS;
  window.EXCLUSIVE_EQUIPMENT_SETS = standardExclusiveSets.map(set => ({
    petId: set.petId,
    petName: set.petName,
    setName: set.setName,
    tierKey: set.tierKey,
    size: (set.slots || exclusiveSlotOrder).length
  }));
  window.EQUIPMENT_CATALOG_DATA = standardExclusiveEquipment;
  window.HERO_GACHA_EQUIPMENT_DATA = heroExclusiveEquipment;
})();
