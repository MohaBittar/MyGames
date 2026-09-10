/* ============================================================
   EXPANDED DIALOGUE TREES - Full NPC Conversations
   ============================================================ */
const ExpandedDialogues = {
    elder_aldric_deep: {
        text: 'The ancient texts speak of a hero who would rise when darkness returns. I believe that hero is you.',
        choices: [
            {text: 'Tell me about the Shadow Lord.', next: 'elder_shadow_lore'},
            {text: 'What is the seal?', next: 'elder_seal_lore'},
            {text: 'How can I prepare?', next: 'elder_preparation'},
            {text: 'Farewell.', next: null}
        ]
    },
    elder_shadow_lore: {
        text: 'The Shadow Lord was once a mortal sorcerer who sought to command the void between dimensions. His ambition twisted him into something other. He commanded armies of shadow creatures and nearly consumed the world.',
        choices: [
            {text: 'How was he defeated?', next: 'elder_seal_lore'},
            {text: 'What are his weaknesses?', next: 'elder_weakness'},
            {text: 'I understand.', next: null}
        ]
    },
    elder_seal_lore: {
        text: 'Five ancient guardians bound the Shadow Lord using the Crystals of Dawn. But time erodes all things. The seal weakens with each passing year. You must find the crystals and reforge the binding before it shatters completely.',
        choices: [
            {text: 'Where are the crystals?', next: 'elder_crystal_location'},
            {text: 'I will find them.', next: null}
        ]
    },
    elder_weakness: {
        text: 'The Shadow Lord draws power from fear and despair. Holy magic and light-based attacks are his greatest enemies. Also the bonds of friendship between companions can repel his influence. Never fight alone in spirit.',
        choices: [
            {text: 'Thank you for the wisdom.', next: null}
        ]
    },
    elder_crystal_location: {
        text: 'Three crystals are hidden in the Ancient Caves, two in the Ruined Castle, and the last in the Shadow Realm itself. You will need great strength to retrieve them all.',
        choices: [
            {text: 'I will begin my search.', next: null}
        ]
    },
    elder_preparation: {
        text: 'Train with Rhea to unlock your full potential. Stock up on potions from Fiona. And speak with Marcus about upgrading your equipment. The road ahead is perilous.',
        choices: [
            {text: 'Thank you, Elder.', next: null}
        ]
    },
    marcus_forging: {
        text: 'If you bring me rare materials, I can forge legendary equipment. Dragon scales, mythril ore, shadow crystals bring them to me and I will create weapons worthy of a true hero.',
        choices: [
            {text: 'What materials do you need?', next: 'marcus_materials'},
            {text: 'Show me your shop.', next: 'shop'},
            {text: 'Farewell.', next: null}
        ]
    },
    marcus_materials: {
        text: 'Dragon scales from Fire Drakes, mythril ore from deep caves, and shadow crystals from the Shadow Realm. Each requires 3 of the same material. Bring them to me and I will forge something extraordinary.',
        choices: [
            {text: 'I will find them.', next: null}
        ]
    },
    marcus_battle_wounds: {
        text: 'You have seen much battle. Let me check your equipment. It pays to keep your gear in top shape.',
        choices: [
            {text: 'Can you repair my gear?', next: 'marcus_repair'},
            {text: 'Any tips for combat?', next: 'marcus_tips'},
            {text: 'Just visiting.', next: null}
        ]
    },
    marcus_repair: {
        text: 'Your equipment looks serviceable. But if it breaks in battle you will be in trouble. Keep spare weapons and armor in your inventory, or visit me often for replacements.',
        choices: [
            {text: 'Good advice.', next: null}
        ]
    },
    marcus_tips: {
        text: 'Each enemy has weaknesses. Use elements to your advantage. Fire burns organic creatures. Ice freezes fast enemies. Lightning shatters metal golems. And shadows are vulnerable to holy power.',
        choices: [
            {text: 'Useful information.', next: null}
        ]
    },
    lyra_ancient_medicine: {
        text: 'I have been studying the ancient healing arts. There are techniques that can cure even the most dire ailments. But I need specific ingredients from the wild.',
        choices: [
            {text: 'What ingredients?', next: 'lyra_ingredients'},
            {text: 'Heal me.', next: 'heal'},
            {text: 'Tell me about status effects.', next: 'lyra_status'},
            {text: 'Goodbye.', next: null}
        ]
    },
    lyra_ingredients: {
        text: 'Moon herbs from the dark forest, cave moss from the ancient caves, and shadow essence from the shadow realm. Each has unique healing properties when properly combined.',
        choices: [
            {text: 'I will gather them.', next: null}
        ]
    },
    lyra_status: {
        text: 'Poison drains HP over time. Burns deal fire damage. Freeze stops you from acting. Stun leaves you vulnerable. And blindness reduces accuracy. Carry remedies and antidotes at all times!',
        choices: [
            {text: 'I will be prepared.', next: null}
        ]
    },
    lyra_world_lore: {
        text: 'Before the Shadow Lord rose, this land was called the Realm of Dawn. The sun never set, and magic flowed freely. Now the sky grows darker each year. Only by defeating the Shadow Lord can we restore the light.',
        choices: [
            {text: 'The realm of dawn...', next: 'lyra_dawn_details'},
            {text: 'How did it fall?', next: 'lyra_fall_story'},
            {text: 'I see.', next: null}
        ]
    },
    lyra_dawn_details: {
        text: 'The Crystal Tower at the heart of the realm once amplified the sun power. It still stands in the Shadow Realm, but corrupted. Perhaps if you can reach it, the light can be restored.',
        choices: [
            {text: 'Crystal Tower...', next: null}
        ]
    },
    lyra_fall_story: {
        text: 'A scholar named Mordecai discovered forbidden texts about the void. He tried to harness its power and was consumed. What emerged was no longer human. It was the Shadow Lord.',
        choices: [
            {text: 'A tragic tale.', next: null}
        ]
    },
    fiona_rare_items: {
        text: 'I just got a special shipment! Rare items from distant lands. Take a look before they are gone!',
        choices: [
            {text: 'Show me the rare items.', next: 'shop'},
            {text: 'Where do you get these?', next: 'fiona_sources'},
            {text: 'Not now.', next: null}
        ]
    },
    fiona_sources: {
        text: 'Travelers bring them from far-off kingdoms. Some are salvaged from ancient ruins. Others are well let us just say I have my contacts. Everything is guaranteed authentic!',
        choices: [
            {text: 'Interesting.', next: null}
        ]
    },
    fiona_bargains: {
        text: 'Buy in bulk and save! I offer discounts on potions and ethers when you buy five or more. A smart adventurer always stocks up.',
        choices: [
            {text: 'Let me see your wares.', next: 'shop'},
            {text: 'Any quests?', next: 'quest'},
            {text: 'Goodbye.', next: null}
        ]
    },
    fiona_rumor: {
        text: 'I heard there is a secret chamber beneath the castle. They say it contains treasures beyond imagination. But also dangers that would make a dragon tremble.',
        choices: [
            {text: 'A secret chamber?', next: 'fiona_chamber_info'},
            {text: 'Sounds dangerous.', next: null}
        ]
    },
    fiona_chamber_info: {
        text: 'Somewhere on the lowest floor of the Ruined Castle, behind a hidden door. Only the bravest warriors have attempted to find it. None have returned yet.',
        choices: [
            {text: 'I will look for it.', next: null}
        ]
    },
    thomas_inn_stories: {
        text: 'I have heard many tales from travelers. Would you like to hear one? The story of the Shadow Knight who wanders the castle halls seeking redemption.',
        choices: [
            {text: 'Tell me the story.', next: 'thomas_shadow_knight'},
            {text: 'Any news about the forest?', next: 'thomas_forest_news'},
            {text: 'Rest here.', next: 'rest'},
            {text: 'Not now.', next: null}
        ]
    },
    thomas_shadow_knight: {
        text: 'They say a noble knight was betrayed and killed within the castle walls. His spirit could not rest, bound by grief and rage. Now he wanders the halls, attacking all who enter. But I wonder could he be saved?',
        choices: [
            {text: 'Perhaps I can help him.', next: null},
            {text: 'Tragic.', next: null}
        ]
    },
    thomas_forest_news: {
        text: 'Hunters report the wolves are more aggressive than usual. Something is stirring them up. The deeper you go into the forest, the more dangerous it becomes.',
        choices: [
            {text: 'I will be careful.', next: null}
        ]
    },
    rhea_advanced_training: {
        text: 'You have come far, but there is still much to learn. I can teach you advanced techniques if you have the skill points. Each branch of combat has its own secrets.',
        choices: [
            {text: 'Show me advanced skills.', next: 'train'},
            {text: 'Tell me about skill branches.', next: 'rhea_branches'},
            {text: 'Any quests?', next: 'quest'},
            {text: 'Not now.', next: null}
        ]
    },
    rhea_branches: {
        text: 'Warriors can specialize in Blade for pure damage, Fortress for defense and counter, or War Cry for party buffs. Mages choose between Fire, Ice, or Arcane. Rogues master Shadow, Poison, or Fortune.',
        choices: [
            {text: 'Which is best?', next: 'rhea_best_branch'},
            {text: 'Thank you.', next: null}
        ]
    },
    rhea_best_branch: {
        text: 'None is truly best. It depends on your playstyle. Blade for aggressive warriors, Fortress for tanking, War Cry for support. Each has its place. Mix and match to find your perfect build.',
        choices: [
            {text: 'I understand.', next: null}
        ]
    },
    rhea_combat_tips: {
        text: 'Remember: speed determines turn order. A fast character can act twice before a slow one. Status effects can turn the tide of battle. Use them wisely.',
        choices: [
            {text: 'Good to know.', next: null}
        ]
    },
    stranger_dimension: {
        text: 'The Shadow Realm exists between dimensions. Time and space behave differently there. What feels like hours might be days in the real world. Be warned.',
        choices: [
            {text: 'How do I survive it?', next: 'stranger_survival'},
            {text: 'Tell me about the crystals.', next: 'purpose'},
            {text: 'I see.', next: null}
        ]
    },
    stranger_survival: {
        text: 'Holy magic is your best friend there. Stock up on elixirs and remedies. The shadow creatures are relentless. And above all do not let the void consume your thoughts. Stay focused on your goal.',
        choices: [
            {text: 'I will remember.', next: null}
        ]
    }
};
/* ============================================================
   DIALOGUE ENHANCEMENT - Hint System Per Area
   ============================================================ */
