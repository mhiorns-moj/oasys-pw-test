import * as oasys from 'oasys'
import * as testData from '../../data/testRef20'

describe('SAN integration - test ref 20', () => {

    it('Test ref 20 part 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            cy.log(`Create a new OASys-SAN assessment - Non-statutory with ISP	
                Complete Case ID and Section 1 ensuring the offence is a SEXUAL one.	
                Navigate out to the SAN Assessment 	
                Check the OTL API parameters - ensure they are correct and that 1.30 has passed as YES`)

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanPo)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            // Create first assessment
            oasys.Assessment.createProb({
                purposeOfAssessment: 'Non-statutory', assessmentLayer: 'Full (Layer 3)',
                sentencePlanType: 'Initial', includeSanSections: 'Yes'
            })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {
                // Check values in OASYS_SET
                oasys.San.getSanApiTimeAndCheckDbValues(pk, 'Y', null)

                // Check Create call
                oasys.San.checkSanCreateAssessmentCall(pk, null, oasys.Users.probSanPo, oasys.Users.probationSanCode, 'INITIAL')
                oasys.San.checkSanGetAssessmentCall(pk, 0)

                // Complete section 1
                new oasys.Pages.Assessment.OffendingInformation().goto().count.setValue(1)

                const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
                predictors.dateFirstSanction.setValue({ years: -2 })
                predictors.o1_32.setValue(2)
                predictors.o1_40.setValue(0)
                predictors.o1_29.setValue({ months: -1 })
                predictors.o1_44.setValue('Yes')
                predictors.o1_33.setValue({ months: -6 })
                predictors.o1_34.setValue(1)
                predictors.o1_45.setValue(1)
                predictors.o1_46.setValue(1)
                predictors.o1_38.setValue({ months: -1 })
                predictors.o1_37.setValue(1)

                oasys.San.gotoSan()
                oasys.San.checkSanOtlCall(pk, {
                    'crn': offender.probationCrn,
                    'pnc': offender.pnc,
                    'nomisId': null,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '1',
                    'location': 'COMMUNITY',
                    'sexuallyMotivatedOffenceHistory': 'YES',
                }, {
                    'displayName': oasys.Users.probSanPo.forenameSurname,
                    'accessMode': 'READ_WRITE',
                },
                    'san', null
                )

                cy.log(`Complete the SAN Assessment questions as below to be used for the SARA in OASys:	
                            - in the Offence Analysis section select 'Yes' to 'Is there any evidence of domestic abuse?' and 'perpetrator - against intimate partner' 
                                and then 'Yes' at 'linked to risk of serious harm'
                            - in the Employment & Education section, at 'What is ? current employment?' select 'Unemployed actively looking for work' and at
                                'What is ? employment history?' select 'Unstable employment history….'
                            - in the relationships section, at 'What was ? experience of their childhood?' select 'Both positive and negative experience'
                            - in the relationships section, at 'Is ? happy with their current relationship status?' select 'Has some concerns but is overall happy'
                            - in the relationships section, at 'What is ? history of intimate relationships?' select
                                 'History of unstable, unsupportive and destructive relationships'
                            - in the drugs section, at 'Has ? ever used drugs?' select 'Yes' then select Heroin with weekly usage and injecting
                            - in the drugs section, at 'Is ? Motivated to stop or reduct their drug use?' select 'Shows some motivation to stop or reduce'
                            - in the alcohol section, at 'Has ? ever drank alcohol?' select Yes, at 'How often has ? drunk alcohol in the last 3 months' 
                                select '2 to 3 times a week'
                            - in the alcohol section, at 'How many units of alcohol does ? have on a typical day of drinking?' select '5-6 units' and at
                                'Has ? Shown evidence of binge drinking or excessive alchol use in the last 6 months' select 'Evidence of binge drinking or excessive alcohol use'
                            - in the health and wellbeing section, at 'Does ? have any diagnosed or documented mental health problems?' select 
                                'Yes, ongoing - severe and documented over a prolonged period of time.'
                            - in the health and wellbeing section, at 'Is ? having current psychiatric treatment?' select 'Pending treatment'
                            - in the thinking, behaviours and attitudes section, at 'Does ? act on impulse?' select 'Sometimes acts on impulse which causes problems'
                            - in the thinking, behaviours and attitudes section, at 'Does ? use violence, aggressive or controlling behaviour to get
                                 their own way?' select 'Patterns of using violence, aggressive or controlling behaviour to get their own way'
                            - in the thinking, behaviours and attitudes section, at 'Is ? able to manage their temper?' select 'No, easily loses their temper'
                    Complete the remaining questions in the SAN Assessment however you like but answer all other SAN sections 'Linked to risk…' questions as 
                        'No' and say Yes to risk of sexual harm and answer the questions because ARNS haven't coded the user journey yet`)

                oasys.San.populateSanSections('TestRef20 complete SAN', testData.sanPopulation)

                cy.log(`Return back to the OASys assessment - the 'Strengths and Needs' has a green tick against it	
                    Need to navigate away for the data to be picked up from SAN	
                    A full analysis has been invoked with sections 6.1, 6.2, RoSH Summary and Risk Management Plan	
                    Navigate to RoSH Screening Section 1 - R1.1 'Area of Concern' is showing 'Offence analysis'	
                    Navigate to the next RoSH Screen - will be asked if want to create a SARA - this will be prompted via the Section 6 questions populated from the SAN Assessment
                     - Create the SARA`)

                oasys.San.returnToOASys()
                oasys.San.checkSanGetAssessmentCall(pk, 0)
                oasys.Nav.clickButton('Next')
                new oasys.Pages.Assessment.SanSections().checkCompletionStatus(true)
                new oasys.Pages.Rosh.RoshFullAnalysisSection62().checkIsOnMenu()
                new oasys.Pages.Rosh.RoshSummary().checkIsOnMenu()
                new oasys.Pages.Rosh.RiskManagementPlan().checkIsOnMenu()

                new oasys.Pages.Rosh.RoshScreeningSection1().areasOfConcern.checkValuesInclude('Offence analysis')

                oasys.Nav.clickButton('Next')
                oasys.Nav.clickButton('Create')

                cy.log(`Go to the SARA  - check the hints being shown as as follows:	
                        - at Q5 hints are '4.2 Is the person unemployed, or will be unemployed on release - YES' and '4.3 Employment history scored 2'
                        - at Q6 hints are '6.3 Experience of childhood scored 1'
                        - at Q7 hints are 'Section 8 - Drug misuse scored 7' and 'Section 9 - Alcohol misuse scored 3'
                        - at Q9 hints are '10.6 Current psychiatric problems scored 2' and '10.7 identified current psychiatric treatment or treatment pending'
                        - at Q10 hints are '11.2 Impulsivity scored 1', '11.3 Aggressive / controlling behaviour scored 2' and '11.4 Temper control scored 2'
                        - at Q11 hints are '6.4 Current relationship with partner scored 1', '6.6 Previous experience of close relationships scored 2' and 'Assessment 
                            indicates evidence of current or previous domestic abuse'
                        - at Q12 hints are '6.4 Current relationship with partner scored 1', '6.6 Previous experience of close relationships scored 2' and 'Assessment
                            indicates evidence of current or previous domestic abuse'
                            Complete entry of the SARA questions and then S&L it.`)

                oasys.Populate.Sara.sara('Low','Low')

                const sara = new oasys.Pages.Sara.Sara()
                sara.s5Hints.checkValue('4.2 Is the person unemployed, or will be unemployed on release - YES', true)
                sara.s5Hints.checkValue('4.3 Employment history scored 2', true)
                sara.s6Hints.checkValue('6.3 Experience of childhood scored 1', true)
                sara.s7Hints.checkValue('Section 8 - Drug misuse scored 7', true)
                sara.s7Hints.checkValue('Section 9 - Alcohol misuse scored 3', true)
                sara.s9Hints.checkValue('10.6 Current psychiatric problems scored 2', true)
                sara.s9Hints.checkValue('10.7 identified current psychiatric treatment or treatment pending', true)
                sara.s10Hints.checkValue('11.2 Impulsivity scored 1', true)
                sara.s10Hints.checkValue('11.3 Aggressive / controlling behaviour scored 2', true)
                sara.s10Hints.checkValue('11.4 Temper control scored 2', true)
                sara.s11Hints.checkValue('6.4 Current relationship with partner scored 1', true)
                sara.s11Hints.checkValue('6.6 Previous experience of close relationships scored 2', true)
                sara.s11Hints.checkValue('Assessment indicates evidence of current or previous domestic abuse', true)
                sara.s12Hints.checkValue('6.4 Current relationship with partner scored 1', true)
                sara.s12Hints.checkValue('6.6 Previous experience of close relationships scored 2', true)
                sara.s12Hints.checkValue('Assessment indicates evidence of current or previous domestic abuse', true)

                sara.signAndLock.click()
                sara.confirmSignAndLock.click()

                cy.log(`Complete entry of the OASys assessment questions flagging the offender's overall risk level as 'High' and in the RMP set 
                    R11.1 Has this case been referred for Multi Agency Public Protection Arrangement management: 'MAPPA Level 2 management' = Yes`)

                oasys.Nav.history(offender, 'Non-statutory')
                oasys.Populate.RoshPages.RoshScreeningSection1.noRisks()
                oasys.Populate.RoshPages.RoshScreeningSection2to4.noRisks(true)
                oasys.Populate.RoshPages.RoshSummary.specificRiskLevel('High')
                oasys.Populate.RoshPages.RiskManagementPlan.minimalWithTextFields()
                oasys.Nav.clickButton('Save')

                cy.log(`Navigate out to the 'Sentence Plan Service' - complete entry with 2 goals/steps and ensure you 'Agree the Plan'	
                    Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen	
                    Navigate to Section 5.2 to 8 - complete entry of the three fields on the screen for Public Protection conference`)

                oasys.ArnsSp.runScript('populateTwoGoals')

                cy.log(`Click on S&L - get the complete sections alert	
                    Continue to S&L - asks for a Countersigner, accept the default and enter a comment`)

                oasys.Assessment.signAndLock({ expectCountersigner: true, countersigner: oasys.Users.probSanHeadPdu, countersignComment: 'Sending test ref 20 for countersigning' })

                cy.log(`OASys assessment now signed and locked, awaiting countersignature - ensure SIGN API has gone off to SAN and that the parameters are correct 
                        including the 'signType' being set to 'COUNTERSIGN' along with users ID and name	
                    In the database ensure the field OASYS_SET.SAN_ASSESSMENT_VERSION_NO and OASYS_SET.SSP_PLAN_VERSION_NO have been populated`)

                oasys.San.checkSanSigningCall(pk, oasys.Users.probSanPo, 'COUNTERSIGN')
                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                })

                cy.log(`Log out and log back in as the Countersigner	
                    Open the assessment and go to the Countersigner Overview screen
                    Countersigner Overview screen shown and has the following:	
                        Assessor's Comments:  <comments from the task as entered above>
                        This is the first assessment in the Offender's period of supervision.
                        The following factors determine why the assessment has been presented for countersignature:
                        · Offender has been assessed as High risk
                        · Been referred for Multi Agency Public Protection Arrangement (R11.1)`)

                oasys.logout()
                oasys.login(oasys.Users.probSanHeadPdu)
                oasys.Offender.searchAndSelectByPnc(offender.pnc)

                oasys.Assessment.openLatest()
                new oasys.Pages.SentencePlan.SentencePlanService().goto().countersignOverview.click()
                const countersigningOverview = new oasys.Pages.Signing.CountersigningOverview()
                countersigningOverview.header.checkStatus('visible')
                countersigningOverview.details.checkValue('Sending test ref 20 for countersigning', true)
                countersigningOverview.details.checkValue(`This is the first assessment in the Offender's period of supervision.`, true)
                countersigningOverview.details.checkValue('Offender has been assessed as High risk', true)
                countersigningOverview.details.checkValue('Been referred for Multi Agency Public Protection Arrangement (R11.1)', true)

                countersigningOverview.returnToAssessment.click()

                cy.log(`Return to Assessment - last screen of the ISP section	
                    Reject the countersigning entering in a comment	
                    Ensure a COUNTERSIGN API has been posted to the SAN service and that the parameters are correct including the 'outcome' which is set to 'REJECTED' 
                        along with the countersigners ID and name	
                    In the database ensure the field OASYS_SET.SAN_ASSESSMENT_VERSION_NO and OASYS_SET.SSP_PLAN_VERSION_NO have been set to NULL`)

                const countersigning = new oasys.Pages.Signing.Countersigning().goto()
                countersigning.selectAction.setValue('Reject for Rework')
                countersigning.comments.setValue('Rejecting test 20 for rework')
                countersigning.ok.click()
                oasys.Nav.clickButton('Yes')
                oasys.San.checkSanCountersigningCall(pk, oasys.Users.probSanHeadPdu, 'REJECTED')
                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: null,
                    SSP_PLAN_VERSION_NO: null,
                })

                cy.log(`Log out and log back in as the Assessor	
                    Don't bother changing anything - just needed to test out countersign rejection.	
                    Go straight to the sentence plan screen and S&L the assessment again leaving the default countersigner and adding a comment
                     - ensure SIGN API has gone off to SAN and that the parameters are correct including the 'signType' being set to 'COUNTERSIGN' along with the users ID and name	`)

                oasys.logout()
                oasys.login(oasys.Users.probSanPo)
                oasys.Nav.history()
                new oasys.Pages.SentencePlan.SentencePlanService().goto()
                oasys.Assessment.signAndLock({ expectCountersigner: true, countersigner: oasys.Users.probSanHeadPdu, countersignComment: 'Second attempt' })
                oasys.San.checkSanSigningCall(pk, oasys.Users.probSanPo, 'COUNTERSIGN')

                cy.log(`Log out and log back in as the Countersigner	
                    Open the assessment and go to the Countersigner Overview screen	
                    Countersigner Overview screen shown and has the following:	
                        Countersigner's Previous Rejection Comments: <countersigner rejection reasons from the rejection signing record>
                        Assessor's Comments:  <comments from the task as entered above>
                        This is the first assessment in the Offender's period of supervision.
                        The following factors determine why the assessment has been presented for countersignature:
                        · Offender has been assessed as High risk
                        · Been referred for Multi Agency Public Protection Arrangement (R11.1)
                    Return to Assessment - last screen of the ISP section	
                    Now countersign the assessment - does not require any further countersignature`)

                oasys.logout()
                oasys.login(oasys.Users.probSanHeadPdu)
                oasys.Nav.history()
                new oasys.Pages.SentencePlan.SentencePlanService().goto().countersignOverview.click()
                countersigningOverview.details.checkValue(`Rejecting test 20 for rework`, true)
                countersigningOverview.details.checkValue('Second attempt', true)
                countersigningOverview.details.checkValue(`This is the first assessment in the Offender's period of supervision.`, true)
                countersigningOverview.details.checkValue('Offender has been assessed as High risk', true)
                countersigningOverview.details.checkValue('Been referred for Multi Agency Public Protection Arrangement (R11.1)', true)

                countersigningOverview.returnToAssessment.click()
                oasys.Assessment.countersign()

                cy.log(`Assessment is fully completed -ensure a COUNTERSIGN API has been posted to the SAN service and that the parameters are correct including 
                        the 'outcome' which is set to 'COUNTERSIGNED' along with the countersigners ID and name	
                    In the database ensure the field OASYS_SET.SAN_ASSESSMENT_VERSION_NO and OASYS_SET.SSP_PLAN_VERSION_NO have been populated BUT
                        that would have been by the initial assessor signing again	
                    Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'	`)

                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])

                oasys.San.checkSanCountersigningCall(pk, oasys.Users.probSanHeadPdu, 'COUNTERSIGNED')
                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                })

                oasys.logout()
            })
        })
    })

})
