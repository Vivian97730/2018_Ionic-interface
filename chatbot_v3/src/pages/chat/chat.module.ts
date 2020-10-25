import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { ChatService } from "../../providers/chat-service";
import { RelativeTime } from "../../pipes/relative-time";
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emoji";

import { HttpClientModule, HttpClient } from "@angular/common/http";



@NgModule({
  declarations: [
    ChatPage,
    RelativeTime
  ],
  imports: [
    EmojiPickerComponentModule,
    IonicPageModule.forChild(ChatPage),
  ],
  exports: [
    ChatPage
  ],
  providers: [
    ChatService,
    EmojiProvider,
    HttpClientModule, HttpClient
  ]
})
export class ChatPageModule {
}
