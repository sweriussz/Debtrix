# 🌃 Debtrix

> A cyberpunk financial literacy game where you survive the corporate dystopia through smart money management

![Version](https://img.shields.io/badge/version-3.5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)

## 🎮 Overview

**Debtrix** is an educational browser-based game that teaches real-world financial concepts through engaging cyberpunk gameplay. Make strategic decisions about work, education, investments, and lifestyle while managing your resources to achieve financial independence.

### Key Features

- 🎯 **5-Tier Progression System** - From Street Survivor to System Architect
- 💼 **4 Core Financial Systems** - TERMINAL (Trading), DEBT CORE (Credit), LIFE OS (Budget), ASSET MATRIX (Real Estate)
- 📚 **Skill Tree** - Specialize in Trading, Analysis, Real Estate, or Negotiation
- 🏆 **10 Achievements** - Unlock rewards for reaching milestones
- 🎯 **Monthly Challenges** - Rotating objectives with cash prizes
- 💰 **Side Hustles** - Build multiple income streams
- 🛡️ **Insurance System** - Protect against random events
- 💸 **Progressive Tax System** - Learn about tax brackets and deductions
- 💾 **Save System** - 3 save slots to pick up where you left off
- 🎨 **Dynamic Visuals** - Seasonal backgrounds and character mood changes
- 🎵 **Background Music** - Optional atmospheric soundtrack

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- No installation required!

### How to Play

1. **Download** or clone this repository
2. **Open** `index.html` in your web browser
3. **Enter** your operator name and select difficulty
4. **Start** managing your cyberpunk finances!

```bash
git clone https://github.com/AM18/index.git
cd Debtrix
# Open index.html in your browser
```

## 📁 Project Structure

```
main/
├── index.html           # Game launcher
├── game.html            # Main game interface
├── script.js            # Game logic (1900+ lines)
├── style.css            # Cyberpunk styling
├── images/              # Visual assets
│   ├── seasons/         # Background images
│   │   ├── spring.jpg
│   │   ├── summer.jpg
│   │   ├── autumn.jpg
│   │   └── winter.jpg
│   └── characters/      # Character mood sprites
│       ├── fortunate.png
│       ├── happy.png
│       ├── neutral.png
│       └── stressed.png
└── music/               # Audio assets
    └── background.mp3   # Background music (optional)
```

## 🎓 Educational Concepts

### What You'll Learn

1. **Budgeting** - Managing income vs. expenses
2. **Compound Interest** - How investments grow over time
3. **Credit Management** - Building credit score, loan interest rates
4. **Tax Planning** - Progressive taxation, deductions
5. **Risk Management** - Insurance, emergency funds
6. **Diversification** - Multiple income streams, asset allocation
7. **Passive Income** - Real estate, dividends, side businesses
8. **Time Value of Money** - Present vs. future value
9. **Cost-Benefit Analysis** - When to invest vs. save
10. **Financial Independence** - Building wealth systematically

## 🎯 Game Mechanics

### Core Actions (3 per turn)

- **💼 WORK** - Earn money through minigame (skill-based clicking)
- **📚 STUDY** - Increase intellect (keyboard timing minigame)
- **🧘 REST** - Restore happiness (precision timing minigame)

### Difficulty Levels

| Region | Starting Cash | Base Salary | Rent | Tax Rate | Difficulty |
|--------|--------------|-------------|------|----------|------------|
| **North America** | $10,000 | $6,500 | $2,500 | 25% | Easy |
| **Europe** | $5,000 | $4,800 | $1,800 | 30% | Standard |
| **Asia** | $3,000 | $3,800 | $1,200 | 20% | Moderate |
| **South Asia** | $1,500 | $2,500 | $800 | 15% | Hard |
| **Africa** | $1,000 | $1,800 | $400 | 10% | Extreme |

### Monthly Expenses

Expenses scale with your chosen lifestyle. All values are per month:

| Category | Cheap / Minimal | Basic (Default) | Premium / Luxury |
|----------|----------------|-----------------|-----------------|
| **Food** | $60 | $120 | $250 |
| **Housing** | $150 | $300 | $750 |
| **Transport** | $30 | $90 | $240 |

Additional costs include active subscriptions, insurance premiums, and a region-based rent component (30% of your region's base rent). Keeping expenses low early on is key to surviving the first few years.

### Tier Progression

1. **Street Survivor** (Tier 1) - Reach $10K balance + 8 Intellect
2. **Middle Manager** (Tier 2) - Build $25K emergency fund → Unlocks Trading
3. **Private Investor** (Tier 3) - Portfolio worth $75K → Unlocks Advanced Features
4. **Rentier** (Tier 4) - Passive income > Expenses → Unlocks Real Estate
5. **System Architect** (Tier 5) - Financial freedom achieved

## 🏆 Features

### 💾 Save System
- 3 independent save slots accessible via the **💾 button** in the footer
- Each slot displays your current Year, Balance, and Tier at save time
- Save, Load, or delete any slot at any time
- Progress is stored locally in your browser — no account needed

### TERMINAL System (Trading)
- Trade 4 assets: ARASAKA (stock), BIOTECH (growth), NEON_COIN (crypto), CYBER_ETF (index)
- Real-time price charts
- News feed affecting markets
- Portfolio tracking
- Market crashes and dividends

### DEBT CORE System (Credit)
- Credit score (300-850)
- Three loan tiers with different interest rates
- Emergency fund management
- Credit score improvement mechanics

### LIFE OS System (Budget)
- Lifestyle choices (food, housing, transport)
- Subscription management
- Auto-savings slider
- Insurance activation
- Real-time budget breakdown

### ASSET MATRIX System (Investments)
- Property investments (Studio, Mining Farm, Commercial Building)
- Side hustles (Crypto Mining, Content Creation, Consulting, Delivery)
- Passive income calculation
- ROI tracking

### Skill Tree
- **Financial Analyst** - Better trading insights and work income
- **Day Trader** - Reduced trading fees and better profits
- **Real Estate Mogul** - Cheaper properties and higher rental income
- **Master Negotiator** - Lower loan interest and credit recovery

## 🔧 Advanced Features

### Admin Mode
For testing or sandbox play:
- Enter "**admin**" as operator name
- Receive: $10M cash, 100 intellect, tier 5, infinite happiness
- All systems unlocked immediately
- Perfect for exploring all features

### Random Events
- Medical Emergency (covered by health insurance)
- Work Bonus (50% extra salary)
- Tax Audit (10% balance loss)
- Property Damage (covered by property insurance)
- Portfolio Hack (covered by cyber security)
- Lucky Find (+$500 + happiness)

### Achievements (10 Total)
- First Million ($5K reward)
- Zero Debt Hero ($2K reward)
- Passive Income Master ($3K reward)
- Day Trader ($1K reward)
- Real Estate Mogul ($10K reward)
- Perfect Credit ($5K reward)
- Happiness Expert ($2K reward)
- Economic Survivor ($3K reward)
- Early Retirement ($15K reward)
- System Architect ($20K reward)

## 🎨 Customization

### Adding Custom Music
1. Create `music/` folder
2. Add `background.mp3` file
3. Music plays automatically (toggle with 🎵 button)

### Adding Custom Images
Place your images in:
- `images/seasons/` - 4 seasonal backgrounds (spring.jpg, summer.jpg, autumn.jpg, winter.jpg)
- `images/characters/` - 4 character moods (fortunate.png, happy.png, neutral.png, stressed.png)

## 📊 Statistics Tracking

The game tracks comprehensive statistics:
- Total earned/spent
- Interest paid
- Passive income generated
- Bankruptcies avoided
- Months debt-free
- Minimum happiness reached
- Successful trades
- Properties owned

## 🎯 Strategy Tips

### Early Game (Year 1-2)
1. Focus on Study to boost Intellect quickly
2. Keep expenses on Basic (not Cheap or Premium)
3. Build $10K balance for Tier 2
4. Avoid loans if possible

### Mid Game (Year 3-5)
1. Unlock TERMINAL and start trading
2. Build emergency fund to $25K
3. Invest in skills (Analyst or Trader first)
4. Start one side hustle

### Late Game (Year 6-10)
1. Focus on real estate for passive income
2. Maximize all skills
3. Diversify income streams
4. Aim for financial independence

## 🐛 Known Issues

None currently! Report bugs via GitHub Issues.

## 🔄 Version History

### v3.5.0 (Current) - Save System & Balance Pass
- ✅ Added 3-slot Save/Load system (💾 button in footer)
- ⚖️ Monthly expenses significantly reduced (~60% lower across all categories)
- ⚖️ Region rent contribution reduced to 30% of base value

### v3.4.1 - Bug Fixes
- ✅ Fixed admin mode tier display
- ✅ Added permanent challenge widget
- ✅ Increased log display time (8 seconds)
- ✅ Fixed unlocked button appearance

### v3.4.0 - Admin Mode & Study Boost
- ✅ Admin mode (enter "admin" as name)
- ✅ Study intellect gain doubled
- ✅ Admin happiness protection

### v3.3.0 - Balance & Polish
- ✅ REST minigame made harder (1 attempt)
- ✅ Music system with toggle button
- ⚖️ Balanced work earnings and expenses

### v3.2.0 - Balance Patch
- ✅ Image loading from files
- ⚖️ Work/Rest minigame balance
- ⚖️ Monthly expenses adjusted

### v3.0.0 - Major Update
- ✅ All 4 core systems implemented
- ✅ Tax, insurance, achievements
- ✅ Skills, side hustles, challenges

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by real-world financial education needs
- Cyberpunk aesthetic inspired by classic cyberpunk media
- Game mechanics designed for educational value
- Built with vanilla JavaScript for accessibility

## 📧 Contact

**Project Creator:** AM18  
**GitHub:** [AM18](https://github.com/AM18)  
**Issues:** [Report a bug](mailto:amirkayipov@gmail.com)

## 🌟 Why Play Debtrix?

- **Learn by Doing** - Interactive financial education
- **No Judgement** - Safe environment to make mistakes
- **Strategic Depth** - Multiple paths to success
- **Engaging Gameplay** - Skill-based minigames
- **Free & Open Source** - No ads, no tracking, no monetization
- **Offline Play** - Works entirely in your browser
- **Educational Value** - Real financial concepts

## 🎯 Learning Outcomes

After playing Debtrix, you'll understand:

✅ How compound interest works (for and against you)  
✅ The importance of emergency funds  
✅ How credit scores are built and destroyed  
✅ Tax planning and legal deductions  
✅ Diversification reduces risk  
✅ Passive income creates freedom  
✅ Lifestyle inflation can trap you  
✅ Time in market beats timing the market  
✅ Insurance protects against catastrophe  
✅ Financial independence is achievable  

## 🚀 Future Roadmap

Planned features:
- [ ] Relationship/mentor system
- [ ] Business ownership expansion
- [ ] Retirement planning (401k, IRA)
- [ ] Market manipulation (Tier 5 feature)
- [ ] Multiplayer leaderboards
- [ ] Mobile app version
- [ ] Achievement showcase
- [ ] Advanced analytics dashboard
- [ ] Custom difficulty creator

---

**Made with 💙 for financial literacy education**

*"In the neon-lit streets of the corporate future, your greatest weapon is knowledge."*

⭐ **Star this repo if you found it useful!** ⭐
