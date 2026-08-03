import {
  addTwoNumber, divideTwoNumber, multiplyTwoNumber,
  substractTwoNumber, makeItSqure
} from '../src/utils/helper';


describe("Test helper functions", () => {

  test("Add Two number", () => {

    expect(addTwoNumber(2, 8)).toBe(10);
    expect(addTwoNumber(2, 0)).toBe(2);
    expect(addTwoNumber(-2, -0)).toBe(-2);
  })


  test("multiplay two number", () => {
    expect(multiplyTwoNumber(2, 8)).toBe(16);
    expect(multiplyTwoNumber(6, 15)).toBe(90);
  })

  test("substract two number", () => {

    expect(substractTwoNumber(2, 8)).toBe(-6);
    expect(substractTwoNumber(15, 6)).toBe(9);
  })

  test("divide two number", () => {
    expect(divideTwoNumber(2, 8)).toBe(0.25);
    expect(divideTwoNumber(15, 6)).toBe(2.5);
  })


  test("array length", () => {

    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    expect(makeItSqure(arr)).toEqual([1, 4, 9, 16, 25, 36, 49, 64, 81, 100]);


  })

})