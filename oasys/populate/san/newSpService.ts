import { User } from 'classes/user'
import * as oasys from 'oasys'


export function minimal(user: User) {

    oasys.logout()
    cy.task('newSp1', { username: user.username })
    oasys.login(user)
    oasys.Nav.history()
}
