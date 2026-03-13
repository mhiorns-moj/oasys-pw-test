import * as oasys from 'lib'

describe('This is a sample test', () => {

    beforeEach(() => {
        /**
         * Standard startup-tasks - launch OASys, and grab the current app version in an alias called '@appVersion'
         * Launch page is determined by the environment selected in localSettings.ts
         */
    })


    it('Create a probation offender, then create and complete an assessment', () => {

        let offender1 = oasys.OffenderLib.Probation.Male.burglary

        oasys.login(oasys.Users.probHeadPdu)

        oasys.Offender.createProb(offender1, 'offender1')

        oasys.Assessment.createProb({
            purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)'
        })

        oasys.Populate.CommonPages.OffendingInformation.minimal()

        oasys.Populate.Layer3Pages.Predictors.minimal()
        oasys.Populate.sections2To13NoIssues()
        oasys.Populate.CommonPages.SelfAssessmentForm.minimal()

        oasys.Populate.Rosh.screeningNoRisks()

        new oasys.Pages.SentencePlan.IspSection52to8().goto().agreeWithPlan.setValue('Yes')
        oasys.Assessment.signAndLock({ expectRsrWarning: true })

        oasys.Nav.history()

        new oasys.Pages.Assessment.Predictors()
            .goto()
            .checkValues({
                oneYearScore: '19',
                twoYearScore: '33',
            })

        oasys.logout()
    })

    it('Create a prison offender, then create an assessment', () => {
        oasys.login(oasys.Users.prisHomds)
        oasys.Offender.createPris(oasys.OffenderLib.Prison.Male.burglary, 'prisonOffender1')

        oasys.Assessment.createPris({
            purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)'
        })

        new oasys.Pages.Assessment.OffenderInformation().logValuesAndStatuses()
        oasys.logout()
    })
})