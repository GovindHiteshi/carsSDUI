

export function addTwoNumber(a: number, b: number): number {
    return a + b;
}

export function multiplyTwoNumber(a: number, b: number): number {
    return a * b;
}

export function substractTwoNumber(a: number, b: number): number {
    return a - b;
}


export function divideTwoNumber(a: number, b: number): number {
    return a / b;
}

export function makeItSqure(data: number[]): number[] {

    const map = data.map((item, index) => {
        return item * item
    })

    return map;

}


