
async noRisks(withRationale: boolean = false) {

    await this.goto(true)
        .Rosh.RoshScreeningSection2to4().goto(true)
    await this.r2_3.setValue('No')
    if (withRationale) {
        await this.rationale.setValue('R2.3 rationale text')
    }
    await this.r3_1.setValue('No')
    await this.r3_2.setValue('No')
    await this.r3_3.setValue('No')
    await this.r3_4.setValue('No')
    await this.r4_1.setValue('No')
    await this.r4_6.setValue('No')
    await this.r4_4.setValue('No')
}

async populateFull() {

    await this.goto(true)
        .Rosh.RoshScreeningSection2to4().goto(true)
    await this.r2_3.setValue('Yes')
    await this.r2_4_1.setValue('Yes')
    await this.r2_4_2.setValue('Yes')
    await this.r3_1.setValue('Yes')
    await this.r3_2.setValue('Yes')
    await this.r3_3.setValue('Yes')
    await this.r3_4.setValue('Yes')
    await this.r4_1.setValue('Yes')
    await this.r4_6.setValue('Yes')
    await this.r4_4.setValue('Yes')
}