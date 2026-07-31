/* ============================================================
   PYLON VISION - Enhanced JavaScript
   Mobile-First Responsive Functionality
   Version: 2.0.0
============================================================ */

// ========== 1. UTILITY FUNCTIONS ==========
const utils = {
    // Safely get element by ID with error handling
    getElement: (id) => {
        try {
            return document.getElementById(id);
        } catch (error) {
            console.warn(`Element with id "${id}" not found`);
            return null;
        }
    },

    // Safely query selector
    query: (selector) => {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Selector "${selector}" invalid`);
            return null;
        }
    },

    // Safely query all
    queryAll: (selector) => {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn(`Selector "${selector}" invalid`);
            return [];
        }
    },

    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Safe local storage
    storage: {
        get: (key) => {
            try {
                return localStorage.getItem(key);
            } catch {
                return null;
            }
        },
        set: (key, value) => {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch {
                return false;
            }
        }
    },

    // Check if device is mobile
    isMobile: () => {
        return window.innerWidth <= 768;
    },

    // Check if device is tablet
    isTablet: () => {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },

    // Check if device is desktop
    isDesktop: () => {
        return window.innerWidth > 1024;
    },

    // Check if device supports touch
    isTouch: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

// ========== 2. INITIAL SETUP ==========
document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on page load
    try {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        const hash = window.location.hash;
        if (hash) {
            history.replaceState("", document.title, window.location.pathname + window.location.search);
            setTimeout(() => {
                if (hash === '#privacy' && window.openPrivacyModal) {
                    window.openPrivacyModal();
                } else if (hash === '#terms' && window.openTermsModal) {
                    window.openTermsModal();
                }
            }, 300);
        }
        setTimeout(() => window.scrollTo(0, 0), 0);
    } catch (error) {
        console.error('Scroll setup error:', error);
    }

    // Update year dynamically
    const currentYear = new Date().getFullYear();
    ['current-year', 'year', 'badge-year'].forEach(id => {
        const el = utils.getElement(id);
        if (el) el.textContent = currentYear;
    });

    // Initialize all modules
    MobileMenu.init();
    CookieBanner.init();
    NavbarScroll.init();
    ROICalculator.init();
    CourseLibrary.init();
    FAQ.init();
    Modals.init();
    Dashboard.init();
    PromoText.init();
    MegaMenu.init();
    EmailProtection.init();
    ScrollReveal.init();
    Constellation.init();
    Ticker.init();
    Countdown.init();
    TouchOptimizations.init();
});

// ========== 3. MOBILE MENU MODULE ==========
const MobileMenu = {
    isOpen: false,
    
    init() {
        this.btn = utils.query('.mobile-menu-btn');
        this.menu = utils.query('.nav-links-mobile');
        
        if (!this.btn || !this.menu) return;

        // Toggle menu
        this.btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // Close on link click (except Academy)
        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close if it's the Academy trigger
                if (link.id === 'academy-trigger-mobile') {
                    return;
                }
                
                // Close menu for other links
                this.close();
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.menu.contains(e.target) && 
                !this.btn.contains(e.target) &&
                !e.target.closest('.mega-menu')) {
                this.close();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Handle window resize
        window.addEventListener('resize', utils.debounce(() => {
            if (utils.isDesktop() && this.isOpen) {
                this.close();
            }
        }, 250));
    },

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        this.isOpen = true;
        this.btn.classList.add('active');
        this.btn.setAttribute('aria-expanded', 'true');
        this.menu.classList.add('active');
        
        // Add backdrop
        this.addBackdrop();
        
        // Focus first link for accessibility
        const firstLink = this.menu.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    },

    close() {
        this.isOpen = false;
        this.btn.classList.remove('active');
        this.btn.setAttribute('aria-expanded', 'false');
        this.menu.classList.remove('active');
        
        // Remove backdrop
        this.removeBackdrop();
        
        // Also close mega menu if open
        if (window.MegaMenu && window.MegaMenu.isOpen) {
            window.MegaMenu.close();
        }
    },
    
    addBackdrop() {
        let backdrop = utils.query('.menu-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'menu-backdrop';
            backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(5, 5, 7, 0.8);
                backdrop-filter: blur(5px);
                z-index: 1499;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(backdrop);
        }
        
        // Animate in
        requestAnimationFrame(() => {
            backdrop.style.opacity = '1';
        });
        
        // Close on backdrop click
        backdrop.addEventListener('click', () => {
            this.close();
        });
    },
    
    removeBackdrop() {
        const backdrop = utils.query('.menu-backdrop');
        if (backdrop) {
            backdrop.style.opacity = '0';
            setTimeout(() => {
                if (backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            }, 300);
        }
    }
};

// ========== 4. COOKIE BANNER MODULE ==========
const CookieBanner = {
    init() {
        this.banner = utils.getElement('cookie-banner');
        this.acceptBtn = utils.getElement('accept-cookies');
        this.declineBtn = utils.getElement('decline-cookies');

        if (!this.banner) return;

        // Jeśli zgoda została już wcześniej udzielona, ładujemy analitykę od razu
        if (utils.storage.get('pylon_cookie_consent') === 'accepted') {
            this.loadGoogleAnalytics();
        } 
        // W przeciwnym razie (brak wyboru), po sekundzie pokazujemy baner
        else if (!utils.storage.get('pylon_cookie_consent')) {
            setTimeout(() => {
                this.banner.classList.add('show');
            }, 1000);
        }

        // Akceptacja ciasteczek
        this.acceptBtn?.addEventListener('click', () => {
            utils.storage.set('pylon_cookie_consent', 'accepted');
            this.banner.classList.remove('show');
            this.loadGoogleAnalytics(); // Uruchamiamy GA od razu po kliknięciu
        });

        // Odrzucenie ciasteczek
        this.declineBtn?.addEventListener('click', () => {
            utils.storage.set('pylon_cookie_consent', 'declined');
            this.banner.classList.remove('show');
            // Strona działa dalej, ale żadne skrypty śledzące nie zostaną załadowane
        });
    },

    // Dynamiczne wstrzykiwanie skryptu śledzącego
    loadGoogleAnalytics() {
        // Zabezpieczenie przed podwójnym wgraniem skryptu
        if (document.getElementById('ga-script')) return;

        const script1 = document.createElement('script');
        script1.id = 'ga-script';
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-ESCD5MEEP1';
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ESCD5MEEP1');
        `;
        document.head.appendChild(script2);
    }
};

