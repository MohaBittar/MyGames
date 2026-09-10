/* ============================================================
   WORLD MAP & TRAVEL SYSTEM
   ============================================================ */
const WorldMap = {
    areas: [
        { id: 'village', name: 'Village', x: 80, y: 200, width: 60, height: 40, color: '#c9a959', threat: 0, unlocked: true, description: 'A peaceful settlement. Your journey begins here.', connections: ['darkForest'], unlockCondition: null },
        { id: 'darkForest', name: 'Dark Forest', x: 200, y: 150, width: 90, height: 60, color: '#44aa44', threat: 1, unlocked: true, description: 'Dense woodland teeming with hostile creatures.', connections: ['village', 'ancientCaves'], unlockCondition: null },
        { id: 'ancientCaves', name: 'Ancient Caves', x: 340, y: 170, width: 80, height: 50, color: '#888888', threat: 2, unlocked: false, description: 'Deep tunnels holding ancient secrets and dangers.', connections: ['darkForest', 'ruinedCastle'], unlockCondition: 'boss_forest' },
        { id: 'ruinedCastle', name: 'Ruined Castle', x: 470, y: 130, width: 90, height: 60, color: '#666666', threat: 3, unlocked: false, description: 'A crumbling fortress haunted by powerful undead.', connections: ['ancientCaves', 'shadowRealm'], unlockCondition: 'boss_lich' },
        { id: 'shadowRealm', name: 'Shadow Realm', x: 610, y: 160, width: 90, height: 60, color: '#aa44ff', threat: 4, unlocked: false, description: 'The domain of the Shadow Lord. Reality itself distorts here.', connections: ['ruinedCastle'], unlockCondition: 'boss_lich' },
        { id: 'secretArea', name: 'Hidden Shrine', x: 350, y: 50, width: 70, height: 40, color: '#ffeedd', threat: 3, unlocked: false, description: 'An ancient shrine hidden between dimensions.', connections: [], unlockCondition: 'find_remains' }
    ],

    updateUnlocks() {
        this.areas.forEach(function(area) {
            if (area.unlockCondition === null) {
                area.unlocked = true;
            } else {
                area.unlocked = Quest.isQuestDone(area.unlockCondition);
            }
        });
    },

    canTravel(fromArea, toArea) {
        var from = this.areas.find(function(a) { return a.id === fromArea; });
        var to = this.areas.find(function(a) { return a.id === toArea; });
        if (!from || !to) return false;
        if (!to.unlocked) return false;
        return from.connections.indexOf(toArea) !== -1;
    },

    travel(toArea) {
        if (!this.canTravel(currentArea, toArea)) return false;
        var to = this.areas.find(function(a) { return a.id === toArea; });
        if (!to) return false;
        var mapData = MapTileData[toArea] || ExpandedMapData[toArea];
        if (!mapData) return false;
        changeArea(toArea, mapData.playerStart.x, mapData.playerStart.y);
        return true;
    },

    getAreaInfo(areaId) {
        var area = this.areas.find(function(a) { return a.id === areaId; });
        return area || null;
    },

    getThreatColor(threat) {
        var colors = ['#44ff44', '#aaff44', '#ffaa44', '#ff6644', '#ff4444'];
        return colors[threat] || '#888888';
    },

    renderWorldMap(cx) {
        cx.fillStyle = '#0a0512';
        cx.fillRect(0, 0, 500, 350);

        cx.fillStyle = '#1a0a2e';
        cx.fillRect(0, 0, 500, 350);

        for (var i = 0; i < 50; i++) {
            var sx = (Math.sin(i * 0.7) * 200 + 250);
            var sy = (Math.cos(i * 1.1) * 150 + 175);
            cx.fillStyle = 'rgba(170,68,255,' + (0.05 + Math.sin(i) * 0.03) + ')';
            cx.beginPath();
            cx.arc(sx, sy, 2, 0, Math.PI * 2);
            cx.fill();
        }

        var self = this;
        this.areas.forEach(function(area) {
            if (!area.unlocked) {
                cx.fillStyle = '#2a2a2a';
                cx.fillRect(area.x, area.y, area.width, area.height);
                cx.strokeStyle = '#444444';
                cx.lineWidth = 1;
                cx.strokeRect(area.x, area.y, area.width, area.height);
                cx.fillStyle = '#666666';
                cx.font = '7px "Press Start 2P"';
                cx.textAlign = 'center';
                cx.fillText('???', area.x + area.width / 2, area.y + area.height / 2 + 3);
                return;
            }

            area.connections.forEach(function(connId) {
                var conn = self.areas.find(function(a) { return a.id === connId; });
                if (conn && conn.unlocked) {
                    cx.strokeStyle = 'rgba(201,169,89,0.3)';
                    cx.lineWidth = 2;
                    cx.beginPath();
                    cx.moveTo(area.x + area.width / 2, area.y + area.height / 2);
                    cx.lineTo(conn.x + conn.width / 2, conn.y + conn.height / 2);
                    cx.stroke();
                }
            });
        });

        this.areas.forEach(function(area) {
            if (!area.unlocked) return;

            var gradient = cx.createLinearGradient(area.x, area.y, area.x + area.width, area.y + area.height);
            gradient.addColorStop(0, area.color);
            gradient.addColorStop(1, area.color + '88');
            cx.fillStyle = gradient;
            cx.fillRect(area.x, area.y, area.width, area.height);

            cx.strokeStyle = '#c9a959';
            cx.lineWidth = 2;
            cx.strokeRect(area.x, area.y, area.width, area.height);

            cx.fillStyle = '#fff';
            cx.font = '8px "Press Start 2P"';
            cx.textAlign = 'center';
            cx.fillText(area.name, area.x + area.width / 2, area.y + area.height / 2 - 5);

            cx.fillStyle = self.getThreatColor(area.threat);
            cx.font = '6px "Press Start 2P"';
            var threatNames = ['Safe', 'Low', 'Medium', 'High', 'Extreme'];
            cx.fillText('Threat: ' + threatNames[area.threat], area.x + area.width / 2, area.y + area.height / 2 + 8);
        });

        var currentAreaData = this.areas.find(function(a) { return a.id === currentArea; });
        if (currentAreaData) {
            cx.fillStyle = '#ff4444';
            cx.beginPath();
            cx.arc(currentAreaData.x + currentAreaData.width / 2, currentAreaData.y - 12, 6, 0, Math.PI * 2);
            cx.fill();
            cx.fillStyle = '#ffffff';
            cx.font = '7px "Press Start 2P"';
            cx.fillText('YOU', currentAreaData.x + currentAreaData.width / 2, currentAreaData.y - 18);
        }
    },

    getTravelEncounterChance(fromArea, toArea) {
        var baseChance = 0.15;
        var toData = this.areas.find(function(a) { return a.id === toArea; });
        if (toData) baseChance += toData.threat * 0.05;
        return baseChance;
    },

    getAreaDescription(areaId) {
        var area = this.areas.find(function(a) { return a.id === areaId; });
        return area ? area.description : 'An unknown region.';
    }
};
/* ============================================================
   SECRET AREA SYSTEM
   ============================================================ */
