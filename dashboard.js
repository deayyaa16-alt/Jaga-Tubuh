function loadDashboardData() {
    const user = JSON.parse(localStorage.getItem('jagaTubuhCurrentUser'));
    const result = JSON.parse(localStorage.getItem('jagaTubuhResult'));
    const bookings = JSON.parse(localStorage.getItem('jagaTubuhBookings') || '[]');
    const target = JSON.parse(localStorage.getItem('jagaTubuhHealthTarget'));

    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = user.name || 'User';
    }
    const dashUserName = document.getElementById('dashUserName');
    if (dashUserName) {
        dashUserName.textContent = user.name || 'User';
    }
    const dashAvatar = document.getElementById('dashAvatar');
    const dashProfileName = document.getElementById('dashProfileName');
    const dashProfileEmail = document.getElementById('dashProfileEmail');
    const dashJoined = document.getElementById('dashJoined');
    const dashStatus = document.getElementById('dashStatus');
    const dashMemberStatus = document.getElementById('dashMemberStatus');

    if (dashAvatar) {
        dashAvatar.textContent = (user.name || 'U').charAt(0).toUpperCase();
    }
    if (dashProfileName) {
        dashProfileName.textContent = user.name || 'User';
    }
    if (dashProfileEmail) {
        dashProfileEmail.textContent = user.email || 'user@email.com';
    }
    if (dashJoined) {
        dashJoined.textContent = user.registeredAt ? 
            new Date(user.registeredAt).toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }) : 
            'Januari 2026';
    }
    if (dashStatus) {
        dashStatus.textContent = 'Premium';
    }
    if (dashMemberStatus) {
        dashMemberStatus.textContent = 'Member Premium';
    }

    const healthScore = document.getElementById('dashHealthScore');
    const dashWeight = document.getElementById('dashWeight');
    const dashConsultations = document.getElementById('dashConsultations');
    const dashTargetWeight = document.getElementById('dashTargetWeight');
    const dashHealthTrend = document.getElementById('dashHealthTrend');
    const dashWeightTrend = document.getElementById('dashWeightTrend');
    const dashConsultStatus = document.getElementById('dashConsultStatus');
    const dashTargetProgress = document.getElementById('dashTargetProgress');

    if (result && result.score) {
        healthScore.textContent = result.score;
        const prevScore = parseInt(localStorage.getItem('jagaTubuhPrevScore')) || result.score;
        const diff = result.score - prevScore;
        if (diff > 0) {
            dashHealthTrend.textContent = `↑ ${diff} poin`;
            dashHealthTrend.className = 'stat-change positive';
        } else if (diff < 0) {
            dashHealthTrend.textContent = `↓ ${Math.abs(diff)} poin`;
            dashHealthTrend.className = 'stat-change negative';
        } else {
            dashHealthTrend.textContent = '● Stabil';
            dashHealthTrend.className = 'stat-change neutral';
        }
        localStorage.setItem('jagaTubuhPrevScore', result.score);
    } else {
        healthScore.textContent = '-';
        dashHealthTrend.textContent = '● Belum ada data';
        dashHealthTrend.className = 'stat-change neutral';
    }

    if (result && result.currentWeight) {
        dashWeight.textContent = result.currentWeight + ' kg';
        dashWeightTrend.textContent = '● Terpantau';
        dashWeightTrend.className = 'stat-change neutral';
    } else {
        dashWeight.textContent = '-';
        dashWeightTrend.textContent = '● Belum ada data';
        dashWeightTrend.className = 'stat-change neutral';
    }

    const completedBookings = bookings.filter(b => b.status === 'completed');
    dashConsultations.textContent = completedBookings.length || '0';
    if (completedBookings.length > 0) {
        dashConsultStatus.textContent = '✅ ' + completedBookings.length + ' konsultasi selesai';
        dashConsultStatus.className = 'stat-change positive';
    } else {
        dashConsultStatus.textContent = '● Belum ada konsultasi';
        dashConsultStatus.className = 'stat-change neutral';
    }

    if (target && target.targetWeight) {
        dashTargetWeight.textContent = target.targetWeight + ' kg';
        dashTargetProgress.textContent = '🎯 Target ditetapkan';
        dashTargetProgress.className = 'stat-change positive';
    } else if (result && result.targetWeight) {
        dashTargetWeight.textContent = result.targetWeight + ' kg';
        dashTargetProgress.textContent = '🎯 Target dari Cek Kesehatan';
        dashTargetProgress.className = 'stat-change positive';
    } else {
        dashTargetWeight.textContent = '-';
        dashTargetProgress.textContent = '🎯 Belum ditentukan';
        dashTargetProgress.className = 'stat-change neutral';
    }

    const dashStreak = document.getElementById('dashStreak');
    const dashTotalCheck = document.getElementById('dashTotalCheck');

    const streak = Math.floor(Math.random() * 14) + 1;
    if (dashStreak) {
        dashStreak.textContent = streak;
    }

    if (result && result.totalCheck) {
        dashTotalCheck.textContent = result.totalCheck;
    } else {
        dashTotalCheck.textContent = '1';
    }
}