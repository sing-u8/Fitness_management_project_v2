export type PaymentBadgeKey =
    | 'normal'
    | 'freeTrialEndToday'
    | 'freeTrialEnd'
    | 'freeTrialEndExpected'
    | 'notFreeTrial'
    | 'expirationExpected'
    | 'expired'
    | 'expiredToday'
export type PaymentBadgeValue = {
    bgColor: string
    color: string
    text?: string
    text1?: string
    text2?: string
    day?: number
}

export type PaymentBadge = Record<PaymentBadgeKey, PaymentBadgeValue>
