import { ProductCode } from '@schemas/payment/product-code'
import { BasePaymentItem } from '@schemas/base-payment-item'

export interface PaymentHistoryItem extends BasePaymentItem {
    // merchant_uid: string
    // product_code: ProductCode
    // product_price: number
    // start_date: string // YYYY-MM-DD
    // end_date: string
    // currency: string
    // amount: number
    // card_name: string
    // card_number: string

    sms_point: number
    status: 'paid' | 'cancelled'
    paid_at: string // YYYY-MM-DD HH:mm:ss
    receipt_url: string
    cancelled_at: string
    cancel_amount: number
}
