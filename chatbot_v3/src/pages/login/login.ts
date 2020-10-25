import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { EntrancePage } from '../entrance/entrance';

import { InfoPage } from '../info/info';
import * as firebase from 'Firebase';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  login_info={
	  account: '',
	  password: ''
  };
  login_status: string = 'false';

  ref = firebase.database().ref('member/');
  result=[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    
  }

  login(form: any): void{	
    this.ref.orderByChild("account").equalTo(this.login_info.account).on('value', snapshot =>{
      if(snapshot.exists()){
        this.result = [];
        var key = Object.keys(snapshot.val())[0];
        this.result = snapshotToArray(snapshot);
        if(this.result[0].password == this.login_info.password){
          localStorage.setItem('login_status', 'true');
          localStorage.setItem('login_account', this.login_info.account);
          localStorage.setItem('login_name', this.result[0].name);
          localStorage.setItem('login_avatar', this.result[0].avatar);
          localStorage.setItem('login_robot', this.result[0].chatbot);
          localStorage.setItem('login_memberId', key);
          // console.log(key);
          this.navCtrl.setRoot(HomePage);
          // this.navCtrl.push(InfoPage, {
          //   login_status: true,
          //   account: this.login_info.account
          // });
        }else{
          this.presentAlert('密碼輸入錯誤！請重新輸入');
        }
      }else{
        this.presentAlert('帳號輸入錯誤！請重新輸入');
      }
      
    });
  }

  backEntrance(){
    this.navCtrl.setRoot(EntrancePage);
  }
  
  presentAlert(alertContent: string) {
    let alert = this.alertCtrl.create({
      title: '登入失敗',
      subTitle: alertContent,
      buttons: ['確認']
    });
    alert.present();
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
      // console.log(returnArr);
  });

  return returnArr;
};