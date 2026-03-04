import * as populate from './'

export function minimal(params: PopulateAssessmentParams) {

    if (params.layer != 'Layer 1V2') {
        populate.CommonPages.OffendingInformation.minimal()
    }

    switch (params.layer) {
        case 'Layer 1':
            populate.Layer1Pages.Predictors.minimal()
            populate.Layer1Pages.Section2.minimal()
            break
        case 'Layer 1V2':
            populate.RoshaPages.RoshaPredictors.minimal()
            break
        case 'Layer 3':
            populate.Layer3Pages.Predictors.minimal()
            sections2To13NoIssues(params)
            break
    }

    if (params.layer != 'Layer 1V2') {
        populate.CommonPages.SelfAssessmentForm.minimal()
    }

    populate.Rosh.screeningNoRisks()

    if (params.newSp) {
        populate.San.NewSpService.minimal()
    } else if (params.layer == 'Layer 3') {
        if (params.sentencePlan == 'Review') {
            populate.SentencePlanPages.RspSection72to10.minimal()
        } else {
            populate.SentencePlanPages.IspSection52to8.minimal()
        }
    }

    cy.log(`Minimally populated assessment: ${JSON.stringify(params)}`)
}


export function fullyPopulated(params: PopulateAssessmentParams) {

    if (params.layer != 'Layer 1V2') {
        populate.CommonPages.OffendingInformation.fullyPopulated(params)
    }

    switch (params.layer) {
        case 'Layer 1':
            populate.Layer1Pages.Predictors.minimal()
            populate.Layer1Pages.Section2.fullyPopulated(params.maxStrings)
            break
        case 'Layer 1V2':
            populate.RoshaPages.RoshaPredictors.fullyPopulated()
            break
        case 'Layer 3':
            populate.Layer3Pages.Predictors.fullyPopulated(params)
            sections2To13FullyPopulated(params)
            break
    }

    if (params.layer != 'Layer 1V2') {
        populate.CommonPages.SelfAssessmentForm.fullyPopulated(params.maxStrings)
    }

    populate.Rosh.screeningFullyPopulated(params)
    populate.Rosh.fullAnalysisFullyPopulated(params)

    switch (params.layer) {
        case 'Layer 1':
            // TODO
            break
        case 'Layer 1V2':
            break
        case 'Layer 3':
            if (params.sentencePlan == 'Review') {
                rspFullyPopulated(params)
            } else {
                ispFullyPopulated(params)
            }
            break
    }

    cy.log(`Fully populated assessment: ${JSON.stringify(params)}`)
}

export function sections2To13NoIssues(params?: PopulateAssessmentParams) {

    populate.Layer3Pages.Section2.noIssues()
    populate.Layer3Pages.Section3.noIssues()
    populate.Layer3Pages.Section4.noIssues()
    populate.Layer3Pages.Section5.noIssues()
    populate.Layer3Pages.Section6.noIssues(params?.populate6_11)
    populate.Layer3Pages.Section7.noIssues()
    populate.Layer3Pages.Section8.noIssues()
    populate.Layer3Pages.Section9.noIssues()
    populate.Layer3Pages.Section10.noIssues()
    populate.Layer3Pages.Section11.noIssues()
    populate.Layer3Pages.Section12.noIssues()
}

export function sections2To13FullyPopulated(params: PopulateAssessmentParams) {

    populate.Layer3Pages.Section2.fullyPopulated(params.maxStrings)
    populate.Layer3Pages.Section3.fullyPopulated(params.maxStrings)
    populate.Layer3Pages.Section4.fullyPopulated(params)
    populate.Layer3Pages.Section5.fullyPopulated(params.maxStrings)
    populate.Layer3Pages.Section6.fullyPopulated(params.maxStrings)
    populate.Layer3Pages.Section7.fullyPopulated(params.maxStrings)
    populate.Layer3Pages.Section8.fullyPopulated(params.maxStrings)
    populate.Layer3Pages.Section9.fullyPopulated(params.maxStrings)
    populate.Layer3Pages.Section10.fullyPopulated(params.maxStrings)
    populate.Layer3Pages.Section11.fullyPopulated(params.maxStrings)
    populate.Layer3Pages.Section12.fullyPopulated(params.maxStrings)
    populate.Layer3Pages.Section13.fullyPopulated(params.maxStrings)
}

export function ispFullyPopulated(params: PopulateAssessmentParams) {

    populate.SentencePlanPages.IspSection1to4.fullyPopulated(params.maxStrings)
    populate.SentencePlanPages.IspSection5.fullyPopulated(params.maxStrings)
    populate.SentencePlanPages.IspSection52to8.fullyPopulated(params.maxStrings)
}

export function rspFullyPopulated(params: PopulateAssessmentParams) {

    populate.SentencePlanPages.RspSection1to2.fullyPopulated(params.maxStrings)
    populate.SentencePlanPages.RspSection3to63.fullyPopulated(params.maxStrings)
    populate.SentencePlanPages.RspSection7.fullyPopulated(params.maxStrings)
    populate.SentencePlanPages.RspSection72to10.fullyPopulated(params.maxStrings)
    // Transfer page TODO
}
