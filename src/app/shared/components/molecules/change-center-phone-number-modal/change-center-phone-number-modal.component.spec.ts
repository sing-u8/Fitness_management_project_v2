import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChangeCenterPhoneNumberModalComponent } from './change-center-phone-number-modal.component'

describe('ChangeCenterPhoneNumberModalComponent', () => {
    let component: ChangeCenterPhoneNumberModalComponent
    let fixture: ComponentFixture<ChangeCenterPhoneNumberModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangeCenterPhoneNumberModalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ChangeCenterPhoneNumberModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
