import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SetCenterEmployeeCardComponent } from './set-center-employee-card.component'

describe('SetCenterEmployeeCardComponent', () => {
    let component: SetCenterEmployeeCardComponent
    let fixture: ComponentFixture<SetCenterEmployeeCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetCenterEmployeeCardComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(SetCenterEmployeeCardComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
