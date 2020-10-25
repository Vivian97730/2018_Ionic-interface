import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InfoPage } from '../info/info';
import * as firebase from 'Firebase';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the EditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {
	ref = firebase.database().ref('member/');

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {

  }
  //update data to firebase
  // info=[];
  info={
    account: '',
    password: '',
    name: '',
    nickname: '',
    sexual: '',
    birth: '',
    blood: '',
    emergePerson: '',
    emergePhone: '',
    sick: '',
    chatbot: '',
    avatar: ''
  };
  member_id: string;
	public repassword:any; 

  checkform(){
    // var acc = this.info.account;
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
    // console.log('ionViewDidLoad EditPage');
    this.ref.orderByChild("account").equalTo(localStorage.getItem('login_account')).on('value', snapshot =>{
      if(snapshot.exists()){
        this.member_id = Object.keys(snapshot.val())[0];
        //console.log(this.member_id);

        var result = snapshotToArray(snapshot);
        this.info.account = result[0].account;
        this.info.password = result[0].password;
        this.info.name = result[0].name;
        this.info.nickname = result[0].nickname;
        this.info.sexual = result[0].sexual;
        this.info.birth = result[0].birth;
        this.info.blood = result[0].blood;
        this.info.emergePerson = result[0].emergePerson;
        this.info.emergePhone = result[0].emergePhone;
        this.info.sick = result[0].sick;
        this.info.chatbot = result[0].chatbot;
        this.info.avatar = result[0].avatar;
      }
    });
  }


  backInfoPage(){
    this.navCtrl.setRoot(InfoPage);
  }

  submitForm(form: any): void{	
    console.log('Form Data: ');
    console.log(this.member_id);

    var pass = this.info.password;
    var repassword = this.repassword;
    var name = this.info.name;
		var i;
		var correct = name.length;
    var sex = this.info.sexual;

    var emergePerson = this.info.emergePerson;
		var emergePhone = this.info.emergePhone;
		var correctx = emergePerson.length;
    var x;
    
		for (x = 0 ; x < emergePerson.length ; x++ ){
			if(emergePerson.charCodeAt(x) > 128){
				correctx--;
			}
		}
    for (i = 0 ; i < name.length ; i++ ){
			if(name.charCodeAt(i) > 128){
				correct--;
			}
    }

    if (pass.length >= 8) {
      if (pass == repassword) {
        if (correct == 0) {
          if (name.length != 0) {
            if (correctx == 0) {
              if (emergePerson.length != 0) {
                if (emergePhone.length == 10) {				
                  
                  this.ref.child(this.member_id).update({
                    account: this.info.account,
                    password: this.info.password,
                    name: this.info.name,
                    nickname: this.info.nickname,
                    birth: this.info.birth,
                    blood: this.info.blood,
                    emergePerson: this.info.emergePerson,
                    emergePhone: this.info.emergePhone,
                    sick: this.info.sick,
                    chatbot: this.info.chatbot
                  }, error => {
                    if (error) {
                      this.showAlert('修改失敗','請再試一次');
                    } else {
                      this.showAlert('修改完成','');
                      localStorage.setItem('login_robot', this.info.chatbot);

                      this.navCtrl.setRoot(InfoPage);        
                    }
                  });
                } else {
                    this.showAlert('聯絡人電話輸入錯誤','請輸入電話(共10碼)');	
                  }	
              } else {
                  this.showAlert('聯絡人姓名輸入錯誤','請輸入緊急聯絡人名字');	
                }
            } else {
                this.showAlert('名字有誤','名字只能輸入國字喔');
              }
          } else {
              this.showAlert('名字有誤','請輸入名字');	
            }
        } else {
            this.showAlert('名字有誤','名字只能輸入國字喔');
          }
      } 
      else {
          this.showAlert('密碼驗證有誤','請再檢查一次');	
        }
    } else {
        this.showAlert('密碼設定有誤','至少8碼');
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