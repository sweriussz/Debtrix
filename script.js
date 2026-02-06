// ============================================
// NEO-FINANCE CORE SYSTEM v3.0
// NEW: Tax System, Side Hustles, Achievements, Skill Tree, Insurance, Market Events
// ============================================

// --- SOUND SYSTEM ---
const SOUNDS = {
    earn: () => playSound(800, 0.1, 'sine'),
    lose: () => playSound(200, 0.15, 'square'),
    upgrade: () => playSound([400, 600, 800], 0.2, 'sine'),
    achievement: () => playSound([600, 800, 1000, 1200], 0.25, 'triangle'),
    alert: () => playSound(400, 0.3, 'sawtooth')
};

function playSound(freq, duration, type = 'sine') {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const freqs = Array.isArray(freq) ? freq : [freq];
        freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = type;
            osc.frequency.value = f;
            gain.gain.value = 0.1;
            osc.start(ctx.currentTime + i * 0.1);
            osc.stop(ctx.currentTime + i * 0.1 + duration);
        });
    } catch(e) { /* Silent fail */ }
}

// --- 1. INITIAL SETUP & REGIONS ---
const savedData = JSON.parse(localStorage.getItem('gameState'));

const setup = savedData || {
    name: 'Operator', 
    years: 10, 
    continent: 'eu'
};

const REGIONS = {
    na: { 
        label: "North America", 
        baseWork: 6500, 
        rent: 2500, 
        studyCost: 800, 
        mgSpeed: 1.0,
        initialBalance: 10000,
        initialIntellect: 7,
        initialHappiness: 100,
        taxRate: 0.25  // 25% tax
    },
    eu: { 
        label: "Europe", 
        baseWork: 4800, 
        rent: 1800, 
        studyCost: 400, 
        mgSpeed: 1.0,
        initialBalance: 5000,
        initialIntellect: 6,
        initialHappiness: 90,
        taxRate: 0.30  // 30% tax
    },
    asia: { 
        label: "Asia", 
        baseWork: 3800, 
        rent: 1200, 
        studyCost: 600, 
        mgSpeed: 1.2,
        initialBalance: 3000,
        initialIntellect: 5,
        initialHappiness: 75,
        taxRate: 0.20  // 20% tax
    },
    sa: { 
        label: "South Asia", 
        baseWork: 2500, 
        rent: 800, 
        studyCost: 700, 
        mgSpeed: 1.3,
        initialBalance: 1500,
        initialIntellect: 4,
        initialHappiness: 65,
        taxRate: 0.15  // 15% tax
    },
    af: { 
        label: "Africa", 
        baseWork: 1800, 
        rent: 400, 
        studyCost: 1000, 
        mgSpeed: 1.4,
        initialBalance: 1000,
        initialIntellect: 3,
        initialHappiness: 60,
        taxRate: 0.10  // 10% tax
    }
};

let currentReg = REGIONS[setup.continent] || REGIONS.eu;
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];

// --- SKILL TREE DEFINITIONS ---
const SKILLS = {
    analyst: {
        name: "Financial Analyst",
        levels: [
            { cost: 1000, intellect: 8, benefit: "Chart indicators unlocked", multiplier: 1.1 },
            { cost: 3000, intellect: 12, benefit: "Price prediction hints", multiplier: 1.2 },
            { cost: 8000, intellect: 16, benefit: "Advanced analytics", multiplier: 1.4 }
        ],
        current: 0
    },
    trader: {
        name: "Day Trader",
        levels: [
            { cost: 2000, intellect: 10, benefit: "-25% trading fees", multiplier: 1.15 },
            { cost: 5000, intellect: 14, benefit: "-50% trading fees", multiplier: 1.25 },
            { cost: 12000, intellect: 18, benefit: "Free trading", multiplier: 1.5 }
        ],
        current: 0
    },
    realtor: {
        name: "Real Estate Mogul",
        levels: [
            { cost: 5000, intellect: 12, benefit: "-10% property prices", multiplier: 1.1 },
            { cost: 15000, intellect: 16, benefit: "-20% property prices", multiplier: 1.25 },
            { cost: 40000, intellect: 20, benefit: "+50% rental income", multiplier: 1.5 }
        ],
        current: 0
    },
    negotiator: {
        name: "Master Negotiator",
        levels: [
            { cost: 1500, intellect: 9, benefit: "-1% loan interest", multiplier: 1.05 },
            { cost: 4000, intellect: 13, benefit: "-2% loan interest", multiplier: 1.15 },
            { cost: 10000, intellect: 17, benefit: "Fast credit recovery", multiplier: 1.3 }
        ],
        current: 0
    }
};

// --- SIDE HUSTLES ---
const SIDE_HUSTLES = {
    mining: {
        name: "Crypto Mining Rig",
        cost: 3000,
        monthlyIncome: 250,
        maintenance: 50,
        intellect: 10,
        owned: false
    },
    content: {
        name: "Content Creation",
        cost: 500,
        baseIncome: 100,
        scalesWithInt: true,
        scalesWithHappy: true,
        intellect: 8,
        owned: false
    },
    consulting: {
        name: "Freelance Consulting",
        cost: 0,
        baseIncome: 500,
        scalesWithInt: true,
        intellect: 15,
        turnCost: 1,  // Costs 1 move per period
        owned: false
    },
    delivery: {
        name: "Gig Delivery",
        cost: 0,
        baseIncome: 200,
        intellect: 0,
        happiness: -5,
        turnCost: 1,
        owned: true  // Always available
    }
};

// --- INSURANCE OPTIONS ---
const INSURANCE = {
    health: {
        name: "Health Insurance",
        cost: 200,
        protection: "medical_emergency",
        active: false
    },
    property: {
        name: "Property Insurance",
        cost: 150,
        protection: "property_damage",
        required: false,  // Required when owning property
        active: false
    },
    cyber: {
        name: "Cyber Security",
        cost: 100,
        protection: "portfolio_hack",
        active: false
    }
};

// --- ACHIEVEMENTS ---
const ACHIEVEMENTS = {
    firstMillion: { name: "First Million", desc: "Reach $1,000,000 net worth", unlocked: false, reward: 5000 },
    debtFree: { name: "Zero Debt Hero", desc: "Pay off all loans and stay debt-free for 12 months", unlocked: false, reward: 2000 },
    passivePro: { name: "Passive Income Master", desc: "Earn $5000/mo passive income", unlocked: false, reward: 3000 },
    dayTrader: { name: "Day Trader", desc: "Execute 50 successful trades", unlocked: false, reward: 1000 },
    propertyMogul: { name: "Real Estate Mogul", desc: "Own 5 properties", unlocked: false, reward: 10000 },
    perfectCredit: { name: "Perfect Credit", desc: "Reach 850 credit score", unlocked: false, reward: 5000 },
    maxHappy: { name: "Happiness Expert", desc: "Maintain 95%+ happiness for 12 months", unlocked: false, reward: 2000 },
    survivor: { name: "Economic Survivor", desc: "Survive a market crash", unlocked: false, reward: 3000 },
    earlyRetire: { name: "Early Retirement", desc: "Retire before year 10", unlocked: false, reward: 15000 },
    maxTier: { name: "System Architect", desc: "Reach Tier 5", unlocked: false, reward: 20000 }
};

// --- CHALLENGES (Monthly) ---
let CURRENT_CHALLENGE = null;
const CHALLENGE_TEMPLATES = [
    { name: "Savings Sprint", goal: "Save $5000 this month", check: (start, end) => end.emergencyFund - start.emergencyFund >= 5000, reward: 1000 },
    { name: "Debt Discipline", goal: "Don't take any loans this month", check: (start, end) => end.loans.length <= start.loans.length, reward: 800 },
    { name: "Passive Payday", goal: "Earn $1000 from passive income", check: (start, end) => end.passiveEarned >= 1000, reward: 1500 },
    { name: "Trading Master", goal: "Make 10 profitable trades", check: (start, end) => end.profitableTrades >= 10, reward: 2000 },
    { name: "Happiness Focus", goal: "Keep happiness above 85% all month", check: (start, end) => end.minHappiness >= 85, reward: 1000 }
];

