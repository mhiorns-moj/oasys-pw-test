
describe('NOD-980: Test for RA cloning 2', () => {


    it('RoSHA with 1.39 = YES -> RoSHA', () => {

        await oasys.login(oasys.users.probHeadPdu)
        const offender1 = await offender.createProbFromStandardOffender()


        // First RoSHA
        await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

        await oasysDb.getLatestSetPk('@offender1', 'pk')
        cy.get<number>('@pk').then((pk) => {
            const failed = await assessment.queries.checkAnswers(pk, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], 'failed', true)
            cy.get<boolean>('@failed').then((failed) => {
                expect(failed).equal(false)
            })

            oasys.Populate.fullyPopulated({ layer: 'Layer 1V2' })
            const failed = await assessment.queries.checkAnswers(pk, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'YES' }], 'failed', true)
            cy.get<boolean>('@failed').then((failed) => {
                expect(failed).equal(false)
            })
            await signing.signAndLock({ page: oasys.Pages.Rosh.RiskManagementPlan, expectRsrScore: true })
            await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

            // Second RoSHA
            await oasys.history(offender1)
            await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
            await oasysDb.getLatestSetPk('@offender1', 'pk')
            cy.get<number>('@pk').then((pk) => {
                const failed = await assessment.queries.checkAnswers(pk, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], 'failed', true)
                cy.get<boolean>('@failed').then((failed) => {
                    expect(failed).equal(false)
                })
                await signing.signAndLock({ page: oasys.Pages.Rosh.RiskManagementPlan, expectRsrScore: true })

                const failed = await assessment.queries.checkAnswers(pk, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], 'failed', true)
                cy.get<boolean>('@failed').then((failed) => {
                    expect(failed).equal(false)
                })
                await sns.testSnsMessageData(offender.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])
            })
        })


    })

})

})