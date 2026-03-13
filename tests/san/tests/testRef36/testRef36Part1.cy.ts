import * as oasys from 'lib'
import * as testData from '../../data/testRef36'

describe('SAN integration - test ref 36', () => {
    /**
     * 1) Create and complete a 3.2 assessment 
     * 2) Create a new 3.2 assessment ( clones from 1 incuding the san part), modify SAN sections and leave as WIP.
     * 3) Delete the latest WIP 3.2
     * 4) Create a new 3.2 assessment ( clones from 1 including the san part), leave as WIP
     * 
     * Check parameters (in particular PKs and versions) and cloning.  Does assessment 3 clone SAN content from 1 or 2????
     */

    it('Test ref 36 part 1 - create and complete first 3.2 assessment', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probSanUnappr)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)

            // Create first assessment
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {
                // Check values in OASYS_SET
                oasys.San.getSanApiTimeAndCheckDbValues(pk, 'Y', null, null)

                // Check Create call
                oasys.San.checkSanCreateAssessmentCall(pk, null, oasys.Users.probSanUnappr, oasys.Users.probationSanCode, 'INITIAL', 0, 0)
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
                oasys.San.gotoSentencePlan()
                oasys.San.populateSanSections('SAN sentence plan', oasys.Populate.San.SentencePlan.minimal)
                oasys.San.returnToOASys()

                // Sign and lock, check API calls and OASYS_SET
                new oasys.Pages.SentencePlan.IspSection52to8().goto()

                oasys.Assessment.signAndLock({ expectCountersigner: true, countersigner: oasys.Users.probSanHeadPdu })
                oasys.San.checkSanSigningCall(pk, oasys.Users.probSanUnappr, 'COUNTERSIGN', 0, 0)
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])
                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: '0'
                })

                // Countersign the first assessment
                oasys.logout()
                oasys.login(oasys.Users.probSanHeadPdu)
                oasys.Assessment.countersign({ offender: offender, comment: 'Test comment' })

                oasys.San.checkSanCountersigningCall(pk, oasys.Users.probSanHeadPdu, 'COUNTERSIGNED', 0, 0)
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
                oasys.logout()

            })
        })
    })

})
