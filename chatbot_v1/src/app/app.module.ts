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

import { ChatService } from "../providers/chat-service";
import { EmojiProvider } from '../providers/emoji';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { Camera } from '@ionic-native/camera';

 

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FCM } from '@ionic-native/fcm';
import { Push } from '../../node_modules/@ionic-native/push';

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
    EditPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
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
    EditPage
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
    FCM
  ]
})
export class AppModule {}
