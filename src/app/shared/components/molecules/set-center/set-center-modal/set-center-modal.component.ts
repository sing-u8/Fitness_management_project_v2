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

import { changesOn, detectChangesOn } from '@shared/helper/component-helper'
import { StorageService } from '@services/storage.service'
import { CenterEmployeeService } from '@services/center-employee.service'
import { Center } from '@schemas/center'
import { TabInput } from '@schemas/components/tab'

import _ from 'lodash'

@Component({
    selector: 'rwm-set-center-modal',
    templateUrl: './set-center-modal.component.html',
    styleUrls: ['./set-center-modal.component.scss'],
})
export class SetCenterModalComponent implements OnChanges, AfterViewChecked, AfterViewInit {
    @Input() center: Center

    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() blockClickOutside = true

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('body') bodyElement: ElementRef

    private readonly categoriesInit: TabInput[] = [
        { name: '센터 정보', selected: true },
        { name: '직원 관리', selected: false },
        { name: '운영 정책', selected: false },
        { name: '이용권 결제 관리', selected: false },
    ]
    public categories: TabInput[] = _.cloneDeep(this.categoriesInit)

    public categInitObj = {
        centerInfo: false,
        employeeManagement: {
            employeeListInit: false,
            rolePermissionInit: false,
        },
        centerPolicyManagement: false,
        centerPaymentManagement: false,
    }

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private storageService: StorageService,
        private centerEmployeeService: CenterEmployeeService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'visible', (v) => {
            if (v) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                    this.bodyElement.nativeElement.scrollTo({ top: this.scrollTop })
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
                this.categories = _.cloneDeep(this.categoriesInit)
            }
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}

    // -----------------------------------------------------------------------------------------------------------

    goEmployeeManagement() {
        this.categories[0].selected = false
        this.categories[1].selected = true
    }

    // -----------------------------------------------------------------------------------------------------------
    @Output() close = new EventEmitter()
    @Output() open = new EventEmitter()
    public scrollTop = 0
    onClose(keepScroll = true): void {
        this.scrollTop = keepScroll ? this.bodyElement.nativeElement.scrollTop : 0
        this.close.emit()
    }
    onOpen() {
        this.open.emit()
    }

    // on mouse rw-modal down
    public isMouseModalDown = false
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
