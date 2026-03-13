import { Temporal } from '@js-temporal/polyfill'

export type AppVersions = { [keys: string]: Temporal.PlainDateTime }
export const appVersions: AppVersions = {}
export let currentVersion = ''

export class OasysDateTime {

    static testStartDate = Temporal.Now.plainDateISO()
    static dateFormat = 'YYYY-MM-DD'                // RFC 9557 format for Temporal
    static timestampFormat = 'YYYY-MM-DDTHH:mm:ss'
    static oracleTimestampFormat = 'YYYY-MM-DD\"T\"HH24:MI:SS'
    static oracleTimestampFormatMs = 'YYYY-MM-DD\"T\"HH24:MI:SS.FF3'
    static timers: { [keys: string]: Temporal.PlainDateTime } = {}

    // Convert date string to Temporal Plain date.  Might be in RFC9557 format, but also need to allow for DD/MM/YYYY in OASys string fields or DD-MM-YYYY from CSV loads
    static stringToDate(param: string): Temporal.PlainDate {

        if (param == null || param == '' || param == 'null') {
            return null
        }
        let reformatted = param
        if (['/', '-'].includes(param.substring(2, 3))) {
            reformatted = `${param.substring(6)}-${param.substring(3, 5)}-${param.substring(0, 2)}`
        }
        try {
            return Temporal.PlainDate.from(reformatted)
        } catch (e) {
            return null
        }
    }

    static stringToTimestamp(param: string): Temporal.PlainDateTime {

        return Temporal.PlainDateTime.from(param)
    }

    static dateParameterToString(param: Temporal.PlainDate): string {

        return param == null ? 'null' : `to_date('${param?.toLocaleString().replace('/', '-')}','DD-MM-YYYY')`
    }

    static dateParameterToCsvOutputString(param: Temporal.PlainDate): string {

        return param == null ? 'null' : `${param.toLocaleString()}`
    }

    // Get difference between two date strings in days/months/years.  -ve result indicates that the first date is later than the second date
    static dateDiffString(firstDate: string, secondDate: string, unit: 'day' | 'month' | 'year'): number {

        const date1 = this.stringToDate(firstDate)
        const date2 = this.stringToDate(secondDate)

        return (this.dateDiff(date1, date2, unit))
    }

    // Get difference between two dates (Temporal.PlainDate).  -ve result indicates that the first date is later than the second date
    static dateDiff(firstDate: Temporal.PlainDate, secondDate: Temporal.PlainDate, unit: 'year' | 'month' | 'day', ofm: boolean = false): number {

        if (firstDate == null || secondDate == null) {
            return null
        }
        const dateDiff = secondDate.since(firstDate, { smallestUnit: unit, largestUnit: unit })
        let diff = unit == 'day' ? dateDiff.days : unit == 'month' ? dateDiff.months : dateDiff.years

        // Leap-year fix - if dob = 29/2, 28/2 is not a birthday on a non-leap year; the calculation doesn't work like that
        if (unit == 'year' && firstDate.day == 29 && firstDate.month == 1 && secondDate.day == 28 && secondDate.month == 1 && !secondDate.inLeapYear) {
            diff--
        }

        if (ofm) {
            return diff < 0 ? 0 : diff > 36 ? 36 : diff
        } else {
            return diff >= 0 ? diff : null
        }
    }

    static timestampDiffString(firstDate: string, secondDate: string): number {

        const date1 = this.stringToTimestamp(firstDate)
        const date2 = this.stringToTimestamp(secondDate)

        return (this.timestampDiff(date1, date2))
    }

    // Get difference between two timestamps (Temporal.PlainDateTime) in milliseconds.  -ve result indicates that the first date is later than the second date
    static timestampDiff(firstDate: Temporal.PlainDateTime, secondDate: Temporal.PlainDateTime): number {

        if (firstDate == null || secondDate == null) {
            return null
        }
        const diff = secondDate.since(firstDate, { smallestUnit: 'millisecond', largestUnit: 'millisecond' })
        return diff.abs().milliseconds
    }

    /**
     * Calculate a date based on the test start date (i.e. today unless the test runs over midnight), using an OasysDate object which can contain any of the following (all optional):
     *  - years
     *  - months
     *  - weeks
     *  - days
     * 
     * These should be provided as positive or negative integers which are used as offsets to calculate a date.
     * The return value is a string in the normal OASys date format (dd/mm/yyyy).
     * 
     * If no values are specified (or no parameter at all), returns today's date.  If the parameter is a string, it is returned unchanged.
     */
    static oasysDateAsString(offset?: OasysDate): string {

        if (typeof offset == 'string') {
            return offset
        }

        return OasysDateTime.calculateOffsetDate(offset).toLocaleString()
    }

    static oasysDateAsPlainDate(offset?: OasysDate): Temporal.PlainDate {

        if (offset == null || typeof offset == 'string') {
            return null
        }
        return OasysDateTime.calculateOffsetDate(offset)
    }

    static oasysDateAsDbString(offset?: OasysDate): string {

        if (typeof offset == 'string') {
            return this.stringToDate(offset).toString()     // Assume it's a standard date, reformat it to YYYY-MM-DD
        }

        return OasysDateTime.calculateOffsetDate(offset).toString()
    }

    static calculateOffsetDate(offset: OasysDate): Temporal.PlainDate {

        const d = offset as { days?: number, weeks?: number, months?: number, years?: number }
        let result = OasysDateTime.testStartDate

        if (d?.days) result = result.add({ days: d.days })
        if (d?.months) result = result.add({ months: d.months })
        if (d?.years) result = result.add({ years: d.years })

        return result
    }

    static timeZoneOffset(): string {
        return Temporal.Now.zonedDateTimeISO().offset
    }

    static startTimer(name: string) {

        OasysDateTime.timers[name] = Temporal.Now.plainDateTimeISO()
    }

    // Returns elapsed time in milliseconds
    static elapsedTime(name: string): number {

        return OasysDateTime.timestampDiff(OasysDateTime.timers[name], Temporal.Now.plainDateTimeISO())
    }

    static checkIfAfterReleaseNode(version: SignificantAppVersions, date: Temporal.PlainDateTime | string): boolean {

        return checkIfAfter(version, date, appVersions)
    }

    // Generic version for use in code that could be called from either Cypress or Node
    static checkIfAfterRelease(versions: {}, version: SignificantAppVersions, date: Temporal.PlainDateTime | string): boolean {

        return checkIfAfter(version, date, versions)
    }

    static dateToVersion(date: string | Temporal.PlainDateTime): string {

        const testDate = typeof date == 'string' ? OasysDateTime.stringToTimestamp(date) : date

        for (let key of Object.keys(appVersions)) {
            if (Temporal.PlainDateTime.compare(testDate, appVersions[key]) >= 0) {
                return key
            }
        }
        return 'unknown version'
    }
}

function checkIfAfter(version: SignificantAppVersions, date: Temporal.PlainDateTime | string, appVersions: AppVersions): boolean {

    const versionDate = appVersions[versionLookup[version]]
    const testDate = typeof date == 'string' ? OasysDateTime.stringToTimestamp(date) : date
    return versionDate ? Temporal.PlainDateTime.compare(testDate, versionDate) == 1 : null
}

const versionLookup = {
    '6.20': '6.20.0.0',
    '6.30': '6.30.0.0',
    '6.35': '6.35.0.0',
    '6.49': '6.49.0.0',
}

export function setCurrentVersion(version: string) {

    currentVersion = version
}