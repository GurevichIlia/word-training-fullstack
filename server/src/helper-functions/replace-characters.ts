export function replaceCharacters(str: string): string {
      const regExp = /\]|\[/g
      const newString = str?.replace(regExp, '')

      return newString || str
}