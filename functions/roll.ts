import { rollConfig, rollRes } from "../types"


function roll(config: rollConfig): rollRes {
  const rolls: number[] = []
  let sum: number = 0
  if (config.mod){
    sum += config.mod
  }
  for (let i = 0; i < config.num; i++){
    const newRoll: number = Math.floor(Math.random() * (config.size)) + 1
    sum += newRoll
    rolls.push(newRoll)
  }
  return { sum: sum, dice: rolls };
}

export default roll;
