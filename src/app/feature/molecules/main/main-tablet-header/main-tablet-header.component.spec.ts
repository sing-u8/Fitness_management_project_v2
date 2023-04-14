import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MainTabletHeaderComponent } from './main-tablet-header.component'

describe('MainTabletHeaderComponent', () => {
    let component: MainTabletHeaderComponent
    let fixture: ComponentFixture<MainTabletHeaderComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MainTabletHeaderComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(MainTabletHeaderComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
