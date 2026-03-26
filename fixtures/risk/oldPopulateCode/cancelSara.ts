
async cancelSara() {

    await this.goto(true)
        .Sara.ReasonNoSara().goto(true)
    await this.reason.setValue('There was no suitably trained assessor available')
    await this.ok.click()
}