const DOCTOR_STORAGE = {
    REGISTRATIONS: 'jagaTubuhDoctorRegistrations',
    CURRENT_DOCTOR: 'jagaTubuhCurrentDoctor',
    DOCTOR_SERVICES: 'jagaTubuhDoctorServices',
    DOCTOR_SCHEDULE: 'jagaTubuhDoctorSchedule',
    DOCTOR_APPOINTMENTS: 'jagaTubuhDoctorAppointments'
};

const DEFAULT_DOCTOR = {
    id: 'dr-andini-001',
    name: 'dr. Andini Putri, Sp.GK',
    specialty: 'Ahli Gizi Klinis',
    location: 'Jakarta',
    experience: '7 Tahun',
    education: 'S2 Gizi Klinis - UI',
    hospital: 'RSUP Nasional',
    about: 'Spesialis gizi klinis dengan pengalaman 7 tahun di rumah sakit terkemuka. Berkomitmen membantu pasien mencapai pola makan sehat yang berkelanjutan.',
    isVerified: true,
    verificationStatus: 'verified',
    joinedDate: '2026-01-15',
    rating: 4.9,
    totalReviews: 123,
    isOpen: true,
    profilePhoto: null
};

const DEFAULT_SERVICES = [
    { id: 'svc-1', name: 'Konsultasi Gizi', duration: 60, price: 100000, icon: 'fa-utensils', isActive: true },
    { id: 'svc-2', name: 'Konsultasi Intensif', duration: 90, price: 150000, icon: 'fa-heartbeat', isActive: true },
    { id: 'svc-3', name: 'Review Meal Plan', duration: 30, price: 50000, icon: 'fa-clipboard-list', isActive: true }
];

const DEFAULT_SCHEDULE = [
    { time: '09.00', status: 'available' },
    { time: '10.00', status: 'available' },
    { time: '11.00', status: 'booked' },
    { time: '13.00', status: 'available' },
    { time: '14.00', status: 'available' },
    { time: '15.00', status: 'available' }
];

const DEFAULT_APPOINTMENTS = [
    { id: 'apt-1', patient: 'Siti Rahma', time: '09.00', service: 'Konsultasi Gizi', status: 'confirmed' },
    { id: 'apt-2', patient: 'Budi Prasetyo', time: '11.00', service: 'Konsultasi Intensif', status: 'confirmed' },
    { id: 'apt-3', patient: 'Andi Dharma', time: '15.00', service: 'Review Meal Plan', status: 'pending' }
];

