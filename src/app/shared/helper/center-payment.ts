import { PaymentItem } from '@schemas/payment/payment-item'
import { PaymentHistoryItem } from '@schemas/payment/payment-history-item'

/**
 *  ProductCategories 상품 카테고리의 'membership' category_code로 상품 조회가 가능하지만,
 *  API 로부터 받은 정보가 웹에서 보여줘여할 정보에 비해 부족하기 때문에
 *  피그마를 토대로 보여줘야할 정보를 담은 변수를 따로 선언했습니다.
 */
export const paymentItemList: PaymentItem[] = [
    {
        top: {
            title: '월 이용권',
            desc: '매월 자동 결제되는 요금제',
        },
        middle: {
            discountText: '런칭 기념 5% 할인 (첫 6개월간)',
            originalPrice: '39,000원',
            price: '37,000원',
            desc: '1개 센터 기준 / 월',
            discountRate: 0.05,
        },
        bottom: [
            { left: '기능 제한', right: '없음' },
            { left: '결제 방식', right: '자동 결제' },
            { left: '상품 금액', right: '37,000원 / 월', origin_right: '39,000원 / 월' },
            { left: '환불 정책', right: '결제일로부터\n' + '7일 내 환불 가능' },
        ],
        type: 'subscription_membership',
        selected: false,
    },
    {
        top: {
            title: '1년 이용권',
            desc: '1년 요금을 선납 결제하는 요금제',
        },
        middle: {
            discountText: '런칭 기념 15% 할인',
            originalPrice: '39,000원',
            price: '33,000원',
            desc: '1개 센터 기준 / 월 (연간 계약)',
            discountRate: 0.15,
        },
        bottom: [
            { left: '기능 제한', right: '없음' },
            { left: '결제 방식', right: '직접 결제 (선납, 할부)' },
            { left: '상품 금액', right: '396,000원 / 1년', origin_right: '468,000원 / 1년' },
            { left: '환불 정책', right: '결제일로부터\n' + '30일 내 환불 가능' },
        ],
        type: '1_years_membership',
        selected: false,
    },
    {
        top: {
            title: '2년 이용권',
            desc: '2년 요금을 선납 결제하는 요금제',
        },
        middle: {
            discountText: '런칭 기념 30% 할인',
            originalPrice: '39,000원',
            price: '27,300원',
            desc: '1개 센터 기준 / 월 (2년간 계약)',
            discountRate: 0.3,
        },
        bottom: [
            { left: '기능 제한', right: '없음' },
            { left: '결제 방식', right: '직접 결제 (선납, 할부)' },
            { left: '상품 금액', right: '655,000원 / 2년', origin_right: '936,000원 / 1년' },
            { left: '환불 정책', right: '결제일로부터\n' + '30일 내 환불 가능' },
        ],
        type: '2_years_membership',
        selected: false,
    },
]

export function getRefundLimit(paymentHistoryItem: PaymentHistoryItem) {
    if (paymentHistoryItem.product_code == 'subscription_membership') {
        return 7
    } else if (
        paymentHistoryItem.product_code == '1_years_membership' ||
        paymentHistoryItem.product_code == '2_years_membership'
    ) {
        return 30
    } else {
        return -1
    }
}
