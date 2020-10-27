	import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import { ZoomMtg } from '@zoomus/websdk';
import { FormControl,FormGroup } from '@angular/forms';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // setup your signature endpoint here: https://github.com/zoom/websdk-sample-signature-node.js
  signatureEndpoint = 'http://localhost:4000'
  apiKey = 'zvDVrOsGTnaXO5347e0qiA'
  role = 0
  leaveUrl = 'http://localhost:4200'

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document) {

  }

  ngOnInit() {

  }

  classForm = new FormGroup({
  	studentName: new FormControl(''),
    password: new FormControl(''),
    meetingId: new FormControl(''),
  });


  getSignature() {
    this.httpClient.post(this.signatureEndpoint, {
	    meetingNumber: this.classForm.value.meetingId,
	    role: this.role
    }).toPromise().then((data: any) => {
      if(data.signature) {
        console.log("Ruwan")
        console.log(data.signature)
        this.startMeeting(data.signature)
      } else {
        console.log(data)
      }
    }).catch((error) => {
		console.log("Mahesh")
      console.log(error)
    })
  }

  startMeeting(signature) {

    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      isSupportAV: true,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.classForm.value.meetingId,
          userName: this.classForm.value.studentName,
          apiKey: this.apiKey,
          passWord: this.classForm.value.password,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