// ========== 5. NAVBAR SCROLL & PROGRESS ==========
const NavbarScroll = {
    init() {
        this.navbar = utils.query('.navbar');
        this.progress = utils.getElement('scroll-progress');
        
        if (!this.navbar) return;

        const handleScroll = utils.throttle(() => {
            const scrollPos = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Update scroll progress
            if (this.progress && totalHeight > 0) {
                const percent = Math.min((scrollPos / totalHeight * 100), 100);
                this.progress.style.width = `${percent}%`;
            }

            // Add scrolled class to navbar
            this.navbar.classList.toggle('scrolled', scrollPos > 50);
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial call
        handleScroll();
    }
};

// ========== 6. 3D SUBSCRIPTION BANNER ==========
const SubBanner = {
    init() {
        this.banner = utils.getElement('subscription-hero');
        if (!this.banner) return;

        // Don't initialize on mobile for performance
        if (utils.isMobile()) return;

        let rect = this.banner.getBoundingClientRect();

        const updateRect = () => {
            rect = this.banner.getBoundingClientRect();
        };

        window.addEventListener('resize', utils.debounce(updateRect, 200));
        window.addEventListener('scroll', utils.throttle(updateRect, 100), { passive: true });

        this.banner.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                this.banner.style.setProperty('--mouse-x', `${x}px`);
                this.banner.style.setProperty('--mouse-y', `${y}px`);

                const rotateX = (y - rect.height / 2) / 30;
                const rotateY = (rect.width / 2 - x) / 30;

                this.banner.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        }, { passive: true });

        this.banner.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                this.banner.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)';
            });
        });
    }
};

// ========== 7. INFINITY TICKER ==========
const Ticker = {
    init() {
        this.ticker = utils.getElement('logoTicker');
        if (!this.ticker) return;

        // Clone items for infinite scroll
        // Dzięki temu mamy dwa zestawy ikon – klucz do płynnego przejścia
        const items = Array.from(this.ticker.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            this.ticker.appendChild(clone);
        });
    }
};

