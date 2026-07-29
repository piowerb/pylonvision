/* ============================================================
   PYLON VISION - Rozszerzony JavaScript
   Funkcjonalność responsywna Mobile-First
   Wersja: 2.0.0
============================================================ */

// ========== 1. FUNKCJE POMOCNICZE (UTILITY) ==========
const utils = {
    // Bezpieczne pobieranie elementu po ID z obsługą błędów
    getElement: (id) => {
        try {
            return document.getElementById(id);
        } catch (error) {
            console.warn(`Nie znaleziono elementu o id "${id}"`);
            return null;
        }
    },

    // Bezpieczne zapytanie (query selector)
    query: (selector) => {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Nieprawidłowy selektor "${selector}"`);
            return null;
        }
    },

    // Bezpieczne zapytanie o wszystkie elementy
    queryAll: (selector) => {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn(`Nieprawidłowy selektor "${selector}"`);
            return [];
        }
    },

    // Funkcja debounce dla optymalizacji wydajności
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

    // Funkcja throttle dla zdarzeń przewijania
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

    // Bezpieczny local storage
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

    // Sprawdzanie, czy urządzenie jest mobilne
    isMobile: () => {
        return window.innerWidth <= 768;
    },

    // Sprawdzanie, czy urządzenie to tablet
    isTablet: () => {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },

    // Sprawdzanie, czy urządzenie to desktop
    isDesktop: () => {
        return window.innerWidth > 1024;
    },

    // Sprawdzanie, czy urządzenie obsługuje dotyk
    isTouch: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

// ========== 2. WSTĘPNA INICJALIZACJA ==========
document.addEventListener('DOMContentLoaded', () => {
    // Wymuszenie przewinięcia na samą górę po załadowaniu strony
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
        console.error('Błąd inicjalizacji przewijania:', error);
    }

    // Dynamiczna aktualizacja roku
    const currentYear = new Date().getFullYear();
    ['current-year', 'year', 'badge-year'].forEach(id => {
        const el = utils.getElement(id);
        if (el) el.textContent = currentYear;
    });

    // Inicjalizacja wszystkich modułów
    MobileMenu.init();
    CookieBanner.init();
    NavbarScroll.init();
    // ProofPulse.init();
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
    // SubBanner.init();
    TouchOptimizations.init();
});

// ========== 3. MODUŁ MENU MOBILNEGO ==========
const MobileMenu = {
    isOpen: false,
    init() {
        this.btn = utils.query('.mobile-menu-btn');
        this.menu = utils.query('.nav-links-mobile');
        if (!this.btn || !this.menu) return;

        // Przełączanie menu
        this.btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // Zamknięcie po kliknięciu linku (z wyjątkiem Akademii)
        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Nie zamykaj, jeśli to przycisk "Akademia"
                if (link.id === 'academy-trigger-mobile') {
                    return;
                }
                // Zamknij menu dla innych linków
                this.close();
            });
        });

        // Zamknięcie po kliknięciu poza menu
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.menu.contains(e.target) && 
                !this.btn.contains(e.target) &&
                !e.target.closest('.mega-menu')) {
                this.close();
            }
        });

        // Zamknięcie klawiszem Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Obsługa zmiany rozmiaru okna
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
        // Zablokuj przewijanie tła
        document.body.style.overflow = 'hidden';
        // Dodaj przyciemnienie tła
        this.addBackdrop();
        // Skupienie (focus) na pierwszym linku ze względów dostępności
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
        // Przywróć przewijanie tła
        document.body.style.overflow = '';
        // Usuń przyciemnienie
        this.removeBackdrop();
        // Zamknij również mega menu, jeśli jest otwarte
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
        // Animacja wejścia
        requestAnimationFrame(() => {
            backdrop.style.opacity = '1';
        });
        // Zamykanie po kliknięciu na tło
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

// ========== 4. MODUŁ BANERA CIASTECZEK (COOKIE) ==========
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

// ========== 5. PRZEWIJANIE NAVBARU I PASEK POSTĘPU ==========
const NavbarScroll = {
    init() {
        this.navbar = utils.query('.navbar');
        this.progress = utils.getElement('scroll-progress');
        if (!this.navbar) return;

        const handleScroll = utils.throttle(() => {
            const scrollPos = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Aktualizacja paska postępu
            if (this.progress && totalHeight > 0) {
                const percent = Math.min((scrollPos / totalHeight * 100), 100);
                this.progress.style.width = `${percent}%`;
            }

            // Dodawanie klasy przewijania do menu nawigacji
            this.navbar.classList.toggle('scrolled', scrollPos > 50);
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Wywołanie początkowe
        handleScroll();
    }
};

// ========== 6. BANER SUBSKRYPCJI W 3D ==========
const SubBanner = {
    init() {
        this.banner = utils.getElement('subscription-hero');
        if (!this.banner) return;

        // Brak inicjalizacji na urządzeniach mobilnych ze względów wydajnościowych
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

// ========== 7. NIESKOŃCZONY TICKER ==========
const Ticker = {
    init() {
        this.ticker = utils.getElement('logoTicker');
        if (!this.ticker) return;

        // Klonowanie elementów dla płynnego przewijania w pętli
        // Dzięki temu mamy dwa zestawy ikon – klucz do płynnego przejścia
        const items = Array.from(this.ticker.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            this.ticker.appendChild(clone);
        });
        // Usunięto IntersectionObserver i nasłuchiwacze eventów (mouseenter/leave)
        // Dzięki temu ticker nigdy się nie zatrzyma, co eliminuje szarpnięcia
    }
};

// ========== 8. MODUŁ BIBLIOTEKI KURSÓW ==========
const CourseLibrary = {
    courses: [
        { id: 1, title: "Opanowanie E-Commerce", category: "business", price: "$49", image: "images/image1.webp", desc: "Rozpocznij swoją przygodę z dropshippingiem z solidnym planem. Uczymy, jak założyć sklep, znaleźć sprawdzonych dostawców i wybierać produkty z potencjałem.", url: "#" },
        { id: 2, title: "Architekt Agencji", category: "business", price: "$99", image: "images/image2.webp", desc: "Dowiedz się, jak zbudować, zorganizować i skalować agencję marketingową. Pokazujemy sprawdzone strategie pozyskiwania klientów i zarządzania projektami.", url: "#" },
        { id: 3, title: "Sekrety AI Automatyzacji", category: "business", price: "$29", image: "images/image3.webp", desc: "Odkryj, jak zautomatyzować swój biznes za pomocą sztucznej inteligencji. Dowiedz się, jak wdrożyć systemy, agentów AI i usprawnić codzienne procesy.", url: "#" },
        { id: 4, title: "Strategia Rynkowa", category: "trading", price: "$79", image: "images/image4.webp", desc: "Poznaj tajniki inwestowania i analizy finansowej. Uczymy, jak czytać wykresy, zarządzać ryzykiem i myśleć jak profesjonalny inwestor.", url: "#" },
        { id: 5, title: "Influencer bez Twarzy", category: "social", price: "$39", image: "images/image5.webp", desc: "Dowiedz się, jak prowadzić kanał na YouTube bez pokazywania twarzy. Wyjaśniamy, jak wybierać odpowiednie tematy i skutecznie tworzyć treści.", url: "#" },
        { id: 6, title: "Twój Dropshipping", category: "business", price: "$49", image: "images/image6.webp", desc: "Dowiedz się, od czego zacząć, jak zaimplementować procesy i skutecznie sprzedawać na największych platformach handlowych, takich jak Amazon czy Allegro.", url: "#" },
        { id: 7, title: "Ekspert Sprzedaży", category: "business", price: "$99", image: "images/image7.webp", desc: "Popraw swoje umiejętności sprzedażowe i naucz się zamykać transakcje. Dostarczamy skrypty i ramy używane przez profesjonalnych przedsiębiorców.", url: "#" },
        { id: 8, title: "Insta Zyski", category: "social", price: "$19", image: "images/image8.webp", desc: "Poznaj strategie rozwoju w mediach społecznościowych i angażowania obserwatorów. Pokazujemy, jak zbudować publiczność i różne sposoby monetyzacji profilu.", url: "#" },
        { id: 9, title: "Poradnik Założyciela", category: "business", price: "$197", image: "images/image9.webp", desc: "Dowiedz się, jak zbudować płatną społeczność wokół swojej marki. Przeprowadzimy Cię przez proces zamiany Twojej wiedzy w biznes oparty na subskrypcjach.", url: "#" }
    ],

    stats: {
        1: { rating: 4.9, reviews: 84, badgeType: 'BESTSELLER' }, // Najwięcej opinii = bezdyskusyjny Bestseller
        2: { rating: 4.8, reviews: 34, badgeType: 'NONE' },
        3: { rating: 4.8, reviews: 22, badgeType: 'NONE' },
        4: { rating: 4.7, reviews: 18, badgeType: 'NONE' },
        5: { rating: 4.8, reviews: 56, badgeType: 'TRENDING' }, // Dużo opinii, bo jest "na fali"
        6: { rating: 4.8, reviews: 21, badgeType: 'NONE' },
        7: { rating: 4.9, reviews: 12, badgeType: 'NONE' },
        8: { rating: 4.7, reviews: 45, badgeType: 'NONE' }, // Bardzo solidny wynik, ale nie Bestseller
        9: { rating: 4.9, reviews: 8, badgeType: 'ELITE_PICK' } // Elitarny produkt = mało opinii, wysoka ocena
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
                // Nie uruchamiaj, jeśli już jest aktywne
                if (btn.classList.contains('active')) return;
                // Aktualizacja aktywnego stanu
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // Filtruj kursy
                this.filterCourses();
                // Zamknij mobilne menu, jeśli jest otwarte
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
        // Wyczyść wyszukiwanie klawiszem Escape
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
        // Wyczyść aktualną treść
        this.grid.innerHTML = '';
        // Wyświetl wiadomość o braku wyników, jeśli pusto
        if (data.length === 0) {
            this.grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3>Nie znaleziono kursów</h3>
                    <p>Spróbuj dostosować kryteria wyszukiwania lub filtrowania</p>
                </div>
            `;
            return;
        }

        const currentDate = new Date().toLocaleString('pl-PL', { month: 'long', year: 'numeric' });

        data.forEach((course, index) => {
            // 1. Pobieramy statystyki dla danego ID
            const stats = this.stats[course.id] || { rating: 4.5, reviews: 0, oldPrice: 0, badgeType: 'NONE' };
            // 2. Generujemy HTML dla badge'a i gwiazdek za pomocą Twoich funkcji pomocniczych
            const badgeHtml = this.getBadgeHTML(stats.badgeType);
            const starsHtml = this.getStarsHTML(stats.rating);

            const card = document.createElement('a');
            card.href = "https://buy.stripe.com/dRmbJ26YVf8P0kHh2rgfu01"; 
            card.className = 'course-card';
            card.style.opacity = '0';
            card.style.textDecoration = 'none'; 
            card.style.color = 'inherit';

            card.innerHTML = `
                ${badgeHtml} 
                <div class="card-image-wrapper">
                    <img src="${course.image}" alt="${course.title}" width="340" height="240" class="card-image" loading="lazy">
                </div>
                <div class="card-content">
                    <h3 class="card-title" style="margin-bottom:5px; font-size: 1.25rem;">${course.title}</h3>
                    <div style="font-size: 0.8rem; color: #FBBF24; margin-bottom: 12px; display: flex; align-items: center; gap: 5px;">
                        <div style="display:flex; gap:2px;">
                            ${starsHtml}
                        </div>
                        <span style="color: var(--text-muted); font-weight: 600; margin-left: 4px;">
                            ${stats.rating} (${stats.reviews} Ocen)
                        </span>
                    </div>

                    <div style="font-size: 0.75rem; color: #10B981; margin-bottom: 10px; font-weight:700; display:flex; align-items:center; gap:6px;">
                        <i class="fa-solid fa-rotate" style="font-size: 0.8em;"></i> Zaktualizowano: ${currentDate}
                    </div>

                    <p class="card-desc">${course.desc}</p>
                    <div class="card-footer" style="padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.05); width: 100%;">
                        <div class="btn-card" style="display: block; width: 100%; text-align: center; padding: 12px 0;">Zyskaj Dostęp</div>
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
            'USER_FAV': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #e5e7eb 0%, #9ca3af 50%, #d1d5db 100%); color: #111827;"><i class="fa-solid fa-gem" style="margin-right: 4px;"></i> LIMITOWANY DROP</div>',
            'BESTSELLER': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%); text-shadow: 0 1px 2px rgba(0,0,0,0.3);"><i class="fa-solid fa-crown"></i> Bestseller</div>',
            'ELITE_PICK': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #8B5CF6, #D946EF);"><i class="fa-solid fa-crown"></i> Wybór Elity</div>',
            'TRENDING': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #10B981, #059669);"><i class="fa-solid fa-arrow-trend-up"></i> Na Fali</div>',
            'TOP_RATED': '<div class="bestseller-ribbon" style="background: linear-gradient(135deg, #6366f1, #4f46e5);"><i class="fa-solid fa-star"></i> Najwyżej Oceniane</div>'
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

// ========== 9. MODUŁ PROOF PULSE ==========
const ProofPulse = {
    productActions: [
        { title: "Opanowanie E-Commerce", color: "#84CC16" },
        { title: "Architekt Agencji", color: "#3B82F6" },
        { title: "Sekrety AI Automatyzacji", color: "#10B981" },
        { title: "Strategia Rynkowa", color: "#00FF9D" },
        { title: "Influencer bez Twarzy", color: "#FF0000" },
        { title: "Twój Dropshipping", color: "#FF9900" },
        { title: "Ekspert Sprzedaży", color: "#22D3EE" },
        { title: "Insta Zyski", color: "#D946EF" },
        { title: "Poradnik Założyciela", color: "#FACC15" }
    ],

    database: {
        anglo: { weight: 0.40, countries: ["Stany Zjednoczone", "Wielka Brytania", "Kanada", "Australia", "Nowa Zelandia"], names: ["James", "Michael", "Robert", "John", "David", "Sarah", "Jessica"] },
        dach: { weight: 0.20, countries: ["Niemcy", "Austria", "Szwajcaria", "Holandia"], names: ["Maximilian", "Alexander", "Paul", "Sophie", "Hannah"] },
        latin: { weight: 0.15, countries: ["Francja", "Włochy", "Hiszpania", "Portugalia"], names: ["Gabriel", "Léo", "Sofia", "Giulia"] },
        nordic: { weight: 0.10, countries: ["Szwecja", "Norwegia", "Dania"], names: ["William", "Liam", "Alice"] },
        central: { weight: 0.10, countries: ["Polska", "Czechy"], names: ["Jakub", "Antoni", "Julia"] },
        global: { weight: 0.05, countries: ["Singapur", "Japonia", "Zjednoczone Emiraty Arabskie"], names: ["Wei", "Hiroshi", "Ahmed"] }
    },

    init() {
        this.pulse = utils.getElement('proof-pulse');
        this.img = utils.getElement('proof-img');
        this.name = utils.getElement('proof-name');
        this.loc = utils.getElement('proof-loc');
        this.info = utils.query('.proof-info');

        if (!this.pulse || !this.img || !this.name || !this.loc || !this.info) return;

        // Nie pokazuj na urządzeniach mobilnych, aby zaoszczędzić miejsce
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
            const timeAgo = Math.random() > 0.8 ? "Przed chwilą" : Math.floor(Math.random() * 59) + 1 + " min temu";

            this.img.src = `https://ui-avatars.com/api/?name= ${encodeURIComponent(firstName)}+${lastInitial}&background=random&color=fff&rounded=true&size=128&bold=true&format=svg`;
            this.img.alt = `${fullName} awatar`;
            this.name.textContent = fullName;
            this.loc.textContent = country;

            const actionLine = this.info.querySelector('div:last-child');
            if (actionLine) {
                actionLine.innerHTML = `
                    <span style="color: #9CA3AF;">Zakupiono</span>
                    <span style="color:${product.color}; font-weight:700;">${product.title}</span> 
                    <span style="opacity:0.5; font-size: 0.75rem; margin-left: 6px;">
                        <i class="fa-regular fa-clock" style="font-size:0.7rem; margin-right:3px;"></i> ${timeAgo}
                    </span>
                `;
            }

            this.pulse.classList.add('visible');
            // Autoukrywanie po 6 sekundach
            setTimeout(() => {
                this.pulse.classList.remove('visible');
                // Zaplanuj kolejne pokazanie
                const nextInterval = Math.random() * 16000 + 8000;
                setTimeout(() => this.show(), nextInterval);
            }, 6000);
        } catch (error) {
            console.error('Błąd ProofPulse:', error);
        }
    }
};

