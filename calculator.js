function calculateBMI(weight, height) {
    const heightM = height / 100; 
    if (heightM <= 0) return { value: 0, category: 'Data Invalid' };
    const bmi = weight / (heightM * heightM);
    let category = '';
    if (bmi < 17) category = 'Sangat Kurang';
    else if (bmi >= 17 && bmi < 18.5) category = 'Kurang';
    else if (bmi >= 18.5 && bmi < 25) category = 'Baik';
    else if (bmi >= 25 && bmi < 27) category = 'Sangat Baik';
    else if (bmi >= 27) category = 'Berlebih';
    return { value: bmi, category: category };
}

function calculateIdealWeight(height, gender) {
    const h = height - 100;
    let ideal = 0;
    if (gender === 'male') ideal = h - (h * 0.10);
    else if (gender === 'female') ideal = h - (h * 0.15);
    return Math.max(0, ideal);
}

function calculateWeightStatus(currentWeight, idealWeight) {
    if (idealWeight <= 0) return 'Data Invalid';
    const percentage = (currentWeight / idealWeight) * 100;
    if (percentage < 85) return 'Sangat Kurang';
    else if (percentage >= 85 && percentage < 95) return 'Kurang';
    else if (percentage >= 95 && percentage <= 105) return 'Baik';
    else if (percentage > 105 && percentage <= 115) return 'Sangat Baik';
    else if (percentage > 115) return 'Berlebih';
    return 'Tidak Diketahui';
}

function calculateBMR(weight, height, age, gender) {
    let bmr = 0;
    if (gender === 'male') bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    else if (gender === 'female') bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    return Math.round(bmr);
}

function calculateTDEE(bmr, activityLevel) {
    const activityFactors = { '1.2': 1.20, '1.375': 1.375, '1.55': 1.55, '1.725': 1.725, '1.9': 1.90 };
    const factor = activityFactors[String(activityLevel)] || 1.2;
    return Math.round(bmr * factor);
}

function calculateMacronutrients(calories, healthHistory, foodRestrictions) {
    let proteinRatio = 0.30;
    let carbRatio = 0.40;
    let fatRatio = 0.30;

    if (healthHistory.includes('Diabetes')) {
        carbRatio = 0.35;
        proteinRatio = 0.35; 
        fatRatio = 0.30;
    }

    const protein = Math.round((calories * proteinRatio) / 4);
    const carbs = Math.round((calories * carbRatio) / 4);
    const fat = Math.round((calories * fatRatio) / 9);
    return { protein, carbs, fat };
}

function calculateTargetTime(targetType, targetKg, dailyCalories, currentWeight, idealWeight) {
    if (targetType === 'maintain') return { weeks: 0, status: 'Menjaga berat badan', isWarning: false };
    if (!targetKg || targetKg <= 0) return { weeks: 0, status: 'Pilih target kg terlebih dahulu', isWarning: false };
    
    let finalWeight = 0;
    if (targetType === 'loss') {
        finalWeight = currentWeight - targetKg;
        if (finalWeight < (idealWeight - 5)) return { weeks: 0, status: '⚠️ Target terlalu rendah. Tidak disarankan.', isWarning: true };
    } else if (targetType === 'gain') {
        finalWeight = currentWeight + targetKg;
        if (finalWeight > (idealWeight + 5)) return { weeks: 0, status: '⚠️ Target terlalu tinggi. Tidak disarankan.', isWarning: true };
    }
    
    let weeklyChange = 0;
    if (targetType === 'loss') { const deficit = 500; weeklyChange = (deficit * 7) / 7700; } 
    else if (targetType === 'gain') { const surplus = 500; weeklyChange = (surplus * 7) / 7700; }
    
    if (weeklyChange <= 0) return { weeks: 0, status: 'Data tidak valid', isWarning: false };
    let weeks = Math.ceil(targetKg / weeklyChange);
    weeks = Math.min(weeks, 52);
    const action = targetType === 'loss' ? 'Menurunkan' : 'Menaikkan';
    return { weeks: weeks, status: `${action} ${targetKg} kg`, isWarning: false };
}

