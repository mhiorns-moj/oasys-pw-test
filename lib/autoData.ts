/**
 * __oasys.*function*__  
 * 
 * Generate test data: dates and long strings.
 * 
 * @module Autodata
 */

import * as oasysDb from './data/oasysDb'
import { userSuffix } from 'localSettings'

/** 
 * Returns a string with x characters.  The string includes some spaces and carriage returns, and a counter at regular intervals.
 */
export function oasysString(length: number): string {

    let result = ''
    let i = 0
    let letters = 'ABCD efg'
    let lineLength = 0

    while (i < length - 12) {
        // Add 10 characters at a time, including a counter, until nearly at the end
        i += 10
        lineLength += 10
        let counter = i.toString()
        result += `${letters.substring(0, 10 - counter.length)}${counter}`

        if (lineLength == 400) {
            result += '\n'  // newline counts 2 characters
            i += 2
            lineLength = 0
        }
    }

    return `${result}${'.'.repeat(length - i)}`
}

/**
 * Replaces null offender identifiers (surname, Probation CRN, Nomis ID and PNC) with generated unique values.
 * Returns true for success, false if there is an error doing database checks
 */
export async function populateAutoData(offender: OffenderDef): Promise<boolean> {

    if (!offender.surname) {
        offender.surname = await generateSurname()
        if (offender.surname == null) {
            return false
        }
    }
    if (!offender.probationCrn) {
        offender.probationCrn = await generateCrn()
        if (offender.probationCrn == null) {
            return false
        }
    }
    if (!offender.pnc) {
        offender.pnc = await generatePnc()
        if (offender.pnc == null) {
            return false
        }
    }
    if (!offender.nomisId) {
        offender.nomisId = await generateNomisId()
        if (offender.nomisId == null) {
            return false
        }
    }
    return true
}

/**
 * Creates a unique surname based on the local user suffix and some random letters.
 */
async function generateSurname(): Promise<string> {

    // return `Auto${userSuffix} ${dayjs().format('DD-MM-YY HH-mm-ss')}`  Preferred option would be to revert to using a timestamp but SAN currently blocks this

    let surname = ''
    let count = 1

    do {
        surname = `Auto${userSuffix} `

        for (var i = 0; i < 5; i++) {
            surname += getRandomChar()
        }

        const result: DbResponse = await oasysDb.selectCount(`select count(*) from eor.offender where family_name = '${surname}'`)
        if (result.error != null) { // database error
            return null
        }
        count = result.data as number

    } while (count > 0)

    return surname
}

/** 
 * Creates a random PNC.  The year part is in the range 41 to 61, the main numeric part is 1000 to 9999999.
 * The database is checked in case the PNC exists already, with retries until a new one is found.
 */
async function generatePnc(): Promise<string> {

    const check_digits = "ZABCDEFGHJKLMNPQRTUVWXY"

    let pnc = ''
    let count = 1

    do {
        let pnc_year = getRandomInt(41, 62)
        let pnc_number = getRandomInt(1000, 10000000)
        let check_val = ((pnc_year * 10000000) + pnc_number) % 23
        pnc = `${pnc_year}/${pnc_number}${check_digits[check_val]}`

        const result: DbResponse = await oasysDb.selectCount(`select count(*) from eor.offender where pnc = '${pnc}'`)
        if (result.error != null) { // database error
            return null
        }
        count = result.data as number

    } while (count > 0)

    return pnc
}

/**
 * Creates a random probation CRN of 7 upper-case letters - first letter is Z for all automated tests.
 * The database is checked in case the CRN exists already, with retries until a new one is found.
 */
async function generateCrn(): Promise<string> {

    let crn = ''
    let count = 1

    do {
        crn = 'Z'
        for (var i = 0; i < 6; i++) {
            crn += getRandomChar()
        }

        const result: DbResponse = await oasysDb.selectCount(`select count(*) from eor.offender where cms_prob_number = '${crn}'`)
        if (result.error != null) { // database error
            return null
        }
        count = result.data as number

    } while (count > 0)

    return crn
}

/**
 * Creates a random NOMIS Id of 1 upper-case letter, 4 digits and 2 upper-case letters - first letter is Z for all automated tests.
 * The database is checked in case the Id exists already, with retries until a new one is found.
 */
async function generateNomisId(): Promise<string> {

    let nomisID = ''
    let count = 1

    do {
        nomisID = 'Z'

        nomisID += getRandomInt(0, 9999).toString().padStart(4, '0')
        nomisID += getRandomChar() + getRandomChar()

        const result: DbResponse = await oasysDb.selectCount(`select count(*) from eor.offender where cms_pris_number = '${nomisID}'`)
        if (result.error != null) { // database error
            return null
        }
        count = result.data as number

    } while (count > 0)

    return nomisID
}

/**
 * Returns a random integer between min and max values (inclusive)
 */
function getRandomInt(min: number, max: number): number {

    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Returns a random capital letter
 */
function getRandomChar(): string {

    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[getRandomInt(0, 25)]
}