import { TestBed } from '@angular/core/testing'

import { CenterPaymentsService } from './center-payments.service'

describe('CenterPaymentsService', () => {
    let service: CenterPaymentsService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(CenterPaymentsService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
