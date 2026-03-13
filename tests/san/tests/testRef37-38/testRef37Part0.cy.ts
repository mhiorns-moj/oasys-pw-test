import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefThreeSeven',
    gender: 'Male',
    dateOfBirth: { years: -40 },
}

describe('SAN integration - test ref 37 part 0', () => {
    /**
     * Carry out a test for rolling back a countersigned assessment to ensure the san service process the request
     */

    it('Create offender', () => {

        oasys.login(oasys.Users.probSanUnappr)

        oasys.Offender.createProb(offender, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })
        })

    })
})