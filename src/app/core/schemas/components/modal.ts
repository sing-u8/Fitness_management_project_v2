export type ModalInput = {
    title: string
    desc: string
    cancel?: string
    confirm?: string
}

export type ModalOutPut = {
    showLoading: () => void
    hideLoading: () => void
}

export type TextAreaModalOutPut = {
    loading: ModalOutPut
    textValue: string
}
