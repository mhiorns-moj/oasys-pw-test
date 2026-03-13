import * as oasys from 'oasys'

describe('Create assessments and check SNS messages - SAN assessment', () => {

    it('No countersigning required', () => {

        // Create an offender with minimally complete layer 3.2
        oasys.login(oasys.Users.probSanHeadPdu)
        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            const offendingInformation = new oasys.Pages.Assessment.OffendingInformation().goto()
            offendingInformation.count.setValue(1)
            offendingInformation.offenceDate.setValue({ months: -6 })

            const predictors = new oasys.Pages.Assessment.Predictors().goto(true)
            predictors.dateFirstSanction.setValue({ years: -2 })
            predictors.o1_32.setValue(2)
            predictors.o1_40.setValue(0)
            predictors.o1_29.setValue({ months: -1 })
            predictors.o1_30.setValue('No')
            predictors.o1_38.setValue({})

            oasys.San.gotoSan()
            oasys.San.populateSanSections('Example test', oasys.Populate.San.ExampleTest.sanPopulation1)
            oasys.San.returnToOASys()

            oasys.Populate.Rosh.screeningNoRisks(true)

            // Complete SP
            oasys.ArnsSp.runScript('populateMinimal')

            // Sign assessment, then check SNS messages
            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.SentencePlanService })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

            // Create another assessment (cloning from the one above), this one with OPD override
            oasys.Nav.history('@offender1')
            oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            const summarySheet = new oasys.Pages.Assessment.SummarySheet()
            summarySheet.goto().opdOverride.setValue('Yes')
            summarySheet.opdOverrideReason.setValue('Testing')

            // Sign assessment, then check SNS messages again
            oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.SentencePlanService })
            oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR', 'OPD'])

            oasys.logout()
        })
    })
})
