import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
// import { InfoPage } from '../info/info';
import { BackButtonService } from '../../services/backbutton.service';
import { HomePage } from '../home/home';
/**
 * Generated class for the EntrancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entrance',
  templateUrl: 'entrance.html',
})
export class EntrancePage {

  login_status: string = 'false';

  constructor(public navCtrl: NavController,
              private backButtonService: BackButtonService,
              private platform: Platform) {
    
    // 返回鍵
    this.platform.ready().then(() => {
          this.backButtonService.registerBackButtonAction(null);
    });
  }
  
  login_link(){
		this.navCtrl.push(LoginPage);
	}

	signup_link(){
		this.navCtrl.push(SignupPage);
	}

  ionViewDidLoad() {
    this.login_status = localStorage.getItem('login_status');
    if(this.login_status == 'true'){
      this.navCtrl.setRoot(HomePage);
    }
    console.log('ionViewDidLoad EntrancePage');
  }

}