// ========== 10. ANIMACJA KONSTELACJI ==========
const Constellation = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,

    init() {
        this.canvas = utils.getElement('constellation-canvas');
        if (!this.canvas) return;

        // Nie uruchamiaj na urządzeniach mobilnych ze względów wydajnościowych
        if (utils.isMobile()) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();

        // Obsługa zmiany rozmiaru
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

        // Aktualizacja i rysowanie cząsteczek
        this.particles.forEach((particle, i) => {
            // Aktualizacja pozycji
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Odbicia od krawędzi
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Rysowanie cząsteczki
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.fill();

            // Rysowanie połączeń
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

// ========== 11. ANIMACJA DASHBOARDU ==========
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

            // Stopniowe wywoływanie animacji
            setTimeout(() => requestAnimationFrame(step), stats.indexOf(stat) * 200);
        });
    }
};

// ========== 12. MODUŁ FAQ ==========
const FAQ = {
    init() {
        this.questions = utils.queryAll('.faq-question');
        if (this.questions.length === 0) return;

        this.questions.forEach(question => {
            question.addEventListener('click', () => {
                this.toggle(question);
            });
            // Obsługa nawigacji za pomocą klawiatury
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

        // Zamknij wszystkie pozostałe pytania
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

        // Przełącz bieżące pytanie
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

// ========== 13. ODLICZANIE CZASU (COUNTDOWN) ==========
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
                console.error('Błąd licznika:', error);
            }
        };

        setInterval(update, 1000);
        update();
    }
};

