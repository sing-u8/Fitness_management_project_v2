// reference : https://engineering.leanix.net/blog/reactive-angular-components-inputs-observables/
import { BehaviorSubject, Observable } from 'rxjs'

type WithUndefined<T> = T | undefined

export function AsObservable<T>(): PropertyDecorator {
    return (target: any, key: string | symbol): void => {
        // Declare all the active subjects for a given target class instance
        const subjects = new WeakMap<any, BehaviorSubject<WithUndefined<T>>>()

        // Return the associated subject for a given target class instance.
        // In case none is available yet, create one.
        const getSubject = (instance: any): BehaviorSubject<WithUndefined<T>> | undefined => {
            if (!subjects.has(instance)) {
                subjects.set(instance, new BehaviorSubject<WithUndefined<T>>(undefined))
            }
            return subjects.get(instance)
        }

        // Transform the property definition so that we can propagate the value
        // changes to the internal subject, and return its associated observable.
        Object.defineProperty(target, key, {
            get(): Observable<WithUndefined<T>> | undefined {
                return getSubject(this)
            },
            set(instanceNewValue: T) {
                getSubject(this)?.next(instanceNewValue)
            },
        })
    }
}
