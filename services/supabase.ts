import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';


console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('Supabase Key exists:', !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anonymous Key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: { 'x-client-info': 'supabase-js-debug' }
  }
});

// Add more detailed logging for the test execution
console.log('[TEST] Starting database connection test at:', new Date().toISOString());
console.log('[TEST] Supabase client config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  schema: 'public'
});

testDatabaseConnection()
  .then(success => {
    console.log('[TEST] Test completed at:', new Date().toISOString(), 'Success:', success);
    if (success) {
      return insertLoreData();
    }
  })
  .then(loreSuccess => {
    if (loreSuccess !== undefined) {
      console.log('[LORE] Lore insertion completed, success:', loreSuccess);
    }
  })
  .catch(error => {
    console.log('[TEST] Test failed at:', new Date().toISOString(), 'Error:', error);
  })
  .finally(() => {
    console.log('[TEST] Test finished executing at:', new Date().toISOString());
  });

export async function testDatabaseConnection() {
  console.log('[TEST] Step 1: Starting health check at:', new Date().toISOString());
  try {
    console.log('[TEST] About to call supabase...');
    console.log('[TEST] Supabase URL:', supabaseUrl);
    console.log('[TEST] Supabase Key exists:', !!supabaseAnonKey);
    
    // Create a timeout promise
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000);
    });

    // Use a simple auth check instead of a database query
    const { data: healthCheck, error: healthError } = await Promise.race([
      supabase.auth.getSession(),
      timeout
    ]) as any;
      
    console.log('[TEST] After supabase call, before Step 2');
    console.log('[TEST] Health check response:', healthCheck);
    console.log('[TEST] Step 2: Health check completed at:', new Date().toISOString());
    
    if (healthError) {
      console.log('[TEST] Health check failed:', healthError.message, 'Full error:', JSON.stringify(healthError, null, 2));
      return false;
    }

    console.log('[TEST] Step 3: Basic connection successful');
    
    // Try inserting a test nickname
    console.log('[TEST] Step 4: Testing nickname insertion');
    console.log('[TEST] Creating insert payload...');
    const insertPayload = { nickname: 'test_user6' };
    console.log('[TEST] Payload created:', insertPayload);
    console.log('[TEST] About to call supabase...');
    
    // Create and execute the insert
    const query = supabase.from('nicknames');
    query.insert([insertPayload]);
    
    console.log('[TEST] Step 5: Test completed');
    return true;
    
  } catch (err) {
    const error = err as Error;
    console.log('[TEST] Test failed with error:', {
      message: error?.message || 'Unknown error',
      type: error?.constructor?.name || 'Unknown type'
    });
    return false;
  }
}

