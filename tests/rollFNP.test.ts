import rollFNP from "../functions/rollFNP";
import { FNPconfig } from "../types";

describe("roll Feel No Pain", () => {
  test("rolls a die for a single wound, if die <= DC then final wounds = 1", () => {
    //arrange
    const config: FNPconfig = { wounds: 1, dc: 4 };
    //act
    jest.spyOn(global.Math, "random").mockReturnValue(0.51);
    const pass = rollFNP(config);
    jest.spyOn(global.Math, "random").mockRestore();
    jest.spyOn(global.Math, "random").mockReturnValue(0.34);
    const fail = rollFNP(config);
    jest.spyOn(global.Math, "random").mockRestore();
    const random = rollFNP(config);
    //affirm
    expect(pass.finalWounds).toBe(0);
    expect(fail.finalWounds).toBe(1);
    if (random.dice[0] >= 4) {
      expect(random.finalWounds).toBe(0);
    } else {
      expect(random.finalWounds).toBe(1);
    }
  });
  test("rolls the specified number of dice, counts a final wound for each failed roll", () => {
    //arrange
    const config: FNPconfig = { wounds: 10, dc: 4 };
    //act
    jest.spyOn(global.Math, "random").mockReturnValue(0.51);
    const pass = rollFNP(config);
    jest.spyOn(global.Math, "random").mockRestore();
    jest.spyOn(global.Math, "random").mockReturnValue(0.34);
    const fail = rollFNP(config);
    jest.spyOn(global.Math, "random").mockRestore();
    const random = rollFNP(config);
    //affirm
    expect(pass.finalWounds).toBe(0);
    expect(fail.finalWounds).toBe(10);
    let expectedWounds = 0;
    random.dice.forEach((die) => {
      if (die < 4) {
        expectedWounds++;
      }
    });
    expect(random.finalWounds).toBe(expectedWounds);
  });
});
