import * as oasys from 'oasys'

describe('SAN integration - test ref 08 part 2', () => {

    it('Test ref 8 part 2 - Create and check SAN assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.probSanUnappr)
            await offender.searchAndSelectByPnc(offender.pnc)

            log(`Create another assessment - defaults to Review
                        The new SAN question is NOT shown on the screen due to the default of PSR with 'PSR Outline' plan
                        Change the POA to 'Start of Community Order', Layer 3 with ISP and the new SAN question shows with a NULL default setting 
                        Set the SAN question answer to 'Yes'
                        Click on <Create>`)

            oasys.Assessment.getToCreateAssessmentPage()
            let createAssessmentPage = new oasys.Pages.Assessment.CreateAssessment()
            createAssessmentPage.purposeOfAssessment.checkValue('Review')
            createAssessmentPage.purposeOfAssessment.setValue('Start of Community Order')
            createAssessmentPage.assessmentLayer.setValue('Full (Layer 3)')
            createAssessmentPage.sentencePlanType.setValue('Initial')
            createAssessmentPage.includeSanSections.checkStatusAndValue('enabled', '')
            createAssessmentPage.includeSanSections.setValue('Yes')
            createAssessmentPage.create.click()

            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')
            cy.get<number>('@result').then((pk) => {

                log(`An OASys-SAN assessment (3.2) is created showing the Case ID Offender Information screen
                        Do NOT change any data or navigate anywhere
                        Ensure the left hand navigation menu DOES NOT show +Section 2 to 13 AND Self Assessment Form
                        Ensure THERE IS a navigation option for 'Strengths and Needs Sections' showing between + Section 1 and + RoSH Screening
                        Ensure the other navigation menus show correctly for Case ID, Section 1, RoSH Screening and Initial Sentence Plan`)

                new oasys.Pages.Assessment.OffenderInformation().checkCurrent()
                await san.checkLayer3Menu(true, assessment, sentencePlan)
                new oasys.Pages.Assessment.SourcesOfInformation().checkMenuVisibility(true)
                new oasys.Pages.Assessment.OffendingInformation().checkMenuVisibility(true)
                new oasys.Pages.Assessment.Predictors().checkMenuVisibility(true)
                new oasys.Pages.Rosh.RoshScreeningSection1().checkMenuVisibility(true)
                new oasys.Pages.Rosh.RoshScreeningSection2to4().checkMenuVisibility(true)
                new oasys.Pages.Rosh.RoshScreeningSection5().checkMenuVisibility(true)
                new oasys.Pages.SentencePlan.IspSection52to8().checkIsNotOnMenu()

                log(`Check the OASYS_SET record has new field 'SAN_ASSESSMENT_LINKED_IND' is SET to 'Y' and 'CLONED_FROM_PREV_OASYS_SAN_PK' is NULL
                        Check that a CreateAssessment API post was sent off with the correct details in it (the OASYS_SET_PK of the newly created record,
                                the parameter for previous PK is null, and the User detail fields are correct i.e User ID and User Name)
                        Check that we get a '200' response back from the API - the response may contain parameters back
                        Ensure that if the response returned parameters we have NOT stored down any SAN version number on the OASYS_SET record
                        Check the OASys database - there are NO questions saved to Sections 2 to 13 and SAQ - this is because we initially clear everything out
                        Check the OASys database - there are NO IP.1 and IP.2 questions in the ISP section
                        As part of the Create Assessment we would have called the SAN Service to Get data - can we provide evidence of that?
                        Check the OASYS_SET record, it is not clear yet but I am assuming that we will get something back from SAN even if the OASys equivalent section is blank - but OASYS_SET.LASTUPD_FROM_SAN should be set to date/timestamp from the API response
                        None of the navigation menu options have ticks against them`)

                await san.queries.getSanApiTimeAndCheckDbValues(pk, 'Y', null)
                await san.queries.checkSanCreateAssessmentCall(pk, null, oasys.users.probSanUnappr, oasys.users.probationSanCode, 'INITIAL')

                await san.checkNoQuestionsCreated(pk)
                await san.checkNoIspQuestions1Or2(pk)
                await san.queries.checkSanAssessmentCompletionStatus(false)

                log(`Click on 'Sign and Lock'
                        Ensure the errors reported are consistent with being a 3.2 assessment: 
                        There is NO <Mark 1 to 9 as Missing> button showing and there is NO <Continue with Signing> button
                        There is a <Return to Assessment> button showing
                        There is a warning thatOVP has not been calculated along with 'Please complete the ‘Offence analysis’ section in the Strengths and Needs Sections.’ 
                        There are NO errors relating to the 3.1 assessment sections 2 through to 13 or for the SAQ as any questions answered will be stored in the database but NOT visible on screen (but not yet!).
                        There are no errors relating to the RoSH Screening or the sentence plan as those questions have cloned from the previous 3.1 assessment
                        There is a new error that states 'The following ‘Strengths and Needs Sections’ have not been completed. Please press ‘Return to Assessment’ and navigate back to the ‘Strengths and Needs Sections’ to complete'
                        Then a list of the sections follows which are: Accommodation, Employment and education, Finance, Drug use, Alcohol use, Health and wellbeing, Personal relationships and community, Thinking, behaviours and attitudes, Offence analysis
                        There is a new error stating 'In OASys the offender has been marked at 1.30 as having behaviours that are sexually motivated.  There are relevant questions within the Strengths and Needs assessment that must be completed.  Please press 'Return to Assessment' and navigate back to the 'Strengths and Needs Sections' to complete.`)

                new oasys.Pages.SentencePlan.SentencePlanService().goto().signAndLock.click()

                oasys.Errors.checkSignAndLockErrorsNotVisible('section2To13Errors')
                oasys.Errors.checkSingleSignAndLockError(`Please provide a clear rationale for not fully completing the Self Assessment Questionnaire`, false)
                oasys.Errors.checkSingleSignAndLockError(`The following fields on the RoSH Screening have not been completed, Please press 'Return to Assessment' and navigate back to the RoSH Screening to complete.`, false)
                oasys.Errors.checkSingleSignAndLockError('Do you agree with the proposed plan (if no, explain why below)', false)
                oasys.Errors.checkSignAndLockErrorsVisible('sanSectionsIncomplete')

                oasys.Errors.checkSingleSignAndLockError(`In OASys the offender has been marked at 1.30 as having behaviours that are sexually motivated. There are relevant questions within the Strengths and Needs assessment that must be completed. Please press 'Return to Assessment' and navigate back to the 'Strengths and Needs Sections' to complete.`, true)
                const signingStatus = new oasys.Pages.Signing.SigningStatus()
                signingStatus.mark1To9AsMissing.checkStatus('notVisible')
                signingStatus.continueWithSigning.checkStatus('notVisible')


                log(`Return back to the assessment and change some of the data in the Case ID sections and Section 1 screens but leave as a SEXUAL offence (will have cloned from previous 3.1 assessment)
                        Check that question 1.46 has the wording 'Number of previous/current sanctions involving indecent child image or indirect child contact sexual/sexually motivated offences' (changed in the 6.50 release), remain on Section 1 Predictors screen after clicking <Save>
                        Now click on <Next>, navigates to the new 'Strengths and Needs Sections' screen
                        Ensure the buttons <Close>, <Next> and <Previous> are available (no other buttons should be showing)
                        There is text above the on-screen button which states 'To exit OASys and launch into the Strengths and Needs Service please click on the button below.'
                        The on-screen button is labelled 'Open Strengths and Needs'
                        Click on the button <Open Strengths and Needs>`)

                signingStatus.returnToAssessment.click()
                const offenderInformation = new oasys.Pages.Assessment.OffenderInformation().goto()
                offenderInformation.religion.setValue('Adventist')
                const sourcesOfInformation = new oasys.Pages.Assessment.SourcesOfInformation().goto()
                sourcesOfInformation.sourcesOther.setValue('Some other sources')
                await assessment.offendingInformation.goto()
                offendingInformation.communityPunishmentHours.setValue('200')
                offendingInformation.additionalRequirements1.setValue('Citizenship')
                offendingInformation.sentenceAdditionalLicenceConditions.setValue('Some additional conditions')
                await assessment.predictors.goto()
                await assessment.predictors.o1_32.setValue(4)
                await assessment.predictors.o1_40.setValue(0)
                await assessment.predictors.o1_29.setValue({ days: -7 })
                await assessment.predictors.o1_46.checkLabel('Number of previous/current sanctions involving indecent child image or indirect child contact sexual/sexually motivated offences')
                await assessment.predictors.save.click()
                await assessment.predictors.next.click()

                const sanSections = new oasys.Pages.Assessment.SanSections().checkCurrent()
                sanSections.close.checkStatus('enabled')
                sanSections.next.checkStatus('enabled')
                sanSections.previous.checkStatus('enabled')
                sanSections.markAsComplete.checkStatus('notVisible')
                sanSections.openSanLabel.checkStatus('visible')
                await san.gotoSan()

                log(`Within the SAME browser tab the OASys screen closes and is replaced by the first screen in the SAN Assessment
                         - get evidence here of the One-Time link API so we can check the parameters going out
                        Do not enter anything into the SAN Assessment - there should be a visible button/link to return to the OASys assessment
                        Click on that button/link - Within the SAME browser tab the SAN Assessment screen closes and is replaced with the OASys 'Strengths and Needs Sections'
                        screen for the OASys-SAN assessment that we navigated away from
                        The OASys 'Strengths and Needs Sections' screen is the same as before with some text above the launch <button>
                        None of the navigation menus have green ticks against them
                        Go to the Summary Sheet screen - ensure that the top 'Criminogenic Needs Summary and Section Scores' has a populated 'Criminogenic Need' 
                        column which are all set to 'N' apart from 'Finance' and 'Health and wellbeing' which are set to 'N/A'.
                        The 'Scores' column are all just greyed out apart from 'Finance' and 'Health and wellbeing' which are set to 'N/A'.`)

                await san.queries.checkSanLoaded(offender.probationCrn, offender.pnc)
                await san.queries.checkSanOtlCall(pk, {
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
                    'displayName': oasys.users.probSanUnappr.forenameSurname,
                    'accessMode': 'READ_WRITE',
                },
                    'san', null
                )
                await san.returnToOASys()
                sanSections.checkCurrent()
                await san.queries.checkSanAssessmentCompletionStatus(false)
                await assessment.summarySheet.goto()
                const expectedValues: ColumnValues[] = [
                    {
                        name: 'oasysSection',
                        values: ['Accommodation', 'Employment and education', 'Finance', 'Drug use', 'Alcohol use', 'Health and wellbeing', 'Personal relationships and community', 'Thinking, behaviours and attitudes', 'Lifestyle & Associates']
                    },
                    {
                        name: 'criminogenicNeed',
                        values: ['N', 'N', 'N/A', 'N', 'N', 'N/A', 'N', 'N', 'N']
                    },
                    {
                        name: 'scores',
                        values: [null, null, 'N/A', null, null, 'N/A', null, null, null]
                    }
                ]
                summarySheet.save.click()  // Workaround for defect NOD-1165
                summarySheet.sanCrimTable.checkData(expectedValues)

                await oasys.logout()
            })

        })
    })
})