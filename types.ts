interface rollConfig {
  size: number;
  num: number;
  mod?: number;
}

interface rollRes {
  sum: number;
  dice: number[];
}

interface checkConfig {
  num: number;
  dc: number;
  mod?: number;
  rerolls?: "ones" | "full" | "crits";
}

interface checkRes {
  hits: number;
  crits: number;
  dice: number[];
  diceOriginal: number[];
}

interface saveConfig {
  num: number;
  save: number;
  AP?: number;
  mod?: number;
  invuln?: number;
}

interface saveRes {
  saves: number;
  dice: number[];
}

interface FNPconfig {
  wounds: number;
  dc: number;
}

interface FNPres {
  finalWounds: number;
  dice: number[];
}

interface weapon {
  A: number | rollConfig;
  WS: number;
  S: number;
  AP: number;
  D: number | rollConfig;
  keywords?: {
    rapidFire?: number;
    twinLinked?: boolean;
    torrent?: boolean;
    lethalHits?: boolean;
    lance?: boolean;
    blast?: boolean;
    melta?: number;
    heavy?: boolean;
    devastatingWounds?: boolean;
    sustainedHits?: number;
    anti?: number;
  };
}

interface model {
  T: number;
  SV: number;
  W: number;
  FNP?: number;
  invuln?: number;
  special?: {
    halfWounds?: boolean;
    damageMod?: number;
    cover?: boolean;
  };
}

interface attackRes {}

export type {
  checkConfig,
  checkRes,
  rollConfig,
  rollRes,
  saveConfig,
  saveRes,
  FNPconfig,
  FNPres,
  weapon,
};
