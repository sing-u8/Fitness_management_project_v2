import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VacantTooltipComponent } from './vacant-tooltip.component'

describe('VacantTooltipComponent', () => {
    let component: VacantTooltipComponent
    let fixture: ComponentFixture<VacantTooltipComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VacantTooltipComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(VacantTooltipComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