// --- 2. TIER SYSTEM ---
const TIERS = {
    1: { name: "Street Survivor", color: "#00ff88", unlocks: ["LIFE OS", "DEBT CORE (basic)"], goal: "Reach $10,000 balance and 8 Intellect", description: "Learn expense control and basic savings" },
    2: { name: "Middle Manager", color: "#00e6ff", unlocks: ["TERMINAL (basic trading)"], goal: "Build $25,000 safety cushion", description: "Start investing and understanding markets" },
    3: { name: "Private Investor", color: "#9b7cff", unlocks: ["TERMINAL (crypto)", "DEBT CORE (advanced)"], goal: "Portfolio worth $75,000", description: "Diversify and protect from risks" },
    4: { name: "Rentier", color: "#ff4da6", unlocks: ["ASSET MATRIX"], goal: "Passive income > Monthly expenses", description: "Financial freedom through assets" },
    5: { name: "System Architect", color: "#ffd700", unlocks: ["Market manipulation", "Venture capital"], goal: "Control the market", description: "Complete financial dominance" }
};

// --- 3. CORE GAME STATE ---
const state = {
    // Basic Stats
    name: setup.name,
    balance: currentReg.initialBalance,
    years: setup.years,
    continent: setup.continent,
    intellect: currentReg.initialIntellect,
    happiness: currentReg.initialHappiness,
    tier: 1,
    movesLeft: 3,
    maxMoves: 3,
    year: 1,
    period: 0,
    totalTurns: 0,
    seasonIdx: 0,
    processing: false,
    score: 0,
    
    // Tutorial
    tutorialStep: 0,
    tutorialComplete: false,
    
    // Skills
    skills: JSON.parse(JSON.stringify(SKILLS)),
    
    // Side Hustles
    sideHustles: JSON.parse(JSON.stringify(SIDE_HUSTLES)),
    
    // Insurance
    insurance: JSON.parse(JSON.stringify(INSURANCE)),
    
    // Financial Systems
    creditScore: 650,
    emergencyFund: 0,
    loans: [],
    taxesPaid: 0,
    taxesDue: 0,
    quarterlyIncome: 0,
    
    // Portfolio
    portfolio: {},
    totalTrades: 0,
    profitableTrades: 0,
    
    // Life OS
    lifestyle: { food: 'basic', housing: 'basic', transport: 'basic' },
    subscriptions: [],
    savingsRate: 10,
    
    // Assets
    properties: [],
    businesses: [],
    
    // Market Data
    marketPrices: {
        'ARASAKA': { current: 100, history: [], volatility: 'medium', dividend: 0.02 },
        'BIOTECH': { current: 50, history: [], volatility: 'high', dividend: 0 },
        'NEON_COIN': { current: 0.5, history: [], volatility: 'extreme', dividend: 0 },
        'CYBER_ETF': { current: 150, history: [], volatility: 'low', dividend: 0.03 }
    },
    selectedAsset: 'ARASAKA',
    marketCrashRisk: 0,
    lastCrashPeriod: -999,
    
    // News Feed
    newsItems: [],
    
    // Achievements & Challenges
    achievements: JSON.parse(JSON.stringify(ACHIEVEMENTS)),
    currentChallenge: null,
    challengeStart: null,
    
    // Statistics
    stats: {
        totalEarned: 0,
        totalSpent: 0,
        totalInterestPaid: 0,
        passiveEarned: 0,
        bankruptciesAvoided: 0,
        minHappiness: 100,
        monthsDebtFree: 0,
        monthsHighHappiness: 0
    }
};

// ⚡ ADMIN MODE ACTIVATION ⚡
if (setup.name.toLowerCase() === 'admin') {
    state.balance = 10000000;  // 10 million
    state.intellect = 100;      // 100 intellect
    state.happiness = 999;      // Infinite happiness (capped at display but won't decay below 100)
    state.tier = 5;             // Max tier
    state.emergencyFund = 1000000; // 1 million emergency fund
    state.creditScore = 850;    // Perfect credit
    
    // Unlock all navigation
    state.tutorialComplete = true;
    
    // Max out all skills
    for (let skill in state.skills) {
        state.skills[skill].current = 3;
    }
    
    console.log('🔥 ADMIN MODE ACTIVATED 🔥');
}

// --- 4. UI ELEMENTS ---
const ui = {
    money: document.getElementById('ui-money'),
    hap: document.getElementById('ui-hap'),
    int: document.getElementById('ui-int'),
    moves: document.getElementById('ui-moves'),
    nick: document.getElementById('ui-nick'),
    tier: document.getElementById('ui-tier'),
    playerNick: document.getElementById('player-nick'),
    mgOverlay: document.getElementById('mg-overlay'),
    mgCanvas: document.getElementById('mg-canvas'),
    mgTimer: document.getElementById('mg-timer'),
    mgDesc: document.getElementById('mg-desc')
};

// --- 5. LOGGING SYSTEM ---
function log(msg, isEvent = false) {
    const container = document.getElementById('char-log-container');
    if (!container) return;

    const line = document.createElement('div');
    line.className = 'char-log-line';
    line.innerText = msg;
    if(isEvent) {
        line.style.color = 'var(--neon-pink)';
        line.style.fontWeight = 'bold';
    }
    
    container.appendChild(line);
    
    // Увеличено время показа с 4 до 8 секунд
    setTimeout(() => {
        line.style.opacity = '0';
        setTimeout(() => line.remove(), 500);
    }, 8000);
}

// --- 6. UI REFRESH ---
function refreshUI() {
    ui.money.innerText = `$${Math.round(state.balance).toLocaleString()}`;
    ui.hap.innerText = `${Math.round(state.happiness)}%`;
    ui.int.innerText = state.intellect.toFixed(1);
    ui.moves.innerText = `${state.movesLeft} / ${state.maxMoves}`;
    ui.nick.innerText = state.name;
    
    // Fix: Properly get tier info even for admin (tier 5)
    const tierInfo = TIERS[state.tier] || TIERS[5];
    ui.tier.innerText = tierInfo.name;
    ui.tier.style.color = tierInfo.color;
    
    checkTierProgression();
    checkAchievements();
    updateNavButtons();
    showTutorialHint();
    updateChallengeDisplay(); // Показываем challenge постоянно
}

// --- 7. TUTORIAL SYSTEM ---
function showTutorialHint() {
    if (state.tutorialComplete) return;
    
    const hints = [
        { step: 0, msg: "Welcome! Click WORK to earn your first income.", highlight: 'workBtn' },
        { step: 1, msg: "Great! Now try STUDY to increase your Intellect.", highlight: 'learnBtn' },
        { step: 2, msg: "Open LIFE OS to manage your budget.", highlight: 'nav-lifeos' },
        { step: 3, msg: "Check DEBT CORE to see credit options.", highlight: 'nav-debtcore' },
        { step: 4, msg: "Tutorial complete! You're on your own now.", highlight: null }
    ];
    
    const current = hints[state.tutorialStep];
    if (current && current.highlight) {
        const elem = document.getElementById(current.highlight);
        if (elem) {
            elem.style.animation = 'pulse 1s infinite';
            log(current.msg, true);
        }
    }
    
    if (state.tutorialStep >= hints.length - 1) {
        state.tutorialComplete = true;
    }
}

function advanceTutorial() {
    if (!state.tutorialComplete) {
        state.tutorialStep++;
    }
}

// --- 8. TIER PROGRESSION ---
function checkTierProgression() {
    const totalAssets = state.balance + calculatePortfolioValue() + calculatePropertyValue();
    const passiveIncome = calculatePassiveIncome();
    const monthlyExpenses = calculateMonthlyExpenses();
    
    if (state.tier === 1 && state.balance >= 10000 && state.intellect >= 8) {
        upgradeTier(2);
    }
    
    if (state.tier === 2 && state.emergencyFund >= 25000) {
        upgradeTier(3);
    }
    
    if (state.tier === 3 && totalAssets >= 75000) {
        upgradeTier(4);
    }
    
    if (state.tier === 4 && passiveIncome > monthlyExpenses) {
        upgradeTier(5);
    }
}

