# Reacto — корпоративный сайт

Production-версия дизайн-прототипа reacto.tech: **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Framer Motion**.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
```

## Страницы

| Маршрут | Что это |
| --- | --- |
| `/` | Главная: прелоадер, hero, о нас, проекты, услуги, MVP, отрасли, отзывы, подвал + панель «Заявка» |
| `/blog` | Блог: фильтр по категориям, список статей, подвал с формой |
| `/brief` | Онлайн-бриф в 5 шагов |
| `POST /api/contact`, `/api/brief`, `/api/subscribe` | Заглушки отправки (валидация на сервере, лог в консоль) |

## Структура

```
src/
  app/                 страницы, layout (next/font Manrope), globals.css (токены), API routes
  content/ru.ts        ВСЕ тексты сайта; index.ts — getDictionary(), I18nProvider — useDictionary()
  components/
    layout/            Header, MegaMenu, LangSwitch, Footer, ContactDrawer, Preloader, PageHeader
    sections/          Hero, About, Projects, ProjectCard, Services, ServiceCard, MvpBanner, Industries, Reviews
    forms/             ContactForm, PhoneField, FileDrop, Brief
    ui/                SectionLabel, Star, LeadHeading, MaskText, Reveal, Icons
    blog/              BlogList
  lib/                 validation.ts (zod, общие для клиента и API), phone.ts (страны/маски),
                       images.ts (реестр next/image), useHeroScroll.ts, useViewportProgress.ts, ease.ts
  assets/images/       растровые изображения (статический импорт → next/image)
public/icons, public/media   SVG и видео EcoFlight
```

## Дизайн-токены

Определены в `src/app/globals.css` (`@theme`): цвета (`ink #12151c`, `night #0a0e15`, `muted #6a7180`…),
кривые `--ease-out-expo` (.22,1,.36,1) и `--ease-zoom` (.16,1,.3,1), брейкпоинты `tb` 900 / `nav` 1100.
Скругления сброшены в 0 глобально; круглые только аватары, соцсети, кнопки-кружки и теги-пилюли (как в прототипе).
Линии — `0.5px`.

## Анимации

- Прелоадер: звезда вращается и пульсирует, уходит после `load` (+500 мс, но не позже 1.5 с).
- Hero: `lampOn` 3.2 с, параллакс фона от мыши (scale 1.14, lerp 0.055); при скролле обёртка ×0.45, текст ×−0.5 с затуханием.
- Мега-меню «Услуги»: хедер инвертируется в белый, hero затемняется `rgba(0,0,0,.55)` + blur 6px, панель раскрывается через clip-path, пункты появляются со ступенчатыми задержками из прототипа. Работает с клавиатуры, Esc закрывает.
- Подчёркивание пунктов меню scaleX за 280 мс; CTA с заливкой снизу.
- «О нас»: блок всплывает по прогрессу скролла, текст выезжает из маски по словам.
- Reveal карточек: translateY 56px → 0 при пересечении 88% экрана.
- Кейсы: zoom 1.045 / 1.1 с + стрелка ↗; EcoFlight — `autoplay muted loop playsinline`, играет только в зоне видимости, постер — кадр из видео.
- Услуги: подъём −6px, прорисовка пиктограмм `stroke-dashoffset`, обводка 1.5px из hero-изображения (mask-composite).
  `<Services palette="cool" />` включает вариант фона из прототипа `#F1F2F5` без обводки.
- MVP: бегущий прогресс по шагам; подвал: каскадное появление и «вырастающий» логотип.
- Учитывается `prefers-reduced-motion`.

## Адаптив

≤1100 px — из меню скрыты «О нас» / «Контакты»; ≤900 px — сетки в 1 колонку, sticky-колонки становятся обычными;
≤767 px — бургер-меню (в прототипе на мобайле хедер не помещался), поля 20 px; ≤700 px — мега-меню в 1 колонку.

## Формы

`lib/validation.ts` — zod-схемы `contactSchema` и `briefSchema`, используются и в UI, и в API.
Телефон проверяется по маске страны и дополнительно передаётся в E.164 (`phone.e164`). Файлы: до 5 шт. по 10 МБ.
Почта/CRM подключаются в функции `deliver()` в `src/lib/server/submission.ts`.

## i18n

Все тексты — в `src/content/ru.ts` (тип `Dictionary`). Для EN: создать `en.ts` той же формы, добавить его в `locales`
и `dictionaries` в `src/content/index.ts`, затем вынести маршруты под `app/[locale]`. Переключатель языка пока только UI.

## Заглушки и отличия от прототипа

- Отправка форм, файлов и подписки — заглушки (лог на сервере).
- Ссылки на страницы кейсов, статьи, политику, Zoom, мессенджеры — `#` до появления CMS/реальных адресов.
- Флаги стран грузятся с flagcdn.com, как в прототипе.
- Шрифт Unbounded из README прототипа на страницах фактически не используется — не подключён.
- Секция «Отрасли» — вариант «Список» (вариант «Эксплорер» в прототипе без изображений).
- Исправлена опечатка «ввложили» в заголовке проектов.