// ========== 14. EFEKT UJAWNIANIA PRZY PRZEWIJANIU (SCROLL REVEAL) ==========
const ScrollReveal = {
    init() {
        // Intersection Observer do animacji powolnego odsłaniania
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

        // Obserwuj wszystkie elementy, które mają się ujawnić
        utils.queryAll('.reveal').forEach(el => observer.observe(el));

        // Efekt myszy dla kart bento (tylko na komputerach desktop)
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

// ========== 15. MODUŁ MODALI ==========
const Modals = {
    activeModal: null,
    init() {
        // Generyczne modale
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

        // Zamykanie po kliknięciu na tło
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.close(e.target.id);
            }
        });

        // Zamykanie przy użyciu klawisza Escape
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
        // Ustawienie ostrości (focus) na pierwszym dostępnym do kliknięcia elemencie
        const firstFocusable = modal.querySelector('button, input, a, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
    },

close(id) {
        const modal = utils.getElement(id);
        if (!modal) return;

        // DODANE: Integracja z główną funkcją naprawiającą scrollowanie (z pliku index.html)
        // Jeśli ta funkcja istnieje, przejmuje całkowicie zamykanie i odblokowuje ekran.
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
        // Przywróć swobodne przewijanie, jeżeli nie są otwarte żadne inne modale
        const openModals = utils.queryAll('.modal-overlay[style*="flex"]');
        if (openModals.length === 0) {
            document.body.style.overflow = '';
        }
    }
};

