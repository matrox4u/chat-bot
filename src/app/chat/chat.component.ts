import {setTimeout} from 'timers';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ChatService} from './chat.service';
import {Utils} from "../common/utils/utils";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService, Utils]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages = [];
  connection;
  message;

  userName;
  loggedInTime;

  nouns: any;

  /**
   *
   * @param {ChatService} chatService
   * @param {Utils} Utils
   */
  constructor(private chatService: ChatService, private Utils: Utils) {
    this.nouns = ['plant operator', "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer"];
  }

  sendMessage() {
    if (!this.message) {
      return;
    }
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.userName = this._randomEl(this.nouns);
    this.loggedInTime = new Date();

    this.connection = this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);

      const result = this.Utils.analyzeAndSaveText(message, this.messages.length);    
      if (result.done) {
        // send message to user
        const newMessage = this.Utils.getRelevantMessage(result.index + 1);
        console.log('newMessage', newMessage);

        const botMessage = 'the answear to your question';
        this.messages.push({text: `Dear, "${this.userName}", ${botMessage} "${result.message}" is :${newMessage.q} ?`, side: "other"});
      }

      setTimeout(() => {
        this._handleUserMessage(message);
      }, 1000);
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  /**
   * Pool question and answers
   * @param message
   * @private
   */
  private _handleUserMessage(message) {
    const parsedMessage = message.text.toLowerCase();
    if (parsedMessage.includes("hello") || parsedMessage.includes("hey") || parsedMessage.includes("hi")) {
      this.messages.push({text: "Hi, from Bot!", side: "other"});
    } else if (parsedMessage.includes("bye")) {
      this.messages.push({text: "Good Bye, from Bot!", side: "other"});
    } else if (parsedMessage.includes("forter")) {
      this.messages.push({text: "Did you mean Forter? You can visit the at :http://www.forter.com/", side: "other"});
    }
  }

  /**
   * Generate random user name
   * @param list
   * @returns {any}
   * @private
   */
  private _randomEl(list) {
    return list[Math.floor(Math.random() * list.length)];
  }
}
