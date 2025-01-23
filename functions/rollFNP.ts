import { FNPconfig, FNPres } from "../types";
import roll from "./roll";

function rollFNP(config: FNPconfig): FNPres {
  const newRoll = roll({ num: config.wounds, size: 6 });
  let finalWounds = 0;
  const dice: number[] = [];
  newRoll.dice.forEach((die) => {
    if (die < config.dc) {
      finalWounds++;
    }
    dice.push(die);
  });

  return { dice, finalWounds };
}

export default rollFNP;
