import { Component, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { DirectivesModule } from '@shared/directives/directives.module'
import { Observe } from '@shared/helper/decorator/Observe'

import {
    AsyncValidatorFn,
    ValidatorFn,
    FormBuilder,
    FormControl,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms'

import { Loading } from '@schemas/loading'
import { TabInput } from '@schemas/components/tab'
import { Observable, Subject } from 'rxjs'
import { ModalInput, ModalOutPut, TextAreaModalOutPut } from '@schemas/components/modal'

import { Data } from '@shared/components/molecules/datepicker/datepicker.component'

import dayjs from 'dayjs'
import _ from 'lodash'
import { takeUntil } from 'rxjs/operators'

@Component({
    selector: 'rwp-component',
    standalone: true,
    imports: [CommonModule, SharedModule, ReactiveFormsModule],
    templateUrl: './component.component.html',
    styleUrls: ['./component.component.scss'],
})
export class ComponentComponent implements OnDestroy {
    public subject = new Subject<boolean>()
    ngOnDestroy() {
        this.subject.next(true)
        this.subject.complete()
    }

    constructor(private fb: FormBuilder) {
        setInterval(() => {
            this.button2.progress = (this.button2.progress + 5) % 100
        }, 1000)

        this.memo1.valueChanges.pipe(takeUntil(this.subject)).subscribe((v) => {
            // console.log('memo 1 -- text : ', v)
        })
        this.memo2.valueChanges.pipe(takeUntil(this.subject)).subscribe((v) => {
            // console.log('memo 2 -- text : ', v)
        })
        this.memo3.valueChanges.pipe(takeUntil(this.subject)).subscribe((v) => {
            // console.log('memo 3 -- text : ', v)
        })
        this.memo2.disable()
        this.memo4$.pipe(takeUntil(this.subject)).subscribe((v) => {
            // console.log('memo 4 -- text : ', v)
        })

        this.datepicker2$.pipe(takeUntil(this.subject)).subscribe((v) => {
            // console.log('datepicker2$ -- subscribe : ', v)
        })

        this.textInput3.valueChanges.pipe(takeUntil(this.subject)).subscribe((v) => {
            const value = _.isEmpty(v) ? '' : _.replace(v, /[^0-9]/gi, '')
            this.textInput3.setValue(value, { emitEvent: false })
            // console.log('textInput3 -- value change : ', this.textInput3.value, ' -- ', v)
        })
    }

    public modalSendLink = false
    public modalSendLinkData: ModalInput = {
        title: '비밀번호 재설정 링크의\n' + '유효 시간이 만료되었어요.',
        desc:
            '비밀번호 재설정 링크 전송 후 5분이 지나\n' +
            '링크가 만료되었어요. 이전 화면으로 돌아가\n' +
            '비밀번호 재설정 링크를 다시 요청해 주세요.',
        cancel: '취소',
        confirm: '링크 재요청하기',
    }

    // button
    button1 = {
        width: '110px',
        status: 'idle' as Loading,
        loadingName: 'button1',
        progress: 0,
    }
    button2 = {
        status: 'idle' as Loading,
        loadingName: 'button2',
        progress: 0,
    }
    onClickButton2() {
        if (this.button2.status == 'idle') {
            this.button2.status = 'pending'
        } else if (this.button2.status == 'pending') {
            this.button2.status = 'idle'
        }
    }

    button1_1 = {
        status: 'idle' as Loading,
        loadingName: 'button2',
    }
    button1_2 = {
        status: 'idle' as Loading,
    }
    button1_2Disable = true

    // // ghost button
    gbt1 = {
        disable: false,
    }
    gbt2 = {
        progress: 'idle' as Loading,
    }
    gbt2Click() {
        if (this.gbt2.progress == 'idle') {
            this.gbt2.progress = 'pending'
        } else if (this.gbt2.progress == 'pending') {
            this.gbt2.progress = 'done'
        } else {
            this.gbt2.progress = 'idle'
        }
    }

    checkbox1 = false
    checkbox2 = false
    onCheckBox1(e) {
        this.checkbox1 = e
        // console.log('on check box 1 click : ', this.checkbox1)
    }
    onCheckBox2(e) {
        this.checkbox2 = e
        // console.log('on check box 2 click : ', this.checkbox2)
    }

    radio1 = false
    radio2 = false
    onRadio1(e) {
        this.radio1 = e
        // console.log('on radio 1 click : ', this.radio1)
    }
    onRadio2(e) {
        this.radio2 = e
        // console.log('on radio 2 click : ', this.radio2)
    }

    toggle1 = false
    toggle2 = false
    ontoggle1(e) {
        this.toggle1 = e
        // console.log('on toggle 1 click : ', this.toggle1)
    }
    ontoggle2(e) {
        this.toggle2 = e
        // console.log('on radio 2 click : ', this.radio2)
    }

    tabInputs1: TabInput[] = [
        { name: '옵션', selected: true },
        { name: '옵션', selected: false },
        { name: '옵션', selected: false },
    ]
    onItemSelected1(res: TabInput[]) {
        this.tabInputs1 = res
        // console.log('onItemSelected1 -- ', this.tabInputs1, res)
    }
    tabInputs2: TabInput[] = [
        { name: '옵션', selected: true },
        { name: '옵션', selected: false },
    ]

    tabInputs3: TabInput[] = [
        { name: '메뉴 01', selected: true },
        { name: '메뉴 02', selected: false },
        { name: '메뉴 03', selected: false },
    ]
    onItemSelected3(res: TabInput[]) {
        this.tabInputs3 = res
        // console.log('onItemSelected1 -- ', this.tabInputs3, res)
    }
    tabInputs4: TabInput[] = [
        { name: '메뉴 01', selected: true },
        { name: '메뉴 02', selected: false },
    ]
    //

    onPb1Click(e) {
        // console.log('onPageNumberClick -- ', e)
    }

    //
    public text1 = ''
    onText1Change(text: string) {
        this.text1 = text
        // console.log('onText1Change -- ', this.text1)
        if (this.text1 != text) {
        }
    }

    public text2 = ''
    onText2Change(text: string) {
        this.text2 = text
        // console.log('onText2Change -- ', this.text2)
        if (this.text2 != text) {
        }
    }

    public textInput1 = ''
    onTextInput1Change(v: string) {
        this.textInput1 = v
        // console.log('onTextInput1Change : ', this.textInput1, ' - ', v)
    }
    public textInput2 = ''

    public textInput3 = this.fb.control('')

    public textInput = this.fb.control('')
    public numberText1 = ''
    onNumberText1Change(text: string) {
        this.numberText1 = text
        // console.log('onText2Change -- ', this.numberText1)
    }
    public numberText2 = ''
    onNumberText2Change(text: string) {
        this.numberText2 = text
        // console.log('onText2Change -- ', this.numberText2)
    }

    public verificationNumber = ''
    onVerificationNumberChange(text: string) {
        this.verificationNumber = text
        // console.log('onVerificationNumberChange -- ', this.verificationNumber)
    }

    public memo1 = this.fb.control('')
    onMemo1ButtonClick() {
        // console.log('onMemo1ButtonClick')
    }
    public memo2 = this.fb.control('')
    onMemo2ButtonClick() {
        // console.log('onMemo2ButtonClick')
    }
    public memo3 = this.fb.control('')
    public memo4 = ''
    @Observe('memo4') memo4$: Observable<string>

    public dropdown1 = [
        { name: '옵션1', value: { name: '옵션1', id: '1' } },
        { name: '옵션2', value: { name: '옵션2', id: '2' } },
        { name: '옵션3', value: { name: '옵션3', id: '3' } },
        { name: '옵션4', value: { name: '옵션4', id: '4' } },
        { name: '옵션5', value: { name: '옵션5', id: '5' } },
        { name: '옵션6', value: { name: '옵션6', id: '6' } },
        { name: '옵션7', value: { name: '옵션7', id: '7' } },
    ]
    public ddV01 = undefined
    public ddV1 = { name: '옵션1', id: '1' }

    public dropdown2 = [
        { name: '옵션1', value: { name: '옵션1', id: '1' } },
        { name: '옵션2', value: { name: '옵션2', id: '2' } },
        { name: '옵션3', value: { name: '옵션3', id: '3' } },
        { name: '옵션4', value: { name: '옵션4', id: '4' } },
    ]
    public ddV2 = { name: '옵션1', id: '1' }

    public modalBasic1 = false
    public modalBasic1Data: ModalInput = {
        title: '타이틀 문구를 입력해 주세요.',
        desc: '서브 문구를 입력해 주세요.',
        cancel: '취소',
        confirm: '확인',
    }
    public modalBasic1_5 = false
    public modalBasic1_5Data: ModalInput = {
        title: '타이틀 문구를 입력해 주세요.',
        desc: '서브 문구를 입력해 주세요.',
        cancel: '취소',
        confirm: '확인',
    }

    public modalBasic2 = false
    public modalBasic2Data: ModalInput = {
        title: '타이틀 문구문구문구문구를 입력해 주세요.',
        desc: '서브 문구문구문구문구를 입력해 주세요.',
        cancel: '취소',
        confirm: '확인',
    }
    onModal2Confirm(res: ModalOutPut) {
        res.showLoading()
        setTimeout(() => {
            res.hideLoading()
            this.modalBasic2 = false
        }, 2000)
    }

    public modalTa1 = false
    public modalTa2 = false
    public modalTa2Text = ''
    onModalTa2Confirm(res: TextAreaModalOutPut) {
        this.modalTa2Text = res.textValue
        this.modalTa2 = false
        // console.log('onModalTa2Confirm -- ', res)
    }
    onModalTa2Cancel() {
        // this.modalTa2Text = ''
        this.modalTa2 = false
        // console.log('onModalTa2Confirm -- ', this.modalTa2Text)
    }
    public modalTa3 = false
    public modalTa3Text = ''
    onModalTa3Cancel() {
        // this.modalTa3Text = ''
        this.modalTa3 = false
        // console.log('onModalTa3Confirm -- ', this.modalTa3Text)
    }
    onModalTa3Confirm(res: TextAreaModalOutPut) {
        res.loading.showLoading()
        setTimeout(() => {
            res.loading.hideLoading()
            this.modalTa3Text = res.textValue
            this.modalTa3 = false
            console.log('onModalTa3Confirm -- ', res)
        }, 2000)
    }

    public datepicker1: Data = { date: dayjs().format('YYYY-MM-DD') }
    public datepicker2: Data = {
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(8, 'day').format('YYYY-MM-DD'),
    }
    @Observe('datepicker2') datepicker2$: Observable<any>
    public datepicker3: Data = {
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(8, 'day').format('YYYY-MM-DD'),
    }

    public datepicker4: Data = {
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(8, 'day').format('YYYY-MM-DD'),
    }
    public datepicker5: Data = {
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(8, 'day').format('YYYY-MM-DD'),
    }
    public datepicker6: Data = {
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(8, 'day').format('YYYY-MM-DD'),
    }
}
