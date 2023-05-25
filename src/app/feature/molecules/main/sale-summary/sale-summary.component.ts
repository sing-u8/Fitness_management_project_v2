import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    OnChanges,
    SimpleChanges,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core'
import { StatsSalesSummaryItem } from '@schemas/stats-sales-summary'

import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

import { Subject } from 'rxjs'

import dayjs from 'dayjs'
import _ from 'lodash'
import { detectChangesOn } from '@shared/helper/component-helper'

type SummaryType = 'currentMonth' | 'today'

@Component({
    selector: 'rwm-sale-summary',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './sale-summary.component.html',
    styleUrls: ['./sale-summary.component.scss'],
})
export class SaleSummaryComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @Input() summaryType: SummaryType = 'currentMonth'
    @Input() prevSummary: StatsSalesSummaryItem = {
        card: '',
        cash: '',
        trans: '',
        unpaid: '',
    }
    @Input() curSummary: StatsSalesSummaryItem = {
        card: '',
        cash: '',
        trans: '',
        unpaid: '',
    }
    public summaryKeys = ['card', 'trans', 'cash', 'unpaid']
    public summaryNames = ['카드', '이체', '현금', '미수금']

    public summaryDate = ''
    getSummaryDate() {
        if (this.summaryType == 'currentMonth') {
            const year = dayjs().format('YY년')
            const startDate = dayjs().startOf('month').format('M월 D일')
            const endDate = dayjs().endOf('month').format('M월 D일')
            this.summaryDate = `${year} ${startDate} ~ ${year} ${endDate}`
        } else if (this.summaryType == 'today') {
            this.summaryDate = dayjs().format('YY년 M월 D일 HH:mm 기준')
        }
    }
    public summaryTitle = ''
    getSummaryTitle() {
        if (this.summaryType == 'currentMonth') {
            const month = dayjs().format('M월')
            this.summaryTitle = `${month} 총 매출`
        } else if (this.summaryType == 'today') {
            this.summaryTitle = `오늘의 매출`
        }
    }

    public curTotal = 0
    public prevTotal = 0
    getTotals() {
        this.curTotal = 0
        this.prevTotal = 0
        _.forIn(this.curSummary, (v, k) => {
            this.curTotal += Number(v)
        })
        _.forIn(this.prevSummary, (v, k) => {
            this.prevTotal += Number(v)
        })
    }

    public showDetail = false

    constructor(private cd: ChangeDetectorRef) {}
    ngOnInit() {}
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'summaryType', () => {
            this.getSummaryDate()
            this.getSummaryTitle()
        })
        detectChangesOn(changes, 'curSummary', () => {
            this.getTotals()
        })
    }
    ngAfterViewInit() {
        this.getSummaryDate()
        this.getSummaryTitle()

        this.getTotals()

        this.cd.detectChanges()
    }

    ngOnDestroy() {}
}
