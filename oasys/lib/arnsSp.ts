import * as oasys from 'oasys'

export function runScript(script: ArnsSpScript, additionalParams?: {
    readonly?: boolean, openFromOffender?: boolean, username?: string, password?: string, provider?: string, currentGoals?: number, futureGoals?: number
}) {

    // Grab the current login details (or as specified) and log out from the Cypress session
    const username = additionalParams?.username ?? oasys.currentUserName
    const password = additionalParams?.password ?? oasys.currentPassword
    const provider = additionalParams?.provider ?? oasys.currentProvider
    oasys.logout()

    const params: ArnsSpParams = {
        username: username,
        password: password,
        provider: provider,
        script: script,
        readonly: additionalParams?.readonly,
        openFromOffender: additionalParams?.openFromOffender,
        currentGoals: additionalParams?.currentGoals,
        futureGoals: additionalParams?.futureGoals,
    }

    // Run the arnsSpScript in Playwright, returns null if passed or an error message
    cy.task('runArnsSpScript', params).then((result: boolean) => {
        if (result) {
            throw new Error(`Error running ARNS Sentence Plan script ${script}: ${result}`)
        }
    })

    // Log in again and return to the same page in the assessment
    oasys.login(username, password, provider)
    oasys.Nav.history()
    if (!additionalParams?.openFromOffender) {
        new oasys.Pages.SentencePlan.SentencePlanService().goto()
    }
    cy.log(`Ran ARNS Sentence Plan script: ${script}`)

}
