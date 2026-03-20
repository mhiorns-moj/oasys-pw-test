import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefEight',
    gender: 'Male',
    dateOfBirth: { years: -40 },
}

describe('SAN integration - test ref 08 part 0', () => {

    it('Test ref 08 part 0 - create offender', () => {

        oasys.login(oasys.Users.probSanUnappr)

        oasys.Offender.createProb(offender, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })

            oasys.logout()
            oasys.login(oasys.Users.probHeadPdu)
            oasys.Offender.addProbationOffenderToStub(offender)
            oasys.logout()
        })
    })
})