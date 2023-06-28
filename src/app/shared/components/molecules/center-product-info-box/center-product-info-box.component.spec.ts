import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CenterProductInfoBoxComponent } from './center-product-info-box.component'

describe('CenterProductInfoBoxComponent', () => {
    let component: CenterProductInfoBoxComponent
    let fixture: ComponentFixture<CenterProductInfoBoxComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CenterProductInfoBoxComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(CenterProductInfoBoxComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