// ========== 16. MODUŁ TEKSTU PROMOCYJNEGO ==========
const PromoText = {
    init() {
        this.promoEl = utils.getElement('promo-text');
        if (!this.promoEl) return;

        const month = new Date().getMonth();

        const promos = [
            `NOWOROCZNA PROMOCJA: -30% – Kończy się o 23:59`,
            `LUTOWE DOŁADOWANIE: -30% – Kończy się o 23:59`,
            `MARCOWY WZROST: -30% – Kończy się o 23:59`,
            `WIOSENNA WYPRZEDAŻ: -30% – Kończy się o 23:59`,
            `MAJOWY UPGRADE: -30% – Kończy się o 23:59`,
            `LETNIE OKAZJE: -30% – Kończy się o 23:59`,
            `LIPCOWA OFERTA: -30% – Kończy się o 23:59`,
            `SIERPNIOWY FINAŁ: -30% – Kończy się o 23:59`,
            `WRZEŚNIOWY START: -30% – Kończy się o 23:59`,
            `PROMOCJA HALLOWEEN: -30% – Kończy się o 23:59`,
            `BLACK FRIDAY: -30% – Kończy się o 23:59`,
            `ŚWIĄTECZNY PROTOKÓŁ: -30% – Kończy się o 23:59`
        ];

        this.promoEl.textContent = promos[month];
    }
};

