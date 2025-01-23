import rollCheck from "../functions/rollcheck";
import { checkConfig } from "../types";

describe.only("rollCheck and woundroll function, takes checkConfig object and returns hitRes object", () => {
  test("when passed a single attack with no modifers or rerolls returns the correct number of hits", () => {
    //arrange
    const easy = { num: 1, dc: 2 };
    const hard = { num: 1, dc: 4 };
    //act
    jest.spyOn(global.Math, "random").mockReturnValue(0.3);
    const hitResults = rollCheck(easy);
    const missResults = rollCheck(hard);
    jest.spyOn(global.Math, "random").mockRestore();
    const randResults = rollCheck(hard);
    //affirm
    expect(hitResults.hits).toBe(1);
    expect(missResults.hits).toBe(0);
    if (randResults.dice[0] > 3) {
      expect(randResults.hits).toBe(1);
    } else {
      expect(randResults.hits).toBe(0);
    }
  });
  test("when passed mutiple attacks with no modifers or rerolls returns the correct number of hits", () => {
    //arrange
    const easy = { num: 6, dc: 2 };
    const hard = { num: 6, dc: 4 };
    //act
    jest.spyOn(global.Math, "random").mockReturnValue(0.3);
    const hitResults = rollCheck(easy);
    const missResults = rollCheck(hard);
    jest.spyOn(global.Math, "random").mockRestore();
    const randResults = rollCheck(hard);
    //affirm
    expect(hitResults.hits).toBe(6);
    expect(missResults.hits).toBe(0);
    let expectedSum = 0;
    randResults.dice.forEach((die) => {
      if (die > 3) {
        expectedSum++;
      }
    });
    expect(randResults.hits).toBe(expectedSum);
  });
  test("hit rolls of a 6 are counted as crits", () => {
    //arrange
    const config = { num: 6, dc: 2 };
    //act
    jest.spyOn(global.Math, "random").mockReturnValue(0.3);
    const noCritResults = rollCheck(config);
    jest.spyOn(global.Math, "random").mockRestore();
    jest.spyOn(global.Math, "random").mockReturnValue(0.9);
    const allCritResults = rollCheck(config);
    jest.spyOn(global.Math, "random").mockRestore();
    const randResults = rollCheck(config);
    //affirm
    expect(allCritResults.crits).toBe(6);
    expect(noCritResults.crits).toBe(0);
    let expectedSum = 0;
    randResults.dice.forEach((die) => {
      if (die === 6) {
        expectedSum++;
      }
    });
    expect(randResults.crits).toBe(expectedSum);
  });
  test("a modifier can be added to a roll and hits/misses are affected accordingly. Rolls of 6 and 1 always hit or miss respectively, regardless of mod", () => {
    //arrange
    const passConfig = { num: 6, dc: 3, mod: 1 };
    const missConfig = { num: 6, dc: 3, mod: -1 };
    const critConfig = { num: 6, dc: 6, mod: -1 };
    const critMissConfig = { num: 6, dc: 2, mod: 1 };
    //act
    //hits that would miss when unmodified pass
    jest.spyOn(global.Math, "random").mockReturnValue(0.3);
    const passResults = rollCheck(passConfig);
    jest.spyOn(global.Math, "random").mockRestore();

    //hits that would pass when unmodified miss
    jest.spyOn(global.Math, "random").mockReturnValue(0.34);
    const missResults = rollCheck(missConfig);
    jest.spyOn(global.Math, "random").mockRestore();

    //crits ignore modifiers
    jest.spyOn(global.Math, "random").mockReturnValue(0.9);
    const critResults = rollCheck(critConfig);
    jest.spyOn(global.Math, "random").mockRestore();

    //crit misses ignore modifiers
    jest.spyOn(global.Math, "random").mockReturnValue(0.1);
    const critMissResults = rollCheck(critMissConfig);
    jest.spyOn(global.Math, "random").mockRestore();

    //random results
    const randResults = rollCheck(passConfig);

    //affirm
    expect(passResults.hits).toBe(6);
    expect(missResults.hits).toBe(0);
    expect(critResults.hits).toBe(6);
    expect(critMissResults.hits).toBe(0);

    let expectedHitSum = 0;
    randResults.dice.forEach((die) => {
      if (die === 6 || (die + passConfig.mod >= passConfig.dc && die !== 1)) {
        expectedHitSum++;
      }
    });
    expect(randResults.hits).toBe(expectedHitSum);
  });
  describe("rerolling can be specifed", () => {
    test("will reroll all rolls of 1 if config specifies (controlled)", () => {
      //arrange
      const config: checkConfig = { num: 6, dc: 2, rerolls: "ones" };
      //   jest.spyOn(global.Math, "random").mockReturnValue(0.01);
      const dieRoll = jest.spyOn(global.Math, "random").mockReturnValue(0.01);
      //act
      const results = rollCheck(config);
      //affirm
      expect(dieRoll).toHaveBeenCalledTimes(12);
      jest.spyOn(global.Math, "random").mockRestore();
    });
    test("will reroll all rolls of 1 if config specifies (random)", () => {
      //arrange
      const config: checkConfig = { num: 6, dc: 2, rerolls: "ones" };
      const newDieRoll = jest.spyOn(global.Math, "random");
      //act
      const results = rollCheck(config);
      //affirm
      let expectedRerolls: number = 0;
      results.diceOriginal.forEach((die) => {
        if (die === 1) {
          expectedRerolls++;
        }
      });
      expect(newDieRoll).toHaveBeenCalledTimes(6 + expectedRerolls);
      jest.spyOn(global.Math, "random").mockRestore();
    });
    test("will reroll all rolls of failures if config specifies (controlled)", () => {
      //arrange
      const config: checkConfig = { num: 6, dc: 5, rerolls: "full" };
      //   jest.spyOn(global.Math, "random").mockReturnValue(0.01);
      const dieRollsFull = jest
        .spyOn(global.Math, "random")
        .mockReturnValue(0.5);
      //act
      const results = rollCheck(config);
      //affirm
      expect(dieRollsFull).toHaveBeenCalledTimes(12);
      jest.spyOn(global.Math, "random").mockRestore();
    });
    test("will reroll all failures if config specifies (random)", () => {
      //arrange
      const config: checkConfig = { num: 6, dc: 5, rerolls: "full" };
      const dieRollFullRand = jest.spyOn(global.Math, "random");
      //act
      const results = rollCheck(config);
      //affirm
      let expectedRerolls: number = 0;
      results.diceOriginal.forEach((die) => {
        if (die < 5) {
          expectedRerolls++;
        }
      });
      expect(dieRollFullRand).toHaveBeenCalledTimes(6 + expectedRerolls);
      jest.spyOn(global.Math, "random").mockRestore();
    });
    test("will reroll all rolls that aren't crits if specified(controlled)", () => {
      //arrange
      const config: checkConfig = { num: 6, dc: 2, rerolls: "crits" };
      
      const dieRollsFull = jest
        .spyOn(global.Math, "random")
        .mockReturnValue(0.68);
      //act
      const results = rollCheck(config);
      //affirm
      expect(dieRollsFull).toHaveBeenCalledTimes(12);
      jest.spyOn(global.Math, "random").mockRestore();
    });
    test("will reroll all rolls that aren't crits if specified(random)", () => {
      //arrange
      const config: checkConfig = { num: 6, dc: 3, rerolls: "crits" };
      const dieRollFullRand = jest.spyOn(global.Math, "random");
      //act
      const results = rollCheck(config);
      //affirm
      let expectedRerolls: number = 0;
      results.diceOriginal.forEach((die) => {
        if (die < 6) {
          expectedRerolls++;
        }
      });
      expect(dieRollFullRand).toHaveBeenCalledTimes(6 + expectedRerolls);
      jest.spyOn(global.Math, "random").mockRestore();
    });
  });
});

// jest.spyOn(global.Math, "random").mockReturnValue(0.3);
// jest.spyOn(global.Math, "random").mockRestore();
