import { ProductCode } from '@schemas/payment/product-code'
import { Promotion } from '@schemas/payment/promotion'

export type PaymentItem = {
    top: {
        title: string
        desc: string
    }
    middle: {
        discountText: string
        originalPrice: string
        price: string
        discountRate?: number // ex) 0.15 ( 15% )
        desc: string
    }
    bottom: { left: string; right: string }[]
    highlight?: string
    type?: ProductCode
    count?: number
    selected?: boolean
}

export type PaymentItemInfo = {
    itemInfo: PaymentItemInfoProp
    period: PaymentItemInfoPeriodProp
    promotions: Array<Promotion>
}
export type PaymentItemInfoProp = {
    title: string
    originalPrice: number
    price: number
    discountRate: number
    productCode: ProductCode
}
export type PaymentItemInfoPeriodProp = {
    startDate: string
    endDate: string
    dateStr: string
}
