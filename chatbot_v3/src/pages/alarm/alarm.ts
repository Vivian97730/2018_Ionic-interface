import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { EditalarmPage } from '../editalarm/editalarm';
import { LoginPage } from '../login/login';
import * as firebase from 'Firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';

/**
 * Generated class for the AlarmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alarm',
  templateUrl: 'alarm.html',
})
export class AlarmPage {

  ref = firebase.database().ref('member/');
  ref_alarm = firebase.database().ref();
  ref2 = firebase.database().ref('alarm/');
  login_status: string = 'false';
  account: string;
  alarm = [];
  alarmList = [];

  public thing:any;
  public time:any;
  public notifyTime:Date  = new Date();
  addtime:any;
  // days : any[];
  
  
  constructor(public navCtrl: NavController,public platform: Platform, public navParams: NavParams, private alertCtrl: AlertController,public localNotifications: LocalNotifications) {
    // this.days = [
    //   {title: '週日', dayCode: 0, checked: false},
    //   {title: '週一', dayCode: 1, checked: false},
    //   {title: '週二', dayCode: 2, checked: false},
    //   {title: '週三', dayCode: 3, checked: false},
    //   {title: '週四', dayCode: 4, checked: false},
    //   {title: '週五', dayCode: 5, checked: false},
    //   {title: '週六', dayCode: 6, checked: false}
    // ];
    this.login_status = localStorage.getItem('login_status');
    if(this.login_status == 'true'){
      this.account = localStorage.getItem('login_account');
      // select
      this.ref.orderByChild("account").equalTo(this.account).on('value', snapshot =>{
        if(snapshot.exists()){
          this.ref_alarm = firebase.database().ref('alarm/'+ this.account);
          this.ref_alarm.orderByKey().once('value', snapshot =>{
            if(snapshot.exists()){
            this.alarm = [];
            this.alarm = snapshotToArray(snapshot);
            // console.log(this.alarm);
            }

            Object.keys(this.alarm).forEach(key => {
              let detail = {
                key: this.alarm[key].key,
                content: this.alarm[key].content,
                time: this.alarm[key].time,
                monday: this.alarm[key].monday,
                tuesday: this.alarm[key].tuesday,
                wednesday: this.alarm[key].wednesday,
                thursday: this.alarm[key].thursday,
                friday: this.alarm[key].friday,
                saturday: this.alarm[key].saturday,
                sunday: this.alarm[key].sunday
              };
              this.pushAlarm(detail);
            });
          });
        }else{
          this.navCtrl.setRoot(LoginPage);
        }
      });
    }else{
      // if login fail , go to login page
      this.navCtrl.setRoot(LoginPage);
    }
  }

  pushAlarm(alarm) {
    this.alarmList.push(alarm);
  }

  public show_form(){
    this.navCtrl.push(EditalarmPage);

  }

  showAlert(title,text) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['確定']
    });
    alert.present();
  }

  ionViewDidLoad() {
    
  }

  edit_form(i) {
    // console.log(i);
    this.navCtrl.push(EditalarmPage,{
      index: i
    });

  }

  deletealarm(i){
    // console.log(i);
    let alert = this.alertCtrl.create({
      title: '刪除紀錄',
      subTitle: '確定要刪除這筆紀錄嗎？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
        },
        {
          text: '確定',
          handler: data => {            
            var childRef = this.ref2.child(this.account);
            var time = Date.now().toString();
            // console.log(data[0]);
            childRef.child(i).remove();
            // this.pageRefresh();
            // this.navCtrl.push(RecordPage);
            for(var daycode=0; daycode<7; daycode++){
              this.localNotifications.cancel(i+daycode);
            }
            
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }     
        }
      ]
    });
    alert.present();         
  }
  cancelAll(){

    this.localNotifications.cancelAll();

    let alert = this.alertCtrl.create({
      title: '刪除紀錄',
      subTitle: '確定要刪除全部的提醒嗎？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
        },
        {
          text: '確定',
          handler: data => {            
            this.ref2.child(this.account).remove();            
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }     
        }
      ]
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