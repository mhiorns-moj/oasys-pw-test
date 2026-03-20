import * as common from './common'
import * as dbClasses from './dbClasses'

export class OGRS {

    ogrs31Year: number
    ogrs32Year: number
    ogrs3RiskRecon: string

    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.ogrs31Year = dbRiskDetails.ogrs31Year
        this.ogrs32Year = dbRiskDetails.ogrs32Year
        this.ogrs3RiskRecon = common.riskLabel(dbRiskDetails.ogrs3RiskRecon)
    }
}

export class OGP {

    ogpStWesc: number
    ogpDyWesc: number
    ogpTotWesc: number
    ogp1Year: number
    ogp2Year: number
    ogpRisk: string

    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.ogpStWesc = dbRiskDetails.ogpStWesc
        this.ogpDyWesc = dbRiskDetails.ogpDyWesc
        this.ogpTotWesc = dbRiskDetails.ogpTotWesc
        this.ogp1Year = dbRiskDetails.ogp1Year
        this.ogp2Year = dbRiskDetails.ogp2Year
        this.ogpRisk = common.riskLabel(dbRiskDetails.ogpRisk)
    }
}

export class OVP {

    ovpStWesc: number
    ovpDyWesc: number
    ovpTotWesc: number
    ovp1Year: number
    ovp2Year: number
    ovpRisk: string
    ovpPrevWesc: number
    ovpNonVioWesc: number
    ovpAgeWesc: number
    ovpVioWesc: number
    ovpSexWesc: number

    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.ovpStWesc = dbRiskDetails.ovpStWesc
        this.ovpDyWesc = dbRiskDetails.ovpDyWesc
        this.ovpTotWesc = dbRiskDetails.ovpTotWesc
        this.ovp1Year = dbRiskDetails.ovp1Year
        this.ovp2Year = dbRiskDetails.ovp2Year
        this.ovpRisk = common.riskLabel(dbRiskDetails.ovpRisk)
        this.ovpPrevWesc = dbRiskDetails.ovpPrevWesc
        this.ovpNonVioWesc = dbRiskDetails.ovpNonVioWesc
        this.ovpAgeWesc = dbRiskDetails.ovpAgeWesc
        this.ovpVioWesc = dbRiskDetails.ovpVioWesc
        this.ovpSexWesc = dbRiskDetails.ovpSexWesc
    }
}

export class RSR {

    rsrStaticOrDynamic: string
    rsrExceptionError: string
    rsrAlgorithmVersion: number
    rsrPercentageScore: number
    scoreLevel: string

    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.rsrStaticOrDynamic = dbRiskDetails.rsrStaticOrDynamic
        this.rsrExceptionError = dbRiskDetails.rsrExceptionError
        this.rsrAlgorithmVersion = dbRiskDetails.rsrAlgorithmVersion
        this.rsrPercentageScore = common.fixDp(dbRiskDetails.rsrPercentageScore)
        this.scoreLevel = common.riskLabel(dbRiskDetails.rsrRisk)
    }
}

export class OSP {

    ospImagePercentageScore: number
    ospContactPercentageScore: number
    ospImageScoreLevel: string
    ospContactScoreLevel: string

    ospIndirectImagesChildrenScoreLevel: string
    ospIndirectImagesChildrenPercentageScore: number
    ospDirectContactScoreLevel: string
    ospDirectContactPercentageScore: number
    ospDirectContactRiskReduction: string


    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.ospImagePercentageScore = common.fixDp(dbRiskDetails.ospImagePercentageScore)
        this.ospContactPercentageScore = common.fixDp(dbRiskDetails.ospContactPercentageScore)
        this.ospImageScoreLevel = common.riskLabel(dbRiskDetails.ospIRisk)
        this.ospContactScoreLevel = common.riskLabel(dbRiskDetails.ospCRisk)

        this.ospIndirectImagesChildrenScoreLevel = common.riskLabel(dbRiskDetails.ospIicRisk)
        this.ospIndirectImagesChildrenPercentageScore = common.fixDp(dbRiskDetails.ospIicPercentageScore)
        this.ospDirectContactScoreLevel = common.riskLabel(dbRiskDetails.ospDcRisk)
        this.ospDirectContactPercentageScore = common.fixDp(dbRiskDetails.ospDcPercentageScore)
        this.ospDirectContactRiskReduction = dbRiskDetails.ospCRiskReduction
    }
}

export class NewActuarialPredictors {

    ogrs4gYr2: number
    ogrs4gBand: string
    ogrs4gCalculated: string
    ogrs4vYr2: number
    ogrs4vBand: string
    ogrs4vCalculated: string
    ogp2Yr2: number
    ogp2Band: string
    ogp2Calculated: string
    ovp2Yr2: number
    ovp2Band: string
    ovp2Calculated: string

    snsvStaticYr2: number
    snsvStaticYr2Band: string
    snsvStaticCalculated: string
    snsvDynamicYr2: number
    snsvDynamicYr2Band: string
    snsvDynamicCalculated: string

    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.ogrs4gYr2 = dbRiskDetails.ogrs4gPercentageScore
        this.ogrs4gBand = common.riskLabel(dbRiskDetails.ogrs4gRisk)
        this.ogrs4gCalculated = dbRiskDetails.ogrs4gCalculated
        this.ogrs4vYr2 = dbRiskDetails.ogrs4vPercentageScore
        this.ogrs4vBand = common.riskLabel(dbRiskDetails.ogrs4vRisk)
        this.ogrs4vCalculated = dbRiskDetails.ogrs4vCalculated
        this.ogp2Yr2 = dbRiskDetails.ogp2PercentageScore
        this.ogp2Band = common.riskLabel(dbRiskDetails.ogp2Risk)
        this.ogp2Calculated = dbRiskDetails.ogp2Calculated
        this.ovp2Yr2 = dbRiskDetails.ovp2PercentageScore
        this.ovp2Band = common.riskLabel(dbRiskDetails.ovp2Risk)
        this.ovp2Calculated = dbRiskDetails.ovp2Calculated

        this.snsvStaticYr2 = dbRiskDetails.snsvStaticPercentageScore
        this.snsvStaticYr2Band = common.riskLabel(dbRiskDetails.snsvStaticRisk)
        this.snsvStaticCalculated = dbRiskDetails.snsvStaticCalculated
        this.snsvDynamicYr2 = dbRiskDetails.snsvDynamicPercentageScore
        this.snsvDynamicYr2Band = common.riskLabel(dbRiskDetails.snsvDynamicRisk)
        this.snsvDynamicCalculated = dbRiskDetails.snsvDynamicCalculated
    }

}