// ========== 8. COURSE LIBRARY MODULE ==========
const CourseLibrary = {
    courses: [
        { id: 1, title: "E-Commerce Mastery", category: "business", price: "$49", image: "images/image1.webp", desc: "Start your dropshipping journey with a solid plan. We teach you how to set up your store, find reliable suppliers, and choose products with potential.", url: "#" },
        { id: 2, title: "Agency Architect", category: "business", price: "$99", image: "images/image2.webp", desc: "Learn how to build organize and scale a marketing agency. We show you proven strategies to find clients and manage your projects.", url: "#" },
        { id: 3, title: "Copywriter Secrets", category: "business", price: "$29", image: "images/image3.webp", desc: "Discover how to write texts that persuades people to buy easily. You will learn the psychology behind sales and how to present your offers effectively.", url: "#" },
        { id: 4, title: "Market Strategy", category: "business", price: "$79", image: "images/image4.webp", desc: "Learn the way of trading and technical analysis. We teach you how to read charts, manage risk, and think like a professional investor.", url: "#" },
        { id: 5, title: "Faceless Influencer", category: "social", price: "$39", image: "images/image5.webp", desc: "Learn how to run a YouTube channel without showing your face. We explain how to choose the right topics and create content efficiently.", url: "#" },
        { id: 6, title: "Prime Dropshipping", category: "business", price: "$49", image: "images/image6.webp", desc: "Learn how to sell on Amazon, the world's largest marketplace. We explain the FBA model and how to use Amazon's logistics.", url: "#" },
        { id: 7, title: "Deal Closing Expert", category: "business", price: "$99", image: "images/image7.webp", desc: "Improve your sales skills and learn how to close deals over the phone. We provide you with scripts and frameworks used by professional salespeople.", url: "#" },
        { id: 8, title: "Insta Money", category: "social", price: "$19", image: "images/image8.webp", desc: "Learn strategies to grow on Social Media and engage your followers. We show you how to build an audience and the different ways to monetize your page.", url: "#" },
        { id: 9, title: "The Founder Playbook", category: "business", price: "$197", image: "images/image9.webp", desc: "Learn how to build a paid community around your brand. We guide you through the process of turning your knowledge into a subscription business.", url: "#" },
        { id: 10, title: "AI Automation Blueprint", category: "ai", price: "$69", image: "images/image10.webp", desc: "Discover how to leverage advanced AI agents to put your business on autopilot. Learn the exact prompts and workflows we use.", url: "#" },
        { id: 11, title: "Dropcoursing Method", category: "business", price: "$49", image: "images/image11.webp", desc: "Learn the secrets of selling digital products and MRR/PLR courses. Build a high-margin digital empire without inventory or shipping.", url: "#" },
        { id: 12, title: "Micro-SaaS Developer", category: "ai", price: "$149", image: "images/image12.webp", desc: "Build and scale your own software-as-a-service using no-code tools. Create recurring revenue without writing a single line of code.", url: "#" }
    ],

stats: {
        1: { rating: 4.8, reviews: 112, badgeType: 'BESTSELLER', meta: "Level: Beginner • Ecom Blueprint" }, 
        2: { rating: 4.8, reviews: 41, badgeType: 'NONE', meta: "Level: Intermediate • Agency SOPs" },
        3: { rating: 4.7, reviews: 28, badgeType: 'NONE', meta: "Level: All Levels • Copy Frameworks" },
        4: { rating: 4.7, reviews: 19, badgeType: 'NONE', meta: "Level: Advanced • Technical Charts" },       
        5: { rating: 4.8, reviews: 67, badgeType: 'TRENDING', meta: "Level: Beginner • Faceless System" },   
        6: { rating: 4.7, reviews: 24, badgeType: 'NONE', meta: "Level: Intermediate • FBA Logistics" },
        7: { rating: 4.7, reviews: 14, badgeType: 'NONE', meta: "Level: Advanced • Closing Scripts" },       
        8: { rating: 4.8, reviews: 52, badgeType: 'NONE', meta: "Level: Beginner • Social Growth" },       
        9: { rating: 4.9, reviews: 11, badgeType: 'ELITE_PICK', meta: "Level: Advanced • Community Engine" }, 
        10: { rating: 4.9, reviews: 87, badgeType: 'BESTSELLER', meta: "Level: Intermediate • AI Workflows" },
        11: { rating: 4.8, reviews: 42, badgeType: 'TRENDING', meta: "Level: All Levels • MRR/PLR System" },
        12: { rating: 4.9, reviews: 14, badgeType: 'ELITE_PICK', meta: "Level: Advanced • No-Code SaaS" }
    },

    init() {
        this.grid = utils.getElement('courseGrid');
        this.searchInput = utils.getElement('courseSearch');
        this.filterBtns = utils.queryAll('.filter-btn');

        if (!this.grid) return;

        this.render(this.courses);
        this.setupFilters();
        this.setupSearch();
    },

    // NAPRAWIONA FUNKCJA - brakowało tutaj zawartości
    setupFilters() {
        if (this.filterBtns) {
            this.filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.filterCourses();
                });
            });
        }
    },

    setupSearch() {
        if (!this.searchInput) return;
        
        this.searchInput.addEventListener('input', utils.debounce(() => {
            this.filterCourses();
        }, 300));
        
        // Clear search on escape
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.searchInput.value = '';
                this.filterCourses();
                this.searchInput.blur();
            }
        });
    },

    filterCourses() {
        const activeBtn = utils.query('.filter-btn.active');
        const category = activeBtn?.getAttribute('data-filter') || 'all';
        const term = this.searchInput?.value.toLowerCase() || '';

        const filtered = this.courses.filter(course => {
            const matchesCategory = category === 'all' || course.category === category;
            const matchesSearch = course.title.toLowerCase().includes(term) || 
                                 course.desc.toLowerCase().includes(term);
            return matchesCategory && matchesSearch;
        });

        this.render(filtered);
    },

    render(data) {
        if (!this.grid) return;
        
        // Clear existing content
        this.grid.innerHTML = '';
        
        // Show no results message if empty
        if (data.length === 0) {
            this.grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3>No courses found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        const currentDate = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

        data.forEach((course, index) => {
            // 1. Pobieramy statystyki dla danego ID
            const stats = this.stats[course.id] || { rating: 4.5, reviews: 0, oldPrice: 0, badgeType: 'NONE' };
            
            // 2. Generujemy HTML dla badge'a i gwiazdek za pomocą Twoich funkcji pomocniczych
            const badgeHtml = this.getBadgeHTML(stats.badgeType);
            const starsHtml = this.getStarsHTML(stats.rating);

            const card = document.createElement('a');
            card.href = "https://buy.stripe.com/7sY7sM0Ax0dVffB4fFgfu00"; 
            card.className = 'course-card';
            card.style.opacity = '0';
            card.style.textDecoration = 'none'; 
            card.style.color = 'inherit';

            // Wszystkie obrazki ładowane są leniwie (lazy)
            const loadingAttr = 'loading="lazy"';

            card.innerHTML = `
                ${badgeHtml} 
                <div class="card-image-wrapper">
                    <img src="${course.image}" alt="${course.title}" width="340" height="240" class="card-image" ${loadingAttr}>
                </div>
                <div class="card-content">
                    <h3 class="card-title" style="margin-bottom:5px; font-size: 1.25rem;">${course.title}</h3>

                    <div style="font-size: 0.75rem; color: #A78BFA; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-layer-group" style="font-size: 0.8em;"></i> ${stats.meta}
                    </div>

                    <div style="font-size: 0.75rem; color: #10B981; margin-bottom: 10px; font-weight:700; display:flex; align-items:center; gap:6px;">
                        <i class="fa-solid fa-rotate" style="font-size: 0.8em;"></i> Updated for ${currentDate}
                    </div>

                    <p class="card-desc">${course.desc}</p>
                    
                    <div class="card-footer" style="padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.05); width: 100%;">
                        <div class="btn-card" style="display: block; width: 100%; text-align: center; padding: 12px 0;">Get Access</div>
                    </div>
                </div>
            `;
            this.grid.appendChild(card);
        });

        this.animateCardsIn();
    },

    animateCardsIn() {
        const cards = this.grid.querySelectorAll('.course-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
            }, index * 100);
        });
    },

    getBadgeHTML(type) {
        const badges = {
            'USER_FAV': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #e5e7eb 0%, #9ca3af 50%, #d1d5db 100%); color: #111827;"><i class="fa-solid fa-gem" style="margin-right: 4px;"></i> LIMITED DROP</div>',
            'BESTSELLER': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%); text-shadow: 0 1px 2px rgba(0,0,0,0.3);"><i class="fa-solid fa-crown"></i> Bestseller</div>',
            'ELITE_PICK': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #8B5CF6, #D946EF);"><i class="fa-solid fa-crown"></i> Elite Pick</div>',
            'TRENDING': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #10B981, #059669);"><i class="fa-solid fa-arrow-trend-up"></i> Trending</div>',
            'TOP_RATED': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #6366f1, #4f46e5);"><i class="fa-solid fa-star"></i> Top Rated</div>'
        };
        return badges[type] || '';
    },

    getStarsHTML(rating) {
        const numRating = parseFloat(rating);
        if (numRating >= 4.8) {
            return '<i class="fa-solid fa-star"></i>'.repeat(5);
        } else if (numRating >= 4.3) {
            return '<i class="fa-solid fa-star"></i>'.repeat(4) + '<i class="fa-solid fa-star-half-stroke"></i>';
        } else {
            return '<i class="fa-solid fa-star"></i>'.repeat(4) + '<i class="fa-regular fa-star"></i>';
        }
    }
};

