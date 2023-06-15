import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChangeUserGenderModalComponent } from './change-user-gender-modal.component'

describe('ChangeUserGenderModalComponent', () => {
    let component: ChangeUserGenderModalComponent
    let fixture: ComponentFixture<ChangeUserGenderModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangeUserGenderModalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ChangeUserGenderModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
