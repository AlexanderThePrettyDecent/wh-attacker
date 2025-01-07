interface rollConfig {
  dice?: number;
  modifiers?: number;
  reroll?: boolean;
}

function roll(max: number = 6, config?: rollConfig): number {
  let dice: number = 1;
  let reroll = false;
  let modifiers = 0;
  if (config !== undefined) {
    if (config.dice) {
      dice = config.dice;
    }
    if (config.modifiers) {
      modifiers = config.modifiers;
    }
    if (config.reroll) {
      reroll = config.reroll;
    }
  }
  let roll = 0;
  for (let i = 0; i < dice; i++) {
    roll += Math.floor(Math.random() * (max - 1)) + 1;
  }

  console.log(roll);
  if (reroll && roll === 1) {
    return (roll += Math.floor(Math.random() * (max - 1)) + 1) + modifiers;
  }

  return roll + modifiers;
}

export default roll;
