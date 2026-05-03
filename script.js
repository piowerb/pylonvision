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
        if (window.location.hash) {
            history.replaceState("", document.title, window.location.pathname + window.location.search);
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
    ProofPulse.init();
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
    SubBanner.init();
    TouchOptimizations.init();
    PerformanceMonitor.init();
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
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
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
        
        // Restore body scroll
        document.body.style.overflow = '';
        
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

        if (!this.banner) return;

        // Show banner if not accepted
        if (!utils.storage.get('pylon_cookie_consent')) {
            setTimeout(() => {
                this.banner.classList.add('show');
            }, 2000);
        }

        // Accept cookies
        this.acceptBtn?.addEventListener('click', () => {
            utils.storage.set('pylon_cookie_consent', 'true');
            this.banner.classList.remove('show');
        });

        // Auto-hide after 10 seconds if not interacted
        setTimeout(() => {
            if (!utils.storage.get('pylon_cookie_consent')) {
                this.banner.classList.remove('show');
            }
        }, 10000);
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
        this.wrap = utils.query('.ticker-wrap');

        if (!this.ticker) return;

        // Clone items for infinite scroll
        const items = Array.from(this.ticker.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            this.ticker.appendChild(clone);
        });

        // Pause when off-screen (performance optimization)
        if (this.wrap && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    this.ticker.classList.toggle('paused', !entry.isIntersecting);
                });
            }, { threshold: 0 });

            observer.observe(this.wrap);
        }

        // Pause on hover (desktop only)
        if (!utils.isMobile()) {
            this.ticker.addEventListener('mouseenter', () => {
                this.ticker.classList.add('paused');
            });
            
            this.ticker.addEventListener('mouseleave', () => {
                this.ticker.classList.remove('paused');
            });
        }
    }
};

