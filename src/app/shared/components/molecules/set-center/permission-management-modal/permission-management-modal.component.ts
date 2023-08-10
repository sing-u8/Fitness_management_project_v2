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
    AfterViewInit,
    OnInit,
    OnDestroy,
} from '@angular/core'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner'

import { UsersService } from '@services/users.service'
import { CenterRolePermissionService, UpdateRolePermissionReqBody } from '@services/center-role-permission.service'

import { Loading } from '@schemas/loading'

import { changesOn } from '@shared/helper/component-helper'

import _ from 'lodash'

import { showToast } from '@store/app/actions/app.actions'
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { Role, RolePermission } from '@schemas/role-permission'
import { Center } from '@schemas/center'
import { AuthErrors } from '@schemas/errors/auth-errors'

@Component({
    selector: 'rwm-permission-management-modal',
    templateUrl: './permission-management-modal.component.html',
    styleUrls: ['./permission-management-modal.component.scss'],
})
export class PermissionManagementModalComponent
    implements OnInit, OnChanges, AfterViewChecked, AfterViewInit, OnDestroy
{
    @Input() enableToUpdate = false
    @Input() loading: Loading = 'idle'
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() center: Center
    // 현재 API에서 디자인 순서대로 값을 주고있는데 나중에 그렇지 못할 경우 sequence_number에 맞게 정렬할 필요가 생김
    @Input() rolePermission: Record<Role, RolePermission[]> = {
        administrator: [],
        instructor: [],
    }
    public _rolePermission: Record<Role, RolePermission[]> = {
        administrator: [],
        instructor: [],
    }
    @Output() onSave = new EventEmitter<Record<Role, RolePermission[]>>()

    @Input() blockClickOutside = true

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('body') bodyElement: ElementRef

    public updateButtonLoading: Loading = 'idle'

    public unDescriber$ = new Subject<boolean>()
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private centerRolePermissionService: CenterRolePermissionService,
        private spinner: NgxSpinnerService,
        private usersService: UsersService,
        private nxStore: Store,
        public location: Location,
        public router: Router
    ) {}

    ngOnInit() {}
    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'visible', (v) => {
            if (v) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
                this.initRps()
            }
        })

        changesOn(changes, 'rolePermission', (v) => {
            this.initRps()
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}
    ngOnDestroy() {
        this.unDescriber$.next(true)
        this.unDescriber$.complete()
    }

    saveRolePermission() {
        const reqBody: UpdateRolePermissionReqBody = {
            administrator: _.map(this._rolePermission.administrator, (v) => ({
                code: v.code,
                approved: v.approved,
            })),
            instructor: _.map(this._rolePermission.instructor, (v) => ({
                code: v.code,
                approved: v.approved,
            })),
        }
        console.log('saveRolePermission -- req body : ', reqBody)

        this.updateButtonLoading = 'pending'
        this.centerRolePermissionService.updateRolePermission(this.center.id, reqBody).subscribe({
            next: () => {
                this.updateButtonLoading = 'idle'
                this.nxStore.dispatch(showToast({ text: '권한이 저장되었어요.' }))
                this.onSave.emit(this._rolePermission)
                this.close.emit()
            },
            error: (err) => {
                this.updateButtonLoading = 'idle'
                if (!_.isEmpty(AuthErrors[err.code])) this.nxStore.dispatch(showToast({ text: AuthErrors[err.code] }))
            },
        })
    }

    // -----------------------------------------------------------------------------------------------------------
    initRps() {
        _.forEach(this.rolePermission.administrator, (v1, idx) => {
            this.rolePermission.administrator[idx].approved = _.isBoolean(v1.approved) ? v1.approved : true
        })
        _.forEach(this.rolePermission.instructor, (v2, idx) => {
            this.rolePermission.instructor[idx].approved = _.isBoolean(v2.approved) ? v2.approved : false
        })
        this._rolePermission = _.cloneDeep(this.rolePermission)
        console.log('initRps -- ', this.rolePermission, this._rolePermission)
    }

    // -----------------------------------------------------------------------------------------------------------

    @Output() close = new EventEmitter()
    public scrollTop = 0
    onClose(keepScroll = true): void {
        this.scrollTop = keepScroll ? this.bodyElement.nativeElement.scrollTop : 0
        this.close.emit()
    }
    // on mouse rw-modal down
    public isMouseModalDown = false
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
