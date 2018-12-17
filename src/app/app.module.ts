import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MessagesProvider } from '../providers/messages/messages';
import { ChatProvider } from '../providers/chat/chat';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePageModule } from '../pages/home/home.module';
import { AboutPageModule } from '../pages/about/about.module';
import { ChatPageModule } from '../pages/chat/chat.module';
import { ContactPageModule } from '../pages/contact/contact.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';

import { SpeechRecognition } from '@ionic-native/speech-recognition';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AboutPageModule,
    ChatPageModule,
    ContactPageModule,
    HomePageModule,
    TabsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MessagesProvider,
    ChatProvider,
    SpeechRecognition
  ]
})
export class AppModule {}
