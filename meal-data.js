// Meal Data for Diet Assistant

window.mealData = {
    normal: {
        breakfast: [
            { 
                name: 'Nasi Uduk + Telur Dadar', 
                calories: 450, 
                protein: 16, 
                carbs: 48, 
                fat: 20,
                ingredients: [
                    { name: 'Beras', quantity: 100, unit: 'g', price: 2000 },
                    { name: 'Telur', quantity: 2, unit: 'butir', price: 3000 },
                    { name: 'Santan', quantity: 50, unit: 'ml', price: 1000 }
                ]
            },
            { 
                name: 'Oatmeal + Pisang + Madu', 
                calories: 350, 
                protein: 12, 
                carbs: 58, 
                fat: 8,
                ingredients: [
                    { name: 'Oatmeal', quantity: 50, unit: 'g', price: 2500 },
                    { name: 'Pisang', quantity: 1, unit: 'buah', price: 3000 },
                    { name: 'Madu', quantity: 15, unit: 'ml', price: 2000 }
                ]
            },
            { 
                name: 'Roti Gandum + Selai Kacang + Susu', 
                calories: 380, 
                protein: 14, 
                carbs: 42, 
                fat: 18,
                ingredients: [
                    { name: 'Roti Gandum', quantity: 2, unit: 'lembar', price: 4000 },
                    { name: 'Selai Kacang', quantity: 30, unit: 'g', price: 3000 },
                    { name: 'Susu', quantity: 200, unit: 'ml', price: 4000 }
                ]
            },
            { 
                name: 'Bubur Ayam + Telur', 
                calories: 420, 
                protein: 20, 
                carbs: 50, 
                fat: 15,
                ingredients: [
                    { name: 'Beras', quantity: 80, unit: 'g', price: 1600 },
                    { name: 'Dada Ayam', quantity: 80, unit: 'g', price: 4000 },
                    { name: 'Telur', quantity: 1, unit: 'butir', price: 1500 }
                ]
            }
        ],
        lunch: [
            { 
                name: 'Nasi + Ayam Bakar + Sayur Asem', 
                calories: 550, 
                protein: 30, 
                carbs: 62, 
                fat: 18,
                ingredients: [
                    { name: 'Nasi', quantity: 150, unit: 'g', price: 3000 },
                    { name: 'Dada Ayam', quantity: 150, unit: 'g', price: 7500 },
                    { name: 'Sayuran', quantity: 100, unit: 'g', price: 5000 }
                ]
            },
            { 
                name: 'Nasi + Ikan Kukus + Tahu Tempe', 
                calories: 520, 
                protein: 32, 
                carbs: 55, 
                fat: 20,
                ingredients: [
                    { name: 'Nasi', quantity: 150, unit: 'g', price: 3000 },
                    { name: 'Ikan', quantity: 120, unit: 'g', price: 8000 },
                    { name: 'Tahu', quantity: 50, unit: 'g', price: 2000 },
                    { name: 'Tempe', quantity: 50, unit: 'g', price: 2000 }
                ]
            },
            { 
                name: 'Nasi + Rendang Daging + Sayur', 
                calories: 580, 
                protein: 35, 
                carbs: 55, 
                fat: 22,
                ingredients: [
                    { name: 'Nasi', quantity: 150, unit: 'g', price: 3000 },
                    { name: 'Daging Sapi', quantity: 120, unit: 'g', price: 12000 },
                    { name: 'Sayuran', quantity: 100, unit: 'g', price: 5000 }
                ]
            },
            { 
                name: 'Nasi Merah + Ikan Bakar + Sambal', 
                calories: 480, 
                protein: 28, 
                carbs: 50, 
                fat: 16,
                ingredients: [
                    { name: 'Nasi Merah', quantity: 120, unit: 'g', price: 4000 },
                    { name: 'Ikan', quantity: 150, unit: 'g', price: 8000 },
                    { name: 'Sambal', quantity: 20, unit: 'g', price: 1000 }
                ]
            }
        ],
        dinner: [
            { 
                name: 'Nasi + Pepes Ikan + Sayur', 
                calories: 530, 
                protein: 28, 
                carbs: 55, 
                fat: 20,
                ingredients: [
                    { name: 'Nasi', quantity: 150, unit: 'g', price: 3000 },
                    { name: 'Ikan', quantity: 120, unit: 'g', price: 8000 },
                    { name: 'Sayuran', quantity: 100, unit: 'g', price: 5000 }
                ]
            },
            { 
                name: 'Mie Goreng + Telur + Sayur', 
                calories: 500, 
                protein: 20, 
                carbs: 68, 
                fat: 18,
                ingredients: [
                    { name: 'Mie', quantity: 100, unit: 'g', price: 3000 },
                    { name: 'Telur', quantity: 2, unit: 'butir', price: 3000 },
                    { name: 'Sayuran', quantity: 80, unit: 'g', price: 4000 }
                ]
            },
            { 
                name: 'Nasi + Opor Ayam + Lalapan', 
                calories: 560, 
                protein: 32, 
                carbs: 58, 
                fat: 22,
                ingredients: [
                    { name: 'Nasi', quantity: 150, unit: 'g', price: 3000 },
                    { name: 'Ayam', quantity: 150, unit: 'g', price: 7500 },
                    { name: 'Lalapan', quantity: 50, unit: 'g', price: 2000 }
                ]
            }
        ]
    },
    weight_gain: {
        breakfast: [
            { 
                name: 'Nasi Uduk + Telur + Tempe', 
                calories: 550, 
                protein: 24, 
                carbs: 60, 
                fat: 25,
                ingredients: [
                    { name: 'Beras', quantity: 120, unit: 'g', price: 2400 },
                    { name: 'Telur', quantity: 3, unit: 'butir', price: 4500 },
                    { name: 'Tempe', quantity: 50, unit: 'g', price: 2000 }
                ]
            },
            { 
                name: 'Oatmeal + Susu + Kacang + Madu', 
                calories: 500, 
                protein: 20, 
                carbs: 65, 
                fat: 16,
                ingredients: [
                    { name: 'Oatmeal', quantity: 70, unit: 'g', price: 3500 },
                    { name: 'Susu', quantity: 200, unit: 'ml', price: 4000 },
                    { name: 'Kacang', quantity: 30, unit: 'g', price: 3000 },
                    { name: 'Madu', quantity: 15, unit: 'ml', price: 2000 }
                ]
            }
        ],
        lunch: [
            { 
                name: 'Nasi + Ayam Goreng + Telur Dadar + Sayur', 
                calories: 680, 
                protein: 38, 
                carbs: 70, 
                fat: 28,
                ingredients: [
                    { name: 'Nasi', quantity: 200, unit: 'g', price: 4000 },
                    { name: 'Dada Ayam', quantity: 200, unit: 'g', price: 10000 },
                    { name: 'Telur', quantity: 2, unit: 'butir', price: 3000 },
                    { name: 'Sayuran', quantity: 100, unit: 'g', price: 5000 }
                ]
            },
            { 
                name: 'Nasi + Ikan + Tahu + Tempe', 
                calories: 620, 
                protein: 40, 
                carbs: 65, 
                fat: 25,
                ingredients: [
                    { name: 'Nasi', quantity: 200, unit: 'g', price: 4000 },
                    { name: 'Ikan', quantity: 180, unit: 'g', price: 10000 },
                    { name: 'Tahu', quantity: 50, unit: 'g', price: 2000 },
                    { name: 'Tempe', quantity: 50, unit: 'g', price: 2000 }
                ]
            }
        ],
        dinner: [
            { 
                name: 'Nasi + Rendang + Telur + Sayur', 
                calories: 650, 
                protein: 40, 
                carbs: 60, 
                fat: 30,
                ingredients: [
                    { name: 'Nasi', quantity: 200, unit: 'g', price: 4000 },
                    { name: 'Daging Sapi', quantity: 150, unit: 'g', price: 15000 },
                    { name: 'Telur', quantity: 2, unit: 'butir', price: 3000 },
                    { name: 'Sayuran', quantity: 100, unit: 'g', price: 5000 }
                ]
            },
            { 
                name: 'Nasi + Ikan Bakar + Telur Dadar', 
                calories: 600, 
                protein: 38, 
                carbs: 58, 
                fat: 26,
                ingredients: [
                    { name: 'Nasi', quantity: 200, unit: 'g', price: 4000 },
                    { name: 'Ikan', quantity: 150, unit: 'g', price: 8000 },
                    { name: 'Telur', quantity: 3, unit: 'butir', price: 4500 }
                ]
            }
        ]
    },
    weight_loss: {
        breakfast: [
            { 
                name: 'Oatmeal + Buah + Almond', 
                calories: 280, 
                protein: 12, 
                carbs: 40, 
                fat: 8,
                ingredients: [
                    { name: 'Oatmeal', quantity: 40, unit: 'g', price: 2000 },
                    { name: 'Buah', quantity: 100, unit: 'g', price: 5000 },
                    { name: 'Almond', quantity: 10, unit: 'g', price: 3000 }
                ]
            },
            { 
                name: 'Roti Gandum + Telur Rebus + Alpukat', 
                calories: 320, 
                protein: 18, 
                carbs: 35, 
                fat: 12,
                ingredients: [
                    { name: 'Roti Gandum', quantity: 1, unit: 'lembar', price: 2000 },
                    { name: 'Telur', quantity: 2, unit: 'butir', price: 3000 },
                    { name: 'Alpukat', quantity: 50, unit: 'g', price: 5000 }
                ]
            }
        ],
        lunch: [
            { 
                name: 'Nasi Merah + Ikan Kukus + Sayur Rebus', 
                calories: 420, 
                protein: 30, 
                carbs: 45, 
                fat: 12,
                ingredients: [
                    { name: 'Nasi Merah', quantity: 100, unit: 'g', price: 3000 },
                    { name: 'Ikan', quantity: 150, unit: 'g', price: 8000 },
                    { name: 'Sayuran', quantity: 150, unit: 'g', price: 7500 }
                ]
            },
            { 
                name: 'Nasi Merah + Ayam Panggang + Salad', 
                calories: 440, 
                protein: 32, 
                carbs: 42, 
                fat: 15,
                ingredients: [
                    { name: 'Nasi Merah', quantity: 100, unit: 'g', price: 3000 },
                    { name: 'Dada Ayam', quantity: 150, unit: 'g', price: 7500 },
                    { name: 'Salad', quantity: 100, unit: 'g', price: 5000 }
                ]
            }
        ],
        dinner: [
            { 
                name: 'Salad + Ayam Panggang + Edamame', 
                calories: 380, 
                protein: 32, 
                carbs: 30, 
                fat: 14,
                ingredients: [
                    { name: 'Ayam', quantity: 150, unit: 'g', price: 7500 },
                    { name: 'Sayuran', quantity: 200, unit: 'g', price: 10000 },
                    { name: 'Edamame', quantity: 50, unit: 'g', price: 5000 }
                ]
            },
            { 
                name: 'Sup Sayur + Tahu + Ikan', 
                calories: 350, 
                protein: 25, 
                carbs: 35, 
                fat: 10,
                ingredients: [
                    { name: 'Sayuran', quantity: 200, unit: 'g', price: 10000 },
                    { name: 'Tahu', quantity: 100, unit: 'g', price: 4000 },
                    { name: 'Ikan', quantity: 100, unit: 'g', price: 6000 }
                ]
            }
        ]
    }
};