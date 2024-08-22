import {
  supportedLanguages,
  TranslateLanguageData
} from "open-google-translator"

supportedLanguages()

export async function translator(text: string) {
  const translation = await TranslateLanguageData({
    listOfWordsToTranslate: [text],
    fromLanguage: "en",
    toLanguage: "pt"
  })

  if (!translation?.length) return text

  return translation.at(0)?.translation ?? translation.at(0)?.original ?? null
}
