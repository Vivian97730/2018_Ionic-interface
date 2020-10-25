import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { EditalarmPage } from '../editalarm/editalarm';
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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private alertCtrl: AlertController) {
  }

  public new: boolean = false;
  public card: boolean = true;
  public new_btn: boolean = true;
  
  public thing:any;
  public time:any;
  public monday:any;
  public tuesday:any;
  public wednesday:any;
  public thursday:any;
  public friday:any;
  public saturday:any;
  public sunday:any;
  
  public show_form(){
    this.card = false;
    this.new_btn = false;
    this.new = true;
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
    console.log('ionViewDidLoad AlarmPage');
  }

  ionViewWillEnter() {
  }

  back() {
    this.new = false;
    this.new_btn = true;
    this.card = true;
  }

  edit_form() {
    this.navCtrl.setRoot(EditalarmPage);
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
          this.showAlert("新增成功","");
          this.new = false;
          this.new_btn = true;
          this.card = true;
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
