import { TestBed } from '@angular/core/testing'

import { PaymentStatusHelperService } from './payment-status-helper.service'

describe('PaymentStatusHelperService', () => {
    let service: PaymentStatusHelperService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(PaymentStatusHelperService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
