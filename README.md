# SquadJS Knife Broadcast

[![GitHub License](https://img.shields.io/github/license/magicoflolis/SquadJS-Knife-Broadcast?style=flat-square)](https://github.com/magicoflolis/SquadJS-Knife-Broadcast/blob/main/LICENSE)
[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/magicoflolis/SquadJS-Knife-Broadcast?style=flat-square)](https://github.com/magicoflolis/SquadJS-Knife-Broadcast/issues)

[[❗ New Issue](https://github.com/magicoflolis/SquadJS-Knife-Broadcast/issues/new/choose)]
[[🔫 New Weapon ID](https://github.com/magicoflolis/SquadJS-Knife-Broadcast/issues/new?assignees=&labels=new-weapon-id%F0%9F%94%AB&projects=&template=03_new-weapon-id.yml&title=%5Bnew-id%5D%3A+)]
[[🔫 Change a Weapon ID](https://github.com/magicoflolis/SquadJS-Knife-Broadcast/issues/new?assignees=&labels=change-weapon-id%F0%9F%94%AB&projects=&template=04_change-weapon-id.yml&title=%5Bchange-id%5D%3A+)]

Broadcast to the Squad server when a player gets a certain type of kill.

---

|                    Demo                     |        Provider         |
| :-----------------------------------------: | :---------------------: |
| [Video File](./assets/How_to_make_tuli.mp4) | @p.sherman42 on Discord |

---

_Default plugin config:_

```json
{
  "plugins": [
    {
      "plugin": "KillBroadcast",
      "enabled": true,
      "useInterval": false,
      "broadcasts": [
        {
          "heli": true,
          "layout": "{{attacker}} {{verb}}",
          "ids": [
            "BP_MI8_VD",
            "BP_UH1Y",
            "BP_UH60",
            "BP_UH1H_Desert",
            "BP_UH1H",
            "BP_CH178",
            "BP_MI8",
            "BP_CH146",
            "BP_MI17_MEA",
            "BP_Z8G",
            "BP_CH146_Desert",
            "BP_SA330",
            "BP_UH60_AUS",
            "BP_MRH90_Mag58",
            "BP_Z8J",
            "BP_Loach_CAS_Small",
            "BP_Loach",
            "BP_UH60_TLF_PKM",
            "BP_CH146_Raven"
          ],
          "verbs": ["CRASHED LANDED", "MADE A FLAWLESS LANDING", "YOU CAN'T PARK THERE"]
        },
        {
          "ids": [
            "BP_AK74Bayonet",
            "BP_AKMBayonet",
            "BP_Bayonet2000",
            "BP_G3Bayonet",
            "BP_M9Bayonet",
            "BP_OKC-3S",
            "BP_QNL-95_Bayonet",
            "BP_SA80Bayonet",
            "BP_SKS_Bayonet",
            "BP_SKS_Optic_Bayonet",
            "BP_SOCP_Knife_AUS",
            "BP_SOCP_Knife_ADF",
            "BP_VibroBlade_Knife_GC",
            "BP_MeleeUbop",
            "BP_BananaClub",
            "BP_Droid_Punch",
            "BP_MagnaGuard_Punch",
            "BP_FAMAS_Bayonet",
            "BP_FAMAS_BayonetRifle",
            "BP_HK416_Bayonet"
          ],
          "verbs": [
            "KNIFED",
            "SLICED",
            "DICED",
            "ICED",
            "CUT",
            "PAPER CUT",
            "RAZORED",
            "EDWARD SCISSOR HAND'D",
            "FRUIT NINJA'D"
          ]
        }
      ]
    }
  ]
}
```

_Plugin config format:_

```ts
interface optionsSpecification {
  // Use setTimeout rather than broadcasting right away.
  // It is on a 5 seconds loop.
  useInterval: boolean;

  // Array to use when announcing certain types of kills.
  broadcasts: KillType[];
}

interface KillType {
  // Self explanatory, default `true`.
  enabled: boolean;

  // Only use to specify heli kills (attacker.eosID === victim.eosID), default `false`.
  heli: boolean;

  // While `false` kill type won't execute while on a seeding map.
  // (calls `await this.server.rcon.getCurrentMap()` everytime to get layer info)
  seeding: boolean;

  // Available: `{{attacker}}`, `{{verb}}`, `{{victim}}`, `{{damage}}`, `{{weapon}}`
  layout: string;
  
  // Array of weapon ids
  ids: string[];
  
  // Array of verbs to use, leave blank if `{{verb}}` is not included in layout
  verbs: string[];
}
```

## Examples

To customize the broadcast message, edit "layout"

_config.json>"plugins">"KillBroadcast":_

```json
{
  "broadcasts": [
    {
      "layout": "Cerberus ({{attacker}} {{verb}} {{victim}})",
      "verbs": ["KNIFED", "SLICED", "TERMINATED"]
    }
  ]
}
```

_in-game:_

```txt
Cerberus (JetDave KNIFED Magic)
```

Another broadcast message example

```json
{
  "broadcasts": [
    {
      "layout": "{{attacker}} {{verb}} {{victim}} with a {{weapon}} dealing {{damage}} damage",
      "verbs": ["KNIFED", "SLICED", "TERMINATED"],
      "ids": ["BP_Bayonet2000"]
    }
  ]
}
```

_in-game:_

```txt
# If info.damage is not a number then the value will be 0
JetDave SLICED Magic with a BP_Bayonet2000 dealing 200 damage
```

If you wish to use `"` put a `\` before it => `\"`

```json
{
  "broadcasts": [
    {
      "layout": "Cerberus ({{attacker}} {{verb}} {{victim}})",
      "verbs": ["My \"example\" string"]
    }
  ]
}
```

_in-game:_

```txt
Cerberus (JetDave My "example" string Magic)
```

---

To disable a kill type set "enabled" to false

_config.json>"plugins">"KillBroadcast":_

```json
{
  "broadcasts": [
    {
      "enabled": true,
      "layout": "Cerberus ({{attacker}} {{verb}})",
      "ids": ["BP_MI8_VDV"],
      "verbs": ["CRASHED"]
    },
    {
      "enabled": false,
      "layout": "Cerberus ({{attacker}} {{verb}} {{victim}})",
      "verbs": ["KNIFED", "SLICED", "TERMINATED"]
    }
  ]
}
```

---

To disable a kill type while on a seeding map set "seeding" to false

_config.json>"plugins">"KillBroadcast":_

```json
{
  "broadcasts": [
    {
      "seeding": true,
      "layout": "Cerberus ({{attacker}} {{verb}})",
      "ids": ["BP_MI8_VDV"],
      "verbs": ["CRASHED"]
    },
    {
      "seeding": false,
      "layout": "Cerberus ({{attacker}} {{verb}} {{victim}})",
      "verbs": ["KNIFED", "SLICED", "TERMINATED"]
    }
  ]
}
```

_in-game:_

```txt
# While on a seeding map
Cerberus (Magic CRASHED)

# While NOT on a seeding map
Cerberus (JetDave TERMINATED Magic)
```

---
