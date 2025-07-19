// Enhanced JavaScript for David Enyi Portfolio

document.addEventListener("DOMContentLoaded", function() {
    initializeNavigation();
    initializeStatsAnimation();
    initializeMobileMenu();
    initializeSlideshow();
    initializeAchievementFilters();
});

// Slideshow functionality
let currentSlideIndex = 0;
let slideInterval;
let allSlides = [];
let filteredSlides = [];

function initializeSlideshow() {
    allSlides = document.querySelectorAll('.slide');
    filteredSlides = [...allSlides];
    
    if (allSlides.length > 0) {
        showSlide(0);
        startAutoSlide();
        
        // Pause auto-slide on hover
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', stopAutoSlide);
            slideshowContainer.addEventListener('mouseleave', startAutoSlide);
        }
    }
}

function showSlide(index) {
    if (filteredSlides.length === 0) return;
    
    // Hide all slides
    allSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    if (filteredSlides[index]) {
        filteredSlides[index].classList.add('active');
    }
    
    // Update indicators
    updateIndicators(index);
    currentSlideIndex = index;
}

function changeSlide(direction) {
    if (filteredSlides.length === 0) return;
    
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= filteredSlides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = filteredSlides.length - 1;
    }
    
    showSlide(currentSlideIndex);
    resetAutoSlide();
}

function currentSlide(index) {
    showSlide(index - 1);
    resetAutoSlide();
}

function updateIndicators(activeIndex) {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index < filteredSlides.length) {
            indicator.style.display = 'block';
            indicator.classList.toggle('active', index === activeIndex);
        } else {
            indicator.style.display = 'none';
        }
    });
}

function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// Achievement filter functionality
function initializeAchievementFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter slides
            filterSlides(filter);
        });
    });
}

function filterSlides(filter) {
    if (filter === 'all') {
        filteredSlides = [...allSlides];
    } else {
        filteredSlides = [...allSlides].filter(slide => 
            slide.getAttribute('data-achievement') === filter
        );
    }
    
    // Reset to first slide of filtered results
    currentSlideIndex = 0;
    showSlide(0);
    resetAutoSlide();
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Highlight active section on scroll
    window.addEventListener('scroll', highlightActiveSection);
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Stats animation
function initializeStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (isNaN(target)) return; // Skip if no valid target
            
            const increment = target / 100;
            let current = 0;
            
            const updateStat = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current) + '+';
                    setTimeout(updateStat, 20);
                } else {
                    stat.textContent = target + '+';
                }
            };
            
            updateStat();
        });
    };
    
    // Trigger animation when stats section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
}

