import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PaymentCardListItemComponent } from './payment-card-list-item.component'

describe('PaymentCardListItemComponent', () => {
    let component: PaymentCardListItemComponent
    let fixture: ComponentFixture<PaymentCardListItemComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PaymentCardListItemComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(PaymentCardListItemComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
