import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CircleBoldComponent } from './circle-bold.component'

describe('CircleBoldComponent', () => {
    let component: CircleBoldComponent
    let fixture: ComponentFixture<CircleBoldComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CircleBoldComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CircleBoldComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
