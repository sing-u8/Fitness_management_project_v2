import { TestBed } from '@angular/core/testing'

import { UsersCustomersService } from './users-customers.service'

describe('UsersCustomersService', () => {
    let service: UsersCustomersService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(UsersCustomersService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