// ========== 10. CONSTELLATION ANIMATION ==========
const Constellation = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    lastWidth: window.innerWidth,

    init() {
        this.canvas = utils.getElement('constellation-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();

        // Handle resize - NAPRAWIONE: resetujemy cząsteczki tylko gdy zmieni się szerokość (np. obrót telefonu), 
        // co eliminuje skakanie przy chowaniu paska adresu podczas scrollowania na mobile.
        window.addEventListener('resize', utils.debounce(() => {
            const currentWidth = window.innerWidth;
            this.resize();
            if (currentWidth !== this.lastWidth) {
                this.lastWidth = currentWidth;
                this.createParticles();
            }
        }, 200));
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    createParticles() {
        this.particles = [];
        const particleCount = utils.isMobile() ? 12 : 40;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 1.5 + 0.5
            });
        }
    },

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach((particle, i) => {
            // Update position smoothly
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = 1 - distance / 150;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(124, 58, 237, ${opacity * 0.5})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    },

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
};

// ========== 11. DASHBOARD ANIMATION ==========
const Dashboard = {
    init() {
        this.target = utils.query('.hero-dashboard');
        if (!this.target) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.animate();
                observer.unobserve(this.target);
            }
        }, { threshold: 0.3 });

        observer.observe(this.target);
    },

    animate() {
        const stats = [
            { id: 'dash-revenue', barId: 'bar-revenue', end: 9349, max: 10000 },
            { id: 'dash-bots', barId: 'bar-bots', end: 72, max: 100 },
            { id: 'dash-hours', barId: 'bar-hours', end: 144, max: 150 }
        ];

        stats.forEach(stat => {
            const numberEl = utils.getElement(stat.id);
            const barEl = utils.getElement(stat.barId);
            if (!numberEl || !barEl) return;

            let startTime = null;
            const duration = 2000;

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const currentVal = Math.floor(progress * stat.end);

                numberEl.textContent = currentVal.toLocaleString();
                barEl.style.width = `${(stat.end / stat.max) * progress * 100}%`;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    numberEl.textContent = stat.end.toLocaleString();
                    barEl.style.width = `${(stat.end / stat.max * 100)}%`;
                }
            };

            // Stagger animations
            setTimeout(() => requestAnimationFrame(step), stats.indexOf(stat) * 200);
        });
    }
};

