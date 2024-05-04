import BasePlugin from './base-plugin.js';

/**
 * If you wish to use `[[string]]` or replace it with your own format.
 *
 * ```js
 * const templateReg = /\[\[(.*?)\]\]/g;
 * ```
 */
const templateReg = /\{\{(.*?)\}\}/g;

const defautOptions = {
  heli: {
    enabled: true,
    layout: '{{attacker}} {{message}}',
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
      'BP_CH146',
      'BP_CH146_Desert',
      'BP_SA330',
      'BP_UH60_AUS',
      'BP_MRH90_Mag58',
      'BP_Z8J'
    ],
    messages: ['CRASHED LANDED', 'MADE A FLAWLESS LANDING', "YOU CAN'T PARK THERE"]
  },
  knife: {
    enabled: true,
    layout: '{{attacker}} {{message}} {{victim}}',
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
      'BP_SOCP_Knife_ADF_C',
      'BP_SA80Bayonet_C',
      'BP_Bayonet2000_C',
      'BP_AKMBayonet_C',
      'BP_G3Bayonet_C',
      'BP_M9Bayonet_C',
      'BP_SKS_Bayonet_C',
      'BP_OKC-3S_C',
      'BP_VibroBlade_Knife_GC_C',
      'BP_MeleeUbop_C',
      'BP_BananaClub_C',
      'BP_Droid_Punch_C',
      'BP_MagnaGuard_Punch_C',
      'BP_FAMAS_Bayonet_C',
      'BP_FAMAS_BayonetRifle_C',
      'BP_HK416_Bayonet_C'
    ],
    messages: [
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
};

export default class KnifeBroadcast extends BasePlugin {
  static get description() {
    return 'Knife Broadcast plugin';
  }

  static get defaultEnabled() {
    return true;
  }

  static get optionsSpecification() {
    return {
      heli: {
        required: false,
        description: 'Heli kill layout',
        default: defautOptions.heli,
        example: {
          layout: 'Cerberus ({{attacker}} {{message}} {{victim}})',
          ids: ['BP_UH1H'],
          messages: ['CRASHED LANDED']
        }
      },
      knife: {
        required: false,
        description: 'Knife kill layout',
        default: defautOptions.knife,
        example: {
          layout: 'Cerberus ({{attacker}} {{message}} {{victim}})',
          ids: ['BP_Bayonet2000'],
          messages: ['KNIFED']
        }
      }
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);

    this.onKill = this.onKill.bind(this);
    /** @type { import("./Knife-Broadcast.d.ts").defautOptions["heli"] } */
    this.heli = this.options.heli ?? defautOptions.heli;
    /** @type { import("./Knife-Broadcast.d.ts").defautOptions["knife"] } */
    this.knife = this.options.knife ?? defautOptions.knife;
  }

  async mount() {
    this.server.addListener('PLAYER_WOUNDED', this.onKill);
  }

  async onKill(info) {
    try {
      if (info.teamkill === true) return;
      const { attacker, victim, weapon } = info;
      const data = {
        attacker: attacker.name,
        victim: victim.name,
        message: '',
        weapon
      };
      let layout = '';
      if (this.heli.enabled && this.heli.ids.includes(weapon) && attacker.eosID === victim.eosID) {
        if (this.isEmpty(this.heli.layout) || this.isEmpty(this.heli.messages)) {
          return;
        }
        data.message = this.ranPick(this.heli.messages);
        layout = this.heli.layout;
      } else if (this.knife.enabled && this.knife.ids.includes(weapon)) {
        if (this.isEmpty(this.knife.layout) || this.isEmpty(this.knife.messages)) {
          return;
        }
        data.message = this.ranPick(this.knife.messages);
        layout = this.knife.layout;
      }

      if (!this.isEmpty(layout + data.message)) {
        await this.server.rcon.broadcast(this.nano(layout, data));
      }
    } catch (ex) {
      this.verbose(1, 'Error', ex);
    }
  }

  /**
   * @type { import("./Knife-Broadcast.d.ts").ranPick }
   */
  ranPick(obj = []) {
    return obj[Math.floor(Math.random() * obj.length)];
  }

  /**
   * @type { import("./Knife-Broadcast.d.ts").nano }
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
   * @type { import("./Knife-Broadcast.d.ts").isObj }
   */
  isObj(obj) {
    /** @type { string } */
    const s = Object.prototype.toString.call(obj);
    return s.includes('Object');
  }

  /**
   * @type { import("./Knife-Broadcast.d.ts").isNull }
   */
  isNull(obj) {
    return Object.is(obj, null) || Object.is(obj, undefined);
  }

  /**
   * @type { import("./Knife-Broadcast.d.ts").isBlank }
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
   * @type { import("./Knife-Broadcast.d.ts").isEmpty }
   */
  isEmpty(obj) {
    return this.isNull(obj) || this.isBlank(obj);
  }
}