// ========== 17. MODUŁ MEGA MENU ==========
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
            { title: "E-com", img: "images/image1.webp" },
            { title: "Agencja", img: "images/image2.webp" },
            { title: "Dropship", img: "images/image6.webp" },
            { title: "Sprzedaż", img: "images/image7.webp" },
            { title: "Społeczność", img: "images/image9.webp" },
            { title: "YouTube", img: "images/image5.webp" },
            { title: "Inwestor", img: "images/image4.webp" },
            { title: "Auto AI", img: "images/image3.webp" },
            { title: "Instagram", img: "images/image8.webp" }
        ];

        this.grid.innerHTML = courses.map(c => `
            <div class="mega-item" onclick="window.scrollToLibrary()">
                <div class="mega-img-wrap"><img src="${c.img}" alt="${c.title}" width="180" height="106" loading="lazy"></div>
                <span>${c.title}</span>
            </div>
        `).join('');
    },

    setupEvents() {
        // Wyzwalacz na wersji Desktop
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // Wyzwalacz mobilny
        if (this.triggerMobile) {
            this.triggerMobile.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            });
        }

        // Przycisk zamykania
        this.closeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });

        // Kliknięcie tła
        this.overlay?.addEventListener('click', () => this.close());

        // Kliknięcie poza menu
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

        // Klawisz Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Obsługa zmiany rozmiaru okna
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
                    behavior: 'smooth'
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
        // Animacja wejścia
        setTimeout(() => {
            this.menu.classList.add('show');
        }, 10);
        // Aktualizacja stanów wyzwalaczy
        this.trigger.classList.add('active');
        if (this.triggerMobile) {
            this.triggerMobile.classList.add('active');
        }
    },

    close() {
        this.isOpen = false;
        this.menu.classList.remove('show');
        this.overlay?.classList.remove('show');
        // Aktualizacja stanów wyzwalaczy
        this.trigger.classList.remove('active');
        if (this.triggerMobile) {
            this.triggerMobile.classList.remove('active');
        }
        // Ukryj element po animacji
        setTimeout(() => {
            if (!this.menu.classList.contains('show')) {
                this.menu.style.display = 'none';
            }
        }, 400);
    }
};

