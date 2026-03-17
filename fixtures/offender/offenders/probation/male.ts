/**
 * A basic offender with minimal details including a burglary offence.
 * ID fields will be auto-generated.
 */
export const burglary: OffenderDef = {

    forename1: 'Autotest',
    gender: 'Male',
    dateOfBirth: { years: -25 },

    event: {
        eventDetails: {
            sentenceType: 'Fine',
            sentenceDate: { months: -6 },
        },
        offences:
        {
            offence: '028',
            subcode: '01',
        },
    },
}

/**
 * Basic offender but with two (non-sexual) offences and two aliases.
 */
export const twoOffencesWithAliases: OffenderDef = {

    forename1: 'Autotest',
    gender: 'Male',
    dateOfBirth: { years: -20 },

    event: {
        eventDetails: {
            sentenceType: 'Fine',
            sentenceDate: { months: -6 },
        },
        offences: [
            {
                offence: '028',
                subcode: '01',
            },
            {
                offence: '030',
                subcode: '01',
                additionalOffence: true,
            },
        ],
    },

    aliases: [
        {
            surname: 'Smith',
            forename1: 'John',
        },
        {
            surname: 'Smithy',
            forename1: 'James',
            dateOfBirth: { years: -22 },
        },
    ]
}