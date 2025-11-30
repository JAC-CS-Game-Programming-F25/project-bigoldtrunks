# 🎮 Game Design Document — Zelda-Inspired JS Game
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

## Assets
Most of sprites are used from these link listed below:
- Srites: https://electriclemon.itch.io/citizens-guards-warriors 
- Item: Crystal item: https://o-lobster.itch.io/adventure-pack 
- Slime, Skeleton: https://game-endeavor.itch.io/mystic-woods 
- Tile set: https://anokolisa.itch.io/free-pixel-art-asset-pack-topdown-tileset-rpg-16x16-sprites 


