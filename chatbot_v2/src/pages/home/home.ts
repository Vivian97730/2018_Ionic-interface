import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import * as firebase from 'Firebase';
import { LoginPage } from '../login/login';
// import { SignupPage } from '../signup/signup';
import { InfoPage } from '../info/info';
import { RecordPage } from '../record/record';
import { ChatPage } from '../chat/chat';
import { AlarmPage } from '../alarm/alarm';
import { EntrancePage } from '../entrance/entrance';
import { BackButtonService } from '../../services/backbutton.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  login_status: string = 'false';
  info = [];
  ref = firebase.database().ref('member/');
  // account: string;

  constructor(public navCtrl: NavController,
              private backButtonService: BackButtonService,
              private platform: Platform) {
    // this.login_status = localStorage.getItem('login_status');
    // if(this.login_status == 'true'){
    //   this.navCtrl.setRoot(HomePage);
    // }else{
    //   this.navCtrl.setRoot(LoginPage);

    // // 返回鍵
    // this.platform.ready().then(() => {
    //     this.backButtonService.registerBackButtonAction(null);
    //   });
    // }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  
  goInfo(){
		this.navCtrl.push(InfoPage);
	}

	goRecord(){
		this.navCtrl.push(RecordPage);
	}

  goChat(){
    this.navCtrl.push(ChatPage);
  }

  goAlarm(){
    this.navCtrl.push(AlarmPage);
  }

}