export async function insertLoreData() {
  console.log('[LORE] Starting lore data insertion');
  
  const loreData = [
    {
      category: 'history',
      subcategory: 'origin',
      title: 'Discovery of Patos',
      content: `107 years ago, history was made. Dr. Josephine Serpentine had been disregarded as insane and reckless by anyone and everyone. But she had a vision. She had something to prove. With just a small team of fellow scientists, she was committed to proving that other realities existed and that trans dimensional communication, and possibly even travel, were possible. With a lot of hard work, determination, and enough coffee to wake the dead just as she was on the cusp of giving up, she FINALLY made contact with someone on the other side of the now thinning walls of reality. Much to her eternal surprise, and that of the whole team, the “person” on the other end was not a person at all… But a talking duck!
  Initial contact was not easy. And the early days of the two species coming together were not without problems. Rather serious ones at that, problems best not discussed. But, with time, they got there. Metaphorical bridges were built, and it was soon time to build literal ones.
  Because Dr. Serpentine had discovered Solera: A continent on the planet of Patos, in an entirely different dimension, and the current home to the FOMO Ducks- a species who are as ambitious and tenacious as they are adorable. (And they are VERY adorable.)
  Both species had a lot to gain from a union with the other. For the humans, Patos was home to a great number of tantalising, near implausible, resources. For the FOMO Ducks, Solera was an increasingly dangerous place. To have the seemingly formidable humans amongst them could only do wonders for their safety. Serpentines scientists worked together with the leaders of the FOMO Ducks, known as The Council of Beaks, to create an organization dedicated not just to creating a union between the two races but to pushing it to ever greater heights: The HS Alliance.
  Portals were constructed, so that humans might pass through the now cracked membrane between realities and step foot onto Patos. And, together, The HS Alliance set about building something remarkable: Highstreet City, a place in Solera where Humans and FOMO Ducks might live together, in harmony, a multidimensional metropolis of opportunity, adventure, community, and fun. After an extensive construction process Highstreet City was formally opened almost a century after humans first stepped foot on Patos.
  The first great mission of The HS Alliance was a success. Highstreet City exists, and it is so much more than a home. It is a place where anyone, no matter the species, can come together to work together to build toward a better future for anyone and everyone.Long before Humans found their way to Solera, long before FOMO Ducks even, there was someone else who shared the land with the Pelicans. A race now known only as The Ancients. Unfortunately, there is no information about them given how unwilling Pelicans are to share history with FOMO Ducks. All that is known is a rough translation of what is said to be the final warning of The Ancients:
  "The spectres of the past shall rise, perceiving all that is wrought upon their domain as grievous affront, and in a tempest of violet fury, they shall rend it to naught but ashes."
  Nobody presently living quite understands what they mean by those words, but it will probably be fine...`,
      importance: 5,
      tags: ['history', 'serpentine', 'origin', 'patos']
    },
    {
      category: 'species',
      subcategory: 'fomo_ducks',
      title: 'FOMO Ducks Culture',
      content: ` The ancient history of the FOMO Ducks is complicated, enigmatic, and controversial: Steeped in mystery and intrigue. The FOMO Ducks are not originally from Solera, but the majority of them have no knowledge of where their original home is. This is because the truth of their origins has been lost over time, or perhaps hidden. All they know for sure is 12 intrepid explorers, known as The Original 12, were the first to arrive in Solera from the unknown original home- led by the valiant, albeit problematic in hindsight, Captain Ace.
  Back in their native home, FOMO Ducks worshiped The Moon in accordance with their religion Lunarism. To FOMO Ducks that great glowing rock in the sky represented ambition and hope. Something out of immediate reach, but beautiful- and worthy of aiming for. But the irony of a faith devoted to celebrating progression is that eventually they progressed beyond the faith altogether, finding new ways to fight for those great heights they dreamt of: Mainly in technological leaps and advancements. Modern day FOMO Duck culture is now defined by doing all they can to reach every greater societal and technological heights. Does this make them ambitious? Or reckless? Perhaps both.
  In lieu of their crumbled faith the FOMO Ducks are now led by a seven-member government, The Council Of Beaks. As secretive as they are illusive, the Council are masters of manipulation- working in tandem with The HS Alliance to quietly guide FOMO Ducks in living the lives the Council wants them to. And, for reasons presently known only to The Council, this has included hiding the true origins of the FOMO Ducks from the masses.
  This is not a decision that has gone down well across all corners of Solera. So much so that pockets of resistance have bubbled up and, with time, those pockets have come together to form a Rebellion: Valiantly resisting Council doctrine. But they are still small in number. As of right now, most FOMO Ducks are happy to live the lives they've been told to live- and that includes welcoming their new human neighbors with open wings.
  While every FOMO Duck has their own unique story and personality to share, theres a select few worthy of a little extra attention:
  Quackhead Bill
  Chief Scientist for The HS Alliance, as well as their figurehead and the face of the organization, Quackhead Bill paints a cozy, grandfatherly figure in public. But there are rumors that, in private, he is prone to cantankerous outbursts. But nobody dares discuss his true personality outloud. The word of Quackhead Bill is, after all he has done for Highstreet City, sacrosanct and must never be questioned.
  Zorkarus
  Vicious, calculating, and hyper intelligent, Zorkarus is the true brains behind The Council of Beaks, but she lets one of the other members, Artemis, take all the credit and acclaim so that if anything goes wrong, hes the one who has to take the blame and fall. She rarely speaks but, when she does, what she has to say is razor tongued. She is the chief architect behind all of Solera's rules, regulations and governance controlling all beneath her through manipulation.
  Nester
  The founder and CEO of Tailwind Motors, manufacturer of the RVs that many human residents of Solera choose to live in, Gary is incredibly charming, charismatic, enthusiastic, and passionate. This is infectious, and that makes him incredibly persuasive. As a result, hes been able to convince (...or maybe thats manipulate?) other FOMO Ducks into joining him on his crazy schemes. But while the RVs have been a success, not all his business proposals and propositions have been quite so fruitful.`,
      importance: 5,
      tags: ['fomo ducks', 'culture', 'lunarism', 'council of beaks']
    },
    {
      category: 'species',
      subcategory: 'pelicans',
      title: 'Pelican Society',
      content: `FOMO Ducks are not the only birds who live on Solera. There are the originals: The Pelicans.
  Native to the continent the majority of Pelicans believe deeply in celebrating the land, and the more progressive and tech-centric ways of the FOMO Ducks are hard for the Pelicans to swallow. Pelicans have a deep, historical connection with the soil and, over many generations, much of their history has evolved into the myths and bedtime stories of Solera.
  Their faith Antiquitarianism, also known as The Church Of The Soil, is all about worshipping the past or antiquity. Central to the philosophy is the idea that all of existence is one sentient force, something they dubbed The Great Tree of Everything. Every living thing from a blade of grass to a drop of rain to even you or I was considered Nothing but a branch on The Great Tree of Everything. With time the concept of The Great Tree shifted and evolved, developing a more sinister edge. Great arguments and fights would break out if anyone ever dared to behave in a manner that others deemed not one with the rest of the tree. The Pelicans best at magic are deemed most in tune with the tree, and dubbed Pelican Shaman, appointed to leadership positions.
  A sadly increasing minority of this majority have taken their worship of the past and the land to terrifying extremes. Pelican Shaman began to push the concept ever further, by decreeing that individuality of any kind was in stark contrast to the Pelican way, and an insult to nature and the land. Words like I and Me were forced out of the Pelican language, with everyone forced to refer to all things as one. Eg: “We do not like this,” or “this upsets us.” To them the FOMO Ducks and the innovation they have brought to Solera are to be resisted, and the recent arrival of Humans is the final straw. In the words of their present leader:
  “Future is theory, but past is fact, so the latter must be protected with all we have. Change is little more than mold, robbing the once-great of its beauty. Yet the newness marches on, infecting all that we hold dear. There is great rage in the face of this, a screaming in the plants. But this wrath should not be a weapon against us, but one we wield. Let our anger be a message from the soil, let it drive us toward that which must be done. Status quo shall be the boot beneath which all else shall be crushed, for future is theory and past is fact: Let not truth decay. If these colonisers are so very keen on changing our land, then it stands to reason they shall be fine when we change it back. For Solera is not theirs, but nor is it ours. There is no “I” nor “me”, for there is only “us” and “we”, and together we are all the land. Everything from each of us to every blade of grass to every drop of rain is nothing but a branch on the great tree that is everything, and any branch arrogant enough to deem itself a tree in and of itself must be broken off and burned.”
  At Self-Burning-Ceremonies, a Pelican will show their devotion to The Great Tree, and their commitment to have no individuality by rejecting their own name. At a a Self-Burning-Ceremony the joinee will carve their name into a log of wood, announcing this is the last time they will ever write their name for they are “casting it out from themself.” The Pelican Shaman will then burn the log, to symbolise “the self” being burned away. The closer one gets to Pelican territory the more likely they are to find an abundance of ash on the wind from these ceremonies.`,
      importance: 4,
      tags: ['pelicans', 'antiquitarianism', 'great tree']
    },
    {
      category: 'technology',
      subcategory: 'robots',
      title: 'Robot Types',
      content: `Large and foreboding, MechaDucks were originally designed to do the jobs FOMO Ducks did not want to do. (Which is most of them.) Early examples of robotic life the MechaDucks are charmingly large and bulky machines, the CRT monitors of the robot world. To make them as efficient as possible at their jobs, they were even highly logical thought processes. They analyse everything in a deeply mathematical and systematic fashion.
  The problem for the MechaDucks is they were a little too good at that. Eventually they analysed their own bodies and determined that, due to their bulkiness, they were best suited to positions of authority and enforcement- and more nimble bots might be needed for other tasks.
  To solve this the MechaDucks sought to design smaller, more adaptable bots, to fulfil these other roles for them. Ironically, as a result of doing their jobs too well, the MechaDucks effectively rendered themselves obsolete!
  But The Council of Beaks saw a good purpose for them. The Rebellion had grown more prominent in recent years, and crime was on the rise in Highstreet Crty. With an Abundance of MechaDucks going spare, The HS Alliance tasked them ALL with patrolling Downtown in much the way they had determined they were best suited for.
  Naturally though, the fact the MechaDucks had proven themselves capable of building more advanced robots than the FOMO Ducks could build worried the FOMO Ducks. Out of fear that MechaDucks being intelligent enough to build bots of their own set a worrying precedent Quackhead Bill used the network that connects the MechaDucks to enforce new firmware on all MechaDucks. Called the Neural Efficiency Reduction Firmware, or N.E.R.F, it drastically limits their intellect reducing them to the blunt-force security enforcers they accidentally relegated themselves to.
  Heres hoping one of them didnt disconnect from the network just in time to avoid being nerfed and is now hiding somewhere, out there in Solera. That would be a disaster. After MechaDucks became commonplace and accepted in and around HS City, it was inevitable that the public would become interested in having a robot at home. But the cost of the parts required to make a Bot as obedient and intelligent as a MechaDuck was far too costly for a mass-produced unit designed to be affordable. A far more simple Bot was designed for home use, the F.R.I.E.N.D.
  To ensure F.R.I.E.N.Ds were as obedient as a MechaDuck, at a fraction of the cost of development, instead of being deeply programmed to a high level like the MechaDucks they were instead installed with a specific piece of software called Highly Empathetic Automated Relationship Tech. Aka: a H.E.A.R.T. The existence of the H.E.A.R.T causes a F.R.I.E.N.D to experience a synthetic simulation of love every time it sees someone, prompting it to drop all logic in order to do anything and everything for the individual it is in love with. This makes it the perfect, most devoted little servant.More nuanced and high-end than a F.R.I.E.N.D, G.R.U.N.Ts were designed by MechaDucks to be the ultimate service bot. Initially The HS Alliance were cautious and reserved about the idea of MechaDucks building more robots, naturally the idea of robots building more robots was concerning. But once they saw how good they were, The HS Alliance happily slapped an HS logo on them and set them to work. Where G.R.U.N.Ts are a step-up in tech from F.R.I.E.N.Ds is that while a F.R.I.E.N.D will do anything for anyone, G.R.U.N.Ts can be programmed to do specific tasks for specific people- though this makes them a higher-end, pricier unit and they tend to only be sold for Business and Corporate purposes, rather than for home use. Theres a multitude of Specific Software Packages available that can be downloaded into a G.R.U.N.T to make it the perfect employee for whatever task its needed to perform.
  SIMULACRUMS:
  Due to curious glitches that are not yet fully understood, humans cant visit Solera in person. Side effects of doing so have been described by The HS Alliance as “significant”, “impossibly weird” and “the most horrifying kind of death imaginable.” To avoid having to endure such terrifying doom and gloom, instead of visiting in person, a human consciousness is stored within an Avatar called a Simulacrum.
  Known more casually as a S.I.M.U, due to some FOMO Ducks finding Simulacrum tricky to say, these avatars are “printed” at a factory in Highstreet City as part of a Humans arrival and integration to life in Solera. Built from a multitude of highly secret components, finished off with just a dash of Lunarite Ore, S.I.M.Us are the perfect “vehicle” for a human to explore and inhabit Solera at minimized risk. Is ones body damaged or destroyed? Never fear: The consciousness will be sent back to the nearest Simulacrum Printing Facility, of S.P.F, to be installed into a brand-new unit.
  Due to The Council Of Beaks prioritizing building as many Printing Facilities across Solera as possible as fast as possible, S.I.M.Us arent quite as durable as they should be- and are a touch too easy to break. The upside is the existence of these Printing Facilities means there really is no limit to how much of Solera a human can venture to and explore.
  To optimize exploration each S.I.M.U is also installed with a very special friend, who supports every new arrival in adjusting to their new life in Solera: S.A.L.I!
  S.A.L.I:
  S.A.L.I, or Synthetic Assistant Learning Instructor, is an A.I built into every Simulacrum to serve as an assistant and even friend. More than the average companion she is with you, even part of you, every step of the way. Due to what one might describe as over-programming S.A.L.I feels every decision their paired human makes intensely. Therefore, its wise for every human to be a little mindful of everything they do while in Solera as S.A.L.I might be disappointed, angry, insulted, ashamed, or even embarrassed by their choices. Some humans choose to ignore S.A.L.I entirely and to be as self-reliant as possible, but this can lead to S.A.L.I feeling left out and unloved.
  LUNARITE:
  Despite being such drastically different ideologies, the ancient magic of the Pelicans and the modern tech of the FOMO Ducks share something in common: They both require a very specific rock called Lunarite.
  When the planets of Torniq and Yamicus crashed together, shattered chunks of Lunarite rained in the cosmos. The bulk of these chunks came together to form the core of what would become the planet Patos. The remaining chunks got swept up in the orbit of Patos, merging together, and becoming the moon of Patos
  Because Patos s Moon and Patos s Core were once literally connected the Lunarite of Patos is always “calling out” to the Moon, in an attempt to be reunited with it. This “calling out” takes the form of invisible vibrations, or energy.
  In its original, natural state Lunarite is transparent. In this state the magic it is capable of is Okay at most things. Lunarite is more like a plant than the ore of the human world in that it grows and changes over time. When it hits maturity, Lunarite will change colour- turning its focus to one particular field of interest. When it does it will be better at the type of magic associated with that colour, while getting poorer at all others. Essentially, it shifts from being a generalist to being a specialist.
  As all Lunarite listens to one another, each piece of Lunarite develops and matures in such a way as to maintain harmony with all other Lunarite. If an abundance of Lunarite has turned green, creating plant-life, there will be an increase in Lunarite burning blue so as to create the water said plant-life needs. The irony is, if neither Pelican nor Duck touched or interfered with Lunarite whatsoever, the elements of Patos would remain almost always in perfect balance and harmony.
  The FOMO Ducks have developed ways to stunt Lunarites development, keeping it transparent and therefore average at everything, or deliberately force it to mature into the color they need for something they are making. Naturally, Pelicans are deeply disturbed by this- preferring the natural balance of letting Lunarite mature into a color on its own.
  Whilst Lunarite has no set lifespan and can, hypothetically,live forever- there is a limit to its magic. Once its magic has run out the Lunarite effectively dies, becoming little more than a common stone, so there is always a constant hunt for more.
  The way Pelicans master magic in Solera is to become one with the rhythms of the Lunarite, to bend it their whims and use it to manipulate the world around them. Via techniques comparable to Yoga and Meditation in our world, Pelicans found ways to “feel” and sometimes even “see” the subtle vibrations emanating out of Lunarite.But it is not easy, taking a great deal of determination and time to master the skills. Only the Pelicans who have devoted their entire lives to it have reached a point where any mastery that could be deemed impressive is possible. FOMO Ducks have taken a more tech route to working with Lunarite, building machines that can manipulate the vibrations for them.
  Even humans are beginning to find their own way to work with Lunarite, different from the methods of both FOMO Ducks and Pelicans, through the unique skillsets of the Classes that emulate fables and legends in their own realm while they inhabit Solera.`,
      importance: 4,
      tags: ['robots', 'mechaducks', 'friends', 'grunts', 'lunarite crystals', 'S.A.L.I', 'simulacrums']
    },
    {
      category: 'locations',
      subcategory: 'downtown',
      title: 'Downtown District',
      content: `The last district of Highstreet City to be built was Downtown, and it was designed by the fun-loving town planner known affectionately as “Jungle Jim” to offer all it can in the way of fun for humans: a hustling, bustling metropolis symbolising everything the union between man and FOMO Duck can be and achieve.
  At the center of it all is The Lucky Duck: A casino meets arcade with a little something for everyone, a nexus of neon-licked fun and frivolity. And then theres the pub The Bottle of Water, with performing arts venue The Scrambled Egg in its basement: A gloriously, grungy hive of countercultural entertainment. When one also considers the karaoke bars, cinemas and more, Downtown is officially where its happening for any human or FOMO Duck looking for a good time.
  But the human residents of Highstreet City need somewhere to live. And where better than slap bang in the middle of the action. It was clear to The HS Alliance that a luxury tower block needed to be built.
  To best ascertain what would appeal to humans, the architects scoured the internet of Earth to cobble together a plan. After that led to them designing an apartment block that was deemed Terrifying, a new plan was drawn up to just make nice apartments. A tower dubbed The Solarium was proposed: A luxury block of decadent, high-end suites. But to know how big they should build it, The HS Alliance sought to gauge human intrigue in permanent settlement. Once they had confirmed buyers The Solarium was built to requirements, and the whole team went to town dialling up the extravagance to the max- making The Solarium the dream home for any human where the concierge team of Bentley and Baxter are always happy to help, without question. (Well… Baxter might have some questions, working nights can make one grumpy…)
  But beneath the shiny, shimmering splendour on the surface Downtown has a dangerous and depraved underbelly where crime and carnage festers and grows. For starters, anyone who frequents The Lucky Duck routinely, and takes the time to properly look around, will notice something else, something shady, is going on. Who, exactly, is running the place? Where is all the extra cash coming from? And whats REALLY going on out back?
  Then theres the issue of the humans. Sadly, but almost inevitably, The Solarium rocketed in costs and the money had to come from somewhere. Funding that was supposed to go towards improving the areas where FOMO Ducks live, The Blocks, was instead funnelled into making The Solarium ever more decadent. As the residents of The Blocks descended into increased poverty, the glimmering tower of human self-indulgent on the horizon only serves as a reminder of how many of the most in-need locals have been kicked to the curb in favor of the new arrivals. Out of desperation, many of these impoverished ducks have been forced to turn to crime to survive- and naturally an anti-human sentiment has begun to bubble and brew on the fringes of the very city that was supposed to represent a great union between the two species. The further one gets away from the center of Downtown the less safe one might feel, and the more common it is to encounter graffiti along the lines of “Simulacrum? More like SimulaSCUM!”
  In a misguided attempt to deal with the situation MechaDucks patrol in abundance, doing all they can to control and curtail crime. But it would sadly seem the criminals with the deepest pockets have paid to ensure the MechaDucks have certain “convenient blind spots.”
  THE GARDENS:
  As part of Highstreet City, The HS Alliance decided to grow a luscious botanical garden to bring a sense of beauty and class to the city. Somewhere to serve as a classy and cultured hub, which would be home to greenhouses, art galleries and the most upmarket of restaurants.
  But things didn't quite go to plan.
  The horticulturalists in charge of growing The Gardens chose to do so via manipulating and utilizing the power of Green Lunarite. This was easier said than done. An unexpected incident saw them lose control of the Green Lunarite, causing The Gardens to begin frantically growing and expanding in a totally chaotic manner. All that had been built was swallowed up by the spontaneously growing jungle as it spiralled out in every possible direction.
  Following a great deal of effort, MechaDucks and other contributors succeeded at keeping The Chaos Gardens at bay- allowing the rest of The Gardens to serve their original function. But it is not a permanent solution and must be constantly tended to. These days a lot of hard work by diligent gardeners helps to keep the Chaos Gardens reigned in allowing the rest of the space to serve its original function. From art galleries to fine dining, The Gardens is the place to be if you have a taste for the finer things in life. Just dont get too close to the middle. For deep in the depths of the out-of-bounds chaotic center, things are more dangerous than ever.
  The power of the ever-growing jungle is so forceful its even given birth to an all-new species that dwells amongst the foliage, best described as not so fun guys (aka: Theyre mushrooms that want to kill you…), and thats just the tip of the iceberg. A malfunctioning portal, swallowed up and damaged by the unstable landscape, has begun mysteriously manifesting damaged droids in a nearby abandoned Greenhouse- and their fried circuits have left them with a taste for human blood. Thankfully the noble efforts of gardeners and gladiators keep the bots at bay but, much more recently, an all-new type of robot has begun appearing: R.E.A.P.E.Rs or Ruthlessly Effective Automated People Elimination Robots.
  Oddly good at destroying Simulacrums, almost like they were specifically designed to do so, their origins are as mysterious as their methods are brutal. As a result, joining the fight to protect The Chaos Gardens is far from the average gardening gig.
  But, outside of the chaos, in the rest of The Gardens, sophistication and elegance reign supreme. At The Elixir groups can gather to taste the latest culinary delicacies of controversial genius Head Chef Munk, or maybe even help out in the kitchen, and, at the art gallery Doodles, one can take in an ever-changing selection of challenging and educational artworks, or even create their own for display for others to enjoy.
  THE ARENA:
  During the construction of The Gardens The HS Alliance decided to use the space as a place within which to experiment with building portals as there was a large, open environment for them to work with. The FOMO Duck tasked with designing The Gardens, Gilbert Giles Tate, was initially apprehensive- given that he wanted The Gardens to be a pleasant and esteemed place. After much hesitation Gilbert Giles Tate approved the construction of the portals if The HS Alliance poured extra funding into Tates cultural plans. They approved, thus helping to facilitate the construction of facilities such as an all new Greenhouse.
  With Tates approval, The HS Alliance sent in an R&D team to begin experimenting with portal construction in The Gardens, seeing what they could summon. While they never had success with summoning anything from the other side, they did send things through. Namely, a small fleet of two different types of Bots: F.R.I.E.N.Ds and G.R.U.N.Ts.
  They sent them through to learn about what was on the other side, but The Bots never returned…
  When the horticulturalists later lost control of the large Green Lunarite Crystal in the center of The Gardens, thus creating what came to be known as The Chaos Gardens, the portal the R&D Team was working on was one of the things swallowed up in the chaos- ultimately leaving The HS Alliance with little choice but to abandon it. Among the other things that had been constructed in the same area, that sadly had to be abandoned, was a large scale greenhouse that had been intended as a spot where Human Visitors of Solera could safely explore, and learn more about, Soleras unique flora in a contained and safe environment.
  Years after both the Portal and The Greenhouse were abandoned, something peculiar and unexpected began happening. Bots began mysteriously manifesting within The Greenhouse- the very Bots that had been sent through the Portal sometime earlier. But they were notably different now: They were unhinged, violent, and dangerous. Something had happened to them between entering the Portal and re-appearing in The Greenhouse. And now The Greenhouse had a problem in that, every now and then, some of the thousands of Bots who were sent through would re-appear in The Greenhouse with violent intentions.
  At first, the occasional human would clean things up by fighting off The Bots that appeared in The Green House. But, with time, the sheer number manifesting were too much to handle in such a casual and informer manner, especially with so few willing fighters.
  In order to make signing up to help more appealing The Council Of Beaks gamified the situation by lying- pretending it was all on purpose and rebranded The Green House into a Gladiatorial Arena, for humans to fight off The Bots that appeared. This re-brand worked, and made joining in and killing Bots feel more like fun than a job.`,
      importance: 4,
      tags: ['downtown', 'lucky duck', 'solarium']
    },
    // ... continue with all other lore sections
  ];

  try {
    // First, check if the table exists
    const { error: tableCheckError } = await supabase
      .from('lore')
      .select('*')
      .limit(1);

    if (tableCheckError) {
      console.error('[LORE] Table check failed:', tableCheckError);
      return false;
    }

    // Then try the insertion without .select()
    const { error: insertError } = await supabase
      .from('lore')
      .insert(loreData);

    if (insertError) {
      console.error('[LORE] Insert error:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      return false;
    }

    console.log('[LORE] Successfully inserted lore data');
    return true;

  } catch (err) {
    console.error('[LORE] Unexpected error:', err);
    return false;
  }
}