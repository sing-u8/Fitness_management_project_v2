export type PaymentBadgeKey =
    | 'normal'
    | 'freeTrialEndToday'
    | 'freeTrialEnd'
    | 'freeTrialEndExpected'
    | 'expirationExpected'
    | 'expired'
    | 'expiredToday'

export type PaymentBadge = Record<
    PaymentBadgeKey,
    {
        bgColor: string
        color: string
        text?: string
        text1?: string
        text2?: string
        day?: number
    }
>
