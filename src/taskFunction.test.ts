import { highestProduct } from './taskFunction'


describe("highestProduct()", () => {
    it("return 300 for [1, 10, 2, 6, 5, 3]", () => expect(highestProduct([1, 10, 2, 6, 5, 3])).toEqual(300))
    it("return 1600 for [-1, -5, -6, 8, 10, 20]", () => expect(highestProduct([-1, -5, -6, 8, 10, 20])).toEqual(1600))
    it("return 10000 for [-100, -5, -6, 8, 10, 20]", () => expect(highestProduct([-100, -5, -4, 8, 10, 20])).toEqual(10000))
    it("return 0 for [-1, -5, -6]", () => expect(highestProduct([-1, -5, -6])).toEqual(-30))
    it("return 0 for []", () => expect(highestProduct([])).toEqual(null))
    it("return 0 for [2,3]", () => expect(highestProduct([2,3])).toEqual(null))
    it("return 0 for [0,0,0]", () => expect(highestProduct([0,0,0])).toEqual(0))
    it("return 0 for [-10, -5, -3, -2, -1]", () => expect(highestProduct([-10, -5, -3, -2, -1])).toEqual(-6))
})
