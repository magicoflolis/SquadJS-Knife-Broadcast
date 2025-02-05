import { randomInt } from 'node:crypto';
import BasePlugin from './base-plugin.js';

/**
 * Defines the structure of a kill type.
 *
 * @typedef {object} KillType
 * @property {boolean} enabled Self explanatory, default `true`
 * @property {boolean} heli Only use to specify heli kills, default `false`
 * @property {boolean} seeding While `false` kill type won't execute while on a seeding map (calls `await this.server.rcon.getCurrentMap()` everytime to get layer info)
 * @property {string} layout Available: `{{attacker}}`, `{{verb}}`, `{{victim}}`, `{{damage}}`, `{{weapon}}`
 * @property {string[]} ids Array of weapon ids
 * @property {string[]} verbs Array of verbs to use, leave blank if `{{verb}}` is not included in layout
 */

/**
 * Used for KillType layout (e.x. `{{attacker}}`), edit this to use your own format
 *
 * ```js
 * const templateReg = /\[\[(.*?)\]\]/g; // Format "[[attacker]] [[verb]] [[victim]]"
 * ```
 */
const templateReg = /\{\{(.*?)\}\}/g;

/** @type {KillType} */
const baseOptions = {
  enabled: true,
  heli: false,
  seeding: true,
  layout: '{{attacker}} {{verb}} {{victim}}',
  ids: [],
  verbs: []
};

export default class KillBroadcast extends BasePlugin {
  static get description() {
    return 'Broadcast to the Squad server when a player gets a certain type of kill.';
  }

  static get defaultEnabled() {
    return true;
  }

  static get optionsSpecification() {
    return {
      useInterval: {
        required: false,
        description: 'Use setTimeout rather than broadcasting right away.',
        default: false,
        example: true
      },
      broadcasts: {
        required: false,
        description: 'Array to use when announcing certain types of kills.',
        default: [
          {
            heli: true,
            layout: '{{attacker}} {{verb}}',
            ids: [
              'BP_MI8_VDV',
              'BP_UH1Y',
              'BP_UH60',
              'BP_UH1H_Desert',
              'BP_UH1H',
              'BP_CH178',
              'BP_MI8',
              'BP_CH146',
              'BP_MI17_MEA',
              'BP_Z8G',
              'BP_CH146_Desert',
              'BP_SA330',
              'BP_UH60_AUS',
              'BP_MRH90_Mag58',
              'BP_Z8J',
              'BP_Loach_CAS_Small',
              'BP_Loach',
              'BP_UH60_TLF_PKM',
              'BP_CH146_Raven'
            ],
            verbs: ['CRASHED LANDED', 'MADE A FLAWLESS LANDING', "YOU CAN'T PARK THERE"]
          },
          {
            ids: [
              'BP_AK74Bayonet',
              'BP_AKMBayonet',
              'BP_Bayonet2000',
              'BP_G3Bayonet',
              'BP_M9Bayonet',
              'BP_OKC-3S',
              'BP_QNL-95_Bayonet',
              'BP_SA80Bayonet',
              'BP_SKS_Bayonet',
              'BP_SKS_Optic_Bayonet',
              'BP_SOCP_Knife_AUS',
              'BP_SOCP_Knife_ADF',
              'BP_VibroBlade_Knife_GC',
              'BP_MeleeUbop',
              'BP_BananaClub',
              'BP_Droid_Punch',
              'BP_MagnaGuard_Punch',
              'BP_FAMAS_Bayonet',
              'BP_FAMAS_BayonetRifle',
              'BP_HK416_Bayonet'
            ],
            verbs: [
              'KNIFED',
              'SLICED',
              'DICED',
              'ICED',
              'CUT',
              'PAPER CUT',
              'RAZORED',
              "EDWARD SCISSOR HAND'D",
              "FRUIT NINJA'D",
              'TERMINATED',
              'DELETED',
              'ASSASSINATED'
            ]
          }
        ],
        example: [
          {
            heli: true,
            seeding: true, // Executes on all maps.
            layout: 'Cerberus ({{attacker}} {{verb}})', // Cerberus (Magic CRASHED)
            ids: ['BP_MI8_VDV'],
            verbs: ['CRASHED']
          },
          {
            seeding: false, // Won't execute while on a seeding map.
            layout: 'Cerberus ({{attacker}} {{verb}} {{victim}})', // Cerberus (JetDave KNIFED Magic)
            ids: ['BP_Bayonet2000'],
            verbs: ['KNIFED']
          }
        ]
      }
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);

    this.onKill = this.onKill.bind(this);

    /** @type { KillType[] } */
    this.loaded = [];
    this.messages = [];

    if (this.options.useInterval) {
      const func = async () => {
        if (this.messages.length > 0) {
          const msg = this.messages.pop();
          await this.server.rcon.broadcast(msg);
        }
        setTimeout(func, 5000);
      };
      func().catch(console.error);
    }

    for (const v of Object.values(this.options.broadcasts)) {
      if (!this.isObj(v)) {
        this.verbose(1, `Error: "${v}" is not a type of JSON Object.`);
        continue;
      }

      const o = {
        ...baseOptions,
        ...v
      };

      if (!o.enabled) {
        continue;
      }

      if (this.isBlank(o.ids)) {
        continue;
      }

      this.loaded.push(o);
    }
  }

