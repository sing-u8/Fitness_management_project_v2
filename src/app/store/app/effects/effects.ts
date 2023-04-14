import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'

@Injectable()
export class AppEffect {
    constructor(private actions$: Actions, private nxStore: Store) {}
}
