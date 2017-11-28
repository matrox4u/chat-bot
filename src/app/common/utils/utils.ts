export class Utils {

  constructor() {
    // Clear data on init
    window.sessionStorage.clear();
  }

  public analyzeAndSaveText(message: any, arrIndex: number): any {
    let hookBot= {
      done: false,
      message:"",
      index: 0
    };
    if (message.type.includes("new-message")) {
      
      // check if message already exist
      if (this.checkIfMessageExist(message.text.toLowerCase())) {
        console.log('message was asked twice, third time, robot should answer', message);
        hookBot.message = message.text;
        hookBot.done = true;
        hookBot.index = this._getKeyIndex(message.text);
        return hookBot;
      } else {
        let data = JSON.parse(window.sessionStorage.getItem('message') || null);
        if (!data) {
          data = [];
        }
        data.push({q: message.text, number: 0, index:arrIndex});
        window.sessionStorage.setItem('message', JSON.stringify(data));
      }
    }

    return hookBot;
  }

  private _getKeyIndex (key: string) :number{
    const dataFromSession = JSON.parse(window.sessionStorage.getItem('message') || null);
    let indexLoop = 0; 

    dataFromSession.forEach(function (messageFrom) {
      if (messageFrom.q === key) {
        indexLoop = messageFrom.index;  
      }
    });
    return indexLoop;
  }

  public getRelevantMessage(index: number) :any {
    const dataFromSession = JSON.parse(window.sessionStorage.getItem('message') || null);
    let message = 0; 

    dataFromSession.forEach(function (messageFrom) {
      if (messageFrom.index === index) {
        message = messageFrom;  
      }
    });
    return message;
  }

  public checkIfMessageExist(message: string): boolean {
    let exist = false;

    const dataFromSession = JSON.parse(window.sessionStorage.getItem('message') || null);
    if (!dataFromSession) {
      return false;
    }
    dataFromSession.forEach(function (messageFrom) {
      if (messageFrom.q === message) {
        messageFrom.number++;

        //console.log(`foreach [${messageFrom.q} - ${message}]`);
        exist = true;
      }
    });
    window.sessionStorage.setItem('message', JSON.stringify(dataFromSession));

    return exist;
  }
}
