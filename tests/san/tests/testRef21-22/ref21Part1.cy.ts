import * as oasys from 'oasys'

describe('SAN integration - test ref 21 part 1', () => {

    it('Test ref 21 part 1 - create and complete 3.1 assessment on offender 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender1').then((offenderData) => {

            log(`SET UP OFFENDER 1 - is in a NON SAN pilot probation area - PNC is set to UNKNOWN PNC
                Offender has just one assessment
                FIRST - LAYER 3 v1 - oasys_set.cloned_from_previous_san_pk is NULL`)

            const offender1 = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.probHeadPdu)
            await offender.searchAndSelectByPnc(offender1.pnc)
            // new oasys.Pages.Offender.OffenderDetails().pnc.setValue('UNKNOWN PNC')

            // Create assessment
            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            oasys.Populate.minimal({ layer: 'Layer 3', populate6_11: 'No' })

            new oasys.Pages.SentencePlan.IspSection52to8().goto()
            await signing.signAndLock({ expectRsrWarning: true })

            await oasys.logout()

            oasys.Db.getLatestSetPkByPnc(offender1.pnc, 'pk')
            cy.get('@pk').then((pk) => {
                await oasys.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: null,
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: null,
                    SSP_PLAN_VERSION_NO: null,
                    CLONED_IND: 'N',
                })
            })
        })
    })
})
