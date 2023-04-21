import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CloseFillComponent } from './close-fill.component'

describe('CloseFillComponent', () => {
    let component: CloseFillComponent
    let fixture: ComponentFixture<CloseFillComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CloseFillComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CloseFillComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