// ========== 8. COURSE LIBRARY MODULE ==========
const CourseLibrary = {
    courses: [
        { id: 1, title: "E-Commerce Mastery", category: "business", price: "$49", image: "images/image1.png", desc: "Start your dropshipping journey with a solid plan. We teach you how to set up your store, find reliable suppliers, and choose products with potential.", url: "#" },
        { id: 2, title: "Agency Architect", category: "business", price: "$99", image: "images/image2.png", desc: "Learn how to build organize and scale a marketing agency. We show you proven strategies to find clients and manage your projects.", url: "#" },
        { id: 3, title: "Copywriter Secrets", category: "business", price: "$29", image: "images/image3.png", desc: "Discover how to write texts that persuades people to buy easily. You will learn the psychology behind sales and how to present your offers effectively.", url: "#" },
        { id: 4, title: "Market Strategy", category: "trading", price: "$79", image: "images/image4.png", desc: "Learn the way of trading and technical analysis. We teach you how to read charts, manage risk, and think like a professional investor.", url: "#" },
        { id: 5, title: "Faceless Influencer", category: "social", price: "$39", image: "images/image5.png", desc: "Learn how to run a YouTube channel without showing your face. We explain how to choose the right topics and create content efficiently.", url: "#" },
        { id: 6, title: "Prime Dropshipping", category: "business", price: "$49", image: "images/image6.png", desc: "Learn how to sell on Amazon, the world's largest marketplace. We explain the FBA model and how to use Amazon's logistics.", url: "#" },
        { id: 7, title: "Deal Closing Expert", category: "business", price: "$99", image: "images/image7.png", desc: "Improve your sales skills and learn how to close deals over the phone. We provide you with scripts and frameworks used by professional salespeople.", url: "#" },
        { id: 8, title: "Insta Money", category: "social", price: "$19", image: "images/image8.png", desc: "Learn strategies to grow on Social Media and engage your followers. We show you how to build an audience and the different ways to monetize your page.", url: "#" },
        { id: 9, title: "The Founder Playbook", category: "business", price: "$197", image: "images/image9.png", desc: "Learn how to build a paid community around your brand. We guide you through the process of turning your knowledge into a subscription business.", url: "#" }
    ],

    stats: {
        1: { rating: 4.9, reviews: 28, oldPrice: 80, badgeType: 'USER_FAV' },
        2: { rating: "5.0", reviews: 7, oldPrice: 155, badgeType: 'ELITE_PICK' },
        3: { rating: 4.7, reviews: 14, oldPrice: 50, badgeType: 'NONE' },
        4: { rating: 4.8, reviews: 9, oldPrice: 125, badgeType: 'NONE' },
        5: { rating: 4.6, reviews: 32, oldPrice: 65, badgeType: 'TRENDING' },
        6: { rating: 4.8, reviews: 21, oldPrice: 80, badgeType: 'NONE' },
        7: { rating: 4.9, reviews: 5, oldPrice: 155, badgeType: 'TOP_RATED' },
        8: { rating: 4.7, reviews: 54, oldPrice: 36, badgeType: 'BESTSELLER' },
        9: { rating: "5.0", reviews: 3, oldPrice: 302, badgeType: 'ELITE_PICK' }
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

    setupFilters() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Don't trigger if already active
                if (btn.classList.contains('active')) return;
                
                // Update active state
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter courses
                this.filterCourses();
                
                // Close mobile menu if open
                if (window.MobileMenu && window.MobileMenu.isOpen) {
                    window.MobileMenu.close();
                }
            });
        });
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
            const stats = this.stats[course.id] || { rating: 4.5, reviews: 5, oldPrice: 100, badgeType: 'NONE' };
            const currentVal = parseInt(course.price.replace('$', ''));
            const discountPercent = Math.round(((stats.oldPrice - currentVal) / stats.oldPrice) * 100);

            const card = document.createElement('div');
            card.className = 'course-card';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
            card.style.opacity = '0';

            card.innerHTML = `
                <div class="card-image-wrapper">
                    ${this.getBadgeHTML(stats.badgeType)}
                    <img src="${course.image}" alt="${course.title}" class="card-image" loading="lazy">
                </div>
                <div class="card-content">
                    <h3 class="card-title" style="margin-bottom:5px; font-size: 1.25rem;">${course.title}</h3>
                    
                    <div style="font-size: 0.8rem; color: #FBBF24; margin-bottom: 12px; display: flex; align-items: center; gap: 5px;">
                        <div style="display:flex; gap:1px;">${this.getStarsHTML(stats.rating)}</div>
                        <span style="color: var(--text-muted); font-weight: 500; margin-left: 4px;">${stats.rating} (${stats.reviews} Ratings)</span>
                    </div>

                    <div style="font-size: 0.75rem; color: #10B981; margin-bottom: 10px; font-weight:700; display:flex; align-items:center; gap:6px;">
                        <i class="fa-solid fa-rotate" style="font-size: 0.8em;"></i> Updated for ${currentDate}
                    </div>

                    <p class="card-desc">${course.desc}</p>
                    
                    <div class="card-footer" style="display: flex; flex-direction: column; gap: 15px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                        
                        <div class="price-box" style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                                    <span class="old-price" style="text-decoration: line-through; color: #9CA3AF; opacity: 0.8;">$${stats.oldPrice}</span>
                                    <span style="background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.25); font-size: 0.75rem; font-weight: 700; padding: 1px 6px; border-radius: 4px;">-${discountPercent}%</span>
                                </div>
                                <span class="card-price" style="font-size: 1.5rem; font-weight: 700; color: #fff;">${course.price}</span>
                            </div>
                            
                            <div style="font-size: 0.65rem; color: #9CA3AF; margin-bottom: 6px; display:flex; align-items:center; gap:4px;">
                                <i class="fa-solid fa-shield-halved"></i> 30-Day Guarantee
                            </div>
                        </div>
                        
                        <div style="width: 100%; text-align: center;">
                            <a href="${course.url}" class="btn-card" style="display: block; width: 100%; text-align: center; padding: 12px 0;">Get Access</a>
                            
                            <span style="font-size: 0.65rem; color: #A78BFA; font-weight:600; display: block; margin-top: 8px;">
                                <i class="fa-solid fa-bolt"></i> Instant Access
                            </span>
                        </div>

                    </div>
                </div>
            `;
            this.grid.appendChild(card);
        });

        // Animate cards in
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

