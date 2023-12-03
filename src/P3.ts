import { open } from "node:fs/promises"
import  _ from "lodash"

export interface Index {
    name: String
}

export class NumberIndex{
    name: string
    startPos: number
    endPos: number
    counted: boolean

    constructor(arr: any) {
        this.name = arr[0]
        this.startPos = arr["index"]
        this.endPos = arr["index"] + _.size(arr[0])
        this.counted = false
    }
}

export class SymbolIndex {
    name: string
    pos: number

    constructor(arr: any) {
        this.name = arr[0]
        this.pos = arr.index
    }
}

export interface Line {
    numberIndices: NumberIndex[]
    symbolIndices: SymbolIndex[]
    initialTotal: number
}

const findIndices = (line: string) => {
    const numberRE = /\d+/g

    const symbolRE = /[^A-Za-z0-9.]/g

    let numberIndices = []
    let symbolIndices = []
    let total = 0

    let match
    // while (match = numberRE.exec(line)) {
    //     console.log(match.index + ' ' + numberRE.lastIndex)
    // }

    numberIndices = [...line.matchAll(numberRE)]
    const numArr = _.map(numberIndices, (val) => new NumberIndex(val))

    symbolIndices = [...line.matchAll(symbolRE)]
    const symArr = _.map(symbolIndices, (val) => new SymbolIndex(val))

    symArr.forEach((sym) =>  numArr.forEach((num) => {
        if (num.startPos - sym.pos === 1) {
            // console.log("Initial", num.name, sym.pos, "Start", num.startPos)
            if (!num.counted) {
                num.counted = true
                total += parseInt(num.name)
            }

        } else if (sym.pos - num.endPos === 0) {
            // console.log("Initial", num.name, sym.pos, "End", num.endPos)
            if (!num.counted) {
                num.counted = true
                total += parseInt(num.name)
            }
        }
    }))

    return { numberIndices: numArr, symbolIndices: symArr, initialTotal: total } as Line
}

const file = await open('./resources/part_3.txt')
let prevLine: Line = null
let total = 0
for await (const line of file.readLines()) {
    const currLine = findIndices(line)
    total += currLine.initialTotal
    // console.log(currLine)
    if (prevLine) {
        prevLine.symbolIndices?.forEach((sym) =>  currLine.numberIndices?.forEach((num) => {
            if (sym.pos >= num.startPos - 1 && sym.pos <= num.endPos) {
                if (!num.counted) {
                    total += parseInt(num.name)
                    num.counted = true
                    console.log("Counted", num.name, sym.pos, num.startPos, num.endPos)
                }
            }
        }))
        currLine.symbolIndices?.forEach((sym) => prevLine.numberIndices?.forEach((num) => {
            if (sym.pos >= num.startPos - 1 && sym.pos <= num.endPos) {
                if (!num.counted) {
                    total += parseInt(num.name)
                    num.counted = true
                    console.log("Counted", num.name, sym.pos, num.startPos, num.endPos)
                }
            }
        }))

        // console.log ("True", prevLine.numberIndices.filter((a) => a.counted))
        // total += prevLine.numberIndices.reduce((a, b) => b.counted && (a + parseInt(b.name)), 0)
        console.log(total)
    }
    prevLine = currLine
}

