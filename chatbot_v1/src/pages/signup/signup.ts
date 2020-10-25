import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { InfoPage } from '../info/info';
import * as firebase from 'Firebase';
import { AlertController } from 'ionic-angular';
import { containerEnd } from '../../../node_modules/@angular/core/src/render3/instructions';
import { HomePage } from '../home/home';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

	ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  ionViewWillEnter() {
   
  }

	backHome(){
    this.navCtrl.setRoot(HomePage);
  }

	ref = firebase.database().ref('member/');

  constructor(public navCtrl: NavController, 
  						public navParams: NavParams, 
  						public alertCtrl: AlertController) {
  }

  showAlert(title,text) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['確定']
    });
    alert.present();
  }
  
  //insert data to firebase
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
  public insertMember(form: any): void{	
	console.log('Form Data: ');
	if(this.info.account!='' && this.info.password!='' && this.info.name!='' && this.info.sexual!='' && this.info.birth!='' && this.info.blood!='' && this.info.emergePerson!='' && this.info.emergePhone!='' && this.info.chatbot!=''){
		if(this.info.sexual == 'F'){
				this.ref.push({
					account: this.info.account,
					password: this.info.password,
					name: this.info.name,
					nickname: this.info.nickname,
					sexual: this.info.sexual,
					birth: this.info.birth,
					blood: this.info.blood,
					emergePerson: this.info.emergePerson,
					emergePhone: this.info.emergePhone,
					sick: this.info.sick,
					chatbot: this.info.chatbot,
					avatar: 'https://firebasestorage.googleapis.com/v0/b/chatbot-mis108.appspot.com/o/images%2Fdefault_woman.png?alt=media&token=1af17dd8-89ac-46f8-989f-7935030a2f18',
					time: Date.now()
				})
				// console.log(this.info);
			}
			else{
				this.ref.push({
					account: this.info.account,
					password: this.info.password,
					name: this.info.name,
					nickname: this.info.nickname,
					sexual: this.info.sexual,
					birth: this.info.birth,
					blood: this.info.blood,
					emergePerson: this.info.emergePerson,
					emergePhone: this.info.emergePhone,
					sick: this.info.sick,
					chatbot: this.info.chatbot,
					avatar: 'https://firebasestorage.googleapis.com/v0/b/chatbot-mis108.appspot.com/o/images%2Fdefault_man.png?alt=media&token=cccb8429-aefd-4bf8-8f90-90c4bd2214cb',
					time: Date.now()
				})
				// console.log(this.info);
		}
	
	
	}
	
  }
	  
	// public account:any;
	// public password:any;
	public repassword:any; 
	// public name:any;
	// public nickname:any;
	// public info_birth:any;
	// public info_blood:any;
	// public emergePerson:any;
	// public emergePhone:any;
	// public info_sexual:any;
	// public info_chatbot:any;
	
	//上/下步按鈕
	//再加 required, validator
	public step1: boolean = true;		
	public step2: boolean = false; 	
	public step3: boolean = false;
	public step4: boolean = false;
	public step5: boolean = false;
	public step6: boolean = false;
  
 	public backStep1() {
  		this.step1 = true;
		this.step2 = false;
	}

 	public goStep2() {	
		this.ref.orderByChild("account").equalTo(this.info.account).once('value', snapshot =>{
			if(snapshot.exists()){
				this.showAlert('','此帳號已被使用，請再次輸入');
				// console.log(snapshot.exists());
			}	
			else{
				var acc = this.info.account;
				var pass = this.info.password;
				var repassword = this.repassword;
				// 密碼還沒限定
				if (acc.length == 10) {
					if (pass.length >= 8) {
						if (pass == repassword) {
							this.step1 = false;
							this.step2 =true;			
						} else {
							this.showAlert('密碼驗證有誤','請再檢查一次');	
						}
					} else {
						this.showAlert('密碼設定有誤','至少8碼');
					}
				} else {
					this.showAlert('帳號設定有誤','帳號為10碼喔');
				}
			}			
		});		
	}

	public backStep2() {
		this.step2 = true;
		this.step3 = false;
	}

	public goStep3() {

		var name = this.info.name;
		var i;
		var correct = name.length;
		var sex = this.info.sexual;
		for (i = 0 ; i < name.length ; i++ ){
			if(name.charCodeAt(i) > 128){
				correct--;
			}
		}

		if (correct == 0) {
			if (name.length != 0) {
				if (sex != "") {
					this.step2 = false;
					this.step3 = true;	
				} else {
					this.showAlert('性別','請選擇性別');
				}
			} else {
				this.showAlert('名字有誤','請輸入名字');	
			}
		} else {
			this.showAlert('名字有誤','名字只能輸入國字喔');
		}

	}

	public backStep3() {
		this.step3 = true;
		this.step4 = false;
	}
	public goStep4() {
		var birth = this.info.birth;
		var blood = this.info.blood;
		if (birth != "") {
			if (blood != "") {
				this.step3 = false;
				this.step4 = true;			
			} else {
				this.showAlert('血型選擇','請選擇血型');
			}
		} else {
			this.showAlert('生日有誤','請選擇生日');
		}
		
	}

	public backStep4() {
		this.step4 = true;
		this.step5 = false;
	}

	public goStep5() {
		var emergePerson = this.info.emergePerson;
		var emergePhone = this.info.emergePhone;
		var correct = emergePerson.length;
		var i;
		for (i = 0 ; i < emergePerson.length ; i++ ){
			if(emergePerson.charCodeAt(i) > 128){
				correct--;
			}
		}

		if (correct == 0) {
			if (emergePerson.length != 0) {
				if (emergePhone.length == 10) {				
					this.step4 = false;
					this.step5 = true;					
				} else {
					this.showAlert('聯絡人電話輸入錯誤','請輸入電話(共10碼)');	
				}	
			} else {
				this.showAlert('聯絡人姓名輸入錯誤','請輸入緊急聯絡人名字');	
			}
		} else {
			this.showAlert('名字有誤','名字只能輸入國字喔');
		}
	}

	public backStep5() {
		this.step5 = true;
		this.step6 = false;
	}


	public goStep6() {
		this.step5 = false;
		this.step6 = true;
	}

	public end(){
		var chatbot = this.info.chatbot;
		if (chatbot!="") {
		  this.showAlert('註冊完成','恭喜!');
		  localStorage.setItem('login_status', 'true');
          localStorage.setItem('login_account', this.info.account);
		  localStorage.setItem('login_name', this.info.name);
		  this.navCtrl.setRoot(InfoPage);
		  } else {
		  this.showAlert('選擇機器人','請選擇機器人模型');
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
