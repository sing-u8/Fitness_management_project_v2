import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
// Test Host Component //
import { Component, DebugElement, SimpleChange } from '@angular/core'
import { By } from '@angular/platform-browser'

import { ModalComponent } from './modal.component'

describe('ModalComponent', () => {
    let cmp: ModalComponent
    let fixture: ComponentFixture<ModalComponent>
    let modalDe: DebugElement
    let modalEl: HTMLElement
    let modalBgDe: DebugElement
    let modalBgEl: HTMLElement

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModalComponent],
        }).compileComponents()
        fixture = TestBed.createComponent(ModalComponent)
        cmp = fixture.componentInstance
        modalBgDe = fixture.debugElement.query(By.css('.rw-modal-background'))
        modalBgEl = modalBgDe.nativeElement
        modalDe = fixture.debugElement.query(By.css('.rw-modal-wrapper'))
        modalEl = modalDe.nativeElement
        fixture.detectChanges()
    })

    it('should be invisible when visible property is false', fakeAsync(() => {
        cmp.visible = false
        cmp.ngOnChanges({
            visible: new SimpleChange(false, cmp.visible, false),
        })
        tick()
        fixture.detectChanges()
        expect(modalBgEl.classList).toContain('rw-modal-background')
        expect(modalBgEl.classList).not.toContain('rw-modal-background-show')
        expect(modalBgEl.classList).not.toContain('display-block')
        expect(modalEl.classList).not.toContain('rw-modal-wrapper-show')
        expect(modalEl.classList).not.toContain('display-flex')
    }))
    it('should be visible when visible property is true', fakeAsync(() => {
        cmp.visible = true
        cmp.ngOnChanges({
            visible: new SimpleChange(false, cmp.visible, false),
        })
        tick(200)
        fixture.detectChanges()
        expect(modalBgEl.classList).toContain('rw-modal-background-show')
        expect(modalBgEl.classList).toContain('display-block')
        expect(modalEl.classList).toContain('rw-modal-wrapper-show')
        expect(modalEl.classList).toContain('display-flex')
    }))
    it('should have two buttons when type is type1 and have one when type is other value', () => {
        const textEl = fixture.debugElement.nativeElement.querySelector('div.text')
        const subTextEl = fixture.debugElement.nativeElement.querySelector('div.sub-text')
        const cancelEl = fixture.debugElement.nativeElement.querySelector('div.cancel')
        const confirmEl = fixture.debugElement.nativeElement.querySelector('div.confirm')

        cmp.data = {
            text: 'test text',
            subText: 'test subText',
            cancelButtonText: 'cancel button text',
            confirmButtonText: 'confirm button text',
        }

        fixture.detectChanges()
        expect(textEl.innerText).toContain(cmp.data.text)
        expect(subTextEl.innerText).toContain(cmp.data.subText)
        expect(cancelEl.innerText).toContain(cmp.data.cancelButtonText)
        expect(confirmEl.innerText).toContain(cmp.data.confirmButtonText)
        expect(fixture.debugElement.query(By.css('.cancel')))
            .withContext('show cancel tag when type is type1')
            .not.toBeNull()

        cmp.type = 'type2'
        fixture.detectChanges()
        // test for element to be null when using ngIf
        expect(fixture.debugElement.query(By.css('.cancel')))
            .withContext('hide cancel tag when type is type1')
            .toBeNull()
    })

    // it('should show data property texts', () => {})
})

describe('ModalComponent on HostComponent', () => {
    let hostCmp: TestHostComponent
    let hostFixture: ComponentFixture<TestHostComponent>
    let cmp: ModalComponent
    let fixture: ComponentFixture<ModalComponent>
    let modalDe: DebugElement

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModalComponent, TestHostComponent],
        }).compileComponents()
    })
    beforeEach(() => {
        hostFixture = TestBed.createComponent(TestHostComponent)
        hostCmp = hostFixture.componentInstance
        // 호스트 컴포넌트 안의 컴포넌트를 가져오는 방법
        modalDe = hostFixture.debugElement.query(By.directive(ModalComponent))
        cmp = modalDe.componentInstance
        hostFixture.detectChanges()
    })

    it('open modal when call openModal func', () => {
        hostCmp.openModal()
        hostFixture.detectChanges()
        expect(hostCmp.visible).toEqual(true)

        const clickSpy = spyOn(hostCmp, 'onModalCancel')
        modalDe.query(By.css('.cancel')).triggerEventHandler('click')
        expect(clickSpy).toHaveBeenCalled()
    })
})

@Component({
    template: `<rw-modal
        [(visible)]="visible"
        [blockClickOutside]="blockClickOutside"
        (confirm)="onModalConfirm()"
        (cancel)="onModalCancel()"
    ></rw-modal> `,
})
class TestHostComponent {
    public blockClickOutside = false
    public visible = false
    openModal() {
        this.visible = true
    }
    closeModal() {
        this.visible = false
    }
    onModalConfirm() {
        this.closeModal()
    }
    onModalCancel() {
        this.closeModal()
    }
}
