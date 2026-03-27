import * as oasys from 'oasys'

describe('SAN integration - test ref 38 part 2', () => {
    /**
     * Have a completed 3.2 assessment that has been countersigned.
     * Create a new 3.2 assessment and enter some data including SAN data.
     * Delete that second 3.2 assessment. 
     * Roll back the first 3.2 assessment and carry on with that does it work with SAN statuses?
     */

    it('Roll back the first assessment and check API calls and assessment status', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.admin, oasys.users.probationSan)
            await offender.searchAndSelectByPnc(offender.pnc)

            await oasysDb.getAllSetPksByPnc(offender.pnc, '[pks]')
            cy.get<number[]>('@[pks]').then((pks) => {  // [0] = the second deleted assessment, [1] = the first one that will be rolled back

                await assessment.openLatest()

                await san.gotoSanReadOnly()
                await san.queries.checkSanOtlCall(pks[1], {
                    'crn': offender.probationCrn,
                    'pnc': offender.pnc,
                    'nomisId': null,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'COMMUNITY',
                    'sexuallyMotivatedOffenceHistory': 'NO',
                }, {
                    'displayName': oasys.users.admin.forenameSurname,
                    'accessMode': 'READ_ONLY',
                },
                    'san', 0
                )
                await san.checkSanEditMode(false)
                await san.returnToOASys()

                // Roll back the assessment
                oasys.Assessment.rollBack('Test 38 part 2 rolling back again, after deleting the second assessment')


                // Check OASYS_SET and API calls
                await san.queries.checkSanRollbackCall(pks[1], oasys.users.admin)
                await oasys.logout()

            })
        })
    })
})