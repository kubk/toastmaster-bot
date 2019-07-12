const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1;

class GoogleTranslator {
  constructor(projectId) {
    this.projectId = projectId;
    this.translationClient = new TranslationServiceClient();
  }

  async translate(text) {
    const [response] = await this.translationClient.translateText({
      parent: this.translationClient.locationPath(this.projectId, 'global'),
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: 'en-US',
      targetLanguageCode: 'ru-RU',
    });
    return response.translations.length ? response.translations[0].translatedText : '';
  }
}

module.exports = GoogleTranslator;
