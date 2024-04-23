# SquadJS Knife Broadcast

Broadcast to the Squad server when a player gets a knife kill.

**Default `config.json`:**

```json
{
  "plugins": [
    {
      "plugin": "KnifeBroadcast",
      "enabled": true,
      "broadcastMessage": "{{attacker}} {{message}} {{victim}}",
      "knifeArr": [
       "KNIFED",
       "SLICED",
       "DICED",
       "ICED",
       "CUT",
       "PAPER CUT",
       "RAZORED",
       "EDWARD SCISSOR HAND'D",
       "FRUIT NINJA'D"
      ],
      "knives": [
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
       "BP_VibroBlade_Knife_GC"
      ]
    }
  ]
}
```

_Be sure to add a `,` to the end of the plugin before it._

```json
{
  "plugins": [
    {
      "plugin": "Another plugin",
      "...": "..."
    },
    {
      "plugin": "KnifeBroadcast",
      "...": "..."
    }
  ]
}
```

## Plugin Options

**broadcastMessage:**

- `{{attacker}}` = `attacker name`
- `{{victim}}` = `victim name`
- `{{message}}` = `random message from the "knifeArr"`
- `{{weapon}}` = `weapon id used from the "knives"`

Example:

- **broadcastMessage:** - `Cerberus ({{attacker}} {{message}} {{victim}})`
- **in-game:** - `Cerberus (Magic KNIFED Player)`

**knifeArr:**

- `{{message}}` = `random message`

If you wish to add a message with `"` in it => `\"`

Example:

```json
{
 "knifeArr": [
   "My \"example\" string"
  ],
}
```

**knives:**

- `{{weapon}}` = `weapon id`