function calculateLifestyleScore(bmi, weightStatus, activityLevel, targetType, targetKg) {
    let score = 0;
    let bmiScore = 0;
    if (bmi >= 18.5 && bmi < 25) bmiScore = 100;
    else if (bmi >= 17 && bmi < 18.5) bmiScore = 80;
    else if (bmi >= 25 && bmi < 27) bmiScore = 60;
    else bmiScore = 40;
    
    let wsScore = 0;
    if (weightStatus === 'Baik') wsScore = 100;
    else if (weightStatus === 'Sangat Baik') wsScore = 80;
    else if (weightStatus === 'Kurang') wsScore = 60;
    else wsScore = 40;
    
    let actScore = 0;
    const act = parseFloat(activityLevel);
    if (act >= 1.725) actScore = 100;
    else if (act >= 1.55) actScore = 80;
    else if (act >= 1.375) actScore = 60;
    else actScore = 40;
    
    let targetScore = 80;
    if (targetType !== 'maintain' && targetKg > 0) {
        if (targetKg <= 2) targetScore = 100;
        else if (targetKg <= 5) targetScore = 80;
        else if (targetKg <= 10) targetScore = 60;
        else targetScore = 40;
    }
    
    let consScore = 80;
    score = (bmiScore * 0.20) + (wsScore * 0.20) + (actScore * 0.25) + (targetScore * 0.20) + (consScore * 0.15);
    return Math.min(100, Math.max(0, Math.round(score)));
}

function generateSmartInsights(bmiCategory, weightStatus, dailyCalories, protein, carbs, fat, targetType, targetKg, targetWeeks, isWarning, healthHistory, foodRestrictions) {
    let insights = [];

    let general = [];
    if (bmiCategory === 'Baik' || bmiCategory === 'Sangat Baik') {
        general.push(`✅ BMI Anda berada pada kategori <strong>${bmiCategory}</strong>. Pertahankan pola hidup sehat yang sudah Anda lakukan.`);
    } else {
        general.push(`⚠️ BMI Anda berada pada kategori <strong>${bmiCategory}</strong>. Mulai terapkan pola makan dan olahraga teratur.`);
    }

    if (weightStatus === 'Baik') {
        general.push(`✅ Berat badan Anda sudah ideal. Jaga keseimbangan antara asupan dan aktivitas fisik.`);
    } else if (weightStatus === 'Sangat Kurang' || weightStatus === 'Kurang') {
        general.push(`🍽️ Berat badan Anda masih di bawah ideal. Tingkatkan asupan kalori dan protein.`);
    } else {
        general.push(`🏃 Berat badan Anda masih di atas ideal. Fokus pada defisit kalori dan olahraga kardio.`);
    }
    insights.push({ title: '📊 Kondisi Umum', items: general, color: '#4CAF50' });

    let health = [];
    if (healthHistory.includes('Diabetes')) {
        health.push(`🩸 <strong>Diabetes:</strong> Batasi gula & karbo olahan. Target karbo Anda: <strong>${carbs}g</strong>. Prioritaskan karbo kompleks (beras merah, ubi).`);
    }
    if (healthHistory.includes('Hipertensi')) {
        health.push(`🧂 <strong>Hipertensi:</strong> Batasi asupan natrium (garam). Hindari makanan olahan & makanan cepat saji.`);
    }
    if (healthHistory.includes('Kolesterol Tinggi')) {
        health.push(`🥩 <strong>Kolesterol:</strong> Kurangi lemak jenuh (gorengan, daging berlemak). Perbanyak serat & lemak tak jenuh (alpukat, kacang).`);
    }
    if (healthHistory.includes('GERD')) {
        health.push(`🔥 <strong>GERD:</strong> Hindari makanan pedas, asam, & kafein. Makan porsi kecil lebih sering untuk mencegah refluks.`);
    }
    if (health.length > 0) insights.push({ title: '🩺 Pantau Kondisi Medis', items: health, color: '#FF9800' });

    let nutrition = [];
    nutrition.push(`🔥 Kebutuhan kalori harian Anda <strong>${dailyCalories} kcal</strong>. Atur porsi makan sesuai angka ini.`);
    
    if (targetType === 'maintain') {
        nutrition.push(`🧘 Anda dalam mode <strong>Maintain</strong>. Pertahankan kebiasaan sehat yang sudah terbentuk.`);
    } else if (isWarning) {
        nutrition.push(`🚫 Target ini tidak disarankan. Konsultasikan dengan ahli gizi untuk target yang lebih aman.`);
    } else if (targetWeeks > 0) {
        nutrition.push(`📅 Target ${targetKg} kg diperkirakan tercapai dalam <strong>${targetWeeks} minggu</strong>. Tetap disiplin!`);
    }
    if (nutrition.length > 0) insights.push({ title: '🥗 Panduan Nutrisi & Target', items: nutrition, color: '#2196F3' });

    let restrictions = [];
    if (foodRestrictions.includes('Vegetarian')) {
        restrictions.push(`🌱 <strong>Vegetarian:</strong> Penuhi protein dari tahu, tempe, dan kacang-kacangan.`);
    }
    if (foodRestrictions.includes('Alergi Seafood')) {
        restrictions.push(`🦐 <strong>Alergi Seafood:</strong> Hindari ikan, kerang, dan bumbu berbasis terasi/petis.`);
    }
    if (foodRestrictions.includes('Alergi Telur')) {
        restrictions.push(`🥚 <strong>Alergi Telur:</strong> Hindari telur & olahannya (mayones, kue). Alternatif: tofu scramble untuk protein, atau pisang untuk pengikat adonan.`);
    }
    if (restrictions.length > 0) insights.push({ title: '🚫 Pantangan & Preferensi', items: restrictions, color: '#F44336' });

    return insights;
}


