
export interface Index {
    name: String
}

export class NumberIndex{
    name: string
    startPos: number
    endPos: number

    constructor(arr: any[]) {
        this.name = arr[0]
        this.startPos = arr[1]
        this.endPos = 0
    }
}

export interface SymbolIndex extends Index {
    pos: number
}