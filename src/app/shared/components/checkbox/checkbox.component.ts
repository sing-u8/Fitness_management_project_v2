import { Component, Input, ElementRef, Renderer2, AfterViewInit } from '@angular/core'

@Component({
    selector: 'rw-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements AfterViewInit {
    @Input() checked = false
    @Input() text = ''
    @Input() disabled = false
    @Input() noOpacity = false

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngAfterViewInit(): void {}
}
