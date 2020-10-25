import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { InfoPage } from '../info/info';
// import { FCM } from '@ionic-native/fcm';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  login_status: string = 'false';

  constructor(public navCtrl: NavController) {
    this.login_status = localStorage.getItem('login_status');
    if(this.login_status == 'true'){
      // if login success , go to info page
      // select
      this.navCtrl.setRoot(InfoPage);
    }else{
      // if login fail , go to login page
    }


  //   fcm.subscribeToTopic('marketing');
 
  // //取得FCM 的token
  //   fcm.getToken().then(token => {
  //     alert("getToken")
  //   })

  //  //取得FCM 的推播訊息
  //    fcm.onNotification().subscribe(data => {
  //     if (data.wasTapped) { //取得背景監聽
  //       alert("message in background!");
  //     } else {
  //       alert("message in front! "); //前景
  //       alert(JSON.stringify(data)); //取得推播資訊
  //     };
  //   })
  //   //取消推播
  //   fcm.unsubscribeFromTopic('marketing');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter() {
  }


  
  login_link(){
		this.navCtrl.setRoot(LoginPage);
	}

	signup_link(){
		this.navCtrl.setRoot(SignupPage);
	}
}
