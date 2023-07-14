import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CenterMembershipCardComponent } from './center-membership-card.component'

describe('CenterMembershipCardComponent', () => {
    let component: CenterMembershipCardComponent
    let fixture: ComponentFixture<CenterMembershipCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CenterMembershipCardComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CenterMembershipCardComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
