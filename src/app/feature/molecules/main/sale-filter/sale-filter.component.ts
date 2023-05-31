import {
    Component,
    ElementRef,
    Renderer2,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    OnChanges,
    SimpleChanges,
    ViewChildren,
    QueryList,
} from '@angular/core'

import _ from 'lodash'

import { Subject } from 'rxjs'

import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { FilterMapProductTypeCode, FilterMapTypeCode } from '@store/main/reducers/sales.reducer'
import { DropdownDatepickerComponent } from '@feature/molecules/main/dropdown-datepicker/dropdown-datepicker.component'
import dayjs from 'dayjs'
import { detectChangesOn } from '@shared/helper/component-helper'
import { TextFieldComponent } from '@shared/components/atoms/text-field/text-field.component'

export type FilterType = 'date' | 'paymentType' | 'member' | 'productType' | 'productName' | 'personInCharge'
export type DateType = { startDate: string; endDate: string }

const dateInit = {
    startDate: '',
    endDate: '',
}
const filterMapTypeCodeInit: FilterMapTypeCode = {
    payment_type_refund: false,
    payment_type_payment: false,
    payment_type_transfer: false,
}
const filterMapProductTypeCodeInit: FilterMapProductTypeCode = {
    user_membership: false,
    user_locker: false,
    user_sportswear: false,
}

@Component({
    selector: 'rwm-sale-filter',
    standalone: true,
    imports: [CommonModule, SharedModule, DropdownDatepickerComponent],
    templateUrl: './sale-filter.component.html',
    styleUrls: ['./sale-filter.component.scss'],
})
export class SaleFilterComponent implements OnInit, OnDestroy, OnChanges {
    @Input() filterType: FilterType = undefined
    @Input() disabled = false

    @ViewChild('l_button') l_button_el: ElementRef

    public openDropdown = false
    _onClick() {
        this.l_button_el.nativeElement.blur()
        if (this.openDropdown) {
            this.restoreData()
            this.checkFilterValueExist()
        }
        this.openDropdown = !this.openDropdown
        if (this.openDropdown) {
            this.openModal()
        } else {
            this.closeModal()
        }
    }
    closeDropDown() {
        if (this.openDropdown) {
            this.openDropdown = false
            this.restoreData()
            this.checkFilterValueExist()
        }
        this.closeModal()
    }

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement
    @ViewChildren('rwa_text_field') rwa_text_field: QueryList<TextFieldComponent>
    openModal() {
        this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
        this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
        setTimeout(() => {
            this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
            this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
            if (this.rwa_text_field.length > 0) this.rwa_text_field['_results'][0].input_el.nativeElement.focus()
        }, 0)
    }
    closeModal() {
        this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
        this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
        setTimeout(() => {
            this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
            this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
        }, 200)
    }

    public isMouseDown = false
    onMouseDown() {
        this.isMouseDown = true
    }
    onMouseUp() {
        this.isMouseDown = false
    }
    onFocus() {
        if (!this.isMouseDown) this.renderer.addClass(this.l_button_el.nativeElement, 'focused')
    }
    onFocusOut() {
        this.renderer.removeClass(this.l_button_el.nativeElement, 'focused')
    }

    public subject = new Subject<boolean>()

