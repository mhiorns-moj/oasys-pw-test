import * as oasys from 'oasys'

export function noRisks() {

    const page = new oasys.Pages.Rosh.RoshScreeningSection1().goto(true)
    page.mark1_2AsNo.click()
    page.mark1_3AsNo.click()
    page.r1_4.setValue('No')
}

export function fullyPopulated(params: PopulateAssessmentParams) {

    const page = new oasys.Pages.Rosh.RoshScreeningSection1().goto(true)
    page.r1_2_1P.setValue('Yes')
    page.r1_2_2P.setValue('Yes')
    page.r1_2_3P.setValue('Yes')
    page.r1_2_4P.setValue('Yes')
    page.r1_2_5P.setValue('Yes')
    page.r1_2_6P.setValue('Yes')
    page.r1_2_7P.setValue('Yes')
    page.r1_2_8P.setValue('Yes')
    page.r1_2_9P.setValue('Yes')
    page.r1_2_10P.setValue('Yes')
    page.r1_2_11P.setValue('Yes')
    page.r1_2_12P.setValue('Yes')
    // page.r1_2_13P.setValue('Yes')   pre-populated by answer above
    page.r1_2_14P.setValue('Yes')
    page.otherOffence.setValue('Another serious offence')
    page.r1_2_16P.setValue('Yes')
    page.r1_3_1.setValue('Yes')
    page.r1_3_2.setValue('Yes')
    if (params.layer != 'Layer 3') {
        page.r1_3_20.setValue('Yes')    // pre-populated in fully popuplated layer 3
    }
    page.r1_3_4.setValue('Yes')
    page.r1_3_6.setValue('Yes')
    page.r1_3_7.setValue('Yes')
    page.r1_3_10.setValue('Yes')
    if (params?.layer == 'Layer 1V2') {
        page.r1_3_12.setValue('Yes')    // pre-populated in fully populated layer 1 and layer 3
    }
    page.r1_3_13.setValue('Yes')
    page.r1_3_15.setValue('Yes')
    page.r1_3_16.setValue('Yes')
    page.r1_3_17.setValue('Yes')
    page.r1_3_21.setValue('Yes')
    page.r1_4.setValue('Yes')
    page.r1_4_1.setValue('Yes')
    page.r1_4_19.setValue('Yes')
    page.r1_4_2.setValue('Yes')
    page.r1_4_3.setValue('Yes')
    page.r1_4_4.setValue('Yes')
    page.r1_4_7.setValue('Yes')
    page.r1_4_8.setValue('Yes')
    page.r1_4_20.setValue('Yes')
    page.r1_4_9.setValue('Yes')
    page.r1_4_21.setValue('Yes')
    page.r1_4_22.setValue('Yes')
    page.r1_4_10.setValue('Yes')
    page.r1_4_11.setValue('Yes')
    page.r1_4_12.setValue('Yes')
    page.r1_4_13.setValue('Yes')
    page.r1_4_14.setValue('Yes')
    page.r1_4_15.setValue('Yes')
    page.r1_4_16.setValue('Yes')
    page.r1_4_17.setValue('Yes')
    page.r1_4_18.setValue('Yes')
}