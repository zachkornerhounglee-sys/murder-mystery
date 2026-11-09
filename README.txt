Hide & Seek Murder Mystery 3D
Keep index.html and the assets/ folder together (models are packed as assets/*.js).
Upload both to GitHub Pages and share the invite link from the lobby.

Models for friends: they load automatically from your site. If a friend's browser can't load them,
the host's browser sends them over the connection (once, then cached in the friend's browser).

NEW
- Roles: 1 Sheriff, everyone else is a Murderer (a team). Murderers cannot kill the Sheriff or each other;
  they win by killing every NPC civilian. The Sheriff wins by shooting every Murderer (or when the timer ends).
- Lobby (host controls): NPC count (5-200), round timer, Sheriff mistakes allowed, murder-alert marker on/off.
- Lobby shows every player with a model status: ✔ models / ⬇ downloading % / ✖ missing. Host can Kick.
- Tab in game = player list (kills, alive/dead, ping, model status). Murderers see red name tags on teammates.
- Set your name on the menu. End screen shows each Murderer's kill count.

Esc in game = Settings: Day/Night, sensitivity, FOV, graphics quality. F = flashlight (night).

BEACH MAP
- New "Sunny Beach" map (pick it in the lobby). Upload the 6 new files in assets/ (beach-ball.js, cliff-face.js,
  hammock.js, hedge.js, palm-tree-light.js, surfboard.js) next to index.html along with the older assets.
- The ocean is a solid no-walk zone; cliffs wall in the back and sides.

SHERIFF KILLS (lobby, host only)
- "Murderers can kill the Sheriff" (off by default) + "allowed after" delay (immediately to 5 min into the round).
- When the delay passes, everyone gets a "Murderers can now kill the Sheriff!" notice. A dead Sheriff = Murderers win.

v4
- Models start downloading the moment the page opens (progress shown on the menu); you can host/join while it finishes.
- NPC/player variety: random tint, height and walk speed. Sheriff rotates each round; points are kept across rounds (lobby + Tab + end screen).
- Spectate: when dead, Q/E cycles through living players.
- Witnesses: NPCs that see a stab freeze and stare at the killer for ~1.5s before fleeing.
- Emotes: keys 1-4 (wave, point, laugh, !). NPCs emote too, so Murderers can blend in.
- Bots: host lobby button "+ Add bot" adds AI Murderers (use it for solo practice). Kick removes them.
- Deputy (lobby checkbox): one hidden innocent human with 1 scan. Shooting the Deputy counts as a mistake.
- Murderer [R] Lure: pulls nearby NPCs toward a spot 10m ahead (20s cooldown).

v4.1
- Suburb: box hedges replaced with the hedge model; cliff faces now ring the map edge behind the fence.

v4.2
- Fixed instant-win: players idle in the lobby/end screen were wrongly dropped as "disconnected" the moment a round started.
  Clients now send a heartbeat in every state, and the timeout only applies during play.
- You can change your name in the lobby (updates for everyone live).

v5
- Tests: `node tests/smoke.js index.html` runs 12 rule checks (win conditions, drops, timer, deputy, kill-the-sheriff setting).
- AI Sheriff (lobby checkbox): a bot is Sheriff, every human is a Murderer. It investigates recent kills and only shoots suspects it can see.
- Idle tasks: press T to do an idle action (📱 ☕ 💤 🍦) - you stand still for ~4s like NPCs that are standing around.
- Map voting (lobby dropdown) + the host's lobby settings are remembered between sessions.
- Lobby chat; non-host players can vote-kick (majority of humans).
- Random events every minute: crowd, fire alarm (assembly point), ice-cream truck, blackout (tunnel vision, murder alerts off).
- Footsteps: any moving character within ~11m makes quiet steps (NPCs and players sound the same).

v6 GRAPHICS
- Post-processing (Medium/High): 4x MSAA, bloom (High), colour grading, vignette, film grain. Low = off (fastest).
- Real reflections/lighting on models (sky-based environment map), PBR materials on world geometry.
- Sharp shadows that follow the player (4096 map on High), softer bias, anisotropic textures, hazier distance fog.
- New "Dusk" (golden hour) option next to Day/Night in Esc settings.
- Beach: animated water with foam, textured sand.
- Needs a GPU with WebGL2 for MSAA (falls back to FXAA). If it runs slowly, set graphics to Medium or Low.

v7 NETWORKING
- Per-client snapshots: NPCs within 30m update every tick, 30-70m every 2nd tick, farther every 5th (everything is resent each second). Cuts host upload several times over in big crowds. Host HUD shows KB/s up.
- Client interpolation delay now adapts to measured jitter (80-260ms) instead of a fixed 110ms.
- Tests (node tests/smoke.js index.html) now check the snapshot throttling.

v8 MODEL LOADING (same approach as the Boss Rush game)
- Models now start loading the instant the page opens, straight from plain .glb files: put them next to index.html or in assets/ (or models/).
- Every file is tried under several names (hedge.glb, hedge_1.glb, "hedge (1).glb", lowercase, spaces for - and _), all models in parallel.
- Old packed assets/*.js files and the GitHub fallback still work if a .glb isn't found.
- If anything is missing, the menu lists the exact filenames expected.