document.addEventListener('DOMContentLoaded', function() {
    const targetSelect = document.getElementById('target');
    const targetKgGroup = document.getElementById('targetKgGroup');
    const healthForm = document.getElementById('healthForm');

    if (targetSelect) {
        targetSelect.addEventListener('change', function() {
            if (this.value === 'loss' || this.value === 'gain') {
                targetKgGroup.style.display = 'block';
            } else {
                targetKgGroup.style.display = 'none';
            }
        });
    }

    if (healthForm) {
        healthForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const historyCheckboxes = document.querySelectorAll('input[name="history"]:checked');
            const healthHistory = Array.from(historyCheckboxes).map(cb => cb.value);

            const restrictionCheckboxes = document.querySelectorAll('input[name="restrictions"]:checked');
            const foodRestrictions = Array.from(restrictionCheckboxes).map(cb => cb.value);

            const formData = {
                name: document.getElementById('userName').value || 'Pengguna',
                age: parseInt(document.getElementById('age').value),
                gender: document.getElementById('gender').value,
                height: parseFloat(document.getElementById('height').value),
                weight: parseFloat(document.getElementById('weight').value),
                activity: document.getElementById('activity').value,
                target: document.getElementById('target').value,
                targetKg: parseFloat(document.getElementById('targetKg').value) || 0,
                healthHistory: healthHistory,
                foodRestrictions: foodRestrictions
            };

            if ((formData.target === 'loss' || formData.target === 'gain') && formData.targetKg === 0) {
                alert("Silakan pilih berapa KG target Anda terlebih dahulu!");
                return;
            }

            const result = runHealthCheck(formData);

            if (result.error) {
                alert(result.error);
                return;
            }

            document.getElementById('results').classList.add('active');
            document.getElementById('results').style.display = 'block';

            const circle = document.getElementById('healthScoreCircle');
            const scoreVal = document.getElementById('healthScoreText');
            scoreVal.innerText = result.score;
            circle.style.background = `conic-gradient(#6F943B 0%, rgba(255,255,255,0.1) 0%)`;
            setTimeout(() => {
                circle.style.background = `conic-gradient(#6F943B ${result.score}%, rgba(255,255,255,0.1) ${result.score}%)`;
            }, 100);
            document.getElementById('healthScoreLabel').innerText = result.score >= 80 ? 'Sangat Baik' : (result.score >= 60 ? 'Baik' : 'Perlu Perhatian');

            document.getElementById('bmiText').innerText = result.bmi;
            document.getElementById('bmiCategoryText').innerText = result.bmiCategory;
            document.getElementById('bmiBar').style.width = Math.min(100, (parseFloat(result.bmi) / 40) * 100) + '%';

            document.getElementById('calorieText').innerText = result.tdee + ' kcal';
            document.getElementById('calorieBar').style.width = Math.min(100, (result.tdee / 3500) * 100) + '%';

            const targetBarWrapper = document.getElementById('targetBarWrapper');
            const warningEmojiWrapper = document.getElementById('warningEmojiWrapper');

            if (result.target.isWarning) {
                targetBarWrapper.style.display = 'none';
                warningEmojiWrapper.style.display = 'block';
                document.getElementById('targetTimeText').innerText = 'Tidak Disarankan';
                document.getElementById('targetLabel').innerText = result.target.status;
            } else {
                targetBarWrapper.style.display = 'block';
                warningEmojiWrapper.style.display = 'none';
                document.getElementById('targetTimeText').innerText = result.target.weeks > 0 ? result.target.weeks + ' minggu' : '-';
                document.getElementById('targetLabel').innerText = result.target.status;
                document.getElementById('targetBar').style.width = result.target.weeks > 0 ? Math.min(100, (result.target.weeks / 30) * 100) : 20 + '%';
            }

            document.getElementById('idealWeightText').innerText = result.idealWeight + ' kg';
            document.getElementById('statusWeightText').innerText = result.weightStatus;
            document.getElementById('bmrText').innerText = result.bmr + ' kcal';

            document.getElementById('proteinText').innerText = result.macro.protein + ' g';
            document.getElementById('carbsText').innerText = result.macro.carbs + ' g';
            document.getElementById('fatText').innerText = result.macro.fat + ' g';

            const historyContainer = document.getElementById('displayHistory');
            if (formData.healthHistory.length > 0) {
                historyContainer.innerText = formData.healthHistory.join(', ');
            } else {
                historyContainer.innerText = 'Tidak ada riwayat kesehatan yang dipilih';
            }

            const restrictionsContainer = document.getElementById('displayRestrictions');
            if (formData.foodRestrictions.length > 0) {
                restrictionsContainer.innerText = formData.foodRestrictions.join(', ');
            } else {
                restrictionsContainer.innerText = 'Tidak ada pantangan atau preferensi yang dipilih';
            }

            const insightContainer = document.getElementById('insightContainer');
            insightContainer.innerHTML = '';
            if (result.insights.length > 0) {
                result.insights.forEach(group => {
                    let html = `
                        <div class="insight-card" style="border-left: 4px solid ${group.color};">
                            <h5 style="color: ${group.color}; margin-bottom: 10px;">${group.title}</h5>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                    `;
                    group.items.forEach(item => {
                        html += `<li style="padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; line-height: 1.5;">${item}</li>`;
                    });
                    html += `</ul></div>`;
                    insightContainer.innerHTML += html;
                });
            }

            let targetFinalWeight = formData.weight;
            if (formData.target === 'loss') targetFinalWeight = formData.weight - formData.targetKg;
            else if (formData.target === 'gain') targetFinalWeight = formData.weight + formData.targetKg;

            localStorage.setItem('jagaTubuhResult', JSON.stringify({
                name: formData.name,
                height: formData.height,
                currentWeight: formData.weight,
                targetWeight: targetFinalWeight,
                idealWeight: result.idealWeight,
                tdee: result.tdee,
                macro: result.macro,
                target: { status: formData.target, targetKg: formData.targetKg, weeks: result.target.weeks, isWarning: result.target.isWarning },
                healthHistory: formData.healthHistory,
                foodRestrictions: formData.foodRestrictions
            }));

            window.scrollTo({ top: document.getElementById('results').offsetTop - 20, behavior: 'smooth' });
        });
    }
});

