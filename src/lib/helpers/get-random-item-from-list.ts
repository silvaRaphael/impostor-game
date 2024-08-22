export function getRandomItemFromList(list: string[], exclude: string[]) {
  const availableItems = list.filter((item) => !exclude.includes(item))

  if (availableItems.length === 0) {
    throw new Error("Não há mais palavras disponíveis.")
  }

  const randomIndex = Math.floor(Math.random() * availableItems.length)
  const choosenItem = availableItems[randomIndex]

  return choosenItem
}
