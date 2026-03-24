import * as oasys from 'oasys'
import * as testData from '../../data/testRef23'

describe('SAN integration - test ref 23', () => {

    it('Test ref 23 part 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender: OffenderDef = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanHeadPdu)

            log(`For the first assessment, create a new OASys-SAN assessment (3.2)	
                Ensure the Create Assessment API is sent to the SAN service and the parameters are correct	
                Complete the SAN Assessment part: 	
                    - in the Alcohol section say 'Yes' to question 'Has ? ever drunk alcohol' and then complete any other alcohol questions shown on screen
                    - doesn't matter what else you answer in the remaining sections but DO NOT invoke a full analysis, just need to get a completed 3.2
                Return back to the OASys part of the assessment and complete it BUT DO NOT invoke a full analysis`)

            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'pk')

            cy.get<number>('@pk').then((pk) => {

                oasys.San.gotoSan()
                oasys.San.populateSanSections('Test ref 23', testData.sanPopulation1)
                oasys.San.returnToOASys()

                new oasys.Pages.Assessment.OffendingInformation().goto().count.setValue(1)

                const predictors = new oasys.Pages.Assessment.Predictors().goto()
                predictors.dateFirstSanction.setValue({ years: -2 })
                predictors.o1_32.setValue(2)
                predictors.o1_40.setValue(0)
                predictors.o1_29.setValue({ months: -1 })
                predictors.o1_30.setValue('No')
                predictors.o1_38.setValue({})

                oasys.Populate.Rosh.screeningNoRisks(true)

                log(`Check in the database to see what questions have been set for section 9 - interested to know how SAN have treated an Offender who is NOT male or female
                        for the alcohol questions
                    Check that OGRS, OGP and OVP have NOT calculated because of the offender's gender
                    In the Predictors screen check that for RSR it hasn't calculated due to 'RSR can't be calculated on gender other than Male or Female'`)

                oasys.Db.checkAnswers(pk, [
                    { section: '9', q: '9.1', a: '0' },
                    { section: '9', q: '9.1.t', a: 'Only drinks once a month or less and consumes 1 to 2 units a day, when they drink.' },
                    { section: '9', q: '9.2', a: '0' },
                    { section: '9', q: '9.97', a: null },
                    { section: '9', q: '9.98', a: 'NO' },
                    { section: '9', q: '9.99', a: 'NO' },
                    { section: '9', q: '9_SAN_STRENGTH', a: 'NO' },
                ], 'result', true)
                cy.get<boolean>('@result').then((result) => { expect(result).eq(false) })

                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: null,
                    SSP_PLAN_VERSION_NO: null,
                    OGRS3_1YEAR: null,
                    OGRS3_2YEAR: null,
                    OGP_1YEAR: null,
                    OGP_2YEAR: null,
                    OVP_1YEAR: null,
                    OVP_2YEAR: null,
                })

                predictors.goto().rsrScore.checkValue(`Unable to calculate due to: \nCombined Serious Reoffending Predictor can't be calculated on gender other than Male and Female.`, true)

                log(`Check that the Summary screen is showing the correct information for the Criminogenic Needs and threshold section and that in the Predictors Scores % 
                    and Risk Category OGRS, OGP and OVP just show dashes, both OSP rows show N/A,  the RSR row shows N/A and then two dashes`)

                const summarySheet = new oasys.Pages.Assessment.SummarySheet().goto()
                oasys.Nav.clickButton('Save')  // TODO workaround for defect NOD-1165
                const expectedValues: ColumnValues[] = [
                    {
                        name: 'oasysSection',
                        values: ['Accommodation', 'Employment and education', 'Finance', 'Drug use', 'Alcohol use', 'Health and wellbeing', 'Personal relationships and community', 'Thinking, behaviours and attitudes', 'Lifestyle & Associates']
                    },
                    {
                        name: 'criminogenicNeed',
                        values: ['N', 'N', 'N/A', 'N', 'N', 'N/A', 'Y', 'Y', 'N']
                    },
                    {
                        name: 'scores',
                        values: ['0', '0', 'N/A', '0', '0', 'N/A', '4', '6', '0']
                    }
                ]
                summarySheet.sanCrimTable.checkData(expectedValues)

                const expectedPredictorsValues: ColumnValues[] = [
                    {
                        name: 'scoreDescription',
                        values: ['All Reoffending Predictor', 'Violent Reoffending Predictor', 'Serious Violent Reoffending Predictor', 'Images and Indirect Contact - Sexual Reoffending Predictor', 'Direct Contact - Sexual Reoffending Predictor', 'Combined Serious Reoffending Predictor']
                    },
                    {
                        name: 'twoYear',
                        values: ['-', '-', '-', 'N/A', 'N/A', '-']
                    },
                    {
                        name: 'category',
                        values: ['-', '-', '-', 'Not Applicable', 'Not Applicable', '-']
                    },
                ]
                summarySheet.predictorsTable.checkData(expectedPredictorsValues)

                log(`Navigate out to the 'Sentence Plan Service' - complete entry with 1 goal/step and ensure you 'Agree the Plan'
                    Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
                    Navigate to Sentence Plan screen - complete entry of the three fields on the screen for Public Protection conference
                    Sign and lock the assessment - no countersigner required.
                    Ensure the Sign API is sent to the SAN service and the parameters are correct
                    Ensure we get back a 200 response from the Sign API and that OASYS_SET.SAN_ASSESSMENT_VERSION_NO and OASYS_SET.SSP_PLAN_VERSION NO have been populated
                    Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`)

                oasys.ArnsSp.runScript('populateMinimal')

                const isp = new oasys.Pages.SentencePlan.SentencePlanService().goto()

                oasys.Assessment.signAndLock() // OGRS warning, requires same action as the RSR warning
                oasys.San.checkSanSigningCall(pk, oasys.Users.probSanHeadPdu, 'SELF')
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])

                log(`Still logged in as the Assessor open up the SAN Assessment from the offender records 'Open S&N' button.
                    This should have invoked a new version of the SAN Assessment in their database - Change some of the data and set a couple of the section
                        'Linked to risk of serious harm…' questions to 'Yes'
                    Save the SAN data ensuring it is fully complete and then return back to the OASys Offender record screen`)

                oasys.Nav.history(offender)
                const offenderDetails = new oasys.Pages.Offender.OffenderDetails()
                oasys.San.gotoSanFromOffender()
                oasys.San.populateSanSections('Test ref 23 modification', testData.modifySan)
                oasys.San.returnToOASys()

                log(`Now open up the Sentence Plan from the offender records 'Open SP' button
                    This should have invoked a new version of the Sentence Plan in their database - Add another goal/steps to the sentence plan 
                    Return back to the OASys Offender record screen`)

                oasys.ArnsSp.runScript('addGoal', { openFromOffender: true })

                oasys.logout()

            })
        })
    })
})
