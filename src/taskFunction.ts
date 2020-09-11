// 1: Create a function that, given a list of integers, returns the highest product between three of those numbers. 
// For example, given the list [1, 10, 2, 6, 5, 3] the highest product would be 10 * 6 * 5 = 300

export const highestProduct = (list: number[]): number | null => {
    if (list.length < 3) return null
    list.sort((a,b)=>a-b)
    return Math.max(list[0] * list[1] * list[list.length -1], list[list.length -3]* list[list.length -2]* list[list.length -1] )
}


