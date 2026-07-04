// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Particle Canvas Settings
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mood = 'rain'; // Options: rain, sunrise, blossom

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = mood === 'rain' ? -10 : Math.random() * canvas.height + canvas.height;
        this.size = mood === 'rain' ? Math.random() * 2 + 1 : Math.random() * 4 + 2;
        this.speedY = mood === 'rain' ? Math.random() * 5 + 4 : -(Math.random() * 1 + 0.5);
        this.speedX = mood === 'rain' ? -1 : Math.random() * 1 - 0.5;
        this.color = mood === 'rain' ? 'rgba(148, 163, 184, 0.4)' : mood === 'sunrise' ? 'rgba(253, 224, 71, 0.5)' : 'rgba(251, 207, 232, 0.7)';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (mood === 'rain' && this.y > canvas.height) this.reset();
        if (mood !== 'rain' && this.y < -10) this.reset();
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        if (mood === 'blossom') {
            // Oval configuration resembling falling blossom petals
            ctx.ellipse(this.x, this.y, this.size, this.size * 1.5, Math.PI / 4, 0, Math.PI * 2);
        } else {
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        }
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for(let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Global Mood Transition Management using ScrollTrigger
ScrollTrigger.create({
    trigger: "#scene-2",
    start: "top center",
    onEnter: () => { mood = 'sunrise'; document.body.className = 'phase-sunrise'; document.querySelector('.heart-crack').style.transform = 'scaleY(1)'; },
    onLeaveBack: () => { mood = 'rain'; document.body.className = 'phase-dark'; document.querySelector('.heart-crack').style.transform = 'scaleY(0)'; }
});

ScrollTrigger.create({
    trigger: "#scene-5",
    start: "top center",
    onEnter: () => { mood = 'blossom'; document.body.className = 'phase-blossom'; },
    onLeaveBack: () => { mood = 'sunrise'; document.body.className = 'phase-sunrise'; }
});

// Scene 3 Card Reveal Chain
gsap.to(".glass-card", {
    scrollTrigger: {
        trigger: "#scene-3",
        start: "top center",
    },
    opacity: 1,
    y: 0,
    stagger: 0.2,
    duration: 0.8
});

// Scene 5 Sequential Text Typing Animation Simulator
ScrollTrigger.create({
    trigger: "#scene-5",
    start: "top center",
    onEnter: () => {
        const container = document.getElementById('typing-container');
        if (container.innerHTML.trim() === "") {
            const lines = [
                "I'm not here because I'm afraid of losing you.",
                "I'm here because I still choose you.",
                "Every single day."
            ];
            let currentLine = 0;
            
            function typeNextLine() {
                if (currentLine < lines.length) {
                    let p = document.createElement('p');
                    p.className = "opacity-0 transition-opacity duration-1000 mt-4";
                    if(currentLine === 2) p.className += " text-rose-600 font-medium";
                    p.innerText = lines[currentLine];
                    container.appendChild(p);
                    setTimeout(() => { p.classList.remove('opacity-0'); }, 50);
                    currentLine++;
                    setTimeout(typeNextLine, 2000);
                }
            }
            typeNextLine();
        }
    }
});

// Scene 6 Bridge Construction Builder
gsap.to(".plank", {
    scrollTrigger: {
        trigger: "#bridge-container",
        start: "top 70%",
    },
    opacity: 1,
    x: 0,
    stagger: 0.3,
    duration: 0.6
});

// Scene 7 Envelope Scale Handler
gsap.to("#envelope-wrapper", {
    scrollTrigger: {
        trigger: "#scene-7",
        start: "top 60%"
    },
    scale: 1,
    opacity: 1,
    duration: 1.2
});

// Final Scene Animation Logic Execution Sequence
ScrollTrigger.create({
    trigger: "#scene-final",
    start: "top 40%",
    onEnter: () => {
        gsap.to("#final-heart", { opacity: 1, duration: 1 });
        const container = document.getElementById('final-text');
        if (container.innerHTML.trim() === "") {
            setTimeout(() => {
                container.innerHTML = `<p class="transition-all duration-1000 font-light text-slate-700">"Every beautiful story deserves another chapter..."</p>`;
                setTimeout(() => {
                    container.innerHTML += `<p class="transition-all duration-1000 font-medium text-slate-900 mt-2">Only if both hearts choose to write it together.</p>`;
                    setTimeout(() => {
                        document.getElementById('cta-btn').classList.remove('hidden');
                    }, 1200);
                }, 2000);
            }, 1000);
        }
    }
});

// CTA Button Click Event
document.getElementById('cta-btn').addEventListener('click', function() {
    this.style.display = 'none';
    const interactContainer = document.getElementById('hearts-interact');
    interactContainer.classList.remove('hidden');
    interactContainer.classList.add('flex');
    
    // Smooth custom magnetic path movement matching visual style description
    gsap.to(interactContainer.children[0], { x: 60, duration: 2, ease: "power2.out" });
    gsap.to(interactContainer.children[1], { x: -60, duration: 2, ease: "power2.out" });
});

// Audio Integration Controller Setup
const audio = document.getElementById('bg-music');
const audioBtn = document.getElementById('audio-toggle');
audioBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().catch(e => console.log("Audio waiting for user gesture interaction first."));
        audioBtn.innerText = "⏸️ Pause Music";
    } else {
        audio.pause();
        audioBtn.innerText = "🎵 Play Music";
    }
});
