// Birthday Card Script - Mobile Optimized for Android

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isAndroid = /Android/i.test(navigator.userAgent);
const timerStartDate = new Date(2005, 3, 19, 0, 0, 0, 0);
const phraseVisibleMs = 2700;
const phraseFadeMs = 1000;
const timerVisibleMs = phraseVisibleMs + 2000;
let sequenceStarted = false;
let timerIntervalId = null;
let balloonAnimationFrameId = null;
let particleIntervalId = null;
let cakeSequenceStarted = false;
let phraseLayerEl = null;
let cakeButtonEl = null;
let cakeStageEl = null;
let cakeTemplateEl = null;

// Fireworks variables
let fireworksCanvas = null;
let fireworksCtx = null;
let fireworksActive = false;
let fireworkParticles = [];
let fireworkAnimationFrameId = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Birthday card loaded! Mobile:', isMobile, 'Android:', isAndroid);
    
    // Initialize fireworks
    initFireworks();
    
    // Fix viewport height for mobile browsers
    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
    
    // Add flower button click handler
    const flowerBtn = document.getElementById('flowerBtn');
    const phraseLayer = document.getElementById('phraseLayer');
    const bulbBtn = document.getElementById('bulbBtn');
    const balloonBtn = document.getElementById('balloonBtn');
    const cakeBtn = document.getElementById('cakeBtn');
    const balloonStage = document.getElementById('balloonStage');
    const cakeStage = document.getElementById('cakeStage');
    const cakeTemplate = document.getElementById('cakeTemplate');
    const themeColorMeta = document.getElementById('themeColorMeta');

    phraseLayerEl = phraseLayer;
    cakeButtonEl = cakeBtn;
    cakeStageEl = cakeStage;
    cakeTemplateEl = cakeTemplate;

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

            if (phraseLayer && balloonBtn) {
                wait(650).then(async function() {
                    phraseLayer.textContent = 'troche lepiej';
                    phraseLayer.classList.remove('is-fading');
                    phraseLayer.classList.add('is-visible');

                    await wait(2200);

                    phraseLayer.classList.remove('is-visible');
                    phraseLayer.classList.add('is-fading');
                    await wait(phraseFadeMs);

                    balloonBtn.classList.add('is-visible');
                });
            }
        });
    }

    if (balloonBtn) {
        balloonBtn.addEventListener('click', function() {
            if (balloonStage) {
                balloonStage.classList.add('is-visible');
            }

            balloonBtn.classList.add('is-fading');
            wait(500).then(function() {
                balloonBtn.style.display = 'none';
            });

            startBalloonFlight(balloonStage);
        });
    }

    if (cakeBtn) {
        cakeBtn.addEventListener('click', function() {
            startCakeSequence();
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

function startBalloonFlight(stage) {
    if (!stage) {
        return;
    }

    if (balloonAnimationFrameId) {
        cancelAnimationFrame(balloonAnimationFrameId);
        balloonAnimationFrameId = null;
    }

    stage.innerHTML = '';
    createParticles();

    const balloonImages = [
        'assets/balloons/b1.png',
        'assets/balloons/b2.png',
        'assets/balloons/b3.png',
        'assets/balloons/b4.png',
        'assets/balloons/b5.png',
        'assets/balloons/b6.png',
        'assets/balloons/b7.png'
    ];

    const balloons = [];
    const count = 108;

    for (let i = 0; i < count; i += 1) {
        const image = document.createElement('img');
        image.className = 'moving-balloon';
        image.src = balloonImages[i % balloonImages.length];
        image.alt = 'balon';
        stage.appendChild(image);

        const balloonSize = 38 + Math.floor(Math.random() * 72);
        const driftDir = Math.random() > 0.5 ? 1 : -1;

        balloons.push({
            el: image,
            x: Math.random() * Math.max(window.innerWidth - balloonSize, 1),
            y: window.innerHeight + 30 + Math.random() * 180,
            vx: driftDir * (0.22 + Math.random() * 0.55),
            vy: -(2.4 + Math.random() * 2.8),
            targetVy: -(2.8 + Math.random() * 3.2),
            rotation: Math.random() * 360,
            rotationSpeed: (0.22 + Math.random() * 0.5) * driftDir,
            swayPhase: Math.random() * Math.PI * 2,
            swaySpeed: 0.014 + Math.random() * 0.02,
            swayRange: 3 + Math.random() * 12,
            size: balloonSize,
            opacity: 0,
            spawnDelay: Math.random() * 1200 + i * 35,
            active: false,
            done: false
        });
    }

    let startTime = null;
    let completed = false;

    function animate(timestamp) {
        if (completed) {
            return;
        }

        if (startTime === null) {
            startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const maxX = window.innerWidth;
        let activeOrPending = false;

        for (let i = 0; i < balloons.length; i += 1) {
            const balloon = balloons[i];

            if (balloon.done) {
                continue;
            }

            const timeSinceSpawn = elapsed - balloon.spawnDelay;

            if (timeSinceSpawn < 0) {
                activeOrPending = true;
                balloon.el.style.opacity = '0';
                balloon.el.style.width = balloon.size + 'px';
                balloon.el.style.height = balloon.size + 'px';
                balloon.el.style.transform = 'translate(' + balloon.x + 'px, ' + balloon.y + 'px) scale(0.8)';
                continue;
            }

            balloon.active = true;
            activeOrPending = true;

            const emerge = Math.min(timeSinceSpawn / 700, 1);
            const limitX = maxX - balloon.size;

            balloon.vy += (balloon.targetVy - balloon.vy) * 0.01;
            balloon.x += balloon.vx + Math.sin(timeSinceSpawn * balloon.swaySpeed + balloon.swayPhase) * balloon.swayRange * 0.03;
            balloon.y += balloon.vy;
            balloon.rotation += balloon.rotationSpeed;

            if (balloon.x <= 0) {
                balloon.x = 0;
                balloon.vx *= -0.95;
            } else if (balloon.x >= limitX) {
                balloon.x = limitX;
                balloon.vx *= -0.95;
            }

            if (balloon.y + balloon.size < -120) {
                balloon.done = true;
                balloon.el.style.opacity = '0';
                continue;
            }

            if (balloon.y < window.innerHeight * 0.2) {
                const fadeOut = Math.max(0, (balloon.y + balloon.size + 80) / (window.innerHeight * 0.25 + balloon.size + 80));
                balloon.opacity = emerge * fadeOut;
            } else {
                balloon.opacity = emerge;
            }

            balloon.el.style.width = balloon.size + 'px';
            balloon.el.style.height = balloon.size + 'px';
            balloon.el.style.opacity = String(balloon.opacity);
            balloon.el.style.transform = 'translate(' + balloon.x + 'px, ' + balloon.y + 'px) rotate(' + balloon.rotation + 'deg) scale(' + (0.7 + 0.3 * emerge) + ')';
        }

        if (activeOrPending) {
            balloonAnimationFrameId = requestAnimationFrame(animate);
        } else {
            completed = true;
            balloonAnimationFrameId = null;
            stage.classList.remove('is-visible');
            stage.innerHTML = '';
            showCakePrompt();
        }
    }

    balloonAnimationFrameId = requestAnimationFrame(animate);
}

function showCakePrompt() {
    if (phraseLayerEl) {
        phraseLayerEl.textContent = '';
        phraseLayerEl.classList.remove('is-visible', 'is-fading');
    }

    if (!cakeButtonEl) {
        showAfterBalloonsPhrase(phraseLayerEl);
        return;
    }

    cakeButtonEl.classList.add('is-visible');
}

function startCakeSequence() {
    if (cakeSequenceStarted) {
        return;
    }

    cakeSequenceStarted = true;

    if (cakeButtonEl) {
        cakeButtonEl.classList.add('is-fading');
        wait(450).then(function() {
            cakeButtonEl.style.display = 'none';
        });
    }

    renderCakeScene();

    if (cakeStageEl) {
        cakeStageEl.classList.add('is-visible');
        cakeStageEl.setAttribute('aria-hidden', 'false');
    }

    wait(11000).then(function() {
        if (cakeStageEl) {
            cakeStageEl.classList.remove('is-visible');
            cakeStageEl.setAttribute('aria-hidden', 'true');
        }

        showAfterBalloonsPhrase(phraseLayerEl);
    });
}

function renderCakeScene() {
    const cakeScene = document.getElementById('cakeScene');

    if (!cakeScene || !cakeTemplateEl) {
        return;
    }

    cakeScene.innerHTML = '';
    cakeScene.appendChild(cakeTemplateEl.content.cloneNode(true));
}

function showAfterBalloonsPhrase(layer) {
    if (!layer) {
        return;
    }

    layer.textContent = 'Troche swiątecznie co? ;))✨';
    layer.classList.remove('is-fading');
    layer.classList.add('is-visible');

    wait(2400)
        .then(function() {
            layer.classList.remove('is-visible');
            layer.classList.add('is-fading');
            return wait(700);
        })
        .then(function() {
            layer.textContent = 'Dzisiaj jest wyjątkowy dzień';
            layer.classList.remove('is-fading');
            layer.classList.add('is-visible');
            return wait(2400);
        })
        .then(function() {
            layer.classList.remove('is-visible');
            layer.classList.add('is-fading');
            return wait(700);
        })
        .then(function() {
            return playPhraseBatch(layer, [
                'Życzę Ci wszystkiego najlepszego',
                'Niech wszystkie Twoje życzenia się spełnią',
                'Pamiętaj o swoich marzeniach',
                'Ciesz się każdą chwilą, której dzisiaj doświadczasz',
                'Wypełnij ją swoim najpiękniejszym uśmiechem'
            ], 2200, 700);
        });
}

async function playPhraseBatch(layer, phrases, showMs, fadeMs) {
    for (let i = 0; i < phrases.length; i += 1) {
        layer.textContent = phrases[i];
        layer.classList.remove('is-fading');
        layer.classList.add('is-visible');

        await wait(showMs);

        layer.classList.remove('is-visible');
        layer.classList.add('is-fading');

        await wait(fadeMs);
    }

    layer.textContent = '';
    layer.classList.remove('is-visible', 'is-fading');

    showFinalBookStage();
}

function showFinalBookStage() {
    const bookStage = document.getElementById('bookStage');

    if (!bookStage) {
        return;
    }

    // Stop fireworks when book appears
    stopFireworks();
    
    bookStage.classList.add('is-visible');
    bookStage.setAttribute('aria-hidden', 'false');
}

function getRandomColor() {
    const colors = ['#FF6B6B', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getParticleColor() {
    const colors = [
        { color: 'rgba(255, 50, 100, 0.9)', glow: 'rgba(255, 50, 100, 0.5)' },   // Pink/Red
        { color: 'rgba(100, 200, 255, 0.9)', glow: 'rgba(100, 200, 255, 0.5)' }, // Light Blue
        { color: 'rgba(255, 200, 50, 0.9)', glow: 'rgba(255, 200, 50, 0.5)' },   // Gold
        { color: 'rgba(150, 255, 150, 0.9)', glow: 'rgba(150, 255, 150, 0.5)' }, // Light Green
        { color: 'rgba(255, 150, 255, 0.9)', glow: 'rgba(255, 150, 255, 0.5)' }, // Purple
        { color: 'rgba(255, 100, 200, 0.9)', glow: 'rgba(255, 100, 200, 0.5)' }, // Magenta
        { color: 'rgba(100, 255, 200, 0.9)', glow: 'rgba(100, 255, 200, 0.5)' }, // Cyan
        { color: 'rgba(255, 180, 100, 0.9)', glow: 'rgba(255, 180, 100, 0.5)' }  // Orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function initFireworks() {
    fireworksCanvas = document.getElementById('fireworksCanvas');
    if (!fireworksCanvas) return;
    
    fireworksCtx = fireworksCanvas.getContext('2d');
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
}

function createFireworkExplosion(x, y) {
    const colors = [
        'hsl(0, 100%, 60%)',     // Red
        'hsl(50, 100%, 60%)',    // Yellow
        'hsl(120, 100%, 60%)',   // Green
        'hsl(200, 100%, 60%)',   // Blue
        'hsl(280, 100%, 60%)',   // Purple
        'hsl(30, 100%, 60%)',    // Orange
        'hsl(340, 100%, 60%)',   // Pink
    ];
    
    const particleCount = 25 + Math.random() * 15;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 4 + Math.random() * 8;
        
        fireworkParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 1,
            decay: 0.015 + Math.random() * 0.02,
            color: color,
            radius: 1.5 + Math.random() * 2
        });
    }
}

function updateFireworks() {
    fireworkParticles = fireworkParticles.filter(p => p.life > 0);
    
    fireworkParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.life -= p.decay;
    });
}

function drawFireworks() {
    if (!fireworksCtx) return;
    
    // Semi-transparent background for trail effect
    fireworksCtx.globalCompositeOperation = 'destination-out';
    fireworksCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    // Draw particles with bright blending
    fireworksCtx.globalCompositeOperation = 'lighter';
    
    fireworkParticles.forEach(p => {
        const radius = Math.max(0.1, p.radius * p.life);
        fireworksCtx.fillStyle = p.color.replace(')', `, ${p.life})`);
        fireworksCtx.beginPath();
        fireworksCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        fireworksCtx.fill();
    });
}

function animateFireworks() {
    updateFireworks();
    drawFireworks();
    
    if (fireworkParticles.length > 0) {
        fireworkAnimationFrameId = requestAnimationFrame(animateFireworks);
    } else if (fireworksActive) {
        // Continue animation even if no particles, for new explosions
        fireworkAnimationFrameId = requestAnimationFrame(animateFireworks);
    }
}

function startFireworks() {
    if (!fireworksCanvas) {
        initFireworks();
    }
    
    fireworksActive = true;
    fireworksCanvas.classList.add('active');
    
    // Start animation loop
    if (!fireworkAnimationFrameId) {
        animateFireworks();
    }
    
    // Launch fireworks every 1 second
    const fireworkInterval = setInterval(() => {
        if (!fireworksActive) {
            clearInterval(fireworkInterval);
            return;
        }
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.6);
        createFireworkExplosion(x, y);
    }, 1000);
    
    // Store interval ID for cleanup
    if (!window.fireworkIntervalId) {
        window.fireworkIntervalId = fireworkInterval;
    }
}

function stopFireworks() {
    fireworksActive = false;
    
    if (window.fireworkIntervalId) {
        clearInterval(window.fireworkIntervalId);
        window.fireworkIntervalId = null;
    }
    
    // Don't hide canvas immediately, let particles fade out
    setTimeout(() => {
        if (!fireworksActive && fireworksCanvas) {
            fireworksCanvas.classList.remove('active');
        }
    }, 3000);
}

function createParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) {
        return;
    }

    // Start fireworks
    startFireworks();

    // Stop any existing particle generation
    if (particleIntervalId) {
        clearInterval(particleIntervalId);
    }

    // Generate particles continuously
    particleIntervalId = setInterval(function() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random start position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;

        // Random end position (flying up and outward)
        const tx = (Math.random() - 0.5) * 300;
        const ty = -Math.random() * 400;

        // Random animation duration (between 2-5 seconds)
        const particleDuration = 2000 + Math.random() * 3000;

        // Get random color
        const colorSet = getParticleColor();

        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.setProperty('--particle-color', colorSet.color);
        particle.style.setProperty('--particle-glow', colorSet.glow);
        particle.style.animationDuration = particleDuration + 'ms';
        particle.style.animationDelay = '0ms';

        container.appendChild(particle);

        // Remove particle after animation
        setTimeout(function() {
            particle.remove();
        }, particleDuration + 100);
    }, 200); // Create new particle every 200ms
}
