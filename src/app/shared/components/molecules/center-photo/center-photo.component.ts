import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core'

import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { FileService } from '@services/file.service'
import { UsersService } from '@services/users.service'
import { StorageService } from '@services/storage.service'
import { changesOn } from '@shared/helper/component-helper'

import _ from 'lodash'

@Component({
    selector: 'rwm-center-photo',
    templateUrl: './center-photo.component.html',
    styleUrls: ['./center-photo.component.scss'],
})
export class CenterPhotoComponent implements OnChanges {
    @Input() pictureSrc = ''
    @Output() pictureChange = new EventEmitter<{
        pictureFile: FileList
        pictureSrc: string
    }>()

    @ViewChild('userProfile') userProfile_el: ElementRef

    public pictureName = ''

    ngOnChanges(changes: SimpleChanges) {
        // changesOn(changes, 'pictureSrc', (v) => {
        //     if (_.isEmpty(v)) {
        //         this.userProfile_el.nativeElement.files = undefined
        //     }
        // })
    }

    setPhoto(picture: any) {
        const files: FileList = picture.files
        // console.log('set photo : ', files, picture)

        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            // console.log('setPhoto in onload : ', e)
            this.pictureName = files[0].name
            this.pictureChange.emit({ pictureFile: files, pictureSrc: e.target.result as string })
        }

        fileReader.readAsDataURL(files[0])
    }
    onPhotoClicked(event) {
        event.target.value = null
    }
    isFileExist(fileList: FileList) {
        return !(fileList && fileList.length == 0)
    }
}
