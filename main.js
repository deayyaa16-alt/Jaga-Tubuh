// Main JavaScript - Navigation & Global Functions

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }


    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
});

function getStoredData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

function setStoredData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Error writing to localStorage:', e);
    }
}

function getHealthHistory() {
    return getStoredData('jagatubuh_history') || [];
}

function addHealthRecord(record) {
    const history = getHealthHistory();
    const newRecord = {
        ...record,
        date: new Date().toISOString()
    };
    history.push(newRecord);
    setStoredData('jagatubuh_history', history);
    return newRecord;
}

function getLatestHealthRecord() {
    const history = getHealthHistory();
    return history.length > 0 ? history[history.length - 1] : null;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function formatNumber(num) {
    return Number(num).toFixed(1);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { label: 'Kurus', color: '#F59E0B' };
    if (bmi < 25) return { label: 'Normal', color: '#22C55E' };
    if (bmi < 30) return { label: 'Gemuk', color: '#F97316' };
    return { label: 'Obesitas', color: '#EF4444' };
}

function getHealthScoreCategory(score) {
    if (score >= 80) return { label: 'Sangat Baik', color: '#22C55E' };
    if (score >= 60) return { label: 'Baik', color: '#3B82F6' };
    if (score >= 40) return { label: 'Cukup', color: '#F59E0B' };
    return { label: 'Perlu Perhatian', color: '#EF4444' };
}

function initStepsSlider() {
    const slider = document.getElementById('stepsSlider');
    const dotsContainer = document.getElementById('stepsDots');
    const steps = document.querySelectorAll('.step-item');
    let currentIndex = 0;
    let autoSlideInterval;
    const totalSlides = steps.length;
    const slideInterval = 3000;

    if (!slider || steps.length === 0) return;


    if (dotsContainer) {
        steps.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
            dot.dataset.index = index;
            dot.addEventListener('click', function() {
                goToSlide(parseInt(this.dataset.index));
            });
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentIndex = index;
        const offset = -currentIndex * (100 / totalSlides);
        
        slider.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        slider.style.transform = 'translateX(' + offset + '%)';
        
        document.querySelectorAll('.slider-dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, slideInterval);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    goToSlide(0);
    startAutoSlide();

    const container = document.querySelector('.steps-slider-container');
    if (container) {
        container.addEventListener('mouseenter', stopAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);
    }
}