// ========== 18. MODUŁ OCHRONY E-MAILI ==========
const EmailProtection = {
    init() {
        const user = 'contact';
        const domain = 'pylonvision.com';

        // E-mail w stopce
        const link = utils.getElement('contact-link');
        const text = utils.getElement('contact-text');
        if (link && text) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `mailto:${user}@${domain}`;
            });
            text.textContent = `${user}@${domain}`;
        }

        // E-mail w modalu
        const modalLink = utils.getElement('modal-contact-link');
        const modalText = utils.getElement('modal-contact-text');
        if (modalLink && modalText) {
            modalText.textContent = `${user}@${domain}`;
            modalLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `mailto:${user}@${domain}`;
            });
        }

        // Zabezpieczenia ogólne adresów e-mail
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

        // Ochrona e-maili w zwykłym tekście
        utils.queryAll('.protected-email').forEach(el => {
            try {
                const email = el.textContent.replace(' [at] ', '@');
                if (email.includes('@')) {
                    el.innerHTML = `<a href="mailto:${email}" style="color: inherit; text-decoration: none;" onclick="this.style.textDecoration='underline'" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${email}</a>`;
                }
            } catch (error) {
                console.error('Błąd ochrony poczty elektronicznej:', error);
            }
        });

        // Aktualizacja odpowiednich dat
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

            const formatted = finalDate.toLocaleDateString('pl-PL', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            dateElements.forEach(el => {
                el.textContent = formatted;
            });
        } catch (error) {
            console.error('Błąd przy aktualizowaniu dat:', error);
        }
    }
};

