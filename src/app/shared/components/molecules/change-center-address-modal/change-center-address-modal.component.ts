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
import { AsyncValidatorFn, ValidatorFn, FormBuilder, FormControl, Validators } from '@angular/forms'

import { Loading } from '@schemas/loading'
import { ModalOutPut } from '@schemas/components/modal'
import { changesOn } from '@shared/helper/component-helper'

export interface ChangeAddressOutput {
    value: { zonecode: string; roadAddress: string; detailedAddress: string }
    loadingFn: ModalOutPut
}

@Component({
    selector: 'rwm-change-center-address-modal',
    templateUrl: './change-center-address-modal.component.html',
    styleUrls: ['./change-center-address-modal.component.scss'],
})
export class ChangeCenterAddressModalComponent implements OnChanges, AfterViewInit, AfterViewChecked {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() blockClickOutside = true

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() close = new EventEmitter<any>()
    onClose(): void {
        this.close.emit({})
    }

    public confirmButtonLoading: Loading = 'idle'
    showLoading() {
        this.confirmButtonLoading = 'pending'
    }
    hideLoading() {
        this.confirmButtonLoading = 'idle'
    }

    @Input() zoneCode = ''
    @Input() roadAddress = ''
    @Input() detailedAddress = ''
    @Output() onAddressConfirm = new EventEmitter<ChangeAddressOutput>()
    changeAddress() {
        this.onAddressConfirm.emit({
            loadingFn: {
                showLoading: this.showLoading.bind(this),
                hideLoading: this.hideLoading.bind(this),
            },
            value: {
                zonecode: this.zonecodeForm.value,
                roadAddress: this.roadAddressForm.value,
                detailedAddress: this.detailedAddressForm.value,
            },
        })
    }

    public centerForm = this.fb.group({
        zonecode: ['', [Validators.required, Validators.pattern(/^[0-9]/)]],
        roadAddress: ['', Validators.required],
        detailedAddress: ['', Validators.required],
    })
    get zonecodeForm() {
        return this.centerForm.get('zonecode')
    }
    get roadAddressForm() {
        return this.centerForm.get('roadAddress')
    }
    get detailedAddressForm() {
        return this.centerForm.get('detailedAddress')
    }

    reset() {
        this.centerForm.reset()
    }

    constructor(private el: ElementRef, private renderer: Renderer2, private fb: FormBuilder) {}
    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'visible', (v) => {
            if (v) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
                this.zonecodeForm.setValue(this.zoneCode)
                this.detailedAddressForm.setValue(this.detailedAddress)
                this.roadAddressForm.setValue(this.roadAddress)
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

    openSearchAddressPopup() {
        const width = 400
        const height = 400
        const popupKey = 'daumPopupKey'

        new window['daum'].Postcode({
            oncomplete: (data) => {
                this.zonecodeForm.setValue(data.zonecode)
                this.roadAddressForm.setValue(data.roadAddress)
            },
            onclose: (state) => {},
            width,
            height,
        }).open({
            left: window.screen.width / 2 - width / 2,
            top: window.screen.height / 2 - height / 2,
            popupKey,
        })
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
