import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { WebcamAddFriendComponent } from './webcam-add-friend.component';
import { WebcamViewComponent } from './webcam-view/webcam-view.component';

const routes: Routes = [
  {
    path: '',
    component: WebcamAddFriendComponent,
    children: [
      {
        path: 'friend',
        component: WebcamViewComponent,
      },
      {
        path: 'friend/add',
        component: WebcamAddFriendComponent,
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebcamAddFriendRoutingModule { }
