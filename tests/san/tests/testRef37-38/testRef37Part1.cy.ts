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

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            // Create first assessment
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {
                // Check values in OASYS_SET
                oasys.San.getSanApiTimeAndCheckDbValues(pk, 'Y', null)

                // Check Create call
                oasys.San.checkSanCreateAssessmentCall(pk, null, oasys.Users.probSanUnappr, oasys.Users.probationSanCode, 'INITIAL')
                oasys.San.checkSanGetAssessmentCall(pk, 0)

                // Complete section 1
                const offendingInformation = new oasys.Pages.Assessment.OffendingInformation().goto()
                offendingInformation.offence.setValue('030')
                offendingInformation.subcode.setValue('01')
                offendingInformation.count.setValue(1)
                offendingInformation.offenceDate.setValue({ months: -6 })
                offendingInformation.sentence.setValue('Fine')
                offendingInformation.sentenceDate.setValue({ months: -1 })

                const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
                predictors.dateFirstSanction.setValue({ years: -2 })
                predictors.o1_32.setValue(2)
                predictors.o1_40.setValue(0)
                predictors.o1_29.setValue({ months: -1 })
                predictors.o1_30.setValue('No')
                predictors.o1_38.setValue({})

                // Populate SAN sections, check API calls
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
                    'sexuallyMotivatedOffenceHistory': 'NO',
                }, {
                    'displayName': oasys.Users.probSanUnappr.forenameSurname,
                    'accessMode': 'READ_WRITE',
                },
                    'san', null
                )

                oasys.San.populateSanSections('TestRef36 complete SAN', testData.sanPopulation)
                oasys.San.returnToOASys()
                oasys.Nav.clickButton('Next')
                oasys.San.checkSanGetAssessmentCall(pk, 0)

                oasys.Populate.Rosh.screeningNoRisks(true)

                // Complete SP
                oasys.ArnsSp.runScript('populateMinimal')

                // Sign and lock, check API calls and OASYS_SET
                new oasys.Pages.SentencePlan.SentencePlanService().goto()
                oasys.Assessment.signAndLock({ expectCountersigner: true, countersigner: oasys.Users.probSanHeadPdu, countersignComment: 'Test 37 part 1 signing' })
                oasys.San.checkSanSigningCall(pk, oasys.Users.probSanUnappr, 'COUNTERSIGN')
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])
                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: '0'
                })
            })
        })
    })

})
