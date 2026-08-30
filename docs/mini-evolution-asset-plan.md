# CY PETS LAND Mini Evolution Asset Plan

## Rules

- Mini evolution is the middle form between the current pet card and the final evolution card.
- Existing equipment counts stay unchanged.
- A 4-piece exclusive set unlocks mini evolution after 2 equipped items.
- A 6-piece exclusive set unlocks mini evolution after 3 equipped items.
- Final evolution is only available after mini evolution plus the full exclusive set.
- Sanrio and Popmart pets do not need redesigned cute final evolution cards for now. They only need mini evolution cards.
- Fluffbit also skips the separate cute final evolution card because its existing final evolution is already cute.
- Mini evolution must never look better, bigger, or more complete than the cute final evolution route. It should feel like an early half-set upgrade, not the reward for choosing the Q-style final route.
- Output target for generated mini cards: `assets/roles/mini-evolved/<petId>.png`
- Final card size: 1920 x 1080, landscape 16:9.
- No text, no logo, no watermark, no UI inside generated role cards.

## Generation Prompt Template

Use this structure for every mini evolution image:

```text
Use case: stylized-concept
Asset type: CY PETS LAND mini evolution role card, landscape 16:9, final asset 1920x1080.
Input images: Image 1 is the original pet form; Image 2 is the final evolved form reference; Image 3 is the cute final evolution reference when available.
Primary request: Create the mini evolution form of <pet name>. It should look clearly stronger than Image 1, but not as complete or powerful as Image 2.
Visual rule: keep the recognizable identity, colors, face shape, main creature type, and signature accessories. Add only early-stage evolved details such as small armor pieces, first crown/halo/horns/wings, beginner weapon, glowing gem, mild aura, or partial outfit.
Hierarchy rule: if Image 3 exists, the mini evolution must be simpler, smaller, less decorated, and less spectacular than Image 3.
Composition: full body visible, centered, big readable character, enough background for a role card, no cropping of important parts.
Style: cute, polished, child-friendly fantasy game card. It must feel collectible and suitable for primary school students.
Constraints: no text, no logo, no watermark, no UI, no extra unrelated characters. Do not make it look like the final form yet.
```

## Pet-by-Pet Plan

