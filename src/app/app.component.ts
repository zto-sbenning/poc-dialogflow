import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { ChatPage } from '../pages/chat/chat';
import { ChatProvider } from '../providers/chat/chat';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = ChatPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public chat: ChatProvider
  ) {
    platform.ready().then(() => {
      this.chat.permission();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });
  }
}
