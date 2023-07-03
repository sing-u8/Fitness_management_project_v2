import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core'

@Component({
  selector: 'rwm-employee-photo',
  templateUrl: './employee-photo.component.html',
  styleUrls: ['./employee-photo.component.scss']
})
export class EmployeePhotoComponent implements OnChanges {
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
}
