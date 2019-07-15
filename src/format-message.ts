export const formatMessage = (originalWords: string[], translations: string[]): string => {
  if (originalWords.length !== translations.length || !originalWords.length) {
    throw new Error('Invalid translation list');
  }
  const maxOriginalWord = originalWords.reduce((maxWord, currentWord) => {
    return currentWord.length > maxWord.length ? currentWord : maxWord;
  }, originalWords[0]);

  return originalWords.reduce((message, currentWord, i) => {
    const divider = ' '.repeat(maxOriginalWord.length - currentWord.length);
    return `${message}\n\`${currentWord}${divider} | ${translations[i]}\``;
  }, '');
};
