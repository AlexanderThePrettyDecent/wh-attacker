import { saveConfig, saveRes } from "../types";
import roll from "./roll";

function rollSave(config: saveConfig): saveRes {
  let saveThresh = config.save;
  let mod = 0
  if (config.mod){
    mod = config.mod
  }
  if (config.AP) {
    saveThresh -= config.AP;
  }
  if (config.invuln && config.invuln < saveThresh) {
    saveThresh = config.invuln;
  }
  let saveCount: number = 0;
  const dice: number[] = [];

  const saveRoll = roll({ size: 6, num: config.num });
  saveRoll.dice.forEach((thisRoll) => {
    if (thisRoll + mod >= saveThresh && thisRoll !== 1) {
      saveCount++;
    }
    dice.push(thisRoll);
  });
  return { saves: saveCount, dice };
}

export default rollSave;
