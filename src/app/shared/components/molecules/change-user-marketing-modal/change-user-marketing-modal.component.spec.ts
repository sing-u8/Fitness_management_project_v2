import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChangeUserMarketingModalComponent } from './change-user-marketing-modal.component'

describe('ChangeUserMarketingModalComponent', () => {
    let component: ChangeUserMarketingModalComponent
    let fixture: ComponentFixture<ChangeUserMarketingModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangeUserMarketingModalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ChangeUserMarketingModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
