class YandexTranslator {
  constructor(key) {
    this.api = require('yandex-translate')(key);
  }

  translate(text) {
    return new Promise((resolve, reject) => {
      this.api.translate(text, {to: 'ru', from: 'en'}, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.text[0]);
        }
      });
    });

  }
}

module.exports = YandexTranslator;
