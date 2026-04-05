document.addEventListener('DOMContentLoaded', () => {
            // Navbar Scroll
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 60) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // Mobile Menu Toggle
            const hamburger = document.getElementById('hamburger');
            const mobileMenu = document.getElementById('mobileMenu');
            const menuLinks = document.querySelectorAll('.menu-link');

            hamburger.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                });
            });

            // Product Filtering
            const filterBtns = document.querySelectorAll('.filter-btn');
            const products = document.querySelectorAll('.product-card');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active state
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filter = btn.dataset.filter;
                    
                    products.forEach(product => {
                        product.style.opacity = '0';
                        setTimeout(() => {
                            if (filter === 'all' || product.dataset.category === filter) {
                                product.style.display = 'block';
                                setTimeout(() => product.style.opacity = '1', 50);
                            } else {
                                product.style.display = 'none';
                            }
                        }, 300);
                    });
                });
            });

            // Lightbox Modal
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightboxImg');
            const lightboxClose = document.getElementById('lightboxClose');
            const productImgWraps = document.querySelectorAll('.product-img-wrap');

            productImgWraps.forEach(wrap => {
                wrap.addEventListener('click', () => {
                    const hiResUrl = wrap.dataset.hires;
                    lightboxImg.src = hiResUrl;
                    lightbox.classList.add('active');
                });
            });

            const closeLightbox = () => {
                lightbox.classList.remove('active');
                setTimeout(() => lightboxImg.src = '', 300); // clear after fade
            };

            lightboxClose.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    closeLightbox();
                }
            });

            // Testimonial Infinite Marquee
            const testiGrid = document.querySelector('.testi-grid');
            if (testiGrid) {
                const cards = Array.from(testiGrid.children);
                // Duplicate twice for seamless -33.33% animation (3 sets total)
                for (let i = 0; i < 2; i++) {
                    cards.forEach(card => {
                        const clone = card.cloneNode(true);
                        clone.setAttribute('aria-hidden', 'true');
                        testiGrid.appendChild(clone);
                    });
                }
            }

            // Scroll Reveal Animation (Intersection Observer)
            const revealElements = document.querySelectorAll('.reveal');
            
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target); // Reveal only once
                    }
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -50px 0px'
            });

            revealElements.forEach(el => revealObserver.observe(el));
        });