function runHealthCheck(data) {
    if (!data.gender || isNaN(data.age) || isNaN(data.height) || isNaN(data.weight) || isNaN(data.activity)) {
        return { error: "Harap lengkapi semua data diri dengan benar!" };
    }
    let targetKg = data.targetKg || 0; 
    if (data.target === 'maintain') targetKg = 0;
    
    const bmiResult = calculateBMI(data.weight, data.height);
    const idealWeight = calculateIdealWeight(data.height, data.gender);
    const weightStatus = calculateWeightStatus(data.weight, idealWeight);
    const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
    const tdee = calculateTDEE(bmr, data.activity);
    const macro = calculateMacronutrients(tdee, data.healthHistory, data.foodRestrictions);
    const targetCalc = calculateTargetTime(data.target, targetKg, tdee, data.weight, idealWeight);
    const lifestyleScore = calculateLifestyleScore(bmiResult.value, weightStatus, data.activity, data.target, targetKg);
    const insights = generateSmartInsights(bmiResult.category, weightStatus, tdee, macro.protein, macro.carbs, macro.fat, data.target, targetKg, targetCalc.weeks, targetCalc.isWarning, data.healthHistory, data.foodRestrictions);
    
    return {
        success: true,
        bmi: bmiResult.value.toFixed(2),
        bmiCategory: bmiResult.category,
        idealWeight: idealWeight.toFixed(1),
        weightStatus: weightStatus,
        bmr: bmr,
        tdee: tdee,
        macro: macro,
        target: { weeks: targetCalc.weeks, status: targetCalc.status, targetKg: targetKg, isWarning: targetCalc.isWarning },
        score: lifestyleScore,
        insights: insights
    };
}