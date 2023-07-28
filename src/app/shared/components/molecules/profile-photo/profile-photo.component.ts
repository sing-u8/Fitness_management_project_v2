import { Component, Input } from '@angular/core'
import { User } from '@schemas/user'
import { Center } from '@schemas/center'

import { FileService } from '@services/file.service'
import { UsersService } from '@services/users.service'
import { StorageService } from '@services/storage.service'
import { showToast } from '@store/app/actions/app.actions'
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
    onPhotoClicked(event) {
        event.target.value = null
    }
    registerPhoto(picture: any) {
        const files: FileList = picture.files
        if (!this.isFileExist(files)) return

        this.fileService.uploadFile('file_type_user_picture', files).subscribe((files) => {
            this.user.picture = files[0].url
            this.storageService.setUser({
                ...this.user,
            })
            this.user = this.storageService.getUser()
            this.storageService.userChangeSubject.next(true)
            this.nxStore.dispatch(showToast({ text: '내 사진이 등록되었어요.' }))
        })
    }
    removePhoto() {
        const prevPicture = this.user.picture
        this.fileService.deleteFile(prevPicture).subscribe({
            next: (__) => {
                this.storageService.setUser({
                    ...this.user,
                    picture: null,
                })
                this.user = this.storageService.getUser()
                this.storageService.userChangeSubject.next(true)
                this.nxStore.dispatch(showToast({ text: '내 사진이 삭제되었어요.' }))
            },
            error: (err) => {
                console.log('remove file err: ', err)
            },
        })
    }
}
