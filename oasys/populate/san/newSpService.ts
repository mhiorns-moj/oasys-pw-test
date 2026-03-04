import * as oasys from 'oasys'


export function minimal() {

    const username = oasys.currentUserName
    const password = oasys.currentPassword
    const provider = oasys.currentProvider

    oasys.logout()
    cy.task('newSp1', { username: username, password: password, provider: provider })
    oasys.login(username, password, provider)
    oasys.Nav.history()
    new oasys.Pages.SentencePlan.SentencePlanService().goto()

    cy.log('Completed minimal sentence plan')
}
