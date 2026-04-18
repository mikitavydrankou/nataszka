// Birthday Card Script - Mobile Optimized for Android

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isAndroid = /Android/i.test(navigator.userAgent);
const timerStartDate = new Date(2005, 3, 19, 0, 0, 0, 0);
const phraseVisibleMs = 2700;
const phraseFadeMs = 1000;
const timerVisibleMs = phraseVisibleMs + 2000;
let sequenceStarted = false;
let timerIntervalId = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Birthday card loaded! Mobile:', isMobile, 'Android:', isAndroid);
    
    // Fix viewport height for mobile browsers
    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
    
    // Add flower button click handler
    const flowerBtn = document.getElementById('flowerBtn');
    const phraseLayer = document.getElementById('phraseLayer');
    const bulbBtn = document.getElementById('bulbBtn');
    const themeColorMeta = document.getElementById('themeColorMeta');

    if (bulbBtn) {
        bulbBtn.addEventListener('click', function() {
            document.body.classList.add('is-cream');
            if (themeColorMeta) {
                themeColorMeta.setAttribute('content', '#f6eedf');
            }

            bulbBtn.classList.add('is-fading');
            wait(500).then(function() {
                bulbBtn.style.display = 'none';
            });
        });
    }

    if (flowerBtn) {
        flowerBtn.addEventListener('click', async function() {
            if (sequenceStarted) {
                return;
            }

            sequenceStarted = true;
            console.log('Flower clicked! Starting phrase sequence.');

            flowerBtn.classList.add('is-fading');
            await wait(1000);
            flowerBtn.style.display = 'none';

            if (phraseLayer) {
                const phrases = [
                    'Dziś jest tak piękny jak inne dni...',
                    'ale zdajesz sobie sprawę, że minął kolejny rok w mgnieniu oka',
                    'Jednak…',

                ];

                const afterTimerPhrases = [
                    'Jest troche ciemno...',
                ];

                await playPhraseSequence(phraseLayer, phrases);
                await showElapsedTimer(phraseLayer, timerStartDate, timerVisibleMs);
                await playPhraseSequence(phraseLayer, afterTimerPhrases);
                showBulbPrompt(phraseLayer, bulbBtn);
            }
        });
    }
    
    // Prevent pinch zoom and other gestures
    if (isMobile) {
        document.addEventListener('touchmove', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevent long press context menu on mobile
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        }, false);
    }
});

function updateViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
}

async function playPhraseSequence(layer, phrases) {
    for (let i = 0; i < phrases.length; i += 1) {
        layer.textContent = phrases[i];
        layer.classList.remove('is-fading');
        layer.classList.add('is-visible');

        await wait(phraseVisibleMs);

        layer.classList.remove('is-visible');
        layer.classList.add('is-fading');

        await wait(phraseFadeMs);
    }
}

async function showElapsedTimer(layer, startDate, visibleMs) {
    if (timerIntervalId) {
        clearInterval(timerIntervalId);
    }

    layer.classList.remove('is-fading');
    layer.classList.add('is-visible');

    updateElapsedTimer(layer, startDate);
    timerIntervalId = setInterval(function() {
        updateElapsedTimer(layer, startDate);
    }, 500);

    await wait(visibleMs);

    if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
    }

    layer.classList.remove('is-visible');
    layer.classList.add('is-fading');

    await wait(phraseFadeMs);
}

function showBulbPrompt(layer, bulbBtn) {
    layer.textContent = '';
    layer.classList.remove('is-visible', 'is-fading');

    if (!bulbBtn) {
        return;
    }

    bulbBtn.classList.add('is-visible');
}

function updateElapsedTimer(layer, startDate) {
    const now = new Date();
    let totalSeconds = Math.floor((now.getTime() - startDate.getTime()) / 1000);

    if (totalSeconds < 0) {
        totalSeconds = 0;
    }

    const days = Math.floor(totalSeconds / (3600 * 24));
    totalSeconds = totalSeconds % (3600 * 24);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    layer.innerHTML =
        '<div class="timer-title">czy wiesz  że przezyłaś</div>' +
        '<div class="timer-line">' +
        '<span class="digit">' + days + '</span> dni ' +
        '<span class="digit">' + pad2(hours) + '</span> godzin ' +
        '<span class="digit">' + pad2(minutes) + '</span> minut ' +
        '<span class="digit">' + pad2(seconds) + '</span> sekund' +
        '</div>';
}

function pad2(value) {
    return value < 10 ? '0' + value : String(value);
}

function wait(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

function getRandomColor() {
    const colors = ['#FF6B6B', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];
    return colors[Math.floor(Math.random() * colors.length)];
}
