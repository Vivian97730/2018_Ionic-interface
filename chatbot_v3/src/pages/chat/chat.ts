import { Component, ElementRef, ViewChild } from '@angular/core';
// import { IonicPage, NavParams } from 'ionic-angular';
import { Events, Content } from 'ionic-angular';
import { ChatService, ChatMessage, UserInfo } from "../../providers/chat-service";
import { HomePage } from '../home/home';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as firebase from 'Firebase';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Http , Headers} from '@angular/http';
import 'rxjs/add/operator/map'
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  
  @ViewChild('chat_input') messageInput: ElementRef;
  msgList: ChatMessage[] = [];
  user= {
    id: '',
    name: '',
    avatar: '',
    robot:'',
    key:''
  };
  compareTime=0;
  countTmpMsg= 0;
  history= 0;
  // healthDisable:boolean=false;
  // chatDisable:boolean=false;
  chat='';
  health='';

  active = 'active disable-hover button button-md button-default button-default-md';
  inactive = 'inactive disable-hover button button-md button-default button-default-md';
  robotAvatar: string = `https://firebasestorage.googleapis.com/v0/b/chatbot-mis108.appspot.com/o/images%2Frobot.png?alt=media&token=8f87ea89-df23-4e18-8914-e13fc126c1e2`;
  editorMsg = '';
  showEmojiPicker = false;

  message = [];
  ref2 = firebase.database().ref();
  

  constructor(navParams: NavParams,
              public navCtrl: NavController,
              private chatService: ChatService,
              private events: Events,
              public HttpClient: HttpClient,
              public http: Http) {

    // load global variable
    this.user.id = localStorage.getItem('login_account');
    this.user.name = localStorage.getItem('login_name');
    this.user.avatar = localStorage.getItem('login_avatar');
    this.user.robot = localStorage.getItem('login_robot');
    this.user.key = localStorage.getItem('login_memberId');

    if(this.user.robot == 'health'){
      // this.healthDisable = true;
      this.health = this.active;
      this.chat = this.inactive;
    }else{
      this.health = this.inactive;
      this.chat = this.active;
    }

    // console.log(this.user.robot);

    this.ref2 = firebase.database().ref('message/'+ this.user.id);
    // this.ref.orderByKey().equalTo(this.user.id).on('value', snapshot =>{
    this.ref2.orderByKey().once('value', snapshot =>{
      if(snapshot.exists()){
      this.message = [];
      this.message = snapshotToArray(snapshot);
      // console.log(this.message[0]);
      }
      Object.keys(this.message).forEach(key => {
        let oldMsg: ChatMessage = {
          messageId: '',
          userId: this.user.id,
          userName: this.user.name,
          userAvatar: this.user.avatar,
          // toUserId: this.toUser.id,
          time: this.message[key].key,
          message: this.message[key].content,
          status: 'success',
          role: this.message[key].role,
          url: this.message[key].url
        };
        
        this.pushNewMsg(oldMsg);
        this.history++;
        //console.log(this.msgList);
      });
      // console.log("history"+this.history);
    });
  }

  ionViewWillLeave() { 
  }

  ionViewDidEnter() {
    
    this.ref2 = firebase.database().ref('message/'+ this.user.id);
    // this.ref.orderByKey().equalTo(this.user.id).on('value', snapshot =>{
    this.ref2.orderByKey().on('value', snapshot =>{
      if(snapshot.exists()){
      this.message = [];
      this.message = snapshotToArray(snapshot);
      // console.log(this.message[0]);
      }
      // this.history = this.countOldMsg;
      this.countTmpMsg= 0;
      Object.keys(this.message).forEach(key => {
        let tmpMsg: ChatMessage = {
          messageId: '',
          userId: this.user.id,
          userName: this.user.name,
          userAvatar: this.user.avatar,
          // toUserId: this.toUser.id,
          time: this.message[key].key,
          message: this.message[key].content,
          status: 'success',
          role: this.message[key].role,
          url: this.message[key].url
        };
        
        this.countTmpMsg++;
          if(this.history < this.countTmpMsg){
            this.history=this.history+1;
            if(tmpMsg.role != 'user')
              this.pushNewMsg(tmpMsg);
            // console.log("--history"+this.history);

          }
        
        // console.log(this.msgList);
      });
      // console.log("tmp"+this.countTmpMsg);
    });
    
  }

  ref = firebase.database().ref('message/');
  
/**
 * @name sendMsg
 */
  sendMsg() {
    if (!this.editorMsg.trim()) return;

    // message content
    const id = Date.now().toString();
    var msgTime = Date.now();
    let newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: this.user.id,
      userName: this.user.name,
      userAvatar: this.user.avatar,
      time: msgTime,
      message: this.editorMsg,
      status: 'pending',
      role: 'user',
      url: ''
    };
    // console.log(newMsg);
    this.compareTime = msgTime;
    this.pushNewMsg(newMsg);
    // push msg into firebase
    var childRef = this.ref.child(newMsg.userId);

    childRef.child(newMsg.messageId).set({
      content: newMsg.message,
      role: "user"
    });
    // this.countOldMsg = this.countOldMsg + 2;
    // console.log("old"+this.countOldMsg);

    //reset msg inputbox
    this.editorMsg = '';

    if (!this.showEmojiPicker) {
      this.focus();
    }

    this.chatService.sendMsg(newMsg)
    .then(() => {
      let index = this.getMsgIndexById(id);
      if (index !== -1) {
        this.msgList[index].status = 'success';
      }
    })


//-----------send message to server--------------------
    // curl header
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    console.log(this.user.robot);
    
    // send content
    let body = {  
        "account": this.user.id,
        "content": newMsg.message,
        "timestamp" : id ,
        "flag": this.user.robot
    };
    
    // send message to server
    this.http.put('http://140.117.71.223:5000/messages/message', JSON.stringify(body), {headers: headers})
    .map(data => {
      console.log(data);
    }).subscribe(data => {
      console.log(data);
     });

//-----------send message to server end--------------------


  }

/**
 * @name pushNewMsg
 * @param msg
 */
  pushNewMsg(msg: ChatMessage) {
    const userId = this.user.id;
      // toUserId = this.toUser.id;

      this.msgList.push(msg);

      // console.log(msg);
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.messageId === id)
  }


  scrollToBottom() {
    setTimeout(() => {
      if (this.content._scroll) {
        this.content.scrollToBottom(0);
      }
    }, 400)
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea =this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }

  changeType(type) {
    // console.log(this.user.key);
      if(type=='health'){
        var memberRef = firebase.database().ref('member/'+this.user.key);
        memberRef.update({
          chatbot: type
        }, error => {
          console.log(error);
        });
        this.user.robot = 'health';
        // this.healthDisable = true;
        // this.chatDisable = false;
        this.health = this.active;
      this.chat = this.inactive;

      }else{
        var memberRef = firebase.database().ref('member/'+this.user.key);
        memberRef.update({
          chatbot: type
        }, error => {
          console.log(error);
        });
        this.user.robot = 'chat';
        // this.chatDisable = true;
        // this.healthDisable = false;
        this.health = this.inactive;
      this.chat = this.active;

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
