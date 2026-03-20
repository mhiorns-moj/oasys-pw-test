import * as oasys from 'oasys'
import * as testData from '../../data/testRef35'

describe('SAN integration - test ref 35', () => {

    it('Test ref 35 part 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)

            cy.log(`Carry out a 3.2 assessment ensuring questions are set in SAN to produce a low maturity outcome`)

            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk1')

            cy.get<number>('@pk1').then((pk1) => {

                oasys.San.gotoSan()
                oasys.San.populateSanSections('Test ref 35', testData.sanPopulation1)
                oasys.San.returnToOASys()

                oasys.ArnsSp.runScript('populateMinimal')

                new oasys.Pages.Assessment.SummarySheet().goto().maturityScreening.checkValue('This individual is likely to need support or services aimed at promoting maturation.', true)

                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    MATURITY_SCORE: '14',
                    MATURITY_FLAG: '1',
                })

                // Complete section 1
                new oasys.Pages.Assessment.OffendingInformation().goto().count.setValue(1)

                const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
                predictors.dateFirstSanction.setValue({ years: -2 })
                predictors.o1_32.setValue(2)
                predictors.o1_40.setValue(0)
                predictors.o1_29.setValue({ months: -1 })
                predictors.o1_30.setValue('No')
                predictors.o1_38.setValue({})

                oasys.Populate.Rosh.screeningNoRisks(true)
                oasys.Nav.clickButton('Save')

                new oasys.Pages.SentencePlan.SentencePlanService().goto()
                oasys.Assessment.signAndLock()

                oasys.Db.checkAnswers(pk1, testData.preRsrDataCheck, 'failed', true)
                cy.get<boolean>('@failed').then((failed) => {
                    expect(failed).eq(false)
                })

                cy.log(`Then create a standalone RSR changing some data for the section 1 parameters and R1.2 fields.  
                    Say Yes to Interview and answer the dynamic questions differently`)

                oasys.Nav.history(offender)
                const rsr = new oasys.Pages.Offender.StandaloneRsr().goto()

                // Check cloning from the assessment
                rsr.o1_8Age.checkValue('19')
                rsr.o1_32.checkValue(2)
                rsr.o1_40.checkValue(0)
                rsr.o1_29.checkValue({ months: -1 })
                rsr.o1_30.checkValue('No')
                rsr.o1_38.checkValue({})
                rsr.o1_39.setValue('Yes') // Offender interview
                rsr.o2_2.setValue('Yes')
                rsr.o3_4.checkValue('0-No problems')
                rsr.o4_2.checkValue('0-No')
                rsr.o6_4.checkValue('2-Significant problems')
                rsr.o9_1.checkValue('0-No problems')
                rsr.o11_2.checkValue('2-Significant problems')
                rsr.o11_4.checkValue('1-Some problems')
                rsr.o12_1.checkValue('2-Significant problems')

                rsr.o1_32.setValue(4)
                rsr.o1_40.setValue(1)
                rsr.o1_29.setValue({})
                rsr.o1_38.setValue({ months: 6 })
                rsr.o3_4.setValue('1-Some problems')
                rsr.o4_2.setValue('2-Yes')
                rsr.o6_4.setValue('0-No problems')
                rsr.o9_1.setValue('1-Some problems')
                rsr.o11_2.setValue('2-Significant problems')
                rsr.o11_4.setValue('2-Significant problems')
                rsr.o12_1.setValue('1-Some problems')

                rsr.weaponPrevious.setValue('Yes')
                rsr.burglaryPrevious.setValue('Yes')

                rsr.calculateScores.click()

                cy.log(`Now create a new 3.2 assessment, will overclone with the standalone RSR
                    However, it will then get the data from the SAN assessment
                    Check in the database that the dynamic questions are now showing as from SAN
                    However, the Section 1 questions and the R1.2 fields are showing as cloned from the standalone RSR (this proves that cloning from the standalone RSR still works)`)

                rsr.close.click()

                oasys.Assessment.createProb({ purposeOfAssessment: 'Review', includeSanSections: 'Yes' })
                oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk2')

                cy.get<number>('@pk2').then((pk2) => {

                    oasys.Db.checkAnswers(pk2, testData.postRsrDataCheck, 'failed', true)
                    cy.get<boolean>('@failed').then((failed) => {
                        expect(failed).eq(false)
                    })

                    oasys.logout()
                })
            })
        })
    })
})
