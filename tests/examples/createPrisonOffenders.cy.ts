import * as oasys from 'lib'

describe('This is a sample test', () => {


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
        // addressLine4: '',
        // addressLine5: '',
        // addressLine6: '',
        // postcode: '',

        event: {
            eventDetails: {
                sentenceType: 'Custody (under 12 months - AUR)',
                sentenceDate: { months: -6 },
                sentenceMonths: 6,
            },
            offences:
                [
                    {
                        offence: '028',
                        subcode: '01',
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

    it('Create prison offenders', () => {
        oasys.login(oasys.Users.prisHomds)

        for (var i = 1; i <= 2; i++) {
            offenderDetails.forename1 = `Test ${i}`
            oasys.Offender.createPris(offenderDetails, `prisonOffender${i}`)
        }

        oasys.logout()
    })
})