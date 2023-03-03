import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
} from '@angular/core'

import { setVisibleOnChange } from '@shared/helper/modal-helper'

@Component({
    selector: 'rw-terms-privacy',
    templateUrl: './terms-privacy.component.html',
    styleUrls: ['./terms-privacy.component.scss'],
})
export class TermsPrivacyComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()

    changed: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges) {
        setVisibleOnChange(changes, this.renderer, this.modalBackgroundElement, this.modalWrapperElement)
    }

    ngAfterViewChecked() {}

    onCancel(): void {
        this.cancel.emit({})
    }

    openKoplco() {
        window.open('https://kopico.go.kr/main/main.do')
    }
    openPrivacy() {
        window.open('https://privacy.klsa.or.kr')
    }
    openSpo() {
        window.open('https://spo.go.kr')
    }
    openCyberbureau() {
        window.open('https://cyberbureau.police.go.kr')
    }
}
