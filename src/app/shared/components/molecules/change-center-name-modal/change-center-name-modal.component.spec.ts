import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChangeCenterNameModalComponent } from './change-center-name-modal.component'

describe('ChangeCenterNameModalComponent', () => {
    let component: ChangeCenterNameModalComponent
    let fixture: ComponentFixture<ChangeCenterNameModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangeCenterNameModalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ChangeCenterNameModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
