declare type ArnsSpScript = 'populateMinimal' | 'openAndReturn' | 'checkReadOnly' | 'checkZeroGoals' | 'populateTwoGoals' | 'addGoal' | 'checkGoalCount'

declare type ArnsSpParams = {
    username: string,
    password: string,
    provider: string,
    script: ArnsSpScript,
    readonly: boolean,
    openFromOffender: boolean,
    currentGoals?: number,
    futureGoals?: number,
}