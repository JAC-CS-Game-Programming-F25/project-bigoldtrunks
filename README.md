# Final Project

- [ ] Read the [project requirements](https://vikramsinghmtl.github.io/420-5P6-Game-Programming/project/requirements).
- [ ] Replace the sample proposal below with the one for your game idea.
- [ ] Get the proposal greenlit by Vik.
- [ ] Place any assets in `assets/` and remember to update `src/config.json`.
- [ ] Decide on a height and width inside `src/globals.js`. The height and width will most likely be determined based on the size of the assets you find.
- [ ] Start building the individual components of your game, constantly referring to the proposal you wrote to keep yourself on track.
- [ ] Good luck, you got this!

---

## ✒️ Description

A fantasy adventure game where the player is transported into a mystical world divided into two realms: Summer and Winter.  
The player must collect a sacred key, defeat the realm guardian, and escape the ancient spirit world.

## 🕹️ Gameplay

- Explore Summer Realm → obtain the Sacred Key
- Unlock portal → enter Winter Realm
- Face the Ancient Guardian Boss
- Defeat the Boss → Escape the spirit world
- Avoid enemies and survive through hazards

## 📃 Requirements

Our project satisfies the course requirements:

- State Machines
- Inheritance & Polymorphism
- Entity & Object System
- Factory Pattern
- Enum usage
- Collision detection & Hitboxes
- Persistence
- Win & Loss Conditions
- Sprites & Animation
- Sound & Music
- Fonts
- UI & Instructions
- Juice (Feedback effects)

### 🤖 State Diagram

### 🗺️ Class Diagram

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

### 🖼️ Images

All wireframe images are stored in the `readme_images/` folder and are used for UI layout planning.
Additional in-game backgrounds and sprites will be stored under `assets/images/` during production.


### ✏️ Fonts

The game uses the default in-engine font for UI, menus, and game text.
Additional fantasy-style fonts will be added for the title screen if needed.

### 🔊 Sounds

Our game uses a combination of music tracks and sound effects to support
immersion, feedback, and clarity in both exploration and combat. All
sounds are organized into two folders: `music/` and `effects/`.

#### 🎵 Music

Background music for game states and environments:

- **title.wav** — Title Screen music
- **summer.wav** — Summer Realm jungle adventure theme
- **winter.wav** — Winter Realm mystical ice theme
- **final.wav** — Final Boss battle (epic)
- **victory.wav** — Short triumphant fanfare played on win
- **gameover.wav** — Short _Epic Failure Boom_ indicating defeat

#### 🔊 Effects

Short SFX used for actions, combat, items, and feedback:

- **sword.wav** — Player sword attack (slash)
- **key.wav** — Key pickup (magical chime)
- **enemy_dead.wav** — Enemy defeated sound
- **boss_dead.wav** — Boss defeat impact
- **door-enter.wav** — Entering a portal/door
- **door-exit.wav** — Leaving a portal/door
- **fire.mp3** — Fire attack / skill
- **frozen.wav** — Ice/freeze effect
- **heal.mp3** — Player healing
- **burst_fire.mp3** — Fire burst / magic shot

## 📚 References
