import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Button } from 'ionic-angular';
import * as firebase from 'Firebase';
import { EditPage } from '../edit/edit';
import { LoginPage } from '../login/login';
import { EditrecordPage } from '../editrecord/editrecord';

import { Camera, CameraOptions } from '../../../node_modules/@ionic-native/camera';
import { THIS_EXPR } from '../../../node_modules/@angular/compiler/src/output/output_ast';
import { AlertController } from 'ionic-angular';
import { Location } from '@angular/common';

import { BackButtonService } from '../../services/backbutton.service';


@IonicPage()
@Component({
  selector: 'record-info',
  templateUrl: 'record.html',
})
export class RecordPage {
  record = [];
  recordList = [];
  ref = firebase.database().ref('member/');
  ref_record = firebase.database().ref();
  login_status: string = 'false';
  account: string;
  imgSrc:any;
  ref2 = firebase.database().ref('record/');

  constructor(private camera: Camera, 
              private location: Location,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private alertCtrl: AlertController,
              public platform: Platform,
              private backButtonService: BackButtonService) {
    // this.login_status = navParams.get('login_status');
    this.login_status = localStorage.getItem('login_status');
    if(this.login_status == 'true'){
      // if login success , get account from loginpage
      // this.account = navParams.get('account');
      this.account = localStorage.getItem('login_account');
      // select
      this.ref.orderByChild("account").equalTo(this.account).on('value', snapshot =>{
        if(snapshot.exists()){
          this.ref_record = firebase.database().ref('record/'+ this.account);
          this.ref_record.orderByKey().once('value', snapshot =>{
            if(snapshot.exists()){
            this.record = [];
            this.record = snapshotToArray(snapshot);
             // console.log(this.record[0]);
            }
            Object.keys(this.record).forEach(key => {
              let detail = {
                time: this.record[key].key,
                content: this.record[key].content
              };
              this.pushRecord(detail);
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
    // console.log(this.login_status);

    // 返回鍵
    this.platform.ready().then(() => {
          this.backButtonService.registerBackButtonAction(null);
      });
  }
  


  pushRecord(record) {

      this.recordList.push(record);

      // console.log(msg);
  }

  add(){
    this.navCtrl.push(EditrecordPage);
  }
  editRecord(i){
    this.navCtrl.push(EditrecordPage,{
      index: i
    });
  }

  delete(i) {
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
            childRef.child(this.record[i].key).remove();
            // this.pageRefresh();
            // this.navCtrl.push(RecordPage);
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }     
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
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