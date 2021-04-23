import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebcamAddFriendRoutingModule } from './webcam-add-friend-routing.module';
import {WebcamModule} from 'ngx-webcam';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { WebcamAddFriendComponent } from './webcam-add-friend.component';
import { NbButtonModule, NbCardModule, NbDialogModule, NbFormFieldModule, NbInputModule } from '@nebular/theme';
import { WebcamViewComponent } from './webcam-view/webcam-view.component';
import { ModalOverlaysRoutingModule } from '../modal-overlays/modal-overlays-routing.module';


@NgModule({
  declarations: [AddFriendComponent, WebcamAddFriendComponent, WebcamViewComponent],
  imports: [
    CommonModule,
    WebcamModule,
    NbCardModule,
    NbButtonModule,
    ModalOverlaysRoutingModule,
    NbDialogModule.forChild(),
    NbInputModule,
    WebcamAddFriendRoutingModule
  ]
})
export class WebcamAddFriendModule { }
