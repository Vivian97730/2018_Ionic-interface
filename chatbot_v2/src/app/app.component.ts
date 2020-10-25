import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform, AlertController, ToastController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { Push, PushObject, PushOptions } from '@ionic-native/push';



import { HomePage } from '../pages/home/home';
import { ChatPage } from '../pages/chat/chat';
import { AlarmPage } from '../pages/alarm/alarm';
import { InfoPage } from '../pages/info/info';
import { RecordPage } from '../pages/record/record';
import { EntrancePage } from '../pages/entrance/entrance';

// import { LoginPage } from '../pages/login/login';
// import { SignupPage } from '../pages/signup/signup';
// import { EditalarmPage } from '../pages/editalarm/editalarm'
// import { EditPage } from '../pages/edit/edit';


const config = {
  apiKey: "AIzaSyA4TDXgmhpgmtlKxU33jLJwafe183kV7LI",
  authDomain: "chatbot-mis108.firebaseapp.com",
  databaseURL: "https://chatbot-mis108.firebaseio.com",
  projectId: "chatbot-mis108",
  storageBucket: "chatbot-mis108.appspot.com",
  messagingSenderId: "395500889806"
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = EntrancePage;
  LogoutPage: any = 'logout';
  pages: Array<
    {  title: string, 
       component: any,
       icon: string;
    }>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              private alertCtrl: AlertController, 
              private push: Push,
              public menu: MenuController,
              private toastController: ToastController,
              public app: App
              ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: '首頁', component: HomePage, icon: 'md-home' },
      { title: '個人資料', component: InfoPage, icon: 'md-person' },
      { title: '身體狀況紀錄', component: RecordPage, icon:  'md-pulse' },
      { title: '聊天室', component: ChatPage, icon: 'ios-chatbubbles' },
      { title: '提醒', component: AlarmPage, icon:  'md-alarm' },
      { title: '登出', component: this.LogoutPage, icon:  'md-log-out' }
    ];
    firebase.initializeApp(config);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.pushSetup();
    });
  }

  pushSetup(){
    const options: PushOptions = {
      android: {
        senderID: '395500889806'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      }
   };
   
   const pushObject: PushObject = this.push.init(options);
   
   
   pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
   
   pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));
   
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.component == 'logout'){
      localStorage.setItem('login_status', 'false');
      localStorage.removeItem('login_account');
      this.presentAlert('');
      this.nav.setRoot(EntrancePage);
    }
    else{
      this.nav.setRoot(page.component);

    }
  }

  presentAlert(alertContent: string) {
    let alert = this.alertCtrl.create({
      title: '登出成功',
      subTitle: alertContent,
      buttons: ['確認']
    });
    alert.present();
  }
}
