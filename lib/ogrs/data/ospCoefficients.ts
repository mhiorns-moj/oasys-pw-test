import { Decimal } from 'decimal.js'

export const ospCoefficients = {

    osp_ddc: {
        OSPCIntercept: new Decimal(-8.633),
        OSPCFactor: new Decimal(0.1598),
        ospFemale: new Decimal(1).div(261),
    },

    osp_iic: {
        OSPIFemale: new Decimal(0),
        OSPINoSanctions: new Decimal(0),
        OSPITwoPlusIIOC: new Decimal(0.1031),
        OSPIOneIIOC: new Decimal(0.03328),
        OSPITwoPlusChildContact: new Decimal(0.00926),
        OSPIOneChildContact: new Decimal(0.00634),
        OSPIOthers: new Decimal(0.00281),
    }
}