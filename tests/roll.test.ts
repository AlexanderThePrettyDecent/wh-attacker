import roll from "../functions/roll";

describe("roll function, takes a rollconfig object with the 'num' and 'size' of dice to be rolled. The function generates a random integer between 1 and the specified 'size' 'num' times. returns a", () => {
  test("when passed a config of 1d6 returns a random number", () => {
    //arrange
    const config = { size: 6, num: 1 };
    //act

    jest.spyOn(global.Math, "random").mockReturnValue(0.3);
    const controlled = roll(config);
    jest.spyOn(global.Math, "random").mockRestore();
    //affirm
    expect(controlled.sum).toBe(2);

    for (let i = 0; i < 10; i++) {
      const randRoll = roll(config).sum;
      expect(randRoll).toBeGreaterThan(0);
      expect(randRoll).toBeLessThan(7);
      expect(randRoll % 1).toBe(0);
    }
  });
  test("when passed a config of 10d6 returns 10 random numbers in the 'dice' array and their sum", () => {
    //arrange
    const config = { size: 6, num: 10 };
    //act

    jest.spyOn(global.Math, "random").mockReturnValue(0.3);
    const controlled = roll(config);
    jest.spyOn(global.Math, "random").mockRestore();
    //affirm
    expect(controlled.sum).toBe(20);

    const randRoll = roll(config);
    randRoll.dice.forEach((thisRoll) => {
      expect(thisRoll).toBeGreaterThan(0);
      expect(thisRoll).toBeLessThan(7);
      expect(thisRoll % 1).toBe(0);
    });
  });
  test("when passed a config including a modifer adds a the modifer to the to the returned sum", () => {
    //arrange
    const config = { size: 6, num: 10, mod: 5 };
    const config2 = { size: 6, num: 10, mod: -5 };
    //act

    jest.spyOn(global.Math, "random").mockReturnValue(0.3);
    const controlled = roll(config);
    const controlled2 = roll(config2);
    jest.spyOn(global.Math, "random").mockRestore();
    //affirm
    expect(controlled.sum).toBe(25);
    expect(controlled2.sum).toBe(15);

    const randRoll = roll(config);
    expect(randRoll.sum).toBeGreaterThan(14);
    expect(randRoll.sum).toBeLessThan(66);
    let expectedSum = 0;
    randRoll.dice.forEach((roll) => {
      expectedSum += roll;
    });
    expect(randRoll.sum).toEqual(expectedSum+config.mod);
  });
});

// jest.spyOn(global.Math, "random").mockReturnValue(0.3);
// jest.spyOn(global.Math, "random").mockRestore();