| Pet ID | Series | Equipment | Mini unlock | Before input | Final reference | Mini evolution direction |
| --- | --- | ---: | ---: | --- | --- | --- |
| sunny-wing | Bit Pets | 4 | 2 | `assets/roles/sunny-wing-a.png` | `assets/roles/evolved/sunny-wing.png` | Small phoenix chick becomes a young dawn phoenix with brighter wing tips, tiny halo, and first feather blade. |
| sprouty | Bit Pets | 4 | 2 | `assets/roles/sprouty-a.png` | `assets/roles/evolved/sprouty.png` | Seedling becomes a sturdy forest sprout guardian with larger leaves, bark shoulder pads, and a small leaf shield. |
| hydroblob | Bit Pets | 4 | 2 | `assets/roles/hydroblob-a.png` | `assets/roles/evolved/hydroblob.png` | Water blob becomes a baby water-drake blob with tiny fins, small horns, and a swirling water orb. |
| fluffbit | Bit Pets | 4 | 2 | `assets/roles/fluffbit-a.png` | `assets/roles/evolved/fluffbit.png` | Fluffy companion becomes a cloud-soft apprentice with bigger ears, tiny charm crown, and floating cotton puffs. |
| shadow-wing | Bit Pets | 6 | 3 | `assets/roles/shadow-wing-r.png` | `assets/roles/evolved/shadow-wing.png` | Dark bird/bat becomes a young shadow wyvern with short crystal horns, sharper wings, and controlled purple aura. |
| flame-rex | Bit Pets | 6 | 3 | `assets/roles/flame-rex-sr.png` | `assets/roles/evolved/flame-rex.png` | Fire dino becomes a teen lava rex with small horns, glowing claws, and a playful flame tail. |
| thunder-beetle | Bit Pets | 6 | 3 | `assets/roles/thunder-beetle-ssr.png` | `assets/roles/evolved/thunder-beetle.png` | Beetle becomes a young armored thunder beetle with early reactor shell, small lightning antenna, and blue-gold sparks. |
| frost-fang | Bit Pets | 6 | 3 | `assets/roles/frost-fang-ssr.png` | `assets/roles/evolved/frost-fang.png` | Frost pup becomes a young ice wolf with small frost fangs, crystal collar, and snowy paw aura. |
| volt-cheetah | Bit Pets | 6 | 3 | `assets/roles/volt-cheetah-legend.png` | `assets/roles/evolved/volt-cheetah.png` | Lightning cub becomes a teen volt cheetah with longer tail spark, small visor, and fast electric paw trails. |
| shadow-stalker | Bit Pets | 6 | 3 | `assets/roles/shadow-stalker-legend.png` | `assets/roles/evolved/shadow-stalker.png` | Shadow creature becomes a young night stalker with bigger claws, small mask, and contained shadow flames. |
| crybaby | Popmart | 4 | 2 | `assets/roles/new character/popmart/crybaby/crybaby_before.png` | `assets/roles/new character/popmart/crybaby/crybaby_after.png` | Keep the crying charm; add tiny halo, first tear crystal, small wings, and soft heart wand. |
| hacipupu | Popmart | 4 | 2 | `assets/roles/new character/popmart/hacipupu/hacipupu_before.jpg` | `assets/roles/new character/popmart/hacipupu/hacipupu_after.png` | Forest child becomes a leaf apprentice with bigger hood, small lantern, mushroom pouch, and gentle forest glow. |
| labubu | Popmart | 4 | 2 | `assets/roles/new character/popmart/labubu/labubu_before.png` | `assets/roles/new character/popmart/labubu/labubu_after.png` | Fluffy imp becomes an acorn forest scout with bigger ears, tiny twig staff, leaf cape, and mischievous smile. |
| skullpanda | Popmart | 4 | 2 | `assets/roles/new character/popmart/skullpanda/skullpanda_before.png` | `assets/roles/new character/popmart/skullpanda/skullpanda_after.png` | Gothic bunny becomes a moon apprentice with small crescent crown, star cloak, and soft purple magic. |
| twinkle-twinkle | Popmart | 4 | 2 | `assets/roles/new character/popmart/twinkle_twinkle/twinkle_twinkle_knight_before.png` | `assets/roles/new character/popmart/twinkle_twinkle/twinkle_twinkle_after.png` | Star knight becomes a star squire with brighter helmet, first star shield, and small rainbow trail. |
| pikachu | Pokemon | 4 | 2 | `assets/roles/new character/pokemon/pikachu/pikachu_before.png` | `assets/roles/new character/pokemon/pikachu/pikachu_after.png` | Electric companion becomes a stronger teen form with longer lightning tail, cheek sparks, and small thunder cape. |
| mewtwo | Pokemon | 4 | 2 | `assets/roles/new character/pokemon/mewtwo/mewtwo_before.png` | `assets/roles/new character/pokemon/mewtwo/mewtwo_after.png` | Psychic companion becomes a young psychic guardian with floating orb, soft armor collar, and controlled purple aura. |
| lucario | Pokemon | 4 | 2 | `assets/roles/new character/pokemon/lucario/lucario_before.jpg` | `assets/roles/new character/pokemon/lucario/lucario_after.png` | Aura fighter becomes an aura apprentice with bigger ears, small gauntlets, chest gem, and blue aura rings. |
| greninja | Pokemon | 4 | 2 | `assets/roles/new character/pokemon/greninja/greninja_before.png` | `assets/roles/new character/pokemon/greninja/greninja_after.png` | Water ninja becomes a young shadow-water ninja with scarf, water shuriken, and playful leap pose. |
| charizard | Pokemon | 4 | 2 | `assets/roles/new character/pokemon/chalizard/chalizard_before.png` | `assets/roles/new character/pokemon/chalizard/chalizard_after.png` | Fire lizard becomes a teenage fire dragon with small wings, first horns, glowing tail flame, and cute confident face. |
| wolf | Minecraft | 4 | 2 | `assets/roles/new character/minecraft/wolf/wolf_before.png` | `assets/roles/new character/minecraft/wolf/wolf_after.png` | Block puppy becomes a young guardian wolf with diamond collar, small saddle armor, and friendly alert pose. |
| steve | Minecraft | 4 | 2 | `assets/roles/new character/minecraft/steve/steve_before.jpg` | `assets/roles/new character/minecraft/steve/steve_after.png` | Miner becomes an armored explorer apprentice with first diamond pickaxe, small backpack, and brighter heroic stance. |
| enderman | Minecraft | 4 | 2 | `assets/roles/new character/minecraft/enderman/enderman_before.png` | `assets/roles/new character/minecraft/enderman/enderman_after.png` | Void walker becomes a young ender mage with small crown shard, pearl glow, and contained teleport aura. |
| enderdragon | Minecraft | 4 | 2 | `assets/roles/new character/minecraft/enderdragon/enderdragon_before.png` | `assets/roles/new character/minecraft/enderdragon/enderdragon_after.png` | Dragon becomes a juvenile end dragon with larger wings, tiny crystal horns, and purple crystal sparks. |
| creeper | Minecraft | 4 | 2 | `assets/roles/new character/minecraft/creeper/creeper_before.png` | `assets/roles/new character/minecraft/creeper/creeper_after.png` | Green explosive buddy becomes a friendly moss-core creeper with small redstone fuse, armor plates, and cute puff explosion aura. |
| kuromi | Sanrio | 4 | 2 | `assets/roles/new character/sanrio/kuromi/kuromi_before.png` | `assets/roles/new character/sanrio/kuromi/kuromi_after.png` | Keep the cute rogue style; add small crescent wand, first crown, ribbon armor, and gentle mischievous magic. |
| my-melody | Sanrio | 4 | 2 | `assets/roles/new character/sanrio/my-melody/my-melody_before.png` | `assets/roles/new character/sanrio/my-melody/my-melody_after.png` | Flower friend becomes a blossom apprentice with petal cape, small heart staff, and soft healing aura. |
| cinnamoroll | Sanrio | 4 | 2 | `assets/roles/new character/sanrio/cinnamoroll/cinnamoroll_before.png` | `assets/roles/new character/sanrio/cinnamoroll/cinnamoroll_after.png` | Cloud puppy becomes a sky-music apprentice with tiny cup crown, cloud cape, first melody staff, and gentle hovering pose. |
| pochacco | Sanrio | 4 | 2 | `assets/roles/new character/sanrio/pochacco/pochacco_before.png` | `assets/roles/new character/sanrio/pochacco/pochacco_after.png` | Sport puppy becomes a speedy rookie hero with visor, banana-star baton, light runner armor, and cheerful sprint energy. |
| hello-kitty | Sanrio | 4 | 2 | `assets/roles/new character/sanrio/hello-kitty/hello-kitty_before.png` | `assets/roles/new character/sanrio/hello-kitty/hello-kitty_after.png` | Heart princess becomes a royal heart apprentice with small crown, heart shield, bow jewel, and warm sparkle aura. |

## Build Order

1. Generate mini evolution cards for Bit Pets first, because these also define the visual language for original CY PETS LAND characters.
2. Generate Pokemon and Minecraft mini cards next, using the current before/final cards as references and keeping the mini stage less powerful than the final card.
3. Generate Popmart and Sanrio mini cards last. They should stay close to the existing cuteness and only add mild stage-2 details.
4. After all 30 mini cards are approved, wire each `miniEvolutionImage` into `PET_CATALOG`.
5. Then update the evolution comparison/share screen so it can show before -> mini -> final when available.

## Q Final Evolution Input Policy

- Bit Pets, Pokemon, and Minecraft can continue using Q-style final evolution assets when the student chooses the cute route, except Fluffbit.
- Sanrio and Popmart skip separate Q-style final evolution redesign for now, because their current final cards are already cute enough.
- For characters that still need a Q-style final card improvement, use:
  - original form as Image 1,
  - heroic final form as Image 2,
  - mini form as Image 3 after mini cards are approved.
