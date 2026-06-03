<div align="center">

# 🎂 Interactive Birthday Card

### A tiny web page to wish someone you love a happy birthday

Click a flower, dim the lights, release the balloons, light the cake, open the letter.
A short animated sequence in plain HTML, CSS and JavaScript — no build step, no dependencies, no tracking.

![HTML5](https://img.shields.io/badge/HTML5-e34f26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572b6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-f7df1e?logo=javascript&logoColor=black)
![Build](https://img.shields.io/badge/build-none-brightgreen)

</div>

---

## Run

No server, no install. Just open the page.

```bash
start index.html   # Windows
open index.html    # macOS
```

Best viewed on a phone — the layout and gestures are tuned for mobile.

## What happens

- 🌸 **Flower** — starts the greeting, a few lines fade in one after another.
- ⏳ **Age counter** — shows how long the birthday person has been alive, down to the second.
- 💡 **Light bulb** — dims and lights the screen for the reveal.
- 🎈 **Balloons** — a burst of floating balloons.
- 🎂 **Cake** — an animated cake with candles.
- 💌 **Letter** — a closing personal message.
- ✨ Fireworks and confetti throughout.

## Make it yours

Everything personal lives in two files — no framework knowledge needed.

| Change            | Location                                       |
| ----------------- | ---------------------------------------------- |
| Name              | `index.html` — page title and letter           |
| Greeting lines    | `js/index.js` — `phrases` array                |
| Birthdate         | `js/index.js` — `timerStartDate` (age counter) |
| Closing letter    | `index.html` — `.details` block                |
| Colors            | `css/style.css`                                |
| Balloon images    | `assets/balloons/`                             |

> [!TIP]
> Default text is Polish — swap the `phrases` array and the letter for any language you like.

## Structure

```
.
├── index.html        # page + the letter
├── css/style.css     # styles, gradients, animations
├── js/index.js       # the interactive sequence
└── assets/           # balloon & decoration images
```

---

<div align="center">

<sub>fork it, change the name, make someone smile.</sub>

<sub>birthday card · happy birthday · interactive greeting card · animated web card · HTML CSS JavaScript</sub>

</div>
