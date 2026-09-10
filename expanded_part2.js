/* ============================================================
   EXPANDED ENCOUNTER TABLES - Area Enemies with Rates
   ============================================================ */
const EncounterTables = {
    village: {
        encounters: [],
        encounterRate: 0,
        minEnemies: 0,
        maxEnemies: 0,
        bossZone: null,
        description: 'A peaceful village. No monsters here.'
    },
    darkForest: {
        encounters: [
            { id: 1, weight: 25, level: [1, 4] },
            { id: 9, weight: 20, level: [1, 3] },
            { id: 2, weight: 20, level: [2, 5] },
            { id: 3, weight: 15, level: [2, 5] },
            { id: 4, weight: 10, level: [3, 6] },
            { id: 5, weight: 5, level: [4, 7] },
            { id: 0, weight: 15, level: [1, 2] },
            { id: 7, weight: 8, level: [4, 6] },
            { id: 8, weight: 8, level: [4, 6] },
            { id: 10, weight: 5, level: [4, 7] }
        ],
        encounterRate: 0.06,
        minEnemies: 1,
        maxEnemies: 3,
        bossZone: { x: 13, y: 8, w: 4, h: 4, bossId: 0, trigger: 'boss_forest' },
        description: 'Dense trees and winding paths. Tread carefully.'
    },
    ancientCaves: {
        encounters: [
            { id: 12, weight: 15, level: [9, 13] },
            { id: 13, weight: 20, level: [9, 12] },
            { id: 17, weight: 15, level: [11, 14] },
            { id: 20, weight: 12, level: [11, 14] },
            { id: 21, weight: 10, level: [10, 13] },
            { id: 23, weight: 12, level: [12, 14] },
            { id: 15, weight: 5, level: [12, 14] },
            { id: 16, weight: 3, level: [13, 15] },
            { id: 22, weight: 3, level: [12, 14] },
            { id: 14, weight: 5, level: [11, 13] }
        ],
        encounterRate: 0.08,
        minEnemies: 1,
        maxEnemies: 3,
        bossZone: { x: 13, y: 8, w: 4, h: 4, bossId: 1, trigger: 'boss_lich' },
        description: 'Echoing tunnels and crystalline formations.'
    },
    ruinedCastle: {
        encounters: [
            { id: 24, weight: 15, level: [17, 21] },
            { id: 25, weight: 15, level: [18, 21] },
            { id: 26, weight: 10, level: [19, 22] },
            { id: 27, weight: 12, level: [20, 23] },
            { id: 28, weight: 12, level: [19, 22] },
            { id: 29, weight: 8, level: [21, 24] },
            { id: 30, weight: 10, level: [20, 23] },
            { id: 31, weight: 8, level: [21, 24] },
            { id: 32, weight: 5, level: [19, 22] },
            { id: 33, weight: 5, level: [18, 21] },
            { id: 34, weight: 3, level: [22, 24] },
            { id: 35, weight: 4, level: [23, 25] }
        ],
        encounterRate: 0.07,
        minEnemies: 1,
        maxEnemies: 2,
        bossZone: null,
        description: 'Crumbling halls filled with restless undead.'
    },
    shadowRealm: {
        encounters: [
            { id: 36, weight: 15, level: [25, 29] },
            { id: 37, weight: 12, level: [26, 28] },
            { id: 38, weight: 12, level: [27, 29] },
            { id: 39, weight: 8, level: [28, 30] },
            { id: 40, weight: 10, level: [27, 29] },
            { id: 42, weight: 10, level: [28, 30] },
            { id: 43, weight: 10, level: [28, 30] },
            { id: 44, weight: 8, level: [29, 30] },
            { id: 45, weight: 8, level: [29, 30] },
            { id: 46, weight: 7, level: [28, 30] },
            { id: 41, weight: 3, level: [29, 30] }
        ],
        encounterRate: 0.09,
        minEnemies: 1,
        maxEnemies: 2,
        bossZone: { x: 15, y: 0, w: 2, h: 3, bossId: 2, trigger: 'boss_shadow' },
        description: 'Reality warps in this dimension of pure darkness.'
    }
};
/* ============================================================
   ENCOUNTER GENERATION SYSTEM
   ============================================================ */
const EncounterSystem = {
    generateEncounter(areaName) {
        var table = EncounterTables[areaName];
        if (!table || table.encounters.length === 0) return null;
        var totalWeight = 0;
        table.encounters.forEach(function(enc) { totalWeight += enc.weight; });
        var roll = Math.random() * totalWeight;
        var cumulative = 0;
        var selected = table.encounters[0];
        for (var i = 0; i < table.encounters.length; i++) {
            cumulative += table.encounters[i].weight;
            if (roll <= cumulative) {
                selected = table.encounters[i];
                break;
            }
        }
        var count = table.minEnemies + Math.floor(Math.random() * (table.maxEnemies - table.minEnemies + 1));
        var enemyIds = [];
        for (var j = 0; j < count; j++) {
            enemyIds.push(selected.id);
        }
        return { enemyIds: enemyIds, isBoss: false };
    },
    generateBossEncounter(areaName) {
        var table = EncounterTables[areaName];
        if (!table || !table.bossZone) return null;
        if (Quest.isQuestDone(table.bossZone.trigger)) return null;
        return { enemyIds: [], isBoss: true, bossId: table.bossZone.bossId };
    },
    isBossZone(areaName, px, py) {
        var table = EncounterTables[areaName];
        if (!table || !table.bossZone) return false;
        var bz = table.bossZone;
        return px >= bz.x && px < bz.x + bz.w && py >= bz.y && py < bz.y + bz.h;
    },
    getAreaThreatLevel(areaName) {
        var threats = {
            village: 0, darkForest: 1, ancientCaves: 2,
            ruinedCastle: 3, shadowRealm: 4
        };
        return threats[areaName] || 0;
    },
    getEncounterRateModifier(areaName) {
        var mod = 1.0;
        if (GameEngine.getTimeOfDay() === 'night') mod = 1.3;
        else if (GameEngine.getTimeOfDay() === 'dusk') mod = 1.15;
        return mod;
    }
};
