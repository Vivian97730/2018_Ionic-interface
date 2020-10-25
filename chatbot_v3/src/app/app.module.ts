import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { InfoPage } from '../pages/info/info';
import { ChatPage } from '../pages/chat/chat';
import { AlarmPage } from '../pages/alarm/alarm';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { EditPage } from '../pages/edit/edit';
import { EditalarmPage } from '../pages/editalarm/editalarm'
import { RecordPage } from '../pages/record/record';
import { EditrecordPage } from '../pages/editrecord/editrecord';
import { EntrancePage } from '../pages/entrance/entrance';

import { ChatService } from "../providers/chat-service";
import { EmojiProvider } from '../providers/emoji';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { Camera } from '@ionic-native/camera';
import { LocalNotifications } from '@ionic-native/local-notifications';

 

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';

import { FCM } from '@ionic-native/fcm';
import { Push } from '../../node_modules/@ionic-native/push';
import { BackButtonService } from '../services/backbutton.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    InfoPage,
    EditalarmPage,
    ChatPage,
    AlarmPage,
    LoginPage,
    SignupPage,
    EditPage,
    RecordPage,
    EditrecordPage,
    EntrancePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    InfoPage,
    ChatPage,
    AlarmPage,
    LoginPage,
    EditalarmPage,
    SignupPage,
    EditPage,
    RecordPage,
    EditrecordPage,
    EntrancePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EmojiProvider,
    ChatService,
    BrowserModule,
    Push,
    HttpClientModule, HttpClient,
    Camera,
    FCM,
    BackButtonService,
    LocalNotifications
  ]
})
export class AppModule {}