const SecretAreaSystem = {
    secretBoss: {
        id: 99, name: 'Ancient Guardian', level: 25,
        phases: [
            { phase: 1, hp: 1500, atk: 48, def: 38, int: 42, spd: 14, skills: ['Holy Smite', 'Divine Shield', 'Radiant Burst', 'Sacred Flame'], dialogue: ['Prove your worth, mortal.', 'The light tests you!'], behavior: 'balanced' },
            { phase: 2, hp: 1200, atk: 55, def: 42, int: 50, spd: 16, skills: ['Judgment', 'Holy Nova', 'Divine Wrath', 'Resurrection', 'Celestial Beam'], dialogue: ['You are worthy!', 'The light embraces you!'], behavior: 'magic_heavy' },
            { phase: 3, hp: 800, atk: 65, def: 35, int: 58, spd: 20, skills: ['Final Judgment', 'Apocalypse', 'Time Stop', 'Holy Inferno', 'Phoenix Rising'], dialogue: ['The ultimate test!', 'SHINE BRIGHTLY!'], behavior: 'ultimate' }
        ],
        spriteColors: ['#ffeedd', '#ffcc88', '#ffffff', '#ffd700']
    },
    discovered: false,

    checkDiscovery() {
        if (this.discovered) return;
        if (Quest.isQuestDone(12)) {
            this.discovered = true;
            WorldMap.areas.find(function(a) { return a.id === 'secretArea'; }).unlocked = true;
        }
    },

    startSecretBoss() {
        if (!this.discovered) return;
        var boss = new Boss(99);
        boss.phases = this.secretBoss.phases.map(function(p) { return Object.assign({}, p); });
        boss.templateId = 99;
        boss.name = this.secretBoss.name;
        boss.level = this.secretBoss.level;
        boss.spriteColors = this.secretBoss.spriteColors;
        Combat.startBattle([], true, 99);
    }
};
/* ============================================================
   RARE ITEM DROPS & SPECIAL LOOT
   ============================================================ */