function upgradeTier(newTier) {
    state.tier = newTier;
    const tierInfo = TIERS[newTier];
    SOUNDS.upgrade();
    log(`🎉 TIER UPGRADE: ${tierInfo.name.toUpperCase()}!`, true);
    log(`UNLOCKED: ${tierInfo.unlocks.join(', ')}`, true);
    
    // Confetti effect
    createConfetti();
    
    if (newTier === 5) {
        unlockAchievement('maxTier');
    }
}

function createConfetti() {
    const colors = ['#00e6ff', '#ff4da6', '#9b7cff', '#00ff88'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -20px;
                z-index: 9999;
                animation: fall ${2 + Math.random() * 2}s linear;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 5px var(--neon-blue); }
        50% { box-shadow: 0 0 20px var(--neon-blue); }
    }
`;
document.head.appendChild(style);

function updateNavButtons() {
    // LIFE OS - Always available
    const lifeBtn = document.getElementById('nav-lifeos');
    if (lifeBtn) {
        lifeBtn.classList.remove('locked');
    }
    
    // DEBT CORE - Available from Tier 1
    const debtBtn = document.getElementById('nav-debtcore');
    if (debtBtn) {
        debtBtn.classList.remove('locked');
    }
    
    // TERMINAL - Unlocked at Tier 2
    const termBtn = document.getElementById('nav-terminal');
    if (termBtn && state.tier >= 2) {
        termBtn.classList.remove('locked');
    }
    
    // ASSET MATRIX - Unlocked at Tier 4
    const assetBtn = document.getElementById('nav-assets');
    if (assetBtn && state.tier >= 4) {
        assetBtn.classList.remove('locked');
    }
}

// --- 9. CALCULATIONS ---
function calculatePortfolioValue() {
    let total = 0;
    for (let asset in state.portfolio) {
        total += state.portfolio[asset] * state.marketPrices[asset].current;
    }
    return total;
}

function calculatePropertyValue() {
    return state.properties.reduce((sum, prop) => sum + prop.value, 0);
}

function calculatePassiveIncome() {
    let income = 0;
    
    // Properties
    state.properties.forEach(p => {
        const realtorBonus = state.skills.realtor.current === 3 ? 1.5 : 1.0;
        income += (p.monthlyIncome || 0) * realtorBonus;
    });
    
    // Businesses
    state.businesses.forEach(b => income += b.monthlyIncome || 0);
    
    // Side Hustles
    for (let key in state.sideHustles) {
        const hustle = state.sideHustles[key];
        if (!hustle.owned) continue;
        
        if (key === 'mining') {
            income += hustle.monthlyIncome - hustle.maintenance;
        } else if (key === 'content') {
            let amt = hustle.baseIncome;
            if (hustle.scalesWithInt) amt *= (1 + state.intellect * 0.05);
            if (hustle.scalesWithHappy) amt *= (state.happiness / 100);
            income += amt;
        }
    }
    
    // Dividends
    for (let asset in state.portfolio) {
        const shares = state.portfolio[asset];
        const price = state.marketPrices[asset].current;
        const dividend = state.marketPrices[asset].dividend || 0;
        income += shares * price * dividend;
    }
    
    return income;
}

function calculateMonthlyExpenses() {
    const lifestyleCosts = {
        food: { cheap: 150, basic: 300, premium: 600 },      // 75% от оригинала
        housing: { minimal: 375, basic: 750, luxury: 1875 }, // 75% от оригинала
        transport: { public: 75, basic: 225, premium: 600 }  // 75% от оригинала
    };
    
    let total = currentReg.rent * 0.75;  // 75% от ренты
    total += lifestyleCosts.food[state.lifestyle.food] || 300;
    total += lifestyleCosts.housing[state.lifestyle.housing] || 750;
    total += lifestyleCosts.transport[state.lifestyle.transport] || 225;
    total += state.subscriptions.filter(s => s.active).reduce((sum, s) => sum + s.cost, 0);
    
    // Insurance
    for (let key in state.insurance) {
        if (state.insurance[key].active) {
            total += state.insurance[key].cost;
        }
    }
    
    return total;
}

function calculateTaxBracket() {
    const income = state.quarterlyIncome;
    let rate = currentReg.taxRate;
    
    // Progressive tax brackets
    if (income > 100000) rate += 0.1;
    if (income > 250000) rate += 0.1;
    if (income > 500000) rate += 0.15;
    
    // Deductions
    let deductions = 0;
    deductions += state.properties.length * 2000;  // Property deduction
    deductions += Math.min(state.stats.totalSpent * 0.1, 5000);  // Education deduction
    
    const taxable = Math.max(0, income - deductions);
    return { rate, taxable, deductions };
}

// --- 10. MINIGAMES (same as before) ---
function startAction(type) {
    if (state.movesLeft <= 0 || state.processing) {
        log("NOT ENOUGH ENERGY OR PROCESSING...");
        SOUNDS.alert();
        return;
    }
    state.processing = true;
    ui.mgOverlay.style.display = 'flex';
    ui.mgCanvas.innerHTML = '';
    state.score = 0;

    if (type === 'work') {
        runWorkGame();
        if (state.tutorialStep === 0) advanceTutorial();
    }
    if (type === 'learn') {
        runStudyGame();
        if (state.tutorialStep === 1) advanceTutorial();
    }
    if (type === 'rest') runRestGame();
}

function runWorkGame() {
    document.getElementById('mg-title').innerText = "DATA HARVEST";
    ui.mgDesc.innerText = "Click Red Nodes!";
    let time = 3.5;  // Немного увеличил с 3.0 до 3.5 (не так легко как 4)
    const speed = 280 / currentReg.mgSpeed;  // Умеренная скорость

    const inter = setInterval(() => {
        time -= 0.1;
        ui.mgTimer.innerText = time.toFixed(2);
        
        const node = document.createElement('div');
        // Размер 35px (средний)
        node.style.cssText = `position:absolute; width:35px; height:35px; background:var(--neon-pink); left:${Math.random()*235}px; top:${Math.random()*235}px; cursor:pointer; box-shadow: 0 0 10px var(--neon-pink); border-radius:50%; z-index:2001;`;
        node.onclick = () => { state.score++; node.remove(); };
        ui.mgCanvas.appendChild(node);
     
        setTimeout(() => { if(node) node.remove(); }, 500);  // Умеренное время жизни
        
        if (time <= 0) { 
            clearInterval(inter); 
            finishAction('work'); 
        }
    }, speed);
}

function runStudyGame() {
    document.getElementById('mg-title').innerText = "NEURAL TRAINING";
    ui.mgDesc.innerText = "Press keys when highlighted!";
    let time = 3.0;
    const keys = ['Q', 'W', 'E', 'A', 'S', 'D'];
    let currentKey = null;
    let keyDiv = null;

    function showKey() {
        if (keyDiv) keyDiv.remove();
        currentKey = keys[Math.floor(Math.random() * keys.length)];
        keyDiv = document.createElement('div');
        keyDiv.style.cssText = `position:absolute; width:80px; height:80px; background:var(--neon-blue); left:110px; top:110px; display:flex; align-items:center; justify-content:center; font-size:32px; font-weight:bold; box-shadow: 0 0 20px var(--neon-blue); z-index:2001;`;
        keyDiv.innerText = currentKey;
        ui.mgCanvas.appendChild(keyDiv);
    }

    showKey();

    const keyHandler = (e) => {
        if (e.key.toUpperCase() === currentKey) {
            state.score++;
            showKey();
        }
    };

    document.addEventListener('keydown', keyHandler);

    const inter = setInterval(() => {
        time -= 0.1;
        ui.mgTimer.innerText = time.toFixed(2);
        if (time <= 0) {
            clearInterval(inter);
            document.removeEventListener('keydown', keyHandler);
            finishAction('learn');
        }
    }, 100);
}

function runRestGame() {
    document.getElementById('mg-title').innerText = "MEDITATION";
    ui.mgDesc.innerText = "Press SPACE when line is in green zone!";
    let time = 3.0;  // 1 attempt only
    
    // Create zones - BIGGER FIELD
    const greenZone = document.createElement('div');
    greenZone.style.cssText = `
        position: absolute;
        width: 30px;
        height: 280px;
        background: rgba(0, 255, 136, 0.3);
        border: 2px solid var(--neon-green);
        left: 135px;
        top: 10px;
        z-index: 2000;
    `;
    ui.mgCanvas.appendChild(greenZone);
    
    // Create moving line
    const line = document.createElement('div');
    line.style.cssText = `
        position: absolute;
        width: 4px;
        height: 280px;
        background: var(--neon-blue);
        box-shadow: 0 0 10px var(--neon-blue);
        left: 0;
        top: 10px;
        z-index: 2001;
    `;
    ui.mgCanvas.appendChild(line);
    
    let position = 0;
    let direction = 1;
    let stopped = false;
    let attempts = 1;  // ONLY 1 ATTEMPT!
    
    const moveInterval = setInterval(() => {
        if (!stopped) {
            position += direction * 6;  // MUCH FASTER (was 4)
            if (position >= 296 || position <= 0) direction *= -1;
            line.style.left = position + 'px';
        }
    }, 20);
    
    const keyHandler = (e) => {
        if (e.code === 'Space' && !stopped && attempts > 0) {
            e.preventDefault();
            stopped = true;
            attempts--;
            
            // Check if in green zone (135-165) - SMALLER ZONE (30px instead of 50px)
            const isInZone = position >= 135 && position <= 165;
            
            if (isInZone) {
                state.score += 30;  // Good reward for hard task
                line.style.background = 'var(--neon-green)';
                line.style.boxShadow = '0 0 20px var(--neon-green)';
            } else {
                const distance = Math.min(Math.abs(position - 135), Math.abs(position - 165));
                const closePoints = Math.max(0, 15 - distance / 2);  // Some points for being close
                state.score += Math.round(closePoints);
                line.style.background = 'var(--neon-pink)';
                line.style.boxShadow = '0 0 20px var(--neon-pink)';
            }
            
            setTimeout(() => {
                clearInterval(moveInterval);
                clearInterval(timeInterval);
                document.removeEventListener('keydown', keyHandler);
                finishAction('rest');
            }, 500);
        }
    };
    
    document.addEventListener('keydown', keyHandler);
    
    const timeInterval = setInterval(() => {
        time -= 0.5;
        ui.mgTimer.innerText = `1 attempt`;
        
        if (time <= 0) {
            clearInterval(moveInterval);
            clearInterval(timeInterval);
            document.removeEventListener('keydown', keyHandler);
            finishAction('rest');
        }
    }, 500);
}

function finishAction(type) {
    ui.mgOverlay.style.display = 'none';
    state.processing = false;
    state.movesLeft--;

    if (type === 'work') {
        // Более сбалансированная формула заработка
        // Теперь не 2x, а обычный заработок на основе score
        const baseEarning = currentReg.baseWork * (1 + state.intellect * 0.05) * (state.score / 18);  // Делитель 18 вместо 15
        const analystBonus = state.skills.analyst.current > 0 ? SKILLS.analyst.levels[state.skills.analyst.current - 1].multiplier : 1;
        const earned = Math.round(baseEarning * analystBonus * 1.3);  // 1.3x вместо 2.0x
        
        state.balance += earned;
        state.quarterlyIncome += earned;
        state.stats.totalEarned += earned;
        
        // Admin mode: no happiness loss
        if (state.name.toLowerCase() !== 'admin') {
            state.happiness -= 5;
        }
        
        SOUNDS.earn();
        log(`EARNED: $${earned.toLocaleString()}`);
    }

    if (type === 'learn') {
        const cost = currentReg.studyCost;
        if (state.balance >= cost) {
            state.balance -= cost;
            state.stats.totalSpent += cost;
            // Увеличенный прирост интеллекта: 2x множитель
            const gained = (state.score / 20) * 0.5 * 2.0;  // Теперь в 2 раза больше!
            state.intellect += gained;
            
            // Admin mode: no happiness loss
            if (state.name.toLowerCase() !== 'admin') {
                state.happiness -= 3;
            }
            
            log(`INTELLECT: +${gained.toFixed(2)} (-$${cost})`);
        } else {
            SOUNDS.lose();
            log("NOT ENOUGH FUNDS FOR STUDY");
        }
    }

    if (type === 'rest') {
        const restored = Math.round(state.score / 2);
        state.happiness = Math.min(100, state.happiness + restored);
        log(`HAPPINESS: +${restored}%`);
    }

    refreshUI();
}

// --- 11. TURN SYSTEM ---
function nextTurn() {
    state.totalTurns++;
    state.period++;
    state.movesLeft = state.maxMoves;
    
    // Track minimum happiness
    if (state.happiness < state.stats.minHappiness) {
        state.stats.minHappiness = state.happiness;
    }
    
    // Change season
    if (state.period % 3 === 0) {
        state.seasonIdx = (state.seasonIdx + 1) % 4;
        updateBackground();
    }
    
    // Year progression
    if (state.period % 12 === 0) {
        state.year++;
        log(`📅 YEAR ${state.year} COMPLETE`, true);
        SOUNDS.achievement();
    }
    
    // Quarterly taxes (every 3 months)
    if (state.period % 3 === 0) {
        processTaxes();
    }
    
    // Monthly expenses
    const expenses = calculateMonthlyExpenses();
    state.balance -= expenses;
    state.stats.totalSpent += expenses;
    log(`Monthly Expenses: -$${expenses.toLocaleString()}`);
    
    // Auto-savings
    if (state.savingsRate > 0 && state.balance > 0) {
        const saved = Math.min(state.balance, state.balance * (state.savingsRate / 100));
        state.balance -= saved;
        state.emergencyFund += saved;
    }
    
    // Passive income
    const passive = calculatePassiveIncome();
    if (passive > 0) {
        state.balance += passive;
        state.stats.passiveEarned += passive;
        SOUNDS.earn();
        log(`Passive Income: +$${passive.toFixed(0)}`);
    }
    
    // Loan payments
    processLoans();
    
    // Market updates
    updateMarket();
    
    // Random events
    if (Math.random() < 0.15) {
        triggerRandomEvent();
    }
    
    // Happiness decay
    state.happiness = Math.max(20, state.happiness - 2);
    
    // Admin mode: prevent happiness decay below 100
    if (state.name.toLowerCase() === 'admin') {
        state.happiness = Math.max(100, state.happiness);
    }
    
    // Lifestyle effects
    applyLifestyleEffects();
    
    // Track stats for challenges
    if (state.happiness >= 85) {
        state.stats.monthsHighHappiness++;
    }
    
    if (state.loans.length === 0) {
        state.stats.monthsDebtFree++;
    } else {
        state.stats.monthsDebtFree = 0;
    }
    
    // Check challenge completion
    if (state.period % 3 === 0) {
        checkChallengeCompletion();
        assignNewChallenge();
    }
    
    // Check game over
    if (state.balance < -10000) {
        if (state.emergencyFund > 10000) {
            const rescue = 10000;
            state.emergencyFund -= rescue;
            state.balance += rescue;
            state.stats.bankruptciesAvoided++;
            log("💰 EMERGENCY FUND SAVED YOU FROM BANKRUPTCY!", true);
            SOUNDS.achievement();
        } else {
            SOUNDS.lose();
            alert("GAME OVER: Bankruptcy!");
            window.location.href = 'finance.html';
            return;
        }
    }
    
    if (state.year > state.years) {
        endGame();
        return;
    }
    
    // Reset quarterly income tracker
    if (state.period % 3 === 0) {
        state.quarterlyIncome = 0;
    }
    
    refreshUI();
}

function applyLifestyleEffects() {
    // Food effects
    if (state.lifestyle.food === 'cheap') {
        state.happiness = Math.max(0, state.happiness - 2);
    } else if (state.lifestyle.food === 'premium') {
        state.happiness = Math.min(100, state.happiness + 1);
    }
    
    // Active subscriptions
    state.subscriptions.forEach(sub => {
        if (sub.active && sub.name === "Cyber Gym Access") {
            state.happiness = Math.min(100, state.happiness + 2);
        }
    });
}

function processTaxes() {
    const { rate, taxable, deductions } = calculateTaxBracket();
    const taxOwed = Math.round(taxable * rate);
    
    if (taxOwed > 0) {
        state.balance -= taxOwed;
        state.taxesPaid += taxOwed;
        state.stats.totalSpent += taxOwed;
        SOUNDS.lose();
        log(`💸 TAX PAYMENT: -$${taxOwed.toLocaleString()} (${(rate*100).toFixed(1)}% rate)`, true);
        if (deductions > 0) {
            log(`Deductions saved you $${Math.round(deductions * rate).toLocaleString()}`);
        }
    }
}

function updateBackground() {
    const bgSeason = document.getElementById('bg-season');
    const bgChar = document.getElementById('bg-char');
    
    if (bgSeason) {
        const curSeason = SEASONS[state.seasonIdx];
        bgSeason.style.backgroundImage = `url('images/seasons/${curSeason}.jpg')`;
    }

    if (bgChar) {
        let mood = 'neutral';
        if (state.happiness >= 80) mood = 'fortunate';
        else if (state.happiness >= 60) mood = 'happy';
        else if (state.happiness >= 31) mood = 'neutral';
        else mood = 'stressed';
        
        bgChar.style.backgroundImage = `url('images/characters/${mood}.png')`;
    }
}

// Remove seasonal particles function - not needed anymore
function createSeasonalParticles(season) {
    // Empty - removed particle system
}

// Add float animation
const floatStyle = document.createElement('style');
floatStyle.textContent += `
    @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); }
        25% { transform: translateY(-30px) translateX(20px); }
        50% { transform: translateY(-10px) translateX(-20px); }
        75% { transform: translateY(-40px) translateX(10px); }
    }
