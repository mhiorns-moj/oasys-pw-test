
describe('Create assessments and check SNS messages - SAN assessment', () => {

    it('No countersigning required', () => {

        // Create an offender with minimally complete layer 3.2
        await oasys.login(oasys.users.probSanHeadPdu)
        const offender1 = await offender.createProbFromStandardOffender()


        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
        await sections.offendingInformation.goto()
        await sections.offendingInformation.count.setValue(1)
        await sections.offendingInformation.offenceDate.setValue({ months: -6 })

        await sections.predictors.goto(true)
        await sections.predictors.dateFirstSanction.setValue({ years: -2 })
        await sections.predictors.o1_32.setValue(2)
        await sections.predictors.o1_40.setValue(0)
        await sections.predictors.o1_29.setValue({ months: -1 })
        await sections.predictors.o1_30.setValue('No')
        await sections.predictors.o1_38.setValue({})

        await san.gotoSan()
        await san.populateSanSections('Example test', oasys.Populate.San.ExampleTest.sanPopulation1)
        await san.returnToOASys()

        await risk.screeningNoRisks(true)

        // Complete SP
        await sentencePlan.populateMinimal()

        // Sign assessment, then check SNS messages
        await signing.signAndLock({ page: 'spService' })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

        // Create another assessment (cloning from the one above), this one with OPD override
        await oasys.history('@offender1')
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

        const summarySheet = new oasys.Pages.Assessment.SummarySheet()
        await assessment.summarySheet.goto().opdOverride.setValue('Yes')
        await assessment.summarySheet.opdOverrideReason.setValue('Testing')

        // Sign assessment, then check SNS messages again
        await signing.signAndLock({ page: 'spService' })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR', 'OPD'])

        await oasys.logout()
    })
})
})
