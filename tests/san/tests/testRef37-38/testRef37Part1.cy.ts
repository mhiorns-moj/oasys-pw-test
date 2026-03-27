import * as oasys from 'oasys'
import * as testData from '../../data/testRef36'

describe('SAN integration - test ref 37 part 1', () => {
    /**
     * Carry out a test for rolling back a countersigned assessment to ensure the san service process the request
     */

    it('Create and complete 3.2 assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            await oasys.login(oasys.users.probSanUnappr)
            await offender.searchAndSelectByPnc(offender.pnc)

            // Create first assessment
            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            await oasysDb.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {
                // Check values in OASYS_SET
                await san.queries.getSanApiTimeAndCheckDbValues(pk, 'Y', null)

                // Check Create call
                await san.queries.checkSanCreateAssessmentCall(pk, null, oasys.users.probSanUnappr, oasys.users.probationSanCode, 'INITIAL')
                await san.queries.checkSanGetAssessmentCall(pk, 0)

                // Complete section 1
                await sections.offendingInformation.goto()
                offendingInformation.offence.setValue('030')
                offendingInformation.subcode.setValue('01')
                offendingInformation.count.setValue(1)
                offendingInformation.offenceDate.setValue({ months: -6 })
                offendingInformation.sentence.setValue('Fine')
                offendingInformation.sentenceDate.setValue({ months: -1 })

                await sections.predictors.goto(true)
                await sections.predictors.dateFirstSanction.setValue({ years: -2 })
                await sections.predictors.o1_32.setValue(2)
                await sections.predictors.o1_40.setValue(0)
                await sections.predictors.o1_29.setValue({ months: -1 })
                await sections.predictors.o1_30.setValue('No')
                await sections.predictors.o1_38.setValue({})

                // Populate SAN sections, check API calls
                await san.gotoSan()
                await san.queries.checkSanOtlCall(pk, {
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
                    'displayName': oasys.users.probSanUnappr.forenameSurname,
                    'accessMode': 'READ_WRITE',
                },
                    'san', null
                )

                await san.populateSanSections('TestRef36 complete SAN', testData.sanPopulation)
                await san.returnToOASys()
                await oasys.clickButton('Next')
                await san.queries.checkSanGetAssessmentCall(pk, 0)

                await risk.screeningNoRisks(true)

                // Complete SP
                await sentencePlan.populateMinimal()

                // Sign and lock, check API calls and OASYS_SET
                new oasys.Pages.SentencePlan.SentencePlanService().goto()
                await signing.signAndLock({ expectCountersigner: true, countersigner: oasys.users.probSanHeadPdu, countersignComment: 'Test 37 part 1 signing' })
                await san.queries.checkSanSigningCall(pk, oasys.users.probSanUnappr, 'COUNTERSIGN')
                await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])
                await oasys.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: '0'
                })
            })
        })
    })

})
