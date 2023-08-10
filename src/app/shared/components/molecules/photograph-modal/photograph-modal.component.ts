import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
    AfterViewInit,
} from '@angular/core'

import { Loading } from '@schemas/loading'
import { changesOn } from '@shared/helper/component-helper'

/*
 ***확인메모***
 * 피그마 파일 센터 설정 / 직원 관리 / 직원 등록 / 사진 에 나오는 사진 촬영 모달 컴포넌트
 * 참고 - 노션 링크 : https://www.notion.so/QA-v3-4052d534d027497f92e680366671c9ef?p=6aae7af6ed1541c7b4e3ed94770482ed&pm=c
 */
@Component({
    selector: 'rwm-photograph-modal',
    templateUrl: './photograph-modal.component.html',
    styleUrls: ['./photograph-modal.component.scss'],
})
export class PhotographModalComponent implements OnChanges, AfterViewChecked, AfterViewInit {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() blockClickOutside = false

    @Output() close = new EventEmitter<any>()

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    public isMouseModalDown = false

    public confirmButtonLoading: Loading = 'idle'
    showLoading() {
        this.confirmButtonLoading = 'pending'
    }
    hideLoading() {
        this.confirmButtonLoading = 'idle'
    }

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'visible', (v) => {
            if (v) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}

    onClose() {
        this.close.emit({})
    }
    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
