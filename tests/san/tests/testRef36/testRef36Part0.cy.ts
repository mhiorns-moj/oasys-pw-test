import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefThreeSix',
    gender: 'Male',
    dateOfBirth: { years: -40 },
}

describe('SAN integration - test ref 36', () => {
    /**
     * 1) Create and complete a 3.2 assessment 
     * 2) Create a new 3.2 assessment ( clones from 1 incuding the san part), modify SAN sections and leave as WIP.
     * 3) Delete the latest WIP 3.2
     * 4) Create a new 3.2 assessment ( clones from 1 including the san part), leave as WIP
     * 
     * Check parameters (in particular PKs and versions) and cloning.  Does assessment 3 clone SAN content from 1 or 2????
     */

    it('Test ref 36 part 0 - create offender', () => {

        oasys.login(oasys.Users.probSanUnappr)

        oasys.Offender.createProb(offender, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })
        })
    })
})