const RareDropSystem = {
    rareDrops: [
        { itemId: 708, chance: 2, area: 'ruinedCastle', description: 'Phoenix Ring - auto-revive once per battle' },
        { itemId: 709, chance: 1, area: 'shadowRealm', description: 'Dragon Tooth Necklace - boosts all stats' },
        { itemId: 712, chance: 1, area: 'shadowRealm', description: 'Amulet of Power - greatly boosts attack' },
        { itemId: 107, chance: 1, area: 'shadowRealm', description: 'Holy Blade - blessed sword' },
        { itemId: 207, chance: 1, area: 'ruinedCastle', description: 'Celestial Staff - cosmic power' },
        { itemId: 307, chance: 1, area: 'shadowRealm', description: 'Death Fang - cursed dagger' },
        { itemId: 407, chance: 0.5, area: 'shadowRealm', description: 'Holy Plate - divinely blessed armor' },
        { itemId: 506, chance: 0.5, area: 'ruinedCastle', description: 'Celestial Robe - starlight woven' },
        { itemId: 606, chance: 0.5, area: 'shadowRealm', description: 'Phantom Shroud - legendary garb' },
        { itemId: 713, chance: 0.5, area: 'shadowRealm', description: 'Elemental Ring - all element resistance' }
    ],

    checkRareDrop(enemyArea) {
        var drops = this.rareDrops.filter(function(d) { return d.area === enemyArea; });
        for (var i = 0; i < drops.length; i++) {
            if (Math.random() * 100 < drops[i].chance) {
                return drops[i];
            }
        }
        return null;
    },

    getDropMessage(drop) {
        return 'Rare drop! Obtained ' + drop.description + '!';
    }
};
/* ============================================================
   COMBO ATTACK SYSTEM
   ============================================================ */
