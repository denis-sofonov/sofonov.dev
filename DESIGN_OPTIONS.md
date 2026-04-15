# Portfolio Design — Awwwards-level + Сдержанность

> Принцип: "Boring minimal" — ничего не происходит. "Artful minimal" — ОДНА вещь происходит с идеальным таймингом, easing и типографикой. Весь craft-бюджет — на один ход.

---

## 1. Kinetic Typography

Одна шрифтовая пара, крупный масштаб (hero 120-200px). Тип — это и есть визуал, картинки не нужны. Анимация через одно свойство: интерполяция weight-оси variable font, letter-spacing при скролле, или clip-path reveal. Hover меняет weight/tracking на 2-3 юнита — шрифт чувствуется живым.

**Главный ход:** типографика которая дышит и реагирует.
**Техника:** variable font + `font-variation-settings`, scroll-linked letter-spacing, `clip-path` transitions.
**Референсы:** rauno.me, paco.me

---

## 2. Cursor-Driven Distortion

Дефолт — идеально чистая сетка. При движении курсора — один shader-эффект: mesh distortion, магнитное отталкивание текста, или RGB split в радиусе 20px. Эффект НЕВИДИМ пока не начинаешь взаимодействовать. Вознаграждает любопытство.

**Главный ход:** скрытая интерактивность, сюрприз при движении мыши.
**Техника:** GLSL fragment shader на canvas overlay, `mousemove` + uniform update, один элемент.
**Референсы:** aristidebenoist.com, lusion.co

---

## 3. Scroll-Velocity Typography

Текст реагирует на СКОРОСТЬ скролла, не на позицию. Быстрый скролл — буквы растягиваются (scaleY 1.02-1.15) или получают motion blur (text-shadow trick). Медленный скролл — идеальная вёрстка. Сайт чувствуется физическим.

**Главный ход:** типографика с физикой.
**Техника:** `deltaY` между фреймами, `transform` с lerp (factor 0.08), text-shadow для blur.
**Референсы:** shud.in, paco.me

---

## 4. Color Shift Sections

Фон ВСЕЙ страницы переключается между 2-3 цветами при переходе между секциями. Не градиент — hard cut с 600ms ease-out-cubic. Одна типографика перекрашивается в разные настроения. `mix-blend-mode: difference` на тексте для автоматического контраста.

**Главный ход:** цвет как нарратив, каждая секция = новое настроение.
**Техника:** IntersectionObserver + CSS transition на `background-color`, `mix-blend-mode: difference`.
**Референсы:** lusion.co, basement.studio

---

## 5. Swiss Grid + One Breaking Element

Строгая сетка, щедрый whitespace (32px+ gutters, 120px+ section padding). Всё выровнено. Потом ОДИН элемент ломает сетку — thumbnail вылезает на 15% за колонку, или строка текста повёрнута на -3deg. Контраст между порядком и нарушением создаёт напряжение.

**Главный ход:** контролируемый хаос внутри строгой системы.
**Техника:** CSS Grid 12 columns, один элемент с `grid-column: span` + negative margin или rotate.
**Референсы:** vanschneider.com, ia.net

---

## 6. Page Transition as Signature

Навигация между страницами — это шоу. Thumbnail проекта масштабируется из позиции в grid до full-bleed hero. Или axis-wipe: контент уходит по Y, новый входит по X. 500-800ms, `cubic-bezier(0.76, 0, 0.24, 1)`.

**Главный ход:** переход между страницами запоминается.
**Техника:** View Transitions API / Barba.js, shared-element transitions, FLIP animation.
**Референсы:** barba.js showcase sites, Awwwards transitions collection

---

## Рекомендация

Для максимального эффекта — **комбинация 1 + 3 + 5**: Kinetic Typography (hero с живым шрифтом) + Scroll-Velocity (физика при скролле) + Swiss Grid с одним ломающим элементом. Три техники из одного семейства (типографика + layout), не конфликтуют, усиливают друг друга.

Или **2 + 4**: Cursor Distortion + Color Shift — интерактивность + нарратив через цвет. Более визуально яркий путь.
