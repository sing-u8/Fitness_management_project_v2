import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DebugElement } from '@angular/core'
import { By } from '@angular/platform-browser'

import { CheckboxComponent } from './checkbox.component'

describe('CheckBoxComponent', () => {
    let cmp: CheckboxComponent
    let fixture: ComponentFixture<CheckboxComponent>
    let checkBoxDe: DebugElement
    let checkBoxEl: HTMLElement

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CheckboxComponent],
        }).compileComponents()
        fixture = TestBed.createComponent(CheckboxComponent)
        cmp = fixture.componentInstance
        checkBoxDe = fixture.debugElement.query(By.css('.rw-checkbox'))
        checkBoxEl = checkBoxDe.nativeElement
        fixture.detectChanges()
    })

    it('test for noOpacity Input Property', () => {
        expect(cmp.noOpacity).withContext('should be false').toBe(false)
        expect(checkBoxEl.classList).withContext('should have not no-opacity class').not.toContain('no-opacity')

        cmp.noOpacity = true
        fixture.detectChanges()
        expect(cmp.noOpacity).withContext('should be true').toBe(true)
        expect(checkBoxEl.classList).withContext('should have no-opacity class').toContain('no-opacity')
    })

    it('test for disabled Input Property', () => {
        expect(cmp.disabled).withContext('should be false').toBe(false)
        expect(checkBoxEl.classList).withContext('should have not disabled class').not.toContain('disabled')

        cmp.disabled = true
        fixture.detectChanges()
        expect(cmp.disabled).withContext('should be true').toBe(true)
        expect(checkBoxEl.classList).withContext('should have disabled class').toContain('disabled')
    })

    it('test for checked Input Property', () => {
        expect(cmp.checked).withContext('should be false').toBe(false)
        expect(checkBoxEl.classList).withContext('should have not checked class').not.toContain('checked')

        cmp.checked = true
        fixture.detectChanges()
        expect(cmp.checked).withContext('should be true').toBe(true)
        expect(checkBoxEl.classList).withContext('should have checked class').toContain('checked')
    })

    it('test for text Input Property', () => {
        expect(cmp.text).withContext("should be ''").toEqual('')

        cmp.text = 'string for test'
        fixture.detectChanges()
        const textEl = fixture.debugElement.query(By.css('.text')).nativeElement
        expect(textEl.innerText).withContext('should be').toBe(cmp.text)
    })
})
