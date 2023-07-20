import { ProductCode } from '@schemas/payment/product-code'

export interface BasePaymentItem {
    merchant_uid: string
    product_code: ProductCode
    product_price: number
    start_date: string
    end_date: string
    currency: string
    amount: number
    card_name: string
    card_number: string
}
