import {
    Component,
    Input,
    Output,
    EventEmitter,
    QueryList,
    ViewChildren,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ElementRef,
} from '@angular/core'

import { detectChangesOn } from '@shared/helper/component-helper'
import _ from 'lodash'

type PageNumberCondition = {
    edgeIncluded: 'left' | 'right' | 'none' // for selected number
    edgeDistance: number // for selected number
    absSelectedNumberDistance: number
    showLeftDots: boolean
    showRightDots: boolean
    mustShow?: boolean
}

@Component({
    selector: 'rwa-page-button',
    templateUrl: './page-button.component.html',
    styleUrls: ['./page-button.component.scss'],
})
export class PageButtonComponent implements AfterViewInit, OnChanges {
    @Input() disable = false
    @Input() pageUnit = 10
    @Input() pageNumber!: number
    public pageConditionSetNumber = 7
    public pageCoverNumber = 2
    public additionalCoverNumber = 0
    public pageNumberArr: number[] = []
    public pageConditions: PageNumberCondition[] = []
    public selectedPageNumber = 1
    updatePageConditions() {
        this.pageConditions = _.map(this.pageNumberArr, (v, i) => {
            const condition: PageNumberCondition = {
                edgeIncluded: 'none',
                edgeDistance: -1,
                showLeftDots: false,
                showRightDots: false,
                absSelectedNumberDistance: 0,
            }
            if (this.pageNumberArr.length < this.pageConditionSetNumber) {
                return condition
            }
            condition.absSelectedNumberDistance = Math.abs(v - this.selectedPageNumber)
            if (this.selectedPageNumber == v) {
                condition.showLeftDots = false
                condition.showRightDots = false
                condition.edgeIncluded =
                    v - (this.pageCoverNumber + 1) <= 1
                        ? 'left'
                        : v + (this.pageCoverNumber + 1) >= this.pageNumberArr.length
                        ? 'right'
                        : 'none'
                condition.edgeDistance =
                    condition.edgeIncluded == 'left'
                        ? v - 1
                        : condition.edgeIncluded == 'right'
                        ? this.pageNumberArr.length - v
                        : -1
                return condition
            }
            if (v < this.selectedPageNumber) {
                condition.showLeftDots = v == 1 ? false : this.selectedPageNumber - this.pageCoverNumber > v
                condition.showRightDots = this.selectedPageNumber - this.pageCoverNumber > v
            } else if (v > this.selectedPageNumber) {
                condition.showLeftDots = this.selectedPageNumber + this.pageCoverNumber < v
                condition.showRightDots =
                    v == this.pageNumberArr.length ? false : this.selectedPageNumber + this.pageCoverNumber < v
            }
            return condition
        })
        if (!_.isEmpty(this.pageConditions[this.selectedPageNumber - 1])) {
            this.additionalCoverNumber =
                this.pageConditions[this.selectedPageNumber - 1].edgeDistance <= 2 &&
                this.pageConditions[this.selectedPageNumber - 1].edgeDistance >= 0
                    ? 2 - this.pageConditions[this.selectedPageNumber - 1].edgeDistance
                    : 0
            if (this.pageConditions[this.selectedPageNumber - 1].edgeIncluded == 'right') {
                for (let n = this.pageCoverNumber; n > 0; n--) {
                    const ed = this.pageConditions[this.selectedPageNumber - 1].edgeDistance
                    this.pageConditions[this.selectedPageNumber - 1 - (n + this.pageCoverNumber - ed)].showRightDots =
                        this.selectedPageNumber - 1 - n == 0
                    this.pageConditions[this.selectedPageNumber - 1 - (n + this.pageCoverNumber - ed)].showLeftDots =
                        false
                }
                if (this.selectedPageNumber == this.pageNumberArr.length - 3) {
                    this.pageConditions[this.pageNumberArr.length - 2].mustShow = true
                    this.additionalCoverNumber = this.additionalCoverNumber - 1
                }
            } else if (this.pageConditions[this.selectedPageNumber - 1].edgeIncluded == 'left') {
                for (let n = this.pageCoverNumber; n > 0; n--) {
                    const ed = this.pageConditions[this.selectedPageNumber - 1].edgeDistance
                    this.pageConditions[this.selectedPageNumber - 1 + (n + this.pageCoverNumber - ed)].showRightDots =
                        false
                    this.pageConditions[this.selectedPageNumber - 1 + (n + this.pageCoverNumber - ed)].showLeftDots =
                        false
                }
                if (this.selectedPageNumber == 4) {
                    this.pageConditions[1].mustShow = true
                    this.additionalCoverNumber = this.additionalCoverNumber - 1
                }
            }
        }
    }

    @Output() onPageNumberClick = new EventEmitter<{
        selectedPageNumber: number
        pageRange: [number, number]
    }>()

    @ViewChildren('button') button_els: QueryList<HTMLButtonElement>
    @ViewChild('left_button') left_button_el: ElementRef
    @ViewChild('right_button') right_button_el: ElementRef

    onLeftArrowClick() {
        this.left_button_el.nativeElement.blur()
        if (this.selectedPageNumber == 1 || this.disable) return
        this.selectedPageNumber = this.selectedPageNumber - 1
        console.log('_onPageNumber left Click -- ', this.pageNumberArr[0], this.selectedPageNumber, [
            this.selectedPageNumber * this.pageUnit - this.pageUnit,
            this.selectedPageNumber * this.pageUnit - 1,
        ])
        this.updatePageConditions()
        this.onPageNumberClick.emit({
            selectedPageNumber: this.selectedPageNumber,
            pageRange: [
                this.selectedPageNumber * this.pageUnit - this.pageUnit,
                this.selectedPageNumber * this.pageUnit - 1,
            ],
        })
    }
    onRightArrowClick() {
        this.right_button_el.nativeElement.blur()
        if (this.selectedPageNumber == this.pageNumberArr.length || this.disable) return
        this.selectedPageNumber = this.selectedPageNumber + 1
        console.log(
            '_onPageNumber right Click -- ',
            this.pageNumberArr[this.pageNumberArr.length - 1],
            this.selectedPageNumber,
            [this.selectedPageNumber * this.pageUnit - this.pageUnit, this.selectedPageNumber * this.pageUnit - 1]
        )
        this.updatePageConditions()
        this.onPageNumberClick.emit({
            selectedPageNumber: this.selectedPageNumber,
            pageRange: [
                this.selectedPageNumber * this.pageUnit - this.pageUnit,
                this.selectedPageNumber * this.pageUnit - 1,
            ],
        })
    }

    _onPageNumberClick(pn: number) {
        this.button_els['_results'][pn - 1].nativeElement.blur()
        if (this.selectedPageNumber == pn || this.disable) return
        this.selectedPageNumber = pn
        this.updatePageConditions()
        this.onPageNumberClick.emit({
            selectedPageNumber: pn,
            pageRange: [pn * this.pageUnit - this.pageUnit, pn * this.pageUnit - 1],
        })
    }

    constructor() {}
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'pageNumber', (pn) => {
            this.pageNumberArr = Array.from(Array.from({ length: pn }, (__, i) => i + 1))
            this.updatePageConditions()
        })
    }
    ngAfterViewInit() {}

    public isMouseDown = false
    onMouseDown() {
        this.isMouseDown = true
    }
    onMouseUp() {
        this.isMouseDown = false
    }
}
