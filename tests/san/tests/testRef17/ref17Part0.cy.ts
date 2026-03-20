import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefSeventeen',
    gender: 'Female',
    dateOfBirth: { years: -20 },
}

describe('SAN integration - test ref 17 part 0', () => {

    it('Test ref 17 part 0 - create offender and IOM stub', () => {

        oasys.login(oasys.Users.probSanPso)

        oasys.Offender.createProb(offender, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })

            oasys.logout()
            // TODO implement IOM stub
            // oasys.Offender.createIomStub(offender.probationCrn, 'Y', 1, 'OK', 'Y')
        })
    })

})