import * as oasys from 'oasys'

export function minimal() {

    cy.log('Minimally populating predictors page')
    const page = new oasys.Pages.Assessment.Predictors().goto(true)
    page.dateFirstSanction.setValue({ years: -2 })
    page.o1_32.setValue(2)
    page.o1_40.setValue(0)
}

export function fullyPopulated(params: PopulateAssessmentParams) {

    cy.log(`Fully populating Predictors page, parameters = ${JSON.stringify(params)}`)
    const page = new oasys.Pages.Assessment.Predictors().goto(true)
    page.dateFirstSanction.setValue({ years: -3 })
    page.o1_32.setValue(2)
    page.o1_40.setValue(0)
    page.o1_29.setValue({ months: -6 })
    if (params.r1_30PrePopulated != true) {
        page.o1_30.setValue('Yes')
    }
    if (params.r1_41PrePopulated != true) {
        page.o1_41.setValue('Yes')
    }
    page.o1_44.setValue('Yes')
    page.o1_33.setValue({ months: -6 })
    page.o1_34.setValue(1)
    page.o1_45.setValue(1)
    page.o1_46.setValue(1)
    page.o1_38.setValue({ months: -1 })
    page.o1_37.setValue(1)
    if (params.provider != 'pris') {
        page.o1_43.setValue({ days: -5 })
    }
}