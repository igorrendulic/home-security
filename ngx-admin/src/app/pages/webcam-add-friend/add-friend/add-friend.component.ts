import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'ngx-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent {

  @Input() imageData: WebcamImage;

  constructor(protected ref: NbDialogRef<AddFriendComponent>) {
  }

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }

}
