const membersData = [
    {
        id: 1,
        name: 'Andi Dharma',
        initials: 'AD',
        color: '#6F943B',
        badge: 'premium',
        since: '2025',
        testimoni: 'JagaTubuh membantu saya menurunkan 5kg dalam 2 bulan. Fitur Health Check sangat akurat.',
        healthScore: 85,
        targetWeight: '65 kg',
        streak: '7 hari',
        diet: 'Seimbang',
        filter: ['premium', 'diet']
    },
    {
        id: 2,
        name: 'Siti Rahma',
        initials: 'SR',
        color: '#8E44AD',
        badge: 'aktif',
        since: '2026',
        testimoni: 'Rekomendasi menu dari Ahli Gizi JagaTubuh sangat membantu saya mengatur pola makan sehari-hari.',
        healthScore: 78,
        targetWeight: '58 kg',
        streak: '4 hari',
        diet: 'Protein Tinggi',
        filter: ['aktif', 'protein']
    },
    {
        id: 3,
        name: 'Budi Prasetyo',
        initials: 'BP',
        color: '#2980B9',
        badge: 'premium',
        since: '2025',
        testimoni: 'Dashboard progress sangat motivasi. Saya jadi lebih konsisten menjaga kesehatan.',
        healthScore: 92,
        targetWeight: '72 kg',
        streak: '14 hari',
        diet: 'Keto',
        filter: ['premium', 'diet']
    },
    {
        id: 4,
        name: 'Dewi Lestari',
        initials: 'DL',
        color: '#E67E22',
        badge: 'aktif',
        since: '2026',
        testimoni: 'Komunitasnya sangat suportif! Saya dapat banyak tips sehat dari member lain.',
        healthScore: 70,
        targetWeight: '55 kg',
        streak: '3 hari',
        diet: 'Seimbang',
        filter: ['aktif']
    },
    {
        id: 5,
        name: 'Fajar Nugroho',
        initials: 'FN',
        color: '#2ECC71',
        badge: 'premium',
        since: '2024',
        testimoni: 'Sudah 1 tahun bersama JagaTubuh, berat badan ideal dan kesehatan meningkat pesat.',
        healthScore: 95,
        targetWeight: '68 kg',
        streak: '21 hari',
        diet: 'Protein Tinggi',
        filter: ['premium', 'protein']
    },
    {
        id: 6,
        name: 'Rina Anggraeni',
        initials: 'RA',
        color: '#F1C40F',
        badge: 'aktif',
        since: '2026',
        testimoni: 'Baru bergabung 1 bulan, tapi sudah banyak perubahan positif pada pola makan saya.',
        healthScore: 65,
        targetWeight: '60 kg',
        streak: '2 hari',
        diet: 'Seimbang',
        filter: ['aktif']
    }
];

let currentFilter = 'all';
let searchQuery = '';
let challengeJoined = JSON.parse(localStorage.getItem('jagaTubuhChallengeJoined')) || false;
let challengeCount = parseInt(localStorage.getItem('jagaTubuhChallengeCount')) || 312;
let supportCounts = JSON.parse(localStorage.getItem('jagaTubuhSupportCounts')) || {};

