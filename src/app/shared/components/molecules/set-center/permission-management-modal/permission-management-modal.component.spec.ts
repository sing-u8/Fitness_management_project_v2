import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PermissionManagementModalComponent } from './permission-management-modal.component'

describe('PermissionManagementModalComponent', () => {
    let component: PermissionManagementModalComponent
    let fixture: ComponentFixture<PermissionManagementModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PermissionManagementModalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(PermissionManagementModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
