import { Component, OnInit } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { AddFriendComponent } from '../add-friend/add-friend.component';

@Component({
  selector: 'ngx-webcam-view',
  templateUrl: './webcam-view.component.html',
  styleUrls: ['./webcam-view.component.scss']
})
export class WebcamViewComponent implements OnInit {

  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  // latest snapshot
  public webcamImage: WebcamImage = null;
  public multipleWebcamsAvailable = false;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();


  constructor(private toastrService: NbToastrService, private dialogService: NbDialogService) { }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;

    this.dialogService.open(AddFriendComponent, {
      hasBackdrop: true,
      autoFocus: true,
      closeOnEsc: true,
      context: {
        imageData: webcamImage,
      },
    })
    .onClose.subscribe(name => {
      console.log("add name to datstore: ", name);
    });
  }

  public handleInitError(error: WebcamInitError): void {
    this.toastrService.danger(error.message);
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

}
