import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core'

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
    @Output() pictureRemove = new EventEmitter<string>()

    @ViewChild('userProfile') userProfile_el: ElementRef

    public pictureName = ''

    ngOnChanges(changes: SimpleChanges) {}

    setPhoto(picture: any) {
        const files: FileList = picture.files

        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            this.pictureName = files[0].name
            this.pictureChange.emit({ pictureFile: files, pictureSrc: e.target.result as string })
        }

        fileReader.readAsDataURL(files[0])
    }
    onPhotoClicked(event) {
        event.target.value = null
    }
}
