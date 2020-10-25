import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InfoPage } from '../info/info';
import * as firebase from 'Firebase';
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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {

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

  ionViewWillEnter() {

  }

  submitForm(form: any): void{	
    console.log('Form Data: ');
    console.log(this.member_id);
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
        console.log("*** error ***");
      } else {
        console.log("*** success ***");
        this.navCtrl.setRoot(InfoPage);        
      }
    });
  }

  backInfoPage(){
    this.navCtrl.setRoot(InfoPage);
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