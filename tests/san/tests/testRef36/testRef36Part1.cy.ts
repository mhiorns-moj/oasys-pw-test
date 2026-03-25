import * as oasys from 'oasys'
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

            oasys.login(oasys.users.probSanUnappr)
            await offender.searchAndSelectByPnc(offender.pnc)

            // Create first assessment
            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
            oasys.Db.getLatestSetPkByPnc(offender.pnc, 'result')

            cy.get<number>('@result').then((pk) => {
                // Check values in OASYS_SET
                await san.getSanApiTimeAndCheckDbValues(pk, 'Y', null)

                // Check Create call
                await san.checkSanCreateAssessmentCall(pk, null, oasys.users.probSanUnappr, oasys.users.probationSanCode, 'INITIAL')
                await san.checkSanGetAssessmentCall(pk, 0)

                // Complete section 1
                const offendingInformation = new oasys.Pages.Assessment.OffendingInformation().goto()
                offendingInformation.offence.setValue('030')
                offendingInformation.subcode.setValue('01')
                offendingInformation.count.setValue(1)
                offendingInformation.offenceDate.setValue({ months: -6 })
                offendingInformation.sentence.setValue('Fine')
                offendingInformation.sentenceDate.setValue({ months: -1 })

                await assessment.predictors.goto(true)
                predictors.dateFirstSanction.setValue({ years: -2 })
                predictors.o1_32.setValue(2)
                predictors.o1_40.setValue(0)
                predictors.o1_29.setValue({ months: -1 })
                predictors.o1_30.setValue('No')
                predictors.o1_38.setValue({})

                await san.gotoSan()
                await san.checkSanOtlCall(pk, {
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
                await san.checkSanGetAssessmentCall(pk, 0)

                oasys.Populate.Rosh.screeningNoRisks(true)

                // Complete SP
                oasys.ArnsSp.runScript('populateMinimal')

                // Sign and lock, check API calls and OASYS_SET

                await signing.signAndLock({ expectCountersigner: true, countersigner: oasys.users.probSanHeadPdu })
                await san.checkSanSigningCall(pk, oasys.users.probSanUnappr, 'COUNTERSIGN')
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])
                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: 'Y',
                    CLONED_FROM_PREV_OASYS_SAN_PK: null,
                    SAN_ASSESSMENT_VERSION_NO: '0'
                })

                // Countersign the first assessment
                oasys.logout()
                oasys.login(oasys.users.probSanHeadPdu)
                oasys.Assessment.countersign({ offender: offender, comment: 'Test comment' })

                await san.checkSanCountersigningCall(pk, oasys.users.probSanHeadPdu, 'COUNTERSIGNED')
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
                oasys.logout()

            })
        })
    })

})
