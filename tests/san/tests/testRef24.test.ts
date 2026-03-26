import { test } from 'fixtures'


test('SAN integration - test ref 24', async ({ oasys, offender, assessment, sentencePlan, san, risk, signing }) => {

    await oasys.login(oasys.users.probSanHeadPdu)
    const offender1 = await offender.createProbFromStandardOffender({ forename1: 'TestRefTwentyFour' })
    await oasys.logout()

    await oasys.login(oasys.users.admin, oasys.users.probationSan)
    await offender.searchAndSelectByPnc(offender1.pnc)
    await offender.setLaoReader(oasys.users.probSanHeadPdu)
    await oasys.logout()

    await oasys.login(oasys.users.probSanHeadPdu)

    log(`Open up the Offender record - assessor has full editable rights to the offender
        At this point there is NO button on the banner for 'Open S&N'
        At this point there is NO button on the banner for 'Open SP'`, 'Test step')

    await offender.searchAndSelectByPnc(offender1.pnc)
    await offender.offenderDetails.pnc.checkStatus('enabled')
    await offender.offenderDetails.openSan.checkStatus('notVisible')
    await offender.offenderDetails.openSp.checkStatus('notVisible')

    log(`Create a new OASys-SAN assessment (3.2) - this will push a CreateAssessment API to the SAN Service
        Close out of the assessment, reverts back to the Offender record - now there is a button for 'Open S&N' and 'Open SP'`, 'Test step')

    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await san.queries.checkSanCreateAssessmentCall(pk1, null, null, oasys.users.probSanHeadPdu, oasys.users.probationSanCode, 'INITIAL')
    await oasys.clickButton('Close')
    await offender.offenderDetails.openSan.checkStatus('enabled')
    await offender.offenderDetails.openSp.checkStatus('enabled')

    log(`Click on the <Open S&N> button from the offender record - uses the OTL to open up the SAN Assessment
        Complete entry of the SAN assessment with whatever you want
        Return back to the Offender record`, 'Test step')

    await san.populateMinimal('offender')

    log(`Click on the <Open SSP> button from the offender record - uses the OTL to open up the Sentence Plan Service
        Complete entry of the Sentence Plan with whatever you want but ensure you agree the plan
        Return back to the Offender record`, 'Test step')

    await sentencePlan.populateMinimal('spService', 'offender')

    log(`Check the database for the OASys-SAN assessment - at this point there will be nothing in it from the SAN assessment`)

    await san.queries.checkNoQuestionsCreated(pk1)

    log(`Open up the OASys - SAN assessment - keep on the Case ID landing page - check the database, now data has been populated from the SAN assessment
        Complete entry of the remaining non - populated OASys questions.If a full analysis has been invoked complete it.
        Sign and lock the OASys - SAN assessment including countersigning if required - check the relevant APIs have gone to the SAN Service
        Log out`, 'Test step')

    await assessment.openLatest()
    await san.sanSections.checkCompletionStatus(true)

    // Complete section 1
    await assessment.offendingInformation.populateMinimal()

    await assessment.predictors.goto(true)
    await assessment.predictors.dateFirstSanction.setValue({ years: -2 })
    await assessment.predictors.o1_32.setValue(2)
    await assessment.predictors.o1_40.setValue(0)
    await assessment.predictors.o1_29.setValue({ months: -1 })
    await assessment.predictors.o1_30.setValue('No')
    await assessment.predictors.o1_38.setValue({})

    await risk.screeningNoRisks()

    await signing.signAndLock({ page: 'spService' })
    await san.queries.checkSanSigningCall(pk1, oasys.users.probSanHeadPdu, 'SELF')

    await oasys.logout()

    log(`Log back in again as a User in the same probation region who has the SAN Service role but is NOT on the LAO readers list
        Search for and open the LAO offender record - the user ONLY has LAO boilerplate (all read only and just access to the 'alias' tab)
        The only buttons on the offender banner is <RFI> and <Close>.  There are NO buttons for 'Open S&N' or 'Open SP'
        Log out`, 'Test step')

    await oasys.login(oasys.users.probSanUnappr)
    await offender.searchAndSelectByPnc(offender1.pnc)

    await offender.offenderDetails.pnc.checkStatus('readonly')
    await offender.offenderDetails.assessmentsTab.checkStatus('notVisible')
    await offender.offenderDetails.createAssessment.checkStatus('notVisible')
    await offender.offenderDetails.openSan.checkStatus('notVisible')
    await offender.offenderDetails.openSp.checkStatus('notVisible')
    await oasys.logout()

    log(`Log back in again as a User in the same probation region who does NOT have the SAN Service role and is NOT on the LAO readers list
        Search for and open the LAO offender record - the user ONLY has LAO boilerplate (all read only and just access to the 'alias' tab)
        The only buttons on the offender banner is <RFI> and <Close>.  There are NO buttons for 'Open S&N' or 'Open SP'`, 'Test step')

    await oasys.login(oasys.users.admin, oasys.users.probationSan)
    await offender.searchAndSelectByPnc(offender1.pnc)
    await offender.offenderDetails.pnc.checkStatus('readonly')
    await offender.offenderDetails.assessmentsTab.checkStatus('notVisible')
    await offender.offenderDetails.createAssessment.checkStatus('notVisible')
    await offender.offenderDetails.openSan.checkStatus('notVisible')
    await offender.offenderDetails.openSp.checkStatus('notVisible')
    await oasys.logout()
})