    constructor(private renderer: Renderer2) {}
    ngOnInit() {}
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'filterType', () => {
            this.setTypeName()
        })
        detectChangesOn(changes, 'paymentType', (v) => {
            this.curPaymentType = _.cloneDeep(v)
            this.checkFilterValueExist()
            this.getDateText()
        })
        detectChangesOn(changes, 'member', (v) => {
            this.curMember = _.cloneDeep(v)
            this.checkFilterValueExist()
            this.getDateText()
        })
        detectChangesOn(changes, 'productType', (v) => {
            this.curProductType = _.cloneDeep(v)
            this.checkFilterValueExist()
            this.getDateText()
        })
        detectChangesOn(changes, 'productName', (v) => {
            this.curProductName = _.cloneDeep(v)
            this.checkFilterValueExist()
            this.getDateText()
        })
        detectChangesOn(changes, 'personInCharge', (v) => {
            this.curPersonInCharge = _.cloneDeep(v)
            this.checkFilterValueExist()
            this.getDateText()
        })
        detectChangesOn(changes, 'date', (v) => {
            this.curDate = _.cloneDeep(v)
            this.checkFilterValueExist()
            this.getDateText()
        })
    }

    ngOnDestroy() {
        this.subject.next(true)
        this.subject.complete()
    }

    public typeName = ''
    setTypeName() {
        switch (this.filterType) {
            case 'date':
                this.typeName = '날짜'
                break
            case 'paymentType':
                this.typeName = '구분'
                break
            case 'member':
                this.typeName = '회원'
                break
            case 'productType':
                this.typeName = '상품 유형'
                break
            case 'productName':
                this.typeName = '상품명'
                break
            case 'personInCharge':
                this.typeName = '결제 담당자'
                break
        }
    }

    // // -- Input() : actually applied value / cur- : current value
    // for date
    @Input() date: DateType = _.cloneDeep(dateInit)
    @Output() dateChange = new EventEmitter<DateType>()
    public curDate: DateType = _.cloneDeep(dateInit)
    onDateSave(event) {
        console.log('before date save : ', event, this.curDate, this.date)
        this.date = _.cloneDeep(event)
        this.getDateText()
        this.openDropdown = false
        this.checkFilterValueExist()

        this.dateChange.emit(this.date)
    }
    checkOneMonthDate() {
        const monthDate = {
            startDate: dayjs(this.date.startDate).startOf('month').format('YYYY-MM-DD'),
            endDate: dayjs(this.date.startDate).endOf('month').format('YYYY-MM-DD'),
        }
        return monthDate.startDate == this.date.startDate && monthDate.endDate == this.date.endDate
    }
    public dateText = ''
    getDateText() {
        if (this.checkOneMonthDate()) {
            this.dateText = dayjs(this.date.startDate).format('YY년 M월')
        } else {
            this.dateText =
                this.date.startDate != '1950-01-01'
                    ? `${dayjs(this.date.startDate).format('YY년 M월 D일')} ~ ${dayjs(this.date.endDate).format(
                          'YY년 M월 D일'
                      )}`
                    : ` ~ ${dayjs(this.date.endDate).format('YY년 M월 D일')}`
        }
    }
    // for payment type
    @Input() paymentType: FilterMapTypeCode = _.cloneDeep(filterMapTypeCodeInit)
    @Output() paymentTypeChange = new EventEmitter<FilterMapTypeCode>()
    onPaymentTypeSave() {
        this.paymentType = this.curPaymentType
        this.openDropdown = false
        this.getSelectedPaymentType()
        this.checkFilterValueExist()

        this.paymentTypeChange.emit(this.paymentType)
    }
    public curPaymentType: FilterMapTypeCode = _.cloneDeep(filterMapTypeCodeInit)
    public selectedPaymentType = ''
    getSelectedPaymentType() {
        const arr = []
        _.forIn(this.curPaymentType, (v, k) => {
            if (k == 'payment_type_refund' && v) {
                arr.push('환불')
            } else if (k == 'payment_type_payment' && v) {
                arr.push('결제')
            } else if (k == 'payment_type_transfer' && v) {
                arr.push('양도')
            }
        })
        this.selectedPaymentType = _.join(arr, ', ')
    }
    // for member
    @Input() member = ''
    @Output() memberChange = new EventEmitter<string>()
    public curMember = ''
    onMemberSave() {
        this.member = this.curMember
        this.openDropdown = false
        this.checkFilterValueExist()

        this.memberChange.emit(this.member)
    }
    // for product type
    @Input() productType: FilterMapProductTypeCode = _.cloneDeep(filterMapProductTypeCodeInit)
    @Output() productTypeChange = new EventEmitter<FilterMapProductTypeCode>()
    onProductTypeSave() {
        this.productType = this.curProductType
        this.openDropdown = false
        this.getSelectedProductType()
        this.checkFilterValueExist()

        this.productTypeChange.emit(this.productType)
    }
    public curProductType: FilterMapProductTypeCode = _.cloneDeep(filterMapProductTypeCodeInit)
    public selectedProductType = ''
    getSelectedProductType() {
        const arr = []
        _.forIn(this.curProductType, (v, k) => {
            if (k == 'user_membership' && v) {
                arr.push('회원권')
            } else if (k == 'user_locker' && v) {
                arr.push('락커')
            } else if (k == 'user_sportswear' && v) {
                arr.push('운동복')
            }
        })
        this.selectedProductType = _.join(arr, ', ')
    }
    // for product name
    @Input() productName = ''
    @Output() productNameChange = new EventEmitter<string>()
    public curProductName = ''
    onProductNameSave() {
        this.productName = this.curProductName
        this.openDropdown = false
        this.checkFilterValueExist()

        this.productNameChange.emit(this.productName)
    }
    // for person in charge
    @Input() personInCharge = ''
    @Output() personInChargeChange = new EventEmitter<string>()
    public curPersonInCharge
    onPersonInChargeSave() {
        this.personInCharge = this.curPersonInCharge
        this.openDropdown = false
        this.checkFilterValueExist()

        this.personInChargeChange.emit(this.personInCharge)
    }

    //

    restoreData() {
        switch (this.filterType) {
            case 'date':
                this.curDate = _.cloneDeep(this.date)
                break
            case 'paymentType':
                this.curPaymentType = _.cloneDeep(this.paymentType)
                break
            case 'member':
                this.curMember = _.cloneDeep(this.member)
                break
            case 'productType':
                this.curProductType = _.cloneDeep(this.productType)
                break
            case 'productName':
                this.curProductName = _.cloneDeep(this.productName)
                break
            case 'personInCharge':
                this.curPersonInCharge = _.cloneDeep(this.personInCharge)
                break
        }
    }

    @Output() onReset = new EventEmitter<FilterType>()
    resetData(filterType: FilterType) {
        this.curDate = _.cloneDeep(dateInit)
        this.date = _.cloneDeep(dateInit)
        this.curPaymentType = _.cloneDeep(filterMapTypeCodeInit)
        this.paymentType = _.cloneDeep(filterMapTypeCodeInit)
        this.curMember = ''
        this.member = ''
        this.curProductType = _.cloneDeep(filterMapProductTypeCodeInit)
        this.productType = _.cloneDeep(filterMapProductTypeCodeInit)
        this.curProductName = ''
        this.productName = ''
        this.curPersonInCharge = ''
        this.personInCharge = ''
        this.checkFilterValueExist()

        this.onReset.emit(filterType)
    }

    public filterValueExist = false
    checkFilterValueExist() {
        switch (this.filterType) {
            case 'date':
                this.filterValueExist =
                    !_.isEmpty(this.date.startDate) ||
                    (!_.isEmpty(this.date.startDate) && !_.isEmpty(this.date.endDate))
                break
            case 'paymentType':
                this.filterValueExist =
                    this.paymentType.payment_type_transfer ||
                    this.paymentType.payment_type_refund ||
                    this.paymentType.payment_type_payment
                break
            case 'member':
                this.filterValueExist = !_.isEmpty(this.member)
                break
            case 'productType':
                this.filterValueExist =
                    this.productType.user_sportswear || this.productType.user_locker || this.productType.user_membership
                break
            case 'productName':
                this.filterValueExist = !_.isEmpty(this.productName)
                break
            case 'personInCharge':
                this.filterValueExist = !_.isEmpty(this.personInCharge)
                break
        }
    }

    protected readonly undefined = undefined
}
