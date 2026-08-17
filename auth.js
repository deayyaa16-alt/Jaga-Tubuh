const STORAGE_KEYS = {
    USERS: 'jagaTubuhUsers',
    CURRENT_USER: 'jagaTubuhCurrentUser',
    BOOKINGS: 'jagaTubuhBookings',
    RESULT: 'jagaTubuhResult',
    DAILY_MENUS: 'jagaTubuhDailyMenus',
    WEEKLY_REPORT: 'jagaTubuhWeeklyReport',
    HEALTH_TARGET: 'jagaTubuhHealthTarget',
    SUPPORT_COUNTS: 'jagaTubuhSupportCounts',
    CHALLENGE_JOINED: 'jagaTubuhChallengeJoined',
    CHALLENGE_COUNT: 'jagaTubuhChallengeCount',
    COMMUNITY_POSTS: 'jagaTubuhCommunityPosts'
};

function clearAllDummyData() {
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.DAILY_MENUS);
    localStorage.removeItem(STORAGE_KEYS.WEEKLY_REPORT);
    localStorage.removeItem(STORAGE_KEYS.HEALTH_TARGET);
    localStorage.removeItem(STORAGE_KEYS.SUPPORT_COUNTS);
    localStorage.removeItem(STORAGE_KEYS.CHALLENGE_JOINED);
    localStorage.removeItem(STORAGE_KEYS.CHALLENGE_COUNT);
    localStorage.removeItem(STORAGE_KEYS.COMMUNITY_POSTS);
    localStorage.removeItem(STORAGE_KEYS.RESULT);
    localStorage.removeItem('jagaTubuhPrevScore');
    console.log('✅ Semua data dummy telah dihapus!');
}

function hasDummyData() {
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    return bookings.length > 0;
}

function registerUser(name, email, password) {
    let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return { success: false, message: "Email sudah terdaftar. Gunakan email lain." };
    }

    users.push({ 
        name, 
        email, 
        password, 
        registeredAt: new Date().toISOString() 
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    clearAllDummyData();
    
    return { success: true, message: "Akun berhasil dibuat! Silakan login." };
}

function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ 
            name: user.name, 
            email: user.email,
            registeredAt: user.registeredAt || new Date().toISOString()
        }));
        return { success: true, name: user.name };
    } else {
        const emailExists = users.some(u => u.email === email);
        if (emailExists) {
            return { success: false, message: "Password salah. Silakan coba lagi." };
        }
        return { success: false, message: "Email tidak terdaftar. Silakan daftar terlebih dahulu." };
    }
}

function logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.location.href = 'login.html';
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

function resetAllData() {
    if (confirm('⚠️ Yakin ingin mereset semua data? Ini akan menghapus semua progress Anda.')) {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        localStorage.removeItem('jagaTubuhPrevScore');
        alert('✅ Semua data telah direset!');
        window.location.href = 'index.html';
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
}

function updateUserName(newName) {
    const user = getCurrentUser();
    if (!user) return false;

    user.name = newName;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

    let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const index = users.findIndex(u => u.email === user.email);
    if (index !== -1) {
        users[index].name = newName;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    
    return true;
}