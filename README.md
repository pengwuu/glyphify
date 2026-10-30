# glyphify

A Claude Code plugin that changes the glyph and color of two transcript markers: the bullet that opens each Claude reply, and the chevron before each prompt you typed.

It uses only named ANSI colors, so the result looks right in terminals without truecolor, such as macOS Terminal.app.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install glyphify --marketplace pengwuu/glyphify
```

From a shell:

```
claude plugin install glyphify --marketplace pengwuu/glyphify
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `pengwuu/glyphify`, then Add plugin.

To try it without installing, from a clone of this repository:

```
claude --plugin-dir /path/to/glyphify
```

## Configure

Run `/config` and find the glyphify rows. The colors are pickers and the glyphs are free text; a glyph is shown only if your terminal's font can draw it, emoji work too (the gutter of a reply's later blocks is padded to the glyph's estimated width), and a blank or longer value falls back to the default:

| Option | Default | Choices |
| --- | --- | --- |
| Reply glyph | `●` | any text you type, up to 8 characters (e.g. `◆ ★ » λ →` or an emoji) |
| Reply color | `green` | ANSI names such as `green`, `cyan`, `magenta`, and their `...Bright` variants |
| Prompt glyph | `❯` | any text you type, up to 8 characters |
| Prompt color | `yellow` | the same ANSI names |

Colors apply to text symbols such as `●` or `❯`. An emoji glyph draws in its own colors, so the color setting may have no effect on it; terminals differ here.

A change reloads the plugin with the new values.

## Limitations

- The input box, the line you are typing in at the bottom, is drawn by Claude Code itself and keeps its own `❯`. Only prompts already sent, shown in the transcript, use your glyph.
- While a reply is still streaming in, its bullet may be the original `●`. It switches to your glyph once the reply has been written to the transcript.
- Tool-call rows such as `Bash(ls)` and the spinner line are not changed.

## Develop

`hooks/register.tsx` holds two `ui.render` hooks, one for `AssistantMessage` and one for `UserMessage`. Validate with `claude plugin validate .`.

## License

MIT
