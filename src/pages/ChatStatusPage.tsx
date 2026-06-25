import { FileText, Image, Link2, Paperclip, SendHorizontal, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/shared/lib/utils'

const tabs = [
  { id: 'text', label: 'Текст', placeholder: 'Напишите сообщение...' },
  { id: 'image', label: 'Изображения', placeholder: 'Опишите изображение...' },
  { id: 'video', label: 'Видео', placeholder: 'Опишите ролик...' },
  { id: 'audio', label: 'Аудио', placeholder: 'Опишите аудио...' },
] as const

const initialMessages = [
  {
    id: 'user-1',
    role: 'user',
    text: 'Придумай 5 идей для постов в Instagram о кофейне',
  },
  {
    id: 'assistant-1',
    role: 'assistant',
    text: 'Конечно! Вот 5 идей для постов:\n\n1. «Утро начинается с нас» — фото латте-арта\n2. Закулисье: как обжариваем зёрна\n3. Рецепт недели от бариста\n4. История одного сорта кофе\n5. Отзывы гостей в сторис',
  },
]

const attachmentOptions = [
  { label: 'Загрузить файл', icon: Upload },
  { label: 'Добавить изображение', icon: Image },
  { label: 'Вставить ссылку', icon: Link2 },
  { label: 'Документ', icon: FileText },
]

export default function ChatStatusPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('text')
  const [input, setInput] = useState('')
  const [attachmentOpen, setAttachmentOpen] = useState(false)
  const [webEnabled, setWebEnabled] = useState(true)
  const [thinkingEnabled, setThinkingEnabled] = useState(true)
  const [messages, setMessages] = useState(initialMessages)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const activeConfig = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`
  }, [input])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return

    const id = Date.now()
    setMessages((current) => [
      ...current,
      { id: `user-${id}`, role: 'user', text },
      {
        id: `assistant-${id}`,
        role: 'assistant',
        text:
          activeTab === 'text'
            ? 'Принял. Соберу короткий, структурный ответ и параллельно оставлю генерации в статус-баре.'
            : 'Задача принята. Она появится в очереди генераций и будет отслеживаться глобальным статус-баром.',
      },
    ])
    setInput('')
    setAttachmentOpen(false)
  }

  return (
    <section className="relative min-h-[calc(100vh-var(--header-height))] overflow-hidden bg-[var(--c-bg)] text-[var(--c-fg)]">
      <div className="mx-auto flex min-h-[calc(100vh-var(--header-height))] max-w-[1160px] flex-col px-4 pb-[300px] pt-6 md:px-8 md:pb-[230px] lg:pb-[244px]">
        <div className="flex justify-center">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--c-line)] bg-[var(--c-bg-1)] px-4 text-sm font-semibold shadow-[var(--shadow-1)]"
          >
            <span className="h-5 w-5 rounded-full bg-emerald-600" />
            <span>ChatGPT</span>
            <span className="text-[var(--c-fg-low)]">·</span>
            <span className="font-mono text-[var(--c-accent-2)]">GPT-5.2</span>
            <span className="hidden font-mono text-[var(--c-accent-2)] sm:inline">6 cr</span>
            <span className="text-[var(--c-fg-mute)]">⌄</span>
          </button>
        </div>

        <div className="mt-8 space-y-5 md:mt-11 md:space-y-6">
          {messages.map((message) =>
            message.role === 'user' ? (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[540px] rounded-[16px] bg-[var(--c-accent-soft)] px-5 py-4 text-base leading-6 text-[var(--c-fg)] shadow-[0_10px_40px_rgba(0,0,0,0.18)] md:px-6">
                  {message.text}
                </div>
              </div>
            ) : (
              <div
                key={message.id}
                className="max-w-[690px] whitespace-pre-line rounded-[16px] border border-[var(--c-line)] bg-[var(--c-bg-1)] px-5 py-4 text-base leading-7 text-[var(--c-fg-dim)] md:px-6 md:py-5"
              >
                {message.text}
              </div>
            ),
          )}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage()
        }}
        className="fixed bottom-4 left-4 right-4 z-30 mx-auto max-w-[920px] md:bottom-6"
      >
        <div className="relative z-10 flex items-end overflow-x-auto no-scrollbar">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'h-13 min-w-[92px] rounded-t-[12px] border border-[var(--c-line)] bg-[var(--c-bg-1)] px-5 text-base font-semibold transition',
                activeTab === tab.id
                  ? 'relative z-10 border-[var(--c-accent)]/80 text-[var(--c-accent-2)]'
                  : 'text-[var(--c-fg-mute)] hover:text-[var(--c-fg-dim)]',
                index > 0 && '-ml-px',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="-mt-px rounded-b-[18px] rounded-tr-[18px] border border-[var(--c-line)] bg-[var(--c-bg-1)] shadow-[0_18px_80px_rgba(0,0,0,0.42)]">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={activeConfig.placeholder}
            rows={2}
            className="block max-h-[220px] min-h-[86px] w-full resize-none overflow-hidden bg-transparent px-5 py-4 text-lg leading-7 text-[var(--c-fg)] outline-none placeholder:text-[var(--c-fg-low)] md:min-h-[96px]"
          />
          <div className="mx-5 mb-4 flex min-h-12 items-center gap-3 border border-[var(--c-line)] bg-[var(--c-bg)] px-3">
            <div
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setAttachmentOpen(false)
                }
              }}
            >
              <button
                type="button"
                aria-label="Прикрепить файл"
                onClick={() => setAttachmentOpen((open) => !open)}
                className={cn(
                  'grid h-9 w-9 place-items-center rounded-full text-[var(--c-fg-mute)] transition hover:bg-[color-mix(in_oklab,var(--c-fg)_4%,transparent)] hover:text-[var(--c-accent-2)]',
                  attachmentOpen && 'bg-[color-mix(in_oklab,var(--c-fg)_4%,transparent)] text-[var(--c-accent-2)]',
                )}
              >
                <Paperclip size={18} />
              </button>

              {attachmentOpen && (
                <div className="absolute bottom-full left-0 z-[80] mb-2 w-56 overflow-hidden rounded-[12px] border border-[var(--c-line)] bg-[var(--c-bg-1)] p-1 shadow-[var(--shadow-dropdown)]">
                  {attachmentOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setInput((current) => (current ? `${current}\n[${option.label}] ` : `[${option.label}] `))
                          setAttachmentOpen(false)
                        }}
                        className="flex h-10 w-full items-center gap-3 rounded-[8px] px-3 text-left text-sm font-medium text-[var(--c-fg-dim)] transition hover:bg-[var(--c-accent)]/10 hover:text-[var(--c-fg)]"
                      >
                        <Icon size={16} className="text-[var(--c-accent-2)]" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <span className="rounded-full border border-[var(--c-line)] bg-[var(--c-bg-1)] px-3 py-2 font-mono text-sm text-[var(--c-fg-dim)]">
              GPT-5.2 · 6 cr
            </span>
            <button
              type="button"
              onClick={() => setWebEnabled((value) => !value)}
              className={cn(
                'hidden rounded-full border px-4 py-2 text-sm transition sm:inline-flex',
                webEnabled ? 'border-[var(--c-line)] text-[var(--c-fg-dim)]' : 'border-[var(--c-line)] text-[var(--c-fg-low)] opacity-70',
              )}
            >
              Веб
            </button>
            <button
              type="button"
              onClick={() => setThinkingEnabled((value) => !value)}
              className={cn(
                'ml-auto hidden rounded-full border px-4 py-2 text-sm font-semibold transition sm:inline-flex',
                thinkingEnabled ? 'border-[var(--c-accent)]/80 text-[var(--c-accent-2)]' : 'border-[var(--c-line)] text-[var(--c-fg-low)]',
              )}
            >
              Думать
            </button>
            <button
              type="submit"
              aria-label="Отправить"
              className="grid h-11 w-11 place-items-center rounded-[12px] bg-[var(--c-accent-2)] text-[var(--primary-foreground)] shadow-[var(--shadow-glow)] transition hover:bg-[var(--c-accent-2)] disabled:opacity-50"
              disabled={!input.trim()}
            >
              <SendHorizontal size={20} />
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
