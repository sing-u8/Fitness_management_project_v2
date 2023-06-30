import { Component, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { SaleSummaryComponent } from '@feature/molecules/main/sale-summary/sale-summary.component'
import { DateType, SaleFilterComponent } from '@feature/molecules/main/sale-filter/sale-filter.component'

import { FormBuilder, ReactiveFormsModule } from '@angular/forms'

import { Loading } from '@schemas/loading'
import { TabInput } from '@schemas/components/tab'
import { Subject } from 'rxjs'
import { ModalInput, ModalOutPut, TextAreaModalOutPut } from '@schemas/components/modal'

import { Data } from '@shared/components/molecules/datepicker/datepicker.component'

import dayjs from 'dayjs'
import _ from 'lodash'
import { StatsSalesSummary } from '@schemas/stats-sales-summary'
import { FilterMapTypeCode } from '@store/main/reducers/sales.reducer'
import { takeUntil } from 'rxjs/operators'
import { paymentItemList } from '@shared/helper/center-payment'
import { PaymentProductItemComponent } from '@feature/atoms/payment/payment-product-item/payment-product-item.component'
import { User } from '@schemas/user'
import { Center } from '@schemas/center'

@Component({
    selector: 'rwp-component',
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        SaleSummaryComponent,
        SaleFilterComponent,
        PaymentProductItemComponent,
    ],
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
        // setInterval(() => {
        //     this.button2.progress = (this.button2.progress + 5) % 100
        // }, 1000)

        // this.memo1.valueChanges.pipe(takeUntil(this.subject)).subscribe((v) => {
        //     // console.log('memo 1 -- text : ', v)
        // })
        // this.memo2.valueChanges.pipe(takeUntil(this.subject)).subscribe((v) => {
        //     // console.log('memo 2 -- text : ', v)
        // })
        // this.memo3.valueChanges.pipe(takeUntil(this.subject)).subscribe((v) => {
        //     // console.log('memo 3 -- text : ', v)
        // })
        this.memo2.disable()
        // this.memo4$.pipe(takeUntil(this.subject)).subscribe((v) => {
        //     // console.log('memo 4 -- text : ', v)
        // })
        //
        // this.datepicker2$.pipe(takeUntil(this.subject)).subscribe((v) => {
        //     // console.log('datepicker2$ -- subscribe : ', v)
        // })

        // this.textInput3.valueChanges.pipe(takeUntil(this.subject)).subscribe((v) => {
        //     const value = _.isEmpty(v) ? '' : _.replace(v, /[^0-9]/gi, '')
        //     this.textInput3.setValue(value, { emitEvent: false })
        //     // console.log('textInput3 -- value change : ', this.textInput3.value, ' -- ', v)
        // })
        this.verifForm.valueChanges.pipe(takeUntil(this.subject)).subscribe((v) => {
            console.log('value change verifForm : ', v)
        })
        this.verifForm1.valueChanges.pipe(takeUntil(this.subject)).subscribe((v) => {
            console.log('value change verifForm1 : ', v)
        })
    }

    public tooltip1 = { title: '수정하기' }
    public tooltip5 = { title: '💌 초대 도착' }
    public tooltip2 = { title: '1:1 채팅하기' }
    public tooltip3 = {
        title: '안내 문구를 입력해 주세요.',
        desc: '자세히 보기 문구입니다. 자세히 보기 문구입니다. 자세히 보기 문구입니다. 자세히 보기 문구입니다.',
    }
    public tooltip4 = { title: '말풍선 제목', desc: '내용' }

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

    public verifForm = this.fb.control('')
    public verifForm1 = this.fb.control('')
    onVerifFormChange(text: string) {
        if (this.verifForm.value != text) this.verifForm.setValue(text)
        console.log('onVerifFormChange -- ', this.verifForm.value)
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

    public slideNumber1 = 1
    public curSlideNumber1 = 1
    public slideNumber1_1 = 1
    public curSlideNumber1_1 = 1
    public slideNumber2 = 10
    public curSlideNumber2 = 1
    public slideNumber2_1 = 10
    public curSlideNumber2_1 = 1

    public datepicker1: Data = { date: dayjs().format('YYYY-MM-DD') }
    public datepicker2: Data = {
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(8, 'day').format('YYYY-MM-DD'),
    }
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

    public saleSum0: StatsSalesSummary = {
        this_month: {
            card: '100000',
            cash: '550000',
            trans: '200000',
            unpaid: '10000',
        },
        last_month: {
            card: '0',
            cash: '0',
            trans: '0',
            unpaid: '0',
        },
        today: {
            card: '60000',
            cash: '50000',
            trans: '20000',
            unpaid: '1000',
        },
        yesterday: {
            card: '0',
            cash: '0',
            trans: '0',
            unpaid: '0',
        },
    }
    public saleSum1: StatsSalesSummary = {
        this_month: {
            card: '100000',
            cash: '550000',
            trans: '200000',
            unpaid: '10000',
        },
        last_month: {
            card: '60000',
            cash: '250000',
            trans: '100000',
            unpaid: '0',
        },
        today: {
            card: '60000',
            cash: '50000',
            trans: '20000',
            unpaid: '1000',
        },
        yesterday: {
            card: '30000',
            cash: '10000',
            trans: '200000',
            unpaid: '10000',
        },
    }

    public saleSum2: StatsSalesSummary = {
        this_month: {
            card: '0',
            cash: '0',
            trans: '0',
            unpaid: '0',
        },
        last_month: {
            card: '60000',
            cash: '250000',
            trans: '100000',
            unpaid: '0',
        },
        today: {
            card: '60000',
            cash: '50000',
            trans: '20000',
            unpaid: '1000',
        },
        yesterday: {
            card: '30000',
            cash: '10000',
            trans: '200000',
            unpaid: '10000',
        },
    }

    public dateFilter = {
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    }
    onDateFilterChange(e: DateType) {
        this.dateFilter = _.cloneDeep(e)
        console.log('onDateFilterChange : ', e, ' - date filter : ', this.dateFilter)
    }

    public saleFilter1: FilterMapTypeCode = {
        payment_type_refund: false,
        payment_type_payment: false,
        payment_type_transfer: false,
    }
    onSaleFilter1Change(e: FilterMapTypeCode) {
        console.log('onSaleFilter1Change : ', e, ' - sale Filter 1 : ', this.saleFilter1)
    }

    public paymentItemList = paymentItemList
    public pi1Selected = false
    public pi2Selected = false
    public pi3Selected = false
    onPi1Selected(e) {
        this.pi2Selected = false
        this.pi3Selected = false
        console.log('onPi1Selected -- ', this.pi1Selected, e)
    }
    onPi2Selected() {
        this.pi1Selected = false
        this.pi3Selected = false
    }
    onPi3Selected() {
        this.pi2Selected = false
        this.pi1Selected = false
    }

    public showPaymentResult = false
    public showPaymentError = false

    public paymentErrorData = {
        text: `결제 도중 오류가 발생하여
            결제에 실패했습니다.`,
        subText: `카드 정보를 다시 확인하거나 다른 카드를
            이용해 주세요. 문제가 계속되면, 카드사로
            문의해 주시기 바랍니다.`,
        detailList: [
            {
                title: '주요 결제 오류 사유',
                desc: '카드 잔액 부족, 카드 정보 오류,\n 결제 시스템 장애 등',
            },
        ],
    }

    public showMyProfileModal = false
    public showMyProfileModal2 = false
    public dummyUser: User = {
        id: '9bf30960-0a58-11ee-8e6d-29b1ca86b52a',
        name: 'park singyu',
        sex: null,
        birth_date: null,
        email: 'singyu13@gmail.com',
        email_verified: true,
        phone_number: '01040008000',
        phone_number_verified: true,
        color: '#FFE885',
        privacy: true,
        service_terms: true,
        marketing_sms: true,
        marketing_email: true,
        push_notification: true,
        providers: 'apple.com, google.com, redwhale.xyz',
        picture: null,
        background: null,
        access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWJmMzA5NjAtMGE1OC0xMWVlLThlNmQtMjliMWNhODZiNTJhIiwiaWF0IjoxNjg2NzIyMjUyLCJleHAiOjE2ODY4MDg2NTIsImlzcyI6InJlZHdoYWxlLnh5eiIsInN1YiI6IkFjY2Vzc1Rva2VuIn0.9euA9CtO_eRPCZiMuk0EgdOYnBPjyhbo9Iu_EmfzYCs',
        refresh_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWJmMzA5NjAtMGE1OC0xMWVlLThlNmQtMjliMWNhODZiNTJhIiwiaWF0IjoxNjg2NzIyMjUyLCJleHAiOjE3MTgyNTgyNTIsImlzcyI6InJlZHdoYWxlLnh5eiIsInN1YiI6IlJlZnJlc2hUb2tlbiJ9.CdJhAZyyNdaNL6qBkrjjsCDRVH5V13WpAyBl5t8Fh4c',
        custom_token:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY4NjcyMjI1MiwiZXhwIjoxNjg2NzI1ODUyLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay14OXplZUByZWR3aGFsZS1mOTg5MC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLXg5emVlQHJlZHdoYWxlLWY5ODkwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiZGEzak9tbGZwYlVsZTF3djNQQ04wcnhKWm9qMSIsImNsYWltcyI6eyJwcm92aWRlciI6InJlZHdoYWxlLnh5eiJ9fQ.H9tOCNoogBXbHHmtvudlcZQCnH6eDJ__qT0TDd2TaplJ3kmVdcqtwd2uljQCxHWZWGoNyY_hRKi0C902IKyhXk8wU2yTsFb2HwImOMQroFQcXqpMzkD006rKEVx-PQALJ3njzDjzgUJtHg5gFlU32BJwLAB6JvhCGv1Fk3Kaq6oXcPnXqNNzA26LxJ9Bi-YrP0Pvp0ezeHSOjD0Uja3IPj4lvJGd51osEiCYZgw4xqGPnDwfeYn1tu9RbnH-3NFpXuJYBXoYaGGwQr5mvzLYJ5v9w9R4lVuH9SCJwDFo2ar2NiST1zZxVtp_qjGI594cFJwQAtC0jeN4VRbPXGNaLg',
        sign_in_method: 'email',
    }
    public dummyUser2: User = { ..._.cloneDeep(this.dummyUser), picture: '/assets/images/logo/logo (120px).png' }
    public dummyUser3: User = { ..._.cloneDeep(this.dummyUser), providers: 'redwhale.xyz', marketing_email: false }

    public centerList: Center[] = [
        // 무료 체험
        {
            id: 'f7bf2f40-101a-11ee-b649-e7ce3f70618f',
            code: 'DO6677',
            name: 'singyuCenter',
            zip_no: '05237',
            road_full_addr: '서울 강동구 아리수로 46',
            addr_detail: '.',
            phone_number: '01047028828',
            color: '#9289D2',
            timezone: 'Asia/Seoul',
            product_code: 'free_trial_membership',
            free_trial_terms: true,
            start_date: dayjs().format('YYYY-MM-DD'),
            end_date: dayjs().add(13, 'day').format('YYYY-MM-DD'),
            picture: null,
            background: null,
            role_code: 'owner',
            role_name: '운영자',
            permissions: [],
        },
        {
            id: '92935fb0-101a-11ee-b649-e7ce3f70618f',
            code: 'NC3726',
            name: 'testCenter',
            zip_no: '48060',
            road_full_addr: '부산 남구 전포대로 133, 11층 위워크 BIFC 부산 남구 전포대로 133, 11층 위워크 BIFC ',
            addr_detail: '1',
            phone_number: '01040008000',
            color: '#6B9CB2',
            timezone: 'Asia/Seoul',
            product_code: 'free_trial_membership',
            free_trial_terms: true,
            start_date: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
            end_date: dayjs().format('YYYY-MM-DD'),
            picture: null,
            background: null,
            role_code: 'owner',
            role_name: '운영자',
            permissions: [],
        },
        {
            id: 'f0878e30-1014-11ee-969e-97775ce42bd9',
            code: 'OH4759',
            name: 'test-center5',
            zip_no: '46700',
            road_full_addr: '부산 강서구 대저중앙로51번길 16',
            addr_detail: '.',
            phone_number: '01040008000',
            color: '#A2BDFC',
            timezone: 'Asia/Seoul',
            product_code: 'free_trial_membership',
            free_trial_terms: true,
            start_date: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
            end_date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
            picture: null,
            background: null,
            role_code: 'owner',
            role_name: '운영자',
            permissions: [],
        },
        // 1년 구독 / 2년 구독
        {
            id: '09c25840-1000-11ee-89b9-d37e549b2780',
            code: 'US3053',
            name: 'test_center',
            zip_no: '48060',
            road_full_addr: '부산 해운대구 APEC로 17',
            addr_detail: '.',
            phone_number: '01040008000',
            color: '#6AD2C0',
            timezone: 'Asia/Seoul',
            product_code: '2_years_membership',
            free_trial_terms: true,
            start_date: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
            end_date: dayjs().subtract(6, 'day').add(2, 'year').format('YYYY-MM-DD'),
            picture: null,
            background: null,
            role_code: 'owner',
            role_name: '운영자',
            permissions: [],
        },
        {
            id: '7c9eb960-1002-11ee-8738-519eacfd4dd1',
            code: 'CU1371',
            name: 'testcenter4',
            zip_no: '46700',
            road_full_addr: '부산 강서구 대저중앙로212번가길 12',
            addr_detail: '.',
            phone_number: '01040008000',
            color: '#BBEAFF',
            timezone: 'Asia/Seoul',
            product_code: '1_years_membership',
            free_trial_terms: true,
            start_date: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
            end_date: dayjs().add(13, 'day').format('YYYY-MM-DD'),
            picture:
                'https://private.redwhale.xyz/redwhale_v3/center/7c9eb960-1002-11ee-8738-519eacfd4dd1/7ee526f0-1002-11ee-9ef0-01c8533d0892.jpg',
            background: null,
            role_code: 'owner',
            role_name: '운영자',
            permissions: [],
        },
        {
            id: '09c25840-1000-11ee-89b9-d37e549b2780',
            code: 'US3053',
            name: 'test_center',
            zip_no: '48060',
            road_full_addr: '부산 해운대구 APEC로 17',
            addr_detail: '.',
            phone_number: '01040008000',
            color: '#6AD2C0',
            timezone: 'Asia/Seoul',
            product_code: '2_years_membership',
            free_trial_terms: true,
            start_date: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
            end_date: dayjs().format('YYYY-MM-DD'),
            picture: null,
            background: null,
            role_code: 'owner',
            role_name: '운영자',
            permissions: [],
        },
        {
            id: '09c25840-1000-11ee-89b9-d37e549b2780',
            code: 'US3053',
            name: 'test_center',
            zip_no: '48060',
            road_full_addr: '부산 해운대구 APEC로 17',
            addr_detail: '.',
            phone_number: '01040008000',
            color: '#6AD2C0',
            timezone: 'Asia/Seoul',
            product_code: '2_years_membership',
            free_trial_terms: true,
            start_date: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
            end_date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
            picture: null,
            background: null,
            role_code: 'owner',
            role_name: '운영자',
            permissions: [],
        },

        // 월 구독
        {
            id: '09c25840-1000-11ee-89b9-d37e549b2780',
            code: 'US3053',
            name: 'test_center',
            zip_no: '48060',
            road_full_addr: '부산 해운대구 APEC로 17',
            addr_detail: '.',
            phone_number: '01040008000',
            color: '#6AD2C0',
            timezone: 'Asia/Seoul',
            product_code: 'subscription_membership',
            free_trial_terms: true,
            start_date: dayjs().format('YYYY-MM-DD'),
            end_date: dayjs().add(1, 'month').format('YYYY-MM-DD'),
            picture: null,
            background: null,
            role_code: 'owner',
            role_name: '운영자',
            permissions: [],
        },
        {
            id: '09c25840-1000-11ee-89b9-d37e549b2780',
            code: 'US3053',
            name: 'test_center',
            zip_no: '48060',
            road_full_addr: '부산 해운대구 APEC로 17',
            addr_detail: '.',
            phone_number: '01040008000',
            color: '#6AD2C0',
            timezone: 'Asia/Seoul',
            product_code: 'subscription_membership',
            free_trial_terms: true,
            start_date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
            end_date: dayjs().add(4, 'day').format('YYYY-MM-DD'),
            picture: null,
            background: null,
            role_code: 'owner',
            role_name: '운영자',
            permissions: [],
        },
        {
            id: '09c25840-1000-11ee-89b9-d37e549b2780',
            code: 'US3053',
            name: 'test_center',
            zip_no: '48060',
            road_full_addr: '부산 해운대구 APEC로 17',
            addr_detail: '.',
            phone_number: '01040008000',
            color: '#6AD2C0',
            timezone: 'Asia/Seoul',
            product_code: 'subscription_membership',
            free_trial_terms: true,
            start_date: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
            end_date: dayjs().format('YYYY-MM-DD'),
            picture: null,
            background: null,
            role_code: 'owner',
            role_name: '운영자',
            permissions: [],
        },
        {
            id: '09c25840-1000-11ee-89b9-d37e549b2780',
            code: 'US3053',
            name: 'test_center',
            zip_no: '48060',
            road_full_addr: '부산 해운대구 APEC로 17',
            addr_detail: '.',
            phone_number: '01040008000',
            color: '#6AD2C0',
            timezone: 'Asia/Seoul',
            product_code: 'subscription_membership',
            free_trial_terms: true,
            start_date: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
            end_date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
            picture: null,
            background: null,
            role_code: 'owner',
            role_name: '운영자',
            permissions: [],
        },
    ]

    public centers: Center[] = [
        {
            addr_detail: '.',
            background: null,
            code: 'DO6677',
            color: '#9289D2',
            end_date: '2023-07-05',
            free_trial_terms: true,
            id: 'f7bf2f40-101a-11ee-b649-e7ce3f70618f',
            name: 'singyuCenter',
            permissions: [],
            phone_number: '01047028828',
            picture: null,
            product_code: 'free_trial_membership',
            road_full_addr: '서울 강동구 아리수로 46',
            role_code: 'owner',
            role_name: '운영자',
            start_date: '2023-06-21',
            timezone: 'Asia/Seoul',
            zip_no: '05237',
        },
        {
            addr_detail: '.',
            background: null,
            code: 'CU1371',
            color: '#BBEAFF',
            end_date: '2023-07-05',
            free_trial_terms: true,
            id: '7c9eb960-1002-11ee-8738-519eacfd4dd1',
            name: 'testcenter4',
            permissions: [],
            phone_number: '01047088286',
            picture:
                'https://private.redwhale.xyz/redwhale_v3/center/7c9eb960-1002-11ee-8738-519eacfd4dd1/7ee526f0-1002-11ee-9ef0-01c8533d0892.jpg',
            product_code: 'free_trial_membership',
            road_full_addr: '부산 강서구 대저중앙로215번가길 20',
            role_code: 'owner',
            role_name: '운영자',
            start_date: '2023-06-21',
            timezone: 'Asia/Seoul',
            zip_no: '46700',
        },
        {
            addr_detail: '.',
            background: null,
            code: 'CU1371',
            color: '#BBEAFF',
            end_date: '2023-07-05',
            free_trial_terms: true,
            id: '7c9eb960-1002-11ee-8738-519eacfd4dd1',
            name: 'testcenter4',
            permissions: [],
            phone_number: '01047088286',
            picture: null,
            product_code: 'free_trial_membership',
            road_full_addr: '부산 강서구 대저중앙로215번가길 20',
            role_code: 'owner',
            role_name: '운영자',
            start_date: '2023-06-21',
            timezone: 'Asia/Seoul',
            zip_no: '46700',
        },
    ]

    public openSetCenter = false
}
