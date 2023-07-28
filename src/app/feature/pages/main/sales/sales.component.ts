import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LetModule } from '@ngrx/component'
import { PushModule } from '@ngrx/component'

import _ from 'lodash'
import dayjs from 'dayjs'

// ngrx
import { Store, select } from '@ngrx/store'
import * as SaleSelector from '@store/main/selectors/sales.selector'
import * as SalesAction from '@store/main/actions/sales.action'
import { showToast } from '@store/app/actions/app.actions'
// rxjs
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import * as SalesReducer from '@store/main/reducers/sales.reducer'
import * as SalesSelector from '@store/main/selectors/sales.selector'
import * as SalesActions from '@store/main/actions/sales.action'

import { StorageService } from '@services/storage.service'
import { SaleSummaryComponent } from '@feature/molecules/main/sale-summary/sale-summary.component'
import { SharedModule } from '@shared/shared.module'
import { FilterType, SaleFilterComponent } from '@feature/molecules/main/sale-filter/sale-filter.component'
import {
    saleSummary,
    saleSummaryLastMonth,
    saleSummaryThisMonth,
    saleSummaryToday,
    saleSummaryYesterday,
} from '@store/main/selectors/sales.selector'
import { FilterMap, FilterMapProductTypeCode, FilterMapTypeCode } from '@store/main/reducers/sales.reducer'
import { Center } from '@schemas/center'
import { Loading } from '@schemas/loading'
import { asExportSales } from '@store/main/actions/sales.action'
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
    selector: 'rwp-sales',
    standalone: true,
    imports: [CommonModule, SaleSummaryComponent, SharedModule, SaleFilterComponent, LetModule, PushModule],
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnDestroy, OnInit {
    public center: Center
    public subject$ = new Subject<boolean>()
    constructor(
        private renderer: Renderer2,
        private nxStore: Store,
        private storageService: StorageService,
        private spinner: NgxSpinnerService
    ) {}
    ngOnInit() {
        this.center = this.storageService.getCenter()
        // setTimeout(() => {
        //     console.log('dispatch asLoadSales !!')
        //     this.nxStore.dispatch(
        //         SalesActions.asLoadSales({
        //             centerId: this.center.id,
        //         })
        //     )
        // }, 2000)

        this.salesInfoSummary$.pipe(takeUntil(this.subject$)).subscribe((v) => {
            this.salesInfoTotalPrice =
                Number(v.sum_card) + Number(v.sum_trans) + Number(v.sum_cash) + Number(v.sum_unpaid)
            this.pageNumber = _.ceil(v.rows / 10)
        })
        this.salesLoading$.pipe(takeUntil(this.subject$)).subscribe((v) => {
            if (v == 'pending') {
                this.spinner.show('sale-table-loading')
            } else {
                this.spinner.hide('sale-table-loading')
            }
        })
        this.filters$.pipe(takeUntil(this.subject$)).subscribe((v) => {
            this.checkFilterApplied(v)
        })
    }

    ngOnDestroy() {
        this.subject$.next(true)
        this.subject$.complete()
    }

    // sale header button vars and funcs
    public showFileDownloadDropdown = false
    public fileDownLoadStatus: Loading = 'idle'
    onFileDownLoad(exportType: 'filtered' | 'all') {
        this.fileDownLoadStatus = 'pending'
        this.nxStore.dispatch(
            SalesAction.asExportSales({
                centerId: this.center.id,
                exportType,
                cb: () => {
                    this.fileDownLoadStatus = 'idle'
                },
            })
        )
    }

    // vars and funcs for filter applied
    public filterApplied = false
    public checkFilterApplied(fm: FilterMap) {
        this.filterApplied = false
        const typeCode = _.some(_.keys(fm.type_code), (v) => fm.type_code[v])
        const member = !_.isEmpty(fm.center_user_phone_number) || !_.isEmpty(fm.center_user_name)
        const productTypeCode = _.some(_.keys(fm.product_type_code), (v) => fm.type_code[v])
        const productName = !_.isEmpty(fm.product_name)
        const personInCharge =
            !_.isEmpty(fm.responsibility_center_user_phone_number) || !_.isEmpty(fm.responsibility_center_user_name)

        this.filterApplied = typeCode || member || productTypeCode || productName || personInCharge
    }

    // filter vars and funcs
    public filters$ = this.nxStore.select(SaleSelector.filters)
    public dateFilter$ = this.nxStore.select(SaleSelector.dateFilter)
    public typeCodeFilter$ = this.nxStore.select(SaleSelector.typeCodeFilter)
    public memberFilter$ = this.nxStore.select(SaleSelector.memberFilter)
    public productTypeCodeFilter$ = this.nxStore.select(SaleSelector.productTypeCodeFilter)
    public productNameFilter$ = this.nxStore.select(SaleSelector.productNameFilter)
    public personInChargeFilter$ = this.nxStore.select(SaleSelector.personInChargeFilter)
    onTypeCodeFilterChange(typeCode: FilterMapTypeCode) {
        this.selectedPageNumber = 1
        this.nxStore.dispatch(SalesAction.setTypeCodeFilter({ typeCode }))
        this.nxStore.dispatch(
            SalesAction.asGetSales({
                centerId: this.center.id,
                pageNumber: this.selectedPageNumber,
                cb: () => {
                    this.nxStore.dispatch(showToast({ text: '‘구분’ 필터가 적용되었어요.' }))
                },
            })
        )
    }
    onMemberFilterChange(member: string) {
        this.selectedPageNumber = 1
        this.nxStore.dispatch(SalesAction.setMemberFilter({ member }))
        this.nxStore.dispatch(
            SalesAction.asGetSales({
                centerId: this.center.id,
                pageNumber: this.selectedPageNumber,
                cb: () => {
                    this.nxStore.dispatch(showToast({ text: '‘회원’ 필터가 적용되었어요.' }))
                },
            })
        )
    }
    onProductTypeCodeFilterChange(productTypeCode: FilterMapProductTypeCode) {
        this.selectedPageNumber = 1
        this.nxStore.dispatch(SalesAction.setProductTypeCodeFilter({ productTypeCode }))
        this.nxStore.dispatch(
            SalesAction.asGetSales({
                centerId: this.center.id,
                pageNumber: this.selectedPageNumber,
                cb: () => {
                    this.nxStore.dispatch(showToast({ text: '‘상품 유형’ 필터가 적용되었어요.' }))
                },
            })
        )
    }
    onProductNameFilterChange(productName: string) {
        this.selectedPageNumber = 1
        this.nxStore.dispatch(SalesAction.setProductNameFilter({ productName }))
        this.nxStore.dispatch(
            SalesAction.asGetSales({
                centerId: this.center.id,
                pageNumber: this.selectedPageNumber,
                cb: () => {
                    this.nxStore.dispatch(showToast({ text: '‘상품명’ 필터가 적용되었어요.' }))
                },
            })
        )
    }
    onPersonInChargeFilterChange(personInCharge: string) {
        this.selectedPageNumber = 1
        this.nxStore.dispatch(SalesAction.setPersonInChargeFilter({ personInCharge }))
        this.nxStore.dispatch(
            SalesAction.asGetSales({
                centerId: this.center.id,
                pageNumber: this.selectedPageNumber,
                cb: () => {
                    this.nxStore.dispatch(showToast({ text: '‘결제 담당자’ 필터가 적용되었어요.' }))
                },
            })
        )
    }
    onDateFilterChange(date: { startDate: string; endDate: string }) {
        this.selectedPageNumber = 1
        this.nxStore.dispatch(SalesAction.setDateFilter({ date }))
        this.nxStore.dispatch(
            SalesAction.asGetSales({
                centerId: this.center.id,
                pageNumber: this.selectedPageNumber,
                cb: () => {
                    this.nxStore.dispatch(showToast({ text: '매출 조회 기간이 변경되었어요.' }))
                },
            })
        )
    }

    onResetFilter(type: FilterType) {
        switch (type) {
            case 'date':
                break
            case 'member':
                this.nxStore.dispatch(SalesAction.setMemberFilter({ member: '' }))
                break
            case 'paymentType':
                this.nxStore.dispatch(
                    SalesAction.setTypeCodeFilter({
                        typeCode: {
                            payment_type_transfer: false,
                            payment_type_payment: false,
                            payment_type_refund: false,
                        },
                    })
                )
                break
            case 'productType':
                this.nxStore.dispatch(
                    SalesAction.setProductTypeCodeFilter({
                        productTypeCode: {
                            user_locker: false,
                            user_membership: false,
                            user_sportswear: false,
                        },
                    })
                )
                break
            case 'productName':
                this.nxStore.dispatch(SalesAction.setProductNameFilter({ productName: '' }))
                break
            case 'personInCharge':
                this.nxStore.dispatch(SalesAction.setPersonInChargeFilter({ personInCharge: '' }))
                break
        }
        this.selectedPageNumber = 1
        this.nxStore.dispatch(SalesAction.asGetSales({ centerId: this.center.id, pageNumber: this.selectedPageNumber }))
    }
    resetFilters() {
        this.selectedPageNumber = 1
        this.nxStore.dispatch(SalesAction.resetFilters())
        this.nxStore.dispatch(
            SalesAction.asGetSales({
                centerId: this.center.id,
                pageNumber: this.selectedPageNumber,
                cb: () => {
                    this.nxStore.dispatch(showToast({ text: '필터가 초기화되었어요.' }))
                },
            })
        )
    }

    public saleSummaryThisMonth$ = this.nxStore.select(SaleSelector.saleSummaryThisMonth)
    public saleSummaryLastMonth$ = this.nxStore.select(SaleSelector.saleSummaryLastMonth)
    public saleSummaryToday$ = this.nxStore.select(SaleSelector.saleSummaryToday)
    public saleSummaryYesterday$ = this.nxStore.select(SaleSelector.saleSummaryYesterday)

    public sales$ = this.nxStore.select(SaleSelector.sales)
    public salesInfoSummary$ = this.nxStore.select(SaleSelector.salesInfoSummary)
    public salesLoading$ = this.nxStore.select(SaleSelector.statsSalesInfoLoading)
    public salesInfoTotalPrice = 0
    public pageNumber = 1
    public selectedPageNumber = 1
    onPageNumberClick(e: { selectedPageNumber: number; pageRange: [number, number] }) {
        this.selectedPageNumber = e.selectedPageNumber
        this.nxStore.dispatch(SalesAction.asGetSales({ centerId: this.center.id, pageNumber: this.selectedPageNumber }))
    }
}