// ========== 9. PROOF PULSE MODULE ==========
const ProofPulse = {
    productActions: [
        { title: "E-Commerce Mastery", color: "#84CC16" },
        { title: "Agency Architect", color: "#3B82F6" },
        { title: "Copywriter Secrets", color: "#10B981" },
        { title: "Market Strategy", color: "#00FF9D" },
        { title: "Faceless Influencer", color: "#FF0000" },
        { title: "Prime Dropshipping", color: "#FF9900" },
        { title: "Deal Closing Expert", color: "#22D3EE" },
        { title: "Insta Money", color: "#D946EF" },
        { title: "The Founder Playbook", color: "#FACC15" }
    ],

    database: {
        anglo: { weight: 0.40, countries: ["United States", "United Kingdom", "Canada", "Australia", "New Zealand"], names: ["James", "Michael", "Robert", "John", "David", "Sarah", "Jessica"] },
        dach: { weight: 0.20, countries: ["Germany", "Austria", "Switzerland", "Netherlands"], names: ["Maximilian", "Alexander", "Paul", "Sophie", "Hannah"] },
        latin: { weight: 0.15, countries: ["France", "Italy", "Spain", "Portugal"], names: ["Gabriel", "Léo", "Sofia", "Giulia"] },
        nordic: { weight: 0.10, countries: ["Sweden", "Norway", "Denmark"], names: ["William", "Liam", "Alice"] },
        central: { weight: 0.10, countries: ["Poland", "Czech Republic"], names: ["Jakub", "Antoni", "Julia"] },
        global: { weight: 0.05, countries: ["Singapore", "Japan", "UAE"], names: ["Wei", "Hiroshi", "Ahmed"] }
    },

    init() {
        this.pulse = utils.getElement('proof-pulse');
        this.img = utils.getElement('proof-img');
        this.name = utils.getElement('proof-name');
        this.loc = utils.getElement('proof-loc');
        this.info = utils.query('.proof-info');

        if (!this.pulse || !this.img || !this.name || !this.loc || !this.info) return;

        // Don't show on mobile to save space
        if (utils.isMobile()) return;

        setTimeout(() => this.show(), 4500);
    },

    getWeightedRegion() {
        const rand = Math.random();
        let sum = 0;
        for (const key in this.database) {
            sum += this.database[key].weight;
            if (rand <= sum) return this.database[key];
        }
        return this.database.anglo;
    },

    getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    show() {
        try {
            const region = this.getWeightedRegion();
            const country = this.getRandomItem(region.countries);
            const firstName = this.getRandomItem(region.names);
            const lastInitial = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            const fullName = `${firstName} ${lastInitial}.`;
            const product = this.getRandomItem(this.productActions);
            const timeAgo = Math.random() > 0.8 ? "Just now" : Math.floor(Math.random() * 59) + 1 + "m ago";

            this.img.src = `https://ui-avatars.com/api/?name= ${encodeURIComponent(firstName)}+${lastInitial}&background=random&color=fff&rounded=true&size=128&bold=true&format=svg`;
            this.img.alt = `${fullName} avatar`;
            this.name.textContent = fullName;
            this.loc.textContent = country;

            const actionLine = this.info.querySelector('div:last-child');
            if (actionLine) {
                actionLine.innerHTML = `
                    <span style="color: #9CA3AF;">Purchased</span>
                    <span style="color:${product.color}; font-weight:700;">${product.title}</span> 
                    <span style="opacity:0.5; font-size: 0.75rem; margin-left: 6px;">
                        <i class="fa-regular fa-clock" style="font-size:0.7rem; margin-right:3px;"></i> ${timeAgo}
                    </span>
                `;
            }

            this.pulse.classList.add('visible');
            
            // Auto-hide after 6 seconds
            setTimeout(() => {
                this.pulse.classList.remove('visible');
                
                // Schedule next show
                const nextInterval = Math.random() * 16000 + 8000;
                setTimeout(() => this.show(), nextInterval);
            }, 6000);
        } catch (error) {
            console.error('ProofPulse error:', error);
        }
    }
};

