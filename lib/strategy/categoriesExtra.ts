import type { CategoryPlaybook } from "./knowledge";

/**
 * Additional industry playbooks.
 *
 * These extend the general playbook rather than restating all eighteen fields.
 * What actually differs between industries is who buys, who they compare you
 * to, what stops them, and what proof lands — so those are written out in full,
 * and the mechanical parts (hook and body banks) are inherited.
 *
 * Exported as a factory so categories.ts can pass its own general playbook in.
 * That keeps the import one-directional and avoids a module cycle.
 */
export function makeExtraCategories(base: CategoryPlaybook): Record<string, CategoryPlaybook> {
  const from = (
    overrides: Partial<CategoryPlaybook> & Pick<CategoryPlaybook, "label" | "emoji" | "aka">
  ): CategoryPlaybook => ({ ...base, ...overrides });

  return {
    jewellery: from({
      label: "Jewellery & Watches",
      emoji: "sparkle",
      aka: ["jewellery", "jewelry", "watches", "gold", "diamond", "accessories"],
      positioning: [
        "Pieces that outlive the trend that sold them.",
        "Fine jewellery without the showroom markup.",
        "The piece you buy once and hand down.",
      ],
      differentiators: [
        "Stone and metal origin stated on every piece",
        "Resizing and lifetime servicing included",
        "Photographed on real skin, not a mannequin",
        "Made to order, so nothing sits in a case for years",
      ],
      segments: [
        { name: "The gift buyer", description: "Buying for someone else, afraid of getting it wrong.", trigger: "An anniversary two weeks out.", objection: "What if they do not like it?" },
        { name: "The self-purchaser", description: "Buys her own jewellery and knows what she wants.", trigger: "A promotion or a milestone.", objection: "Is this worth what they are asking?" },
        { name: "The engagement shopper", description: "One purchase, high stakes, no experience.", trigger: "A decision already made privately.", objection: "Am I being overcharged for a stone?" },
        { name: "The collector", description: "Already owns pieces, watching for the right addition.", trigger: "A new drop or a rare stone.", objection: "Will this hold its value?" },
      ],
      competitors: [
        { name: "The mall chain", archetype: "The safe default", strength: "Trust, returns and a physical counter.", gap: "Identical stock in every city.", counterMove: "Show the piece nobody else is selling." },
        { name: "The online marketplace", archetype: "The price play", strength: "Cheap and endless choice.", gap: "No provenance, no service, no recourse.", counterMove: "Publish the certificate and the aftercare." },
        { name: "The luxury house", archetype: "The name on the box", strength: "Status.", gap: "You are paying for the box.", counterMove: "Same stone, same craft, no logo tax." },
        { name: "Buying nothing", archetype: "The postponed gift", strength: "Costs nothing today.", gap: "The occasion still arrives.", counterMove: "Make the deadline concrete." },
      ],
      objections: ["Is the stone what they claim", "Can I return it if it is wrong", "Will it tarnish or bend", "Is this priced fairly", "Can it be resized"],
      proofPoints: ["Certification and hallmarks", "Worn-in photos after a year", "Resize and repair guarantee", "Customer photos on the day it was given"],
      benefits: ["a piece that still looks right in ten years", "a gift that lands", "quiet confidence", "value you can verify"],
      visuals: ["product-cutout", "editorial-photo", "hero-statement", "split-compare", "quote-card", "bold-type"],
      videoIdeas: [
        "One piece, macro, turning slowly under a single light",
        "How to tell a good setting from a bad one in ten seconds",
        "The piece being made, start to finish",
        "Unboxing the way the recipient will see it",
        "The three questions everyone asks about carat",
      ],
      hashtags: {
        broad: ["jewellery", "jewelry", "gold", "watches", "finejewelry", "accessories"],
        niche: ["handmadejewellery", "engagementring", "18kgold", "gemstones", "watchcollector", "madetoorder"],
        community: ["jewellerylovers", "ringgoals", "everydayjewellery", "watchfam"],
      },
      ctas: ["Message us for sizing and availability.", "Link in bio to see the full piece.", "Save this for the occasion you are planning."],
      kpis: [
        { name: "Saves per post", target: "Top 10% of reach" },
        { name: "DM enquiries", target: "15+ per month" },
        { name: "Profile visits to link clicks", target: "10%+" },
      ],
    }),

    fragrance: from({
      label: "Perfume & Oud",
      emoji: "sparkle",
      aka: ["perfume", "fragrance", "oud", "bakhoor", "attar", "scent"],
      positioning: [
        "A scent that people ask you about.",
        "Oud that smells like oud, not like a description of it.",
        "Built for the climate you actually live in.",
      ],
      differentiators: [
        "Concentration stated honestly, not implied",
        "Longevity tested in real heat, not a cold shop",
        "Sample sizes so nobody buys a full bottle blind",
        "Notes listed in full, including the ones brands hide",
      ],
      segments: [
        { name: "The signature seeker", description: "Wants one scent that becomes theirs.", trigger: "Ran out of the last bottle.", objection: "Will it smell the same on me?" },
        { name: "The collector", description: "Owns twenty bottles and wants one more.", trigger: "A new release or a rare note.", objection: "Is this different from what I own?" },
        { name: "The gift buyer", description: "Buying blind for someone else.", trigger: "Eid, a wedding, a birthday.", objection: "What if they hate it?" },
        { name: "The occasion buyer", description: "Wants something for evenings and events only.", trigger: "An event in the diary.", objection: "Is it too strong for a closed room?" },
      ],
      competitors: [
        { name: "The designer house", archetype: "The name you know", strength: "Recognition and testers everywhere.", gap: "Reformulated and weaker every year.", counterMove: "Compare longevity honestly, in hours." },
        { name: "The dupe seller", archetype: "The clone", strength: "A tenth of the price.", gap: "Opens well, gone in an hour.", counterMove: "Show the wear test at hour six." },
        { name: "The traditional souq", archetype: "The heritage seller", strength: "Authority on oud.", gap: "No consistency between batches.", counterMove: "Batch numbers and a repeatable blend." },
        { name: "The bottle they own", archetype: "The status quo", strength: "Already paid for.", gap: "They are bored of it.", counterMove: "Position yours as the second, not the replacement." },
      ],
      objections: ["Will it last in this heat", "Is the oud real", "It might be too strong", "I cannot smell it before buying", "Is this a dupe"],
      proofPoints: ["Hour-by-hour longevity tests", "Full note breakdown", "Sample programme", "Repeat purchase rate"],
      benefits: ["a scent people remember you by", "longevity through a full day", "no wasted full bottles", "something nobody else is wearing"],
      visuals: ["product-cutout", "editorial-photo", "bold-type", "hero-statement", "quote-card", "data-tile"],
      videoIdeas: [
        "Six-hour wear test, timestamped",
        "The note pyramid explained in thirty seconds",
        "Real oud versus synthetic, side by side",
        "How to layer two of your scents",
        "Which bottle for which occasion",
      ],
      hashtags: {
        broad: ["perfume", "fragrance", "oud", "scent", "perfumelover", "attar"],
        niche: ["nicheperfume", "oudlovers", "fragrancecollection", "longlastingperfume", "bakhoor", "perfumereview"],
        community: ["fragcomm", "perfumecommunity", "scentoftheday"],
      },
      ctas: ["Order a sample before the full bottle.", "Link in bio for the full note list.", "Tell us your current signature and we will match it."],
      kpis: [
        { name: "Sample to bottle conversion", target: "25%+" },
        { name: "Saves per post", target: "Top 10% of reach" },
        { name: "Repeat purchase rate", target: "30%+" },
      ],
    }),

    realestate: from({
      label: "Real Estate & Property",
      emoji: "store",
      aka: ["real estate", "property", "realty", "apartments", "villas", "broker"],
      positioning: [
        "The agent who tells you what is wrong with the property.",
        "Every listing priced against what actually sold, not what was asked.",
        "Fewer listings, properly known.",
      ],
      differentiators: [
        "Sold comparables shared before you ask",
        "Every listing filmed in full, including the bad room",
        "Service charges and fees stated up front",
        "We tell you when to walk away",
      ],
      segments: [
        { name: "The first-time buyer", description: "Has the deposit, not the confidence.", trigger: "Rent went up again.", objection: "Am I about to make an expensive mistake?" },
        { name: "The investor", description: "Runs the numbers before the viewing.", trigger: "Cash sitting idle.", objection: "What is the real net yield?" },
        { name: "The upsizer", description: "Needs to sell before they can buy.", trigger: "A new baby or a new job.", objection: "Can I time both sides?" },
        { name: "The relocating buyer", description: "Buying or renting in an unfamiliar market.", trigger: "A contract signed abroad.", objection: "Which areas should I avoid?" },
      ],
      competitors: [
        { name: "The portal listing", archetype: "The aggregator", strength: "Everything in one place.", gap: "Stale listings and no judgement.", counterMove: "Publish what the portal will not — the downsides." },
        { name: "The volume agency", archetype: "The billboard brand", strength: "Presence everywhere.", gap: "You get whoever picks up.", counterMove: "One named person, start to finish." },
        { name: "The off-plan developer", archetype: "The direct seller", strength: "Payment plans and new build.", gap: "Handover slips and resale is soft.", counterMove: "Show handover track records." },
        { name: "Renting another year", archetype: "The status quo", strength: "Flexible and easy.", gap: "The deposit target moves faster than saving.", counterMove: "Rent versus buy, on real numbers." },
      ],
      objections: ["Am I overpaying", "Is the area actually good", "What are the hidden fees", "Will it be hard to resell", "Can I trust the agent"],
      proofPoints: ["Sold prices versus asking", "Days on market", "Client outcomes a year later", "Full-length walkthroughs"],
      benefits: ["a decision you can defend", "no surprises at handover", "a number you can verify", "an agent who says no"],
      visuals: ["editorial-photo", "data-tile", "split-compare", "hero-statement", "carousel-teach", "bold-type"],
      videoIdeas: [
        "Full walkthrough with nothing edited out",
        "What this budget buys in three different areas",
        "The five fees nobody mentions",
        "Rent versus buy on today's numbers",
        "Why I told a client not to buy this",
      ],
      hashtags: {
        broad: ["realestate", "property", "home", "investment", "apartment", "villa"],
        niche: ["propertyinvestment", "firsttimebuyer", "rentalyield", "offplan", "propertytour", "realestateinvesting"],
        community: ["dreamhome", "movingday", "propertyladder"],
      },
      ctas: ["Message for the full comparables sheet.", "Link in bio to book a viewing.", "Send your budget and we will tell you what is realistic."],
      kpis: [
        { name: "Qualified viewing requests", target: "10+ per month" },
        { name: "Video completion rate", target: "45%+" },
        { name: "DM to viewing conversion", target: "30%+" },
      ],
    }),

    automotive: from({
      label: "Automotive & Car Care",
      emoji: "bolt",
      aka: ["car", "automotive", "garage", "detailing", "tuning", "ppf", "tint"],
      positioning: [
        "The work you can inspect afterwards.",
        "Photographed under lights, not in a dark bay.",
        "Priced by the job, not by the badge on the car.",
      ],
      differentiators: [
        "Before and after under the same lighting",
        "Materials named by brand and grade",
        "Warranty terms in writing",
        "We show the paint depth readings",
      ],
      segments: [
        { name: "The new-car owner", description: "Just collected it and wants it protected.", trigger: "Delivery day.", objection: "Is this worth it or is it an upsell?" },
        { name: "The enthusiast", description: "Knows the products better than most shops.", trigger: "A weekend and a plan.", objection: "Do they actually know what they are doing?" },
        { name: "The reseller", description: "Preparing a car for sale.", trigger: "A listing about to go live.", objection: "Will this add more than it costs?" },
        { name: "The neglected-car owner", description: "Three years of no care, now embarrassed.", trigger: "A holiday or an inspection.", objection: "Is it too far gone?" },
      ],
      competitors: [
        { name: "The dealership package", archetype: "The convenient upsell", strength: "Bought at the same time as the car.", gap: "Subcontracted and generic.", counterMove: "Show what the dealer package actually is." },
        { name: "The cheap unit", archetype: "The corner garage", strength: "Half the price, same day.", gap: "Swirls, overspray, no warranty.", counterMove: "Photograph the difference at high zoom." },
        { name: "The DIY kit", archetype: "The weekend attempt", strength: "Cheap and satisfying.", gap: "One mistake is permanent.", counterMove: "Show a correction of a DIY job." },
        { name: "Doing nothing", archetype: "The status quo", strength: "Free.", gap: "Resale value quietly drops.", counterMove: "Put a number on the depreciation." },
      ],
      objections: ["Is it worth the price", "Will it damage the paint", "How long does it actually last", "Can I see previous work", "Do you guarantee it"],
      proofPoints: ["Before and after under identical lighting", "Paint depth measurements", "Written warranty", "Cars revisited a year later"],
      benefits: ["a car that looks newer than it is", "protection you can measure", "resale value held", "work you can inspect"],
      visuals: ["editorial-photo", "split-compare", "data-tile", "bold-type", "hero-statement", "product-cutout"],
      videoIdeas: [
        "One panel, half corrected, same light",
        "What swirl marks look like under a torch",
        "The full job in ninety seconds",
        "Why cheap tint turns purple",
        "A car we refused to work on and why",
      ],
      hashtags: {
        broad: ["cars", "detailing", "carcare", "automotive", "carsofinstagram", "paintprotection"],
        niche: ["paintcorrection", "ceramiccoating", "ppf", "cardetailing", "swirlremoval", "windowtint"],
        community: ["carcommunity", "detailersofinstagram", "carlovers"],
      },
      ctas: ["Send a photo of your paint for a quote.", "Link in bio to book a slot.", "Save this before your next detail."],
      kpis: [
        { name: "Booking enquiries", target: "20+ per month" },
        { name: "Video completion rate", target: "50%+" },
        { name: "Quote to booking", target: "35%+" },
      ],
    }),

    education: from({
      label: "Education & Training",
      emoji: "brain",
      aka: ["education", "course", "training", "tutoring", "academy", "school"],
      positioning: [
        "Taught by someone still doing the work.",
        "Outcomes published, including the ones that did not land.",
        "Short enough to finish, deep enough to matter.",
      ],
      differentiators: [
        "Completion rate published, not just enrolments",
        "The first module is free and unlocked",
        "Cohort sizes capped",
        "Curriculum updated on a stated schedule",
      ],
      segments: [
        { name: "The career switcher", description: "Leaving one field for another, on their own money.", trigger: "A redundancy or a ceiling hit.", objection: "Will this actually get me hired?" },
        { name: "The upskiller", description: "Employed, needs one specific capability.", trigger: "A project they cannot deliver.", objection: "Can I fit this around a job?" },
        { name: "The parent buying for a child", description: "Paying for someone else to get the outcome.", trigger: "Exams or a school report.", objection: "Will my child actually engage?" },
        { name: "The serial course buyer", description: "Bought four, finished none.", trigger: "A new year or a new intention.", objection: "Will I finish this one?" },
      ],
      competitors: [
        { name: "The free content", archetype: "Video and blogs", strength: "Free and abundant.", gap: "No order, no feedback, no finish line.", counterMove: "Sell the sequence and the accountability." },
        { name: "The mega platform", archetype: "The course marketplace", strength: "Cheap, huge catalogue.", gap: "Nobody finishes and nobody checks.", counterMove: "Publish completion rates." },
        { name: "The university course", archetype: "The credential", strength: "Recognised and structured.", gap: "Slow, expensive, often dated.", counterMove: "Compare time to competence." },
        { name: "Figuring it out alone", archetype: "The status quo", strength: "Free.", gap: "Takes years and teaches bad habits.", counterMove: "Cost the wasted time." },
      ],
      objections: ["Will I actually finish it", "Is this worth the price", "Do I have the time", "Will it get me a job", "Is the teacher credible"],
      proofPoints: ["Completion rates", "Where students ended up", "Free first module", "Work produced by students"],
      benefits: ["a skill you can demonstrate", "a finished thing in your portfolio", "structure instead of drift", "feedback from someone doing the work"],
      visuals: ["carousel-teach", "bold-type", "data-tile", "quote-card", "hero-statement", "split-compare"],
      videoIdeas: [
        "One lesson, taught properly, free",
        "A student's work on day one versus day thirty",
        "The mistake every beginner makes",
        "What the free tutorials leave out",
        "Walk through the full curriculum",
      ],
      hashtags: {
        broad: ["education", "learning", "course", "training", "skills", "study"],
        niche: ["onlinecourse", "careerchange", "upskilling", "studytips", "professionaldevelopment", "elearning"],
        community: ["learningcommunity", "studygram", "lifelonglearning"],
      },
      ctas: ["Link in bio for the free first module.", "Message us to check if this fits your level.", "Save this and start on Monday."],
      kpis: [
        { name: "Free module signups", target: "100+ per month" },
        { name: "Free to paid conversion", target: "8%+" },
        { name: "Saves per post", target: "Top 15% of reach" },
      ],
    }),

    media: from({
      label: "Media & Entertainment",
      emoji: "video",
      aka: ["media", "tv", "channel", "news", "entertainment", "production", "studio"],
      positioning: [
        "The channel that respects your time.",
        "Covered properly, not first.",
        "Made here, about here.",
      ],
      differentiators: [
        "Sources named, corrections published",
        "Cut for the platform, not reposted from broadcast",
        "Local stories nobody else is covering",
        "Full episodes free, no paywall on the news",
      ],
      segments: [
        { name: "The scroller", description: "Watches three seconds before deciding.", trigger: "A hook in the first frame.", objection: "Why should I care about this?" },
        { name: "The loyal viewer", description: "Follows the channel, not the story.", trigger: "A new episode.", objection: "Is this the same as last week?" },
        { name: "The topic follower", description: "Cares about one subject, not the brand.", trigger: "That subject in the news.", objection: "Do they know this subject properly?" },
        { name: "The advertiser", description: "Buying attention and watching your numbers.", trigger: "A campaign budget.", objection: "Is the audience real and engaged?" },
      ],
      competitors: [
        { name: "The national broadcaster", archetype: "The institution", strength: "Reach and budget.", gap: "Slow, formal, not built for a phone.", counterMove: "Be native to the feed." },
        { name: "The independent creator", archetype: "The one-person channel", strength: "Fast and personal.", gap: "No verification, no depth.", counterMove: "Show the reporting behind the clip." },
        { name: "The aggregator page", archetype: "The repost account", strength: "Volume and speed.", gap: "No original work.", counterMove: "Own the story nobody else has." },
        { name: "Scrolling past", archetype: "The status quo", strength: "Infinite alternatives.", gap: "Nothing sticks.", counterMove: "Earn the first three seconds." },
      ],
      objections: ["Is this accurate", "Is it worth my time", "Have I seen this already", "Is this an advert", "Why does this matter to me"],
      proofPoints: ["Named sources", "Published corrections", "Watch-through rates", "Stories broken first"],
      benefits: ["being properly informed in minutes", "context nobody else gives", "stories about your city", "something worth sending on"],
      visuals: ["bold-type", "hero-statement", "editorial-photo", "quote-card", "data-tile", "carousel-teach"],
      videoIdeas: [
        "The story in sixty seconds, no filler",
        "How we verified this",
        "What the headline left out",
        "Behind the scenes of a shoot",
        "The archive clip everyone forgot",
      ],
      hashtags: {
        broad: ["news", "media", "tv", "entertainment", "video", "documentary"],
        niche: ["localnews", "investigative", "shortdocumentary", "broadcast", "mediaproduction", "storytelling"],
        community: ["watchthis", "mustwatch", "trending"],
      },
      ctas: ["Full episode at the link in bio.", "Follow for the rest of this story.", "Send this to someone who should see it."],
      kpis: [
        { name: "Average watch time", target: "60%+" },
        { name: "Shares per post", target: "Top 10% of reach" },
        { name: "Follower growth", target: "5%+ monthly" },
      ],
    }),
  };
}
