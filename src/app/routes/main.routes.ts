import { Route } from '@angular/router'
import { MainComponent } from '@feature/pages/main/frame/main.component'
import { importProvidersFrom } from '@angular/core'

import _ from 'lodash'

import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'

import { salesReducer } from '@store/main/reducers/sales.reducer'

import { SalesEffect } from '@store/main/effects/sales.effect'

import { FeatureKey as MainFeatureKey } from '@store/main/selectors/main.selector'
import { FeatureKey as SalesFeatureKey } from '@store/main/selectors/sales.selector'

export const MainRoutes = [
    {
        path: '',
        component: MainComponent,
        providers: [
            importProvidersFrom(
                StoreModule.forFeature(MainFeatureKey, {
                    [SalesFeatureKey]: salesReducer,
                })
            ),
            importProvidersFrom(EffectsModule.forFeature([SalesEffect])),
        ],
        children: [
            {
                path: '',
                redirectTo: 'member-management',
                pathMatch: 'full',
            },
            {
                path: 'member-management',
                loadComponent: () =>
                    import('../feature/pages/main/member-management/member-management.component').then(
                        (m) => m.MemberManagementComponent
                    ),
            },
            {
                path: 'sales',
                loadComponent: () =>
                    import('../feature/pages/main/sales/sales.component').then((m) => m.SalesComponent),
            },
            {
                path: 'schedule',
                loadComponent: () =>
                    import('../feature/pages/main/schedule/schedule.component').then((m) => m.ScheduleComponent),
            },
            {
                path: 'chatting',
                loadComponent: () =>
                    import('../feature/pages/main/chatting/chatting.component').then((m) => m.ChattingComponent),
            },
            {
                path: 'sms/general-transmit',
                loadComponent: () =>
                    import('../feature/pages/main/sms-general-transmit/sms-general-transmit.component').then(
                        (m) => m.SmsGeneralTransmitComponent
                    ),
            },
            {
                path: 'sms/auto-transmit',
                loadComponent: () =>
                    import('../feature/pages/main/sms-auto-transmit/sms-auto-transmit.component').then(
                        (m) => m.SmsAutoTransmitComponent
                    ),
            },
            {
                path: 'sms/transmit-history',
                loadComponent: () =>
                    import('../feature/pages/main/sms-transmit-history/sms-transmit-history.component').then(
                        (m) => m.SmsTransmitHistoryComponent
                    ),
            },
            {
                path: 'product/membership',
                loadComponent: () =>
                    import('../feature/pages/main/product-membership/product-membership.component').then(
                        (m) => m.ProductMembershipComponent
                    ),
            },
            {
                path: 'product/locker',
                loadComponent: () =>
                    import('../feature/pages/main/product-locker/product-locker.component').then(
                        (m) => m.ProductLockerComponent
                    ),
            },
            {
                path: 'product/sportswear',
                loadComponent: () =>
                    import('../feature/pages/main/product-sportswear/product-sportswear.component').then(
                        (m) => m.ProductSportswearComponent
                    ),
            },
            {
                path: 'lesson',
                loadComponent: () =>
                    import('../feature/pages/main/lesson/lesson.component').then((m) => m.LessonComponent),
            },
            {
                path: 'notice/attendance',
                loadComponent: () =>
                    import('../feature/pages/main/notice-attendance/notice-attendance.component').then(
                        (m) => m.NoticeAttendanceComponent
                    ),
            },
            {
                path: 'notice/redwhale-app',
                loadComponent: () =>
                    import('../feature/pages/main/notice-redwhale-app/notice-redwhale-app.component').then(
                        (m) => m.NoticeRedwhaleAppComponent
                    ),
            },
        ],
    },
] as Route[]

export type MainPath =
    | 'member-management'
    | 'sales'
    | 'schedule'
    | 'chatting'
    | 'general-transmit'
    | 'auto-transmit'
    | 'transmit-history'
    | 'membership'
    | 'locker'
    | 'sportswear'
    | 'lesson'
export const matchRoute = (url: string) => {
    if (_.includes(url, 'member-management')) {
        return '회원관리'
    } else if (_.includes(url, 'sales')) {
        return '매출'
    } else if (_.includes(url, 'schedule')) {
        return '스케줄'
    } else if (_.includes(url, 'chatting')) {
        return '채팅'
    } else if (_.includes(url, 'general-transmit')) {
        return '일반 전송'
    } else if (_.includes(url, 'auto-transmit')) {
        return '자동 전송'
    } else if (_.includes(url, 'transmit-history')) {
        return '전송 내역'
    } else if (_.includes(url, 'membership')) {
        return '회원권'
    } else if (_.includes(url, 'locker')) {
        return '락커'
    } else if (_.includes(url, 'sportswear')) {
        return '운동복'
    } else if (_.includes(url, 'lesson')) {
        return '수업'
    } else {
        return ''
    }
}
