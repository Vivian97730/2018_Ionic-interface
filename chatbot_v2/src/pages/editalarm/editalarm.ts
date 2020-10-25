import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlarmPage } from '../alarm/alarm';
import { AlertController } from 'ionic-angular';
import * as firebase from 'Firebase';
import { LoginPage } from '../login/login';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';


/**
 * Generated class for the EditalarmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editalarm',
  templateUrl: 'editalarm.html',
})
export class EditalarmPage {
  ref = firebase.database().ref('member/');
  ref2 = firebase.database().ref('alarm/');
  ref_alarm = firebase.database().ref();
  login_status: string = 'false';
  account: string;
  alarmList = [];
  notifications: any[] = [];
  days: any[];
  chosenHours: number;
  chosenMinutes: number;
  result = [];
  i: any = null;
  public thing:any;
  public time:any;
  public notifyTime:Date  = new Date();
  public new: boolean = false;
  public edit: boolean = false;
  addtime:any;

  constructor(public navCtrl: NavController,public platform: Platform, public navParams: NavParams, private alertCtrl: AlertController, public localNotifications: LocalNotifications) {
    this.login_status = localStorage.getItem('login_status');
    this.time = moment(new Date()).format('HH:mm');
    //console.log('time='+this.time);
    this.chosenHours = new Date().getHours();
    this.chosenMinutes = new Date().getMinutes();
    this.days = [
      {title: '週日', dayCode: 0, checked: false},
      {title: '週一', dayCode: 1, checked: false},
      {title: '週二', dayCode: 2, checked: false},
      {title: '週三', dayCode: 3, checked: false},
      {title: '週四', dayCode: 4, checked: false},
      {title: '週五', dayCode: 5, checked: false},
      {title: '週六', dayCode: 6, checked: false}
    ];

    
    if(this.login_status == 'true'){
      // if login success , get account from loginpage
      // this.account = navParams.get('account');
      this.account = localStorage.getItem('login_account');
      // select
      this.i = navParams.get('index');
      console.log(this.i);
      if(this.i == null){
        this.new = true;
      }
      else{
        this.edit = true;
        this.ref.orderByChild("account").equalTo(this.account).on('value', (snapshot) =>{
          if(snapshot.exists()){
            this.ref_alarm = firebase.database().ref('alarm/'+ this.account);
            this.ref_alarm.orderByKey().equalTo(this.i).once('value', (snapshot) =>{
              if(snapshot.exists()){
                this.result = [];
                this.result = snapshotToArray(snapshot);
                this.thing = this.result[0].content;  
                this.time = this.result[0].time;
                this.days[1].checked = (this.result[0].monday == "true");
                this.days[2].checked = (this.result[0].tuesday == "true");
                this.days[3].checked = (this.result[0].wednesday == "true");
                this.days[4].checked = (this.result[0].thursday == "true");
                this.days[5].checked = (this.result[0].friday == "true");
                this.days[6].checked = (this.result[0].saturday == "true");
                this.days[0].checked = (this.result[0].sunday == "true");
              }
            });
          }else{
            this.navCtrl.setRoot(LoginPage);
          }
        });
      }
      
    }else{
      // if login fail , go to login page
      this.navCtrl.setRoot(LoginPage);
    }
  }
  
  

  back() {
    this.navCtrl.setRoot(AlarmPage);
  }

  showAlert(title,text) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['確定']
    });
    alert.present();
  }

  timeChange(time){
    // console.log(time.hour);
    this.chosenHours = time.hour;
    this.chosenMinutes = time.minute;
  }

  newAlarm(){    
    var sunday = this.days[0].checked;
    var monday = this.days[1].checked;
    var tuesday = this.days[2].checked;
    var wednesday = this.days[3].checked;
    var thursday = this.days[4].checked;
    var friday = this.days[5].checked;
    var saturday = this.days[6].checked;
    this.notifyTime.setHours(this.chosenHours);
    this.notifyTime.setMinutes(this.chosenMinutes);
    
    var correct = 0;

    let currentDate = new Date();
    let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.
    let firstNotificationTime: Date;
    this.addtime = Date.now().toString();

    for(let day of this.days){
      correct++;
      firstNotificationTime = new Date();
      //console.log(day.checked);
      if(day.checked){
        correct++;

        let dayDifference = day.dayCode - currentDay;
        console.log(dayDifference);

        if(dayDifference < 0){
            dayDifference = dayDifference + 7; // for cases where the day is in the following week
        }

        firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
        firstNotificationTime.setHours(this.chosenHours);
        firstNotificationTime.setMinutes(this.chosenMinutes);
        firstNotificationTime.setSeconds(0);


        
        let notification = {
            id: this.addtime+day.dayCode,
            title: '貼心小提醒',
            text: this.thing,
            at: firstNotificationTime,
            every: 'week'
        };

        this.notifications.push(notification);

      }
      
    }
    console.log("Notifications to be scheduled: ", this.notifications[0]);
    this.notifications.forEach((notification) => {
        console.log(notification.id);
        console.log(notification.title);
        console.log(notification.at);
    });
    if(this.platform.is('cordova')){

      // Schedule the new notifications
      this.localNotifications.schedule(this.notifications);

      this.notifications = [];

      // let alert = this.alertCtrl.create({
      //     title: 'Notifications set',
      //     subTitle: firstNotificationTime.toString()+this.notifications,
      //     buttons: ['Ok']
      // });

      // alert.present();

    }

    if (this.thing != null) {
      if (this.notifyTime != null) {
        if (correct != 0) {
          console.log(this.thing);
          var childRef = this.ref2.child(this.account);
          // console.log(data[0]);
          childRef.child(this.addtime).set({
            content: this.thing,
            time: moment(this.notifyTime).format('HH:mm'),
            monday: String(monday),
            tuesday: String(tuesday),
            wednesday: String(wednesday),
            thursday: String(thursday),
            friday: String(friday),
            saturday: String(saturday),
            sunday: String(sunday)
          }, error => {
            if (error) {
              this.showAlert("新增失敗","請再試一次");
            } else {
              this.showAlert("新增成功","");
              this.back();
            }    
          });                       
          
        } else {
          this.showAlert("請再檢查一次","要選擇需要提醒的日子喔");
        }
      } else {
        this.showAlert("請再檢查一次","要輸入需要提醒的時間喔");  
      }
    } else {
      this.showAlert("請再檢查一次","要輸入需要提醒的事情喔");
    }

  }

  editAlarm(i){

    var sunday = this.days[0].checked;
    var monday = this.days[1].checked;
    var tuesday = this.days[2].checked;
    var wednesday = this.days[3].checked;
    var thursday = this.days[4].checked;
    var friday = this.days[5].checked;
    var saturday = this.days[6].checked;
    this.notifyTime.setHours(this.chosenHours);
    this.notifyTime.setMinutes(this.chosenMinutes);
    
    var correct = 0;

    let currentDate = new Date();
    let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.
    let firstNotificationTime: Date;

    for(let day of this.days){
      firstNotificationTime = new Date();
      
      this.localNotifications.cancel(i+day.dayCode);
      
      //console.log(day.checked);
      if(day.checked){
        correct++;

        let dayDifference = day.dayCode - currentDay;
        console.log(dayDifference);

        if(dayDifference < 0){
            dayDifference = dayDifference + 7; // for cases where the day is in the following week
        }

        firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
        firstNotificationTime.setHours(this.chosenHours);
        firstNotificationTime.setMinutes(this.chosenMinutes);
        firstNotificationTime.setSeconds(0);

        let notification = {
            id: this.i+day.dayCode,
            title: '貼心小提醒',
            text: this.thing,
            at: firstNotificationTime,
            every: 'week'
        };

        this.notifications.push(notification);
      }
      
    }

    console.log("Notifications to be scheduled: ", this.notifications[0]);
    this.notifications.forEach((notification) => {
        console.log(notification.id);
        console.log(notification.title);
        console.log(notification.at);
    });

    if(this.platform.is('cordova')){

      // Schedule the new notifications
      this.localNotifications.schedule(this.notifications);

      this.notifications = [];

      // let alert = this.alertCtrl.create({
      //     title: 'Notifications set',
      //     subTitle: firstNotificationTime.toString()+this.notifications,
      //     buttons: ['Ok']
      // });

      //alert.present();

    }

    if (this.thing != null) {
      if (this.notifyTime != null) {
        if (correct != 0) {
          console.log(this.thing);
          var childRef = this.ref2.child(this.account);
          // console.log(data[0]);
          childRef.child(this.result[0].key).update({
            content: this.thing,
            time: this.time,
            monday: String(monday),
            tuesday: String(tuesday),
            wednesday: String(wednesday),
            thursday: String(thursday),
            friday: String(friday),
            saturday: String(saturday),
            sunday: String(sunday)
          }, error => {
            if (error) {
              this.showAlert("修改失敗","請再試一次");
            } else {
              this.showAlert("修改成功","");
              this.back();     
            }    
          });     
          
        } else {
          this.showAlert("請再檢查一次","要選擇需要提醒的日子喔");
        }
      } else {
        this.showAlert("請再檢查一次","要輸入需要提醒的時間喔");  
      }
    } else {
      this.showAlert("請再檢查一次","要輸入需要提醒的事情喔");
    }


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
