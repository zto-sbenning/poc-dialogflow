import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

export enum ChannelName {
  chatBotSender = '[Message Channel] Dialog Flow Chat Bot Sender',
  chatBotReceiver = '[Message Channel] Dialog Flow Chat Bot Receiver',
  chatBotError = '[Message Channel] Dialog Flow Chat Bot Error',
  log = '[Message Channel] Log',
}

export class ChannelMessage {
  constructor(
    public channel: ChannelName,
    public message: string,
    public card?: any,
  ) {}
}

export class ChatBotSenderMessage extends ChannelMessage {
  constructor(message: string) {
    super(ChannelName.chatBotSender, message);
  }
}
export class ChatBotReceiverMessage extends ChannelMessage {
  constructor(content: any) {
    super(ChannelName.chatBotReceiver, typeof(content) === 'string' ? content : content.message, typeof(content) === 'string' ? undefined : content.card);
  }
}
export class ChatBotErrorMessage extends ChannelMessage {
  constructor(message: string) {
    super(ChannelName.chatBotError, message);
  }
}
export class LogMessage extends ChannelMessage {
  constructor(message: string) {
    super(ChannelName.log, message);
  }
}

const byChannel = (channel: ChannelName) => (message: ChannelMessage) => message && message.channel === channel;

/*
  Generated class for the MessagesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessagesProvider {

  private _channels$: BehaviorSubject<ChannelName[]> = new BehaviorSubject([
    ChannelName.chatBotSender,
    ChannelName.chatBotReceiver,
    ChannelName.log,
  ]);

  private _message$: Subject<ChannelMessage> = new Subject;

  set channels(channels: ChannelName[]) {
    this._channels$.next(channels);
  }
  get channels$(): Observable<ChannelName[]> {
    return this._channels$.asObservable();
  }

  set message(channelMessage: ChannelMessage) {
    this._message$.next(channelMessage);
  }
  get messages$(): Observable<ChannelMessage> {
    return this._message$.asObservable();
  }

  constructor() {
    console.log('Hello MessagesProvider Provider');
  }

  getMessagesFrom(channel: ChannelName): Observable<ChannelMessage> {
    return this.messages$.pipe(filter(byChannel(channel), tap(() => console.log('In getMessagesFrom'))));
  }
  sendMessageTo(channel: ChannelName, message: string) {
    this.message = new ChannelMessage(channel, message);
  }
  sendChannelMessageTo(channelMessage: ChannelMessage) {
    this.message = channelMessage;
  }

}
