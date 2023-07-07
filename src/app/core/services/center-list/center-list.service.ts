import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { Center } from '@schemas/center'

@Injectable({
    providedIn: 'root',
})
export class CenterListService {
    constructor() {}

    public readonly centerChangeSubject = new Subject<Center>()
    setChangedCenter(center: Center) {
        this.centerChangeSubject.next(center)
    }
}
