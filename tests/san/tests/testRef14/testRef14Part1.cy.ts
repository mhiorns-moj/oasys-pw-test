import * as oasys from 'oasys'

describe('SAN integration - test ref 14', () => {

    it('Test ref 14 part 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)

            cy.log(`For the first assessment, create a new OASys-SAN assessment (3.2) that now includes a SAN Sentence Plan
                Complete the SAN Assessment part AND complete the SAN Sentence Plan (doesn't matter what you select, just need to get a completed 3.2).`)

            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk1')

            cy.get<number>('@pk1').then((pk1) => {

                oasys.San.gotoSan()
                oasys.San.populateSanSections('Test ref 14', oasys.Populate.San.ExampleTest.sanPopulation1)
                oasys.San.returnToOASys()

                oasys.ArnsSp.runScript('populateMinimal')

                cy.log(`Complete the OASys part of the assessment invoking a full analysis by saying 'Yes' to something in the RoSH Screening.
                    Fully sign and lock and countersign (if applicable) the 3.2 assessment.`)

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
                new oasys.Pages.Rosh.RoshScreeningSection5().r5_1.setValue('Yes')
                new oasys.Pages.Rosh.RoshScreeningSection5().r5_1t.setValue('Want to do a full analysis')
                oasys.Nav.clickButton('Save')
                oasys.Populate.RoshPages.RoshSummary.fullyPopulated()
                oasys.Populate.RoshPages.RiskManagementPlan.minimalWithTextFields()

                new oasys.Pages.SentencePlan.SentencePlanService().goto()
                oasys.Assessment.signAndLock()

                cy.log(`Open up the completed 3.2 and from the Admin Menu select 'Mark all assessments as historic'`)

                oasys.Nav.history()
                new oasys.Pages.Assessment.Other.MarkAssessmentHistoric().goto().ok.click()

                cy.log(`As the assessor click on the <Open S&N> button - navigates out to the SAN Assessment where everything is shown in READ ONLY mode
                     - check the OTL accessmode parameter
                    Return back to the OASys assessment
                    As the assessor click on the <Open SP> button - navigates out to the Sentence Plan where everything is shown in READ ONLY mode
                     - check the OTL plan accessmode parameter
                    Return back to the OASys assessment`)

                oasys.San.gotoSanReadOnly()
                oasys.San.checkSanOtlCall(pk1,
                    {
                        'crn': offender.probationCrn,
                        'pnc': offender.pnc,
                        'nomisId': null,
                        'givenName': offender.forename1,
                        'familyName': offender.surname,
                        'dateOfBirth': offender.dateOfBirth,
                        'gender': '2',
                        'location': 'COMMUNITY',
                        'sexuallyMotivatedOffenceHistory': 'NO',
                    },
                    {
                        'displayName': oasys.Users.probSanHeadPdu.forenameSurname,
                        'accessMode': 'READ_ONLY',
                    },
                    'san', 0
                )

                oasys.San.checkSanEditMode(false)
                oasys.San.returnToOASys()


                oasys.ArnsSp.runScript('openAndReturn', { readonly: true })
                oasys.San.checkSanOtlCall(pk1,
                    {
                        'crn': offender.probationCrn,
                        'pnc': offender.pnc,
                        'nomisId': null,
                        'givenName': offender.forename1,
                        'familyName': offender.surname,
                        'dateOfBirth': offender.dateOfBirth,
                        'gender': '2',
                        'location': 'COMMUNITY',
                        'sexuallyMotivatedOffenceHistory': 'NO',
                    },
                    {
                        'displayName': oasys.Users.probSanHeadPdu.forenameSurname,
                        'planAccessMode': 'READ_ONLY',
                    },
                    'sp', 0
                )

                oasys.ArnsSp.runScript('checkReadOnly')
                oasys.Nav.clickButton('Close')

                cy.log(`Now create a new 3.2 OASys-SAN Assessment (not PSR), the new SAN question defaults to 'Yes' and during the Create process 
                        say 'No' to cloning from the historic assessment.
                    Check the CreateAssessment API to ensure that it posts just the ONE current PK across to the SAN service and the offender details.
                    Check the OASYS_SET record; field CLONED_FROM_PREV_OASYS_SAN_PK is NULL, fields SAN_ASSESSMENT_LINKED_IND = 'Y', LASTUPD_FROM_SAN is set 
                        to a date and time as we have retrieved the data but SAN_ASSESSMENT_VERSION_NO AND SSP_PLAN_VERSION_NO are NULL.
                    There is no full analysis in the new 3.2 assessment, in fact most of the OASys sections are blank, including the Sentence Plan.`)


                oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' }, 'No')
                oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk2')

                cy.get<number>('@pk2').then((pk2) => {

                    oasys.San.checkSanCreateAssessmentCall(pk2, null, oasys.Users.probSanHeadPdu, oasys.Users.probationSanCode, 'INITIAL')
                    // Check values in OASYS_SET
                    oasys.San.getSanApiTimeAndCheckDbValues(pk2, 'Y', null)

                    new oasys.Pages.Rosh.RiskManagementPlan().checkIsNotOnMenu()
                    oasys.ArnsSp.runScript('checkZeroGoals')

                    oasys.logout()

                })
            })
        })
    })

})