  async mount() {
    // In case this function of the plugin we extend from "Base Plugin" needs to execute code before us
    await super.mount();

    this.server.addListener('PLAYER_WOUNDED', this.onKill);
    // this.server.addListener('PLAYER_DIED', this.onKill);
  }

  async onKill(info) {
    try {
      const { attacker, victim, weapon } = info;

      const killType = this.loaded.find(({ ids }) => {
        return ids.find((id) => weapon.includes(id));
      });
      if (killType === undefined) return;

      if (info.damage === undefined) info.damage = 0;
      info.damage = Number(info.damage);

      const { layout, verbs, heli, seeding } = killType;

      if (seeding === false) {
        // Check if the current map contains "seed"
        const { layer } = await this.server.rcon.getCurrentMap();
        if (!layer.toLowerCase().includes('seed')) {
          return;
        }
      }

      const data = {
        attacker: attacker.name,
        victim: victim.name,
        verb: this.pick(verbs),
        damage: info.damage,
        weapon
      };
      const message = this.nano(layout, data);
      const execFN = async () => {
        if (this.options.useInterval) {
          this.messages.push(message);
        } else {
          await this.server.rcon.broadcast(message);
        }
      };

      if (info.teamkill === false) {
        await execFN();
      } else if (heli && attacker.eosID === victim.eosID) {
        await execFN();
      }
    } catch (ex) {
      this.verbose(1, 'Error', ex);
    }
  }

  /**
   * Randomly pick `key` from an array.
   * @param {string[]} obj Array to pick from.
   */
  pick(obj = []) {
    return obj.at(randomInt(obj.length));
  }

  /**
   * @template {string} S
   * @param {S} template
   * @param {object} data
   * @returns {S}
   */
  nano(template, data) {
    return template.replace(templateReg, (_match, key) => {
      const keys = key.split('.');
      let v = data[keys.shift()];
      for (const i in keys.length) v = v[keys[i]];
      return this.isEmpty(v) ? '' : v;
    });
  }

  /**
   * Object is typeof `object` / JSON Object
   */
  isObj(obj) {
    /** @type { string } */
    const s = Object.prototype.toString.call(obj);
    return s.includes('Object');
  }

  /**
   * Object is `null` or `undefined`
   */
  isNull(obj) {
    return Object.is(obj, null) || Object.is(obj, undefined);
  }

  /**
   * Object is Blank
   */
  isBlank(obj) {
    return (
      (typeof obj === 'string' && Object.is(obj.trim(), '')) ||
      ((obj instanceof Set || obj instanceof Map) && Object.is(obj.size, 0)) ||
      (Array.isArray(obj) && Object.is(obj.length, 0)) ||
      (this.isObj(obj) && Object.is(Object.keys(obj).length, 0))
    );
  }

  /**
   * Object is Empty
   */
  isEmpty(obj) {
    return this.isNull(obj) || this.isBlank(obj);
  }
}
