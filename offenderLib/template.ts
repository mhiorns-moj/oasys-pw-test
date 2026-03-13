export const templateProbationOffender: OffenderDef = {

    probationCrn: null,
    cro: '',
    pnc: null,
    nomisId: null,
    surname: null,
    forename1: 'Autotest',
    forename2: '',
    forename3: '',
    gender: 'Male',
    ethnicity: '',
    dateOfBirth: { years: -20 },
    limitedAccessOffender: false,
    language: '',
    phoneNumber: '',
    religion: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    addressLine5: '',
    addressLine6: '',
    postcode: '',

    event: {
        eventDetails: {
            sentenceType: 'Fine',
            sentenceDate: { months: -6 },
            sentenceMonths: null,
            sentenceHours: null,
            releaseType: '',
            releaseDate: '',
            court: '',
            courtType: '',
            licenceCondition: '',
        },
        sentenceDetails: [
            {
                detailCategory: 'CJA Activity',
                detailType: 'Skills',
                lengthHours: null,
                lengthMonths: null,
                detailDescription: '',
                displayOrder: 1,
            },
        ],
        offences:
            [
                {
                    offence: '028',
                    subcode: '01',
                    additionalOffence: false,
                },
            ],
    },
    aliases: [
        {
            surname: 'Alias 1 surname',
            forename1: '',
            forename2: '',
            gender: 'Male',
            dateOfBirth: { years: -25 },
        },
    ],
}
