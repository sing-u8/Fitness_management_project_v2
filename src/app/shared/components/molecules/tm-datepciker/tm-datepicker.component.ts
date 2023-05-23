import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    AfterViewInit,
    NgZone,
    ViewChild,
    ElementRef,
    Renderer2,
} from '@angular/core'
import _ from 'lodash'
import { Observe } from '@shared/helper/decorator/Observe'
import { Observable } from 'rxjs'

import dayjs from 'dayjs'
import isSameOrBefor from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isSameOrBefor)
dayjs.extend(isSameOrAfter)
dayjs.extend(weekOfYear)
dayjs.extend(isBetween)

export type CalMultiDate = { startDate: string; endDate: string }
export type CalDate = { date: string }
export type CalWeekDate = { startDate: string }
export type Data = CalMultiDate | CalDate | CalWeekDate | any

@Component({
    selector: 'rwm-tm-datepicker',
    templateUrl: './tm-datepicker.component.html',
    styleUrls: ['./tm-datepicker.component.scss'],
})
export class TmDatepickerComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit {
    @Input() isShadow = true
    @Input() mode: 'date' | 'week' | 'multiline' = 'multiline'
    @Input() calendarType: 'oneMonth' | 'twoMonth' = 'oneMonth'
    @Input() option:
        | 'normal'
        | 'register'
        | 'extend' /* only multiline until this line*/
        | 'onlyStart'
        | 'onlyEnd'
        | 'looseOnlyStart'
        | 'limitLooseOnlyEnd'
        | 'looseOnlyEnd' /* only reg-ml until this line*/
        | 'holdStart' /* only hold */
        | 'holdEnd' = 'normal'

    @Input() data: Data
    @Observe('data') data$: Observable<Data>
    @Output() dataChange = new EventEmitter<Data>()

    public curMonth: {
        date: dayjs.Dayjs
        monthFormat: string
    }
    public postMonth: {
        date: dayjs.Dayjs
        monthFormat: string
    }
    getCurAndPostMonth() {
        this.curMonth = {
            date: this.currentDate.clone(),
            monthFormat: this.currentDate.clone().format('YY년 MM월'),
        }
        this.postMonth = {
            date: this.currentDate.clone().add(1, 'month'),
            monthFormat: this.currentDate.clone().add(1, 'month').format('YY년 MM월'),
        }
    }

    public today: dayjs.Dayjs
    public currentDate: dayjs.Dayjs
    public weekRows: Array<Array<any>> = []
    public nextMonthRow = 0
    public isPastMonthDateIncluded = 0

    // date
    public selectedDate = ''
    public selectedDateIndex: any

    // week
    public weekNumbers: number[] = []
    public selectedWeek
    public selectedWeekIndex: {
        i: number
        j: number
    } = {
        i: -1,
        j: -1,
    }

    // multi
    public selectedMultiDateObj: CalMultiDate = { startDate: '', endDate: '' }
    public hoveredEndDate = ''
    onWeekColHover(weekCol: any) {
        this.hoveredEndDate = weekCol.date
    }
    onWeekColOut() {
        this.hoveredEndDate = ''
    }
    isHoverBetween(weekCol) {
        return (
            dayjs(weekCol.date).isBetween(this.selectedMultiDateObj.startDate, this.hoveredEndDate) &&
            dayjs(this.hoveredEndDate).isSameOrAfter(this.selectedMultiDateObj.startDate)
        )
    }
    isHoverSelect(weekCol) {
        return (
            weekCol.date == this.hoveredEndDate &&
            dayjs(this.hoveredEndDate).isAfter(this.selectedMultiDateObj.startDate)
        )
    }

    public isViewInit = false
    public afterViewCheckedDate
    public afterViewCheckedStartDate

    constructor(private zone: NgZone, private renderer: Renderer2) {}
    ngOnInit() {
        this.setDatePick()
        this.data$.subscribe((v) => {
            this.getDays(this.currentDate)
        })
    }
    ngOnChanges(changes: SimpleChanges) {
        if (this.checkDifference(changes) && this.isViewInit) {
            this.setDatePick()
            this.getDays(this.currentDate)
        }
    }
    ngAfterViewInit() {
        this.isViewInit = true
    }
    ngAfterViewChecked() {}

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

