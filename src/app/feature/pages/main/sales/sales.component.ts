import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'

import _ from 'lodash'
import dayjs from 'dayjs'

// ngrx
import { Store, select } from '@ngrx/store'
import { showToast } from '@store/app/actions/toast.action'
// rxjs
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import * as SalesReducer from '@store/main/reducers/sales.reducer'
import * as SalesSelector from '@store/main/selectors/sales.selector'
import * as SalesActions from '@store/main/actions/sales.action'

import { StorageService } from '@services/storage.service'
import { SaleSummaryComponent } from '@feature/molecules/main/sale-summary/sale-summary.component'
import { SharedModule } from '@shared/shared.module'
import { SaleFilterComponent } from '@feature/molecules/main/sale-filter/sale-filter.component'

@Component({
    selector: 'rwp-sales',
    standalone: true,
    imports: [CommonModule, SaleSummaryComponent, SharedModule, SaleFilterComponent],
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnDestroy, OnInit {
    constructor(private renderer: Renderer2, private nxStore: Store, private storageService: StorageService) {}
    ngOnInit() {
        const center = this.storageService.getCenter()
        // setTimeout(() => {
        //     console.log('dispatch asLoadSales !!')
        //     this.nxStore.dispatch(
        //         SalesActions.asLoadSales({
        //             centerId: center.id,
        //             startDate: '2023-05-01',
        //             endDate: '2023-06-01',
        //         })
        //     )
        // }, 3000)
    }

    ngOnDestroy() {}

    // sale header button vars and funcs
    public showFileDownloadDropdown = false

    // filter vars and funcs
    public dateFilter = {
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    }
}
