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

**Default `config.json`:**

```json
{
  "plugin": "KnifeBroadcast",
  "enabled": true,
  "heli": {
    "enabled": true,
    "layout": "{{attacker}} {{message}}",
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
      "BP_CH146",
      "BP_CH146_Desert",
      "BP_SA330",
      "BP_UH60_AUS",
      "BP_MRH90_Mag58",
      "BP_Z8J"
    ],
    "messages": ["CRASHED LANDED", "MADE A FLAWLESS LANDING", "YOU CAN'T PARK THERE"]
  },
  "knife": {
    "enabled": true,
    "layout": "{{attacker}} {{message}} {{victim}}",
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
      "BP_SOCP_Knife_ADF_C",
      "BP_SA80Bayonet_C",
      "BP_Bayonet2000_C",
      "BP_AKMBayonet_C",
      "BP_G3Bayonet_C",
      "BP_M9Bayonet_C",
      "BP_SKS_Bayonet_C",
      "BP_OKC-3S_C",
      "BP_VibroBlade_Knife_GC_C",
      "BP_MeleeUbop_C",
      "BP_BananaClub_C",
      "BP_Droid_Punch_C",
      "BP_MagnaGuard_Punch_C",
      "BP_FAMAS_Bayonet_C",
      "BP_FAMAS_BayonetRifle_C",
      "BP_HK416_Bayonet_C"
    ],
    "messages": [
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
}
```

_Be sure to add a `,` to the end of the plugin before it._

```json
{
  "plugins": [
    {
      "plugin": "Another plugin"
    },
    {
      "plugin": "KnifeBroadcast"
    }
  ]
}
```

## Plugin Options

**enabled:**

Enable/disable this type of kill.

**layout:**

- `{{attacker}}` = `attacker name`
- `{{victim}}` = `victim name`
- `{{message}}` = `random message from the "messages"`
- `{{weapon}}` = `weapon id used from the "ids"`

Example:

- **layout:** `Cerberus ({{attacker}} {{message}} {{victim}})`
- **in-game:** `Cerberus (JetDave SLICED Magic)`

**messages:**

- `{{message}}` = `random message`

If you wish to add a message with `"` in it => `\"`

Example:

```json
{
  "messages": ["My \"example\" string"]
}
```

**ids:**

- `{{weapon}}` = `weapon id`
