import * as oasys from 'oasys'
import * as testData from '../../data/testRef17'

describe('SAN integration - test ref 17 part 1', () => {

    it('Test ref 17 part 1 - Create a 3.2 assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.probSanPso)
            await offender.searchAndSelectByPnc(offender.pnc)

            log(`Create a Start of Community Order, layer 3, initial sentence plan.  
                    The SAN question appears asking if they want to 'Include strengths and needs sections' which has defaulted to 'Yes' 
                    Create the assessment - navigation menu does not show section 2 to 13 or the SAQ.  There is a menu option for 'Strengths and Needs Sections'
                    Check the database - ensure the OASYS_SET.SAN_ASSESSMENT_LINKED_IND = 'Y'
                    Check that a CreateAssessment API post was sent off with the correct details in it (the OASYS_SET_PK of the newly created record, the parameter 
                    for previous PK is null, and the User ID and name are correct, and now the sentence plan type)
                    Check that we get a '200' response back from the API - the contains parameters back, now includes data for the sentence plan
                    Ensure that we have NOT stored down any SAN version number OR Sentence Plan version number on the OASYS_SET record
                    Complete Section 1 with a non-sexual offence and complete the predictors screen - RSR dynamic score can't be scored yet.`)

            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order' })
            await san.checkLayer3Menu(true)

            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')
            cy.get<number>('@result').then((pk) => {
                await san.queries.checkSanCreateAssessmentCall(pk, null, oasys.users.probSanPso, oasys.users.probationSanCode, 'INITIAL')
                await oasys.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: null,
                    SSP_PLAN_VERSION_NO: null,
                })

                await assessment.offendingInformation.goto()
                offendingInformation.setValues({
                    offence: '030', subcode: '01', count: '1', offenceDate: oasysDateTime.oasysDateAsString({ months: -4 }),
                    sentence: 'Fine', sentenceDate: oasysDateTime.oasysDateAsString({ months: -3 })
                })
                await assessment.predictors.goto(true)
                await assessment.predictors.dateFirstSanction.setValue({ years: -3 })
                await assessment.predictors.o1_32.setValue(2)
                await assessment.predictors.o1_40.setValue(0)
                await assessment.predictors.o1_29.setValue({ months: -6 })
                await assessment.predictors.o1_30.setValue('No')
                await assessment.predictors.o1_38.setValue({ months: -1 })

                log(`Navigate out to the 'Strengths and Needs Sections' - complete the following questions in the SAN assessment that relate to Female OPD scoring.		
                        The following set of SAN questions are for the FEMALE OPD score:	
                            In Offence Analysis 'Did the offence involve 'Violence or threat of violence / coercion' - select Yes	
                            In Offence Analysis 'Did the offence involve 'Excessive violence or sadistic violence' - select Yes	
                            In Offence Analysis 'Is there any evidence of domestic abuse?' - select No	
                            In Offence Analysis 'Is the offence linked to risk of serious harm, risks to the individual or other risks?' - select Yes	
                            In Accommodation 'Is this area linked to risk of serious harm?' - select Yes	
                            In Personal relationships…. 'What was [subject]’s experience of their childhood?' - select 'Both positive and negative experience'	
                            In Personal relationships…. 'Is this area linked to risk of serious harm?' - select Yes	
                            In Health and wellbeing 'Is ? able to cope with day-to-day life?' - select 'Not able to cope'	
                            In Health and wellbeing 'Does ? have any diagnosed or documented mental health problems?' - select 'Yes, ongoing - severe and documented over a prolonged period of time.'	
                            In Health and wellbeing 'Has ? ever self-harmed?' - select Yes	
                            In Health and wellbeing 'Is this area linked to risk of serious harm?' - select Yes	
                            In Thinking, behaviour… 'Is this area linked to risk of serious harm?' - select Yes	
                        Answer ALL other SAN Assessment questions as 'No' or select the 'negative' response		
                        Ensure the SAN Assessment is completed and validated. The 'Strengths and Needs Sections' menu item has a green tick against it
                        A full analysis has been invoked - giving sections 6.1, 6.2, RoSH Summary and Risk Management Plan`)

                await san.gotoSan()
                await san.populateSanSections('Test ref 17', testData.sanPopulation)
                await san.returnToOASys()
                await oasys.clickButton('Next')
                await san.sanSections.checkCompletionStatus(true)
                await risk.fullAnalysisSection62.checkMenuVisibility(true)
                new oasys.Pages.Rosh.RoshSummary().checkMenuVisibility(true)
                new oasys.Pages.Rosh.RiskManagementPlan().checkMenuVisibility(true)

                log(`Navigate to the RoSH Screening Section 1 - at R1.2 Arson - select 'Yes' in the Current column, at R1.2 Any offence involving possession and / or 
                        use of weapons - select 'Yes' in the current column
                    Ensure ALL other question on this screen are answered as 'No'
                    Click on <Next> to go to Section 2 to 4 of the RoSH Screening -  ensure the 'Factors to consider for Child Wellbeing' include 'violent behaviours' 
                        and 'Self-harm issues' 
                    At R2.3 select 'Yes', at R2.7 for Identifiable Children select 'Yes' and for Children in general select 'No'
                    At R3.1, R3.2, R3.3, R3.4, R4.1, R4.2, R4.3 and R4.4 select 'No'
                    Do not enter in any child details here - click on <Save> - the full analysis now have section 7 added to it
                    Click on <Next> to go to Section 5 of the RoSH Screening - R5.1 is NOT shown, R5.2 has defaulted to 'No' and is read only
                    Complete the full analysis, adding a couple of child details and set the offender to have 'MEDIUM' risk for CHILDREN IN COMMUNITY,
                        set all other risks to 'LOW'`)

                await risk.screeningSection1.goto()
                rosh1.mark1_2AsNo.click()
                rosh1.r1_2_7P.setValue('Yes')
                rosh1.r1_2_13P.setValue('Yes')
                rosh1.mark1_3AsNo.click()
                rosh1.r1_4.setValue('No')

                await risk.screeningSection2to4.goto()
                rosh2.r2_3.setValue('Yes')
                rosh2.r2_4_1.setValue('Yes')
                rosh2.r2_4_2.setValue('No')
                rosh2.r3_1.setValue('No')
                rosh2.r3_2.setValue('No')
                rosh2.r3_3.setValue('No')
                rosh2.r3_4.setValue('No')
                rosh2.r4_1.setValue('No')
                rosh2.r4_6.setValue('No')
                rosh2.r4_4.setValue('No')

                const rosh5 = new oasys.Pages.Rosh.RoshScreeningSection5().goto()
                rosh5.r5_1.checkStatus('notVisible')
                rosh5.r5_2.checkStatusAndValue('readonly', 'No')

                new oasys.Pages.Rosh.RoshFullAnalysisSection7().goto()
                oasys.Populate.RoshPages.ChildAtRisk.fullyPopulatedChild1()
                oasys.Populate.RoshPages.ChildAtRisk.fullyPopulatedChild2()

                const roshSummary = new oasys.Pages.Rosh.RoshSummary().goto()
                await risk.populateWithSpecificRiskLevel('Low')
                roshSummary.r10_6ChildrenCommunity.setValue('Medium')

                log(`Navigate to the Risk Management screen - ensure the checklist of items are 'Use of weapons', 'Arson', 'Accommodation', 
                                'Personal relationships and commnity', 'Health and wellbeing', 'Thinking, behaviours and attitudes',
                                'Risk to Children, ' 
                            Note: there maybe others depending on what has been answered in the SAN assessment
                        Ensure the Key Information about Current Situation field is correct and specifically includes the following:
                            A sentence for 'They have offence analysis,accommodation, personal relationships and community, health and wellbeing and thinking,
                                    behaviours and attitudes linked to risk.'
                            A sentence for '? Has been assessed as medium risk to children.'
                        Complete the Risk Management screen`)

                oasys.Populate.RoshPages.RiskManagementPlan.minimalWithTextFields()
                const rmp = new oasys.Pages.Rosh.RiskManagementPlan()
                rmp.weapons.checkStatus('enabled')
                rmp.arson.checkStatus('enabled')
                rmp.accommodation.checkStatus('enabled')
                rmp.sanRelationships.checkStatus('enabled')
                rmp.sanHealth.checkStatus('enabled')
                rmp.sanThinking.checkStatus('enabled')
                rmp.riskToChildren.checkStatus('enabled')

                rmp.keyInformation.getValue('keyInformation')
                cy.get<string>('@keyInformation').then((keyInformation) => {
                    expect(keyInformation).includes('They have offence analysis, accommodation, personal relationships and community, health and wellbeing and thinking, behaviours and attitudes linked to risk.')
                    expect(keyInformation).includes(`${offender.forename1} ${offender.surname} has been assessed as medium risk to children.`)
                })

                log(`Navigate to the Summary Sheet screen: in particular check that the 'Offender Personality Disorder' section states 
                            'This individual meets the criteria for the OPD Pathway'.
                        Check the database and the OASYS_SET record - ensure field OPD_SCORE = 14 and OPD_RESULT = 'SCREEN_IN'`)

                await assessment.summarySheet.goto()

                // TODO restore OPD check
                // summarySheet.opd.checkValue('This individual meets the criteria for the OPD pathway.')
                // await oasys.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                //     OPD_SCORE: '11',
                //     OPD_RESULT: 'SCREEN IN',
                // })

                log(`Navigate out to the 'Sentence Plan Service'
                        Check the OTL is sending the correct criminogenic needs data according to the Summary Screen
                        Complete entry of the sentence plan with 2 goals/steps and ensure you 'Agree the Plan'
                        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen`)

                oasys.ArnsSp.runScript('populateTwoGoals')
                await san.queries.checkSanOtlCall(pk, {
                    'crn': offender.probationCrn,
                    'pnc': offender.pnc,
                    'nomisId': null,
                    'givenName': offender.forename1,
                    'familyName': offender.surname,
                    'dateOfBirth': offender.dateOfBirth,
                    'gender': '2',
                    'location': 'COMMUNITY',
                    'sexuallyMotivatedOffenceHistory': 'NO',
                }, {
                    'displayName': oasys.users.probSanPso.forenameSurname,
                    'planAccessMode': 'READ_WRITE',
                }, 'sp', null,
                    {
                        'accommodation': {
                            'accLinkedToHarm': 'YES',
                            'accLinkedToReoffending': 'NO',
                            'accStrengths': 'NO',
                            'accOtherWeightedScore': '0',
                            'accThreshold': 'NO'
                        },
                        'educationTrainingEmployability': {
                            'eteLinkedToHarm': 'NO',
                            'eteLinkedToReoffending': 'NO',
                            'eteStrengths': 'NO',
                            'eteOtherWeightedScore': '0',
                            'eteThreshold': 'NO'
                        },
                        'finance': {
                            'financeLinkedToHarm': 'NO',
                            'financeLinkedToReoffending': 'NO',
                            'financeStrengths': 'NO',
                            'financeOtherWeightedScore': 'N/A',
                            'financeThreshold': 'N/A'
                        },
                        'drugMisuse': {
                            'drugLinkedToHarm': 'NO',
                            'drugLinkedToReoffending': 'NO',
                            'drugStrengths': 'NO',
                            'drugOtherWeightedScore': '0',
                            'drugThreshold': 'NO'
                        },
                        'alcoholMisuse': {
                            'alcoholLinkedToHarm': 'NO',
                            'alcoholLinkedToReoffending': 'NO',
                            'alcoholStrengths': 'NO',
                            'alcoholOtherWeightedScore': '0',
                            'alcoholThreshold': 'NO'
                        },
                        'healthAndWellbeing': {
                            'emoLinkedToHarm': 'YES',
                            'emoLinkedToReoffending': 'NO',
                            'emoStrengths': 'NO',
                            'emoOtherWeightedScore': 'N/A',
                            'emoThreshold': 'N/A'
                        },
                        'personalRelationshipsAndCommunity': {
                            'relLinkedToHarm': 'YES',
                            'relLinkedToReoffending': 'NO',
                            'relStrengths': 'NO',
                            'relOtherWeightedScore': '3',
                            'relThreshold': 'YES'
                        },
                        'thinkingBehaviourAndAttitudes': {
                            'thinkLinkedToHarm': 'YES',
                            'thinkLinkedToReoffending': 'NO',
                            'thinkStrengths': 'NO',
                            'thinkOtherWeightedScore': '4',
                            'thinkThreshold': 'YES'
                        },
                        'lifestyleAndAssociates': {
                            'lifestyleLinkedToHarm': 'N/A',
                            'lifestyleLinkedToReoffending': 'N/A',
                            'lifestyleStrengths': 'N/A',
                            'lifestyleOtherWeightedScore': '0',
                            'lifestyleThreshold': 'NO'
                        }

                    })

                log(`Navigate to Section 5.2 to 8 - green tick on the Sentence Plan Service menu option. Complete entry of the three fields on the screen for
                            Public Protection conference
                        Click on <Sign and Lock> -  get incomplete sections alert.
                        Continue to sign and lock, asks for a countersigner, leave default countersigner, add a comment
                        Check that a 'Sign API' has been posted to the SAN Service and the contents are correct (signType passed is 'COUNTERSIGN' along
                            with the User ID and name)`)

                new oasys.Pages.SentencePlan.SentencePlanService().goto()
                await signing.signAndLock({ expectCountersigner: true, countersignComment: 'Signing test 17' })

                await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])
                await san.queries.checkSanSigningCall(pk, oasys.users.probSanPso, 'COUNTERSIGN')

                await oasys.logout()
            })
        })
    })
})
