import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChangeCenterAddressModalComponent } from './change-center-address-modal.component'

describe('ChangeCenterAddressModalComponent', () => {
    let component: ChangeCenterAddressModalComponent
    let fixture: ComponentFixture<ChangeCenterAddressModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangeCenterAddressModalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ChangeCenterAddressModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
