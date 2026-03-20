import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefFortyNine',
    gender: 'Male',
    dateOfBirth: { years: -20 },
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

describe('SAN integration - test ref 49', () => {
    /**
        Offender has a previous historic period of supervision where latest assessment is a 3.2 OASys-SAN Assessment
     */

    it('Test ref 49 part 0 - create offender', () => {

        oasys.login(oasys.Users.probSanHeadPdu)  // No countersigning for this test

        oasys.Offender.createProb(offender, 'offender')

        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })

            oasys.logout()
        })
    })
})