// ========== 12. FAQ MODULE ==========
const FAQ = {
    init() {
        this.questions = utils.queryAll('.faq-question');
        if (this.questions.length === 0) return;

        this.questions.forEach(question => {
            question.addEventListener('click', () => {
                this.toggle(question);
            });
            
            // Handle keyboard navigation
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggle(question);
                }
            });
        });
    },

    toggle(question) {
        const isActive = question.classList.contains('active');
        const panel = question.nextElementSibling;
        
        if (!panel) return;

        // Close all other questions
        this.questions.forEach(q => {
            if (q !== question) {
                q.classList.remove('active');
                q.setAttribute('aria-expanded', 'false');
                const p = q.nextElementSibling;
                if (p) {
                    p.style.maxHeight = null;
                    p.setAttribute('aria-hidden', 'true');
                }
            }
        });

        // Toggle current question
        if (!isActive) {
            question.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
            panel.style.maxHeight = panel.scrollHeight + 'px';
            panel.setAttribute('aria-hidden', 'false');
        } else {
            question.classList.remove('active');
            question.setAttribute('aria-expanded', 'false');
            panel.style.maxHeight = null;
            panel.setAttribute('aria-hidden', 'true');
        }
    }
};

// ========== 13. COUNTDOWN TIMER ==========
const Countdown = {
    init() {
        this.display = utils.getElement('countdown');
        if (!this.display) return;

        const update = () => {
            try {
                const now = new Date();
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                const diff = Math.max(0, endOfDay - now);

                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                this.display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            } catch (error) {
                console.error('Countdown error:', error);
            }
        };

        setInterval(update, 1000);
        update();
    }
};

// ========== 14. SCROLL REVEAL ==========
const ScrollReveal = {
    init() {
        // Intersection Observer for reveal animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1, 
            rootMargin: '0px 0px -50px 0px' 
        });

        // Observe all reveal elements
        utils.queryAll('.reveal').forEach(el => observer.observe(el));

        // Bento card mouse effect (desktop only)
        if (!utils.isMobile()) {
            utils.queryAll('.bento-card').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                });
            });
        }
    }
};

// ========== 15. MODAL MODULE ==========
const Modals = {
    activeModal: null,
    
    init() {
        // Generic modals
    const modalIds = [
            'privacy-modal', 
            'terms-modal', 
            'about-modal', 
            'story-modal', 
            'roadmap-modal',
            'contact-modal'
        ];

        modalIds.forEach(id => {
            const cleanName = id.replace('-modal', '');
            const camelCase = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
            
            window[`open${camelCase}Modal`] = () => this.open(id);
            window[`close${camelCase}Modal`] = () => this.close(id);
        });

        // Close on overlay click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.close(e.target.id);
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close(this.activeModal.id);
            }
        });
    },

    open(id) {
        const modal = utils.getElement(id);
        if (!modal) return;

        this.activeModal = modal;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus first focusable element
        const firstFocusable = modal.querySelector('button, input, a, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
    },

close(id) {
        const modal = utils.getElement(id);
        if (!modal) return;

        // Integration with the main scrolling fix function
        if (typeof closeAppModal === 'function') {
            closeAppModal(id);
            if (this.activeModal === modal) {
                this.activeModal = null;
            }
            return;
        }

        modal.style.display = 'none';
        
        if (this.activeModal === modal) {
            this.activeModal = null;
        }
        
        // Restore body scroll if no other modals are open
        const openModals = utils.queryAll('.modal-overlay[style*="flex"]');
        if (openModals.length === 0) {
            document.body.style.overflow = '';
        }
    }
};

// ========== 16. PROMO TEXT MODULE ==========
const PromoText = {
    init() {
        this.promoEl = utils.getElement('promo-text');
        if (!this.promoEl) return;

        const month = new Date().getMonth();

        const promos = [
            `NEW YEAR PROMO: 30% OFF – Ends 11:59 PM Tonight`,
            `FEBRUARY BOOST: 30% OFF – Ends 11:59 PM Tonight`,
            `MARCH GROWTH: 30% OFF – Ends 11:59 PM Tonight`,
            `SPRING SALE: 30% OFF – Ends 11:59 PM Tonight`,
            `MAY UPGRADE: 30% OFF – Ends 11:59 PM Tonight`,
            `SUMMER DEALS: 30% OFF – Ends 11:59 PM Tonight`,
            `JULY SPECIAL: 30% OFF – Ends 11:59 PM Tonight`,
            `AUGUST FINALE: 30% OFF – Ends 11:59 PM Tonight`,
            `SEPTEMBER START: 30% OFF – Ends 11:59 PM Tonight`,
            `HALLOWEEN PROMO: 30% OFF – Ends 11:59 PM Tonight`,
            `BLACK FRIDAY: 30% OFF – Ends 11:59 PM Tonight`,
            `XMAS PROTOCOL: 30% OFF – Ends 11:59 PM Tonight`
        ];

        this.promoEl.textContent = promos[month];
    }
};

