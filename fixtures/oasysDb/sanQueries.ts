import * as lib from 'lib'
import { OasysDateTime } from 'lib/dateTime'
import { OasysDb } from './oasysDb'


export class SanQueries {

    constructor(readonly db: OasysDb) { }


    /**
     * Checks that the last update time in oasys_set matches the current system time (with a 10 second tolerance) for a given assessment PK.
     * 
     * Returns a boolean result (true if failed).
    */
    async checkLastUpdateTime(pk: number): Promise<boolean> {

        const query = `select to_char(lastupd_from_san, '${OasysDateTime.oracleTimestampFormat}'), to_char(sysdate, '${OasysDateTime.oracleTimestampFormat}') 
                            from eor.oasys_set where oasys_set_pk = ${pk}`

        const updateTimes = await this.db.getData(query)
        const diff = OasysDateTime.timestampDiffString(updateTimes[0][0], updateTimes[0][1])  // ms

        if (diff > 10000) {  // 10 seconds - allows time from updating SAN, returning to OASys and updating the db.
            lib.log(`FAILED - SAN update time mismatch in oasys_set- expected: ${updateTimes[0][0]}, updated: ${updateTimes[0][1]}`)
            return true
        }
        return false
    }

    /**
     * Checks cLog for a getAssessment call for the given PK, including the expected version number in the respose.
     */
    async checkSanGetAssessmentCall(pk: number, expectedVersion: number, suppressLog = false): Promise<boolean> {

        if (!suppressLog) {
            lib.log(`Checking GetAssessment call for ${pk}`)
        }
        const query = `select log_text from eor.clog where log_source like '%${pk}%SAN_GET_ASS%' order by time_stamp desc fetch first 2 rows only`
        const clogData = await this.db.getData(query)
        let failed = false

        if (clogData.length != 2) {
            lib.log(`GetAssessment call FAILED - Expected 2 rows in CLog, found ${clogData.length}`)
            failed = true
        } else {
            if (clogData[1][0].search(pk.toString()) < 0) {
                lib.log(`GetAssessment call FAILED - ${pk} not found in GetAssessment call`)
                failed = true
            }
            const sanVersionNumber = findSanVersion(clogData[0][0])
            if (sanVersionNumber != expectedVersion) {
                lib.log(`GetAssessment call FAILED - Expected version: ${expectedVersion}, found ${sanVersionNumber}`)
                failed = true
            }
        }
        return failed
    }
}


function findSanVersion(data: string): number {

    const vStart = data.search('sanAssessmentVersion') + 22
    let sanVersionNumber = data.substring(vStart, vStart + 4)
    const vEnd = sanVersionNumber.search(',')

    const number = parseInt(sanVersionNumber.substring(0, vEnd))
    return number
}

function findSpVersion(data: string): number {

    const vStart = data.search('sentencePlanVersion') + 21
    let spVersionNumber = data.substring(vStart, vStart + 4)
    const vEnd = spVersionNumber.search('}')
    const number = parseInt(spVersionNumber.substring(0, vEnd))
    return number
}
