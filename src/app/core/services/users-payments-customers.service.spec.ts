import { TestBed } from '@angular/core/testing'

import { UsersPaymentsCustomersService } from './users-payments-customers.service'

describe('UsersPaymentsCustomersService', () => {
    let service: UsersPaymentsCustomersService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(UsersPaymentsCustomersService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
