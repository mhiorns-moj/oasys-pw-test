import * as oasys from 'lib'


describe('NOD-1148 OGRS4 regression test ref 3', () => {
    /**
        Create a new Male probation offender in a SAN Pilot probation area
        Administrator flags the offender as LAO and grants access to this offender for an Assessor who has the SAN Service role
     */

    it('Test ref 3 part 0 - create probation offender', () => {

        oasys.login(oasys.Users.probHeadPdu)

        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })

            oasys.logout()
        })
    })
})