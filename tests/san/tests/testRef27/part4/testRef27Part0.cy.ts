import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefTwentySeven-Four',
    gender: 'Male',
    dateOfBirth: { years: -40 },
}

describe('SAN integration - test ref 27', () => {

    it('Test ref 27 part 4 - create offender', () => {

        cy.log(`Check 'Lock Incomplete' - using the OASys application, different ways sends a notification to the SAN Service`)

        oasys.login(oasys.Users.prisSanUnappr)

        oasys.Offender.createPris(offender, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })
        })
    })
})