import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { RecordPage } from '../record/record';
import { LoginPage } from '../login/login';
import * as firebase from 'Firebase';

/**
 * Generated class for the EditrecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editrecord',
  templateUrl: 'editrecord.html',
})
export class EditrecordPage {

  ref = firebase.database().ref('member/');
  ref_record = firebase.database().ref();
  ref2 = firebase.database().ref('record/');
  getrecord = [];
  account: string;
  record = {
    content: ''
  };
  i: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    this.account = localStorage.getItem('login_account');
    this.i = navParams.get('index');
    if(this.i != null){
      this.ref.orderByChild("account").equalTo(this.account).on('value', snapshot =>{
        if(snapshot.exists()){
          this.ref_record = firebase.database().ref('record/'+ this.account);
          this.ref_record.orderByKey().once('value', snapshot =>{
            if(snapshot.exists()){
            this.getrecord = [];
            this.getrecord = snapshotToArray(snapshot);
            this.record.content = this.getrecord[this.i].content;
            //console.log(this.getrecord[this.i].content);
            }
          });
        }else{
          this.navCtrl.setRoot(LoginPage);
        }
      });
    }
    else{
      this.record.content = '';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditrecordPage');
  }
  back(){
  	this.navCtrl.setRoot(RecordPage);
  }
  public insertRecord(form: any): void{
    var childRef = this.ref2.child(this.account);
    var time = Date.now().toString();
    if(this.i != null){
      childRef.child(this.getrecord[this.i].key).update({
        content: this.record.content
      }, error => {
        if (error) {
          this.showAlert("修改失敗","請再試一次");
        } else {
          this.showAlert("修改成功","");
          this.back();     
        }
      });
    }
    else{
      childRef.child(time).set({
        content: this.record.content
      }, error => {
        if (error) {
          this.showAlert("新增失敗","請再試一次");
        } else {
          this.showAlert("新增成功","");
          this.back();     
        }
      });
    }
    
    this.back();
  }

  showAlert(title,text) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['確定']
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
