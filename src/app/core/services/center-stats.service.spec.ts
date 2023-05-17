import { TestBed } from '@angular/core/testing'

import { CenterStatsService } from './center-stats.service'

describe('StatsService', () => {
    let service: CenterStatsService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(CenterStatsService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