    setDatePick() {
        this.today = dayjs()
        if (this.mode == 'date' && this.data.date) {
            this.currentDate = dayjs(this.data.date)
        } else if (this.mode == 'week' && this.data.startDate) {
            this.currentDate = dayjs(this.data.startDate)
        } else if (this.mode == 'multiline') {
            this.multiLineSelectDate({ date: this.data?.startDate })
            this.multiLineSelectDate({ date: this.data?.endDate })
            this.currentDate = this.data?.endDate
                ? dayjs(this.data?.endDate)
                : this.data?.startDate
                ? dayjs(this.data?.startDate)
                : dayjs()
        } else {
            this.currentDate = dayjs()
        }
        this.getCurAndPostMonth()
        this.getDays(this.currentDate)
    }

    checkDifference(changes: SimpleChanges) {
        if (
            changes['data']['currentValue']?.date &&
            changes['data']['previousValue']?.date &&
            changes['data']['currentValue']['date'] != changes['data']['previousValue']['date']
        ) {
            return true
        } else {
            return (
                (changes['data']['currentValue']?.date &&
                    changes['data']['previousValue']?.date &&
                    changes['data']['currentValue']?.startDate != changes['data']['previousValue']?.startDate) ||
                changes['data']['currentValue']?.endDate != changes['data']['previousValue']?.endDate
            )
        }
    }

    resetDateVars() {
        this.selectedDate = ''
        // this.selectedDateObj = {}
        this.selectedMultiDateObj = { startDate: '', endDate: '' }
    }

    getDays(currentDate: dayjs.Dayjs) {
        const firstWeek = currentDate.clone().startOf('month').week()
        const lastWeek =
            currentDate.clone().add(1, 'month').endOf('month').week() === 1
                ? 53
                : currentDate.clone().add(1, 'month').endOf('month').week()

        this.weekRows = []
        this.weekNumbers = []

        let findNextMonthRow = false
        this.isPastMonthDateIncluded = 0
        let weekIdx = 0

        const weekDiff = lastWeek - firstWeek < 0 ? 53 + (lastWeek - firstWeek) : lastWeek - firstWeek
        for (let wdx = 0; wdx <= weekDiff; wdx++) {
            const week = wdx + firstWeek
            const weekRow = []

            let weekNumber = week % 52
            weekNumber = weekNumber == 0 ? 52 : weekNumber
            this.weekNumbers.push(weekNumber)

            for (let index = 0; index < 7; index++) {
                const date = currentDate.clone().startOf('year').week(week).startOf('week').add(index, 'day')

                const firstDateOfWeek = currentDate.clone().startOf('year').week(week).startOf('week')
                const fdwMonth = firstDateOfWeek.toDate().getMonth() % 12

                const cdMonth = currentDate.toDate().getMonth() % 12
                const dMonth = date.toDate().getMonth() % 12
                const cnMonth = (currentDate.toDate().getMonth() % 12) + 1

                if (
                    index == 6 &&
                    (Math.abs(cnMonth - dMonth) == 0 || Math.abs(cnMonth - dMonth) == 12) &&
                    !findNextMonthRow
                ) {
                    this.nextMonthRow = weekIdx
                    findNextMonthRow = true

                    if (Math.abs(fdwMonth - cdMonth) == 0) {
                        this.isPastMonthDateIncluded = 1
                    }
                }
                const weekCol = {
                    day: date.format('D'),
                    week: weekNumber,
                    month: date.format('MM'),
                    year: date.format('YYYY'),
                    date: date.format('YYYY-MM-DD'),
                    selected: false,
                }

                if (date.format('YYYYMMDD') == this.today.format('YYYYMMDD')) {
                    weekCol['color'] = 'var(--red-100)'
                } else {
                    weekCol['color'] = 'var(--font-color)'
                    weekCol['fontWeight'] = 400
                }

                if (this.mode == 'date') {
                    this.checkSelectedDate({ date: date, weekCol: weekCol, weekColIndex: index })
                }
                weekRow.push(weekCol)
            }

            this.weekRows.push(weekRow)
            weekIdx++
        }

        if (this.mode == 'week') {
            this.checkSelectedWeek()
        }
    }
    isVisibleDate(monthDate: dayjs.Dayjs, weekCol: any) {
        return monthDate.format('MM') == weekCol['month']
    }

    previousMonth() {
        this.currentDate = this.currentDate.clone().subtract(1, 'month')
        this.getCurAndPostMonth()
        this.getDays(this.currentDate)
    }

