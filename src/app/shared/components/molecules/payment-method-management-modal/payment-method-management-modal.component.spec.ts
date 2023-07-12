import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PaymentMethodManagementModalComponent } from './payment-method-management-modal.component'

describe('PaymentMethodManagementModalComponent', () => {
    let component: PaymentMethodManagementModalComponent
    let fixture: ComponentFixture<PaymentMethodManagementModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PaymentMethodManagementModalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(PaymentMethodManagementModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
