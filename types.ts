interface rollConfig {
    size: number;
    num: number;
    mod?: number;
  }
  
  interface rollRes {
    sum: number;
    dice: number[];
  }

interface hitConfig{
  A: number;
  WS: number;
  mod?: number;
  rerolls?: "ones" | "full" |"crits"
}

interface hitRes {
  hits: number;
  crits: number;
  dice: number[];
  diceOriginal: number[];
}

export type {hitConfig, hitRes, rollConfig, rollRes}