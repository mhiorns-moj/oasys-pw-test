import { test } from 'fixtures'
import * as testData from '../data/testRef36'

/**
 * 1) Create and complete a 3.2 assessment 
 * 2) Create a new 3.2 assessment ( clones from 1 incuding the san part), modify SAN sections and leave as WIP.
 * 3) Delete the latest WIP 3.2
 * 4) Create a new 3.2 assessment ( clones from 1 including the san part), leave as WIP
 * 
 * Check parameters (in particular PKs and versions) and cloning.  Does assessment 3 clone SAN content from 1 or 2????
 */

test('SAN integration - test ref 36', async ({ oasys, offender, assessment, sections, sentencePlan, san, risk, signing, sns }) => {

    await oasys.login(oasys.users.probSanUnappr)
    const offender1 = await offender.createProbFromStandardOffender({ forename1: 'TestRefThirtySix', type: 'noEvent' })

    log('Create first assessment and check SAN call', 'Test step')
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    // Check values in OASYS_SET
    await san.queries.getSanApiTimeAndCheckDbValues(pk1, 'Y', null)

    // Check Create call
    await san.queries.checkSanCreateAssessmentCall(pk1, null, null, oasys.users.probSanUnappr, oasys.users.probationSanCode, 'INITIAL')
    await san.queries.checkSanGetAssessmentCall(pk1, 0)

    // Complete section 1
    await sections.offendingInformation.goto()
    await sections.offendingInformation.offence.setValue('030')
    await sections.offendingInformation.subcode.setValue('01')
    await sections.offendingInformation.count.setValue(1)
    await sections.offendingInformation.offenceDate.setValue({ months: -6 })
    await sections.offendingInformation.sentence.setValue('Fine')
    await sections.offendingInformation.sentenceDate.setValue({ months: -1 })

    await sections.predictors.goto(true)
    await sections.predictors.dateFirstSanction.setValue({ years: -2 })
    await sections.predictors.o1_32.setValue(2)
    await sections.predictors.o1_40.setValue(0)
    await sections.predictors.o1_29.setValue({ months: -1 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({})

    await san.gotoSan()
    await san.queries.checkSanOtlCall(pk1, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': 'NO',
    }, {
        'displayName': oasys.users.probSanUnappr.forenameSurname,
        'accessMode': 'READ_WRITE',
    },
        'san', 'assessment'
    )

    await san.populateSanSections('TestRef36 complete SAN', testData.sanPopulation, true)
    await san.returnToOASys()
    await oasys.clickButton('Next')
    await san.queries.checkSanGetAssessmentCall(pk1, 0)

    await risk.screeningNoRisks(true)

    // Complete SP
    await sentencePlan.populateMinimal()

    // Sign and lock, check API calls and OASYS_SET

    await signing.signAndLock({ expectCountersigner: true, countersigner: oasys.users.probSanHeadPdu })
    await san.queries.checkSanSigningCall(pk1, oasys.users.probSanUnappr, 'COUNTERSIGN')
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS', 'RSR'])
    await oasys.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, {
        SAN_ASSESSMENT_LINKED_IND: 'Y',
        CLONED_FROM_PREV_OASYS_SAN_PK: null,
        SAN_ASSESSMENT_VERSION_NO: '0'
    })

    // Countersign the first assessment
    await oasys.logout()
    await oasys.login(oasys.users.probSanHeadPdu)
    await signing.countersign({ offender: offender1, comment: 'Test comment' })

    await san.queries.checkSanCountersigningCall(pk1, oasys.users.probSanHeadPdu, 'COUNTERSIGNED')
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])
    await oasys.logout()

    await oasys.login(oasys.users.probSanUnappr)
    await offender.searchAndSelectByPnc(offender1.pnc)

    log('Create second assessment and check SAN call', 'Test step')

    const pk2 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    // Check OASYS_SET and API calls
    await san.queries.getSanApiTimeAndCheckDbValues(pk2, 'Y', pk1)

    await san.queries.checkSanCreateAssessmentCall(pk2, pk1, pk1, oasys.users.probSanUnappr, oasys.users.probationSanCode, 'REVIEW')
    await san.queries.checkSanGetAssessmentCall(pk2, 1)
    await oasys.queries.checkCloning(pk2, pk1, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
        'SAQ', 'ROSH', 'ROSHFULL', 'ROSHSUM', 'RMP', 'SKILLSCHECKER', 'SAN',])

    // Modify SAN content
    await san.gotoSan()
    await san.queries.checkSanOtlCall(pk2, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': 'NO',
    }, {
        'displayName': oasys.users.probSanUnappr.forenameSurname,
        'accessMode': 'READ_WRITE',
    },
        'san', 'assessment'
    )
    await san.populateSanSections('TestRef36 modify SAN', testData.modifySan, true)
    await san.returnToOASys()
    await oasys.clickButton('Next')

    // Check API calls and OASYS_SET
    await oasys.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk2}`, {
        SAN_ASSESSMENT_LINKED_IND: 'Y',
        CLONED_FROM_PREV_OASYS_SAN_PK: pk1.toString(),
        SAN_ASSESSMENT_VERSION_NO: null
    })
    await san.queries.checkSanGetAssessmentCall(pk2, 1)
    await oasys.logout()

    // Delete the WIP assessment
    await oasys.login(oasys.users.admin, oasys.users.probationSan)
    await offender.searchAndSelectByPnc(offender1.pnc)
    await assessment.deleteLatest()
    await san.queries.checkSanDeleteCall(pk2, oasys.users.admin)
    await oasys.logout()

    log('Create third assessment and check SAN call and OASYS_SET', 'Test step')

    await oasys.login(oasys.users.probSanUnappr)
    await offender.searchAndSelectByPnc(offender1.pnc)

    const pk3 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await san.queries.getSanApiTimeAndCheckDbValues(pk3, 'Y', pk1)

    await san.queries.checkSanCreateAssessmentCall(pk3, pk1, pk1, oasys.users.probSanUnappr, oasys.users.probationSanCode, 'REVIEW')
    await san.queries.checkSanGetAssessmentCall(pk3, 2)

    // Check cloning from first assessment to second (non-deleted)
    await oasys.queries.checkCloning(pk3, pk1, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
        'SAQ', 'ROSH', 'ROSHFULL', 'ROSHSUM', 'RMP', 'SKILLSCHECKER',])

    // Open SAN, check OTL call and subsequent GetAssessment
    await san.gotoSan()
    await san.queries.checkSanOtlCall(pk3, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': 'NO',
    }, {
        'displayName': oasys.users.probSanUnappr.forenameSurname,
        'accessMode': 'READ_WRITE',
    },
        'san', null
    )
    await san.returnToOASys()
    await oasys.clickButton('Close')
    await san.queries.checkSanGetAssessmentCall(pk3, 2)

    // Lock incomplete, check API call and OASYS_SET
    await assessment.lockIncomplete(pk3)
    await san.queries.checkSanLockIncompleteCall(pk3, oasys.users.probSanUnappr)

    await oasys.logout()
})