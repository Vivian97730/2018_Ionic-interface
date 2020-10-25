import { Injectable } from '@angular/core';
import { Platform, ToastController, App, NavController, Tabs } from 'ionic-angular';

@Injectable()
export class BackButtonService {

  // 控制手機返回按鈕是否觸發，預設false
  backButtonPressed: boolean = false;

  constructor(public platform: Platform,
              public appCtrl: App,
              public toastCtrl: ToastController) { }

  //register function
  registerBackButtonAction(tabRef: Tabs): void {
    
    //registerBackButtonAction
    this.platform.registerBackButtonAction(() => {
      //NavController
      let activeNav: NavController = this.appCtrl.getActiveNavs()[0];
      //如果可以返回上一頁，就執行
      if (activeNav.canGoBack()) {
        activeNav.pop();
      } else {
        if (tabRef == null || tabRef._selectHistory[tabRef._selectHistory.length - 1] === tabRef.getByIndex(0).id) {
          //執行退出
          this.showExit();
        } else {
          //選擇首頁第一個的標籤
          tabRef.select(0);
        }
      }
    });
  }

  //退出function
  private showExit(): void {
    //if true 退出
    if (this.backButtonPressed) {
      this.platform.exitApp();
    } else {
        //第一次按，彈出toast
        this.toastCtrl.create({
            message: '再按一次退出程式',
            duration: 2000,
            position: 'top'
        }).present();
      //標記為true
      this.backButtonPressed = true;
      //兩秒後標記為false，如果退出就不會執行
      setTimeout(() => this.backButtonPressed = false, 2000);
    }
  }
}
