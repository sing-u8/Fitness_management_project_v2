import { PromotionCode } from '@schemas/payment/promotion'
import { ProductCode } from '@schemas/payment/product-code'

export type PaymentHistoryPromotion = {
    merchant_uid: string
    user_id: string
    center_id: string
    product_code: ProductCode
    promotion_code: PromotionCode
    center_address: null
    created_at: string
    code: string
    title: string
    description: string
    start: string
    end: string
    discount_unit_code: string
    discount: number
    sequence_number: number
    activation: boolean
    select_yn: number
    count: number
}