// Modal functionality
function openModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    
    const projectDetails = {
        'african-intelligence': {
            title: 'African Intelligence Platform',
            description: 'Africa\'s first open-source, community-driven AI-powered learning management system designed specifically for the African context.',
            details: [
                'Developed using cutting-edge AI technologies including machine learning and natural language processing',
                'Recognized by Nigeria\'s National Institute for AI & Robotics',
                'Placed in top 10 at Hack4Life 2024 hackathon among 500 teams',
                'Features adaptive learning algorithms tailored for African educational needs',
                'Supports multiple African languages and cultural contexts',
                'Open-source architecture allowing community contributions and customization'
            ],
            technologies: ['Python', 'TensorFlow', 'Django', 'React', 'PostgreSQL', 'Docker'],
            impact: 'Democratizing access to quality AI education across Africa',
            links: {
                platform: 'https://www.africaninteligence.tech',
                github: '#',
                documentation: '#'
            }
        },
        'nysc-initiative': {
            title: 'NYSC AI Innovators Initiative (Plateau State)',
            description: 'First-of-its-kind program transforming Nigeria\'s National Youth Service Corps year into a tech career launchpad.',
            details: [
                'Initial sensitization workshop for 1,260 corps members in Plateau State',
                'Created a dedicated training program for a select, ongoing cohort',
                'Comprehensive AI and machine learning curriculum',
                'Hands-on projects with real-world applications',
                'Mentorship program connecting participants with industry experts',
                'Job placement assistance and career guidance'
            ],
            technologies: ['Python', 'Machine Learning', 'Data Science', 'Web Development'],
            impact: 'Transforming youth unemployment into tech talent pipeline',
            links: {
                video: 'https://youtube.com/shorts/Y6nd3QKN1eg?feature=share',
                program: '#',
                testimonials: '#'
            }
        },
        'ai-education': {
            title: 'AI in Education: Teacher Upskilling Program (Mount Carmel Christian School, Jos)',
            description: 'Comprehensive teacher training program empowering educators with AI tools for enhanced learning outcomes.',
            details: [
                'Trained 50 educators at Mount Carmel Christian School, Jos',
                'Focus on practical AI applications in classroom settings',
                'Custom AI tools development for educational purposes',
                'Curriculum integration strategies for AI literacy',
                'Assessment and evaluation using AI-powered analytics',
                'Ongoing support and professional development'
            ],
            technologies: ['Educational AI Tools', 'Learning Analytics', 'Adaptive Learning Systems'],
            impact: 'Revolutionizing traditional teaching methods with AI integration',
            links: {
                video: 'https://youtu.be/FU74_JNfTg4',
                curriculum: '#',
                resources: '#'
            }
        },
        'youth-empowerment': {
            title: 'AI Fundamentals for Youth Empowerment (In partnership with Kefiano Creative Hub)',
            description: 'Intensive training program providing unemployed youth with machine learning and AI skills for career advancement.',
            details: [
                'Successfully trained 165 unemployed and underemployed youth',
                'Foundational program equipped participants with robust understanding of AI principles',
                'Machine learning concepts and practical applications curriculum',
                'Delivered through African Intelligence platform',
                'Prepared participants for entry-level tech roles and further specialization',
                'Significant increase in digital literacy and employability achieved'
            ],
            technologies: ['Python', 'Machine Learning', 'Deep Learning', 'Data Analysis'],
            impact: 'Converting unemployment into AI expertise and career opportunities, creating a pipeline of talent for Nigeria\'s digital economy',
            links: {
                video: 'https://youtube.com/shorts/dTvXZ8e1q4Y?feature=share',
                portfolio: '#',
                apply: '#'
            }
        },
        'hackathon': {
            title: 'African Intelligence Platform Hackathon',
            description: 'First-of-its-kind hackathon organized to improve the African Intelligence platform and achieve product-market fit.',
            details: [
                'Close to 100 participants from across Nigeria',
                '7 competing teams with diverse technical backgrounds',
                'Comprehensive mentorship program with industry experts',
                'Focus on open source contributions to the platform',
                'Certificates of participation for all attendees',
                'Cash prizes for winning teams',
                'Fostered a thriving developer community in Jos, Plateau State'
            ],
            technologies: ['Open Source Development', 'AI/ML', 'Web Development', 'Community Building'],
            impact: 'Strengthened the African Intelligence platform while building a sustainable developer ecosystem in Northern Nigeria',
            links: {
                video: 'https://youtu.be/De-gVLVQow8',
                github: '#',
                community: '#'
            }
        },
        'afrobeats-label': {
            title: 'AI-Powered Afrobeats Label (BnB Soundz)',
            description: 'Pioneering Africa\'s first AI-generated music label, combining technology with cultural expression.',
            details: [
                'Led a visionary group of songwriters, music producers, and musicians',
                'Developed AI algorithms for Afrobeats music generation',
                'Created unique compositions blending AI and human creativity',
                'Established distribution channels across major streaming platforms',
                'Collaborated with local artists to preserve cultural authenticity',
                'Promoting African culture through innovative technology'
            ],
            technologies: ['AI Music Generation', 'Machine Learning', 'Audio Processing', 'Digital Distribution'],
            impact: 'Revolutionizing music creation and cultural preservation through AI while supporting African artists',
            links: {
                spotify: 'https://open.spotify.com/artist/2DNELwdzjJpG2YP4JS0Sfm?si=2kiQ9-NqRzOmoyVU5AqX8g',
                label: 'https://bnbsoundz.com',
                music: '#'
            }
        },
        'thought-leadership': {
            title: 'CreativeTech Africa Blog',
            description: 'Founded a blog to sensitize Nigerian youth on AI news, tools, and education.',
            details: [
                'Regular publication of AI-focused content for African audiences',
                'Educational articles on emerging AI technologies',
                'Tool reviews and tutorials for practical AI applications',
                'News coverage of AI developments relevant to Africa',
                'Community building through educational content',
                'Bridging the knowledge gap in AI literacy across Nigeria'
            ],
            technologies: ['Content Creation', 'Digital Publishing', 'Community Engagement'],
            impact: 'Democratizing AI knowledge and fostering tech literacy among Nigerian youth',
            links: {
                blog: 'https://creativetechafrica.blog',
                articles: 'https://creativetechafrica.blog',
                subscribe: '#'
            }
        }
    };
    
    const project = projectDetails[projectId];
    if (!project) return;
    
    modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <p class="project-description">${project.description}</p>
        
        <div class="project-details">
            <h3>Key Features & Achievements</h3>
            <ul>
                ${project.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
        </div>
        
        <div class="project-technologies">
            <h3>Technologies Used</h3>
            <div class="tech-tags">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
        
        <div class="project-impact">
            <h3>Impact</h3>
            <p>${project.impact}</p>
        </div>
        
        <div class="project-links">
            <h3>Links & Resources</h3>
            <div class="link-buttons">
                ${Object.entries(project.links).map(([key, url]) => 
                    url !== '#' ? `<a href="${url}" target="_blank" class="link-btn">${key.charAt(0).toUpperCase() + key.slice(1)}</a>` : ''
                ).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('project-modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Gallery images data (for future expansion)
const galleryImages = [
    { src: '/assets/images/WhatsAppImage2025-06-28at4.25.40PM.jpeg', tag: 'NYSC Initiative', title: 'NYSC AI Innovators Initiative', description: 'Training 1,260+ corps members in Plateau State on AI and digital skills' },
    { src: '/assets/images/WhatsAppImage2025-07-12at5.42.04PM.jpeg', tag: 'Thought Leadership', title: 'World Youth Skills Day 2025', description: 'Keynote speaker on "Youth Empowerment Through AI and Digital Skills"' },
    { src: '/assets/images/WhatsAppImage2025-06-28at4.09.10PM.jpeg', tag: 'African Intelligence', title: 'VR Technology Integration', description: 'Demonstrating virtual reality applications in the African Intelligence platform' },
    { src: '/assets/images/WhatsAppImage2025-06-28at2.35.51PM-3.jpeg', tag: 'NYSC Initiative', title: 'Interactive AI Training', description: 'Hands-on learning session with NYSC corps members' },
    { src: '/assets/images/WhatsAppImage2025-06-28at2.35.50PM.jpeg', tag: 'NYSC Initiative', title: 'Recognition Ceremony', description: 'Presenting certificates to outstanding participants in the AI training program' },
    { src: '/assets/images/WhatsAppImage2025-04-25at3.06.45AM.jpeg', tag: 'Youth Empowerment', title: 'AI & VR Training Program', description: 'Comprehensive training on artificial intelligence and virtual reality technologies' },
    { src: '/assets/images/WhatsAppImage2025-04-25at3.08.03AM.jpeg', tag: 'Youth Empowerment', title: 'Tech Industry Bootcamp', description: 'Empowering youth with skills for the booming tech industry' },
    { src: '/assets/images/JOSMEDICAL2.jpg', tag: 'African Intelligence', title: 'Medical VR Innovation', description: 'Revolutionizing medical training with virtual reality technology' },
    { src: '/assets/images/WhatsAppImage2025-07-18at12.10.44AM.jpeg', tag: 'Thought Leadership', title: 'Celebrating African Innovation', description: 'Panel discussion on Africa’s Role in the Global Blockchain Ecosystem.' },
    { src: '/assets/images/WhatsAppImage2025-05-21at7.54.33PM-2.jpeg', tag: 'African Intelligence', title: 'African Intelligence Hackathon', description: 'Team photo at the African Intelligence Hackathon.' },
    { src: '/assets/images/B&Bteam.jpg', tag: 'AI-Powered Afrobeats Label', title: 'B&B Creators Team', description: 'The team behind B&B Creators and the AI-Powered Afrobeats Label.' },
    { src: '/assets/images/WhatsAppImage2024-09-24at11.05.45AM.jpeg', tag: 'Thought Leadership', title: 'JOS Tech Fest 2024', description: 'Promotional material for JOS Tech Fest 2024, focusing on Fintech, AI, and Blockchain.' },
    { src: '/assets/images/WhatsAppImage2024-12-01at1.34.08PM-3.jpeg', tag: 'Youth Empowerment', title: 'Mentorship Session', description: 'Mentoring youth at a tech event.' },
    { src: '/assets/images/WhatsAppImage2024-11-09at3.38.06PM.jpeg', tag: 'AI in Education', title: 'Teacher Upskilling Program', description: 'Training educators on AI tools for enhanced learning outcomes.' }
];

// Function to add new images to gallery (for future use)
function addImageToGallery(imageData) {
    galleryImages.push(imageData);
    // Refresh slideshow with new images
    initializeSlideshow();
}

