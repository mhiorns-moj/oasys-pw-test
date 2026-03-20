import * as oasys from 'oasys'

describe('SAN integration - test ref 36', () => {
    /**
     * 1) Create and complete a 3.2 assessment 
     * 2) Create a new 3.2 assessment ( clones from 1 incuding the san part), modify SAN sections and leave as WIP.
     * 3) Delete the latest WIP 3.2
     * 4) Create a new 3.2 assessment ( clones from 1 including the san part), leave as WIP
     * 
     * Check parameters (in particular PKs and versions) and cloning.  Does assessment 3 clone SAN content from 1 or 2????
     */

    it('Test ref 36 part 3 - create and check second 3.2 assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            // Create third assessment and check SAN call and OASYS_SET
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

            oasys.Db.getAllSetPksByPnc(offender.pnc, 'result')
            cy.get<number[]>('@result').then((pks) => {
                oasys.San.getSanApiTimeAndCheckDbValues(pks[0], 'Y', pks[2])

                oasys.San.checkSanCreateAssessmentCall(pks[0], pks[2], oasys.Users.probSanUnappr, oasys.Users.probationSanCode, 'REVIEW')
                oasys.San.checkSanGetAssessmentCall(pks[0], 2)

                // Check cloning from first assessment to second (non-deleted)
                oasys.Db.checkCloning(pks[0], pks[2], ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
                    'SAQ', 'ROSH', 'ROSHFULL', 'ROSHSUM', 'RMP', 'SKILLSCHECKER',])

                // Open SAN, check OTL call and subsequent GetAssessment
                oasys.San.gotoSan()
                oasys.San.checkSanOtlCall(pks[0], {
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
                    'displayName': oasys.Users.probSanUnappr.forenameSurname,
                    'accessMode': 'READ_WRITE',
                },
                    'san', null
                )
                oasys.San.returnToOASys()
                oasys.Nav.clickButton('Close')
                oasys.San.checkSanGetAssessmentCall(pks[0], 2)

                // Lock incomplete, check API call and OASYS_SET
                oasys.Assessment.lockIncomplete()
                oasys.San.checkSanLockIncompleteCall(pks[0], oasys.Users.probSanUnappr)

                oasys.logout()
            })

        })

    })
})