const ComboAttackSystem = {
    combos: [
        { name: 'Blade Fury', classReq: CharacterClass.WARRIOR, skillIds: [0, 1], bonusPower: 1.5, description: 'Chain Power Strike into Cleave for massive damage.' },
        { name: 'Shield Breaker', classReq: CharacterClass.WARRIOR, skillIds: [4, 5], bonusPower: 1.4, description: 'Shield Bash into Iron Wall for defensive offense.' },
        { name: 'War Cry Rampage', classReq: CharacterClass.WARRIOR, skillIds: [8, 11], bonusPower: 1.6, description: 'Battle Cry into Berserker Rage for unstoppable force.' },
        { name: 'Fire Combo', classReq: CharacterClass.MAGE, skillIds: [12, 13], bonusPower: 1.5, description: 'Chain Fireball into Fire Storm for fiery devastation.' },
        { name: 'Ice Lock', classReq: CharacterClass.MAGE, skillIds: [16, 17], bonusPower: 1.4, description: 'Ice Shard into Blizzard for frozen enemies.' },
        { name: 'Arcane Overload', classReq: CharacterClass.MAGE, skillIds: [20, 21], bonusPower: 1.6, description: 'Magic Missile into Arcane Burst for arcane explosion.' },
        { name: 'Shadow Strike Combo', classReq: CharacterClass.ROGUE, skillIds: [24, 25], bonusPower: 1.5, description: 'Backstab into Shadow Strike for deadly shadows.' },
        { name: 'Venom Chain', classReq: CharacterClass.ROGUE, skillIds: [28, 29], bonusPower: 1.4, description: 'Poison Blade into Toxic Cloud for poison plague.' },
        { name: 'Lucky Jackpot', classReq: CharacterClass.ROGUE, skillIds: [32, 33], bonusPower: 1.8, description: 'Lucky Strike into Steal for wealth and damage.' }
    ],

    canUseCombo(skillIds) {
        var playerSkills = player.skills;
        for (var i = 0; i < skillIds.length; i++) {
            if (playerSkills.indexOf(skillIds[i]) === -1) return false;
        }
        return true;
    },

    getAvailableCombos() {
        var self = this;
        return this.combos.filter(function(c) {
            return c.classReq === player.classId && self.canUseCombo(c.skillIds);
        });
    },

    executeCombo(combo, target) {
        var totalDmg = 0;
        for (var i = 0; i < combo.skillIds.length; i++) {
            var skill = SkillDatabase.find(function(s) { return s.id === combo.skillIds[i]; });
            if (!skill) continue;
            player.mp -= skill.mpCost;
            var dmg = (player.getStat(skill.type === 'magical' ? 'int' : 'atk') + skill.power) * combo.bonusPower;
            var actual = target.takeDamage(Math.floor(dmg));
            totalDmg += actual;
            CombatLog.add(skill.name + ' hits for ' + actual + ' damage!');
        }
        CombatLog.add('COMBO ' + combo.name + '! Total damage: ' + totalDmg + '!');
        return totalDmg;
    }
};
/* ============================================================
   ENVIRONMENTAL HAZARDS SYSTEM
   ============================================================ */
const HazardSystem = {
    hazardDamage: {
        lava: { damage: 15, statusEffect: StatusEffect.BURN, statusChance: 50, message: 'The lava burns you!' },
        shadow: { damage: 10, statusEffect: StatusEffect.BLIND, statusChance: 30, message: 'Shadow energy corrodes your body!' },
        poison_swamp: { damage: 8, statusEffect: StatusEffect.POISON, statusChance: 60, message: 'Toxic swamp water poisons you!' },
        ice_floor: { damage: 5, statusEffect: StatusEffect.FREEZE, statusChance: 40, message: 'The icy ground numbs your feet!' },
        lightning_field: { damage: 12, statusEffect: StatusEffect.STUN, statusChance: 25, message: 'Lightning arcs across the field!' }
    },

    checkHazard(areaName, x, y) {
        var mapData = ExpandedMapData[areaName] || MapTileData[areaName];
        if (!mapData || !mapData.hazards) return null;
        for (var i = 0; i < mapData.hazards.length; i++) {
            var h = mapData.hazards[i];
            if (h.x === x && h.y === y) {
                return this.hazardDamage[h.type] || null;
            }
        }
        return null;
    },

    applyHazardDamage(hazard) {
        if (!hazard || !player) return;
        var actual = player.takeDamage(hazard.damage);
        CombatLog.add(hazard.message + ' ' + actual + ' damage taken!');
        if (hazard.statusEffect && Math.random() * 100 < hazard.statusChance) {
            player.statusEffects.push({ type: hazard.statusEffect, turns: 3 });
            CombatLog.add('Afflicted with ' + STATUS_NAMES[hazard.statusEffect] + '!');
        }
        UI.updateHUD();
    }
};
/* ============================================================
   DAY/NIGHT CYCLE SYSTEM
   ============================================================ */