// ========== 19. OPTYMALIZACJE DLA DOTYKU ==========
const TouchOptimizations = {
    init() {
        // Dodaj klasy dotykowe, jeżeli wspierane, do targetowania w CSS
        if (utils.isTouch()) {
            document.body.classList.add('touch-device');
        }
        // Zoptymalizuj stany wskazywania (hover)
        this.optimizeHovers();
        // Zastosuj informację zwrotną po dotknięciu (Touch feedback)
        this.addTouchFeedback();
        // Zapobiegaj przybliżaniu ekranu podwójnym dotknięciem w systemach iOS
        this.preventDoubleTapZoom();
        // Zoptymalizuj wydajność przy przewijaniu
        this.optimizeScroll();
    },
    optimizeHovers() {
        // Usuwanie efektów najechania myszką (hover) na ekranach dotykowych
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
        // Dodawanie aktywnego statusu dla naciskanych elementów
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
        // Dodaj nasłuchiwacze w trybie pasywnym do ulepszenia wydajności przewijania
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
        this.rateDisplay.textContent = `${rate} PLN`;

        // --- BARDZIEJ REALISTYCZNE WYLICZENIA ---
        
        // 1. Współczynnik efektywności (75%)
        const efficiencyRate = 0.75; 
        
        // 2. Realne miesiące pracy
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
            
            // Usunięto " PLN" obok liczby, teraz wyświetla się sam czysty, sformatowany wynik
            element.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
};

// ========== FUNKCJE GLOBALNE ==========

// Płynne przewijanie do wskazanego elementu
window.smoothScrollTo = (element, offset = 0) => {
    if (element) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
};

// Sprawdzanie, czy element znajduje się w obrębie widoku
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

// Funkcja przechwycenia zmiany rozmiaru ekranu za pomocą debounce
window.addEventListener('resize', utils.debounce(() => {
    // Aktywuj niestandardowe wydarzenie "optimizedResize"
    window.dispatchEvent(new CustomEvent('optimizedResize'));
}, 250));

// ========== OBSŁUGA BŁĘDÓW ==========
window.addEventListener('error', (e) => {
    console.error('Błąd języka JavaScript:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Nieobsłużone odrzucenie obietnicy (Promise):', e.reason);
});

// ========== MONITOROWANIE CZASU ŁADOWANIA STRONY ==========
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Czas ładowania strony:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// ========== KONIEC SKRYPTU ==========
console.log('✅ Rozszerzony Skrypt Pylon Vision Załadowany Pomyślnie');

// Wyeksportowanie dla procesów debagowania
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
    TouchOptimizations
};

// Śledzenie kliknięć w przyciski zakupu Stripe
document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('a[href*="buy.stripe.com"]');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Użytkownik kliknął przycisk zakupu!');
            // Jeśli używasz Google Analytics, możesz dodać tutaj:
            // gtag('event', 'click_checkout', {'event_category': 'conversion'});
        });
    });
});