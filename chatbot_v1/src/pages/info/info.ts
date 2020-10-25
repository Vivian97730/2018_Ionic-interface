import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'Firebase';
import { EditPage } from '../edit/edit';
import { LoginPage } from '../login/login';
import { Camera, CameraOptions } from '../../../node_modules/@ionic-native/camera';
import { THIS_EXPR } from '../../../node_modules/@angular/compiler/src/output/output_ast';
import { AlertController } from 'ionic-angular';
import { Location } from '@angular/common';


/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  info = [];
  record = [];
  recordList = [];
  ref = firebase.database().ref('member/');
  ref_record = firebase.database().ref();
  login_status: string = 'false';
  account: string;
  imgSrc:any;
  ref2 = firebase.database().ref('record/');
  


  constructor(private location: Location, 
              private camera: Camera, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private alertCtrl: AlertController) {
    // this.login_status = navParams.get('login_status');
    this.login_status = localStorage.getItem('login_status');
    if(this.login_status == 'true'){
      // if login success , get account from loginpage
      // this.account = navParams.get('account');
      this.account = localStorage.getItem('login_account');
      // select
      this.ref.orderByChild("account").equalTo(this.account).on('value', snapshot =>{
        if(snapshot.exists()){
          this.info = [];
          this.info = snapshotToArray(snapshot);
          this.imgSrc = `${this.info[0].avatar}`;
          // console.log(this.info[0].name);
          this.ref_record = firebase.database().ref('record/'+ this.account);
          this.ref_record.orderByKey().once('value', snapshot =>{
            if(snapshot.exists()){
            this.record = [];
            this.record = snapshotToArray(snapshot);
            //  console.log(this.record[0]);
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
  }

  pushRecord(record) {

      this.recordList.push(record);

      // console.log(msg);
  }

  add() {
    let alert = this.alertCtrl.create({
      title: '身體狀況紀錄',
      inputs: [
        // {
        //   name: 'time',
        //   placeholder: '時間',
        //   type: 'datetime'
        // },
        {
          // name: 'content',
          placeholder: '身體狀況描述',
          type: 'textarea'
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
        },
        {
          text: '新增',
          handler: data => {            
            var childRef = this.ref2.child(this.account);
            var time = Date.now().toString();
            childRef.child(time).set({
              content: data[0]
            });
            this.pageRefresh();
          }
        }
      ]
    });
    alert.present();
  }

  editRecord(i) {
    let alert = this.alertCtrl.create({
      title: '身體狀況紀錄',
      inputs: [
        // {
        //   name: 'time',
        //   placeholder: '時間',
        //   type: 'datetime'
        // },
        {
          //name: 'record',
          value: this.record[i].content,
          type: 'textarea'
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
        },
        {
          text: '確定修改',
          handler: data => {            
            var childRef = this.ref2.child(this.account);
            var time = Date.now().toString();
            // console.log(data[0]);
            childRef.child(this.record[i].key).update({
              content: data[0]
            });
            this.pageRefresh();
          }
        }
      ]
    });
    alert.present();
  }

  delete(i) {
  let alert = this.alertCtrl.create({
    title: '刪除紀錄',
    subTitle: '確定要刪除這筆紀錄嗎？',
    buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: '確定',
          handler: data => {            
            var childRef = this.ref2.child(this.account);
            var time = Date.now().toString();
            // console.log(data[0]);
            childRef.child(this.record[i].key).remove();
            this.pageRefresh();
          }          
        }
      ]
  });
  alert.present();
  }
  pageRefresh() {
    location.reload();
 }

  async takePhoto(){
    try{
      const options: CameraOptions ={
      quality: 50,
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    const result = await this.camera.getPicture(options);

    const image = `data:image/jpeg;base64,${result}`;

    const pictures = firebase.storage().ref('userPhoto/'+this.account);
    pictures.putString(image, 'data_url');
    }
    catch(e){
      console.error(e);
    }
    
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }

   ionViewWillEnter() {
    
  }
  
  public detail: boolean = false;
  public detail_btn: boolean = false;
  public edit_btn  : boolean = false;

  public show(){
  	this.detail     = !this.detail;
  	this.detail_btn = !this.detail_btn;
    this.edit_btn   = !this.edit_btn;
  }

  edit(){
    this.navCtrl.setRoot(EditPage);
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