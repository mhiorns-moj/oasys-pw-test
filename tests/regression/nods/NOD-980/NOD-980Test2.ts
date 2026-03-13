import * as oasys from 'lib'

describe('NOD-980: Test for RA cloning 2', () => {


    it('RoSHA with 1.39 = YES -> RoSHA', () => {

        oasys.login(oasys.Users.probHeadPdu)
        oasys.Offender.createProb(oasys.OffenderLib.Probation.Male.burglary, 'offender1')
        cy.get<OffenderDef>('@offender1').then((offender) => {

            // First RoSHA
            oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

            oasys.Db.getLatestSetPk('@offender1', 'pk')
            cy.get<number>('@pk').then((pk) => {
                oasys.Db.checkAnswers(pk, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], 'failed', true)
                cy.get<boolean>('@failed').then((failed) => {
                    expect(failed).equal(false)
                })

                oasys.Populate.fullyPopulated({ layer: 'Layer 1V2' })
                oasys.Db.checkAnswers(pk, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'YES' }], 'failed', true)
                cy.get<boolean>('@failed').then((failed) => {
                    expect(failed).equal(false)
                })
                oasys.Assessment.signAndLock({ page: oasys.Pages.Rosh.RiskManagementPlan, expectRsrScore: true })
                oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

                // Second RoSHA
                oasys.Nav.history(offender)
                oasys.Assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
                oasys.Db.getLatestSetPk('@offender1', 'pk')
                cy.get<number>('@pk').then((pk) => {
                    oasys.Db.checkAnswers(pk, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], 'failed', true)
                    cy.get<boolean>('@failed').then((failed) => {
                        expect(failed).equal(false)
                    })
                    oasys.Assessment.signAndLock({ page: oasys.Pages.Rosh.RiskManagementPlan, expectRsrScore: true })

                    oasys.Db.checkAnswers(pk, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], 'failed', true)
                    cy.get<boolean>('@failed').then((failed) => {
                        expect(failed).equal(false)
                    })
                    oasys.Sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])
                })
            })


        })

    })

})