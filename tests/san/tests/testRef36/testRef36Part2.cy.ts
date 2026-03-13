import * as oasys from 'oasys'
import * as testData from '../../data/testRef36'

describe('SAN integration - test ref 36', () => {
    /**
     * 1) Create and complete a 3.2 assessment 
     * 2) Create a new 3.2 assessment ( clones from 1 incuding the san part), modify SAN sections and leave as WIP.
     * 3) Delete the latest WIP 3.2
     * 4) Create a new 3.2 assessment ( clones from 1 including the san part), leave as WIP
     * 
     * Check parameters (in particular PKs and versions) and cloning.  Does assessment 3 clone SAN content from 1 or 2????
     */

    it('Test ref 36 part 2 - create and edit second 3.2 assessment, then delete it', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            cy.log('Create second assessment and check SAN call')
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

            oasys.Db.getAllSetPksByPnc(offender.pnc, 'result')
            cy.get<number[]>('@result').then((pks) => {

                // Check OASYS_SET and API calls
                oasys.San.getSanApiTimeAndCheckDbValues(pks[0], 'Y', pks[1])

                oasys.San.checkSanCreateAssessmentCall(pks[0], pks[1], oasys.Users.probSanUnappr, oasys.Users.probationSanCode, 'REVIEW')
                oasys.San.checkSanGetAssessmentCall(pks[0], 1)
                oasys.Db.checkCloning(pks[0], pks[1], ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
                    'SAQ', 'ROSH', 'ROSHFULL', 'ROSHSUM', 'RMP', 'SKILLSCHECKER', 'SAN',])

                // Modify SAN content
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
                oasys.San.populateSanSections('TestRef36 modify SAN', testData.modifySan)
                oasys.San.returnToOASys()
                oasys.Nav.clickButton('Next')

                // Check API calls and OASYS_SET
                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pks[0]}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: pks[1].toString(),
                    SAN_ASSESSMENT_VERSION_NO: null
                })
                oasys.San.checkSanGetAssessmentCall(pks[0], 1)
                oasys.logout()

                // Delete the WIP assessment
                oasys.login(oasys.Users.admin, oasys.Users.probationSan)
                oasys.Offender.searchAndSelectByPnc(offender.pnc)
                oasys.Assessment.deleteLatest()
                oasys.San.checkSanDeleteCall(pks[0], oasys.Users.admin)
                oasys.logout()

            })
        })
    })
})
