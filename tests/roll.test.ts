import roll from "../functions/roll";
beforeEach(() => {});

afterEach(() => {});
describe("roll", () => {
  test("by default will roll return a random number between 1 and 6", () => {
    //arrange
    //act
    const result: number[] = [];
    for (let i = 0; i < 10; i++) {
      const newRoll = roll();
      result.push(newRoll);
    }
    //assert
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeGreaterThan(0);
      expect(result[i]).toBeLessThan(7);
    }
  });
  test("if passed a number as an arguement returns a random number between 1 and that number", () => {
    //arrange
    const result3: number[] = [];
    const result20: number[] = [];
    //act
    for (let i = 0; i < 10; i++) {
      const newRoll = roll(20);
      result20.push(newRoll);
    }

    for (let i = 0; i < 10; i++) {
      const newRoll = roll(3);
      result3.push(newRoll);
    }
    //assert
    for (let i = 0; i < result20.length; i++) {
      expect(result20[i]).toBeGreaterThan(0);
      expect(result20[i]).toBeLessThan(20);
    }
    for (let i = 0; i < result3.length; i++) {
      expect(result3[i]).toBeGreaterThan(0);
      expect(result3[i]).toBeLessThan(4);
    }
  });
  describe("can be passed a config object", () => {
    test("config object can specify the number of dice to be rolled", () => {
      //arrange
      const config = { dice: 2 };
      //act
      const result: number[] = [];
      for (let i = 0; i < 10; i++) {
        const newRoll = roll(6, config);
        result.push(newRoll);
      }
      //assert
      for (let i = 0; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(1);
        expect(result[i]).toBeLessThan(13);
      }
    });
    test("config object can specify a modifier that is added to the result of the roll", () => {
      //arrange
      const config1 = { modifiers: 1 };
      const config2 = { modifiers: -1 };
      const result: number[] = [];
      const result2: number[] = [];
      jest.spyOn(global.Math, "random").mockReturnValue(0.3);
      //act
      for (let i = 0; i < 10; i++) {
        const newRoll = roll(6, config1);
        result.push(newRoll);
      }
      for (let i = 0; i < 10; i++) {
        const newRoll = roll(6, config2);
        result2.push(newRoll);
      }
      //assert
      for (let i = 0; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(1);
        expect(result[i]).toBeLessThan(7);
        expect(result[i]).toBe(3);
      }
      for (let i = 0; i < result2.length; i++) {
        expect(result2[i]).toBeGreaterThan(-1);
        expect(result2[i]).toBeLessThan(6);
        expect(result2[i]).toBe(1);
      }
      jest.spyOn(global.Math, "random").mockRestore();
    });
    test("config object can specify whether to reroll rolls of 1", () => {
      //arrange
      const config1 = { reroll: true } as const;
      const result: number[] = [];
      const result2: number[] = [];
      //act
      for (let i = 0; i < 10; i++) {
        const newRoll = roll(6, config1);
        result.push(newRoll);
      }
      //assert
      console.log(result);
      for (let i = 0; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(0);
        expect(result[i]).toBeLessThan(7);
      }
    });
  });
});
