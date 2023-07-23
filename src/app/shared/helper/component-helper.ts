import { SimpleChanges } from '@angular/core'

export function detectChangesOn(
    changes: SimpleChanges,
    inputProp: string,
    changeFn: (curValue?: any, prevValue?: any) => void
) {
    if (changes[inputProp] && changes[inputProp].previousValue != changes[inputProp].currentValue) {
        changeFn(changes[inputProp].currentValue, changes[inputProp].previousValue)
    }
}

export function changesOn(
    changes: SimpleChanges,
    inputProp: string,
    changeFn: (curValue?: any, prevValue?: any) => void
) {
    if (
        changes[inputProp] &&
        !changes[inputProp].firstChange &&
        changes[inputProp].previousValue != changes[inputProp].currentValue
    ) {
        changeFn(changes[inputProp].currentValue, changes[inputProp].previousValue)
    }
}
