document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
});

function initNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.style.borderBottomColor = 'var(--border)';
        } else {
            nav.style.borderBottomColor = 'transparent';
        }
    });
}
