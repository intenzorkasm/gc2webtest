document.addEventListener('DOMContentLoaded', () => {
    // Sticky Header
    const header = document.querySelector('.sticky-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Animate menu items
            const links = mobileMenu.querySelectorAll('a');
            links.forEach((link, index) => {
                if (!mobileMenu.classList.contains('hidden')) {
                    link.style.opacity = '0';
                    link.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        link.style.transition = 'all 0.3s ease-out';
                        link.style.opacity = '1';
                        link.style.transform = 'translateY(0)';
                    }, index * 50);
                }
            });
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach((el) => {
        observer.observe(el);
    });
});