function initDoctorData() {
    if (!localStorage.getItem(DOCTOR_STORAGE.DOCTOR_SERVICES)) {
        localStorage.setItem(DOCTOR_STORAGE.DOCTOR_SERVICES, JSON.stringify(DEFAULT_SERVICES));
    }
    if (!localStorage.getItem(DOCTOR_STORAGE.DOCTOR_SCHEDULE)) {
        localStorage.setItem(DOCTOR_STORAGE.DOCTOR_SCHEDULE, JSON.stringify(DEFAULT_SCHEDULE));
    }
    if (!localStorage.getItem(DOCTOR_STORAGE.DOCTOR_APPOINTMENTS)) {
        localStorage.setItem(DOCTOR_STORAGE.DOCTOR_APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
    }
    if (!localStorage.getItem(DOCTOR_STORAGE.CURRENT_DOCTOR)) {
        localStorage.setItem(DOCTOR_STORAGE.CURRENT_DOCTOR, JSON.stringify(DEFAULT_DOCTOR));
    }
}

function getDoctorData() {
    return JSON.parse(localStorage.getItem(DOCTOR_STORAGE.CURRENT_DOCTOR)) || DEFAULT_DOCTOR;
}

function getDoctorServices() {
    return JSON.parse(localStorage.getItem(DOCTOR_STORAGE.DOCTOR_SERVICES)) || DEFAULT_SERVICES;
}

function getDoctorSchedule() {
    return JSON.parse(localStorage.getItem(DOCTOR_STORAGE.DOCTOR_SCHEDULE)) || DEFAULT_SCHEDULE;
}

function getDoctorAppointments() {
    return JSON.parse(localStorage.getItem(DOCTOR_STORAGE.DOCTOR_APPOINTMENTS)) || DEFAULT_APPOINTMENTS;
}

function saveDoctorData(doctor) {
    localStorage.setItem(DOCTOR_STORAGE.CURRENT_DOCTOR, JSON.stringify(doctor));
}

function saveDoctorServices(services) {
    localStorage.setItem(DOCTOR_STORAGE.DOCTOR_SERVICES, JSON.stringify(services));
}

function saveDoctorSchedule(schedule) {
    localStorage.setItem(DOCTOR_STORAGE.DOCTOR_SCHEDULE, JSON.stringify(schedule));
}

function saveDoctorAppointments(appointments) {
    localStorage.setItem(DOCTOR_STORAGE.DOCTOR_APPOINTMENTS, JSON.stringify(appointments));
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function renderDoctorProfile() {
    const doctor = getDoctorData();
    const services = getDoctorServices().filter(s => s.isActive);
    const schedule = getDoctorSchedule();
    const container = document.getElementById('doctorContainer');
    
    if (!container) return;
    
    const statusText = doctor.isOpen ? '🟢 Open Konsultasi' : '🔴 Tidak Tersedia';
    const statusClass = doctor.isOpen ? 'open-text' : 'closed-text';
    const dotClass = doctor.isOpen ? 'open' : 'closed';
    
    let verificationBadge = '';
    if (doctor.verificationStatus === 'verified') {
        verificationBadge = `<span class="verified-badge"><i class="fas fa-check-circle"></i> Terverifikasi</span>`;
    } else if (doctor.verificationStatus === 'pending') {
        verificationBadge = `<span class="pending-badge"><i class="fas fa-clock"></i> Menunggu Verifikasi</span>`;
    }
    
    const servicesHTML = services.map(service => `
        <div class="doctor-service-item">
            <div class="service-icon">
                <i class="fas ${service.icon}"></i>
            </div>
            <div class="service-info">
                <h4>${service.name}</h4>
                <p>${service.duration} menit</p>
            </div>
            <div class="service-price">${formatPrice(service.price)}</div>
        </div>
    `).join('');
    
    const scheduleHTML = schedule.map(slot => {
        let statusLabel = '';
        let statusClass = '';
        if (slot.status === 'available') {
            statusLabel = '🟢 Tersedia';
            statusClass = 'available';
        } else if (slot.status === 'booked') {
            statusLabel = '🔴 Terbooking';
            statusClass = 'booked';
        } else {
            statusLabel = '⚪ Tidak Tersedia';
            statusClass = 'unavailable';
        }
        return `
            <div class="doctor-schedule-slot">
                <div class="slot-time">${slot.time}</div>
                <span class="slot-status ${statusClass}">${statusLabel}</span>
            </div>
        `;
    }).join('');
    
    const appointments = getDoctorAppointments();
    const todayCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
    
    container.innerHTML = `
        <div class="doctor-card">
            <div class="doctor-header">
                <div class="doctor-avatar-large">
                    ${doctor.name.charAt(0)}
                    <span class="status-dot ${doctor.isOpen ? 'online' : 'offline'}"></span>
                </div>
                <div class="doctor-header-info">
                    <h3>${doctor.name}</h3>
                    <div class="doctor-specialty">${doctor.specialty}</div>
                    <div class="doctor-location">
                        <i class="fas fa-map-marker-alt"></i> ${doctor.location}
                    </div>
                    ${verificationBadge}
                </div>
                <div class="doctor-header-right">
                    <div class="doctor-rating">
                        ⭐ ${doctor.rating} <span>(${doctor.totalReviews} ulasan)</span>
                    </div>
                    <div style="font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 4px;">
                        <i class="fas fa-calendar-alt"></i> Bergabung ${doctor.joinedDate}
                    </div>
                </div>
            </div>
            
            <div class="doctor-details-grid">
                <div class="doctor-detail-item">
                    <div class="detail-label">Pengalaman</div>
                    <div class="detail-value"><i class="fas fa-briefcase"></i> ${doctor.experience}</div>
                </div>
                <div class="doctor-detail-item">
                    <div class="detail-label">Pendidikan</div>
                    <div class="detail-value"><i class="fas fa-graduation-cap"></i> ${doctor.education}</div>
                </div>
                <div class="doctor-detail-item">
                    <div class="detail-label">Praktik di</div>
                    <div class="detail-value"><i class="fas fa-hospital"></i> ${doctor.hospital}</div>
                </div>
                <div class="doctor-detail-item">
                    <div class="detail-label">Konsultasi Hari Ini</div>
                    <div class="detail-value"><i class="fas fa-calendar-check"></i> ${todayCount} Pasien</div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px 18px; background: rgba(255,255,255,0.04); border-radius: 12px; border-left: 3px solid #44A1A4;">
                <p style="color: rgba(255,255,255,0.85); font-size: 14px; line-height: 1.7; margin: 0;">
                    ${doctor.about}
                </p>
            </div>
            
            ${services.length > 0 ? `
                <div class="doctor-services-title">
                    <i class="fas fa-hand-holding-heart"></i> Layanan Konsultasi
                </div>
                <div class="doctor-services-grid">
                    ${servicesHTML}
                </div>
            ` : ''}
            
            <div class="doctor-schedule-title">
                <i class="fas fa-calendar-day"></i> Jadwal Hari Ini
            </div>
            <div class="doctor-schedule-grid">
                ${scheduleHTML}
            </div>
            
            <div class="doctor-status-bar">
                <span class="status-label">Status Konsultasi:</span>
                <div class="status-indicator ${statusClass}">
                    <span class="dot ${dotClass}"></span>
                    ${statusText}
                </div>
                <button class="btn-consult-doctor" ${!doctor.isOpen ? 'disabled' : ''} onclick="openConsultationModal()">
                    <i class="fas fa-calendar-plus"></i> Konsultasi Sekarang
                </button>
            </div>
        </div>
    `;
}

function renderDoctorDashboard() {
    const doctor = getDoctorData();
    const appointments = getDoctorAppointments();
    const services = getDoctorServices();
    const container = document.getElementById('doctorDashboardContainer');
    
    if (!container) return;
    
    if (doctor.verificationStatus !== 'verified') {
        container.innerHTML = '';
        return;
    }
    
    const todayAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
    const completedAppointments = appointments.filter(a => a.status === 'confirmed');
    const totalRevenue = completedAppointments.reduce((sum, a) => {
        const service = services.find(s => s.name === a.service);
        return sum + (service ? service.price : 0);
    }, 0);
    
    const appointmentsHTML = appointments.slice(0, 5).map(apt => {
        let statusClass = '';
        let statusLabel = '';
        if (apt.status === 'confirmed') {
            statusClass = 'confirmed';
            statusLabel = '🟢 Confirmed';
        } else if (apt.status === 'pending') {
            statusClass = 'pending';
            statusLabel = '🟡 Menunggu';
        } else {
            statusClass = 'cancelled';
            statusLabel = '🔴 Dibatalkan';
        }
        return `
            <div class="dashboard-schedule-item">
                <div class="schedule-time">${apt.time}</div>
                <div class="schedule-patient">
                    <h4>${apt.patient}</h4>
                    <p>${apt.service}</p>
                </div>
                <span class="schedule-status-badge ${statusClass}">${statusLabel}</span>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="doctor-dashboard-wrapper" style="margin-top: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
                <div>
                    <h3 style="color: white; font-size: 22px;">
                        <i class="fas fa-user-md" style="color: #44A1A4;"></i> 
                        JagaTubuh Professional
                    </h3>
                    <p style="color: rgba(255,255,255,0.6); font-size: 14px;">
                        Halo, ${doctor.name} 👋
                        ${doctor.isOpen ? '<span style="color: #4CAF50; margin-left: 10px;">🟢 Status: Aktif</span>' : '<span style="color: #9CA3AF; margin-left: 10px;">🔴 Status: Tidak Aktif</span>'}
                    </p>
                </div>
                <button class="btn-manage-schedule" onclick="openManageScheduleModal()">
                    <i class="fas fa-calendar-edit"></i> Kelola Jadwal
                </button>
            </div>
            
            <div class="dashboard-stats-grid">
                <div class="dashboard-stat-card">
                    <span class="stat-icon"><i class="fas fa-calendar-check"></i></span>
                    <div class="stat-number">${todayAppointments.length}</div>
                    <span class="stat-label">Jadwal Hari Ini</span>
                </div>
                <div class="dashboard-stat-card">
                    <span class="stat-icon"><i class="fas fa-users"></i></span>
                    <div class="stat-number">${completedAppointments.length}</div>
                    <span class="stat-label">Pasien</span>
                </div>
                <div class="dashboard-stat-card">
                    <span class="stat-icon"><i class="fas fa-star"></i></span>
                    <div class="stat-number">${doctor.rating}</div>
                    <span class="stat-label">⭐ Rating (${doctor.totalReviews} ulasan)</span>
                </div>
                <div class="dashboard-stat-card">
                    <span class="stat-icon"><i class="fas fa-money-bill-wave"></i></span>
                    <div class="stat-number">${formatPrice(totalRevenue)}</div>
                    <span class="stat-label">Pendapatan</span>
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <h4 style="color: white; margin-bottom: 15px;">
                    <i class="fas fa-clock" style="color: #44A1A4;"></i> Jadwal Konsultasi
                </h4>
                ${appointmentsHTML || '<p style="color: rgba(255,255,255,0.4); text-align: center; padding: 20px;">Belum ada jadwal konsultasi</p>'}
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap;">
                <button class="btn-manage-schedule" onclick="openManageServicesModal()" style="background: #FF9A00;">
                    <i class="fas fa-hand-holding-heart"></i> Kelola Layanan
                </button>
                <button class="btn-manage-schedule" onclick="toggleDoctorAvailability()" style="background: ${doctor.isOpen ? '#9CA3AF' : '#4CAF50'};">
                    <i class="fas ${doctor.isOpen ? 'fa-pause' : 'fa-play'}"></i> 
                    ${doctor.isOpen ? 'Tutup Konsultasi' : 'Buka Konsultasi'}
                </button>
            </div>
        </div>
    `;
}

function toggleDoctorAvailability() {
    const doctor = getDoctorData();
    doctor.isOpen = !doctor.isOpen;
    saveDoctorData(doctor);
    
    showToast(doctor.isOpen ? '✅ Konsultasi dibuka' : '🔴 Konsultasi ditutup', 'success');
    renderDoctorProfile();
    renderDoctorDashboard();
}

function openConsultationModal() {
    const user = JSON.parse(localStorage.getItem('jagaTubuhCurrentUser'));
    const doctor = getDoctorData();
    const services = getDoctorServices().filter(s => s.isActive);
    
    if (!user) {
        showToast('⚠️ Silakan login terlebih dahulu', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'consultDoctorModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3><i class="fas fa-user-md" style="color: #44A1A4;"></i> Konsultasi dengan ${doctor.name}</h3>
                <button class="modal-close" onclick="closeModal('consultDoctorModal')">×</button>
            </div>
            <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.04); border-radius: 12px;">
                <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 8px;">
                    <i class="fas fa-user" style="color: #44A1A4;"></i> Anda: <strong style="color: white;">${user.name}</strong>
                </p>
                <p style="color: rgba(255,255,255,0.6); font-size: 14px;">
                    <i class="fas fa-envelope" style="color: #44A1A4;"></i> ${user.email}
                </p>
            </div>
            <div class="modal-form-group">
                <label><i class="fas fa-hand-holding-heart"></i> Pilih Layanan</label>
                <select id="consultServiceSelect">
                    ${services.map(s => `
                        <option value="${s.id}" data-price="${s.price}">
                            ${s.name} - ${s.duration} menit (${formatPrice(s.price)})
                        </option>
                    `).join('')}
                </select>
            </div>
            <div class="modal-form-group">
                <label><i class="fas fa-clock"></i> Pilih Jadwal</label>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                    ${getDoctorSchedule().filter(s => s.status === 'available').map(s => `
                        <button class="time-slot-btn" onclick="selectTimeSlot(this)" data-time="${s.time}" style="padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white; cursor: pointer; transition: all 0.3s;">
                            ${s.time}
                        </button>
                    `).join('')}
                </div>
                <input type="hidden" id="selectedTimeSlot" value="">
            </div>
            <div class="modal-form-group">
                <label><i class="fas fa-pencil-alt"></i> Pesan untuk Dokter</label>
                <textarea id="consultMessage" rows="3" placeholder="Ceritakan keluhan atau tujuan konsultasi Anda..." style="resize: vertical; width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white; font-size: 14px; outline: none; font-family: inherit;"></textarea>
            </div>
            <div class="modal-actions">
                <button class="btn-modal-secondary" onclick="closeModal('consultDoctorModal')" style="flex:1; padding:12px; border-radius:50px; border:1px solid rgba(255,255,255,0.2); background:transparent; color:white; font-weight:600; cursor:pointer;">Batal</button>
                <button class="btn-modal-primary" onclick="submitConsultation()" style="flex:2; padding:12px; border-radius:50px; border:none; background:linear-gradient(135deg, #FF9A00, #E68A00); color:white; font-weight:700; cursor:pointer; box-shadow:0 4px 15px rgba(255,154,0,0.3);">
                    <i class="fas fa-paper-plane"></i> Kirim Permintaan
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function selectTimeSlot(element) {
    document.querySelectorAll('.time-slot-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    element.style.borderColor = '#44A1A4';
    element.style.background = 'rgba(68,161,164,0.2)';
    document.getElementById('selectedTimeSlot').value = element.dataset.time;
}

function submitConsultation() {
    const serviceSelect = document.getElementById('consultServiceSelect');
    const message = document.getElementById('consultMessage');
    const timeSlot = document.getElementById('selectedTimeSlot');
    const user = JSON.parse(localStorage.getItem('jagaTubuhCurrentUser'));
    const services = getDoctorServices();
    
    if (!timeSlot.value) {
        showToast('⚠️ Silakan pilih jadwal terlebih dahulu', 'error');
        return;
    }
    
    const selectedService = services.find(s => s.id === serviceSelect.value);
    const appointments = getDoctorAppointments();
    
    appointments.push({
        id: 'apt-' + Date.now(),
        patient: user.name,
        time: timeSlot.value,
        service: selectedService.name,
        status: 'pending',
        message: message.value || 'Tidak ada pesan',
        createdAt: new Date().toISOString()
    });
    saveDoctorAppointments(appointments);
    
    const schedule = getDoctorSchedule();
    const slotIndex = schedule.findIndex(s => s.time === timeSlot.value);
    if (slotIndex !== -1 && schedule[slotIndex].status === 'available') {
        schedule[slotIndex].status = 'booked';
        saveDoctorSchedule(schedule);
    }
    
    showToast('✅ Permintaan konsultasi berhasil dikirim!', 'success');
    closeModal('consultDoctorModal');
    renderDoctorProfile();
    renderDoctorDashboard();
}

function openManageScheduleModal() {
    const schedule = getDoctorSchedule();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'manageScheduleModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3><i class="fas fa-calendar-edit" style="color: #44A1A4;"></i> Kelola Jadwal</h3>
                <button class="modal-close" onclick="closeModal('manageScheduleModal')">×</button>
            </div>
            <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 20px;">
                <i class="fas fa-info-circle"></i> Toggle ON/OFF untuk mengatur ketersediaan
            </p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                ${schedule.map((slot, index) => `
                    <div style="background: rgba(255,255,255,0.04); border-radius: 12px; padding: 15px; text-align: center; border: 1px solid ${slot.status === 'booked' ? '#ff6b6b' : 'rgba(255,255,255,0.1)'};">
                        <div style="font-size: 18px; font-weight: 700; color: white;">${slot.time}</div>
                        <div style="font-size: 12px; color: ${slot.status === 'available' ? '#4CAF50' : slot.status === 'booked' ? '#ff6b6b' : '#9CA3AF'}; margin: 8px 0;">
                            ${slot.status === 'available' ? '🟢 Tersedia' : slot.status === 'booked' ? '🔴 Terbooking' : '⚪ Tidak Tersedia'}
                        </div>
                        ${slot.status !== 'booked' ? `
                            <label class="toggle-switch">
                                <input type="checkbox" ${slot.status === 'available' ? 'checked' : ''} 
                                    onchange="toggleScheduleSlot(${index}, this.checked)" />
                                <span class="toggle-slider"></span>
                            </label>
                        ` : `
                            <div style="font-size: 11px; color: rgba(255,255,255,0.3);">
                                <i class="fas fa-lock"></i> Tidak bisa diubah
                            </div>
                        `}
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.04); border-radius: 12px;">
                <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0;">
                    <span style="color: #4CAF50;">🟢 Available</span> — Bisa dipesan &nbsp;|&nbsp;
                    <span style="color: #ff6b6b;">🔴 Booked</span> — Sudah dipesan &nbsp;|&nbsp;
                    <span style="color: #9CA3AF;">⚪ Unavailable</span> — Tidak tersedia
                </p>
            </div>
            <div class="modal-actions">
                <button class="btn-modal-primary" onclick="closeModal('manageScheduleModal'); renderDoctorProfile(); renderDoctorDashboard();" style="flex:1; padding:12px; border-radius:50px; border:none; background:linear-gradient(135deg, #FF9A00, #E68A00); color:white; font-weight:700; cursor:pointer;">
                    <i class="fas fa-check"></i> Selesai
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function toggleScheduleSlot(index, isChecked) {
    const schedule = getDoctorSchedule();
    if (schedule[index] && schedule[index].status !== 'booked') {
        schedule[index].status = isChecked ? 'available' : 'unavailable';
        saveDoctorSchedule(schedule);
    }
}

function openManageServicesModal() {
    const services = getDoctorServices();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'manageServicesModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 550px;">
            <div class="modal-header">
                <h3><i class="fas fa-hand-holding-heart" style="color: #44A1A4;"></i> Kelola Layanan</h3>
                <button class="modal-close" onclick="closeModal('manageServicesModal')">×</button>
            </div>
            <button class="btn-modal-primary" onclick="openAddServiceModal()" style="width: 100%; margin-bottom: 20px; padding:12px; border-radius:50px; border:none; background:linear-gradient(135deg, #FF9A00, #E68A00); color:white; font-weight:700; cursor:pointer;">
                <i class="fas fa-plus"></i> Tambah Layanan Baru
            </button>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${services.map((service, index) => `
                    <div style="background: rgba(255,255,255,0.04); border-radius: 12px; padding: 14px 16px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 15px;">
                        <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(68,161,164,0.15); display: flex; align-items: center; justify-content: center; font-size: 18px; color: #44A1A4;">
                            <i class="fas ${service.icon}"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; font-size: 15px;">${service.name}</div>
                            <div style="font-size: 12px; color: rgba(255,255,255,0.5);">${service.duration} menit · ${formatPrice(service.price)}</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <label class="toggle-switch">
                                <input type="checkbox" ${service.isActive ? 'checked' : ''} 
                                    onchange="toggleService(${index}, this.checked)" />
                                <span class="toggle-slider"></span>
                            </label>
                            <button onclick="deleteService(${index})" style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-size: 16px;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="modal-actions">
                <button class="btn-modal-primary" onclick="closeModal('manageServicesModal'); renderDoctorProfile();" style="flex:1; padding:12px; border-radius:50px; border:none; background:linear-gradient(135deg, #FF9A00, #E68A00); color:white; font-weight:700; cursor:pointer;">
                    <i class="fas fa-check"></i> Selesai
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function openAddServiceModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'addServiceModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3><i class="fas fa-plus" style="color: #44A1A4;"></i> Tambah Layanan</h3>
                <button class="modal-close" onclick="closeModal('addServiceModal')">×</button>
            </div>
            <form onsubmit="addNewService(event)">
                <div class="modal-form-group">
                    <label><i class="fas fa-tag"></i> Nama Layanan</label>
                    <input type="text" id="newServiceName" placeholder="Contoh: Konsultasi Gizi" required style="width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; font-size:14px; outline:none;" />
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="modal-form-group">
                        <label><i class="fas fa-clock"></i> Durasi (menit)</label>
                        <input type="number" id="newServiceDuration" placeholder="60" required style="width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; font-size:14px; outline:none;" />
                    </div>
                    <div class="modal-form-group">
                        <label><i class="fas fa-money-bill"></i> Harga (Rp)</label>
                        <input type="number" id="newServicePrice" placeholder="100000" required style="width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; font-size:14px; outline:none;" />
                    </div>
                </div>
                <div class="modal-form-group">
                    <label><i class="fas fa-icons"></i> Icon</label>
                    <select id="newServiceIcon" style="width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; font-size:14px; outline:none;">
                        <option value="fa-utensils">🍳 Utensils</option>
                        <option value="fa-heartbeat">❤️ Heartbeat</option>
                        <option value="fa-clipboard-list">📋 Clipboard</option>
                        <option value="fa-apple-alt">🍎 Apple</option>
                        <option value="fa-seedling">🌱 Seedling</option>
                        <option value="fa-dumbbell">🏋️ Dumbbell</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-modal-secondary" onclick="closeModal('addServiceModal')" style="flex:1; padding:12px; border-radius:50px; border:1px solid rgba(255,255,255,0.2); background:transparent; color:white; font-weight:600; cursor:pointer;">Batal</button>
                    <button type="submit" class="btn-modal-primary" style="flex:2; padding:12px; border-radius:50px; border:none; background:linear-gradient(135deg, #FF9A00, #E68A00); color:white; font-weight:700; cursor:pointer;">
                        <i class="fas fa-save"></i> Simpan Layanan
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function addNewService(event) {
    event.preventDefault();
    const services = getDoctorServices();
    
    const name = document.getElementById('newServiceName').value.trim();
    const duration = parseInt(document.getElementById('newServiceDuration').value);
    const price = parseInt(document.getElementById('newServicePrice').value);
    const icon = document.getElementById('newServiceIcon').value;
    
    if (!name || !duration || !price) {
        showToast('⚠️ Semua field harus diisi', 'error');
        return;
    }
    
    services.push({
        id: 'svc-' + Date.now(),
        name,
        duration,
        price,
        icon,
        isActive: true
    });
    saveDoctorServices(services);
    showToast('✅ Layanan berhasil ditambahkan', 'success');
    closeModal('addServiceModal');
    openManageServicesModal();
}

function toggleService(index, isChecked) {
    const services = getDoctorServices();
    if (services[index]) {
        services[index].isActive = isChecked;
        saveDoctorServices(services);
    }
}

function deleteService(index) {
    if (!confirm('Yakin ingin menghapus layanan ini?')) return;
    const services = getDoctorServices();
    services.splice(index, 1);
    saveDoctorServices(services);
    showToast('✅ Layanan dihapus', 'success');
    openManageServicesModal();
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #325E6A;
        color: white;
        padding: 14px 28px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 999999;
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        font-size: 14px;
        border: 1px solid ${type === 'success' ? '#4CAF50' : type === 'error' ? '#ff6b6b' : '#44A1A4'};
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        pointer-events: none;
        max-width: 90%;
        text-align: center;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function handleRegisterDoctor() {
    const user = JSON.parse(localStorage.getItem('jagaTubuhCurrentUser'));
    if (!user) {
        showToast('⚠️ Silakan login terlebih dahulu', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }
    openDoctorRegistrationModal(user);
}

function openDoctorRegistrationModal(user) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'registerDoctorModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3><i class="fas fa-user-md" style="color: #44A1A4;"></i> Daftar sebagai Ahli Gizi</h3>
                <button class="modal-close" onclick="closeModal('registerDoctorModal')">×</button>
            </div>
            <form onsubmit="submitDoctorRegistration(event)">
                <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-bottom: 20px;">
                    Lengkapi data berikut untuk mendaftar sebagai mitra profesional JagaTubuh
                </p>
                
                <h4 style="color: #44A1A4; margin-bottom: 15px;">📝 1. Buat Akun Profesional</h4>
                
                <div class="modal-form-group">
                    <label><i class="fas fa-user"></i> Nama Lengkap</label>
                    <input type="text" id="docRegName" value="${user.name || ''}" placeholder="Nama lengkap" required style="width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; font-size:14px; outline:none;" />
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="modal-form-group">
                        <label><i class="fas fa-envelope"></i> Email</label>
                        <input type="email" id="docRegEmail" value="${user.email || ''}" disabled style="width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.5); font-size:14px; outline:none;" />
                    </div>
                    <div class="modal-form-group">
                        <label><i class="fas fa-phone"></i> Nomor HP</label>
                        <input type="tel" id="docRegPhone" placeholder="081234567890" required style="width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; font-size:14px; outline:none;" />
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="modal-form-group">
                        <label><i class="fas fa-city"></i> Kota</label>
                        <input type="text" id="docRegCity" placeholder="Jakarta" required style="width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; font-size:14px; outline:none;" />
                    </div>
                    <div class="modal-form-group">
                        <label><i class="fas fa-stethoscope"></i> Spesialisasi</label>
                        <select id="docRegSpecialty" required style="width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; font-size:14px; outline:none;">
                            <option value="">Pilih Spesialisasi</option>
                            <option value="Gizi Klinis">Gizi Klinis</option>
                            <option value="Gizi Olahraga">Gizi Olahraga</option>
                            <option value="Gizi Anak">Gizi Anak</option>
                            <option value="Gizi Lansia">Gizi Lansia</option>
                            <option value="Diet Khusus">Diet Khusus</option>
                        </select>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="modal-form-group">
                        <label><i class="fas fa-briefcase"></i> Pengalaman (Tahun)</label>
                        <input type="number" id="docRegExperience" placeholder="5" min="0" required style="width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; font-size:14px; outline:none;" />
                    </div>
                    <div class="modal-form-group">
                        <label><i class="fas fa-graduation-cap"></i> Pendidikan</label>
                        <input type="text" id="docRegEducation" placeholder="S2 Gizi Klinis - UI" required style="width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; font-size:14px; outline:none;" />
                    </div>
                </div>
                
                <hr style="border-color: rgba(255,255,255,0.1); margin: 25px 0;" />
                
                <h4 style="color: #44A1A4; margin-bottom: 15px;">⭐ 2. Verifikasi Profesional</h4>
                <p style="color: rgba(255,255,255,0.4); font-size: 13px; margin-bottom: 15px;">
                    Upload dokumen berikut untuk verifikasi (STR, SIP, Sertifikat, CV, Identitas)
                </p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="background: rgba(255,255,255,0.04); border-radius: 10px; padding: 12px 14px; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-file-medical" style="color:#44A1A4; font-size:18px;"></i>
                            <div style="flex:1;"><div style="font-size:13px; font-weight:600; color:white;">STR</div><div style="font-size:10px; color:rgba(255,255,255,0.3);">Surat Tanda Registrasi</div></div>
                            <input type="file" accept=".pdf,.jpg,.png" style="max-width:80px; font-size:10px;" />
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.04); border-radius: 10px; padding: 12px 14px; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-file-signature" style="color:#44A1A4; font-size:18px;"></i>
                            <div style="flex:1;"><div style="font-size:13px; font-weight:600; color:white;">SIP</div><div style="font-size:10px; color:rgba(255,255,255,0.3);">Surat Izin Praktik</div></div>
                            <input type="file" accept=".pdf,.jpg,.png" style="max-width:80px; font-size:10px;" />
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.04); border-radius: 10px; padding: 12px 14px; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-certificate" style="color:#44A1A4; font-size:18px;"></i>
                            <div style="flex:1;"><div style="font-size:13px; font-weight:600; color:white;">Sertifikat</div><div style="font-size:10px; color:rgba(255,255,255,0.3);">Kompetensi</div></div>
                            <input type="file" accept=".pdf,.jpg,.png" style="max-width:80px; font-size:10px;" />
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.04); border-radius: 10px; padding: 12px 14px; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-file-alt" style="color:#44A1A4; font-size:18px;"></i>
                            <div style="flex:1;"><div style="font-size:13px; font-weight:600; color:white;">CV</div><div style="font-size:10px; color:rgba(255,255,255,0.3);">Curriculum Vitae</div></div>
                            <input type="file" accept=".pdf,.doc,.docx" style="max-width:80px; font-size:10px;" />
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.04); border-radius: 10px; padding: 12px 14px; border: 1px solid rgba(255,255,255,0.1); grid-column: span 2;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-id-card" style="color:#44A1A4; font-size:18px;"></i>
                            <div style="flex:1;"><div style="font-size:13px; font-weight:600; color:white;">Identitas</div><div style="font-size:10px; color:rgba(255,255,255,0.3);">KTP / Paspor</div></div>
                            <input type="file" accept=".jpg,.png" style="max-width:80px; font-size:10px;" />
                        </div>
                    </div>
                </div>
                
                <div style="background: rgba(255, 193, 7, 0.1); padding: 15px; border-radius: 12px; border-left: 4px solid #FFC107; margin: 15px 0;">
                    <p style="color: #FFC107; font-size: 14px; margin: 0;">
                        <i class="fas fa-clock"></i> Status: <strong>🟡 Menunggu Verifikasi</strong>
                    </p>
                    <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 5px 0 0;">
                        Dokumen akan diperiksa oleh tim admin dalam 1x24 jam
                    </p>
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="btn-modal-secondary" onclick="closeModal('registerDoctorModal')" style="flex:1; padding:12px; border-radius:50px; border:1px solid rgba(255,255,255,0.2); background:transparent; color:white; font-weight:600; cursor:pointer;">Batal</button>
                    <button type="submit" class="btn-modal-primary" style="flex:2; padding:12px; border-radius:50px; border:none; background:linear-gradient(135deg, #FF9A00, #E68A00); color:white; font-weight:700; cursor:pointer;">
                        <i class="fas fa-paper-plane"></i> Kirim Pendaftaran
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function submitDoctorRegistration(event) {
    event.preventDefault();
    
    const doctor = {
        name: document.getElementById('docRegName').value.trim(),
        email: document.getElementById('docRegEmail').value,
        phone: document.getElementById('docRegPhone').value.trim(),
        city: document.getElementById('docRegCity').value.trim(),
        specialty: document.getElementById('docRegSpecialty').value,
        experience: document.getElementById('docRegExperience').value + ' Tahun',
        education: document.getElementById('docRegEducation').value.trim(),
        isVerified: false,
        verificationStatus: 'pending',
        joinedDate: new Date().toISOString().split('T')[0],
        rating: 0,
        totalReviews: 0,
        isOpen: false,
        about: 'Menunggu verifikasi dari tim admin JagaTubuh.',
        hospital: 'Menunggu verifikasi',
        profilePhoto: null
    };
    
    if (!doctor.name || !doctor.phone || !doctor.city || !doctor.specialty || !doctor.experience || !doctor.education) {
        showToast('⚠️ Semua field harus diisi', 'error');
        return;
    }
    
    saveDoctorData(doctor);
    
    const registrations = JSON.parse(localStorage.getItem(DOCTOR_STORAGE.REGISTRATIONS) || '[]');
    registrations.push({
        ...doctor,
        registeredAt: new Date().toISOString()
    });
    localStorage.setItem(DOCTOR_STORAGE.REGISTRATIONS, JSON.stringify(registrations));
    
    showToast('✅ Pendaftaran berhasil! Menunggu verifikasi admin.', 'success');
    closeModal('registerDoctorModal');
    renderDoctorProfile();
    renderDoctorDashboard();
}

function checkDoctorStatus() {
    const doctor = getDoctorData();
    if (doctor.verificationStatus === 'verified') {
        renderDoctorDashboard();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initDoctorData();
    renderDoctorProfile();
    checkDoctorStatus();
    
    const registerBtn = document.getElementById('registerDoctorBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegisterDoctor);
    }
});