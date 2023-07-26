export type InfoState =
    | 'normal'
    | 'freeTrialEndExpected'
    | 'freeTrialEndToday'
    | 'expirationExpected'
    | 'expiredToday'
    | 'subEndExpected'
    | 'subEndToday'
export interface CenterProductInfo {
    title: string
    desc?: string
    bgColor: string
    borderColor: string
    btText: string
    btFn: () => void
    day?: number
}