const groupsData = [
    {
        id: 1,
        name: 'Pejuang Defisit Kalori',
        icon: '🔥',
        description: 'Turun Berat Badan & Fat Loss',
        members: 142,
        category: 'defisit',
        color: '#FF6B35',
        isRecommended: true,
        chats: [
            { user: 'Andi Dharma', text: 'Guys, target turun 2kg bulan ini berhasil! Kuncinya kurangi gula.', time: Date.now() - 3600000 },
            { user: 'Budi Prasetyo', text: 'Wah mantap Mas Andi, saya baru mau mulai ikutan nih.', time: Date.now() - 3000000 },
            { user: 'Siti Rahma', text: 'Saya juga! minggu ini udah turun 0.5kg 💪', time: Date.now() - 2400000 }
        ]
    },
    {
        id: 2,
        name: 'Bulking & Nutrisi Otot',
        icon: '💪',
        description: 'Naik Berat Badan & Masa Otot',
        members: 89,
        category: 'bulking',
        color: '#2ECC71',
        isRecommended: false,
        chats: [
            { user: 'Fajar Nugroho', text: 'Protein shake + telur = best breakfast!', time: Date.now() - 7200000 },
            { user: 'Rina Anggraeni', text: 'Saya pakai whey protein dari JagaTubuh, recommended!', time: Date.now() - 6800000 }
        ]
    },
    {
        id: 3,
        name: 'Clean Eating & Veggie',
        icon: '🥗',
        description: 'Pola Makan Sehat & Pemula',
        members: 210,
        category: 'clean',
        color: '#27AE60',
        isRecommended: false,
        chats: [
            { user: 'Dewi Lestari', text: 'Menu sarapan sehat hari ini: oatmeal + buah + yogurt. Kenyang sampai siang!', time: Date.now() - 5400000 },
            { user: 'Siti Rahma', text: 'Wah enak juga ya, besok saya coba', time: Date.now() - 4800000 }
        ]
    },
    {
        id: 4,
        name: 'Diabetes & Remaja Sehat',
        icon: '🩺',
        description: 'Kontrol Gula Darah & Edukasi',
        members: 67,
        category: 'diabetes',
        color: '#E74C3C',
        isRecommended: false,
        chats: [
            { user: 'dr. Anisa Putri', text: 'Kurangi gula tambahan dan perbanyak serat untuk kontrol gula darah.', time: Date.now() - 9000000 },
            { user: 'Budi Prasetyo', text: 'Terima kasih dok! Saya coba kurangi nasi putih.', time: Date.now() - 8500000 }
        ]
    }
];

let joinedGroups = JSON.parse(localStorage.getItem('jagaTubuhJoinedGroups')) || [];
let groupMessages = JSON.parse(localStorage.getItem('jagaTubuhGroupMessages')) || {};
let currentGroupId = null;


