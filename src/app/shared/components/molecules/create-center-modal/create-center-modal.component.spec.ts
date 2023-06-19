import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CreateCenterModalComponent } from './create-center-modal.component'

describe('CreateCenterModalComponent', () => {
    let component: CreateCenterModalComponent
    let fixture: ComponentFixture<CreateCenterModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateCenterModalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CreateCenterModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
