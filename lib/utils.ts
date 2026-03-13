
export function getString(param: string): string {
    return param == '' || param == 'null' || param == null ? null : param
}

export function getInteger(param: string): number {
    return param == '' || param == null || param.toLowerCase() == 'null' ? null : Number.parseInt(param)
}

export function lookupString(value: string, lookup: { [keys: string]: string }, translation: { [keys: string]: string } = null): string {

    const result = lookup[value]
    if (result == null || result == undefined) {
        return null
    }

    return translation == null ? result : lookupString(result, translation)
}

export function lookupInteger(value: string, lookup: { [keys: string]: string | number }, translation: { [keys: string]: number } = null): number {

    const result = lookup[value]
    if (result == null || result == undefined) {
        return null
    }
    if (translation == null) {
        return typeof result == 'string' ? stringToInt(result) : result
    } else {
        return lookupInteger(result as string, translation)
    }
}

export function lookupFloat(value: string, lookup: { [keys: string]: string | number }): number {

    const result = lookup[value]
    if (result == null || result == undefined) {
        return null
    }
    return typeof result == 'string' ? stringToFloat(result) : result
}

export function stringToInt(param: string): number {

    const result = Number.parseInt(param)
    return Number.isInteger(result) ? result : null
}

export function stringToFloat(param: string): number {

    const result = Number.parseFloat(param)
    return Number.isNaN(result) ? null : result
}

export function stringParameterToString(param: string): string {

    return param == null ? 'null' : `'${param}'`
}

export function numericParameterToString(param: number): string {

    return param == null ? 'null' : param.toString()
}

export function stringParameterToCsvOutputString(param: string): string {

    return param == null ? '' : param
}

export function numericParameterToCsvOutputString(param: number): string {

    return param == null ? '' : param.toString()
}

export function problemsAnswerToNumeric(param: ProblemsAnswer | ProblemsMissingAnswer): number {

    switch (param) {
        case '0-No problems':
            return 0
        case '1-Some problems':
            return 1
        case '2-Significant problems':
            return 2
    }
    return null  // includes 'Missing'
}

export function jsonString(param: string, options?: { removeCrLf?: boolean, remove002?: boolean, removeFf?: boolean }): string {

    if (param == null) {
        return null
    }
    let result = options?.removeCrLf ? JSON.stringify(param.replaceAll('"', '\"')).slice(1, -1) : param.replaceAll('"', '\"')

    result = options?.remove002 ? result.replaceAll('\u0002', '') : result
    result = options?.removeFf ? result.replaceAll('\u000C', '') : result
    return result.substring(0, 4000)
}

export const genderNumberLookup = {
    '0': 'N',
    '1': 'M',
    '2': 'F',
    '3': 'O',
    '9': 'U',
}

export const yesNoToYNLookup = {
    YES: 'Y',
    NO: 'N',
    Yes: 'Y',
    No: 'N',
}