function renderMembers() {
    const grid = document.getElementById('memberGrid');
    if (!grid) return;

    let filtered = membersData;

    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(m => 
            m.name.toLowerCase().includes(query) || 
            m.diet.toLowerCase().includes(query)
        );
    }

    if (currentFilter !== 'all') {
        filtered = filtered.filter(m => m.filter.includes(currentFilter));
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px; opacity:0.6;">
                <i class="fas fa-search" style="font-size:32px; display:block; margin-bottom:10px;"></i>
                Tidak ada anggota yang ditemukan
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map((m, index) => {
        const supportCount = supportCounts[m.id] || 0;
        const badgeClass = m.badge === 'premium' ? 'premium' : 'active';
        const badgeIcon = m.badge === 'premium' ? '⭐' : '🟢';
        const badgeText = m.badge === 'premium' ? 'Premium' : 'Aktif';

        return `
            <div class="community-card" data-aos="fade-up" data-aos-delay="${(index % 3) * 100 + 100}" data-aos-duration="700">
                <div class="card-header">
                    <div class="avatar" style="background: ${m.color};">${m.initials}</div>
                    <div class="member-badge ${badgeClass}">${badgeIcon} ${badgeText}</div>
                </div>
                <div class="card-body">
                    <h3 class="name">${m.name}</h3>
                    <p class="since"><i class="far fa-calendar-alt"></i> Member sejak ${m.since}</p>
                    <p class="testimoni">"${m.testimoni}"</p>
                    <div class="stats">
                        <span class="score"><i class="fas fa-heartbeat"></i> Health Score: ${m.healthScore}</span>
                        <span><i class="fas fa-utensils"></i> Diet: ${m.diet}</span>
                    </div>
                    <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">
                        <span style="font-size:12px; color:rgba(255,255,255,0.5);">
                            <i class="fas fa-trophy"></i> Streak: ${m.streak}
                        </span>
                        <span style="font-size:12px; color:rgba(255,255,255,0.5);">
                            <i class="fas fa-weight"></i> Target: ${m.targetWeight}
                        </span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn-card-primary" onclick="giveSupport(${m.id}, '${m.name}')">
                        <i class="fas fa-hands"></i> Beri Semangat <span id="supportCount_${m.id}" class="support-count">${supportCount > 0 ? supportCount : ''}</span>
                    </button>
                    <button class="btn-card-secondary" onclick="openProfileModal(${m.id})">
                        <i class="fas fa-eye"></i> Lihat Profil
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderGroups() {
    const container = document.getElementById('groupsGrid');
    if (!container) return;

    const healthResult = JSON.parse(localStorage.getItem('jagaTubuhResult'));
    let recommendedCategory = null;
    
    if (healthResult) {
        const bmi = healthResult.bmi || 0;
        if (bmi > 25) {
            recommendedCategory = 'defisit';
        } else if (bmi < 18.5) {
            recommendedCategory = 'bulking';
        } else {
            recommendedCategory = 'clean';
        }
    }

    container.innerHTML = groupsData.map(group => {
        const isJoined = joinedGroups.includes(group.id);
        const isRecommended = group.isRecommended || group.category === recommendedCategory;
        const memberCount = isJoined ? group.members + 1 : group.members;
        
        return `
            <div class="group-card ${isRecommended ? 'recommended' : ''}" data-group-id="${group.id}" data-aos="fade-up" data-aos-delay="${(group.id - 1) * 100}">
                ${isRecommended ? `<div class="recommended-badge"><i class="fas fa-star"></i> Rekomendasi</div>` : ''}
                <div class="group-icon" style="background:${group.color}20; color:${group.color};">${group.icon}</div>
                <div class="group-info">
                    <h4>${group.name}</h4>
                    <p>${group.description}</p>
                    <span class="group-members"><i class="fas fa-users"></i> ${memberCount} anggota</span>
                </div>
                ${isJoined ? `
                    <button class="btn-group joined" onclick="leaveGroup(${group.id}, '${group.name}')">
                        <i class="fas fa-check-circle"></i> Tergabung
                    </button>
                    <button class="btn-group-discuss" onclick="openGroupChat(${group.id})">
                        <i class="fas fa-comments"></i> Buka Ruang Diskusi
                    </button>
                ` : `
                    <button class="btn-group" onclick="joinGroup(${group.id}, '${group.name}')">
                        <i class="fas fa-user-plus"></i> Gabung Grup
                    </button>
                `}
            </div>
        `;
    }).join('');
}

function joinGroup(groupId, groupName) {
    if (!joinedGroups.includes(groupId)) {
        joinedGroups.push(groupId);
        localStorage.setItem('jagaTubuhJoinedGroups', JSON.stringify(joinedGroups));
        
        const group = groupsData.find(g => g.id === groupId);
        if (group) {
            group.members += 1;
        }
        
        renderGroups();
        showToast(`✅ Kamu berhasil bergabung dengan Grup ${groupName}!`, 'success');
    }
}

function leaveGroup(groupId, groupName) {
    if (confirm(`Yakin ingin keluar dari grup ${groupName}?`)) {
        joinedGroups = joinedGroups.filter(id => id !== groupId);
        localStorage.setItem('jagaTubuhJoinedGroups', JSON.stringify(joinedGroups));
        
        const group = groupsData.find(g => g.id === groupId);
        if (group) {
            group.members -= 1;
        }
        
        renderGroups();
        showToast(`👋 Anda telah keluar dari grup ${groupName}`, 'info');
    }
}

function openGroupChat(groupId) {
    const group = groupsData.find(g => g.id === groupId);
    if (!group) return;
    
    currentGroupId = groupId;
    
    document.getElementById('groupModalTitle').textContent = `${group.icon} Ruang Grup: ${group.name}`;
    document.getElementById('groupNameDisplay').textContent = group.name;
    
    const isJoined = joinedGroups.includes(groupId);
    document.getElementById('groupMemberCount').textContent = isJoined ? group.members + 1 : group.members;
    
    renderGroupChat(groupId);
    
    document.getElementById('groupModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        document.getElementById('groupChatInput').focus();
    }, 300);
}

function closeGroupModal() {
    document.getElementById('groupModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function renderGroupChat(groupId) {
    const chatBox = document.getElementById('groupChatBox');
    const group = groupsData.find(g => g.id === groupId);
    if (!group) return;
    
    let messages = groupMessages[groupId] || [];
    
    if (messages.length === 0 && group.chats) {
        messages = group.chats.map(chat => ({
            ...chat,
            reactions: { like: 0, fire: 0, food: 0 }
        }));
        groupMessages[groupId] = messages;
        localStorage.setItem('jagaTubuhGroupMessages', JSON.stringify(groupMessages));
    }
    
    chatBox.innerHTML = messages.map((msg, index) => {
        const time = new Date(msg.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const reactions = msg.reactions || { like: 0, fire: 0, food: 0 };
        
        return `
            <div class="group-message">
                <div class="group-message-header">
                    <strong>${msg.user}</strong>
                    <span class="group-message-time">${time}</span>
                </div>
                <div class="group-message-text">${msg.text}</div>
                <div class="group-message-reactions">
                    <button onclick="addReaction(${groupId}, ${index}, 'like')" class="reaction-btn">
                        👍 <span class="reaction-count">${reactions.like || 0}</span>
                    </button>
                    <button onclick="addReaction(${groupId}, ${index}, 'fire')" class="reaction-btn">
                        🔥 <span class="reaction-count">${reactions.fire || 0}</span>
                    </button>
                    <button onclick="addReaction(${groupId}, ${index}, 'food')" class="reaction-btn">
                        🥗 <span class="reaction-count">${reactions.food || 0}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendGroupMessage() {
    const input = document.getElementById('groupChatInput');
    const text = input.value.trim();
    if (!text || currentGroupId === null) return;
    
    const user = JSON.parse(localStorage.getItem('jagaTubuhCurrentUser'));
    const userName = user ? user.name : 'Anonymous';
    
    if (!groupMessages[currentGroupId]) {
        groupMessages[currentGroupId] = [];
    }
    
    const newMsg = {
        user: userName,
        text: text,
        time: Date.now(),
        reactions: { like: 0, fire: 0, food: 0 }
    };
    
    groupMessages[currentGroupId].push(newMsg);
    localStorage.setItem('jagaTubuhGroupMessages', JSON.stringify(groupMessages));
    
    input.value = '';
    renderGroupChat(currentGroupId);

    showTypingIndicator();
    
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
        const replies = [
            "Halo! Selamat datang di grup! 😊",
            "Wah, semangat! Yuk kita diskusikan menu sehat hari ini!",
            "Saya juga lagi coba menu baru nih, besok share ya!",
            "Mantap! Terus konsisten ya! 💪",
            "Hari ini saya sarapan oatmeal + pisang, kenyang sampai siang!",
            "Saya support banget! Keep going! 🔥",
            "Wah menarik! Bisa dishare resepnya? 🥗",
            "Ayo kita saling support! Target sehat kita bersama!",
            "Guys, jangan lupa minum air putih yang cukup ya! 💧",
            "Menu sehat hari ini: ayam bakar + sayur + nasi merah!"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const botUsers = ['Siti Rahma', 'Budi Prasetyo', 'Andi Dharma', 'Dewi Lestari', 'Fajar Nugroho'];
        const botUser = botUsers[Math.floor(Math.random() * botUsers.length)];
        
        const botMsg = {
            user: botUser,
            text: randomReply,
            time: Date.now(),
            reactions: { like: 0, fire: 0, food: 0 }
        };
        
        groupMessages[currentGroupId].push(botMsg);
        localStorage.setItem('jagaTubuhGroupMessages', JSON.stringify(groupMessages));
        renderGroupChat(currentGroupId);
        hideTypingIndicator();
    }, delay);
}

function showTypingIndicator() {
    const chatBox = document.getElementById('groupChatBox');
    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
        <span style="opacity:0.6; font-size:13px;">Seseorang sedang mengetik...</span>
        <span class="typing-dots">
            <span></span><span></span><span></span>
        </span>
    `;
    chatBox.appendChild(indicator);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function addReaction(groupId, messageIndex, reactionType) {
    const messages = groupMessages[groupId] || [];
    if (!messages[messageIndex]) return;
    
    if (!messages[messageIndex].reactions) {
        messages[messageIndex].reactions = { like: 0, fire: 0, food: 0 };
    }
    
    messages[messageIndex].reactions[reactionType] = (messages[messageIndex].reactions[reactionType] || 0) + 1;
    localStorage.setItem('jagaTubuhGroupMessages', JSON.stringify(groupMessages));
    renderGroupChat(groupId);
}

function showGroupModal() {
    if (joinedGroups.length > 0) {
        openGroupChat(joinedGroups[0]);
    } else {
        document.querySelector('.groups-container').scrollIntoView({ behavior: 'smooth' });
        showToast('💡 Pilih grup yang ingin kamu ikuti terlebih dahulu!', 'info');
    }
}

function filterPill(filter, btn) {
    currentFilter = filter;
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderMembers();
}

function filterMembers() {
    const input = document.getElementById('searchMember');
    searchQuery = input ? input.value : '';
    renderMembers();
}

function giveSupport(memberId, memberName) {
    if (!supportCounts[memberId]) {
        supportCounts[memberId] = 0;
    }
    supportCounts[memberId] += 1;
    localStorage.setItem('jagaTubuhSupportCounts', JSON.stringify(supportCounts));

    const countEl = document.getElementById(`supportCount_${memberId}`);
    if (countEl) {
        countEl.textContent = supportCounts[memberId] > 0 ? supportCounts[memberId] : '';
    }

    const card = countEl?.closest('.community-card');
    if (card) {
        const btn = card.querySelector('.btn-card-primary');
        if (btn) {
            btn.style.background = '#4CAF50';
            btn.style.color = 'white';
            setTimeout(() => {
                btn.style.background = '';
                btn.style.color = '';
            }, 1000);
        }
    }

    showToast(`👏 Berhasil memberi semangat kepada ${memberName}!`, 'success');
}

function openProfileModal(memberId) {
    const member = membersData.find(m => m.id === memberId);
    if (!member) return;

    document.getElementById('profileModalName').textContent = 'Profil Member';
    document.getElementById('profileAvatar').textContent = member.initials;
    document.getElementById('profileAvatar').style.background = member.color;
    document.getElementById('profileName').textContent = member.name;
    document.getElementById('profileSince').textContent = `Member sejak ${member.since}`;
    document.getElementById('profileScore').textContent = member.healthScore;
    document.getElementById('profileTarget').textContent = member.targetWeight;
    document.getElementById('profileStreak').textContent = member.streak;
    document.getElementById('profileBio').textContent = `"${member.testimoni}"`;

    document.getElementById('profileModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function joinChallenge() {
    if (challengeJoined) {
        showToast('Anda sudah mengikuti challenge ini!', 'info');
        return;
    }

    challengeJoined = true;
    challengeCount += 1;
    localStorage.setItem('jagaTubuhChallengeJoined', JSON.stringify(challengeJoined));
    localStorage.setItem('jagaTubuhChallengeCount', challengeCount);

    document.getElementById('challengeCount').textContent = challengeCount;
    const btn = document.getElementById('challengeBtn');
    btn.textContent = '✓ Mengikuti';
    btn.classList.add('joined');
    btn.disabled = true;

    showToast('🎉 Berhasil mengikuti Challenge 7 Hari Tanpa Minuman Manis!', 'success');
}

function updateChallengeStatus() {
    const btn = document.getElementById('challengeBtn');
    const countEl = document.getElementById('challengeCount');
    
    if (challengeJoined) {
        if (btn) {
            btn.textContent = '✓ Mengikuti';
            btn.classList.add('joined');
            btn.disabled = true;
        }
    }
    
    if (countEl) {
        countEl.textContent = challengeCount;
    }
}

let posts = JSON.parse(localStorage.getItem('jagaTubuhCommunityPosts')) || [];

if (posts.length === 0) {
    posts = [
        {
            id: Date.now(),
            user: 'Andi Dharma',
            initials: 'AD',
            color: '#6F943B',
            content: 'Hari ke-7 tanpa minuman manis! Berat badan turun 1.5kg 🎉',
            time: Date.now() - 3600000,
            likes: 12,
            liked: false,
            comments: [
                { user: 'Siti Rahma', text: 'Hebat Andi! Semangat terus 💪' },
                { user: 'Budi Prasetyo', text: 'Mantap! Saya juga ikutan challenge ini' }
            ]
        },
        {
            id: Date.now() - 100000,
            user: 'Siti Rahma',
            initials: 'SR',
            color: '#8E44AD',
            content: 'Menu sarapan sehat hari ini: oatmeal + buah + yogurt. Kenyang sampai siang!',
            time: Date.now() - 7200000,
            likes: 8,
            liked: false,
            comments: [
                { user: 'Dewi Lestari', text: 'Wah enak juga ya, besok saya coba' }
            ]
        },
        {
            id: Date.now() - 200000,
            user: 'Budi Prasetyo',
            initials: 'BP',
            color: '#2980B9',
            content: 'Hasil cek kesehatan terbaru: BMI normal, gula darah stabil. Terima kasih JagaTubuh! 🙏',
            time: Date.now() - 10800000,
            likes: 24,
            liked: false,
            comments: []
        }
    ];
    localStorage.setItem('jagaTubuhCommunityPosts', JSON.stringify(posts));
}

function renderFeed() {
    const container = document.getElementById('feedContainer');
    if (!container) return;

    const sortedPosts = [...posts].sort((a, b) => b.time - a.time);

    if (sortedPosts.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:30px; opacity:0.5;">
                <i class="fas fa-comment" style="font-size:28px; display:block; margin-bottom:10px;"></i>
                Belum ada postingan. Jadilah yang pertama!
            </div>
        `;
        return;
    }

    container.innerHTML = sortedPosts.map(post => {
        const timeAgo = getTimeAgo(post.time);
        const likeIcon = post.liked ? 'fas' : 'far';
        const likeClass = post.liked ? 'liked' : '';

        const commentsHtml = post.comments && post.comments.length > 0 ? 
            post.comments.map(c => `
                <div class="comment-item">
                    <strong>${c.user}:</strong> ${c.text}
                </div>
            `).join('') : '';

        return `
            <div class="feed-post" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-avatar" style="background:${post.color};">${post.initials}</div>
                    <span class="post-user">${post.user}</span>
                    <span class="post-time">${timeAgo}</span>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <button onclick="toggleLike(${post.id})" class="${likeClass}">
                        <i class="${likeIcon} fa-heart"></i> ${post.likes}
                    </button>
                    <button onclick="toggleCommentInput(${post.id})">
                        <i class="far fa-comment"></i> ${post.comments ? post.comments.length : 0}
                    </button>
                </div>
                ${commentsHtml ? `<div class="post-comments">${commentsHtml}</div>` : ''}
                <div class="post-comments" id="commentSection_${post.id}" style="display:none;">
                    <div class="comment-input-wrapper">
                        <input type="text" placeholder="Tulis komentar..." id="commentInput_${post.id}">
                        <button onclick="addComment(${post.id})">Kirim</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function createPost() {
    const input = document.getElementById('postInput');
    const content = input.value.trim();
    if (!content) {
        showToast('Silakan tulis sesuatu!', 'error');
        return;
    }

    const user = JSON.parse(localStorage.getItem('jagaTubuhCurrentUser'));
    const name = user ? user.name : 'Anonymous';
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const newPost = {
        id: Date.now(),
        user: name,
        initials: initials || 'AN',
        color: '#44A1A4',
        content: content,
        time: Date.now(),
        likes: 0,
        liked: false,
        comments: []
    };

    posts.unshift(newPost);
    localStorage.setItem('jagaTubuhCommunityPosts', JSON.stringify(posts));

    input.value = '';
    renderFeed();
    showToast('✅ Postingan berhasil dibagikan!', 'success');
}

function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.liked) {
        post.likes -= 1;
        post.liked = false;
    } else {
        post.likes += 1;
        post.liked = true;
    }

    localStorage.setItem('jagaTubuhCommunityPosts', JSON.stringify(posts));
    renderFeed();
}

function toggleCommentInput(postId) {
    const section = document.getElementById(`commentSection_${postId}`);
    if (section) {
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
        if (section.style.display === 'block') {
            setTimeout(() => {
                const input = document.getElementById(`commentInput_${postId}`);
                if (input) input.focus();
            }, 100);
        }
    }
}

function addComment(postId) {
    const input = document.getElementById(`commentInput_${postId}`);
    const text = input.value.trim();
    if (!text) {
        showToast('Silakan tulis komentar!', 'error');
        return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const user = JSON.parse(localStorage.getItem('jagaTubuhCurrentUser'));
    const name = user ? user.name : 'Anonymous';

    if (!post.comments) post.comments = [];
    post.comments.push({ user: name, text: text });

    localStorage.setItem('jagaTubuhCommunityPosts', JSON.stringify(posts));
    input.value = '';
    renderFeed();
    showToast('💬 Komentar berhasil ditambahkan!', 'success');
}

function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Baru saja';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + ' menit lalu';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + ' jam lalu';
    const days = Math.floor(hours / 24);
    if (days < 7) return days + ' hari lalu';
    return '1 minggu lalu';
}

window.renderMembers = renderMembers;
window.filterPill = filterPill;
window.filterMembers = filterMembers;
window.giveSupport = giveSupport;
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.joinChallenge = joinChallenge;
window.updateChallengeStatus = updateChallengeStatus;
window.createPost = createPost;
window.toggleLike = toggleLike;
window.toggleCommentInput = toggleCommentInput;
window.addComment = addComment;
window.renderFeed = renderFeed;
window.showToast = showToast;
window.joinGroup = joinGroup;
window.leaveGroup = leaveGroup;
window.openGroupChat = openGroupChat;
window.closeGroupModal = closeGroupModal;
window.sendGroupMessage = sendGroupMessage;
window.addReaction = addReaction;
window.showGroupModal = showGroupModal;