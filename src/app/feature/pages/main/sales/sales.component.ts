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

@Component({
    selector: 'rwp-sales',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.scss'],
})
export class SalesComponent {
    constructor(private renderer: Renderer2, private nxStore: Store, private storageService: StorageService) {
        const center = this.storageService.getCenter()
        setTimeout(() => {
            console.log('dispatch asLoadSales !!')
            this.nxStore.dispatch(
                SalesActions.asLoadSales({
                    centerId: center.id,
                    startDate: '2023-05-01',
                    endDate: '2023-06-01',
                })
            )
        }, 3000)
    }
}
