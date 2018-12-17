import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { ChatPage } from './chat';

@NgModule({
  declarations: [
    ChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
    IonicModule
  ],
  entryComponents: [
    ChatPage
  ]
})
export class ChatPageModule {}
