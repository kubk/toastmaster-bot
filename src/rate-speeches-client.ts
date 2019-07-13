import { AxiosInstance } from 'axios';
import axios from 'axios';
import * as HtmlParser from 'node-html-parser';
import { HTMLElement } from 'node-html-parser';
import * as querystring from 'querystring';

export class RateSpeechesClient {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      headers: {
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Origin': 'http://www.ratespeeches.com',
        'Upgrade-Insecure-Requests': '1',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Referer': 'http://www.ratespeeches.com/t=Toastmaster-Table-Topics',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9,uk;q=0.8,ru;q=0.7',
        'Cookie': `__utmz=253024394.1561920309.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utma=253024394.461330039.1561920309.1561922868.1562004024.3; 6c98c422b8d7b4ca3ec4af6c50ce0c35=t0f64pkijniquns9bt7nfgojm2`,
      }
    })
  }

  async getRandomTopics(): Promise<string[]> {
    const response = await this.http({
      method: 'POST',
      url: 'http://www.ratespeeches.com/t=Toastmaster-Table-Topics',
      data: querystring.stringify({
        'generate_cnt': '5',
        'topic_generate': 'Generate+Toastmaster+Table+Topics',
        'context': 'TopicGenerator',
        'title_index': '56',
        'display_patterns': 'no',
      }),
    });

    const root = HtmlParser.parse(response.data);
    if (!(root instanceof HTMLElement)) {
      return [];
    }
    const topics = root.querySelectorAll('.tabTopicItem .tdTopicItem');

    return topics.map(topic => topic.rawText);
  }
}
