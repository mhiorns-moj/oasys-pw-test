import * as oasys from 'lib'

describe('This is a sample test to create some probation offenders', () => {


    const offenderDetails: OffenderDef = {

        cro: '',
        forename1: 'Autotest',
        // forename2: '',
        // forename3: '',
        gender: 'Male',
        // ethnicity: '',
        dateOfBirth: { years: -20 },
        // limitedAccessOffender: '',
        // language: '',
        // phoneNumber: '',
        // religion: '',
        // addressLine1: '',
        // addressLine2: '',
        // addressLine3: '',
        // addressLine6: '',
        // postcode: '',

        event: {
            eventDetails: {
                sentenceType: 'Fine',
                sentenceDate: { months: -6 },
                sentenceMonths: null,
                // sentenceHours: '',
                // releaseType: '',
                // releaseDate: '',
                // court: '',
                // courtType: '',
                // licenceCondition: '',
            },
            sentenceDetails: [
                {
                    detailCategory: 'CJA Activity',
                    detailType: 'Skills',
                    lengthHours: 20,
                    lengthMonths: null,
                    detailDescription: null,
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
                    {
                        offence: '030',
                        subcode: '01',
                        additionalOffence: true,
                    },
                ],
        },
        // aliases: [
        //     {
        //         surname: 'Alias 1 Surname',
        //         forename1: '',
        //         forename2: '',
        //         gender: 'Male',
        //         dateOfBirth: { years: -25 },
        //     },
        // ],
    }


    it('Create probation offenders', () => {

        oasys.login(oasys.Users.probHeadPdu)

        for (var i = 1; i <= 2; i++) {
            offenderDetails.forename1 = `Test ${i}`
            oasys.Offender.createProb(offenderDetails, `probationOffender${i}`)
        }

        oasys.logout()
    })

})