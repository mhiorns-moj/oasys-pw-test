/**
 * A basic offender with minimal details including a burglary offence.
 */
export const burglary: OffenderDef = {

    forename1: 'Autotest',
    gender: 'Male',
    dateOfBirth: { years: -25 },

    event: {
        eventDetails: {
            sentenceType: 'Custody (1 to 4 yrs - ACR)',
            sentenceDate: { months: -6 },
            sentenceMonths: 24,
        },
        offences:
        {
            offence: '028',
            subcode: '01',
        },
    },
}

