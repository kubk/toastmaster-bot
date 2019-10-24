declare module 'dashbot' {
  export interface Message {
    userId: string | number;
    text: string;
    intent?: {
      name: string;
      inputs: Array<{ name: string; value: string }>;
    };
    images?: Array<{ url: string }>;
    platformJson?: { [key in string]: any };
  }

  export interface Dashbot {
    logIncoming(message: Message): Promise<unknown>;
    logOutgoing(message: Message): Promise<unknown>;
  }

  declare function createDashbot(
    apiToken: string
  ): {
    universal: Dashbot;
  };

  export = createDashbot;
}
