import { projects } from '../data/projects.js';

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Initial Render
    renderProjects(projects);

    // Filter Logic
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterButtons.forEach(b => {
                b.classList.remove('bg-gc2-orange', 'text-white', 'shadow-glow-orange');
                b.classList.add('bg-white/5', 'text-gray-400', 'hover:bg-white/10');
            });
            // Add active to clicked
            btn.classList.remove('bg-white/5', 'text-gray-400', 'hover:bg-white/10');
            btn.classList.add('bg-gc2-orange', 'text-white', 'shadow-glow-orange');

            const category = btn.dataset.filter;

            const filtered = category === 'all'
                ? projects
                : projects.filter(p => p.cat === category);

            // Animate Grid Out
            grid.style.opacity = '0';
            grid.style.transform = 'translateY(10px)';

            setTimeout(() => {
                renderProjects(filtered);
                // Animate Grid In
                grid.style.transition = 'all 0.5s ease-out';
                grid.style.opacity = '1';
                grid.style.transform = 'translateY(0)';
            }, 300);
        });
    });

    function renderProjects(items) {
        grid.innerHTML = '';
        if (items.length === 0) {
            grid.innerHTML = '<p class="col-span-full text-center text-gray-500 py-24 text-xl">Aucun projet trouvé pour cette catégorie.</p>';
            return;
        }

        items.forEach((project, index) => {
            const card = document.createElement('a');
            // Assuming we might want to link to a detail page or just anchor
            // For now, href="#"
            card.href = "#";
            card.className = 'group relative block rounded-2xl overflow-hidden glass-panel h-96 fade-in-up';
            // Set transition delay for staggered effect
            card.style.transitionDelay = `${index * 50}ms`;

            const imgSrc = `projets/${project.id}-1.jpg`;

            card.innerHTML = `
                <div class="absolute inset-0 bg-gc2-surface z-0">
                     <img src="${imgSrc}" alt="${project.title}" class="w-full h-full object-cover opacity-60 transition duration-700 group-hover:scale-110 group-hover:opacity-40" onerror="this.src='images/placeholder-project.jpg'">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                
                <div class="absolute inset-0 p-8 flex flex-col justify-end z-10">
                    <div class="transform translate-y-4 group-hover:translate-y-0 transition duration-500">
                        <span class="inline-block py-1 px-3 mb-3 rounded-full bg-gc2-orange/20 border border-gc2-orange/30 text-gc2-orange text-xs font-bold tracking-widest uppercase">
                            ${project.subtitle}
                        </span>
                        <h3 class="text-2xl font-bold text-white mb-2 leading-tight">${project.title}</h3>
                        <p class="text-gray-400 text-sm line-clamp-3 opacity-0 group-hover:opacity-100 transition duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                            ${project.intro}
                        </p>
                        <div class="mt-4 flex items-center text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition duration-500 delay-200">
                            Voir le projet <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(card);

            // Force reflow to ensure transition works
            void card.offsetWidth;

            // Add visible class immediately for these dynamic elements
            // We use a small timeout to allow the transition to actually animate if needed,
            // or we can just add the class if CSS transitions are set up correctly.
            // Since we set transition-delay instead of animation-delay, we can just add the class.
            setTimeout(() => {
                card.classList.add('visible');
            }, 50);
        });
    }
});
