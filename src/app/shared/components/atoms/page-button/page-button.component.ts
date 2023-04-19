import {
    Component,
    Input,
    Output,
    EventEmitter,
    QueryList,
    ViewChildren,
    AfterViewInit,
    ViewChild,
    ElementRef,
} from '@angular/core'

import { Observe } from '@shared/helper/decorator/Observe'
import { Observable } from 'rxjs'
import _ from 'lodash'

type PageNumberCondition = {
    edgeIncluded: 'left' | 'right' | 'none' // for selected number
    edgeDistance: number // for selected number
    selectedNumberDistance: number
    showLeftDots: boolean
    showRightDots: boolean
}

@Component({
    selector: 'rwa-page-button',
    templateUrl: './page-button.component.html',
    styleUrls: ['./page-button.component.scss'],
})
export class PageButtonComponent implements AfterViewInit {
    @Input() disable = false
    @Input() pageUnit = 10
    @Input() pageNumber!: number
    @Input() pageConditionSetNumber = 7
    @Input() pageCoverNumber = 2
    public additionalCoverNumber = 0
    public pageNumberArr: number[] = []
    public pageConditions: PageNumberCondition[] = []
    public selectedPageNumber = 1
    updatePageConditions() {
        // if (!_.isEmpty(this.pageConditions[this.selectedPageNumber - 1])) {
        //     this.additionalCoverNumber =
        //         this.pageConditions[this.selectedPageNumber - 1].edgeDistance <= 2
        //             ? _.ceil((2 - this.pageConditions[this.selectedPageNumber - 1].edgeDistance) / 2, 1)
        //             : 0
        // }
        this.pageConditions = _.map(this.pageNumberArr, (v, i) => {
            const condition: PageNumberCondition = {
                edgeIncluded: 'none',
                edgeDistance: -1,
                showLeftDots: false,
                showRightDots: false,
                selectedNumberDistance: 0,
            }
            if (this.pageNumberArr.length < this.pageConditionSetNumber) {
                return condition
            }
            condition.selectedNumberDistance = Math.abs(v - this.selectedPageNumber)
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
            } else if (v < this.selectedPageNumber) {
                condition.showLeftDots =
                    v == 1 ? false : this.selectedPageNumber - (this.pageCoverNumber + this.additionalCoverNumber) > v
                condition.showRightDots =
                    this.selectedPageNumber - (this.pageCoverNumber + this.additionalCoverNumber) > v
            } else if (v > this.selectedPageNumber) {
                condition.showLeftDots =
                    this.selectedPageNumber + (this.pageCoverNumber + this.additionalCoverNumber) < v
                condition.showRightDots =
                    v == this.pageNumberArr.length
                        ? false
                        : this.selectedPageNumber + (this.pageCoverNumber + this.additionalCoverNumber) < v
            }
            return condition
        })

        console.log('page button this.pageConditions -- ', this.pageConditions)
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
        console.log('_onPageNumber left Click -- ', this.selectedPageNumber, [
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
        console.log('_onPageNumber right Click -- ', this.selectedPageNumber, [
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

    _onPageNumberClick(pn: number) {
        this.button_els['_results'][pn - 1].nativeElement.blur()
        if (this.selectedPageNumber == pn || this.disable) return
        this.selectedPageNumber = pn
        console.log('_onPageNumberClick -- ', pn, [pn * this.pageUnit - this.pageUnit, pn * this.pageUnit - 1])
        this.updatePageConditions()
        this.onPageNumberClick.emit({
            selectedPageNumber: pn,
            pageRange: [pn * this.pageUnit - this.pageUnit, pn * this.pageUnit - 1],
        })
    }

    @Observe('pageNumber') pageNumber$: Observable<number>

    constructor() {
        this.pageNumber$.subscribe((pn) => {
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
