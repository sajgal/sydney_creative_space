import { FieldDescription } from './ui/field'

export function SupportsMarkdown() {
  return (
    <FieldDescription>
      This field supports formatting via{' '}
      <a href="https://markdown.org/cheat-sheet/" target="_blank">
        Markdown
      </a>
    </FieldDescription>
  )
}
