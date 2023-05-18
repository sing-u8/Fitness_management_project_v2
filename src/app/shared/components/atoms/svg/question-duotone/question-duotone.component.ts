import { Component, Input } from "@angular/core";

@Component({
    selector: 'rwa-svg-question-duotone',
    templateUrl: './question-duotone.component.svg',
    styleUrls: ['./question-duotone.component.scss'],
})
export class QuestionDuotoneComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() innerColor = 'var(--gray-90)'
    @Input() width = '24px'
    @Input() height = '24px'
    @Input() margin = '0 0 0 0'
}