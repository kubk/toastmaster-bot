import { Dashbot } from 'dashbot';

export class Analytics {
  constructor(private dashbot: Dashbot) {}

  trackUserMessage(fromUserId: string, message: string): Promise<unknown> {
    return this.dashbot.logIncoming({
      text: message,
      userId: fromUserId
    });
  }

  trackBotMessage(toUserId: string, message: string): Promise<unknown> {
    return this.dashbot.logOutgoing({
      text: message,
      userId: toUserId
    });
  }
}
