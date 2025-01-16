import roll from "./roll";

import { hitConfig, hitRes } from "../types";

function hitRoll(config: hitConfig): hitRes {
  const rolls = roll({ size: 6, num: config.A });
  let hitCount: number = 0;
  let critCount: number = 0;
  let hitThresh: number = config.WS;
  let rerollCount: number = 0;
  const dice: number[] = [];
  if (config.mod) {
    hitThresh -= config.mod;
  }

  rolls.dice.forEach((thisRoll) => {
    if (thisRoll === 6) {
      critCount++;
      hitCount++;
      dice.push(thisRoll);
    } else if (thisRoll >= hitThresh && thisRoll !== 1) {
      if (config.rerolls === "crits") {
        rerollCount++;
      } else {
        hitCount++;
        dice.push(thisRoll);
      }
    } else if (config.rerolls === "ones" && thisRoll === 1) {
      rerollCount++;
    } else if (config.rerolls === "full" || config.rerolls === "crits") {
      rerollCount++;
    }
  });

  if (rerollCount) {
    const rerolls = roll({ num: rerollCount, size: 6 });
    rerolls.dice.forEach((thisRoll) => {
      if (thisRoll === 6) {
        critCount++;
        hitCount++;
      } else if (thisRoll >= hitThresh && thisRoll !== 1) {
        hitCount++;
      }
      dice.push(thisRoll);
    });
  }

  return {
    dice,
    hits: hitCount,
    crits: critCount,
    diceOriginal: rolls.dice,
  };
}

export default hitRoll;