const AreaHints = {
    village: [
        'Talk to the Elder to learn about your quest.',
        'Visit the innkeeper to rest and recover.',
        'Stock up on potions before venturing out.',
        'The blacksmith can upgrade your equipment.',
        'The healer can cure your status effects for free.'
    ],
    darkForest: [
        'Wolves are weak to fire magic.',
        'Goblins can steal items - defeat them quickly.',
        'Watch for hidden paths between the trees.',
        'The Forest Guardian is ahead - be prepared.',
        'Collect herbs and pelts for side quests.'
    ],
    ancientCaves: [
        'Stone Golems are slow but hit very hard.',
        'Crystal Spiders can freeze you - bring antidotes.',
        'The underground lake has hidden treasures.',
        'Trolls have high HP but low magic defense.',
        'The Lich King awaits in the deepest chamber.'
    ],
    ruinedCastle: [
        'Gargoyles are immune to physical damage when stoned.',
        'Ghosts can phase through attacks sometimes.',
        'The Haunted Knight may be at peace if you help him.',
        'Fire Drakes are vulnerable to ice.',
        'The path to the Shadow Realm is beyond the throne room.'
    ],
    shadowRealm: [
        'Shadow creatures are weak to holy magic.',
        'Void Walkers can teleport behind you.',
        'Dark Paladins hit hard and have high defense.',
        'The Shadow Lord commands all elements in later phases.',
        'Stay focused - the void tries to break your will.'
    ]
};
