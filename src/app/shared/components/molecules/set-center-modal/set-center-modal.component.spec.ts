import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SetCenterModalComponent } from './set-center-modal.component'

describe('SetCenterModalComponent', () => {
    let component: SetCenterModalComponent
    let fixture: ComponentFixture<SetCenterModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetCenterModalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(SetCenterModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
