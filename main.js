// Samudra-I Main JavaScript
class SamudraApp {
    constructor() {
        this.showLoadingState();
        this.init();
    }

    showLoadingState() {
        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-indicator';
        loadingDiv.className = 'fixed inset-0 bg-soft-cream flex items-center justify-center z-50';
        loadingDiv.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 border-4 border-copper-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-warm-stone font-medium">Loading Samudra-I...</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
        
        // Remove loading indicator after a short delay
        setTimeout(() => {
            const loading = document.getElementById('loading-indicator');
            if (loading) {
                loading.remove();
            }
        }, 1500);
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounters();
        this.setupChatInterface();
        this.setupP5Background();
        this.setupTemperatureChart();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        // Observe all reveal elements
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });

        // Animate feature cards on scroll
        const cards = document.querySelectorAll('.card-hover');
        cards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    scale: 1.02,
                    rotateX: 5,
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });

            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    scale: 1,
                    rotateX: 0,
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
        });
    }

    // Animated counters
    setupCounters() {
        const profileCounter = document.getElementById('profile-counter');
        
        
        if (profileCounter ) {
            // Animate profile counter
            anime({
                targets: { count: 0 },
                count: 3847,
                duration: 2000,
                delay: 500,
                easing: 'easeOutCubic',
                update: function(anim) {
                    profileCounter.textContent = Math.floor(anim.animatables[0].target.count).toLocaleString();
                }
            });
        }
    }

    // Interactive chat interface
    setupChatInterface() {
        const chatInput = document.querySelector('#chat-interface input');
        const sendButton = document.querySelector('#chat-interface button');
        const chatContainer = document.getElementById('chat-interface');

        if (!chatInput || !sendButton || !chatContainer) {
            console.warn('Chat interface elements not found');
            return;
        }

        const sampleQueries = [
            "Compare salinity patterns between Arctic and Antarctic regions",
            "Show me ocean heat content trends over the last decade",
            "Generate current velocity maps for the Gulf Stream",
            "Analyze temperature anomalies in the Pacific Ocean",
            "What are the seasonal variations in thermocline depth?"
        ];

        let queryIndex = 0;
        let demoRunning = false;

        // Auto-demo functionality
        const runDemo = () => {
            if (demoRunning) return;
            demoRunning = true;
            
            setTimeout(() => {
                if (queryIndex < sampleQueries.length) {
                    // Add user query
                    this.addChatMessage(sampleQueries[queryIndex], 'user');
                    
                    setTimeout(() => {
                        // Add system response
                        this.addChatMessage(`Analyzing ARGO data for "${sampleQueries[queryIndex]}"... Generating visualization with statistical analysis and source attribution.`, 'system');
                        queryIndex++;
                        
                        if (queryIndex < sampleQueries.length) {
                            setTimeout(runDemo, 3000);
                        } else {
                            demoRunning = false;
                        }
                    }, 1500);
                }
            }, 2000);
        };

        // Start demo after page load
        setTimeout(runDemo, 3000);

        // Manual input handling
        const handleSend = () => {
            const message = chatInput.value.trim();
            if (message) {
                this.addChatMessage(message, 'user');
                chatInput.value = '';
                
                setTimeout(() => {
                    this.addChatMessage(`Processing your query: "${message}"... Analyzing relevant ARGO profiles and generating visualization.`, 'system');
                }, 1000);
            }
        };

        sendButton.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
    }

    addChatMessage(message, type) {
        const chatContainer = document.getElementById('chat-interface');
        if (!chatContainer) return;
        
        const messageDiv = document.createElement('div');
        
        if (type === 'user') {
            messageDiv.className = 'bg-gray-100 rounded-lg p-4 chat-bubble';
            messageDiv.innerHTML = `<p class="text-sm">"${message}"</p>`;
        } else {
            messageDiv.className = 'bg-copper-orange/10 rounded-lg p-4 ml-8';
            messageDiv.innerHTML = `
                <div class="flex items-center space-x-2 mb-2">
                    <div class="w-2 h-2 bg-copper-orange rounded-full animate-pulse"></div>
                    <span class="text-xs text-copper-orange font-medium">Analyzing ARGO data...</span>
                </div>
                <p class="text-sm">${message}</p>
            `;
        }
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Animate new message
        anime({
            targets: messageDiv,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutCubic'
        });
    }

    // P5.js background animation
    setupP5Background() {
        const container = document.getElementById('p5-canvas-container');
        if (!container) return;

        try {
            new p5((p) => {
                let particles = [];
                let time = 0;

                p.setup = () => {
                    const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
                    canvas.parent('p5-canvas-container');
                    canvas.id('p5-canvas');
                    
                    // Create particles representing ARGO floats
                    for (let i = 0; i < 50; i++) {
                        particles.push({
                            x: p.random(p.width),
                            y: p.random(p.height),
                            vx: p.random(-0.5, 0.5),
                            vy: p.random(-0.5, 0.5),
                            size: p.random(2, 6),
                            alpha: p.random(0.3, 0.8)
                        });
                    }
                };

                p.draw = () => {
                    p.clear();
                    time += 0.01;
                    
                    // Draw connecting lines
                    p.stroke(184, 115, 51, 30); // Copper orange with low alpha
                    p.strokeWeight(1);
                    
                    for (let i = 0; i < particles.length; i++) {
                        for (let j = i + 1; j < particles.length; j++) {
                            const dist = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                            if (dist < 100) {
                                p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                            }
                        }
                    }
                    
                    // Draw and update particles
                    p.noStroke();
                    particles.forEach(particle => {
                        // Update position
                        particle.x += particle.vx + p.sin(time + particle.x * 0.01) * 0.2;
                        particle.y += particle.vy + p.cos(time + particle.y * 0.01) * 0.2;
                        
                        // Wrap around edges
                        if (particle.x < 0) particle.x = p.width;
                        if (particle.x > p.width) particle.x = 0;
                        if (particle.y < 0) particle.y = p.height;
                        if (particle.y > p.height) particle.y = 0;
                        
                        // Draw particle
                        p.fill(184, 115, 51, particle.alpha * 255);
                        p.circle(particle.x, particle.y, particle.size);
                    });
                };

                p.windowResized = () => {
                    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
                };
            });
        } catch (error) {
            console.error('Error initializing P5.js background:', error);
        }
    }

    // Temperature trend chart
    setupTemperatureChart() {
        const chartContainer = document.getElementById('temperature-chart');
        if (!chartContainer) return;

        try {
            const chart = echarts.init(chartContainer);
            
            // Generate sample temperature data
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const temperatureData = [14.2, 14.8, 15.5, 16.2, 17.1, 18.3, 19.8, 20.1, 19.2, 17.8, 16.1, 14.9];
            const salinityData = [34.8, 34.9, 35.0, 35.1, 35.2, 35.3, 35.4, 35.3, 35.2, 35.1, 35.0, 34.9];

            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(42, 42, 42, 0.9)',
                    borderColor: '#B87333',
                    textStyle: {
                        color: '#F8F6F3'
                    }
                },
                legend: {
                    data: ['Temperature (°C)', 'Salinity (PSU)'],
                    textStyle: {
                        color: '#2A2A2A'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: months,
                    axisLine: {
                        lineStyle: {
                            color: '#8B7D6B'
                        }
                    },
                    axisLabel: {
                        color: '#2A2A2A'
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: 'Temperature (°C)',
                        position: 'left',
                        axisLine: {
                            lineStyle: {
                                color: '#B87333'
                            }
                        },
                        axisLabel: {
                            color: '#2A2A2A'
                        }
                    },
                    {
                        type: 'value',
                        name: 'Salinity (PSU)',
                        position: 'right',
                        axisLine: {
                            lineStyle: {
                                color: '#8B7D6B'
                            }
                        },
                        axisLabel: {
                            color: '#2A2A2A'
                        }
                    }
                ],
                series: [
                    {
                        name: 'Temperature (°C)',
                        type: 'line',
                        smooth: true,
                        data: temperatureData,
                        lineStyle: {
                            color: '#B87333',
                            width: 3
                        },
                        itemStyle: {
                            color: '#B87333'
                        },
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    { offset: 0, color: 'rgba(184, 115, 51, 0.3)' },
                                    { offset: 1, color: 'rgba(184, 115, 51, 0.05)' }
                                ]
                            }
                        }
                    },
                    {
                        name: 'Salinity (PSU)',
                        type: 'line',
                        yAxisIndex: 1,
                        smooth: true,
                        data: salinityData,
                        lineStyle: {
                            color: '#8B7D6B',
                            width: 3
                        },
                        itemStyle: {
                            color: '#8B7D6B'
                        }
                    }
                ],
                animation: true,
                animationDuration: 2000,
                animationEasing: 'cubicOut'
            };

            chart.setOption(option);

            // Resize chart on window resize
            window.addEventListener('resize', () => {
                chart.resize();
            });

            // Animate chart on scroll
            const chartObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        chart.setOption(option, true);
                    }
                });
            }, { threshold: 0.3 });

            chartObserver.observe(chartContainer);
        } catch (error) {
            console.error('Error initializing temperature chart:', error);
        }
    }

    // Smooth scrolling for navigation links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const mobileMenuButton = document.querySelector('.md\\:hidden button');
        
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', () => {
                // Create mobile menu if it doesn't exist
                let mobileMenu = document.querySelector('.mobile-menu');
                if (!mobileMenu) {
                    mobileMenu = document.createElement('div');
                    mobileMenu.className = 'mobile-menu fixed top-20 left-0 right-0 bg-soft-cream border-b border-warm-stone/20 p-6 shadow-lg z-40 hidden';
                    mobileMenu.innerHTML = `
                        <div class="space-y-4">
                            <a href="index.html" class="block text-deep-charcoal hover:text-copper-orange transition-colors">Home</a>
                            <a href="research.html" class="block text-deep-charcoal hover:text-copper-orange transition-colors">Research</a>
                            <a href="data.html" class="block text-deep-charcoal hover:text-copper-orange transition-colors">Data</a>
                            <a href="about.html" class="block text-deep-charcoal hover:text-copper-orange transition-colors">About</a>
                            <button class="w-full bg-copper-orange text-white py-2 rounded-lg font-medium hover:bg-copper-orange/90 transition-colors">
                                Get Started
                            </button>
                        </div>
                    `;
                    document.body.appendChild(mobileMenu);
                }
                
                // Toggle mobile menu visibility
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new SamudraApp();
    } catch (error) {
        console.error('Error initializing SamudraApp:', error);
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Some features may not work properly. Please refresh the page.</span>
            </div>
        `;
        document.body.appendChild(errorDiv);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
});

// Add some utility functions for enhanced interactions
const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
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

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Format numbers with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

// Add click handlers for buttons that don't have specific functionality yet
document.addEventListener('click', (e) => {
    if (e.target.matches('button') && !e.target.hasAttribute('data-handled')) {
        const buttonText = e.target.textContent.trim();
        
        // Show coming soon message for unhandled buttons
        if (['Get Started', 'Try Live Demo', 'View Research Tools', 'Start Free Trial', 'Schedule Demo'].includes(buttonText)) {
            e.preventDefault();
            
            // Create and show modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
                    <div class="w-16 h-16 bg-copper-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-copper-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-display font-semibold mb-2">Coming Soon!</h3>
                    <p class="text-warm-stone mb-6">This feature is currently in development. We're working hard to bring you the full Samudra-I experience.</p>
                    <button class="bg-copper-orange text-white px-6 py-2 rounded-lg font-medium hover:bg-copper-orange/90 transition-colors" onclick="this.closest('.fixed').remove()">
                        Got it
                    </button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Animate modal appearance
            anime({
                targets: modal,
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutCubic'
            });
            
            anime({
                targets: modal.querySelector('div'),
                scale: [0.8, 1],
                duration: 300,
                easing: 'easeOutCubic'
            });
            
            // Mark button as handled
            e.target.setAttribute('data-handled', 'true');
        }
    }
});

// Performance optimization: Lazy load images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
});

// Observe all images with data-src
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});