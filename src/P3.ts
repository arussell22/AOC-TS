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

const numberRE = /\d+/g

const symbolRE = /[^A-Za-z0-9.]/g

const findIndices = (line: string) => {
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

const partOne = async (file: any) => {
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
    
    return total
}


const findIndicesTwo = (line: string) : Line => {
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

    return { numberIndices: numArr, symbolIndices: symArr, initialTotal: total } as Line
}

const partTwo = async (file: any) => {
    let oldestLine: Line = null
    let prevLine: Line = null
    let total = 0
    for await (const line of file.readLines()) {
        const currLine = findIndicesTwo(line.trim())
        // console.log(currLine)

        if (oldestLine && prevLine) { 
            // console.log(oldestLine, "\n")
            // console.log(prevLine, "\n")
            // console.log(currLine, "\n")
            prevLine.symbolIndices?.forEach((sym) =>  {
                const adjacents: number[] = []
                currLine.numberIndices?.forEach((num) => {
                    if (sym.pos >= num.startPos - 1 && sym.pos <= num.endPos) {
                        if (!num.counted) {
                            adjacents.push(parseInt(num.name))
                            console.log("Symbol - Curr", sym.name, "Name:", num.name, "Sym", sym.pos, "Start", num.startPos, "End", num.endPos)
                        }
                    }
                })

                const filtered = prevLine.numberIndices.filter((num) => (num.startPos - sym.pos === 1) || (sym.pos - num.endPos === 0))
                
                filtered.forEach((num) => adjacents.push(parseInt(num.name)))
                oldestLine.numberIndices?.forEach((num) => {
                    if (sym.pos >= num.startPos - 1 && sym.pos <= num.endPos) {
                        if (!num.counted) {
                            adjacents.push(parseInt(num.name))
                            // console.log("Counted", num.name, sym.pos, num.startPos, num.endPos)
                            console.log("Symbol - Oldest", sym.name, "Name:", num.name, "Sym", sym.pos, "Start", num.startPos, "End", num.endPos)
                        }
                    }
                })
                if (adjacents.length === 2) {
                    const gear = adjacents[0] * adjacents[1]
                    console.log("Symbol", sym.name, "First:", adjacents[0], "Second:", adjacents[1])
                    total += gear
                }
            })


            // currLine.numberIndices?.forEach((num) => {
            //     if (sym.pos >= num.startPos - 1 && sym.pos <= num.endPos) {
            //         if (!num.counted) {
            //             total += parseInt(num.name)
            //             num.counted = true
            //             console.log("Counted", num.name, sym.pos, num.startPos, num.endPos)
            //         }
            //     }
            // }))
            // currLine.symbolIndices?.forEach((sym) => prevLine.numberIndices?.forEach((num) => {
            //     if (sym.pos >= num.startPos - 1 && sym.pos <= num.endPos) {
            //         if (!num.counted) {
            //             total += parseInt(num.name)
            //             num.counted = true
            //             console.log("Counted", num.name, sym.pos, num.startPos, num.endPos)
            //         }
            //     }
            // }))
    
            // console.log ("True", prevLine.numberIndices.filter((a) => a.counted))
            // total += prevLine.numberIndices.reduce((a, b) => b.counted && (a + parseInt(b.name)), 0)
            // console.log(total)
        }
        oldestLine = prevLine
        prevLine = currLine
    }
    console.log(total)
    return total
}

const file = await open('./resources/part_3.txt')

// const first = await partOne(file)

const second = await partTwo(file)

