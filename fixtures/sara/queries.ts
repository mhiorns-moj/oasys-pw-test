import { OasysDb } from '../oasysDb/oasysDb'


export class Queries {

    constructor(readonly oasysDb: OasysDb) { }

    async getSaraPk(assessmentPk: number): Promise<number> {

        const data = await this.oasysDb.getData(`select oasys_set_pk from eor.oasys_set where parent_oasys_set_pk = ${assessmentPk}`)
        const saraPk = Number.parseInt(data[0][0])
        log(`SARA PK: ${saraPk}`)
        return saraPk
    }

}