// ========== 10. CONSTELLATION ANIMATION ==========
const Constellation = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,

    init() {
        this.canvas = utils.getElement('constellation-canvas');
        if (!this.canvas) return;

        // Don't run on mobile for performance
        if (utils.isMobile()) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();

        // Handle resize
        window.addEventListener('resize', utils.debounce(() => {
            this.resize();
            this.createParticles();
        }, 200));
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    createParticles() {
        this.particles = [];
        const particleCount = utils.isMobile() ? 15 : 40;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2
            });
        }
    },

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach((particle, i) => {
            // Update position
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

        // Animate log
        this.animateLog();
    },

    animateLog() {
        const logContainer = utils.getElement('dash-log-lines');
        if (!logContainer) return;

        logContainer.innerHTML = '';
        const logLines = [
            "System initialized...",
            "Deployment successful.",
            "72 Active automations verified.",
            "Syncing Shopify API...",
            "144 Hours recovered this month."
        ];

        let lineIdx = 0;
        const addLog = () => {
            if (lineIdx < logLines.length) {
                const div = document.createElement('div');
                div.className = 'log-line';
                div.textContent = "> " + logLines[lineIdx];
                logContainer.appendChild(div);
                
                // Scroll to bottom
                logContainer.scrollTop = logContainer.scrollHeight;
                
                lineIdx++;
                setTimeout(addLog, 800);
            }
        };

        setTimeout(addLog, 1000);
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
        // Login/Signup modals
        window.openLoginModal = () => this.open('login-modal');
        window.closeLoginModal = () => this.close('login-modal');
        window.closeSignupModal = () => this.close('signup-modal');

        window.switchToSignup = () => {
            this.close('login-modal');
            this.open('signup-modal');
        };

        window.switchToLogin = () => {
            this.close('signup-modal');
            this.open('login-modal');
        };

        // Generic modals
        const modalIds = [
            'privacy-modal', 
            'terms-modal', 
            'about-modal', 
            'story-modal', 
            'roadmap-modal'
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
            `🔥 NEW YEAR PROMO: 30% OFF – Ends at 11:59 Tonight! 💸`,
            `🚀 FEBRUARY BOOST: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
            `💎 MARCH GROWTH: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
            `⚡ SPRING SALE: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
            `🛠️ MAY UPGRADE: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
            `☀️ SUMMER DEALS: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
            `🚀 JULY SPECIAL: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
            `🔥 AUGUST FINALE: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
            `💼 SEPTEMBER START: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
            `🎃 HALLOWEEN PROMO: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
            `⚫ BLACK FRIDAY DEALS: 30%+ OFF – Ends at 11:59 Tonight! 💸`,
            `🎄 XMAS PROTOCOL: 30%+ OFF – Ends at 11:59 Tonight! 💸`
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
            { title: "Ecom", img: "images/image1.png" },
            { title: "Agency", img: "images/image2.png" },
            { title: "Dropship", img: "images/image6.png" },
            { title: "Closing", img: "images/image7.png" },
            { title: "Founder", img: "images/image9.png" },
            { title: "YouTube", img: "images/image5.png" },
            { title: "Trading", img: "images/image4.png" },
            { title: "Copy", img: "images/image3.png" },
            { title: "Social", img: "images/image8.png" }
        ];

        this.grid.innerHTML = courses.map(c => `
            <div class="mega-item" onclick="window.scrollToLibrary()">
                <div class="mega-img-wrap"><img src="${c.img}" alt="${c.title}" loading="lazy"></div>
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
            
            // Scroll to library
            const lib = utils.getElement('library');
            if (lib) {
                lib.scrollIntoView({ behavior: 'smooth' });
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
        const dateElements = utils.queryAll('.effective-date');
        if (dateElements.length === 0) return;

        try {
            const now = new Date();
            const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
            const finalDate = new Date(now.getFullYear(), quarterMonth, 1);
            const formatted = finalDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            dateElements.forEach(el => {
                el.textContent = `Last Updated: ${formatted}`;
                el.style.color = '#10B981';
                el.style.fontWeight = '600';
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

        // Calculate annual revenue
        const monthlyRevenue = hours * rate;
        const annualRevenue = monthlyRevenue * 12;

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
            behavior: 'smooth'
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
    ProofPulse,
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
    SubBanner,
    TouchOptimizations,
    PerformanceMonitor
};