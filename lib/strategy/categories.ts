import type { CategoryPlaybook } from "./knowledge";

// Category playbooks. Each one encodes how that industry actually sells on social:
// who buys, who they compare you to, what stops them, and what to post about it.

export const CATEGORIES: Record<string, CategoryPlaybook> = {
  coffee: {
    label: "Coffee & Roastery",
    emoji: "coffee",
    aka: ["coffee", "roastery", "cafe", "espresso", "beans", "barista"],
    positioning: [
      "The roaster that treats {audience} like they already know good coffee.",
      "Specialty coffee without the gatekeeping.",
      "Freshly roasted, honestly priced, delivered before the flavour fades.",
    ],
    differentiators: [
      "Roast date printed on every bag, not a best-before",
      "Single-origin traceability down to the farm",
      "Dial-in guide on the label so the first cup is not a waste",
      "Small batch sizes, so nothing sits in a warehouse",
    ],
    segments: [
      { name: "The upgrader", description: "Just bought a grinder or espresso machine and wants to stop wasting beans.", trigger: "Bought equipment in the last 90 days.", objection: "I do not know which roast suits my machine." },
      { name: "The daily ritual", description: "Drinks coffee every morning, buys on autopilot, open to a better default.", trigger: "Ran out and does not want supermarket coffee again.", objection: "Subscriptions feel like a trap." },
      { name: "The gifter", description: "Buying for a coffee person and terrified of getting it wrong.", trigger: "Birthday, holiday, thank-you gift.", objection: "What if they already have this?" },
      { name: "The cafe owner", description: "Wholesale buyer looking for consistency and support.", trigger: "Current supplier went inconsistent.", objection: "Can you keep up with our volume?" },
    ],
    competitors: [
      { name: "Supermarket shelf brands", archetype: "The volume incumbent", strength: "Price, availability, familiarity.", gap: "Stale by the time it is bought. No roast date, no story.", counterMove: "Make freshness visible. Show the roast date stamp in every product post." },
      { name: "Big third-wave roasters", archetype: "The prestige specialist", strength: "Reputation, awards, beautiful branding.", gap: "Intimidating language and premium pricing that excludes beginners.", counterMove: "Own approachability. Teach, never lecture. Be the roaster that explains." },
      { name: "Local independent cafes", archetype: "The neighbourhood favourite", strength: "Community and daily habit.", gap: "Rarely sell beans well online, weak content cadence.", counterMove: "Win the at-home occasion with brew education and shipping speed." },
      { name: "Subscription-first startups", archetype: "The convenience play", strength: "Slick funnel, recurring revenue.", gap: "Generic beans, no relationship, high churn.", counterMove: "Show the human. Name the roaster, name the farm, be un-generic." },
    ],
    objections: [
      "It is more expensive than the supermarket",
      "I will not brew it properly",
      "I do not know which roast to pick",
      "It will go stale before I finish it",
      "Subscriptions are hard to cancel",
    ],
    proofPoints: [
      "Roasted and shipped within 48 hours",
      "Repeat order rate from real customers",
      "Cafe and wholesale clients using the same beans",
      "Cupping scores and tasting notes that hold up",
    ],
    benefits: ["a better morning", "coffee that actually tastes like the notes on the bag", "no more wasted shots", "freshness you can taste"],
    hooks: {
      authority: [
        "Your coffee is not bad. Your grind size is.",
        "Light roast, medium, dark: what the labels actually mean.",
        "The reason your espresso tastes sour (and the 10 second fix).",
        "How long your beans are actually good for after roasting.",
        "Stop storing your coffee in the freezer. Here is why.",
        "Water is 98% of your cup. You are probably using the wrong one.",
      ],
      product: [
        "The bag we sell more of than everything else combined.",
        "What {product} tastes like, in plain words.",
        "This one is for people who take milk.",
        "Roasted this morning. Shipping this afternoon.",
        "The tasting notes on {product}, decoded.",
      ],
      proof: [
        "The message we got at 6am from a customer.",
        "Three cafes switched to us this month. Here is why.",
        "What happens when someone tries fresh coffee for the first time.",
      ],
      story: [
        "5am at the roastery.",
        "Why we print the roast date and not a best-before.",
        "The batch we dumped last week.",
        "Meet the farm behind {product}.",
      ],
      offer: [
        "The starter bundle: three roasts, one price, zero guessing.",
        "This roast comes back once a year. It is back.",
        "Free brew guide with every first order this week.",
      ],
      community: [
        "Espresso or filter. Choose your side.",
        "Milk in first is a crime. Discuss.",
        "What is in your cup right now?",
      ],
      objection: [
        "Yes it costs more than the supermarket. Here is the math per cup.",
        "Worried you will brew it wrong? We fixed that.",
        "Cancel anytime actually means anytime here.",
      ],
    },
    bodies: {
      authority: [
        "Most people blame the beans when the real problem is 20 seconds of technique. Grind finer, weigh your dose, keep your ratio consistent, and the same bag will taste twice as good.",
        "Freshness is not marketing. Coffee peaks between 4 and 21 days after roasting. Before that it is gassy, after that it flattens. That window is the whole game.",
      ],
      product: [
        "Chocolate forward, low acidity, and built to survive milk without disappearing. If you drink flat whites at home, this is the default.",
        "Small batch, roasted to order, and shipped the same week. Nothing sits in a warehouse waiting for a purchase order.",
      ],
      proof: [
        "We did not ask for this review. It landed in our inbox on a Tuesday and it is the reason the roaster gets up at five.",
      ],
      story: [
        "The roastery smells like caramel at 5am and like burnt toast if you get it wrong. That margin is about 40 seconds wide.",
      ],
      offer: [
        "Three bags, three roast profiles, one flat price. Try them across a week and you will know exactly which one is yours.",
      ],
      community: [
        "We have had this argument internally for two years and it has never been settled. Your turn.",
      ],
      objection: [
        "A bag brews around 20 cups. That is roughly the price of two coffees out. The comparison is not the supermarket, it is your local cafe.",
      ],
    },
    visuals: ["product-cutout", "editorial-photo", "grid-flatlay", "bold-type", "lifestyle-context", "carousel-teach", "quote-card", "data-tile"],
    videoIdeas: [
      "Pour shot in slow motion with the roast date stamp as the payoff frame",
      "60 second dial-in: sour shot to balanced shot, on camera",
      "Roastery walkthrough from green bean to sealed bag",
      "Blind taste test: supermarket bag versus fresh roast",
      "Three ways to brew the same bag, three different results",
    ],
    hashtags: {
      broad: ["coffee", "coffeelover", "specialtycoffee", "coffeetime", "espresso", "coffeeaddict"],
      niche: ["singleorigin", "filtercoffee", "coffeeroaster", "pourover", "homebarista", "coffeegram", "thirdwavecoffee", "freshlyroasted"],
      community: ["coffeecommunity", "baristalife", "coffeeshopvibes", "morningbrew"],
    },
    ctas: ["Grab a bag before this roast rotates out.", "Comment BREW and we will send the guide.", "Start with the sampler, link in bio."],
    kpis: [
      { name: "Saves per educational post", target: "40+ saves" },
      { name: "First-order conversion from bio link", target: "3-5%" },
      { name: "Repeat purchase within 45 days", target: "35%" },
    ],
    slowMoverTactics: [
      "Reframe the slow bag as a specific occasion rather than a general product",
      "Bundle it with the hero bag as a contrast pairing so it becomes an experiment, not a risk",
      "Run a taste-test post pitting it against the bestseller and let comments decide",
      "Educate the objection directly: if it is a light roast, teach light roast brewing",
    ],
    heroTactics: [
      "Anchor every new customer on the hero bag as the default first purchase",
      "Show it in three different brew methods so it feels versatile",
      "Use it as the star of every bundle to raise average order value",
    ],
    pillarWeights: { authority: 0.24, product: 0.2, story: 0.16 },
  },

  fitness: {
    label: "Gym & Fitness",
    emoji: "gym",
    aka: ["gym", "fitness", "personal training", "crossfit", "yoga", "pilates", "studio", "coach"],
    positioning: [
      "The gym where beginners are not the punchline.",
      "Coaching that fits a real schedule, not an athlete's.",
      "Results measured in how you live, not how you look on day one.",
    ],
    differentiators: [
      "Every member gets a written plan, not a tour and a wave",
      "Coach-to-member ratio capped so form is actually corrected",
      "Progress reviewed every four weeks with real numbers",
      "No lock-in contracts",
    ],
    segments: [
      { name: "The restarter", description: "Has joined a gym before, quit, and is embarrassed about it.", trigger: "A photo, a birthday, a health scare.", objection: "I will quit again like last time." },
      { name: "The time-poor professional", description: "Wants results but has 3 hours a week maximum.", trigger: "Energy crash at work.", objection: "I cannot commit to five sessions a week." },
      { name: "The plateau lifter", description: "Trains already but has stalled for months.", trigger: "Numbers stopped moving.", objection: "I already know what I am doing." },
      { name: "The post-injury returner", description: "Cleared to train but scared of re-injury.", trigger: "Physio signed them off.", objection: "Will your coaches understand my limits?" },
    ],
    competitors: [
      { name: "Budget chain gyms", archetype: "The price leader", strength: "Low monthly fee, many locations, 24/7 access.", gap: "Zero coaching, high churn, intimidating for beginners.", counterMove: "Sell the outcome and the accountability, never the monthly price." },
      { name: "Boutique studios", archetype: "The experience seller", strength: "Community, energy, strong brand.", gap: "Expensive per session, one modality, weak long-term progression.", counterMove: "Show structured progression over months, not one great class." },
      { name: "Online coaching apps", archetype: "The scalable alternative", strength: "Cheap, flexible, data rich.", gap: "Nobody watches your form or notices when you disappear.", counterMove: "Own the in-person correction and the check-in nobody else does." },
      { name: "Influencer programmes", archetype: "The aspiration play", strength: "Huge reach and social proof.", gap: "Generic templates sold to thousands of different bodies.", counterMove: "Contrast personalised programming against copy-paste PDFs." },
    ],
    objections: [
      "I am too out of shape to start here",
      "It is more expensive than the chain gym",
      "I do not have time",
      "I will get injured",
      "I have failed at this before",
    ],
    proofPoints: [
      "Member retention past 12 months",
      "Documented strength and body composition changes",
      "Coach qualifications and continuing education",
      "Members who started as complete beginners",
    ],
    benefits: ["strength that shows up outside the gym", "energy that lasts past 3pm", "a body that does what you ask it to", "consistency that finally sticks"],
    hooks: {
      authority: [
        "You are not lazy. Your programme is just badly designed.",
        "Three exercises doing 80% of the work. The rest is decoration.",
        "Why you are sore but not progressing.",
        "How many sets you actually need per week.",
        "The warm-up that takes 4 minutes and prevents most injuries.",
        "Progressive overload, explained without the jargon.",
      ],
      product: [
        "What a first session here actually looks like.",
        "Inside the {product} programme, week by week.",
        "The equipment we bought because members asked for it.",
      ],
      proof: [
        "Six months apart. Same person. Same gym.",
        "She had never lifted a barbell. Here is month four.",
        "The member who almost did not walk through the door.",
      ],
      story: [
        "Why we capped our class sizes and lost revenue doing it.",
        "6am on a Monday here.",
        "The coach who changed how we do inductions.",
      ],
      offer: [
        "Two intro sessions, one price, no contract.",
        "Doors open for {n} new members this month, then we close them.",
        "Bring a friend week starts now.",
      ],
      community: [
        "Hardest lift in the building. Go.",
        "What is the excuse you use most?",
        "Tag your training partner.",
      ],
      objection: [
        "Too out of shape to start? That is exactly who we built this for.",
        "Yes, we cost more than the chain gym. Here is what the difference buys.",
        "Three hours a week is enough. Here is how we structure it.",
      ],
    },
    bodies: {
      authority: [
        "Consistency beats intensity every single time. Two solid sessions you actually attend will outperform five perfect sessions you skip by week three.",
        "Most plateaus are not a motivation problem. They are a progression problem. If the load, reps or difficulty has not changed in six weeks, neither will you.",
      ],
      product: [
        "First session is an assessment, not a workout you have to survive. We look at how you move, what hurts, and what you actually want, then write the plan from there.",
      ],
      proof: [
        "No transformation package, no dramatic lighting. Just consistent sessions, a plan that adjusted every four weeks, and someone checking in when the sessions stopped.",
      ],
      story: [
        "We could fit more people in each class. We choose not to, because past a certain number nobody gets their form corrected and everyone gets a worse result.",
      ],
      offer: [
        "Two sessions with a coach, a movement assessment and a written plan you keep whether you join or not.",
      ],
      community: [
        "The comments section is the most honest place in this gym. Go on then.",
      ],
      objection: [
        "The chain gym costs less because nobody there is responsible for whether you succeed. That is the entire difference, and it is the reason most memberships go unused.",
      ],
    },
    visuals: ["before-after", "bold-type", "lifestyle-context", "data-tile", "quote-card", "carousel-teach", "split-compare", "editorial-photo"],
    videoIdeas: [
      "Form check: three common squat faults corrected on camera",
      "A full beginner session in 45 seconds",
      "Member interview, unscripted, six months in",
      "Coach reacts to bad fitness advice from the internet",
      "5am open to 9pm close, one day compressed",
    ],
    hashtags: {
      broad: ["fitness", "gym", "workout", "training", "fitnessmotivation", "healthylifestyle"],
      niche: ["strengthtraining", "personaltrainer", "beginnerfitness", "progressiveoverload", "gymcommunity", "functionalfitness", "coaching", "liftheavy"],
      community: ["gymfam", "fitfam", "trainingpartner", "localgym"],
    },
    ctas: ["Book your intro session, link in bio.", "Comment START and we will send the plan.", "DM us your goal and we will tell you where to begin."],
    kpis: [
      { name: "Intro session bookings per month", target: "25+" },
      { name: "Story reply rate", target: "5%+" },
      { name: "Member-generated content per month", target: "8 pieces" },
    ],
    slowMoverTactics: [
      "Reframe the underused class or package around a specific outcome instead of a modality",
      "Run a limited free taster and film the room full",
      "Interview the members who already love it and let them sell it",
      "Bundle it with the hero offer as a recovery or complement session",
    ],
    heroTactics: [
      "Make the flagship programme the default answer to every DM",
      "Show week 1, week 4 and week 12 so progression feels concrete",
      "Put a real member's numbers on screen rather than adjectives",
    ],
    pillarWeights: { proof: 0.22, authority: 0.22, community: 0.14 },
  },

  beauty: {
    label: "Beauty & Skincare",
    emoji: "beauty",
    aka: ["skincare", "beauty", "cosmetics", "makeup", "haircare", "salon", "spa"],
    positioning: [
      "Skincare that tells you what is in it and why.",
      "Fewer products, better formulated, honestly explained.",
      "Results-first beauty without the ten step ritual.",
    ],
    differentiators: [
      "Full concentration disclosure, not just an ingredient list",
      "Formulated for a specific concern rather than everyone",
      "No claims we cannot show evidence for",
      "Fragrance-free options across the range",
    ],
    segments: [
      { name: "The overwhelmed beginner", description: "Owns twelve products and no routine.", trigger: "A breakout or a bad reaction.", objection: "I do not know what my skin type even is." },
      { name: "The ingredient reader", description: "Researches everything, distrusts marketing claims.", trigger: "Saw an ingredient breakdown video.", objection: "Prove the concentration is effective." },
      { name: "The sensitive-skin sufferer", description: "Has reacted badly before and is cautious.", trigger: "A flare-up.", objection: "What if this irritates me too?" },
      { name: "The results seeker", description: "Wants visible change on a specific concern.", trigger: "An event or photo.", objection: "How long until I see anything?" },
    ],
    competitors: [
      { name: "Legacy department store brands", archetype: "The heritage premium", strength: "Trust, counters, gifting culture.", gap: "Vague claims, heavy fragrance, price built on packaging.", counterMove: "Publish formulation detail they will never publish." },
      { name: "Ingredient-led disruptors", archetype: "The transparency leader", strength: "Cheap, clinical, hugely credible.", gap: "Cold, confusing to beginners, no guidance on routine building.", counterMove: "Be the brand that tells you what to use together and in what order." },
      { name: "Influencer-founded lines", archetype: "The attention brand", strength: "Instant reach and aspirational identity.", gap: "Thin formulation story, trend dependent.", counterMove: "Lead with the chemist and the evidence, not the face." },
      { name: "Pharmacy staples", archetype: "The trusted default", strength: "Dermatologist association and accessibility.", gap: "Dated formulations, no community, zero content.", counterMove: "Match the credibility, beat them on experience and education." },
    ],
    objections: [
      "It might break me out",
      "I cannot tell if it is working",
      "It is expensive for the size",
      "I already have too many products",
      "Every brand claims the same thing",
    ],
    proofPoints: [
      "Consumer trial results with sample size stated",
      "Dermatologist or formulator involvement",
      "Before and after with consistent lighting",
      "Ingredient concentrations published",
    ],
    benefits: ["skin that behaves", "a routine you will actually keep", "visible change in weeks not months", "fewer products doing more"],
    hooks: {
      authority: [
        "The order you apply products in matters more than the products.",
        "Retinol is not the problem. How you introduced it is.",
        "What percentage actually does anything, by ingredient.",
        "Three ingredients that cancel each other out.",
        "Your skin barrier, explained in 30 seconds.",
        "You do not have oily skin. You have dehydrated skin.",
      ],
      product: [
        "Everything in {product} and what each thing is doing.",
        "The texture nobody expects.",
        "{product} on bare skin, no filter, morning light.",
        "Why {product} is fragrance free on purpose.",
      ],
      proof: [
        "Eight weeks, same lighting, no retouching.",
        "The DM that made our formulator cry.",
        "What {n} testers reported after four weeks.",
      ],
      story: [
        "The formula we reworked eleven times.",
        "Why we removed an ingredient customers loved.",
        "How long it actually takes to make one batch.",
      ],
      offer: [
        "The routine, bundled, at less than buying it piece by piece.",
        "Back in stock and it went fast last time.",
        "Start with these two. Add the third later.",
      ],
      community: [
        "What is the product you regret buying most?",
        "Rate your current routine out of ten.",
        "Sunscreen every day, or only when sunny? Be honest.",
      ],
      objection: [
        "Worried it will break you out? Here is exactly how to patch test.",
        "Why the bottle is small and the price is not.",
        "You probably do not need a ten step routine. You need four things.",
      ],
    },
    bodies: {
      authority: [
        "Actives are not a race. Introduce one product at a time, give it two weeks, and you will actually know what caused what. Everything at once tells you nothing.",
        "Barrier first, actives second. If your skin stings when you apply water, no serum in the world is going to fix that this week.",
      ],
      product: [
        "One active at a clinically useful percentage, supported by humectants and lipids so it does not wreck your barrier on the way to working.",
      ],
      proof: [
        "Same camera, same window, same time of day, eight weeks apart. That is the only honest way to photograph skin.",
      ],
      story: [
        "Version eight felt beautiful and did nothing. Version eleven felt slightly less luxurious and actually worked. We shipped eleven.",
      ],
      offer: [
        "Cleanser, active, moisturiser. That is a complete routine. Bought together it costs less than assembling it one panic purchase at a time.",
      ],
      community: [
        "No judgement here, we have all bought something purely because the bottle looked good.",
      ],
      objection: [
        "Patch test on your inner forearm for three days, then the side of your jaw for three more. Six days of patience saves six weeks of recovery.",
      ],
    },
    visuals: ["product-cutout", "before-after", "editorial-photo", "carousel-teach", "data-tile", "quote-card", "grid-flatlay", "split-compare"],
    videoIdeas: [
      "Texture close-up with the pipette, no voiceover, sound design only",
      "Formulator explains one ingredient in 40 seconds",
      "Routine in real time, unedited, morning light",
      "Reacting to skincare myths from the comments",
      "Eight week progress reel with dated stills",
    ],
    hashtags: {
      broad: ["skincare", "beauty", "skincareroutine", "glowingskin", "selfcare", "skincaretips"],
      niche: ["skinbarrier", "ingredientfocused", "sensitiveskin", "retinol", "vitaminc", "fragrancefree", "skincarescience", "acnejourney"],
      community: ["skincarecommunity", "skintok", "beautycommunity", "cleanbeauty"],
    },
    ctas: ["Save this routine order.", "Comment ROUTINE for the full breakdown.", "Start with the duo, link in bio."],
    kpis: [
      { name: "Saves on education carousels", target: "80+ saves" },
      { name: "DM enquiries per week", target: "20+" },
      { name: "Bundle attach rate", target: "25%" },
    ],
    slowMoverTactics: [
      "Attach the slow product to a routine step rather than selling it alone",
      "Address the specific fear stopping purchase, usually texture or reaction",
      "Show it solving one narrow problem extremely well",
      "Offer it as the free add-on above a spend threshold to seed reviews",
    ],
    heroTactics: [
      "Make the hero the entry point of every routine post",
      "Document a dated eight week progress series with it",
      "Never discount the hero, bundle it instead",
    ],
    pillarWeights: { authority: 0.24, proof: 0.2, objection: 0.1 },
  },

  restaurant: {
    label: "Restaurant & Food",
    emoji: "restaurant",
    aka: ["restaurant", "cafe", "food", "bakery", "catering", "bar", "kitchen", "dining"],
    positioning: [
      "The place people bring the people they like.",
      "Food worth leaving the house for.",
      "Same kitchen, same standard, every single service.",
    ],
    differentiators: [
      "Menu changes with what is actually in season",
      "Everything made in house, including the boring parts",
      "Named suppliers, not anonymous distributors",
      "Walk-ins genuinely welcome",
    ],
    segments: [
      { name: "The occasion booker", description: "Planning a birthday, date or celebration.", trigger: "A date in the calendar.", objection: "Will it feel special enough?" },
      { name: "The local regular", description: "Lives nearby, eats out weekly, wants a default.", trigger: "Tuesday and nobody wants to cook.", objection: "Is it good value midweek?" },
      { name: "The group organiser", description: "Booking for six or more and dreading it.", trigger: "A work dinner or friends group.", objection: "Can you handle dietary requirements?" },
      { name: "The discovery diner", description: "Follows food accounts, tries new places constantly.", trigger: "Saw a dish on their feed.", objection: "Is it actually as good as the photos?" },
    ],
    competitors: [
      { name: "Chain restaurants", archetype: "The safe default", strength: "Predictable, easy to book, heavy marketing spend.", gap: "No soul, frozen supply chain, forgettable.", counterMove: "Show the hands, the pans and the produce they can never show." },
      { name: "Other independents nearby", archetype: "The direct rival", strength: "Similar quality and local loyalty.", gap: "Usually inconsistent content and no booking funnel.", counterMove: "Out-post them with consistency and make booking one tap." },
      { name: "Delivery-only kitchens", archetype: "The convenience competitor", strength: "Frictionless, cheap, always available.", gap: "No experience, no atmosphere, no reason to care.", counterMove: "Sell the room, the noise and the night out, not just the plate." },
      { name: "Home cooking", archetype: "The invisible competitor", strength: "Free and easy.", gap: "Effort, cleanup, and no occasion.", counterMove: "Position dining out as a reward, not an indulgence." },
    ],
    objections: [
      "It looks expensive",
      "I cannot get a table when I want one",
      "Will there be something for my dietary requirement",
      "Is it good for a group",
      "Parking and location",
    ],
    proofPoints: ["Review scores across platforms", "Repeat bookings", "Named local suppliers", "Chef background and kitchen standards"],
    benefits: ["a night that feels like an event", "food you will talk about tomorrow", "somewhere reliable to bring anyone", "a table that feels looked after"],
    hooks: {
      authority: [
        "How to order here if it is your first time.",
        "The dish everyone walks past and shouldn't.",
        "What actually makes bread taste like that.",
        "Why the menu is short on purpose.",
      ],
      product: [
        "The plate that leaves this kitchen most often.",
        "{product}, from pan to pass.",
        "This takes three days to make. It disappears in four minutes.",
        "New on the menu from Thursday.",
      ],
      proof: [
        "The table that booked again before they left.",
        "Every review this week said the same word.",
        "Fully booked Saturday, and here is why.",
      ],
      story: [
        "Prep at 7am, before anyone sits down.",
        "The supplier we drive an hour for.",
        "Why the chef rewrote the menu again.",
      ],
      offer: [
        "Midweek set menu, two courses, back this week.",
        "A few tables left for the weekend.",
        "Book now for the date everyone forgets until it is too late.",
      ],
      community: [
        "Which dish should we never take off the menu?",
        "Tag who you are bringing.",
        "Starter or dessert. You can only pick one.",
      ],
      objection: [
        "Cheaper than you think midweek. Here is the set menu.",
        "Coming as a group of eight? Here is exactly how to book it.",
        "Every dish can be adapted. Just tell us when you book.",
      ],
    },
    bodies: {
      authority: [
        "Order one thing you recognise and one thing you do not. That is the fastest way to find out what this kitchen is actually good at.",
      ],
      product: [
        "Slow cooked, finished to order, and plated the same way every single service. Consistency is the least glamorous thing a kitchen does and the only thing that matters.",
      ],
      proof: [
        "They booked the next table before they had finished dessert. That is the only review metric we care about.",
      ],
      story: [
        "The kitchen starts four hours before the first table sits down. Stocks, dough, prep, and a run through of anything new.",
      ],
      offer: [
        "Two courses midweek at a price that makes a Tuesday dinner an easy yes.",
      ],
      community: [
        "We genuinely use these comments when we plan the next menu.",
      ],
      objection: [
        "Tell us about allergies and dietary requirements at the point of booking and the kitchen plans around it properly rather than improvising on the night.",
      ],
    },
    visuals: ["editorial-photo", "lifestyle-context", "bold-type", "grid-flatlay", "quote-card", "carousel-teach", "hero-statement", "data-tile"],
    videoIdeas: [
      "One dish, start to finish, no cuts",
      "The pass during Saturday service",
      "Chef picks the three things to order first time",
      "Supplier visit at 6am",
      "Reactions from a table trying the new dish",
    ],
    hashtags: {
      broad: ["food", "foodie", "restaurant", "dinner", "foodphotography", "eatlocal"],
      niche: ["seasonalmenu", "chefsspecial", "openkitchen", "smallplates", "freshpasta", "sourdough", "winepairing", "tastingmenu"],
      community: ["foodiesofinstagram", "localeats", "supportlocal", "wheretoeat"],
    },
    ctas: ["Book through the link in bio.", "Tag who you are bringing.", "Save this for your next night out."],
    kpis: [
      { name: "Bookings attributed to social", target: "40+ per month" },
      { name: "Saves on menu posts", target: "50+" },
      { name: "Tagged customer posts per week", target: "10" },
    ],
    slowMoverTactics: [
      "Give the underordered dish a story and a name people remember",
      "Have staff recommend it and film the reaction",
      "Feature it as the chef's personal pick",
      "Bundle it into the set menu where choice paralysis disappears",
    ],
    heroTactics: [
      "Make the signature dish the visual identity of the account",
      "Show it being made at least twice a month from different angles",
      "Never let a week pass without it appearing",
    ],
    pillarWeights: { product: 0.24, story: 0.2, community: 0.14 },
  },

  fashion: {
    label: "Fashion & Apparel",
    emoji: "fashion",
    aka: ["fashion", "clothing", "apparel", "streetwear", "boutique", "style", "wear"],
    positioning: [
      "Fewer pieces, made properly, worn for years.",
      "The wardrobe staples that do not look like everyone else's.",
      "Design-led clothing at a price that is explainable.",
    ],
    differentiators: [
      "Fabric composition and mill named on every product",
      "Fit shown on more than one body type",
      "Limited runs instead of endless restocks",
      "Repairs offered rather than replacements pushed",
    ],
    segments: [
      { name: "The wardrobe builder", description: "Wants versatile pieces that work together.", trigger: "Realised half the wardrobe goes unworn.", objection: "Will it actually go with what I own?" },
      { name: "The fit-anxious buyer", description: "Has been burned by online sizing.", trigger: "Found a piece they love.", objection: "What if it does not fit?" },
      { name: "The quality convert", description: "Done with fast fashion falling apart.", trigger: "Something fell apart after four washes.", objection: "Is it really better or just pricier?" },
      { name: "The statement seeker", description: "Wants one piece nobody else has.", trigger: "An event or a season change.", objection: "Will it date in six months?" },
    ],
    competitors: [
      { name: "Fast fashion giants", archetype: "The speed machine", strength: "Price, trend velocity, enormous ad spend.", gap: "Disposable quality, no story, ethical exposure.", counterMove: "Show construction detail and cost per wear maths." },
      { name: "Established premium labels", archetype: "The heritage house", strength: "Status, craftsmanship, retail presence.", gap: "Inaccessible price, slow, distant from the customer.", counterMove: "Match the quality story, beat them on access and personality." },
      { name: "Direct-to-consumer basics brands", archetype: "The transparency play", strength: "Clean branding, honest pricing narrative.", gap: "Visually interchangeable, no point of view.", counterMove: "Have an actual aesthetic and defend it." },
      { name: "Resale and vintage", archetype: "The conscience alternative", strength: "Unique, cheap, sustainable halo.", gap: "No sizing control, no consistency, no support.", counterMove: "Sell reliability of fit and the ability to reorder what worked." },
    ],
    objections: ["Sizing is a gamble online", "It is expensive", "Returns will be a hassle", "It might look different in person", "Will it last"],
    proofPoints: ["Fabric weight and composition", "Customer photos in real conditions", "Wear tests after months of use", "Return rate lower than category average"],
    benefits: ["a wardrobe that works together", "clothes that survive the wash", "fit you can trust ordering online", "pieces that do not date"],
    hooks: {
      authority: [
        "How to tell quality construction in 10 seconds.",
        "Cost per wear is the only number that matters.",
        "The fabric weight nobody tells you to check.",
        "Three pieces, nine outfits.",
      ],
      product: [
        "{product} in natural light, on three different people.",
        "Every seam in {product}, and why it is stitched that way.",
        "The fit we adjusted after your feedback.",
      ],
      proof: [
        "One year of wear. Here is what it looks like now.",
        "Your photos, our favourite grid this month.",
        "The piece with the lowest return rate we have ever made.",
      ],
      story: [
        "Sampling, round four.",
        "Why this took nine months to get right.",
        "The mill that makes our fabric.",
      ],
      offer: [
        "Limited run, and it will not be restocked.",
        "The set, priced as a set.",
        "Last sizes remaining.",
      ],
      community: [
        "Style it your way, tag us.",
        "Which colourway should we make next?",
        "Rate this fit out of ten.",
      ],
      objection: [
        "Sizing anxiety? Here is the exact measurement guide.",
        "Why it costs what it costs, broken down.",
        "Free returns, and here is how long it actually takes.",
      ],
    },
    bodies: {
      authority: [
        "Check the fabric weight, the seam finish and whether the pattern matches at the join. Those three things separate clothing that lasts from clothing that photographs well once.",
      ],
      product: [
        "Heavier fabric than the category standard, reinforced where it takes stress, and cut so it still fits after it has been washed properly.",
      ],
      proof: [
        "Twelve months, weekly wear, washed the way real people wash things. This is the honest version.",
      ],
      story: [
        "Four rounds of sampling to get the shoulder right. Nobody notices a good shoulder, everybody notices a bad one.",
      ],
      offer: [
        "Made in a limited run because we would rather sell out than discount.",
      ],
      community: [
        "The way you wear it is consistently better than the way we shoot it.",
      ],
      objection: [
        "Every product page has flat measurements alongside the size chart. Measure something you already own and love, and match it.",
      ],
    },
    visuals: ["editorial-photo", "lifestyle-context", "grid-flatlay", "product-cutout", "bold-type", "carousel-teach", "quote-card", "split-compare"],
    videoIdeas: [
      "Try-on across three body types with measurements on screen",
      "Fabric stress test, filmed honestly",
      "Styling one piece five ways",
      "Sampling room walkthrough",
      "Unboxing shot from the customer point of view",
    ],
    hashtags: {
      broad: ["fashion", "style", "ootd", "outfit", "streetwear", "wardrobe"],
      niche: ["slowfashion", "capsulewardrobe", "madetolast", "fabricquality", "independentbrand", "limitedrun", "menswear", "womenswear"],
      community: ["styleinspo", "fashioncommunity", "supportsmallbrands", "outfitoftheday"],
    },
    ctas: ["Check the size guide, link in bio.", "Tag us in your fit.", "Last sizes, shop now."],
    kpis: [
      { name: "Add to cart rate from social", target: "6%+" },
      { name: "UGC posts per month", target: "20" },
      { name: "Return rate", target: "Below category average" },
    ],
    slowMoverTactics: [
      "Restyle the slow piece into outfits with the bestsellers",
      "Show it on the body type it flatters most and say so",
      "Explain the design decision that makes it look odd flat and great worn",
      "Make it the free gift above a threshold to generate wear photos",
    ],
    heroTactics: [
      "Shoot the hero piece in every new campaign regardless of season",
      "Anchor the whole collection styling around it",
      "Publish the wear test at six and twelve months",
    ],
    pillarWeights: { product: 0.24, proof: 0.18, community: 0.14 },
  },

  saas: {
    label: "SaaS & Software",
    emoji: "saas",
    aka: ["saas", "software", "app", "platform", "tool", "startup", "tech"],
    positioning: [
      "The tool that removes the work instead of adding another dashboard.",
      "Built for the person doing the job, not the person buying the software.",
      "Set up in an afternoon, useful the same day.",
    ],
    differentiators: [
      "Onboarding measured in minutes, not implementation calls",
      "Transparent pricing published on the site",
      "Exports everything, no lock-in",
      "Built by people who did the job",
    ],
    segments: [
      { name: "The spreadsheet escapee", description: "Running a critical process in a fragile spreadsheet.", trigger: "Something broke and cost them.", objection: "Migrating will take weeks." },
      { name: "The tool-fatigued team", description: "Already pays for six tools nobody uses.", trigger: "Renewal or budget review.", objection: "Another subscription is a hard sell internally." },
      { name: "The scaling operator", description: "Process worked at 5 people, breaking at 25.", trigger: "Headcount growth.", objection: "Will it still work at 100?" },
      { name: "The evaluator", description: "Comparing three options in a spreadsheet right now.", trigger: "Active buying cycle.", objection: "How are you different from the leader?" },
    ],
    competitors: [
      { name: "The category leader", archetype: "The enterprise incumbent", strength: "Brand safety, integrations, sales team.", gap: "Bloated, expensive, slow to onboard.", counterMove: "Sell time to value. Show setup in real time." },
      { name: "Cheap point solutions", archetype: "The budget option", strength: "Low price, single job done well.", gap: "Breaks at scale, no support, disconnected data.", counterMove: "Show the cost of stitching five tools together." },
      { name: "Spreadsheets", archetype: "The default incumbent", strength: "Free, flexible, universally understood.", gap: "Fragile, unauditable, does not scale.", counterMove: "Dramatise the failure mode everyone has lived through." },
      { name: "Internal builds", archetype: "The do-it-yourself option", strength: "Perfectly tailored, no vendor risk.", gap: "Maintenance debt nobody budgets for.", counterMove: "Price the engineering hours honestly." },
    ],
    objections: ["Migration will be painful", "My team will not adopt it", "It is another subscription", "Security and data ownership", "How is this different from the leader"],
    proofPoints: ["Time to first value", "Named customers and use cases", "Uptime and security posture", "Measured hours saved per week"],
    benefits: ["hours back every week", "one source of truth", "fewer tools to pay for", "processes that survive growth"],
    hooks: {
      authority: [
        "The workflow costing your team six hours a week.",
        "Why your process breaks at exactly 20 people.",
        "Three automations worth building before anything else.",
        "The metric most teams track and should not.",
      ],
      product: [
        "Setup, start to finish, in real time.",
        "The feature nobody asks for and everybody uses.",
        "{product} doing the boring part for you.",
      ],
      proof: [
        "How one team cut this from 6 hours to 20 minutes.",
        "The number our customers quote back to us most.",
        "Migrated on a Tuesday, live by Wednesday.",
      ],
      story: [
        "The feature we deleted and why.",
        "We built this because we needed it.",
        "The bug that taught us the most.",
      ],
      offer: [
        "Pricing, published, no call required.",
        "Migration done for you this month.",
        "Annual plans, two months free.",
      ],
      community: [
        "What is still in a spreadsheet at your company? Be honest.",
        "The tool you pay for and never open.",
        "Best automation you have ever built. Go.",
      ],
      objection: [
        "Worried about migration? Here is the actual timeline.",
        "Not another subscription, a replacement for three.",
        "Your data, exportable, always. Here is how.",
      ],
    },
    bodies: {
      authority: [
        "The process is not slow because your team is slow. It is slow because information lives in four places and someone has to reconcile them by hand every week.",
      ],
      product: [
        "No implementation call, no onboarding fee, no sales cycle. Connect the source, map the fields, and it runs.",
      ],
      proof: [
        "Same team, same volume, same week of the month. The only variable that changed was where the data lived.",
      ],
      story: [
        "We shipped a feature that tested well and got used by nobody. Removing it made the product better than adding three more would have.",
      ],
      offer: [
        "Pricing is on the site. If it fits your budget you can start today without talking to anyone.",
      ],
      community: [
        "Every company has one. The spreadsheet that runs something critical and only one person understands.",
      ],
      objection: [
        "Export is a first-class feature, not a retention obstacle. If you leave, you leave with everything, in a format that opens.",
      ],
    },
    visuals: ["data-tile", "split-compare", "carousel-teach", "bold-type", "quote-card", "hero-statement", "product-cutout", "editorial-photo"],
    videoIdeas: [
      "Screen recording: the whole setup in 60 seconds",
      "Before and after of one workflow, timed on camera",
      "Founder explains the one thing the category gets wrong",
      "Customer walkthrough of their actual configuration",
      "Feature shipped this week, demoed by whoever built it",
    ],
    hashtags: {
      broad: ["saas", "productivity", "software", "startup", "tech", "automation"],
      niche: ["workflowautomation", "buildinpublic", "producttips", "opsteam", "nocode", "b2bsaas", "teamproductivity", "toolstack"],
      community: ["startupcommunity", "founderlife", "techtwitter", "productpeople"],
    },
    ctas: ["Start free setup, link in bio.", "Comment DEMO for the walkthrough.", "See pricing, no call needed."],
    kpis: [
      { name: "Signups attributed to social", target: "60+ per month" },
      { name: "Demo requests", target: "15+ per month" },
      { name: "Carousel save rate", target: "5%+" },
    ],
    slowMoverTactics: [
      "Show the underused feature solving one painful, specific job",
      "Publish a customer story where that feature was the deciding factor",
      "Turn it into a standalone teaching series rather than a feature announcement",
      "Bundle it into onboarding so adoption is default rather than discovered",
    ],
    heroTactics: [
      "Lead every demo with the hero workflow",
      "Quantify the hours saved and repeat the number relentlessly",
      "Make the hero the subject of the pinned post",
    ],
    pillarWeights: { authority: 0.28, product: 0.2, proof: 0.18 },
  },

  agency: {
    label: "Agency & Services",
    emoji: "agency",
    aka: ["agency", "consulting", "freelance", "studio", "marketing", "design", "services", "b2b"],
    positioning: [
      "Senior people doing the actual work, not a pitch team and then juniors.",
      "Outcomes contracted, not hours billed.",
      "The team you hire when the last agency did not work.",
    ],
    differentiators: [
      "The person who pitches is the person who delivers",
      "Fixed scope and fixed price, no surprise invoices",
      "Work shown publicly with real numbers",
      "We say no to projects we are wrong for",
    ],
    segments: [
      { name: "The burned rebuyer", description: "Had a bad agency experience and is cautious.", trigger: "A contract ended badly.", objection: "How do I know you are different?" },
      { name: "The in-house lead", description: "Has a team but needs specialist capacity.", trigger: "A project their team cannot staff.", objection: "Will you work well with my team?" },
      { name: "The scaling founder", description: "Doing marketing themselves and out of time.", trigger: "Growth stalled.", objection: "Can I afford this yet?" },
      { name: "The procurement buyer", description: "Comparing three agencies formally.", trigger: "An RFP or budget cycle.", objection: "Justify your rate against the others." },
    ],
    competitors: [
      { name: "Large full-service agencies", archetype: "The safe big name", strength: "Credibility, breadth, case studies.", gap: "Senior pitch, junior delivery, slow and expensive.", counterMove: "Name who does the work and show their portfolio." },
      { name: "Freelance marketplaces", archetype: "The cheap alternative", strength: "Price and speed to start.", gap: "No strategy, no accountability, high variance.", counterMove: "Contrast a coordinated system against disconnected tasks." },
      { name: "In-house hires", archetype: "The build option", strength: "Dedicated, embedded, loyal.", gap: "One person cannot cover strategy, design and media.", counterMove: "Compare total cost of a team against one salary." },
      { name: "Boutique specialists", archetype: "The narrow expert", strength: "Deep expertise in one channel.", gap: "Cannot connect the channel to the wider funnel.", counterMove: "Sell the joined-up system, not the channel." },
    ],
    objections: ["Agencies overpromise", "It is too expensive for our stage", "We tried this before and it failed", "Long contracts", "Who actually does the work"],
    proofPoints: ["Named case studies with metrics", "Client retention length", "Team credentials", "Work published openly"],
    benefits: ["a pipeline that does not depend on referrals", "marketing that runs without you", "senior thinking without a senior salary", "results you can point at"],
    hooks: {
      authority: [
        "The brief that guarantees a bad result.",
        "Why your ads are not the problem.",
        "What a good {category} audit actually looks at.",
        "Three numbers that tell you if marketing is working.",
      ],
      product: [
        "How we actually run an engagement, week by week.",
        "What you get in the first 30 days.",
        "The deliverable clients screenshot most.",
      ],
      proof: [
        "The client who came to us after two failed agencies.",
        "Same budget, different structure, here is the difference.",
        "Numbers from a project we can finally talk about.",
      ],
      story: [
        "The project we turned down and why.",
        "How we scope work so nobody gets surprised.",
        "The mistake that changed our process.",
      ],
      offer: [
        "Two slots for new clients this quarter.",
        "A paid audit that comes off the first invoice.",
        "Fixed scope, fixed price, published.",
      ],
      community: [
        "Worst agency red flag you have seen.",
        "In-house or agency? Fight.",
        "The metric your boss cares about that you think is useless.",
      ],
      objection: [
        "Yes we cost more than a freelancer. Here is what that buys.",
        "No twelve month lock-in. Here is how we structure it instead.",
        "The person in this video is the person on your account.",
      ],
    },
    bodies: {
      authority: [
        "Most campaigns fail at the brief, not the execution. If the audience, the offer and the success metric are not agreed in writing, no amount of creative rescues it.",
      ],
      product: [
        "Week one is audit and access. Week two is strategy and the first build. Week three you see work. Week four we report against the number we agreed on day one.",
      ],
      proof: [
        "They arrived convinced the channel was broken. It was not. The targeting and the offer were pointed at two different people.",
      ],
      story: [
        "We said no because we would have been the third agency to fail at a problem that was not a marketing problem.",
      ],
      offer: [
        "Capacity is genuinely limited because the people who pitch are the people who deliver.",
      ],
      community: [
        "Anonymous answers welcome. We know some of you cannot name names.",
      ],
      objection: [
        "A freelancer executes a task. A team owns an outcome. If you already know exactly what needs doing, hire the freelancer, honestly.",
      ],
    },
    visuals: ["data-tile", "split-compare", "carousel-teach", "quote-card", "bold-type", "hero-statement", "editorial-photo", "before-after"],
    videoIdeas: [
      "Screen-share teardown of a real (anonymised) campaign",
      "Founder answers the three questions every prospect asks",
      "Case study walkthrough with the numbers on screen",
      "A day inside the studio during a launch week",
      "Reacting to bad marketing advice",
    ],
    hashtags: {
      broad: ["marketing", "branding", "design", "agency", "business", "growth"],
      niche: ["brandstrategy", "performancemarketing", "creativedirection", "b2bmarketing", "casestudy", "marketingstrategy", "designsystem", "adcreative"],
      community: ["marketingtwitter", "creativecommunity", "smallbusinessowner", "founders"],
    },
    ctas: ["Book a call, link in bio.", "Comment AUDIT and we will send the checklist.", "Two slots left this quarter."],
    kpis: [
      { name: "Qualified enquiries per month", target: "10+" },
      { name: "Case study post engagement", target: "Top 20% of account" },
      { name: "Profile to booking rate", target: "4%+" },
    ],
    slowMoverTactics: [
      "Turn the underused service into a standalone diagnostic offer",
      "Publish a case study where that service was the whole win",
      "Price it as an entry point that leads into the flagship",
      "Teach the problem it solves until people self-identify",
    ],
    heroTactics: [
      "Make the flagship engagement the answer to every inbound question",
      "Show the process, not just the outcome, so the price makes sense",
      "Publish results with real numbers every month",
    ],
    pillarWeights: { authority: 0.3, proof: 0.22, offer: 0.14 },
  },

  clinic: {
    label: "Clinic & Wellness",
    emoji: "clinic",
    aka: ["clinic", "dental", "aesthetic", "physio", "wellness", "medical", "therapy", "health"],
    positioning: [
      "Clinical standards with the anxiety taken out.",
      "The clinic that explains before it treats.",
      "Honest advice, even when the answer is do nothing.",
    ],
    differentiators: [
      "Consultation is a conversation, not a sales pitch",
      "Practitioner credentials published openly",
      "Pricing given upfront in writing",
      "We will tell you when you do not need treatment",
    ],
    segments: [
      { name: "The anxious first-timer", description: "Has avoided booking for years.", trigger: "Pain or a visible issue they can no longer ignore.", objection: "Will it hurt and will I be judged?" },
      { name: "The researcher", description: "Has read everything and wants clinical detail.", trigger: "Comparing clinics.", objection: "What are your practitioners actually qualified in?" },
      { name: "The result seeker", description: "Wants a specific outcome by a specific date.", trigger: "An event.", objection: "How long is recovery?" },
      { name: "The second opinion", description: "Was quoted something elsewhere and is unsure.", trigger: "A quote that felt wrong.", objection: "Is this treatment even necessary?" },
    ],
    competitors: [
      { name: "High street chains", archetype: "The accessible volume clinic", strength: "Convenience, price, availability.", gap: "Rushed appointments, rotating practitioners, upsell culture.", counterMove: "Sell continuity of care and unhurried consultations." },
      { name: "Premium private clinics", archetype: "The luxury provider", strength: "Environment, technology, prestige.", gap: "Intimidating price and atmosphere.", counterMove: "Match the clinical standard, remove the intimidation." },
      { name: "At-home and DIY options", archetype: "The cheap shortcut", strength: "Private, cheap, immediate.", gap: "Risk, poor results, often needs correcting later.", counterMove: "Educate on risk honestly without fear-mongering." },
      { name: "Doing nothing", archetype: "The default", strength: "Free and comfortable.", gap: "The problem usually gets more expensive.", counterMove: "Show the cost curve of waiting, calmly." },
    ],
    objections: ["Will it hurt", "It is expensive", "I am embarrassed", "Do I actually need it", "How long is the recovery"],
    proofPoints: ["Practitioner qualifications and registration", "Patient outcomes with consent", "Years in practice and case volume", "Independent review scores"],
    benefits: ["confidence you stop thinking about", "pain that stops interrupting your day", "a plan instead of guessing", "answers from someone qualified"],
    hooks: {
      authority: [
        "What actually happens in a first appointment.",
        "The symptom people ignore for two years too long.",
        "Three questions to ask any clinic before you book.",
        "When you genuinely do not need treatment.",
      ],
      product: [
        "The treatment explained, start to finish.",
        "What recovery really looks like day by day.",
        "The equipment we use and why it matters.",
      ],
      proof: [
        "Twelve weeks, with consent, no retouching.",
        "The patient who put this off for a decade.",
        "What our reviews say most often.",
      ],
      story: [
        "Why our consultations run 45 minutes.",
        "Meet the practitioner.",
        "The standard we will not compromise on.",
      ],
      offer: [
        "Consultation slots open for this month.",
        "Assessment and written plan, fixed price.",
        "Payment plans available, here is how they work.",
      ],
      community: [
        "What put you off booking for so long?",
        "Ask us anything, we will answer in a post.",
        "The myth you believed until recently.",
      ],
      objection: [
        "Worried it will hurt? Here is exactly what you will feel.",
        "Nobody here is judging you. Genuinely.",
        "Here is what it costs, in writing, before you commit.",
      ],
    },
    bodies: {
      authority: [
        "A first appointment is assessment and explanation. Nothing is done to you that has not been described first, and you can stop at any point.",
      ],
      product: [
        "The treatment plan is written down, priced, and sequenced. You leave knowing what happens, when, and what it costs.",
      ],
      proof: [
        "Shared with full consent, same lighting, same angle. Results vary and we will always tell you what is realistic for you.",
      ],
      story: [
        "Longer consultations mean fewer appointments per day. It is a worse business model and a better clinic.",
      ],
      offer: [
        "An assessment and a written plan, fixed price, with no obligation to book treatment.",
      ],
      community: [
        "No question is too basic. The basic ones are the ones most people are quietly wondering about.",
      ],
      objection: [
        "Most of the anxiety comes from not knowing. So here is the whole appointment, described step by step, before you decide anything.",
      ],
    },
    visuals: ["quote-card", "carousel-teach", "before-after", "editorial-photo", "data-tile", "bold-type", "lifestyle-context", "split-compare"],
    videoIdeas: [
      "Walk through the clinic so first-timers know what to expect",
      "Practitioner answers the five most-asked questions",
      "What a consultation actually involves, filmed",
      "Myth versus clinical reality series",
      "Patient story with consent, unscripted",
    ],
    hashtags: {
      broad: ["health", "wellness", "clinic", "selfcare", "treatment", "healthcare"],
      niche: ["patientcare", "evidencebased", "recovery", "consultation", "clinicalexcellence", "preventativecare", "practitioner", "healthtips"],
      community: ["healthjourney", "wellbeing", "localclinic", "askadoctor"],
    },
    ctas: ["Book a consultation, link in bio.", "Send us your question, we answer every one.", "Slots open this month."],
    kpis: [
      { name: "Consultation bookings per month", target: "30+" },
      { name: "Question DMs answered", target: "100%" },
      { name: "Educational post saves", target: "40+" },
    ],
    slowMoverTactics: [
      "Educate on the problem the underbooked treatment solves rather than the treatment itself",
      "Answer the specific fear that blocks it in a dedicated post",
      "Offer it as an add-on assessment inside the popular consultation",
      "Publish an honest cost and recovery breakdown",
    ],
    heroTactics: [
      "Make the flagship treatment the subject of a recurring explainer series",
      "Publish consented results monthly",
      "Keep the booking path to one tap from every post",
    ],
    pillarWeights: { authority: 0.28, objection: 0.14, proof: 0.2 },
  },

  ecommerce: {
    label: "Ecommerce & Products",
    emoji: "shop",
    aka: ["ecommerce", "shop", "store", "product", "retail", "dtc", "online store"],
    positioning: [
      "The product that solves one problem properly.",
      "Built better than it needs to be, priced like it is not.",
      "The last one you will need to buy.",
    ],
    differentiators: [
      "Designed around one job instead of ten compromises",
      "Materials and manufacturing published",
      "Replacement parts available rather than whole-unit replacement",
      "Real warranty, honoured without a fight",
    ],
    segments: [
      { name: "The problem-aware buyer", description: "Knows the pain, does not know the solution exists.", trigger: "The problem happened again today.", objection: "Does this actually solve it?" },
      { name: "The comparison shopper", description: "Has three tabs open right now.", trigger: "Active purchase intent.", objection: "Why yours over the cheaper one?" },
      { name: "The gift buyer", description: "Buying for someone else, low confidence.", trigger: "An occasion approaching.", objection: "What if they do not like it?" },
      { name: "The repeat customer", description: "Already bought once and liked it.", trigger: "A new release or a restock.", objection: "Do I need a second one?" },
    ],
    competitors: [
      { name: "Marketplace generics", archetype: "The price floor", strength: "Cheap, fast shipping, huge selection.", gap: "Unbranded, inconsistent quality, no support.", counterMove: "Show the failure mode of the cheap version honestly." },
      { name: "Established category brands", archetype: "The trusted default", strength: "Recognition, retail shelf space, reviews.", gap: "Slow to innovate, priced on brand not build.", counterMove: "Compete on specification and directness." },
      { name: "Premium design brands", archetype: "The aspirational option", strength: "Aesthetics and status.", gap: "Form over function, very high price.", counterMove: "Prove function without losing the design story." },
      { name: "Doing without", archetype: "The status quo", strength: "Costs nothing.", gap: "The problem persists and compounds.", counterMove: "Quantify the cost of the problem." },
    ],
    objections: ["Why is it more than the cheap one", "Will it actually work for my situation", "Shipping and returns", "Is the brand legitimate", "Will it last"],
    proofPoints: ["Verified review volume and score", "Stress and durability testing", "Repeat purchase and referral rate", "Warranty claim rate"],
    benefits: ["one problem gone for good", "something that does not need replacing", "an upgrade you notice daily", "less friction in a daily routine"],
    hooks: {
      authority: [
        "How to spot the difference between good and expensive.",
        "The specification everyone ignores and should not.",
        "Why the cheap version fails at exactly the same point.",
        "{n} ways people use {product} that we did not design for.",
      ],
      product: [
        "{product}, every angle.",
        "The detail that took the longest to get right.",
        "What is in the box.",
      ],
      proof: [
        "{n} reviews later, here is the most common sentence.",
        "One year of daily use.",
        "The customer photo that sold more than our campaign did.",
      ],
      story: [
        "The prototype that failed.",
        "Why we changed manufacturer.",
        "How this went from sketch to shelf.",
      ],
      offer: [
        "Bundle and save, this week only.",
        "Restocked, and it sold out in nine days last time.",
        "Free shipping threshold, explained.",
      ],
      community: [
        "Show us yours.",
        "Which colour should we make next?",
        "What should we fix first?",
      ],
      objection: [
        "Cheaper alternatives exist. Here is what you give up.",
        "Not sure it fits your setup? Here is the sizing guide.",
        "Returns, honestly explained.",
      ],
    },
    bodies: {
      authority: [
        "Cheap versions fail in the same place every time, because that is where the cost gets cut. Once you know where to look, the difference is obvious in ten seconds.",
      ],
      product: [
        "One job, done properly, with parts you can replace instead of a product you have to throw away.",
      ],
      proof: [
        "We did not choose the flattering photo. We chose the one that shows a year of honest use.",
      ],
      story: [
        "The first prototype worked and felt wrong. Fixing the feel took another four months and nobody would have complained if we had shipped the first one.",
      ],
      offer: [
        "Bought together it costs less than buying separately, and it is the combination most people end up with anyway.",
      ],
      community: [
        "Genuinely useful answers here shape what we make next.",
      ],
      objection: [
        "You can buy a cheaper one. It will work for a while. The difference shows up at month eight, and we would rather tell you that now.",
      ],
    },
    visuals: ["product-cutout", "grid-flatlay", "split-compare", "data-tile", "quote-card", "editorial-photo", "carousel-teach", "lifestyle-context"],
    videoIdeas: [
      "Unboxing from the customer point of view",
      "Side by side against the cheap alternative, same test",
      "Every feature in 45 seconds, no talking",
      "Factory or workshop walkthrough",
      "One year later, honest condition check",
    ],
    hashtags: {
      broad: ["shopsmall", "product", "design", "newin", "onlineshopping", "smallbusiness"],
      niche: ["productdesign", "madetolast", "everydaycarry", "unboxing", "materialmatters", "wellmade", "functionaldesign", "independentbrand"],
      community: ["supportsmallbusiness", "shoplocal", "productcommunity", "customerlove"],
    },
    ctas: ["Shop it, link in bio.", "Save this comparison.", "Comment SIZE and we will help you choose."],
    kpis: [
      { name: "Conversion rate from social traffic", target: "2.5%+" },
      { name: "Average order value uplift from bundles", target: "+20%" },
      { name: "UGC pieces per month", target: "15" },
    ],
    slowMoverTactics: [
      "Diagnose why it is slow: unclear use case, wrong price anchor, or missing proof, then post directly against that",
      "Pair it with the bestseller in a bundle so it inherits trust",
      "Show a specific customer type it is perfect for and speak only to them",
      "Run a comparison post where it wins on one clear dimension",
    ],
    heroTactics: [
      "Anchor the catalogue around the hero so everything else is understood in relation to it",
      "Publish new proof for the hero every single week",
      "Never let the hero be the discounted item",
    ],
  },

  general: {
    label: "General Business",
    emoji: "business",
    aka: ["business", "general", "other", "brand", "company"],
    positioning: [
      "The obvious choice once you know what to look for.",
      "Built for {audience} who are tired of the usual options.",
      "Clear, honest and better where it counts.",
    ],
    differentiators: [
      "We explain our thinking rather than asking for blind trust",
      "Priced transparently",
      "Made for a specific person, not everyone",
      "We answer every message ourselves",
    ],
    segments: [
      { name: "The problem-aware buyer", description: "Feels the pain and is actively looking.", trigger: "The problem got expensive.", objection: "Will this actually solve it?" },
      { name: "The comparison shopper", description: "Weighing you against two alternatives.", trigger: "Active buying window.", objection: "Why you and not them?" },
      { name: "The cautious first-timer", description: "Never bought in this category before.", trigger: "A recommendation or a post.", objection: "I do not know what good looks like." },
      { name: "The returning customer", description: "Bought before, open to buying again.", trigger: "A new release or a reminder.", objection: "Do I need more?" },
    ],
    competitors: [
      { name: "The market leader", archetype: "The default choice", strength: "Recognition and reach.", gap: "Generic, slow, impersonal.", counterMove: "Be specific and human where they are broad and corporate." },
      { name: "The cheap alternative", archetype: "The price play", strength: "Low barrier to trying.", gap: "Quality and support fall over under real use.", counterMove: "Show the total cost, not the sticker price." },
      { name: "The premium option", archetype: "The prestige brand", strength: "Status and polish.", gap: "Priced beyond what most buyers need.", counterMove: "Deliver the substance without the markup." },
      { name: "Doing nothing", archetype: "The status quo", strength: "Free and easy.", gap: "The problem compounds quietly.", counterMove: "Make the cost of inaction visible." },
    ],
    objections: ["Is it worth the price", "Will it work for me specifically", "I have been disappointed before", "I do not have time to switch", "How do I know you are legitimate"],
    proofPoints: ["Customer results and testimonials", "Years operating and volume served", "Independent reviews", "Guarantees you actually honour"],
    benefits: ["a problem that stops coming back", "time saved every week", "confidence in the decision", "results you can point at"],
    hooks: {},
    bodies: {},
    visuals: ["bold-type", "hero-statement", "carousel-teach", "quote-card", "data-tile", "product-cutout", "editorial-photo", "split-compare"],
    videoIdeas: [
      "Answer the three questions every customer asks",
      "Show the process from start to finish",
      "Customer story, unscripted",
      "Myth versus reality in your category",
      "A day behind the scenes",
    ],
    hashtags: {
      broad: ["business", "smallbusiness", "entrepreneur", "brand", "quality", "local"],
      niche: ["businessowner", "customerfirst", "madewithcare", "behindthebrand", "smallbusinesstips", "buildinpublic"],
      community: ["supportsmallbusiness", "shoplocal", "communityfirst", "smallbizlove"],
    },
    ctas: ["Link in bio to get started.", "Send us a message, we reply personally.", "Save this for later."],
    kpis: [
      { name: "Engagement rate", target: "4%+" },
      { name: "Profile visits to link clicks", target: "8%+" },
      { name: "Enquiries per month", target: "20+" },
    ],
    slowMoverTactics: [
      "Identify whether the blocker is awareness, clarity or trust, and post directly at it",
      "Pair it with your bestseller so it borrows credibility",
      "Give it a single, specific ideal customer and speak only to them",
      "Publish one strong proof point about it every week",
    ],
    heroTactics: [
      "Make the hero the default recommendation everywhere",
      "Add a new proof point for it weekly",
      "Bundle rather than discount",
    ],
  },
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORIES).map(([key, v]) => ({
  key,
  label: v.label,
}));

export function resolveCategory(input: string): { key: string; playbook: CategoryPlaybook } {
  const q = (input || "").toLowerCase().trim();
  if (CATEGORIES[q]) return { key: q, playbook: CATEGORIES[q] };
  for (const [key, pb] of Object.entries(CATEGORIES)) {
    if (pb.aka.some((a) => q.includes(a))) return { key, playbook: pb };
  }
  return { key: "general", playbook: CATEGORIES.general };
}

/**
 * A natural mass noun for each category, used wherever copy says things like
 * "the {category} advice everyone repeats". The display label ("Beauty &
 * Skincare") reads badly inside a sentence; these do not.
 */
export const CATEGORY_NOUN: Record<string, string> = {
  coffee: "coffee",
  fitness: "training",
  beauty: "skincare",
  restaurant: "food",
  fashion: "clothing",
  saas: "software",
  agency: "marketing",
  clinic: "treatment",
  ecommerce: "shopping",
  general: "business",
};

export function categoryNoun(key: string) {
  return CATEGORY_NOUN[key] || CATEGORIES[key]?.label.split(/\s*&\s*/)[0].toLowerCase() || "business";
}
