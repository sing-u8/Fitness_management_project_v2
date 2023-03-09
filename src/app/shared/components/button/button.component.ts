import {
    Component,
    ViewChild,
    ElementRef,
    Input,
    Output,
    OnInit,
    Renderer2,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    AfterViewInit,
    EventEmitter,
    RendererStyleFlags2,
} from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'

import { ButtonEmit } from '@schemas/components/button'

import { detectChangesFor } from '@shared/helper/component-helper'

@Component({
    selector: 'rw-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit {
    @Input() width: string
    @Input() height: string
    @Input() color: string
    @Input() borderColor: string
    @Input() borderRadius: string
    @Input() fontColor: string
    @Input() padding: string
    @Input() disabled: boolean
    @Input() loadingColor = '#fff'
    @Input() loadingSize: 'small' | 'default' | 'medium' | 'large' = 'default'
    @Input() loadingName = 'loading-button'

    @Output() onClick = new EventEmitter<ButtonEmit>()
    onButtonClick() {
        this.onClick.emit({
            showLoading: this.showLoading.bind(this),
            hideLoading: this.hideLoading.bind(this),
        })
    }

    @ViewChild('rw_button') button_el: ElementRef

    public isLoading: boolean
    showLoading() {
        this.isLoading = true
        this.spinner.show(this.loadingName)
    }
    hideLoading() {
        this.isLoading = false
        this.spinner.hide(this.loadingName)
    }

    public changed = false

    constructor(private renderer: Renderer2, private spinner: NgxSpinnerService) {}

    ngOnChanges(changes: SimpleChanges): void {
        detectChangesFor(changes, 'disabled', () => {
            this.changed = true
        })
        detectChangesFor(changes, 'width', () => {
            this.changed = true
            this.renderer.setStyle(this.button_el.nativeElement, 'width', `${this.width}`)
        })
        detectChangesFor(changes, 'height', () => {
            this.changed = true
            this.renderer.setStyle(this.button_el.nativeElement, 'height', `${this.height}`)
        })
    }
    ngAfterViewInit(): void {
        if (this.width) {
            this.renderer.setStyle(this.button_el.nativeElement, 'width', `${this.width}`)
        }

        if (this.height) {
            this.renderer.setStyle(this.button_el.nativeElement, 'height', `${this.height}`)
        }

        if (this.padding) {
            this.renderer.setStyle(this.button_el.nativeElement, 'padding', `${this.padding}`)
        }

        if (this.color) {
            this.renderer.setStyle(this.button_el.nativeElement, 'backgroundColor', `${this.color}`)
            this.renderer.setStyle(this.button_el.nativeElement, 'color', 'var(--white)', RendererStyleFlags2.Important)
            this.renderer.addClass(this.button_el.nativeElement, 'cmp-button-type2')
        } else {
            this.renderer.addClass(this.button_el.nativeElement, 'cmp-button-type1')
        }

        if (this.borderColor) {
            this.renderer.setStyle(this.button_el.nativeElement, 'border', `1px solid ${this.borderColor}`)
            this.renderer.addClass(this.button_el.nativeElement, 'cmp-button-type1')
        }

        if (this.fontColor) {
            this.renderer.setStyle(this.button_el.nativeElement, 'color', `${this.fontColor}`)
        }

        if (this.disabled) {
            this.renderer.addClass(this.button_el.nativeElement, 'cmp-button-disabled')
            if (this.borderColor) {
                this.renderer.setStyle(this.button_el.nativeElement, 'border', `1px solid transparent`)
            }
        }

        if (this.borderRadius) {
            this.renderer.setStyle(this.button_el.nativeElement, 'borderRadius', `${this.borderRadius}`)
        }
    }
    ngOnInit(): void {}
    ngAfterViewChecked(): void {
        if (this.changed) {
            this.changed = false

            if (this.disabled) {
                this.renderer.addClass(this.button_el.nativeElement, 'cmp-button-disabled')

                if (this.borderColor) {
                    this.renderer.setStyle(this.button_el.nativeElement, 'border', `1px solid transparent`)
                }
            } else {
                this.renderer.removeClass(this.button_el.nativeElement, 'cmp-button-disabled')

                if (this.borderColor) {
                    this.renderer.setStyle(this.button_el.nativeElement, 'border', `1px solid ${this.borderColor}`)
                }
            }
        }
    }
}
