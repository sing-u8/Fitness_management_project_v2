import {
    Component,
    EventEmitter,
    Input,
    Output,
    Renderer2,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { TabInput } from '@schemas/components/tab'

import _ from 'lodash'
import dayjs from 'dayjs'
import { Observe } from '@shared/helper/decorator/Observe'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

type TagType =
    | 'whole'
    | 'today'
    | 'yesterday'
    | 'thisYear'
    | 'lastYear'
    | 'thisWeek'
    | 'lastWeek'
    | 'thisMonth'
    | 'lastMonth'
@Component({
    selector: 'rwm-dropdown-datepicker',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './dropdown-datepicker.component.html',
    styleUrls: ['./dropdown-datepicker.component.scss'],
})
export class DropdownDatepickerComponent implements OnDestroy, OnChanges, AfterViewInit {
    @Input() date: { startDate: string; endDate: string } = {
        startDate: undefined,
        endDate: undefined,
    }
    @Output() dateChange = new EventEmitter<{ startDate: string; endDate: string }>()
    @Observe('date') date$: Observable<{ startDate: string; endDate: string }>
    @Output() onDateSave = new EventEmitter<{ startDate: string; endDate: string }>()

    public subject$ = new Subject<boolean>()
    constructor(private renderer: Renderer2, private cd: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges) {}

    ngAfterViewInit() {
        this.date$.pipe(takeUntil(this.subject$)).subscribe(() => {
            this.updateMonthItemSelected()
            this.checkDateTag()
        })

        this.cd.detectChanges()
        // this.updateMonthItemSelected()
    }

    ngOnDestroy() {
        this.subject$.next(true)
        this.subject$.complete()
    }

    public tabs: Array<TabInput> = [
        { name: '기간 상세 조회', selected: true },
        { name: '월별 조회', selected: false },
    ]

    public monthItems: Array<{ name: string; selected: boolean }> = Array.from({ length: 12 }, (__, i) => ({
        name: `${i + 1}월`,
        selected: false,
    }))

    public monthDate: { year: string; month: string } = { year: dayjs().format('YYYY'), month: '' }
    setMonthDateYear(input: 'next' | 'prev') {
        this.monthDate.year =
            input == 'next' ? String(Number(this.monthDate.year) + 1) : String(Number(this.monthDate.year) - 1)
        this.updateMonthItemSelected()
    }
    setMonthDateMonth(input: number) {
        _.forEach(this.monthItems, (__, i) => {
            this.monthItems[i].selected = i == input
        })

        this.monthDate.month = String(input + 1)
        this.date = {
            startDate: dayjs(this.monthDate.year + '-' + this.monthDate.month)
                .startOf('month')
                .format('YYYY-MM-DD'),
            endDate: dayjs(this.monthDate.year + '-' + this.monthDate.month)
                .endOf('month')
                .format('YYYY-MM-DD'),
        }
        this.checkDateTag()

        // this.onDateSave.emit(this.date)
    }
    checkOneMonthDate() {
        const monthDate = {
            startDate: dayjs(this.date.startDate).startOf('month').format('YYYY-MM-DD'),
            endDate: dayjs(this.date.startDate).endOf('month').format('YYYY-MM-DD'),
        }
        return monthDate.startDate == this.date.startDate && monthDate.endDate == this.date.endDate
    }
    updateMonthItemSelected() {
        if (
            !_.isEmpty(this.monthDate.year) &&
            this.monthDate.year == dayjs(this.date.endDate).format('YYYY') &&
            this.checkOneMonthDate()
        ) {
            const month = Number(dayjs(this.date.startDate).format('M')) - 1
            _.forEach(this.monthItems, (v, i) => {
                this.monthItems[i].selected = i == month
            })
        } else {
            _.forEach(this.monthItems, (v, i) => {
                this.monthItems[i].selected = false
            })
        }
    }

    selectedTag: TagType = undefined
    onClickTag(type: TagType) {
        this.date = _.cloneDeep({
            startDate: '',
            endDate: '',
        })
        switch (type) {
            case 'whole':
                this.date = {
                    startDate: dayjs('1950-01-01').format('YYYY-MM-DD'),
                    endDate: dayjs().format('YYYY-MM-DD'),
                }
                this.selectedTag = 'whole'
                break
            case 'today':
                this.date = {
                    startDate: dayjs().format('YYYY-MM-DD'),
                    endDate: '',
                }
                this.selectedTag = 'today'
                break
            case 'yesterday':
                this.date = {
                    startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
                    endDate: '',
                }
                this.selectedTag = 'yesterday'
                break
            case 'thisYear':
                this.date = {
                    startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
                    endDate: dayjs().endOf('year').format('YYYY-MM-DD'),
                }
                this.selectedTag = 'thisYear'
                break
            case 'lastYear':
                this.date = {
                    startDate: dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
                    endDate: dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
                }
                this.selectedTag = 'lastYear'
                break
            case 'thisWeek':
                this.date = {
                    startDate: dayjs().startOf('week').format('YYYY-MM-DD'),
                    endDate: dayjs().endOf('week').format('YYYY-MM-DD'),
                }
                this.selectedTag = 'thisWeek'
                break
            case 'lastWeek':
                this.date = {
                    startDate: dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
                    endDate: dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
                }
                this.selectedTag = 'lastWeek'
                break
            case 'thisMonth':
                this.date = {
                    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
                    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
                }
                this.selectedTag = 'thisMonth'
                break
            case 'lastMonth':
                this.date = {
                    startDate: dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
                    endDate: dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
                }
                this.selectedTag = 'lastMonth'
                break
        }
        this.updateMonthItemSelected()
    }

    checkDateTag() {
        this.selectedTag = undefined
        let _date = {
            startDate: dayjs('1950-01-01').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD'),
        }
        if (this.date.startDate == _date.startDate && this.date.endDate == _date.endDate) {
            this.selectedTag = 'whole'
            return
        }
        _date = {
            startDate: dayjs().format('YYYY-MM-DD'),
            endDate: '',
        }
        if (this.date.startDate == _date.startDate && this.date.endDate == _date.endDate) {
            this.selectedTag = 'today'
            return
        }
        _date = {
            startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
            endDate: '',
        }
        if (this.date.startDate == _date.startDate && this.date.endDate == _date.endDate) {
            this.selectedTag = 'yesterday'
            return
        }
        _date = {
            startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
            endDate: dayjs().endOf('year').format('YYYY-MM-DD'),
        }
        if (this.date.startDate == _date.startDate && this.date.endDate == _date.endDate) {
            this.selectedTag = 'thisYear'
            return
        }
        _date = {
            startDate: dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
            endDate: dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
        }
        if (this.date.startDate == _date.startDate && this.date.endDate == _date.endDate) {
            this.selectedTag = 'lastYear'
            return
        }
        _date = {
            startDate: dayjs().startOf('week').format('YYYY-MM-DD'),
            endDate: dayjs().endOf('week').format('YYYY-MM-DD'),
        }
        if (this.date.startDate == _date.startDate && this.date.endDate == _date.endDate) {
            this.selectedTag = 'thisWeek'
            return
        }
        _date = {
            startDate: dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
            endDate: dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
        }
        if (this.date.startDate == _date.startDate && this.date.endDate == _date.endDate) {
            this.selectedTag = 'lastWeek'
            return
        }
        _date = {
            startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
            endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
        }
        if (this.date.startDate == _date.startDate && this.date.endDate == _date.endDate) {
            this.selectedTag = 'thisMonth'
            return
        }
        _date = {
            startDate: dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            endDate: dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
        }
        if (this.date.startDate == _date.startDate && this.date.endDate == _date.endDate) {
            this.selectedTag = 'lastMonth'
            return
        }
    }

    public isMouseDown = false
    onMouseDown() {
        this.isMouseDown = true
    }
    onMouseUp() {
        this.isMouseDown = false
    }
    onFocus(el: any) {
        if (!this.isMouseDown) this.renderer.addClass(el, 'focused')
    }
    onFocusOut(el: any) {
        this.renderer.removeClass(el, 'focused')
    }
}
