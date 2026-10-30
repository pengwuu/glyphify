// Terminal cell width of a glyph, estimated without a font: emoji and CJK take
// two cells, joiners and variation selectors none, everything else one.
// Terminals disagree on edge cases, so this is a best guess used only to align
// the gutter of a reply's later blocks under the first block's marker.

const ZERO_WIDTH = /^[‍︎️\u{1f3fb}-\u{1f3ff}̀-ͯ]$/u
const WIDE = /^[\p{Emoji_Presentation}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}！-｠]$/u
const VARIATION_SELECTOR_EMOJI = '️'
const ZERO_WIDTH_JOINER = '‍'

export const glyphWidth = (glyph: string): number => {
  const chars = Array.from(glyph)
  let width = 0
  let joined = false

  chars.forEach((char, i) => {
    if (char === ZERO_WIDTH_JOINER) {
      joined = true
      return
    }
    if (ZERO_WIDTH.test(char)) return
    if (joined) {
      joined = false
      return
    }
    const forcedEmoji = chars[i + 1] === VARIATION_SELECTOR_EMOJI
    width += WIDE.test(char) || forcedEmoji ? 2 : 1
  })

  return width
}