    nextMonth() {
        this.currentDate = this.currentDate.clone().add(1, 'month')
        this.curMonth = {
            date: this.currentDate.clone(),
            monthFormat: this.currentDate.clone().format('YY년 MM월'),
        }
        this.postMonth = {
            date: this.currentDate.clone().add(1, 'month'),
            monthFormat: this.currentDate.clone().add(1, 'month').format('YY년 MM월'),
        }
        this.getDays(this.currentDate)
    }

    previousYear() {
        this.currentDate = this.currentDate.clone().subtract(1, 'year')
        this.getCurAndPostMonth()
        this.getDays(this.currentDate)
    }

    nextYear() {
        this.currentDate = this.currentDate.clone().add(1, 'year')
        this.getCurAndPostMonth()
        this.getDays(this.currentDate)
    }

    selectDate(i, j) {
        if (this.selectedDate) {
            this.weekRows[this.selectedDateIndex['i']][this.selectedDateIndex['j']]['selected'] = false
        }

        this.weekRows[i][j]['selected'] = true
        this.selectedDate = this.weekRows[i][j]['date']
        this.selectedDateIndex = {
            i: i,
            j: j,
        }

        this.dataChange.emit({ date: this.selectedDate })

        // const selectedYearMonth = dayjs(this.selectedDate).format('YYYY-MM')
        // if (selectedYearMonth < this.currentDate.format('YYYY-MM')) {
        //     this.previousMonth()
        // } else if (this.currentDate.format('YYYY-MM') < selectedYearMonth) {
        //     this.nextMonth()
        // }
    }

    checkSelectedDate({ date, weekCol, weekColIndex }) {
        if (this.data.date) {
            if (date.format('YYYY-MM-DD') == this.data.date) {
                this.selectedDate = this.data.date
                weekCol['selected'] = true
                this.selectedDateIndex = {
                    i: this.weekRows.length,
                    j: weekColIndex,
                }
            }
        } else if (this.selectedDate) {
            if (date.format('YYYY-MM-DD') == this.selectedDate) {
                weekCol['selected'] = true
                this.selectedDateIndex = {
                    i: this.weekRows.length,
                    j: weekColIndex,
                }
            }
        }
    }

    selectWeek(i) {
        const startDate = this.weekRows[i][0]['date']
        const endDate = this.weekRows[i][6]['date']
        this.selectedWeek = dayjs(startDate).week()
        this.dataChange.emit({ startDate: startDate, endDate: endDate })
    }

    checkSelectedWeek() {
        if (this.data.startDate) {
            this.selectedWeek = dayjs(this.data.startDate).week()
        }
    }

    // ------------------ multi line methods -----------------------------------------------------------------------------------
    multiLineSelectDate(weekCol) {
        this.setInitialLineDate(weekCol)
    }
    // helper
    setInitialLineDate(weekCol) {
        switch (this.option) {
            case 'normal':
                this.initNormalDateweekCol(weekCol)
                break
            case 'register':
                this.toggleEdge(weekCol) == false ? this.initRegisterDate(weekCol) : null
                break
            case 'extend':
                this.toggleEdge(weekCol) == false ? this.initExtendDate(weekCol) : null
                break
        }
    }
    // initlineDate methods for each type -->
    initNormalDateweekCol(weekCol) {
        if (!this.selectedMultiDateObj.startDate && !this.selectedMultiDateObj.endDate) {
            this.selectedMultiDateObj.startDate = weekCol.date
        } else if (!this.selectedMultiDateObj.startDate && this.selectedMultiDateObj.endDate) {
            if (dayjs(weekCol.date).isSameOrBefore(this.selectedMultiDateObj.endDate)) {
                this.selectedMultiDateObj.startDate = weekCol.date
            }
        } else if (!this.selectedMultiDateObj.endDate) {
            if (dayjs(weekCol.date).isBefore(this.selectedMultiDateObj.startDate, 'day')) {
                this.selectedMultiDateObj.startDate = weekCol.date
            } else {
                this.selectedMultiDateObj.endDate = weekCol.date
            }
        } else if (this.selectedMultiDateObj.startDate && this.selectedMultiDateObj.endDate) {
            if (dayjs(weekCol.date).isBefore(this.selectedMultiDateObj.startDate, 'day')) {
                this.selectedMultiDateObj.startDate = weekCol.date
            } else if (dayjs(weekCol.date).isSame(this.selectedMultiDateObj.startDate, 'day')) {
                this.selectedMultiDateObj.startDate = ''
            }

            if (dayjs(weekCol.date).isSame(this.selectedMultiDateObj.endDate, 'day')) {
                this.selectedMultiDateObj.endDate = ''
            } else if (dayjs(weekCol.date).isAfter(this.selectedMultiDateObj.startDate, 'day')) {
                this.selectedMultiDateObj.endDate = weekCol.date
            }
        }
        this.dataChange.emit(this.selectedMultiDateObj)
    }
    initRegisterDate(weekCol) {
        // 초기 시작일 설정을 수정해야할 수도 있음
        if (
            this.selectedMultiDateObj.startDate &&
            dayjs(weekCol.date).isSameOrBefore(dayjs().format('YYYY-MM-DD'), 'day')
        )
            return
        if (!this.selectedMultiDateObj.startDate) {
            this.selectedMultiDateObj.startDate = dayjs().format('YYYY-MM-DD')
            this.dataChange.emit(this.selectedMultiDateObj)
        } else {
            this.selectedMultiDateObj.endDate = weekCol.date
            this.dataChange.emit(this.selectedMultiDateObj)
        }

        // this.initNormalDateweekCol(weekCol)
    }
    initExtendDate(weekCol) {
        if (
            this.selectedMultiDateObj.startDate &&
            dayjs(weekCol.date).isSameOrBefore(dayjs().format(this.selectedMultiDateObj.startDate), 'day')
        )
            return
        if (!this.selectedMultiDateObj.startDate) {
            this.selectedMultiDateObj.startDate = weekCol.date
            this.dataChange.emit(this.selectedMultiDateObj)
        } else {
            this.selectedMultiDateObj.endDate = weekCol.date
            this.dataChange.emit(this.selectedMultiDateObj)
        }
    }