// ========== 17. MEGA MENU MODULE ==========
const MegaMenu = {
    isOpen: false,
    
    init() {
        this.menu = utils.getElement('academy-mega-menu');
        this.trigger = utils.getElement('academy-trigger');
        this.triggerMobile = utils.getElement('academy-trigger-mobile');
        this.closeBtn = utils.getElement('mega-close-btn');
        this.overlay = utils.getElement('mega-overlay');
        this.grid = utils.getElement('mega-grid-target');

        if (!this.menu || !this.trigger) return;

        this.setupCourses();
        this.setupEvents();
    },

setupCourses() {
        if (!this.grid) return;

        const courses = [
            // Rząd 1
            { id: 1, title: "Ecom", img: "images/image1.webp" },
            { id: 2, title: "Agency", img: "images/image2.webp" },
            { id: 11, title: "Dropcoursing", img: "images/image11.webp" },
            { id: 9, title: "Founder", img: "images/image9.webp" },
            
            // Rząd 2
            { id: 10, title: "AI Bots", img: "images/image10.webp" },
            { id: 12, title: "SaaS", img: "images/image12.webp" },
            { id: 6, title: "Dropship", img: "images/image6.webp" },
            { id: 7, title: "Closing", img: "images/image7.webp" },
            
            // Rząd 3
            { id: 5, title: "YouTube", img: "images/image5.webp" },
            { id: 4, title: "Trading", img: "images/image4.webp" },
            { id: 3, title: "Copy", img: "images/image3.webp" },
            { id: 8, title: "Social", img: "images/image8.webp" }
        ];

        // ZMIENIONE: Zamiast tagu "a href" (który kierował do płatności), przywróciłem użycie funkcji scrollToSpecificCourse do zjeżdżania
        this.grid.innerHTML = courses.map(c => `
            <div class="mega-item" onclick="window.scrollToSpecificCourse(${c.id})" style="cursor: pointer;">
                <div class="mega-img-wrap"><img src="${c.img}" alt="${c.title}" width="180" height="106" loading="lazy"></div>
                <span>${c.title}</span>
            </div>
        `).join('');
    },


    setupEvents() {
        // Desktop trigger
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // Mobile trigger
        if (this.triggerMobile) {
            this.triggerMobile.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            });
        }

        // Close button
        this.closeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });

        // Overlay click
        this.overlay?.addEventListener('click', () => this.close());

        // Outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.menu.contains(e.target) && 
                e.target !== this.trigger && 
                e.target !== this.triggerMobile &&
                !this.trigger.contains(e.target) &&
                !(this.triggerMobile && this.triggerMobile.contains(e.target))) {
                this.close();
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Handle window resize
        window.addEventListener('resize', utils.debounce(() => {
            if (utils.isDesktop() && this.isOpen) {
                this.close();
            }
        }, 250));

        // Global function for scrolling to library
        window.scrollToLibrary = () => {
            // Close mega menu
            this.close();
            
            // Close mobile menu if open
            if (window.MobileMenu && window.MobileMenu.isOpen) {
                window.MobileMenu.close();
            }
            
        // Precyzyjne obliczenie pozycji kafelków (courseGrid)
            const lib = utils.getElement('courseGrid');
            if (lib) {
                // Zwiększony margines, aby dać kafelkom "oddech" pod paskiem nawigacji
                const offset = 180; 
                const topPos = lib.getBoundingClientRect().top + window.scrollY - offset;
                
                window.scrollTo({
                    top: topPos,
                    behavior: 'auto'
                });
            }
        };
    },

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        this.isOpen = true;
        this.menu.style.display = 'block';
        this.overlay?.classList.add('show');
        
        // Animate in
        setTimeout(() => {
            this.menu.classList.add('show');
        }, 10);
        
        // Update trigger states
        this.trigger.classList.add('active');
        if (this.triggerMobile) {
            this.triggerMobile.classList.add('active');
        }
    },

    close() {
        this.isOpen = false;
        this.menu.classList.remove('show');
        this.overlay?.classList.remove('show');
        
        // Update trigger states
        this.trigger.classList.remove('active');
        if (this.triggerMobile) {
            this.triggerMobile.classList.remove('active');
        }
        
        // Hide after animation
        setTimeout(() => {
            if (!this.menu.classList.contains('show')) {
                this.menu.style.display = 'none';
            }
        }, 400);
    }
};

