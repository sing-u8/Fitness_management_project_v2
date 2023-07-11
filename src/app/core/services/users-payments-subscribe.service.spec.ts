import { TestBed } from '@angular/core/testing'

import { UsersPaymentsSubscribeService } from './users-payments-subscribe.service'

describe('UsersPaymentsSubscribeService', () => {
    let service: UsersPaymentsSubscribeService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(UsersPaymentsSubscribeService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
