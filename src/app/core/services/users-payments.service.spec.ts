import { TestBed } from '@angular/core/testing'

import { UsersPaymentsService } from './users-payments.service'

describe('UsersPaymentsService', () => {
    let service: UsersPaymentsService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(UsersPaymentsService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
