export class CheckboxGroup<T extends string> {

    selector: string
    options: (T | '-')[]
    conditionalDisplay: boolean

    constructor(selector: string, options: (T | '-')[], conditionalDisplay: boolean = false) {

        this.selector = selector
        this.options = options
        this.conditionalDisplay = conditionalDisplay
    }

    setValue(values: T[]) {

        for (let i = 0; i < this.options.length; i++) {
            const itemSuffix = i == 0 ? '' : `-${i + 1}`

            if (this.options[i] != '-') {   // '-' is used as a separator in the list of IDs
                if (values.includes(this.options[i] as T)) {
                    cy.get(`${this.selector}${itemSuffix}`).check()
                } else if (this.conditionalDisplay) {

                    cy.get('#main-content').then((container) => {
                        const checkboxVisible = container.find(`${this.selector}${itemSuffix}:visible`).length == 1
                        if (checkboxVisible) {
                            cy.get(`${this.selector}${itemSuffix}`).uncheck()
                        }
                    })
                } else {
                    cy.get(`${this.selector}${itemSuffix}`).uncheck()
                }
            }
        }
    }

}
