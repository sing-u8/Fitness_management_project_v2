import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DebugElement } from '@angular/core'
import { By } from '@angular/platform-browser'

import { ButtonComponent } from './button.component'
import { NgxSpinnerService } from 'ngx-spinner'
import { NgxSpinnerModule } from 'ngx-spinner'

describe('ButtonComponent', () => {
    let component: ButtonComponent
    let fixture: ComponentFixture<ButtonComponent>
    let buttonDe: DebugElement
    let buttonEl: HTMLElement

    const inputObj = {
        width: '300px',
        height: '200px',
        color: 'rgb(227, 74, 94)',
        borderColor: '#f6f6f6',
        borderRadius: '5px',
        fontColor: 'rgb(255, 255, 255)',
        padding: '5px 10px',
        disabled: false,
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ButtonComponent],
            imports: [NgxSpinnerModule],
            providers: [{ provide: NgxSpinnerService }],
        }).compileComponents()
        fixture = TestBed.createComponent(ButtonComponent)
        component = fixture.componentInstance
        buttonDe = fixture.debugElement.query(By.css('.cmp-button'))
        buttonEl = buttonDe.nativeElement
    })

    it('button should set Input', () => {
        component.width = inputObj.width
        component.height = inputObj.height
        component.color = inputObj.color
        component.borderColor = inputObj.borderColor
        component.borderRadius = inputObj.borderRadius
        component.fontColor = inputObj.fontColor
        component.padding = inputObj.padding
        component.disabled = inputObj.disabled
        fixture.detectChanges()

        expect(buttonEl.style.width).withContext('should equal to input width').toEqual(`${inputObj.width}`)
        console.log('style width : ', buttonEl.style.width, inputObj.width)
        expect(buttonEl.style.height).withContext('should equal to input height').toEqual(`${inputObj.height}`)
        expect(buttonEl.style.backgroundColor).withContext('should equal to input color').toEqual(`${inputObj.color}`)
        expect(buttonEl.classList).toContain('cmp-button-type2')
        expect(buttonEl.style.borderRadius)
            .withContext('should equal to input borderRadius')
            .toEqual(`${inputObj.borderRadius}`)
        expect(buttonEl.style.color).withContext('should equal to input fontColor').toEqual(`${inputObj.fontColor}`)
        expect(buttonEl.style.padding).withContext('should equal to input padding').toEqual(`${inputObj.padding}`)
        expect(component.disabled).withContext('can set disabled').toEqual(inputObj.disabled)
    })
    it('button should set borderColor', () => {
        component.borderColor = inputObj.borderColor
        fixture.detectChanges()

        expect(buttonEl.classList).toContain('cmp-button-type1')
    })
    it('button should have cmp-button-type1 class when button do not have color input', () => {
        fixture.detectChanges()
        expect(buttonEl.classList).toContain('cmp-button-type1')
    })
    it('button should not call onClick EventEmitter when disabled is true', () => {
        component.disabled = true
        fixture.detectChanges()

        const clickSpy = spyOn(component, 'onButtonClick')
        buttonDe.triggerEventHandler('click')
        expect(clickSpy).not.toHaveBeenCalled()
    })
    it('button should call onClick EventEmitter when disabled is false', () => {
        component.disabled = false
        fixture.detectChanges()

        const clickSpy = spyOn(component, 'onButtonClick')
        buttonDe.triggerEventHandler('click')
        expect(clickSpy).toHaveBeenCalled()
    })
})
