import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Button } from 'ionic-angular';
import * as firebase from 'Firebase';
import { EditPage } from '../edit/edit';
import { LoginPage } from '../login/login';
import { Camera, CameraOptions } from '../../../node_modules/@ionic-native/camera';
import { THIS_EXPR } from '../../../node_modules/@angular/compiler/src/output/output_ast';
import { AlertController } from 'ionic-angular';
import { Location } from '@angular/common';

import { BackButtonService } from '../../services/backbutton.service';

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
  ref = firebase.database().ref('member/');
  login_status: string = 'false';
  account: string;
  imgSrc:any;

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
          this.info = [];
          this.info = snapshotToArray(snapshot);
          this.imgSrc = `${this.info[0].avatar}`;
          // console.log(this.info[0].name);
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
    // this.platform.ready().then(() => {
    //   this.backButtonService.registerBackButtonAction(null);
    // });
  }
  
  choose() {
    let alert = this.alertCtrl.create({
        title: '選擇圖片來源',
        inputs: [
          {
            name: 'album',
            type: 'radio',
            label: '從相簿選擇',
            value: '0',
            checked: false,
            
          },
          {
            name: 'cam',
            type: 'radio',
            label: '開啟相機',
            value: '1',
            checked: false

          }
        ],
        buttons: [
          {
            text: '取消',
            role: 'cancel'
          },
          {
            text: '確定',
            handler: data => {

              // this.presentAlert(data)
              if (data == 0) {
                  this.selectPhoto()
              } else {
                this.takePhoto()
              }
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
      // set option of the photo
      const options: CameraOptions ={
      quality: 100,
      targetHeight: 300,
      targetWidth: 300,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    const result = await this.camera.getPicture(options);

    // add photo to firebase storage
    const image = `data:image/jpeg;base64,${result}`;
    const pictures = firebase.storage().ref('userPhoto/'+this.account);
    pictures.putString(image, 'data_url');
    // getImageUrl then update url to member avatar url
    this.getVenueImage(this.account);
    }
    catch(e){
      console.error(e);
    }
    
  }

  async selectPhoto(){
    try{
      const options: CameraOptions ={
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        quality: 100,
        encodingType: this.camera.EncodingType.PNG,
        targetWidth:   300,
        targetHeight:  300
      }
    const result = await this.camera.getPicture(options);
    // add photo to firebase storage
    const image = `data:image/jpeg;base64,${result}`;
    const pictures = firebase.storage().ref('userPhoto/'+this.account);
    pictures.putString(image, 'data_url');
    // getImageUrl then update url to member avatar url
    this.getVenueImage(this.account);
    }
    catch(e){
      console.error(e);
    }
  }
  
  public getVenueImage(account: string){
    try{
      firebase.storage().ref().child("/userPhoto/" + account ).getDownloadURL().then((url:string)=>{
        // get url
        console.log("imageUrl : " + url);
        // update Url to member avatar
        this.updateUrlToMember(url);
      })
    }
    catch(e){
      console.log(e);
    }   
  }

  public updateUrlToMember(url: string) : any{
    this.ref.orderByChild("account").equalTo(this.account).once('value', (snapshot) =>{
      let key = Object.keys(snapshot.val())[0];
      this.ref.child(key).update({
        avatar: url
      }, error => {
        if (error) {
          console.log("*** error ***");
        } else {
          console.log("*** success ***");   
          // if success then reload page 
          localStorage.setItem('login_avatar', url);
          this.navCtrl.setRoot(InfoPage);          
        }
      });
      // console.log(key);
    });
  }
  

  ionViewDidLoad() {
  }

  public edit_btn  : boolean = true;

  edit(){
    this.navCtrl.push(EditPage);
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