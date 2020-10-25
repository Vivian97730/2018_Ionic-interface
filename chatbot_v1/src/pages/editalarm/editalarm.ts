import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlarmPage } from '../alarm/alarm';
import { AlertController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private alertCtrl: AlertController) {
  }

  public thing:any;
  public time:any;
  public monday:any;
  public tuesday:any;
  public wednesday:any;
  public thursday:any;
  public friday:any;
  public saturday:any;
  public sunday:any;

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditalarmPage');
  }

  ionViewWillEnter() {
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

  check_form(){
    var thing = this.thing;
    var time = this.time;
    
    var monday = this.monday;
    var tuesday = this.tuesday;
    var wednesday = this.wednesday;
    var thursday = this.thursday;
    var friday = this.friday;
    var saturday = this.saturday;
    var sunday = this.sunday;
    
    var correct = 0;

    if (monday != true && tuesday != true && wednesday != true && thursday != true && friday != true && saturday != true && sunday != true ) {
        correct++;
    }

    if (thing != null) {
      if (time != null) {
        if (correct == 0) {
          this.showAlert("修改成功","");
          this.back();
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
