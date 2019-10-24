const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1;

export class GoogleTranslator {
  constructor(
    private translationClient: typeof TranslationServiceClient,
    private projectId: string
  ) {}

  async translate(text: string): Promise<string> {
    const [response] = await this.translationClient.translateText({
      parent: this.translationClient.locationPath(this.projectId, 'global'),
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: 'en-US',
      targetLanguageCode: 'ru-RU'
    });
    return response.translations[0].translatedText ?? '';
  }
}
