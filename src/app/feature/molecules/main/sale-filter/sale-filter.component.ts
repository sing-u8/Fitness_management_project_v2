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
} from '@angular/core'

import _ from 'lodash'

import { Observe } from '@shared/helper/decorator/Observe'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { FilterMapProductTypeCode, FilterMapTypeCode } from '@store/main/reducers/sales.reducer'

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
    imports: [CommonModule, SharedModule],
    templateUrl: './sale-filter.component.html',
    styleUrls: ['./sale-filter.component.scss'],
})
export class SaleFilterComponent implements OnInit, OnDestroy {
    @Input() filterType: FilterType = undefined
    @Observe('filterType') filterType$: Observable<FilterType>

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
    }
    onClickOutside() {
        if (this.openDropdown) {
            this.openDropdown = false
            this.restoreData()
            this.checkFilterValueExist()
        }
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
    ngOnInit() {
        this.filterType$.pipe(takeUntil(this.subject)).subscribe(() => {
            this.setTypeName()
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
    public curDate: DateType = _.cloneDeep(dateInit)
    // for payment type
    @Input() paymentType: FilterMapTypeCode = _.cloneDeep(filterMapTypeCodeInit)
    @Output() paymentTypeChange = new EventEmitter<FilterMapTypeCode>()
    onPaymentTypeSave() {
        this.paymentType = this.curPaymentType
        this.openDropdown = false
        this.getSelectedPaymentType()
        this.checkFilterValueExist()
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
    public curMember = ''
    onMemberSave() {
        this.member = this.curMember
        this.openDropdown = false
        this.checkFilterValueExist()
    }
    // for product type
    @Input() productType: FilterMapProductTypeCode = _.cloneDeep(filterMapProductTypeCodeInit)
    @Output() productTypeChange = new EventEmitter<FilterMapProductTypeCode>()
    onProductTypeSave() {
        this.productType = this.curProductType
        this.openDropdown = false
        this.getSelectedProductType()
        this.checkFilterValueExist()
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
    public curProductName = ''
    onProductNameSave() {
        this.productName = this.curProductName
        this.openDropdown = false
        this.checkFilterValueExist()
    }
    // for person in charge
    @Input() personInCharge = ''
    public curPersonInCharge
    onPersonInChargeSave() {
        this.personInCharge = this.curPersonInCharge
        this.openDropdown = false
        this.checkFilterValueExist()
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
    resetData() {
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
    }

    public filterValueExist = false
    checkFilterValueExist() {
        switch (this.filterType) {
            case 'date':
                this.filterValueExist = !_.isEmpty(this.date.startDate) && !_.isEmpty(this.date.endDate)
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
        console.log('check filter value exist : ', this.paymentType, this.filterValueExist)
    }
}
