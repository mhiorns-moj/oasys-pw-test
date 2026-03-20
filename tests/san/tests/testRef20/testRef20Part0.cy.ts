import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefTwenty',
    gender: 'Male',
    dateOfBirth: { years: -40 },
    event: {
        eventDetails: {
            sentenceType: 'Fine',
            sentenceDate: { months: -6 },
        },
        offences:
        {
            offence: '019',
            subcode: '08',
        },
    },
}

describe('SAN integration - test ref 20', () => {
    /**
        Male Probation offender aged >18
        SAN assessment invokes a SARA within OASys.
        Countersigner rejects the signing - (check for NOD-950 in 6.51.release)
     */

    it('Test ref 20 part 0 - create offender', () => {

        oasys.login(oasys.Users.probSanPo)

        oasys.Offender.createProb(offender, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })
        })
    })
})