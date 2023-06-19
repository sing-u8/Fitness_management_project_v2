import { Component, Input } from '@angular/core'
import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { UploadFileReqBody } from '@services/file.service'

import { FileService } from '@services/file.service'
import { UsersService } from '@services/users.service'
import { StorageService } from '@services/storage.service'
import { showToast } from '@store/app/actions/toast.action'
import { Store, select } from '@ngrx/store'

@Component({
    selector: 'rwm-profile-photo',
    templateUrl: './profile-photo.component.html',
    styleUrls: ['./profile-photo.component.scss'],
})
export class ProfilePhotoComponent {
    @Input() user: User
    @Input() center: Center

    constructor(
        private fileService: FileService,
        private usersService: UsersService,
        private storageService: StorageService,
        private nxStore: Store
    ) {}

    isFileExist(fileList: FileList) {
        return !(fileList && fileList.length == 0)
    }
    registerPhoto(picture: any) {
        const files: FileList = picture.files
        if (!this.isFileExist(files)) return

        const reqBody: UploadFileReqBody = { type_code: 'file_type_user_picture' }
        this.fileService.uploadFile(reqBody, files).subscribe((__) => {
            console.log('uploadFile -- ', __)
            this.usersService.getUser(this.user.id).subscribe({
                next: (resData) => {
                    this.user.picture = resData['picture']
                    // this.globalSettingAccountService.setUserAvatar(resData['picture'])
                    this.storageService.setUser({
                        ...resData,
                        picture: resData['picture'],
                    })
                    this.user = this.storageService.getUser()
                    this.nxStore.dispatch(showToast({ text: '프로필 사진이 변경되었습니다.' }))
                },
                error: (err) => {
                    console.log('create account avatar file err: ', err)
                },
            })
        })
    }
    removePhoto() {
        const prevPicture = this.user.picture
        this.fileService.deleteFile(prevPicture).subscribe({
            next: (__) => {
                this.usersService.getUser(this.user.id).subscribe({
                    next: (resData) => {
                        this.storageService.setUser({
                            ...resData,
                        })
                        this.user = this.storageService.getUser()
                        // this.globalSettingAccountService.setUserAvatar(this.user.picture)
                        this.nxStore.dispatch(showToast({ text: '프로필 사진이 변경되었습니다.' }))
                    },
                    error: (err) => {
                        console.log('get user error :', err)
                    },
                })
            },
            error: (err) => {
                console.log('remove file err: ', err)
            },
        })
    }
}
