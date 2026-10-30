import type { PluginOptions, Register } from 'claude-code'
import { glyphWidth } from './glyph-width'

// Glyph and color of the two markers, from the plugin's `userConfig` (/config).
// Named ANSI colors follow the terminal's palette and render the same in
// terminals without truecolor (macOS Terminal.app); a hex value would look
// right only where 24-bit color is supported (iTerm2, Ghostty, kitty).
const DEFAULTS = {
  replyGlyph: '●',
  replyColor: 'green',
  userGlyph: '❯',
  userColor: 'yellow',
}

// Glyphs are free text; a blank or oversized value falls back to the default.
const MAX_GLYPH_CHARS = 8

const pick = (options: PluginOptions, key: keyof typeof DEFAULTS): string => {
  const value = options[key]
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : DEFAULTS[key]
}

const pickGlyph = (options: PluginOptions, key: 'replyGlyph' | 'userGlyph'): string => {
  const glyph = pick(options, key)
  return Array.from(glyph).length <= MAX_GLYPH_CHARS ? glyph : DEFAULTS[key]
}

export const resolveConfig = (options: PluginOptions) => ({
  reply: { glyph: pickGlyph(options, 'replyGlyph'), color: pick(options, 'replyColor') },
  user: { glyph: pickGlyph(options, 'userGlyph'), color: pick(options, 'userColor') },
})

export const register: Register = (on, options) => {
  const config = resolveConfig(options)
  // Blank gutter as wide as the marker and its trailing space.
  const indent = ' '.repeat(glyphWidth(config.reply.glyph) + 1)

  // The bullet opening a reply. Later blocks of the same reply get a blank gutter.
  on('ui.render', { component: 'AssistantMessage' }, ($, e, next) => {
    try {
      const { text, isFirstOfReply } = e.props
      if (typeof text !== 'string') return next(e)

      const { Box, Text, Markdown } = $.ui.resolve(e)
      const { glyph, color } = config.reply

      return (
        <Box flexDirection="row">
          <Box flexShrink={0}>
            {isFirstOfReply ? <Text color={color}>{`${glyph} `}</Text> : <Text>{indent}</Text>}
          </Box>
          <Box flexDirection="column" flexGrow={1} flexShrink={1}>
            <Markdown text={text} />
          </Box>
        </Box>
      )
    } catch {
      return next(e)
    }
  })

  // The chevron before a prompt the person typed, in the transcript.
  on('ui.render', { component: 'UserMessage' }, ($, e, next) => {
    try {
      const { text, origin } = e.props
      if (origin.kind !== 'composer' || typeof text !== 'string') return next(e)

      const { Box, Text } = $.ui.resolve(e)
      const { glyph, color } = config.user

      return (
        <Box flexDirection="row">
          <Box flexShrink={0}>
            <Text color={color}>{`${glyph} `}</Text>
          </Box>
          <Box flexDirection="column" flexGrow={1} flexShrink={1}>
            <Text>{text}</Text>
          </Box>
        </Box>
      )
    } catch {
      return next(e)
    }
  })
}
