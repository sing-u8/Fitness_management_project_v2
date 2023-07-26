import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CenterProductInfoToastComponent } from './center-product-info-toast.component'

describe('CenterProductInfoToastComponent', () => {
    let component: CenterProductInfoToastComponent
    let fixture: ComponentFixture<CenterProductInfoToastComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CenterProductInfoToastComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CenterProductInfoToastComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
