import hitRoll from "../functions/hitrolls";
import { hitConfig } from "../types";

describe.only("hitRoll function, takes hitConfig object and returns hitRes object", () => {
  test("when passed a single attack with no modifers or rerolls returns the correct number of hits", () => {
    //arrange
    const easy = { A: 1, WS: 2 };
    const hard = { A: 1, WS: 4 };
    //act
    jest.spyOn(global.Math, "random").mockReturnValue(0.3);
    const hitResults = hitRoll(easy);
    const missResults = hitRoll(hard);
    jest.spyOn(global.Math, "random").mockRestore();
    const randResults = hitRoll(hard);
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
    const easy = { A: 6, WS: 2 };
    const hard = { A: 6, WS: 4 };
    //act
    jest.spyOn(global.Math, "random").mockReturnValue(0.3);
    const hitResults = hitRoll(easy);
    const missResults = hitRoll(hard);
    jest.spyOn(global.Math, "random").mockRestore();
    const randResults = hitRoll(hard);
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
    const config = { A: 6, WS: 2 };
    //act
    jest.spyOn(global.Math, "random").mockReturnValue(0.3);
    const noCritResults = hitRoll(config);
    jest.spyOn(global.Math, "random").mockRestore();
    jest.spyOn(global.Math, "random").mockReturnValue(0.9);
    const allCritResults = hitRoll(config);
    jest.spyOn(global.Math, "random").mockRestore();
    const randResults = hitRoll(config);
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
    const passConfig = { A: 6, WS: 3, mod: 1 };
    const missConfig = { A: 6, WS: 3, mod: -1 };
    const critConfig = { A: 6, WS: 6, mod: -1 };
    const critMissConfig = { A: 6, WS: 2, mod: 1 };
    //act
    //hits that would miss when unmodified pass
    jest.spyOn(global.Math, "random").mockReturnValue(0.3);
    const passResults = hitRoll(passConfig);
    jest.spyOn(global.Math, "random").mockRestore();

    //hits that would pass when unmodified miss
    jest.spyOn(global.Math, "random").mockReturnValue(0.34);
    const missResults = hitRoll(missConfig);
    jest.spyOn(global.Math, "random").mockRestore();

    //crits ignore modifiers
    jest.spyOn(global.Math, "random").mockReturnValue(0.9);
    const critResults = hitRoll(critConfig);
    jest.spyOn(global.Math, "random").mockRestore();

    //crit misses ignore modifiers
    jest.spyOn(global.Math, "random").mockReturnValue(0.1);
    const critMissResults = hitRoll(critMissConfig);
    jest.spyOn(global.Math, "random").mockRestore();

    //random results
    const randResults = hitRoll(passConfig);

    //affirm
    expect(passResults.hits).toBe(6);
    expect(missResults.hits).toBe(0);
    expect(critResults.hits).toBe(6);
    expect(critMissResults.hits).toBe(0);

    let expectedHitSum = 0;
    randResults.dice.forEach((die) => {
      if (die === 6 || (die + passConfig.mod >= passConfig.WS && die !== 1)) {
        expectedHitSum++;
      }
    });
    expect(randResults.hits).toBe(expectedHitSum);
  });
  describe("rerolling can be specifed", () => {
    test("will reroll all rolls of 1 if config specifies (controlled)", () => {
      //arrange
      const config: hitConfig = { A: 6, WS: 2, rerolls: "ones" };
      //   jest.spyOn(global.Math, "random").mockReturnValue(0.01);
      const dieRoll = jest.spyOn(global.Math, "random").mockReturnValue(0.01);
      //act
      const results = hitRoll(config);
      //affirm
      expect(dieRoll).toHaveBeenCalledTimes(12);
      jest.spyOn(global.Math, "random").mockRestore();
    });
    test("will reroll all rolls of 1 if config specifies (random)", () => {
      //arrange
      const config: hitConfig = { A: 6, WS: 2, rerolls: "ones" };
      const newDieRoll = jest.spyOn(global.Math, "random");
      //act
      const results = hitRoll(config);
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
      const config: hitConfig = { A: 6, WS: 5, rerolls: "full" };
      //   jest.spyOn(global.Math, "random").mockReturnValue(0.01);
      const dieRollsFull = jest
        .spyOn(global.Math, "random")
        .mockReturnValue(0.5);
      //act
      const results = hitRoll(config);
      //affirm
      expect(dieRollsFull).toHaveBeenCalledTimes(12);
      jest.spyOn(global.Math, "random").mockRestore();
    });
    test("will reroll all failures if config specifies (random)", () => {
      //arrange
      const config: hitConfig = { A: 6, WS: 5, rerolls: "full" };
      const dieRollFullRand = jest.spyOn(global.Math, "random");
      //act
      const results = hitRoll(config);
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
      const config: hitConfig = { A: 6, WS: 2, rerolls: "crits" };
      //   jest.spyOn(global.Math, "random").mockReturnValue(0.01);
      const dieRollsFull = jest
        .spyOn(global.Math, "random")
        .mockReturnValue(0.68);
      //act
      const results = hitRoll(config);
      //affirm
      expect(dieRollsFull).toHaveBeenCalledTimes(12);
      jest.spyOn(global.Math, "random").mockRestore();
    });
    test("will reroll all rolls that aren't crits if specified(random)", () => {
      //arrange
      const config: hitConfig = { A: 6, WS: 3, rerolls: "crits" };
      const dieRollFullRand = jest.spyOn(global.Math, "random");
      //act
      const results = hitRoll(config);
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
