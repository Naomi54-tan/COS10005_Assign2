'use strict';

// error//
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    if (field) field.classList.add('invalid');
    if (errorEl) errorEl.textContent = message;
}

function clearAllErrors(form) {
    form.querySelectorAll('.error').forEach(el => el.textContent = '');
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
}

// recommend//
function initRecommendPage() {
    const form = document.getElementById('recommendForm');
    if (!form) return; 

    form.addEventListener('submit', function (event) {
        event.preventDefault(); 
        
        const diet = document.getElementById('diet').value;
        const budget = document.getElementById('budget').value;
        const purpose = document.getElementById('purpose').value;

        if (!diet || !budget || !purpose) {
            alert("Please fill in all fields!");
            return;
        }

        let match = ""; 
        let matchName = "";
        let matchPrice = "";
        let matchDeposit = 0;

        // Dietary 
        if (diet === "halal") {
            if (purpose === "date" || budget === "mid") {
                match = "aoi-cafe"; matchName = "AOI Cafe"; matchPrice = "RM 20–40"; matchDeposit = 10;
            } else {
                match = "haidilao"; matchName = "HaiDiLao Hotpot"; matchPrice = "RM 60–100"; matchDeposit = 50;
            }
        } 
        else if (diet === "vegan") {
            if (purpose === "date") {
                match = "blackbixon"; matchName = "Blackbixon"; matchPrice = "RM 30–50"; matchDeposit = 20;
            } else {
                match = "bingshifu"; matchName = "BingShiFu"; matchPrice = "RM 20–30"; matchDeposit = 15;
            }
        } 

        else {
            if (budget === "low" && purpose === "family") {
                match = "sushi-zanmai"; matchName = "Sushi Zanmai"; matchPrice = "RM 20–40"; matchDeposit = 15;
            }
            else
                if (budget === "high" || purpose === "business") {
                match = "haidilao"; matchName = "HaiDiLao Hotpot"; matchPrice = "RM 60–100"; matchDeposit = 50;
            } 
            else 
                if (purpose === "date") {
                match = "blackbixon"; matchName = "Blackbixon"; matchPrice = "RM 30–50"; matchDeposit = 20;
            } else {
                match = "sae-ma-eul"; matchName = "Sae Ma Eul BBQ"; matchPrice = "RM 25–40"; matchDeposit = 20;
            }
        }

        document.getElementById('recommendResult').innerHTML =
            '<div class="card">' +
                '<h3>We recommend: ' + matchName + '</h3>' +
                '<p>Price: ' + matchPrice + ' | Deposit: RM ' + matchDeposit + '</p>' +
                '<a class="btn btn1" href="reservations.html?restaurant=' + match + '">Book Now</a>' +
            '</div>';
    });
}

// register //
function initRegisterPage() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearAllErrors(form);

        let valid = true;

        const username = document.getElementById('username').value.trim();
        if (!/^[A-Za-z0-9_]{5,}$/.test(username)) {
            showError('username', 'Username must be at least 5 characters (letters, numbers, underscores only).');
            valid = false;
        }

        const email = document.getElementById('email').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Please enter a valid email address.');
            valid = false;
        }

        const phone = document.getElementById('phone').value.trim();
        if (!/^\d{8,15}$/.test(phone)) {
            showError('phone', 'Phone number must contain 8–15 digits (numbers only).');
            valid = false;
        }

        const password = document.getElementById('password').value;
        const passwordOK =
            password.length >= 10 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /\d/.test(password) &&
            /[^A-Za-z0-9]/.test(password);
        if (!passwordOK) {
            showError('password', 'Password must be 10+ characters with uppercase, lowercase, number and special character.');
            valid = false;
        }

        const confirm = document.getElementById('confirmPassword').value;
        if (confirm !== password || confirm === '') {
            showError('confirmPassword', 'Passwords do not match.');
            valid = false;
        }

        const gender = form.querySelector('input[name="gender"]:checked');
        if (!gender) {
            document.getElementById('genderError').textContent = 'Please select a gender.';
            valid = false;
        }

        if (!document.getElementById('dietary').value) {
            showError('dietary', 'Please select a dietary preference.');
            valid = false;
        }

        if (!document.getElementById('country').value) {
            showError('country', 'Please select a country / region.');
            valid = false;
        }

        if (valid) {
            form.submit();   
        }
    });
}

