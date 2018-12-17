import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessagesProvider, ChannelMessage, ChannelName, ChatBotErrorMessage, ChatBotSenderMessage, ChatBotReceiverMessage } from '../messages/messages';
import { Observable } from 'rxjs';
import { tap, switchMap, pluck, catchError, distinctUntilChanged, map } from 'rxjs/operators';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

  URL = 'http://192.168.1.78:5000';

  constructor(
    public http: HttpClient,
    public messageProvider: MessagesProvider,
    private speechRecognition: SpeechRecognition
  ) {
    console.log('Hello ChatProvider Provider');
    const logProcessingObserver = {
      next: next => console.log('Process next: ', next),
      error: error => console.log('Process error: ', error),
      complete: () => console.log('Process complete')
    };
    this.processChatBotMessages().subscribe(logProcessingObserver);
  }

  private processChatBotMessages(): Observable<any> {
    const onResponse = (responseMessage: any) => this.messageProvider.sendChannelMessageTo(new ChatBotReceiverMessage(responseMessage));
    const onError = (error: Error) => this.messageProvider.sendChannelMessageTo(new ChatBotErrorMessage(error.message));
    const handleError = (error: Error) => {
      onError(error);
      // TCO recursive optimisation
      return this.processChatBotMessages();
    };
    return this.readChatBotSenderMessages().pipe(
      switchMap((channelMessage: ChannelMessage) => this.sendChatBotMessage(channelMessage.message)),
      catchError(handleError),
      tap(onResponse),
    );
  }

  private readChatBotSenderMessages(): Observable<ChannelMessage> {
    return this.messageProvider.getMessagesFrom(ChannelName.chatBotSender).pipe(tap(() => console.log('In readChatBotSenderMessages')));
  }

  private sendChatBotMessage(message: string): Observable<any> {
    return this.http.post<string>(`${this.URL}/messages`, { message }).pipe(
      tap(r => console.log('Got r: ', r)),
      map<any, any>(r => ({message: r.message, card: r.card})),
    );
  }

  permission() {
    this.speechRecognition.requestPermission();
  }

  chatBotSendVoice() {
    const onRecognition = matches => this.sendMessageToChatBot(matches[0]);
    const onRecognitionError = error => this.messageProvider.sendChannelMessageTo(new ChatBotErrorMessage(error.message));
    this.speechRecognition.startListening({language: 'fr'}).subscribe(onRecognition, onRecognitionError);
  }

  chatBotIosVoiceStopListening() {
    this.speechRecognition.stopListening()
  }

  sendMessageToChatBot(message) {
    if (!message) {
      return ;
    }
    this.messageProvider.sendChannelMessageTo(new ChatBotSenderMessage(message));
  }

  getChatBotSenderMessages(): Observable<string> {
    return this.messageProvider.getMessagesFrom(ChannelName.chatBotSender).pipe(pluck('message'));
  }
  getChatBotReceiverMessages(): Observable<any> {
    return this.messageProvider.getMessagesFrom(ChannelName.chatBotReceiver).pipe(map(r => ({message: r.message, card: r.card})), tap(rr => console.log('RR: ', rr)));
  }
  getChatBotErrorMessages(): Observable<string> {
    return this.messageProvider.getMessagesFrom(ChannelName.chatBotError).pipe(pluck('message'));
  }

}
