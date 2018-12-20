import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { take, tap, catchError } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { ChannelMessage, ChannelName } from '../../providers/messages/messages';

const asap = (fn: () => void) => setTimeout(fn, 0);

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  ip;
  myMessage : string;
  sending : boolean;

  conversation: {sender: string, message: string, card?: any, suggestion?: any}[] = [];

  iosListening = false;

  subscription: Subscription;

  @ViewChild(Content) ionContent: Content;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public chat: ChatProvider,
    public detector: ChangeDetectorRef
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    
    const messagesObserver = (sender: string) => (content: any) => {
      const message = typeof(content) === 'string' ? content : content.message;
      const card = typeof(content) === 'string' ? undefined : content.card;
      const suggestion = typeof(content) === 'string' ? undefined : content.suggestion;
      this.sending = false;
      const lastMessage = this.conversation[this.conversation.length - 1];
      /*
      if (lastMessage && lastMessage.message === message) {
        return ;
      }
      */
      console.log('SSSSSSS:', suggestion);
      console.log('CCCCCCC:', card);
      this.conversation.push({ message, sender, card, suggestion });
      this.detector.detectChanges();
    };
    
    const myMessagesObserver = messagesObserver('me');
    const botMessagesObserver = messagesObserver('bot');
    
    const process$ = Observable.merge(
      this.chat.getChatBotSenderMessages().pipe(tap(myMessagesObserver)),
      this.chat.getChatBotReceiverMessages().pipe(tap(botMessagesObserver)),
    );

    const reStartProcess = () => process$;

    this.subscription = process$.pipe(catchError(reStartProcess)).subscribe(i => console.log('IIIIIIIII: ', i));
  
  }

  ipCo() {
    this.chat.ipCo(`http://${this.ip}:8090`);
  }

  onEnter() {
    this.sendMessage();
  }

  sendMessage(m?) {
    this.sending = true;
    this.chat.sendMessageToChatBot(m ? m : this.myMessage);
    this.myMessage = '';
  }

  sendVoice() {
    this.iosListening = true;
    this.chat.chatBotSendVoice();
  }

  endVoice() {
    this.sending = true;
    this.iosListening = false;
    this.chat.chatBotIosVoiceStopListening();
  }

  afficher() {
    alert('You\'ll see Steamulo query result here');
  }
  /*
  listenResponse() {

    Observable.merge(
      this.chat.chatBoxReceiverMessages().pipe(
        tap(() => this.myMessage = ''),
        tap((r) => {
          console.log('In process, got message: ', r);
          // alert('OKK');
        })
      ),
      this.chat.chatBoxErrorMessages()
    ).pipe(
      take(1),
    ).subscribe((channelMessage: string) => {
      this.sending = false;
      this.conversation = [...this.conversation, {sender: 'bot', message: channelMessage}];
      this.detector.detectChanges();
      // asap(() => this.ionContent.scrollToBottom());
    }, e => this.sending = false);
  }
  */

}