`;
document.head.appendChild(floatStyle);

function processLoans() {
    const negotiatorLevel = state.skills.negotiator.current;
    const interestDiscount = negotiatorLevel > 0 ? negotiatorLevel * 0.01 : 0;
    
    state.loans.forEach(loan => {
        const adjustedInterest = Math.max(0, loan.interest * (1 - interestDiscount));
        const payment = loan.monthlyPayment;
        
        if (state.balance >= payment) {
            state.balance -= payment;
            state.stats.totalInterestPaid += adjustedInterest;
            loan.remaining -= (payment - adjustedInterest);
        } else {
            state.creditScore = Math.max(300, state.creditScore - 20);
            SOUNDS.alert();
            log("⚠️ MISSED LOAN PAYMENT! Credit score -20", true);
        }
    });
    
    state.loans = state.loans.filter(l => l.remaining > 0);
    
    // Credit score recovery
    if (state.loans.length === 0 && negotiatorLevel === 3) {
        state.creditScore = Math.min(850, state.creditScore + 5);
    }
}

function updateMarket() {
    // Market crash mechanic
    if (state.period - state.lastCrashPeriod > 60 && Math.random() < 0.02) {
        triggerMarketCrash();
        return;
    }
    
    // Normal market movement
    for (let asset in state.marketPrices) {
        const data = state.marketPrices[asset];
        const volatility = data.volatility === 'extreme' ? 0.15 : data.volatility === 'high' ? 0.08 : data.volatility === 'medium' ? 0.04 : 0.02;
        const change = (Math.random() - 0.5) * 2 * volatility;
        data.current *= (1 + change);
        data.current = Math.max(0.01, data.current); // Prevent negative prices
        data.history.push(data.current);
        if (data.history.length > 50) data.history.shift();
    }
    
    generateMarketNews();
}

function triggerMarketCrash() {
    state.lastCrashPeriod = state.period;
    SOUNDS.alert();
    log("🔴 MARKET CRASH! All assets down 30-50%!", true);
    
    for (let asset in state.marketPrices) {
        const drop = 0.3 + Math.random() * 0.2;
        state.marketPrices[asset].current *= (1 - drop);
    }
    
    unlockAchievement('survivor');
    
    state.newsItems.unshift({ 
        text: "🚨 BREAKING: Market crash! Global panic selling continues", 
        turn: state.totalTurns 
    });
}

function generateMarketNews() {
    const newsTemplates = [
        "ARASAKA CORPORATION reports Q3 earnings beat expectations",
        "BIOTECH breakthrough: New cybernetic implant approved by regulators",
        "NEON_COIN volatility spikes amid regulatory concerns",
        "CYBER_ETF reaches new high on tech sector rally",
        "Analyst predicts market correction in coming months",
        "Central bank maintains interest rates, markets stable",
        "Trade tensions ease, global markets rally",
        "New IPO launches: QUANTUM_TECH now available"
    ];
    
    if (Math.random() < 0.3) {
        const news = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
        state.newsItems.unshift({ text: news, turn: state.totalTurns });
        if (state.newsItems.length > 10) state.newsItems.pop();
    }
}

function triggerRandomEvent() {
    const events = [
        { 
            name: "Medical Emergency", 
            effect: () => { 
                const cost = 2000;
                if (state.insurance.health.active) {
                    log(`🏥 Medical Emergency covered by insurance!`, true);
                } else {
                    const fromFund = Math.min(state.emergencyFund, cost);
                    state.emergencyFund -= fromFund;
                    state.balance -= (cost - fromFund);
                    SOUNDS.lose();
                    log(`🏥 Medical Emergency: -$${cost} (Fund: $${fromFund})`, true);
                }
            }
        },
        { 
            name: "Work Bonus", 
            effect: () => {
                const bonus = Math.round(currentReg.baseWork * 0.5);
                state.balance += bonus;
                state.quarterlyIncome += bonus;
                SOUNDS.earn();
                log(`💼 Work Bonus: +$${bonus.toLocaleString()}!`, true);
            }
        },
        { 
            name: "Property Damage", 
            effect: () => {
                if (state.properties.length === 0) return;
                const damage = 3000;
                if (state.insurance.property.active) {
                    log(`🏠 Property damage covered by insurance!`, true);
                } else {
                    state.balance -= damage;
                    SOUNDS.lose();
                    log(`🏠 Property Damage: -$${damage}`, true);
                }
            }
        },
        { 
            name: "Portfolio Hack", 
            effect: () => {
                if (calculatePortfolioValue() === 0) return;
                if (state.insurance.cyber.active) {
                    log(`🛡️ Hack attempt blocked by Cyber Security!`, true);
                } else {
                    const loss = calculatePortfolioValue() * 0.1;
                    for (let asset in state.portfolio) {
                        state.portfolio[asset] *= 0.9;
                    }
                    SOUNDS.alert();
                    log(`🔓 PORTFOLIO HACKED: -$${loss.toFixed(0)}`, true);
                }
            }
        },
        { 
            name: "Lucky Find", 
            effect: () => {
                state.balance += 500;
                state.happiness += 5;
                SOUNDS.achievement();
                log("🍀 Lucky Find: +$500 +5 Happiness!", true);
            }
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    event.effect();
}

// --- 12. ACHIEVEMENTS ---
function checkAchievements() {
    const netWorth = state.balance + calculatePortfolioValue() + calculatePropertyValue();
    
    if (netWorth >= 1000000 && !state.achievements.firstMillion.unlocked) {
        unlockAchievement('firstMillion');
    }
    
    if (state.stats.monthsDebtFree >= 12 && !state.achievements.debtFree.unlocked) {
        unlockAchievement('debtFree');
    }
    
    if (calculatePassiveIncome() >= 5000 && !state.achievements.passivePro.unlocked) {
        unlockAchievement('passivePro');
    }
    
    if (state.totalTrades >= 50 && !state.achievements.dayTrader.unlocked) {
        unlockAchievement('dayTrader');
    }
    
    if (state.properties.length >= 5 && !state.achievements.propertyMogul.unlocked) {
        unlockAchievement('propertyMogul');
    }
    
    if (state.creditScore >= 850 && !state.achievements.perfectCredit.unlocked) {
        unlockAchievement('perfectCredit');
    }
    
    if (state.stats.monthsHighHappiness >= 12 && !state.achievements.maxHappy.unlocked) {
        unlockAchievement('maxHappy');
    }
    
    const passiveIncome = calculatePassiveIncome();
    const expenses = calculateMonthlyExpenses();
    if (passiveIncome > expenses && state.year < 10 && !state.achievements.earlyRetire.unlocked) {
        unlockAchievement('earlyRetire');
    }
}

function unlockAchievement(key) {
    const achievement = state.achievements[key];
    if (achievement.unlocked) return;
    
    achievement.unlocked = true;
    state.balance += achievement.reward;
    
    SOUNDS.achievement();
    createConfetti();
    log(`🏆 ACHIEVEMENT: ${achievement.name}!`, true);
    log(`Reward: +$${achievement.reward.toLocaleString()}`, true);
}

// --- 13. CHALLENGES ---
function assignNewChallenge() {
    const available = CHALLENGE_TEMPLATES.filter(c => !state.currentChallenge || c.name !== state.currentChallenge.name);
    const challenge = available[Math.floor(Math.random() * available.length)];
    
    state.currentChallenge = challenge;
    state.challengeStart = {
        emergencyFund: state.emergencyFund,
        loans: state.loans.length,
        passiveEarned: 0,
        profitableTrades: 0,
        minHappiness: 100
    };
    
    log(`🎯 NEW CHALLENGE: ${challenge.name}`, true);
    log(`Goal: ${challenge.goal}`);
    updateChallengeDisplay();
}

function updateChallengeDisplay() {
    const widget = document.getElementById('challenge-widget');
    const nameEl = document.getElementById('challenge-name');
    const goalEl = document.getElementById('challenge-goal');
    
    if (!widget || !nameEl || !goalEl) return;
    
    if (state.currentChallenge) {
        widget.style.display = 'block';
        nameEl.innerText = state.currentChallenge.name;
        goalEl.innerText = state.currentChallenge.goal;
    } else {
        widget.style.display = 'none';
    }
}

function checkChallengeCompletion() {
    if (!state.currentChallenge) return;
    
    const end = {
        emergencyFund: state.emergencyFund,
        loans: state.loans.length,
        passiveEarned: state.stats.passiveEarned - (state.challengeStart.passiveEarnedTotal || 0),
        profitableTrades: state.profitableTrades - (state.challengeStart.profitableTradesTotal || 0),
        minHappiness: state.stats.minHappiness
    };
    
    if (state.currentChallenge.check(state.challengeStart, end)) {
        state.balance += state.currentChallenge.reward;
        SOUNDS.achievement();
        log(`✅ CHALLENGE COMPLETE: ${state.currentChallenge.name}!`, true);
        log(`Reward: +$${state.currentChallenge.reward}`, true);
        state.currentChallenge = null;
        updateChallengeDisplay(); // Обновляем display
    }
}

function endGame() {
    const totalAssets = state.balance + calculatePortfolioValue() + calculatePropertyValue();
    const message = `
