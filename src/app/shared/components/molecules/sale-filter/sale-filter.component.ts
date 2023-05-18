import { Component, Input, OnDestroy, OnInit } from '@angular/core'

import { Observe } from '@shared/helper/decorator/Observe'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

export type FilterType = 'date' | 'paymentType' | 'member' | 'productType' | 'productName' | 'personInCharge'

@Component({
    selector: 'rwm-sale-filter',
    templateUrl: './sale-filter.component.html',
    styleUrls: ['./sale-filter.component.scss'],
})
export class SaleFilterComponent implements OnInit, OnDestroy {
    @Input() filterType: FilterType = undefined
    @Observe('filterType') filterType$: Observable<FilterType>

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
    public subject = new Subject<boolean>()

    // for date
    // for payment type
    // for member
    // for product type
    // for product name
    // for person in charge

    constructor() {}
    ngOnInit() {
        this.filterType$.pipe(takeUntil(this.subject)).subscribe(() => {
            this.setTypeName()
        })
    }
    ngOnDestroy() {
        this.subject.next(true)
        this.subject.complete()
    }
}
