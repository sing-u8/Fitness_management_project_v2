import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TmDatepickerComponent } from './tm-datepicker.component'

describe('TmDatepcikerComponent', () => {
    let component: TmDatepickerComponent
    let fixture: ComponentFixture<TmDatepickerComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TmDatepickerComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(TmDatepickerComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