// ========== 18. EMAIL PROTECTION MODULE ==========
const EmailProtection = {
    init() {
        const user = 'contact';
        const domain = 'pylonvision.com';

        // Footer email
        const link = utils.getElement('contact-link');
        const text = utils.getElement('contact-text');
        if (link && text) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `mailto:${user}@${domain}`;
            });
            text.textContent = `${user}@${domain}`;
        }

        // Modal email
        const modalLink = utils.getElement('modal-contact-link');
        const modalText = utils.getElement('modal-contact-text');
        if (modalLink && modalText) {
            modalText.textContent = `${user}@${domain}`;
            modalLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `mailto:${user}@${domain}`;
            });
        }

        // General email protectors
        utils.queryAll('.email-protector').forEach(link => {
            const u = link.getAttribute('data-user');
            const d = link.getAttribute('data-domain');
            if (u && d) {
                const email = `${u}@${d}`;
                link.setAttribute('href', `mailto:${email}`);
                const textSpan = link.querySelector('.email-text');
                if (textSpan) textSpan.textContent = email;
            }
        });

        // Protected email text
        utils.queryAll('.protected-email').forEach(el => {
            try {
                const email = el.textContent.replace(' [at] ', '@');
                if (email.includes('@')) {
                    el.innerHTML = `<a href="mailto:${email}" style="color: inherit; text-decoration: none;" onclick="this.style.textDecoration='underline'" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${email}</a>`;
                }
            } catch (error) {
                console.error('Email protection error:', error);
            }
        });

        // Update effective dates
        this.updateEffectiveDates();
    },

updateEffectiveDates() {
        const dateElements = utils.queryAll('.dynamic-date');
        if (dateElements.length === 0) return;

        try {
            const now = new Date();
            let month = now.getMonth();
            let year = now.getFullYear();
            let day = now.getDate();

            // Obliczamy miesiąc startowy obecnego kwartału (0 = styczeń, 3 = kwiecień, 6 = lipiec, 9 = październik)
            let quarterMonth = Math.floor(month / 3) * 3;

            // Jeśli jesteśmy w miesiącu startowym kwartału, ale przed 12. dniem, wracamy na moment do poprzedniego kwartału
            if (month === quarterMonth && day < 12) {
                quarterMonth -= 3;
                if (quarterMonth < 0) {
                    quarterMonth = 9;
                    year -= 1;
                }
            }

            // Ustawiamy datę "na sztywno" na 12. dzień obliczonego miesiąca
            const finalDate = new Date(year, quarterMonth, 12);

            const formatted = finalDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            dateElements.forEach(el => {
                el.textContent = formatted;
            });
        } catch (error) {
            console.error('Date update error:', error);
        }
    }
};

