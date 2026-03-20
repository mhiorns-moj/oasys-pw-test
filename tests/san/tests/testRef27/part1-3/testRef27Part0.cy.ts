import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefTwentySeven',
    gender: 'Male',
    dateOfBirth: { years: -40 },
}

describe('SAN integration - test ref 27', () => {

    // Check 'Lock Incomplete' - using the OASys application, different ways sends a notification to the SAN Service

    it('Test ref 27 part 0 - create offender', () => {

        oasys.login(oasys.Users.probSanUnappr)

        oasys.Offender.createProb(offender, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })
        })
    })
})