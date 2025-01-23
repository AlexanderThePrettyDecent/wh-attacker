import rollSave from "../functions/save";
import { saveConfig, saveRes } from "../types";

describe("rollSave function", () => {
  test("an unmodified save passes if the roll is above the config save value", () => {
    //arrange
    const config: saveConfig = { save: 4, num: 1 };

    //act
    jest.spyOn(global.Math, "random").mockReturnValue(0.3);
    const fail: saveRes = rollSave(config);
    jest.spyOn(global.Math, "random").mockRestore();

    jest.spyOn(global.Math, "random").mockReturnValue(0.82);
    const pass: saveRes = rollSave(config);
    jest.spyOn(global.Math, "random").mockRestore();

    const random: saveRes = rollSave(config);

    //affirm

    expect(fail.saves).toBe(0);
    expect(pass.saves).toBe(1);

    if (random.dice[0] >= 4) {
      expect(random.saves).toBe(1);
    } else {
      expect(random.saves).toBe(0);
    }
  });
  test("a save roll's value is decreased by the AP value in the config", () => {
    //arrange
    const config = { save: 4, num: 1, AP: -2 };

    //act
    jest.spyOn(global.Math, "random").mockReturnValue(0.82);
    const pass: saveRes = rollSave(config);
    jest.spyOn(global.Math, "random").mockRestore();

    const random: saveRes = rollSave(config);

    //affirm
    expect(pass.saves).toBe(0);
    if (random.dice[0] + config.AP >= 4) {
      expect(random.saves).toBe(1);
    } else {
      expect(random.saves).toBe(0);
    }
  });
  test("multiple rolls can be made at once", () => {
    //arrange
    const config = { save: 4, num: 6, AP: -2 };

    //act
    const random: saveRes = rollSave(config);

    //affirm
    expect(random.dice.length).toBe(6);
  });
  test("if a modifer is applied to the save it is added to the roll, a roll of 1 always fails, regardless of modifier", () => {
    //arrange
    const modPassConfig = { save: 4, num: 6, mod: 1 };
    const oneFailsConfig = { save: 2, num: 6, mod: 1 };
    const randomConfig = { save: 4, num: 6, mod: 1 };

    //act
    jest.spyOn(global.Math, "random").mockReturnValue(0.34);
    const modPass = rollSave(modPassConfig);
    jest.spyOn(global.Math, "random").mockRestore();
    jest.spyOn(global.Math, "random").mockReturnValue(0.01);
    const oneFails = rollSave(oneFailsConfig);
    jest.spyOn(global.Math, "random").mockRestore();
    const random = rollSave(randomConfig);

    //affirm
    expect(modPass.saves).toBe(6);
    expect(oneFails.saves).toBe(0);

    let expectSaves: number = 0;
    random.dice.forEach((die) => {
      if (die + 1 >= 4) {
        expectSaves++;
      }
    });
    expect(random.saves).toBe(expectSaves);
  });
  test("if an invlunerable save is specified it is used if it is more likely to pass than the modified standard save", () => {
    //arrange
    const useInvulnconfig = { save: 4, num: 6, AP: -2, invuln: 4 };
    const noInvulnConfig = { save: 2, num: 6, invuln: 4 };
    const randomConfig = { save: 2, num: 6, AP: -3, invuln: 4 };

    //act
    jest.spyOn(global.Math, "random").mockReturnValue(0.51);
    const useInvuln = rollSave(useInvulnconfig);
    jest.spyOn(global.Math, "random").mockRestore();
    jest.spyOn(global.Math, "random").mockReturnValue(0.34);
    const noInvuln = rollSave(noInvulnConfig);
    jest.spyOn(global.Math, "random").mockRestore();
    const random = rollSave(randomConfig);

    //affirm
    expect(useInvuln.saves).toBe(6);
    expect(noInvuln.saves).toBe(6);

    let expectSaves: number = 0;
    random.dice.forEach((die) => {
      if (die >= 4) {
        expectSaves++;
      }
    });
    expect(random.saves).toBe(expectSaves);
  });
});

// jest.spyOn(global.Math, "random").mockReturnValue(0.3);
// jest.spyOn(global.Math, "random").mockRestore();
