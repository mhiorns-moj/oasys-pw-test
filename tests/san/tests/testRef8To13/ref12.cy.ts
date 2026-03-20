import * as oasys from 'oasys'

describe('SAN integration - test ref 12', () => {

    it('Test ref 12 - Another 3.1 assessment in non-pilot area', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender').then((offenderData) => {

            const offender = JSON.parse(offenderData as string)


            cy.log(`Log in as an Assessor from a Non-Pilot probation area
                    Find the offender used in Test Ref 11 - last assessment is a fully completed 3.1 OASys 
                    Create a new 3.1 OASys 'Review' assessment.`)

            oasys.login(oasys.Users.probHeadPdu)

            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            oasys.Assessment.createProb({ purposeOfAssessment: 'Review' })

            cy.log(`It does NOT call for any SAN data.
                    Check the OASYS_SET record; field CLONED_FROM_PREV_OASYS_SAN_PK has been set to the PK of of the last OASys-SAN assessment,
                    fields SAN_ASSESSMENT_LINKED_IND, LASTUPD_FROM_SAN and SAN_ASSESSMENT_VERSION_NO are all NULL.
                    NOTE: the field CLONED_FROM_PREV_OASYS_SAN_PK is kept in the 3.1 assessment so that during the period of supervision continuity is kept with the living SAN assessment,
                    just in case the next assessment they carry out is a 3.2. 
                    Change some of the data and fully complete the 3.1 assessment.`)

            oasys.Db.getAllSetPksByPnc(offender.pnc, 'pks')
            cy.get<number[]>('@pks').then((pks) => {
                const pk = pks[0]
                const prevSanPk = pks[2]
                oasys.San.checkNoSanCall(pk)

                oasys.Db.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
                    SAN_ASSESSMENT_LINKED_IND: null,
                    CLONED_FROM_PREV_OASYS_SAN_PK: prevSanPk.toString(),
                    SAN_ASSESSMENT_VERSION_NO: null,
                    LASTUPD_FROM_SAN: null,
                })

                const section2 = new oasys.Pages.Assessment.Section2().goto()
                section2.o2_2Weapon.setValue('Yes')
                section2.o2_2SpecifyWeapon.setValue('A big knife')
                section2.o2_2Violence.setValue('Yes')
                section2.o2_2ExcessiveViolence.setValue('Yes')
                section2.o2_2Sexual.setValue('Yes')
                section2.o2_2DomesticAbuse.setValue('Yes')
                section2.o2_3Direct.setValue(true)
                section2.o2_3Hate.setValue(true)

                const section3 = new oasys.Pages.Assessment.Section3().goto()
                section3.o3_3.setValue('Yes')
                section3.o3_4.setValue('2-Significant problems')
                section3.o3_5.setValue('2-Significant problems')
                section3.o3_6.setValue('2-Significant problems')
                section3.save.click()

                const section4 = new oasys.Pages.Assessment.Section4().goto()
                section4.o4_2.setValue('2 - Yes')
                section4.o4_3.setValue('2-Significant problems')
                section4.o4_4.setValue('2-Significant problems')
                section4.o4_5.setValue('2-Significant problems')
                section4.o4_6.setValue('2-Significant problems')
                section4.o4_7.setValue('2-Significant problems')
                section4.save.click()

                const section5 = new oasys.Pages.Assessment.Section5().goto()
                section5.o5_2.setValue('2-Significant problems')
                section5.o5_3.setValue('2-Significant problems')
                section5.o5_4.setValue('2-Significant problems')
                section5.o5_5.setValue('2-Significant problems')
                section5.o5_6.setValue('2-Significant problems')

                const section6 = new oasys.Pages.Assessment.Section6().goto()
                section6.o6_1.setValue('2-Significant problems')
                section6.o6_3.setValue('2-Significant problems')
                section6.o6_7VictimPartner.setValue('Yes')
                section6.o6_7VictimFamily.setValue('Yes')
                section6.o6_7PerpetratorPartner.setValue('Yes')
                section6.o6_7PerpetratorFamily.setValue('Yes')
                section6.o6_8.setValue('Not in a relationship')
                section6.o6_4.setValue('2-Significant problems')
                section6.o6_6.setValue('2-Significant problems')

                const section7 = new oasys.Pages.Assessment.Section7().goto()
                section7.o7_1.setValue('2-Significant problems')
                section7.o7_2.setValue('2-Significant problems')
                section7.o7_3.setValue('2-Significant problems')
                section7.o7_4.setValue('2-Significant problems')
                section7.o7_5.setValue('2-Significant problems')
                section7.save.click()

                const section9 = new oasys.Pages.Assessment.Section9().goto()
                section9.o9_1.setValue('2-Significant problems')
                section9.o9_1Details.setValue('9.1 Details')
                section9.o9_2.setValue('2-Significant problems')
                section9.o9_3.setValue('2-Significant problems')
                section9.o9_4.setValue('Yes')
                section9.o9_5.setValue('2-Significant problems')
                section9.save.click()

                const section10 = new oasys.Pages.Assessment.Section10().goto()
                section10.o10_1.setValue('2-Significant problems')
                section10.o10_2.setValue('2-Significant problems')
                section10.o10_3.setValue('2-Significant problems')
                section10.o10_4.setValue('2-Significant problems')
                section10.o10_5.setValue('Yes - 2')
                section10.o10_6.setValue('2-Significant problems')
                section10.o10_7Childhood.setValue('Yes')
                section10.o10_7HeadInjuries.setValue('Yes')
                section10.o10_7Psychiatric.setValue('Yes')

                const section11 = new oasys.Pages.Assessment.Section11().goto()
                section11.o11_1.setValue('2-Significant problems')
                section11.o11_2.setValue('2-Significant problems')
                section11.o11_3.setValue('2-Significant problems')
                section11.o11_4.setValue('2-Significant problems')
                section11.o11_5.setValue('2-Significant problems')
                section11.o11_6.setValue('2-Significant problems')
                section11.o11_7.setValue('2-Significant problems')
                section11.o11_8.setValue('2-Significant problems')
                section11.o11_9.setValue('2-Significant problems')
                section11.o11_10.setValue('2-Significant problems')
                section11.o11_11.setValue('2-Significant problems')
                section11.o11_12.setValue('2-Significant problems')
                section11.save.click()

                const section12 = new oasys.Pages.Assessment.Section12().goto()
                section12.o12_1.setValue('2-Significant problems')
                section12.o12_3.setValue('2-Significant problems')
                section12.o12_4.setValue('2-Significant problems')
                section12.o12_5.setValue('2-Significant problems')
                section12.o12_6.setValue('2-Significant problems')
                section12.o12_8.setValue('2-Not at all')
                section12.o12_9.setValue('2-Significant problems')
                section12.save.click()

                const rosh2 = new oasys.Pages.Rosh.RoshScreeningSection2to4().goto()
                rosh2.r2_3.setValue('No')
                rosh2.rationale.setValue('Some reason')
                rosh2.save.click()
                new oasys.Pages.Sara.CreateSara().cancel.click()
                const sara = new oasys.Pages.Sara.ReasonNoSara()
                sara.reason.setValue('There was no suitably trained assessor available')
                sara.ok.click()

                oasys.Assessment.signAndLock({ page: oasys.Pages.SentencePlan.RspSection1to2 })
                oasys.logout()
            })

        })
    })
})