    // <-- initlineDate methods for each type

    toggleEdge(weekCol): boolean {
        let isToggled = false
        if (
            this.selectedMultiDateObj.startDate &&
            dayjs(weekCol.date).isSame(this.selectedMultiDateObj.startDate, 'day') &&
            this.option == 'normal'
        ) {
            this.selectedMultiDateObj.startDate = ''
            isToggled = true
        } else if (
            this.selectedMultiDateObj.endDate &&
            dayjs(weekCol.date).isSame(this.selectedMultiDateObj.endDate, 'day')
        ) {
            this.selectedMultiDateObj.endDate = ''
            isToggled = true
        }
        return isToggled
    }

    // deprecated 메세지가 나타났음 - 나중에 수정하기 !
    isEdgeDate(weekCol) {
        return this.selectedMultiDateObj.startDate == weekCol.date || this.selectedMultiDateObj.endDate == weekCol.date
    }
    isStartDate(weekCol) {
        return this.selectedMultiDateObj.startDate == weekCol.date && !_.isEmpty(this.selectedMultiDateObj.endDate)
    }
    isEndDate(weekCol) {
        return this.selectedMultiDateObj.endDate == weekCol.date
    }
    isSameDate(weekCol) {
        return weekCol.date == this.selectedMultiDateObj.startDate && weekCol.date == this.selectedMultiDateObj.endDate
    }
    isBetween(weekCol) {
        return dayjs(weekCol.date).isBetween(this.selectedMultiDateObj.startDate, this.selectedMultiDateObj.endDate)
    }
    getDayFromStartDate(weekCol) {
        if (this.selectedMultiDateObj.startDate) {
            const startDate = dayjs(this.selectedMultiDateObj.startDate)
            const targetDate = dayjs(weekCol.date)
            // return targetDate.diff(startDate, 'days')
            return targetDate.diff(startDate, 'days') + 1
        }
        return 0
    }
    pastDisable(weekCol) {
        return (
            !this.selectedMultiDateObj.startDate ||
            dayjs(weekCol.date).isSameOrBefore(this.selectedMultiDateObj.startDate)
        )
    }
    isAvailableDate(weekCol) {
        switch (this.option) {
            case 'normal':
                return true
            case 'register':
                return !dayjs(weekCol.date).isBefore(dayjs().format('YYYY-MM-DD'), 'day')
            case 'extend':
                return !dayjs(weekCol.date).isBefore(dayjs().format(this.selectedMultiDateObj.startDate), 'day')
            default:
                return false
        }
    }

    // --------- multiline component with mcPastUnAvailalble method ------------------------------------------------------------------------------------------------
}
