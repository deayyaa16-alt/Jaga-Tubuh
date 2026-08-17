const menuData = [
    { name: 'Nasi Putih', calories: 204, protein: 4.2, carbs: 44, fat: 0.4 },
    { name: 'Nasi Merah', calories: 180, protein: 4.5, carbs: 38, fat: 1.5 },
    { name: 'Ayam Bakar', calories: 250, protein: 28, carbs: 0, fat: 15 },
    { name: 'Ayam Goreng', calories: 320, protein: 26, carbs: 8, fat: 20 },
    { name: 'Ikan Salmon', calories: 208, protein: 22, carbs: 0, fat: 13 },
    { name: 'Tahu Tempe', calories: 150, protein: 12, carbs: 8, fat: 7 },
    { name: 'Sayur Bayam', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    { name: 'Brokoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
    { name: 'Telur Dadar', calories: 155, protein: 13, carbs: 1, fat: 11 },
    { name: 'Pisang', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
    { name: 'Apel', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
    { name: 'Yogurt', calories: 150, protein: 10, carbs: 17, fat: 5 },
    { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3 },
    { name: 'Roti Gandum', calories: 80, protein: 3, carbs: 15, fat: 1 },
    { name: 'Mie Instan', calories: 350, protein: 8, carbs: 45, fat: 15 },
    { name: 'Smoothie', calories: 200, protein: 4, carbs: 30, fat: 6 },
];

function getBookings() {
    return JSON.parse(localStorage.getItem('jagaTubuhBookings') || '[]');
}

function saveBookings(bookings) {
    localStorage.setItem('jagaTubuhBookings', JSON.stringify(bookings));
}

function getDailyMenus() {
    return JSON.parse(localStorage.getItem('jagaTubuhDailyMenus') || '{}');
}

function saveDailyMenus(menus) {
    localStorage.setItem('jagaTubuhDailyMenus', JSON.stringify(menus));
}

function getWeeklyReport() {
    return JSON.parse(localStorage.getItem('jagaTubuhWeeklyReport') || 'null');
}

function saveWeeklyReport(report) {
    localStorage.setItem('jagaTubuhWeeklyReport', JSON.stringify(report));
}

function getHealthTarget() {
    return JSON.parse(localStorage.getItem('jagaTubuhHealthTarget') || 'null');
}

function saveHealthTarget(target) {
    localStorage.setItem('jagaTubuhHealthTarget', JSON.stringify(target));
}

function hasPremiumAccess() {
    const bookings = getBookings();
    const todayStr = getToday(); 
   
    return bookings.some(b => {
        if (b.status !== 'completed') return false;
        
        return b.date <= todayStr;
    });
}

function getPremiumDoctor() {
    const bookings = getBookings();
    const todayStr = getToday();
    const validBookings = bookings.filter(b => b.status === 'completed' && b.date <= todayStr);
    if (validBookings.length > 0) {
        return validBookings[validBookings.length - 1].doctor;
    }
    return null;
}


function getBookingStatus(dateStr) {
    const todayStr = getToday();
    if (dateStr > todayStr) {
        return { statusClass: 'pending', statusText: 'Menunggu Jadwal', isAccessible: false };
    }
    return { statusClass: 'completed', statusText: 'Selesai', isAccessible: true };
}

function formatDateIndonesia(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
}

function getToday() {
    return new Date().toISOString().split('T')[0];
}

function getDateRange(startDate, days) {
    const dates = [];
    const start = new Date(startDate + 'T00:00:00');
    for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
}

function searchDoctors() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.doctor-card');
    let found = false;
    cards.forEach(card => {
        const name = card.dataset.name || '';
        const spec = card.querySelector('.doctor-spec')?.textContent || '';
        const match = name.toLowerCase().includes(query) || spec.toLowerCase().includes(query);
        card.style.display = match ? 'block' : 'none';
        if (match) found = true;
    });
    document.getElementById('noDoctorResult').style.display = found ? 'none' : 'block';
}

function filterDoctors(category, btnElement) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    const cards = document.querySelectorAll('.doctor-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    document.getElementById('noDoctorResult').style.display = 'none';
    document.getElementById('searchInput').value = '';
}

function switchTab(tab, btn) {
    if (tab === 'daily' || tab === 'weekly') {
        if (!hasPremiumAccess()) {
            alert('Fitur ini hanya bisa diakses setelah tanggal konsultasi Anda telah tiba (sesuai jadwal booking). Silakan tunggu hingga hari H!');
            return;
        }
    }
    document.querySelectorAll('.consult-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
    if (tab === 'schedule') renderSchedule();
    if (tab === 'daily') renderDailyContent();
    if (tab === 'weekly') renderWeeklyContent();
}

let selectedDoctor = '';
let selectedSpec = '';
let selectedPrice = 0;
let selectedDate = '';
let selectedTime = '';
let selectedPayment = '';
let paymentCode = '';
let bookingCode = '';
let countdownInterval = null;

function openBookingModal(doctorName, spec, price) {
    selectedDoctor = doctorName;
    selectedSpec = spec;
    selectedPrice = price;
    selectedDate = '';
    selectedTime = '';
    selectedPayment = '';
    document.getElementById('bookingDoctorName').textContent = doctorName;
    const dateInput = document.getElementById('consultDate');
    dateInput.value = '';
    

    const today = getToday();
    dateInput.setAttribute('min', today);
    
    document.querySelectorAll('.time-slot-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.payment-method-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('timeError').style.display = 'none';
    goToStep1();
    document.getElementById('bookingModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
}

function closeBookingModalAndSave() {
    const bookings = getBookings();
    bookings.push({
        doctor: selectedDoctor,
        spec: selectedSpec,
        date: selectedDate,
        time: selectedTime,
        price: selectedPrice,
        code: bookingCode,
        status: 'completed', 
        createdAt: new Date().toISOString()
    });
    saveBookings(bookings);
    closeBookingModal();
    renderSchedule();
  
    const hasAccess = hasPremiumAccess();
    const dailyTab = document.getElementById('dailyTab');
    const weeklyTab = document.getElementById('weeklyTab');
    
    if (hasAccess) {
        if (dailyTab) {
            dailyTab.classList.remove('locked');
            dailyTab.style.pointerEvents = 'auto';
            dailyTab.style.opacity = '1';
        }
        if (weeklyTab) {
            weeklyTab.classList.remove('locked');
            weeklyTab.style.pointerEvents = 'auto';
            weeklyTab.style.opacity = '1';
        }
   
        document.querySelectorAll('.consult-tab').forEach(b => b.classList.remove('active'));
        if (dailyTab) dailyTab.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById('tabDaily').classList.add('active');
        renderDailyContent();
        alert('🎉 Selamat! Booking berhasil. Akses Premium akan terbuka pada hari H sesuai jadwal Anda!');
    } else {
        alert('✅ Booking berhasil! Silakan tunggu hingga hari H (jadwal konsultasi) untuk mengakses fitur Input Harian & Rekap Mingguan.');
        switchTab('schedule', document.querySelector('.consult-tab[onclick*="schedule"]'));
    }
}

function goToStep1() {
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step4').style.display = 'none';
    document.getElementById('step5').style.display = 'none';
    document.getElementById('step6').style.display = 'none';
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
}

function goToStep2() {
    const date = document.getElementById('consultDate').value;
    const selectedSlot = document.querySelector('.time-slot-btn.selected');
    
   
    if (!date) { alert('Silakan pilih tanggal terlebih dahulu!'); return; }
    
   
    const todayStr = getToday();
    if (date < todayStr) {
        alert('Anda tidak bisa memilih tanggal di masa lalu. Silakan pilih hari ini atau hari mendatang!');
        return;
    }
    
    if (!selectedSlot) { document.getElementById('timeError').style.display = 'block'; return; }
    document.getElementById('timeError').style.display = 'none';
    selectedDate = date;
    selectedTime = selectedSlot.dataset.time;
    document.getElementById('summaryDoctor').textContent = selectedDoctor;
    document.getElementById('summarySpec').textContent = selectedSpec;
    document.getElementById('summaryDate').textContent = formatDateIndonesia(selectedDate);
    document.getElementById('summaryTime').textContent = selectedTime + ' WIB';
    document.getElementById('summaryPrice').textContent = 'Rp ' + formatPrice(selectedPrice);
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
}

function goToStep3() {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
}

function goToStep4() {
    if (!selectedPayment) { alert('Silakan pilih metode pembayaran terlebih dahulu!'); return; }
    paymentCode = generatePaymentCode();
    bookingCode = 'BKG-' + generateRandomString(8);
    document.getElementById('qrisDisplay').style.display = 'none';
    document.getElementById('bankDisplay').style.display = 'none';
    document.getElementById('ewalletDisplay').style.display = 'none';
    if (selectedPayment === 'QRIS') {
        document.getElementById('qrisDisplay').style.display = 'block';
        document.getElementById('qrisCodeDisplay').textContent = 'QR-' + paymentCode;
    } else if (selectedPayment === 'Transfer Bank') {
        document.getElementById('bankDisplay').style.display = 'block';
        document.getElementById('paymentCode').textContent = paymentCode;
        document.getElementById('bankCodeDisplay').textContent = paymentCode;
    } else if (selectedPayment === 'E-Wallet') {
        document.getElementById('ewalletDisplay').style.display = 'block';
        document.getElementById('paymentCodeEwallet').textContent = paymentCode;
    }
    startCountdown(15 * 60);
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step4').style.display = 'block';
}

function goToStep5() {
    document.getElementById('step4').style.display = 'none';
    document.getElementById('step5').style.display = 'block';
}

function goToStep6() {
    document.getElementById('ticketCode').textContent = bookingCode;
    document.getElementById('ticketDoctor').textContent = selectedDoctor;
    document.getElementById('ticketSchedule').textContent = formatDateIndonesia(selectedDate) + ' - ' + selectedTime + ' WIB';
    document.getElementById('step5').style.display = 'none';
    document.getElementById('step6').style.display = 'block';
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
}

function selectTimeSlot(btn, time) {
    document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    btn.dataset.time = time;
    document.getElementById('timeError').style.display = 'none';
}

function selectPaymentMethod(btn, method) {
    document.querySelectorAll('.payment-method-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedPayment = method;
}

function simulatePayment() {
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
    goToStep5();
}

function confirmPayment() {
    document.getElementById('paymentStatus').textContent = 'Pembayaran berhasil!';
    document.getElementById('paymentSubStatus').textContent = 'Booking Anda telah dikonfirmasi';
    document.getElementById('paymentStatus').style.color = '#4CAF50';
    setTimeout(() => { goToStep6(); }, 1500);
}

function startCountdown(seconds) {
    let remaining = seconds;
    const timerDisplay = document.getElementById('countdownTimer');
    updateTimerDisplay(remaining);
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining);
        if (remaining <= 60) { timerDisplay.classList.add('warning'); }
        if (remaining <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            timerDisplay.textContent = 'Waktu habis!';
            timerDisplay.style.color = '#ff6b6b';
            alert('Waktu pembayaran telah habis. Silakan booking ulang.');
            goToStep1();
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('countdownTimer').textContent = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}

function generatePaymentCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'JGT-';
    for (let i = 0; i < 6; i++) { code += chars.charAt(Math.floor(Math.random() * chars.length)); }
    return code;
}

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); }
    return result;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function renderSchedule() {
    const container = document.getElementById('scheduleList');
    const bookings = getBookings();
    if (bookings.length === 0) {
        container.innerHTML = '<p style="text-align:center; opacity:0.6; padding:30px;">Belum ada jadwal konsultasi. Booking sekarang!</p>';
        return;
    }
    let html = '';
    bookings.slice().reverse().forEach((b) => {
        const status = getBookingStatus(b.date);
        const isAccessible = status.isAccessible;
        const statusText = status.statusText;
        const statusClass = status.statusClass;
        
        html += `
            <div class="schedule-card">
                <div class="doctor-info">
                    <h4>${b.doctor}</h4>
                    <p>${formatDateIndonesia(b.date)} - ${b.time} WIB • ${b.spec}</p>
                </div>
                <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                    <span class="schedule-status ${statusClass}">${statusText}</span>
                    ${isAccessible ? `<button class="btn-consult-chat" onclick="openConsultChat('${b.doctor}')">Konsultasi</button>` : ''}
                    ${!isAccessible ? `<span style="font-size:12px; opacity:0.7; color: #FFD700;">🔒 Buka pada hari H</span>` : ''}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}
function renderTargetInput() {
    const savedTarget = getHealthTarget();
    return `
        <div class="target-input-group" style="background:rgba(255,255,255,0.04); border-radius:12px; padding:20px; margin-bottom:20px; border:1px solid rgba(255,255,255,0.06);">
            <label style="display:block; font-weight:600; margin-bottom:12px; font-size:14px;">Target Kesehatan</label>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
                <div>
                    <label style="font-size:12px; opacity:0.6;">Target Berat Badan (kg)</label>
                    <input type="number" id="targetWeight" placeholder="Misal: 65" value="${savedTarget?.targetWeight || ''}" style="width:100%; padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white;">
                </div>
                <div>
                    <label style="font-size:12px; opacity:0.6;">Periode (bulan)</label>
                    <select id="targetPeriod" style="width:100%; padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white;">
                        <option value="1" ${savedTarget?.period === '1' ? 'selected' : ''}>1 Bulan</option>
                        <option value="2" ${savedTarget?.period === '2' ? 'selected' : ''}>2 Bulan</option>
                        <option value="3" ${savedTarget?.period === '3' ? 'selected' : ''}>3 Bulan</option>
                        <option value="6" ${savedTarget?.period === '6' ? 'selected' : ''}>6 Bulan</option>
                    </select>
                </div>
            </div>
            <div style="margin-top:12px;">
                <label style="font-size:12px; opacity:0.6;">Deskripsi Target (opsional)</label>
                <input type="text" id="targetDesc" placeholder="Misal: Menurunkan berat badan 5kg" value="${savedTarget?.description || ''}" style="width:100%; padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white;">
            </div>
            <button class="btn-primary" style="margin-top:14px; width:100%;" onclick="saveTarget()">Simpan Target</button>
            ${savedTarget ? `
                <div class="target-display" style="margin-top:14px; padding:14px; background:rgba(68,161,164,0.1); border-radius:8px; border:1px solid var(--primary); text-align:center;">
                    <div class="target-value" style="font-size:18px; font-weight:700; color:var(--primary);">${savedTarget.description || 'Target ditetapkan'}</div>
                    <div style="font-size:12px; opacity:0.6;">Target berat: ${savedTarget.targetWeight} kg • ${savedTarget.period} bulan</div>
                </div>
            ` : ''}
        </div>
    `;
}

function saveTarget() {
    const targetWeight = document.getElementById('targetWeight').value;
    const period = document.getElementById('targetPeriod').value;
    const description = document.getElementById('targetDesc').value;
    if (!targetWeight) { alert('Silakan masukkan target berat badan!'); return; }
    const target = {
        targetWeight: parseFloat(targetWeight),
        period: period,
        description: description || `Target berat ${targetWeight} kg dalam ${period} bulan`,
        createdAt: new Date().toISOString()
    };
    saveHealthTarget(target);
    alert('Target kesehatan berhasil disimpan!');
    renderDailyContent();
}

let selectedMenus = [];

function renderDailyContent() {
    if (!hasPremiumAccess()) {
        document.getElementById('dailyContent').innerHTML = `
            <div class="locked-overlay">
                <div class="lock-icon">🔒</div>
                <h4>Akses Premium Diperlukan</h4>
                <p>Fitur Input Harian hanya tersedia pada hari H konsultasi sesuai jadwal booking Anda.</p>
                <button class="btn-primary" onclick="switchTab('schedule', document.querySelector('.consult-tab[onclick*=\\'schedule\\']'))">Cek Jadwal Saya</button>
            </div>
        `;
        return;
    }
    const doctor = getPremiumDoctor();
    const today = getToday();
    const weekDates = getDateRange(today, 7);
    
    document.getElementById('dailyContent').innerHTML = `
        <div style="background:rgba(255,215,0,0.08); border-left:4px solid #FFD700; border-radius:8px; padding:12px 16px; margin-bottom:20px;">
            <p style="font-size:14px; color:#FFD700; margin:0;">
                <strong>Dokter Anda:</strong> ${doctor} — Data menu akan dipantau langsung oleh dokter
            </p>
        </div>
        ${renderTargetInput()}
        <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 5px; color: white;">Input Menu Harian</h2>
        <p style="opacity: 0.6; margin-bottom: 20px; font-size: 14px;">Pilih menu makanan yang kamu konsumsi setiap hari (bisa pilih lebih dari 1).</p>
        <div style="background:rgba(255,255,255,0.04); border-radius:12px; padding:20px; margin-bottom:20px; border:1px solid rgba(255,255,255,0.06);">
            <label style="display:block; font-weight:600; margin-bottom:10px; font-size:14px;">Pilih Tanggal (7 hari ke depan dari hari ini)</label>
            <input type="date" id="dailyDate" class="booking-input" style="width:100%; padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white;"
                   min="${today}" max="${weekDates[weekDates.length - 1]}" value="${today}" onchange="onDateChange(this.value)">
            <p style="font-size:12px; opacity:0.5; margin-top:6px;">${formatDateIndonesia(today)} - ${formatDateIndonesia(weekDates[weekDates.length - 1])}</p>
        </div>
        <div style="background:rgba(255,255,255,0.04); border-radius:12px; padding:20px; margin-bottom:20px; border:1px solid rgba(255,255,255,0.06);">
            <label style="display:block; font-weight:600; margin-bottom:12px; font-size:14px;">Pilih Menu (Klik untuk pilih/batalkan)</label>
            <div class="menu-select-grid" id="menuGrid">
                ${menuData.map((m, i) => `
                    <div class="menu-option" onclick="toggleMenu(${i})" data-index="${i}">
                        <div class="menu-name" style="font-size:16px; font-weight:600; margin-bottom:4px;">${m.name}</div>
                        <div class="menu-cal" style="font-size:13px; opacity:0.7;">${m.calories} kal</div>
                    </div>
                `).join('')}
            </div>
            <div id="selectedMenusContainer">
                <div class="selected-menus-list" id="selectedMenusList" style="padding:12px; background:rgba(0,0,0,0.15); border-radius:8px; min-height:40px;">
                    <span style="opacity:0.4; font-size:13px;">Belum ada menu dipilih</span>
                </div>
                <div style="margin-top:12px; padding:12px 16px; background:rgba(0,0,0,0.15); border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:600; font-size:14px;">Total Kalori</span>
                    <span id="totalCaloriesDisplay" style="font-size:22px; font-weight:700; color:var(--primary);">0</span>
                </div>
            </div>
            <button class="btn-primary" style="width:100%; margin-top:16px;" onclick="saveDailyMenu()">Simpan Menu Hari Ini</button>
        </div>
        <div style="background:rgba(255,255,255,0.04); border-radius:12px; padding:20px; border:1px solid rgba(255,255,255,0.06);">
            <label style="display:block; font-weight:600; margin-bottom:12px; font-size:14px;">Menu Minggu Ini</label>
            <div class="daily-menu-grid" id="weeklyMenuGrid"></div>
        </div>
    `;
    loadMenusForDate(today);
    renderWeeklyCalendar(today);
}

function toggleMenu(index) {
    const menu = menuData[index];
    const existingIndex = selectedMenus.findIndex(m => m.name === menu.name);
    if (existingIndex >= 0) {
        selectedMenus.splice(existingIndex, 1);
        document.querySelector(`.menu-option[data-index="${index}"]`).classList.remove('selected');
    } else {
        selectedMenus.push({ ...menu });
        document.querySelector(`.menu-option[data-index="${index}"]`).classList.add('selected');
    }
    updateSelectedMenusDisplay();
}

function updateSelectedMenusDisplay() {
    const container = document.getElementById('selectedMenusList');
    const totalDisplay = document.getElementById('totalCaloriesDisplay');
    if (selectedMenus.length === 0) {
        container.innerHTML = '<span style="opacity:0.4; font-size:13px;">Belum ada menu dipilih</span>';
        totalDisplay.textContent = '0';
        return;
    }
    let totalCal = 0;
    let html = '';
    selectedMenus.forEach((m, i) => {
        totalCal += m.calories;
        html += `<span class="menu-tag">${m.name} (${m.calories} kal) <span class="remove-menu" onclick="removeMenu(${i})">×</span></span>`;
    });
    container.innerHTML = html;
    totalDisplay.textContent = totalCal;
}

function removeMenu(index) {
    const menu = selectedMenus[index];
    selectedMenus.splice(index, 1);
    const menuIndex = menuData.findIndex(m => m.name === menu.name);
    if (menuIndex >= 0) {
        document.querySelector(`.menu-option[data-index="${menuIndex}"]`)?.classList.remove('selected');
    }
    updateSelectedMenusDisplay();
}

function onDateChange(date) {
    loadMenusForDate(date);
    renderWeeklyCalendar(date);
}

function loadMenusForDate(date) {
    const menus = getDailyMenus();
    selectedMenus = [];
    document.querySelectorAll('.menu-option').forEach(el => el.classList.remove('selected'));
    if (menus[date]) {
        selectedMenus = menus[date].map(m => ({ ...m }));
        selectedMenus.forEach(m => {
            const idx = menuData.findIndex(d => d.name === m.name);
            if (idx >= 0) {
                document.querySelector(`.menu-option[data-index="${idx}"]`)?.classList.add('selected');
            }
        });
    }
    updateSelectedMenusDisplay();
}

function saveDailyMenu() {
    if (selectedMenus.length === 0) { alert('Silakan pilih minimal 1 menu makanan!'); return; }
    const date = document.getElementById('dailyDate').value;
    if (!date) { alert('Silakan pilih tanggal!'); return; }
    const menus = getDailyMenus();
    menus[date] = selectedMenus.map(m => ({ ...m, timestamp: new Date().toISOString() }));
    saveDailyMenus(menus);
    
    showToast(selectedMenus.length + ' menu berhasil disimpan!');
    
    renderWeeklyCalendar(date);
    renderWeeklyContent();
}

function showToast(message) {
    const oldToast = document.querySelector('.custom-toast');
    if (oldToast) oldToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 14px 28px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        font-size: 15px;
        animation: fadeInUp 0.4s ease;
        border: 1px solid rgba(255,255,255,0.1);
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

function renderWeeklyCalendar(selectedDate) {
    const today = getToday();
    const weekDates = getDateRange(today, 7);
    const menus = getDailyMenus();
    const grid = document.getElementById('weeklyMenuGrid');
    if (!grid) return;
    
    if (!selectedDate) {
        selectedDate = document.getElementById('dailyDate')?.value || today;
    }
    
    grid.innerHTML = weekDates.map((date, i) => {
        const dayNumber = i + 1;
        const isToday = date === today;
        const isActive = date === selectedDate;
        const hasMenu = menus[date] && menus[date].length > 0;
        const count = hasMenu ? menus[date].length : 0;
        const totalCal = hasMenu ? menus[date].reduce((sum, m) => sum + m.calories, 0) : 0;
        
        let activeStyle = '';
        if (isActive) {
            activeStyle = 'border: 3px solid #FFD700; background: rgba(255,215,0,0.15); box-shadow: 0 0 20px rgba(255,215,0,0.15); transform: scale(1.05);';
        }
        
        return `
            <div class="daily-menu-item ${isToday ? 'today' : ''} ${hasMenu ? 'has-menu' : ''}"
                 style="${activeStyle} border-radius:10px; padding:12px 8px; text-align:center; cursor:pointer; transition:0.3s;"
                 onclick="document.getElementById('dailyDate').value='${date}'; onDateChange('${date}')">
                <div class="day" style="font-size:13px; font-weight:700; opacity:0.8;">Hari ${dayNumber}</div>
                <div class="menu-count" style="font-size:11px; color:var(--primary); margin-top:4px;">${hasMenu ? count + ' menu' : 'Kosong'}</div>
                ${hasMenu ? `<div style="font-size:10px; color:var(--primary); opacity:0.7; margin-top:2px;">${totalCal} kal</div>` : ''}
                ${isActive ? `<div style="font-size:9px; color:#FFD700; margin-top:4px; font-weight:600;">Aktif</div>` : ''}
            </div>
        `;
    }).join('');
}

function renderWeeklyContent() {
    if (!hasPremiumAccess()) {
        document.getElementById('weeklyContent').innerHTML = `
            <div class="locked-overlay">
                <div class="lock-icon">🔒</div>
                <h4>Akses Premium Diperlukan</h4>
                <p>Fitur Rekap Mingguan hanya tersedia pada hari H konsultasi sesuai jadwal booking Anda.</p>
                <button class="btn-primary" onclick="switchTab('schedule', document.querySelector('.consult-tab[onclick*=\\'schedule\\']'))">Cek Jadwal Saya</button>
            </div>
        `;
        return;
    }
    const doctor = getPremiumDoctor();
    const today = getToday();
    const weekDates = getDateRange(today, 7);
    const menus = getDailyMenus();
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const target = getHealthTarget();
    let totalCal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    let dayData = [];
    let hasData = false;
    weekDates.forEach((date, i) => {
        let dayCal = 0, dayProtein = 0, dayCarbs = 0, dayFat = 0;
        if (menus[date] && menus[date].length > 0) {
            hasData = true;
            menus[date].forEach(m => {
                dayCal += m.calories;
                dayProtein += m.protein || 0;
                dayCarbs += m.carbs || 0;
                dayFat += m.fat || 0;
            });
            totalCal += dayCal;
            totalProtein += dayProtein;
            totalCarbs += dayCarbs;
            totalFat += dayFat;
        }
        dayData.push({ day: days[i % 7], cal: dayCal, date: date });
    });
    const daysWithData = dayData.filter(d => d.cal > 0).length;
    const avgCal = hasData && daysWithData > 0 ? Math.round(totalCal / daysWithData) : 0;
    const reportData = {
        week: weekDates,
        totalCal: totalCal,
        avgCal: avgCal,
        totalProtein: Math.round(totalProtein),
        totalCarbs: Math.round(totalCarbs),
        totalFat: Math.round(totalFat),
        dayData: dayData,
        hasData: hasData,
        daysWithData: daysWithData,
        target: target,
        generatedAt: new Date().toISOString()
    };
    saveWeeklyReport(reportData);
    let html = `
        <div style="background:rgba(255,215,0,0.08); border-left:4px solid #FFD700; border-radius:8px; padding:12px 16px; margin-bottom:20px;">
            <p style="font-size:14px; color:#FFD700; margin:0;">
                <strong>Dokter Anda:</strong> ${doctor} — Rekap mingguan akan dievaluasi oleh dokter
            </p>
        </div>
        <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 5px; color: white;">Rekap Gizi Mingguan</h2>
        <p style="opacity: 0.6; margin-bottom: 20px; font-size: 14px;">Ringkasan kalori dan nutrisi selama 7 hari terakhir</p>
    `;
    if (!hasData) {
        html += `<div class="weekly-summary"><p style="text-align:center; opacity:0.5; padding:40px;">Belum ada data menu mingguan. Mulai input menu harianmu!</p></div>`;
        document.getElementById('weeklyContent').innerHTML = html;
        return;
    }
    let calStatus = '', calColor = '';
    if (avgCal < 1200) { calStatus = 'Sangat Rendah (Risiko Malnutrisi)'; calColor = '#ff6b6b'; }
    else if (avgCal >= 1200 && avgCal < 1500) { calStatus = 'Rendah (Perlu Ditingkatkan)'; calColor = '#ffa94d'; }
    else if (avgCal >= 1500 && avgCal <= 2000) { calStatus = 'Normal (Baik)'; calColor = '#4CAF50'; }
    else if (avgCal > 2000 && avgCal <= 2500) { calStatus = 'Tinggi (Perlu Diperhatikan)'; calColor = '#ffa94d'; }
    else { calStatus = 'Sangat Tinggi (Perlu Dikurangi)'; calColor = '#ff6b6b'; }
    const maxCal = Math.max(...dayData.map(d => d.cal), 100);
    html += `
        <div class="weekly-summary" style="background:rgba(255,255,255,0.04); border-radius:12px; padding:24px; border:1px solid rgba(255,255,255,0.06);">
            <h4 style="margin-bottom:16px; font-size:16px; font-weight:600;">Ringkasan 7 Hari</h4>
            <div class="weekly-stats" style="display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:16px;">
                <div class="weekly-stat-item" style="text-align:center; padding:12px; background:rgba(0,0,0,0.15); border-radius:10px;">
                    <div class="stat-value" style="font-size:24px; font-weight:700; color:var(--primary);">${totalCal}</div>
                    <div class="stat-label" style="font-size:12px; opacity:0.6;">Total Kalori</div>
                </div>
                <div class="weekly-stat-item" style="text-align:center; padding:12px; background:rgba(0,0,0,0.15); border-radius:10px;">
                    <div class="stat-value" style="font-size:24px; font-weight:700; color:var(--primary);">${Math.round(totalProtein)}g</div>
                    <div class="stat-label" style="font-size:12px; opacity:0.6;">Protein</div>
                </div>
                <div class="weekly-stat-item" style="text-align:center; padding:12px; background:rgba(0,0,0,0.15); border-radius:10px;">
                    <div class="stat-value" style="font-size:24px; font-weight:700; color:var(--primary);">${Math.round(totalCarbs)}g</div>
                    <div class="stat-label" style="font-size:12px; opacity:0.6;">Karbohidrat</div>
                </div>
                <div class="weekly-stat-item" style="text-align:center; padding:12px; background:rgba(0,0,0,0.15); border-radius:10px;">
                    <div class="stat-value" style="font-size:24px; font-weight:700; color:var(--primary);">${Math.round(totalFat)}g</div>
                    <div class="stat-label" style="font-size:12px; opacity:0.6;">Lemak</div>
                </div>
            </div>
            <div style="text-align:center; padding:4px 0; font-size:13px; opacity:0.5;">${daysWithData} hari dari 7 hari telah diisi menu</div>
            ${target ? `
                <div style="background:rgba(255,215,0,0.06); border:1px solid rgba(255,215,0,0.15); border-radius:8px; padding:14px; margin:16px 0;">
                    <p style="font-size:14px; color:#FFD700; margin:0;"><strong>Target Kesehatan:</strong> ${target.description}</p>
                    <p style="font-size:13px; opacity:0.6; margin:4px 0 0 0;">Target berat: ${target.targetWeight} kg • ${target.period} bulan</p>
                </div>
            ` : ''}
            <h5 style="margin:16px 0 12px; font-size:14px; font-weight:600;">Grafik Kalori Harian</h5>
            <div class="chart-bar-group" style="display:flex; justify-content:space-between; align-items:flex-end; height:140px; padding:8px 0; gap:6px;">
                ${dayData.map(d => `
                    <div class="chart-bar-item" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                        <div class="chart-bar" style="width:100%; max-width:32px; background:var(--primary); border-radius:4px 4px 0 0; height: ${maxCal > 0 ? Math.max((d.cal / maxCal * 100), 5) : 5}%; min-height:5px;"></div>
                        <div class="chart-bar-label" style="font-size:10px; opacity:0.6;">${d.day}</div>
                        <div class="chart-bar-label" style="font-size:8px; opacity:0.4;">${d.cal}</div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top:16px; padding:16px; background:rgba(0,0,0,0.15); border-radius:8px;">
                <p style="font-size:14px; margin:0;"><strong>Rata-rata kalori harian:</strong> ${avgCal} kalori <span style="color:${calColor};">(${calStatus})</span></p>
                <p style="font-size:14px; margin-top:8px;">
                    <strong>Analisis Dokter:</strong>
                    ${totalProtein < 50 ? ' Kurang protein. Tambahkan lauk hewani!' : ''}
                    ${totalCarbs > 300 ? ' Karbohidrat berlebih. Kurangi nasi/mie!' : ''}
                    ${totalFat > 70 ? ' Lemak tinggi. Kurangi makanan digoreng!' : ''}
                    ${totalProtein >= 50 && totalCarbs <= 300 && totalFat <= 70 ? ' Komposisi gizi seimbang. Pertahankan!' : ''}
                    ${avgCal < 1200 ? ' Kalori terlalu rendah. Segera konsultasikan dengan dokter!' : ''}
                    ${avgCal > 2500 ? ' Kalori terlalu tinggi. Perhatikan porsi makan!' : ''}
                </p>
            </div>
            <button class="btn-primary" style="width:100%; margin-top:16px;" onclick="openConsultChat('${doctor}')">Konsultasikan dengan Dokter</button>
        </div>
    `;
    document.getElementById('weeklyContent').innerHTML = html;
}

function openConsultChat(doctorName) {
    document.getElementById('consultDocName').textContent = doctorName;
    document.getElementById('chatDocName').textContent = doctorName;
    document.getElementById('consultModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = `
        <div class="msg-system"><span>Sistem JagaTubuh: Berhasil menghubungkan dengan <strong>${doctorName}</strong>.</span></div>
        <div class="msg-system" id="systemHealthData"><span>Memuat data kesehatan Anda...</span></div>
        <div class="msg-system" id="targetDataDisplay"><span>Memuat target kesehatan...</span></div>
        <div class="msg-system" id="weeklyReportData"><span>Memuat rekap gizi mingguan...</span></div>
    `;
    setTimeout(() => {
        const userData = JSON.parse(localStorage.getItem('jagaTubuhResult'));
        const healthDataEl = document.getElementById('systemHealthData');
        if (userData) {
            let healthText = 'Hasil Cek Kesehatan Anda:<br>BMI: ' + userData.bmi + '<br>';
            if (userData.healthHistory?.length > 0) healthText += 'Riwayat: ' + userData.healthHistory.join(', ') + '<br>';
            if (userData.foodRestrictions?.length > 0) healthText += 'Alergi/Pantangan: ' + userData.foodRestrictions.join(', ');
            healthDataEl.innerHTML = `<span>${healthText}</span>`;
        } else {
            healthDataEl.innerHTML = `<span>Data Cek Kesehatan belum diisi. Silakan lengkapi di halaman Cek Kesehatan.</span>`;
        }
        const target = getHealthTarget();
        const targetEl = document.getElementById('targetDataDisplay');
        if (target) {
            targetEl.innerHTML = `<span>Target Kesehatan: ${target.description} (${target.targetWeight} kg dalam ${target.period} bulan)</span>`;
        } else {
            targetEl.innerHTML = `<span>Belum ada target kesehatan. Silakan set target di Input Harian.</span>`;
        }
        const report = getWeeklyReport();
        const reportEl = document.getElementById('weeklyReportData');
        if (report && report.hasData && report.daysWithData > 0) {
            let reportText = 'Rekap Gizi Mingguan:<br>Total Kalori: ' + report.totalCal + ' kalori (' + report.daysWithData + ' hari diisi)<br>Rata-rata: ' + report.avgCal + ' kalori/hari<br>Protein: ' + report.totalProtein + 'g | Karbohidrat: ' + report.totalCarbs + 'g | Lemak: ' + report.totalFat + 'g<br>';
            let status = '';
            if (report.avgCal < 1200) status = 'Sangat Rendah';
            else if (report.avgCal >= 1200 && report.avgCal < 1500) status = 'Rendah';
            else if (report.avgCal >= 1500 && report.avgCal <= 2000) status = 'Normal';
            else if (report.avgCal > 2000 && report.avgCal <= 2500) status = 'Tinggi';
            else status = 'Sangat Tinggi';
            reportText += 'Status: ' + status;
            reportEl.innerHTML = `<span>${reportText}</span>`;
        } else {
            reportEl.innerHTML = `<span>Belum ada data menu mingguan. Mulai input menu harian!</span>`;
        }
    }, 500);
}

function closeConsultModal() {
    document.getElementById('consultModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (msg === '') return;
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `<div class="msg-user"><span>${msg}</span></div>`;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
    setTimeout(() => {
        const responses = [
            'Terima kasih atas informasinya. Saya akan analisis data menu mingguan Anda.',
            'Berdasarkan rekap gizi Anda, saya sarankan menambah asupan protein dan mengurangi karbohidrat sederhana.',
            'Hasil analisis menunjukkan pola makan yang cukup baik. Pertahankan konsumsi sayur dan buah!',
            'Saya rekomendasikan untuk minggu depan: kurangi gula dan perbanyak serat.',
            'Terima kasih sudah berkonsultasi. Jaga terus pola makan sehat!',
            'Saya lihat target kesehatan Anda. Mari kita susun menu yang sesuai!'
        ];
        const reply = responses[Math.floor(Math.random() * responses.length)];
        chatBox.innerHTML += `<div class="msg-system"><span>${reply}</span></div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1500);
}


document.addEventListener('DOMContentLoaded', function() {

    
    document.getElementById('bookingModal').addEventListener('click', function(e) {
        if (e.target === this) closeBookingModal();
    });
    document.getElementById('consultModal').addEventListener('click', function(e) {
        if (e.target === this) closeConsultModal();
    });
    
    const hasAccess = hasPremiumAccess();
    const dailyTab = document.getElementById('dailyTab');
    const weeklyTab = document.getElementById('weeklyTab');
    
    if (hasAccess) {
        if (dailyTab) {
            dailyTab.classList.remove('locked');
            dailyTab.style.pointerEvents = 'auto';
            dailyTab.style.opacity = '1';
        }
        if (weeklyTab) {
            weeklyTab.classList.remove('locked');
            weeklyTab.style.pointerEvents = 'auto';
            weeklyTab.style.opacity = '1';
        }
    } else {
        if (dailyTab) {
            dailyTab.classList.add('locked');
            dailyTab.style.pointerEvents = 'none';
            dailyTab.style.opacity = '0.5';
        }
        if (weeklyTab) {
            weeklyTab.classList.add('locked');
            weeklyTab.style.pointerEvents = 'none';
            weeklyTab.style.opacity = '0.5';
        }
    }
    
    renderSchedule();
});

window.searchDoctors = searchDoctors;
window.filterDoctors = filterDoctors;
window.switchTab = switchTab;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.closeBookingModalAndSave = closeBookingModalAndSave;
window.goToStep1 = goToStep1;
window.goToStep2 = goToStep2;
window.goToStep3 = goToStep3;
window.goToStep4 = goToStep4;
window.goToStep5 = goToStep5;
window.goToStep6 = goToStep6;
window.selectTimeSlot = selectTimeSlot;
window.selectPaymentMethod = selectPaymentMethod;
window.simulatePayment = simulatePayment;
window.confirmPayment = confirmPayment;
window.openConsultChat = openConsultChat;
window.closeConsultModal = closeConsultModal;
window.sendChatMessage = sendChatMessage;
window.toggleMenu = toggleMenu;
window.removeMenu = removeMenu;
window.onDateChange = onDateChange;
window.saveDailyMenu = saveDailyMenu;
window.saveTarget = saveTarget;
window.loadMenusForDate = loadMenusForDate;
window.renderDailyContent = renderDailyContent;
window.renderWeeklyContent = renderWeeklyContent;
window.renderSchedule = renderSchedule;