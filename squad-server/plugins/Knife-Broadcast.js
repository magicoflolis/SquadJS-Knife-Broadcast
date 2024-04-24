import BasePlugin from "./base-plugin.js";

/**
 * If you wish to use `[[string]]` or replace it with your own format.
 *
 * ```js
 * const templateReg = /\[\[(.*?)\]\]/g;
 * ```
 */
const templateReg = /\{\{(.*?)\}\}/g;

export default class KnifeBroadcast extends BasePlugin {
  static get description() {
    return "Knife Broadcast plugin";
  }

  static get defaultEnabled() {
    return true;
  }

  static get optionsSpecification() {
    return {
      broadcastMessage: {
        required: false,
        description: "Broadcast message",
        default: "{{attacker}} {{message}} {{victim}}",
        example: "Cerberus ({{attacker}} {{message}} {{victim}})"
      },
      knifeArr: {
        required: false,
        description: "Random messages",
        default: [
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
        example: ["KNIFED"]
      },
      knives: {
        required: false,
        description: "Weapon ids",
        default: [
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
        example: ["BP_Bayonet2000"]
      }
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);

    this.onKill = this.onKill.bind(this);
    /** @type { string } */
    this.broadcastMessage = this.options.broadcastMessage ?? "";
    /** @type { string[] } */
    this.knives = this.options.knives ?? [];
    /** @type { string[] } */
    this.knifeArr = this.options.knifeArr ?? [];
  }

  async mount() {
    this.server.addListener("PLAYER_WOUNDED", this.onKill);
  }

  async onKill(info) {
    if (info.teamkill === true) return;
    const { attacker, victim, weapon } = info;
    if (this.knives.includes(weapon)) {
      if (this.isEmpty(this.broadcastMessage)) {
        return;
      }
      const knifeMsg = this.nano(this.broadcastMessage, {
        attacker: attacker.name,
        victim: victim.name,
        message: this.ranPick(this.knifeArr),
        weapon,
      });
      await this.server.rcon.broadcast(knifeMsg);
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
      const keys = key.split(".");
      let v = data[keys.shift()];
      for (const i in keys.length) v = v[keys[i]];
      return this.isEmpty(v) ? "" : v;
    });
  }

  /**
   * @type { import("./Knife-Broadcast.d.ts").isObj }
   */
  isObj(obj) {
    /** @type { string } */
    const s = Object.prototype.toString.call(obj);
    return s.includes("Object");
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
      (typeof obj === "string" && Object.is(obj.trim(), "")) ||
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
