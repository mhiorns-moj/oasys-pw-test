import * as oasys from 'lib'
import * as testData from '../../data/testRef13'

describe('SAN integration - test ref 13 part 1', () => {

    it('Test ref 13 - Another 3.2 assessment in pilot area', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)


            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Assessment.openLatest()

            cy.log(`It will clone from the previous 3.1 assessment BUT then clear out all section 2 to 13 and SAQ data as it has been obtained from the living SAN assessment.
                Check the OASYS_SET record; field CLONED_FROM_PREV_OASYS_SAN_PK has been cloned through from the 3.1 assessment, fields SAN_ASSESSMENT_LINKED_IND = 'Y',
                    LASTUPD_FROM_SAN is set from having obtained the SAN data and SAN_ASSESSMENT_VERSION_NO is NULL.`)

            oasys.Db.getAllSetPksByPnc(offender.pnc, 'pks')
            cy.get<number[]>('@pks').then((pks) => {
                const pk = pks[0]
                const prevSanPk = pks[3]

                oasys.Db.checkAnswers(pk, testData.clonedData, 'answerCheck', true)
                cy.get<boolean>('@answerCheck').then((answerCheck) => {
                    expect(answerCheck).equal(false)
                })

                oasys.San.getSanApiTimeAndCheckDbValues(pk, 'Y', prevSanPk, null)

                cy.log(`Fully complete the 3.2 OASys, you may want to go into the SAN Assessment and change some data and then ensure the SAN assessment is
                        fully marked as complete for all sections.`)
                oasys.San.gotoSan()
                oasys.San.populateSanSections('TestRef13 modify SAN', testData.modifySan)
                oasys.San.checkSanSectionsCompletionStatus(9)
                oasys.San.returnToOASys()

                oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.RspSection72to10, expectCountersigner: true, countersigner: oasys.Users.probSanHeadPdu })
                oasys.logout()

                oasys.login(oasys.Users.probSanHeadPdu)
                oasys.Assessment.countersign({ offender: offender })
                oasys.logout()

            })
        })
    })
})