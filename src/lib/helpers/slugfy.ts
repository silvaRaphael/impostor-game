export const slugify = (str: string, separator: string = "-") => {
  return String(str)
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toUpperCase() // convert to uppercase
    .replace(/[^A-Z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/[Ç]/g, "C") // replace Ç to C
    .replace(/\s+/g, separator) // replace spaces with separator
    .replace(/-+/g, separator) // remove consecutive separator
}
