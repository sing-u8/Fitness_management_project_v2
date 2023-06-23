import { Component, Input, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core'
import { Center } from '@schemas/center'

@Component({
    selector: 'rwm-center-list-item',
    templateUrl: './center-list-item.component.html',
    styleUrls: ['./center-list-item.component.scss'],
})
export class CenterListItemComponent implements AfterViewInit, OnChanges {
    @Input() center: Center

    @Input() badgeState:
        | 'normal'
        | 'freeTrialEndToday'
        | 'freeTrialEnd'
        | 'freeTrialEndExpected'
        | 'expirationExpected'
        | 'expired'
        | 'expiredToday' = 'normal' // test용으로 Input으로 설정
    public badgeStateObj = {
        normal: {
            bgColor: '',
            color: '',
            text: '',
        },
        freeTrialEndToday: {
            bgColor: 'var(--state-error-5)',
            color: 'var(--state-error-100)',
            text: '⏱ 오늘 무료 체험이 종료돼요!',
        },
        freeTrialEnd: {
            bgColor: 'var(--gray-50)',
            color: 'var(--font-color)',
            text: '체험 종료',
        },
        freeTrialEndExpected: {
            bgColor: 'var(--state-warning-5)',
            color: 'var(--state-warning-100)',
            text1: '⏱ 만료 ',
            text2: ' 일 전',
            day: 14,
        },
        expirationExpected: {
            bgColor: 'var(--state-warning-5)',
            color: 'var(--state-warning-100)',
            text1: '⏱ 만료 ',
            text2: ' 일 전',
            day: 10,
        },
        expired: {
            bgColor: 'var(--gray-50)',
            color: 'var(--font-color)',
            text: '이용권 만료',
        },
        expiredToday: {
            bgColor: 'var(--state-error-5)',
            color: 'var(--state-error-100)',
            text: '⏱ 오늘 이용권이 만료돼요!',
        },
    }

    @Input() headerState: 'normal' | 'needToBuy' | 'invite' | 'subscribeFailed' | 'expired' | 'freeTrialEnd' = 'normal'
    constructor() {}

    ngOnChanges(changes: SimpleChanges) {}
    ngAfterViewInit() {}
}
