import * as oasys from 'oasys'
import * as testData from '../../data/testRef13'

describe('SAN integration - test ref 13 part 3', () => {

    it('Test ref 13 - Another 3.2 assessment in pilot area', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.users.probSanUnappr)
            await offender.searchAndSelectByPnc(offender.pnc)

            log(`Now create a new 3.2 OASys-SAN Assessment, the new SAN question defaults to 'Yes' and during the Create process say 'Yes' to cloning from the historic assessment.
                    Check the CreateAssessment API to ensure that it posts TWO PKs across to the SAN service and the user ID and name.
                    Check the OASYS_SET record; field CLONED_FROM_PREV_OASYS_SAN_PK has been set to the PK of of the last historic OASys-SAN assessment, fields SAN_ASSESSMENT_LINKED_IND = 'Y', 
                    LASTUPD_FROM_SAN is set to a date and time as we have retrieved the data but SAN_ASSESSMENT_VERSION_NO is NULL.`)

            oasys.Assessment.getToCreateAssessmentPage()
            let createAssessmentPage = new oasys.Pages.Assessment.CreateAssessment()
            createAssessmentPage.purposeOfAssessment.setValue('Review')
            createAssessmentPage.includeSanSections.checkValue('Yes')
            createAssessmentPage.create.click()
            new oasys.Pages.Assessment.PreviousHistoric().yes.click()

            oasys.Db.getAllSetPksByPnc(offender.pnc, 'pks')
            cy.get<number[]>('@pks').then((pks) => {

                await san.checkSanCreateAssessmentCall(pks[0], pks[1], oasys.users.probSanUnappr, oasys.users.probationSanCode, 'REVIEW')

                log(`Check Section 1 of the assessment - ONLY 1.8 has cloned through.  
                        The offence will not have cloned through unless it has been setup on the CMS stub and it gets copied from there.
                        Data will have been copied through from the 'living' SAN assessment as we said 'Yes' to cloning.
                        Leave the 3.2 OASys-SAN assessment as WIP.  This test proves the cloning through from a 'historic' 3.2 assessment.`)

                const offendingInformation = new oasys.Pages.Assessment.OffendingInformation().goto()
                offendingInformation.offence.checkValue('')
                offendingInformation.sentence.checkValue('')
                offendingInformation.sentenceDate.checkValue('')

                const predictors = new oasys.Pages.Assessment.Predictors().goto()
                predictors.ageFirstSanction.checkValue('37')
                predictors.o1_32.checkValue(null)
                predictors.o1_40.checkValue(null)
                predictors.o1_29.checkValue('')
                predictors.o1_30.checkValue('')
                predictors.o1_38.checkValue('')
                predictors.arp.checkValue('Unable to calculate', true)
                predictors.vrp.checkValue('Unable to calculate', true)
                predictors.svrp.checkValue('Unable to calculate', true)
                predictors.ospDc.checkValue('Unable to calculate', true)
                predictors.ospIic.checkValue('Unable to calculate', true)

                oasys.Db.checkAnswers(pks[0], testData.clonedAndModifiedData, 'answerCheck', true)
                cy.get<boolean>('@answerCheck').then((answerCheck) => {
                    expect(answerCheck).equal(false)
                })
                oasys.logout()
            })
        })
    })
})