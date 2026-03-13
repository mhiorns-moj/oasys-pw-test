declare type ArnsSpScript = 'populateMinimal' | 'openAndReturn' | 'checkReadOnly' | 'checkZeroGoals' | 'populateTwoGoals'

declare type ArnsSpParams = {
    username: string,
    password: string,
    provider: string,
    script: ArnsSpScript,
    readonly: boolean,
    openFromOffender: boolean,
}