// ========== 19. TOUCH OPTIMIZATIONS ==========
const TouchOptimizations = {
    init() {
        // Add touch classes for CSS targeting
        if (utils.isTouch()) {
            document.body.classList.add('touch-device');
        }
        
        // Optimize hover states for touch
        this.optimizeHovers();
        
        // Add touch feedback
        this.addTouchFeedback();
        
        // Prevent zoom on double tap for iOS
        this.preventDoubleTapZoom();
        
        // Optimize scroll performance
        this.optimizeScroll();
    },
    
    optimizeHovers() {
        // Remove hover effects on touch devices
        if (utils.isTouch()) {
            const style = document.createElement('style');
            style.textContent = `
                .touch-device *:hover {
                    transform: none !important;
                }
                .touch-device .bento-card:hover,
                .touch-device .course-card:hover,
                .touch-device .social-card:hover {
                    transform: translateY(-2px) !important;
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    addTouchFeedback() {
        // Add active states for buttons
        const buttons = utils.queryAll('button, .btn, .btn-card, .filter-btn, .social-card, .mega-item, .faq-question');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.98)';
                button.style.transition = 'transform 0.1s ease';
            }, { passive: true });
            
            button.addEventListener('touchend', () => {
                setTimeout(() => {
                    button.style.transform = '';
                    button.style.transition = '';
                }, 100);
            }, { passive: true });
        });
    },
    
    preventDoubleTapZoom() {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    },
    
    optimizeScroll() {
        // Add passive listeners for better scroll performance
        document.addEventListener('touchmove', () => {}, { passive: true });
        document.addEventListener('wheel', () => {}, { passive: true });
    }
};

// ========== 20. ROI CALCULATOR MODULE ==========
const ROICalculator = {
    init() {
        this.hoursSlider = utils.getElement('hours-slider');
        this.rateSlider = utils.getElement('rate-slider');
        this.hoursDisplay = utils.getElement('hours-display');
        this.rateDisplay = utils.getElement('rate-display');
        this.resultDisplay = utils.getElement('result-display');

        if (!this.hoursSlider || !this.rateSlider) return;

        this.setupSliders();
        this.updateCalculation();
    },

    setupSliders() {
        this.hoursSlider.addEventListener('input', () => {
            this.updateCalculation();
        });

        this.rateSlider.addEventListener('input', () => {
            this.updateCalculation();
        });
    },

    updateCalculation() {
        const hours = parseInt(this.hoursSlider.value);
        const rate = parseInt(this.rateSlider.value);

        // Update displays
        this.hoursDisplay.textContent = hours;
        this.rateDisplay.textContent = `$${rate}`;

        // --- BARDZIEJ REALISTYCZNE WYLICZENIA ---
        
        // 1. Współczynnik efektywności (75%)
        // Zakładamy, że tylko 3/4 zaoszczędzonego czasu to czysty, bilingowy zysk
        const efficiencyRate = 0.75; 
        
        // 2. Realne miesiące pracy
        // Zakładamy 11.5 miesiąca w roku ze względu na urlopy, święta itp.
        const workingMonths = 11.5; 

        // Wyliczenie realnego zysku
        const realisticMonthlyRevenue = hours * rate * efficiencyRate;
        const annualRevenue = Math.floor(realisticMonthlyRevenue * workingMonths);

        // Update result with animation
        if (this.resultDisplay) {
            this.animateValue(this.resultDisplay, annualRevenue);
        }
    },

    animateValue(element, targetValue) {
        const startValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
            
            element.textContent = `$${currentValue.toLocaleString()}`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
};

// ========== 21. PERFORMANCE MONITOR ==========
const PerformanceMonitor = {
    init() {
        // Monitor Core Web Vitals
        this.monitorWebVitals();
        
        // Monitor memory usage
        this.monitorMemory();
        
        // Monitor FPS
        this.monitorFPS();
    },

    monitorWebVitals() {
        // LCP (Largest Contentful Paint)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.startTime < 10000) { // First 10 seconds
                    console.log('LCP:', entry.startTime);
                }
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        }).observe({ entryTypes: ['first-input'] });

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    console.log('CLS:', clsValue);
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });
    },

    monitorMemory() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                console.log('Memory Usage:', {
                    used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
                    total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
                });
            }, 30000); // Log every 30 seconds
        }
    },

    monitorFPS() {
        let lastTime = performance.now();
        let frames = 0;

        function countFrames() {
            frames++;
            const currentTime = performance.now();

            if (currentTime >= lastTime + 1000) {
                console.log('FPS:', frames);
                frames = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(countFrames);
        }

        requestAnimationFrame(countFrames);
    }
};

// ========== GLOBAL FUNCTIONS ==========

// Smooth scroll to element
window.smoothScrollTo = (element, offset = 0) => {
    if (element) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'auto' // <--- ZMIEŃ TUTAJ
        });
    }
};

// Check if element is in viewport
window.isInViewport = (element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Debounced resize handler
window.addEventListener('resize', utils.debounce(() => {
    // Trigger custom resize event
    window.dispatchEvent(new CustomEvent('optimizedResize'));
}, 250));

// ========== ERROR HANDLING ==========
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ========== PERFORMANCE MONITORING ==========
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// ========== END OF SCRIPT ==========
console.log('✅ Pylon Vision Enhanced Script Loaded Successfully');

// Export for debugging
window.PylonVision = {
    utils,
    MobileMenu,
    CookieBanner,
    NavbarScroll,
    ROICalculator,
    CourseLibrary,
    FAQ,
    Modals,
    Dashboard,
    PromoText,
    MegaMenu,
    EmailProtection,
    ScrollReveal,
    Constellation,
    Ticker,
    Countdown,
    TouchOptimizations,
    PerformanceMonitor
};

// Track Stripe checkout clicks
document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('a[href*="buy.stripe.com"]');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('User clicked checkout button!');
        });
    });
});

// ========== FUNKCJA: PŁYNNY SKOK Z UWZGLĘDNIENIEM GÓRNEGO MENU ==========
window.scrollToSpecificCourse = function(courseId) {
    
    // 1. ZAMYKAMY MENU
    const closeBtn = document.querySelector('.close-modal, .mega-close, .modal-close, [onclick*="close"]');
    if (closeBtn) closeBtn.click();
    else document.body.click(); 

    const megaContainer = document.querySelector('.mega-menu-overlay, .mega-menu-wrapper');
    if (megaContainer) {
        megaContainer.style.display = 'none';
        setTimeout(() => { megaContainer.style.display = ''; }, 500);
    }

    // 2. CHWILA PRZERWY I PŁYNNY SCROLL
    setTimeout(() => {
        const allImages = document.querySelectorAll(`img[src*="image${courseId}.webp"]`);
        
        if (allImages.length > 0) {
            const courseImage = allImages[allImages.length - 1];
            const courseCard = courseImage.closest('div[class*="card"]') || courseImage.parentElement.parentElement;
            
            // --- KLUCZOWA ZMIANA: OBLICZAMY IDEALNĄ POZYCJĘ ---
            // Wartość 130 to przybliżona wysokość Twojego górnego menu + odrobina estetycznego marginesu.
            // Jeśli kafelek będzie za wysoko/nisko, po prostu zmień 130 na np. 110 lub 150.
            const headerOffset = 130; 
            const elementPosition = courseCard.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            // Gładki, osadzony scroll
            window.scrollTo({
                top: offsetPosition,
                behavior: 'auto'
            });
            
            // --- EFEKT PODŚWIETLENIA ---
            const originalShadow = courseCard.style.boxShadow;
            const originalTransition = courseCard.style.transition;
            
            courseCard.style.transition = 'box-shadow 0.4s ease-in-out';
            courseCard.style.boxShadow = '0 0 0 2px #8B5CF6, 0 0 35px rgba(139, 92, 246, 0.4)'; 
            
            // Wydłużony czas podświetlenia (2 sekundy), żeby po płynnym zjechaniu nadal było je widać
            setTimeout(() => {
                courseCard.style.boxShadow = originalShadow;
                courseCard.style.transition = originalTransition;
            }, 2000); 
            
        } else {
            if(typeof window.scrollToLibrary === 'function') {
                window.scrollToLibrary();
            }
        }
    }, 50); 
};