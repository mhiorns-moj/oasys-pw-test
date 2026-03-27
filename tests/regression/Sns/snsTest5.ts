
describe('Create assessments and check SNS messages - SAN assessment', () => {


    it('Countersigning required', () => {

        // Create an offender with minimally complete layer 3.2
        await oasys.login(oasys.users.probSanUnappr)
        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            oasys.Populate.CommonPages.OffendingInformation.minimal()
            oasys.Populate.Layer3Pages.Predictors.minimal()

            await san.gotoSan()
            await san.populateSanSections('Example test', oasys.Populate.San.ExampleTest.sanPopulation1)
            await san.returnToOASys()

            await risk.screeningNoRisks(true)

            // Set to Medium risk to get countersigner
            oasys.Populate.Rosh.specificRiskLevel('High')

            // Complete SP
            oasys.Populate.San.NewSpService.minimal()

            // Sign assessment and send for countersigning, then check SNS messages
            await signing.signAndLock({ page: oasys.Pages.SentencePlan.SentencePlanService, expectCountersigner: true, expectRsrWarning: true, countersigner: oasys.users.probSanHeadPdu })
            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS'])
            await oasys.logout()

            // Countersign assessment then check SNS messages again
            await oasys.login(oasys.users.probSanHeadPdu)

            await offender.searchAndSelect('@offender1')
            await assessment.openLatest()
            await signing.countersign({ page: oasys.Pages.SentencePlan.SentencePlanService, comment: 'Test comment' })

            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm'])
            await oasys.logout()

            // Create another assessment, this one with OPD override and RSR
            await oasys.login(oasys.users.probSanUnappr)
            await oasys.history('@offender1')

            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            await sections.predictors.goto()
            await sections.predictors.o1_29.setValue({ months: -1 })
            await sections.predictors.o1_30.setValue('No')
            await sections.predictors.o1_38.setValue({ years: 1 })
            const summarySheet = new oasys.Pages.Assessment.SummarySheet()
            summarySheet.goto().opdOverride.setValue('Yes')
            summarySheet.opdOverrideReason.setValue('Testing')

            // Sign assessment and check SNS messages
            await signing.signAndLock({ page: oasys.Pages.SentencePlan.IspSection52to8, expectCountersigner: true, countersigner: oasys.users.probSanHeadPdu })
            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['OGRS', 'RSR'])
            await oasys.logout()

            // Countersign assessment then check SNS messages again
            await oasys.login(oasys.users.probSanHeadPdu)
            await signing.countersign({ offender: offender, comment: 'Test comment' })

            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OPD'])
            await oasys.logout()

        })

    })
})