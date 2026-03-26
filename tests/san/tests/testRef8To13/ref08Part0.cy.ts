import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefEight',
    gender: 'Male',
    dateOfBirth: { years: -40 },
}

describe('SAN integration - test ref 08 part 0', () => {

    it('Test ref 08 part 0 - create offender', () => {

        await oasys.login(oasys.users.probSanUnappr)

        oasys.Offender.createProb(offender, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })

            await oasys.logout()
            await oasys.login(oasys.users.probHeadPdu)
            oasys.Offender.addProbationOffenderToStub(offender)
            await oasys.logout()
        })
    })
})