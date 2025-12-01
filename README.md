# 🎮 MystiaJungle
## 📌 Overview
The game draws strong inspiration from the survival-adventure spirit of Jumanji storyline, with the  where characters are trapped into a dangerous, unpredictable game world filled with escalating challenges. Similarly, this game places the player inside a magical game world where they get stuck into. it is a big jungle realm they must escape by overcoming trials, defeating creatures. To return to reality, the player must conquer different regions (Scorching wilds - hot region; Frozen Platau - cold region) to find the sacred key, which is the only way to unlock the final gate

## Requirements
### Control scheme: 

- Player moves using W/A/S/D keys
- Player hit spaceBar to start a Sword swinging
- If player can gain ability as they progress deeper in the region and collect the crystal item; hit J (first ability) or K (second ability)
- Player starts playing after the FallingDownToEarthState, meaning they just get pulled to this mysterial game world. 
- Player has 3-lives, meaning they can be dead and revive, the FallingDownToEarthState comes in to play again. 
- If Player dead and have no lives left, they lose and game over.
- Player can discover the map to find our the mini boss to get the key so he can progress to another regions, and finally meet the big boss.
- Player escape the game world once they are holding the key enter the escape gate.
- Player can kill creatures and big boss with his abilities.
- His initial ability can be good for easy creatures, but can be not efficient or not sufficient for later regions and the big boss as it can take long or harder. 
Futher development:
+ Since we have the time limit, if the time runs out and he still unable to get the key they he also lose. (nice-to-have)
+ Player can break the barrier, remove object like tree etc, to make his way faster to find the key.

### 🔁 Core Gameplay Loop and requirements
1. Explore an open map with different themed regions: 🔥 Scorching Wilds (Hot Region); ❄ Frozen Plateau (Cold Region)
2. Fight enemies with AI behaviors
3. Collect items (optional) and optionally unlock abilities
4. Defeat mini-bosses to open new regions
5. Face the final boss and collect the key to finish the game


## Game Diagram

![Flowchart](assets/diagrams/game-engine-diagram.png)
![Flowchart](assets/diagrams/service-diagram.png)
![Flowchart](assets/diagrams/environment-diagram.png)
![Flowchart](assets/diagrams/entity-diagram.png)
![Flowchart](assets/diagrams/state-diagram.png)
![Flowchart](assets/diagrams/enum-diagram.png)

## Game Entities Summary
### Player 
Managed with state machine system: 
- `IdleState`
- `WalkingState`
- `SwordSwingState`
- `PerformFireFlameState`
- `PerformFrozenFlameState`
- `FallingDownToEartthState`

### 👾 Creatures Design
- Creates start chasing player once player come near to the (enter their radius)
    + Chasing Logic: If player come close within certain distance they start to chase, when get close to player, they attack player
- Bomberplant has different behavior, they stay still. But it explods the player if player accidentially step on thems. 

#### Creature Escalation (Easy -> Hard)
- Early creatures: small, easy - spider, pinkbat (UI look: they  move left and right - spider, not all direction )

- Mid region: more in quantity, stronger, more variety: phantom, bomberplant in addition to spider, pinkbat  

- Final boss: The Jungle Warden, keeper of the Final Gate

## 🧵 Wireframes

### Title Screen

![Title Screen](./readme_images/title.png)

### Play State - Summer Realm

![Summer Realm](./readme_images/summer.png)

### Play State - Winter Realm

![Winter Realm](./readme_images/winter.png)

### Victory State

![Victory](./readme_images/victory.png)

### Game Over State

![Game Over](./readme_images/gameover.png)

## 🎨 Assets

### Sprites
Most of sprites are used from these link listed below:
- Srites: https://electriclemon.itch.io/citizens-guards-warriors 
- Item: Crystal item: https://o-lobster.itch.io/adventure-pack 
- Slime, Skeleton: https://game-endeavor.itch.io/mystic-woods 
- Tile set: https://anokolisa.itch.io/free-pixel-art-asset-pack-topdown-tileset-rpg-16x16-sprites 

### 🖼️ Images

All wireframe images are stored in the `readme_images/` folder and are used for UI layout planning.
Additional in-game backgrounds and sprites will be stored under `assets/images/` during production.

### ✏️ Fonts

The game uses the default in-engine font for UI, menus, and game text.
Style for title screen, Pirata One font from google will be used

[MystiaJungle](ttps://example.com/the/full/url)

![FontSample](assets/fonts/font-sample.png)

### 🔊 Sounds

Our game uses a combination of music tracks and sound effects to support
immersion, feedback, and clarity in both exploration and combat. All
sounds are organized into two folders: `music/` and `effects/`.

#### 🎵 Music

Background music for game states and environments:

- **title.wav** — Title Screen music  
  https://opengameart.org/content/adventure-intro-title-cinematic-epic

- **summer.wav** — Summer Realm jungle adventure theme  
  https://opengameart.org/content/jungle

- **winter.wav** — Winter Realm mystical ice theme  
  https://opengameart.org/content/boss-battle-music

- **final.wav** — Final Boss battle (epic)  
  https://opengameart.org/content/adventure-intro-title-cinematic-epic

- **victory.wav** — Short triumphant victory fanfare  
  https://opengameart.org/content/victory-fanfare-short

- **gameover.ogg** — Game Over ambient/failure sound  
  https://opengameart.org/content/gameover-or-underwater


#### 🔊 Effects

Short SFX used for actions, combat, items, and feedback:

- **boss-dead.wav** — Boss defeat impact  
  https://opengameart.org/content/male-dead-voice

- **door-enter.wav** — Entering a portal/door  
  (from Pokémon assignment)

- **door-exit.wav** — Exiting a portal/door  
  (from Pokémon assignment)

- **enemy-dead.wav** — Enemy defeated sound  
  https://opengameart.org/content/male-dead-voice

- **fire.wav** — Fire attack / magic skill  
  https://opengameart.org/content/magic-sfx-sample

- **frozen.wav** — Ice/freeze effect  
  https://opengameart.org/content/ice-spells

- **heal.mp3** — Player healing  
  https://opengameart.org/content/3-heal-spells

- **hits.wav** — Physical hit impact  
  https://opengameart.org/content/punches-hits-swords-and-squishes

- **hurt.wav** — Hurt sound  
  https://opengameart.org/content/punches-hits-swords-and-squishes

- **key-pickup.wav** — Key pickup (magical chime)  
  https://opengameart.org/content/key-pickup-2

- **sword.wav** — Player sword attack (slash)  
  https://opengameart.org/content/battle-sound-effects


## 📚 References

This project is developed using ideas, logic structures, and engine components adapted from the teaching materials provided in class Game Programming by instructor [VikeramSingh](https://github.com/VikramSinghMTL)

### General Rereference

General Architecture:
- State Machine, Factory Pattern, OOP Structures, and Game Loop Architecture. Provided in course framework by [Instructor Name], [Institution Name].

Narrative Inspiration:

- Part of thematic concept of this game is inspired by: The Jumanji “trapped in a game world” storyline. Region-based progression
Creature difficulty escalation, collecting keys to escape the world.

## Development Team
- [Cuong Ngo](https://github.com/cuongngodev)
- [Linyue](https://github.com/Linyue-dev) 




