import * as lib from 'lib'
import { test } from 'fixtures'

/**
    New FEMALE Probation Offender in SAN Area - check functionality when say 'No' to cloning from an Historic OASys-SAN assessment.
 */

const off1: OffenderDef = {

    forename1: 'TestRefFourteen',
    gender: 'Female',
    dateOfBirth: { years: -32 },
    event: {
        eventDetails: {
            sentenceType: 'Fine',
            sentenceDate: { months: -6 },
        },
        offences:
        {
            offence: '028',
            subcode: '01',
        },
    },
}

test('SAN integration - test ref 14', async ({ oasys, offender, assessment, oasysDb }) => {

    await oasys.login(oasys.users.probSanHeadPdu)
    const offender1 = await offender.createProb(off1)

    lib.log(`For the first assessment, create a new OASys-SAN assessment (3.2) that now includes a SAN Sentence Plan
            Complete the SAN Assessment part AND complete the SAN Sentence Plan (doesn't matter what you select, just need to get a completed 3.2).`, 'Test step')

    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await assessment.san.populateMinimal()
    await assessment.sentencePlan.populateMinimal({ sentencePlan: 'SpService' })

    lib.log(`Complete the OASys part of the assessment invoking a full analysis by saying 'Yes' to something in the RoSH Screening.
            Fully sign and lock and countersign (if applicable) the 3.2 assessment.`, 'Test step')

    // Complete section 1
    await assessment.common.offendingInformation.populateMinimal()

    await assessment.common.predictors.goto(true)
    await assessment.common.predictors.dateFirstSanction.setValue({ years: -2 })
    await assessment.common.predictors.o1_32.setValue(2)
    await assessment.common.predictors.o1_40.setValue(0)
    await assessment.common.predictors.o1_29.setValue({ months: -1 })
    await assessment.common.predictors.o1_30.setValue('No')
    await assessment.common.predictors.o1_38.setValue({})

    await assessment.risk.populateMinimal()
    await assessment.risk.roshScreeningSection5.goto()
    await assessment.risk.roshScreeningSection5.r5_1.setValue('Yes')
    await assessment.risk.roshScreeningSection5.r5_1t.setValue('Want to do a full analysis')
    await oasys.clickButton('Save')
    await assessment.risk.roshSummary.fullyPopulated()
    await assessment.risk.riskManagementPlan.minimalWithTextFields()

    await assessment.signing.signAndLock({ page: 'spService' })

    lib.log(`Open up the completed 3.2 and from the Admin Menu select 'Mark all assessments as historic'`, 'Test step')

    await oasys.history()
    await assessment.markHistoric()

    lib.log(`As the assessor click on the <Open S&N> button - navigates out to the SAN Assessment where everything is shown in READ ONLY mode
            - check the OTL accessmode parameter
            Return back to the OASys assessment
            As the assessor click on the <Open SP> button - navigates out to the Sentence Plan where everything is shown in READ ONLY mode
            - check the OTL plan accessmode parameter
            Return back to the OASys assessment`, 'Test step')

    await assessment.san.gotoSanReadOnly()
    await oasysDb.sanQueries.checkSanOtlCall(pk1,
        {
            'crn': offender1.probationCrn,
            'pnc': offender1.pnc,
            'nomisId': null,
            'givenName': offender1.forename1,
            'familyName': offender1.surname,
            'dateOfBirth': offender1.dateOfBirth,
            'gender': '2',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': 'NO',
        },
        {
            'displayName': oasys.users.probSanHeadPdu.forenameSurname,
            'accessMode': 'READ_ONLY',
        },
        'san',
    )

    await assessment.san.checkSanEditMode(false)
    await assessment.san.returnToOASys()

    await assessment.sentencePlan.spService.checkReadOnly()
    await oasysDb.sanQueries.checkSanOtlCall(pk1,
        {
            'crn': offender1.probationCrn,
            'pnc': offender1.pnc,
            'nomisId': null,
            'givenName': offender1.forename1,
            'familyName': offender1.surname,
            'dateOfBirth': offender1.dateOfBirth,
            'gender': '2',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': 'NO',
        },
        {
            'displayName': oasys.users.probSanHeadPdu.forenameSurname,
            'planAccessMode': 'READ_ONLY',
        },
        'sp'
    )

    await oasys.clickButton('Close')

    lib.log(`Now create a new 3.2 OASys-SAN Assessment (not PSR), the new SAN question defaults to 'Yes' and during the Create process say 'No' to cloning from the historic assessment.
                Check the CreateAssessment API to ensure that it posts just the ONE current PK across to the SAN service and the offender details.
                Check the OASYS_SET record; field CLONED_FROM_PREV_OASYS_SAN_PK is NULL, fields SAN_ASSESSMENT_LINKED_IND = 'Y', LASTUPD_FROM_SAN is set 
                to a date and time as we have retrieved the data but SAN_ASSESSMENT_VERSION_NO AND SSP_PLAN_VERSION_NO are NULL.
                There is no full analysis in the new 3.2 assessment, in fact most of the OASys sections are blank, including the Sentence Plan.`, 'Test step')


    const pk2 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' }, 'No')

    await oasysDb.sanQueries.checkSanCreateAssessmentCall(pk2, null, oasys.users.probSanHeadPdu, oasys.users.probationSanCode, 'INITIAL')
    // Check values in OASYS_SET
    await oasysDb.sanQueries.getSanApiTimeAndCheckDbValues(pk2, 'Y', null)

    await assessment.risk.riskManagementPlan.checkMenuVisibility(false)
    await assessment.sentencePlan.spService.checkGoalCount(0, 0)

    await oasys.logout()

})