🎮 SIMULATION COMPLETE!

📊 FINAL STATS:
💰 Net Worth: $${totalAssets.toLocaleString()}
🎯 Tier: ${TIERS[state.tier].name}
💳 Credit Score: ${state.creditScore}
😊 Happiness: ${Math.round(state.happiness)}%
📈 Total Earned: $${state.stats.totalEarned.toLocaleString()}
🏆 Achievements: ${Object.values(state.achievements).filter(a => a.unlocked).length}/10

Thanks for playing NEO-FINANCE!
    `;
    
    alert(message);
    localStorage.removeItem('gameState');
    window.location.href = 'finance.html';
}

// --- MODAL CONTROLS (keeping previous implementations but adding new ones) ---
function toggleStats() {
    const modal = document.getElementById('stats-modal');
    if (modal.style.display === 'none') {
        const data = document.getElementById('stats-data');
        const netWorth = state.balance + calculatePortfolioValue() + calculatePropertyValue();
        data.innerHTML = `
            <p><strong>Name:</strong> ${state.name}</p>
            <p><strong>Tier:</strong> ${TIERS[state.tier].name}</p>
            <p><strong>Net Worth:</strong> $${netWorth.toLocaleString()}</p>
            <p><strong>Balance:</strong> $${state.balance.toLocaleString()}</p>
            <p><strong>Emergency Fund:</strong> $${state.emergencyFund.toLocaleString()}</p>
            <p><strong>Portfolio:</strong> $${calculatePortfolioValue().toLocaleString()}</p>
            <p><strong>Properties:</strong> $${calculatePropertyValue().toLocaleString()}</p>
            <p><strong>Passive Income:</strong> $${calculatePassiveIncome().toFixed(0)}/mo</p>
            <p><strong>Credit Score:</strong> ${state.creditScore}</p>
            <p><strong>Taxes Paid:</strong> $${state.taxesPaid.toLocaleString()}</p>
            <p><strong>Year:</strong> ${state.year} / ${state.years}</p>
        `;
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
    }
}

// --- 14. TERMINAL (TRADING) ---
function openTerminal() {
    if (state.tier < 2) {
        log("TERMINAL LOCKED - Reach Tier 2 first!");
        SOUNDS.alert();
        return;
    }
    document.getElementById('terminal-modal').style.display = 'flex';
    renderTerminal();
    if (state.tutorialStep === 3) advanceTutorial();
}

function closeTerminal() {
    document.getElementById('terminal-modal').style.display = 'none';
}

function renderTerminal() {
    renderPriceChart();
    
    const price = state.marketPrices[state.selectedAsset].current;
    document.getElementById('current-price').innerText = `$${price.toFixed(2)}`;
    document.getElementById('trade-price').innerText = `$${price.toFixed(2)}`;
    
    const portfolioDiv = document.getElementById('portfolio-list');
    portfolioDiv.innerHTML = '';
    for (let asset in state.portfolio) {
        if (state.portfolio[asset] > 0) {
            const value = state.portfolio[asset] * state.marketPrices[asset].current;
            const cost = state.portfolio[asset] * 100; // Simplified cost basis
            const profit = value - cost;
            const profitColor = profit >= 0 ? 'var(--neon-green)' : 'var(--neon-pink)';
            portfolioDiv.innerHTML += `
                <div class="portfolio-item">
                    <span>${asset}: ${state.portfolio[asset].toFixed(2)} shares</span>
                    <span style="color: ${profitColor}">$${value.toFixed(2)}</span>
                </div>
            `;
        }
    }
    
    const newsDiv = document.getElementById('news-ticker');
    newsDiv.innerHTML = '';
    state.newsItems.slice(0, 5).forEach(item => {
        newsDiv.innerHTML += `<div class="news-item">${item.text}</div>`;
    });
    
    document.querySelectorAll('.asset-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.asset-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.selectedAsset = tab.dataset.asset;
            renderTerminal();
        };
    });
}

function renderPriceChart() {
    const canvas = document.getElementById('price-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const data = state.marketPrices[state.selectedAsset];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (data.history.length < 2) return;
    
    const max = Math.max(...data.history);
    const min = Math.min(...data.history);
    const range = max - min || 1;
    
    ctx.strokeStyle = '#00e6ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.history.forEach((price, i) => {
        const x = (i / data.history.length) * canvas.width;
        const y = canvas.height - ((price - min) / range) * (canvas.height - 20) - 10;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
}

function executeTrade(type) {
    const amount = parseInt(document.getElementById('trade-amount').value) || 0;
    if (amount <= 0) return;
    
    const asset = state.selectedAsset;
    const price = state.marketPrices[asset].current;
    
    // Trading fee (reduced by Day Trader skill)
    const traderLevel = state.skills.trader.current;
    let fee = 0.01; // 1% base fee
    if (traderLevel === 1) fee = 0.0075;
    if (traderLevel === 2) fee = 0.005;
    if (traderLevel === 3) fee = 0;
    
    const total = amount * price;
    const feeAmount = total * fee;
    
    if (type === 'buy') {
        if (state.balance >= (total + feeAmount)) {
            state.balance -= (total + feeAmount);
            state.quarterlyIncome -= feeAmount;
            state.portfolio[asset] = (state.portfolio[asset] || 0) + amount;
            state.totalTrades++;
            SOUNDS.earn();
            log(`BOUGHT ${amount} ${asset} @ $${price.toFixed(2)} (Fee: $${feeAmount.toFixed(2)})`);
        } else {
            SOUNDS.alert();
            log("INSUFFICIENT FUNDS");
        }
    } else {
        if ((state.portfolio[asset] || 0) >= amount) {
            state.balance += (total - feeAmount);
            state.quarterlyIncome += (total - feeAmount);
            state.portfolio[asset] -= amount;
            state.totalTrades++;
            state.profitableTrades++; // Simplified - assume profit
            SOUNDS.earn();
            log(`SOLD ${amount} ${asset} @ $${price.toFixed(2)} (Fee: $${feeAmount.toFixed(2)})`);
        } else {
            SOUNDS.alert();
            log("INSUFFICIENT SHARES");
        }
    }
    
    refreshUI();
    renderTerminal();
}

// --- 15. DEBT CORE ---
function openDebtCore() {
    document.getElementById('debt-modal').style.display = 'flex';
    renderDebtCore();
    if (state.tutorialStep === 2) advanceTutorial();
}

function closeDebtCore() {
    document.getElementById('debt-modal').style.display = 'none';
}

function renderDebtCore() {
    document.getElementById('credit-score').innerText = state.creditScore;
    const scoreLabel = state.creditScore >= 800 ? 'EXCELLENT' : state.creditScore >= 700 ? 'GOOD' : state.creditScore >= 600 ? 'FAIR' : 'POOR';
    document.querySelector('.score-label').innerText = scoreLabel;
    document.getElementById('emergency-balance').innerText = state.emergencyFund.toLocaleString();
    
    const offersDiv = document.getElementById('credit-offers');
    offersDiv.innerHTML = '';
    
    const negotiatorLevel = state.skills.negotiator.current;
    const rateDiscount = negotiatorLevel > 0 ? negotiatorLevel * 0.01 : 0;
    
    const creditOffers = [
        { name: "Quick Cash", amount: 5000, rate: 0.15 - rateDiscount, term: 12 },
        { name: "Standard Loan", amount: 15000, rate: 0.08 - rateDiscount, term: 24 },
        { name: "Premium Credit", amount: 50000, rate: 0.05 - rateDiscount, term: 48, minScore: 700 }
    ];
    
    creditOffers.forEach(offer => {
        if (offer.minScore && state.creditScore < offer.minScore) return;
        
        const monthlyPayment = (offer.amount * (1 + offer.rate)) / offer.term;
        offersDiv.innerHTML += `
            <div class="credit-offer" onclick="takeLoan(${offer.amount}, ${offer.rate}, ${offer.term})">
                <h4>${offer.name}</h4>
                <div>Amount: $${offer.amount.toLocaleString()}</div>
                <div>Rate: ${(offer.rate * 100).toFixed(1)}% APR</div>
                <div>Monthly: $${monthlyPayment.toFixed(2)}</div>
                <div style="font-size: 10px; color: var(--neon-purple);">Total: $${(offer.amount * (1 + offer.rate)).toFixed(0)}</div>
            </div>
        `;
    });
    
    const loansDiv = document.getElementById('active-loans');
    loansDiv.innerHTML = '';
    state.loans.forEach((loan, i) => {
        loansDiv.innerHTML += `
            <div class="loan-item">
                <div>Loan #${i+1}</div>
                <div>Remaining: $${loan.remaining.toFixed(2)}</div>
                <div>Monthly: $${loan.monthlyPayment.toFixed(2)}</div>
            </div>
        `;
    });
    
    if (state.loans.length === 0) {
        loansDiv.innerHTML = '<p style="text-align:center; color: var(--neon-green);">No active loans ✓</p>';
    }
}

function takeLoan(amount, rate, term) {
    const monthlyPayment = (amount * (1 + rate)) / term;
    state.balance += amount;
    state.quarterlyIncome += amount;
    state.loans.push({
        amount: amount,
        remaining: amount * (1 + rate),
        monthlyPayment: monthlyPayment,
        interest: (amount * rate) / term
    });
    state.creditScore = Math.max(300, state.creditScore - 10);
    SOUNDS.earn();
    log(`💳 LOAN APPROVED: $${amount.toLocaleString()}`, true);
    refreshUI();
    renderDebtCore();
}

function depositEmergency() {
    const amount = parseFloat(document.getElementById('emergency-deposit').value) || 0;
    if (amount > 0 && state.balance >= amount) {
        state.balance -= amount;
        state.emergencyFund += amount;
        document.getElementById('emergency-deposit').value = '';
        SOUNDS.earn();
        log(`💰 Emergency Fund: +$${amount}`);
        refreshUI();
        renderDebtCore();
    }
}

// --- 16. LIFE OS ---
function openLifeOS() {
    document.getElementById('life-modal').style.display = 'flex';
    renderLifeOS();
}

function closeLifeOS() {
    document.getElementById('life-modal').style.display = 'none';
}

function renderLifeOS() {
    const expenseDiv = document.getElementById('expense-controls');
    expenseDiv.innerHTML = `
        <div class="expense-control">
            <h4>Food Quality</h4>
            <div class="expense-options">
                <div class="expense-option ${state.lifestyle.food === 'cheap' ? 'selected' : ''}" onclick="setLifestyle('food', 'cheap')">
                    Cheap<br>$150/mo<br><small>-5 Happy</small>
                </div>
                <div class="expense-option ${state.lifestyle.food === 'basic' ? 'selected' : ''}" onclick="setLifestyle('food', 'basic')">
                    Basic<br>$300/mo
                </div>
                <div class="expense-option ${state.lifestyle.food === 'premium' ? 'selected' : ''}" onclick="setLifestyle('food', 'premium')">
                    Premium<br>$600/mo<br><small>+3 Happy</small>
                </div>
            </div>
        </div>
        
        <div class="expense-control" style="margin-top: 15px;">
            <h4>Insurance Coverage</h4>
            ${Object.keys(state.insurance).map(key => {
                const ins = state.insurance[key];
                return `
                    <div class="subscription-item">
                        <div>
                            <strong>${ins.name}</strong><br>
                            <small>$${ins.cost}/mo - Protects: ${ins.protection.replace('_', ' ')}</small>
                        </div>
                        <button class="subscription-toggle ${ins.active ? 'active' : ''}" onclick="toggleInsurance('${key}')">
                            ${ins.active ? 'CANCEL' : 'ACTIVATE'}
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    const subsDiv = document.getElementById('subscription-list');
    if (state.subscriptions.length === 0) {
        state.subscriptions = [
            { name: "Neural Analytics Pro", cost: 50, bonus: "Trading insights", active: false },
            { name: "Market Predictor AI", cost: 100, bonus: "+5% trade accuracy", active: false },
            { name: "Cyber Gym Access", cost: 30, bonus: "+2 Happiness/mo", active: false }
        ];
    }
    
    subsDiv.innerHTML = '';
    state.subscriptions.forEach((sub, i) => {
        subsDiv.innerHTML += `
            <div class="subscription-item">
                <div>
                    <strong>${sub.name}</strong><br>
                    <small>$${sub.cost}/mo - ${sub.bonus}</small>
                </div>
                <button class="subscription-toggle ${sub.active ? 'active' : ''}" onclick="toggleSubscription(${i})">
                    ${sub.active ? 'CANCEL' : 'SUBSCRIBE'}
                </button>
            </div>
        `;
    });
    
    const budgetDiv = document.getElementById('budget-breakdown');
    const expenses = calculateMonthlyExpenses();
    const passive = calculatePassiveIncome();
    const netCashFlow = passive - expenses;
    budgetDiv.innerHTML = `
        <div class="budget-item"><span>Rent:</span><span>-$${currentReg.rent}</span></div>
        <div class="budget-item"><span>Lifestyle:</span><span>-$${expenses - currentReg.rent - state.subscriptions.filter(s => s.active).reduce((sum, s) => sum + s.cost, 0) - Object.values(state.insurance).filter(i => i.active).reduce((sum, i) => sum + i.cost, 0)}</span></div>
        <div class="budget-item"><span>Subscriptions:</span><span>-$${state.subscriptions.filter(s => s.active).reduce((sum, s) => sum + s.cost, 0)}</span></div>
        <div class="budget-item"><span>Insurance:</span><span>-$${Object.values(state.insurance).filter(i => i.active).reduce((sum, i) => sum + i.cost, 0)}</span></div>
        <div class="budget-item" style="color: var(--neon-green); margin-top: 10px;">
            <span>Passive Income:</span><span>+$${passive.toFixed(0)}</span>
        </div>
        <div class="budget-item" style="border-top: 1px solid var(--neon-blue); margin-top: 10px; padding-top: 10px;">
            <strong>Net Cash Flow:</strong>
            <strong style="color: ${netCashFlow >= 0 ? 'var(--neon-green)' : 'var(--neon-pink)'}">
                ${netCashFlow >= 0 ? '+' : ''}$${netCashFlow.toFixed(0)}
            </strong>
        </div>
    `;
    
    document.getElementById('savings-rate').value = state.savingsRate;
    document.getElementById('savings-display').innerText = `${state.savingsRate}%`;
    document.getElementById('savings-rate').oninput = (e) => {
        state.savingsRate = parseInt(e.target.value);
        document.getElementById('savings-display').innerText = `${state.savingsRate}%`;
    };
}

function setLifestyle(category, level) {
    state.lifestyle[category] = level;
    renderLifeOS();
}

function toggleSubscription(index) {
    state.subscriptions[index].active = !state.subscriptions[index].active;
    renderLifeOS();
}

function toggleInsurance(key) {
    state.insurance[key].active = !state.insurance[key].active;
    renderLifeOS();
}

// --- 17. ASSET MATRIX ---
function openAssetMatrix() {
    if (state.tier < 4) {
        log("ASSET MATRIX LOCKED - Reach Tier 4 first!");
        SOUNDS.alert();
        return;
    }
    document.getElementById('asset-modal').style.display = 'flex';
    renderAssetMatrix();
}

function closeAssetMatrix() {
    document.getElementById('asset-modal').style.display = 'none';
}

function renderAssetMatrix() {
    const propDiv = document.getElementById('property-list');
    propDiv.innerHTML = '';
    state.properties.forEach(prop => {
        const roi = ((prop.monthlyIncome * 12) / prop.value * 100).toFixed(1);
        propDiv.innerHTML += `
            <div class="property-item">
                <h4>${prop.name}</h4>
                <div class="property-income">Income: $${prop.monthlyIncome}/mo</div>
                <div>Value: $${prop.value.toLocaleString()}</div>
                <div style="font-size: 10px; color: var(--neon-purple);">ROI: ${roi}%/year</div>
            </div>
        `;
    });
    
    if (state.properties.length === 0) {
        propDiv.innerHTML = '<p style="text-align:center;">No properties owned</p>';
    }
    
    const marketDiv = document.getElementById('property-market');
    const realtorDiscount = state.skills.realtor.current > 0 ? state.skills.realtor.current * 0.1 : 0;
    
    const propertyMarket = [
        { name: "Studio Apartment", price: 50000, income: 800 },
        { name: "Mining Farm", price: 100000, income: 2000 },
        { name: "Commercial Building", price: 500000, income: 12000 }
    ];
    
    marketDiv.innerHTML = '';
    propertyMarket.forEach(prop => {
        const discountedPrice = Math.round(prop.price * (1 - realtorDiscount));
        const roi = ((prop.income * 12) / discountedPrice * 100).toFixed(1);
        marketDiv.innerHTML += `
            <div class="market-item" onclick="buyProperty('${prop.name}', ${discountedPrice}, ${prop.income})">
                <h4>${prop.name}</h4>
                <div class="market-price">$${discountedPrice.toLocaleString()}</div>
                ${realtorDiscount > 0 ? `<div style="font-size: 10px; text-decoration: line-through; color: var(--neon-pink);">$${prop.price.toLocaleString()}</div>` : ''}
                <div class="market-details">Monthly Income: $${prop.income}</div>
                <div class="market-details">ROI: ${roi}%/year</div>
            </div>
        `;
    });
    
    // Side Hustles
    const hustleDiv = document.getElementById('business-list');
    hustleDiv.innerHTML = '<div class="section-header">SIDE HUSTLES</div>';
    for (let key in state.sideHustles) {
        const hustle = state.sideHustles[key];
        if (!hustle.owned) continue;
        
        let income = 0;
        if (key === 'mining') income = hustle.monthlyIncome - hustle.maintenance;
        if (key === 'content') income = hustle.baseIncome * (1 + state.intellect * 0.05) * (state.happiness / 100);
        
        hustleDiv.innerHTML += `
            <div class="business-item">
                <h4>${hustle.name}</h4>
                <div class="business-income">~$${income.toFixed(0)}/mo</div>
            </div>
        `;
    }
    
    const hustleMarket = document.getElementById('startup-market');
    hustleMarket.innerHTML = '<div class="section-header">AVAILABLE HUSTLES</div>';
    for (let key in state.sideHustles) {
        const hustle = state.sideHustles[key];
        if (hustle.owned) continue;
        if (state.intellect < hustle.intellect) continue;
        
        hustleMarket.innerHTML += `
            <div class="market-item" onclick="buySideHustle('${key}')">
                <h4>${hustle.name}</h4>
                <div class="market-price">$${hustle.cost.toLocaleString()}</div>
                <div class="market-details">
                    ${hustle.monthlyIncome ? `Income: $${hustle.monthlyIncome}/mo` : 
                      hustle.baseIncome ? `Base: $${hustle.baseIncome}/mo` : 
                      `Flexible income`}
                </div>
                ${hustle.turnCost ? `<div class="market-details" style="color: var(--neon-pink);">Costs ${hustle.turnCost} move/period</div>` : ''}
            </div>
        `;
    }
}

function buyProperty(name, price, income) {
    if (state.balance >= price) {
        state.balance -= price;
        state.properties.push({ name, value: price, monthlyIncome: income });
        SOUNDS.achievement();
        log(`🏠 PURCHASED: ${name}`, true);
        refreshUI();
        renderAssetMatrix();
    } else {
        SOUNDS.alert();
        log("INSUFFICIENT FUNDS");
    }
}

function buySideHustle(key) {
    const hustle = state.sideHustles[key];
    if (state.balance >= hustle.cost) {
        state.balance -= hustle.cost;
        state.sideHustles[key].owned = true;
        SOUNDS.achievement();
        log(`💼 STARTED: ${hustle.name}`, true);
        refreshUI();
        renderAssetMatrix();
    } else {
        SOUNDS.alert();
        log("INSUFFICIENT FUNDS");
    }
}

// --- MUSIC SYSTEM ---
let backgroundMusic = null;
let musicEnabled = true;

function initMusic() {
    backgroundMusic = new Audio('music/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3; // 30% volume
    
    // Try to play music (modern browsers may block autoplay)
    const playPromise = backgroundMusic.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Autoplay prevented. Click music button to start.');
            musicEnabled = false;
            updateMusicButton();
        });
    }
}

function toggleMusic() {
    if (!backgroundMusic) {
        initMusic();
        return;
    }
    
    musicEnabled = !musicEnabled;
    
    if (musicEnabled) {
        backgroundMusic.play().catch(e => console.log('Play error:', e));
    } else {
        backgroundMusic.pause();
    }
    
    updateMusicButton();
}

function updateMusicButton() {
    const btn = document.getElementById('musicBtn');
    if (btn) {
        if (musicEnabled) {
            btn.classList.remove('muted');
            btn.innerText = '🎵';
        } else {
            btn.classList.add('muted');
            btn.innerText = '🔇';
        }
    }
}

// --- EVENT LISTENERS ---
document.getElementById('workBtn').onclick = () => startAction('work');
document.getElementById('learnBtn').onclick = () => startAction('learn');
document.getElementById('restBtn').onclick = () => startAction('rest');
document.getElementById('nextTurnBtn').onclick = nextTurn;

// --- INITIALIZATION ---
updateBackground();
refreshUI();
updateNavButtons(); // Убедимся что кнопки обновлены
assignNewChallenge();
updateChallengeDisplay(); // Покажем challenge
log(`⚡ SYSTEM INITIALIZED: ${state.name}`);
log(`🌍 Region: ${currentReg.label}`);
log(`🎯 Goal: Survive ${state.years} years`);

// Admin mode notification
if (state.name.toLowerCase() === 'admin') {
    log(`👑 ADMIN MODE ACTIVE`, true);
}

// Initialize music
initMusic();

// Initialize market history
for (let asset in state.marketPrices) {
    for (let i = 0; i < 20; i++) {
        state.marketPrices[asset].history.push(state.marketPrices[asset].current);
    }
}
