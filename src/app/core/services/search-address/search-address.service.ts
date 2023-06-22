import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Response } from '@schemas/response'
import { catchError, map } from 'rxjs/operators'
import handleError from '@services/handleError'
import { Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class SearchAddressService {
    public readonly confirmKey = 'devU01TX0FVVEgyMDIzMDYyMDE4MzA0NTExMzg2NjI='
    constructor(private http: HttpClient) {}

    searchAddress(reqBody: SearchAddressReqBody) {
        const countPage = reqBody.countPerPage ?? 10
        const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${this.confirmKey}&currentPage=${reqBody.currentPage}&countPerPage=${countPage}&keyword=${reqBody.keyword}&resultType=json`
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': 'https://v3.redwhale.xyz/',
            }),
        }

        return this.http.get<SearchAddressReturn>(url, options).pipe(
            map((res) => {
                console.log('searchAddress -- : ', res)
                return res
            }),
            catchError(handleError)
        )
    }
}

export interface SearchAddressReqBody {
    currentPage: number // 현재 페이지 번호
    countPerPage?: number // 페이지당 출력할 결과 Row 수
    keyword: string // 주소 검색어
    resultType?: string // 검색결과형식 설정(xml, json)
    hstryYn?: string // 변동된 주소정보 포함 여부
    firstSort?: string // 정확도순 정렬(none), 우선정렬(road: 도로명 포함, location: 지번 포함) ※ keyword(검색어)가 우선정렬 항목에 포함된 결과 우선 표출
    addInfoYn?: string // (현재 적용하지 않을 예정) 출력결과에 추가된 항목(hstryYn, relJibun, hemdNm) 제공여부  ※ 해당 옵션으로 추가제공되는 항목의 경우, 추후 특정항목이 제거되거나 추가될 수 있으니 적용 시 고려해주시기 바랍니다.
}

export interface SearchAddressReturn {
    common: {
        totalCount: string // 총 검색 데이터수
        currentPage: number // 페이지 번호
        countPerPage: number // 페이지당 출력할 결과 Row 수
        errorCode: string // 에러 코드
        errorMessage: string // 에러 메시지
    }
    juso: {
        roadAddr: string // 전체 도로명주소
        roadAddrPart1: string // 도로명주소(참고항목 제외)
        roadAddrPart2?: string // 도로명주소 참고항목
        jibunAddr: string // 지번주소
        engAddr: string // 도로명주소(영문)
        zipNo: string // 우편번호
        admCd: string // 행정구역코드
        rnMgtSn: string // 도로명코드
        bdMgtSn: string // 건물관리번호
        detBdNmList?: string // 상세건물명
        bdNm?: string // 건물명
        bdKdcd: string // 공동주택여부(1 : 공동주택, 0 : 비공동주택)
        siNm: string // 시도명
        sggNm: string // 시군구명
        emdNm: string // 읍면동명
        liNm?: string // 법정리명
        rn: string // 도로명
        udrtYn: string // 지하여부(0 : 지상, 1 : 지하)
        buldMnnm: number // 건물본번
        buldSlno: number // 건물부번
        mtYn: string // 산여부(0 : 대지, 1 : 산)
        lnbrMnnm: number // 지번본번(번지)
        lnbrSlno: number // 지번부번(호)
        emdNo: string // 읍면동일련번호
        hstryYn: string // 변동이력여부(0: 현행 주소정보, 1: 요청변수의 keyword(검색어)가 변동된 주소정보에서 검색된 정보)
        relJibun?: string // 관련지번
        hemdNm?: string // 관할주민센터 - 참고정보이며, 실제와 다를 수 있습니다.
    }
}