const DayNightSystem = {
    cycleDuration: 300,
    currentCycle: 0,
    isNight: false,
    timePhase: 'day',

    update(dt) {
        this.currentCycle += dt;
        if (this.currentCycle >= this.cycleDuration) {
            this.currentCycle -= this.cycleDuration;
        }
        var progress = this.currentCycle / this.cycleDuration;
        if (progress < 0.4) {
            this.timePhase = 'day';
            this.isNight = false;
        } else if (progress < 0.5) {
            this.timePhase = 'dusk';
            this.isNight = false;
        } else if (progress < 0.9) {
            this.timePhase = 'night';
            this.isNight = true;
        } else {
            this.timePhase = 'dawn';
            this.isNight = false;
        }
    },

    getTimeLabel() {
        var labels = { day: 'Day', dusk: 'Dusk', night: 'Night', dawn: 'Dawn' };
        return labels[this.timePhase] || 'Day';
    },

    getEncounterModifier() {
        if (this.timePhase === 'night') return 1.4;
        if (this.timePhase === 'dusk') return 1.2;
        if (this.timePhase === 'dawn') return 0.9;
        return 1.0;
    },

    getExpModifier() {
        if (this.timePhase === 'night') return 1.3;
        if (this.timePhase === 'dusk') return 1.1;
        return 1.0;
    },

    getGoldModifier() {
        if (this.timePhase === 'night') return 1.2;
        return 1.0;
    },

    isNPCAvailable(npcId) {
        if (this.timePhase === 'night') {
            if (npcId === 3 || npcId === 4) return false;
        }
        return true;
    },

    getOverlayColor() {
        if (this.timePhase === 'night') return 'rgba(0,0,40,0.3)';
        if (this.timePhase === 'dusk') return 'rgba(40,20,0,0.15)';
        if (this.timePhase === 'dawn') return 'rgba(40,20,40,0.1)';
        return 'rgba(0,0,0,0)';
    },

    renderOverlay(cx) {
        var color = this.getOverlayColor();
        if (color === 'rgba(0,0,0,0)') return;
        cx.fillStyle = color;
        cx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
};
/* ============================================================
   EXPANDED NPC DATABASE ENTRIES
   ============================================================ */
const ExpandedNPCDialogues = {
    0: {
        expanded_default: { text: 'The shadows grow longer with each passing day. I sense great potential within you, young hero. What would you like to know?', choices: [
            {text: 'Tell me about the world.', next: 'elder_aldric_deep'},
            {text: 'Any advice for my journey?', next: 'elder_preparation'},
            {text: 'I will fight the darkness.', next: 'quest_offer'}
        ]}
    },
    1: {
        expanded_default: { text: 'Welcome back! My forge burns hot today. I can repair your gear, upgrade your weapons, or just chat about metallurgy.', choices: [
            {text: 'Tell me about forging.', next: 'marcus_forging'},
            {text: 'Any tips for battle?', next: 'marcus_tips'},
            {text: 'Show me your wares.', next: 'shop'}
        ]}
    },
    2: {
        expanded_default: { text: 'Peace be upon you. The light guides my healing hands. Let me know how I can help.', choices: [
            {text: 'Tell me about healing arts.', next: 'lyra_ancient_medicine'},
            {text: 'Heal my wounds.', next: 'heal'},
            {text: 'Tell me about the world.', next: 'lyra_world_lore'}
        ]}
    },
    3: {
        expanded_default: { text: 'Everything has a price, adventurer! But I promise my goods are worth every gold coin.', choices: [
            {text: 'Show me your best items.', next: 'fiona_rare_items'},
            {text: 'Any bargains today?', next: 'fiona_bargains'},
            {text: 'Heard any rumors?', next: 'fiona_rumor'}
        ]}
    },
    4: {
        expanded_default: { text: 'Welcome to the Whispering Rest! A warm bed and a hot meal await. Care to rest up?', choices: [
            {text: 'Rest and recover.', next: 'rest'},
            {text: 'Any stories to tell?', next: 'thomas_inn_stories'},
            {text: 'What news from the road?', next: 'thomas_forest_news'}
        ]}
    },
    5: {
        expanded_default: { text: 'Welcome, warrior! The path of combat is long but rewarding. Let me show you what I can teach.', choices: [
            {text: 'Teach me new skills.', next: 'rhea_advanced_training'},
            {text: 'Tell me about combat.', next: 'rhea_combat_tips'},
            {text: 'Any training quests?', next: 'quest'}
        ]}
    },
    6: {
        expanded_default: { text: 'You sense an otherworldly presence about this figure. They seem to know more than they let on.', choices: [
            {text: 'Tell me about this realm.', next: 'stranger_dimension'},
            {text: 'What do you know about the Shadow Lord?', next: 'purpose'},
            {text: 'I must go.', next: null}
        ]}
    }
};
/* ============================================================
   ENHANCED MAP SYSTEM - Integrates Expanded Maps
   ============================================================ */
const EnhancedMapSystem = {
    init() {
        Object.keys(ExpandedMapData).forEach(function(key) {
            if (!MapTileData[key]) {
                MapTileData[key] = ExpandedMapData[key];
            }
        });
    },

    getMapData(areaName) {
        return MapTileData[areaName] || ExpandedMapData[areaName] || null;
    },

    getMapWidth(areaName) {
        var data = this.getMapData(areaName);
        return data ? data.width : 0;
    },

    getMapHeight(areaName) {
        var data = this.getMapData(areaName);
        return data ? data.height : 0;
    },

    getTileSafe(areaName, x, y) {
        var data = this.getMapData(areaName);
        if (!data || x < 0 || y < 0 || x >= data.width || y >= data.height) return TileType.WALL;
        return data.tiles[y * data.width + x];
    },

    getNPCsAt(areaName, x, y) {
        var data = this.getMapData(areaName);
        if (!data || !data.npcs) return [];
        return data.npcs.filter(function(npc) { return npc.x === x && npc.y === y; });
    },

    getChestAt(areaName, x, y) {
        var data = this.getMapData(areaName);
        if (!data || !data.chests) return null;
        return data.chests.find(function(c) { return c.x === x && c.y === y; }) || null;
    },

    checkEnvironmentalHazard(areaName, x, y) {
        var data = this.getMapData(areaName);
        if (!data || !data.hazards) return null;
        return data.hazards.find(function(h) { return h.x === x && h.y === y; }) || null;
    }
};
/* ============================================================
   INTEGRATION BRIDGE - Connects New Systems to Existing Code
   ============================================================ */
const IntegrationBridge = {
    init() {
        EnhancedMapSystem.init();
        SecretAreaSystem.checkDiscovery();
        WorldMap.updateUnlocks();
    },

    onAreaChange(areaName) {
        WorldMap.updateUnlocks();
        SecretAreaSystem.checkDiscovery();
        var areaInfo = WorldMap.getAreaInfo(areaName);
        if (areaInfo) {
            document.getElementById('hud-location').textContent = areaInfo.name;
        }
    },

    onEnemyDefeated(enemyId, areaName) {
        var enemy = EnemyDatabase.find(function(e) { return e.id === enemyId; });
        if (!enemy) return;
        var rareDrop = RareDropSystem.checkRareDrop(areaName);
        if (rareDrop) {
            player.addItem(rareDrop.itemId, 1);
            CombatLog.add(RareDropSystem.getDropMessage(rareDrop));
        }
    },

    onPlayerMove(areaName, x, y) {
        var hazard = HazardSystem.checkHazard(areaName, x, y);
        if (hazard) {
            HazardSystem.applyHazardDamage(hazard);
        }
    },

    onBattleVictory(exp, gold) {
        var expMod = DayNightSystem.getExpModifier();
        var goldMod = DayNightSystem.getGoldModifier();
        if (expMod !== 1.0) {
            var bonusExp = Math.floor(exp * (expMod - 1));
            player.gainExp(bonusExp);
            CombatLog.add('Night bonus: +' + bonusExp + ' EXP!');
        }
        if (goldMod !== 1.0) {
            var bonusGold = Math.floor(gold * (goldMod - 1));
            player.gold += bonusGold;
            CombatLog.add('Night bonus: +' + bonusGold + ' Gold!');
        }
    },

    getDialogueKey(npcId) {
        var expanded = ExpandedNPCDialogues[npcId];
        if (!expanded) return 'default';
        if (DayNightSystem.isNight && expanded.night_default) return 'night_default';
        if (expanded.expanded_default) return 'expanded_default';
        return 'default';
    },

    renderDayNightOverlay(cx) {
        DayNightSystem.renderOverlay(cx);
    },

    update(dt) {
        DayNightSystem.update(dt);
    }
};
