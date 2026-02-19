import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./data/moontower.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // ── Root categories ─────────────────────────────────────────────────────
  const optionsPricing = await prisma.topic.create({
    data: {
      slug: 'options-pricing',
      title: 'Options Pricing',
      description: 'Core models and intuition behind pricing derivatives',
      content: `Options pricing is the foundation of derivatives trading. The key insight from Black-Scholes is that an option can be replicated by continuously delta-hedging the underlying. This no-arbitrage argument pins down a unique fair value.\n\nThe Moontower approach emphasizes *intuition first*: understand what drives an option's value before memorizing formulas. An option's price is essentially the expected value of its payoff under the risk-neutral measure, discounted to today.`,
      level: 0,
      orderIndex: 0,
      difficulty: 'intermediate',
      tags: JSON.stringify(['options', 'pricing', 'black-scholes', 'derivatives']),
      estimatedMinutes: 45,
      sourceUrls: JSON.stringify([{ title: 'Moontower on Options Pricing', url: 'https://moontowermeta.com/options-pricing' }]),
      sourceType: 'moontower',
      keyTakeaways: JSON.stringify([
        'Option price = discounted expected payoff under risk-neutral measure',
        'Black-Scholes assumes log-normal returns and continuous hedging',
        'Volatility is the single unknown input in BSM',
        'The model is wrong but useful — real value comes from understanding its limits',
      ]),
      formulas: JSON.stringify([
        { name: 'Black-Scholes Call', latex: 'C = S_0 N(d_1) - K e^{-rT} N(d_2)', explanation: 'Price of a European call option' },
        { name: 'd1 formula', latex: 'd_1 = \\frac{\\ln(S/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}}', explanation: 'Measures how far in-the-money the option is, adjusted for volatility' },
      ]),
    },
  });

  const greeks = await prisma.topic.create({
    data: {
      slug: 'the-greeks',
      title: 'The Greeks',
      description: 'Sensitivities of option prices to various parameters',
      content: `The Greeks measure how an option's price changes when inputs move. They are the trader's dashboard — delta tells you directional exposure, gamma tells you how fast that exposure changes, theta is the daily cost of holding, and vega is your bet on volatility.\n\nMoontower stresses that Greeks are not independent dials. They interact: high gamma means your delta is unstable, and that instability is precisely what generates theta decay. Understanding these connections is more valuable than memorizing isolated definitions.`,
      level: 0,
      orderIndex: 1,
      difficulty: 'intermediate',
      tags: JSON.stringify(['greeks', 'delta', 'gamma', 'theta', 'vega']),
      estimatedMinutes: 60,
      sourceUrls: JSON.stringify([{ title: 'Moontower Greek Guide', url: 'https://moontowermeta.com/greeks' }]),
      sourceType: 'moontower',
      keyTakeaways: JSON.stringify([
        'Greeks are partial derivatives of the option pricing function',
        'Delta ≈ probability of expiring ITM (roughly)',
        'Gamma and theta are two sides of the same coin',
        'Vega is highest for ATM options with long expiry',
      ]),
      formulas: JSON.stringify([
        { name: 'Delta (Call)', latex: '\\Delta_C = N(d_1)', explanation: 'Rate of change of call price w.r.t. underlying' },
        { name: 'Gamma', latex: '\\Gamma = \\frac{N\'(d_1)}{S\\sigma\\sqrt{T}}', explanation: 'Rate of change of delta w.r.t. underlying' },
        { name: 'Theta (Call)', latex: '\\Theta = -\\frac{S N\'(d_1) \\sigma}{2\\sqrt{T}} - rKe^{-rT}N(d_2)', explanation: 'Daily time decay' },
      ]),
    },
  });

  const volSurface = await prisma.topic.create({
    data: {
      slug: 'volatility-surface',
      title: 'Volatility Surface',
      description: 'Understanding implied volatility across strikes and expirations',
      content: `The volatility surface is a 3D map of implied volatility across strikes (moneyness) and expirations. If Black-Scholes were literally true, the surface would be flat. It isn't — and the shape tells you everything about how the market prices tail risk, skew, and term structure.\n\nThe smile (or smirk) exists because real returns have fatter tails than log-normal. OTM puts are expensive because crashes happen. The term structure reflects how vol mean-reverts over time.\n\nMoontower teaches you to read the surface like a map: steep skew = fear of downside; flat skew = complacency; inverted term structure = something is happening now.`,
      level: 0,
      orderIndex: 2,
      difficulty: 'advanced',
      tags: JSON.stringify(['volatility', 'implied-vol', 'skew', 'term-structure', 'smile']),
      estimatedMinutes: 50,
      sourceUrls: JSON.stringify([{ title: 'Moontower Vol Surface', url: 'https://moontowermeta.com/vol-surface' }]),
      sourceType: 'moontower',
      keyTakeaways: JSON.stringify([
        'The vol surface encodes the market\'s view of return distributions',
        'Skew reflects demand for downside protection',
        'Term structure shows expected mean-reversion of volatility',
        'Changes in the surface shape are trading signals',
      ]),
      formulas: null,
    },
  });

  const tradingConcepts = await prisma.topic.create({
    data: {
      slug: 'trading-concepts',
      title: 'Trading Concepts',
      description: 'Practical frameworks for thinking about risk and edge',
      content: `Trading is applied probability under uncertainty. The Moontower philosophy emphasizes process over outcome: a good trade can lose money, and a bad trade can make money. What matters is expected value over many repetitions.\n\nKey concepts include edge (your informational or structural advantage), sizing (Kelly criterion and its conservative cousins), and risk management (knowing when your thesis is wrong).`,
      level: 0,
      orderIndex: 3,
      difficulty: 'beginner',
      tags: JSON.stringify(['trading', 'risk', 'edge', 'kelly-criterion', 'EV']),
      estimatedMinutes: 30,
      sourceUrls: JSON.stringify([{ title: 'Moontower Trading Framework', url: 'https://moontowermeta.com/trading' }]),
      sourceType: 'moontower',
      keyTakeaways: JSON.stringify([
        'Focus on expected value, not individual outcomes',
        'Edge degrades — you must continuously re-evaluate',
        'Position sizing matters as much as direction',
        'Risk management is not optional, it is the strategy',
      ]),
      formulas: JSON.stringify([
        { name: 'Kelly Criterion', latex: 'f^* = \\frac{p \\cdot b - q}{b}', explanation: 'Optimal fraction to bet where p=win prob, q=loss prob, b=odds' },
      ]),
    },
  });

  // ── Child topics ────────────────────────────────────────────────────────

  const bsm = await prisma.topic.create({
    data: {
      slug: 'black-scholes-model',
      title: 'Black-Scholes Model',
      description: 'Derivation, assumptions, and limitations of BSM',
      content: `## The Black-Scholes Model\n\nThe Black-Scholes-Merton model derives a closed-form solution for European option prices. The key assumptions are:\n\n1. **Log-normal returns** — the underlying follows geometric Brownian motion\n2. **Constant volatility** — vol doesn't change (we know this is wrong)\n3. **Continuous hedging** — you can rebalance infinitely often (also wrong)\n4. **No transaction costs** — frictionless markets\n5. **Risk-free rate is constant** — flat yield curve\n\n### The Intuition\n\nThe genius of BSM is the hedging argument: if you can perfectly replicate the option payoff by dynamically trading the underlying, then no-arbitrage pins down the price. The option is worth exactly what it costs to hedge.\n\n### Where It Breaks Down\n\nIn practice, vol is stochastic, you can't hedge continuously, and transaction costs eat into your replication. This is why the model is "wrong but useful" — it gives you a common language (implied vol) even when the assumptions fail.\n\n$$C = S_0 N(d_1) - K e^{-rT} N(d_2)$$\n\nwhere $d_1 = \\frac{\\ln(S/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}}$ and $d_2 = d_1 - \\sigma\\sqrt{T}$.`,
      parentId: optionsPricing.id,
      level: 1,
      orderIndex: 0,
      difficulty: 'intermediate',
      tags: JSON.stringify(['black-scholes', 'BSM', 'european-options', 'no-arbitrage']),
      estimatedMinutes: 30,
      sourceUrls: JSON.stringify([]),
      sourceType: 'moontower',
      keyTakeaways: JSON.stringify([
        'BSM assumes log-normal returns and continuous hedging',
        'The hedging argument eliminates risk, pinning down price via no-arbitrage',
        'Implied volatility is the "fudge factor" that makes BSM match market prices',
      ]),
      formulas: JSON.stringify([
        { name: 'BSM Call Price', latex: 'C = S_0 N(d_1) - K e^{-rT} N(d_2)', explanation: 'Closed-form European call price' },
      ]),
    },
  });

  const putCallParity = await prisma.topic.create({
    data: {
      slug: 'put-call-parity',
      title: 'Put-Call Parity',
      description: 'The fundamental relationship between puts and calls',
      content: `## Put-Call Parity\n\nPut-call parity is one of the most important relationships in options:\n\n$$C - P = S - K e^{-rT}$$\n\nThis says: a long call and short put (same strike and expiry) replicates a forward position. If this relationship breaks, there's a risk-free arbitrage.\n\n### Why It Matters\n\n- It means you only need to price calls OR puts — the other follows\n- It shows that call and put implied vols must be equal (for European options)\n- Violations signal mispricing or dividend/borrow issues\n\n### Practical Implications\n\nMarket makers use put-call parity to convert between calls and puts. If you want a put but liquidity is better in calls, you can synthesize it: buy call, sell stock, invest strike at risk-free rate.`,
      parentId: optionsPricing.id,
      level: 1,
      orderIndex: 1,
      difficulty: 'beginner',
      tags: JSON.stringify(['put-call-parity', 'arbitrage', 'synthetic-positions']),
      estimatedMinutes: 15,
      sourceUrls: JSON.stringify([]),
      sourceType: 'moontower',
      keyTakeaways: JSON.stringify([
        'C - P = S - Ke^(-rT) for European options',
        'Violations imply arbitrage opportunities',
        'Call and put implied vols must match at the same strike',
      ]),
      formulas: JSON.stringify([
        { name: 'Put-Call Parity', latex: 'C - P = S - Ke^{-rT}', explanation: 'Fundamental relationship linking calls, puts, stock, and bonds' },
      ]),
    },
  });

  const delta = await prisma.topic.create({
    data: {
      slug: 'delta-deep-dive',
      title: 'Delta Deep Dive',
      description: 'Understanding delta as hedge ratio, probability proxy, and share equivalence',
      content: `## Delta: More Than a Number\n\nDelta is the most intuitive Greek but also the most misunderstood.\n\n### Three Interpretations\n\n1. **Hedge ratio**: Delta shares of stock offsets the option's directional risk\n2. **Probability proxy**: Roughly equals P(expiring ITM) under risk-neutral measure\n3. **Share equivalence**: A 0.40 delta call behaves like owning 40 shares (per contract)\n\n### Delta Behavior\n\n- ATM options have ~0.50 delta\n- Deep ITM → delta approaches 1.0 (call) or -1.0 (put)\n- Deep OTM → delta approaches 0\n- Delta is NOT constant — it changes with price (gamma), time, and vol\n\n### The Subtle Point\n\nDelta as "probability of ITM" is an approximation. It's exact only under the risk-neutral measure, which overweights bad states. In the real world, the actual probability differs by the risk premium.`,
      parentId: greeks.id,
      level: 1,
      orderIndex: 0,
      difficulty: 'beginner',
      tags: JSON.stringify(['delta', 'hedge-ratio', 'greeks']),
      estimatedMinutes: 20,
      sourceUrls: JSON.stringify([]),
      sourceType: 'moontower',
      keyTakeaways: JSON.stringify([
        'Delta has three interpretations: hedge ratio, probability proxy, share equivalence',
        'ATM ≈ 0.50 delta; ITM → 1.0; OTM → 0',
        'Delta changes with underlying price, time, and volatility',
      ]),
      formulas: JSON.stringify([
        { name: 'Call Delta', latex: '\\Delta_C = N(d_1)', explanation: 'Always between 0 and 1 for calls' },
        { name: 'Put Delta', latex: '\\Delta_P = N(d_1) - 1', explanation: 'Always between -1 and 0 for puts' },
      ]),
    },
  });

  const gammaTheta = await prisma.topic.create({
    data: {
      slug: 'gamma-theta-relationship',
      title: 'Gamma-Theta Relationship',
      description: 'Why gamma and theta are two sides of the same coin',
      content: `## Gamma vs Theta: The Core Tradeoff\n\nThis is the most important relationship in options trading. Gamma is your friend (convexity — you make more when right than you lose when wrong). Theta is the rent you pay for that convexity.\n\n### The Equation\n\n$$\\frac{1}{2}\\Gamma S^2 \\sigma^2 + \\Theta \\approx 0$$\n\nThis means: **gamma P&L from hedging ≈ theta decay**. If realized vol equals implied vol, your gamma gains exactly offset your theta losses.\n\n### Practical Implications\n\n- **Long gamma** = long vol = pay theta, profit from big moves\n- **Short gamma** = short vol = collect theta, bleed on big moves\n- The breakeven daily move is: $\\Delta S = S\\sigma/\\sqrt{252}$\n\n### Moontower Insight\n\nThink of theta as an insurance premium. If you're long gamma, you're buying insurance against big moves. The question is always: is the premium fair relative to expected moves?`,
      parentId: greeks.id,
      level: 1,
      orderIndex: 1,
      difficulty: 'intermediate',
      tags: JSON.stringify(['gamma', 'theta', 'convexity', 'hedging']),
      estimatedMinutes: 25,
      sourceUrls: JSON.stringify([]),
      sourceType: 'moontower',
      keyTakeaways: JSON.stringify([
        'Gamma and theta are linked: γ·S²·σ²/2 + θ ≈ 0',
        'Long gamma = pay theta, profit from realized vol > implied vol',
        'Short gamma = collect theta, lose when moves exceed implied',
        'The breakeven daily move equals S·σ/√252',
      ]),
      formulas: JSON.stringify([
        { name: 'Gamma-Theta Identity', latex: '\\frac{1}{2}\\Gamma S^2 \\sigma^2 + \\Theta = 0', explanation: 'Holds approximately for delta-hedged positions' },
        { name: 'Breakeven Move', latex: '\\Delta S_{BE} = S \\cdot \\frac{\\sigma}{\\sqrt{252}}', explanation: 'Daily move needed for gamma to offset theta' },
      ]),
    },
  });

  const vegaVolTrading = await prisma.topic.create({
    data: {
      slug: 'vega-and-vol-trading',
      title: 'Vega & Volatility Trading',
      description: 'Trading volatility as an asset class',
      content: `## Vega: Your Volatility Bet\n\nVega measures sensitivity to implied volatility. When you buy options, you're inherently long vega — you profit when IV rises.\n\n### Key Properties\n\n- Vega is highest for ATM, long-dated options\n- Vega is always positive for long options\n- Vega decreases as expiry approaches (shorter-dated options less sensitive)\n\n### Vol Trading\n\nPure vol trading means delta-hedging away directional exposure, leaving only volatility exposure. Your P&L then depends on:\n\n1. **Realized vol vs implied vol** (gamma trading)\n2. **Changes in implied vol** (vega trading)\n\n### The Variance Premium\n\nHistorically, implied vol exceeds realized vol ~80% of the time. This "variance risk premium" exists because investors overpay for protection. Selling vol is profitable on average but has catastrophic tail risk — exactly like selling insurance.`,
      parentId: greeks.id,
      level: 1,
      orderIndex: 2,
      difficulty: 'advanced',
      tags: JSON.stringify(['vega', 'volatility-trading', 'variance-premium', 'vol-surface']),
      estimatedMinutes: 30,
      sourceUrls: JSON.stringify([]),
      sourceType: 'moontower',
      keyTakeaways: JSON.stringify([
        'Vega is highest ATM, long-dated; decreases toward expiry',
        'Vol trading P&L = gamma P&L + vega P&L',
        'The variance risk premium means selling vol is profitable on average',
        'But tail risk makes naive vol selling dangerous',
      ]),
      formulas: JSON.stringify([
        { name: 'Vega', latex: '\\nu = S\\sqrt{T} N\'(d_1)', explanation: 'Sensitivity of option price to 1% change in implied vol' },
      ]),
    },
  });

  const volSmile = await prisma.topic.create({
    data: {
      slug: 'volatility-smile-and-skew',
      title: 'Volatility Smile & Skew',
      description: 'Why implied volatility varies across strikes',
      content: `## The Volatility Smile\n\nIf Black-Scholes were correct, implied volatility would be the same across all strikes. Instead we see a "smile" or "smirk":\n\n- **Equity index options**: downside skew (OTM puts have higher IV)\n- **FX options**: symmetric smile (both tails are fat)\n- **Commodity options**: often right-skewed (supply disruption risk)\n\n### Why Skew Exists\n\n1. **Fat tails**: real returns have more extreme events than log-normal\n2. **Demand for protection**: portfolio managers buy OTM puts\n3. **Leverage effect**: falling prices → higher realized vol\n4. **Jump risk**: crashes are sudden, not gradual\n\n### Reading the Skew\n\n- Steep skew = market fears downside\n- Flat skew = complacency (potentially dangerous)\n- Skew steepening = increasing hedging demand\n- The 25-delta risk reversal measures skew: IV(25d put) - IV(25d call)`,
      parentId: volSurface.id,
      level: 1,
      orderIndex: 0,
      difficulty: 'advanced',
      tags: JSON.stringify(['skew', 'smile', 'risk-reversal', 'fat-tails']),
      estimatedMinutes: 25,
      sourceUrls: JSON.stringify([]),
      sourceType: 'moontower',
      keyTakeaways: JSON.stringify([
        'The smile exists because real distributions have fatter tails than log-normal',
        'Equity skew is driven by crash protection demand',
        'Risk reversal = 25d put IV - 25d call IV measures skew',
        'Skew dynamics contain information about market sentiment',
      ]),
      formulas: null,
    },
  });

  const edgeSizing = await prisma.topic.create({
    data: {
      slug: 'edge-and-position-sizing',
      title: 'Edge & Position Sizing',
      description: 'Finding and sizing your edge using Kelly and fractional Kelly',
      content: `## Edge: What It Means and How to Size It\n\nEdge is the difference between your expected value and the market's price. In options, this means your vol estimate vs implied vol.\n\n### Kelly Criterion\n\nKelly tells you the optimal bet size to maximize long-run geometric growth:\n\n$$f^* = \\frac{p \\cdot b - q}{b}$$\n\nwhere p = win probability, q = 1-p, b = win/loss ratio.\n\n### Why Fractional Kelly\n\nFull Kelly is aggressive — the variance is brutal. Most practitioners use half-Kelly or quarter-Kelly:\n- Half-Kelly: 75% of the growth, 50% of the variance\n- Quarter-Kelly: still captures most of the growth with much smoother ride\n\n### Moontower Principle\n\nYour edge estimate is always uncertain. The uncertainty about your edge should reduce your size. If you think you have 2 vol points of edge but could be wrong by 3, your Kelly fraction should be tiny.`,
      parentId: tradingConcepts.id,
      level: 1,
      orderIndex: 0,
      difficulty: 'intermediate',
      tags: JSON.stringify(['kelly-criterion', 'position-sizing', 'edge', 'risk-management']),
      estimatedMinutes: 25,
      sourceUrls: JSON.stringify([]),
      sourceType: 'moontower',
      keyTakeaways: JSON.stringify([
        'Edge = your expected value - market price',
        'Kelly gives optimal sizing but is too aggressive in practice',
        'Use fractional Kelly (half or quarter) for realistic uncertainty',
        'Uncertainty about your edge should reduce position size',
      ]),
      formulas: JSON.stringify([
        { name: 'Kelly Criterion', latex: 'f^* = \\frac{pb - q}{b}', explanation: 'Fraction of bankroll to wager for max geometric growth' },
      ]),
    },
  });

  console.log('Topics created');

  // ── Questions ───────────────────────────────────────────────────────────

  // BSM questions
  await prisma.question.createMany({
    data: [
      {
        topicId: bsm.id,
        questionText: 'A stock is trading at $100. A 1-year European call with strike $105 is priced at $8.02. The risk-free rate is 5% and implied vol is 20%. Verify this price using the Black-Scholes formula.',
        difficulty: 'medium',
        orderIndex: 0,
        hints: JSON.stringify([
          'First compute d1 = [ln(S/K) + (r + σ²/2)T] / (σ√T)',
          'Then d2 = d1 - σ√T',
          'Use a standard normal CDF table or calculator for N(d1) and N(d2)',
        ]),
        solution: JSON.stringify({
          steps: [
            { stepNumber: 1, title: 'Calculate d1', content: '$d_1 = \\frac{\\ln(100/105) + (0.05 + 0.04/2)(1)}{0.20 \\cdot 1} = \\frac{-0.0488 + 0.07}{0.20} = 0.106$', reasoning: 'Plug in S=100, K=105, r=0.05, σ=0.20, T=1' },
            { stepNumber: 2, title: 'Calculate d2', content: '$d_2 = 0.106 - 0.20 = -0.094$', reasoning: 'd2 = d1 - σ√T' },
            { stepNumber: 3, title: 'Look up N(d1) and N(d2)', content: '$N(0.106) \\approx 0.5422$ and $N(-0.094) \\approx 0.4626$', reasoning: 'Standard normal CDF values' },
            { stepNumber: 4, title: 'Compute call price', content: '$C = 100 \\times 0.5422 - 105 \\times e^{-0.05} \\times 0.4626 = 54.22 - 46.20 = 8.02$', reasoning: 'C = S·N(d1) - K·e^(-rT)·N(d2)' },
          ],
          finalAnswer: 'C = $8.02, confirming the Black-Scholes price.',
          explanation: 'Walk through each BSM step systematically.',
          commonMistakes: ['Forgetting to discount the strike by e^(-rT)', 'Using σ² instead of σ in the d1 denominator', 'Sign error in ln(S/K) when K > S'],
        }),
        metadata: JSON.stringify({ estimatedMinutes: 10, tags: ['black-scholes', 'computation'], skillsTested: ['BSM formula', 'normal distribution'] }),
      },
      {
        topicId: bsm.id,
        questionText: 'List three assumptions of the Black-Scholes model and explain why each one fails in practice.',
        difficulty: 'easy',
        orderIndex: 1,
        hints: JSON.stringify([
          'Think about what the model assumes about volatility',
          'Consider what happens to hedging in real markets with transaction costs',
          'What does the model assume about the distribution of returns?',
        ]),
        solution: JSON.stringify({
          steps: [
            { stepNumber: 1, title: 'Constant Volatility', content: 'BSM assumes σ is constant. In reality, volatility is stochastic — it clusters, mean-reverts, and spikes during crises. The existence of the vol smile proves this assumption fails.', reasoning: 'This is the most important limitation' },
            { stepNumber: 2, title: 'Continuous Hedging', content: 'BSM assumes you can rebalance continuously. In practice, you hedge discretely. The gap between continuous and discrete hedging creates hedging error, especially around gamma-intensive positions.', reasoning: 'Transaction costs and market hours prevent continuous hedging' },
            { stepNumber: 3, title: 'Log-Normal Returns', content: 'BSM assumes returns follow geometric Brownian motion (log-normal). Real returns have fat tails (more extreme events) and negative skewness (crashes). This is why OTM puts are "expensive" relative to BSM.', reasoning: 'Empirical return distributions differ significantly from log-normal' },
          ],
          finalAnswer: 'Constant vol (vol is stochastic), continuous hedging (hedging is discrete), and log-normal returns (real returns have fat tails and skew).',
          explanation: 'Understanding model limitations is crucial for practical trading.',
          commonMistakes: ['Saying BSM is useless — it provides a common language via implied vol', 'Confusing model assumptions with reality'],
        }),
        metadata: JSON.stringify({ estimatedMinutes: 5, tags: ['black-scholes', 'assumptions'], skillsTested: ['model understanding'] }),
      },
    ],
  });

  // Put-call parity questions
  await prisma.question.createMany({
    data: [
      {
        topicId: putCallParity.id,
        questionText: 'A stock trades at $50. The 6-month 50-strike call is $4.50 and the put is $3.00. Risk-free rate is 4%. Is there an arbitrage? If so, describe the trade.',
        difficulty: 'medium',
        orderIndex: 0,
        hints: JSON.stringify([
          'Put-call parity: C - P = S - K·e^(-rT)',
          'Calculate each side independently',
          'If they don\'t match, the cheaper side is underpriced',
        ]),
        solution: JSON.stringify({
          steps: [
            { stepNumber: 1, title: 'LHS of parity', content: '$C - P = 4.50 - 3.00 = 1.50$', reasoning: 'Market prices' },
            { stepNumber: 2, title: 'RHS of parity', content: '$S - Ke^{-rT} = 50 - 50 \\cdot e^{-0.02} = 50 - 49.01 = 0.99$', reasoning: 'Fair forward minus discounted strike' },
            { stepNumber: 3, title: 'Identify mispricing', content: 'LHS ($1.50) > RHS ($0.99) by $0.51. The call is too expensive relative to the put (or put too cheap).', reasoning: 'Parity is violated' },
            { stepNumber: 4, title: 'Arbitrage trade', content: 'Sell the call, buy the put, buy the stock, borrow $49.01. Net cash in = $4.50 - $3.00 - $50 + $49.01 = $0.51 risk-free profit.', reasoning: 'Short the expensive side, long the cheap side' },
          ],
          finalAnswer: 'Yes, there is a $0.51 arbitrage. Sell call, buy put, buy stock, borrow PV(K).',
          explanation: 'Put-call parity violations create risk-free profits.',
          commonMistakes: ['Forgetting to discount the strike', 'Getting the direction of the trade backwards'],
        }),
        metadata: JSON.stringify({ estimatedMinutes: 8, tags: ['put-call-parity', 'arbitrage'], skillsTested: ['parity check', 'arbitrage construction'] }),
      },
    ],
  });

  // Gamma-theta questions
  await prisma.question.createMany({
    data: [
      {
        topicId: gammaTheta.id,
        questionText: 'You are long gamma on a stock at $100 with position gamma of 0.05. Implied vol is 20% (annualized). What is your approximate daily theta? What daily move do you need to break even?',
        difficulty: 'medium',
        orderIndex: 0,
        hints: JSON.stringify([
          'Use the gamma-theta relationship: ½·Γ·S²·σ² ≈ -Θ (annualized)',
          'Daily theta = annual theta / 365',
          'Breakeven move = S·σ/√252',
        ]),
        solution: JSON.stringify({
          steps: [
            { stepNumber: 1, title: 'Annual theta from gamma', content: '$\\Theta_{annual} \\approx -\\frac{1}{2} \\Gamma S^2 \\sigma^2 = -\\frac{1}{2}(0.05)(100^2)(0.04) = -\\$10$', reasoning: 'Using the gamma-theta identity' },
            { stepNumber: 2, title: 'Daily theta', content: '$\\Theta_{daily} = -10 / 365 \\approx -\\$0.027$ per day', reasoning: 'Simple division for daily time decay' },
            { stepNumber: 3, title: 'Breakeven daily move', content: '$\\Delta S_{BE} = S \\cdot \\sigma / \\sqrt{252} = 100 \\times 0.20 / 15.87 = \\$1.26$', reasoning: 'One standard deviation daily move at 20% annual vol' },
          ],
          finalAnswer: 'Daily theta ≈ -$0.027. Breakeven daily move ≈ $1.26 (1.26%).',
          explanation: 'The gamma-theta tradeoff defines the daily breakeven for long gamma positions.',
          commonMistakes: ['Confusing annualized and daily values', 'Using 365 vs 252 inconsistently (calendar vs trading days)'],
        }),
        metadata: JSON.stringify({ estimatedMinutes: 8, tags: ['gamma', 'theta', 'breakeven'], skillsTested: ['gamma-theta relationship', 'daily P&L'] }),
      },
      {
        topicId: gammaTheta.id,
        questionText: 'Explain why a market maker who is short gamma might still sleep well at night, while a market maker who is short vega might not.',
        difficulty: 'hard',
        orderIndex: 1,
        hints: JSON.stringify([
          'Think about the frequency of gamma P&L vs vega P&L',
          'What happens to gamma exposure as expiry approaches?',
          'How correlated are vega shocks across the book?',
        ]),
        solution: JSON.stringify({
          steps: [
            { stepNumber: 1, title: 'Gamma: frequent, small, mean-reverting', content: 'Short gamma bleeds on large daily moves, but gains on small ones (theta). Over many days, realized vol tends toward its mean. Short gamma P&L diversifies over time — bad days are offset by good days.', reasoning: 'Gamma P&L is high-frequency and somewhat diversifiable' },
            { stepNumber: 2, title: 'Vega: infrequent, large, correlated', content: 'Short vega loses when implied vol jumps. Vol spikes tend to be sudden, large, and correlated across the entire book. A single event (2020 COVID, 2008 crisis) can hit every position simultaneously.', reasoning: 'Vega risk is systemic and lumpy' },
            { stepNumber: 3, title: 'The key distinction', content: 'Gamma is a **flow** risk (daily) while vega is a **stock** risk (accumulated). You can manage gamma by adjusting hedges daily. Vega shocks happen overnight and cannot be hedged in real-time.', reasoning: 'Frequency and controllability differ dramatically' },
          ],
          finalAnswer: 'Short gamma is manageable because the P&L diversifies daily and hedging is frequent. Short vega is dangerous because vol spikes are sudden, large, and correlated across the book.',
          explanation: 'Understanding the qualitative difference between gamma and vega risk is essential for risk management.',
          commonMistakes: ['Treating gamma and vega as interchangeable "volatility" risks', 'Ignoring the correlation structure of vega shocks'],
        }),
        metadata: JSON.stringify({ estimatedMinutes: 10, tags: ['gamma', 'vega', 'risk-management'], skillsTested: ['risk intuition', 'qualitative reasoning'] }),
      },
    ],
  });

  // Delta questions
  await prisma.question.createMany({
    data: [
      {
        topicId: delta.id,
        questionText: 'You own 10 contracts of a 0.40 delta call (100 shares per contract). How many shares of stock should you sell to be delta-neutral?',
        difficulty: 'easy',
        orderIndex: 0,
        hints: JSON.stringify([
          'Total delta = number of contracts × shares per contract × delta',
          'To be delta-neutral, sell that many shares',
        ]),
        solution: JSON.stringify({
          steps: [
            { stepNumber: 1, title: 'Calculate total delta', content: 'Total delta = 10 × 100 × 0.40 = 400', reasoning: '10 contracts, 100 shares each, 0.40 delta' },
            { stepNumber: 2, title: 'Hedge', content: 'Sell 400 shares to be delta-neutral.', reasoning: 'Short stock offsets long delta from calls' },
          ],
          finalAnswer: 'Sell 400 shares.',
          explanation: 'Delta-neutral hedging is the foundation of options market making.',
          commonMistakes: ['Forgetting the 100 multiplier per contract', 'Buying instead of selling shares'],
        }),
        metadata: JSON.stringify({ estimatedMinutes: 3, tags: ['delta', 'hedging'], skillsTested: ['delta hedging'] }),
      },
    ],
  });

  // Vol smile questions
  await prisma.question.createMany({
    data: [
      {
        topicId: volSmile.id,
        questionText: 'The SPX 25-delta put has implied vol of 22% while the 25-delta call has 16%. What is the risk reversal? What does this tell you about the market\'s view?',
        difficulty: 'medium',
        orderIndex: 0,
        hints: JSON.stringify([
          'Risk reversal = 25d put IV - 25d call IV',
          'A positive risk reversal means the market prices downside more than upside',
          'Think about what this implies for the market\'s return distribution',
        ]),
        solution: JSON.stringify({
          steps: [
            { stepNumber: 1, title: 'Calculate risk reversal', content: 'RR = IV(25d put) - IV(25d call) = 22% - 16% = 6%', reasoning: 'Standard definition' },
            { stepNumber: 2, title: 'Interpret', content: 'A 6% risk reversal is steep. The market is pricing the left tail (crashes) as significantly more volatile than the right tail (rallies). This is typical for equity indices where crash risk dominates.', reasoning: 'Skew reflects asymmetric risk perception' },
            { stepNumber: 3, title: 'Trading implication', content: 'Downside protection is expensive. If you think skew is too steep, you could sell the risk reversal (sell 25d put, buy 25d call) — but you are exposed to crash risk.', reasoning: 'Skew trades express views on tail risk' },
          ],
          finalAnswer: 'Risk reversal = 6%. The market prices significantly more downside risk than upside, reflecting crash protection demand.',
          explanation: 'Risk reversals are the standard measure of skew.',
          commonMistakes: ['Reversing the direction (call - put instead of put - call)', 'Confusing skew with overall vol level'],
        }),
        metadata: JSON.stringify({ estimatedMinutes: 7, tags: ['skew', 'risk-reversal', 'vol-surface'], skillsTested: ['vol surface interpretation'] }),
      },
    ],
  });

  // Edge & sizing questions
  await prisma.question.createMany({
    data: [
      {
        topicId: edgeSizing.id,
        questionText: 'You estimate a trade has 60% probability of making $1000 and 40% probability of losing $800. What is the EV? What fraction of your bankroll should you risk according to full Kelly?',
        difficulty: 'easy',
        orderIndex: 0,
        hints: JSON.stringify([
          'EV = p × win - q × loss',
          'Kelly: f* = (p·b - q) / b where b = win/loss ratio',
        ]),
        solution: JSON.stringify({
          steps: [
            { stepNumber: 1, title: 'Expected Value', content: 'EV = 0.60 × $1000 - 0.40 × $800 = $600 - $320 = $280', reasoning: 'Positive EV trade' },
            { stepNumber: 2, title: 'Kelly sizing', content: 'b = 1000/800 = 1.25. f* = (0.60 × 1.25 - 0.40) / 1.25 = (0.75 - 0.40) / 1.25 = 0.28 = 28%', reasoning: 'Full Kelly says risk 28% of bankroll' },
            { stepNumber: 3, title: 'Practical adjustment', content: 'Half-Kelly = 14%. This reduces variance significantly while keeping most of the growth rate.', reasoning: 'Full Kelly is too aggressive for real trading' },
          ],
          finalAnswer: 'EV = +$280. Full Kelly = 28% of bankroll. Half-Kelly (recommended) = 14%.',
          explanation: 'Always compute EV first, then size using Kelly or fractional Kelly.',
          commonMistakes: ['Using Kelly with uncertain probability estimates', 'Ignoring the impact of correlation with other positions'],
        }),
        metadata: JSON.stringify({ estimatedMinutes: 6, tags: ['kelly', 'EV', 'sizing'], skillsTested: ['expected value', 'Kelly criterion'] }),
      },
    ],
  });

  console.log('Questions created');

  // ── Learning Paths ──────────────────────────────────────────────────────

  await prisma.learningPath.createMany({
    data: [
      {
        name: 'Options Foundations',
        description: 'Start here: build intuition from pricing through Greeks to volatility',
        level: 'beginner',
        topicSequence: JSON.stringify([
          putCallParity.id, bsm.id, delta.id, gammaTheta.id,
        ]),
        estimatedHours: 3,
        icon: 'BookOpen',
      },
      {
        name: 'Volatility Mastery',
        description: 'Deep dive into vol surface, skew, and volatility as an asset class',
        level: 'advanced',
        topicSequence: JSON.stringify([
          vegaVolTrading.id, volSmile.id, volSurface.id,
        ]),
        estimatedHours: 4,
        icon: 'TrendingUp',
      },
      {
        name: 'Trading Edge',
        description: 'Apply theoretical knowledge to practical trading and risk management',
        level: 'intermediate',
        topicSequence: JSON.stringify([
          tradingConcepts.id, edgeSizing.id, gammaTheta.id, vegaVolTrading.id,
        ]),
        estimatedHours: 5,
        icon: 'Target',
      },
    ],
  });

  console.log('Learning paths created');
  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