//reservation//
function initReservationPage() {
    const form = document.getElementById('reservationForm');
    if (!form) return;

    const restaurantSelect = document.getElementById('restaurant');
    const depositField     = document.getElementById('deposit');
    const resDateField     = document.getElementById('resDate');
    
    // Payment Elements
    const voucherGroup       = document.getElementById('voucherGroup');
    const onlinePaymentGroup = document.getElementById('onlinePaymentGroup');
    const onlineMethod       = document.getElementById('onlineMethod');
    
    const cardGroup          = document.getElementById('cardGroup');
    const duitnowGroup       = document.getElementById('duitnowGroup');
    
    const voucherCode        = document.getElementById('voucherCode');
    const cardNumber         = document.getElementById('cardNumber');
    
    const resEmail           = document.getElementById('resEmail');
    const billingEmail       = document.getElementById('billingEmail');
    const sameAsEmail        = document.getElementById('sameAsEmail');

    // dates
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    resDateField.min = now.toISOString().slice(0, 16);

    // Data 
    const deposits = {
        'sae-ma-eul': 20, 'sushi-zanmai': 15, 'bingshifu': 15,
        'blackbixon': 20, 'haidilao': 50, 'aoi-cafe': 10
    };

    //Pre-fill restaurant from URL
    const params = new URLSearchParams(window.location.search);
    const prefill = params.get('restaurant');
    if (prefill && deposits[prefill]) {
        restaurantSelect.value = prefill;
    }

    // Update deposit dynamically
    function updateDeposit() {
        const key = restaurantSelect.value;
        depositField.value = key ? deposits[key] : '';
    }
    restaurantSelect.addEventListener('change', updateDeposit);
    updateDeposit();  

    // Show/Hide Main Payment Fields
    form.querySelectorAll('input[name="payMethod"]').forEach(radio => {
        radio.addEventListener('change', function () {
            voucherGroup.hidden = true;
            onlinePaymentGroup.hidden = true;
            
            voucherCode.value = '';
            onlineMethod.value = '';
            cardGroup.hidden = true;
            duitnowGroup.hidden = true;
            cardNumber.value = '';

            // Show correct main group
            if (this.value === 'voucher') {
                voucherGroup.hidden = false;
            } else if (this.value === 'online') {
                onlinePaymentGroup.hidden = false;
            }
        });
    });

    // Show/Hide Specific Online Method Fields
    onlineMethod.addEventListener('change', function () {
        cardGroup.hidden = true;
        duitnowGroup.hidden = true;
        cardNumber.value = '';

        if (this.value === 'credit' || this.value === 'debit') {
            cardGroup.hidden = false;
        } else if (this.value === 'duitnow') {
            duitnowGroup.hidden = false; 
        }
    });

    //checkbox auto-fill
    sameAsEmail.addEventListener('change', function () {
        if (this.checked) {
            billingEmail.value = resEmail.value;
        } else {
            billingEmail.value = ''; // clear if unchecked
        }
    });

    // Form Validation on Submit
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Stop submission by default
        clearAllErrors(form);

        let valid = true;

        // Full Name 
        if (document.getElementById('fullName').value.trim() === '') {
            showError('fullName', 'Please enter your full name.');
            valid = false;
        }

        //Email 
        const email = resEmail.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('resEmail', 'Please enter a valid email address.');
            valid = false;
        }

        // Phone
        const phone = document.getElementById('resPhone').value.trim();
        if (!/^\d{10,}$/.test(phone)) {
            showError('resPhone', 'Phone number must contain at least 10 digits.');
            valid = false;
        }

        // Restaurant
        if (!restaurantSelect.value) {
            showError('restaurant', 'Please select a restaurant.');
            valid = false;
        }

        // Date & Time 
        const resDate = resDateField.value;
        if (!resDate) {
            showError('resDate', 'Please choose a reservation date and time.');
            valid = false;
        } else if (new Date(resDate) < new Date()) {
            showError('resDate', 'Reservation date cannot be in the past.');
            valid = false;
        }

        // People
        const peopleValue = document.getElementById('people').value;
        const people = parseInt(peopleValue, 10);
        if (peopleValue === '' || isNaN(people) || people <= 0) {
            showError('people', 'Number of people must be greater than 0.');
            valid = false;
        }
        
        //Payment Method Validation 
        const method = form.querySelector('input[name="payMethod"]:checked');
        if (!method) {
            document.getElementById('payMethodError').textContent = 'Please choose a deposit method.';
            valid = false;
        } 
        else if (method.value === 'voucher') {
            if (!/^\d{12}$/.test(voucherCode.value.trim())) {
                showError('voucherCode', 'Voucher code must be exactly 12 digits.');
                valid = false;
            }
        } 
        else if (method.value === 'online') {
            if (!onlineMethod.value) {
                document.getElementById('onlineMethodError').textContent = 'Please select a payment type.';
                valid = false;
            } 
            else if (onlineMethod.value === 'credit' || onlineMethod.value === 'debit') {
                const num = cardNumber.value.trim();
                if (!/^\d+$/.test(num) || (num.length !== 15 && num.length !== 16)) {
                    showError('cardNumber', 'Card number must be 16 digits (Visa/MC) or 15 digits (Amex).');
                    valid = false;
                }
            } 
            else if (onlineMethod.value === 'duitnow') {
            }
        }

        //  Billing Email 
        const billEmail = billingEmail.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billEmail)) {
            showError('billingEmail', 'Please enter a valid billing email address.');
            valid = false;
        }

        // Final Check
        if (valid) {
            form.submit();   
        } else {
            const firstError = form.querySelector('.invalid');
            if (firstError) firstError.focus();
        }
    });
}

// Bill 
function initBillCalculator() {
    const form = document.getElementById('billForm');
    if (!form) return;

    const prices = {
        'sae-ma-eul': 30,
        'sushi-zanmai': 30,
        'bingshifu': 25,
        'blackbixon': 40,
        'haidilao': 80,
        'aoi-cafe': 30
    };

    const restaurantSelect = document.getElementById('calcRestaurant');
    const peopleInput      = document.getElementById('calcPeople');
    const addonsSelect     = document.getElementById('calcAddons');
    const totalOutput      = document.getElementById('totalBill');

    function calculateTotal() {
        const resto = restaurantSelect.value;
        const people = parseInt(peopleInput.value) || 0;
        const addonPrice = parseInt(addonsSelect.value) || 0;

        if (!resto || people < 1) {
            totalOutput.textContent = 'RM 0.00';
            return;
        }

        let basePrice = prices[resto];
        
        let pricePerPerson = basePrice + addonPrice;
        
        let subtotal = pricePerPerson * people;
        
        let total = subtotal * 1.10 * 1.06;

        totalOutput.textContent = 'RM ' + total.toFixed(2);
    }

    restaurantSelect.addEventListener('change', calculateTotal);
    peopleInput.addEventListener('input', calculateTotal);
    addonsSelect.addEventListener('change', calculateTotal);
}

document.addEventListener('DOMContentLoaded', function () {
    initRecommendPage();
    initRegisterPage();
    initReservationPage();
    initBillCalculator(); 
});
