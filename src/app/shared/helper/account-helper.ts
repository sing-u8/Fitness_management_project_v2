import _ from 'lodash'
import { User } from '@schemas/user'

export function getLinkedAccountStr(str: string) {
    let linkedAccountArray = _.map(_.split(str, ','), _.trim)
    linkedAccountArray = _.map(linkedAccountArray, (v) => {
        if (v == 'google.com') {
            return '구글'
        } else if (v == 'apple.com') {
            return '애플'
        } else if (v == 'kakao.com') {
            return '카카오'
        } else {
            return '레드웨일'
        }
    })
    return _.join(linkedAccountArray, ', ')
}

export function isLinkedAccountExist(str: string) {
    const accountArr = ['google', 'apple', 'kakao']
    return _.some(accountArr, (v) => _.includes(str, v))
}

export function getMarketingStr(user: User) {
    const marketing = {
        sms: user.marketing_sms,
        email: user.marketing_email,
    }
    return `SMS ${user.marketing_sms ? '수신' : '미수신'}, 이메일 ${user.marketing_email ? '수신' : '미수신'}`
}
