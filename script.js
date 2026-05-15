// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Scroll Progress Bar
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scroll = `${totalScroll / windowHeight * 100}%`;
    scrollProgress.style.width = scroll;
});

// Navbar background on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Reveal Animations (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Modals
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(event, id) {
    if (event.target.id === id || event.target.classList.contains('modal-close')) {
        document.getElementById(id).classList.remove('active');
    }
}

// 3D Tilt Effect (flicker-free)
const tiltElements = document.querySelectorAll('.bento-card, .timeline-content');

tiltElements.forEach(el => {
    let rafId = null;
    let isHovering = false;

    // Add smooth transition for when mouse leaves
    el.style.willChange = 'transform';
    el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    el.addEventListener('mouseenter', () => {
        isHovering = true;
        // Remove transition for responsive feel during hover
        el.style.transition = 'none';
    });

    el.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        if (rafId) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Clamp values to prevent extreme tilts at edges
            const rawRotateX = ((y - centerY) / centerY) * -5;
            const rawRotateY = ((x - centerX) / centerX) * 5;
            const rotateX = Math.max(-5, Math.min(5, rawRotateX));
            const rotateY = Math.max(-5, Math.min(5, rawRotateY));

            el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
            rafId = null;
        });
    });

    el.addEventListener('mouseleave', () => {
        isHovering = false;
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        // Re-enable smooth transition for the reset
        el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
});

// Education Details Toggle
function toggleEduDetails(detailsId, toggleBtn) {
    const details = document.getElementById(detailsId);
    if (!details) return;
    
    const isActive = details.classList.contains('active');
    
    if (isActive) {
        // Collapse
        details.style.maxHeight = details.scrollHeight + 'px';
        // Force reflow
        details.offsetHeight;
        details.style.maxHeight = '0px';
        details.classList.remove('active');
        toggleBtn.classList.remove('active');
        toggleBtn.querySelector('.edu-toggle-text').textContent = 'View Details';
    } else {
        // Expand
        details.classList.add('active');
        details.style.maxHeight = details.scrollHeight + 'px';
        toggleBtn.classList.add('active');
        toggleBtn.querySelector('.edu-toggle-text').textContent = 'Hide Details';
        
        // After animation, set to auto for responsive
        setTimeout(() => {
            if (details.classList.contains('active')) {
                details.style.maxHeight = 'none';
            }
        }, 600);
    }
}

// Prevent education toggle clicks from triggering tilt
document.querySelectorAll('.edu-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

