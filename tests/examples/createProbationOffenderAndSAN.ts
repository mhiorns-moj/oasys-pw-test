import * as oasys from 'oasys'

describe('Example test - create a probation offender and a SAN 3.2 assessment', () => {

    it('Create offender and assessment', () => {

        oasys.login(oasys.Users.probSanHeadPdu)

        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        oasys.Assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

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
        predictors.o1_40.setValue(2)
        predictors.o1_29.setValue({ months: -1 })
        predictors.o1_30.setValue('No')
        predictors.o1_38.setValue({})

        oasys.San.gotoSan()
        oasys.San.populateSanSections('Example test', oasys.Populate.San.ExampleTest.sanPopulation1)
        oasys.San.returnToOASys()

        oasys.Populate.Rosh.screeningNoRisks(true)

        // Complete SP, then sign and lock
        oasys.Populate.San.NewSpService.minimal(oasys.Users.probSanHeadPdu)

        oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.SentencePlanService })
        oasys.logout()
    })
})

