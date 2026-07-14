export interface Website {
  id: string;
  name: string;
  developer: string;
  description: string;
  longDescription: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  imageUrl: string;
  screenshots: string[];
  url: string;
  size: string;
  version: string;
  updatedAt: string;
  pricing: "Free" | "Paid" | "Freemium";
}

const RAW_SITES = [
  // AI
  { name: "Krea AI", url: "https://krea.ai", cat: ["AI"], desc: "Real-time AI image generation and enhancement." },
  { name: "Napkin AI", url: "https://napkin.ai", cat: ["AI"], desc: "Transform ideas into visual diagrams instantly." },
  { name: "OpenRouter", url: "https://openrouter.ai", cat: ["AI"], desc: "Unified interface for all major LLMs." },
  { name: "Jan", url: "https://jan.ai", cat: ["AI"], desc: "Open-source local AI assistant." },
  { name: "LM Studio", url: "https://lmstudio.ai", cat: ["AI"], desc: "Run local LLMs on your own machine." },
  { name: "FlowGPT", url: "https://flowgpt.com", cat: ["AI"], desc: "Largest library of curated AI prompts." },
  { name: "Hugging Face Spaces", url: "https://huggingface.co/spaces", cat: ["AI"], desc: "Discover thousands of AI community apps." },
  { name: "Mage Space", url: "https://mage.space", cat: ["AI"], desc: "Professional stable diffusion generation." },
  { name: "Playground AI", url: "https://playgroundai.com", cat: ["AI"], desc: "Easy to use AI art creator." },
  { name: "Ideogram", url: "https://ideogram.ai", cat: ["AI"], desc: "AI focused on typography and design." },
  { name: "Pinokio", url: "https://pinokio.computer", cat: ["AI"], desc: "Install and run AI apps locally with one click." },
  { name: "ComfyUI", url: "https://github.com/comfyanonymous/ComfyUI", cat: ["AI"], desc: "Powerful modular Stable Diffusion GUI." },
  { name: "LibreChat", url: "https://www.librechat.ai", cat: ["AI"], desc: "Enhanced open-source AI chat interface." },
  { name: "AnythingLLM", url: "https://useanything.com", cat: ["AI"], desc: "Private desktop AI for your documents." },
  
  // Gaming
  { name: "Game Jolt", url: "https://gamejolt.com", cat: ["Gaming"], desc: "Social platform for gamers and creators." },
  { name: "ModDB", url: "https://moddb.com", cat: ["Gaming"], desc: "The definitive library for game mods." },
  { name: "My Abandonware", url: "https://myabandonware.com", cat: ["Gaming"], desc: "Old games for free download." },
  { name: "RAWG", url: "https://rawg.io", cat: ["Gaming"], desc: "Largest video game database and discovery." },
  { name: "Nexus Mods", url: "https://nexusmods.com", cat: ["Gaming"], desc: "Premier community for game modifications." },
  { name: "GameBanana", url: "https://gamebanana.com", cat: ["Gaming"], desc: "The game modding community site." },
  { name: "Playhop", url: "https://playhop.com", cat: ["Gaming"], desc: "Play free browser games instantly." },
  { name: "RetroAchievements", url: "https://retroachievements.org", cat: ["Gaming"], desc: "Add achievements to classic games." },

  // Coding
  { name: "CodeSandbox", url: "https://codesandbox.io", cat: ["Coding"], desc: "Instant cloud development environment." },
  { name: "Glitch", url: "https://glitch.com", cat: ["Coding"], desc: "Build and deploy web apps together." },
  { name: "DevDocs", url: "https://devdocs.io", cat: ["Coding"], desc: "Fast, offline search for all documentation." },
  { name: "Hoppscotch", url: "https://hoppscotch.io", cat: ["Coding"], desc: "Open-source API development tool." },
  { name: "Roadmap.sh", url: "https://roadmap.sh", cat: ["Coding"], desc: "Visual guides for developer paths." },
  { name: "Public APIs", url: "https://publicapis.io", cat: ["Coding"], desc: "A collective list of free APIs." },
  { name: "DevHints", url: "https://devhints.io", cat: ["Coding"], desc: "A ridiculous collection of cheat sheets." },

  // Space
  { name: "Eyes on the Solar System", url: "https://eyes.nasa.gov", cat: ["Space"], desc: "NASA's 3D explorer for planets and spacecraft." },
  { name: "Heavens Above", url: "https://heavens-above.com", cat: ["Space"], desc: "Track satellites and ISS passes in real-time." },
  { name: "Satellite Map", url: "https://platform.leolabs.space/visualizations/leo", cat: ["Space"], desc: "Interactive visualization of objects in low Earth orbit." },
  { name: "APOD", url: "https://apod.nasa.gov", cat: ["Space"], desc: "Astronomy Picture of the Day." },
  { name: "Stellarium Web", url: "https://stellarium-web.org", cat: ["Space"], desc: "A planetarium in your browser." },
  { name: "N2YO", url: "https://www.n2yo.com", cat: ["Space"], desc: "Live satellite tracking and predictions." },

  // Earth & Weather & Nature
  { name: "Earth Nullschool", url: "https://earth.nullschool.net", cat: ["Earth & Weather"], desc: "Global map of wind, weather, and ocean conditions." },
  { name: "Ventusky", url: "https://ventusky.com", cat: ["Earth & Weather"], desc: "Live weather forecast and meteorological data maps." },
  { name: "Zoom Earth", url: "https://zoom.earth", cat: ["Earth & Weather"], desc: "Real-time satellite images and storm tracker." },
  { name: "Windy", url: "https://windy.com", cat: ["Earth & Weather"], desc: "Professional weather visualization for everyone." },
  { name: "PlantNet", url: "https://identify.plantnet.org", cat: ["Nature"], desc: "Identify plants with a simple photo." },
  { name: "iNaturalist", url: "https://www.inaturalist.org", cat: ["Nature"], desc: "A community for naturalists." },

  // Fun & Interesting
  { name: "Neal.fun", url: "https://neal.fun", cat: ["Fun", "Interesting"], desc: "Addictive and quirky web experiments." },
  { name: "WindowSwap", url: "https://window-swap.com", cat: ["Fun", "Interesting"], desc: "Gaze out of someone else's window globally." },
  { name: "Radio Garden", url: "https://radio.garden", cat: ["Fun", "Music"], desc: "Explore live radio by rotating the globe." },
  { name: "Pointer Pointer", url: "https://pointerpointer.com", cat: ["Fun"], desc: "A website that finds where your cursor is pointing." },
  { name: "ZoomQuilt", url: "https://zoomquilt.org", cat: ["Fun"], desc: "Infinite zoom artwork experience." },

  // Browser Extensions
  { name: "ChromeStats", url: "https://chromestats.org", cat: ["Browser Extensions"], desc: "Detailed statistics and insights for Chrome extensions." },
  { name: "Extpose", url: "https://extpose.com", cat: ["Browser Extensions"], desc: "Chrome extension discovery and SEO tools." },
  { name: "AlternativeTo Extensions", url: "https://alternativeto.net/platform/browser-extension/", cat: ["Browser Extensions"], desc: "Crowdsourced alternatives for browser tools." },
  { name: "CRX Extractor", url: "https://crxextractor.com", cat: ["Browser Extensions"], desc: "Download and extract CRX files from the web store." },
  { name: "Extension Manager", url: "https://github.com/flyhaozi/extension-manager", cat: ["Browser Extensions"], desc: "Manage your extensions with one click." },

  // Podcasts
  { name: "Podchaser", url: "https://podchaser.com", cat: ["Podcasts"], desc: "The IMDb of podcasts for discovery and ratings." },
  { name: "Listen Notes", url: "https://listennotes.com", cat: ["Podcasts"], desc: "The best podcast search engine." },
  { name: "Podcast Index", url: "https://podcastindex.org", cat: ["Podcasts"], desc: "Preserving the open ecosystem of podcasting." },
  { name: "Player FM", url: "https://player.fm", cat: ["Podcasts"], desc: "A podcast player that works across all devices." },
  { name: "Fountain", url: "https://fountain.fm", cat: ["Podcasts"], desc: "The social podcast app that pays you to listen." },

  // Domain Names
  { name: "Lean Domain Search", url: "https://leandomainsearch.com", cat: ["Domain Names"], desc: "Generate domain name ideas in seconds." },
  { name: "Instant Domain Search", url: "https://instantdomainsearch.com", cat: ["Domain Names"], desc: "Check domain availability as you type." },
  { name: "Namecheckr", url: "https://namecheckr.com", cat: ["Domain Names"], desc: "Check brand availability across all social networks." },
  { name: "NameMesh", url: "https://namemesh.com", cat: ["Domain Names"], desc: "Intelligent domain name generator for startups." },
  { name: "Domainr", url: "https://domainr.com", cat: ["Domain Names"], desc: "The best domain search API and engine." },

  // Infographics
  { name: "Visual Capitalist", url: "https://visualcapitalist.com", cat: ["Infographics"], desc: "Making the world's information more visual." },
  { name: "Information is Beautiful", url: "https://informationisbeautiful.net", cat: ["Infographics"], desc: "Distilling the world's data into gorgeous visualizations." },
  { name: "Statista Charts", url: "https://statista.com/chartoftheday", cat: ["Infographics"], desc: "Daily infographics about business and tech." },
  { name: "Datawrapper Gallery", url: "https://datawrapper.de/gallery", cat: ["Infographics"], desc: "Showcase of beautiful interactive charts and maps." },
  { name: "FlowingData", url: "https://flowingdata.com", cat: ["Infographics"], desc: "Exploring how experts use data visualization." },

  // DNA & Genetics
  { name: "OpenSNP", url: "https://opensnp.org", cat: ["DNA & Genetics"], desc: "Share your genetic data and help scientists." },
  { name: "SNPedia", url: "https://snpedia.com", cat: ["DNA & Genetics"], desc: "The wiki for personal genomics." },
  { name: "GEDmatch", url: "https://gedmatch.com", cat: ["DNA & Genetics"], desc: "Tools for DNA and genealogy research." },
  { name: "DNA Painter", url: "https://dnapainter.com", cat: ["DNA & Genetics"], desc: "Visualize your chromosome mapping." },
  { name: "Ensembl", url: "https://ensembl.org", cat: ["DNA & Genetics"], desc: "Genomic browser for vertebrate species." },

  // Telescopes
  { name: "AstroHopper", url: "https://party-lis.github.io/astrohopper", cat: ["Telescopes"], desc: "A web app to help you find objects with your telescope." },
  { name: "Telescopius", url: "https://telescopius.com", cat: ["Telescopes"], desc: "Astronomy planning tool for visual and imaging." },
  { name: "Clear Outside", url: "https://clearoutside.com", cat: ["Telescopes"], desc: "Reliable weather forecasting for astronomers." },
  { name: "Astronomy Tools", url: "https://astronomy.tools", cat: ["Telescopes"], desc: "Field of view calculators and imaging tools." },
  { name: "CCD Calculator", url: "https://newtonline.com/ccdcalc", cat: ["Telescopes"], desc: "Calculate field of view for your camera and scope." },

  // Rocketry
  { name: "Everyday Astronaut", url: "https://everydayastronaut.com", cat: ["Rocketry"], desc: "Bringing space down to earth for everyone." },
  { name: "Next Spaceflight", url: "https://nextspaceflight.com", cat: ["Rocketry"], desc: "Detailed rocket launch schedule and database." },
  { name: "RocketLaunch.Live", url: "https://rocketlaunch.live", cat: ["Rocketry"], desc: "Live coverage and schedules of global launches." },
  { name: "Space Launch Schedule", url: "https://spacelaunchschedule.com", cat: ["Rocketry"], desc: "The best calendar for upcoming space missions." },
  { name: "NSF Live", url: "https://nasaspaceflight.com", cat: ["Rocketry"], desc: "Professional news and coverage of space flight." },

  // Architecture
  { name: "ArchDaily", url: "https://archdaily.com", cat: ["Architecture"], desc: "The world's most visited architecture website." },
  { name: "Dezeen", url: "https://dezeen.com", cat: ["Architecture"], desc: "The most influential architecture and design magazine." },
  { name: "Designboom", url: "https://designboom.com", cat: ["Architecture"], desc: "First digital magazine for design and art." },
  { name: "Architizer", url: "https://architizer.com", cat: ["Architecture"], desc: "The world's largest platform for architecture." },
  { name: "Divisare", url: "https://divisare.com", cat: ["Architecture"], desc: "Curated collection of contemporary architecture." },

  // Cars
  { name: "CarThrottle", url: "https://carthrottle.com", cat: ["Cars"], desc: "The social network for car enthusiasts." },
  { name: "AutoTempest", url: "https://autotempest.com", cat: ["Cars"], desc: "Search all used car sites at once." },
  { name: "Carsized", url: "https://carsized.com", cat: ["Cars"], desc: "Visual car size comparison tool." },
  { name: "Automobile Catalog", url: "https://automobile-catalog.com", cat: ["Cars"], desc: "Complete specs and performance data for every car." },
  { name: "Fuelly", url: "https://fuelly.com", cat: ["Cars"], desc: "Track your car's fuel economy and gas mileage." },

  // Motorcycles
  { name: "BikeExif", url: "https://bikeexif.com", cat: ["Motorcycles"], desc: "The leading site for custom motorcycles and cafe racers." },
  { name: "Motorcycle Specs", url: "https://motorcyclespecs.co.za", cat: ["Motorcycles"], desc: "Massive database of motorcycle specifications." },
  { name: "BikeBound", url: "https://bikebound.com", cat: ["Motorcycles"], desc: "Showcasing the world's best custom builds." },
  { name: "Visordown", url: "https://visordown.com", cat: ["Motorcycles"], desc: "Motorcycle news, reviews, and features." },
  { name: "RideApart", url: "https://rideapart.com", cat: ["Motorcycles"], desc: "Motorcycle reviews and enthusiast news." },

  // Cycling
  { name: "Komoot", url: "https://komoot.com", cat: ["Cycling"], desc: "Plan your cycling and hiking adventures." },
  { name: "Ride with GPS", url: "https://ridewithgps.com", cat: ["Cycling"], desc: "The best bike route planner and navigation." },
  { name: "Bikepacking", url: "https://bikepacking.com", cat: ["Cycling"], desc: "The definitive guide to bicycle travel." },
  { name: "Strava Routes", url: "https://strava.com/routes", cat: ["Cycling"], desc: "Discover new routes created by the community." },
  { name: "Cycle.Travel", url: "https://cycle.travel", cat: ["Cycling"], desc: "The bike route planner for long-distance travel." },

  // Fishing
  { name: "Fishbrain", url: "https://fishbrain.com", cat: ["Fishing"], desc: "The world's most popular social network for anglers." },
  { name: "Navionics", url: "https://navionics.com", cat: ["Fishing"], desc: "Detailed nautical charts for fishing and boating." },
  { name: "Tides4Fishing", url: "https://tides4fishing.com", cat: ["Fishing"], desc: "Tide tables and solunar charts for every coast." },
  { name: "Fishidy", url: "https://fishidy.com", cat: ["Fishing"], desc: "Cloud-based fishing maps and waterway data." },
  { name: "Anglr", url: "https://anglr.com", cat: ["Fishing"], desc: "The free fishing log and trip planner." },

  // Hiking
  { name: "AllTrails", url: "https://alltrails.com", cat: ["Hiking"], desc: "Discover the best hiking trails in the world." },
  { name: "Hiking Project", url: "https://hikingproject.com", cat: ["Hiking"], desc: "Crowdsourced maps of the best hiking trails." },
  { name: "Peakbagger", url: "https://peakbagger.com", cat: ["Hiking"], desc: "Information on peaks and mountain ranges." },
  { name: "SummitPost", url: "https://summitpost.org", cat: ["Hiking"], desc: "The most comprehensive resource for mountaineers." },
  { name: "Gaia GPS", url: "https://gaiagps.com", cat: ["Hiking"], desc: "Topographic maps for back-country navigation." },

  // Volcanoes
  { name: "Volcano Discovery", url: "https://volcanodiscovery.com", cat: ["Volcanoes"], desc: "Real-time volcano and earthquake news." },
  { name: "Smithsonian Volcanoes", url: "https://volcano.si.edu", cat: ["Volcanoes"], desc: "Global Volcanism Program data and reports." },
  { name: "Volcano Cafe", url: "https://volcanocafe.org", cat: ["Volcanoes"], desc: "Engaging discussions about geology and volcanoes." },
  { name: "Global Volcanism Program", url: "https://volcano.si.edu/gvp", cat: ["Volcanoes"], desc: "The Smithsonian's primary volcanic database." },
  { name: "Volcano Live", url: "https://volcanolive.com", cat: ["Volcanoes"], desc: "Breaking news and detailed info on active volcanoes." },

  // Oceans
  { name: "Ocean InfoHub", url: "https://oceaninfohub.org", cat: ["Oceans"], desc: "Global hub for ocean data and resources." },
  { name: "NOAA Ocean Explorer", url: "https://oceanexplorer.noaa.gov", cat: ["Oceans"], desc: "Exploring the unknown deep ocean." },
  { name: "Windy Waves", url: "https://windy.com/waves", cat: ["Oceans"], desc: "Real-time wave and swell visualizations." },
  { name: "Sea Temperature", url: "https://seatemperature.org", cat: ["Oceans"], desc: "Live water temperature for every beach." },

  // Birds
  { name: "Merlin Bird ID", url: "https://merlin.allaboutbirds.org", cat: ["Birds"], desc: "Instant bird identification helper." },
  { name: "eBird", url: "https://ebird.org", cat: ["Birds"], desc: "The largest biodiversity-related citizen science project." },
  { name: "BirdNET", url: "https://birdnet.cornell.edu", cat: ["Birds"], desc: "Identify bird sounds with machine learning." },
  { name: "Xeno-canto", url: "https://xeno-canto.org", cat: ["Birds"], desc: "Sharing bird sounds from around the world." },
  { name: "BirdForum", url: "https://birdforum.net", cat: ["Birds"], desc: "The largest online community for bird watchers." },

  // Pets
  { name: "Petfinder", url: "https://petfinder.com", cat: ["Pets"], desc: "Search over 300,000 adoptable pets." },
  { name: "Dogster", url: "https://dogster.com", cat: ["Pets"], desc: "The source for everything dog-related." },
  { name: "Catster", url: "https://catster.com", cat: ["Pets"], desc: "For the love of cats and their owners." },
  { name: "BringFido", url: "https://bringfido.com", cat: ["Pets"], desc: "Pet friendly hotel and travel directory." },
  { name: "PetMD", url: "https://petmd.com", cat: ["Pets"], desc: "Trusted veterinarian-written health information." },

  // Cooking
  { name: "SuperCook", url: "https://supercook.com", cat: ["Cooking"], desc: "Find recipes by the ingredients you have." },
  { name: "Copy Me That", url: "https://copymethat.com", cat: ["Cooking"], desc: "Recipe manager and grocery list generator." },
  { name: "Kitchen Stories", url: "https://kitchenstories.com", cat: ["Cooking"], desc: "Delicious recipes and step-by-step videos." },
  { name: "SideChef", url: "https://sidechef.com", cat: ["Cooking"], desc: "Personalized meal planning and recipes." },
  { name: "Tasty", url: "https://tasty.co", cat: ["Cooking"], desc: "Fun and easy recipes for everyone." },

  // Coffee
  { name: "Home-Barista", url: "https://home-barista.com", cat: ["Coffee"], desc: "Reviews and resources for home espresso makers." },
  { name: "Coffee Review", url: "https://coffeereview.com", cat: ["Coffee"], desc: "The world's leading coffee guide." },
  { name: "Bean Box", url: "https://beanbox.com", cat: ["Coffee"], desc: "Discover the world's best artisan coffees." },
  { name: "James Hoffmann", url: "https://jameshoffmann.co.uk", cat: ["Coffee"], desc: "Deep dives into coffee brewing and culture." },
  { name: "AeroPress Recipes", url: "https://aeroprecipe.com", cat: ["Coffee"], desc: "The best recipes for your AeroPress." },

  // Sewing
  { name: "Mood Fabrics", url: "https://moodfabrics.com", cat: ["Sewing"], desc: "The legendary fabric store for designers." },
  { name: "Seamwork", url: "https://seamwork.com", cat: ["Sewing"], desc: "Magazine and community for sewing enthusiasts." },
  { name: "Burda Style", url: "https://burdastyle.com", cat: ["Sewing"], desc: "The largest online sewing community." },
  { name: "Peppermint Magazine", url: "https://peppermintmag.com/sewing-patterns", cat: ["Sewing"], desc: "Free sustainable sewing patterns." },
  { name: "Thread Theory", url: "https://threadtheory.ca", cat: ["Sewing"], desc: "Modern menswear sewing patterns." },

  // Woodworking
  { name: "LumberJocks", url: "https://lumberjocks.com", cat: ["Woodworking"], desc: "Showcasing the work of woodworkers globally." },
  { name: "Wood Database", url: "https://wood-database.com", cat: ["Woodworking"], desc: "Comprehensive database of wood species." },
  { name: "FineWoodworking", url: "https://finewoodworking.com", cat: ["Woodworking"], desc: "Professional techniques for amateur woodworkers." },
  { name: "Wood Magazine", url: "https://woodmagazine.com", cat: ["Woodworking"], desc: "Woodworking plans and tool reviews." },
  { name: "Instructables Wood", url: "https://instructables.com/workshop/woodworking", cat: ["Woodworking"], desc: "Step-by-step DIY woodworking projects." },

  // 3D Printing
  { name: "Printables", url: "https://printables.com", cat: ["3D Printing"], desc: "The premier hub for high-quality 3D models." },
  { name: "Thangs", url: "https://thangs.com", cat: ["3D Printing"], desc: "3D model search engine and community." },
  { name: "MakerWorld", url: "https://makerworld.com", cat: ["3D Printing"], desc: "Official 3D model sharing platform by Bambu Lab." },
  { name: "Yeggi", url: "https://yeggi.com", cat: ["3D Printing"], desc: "The search engine for 3D printable models." },
  { name: "Cults3D", url: "https://cults3d.com", cat: ["3D Printing"], desc: "A marketplace for professional 3D designs." },

  // Satellite Images
  { name: "Sentinel Hub Playground", url: "https://apps.sentinel-hub.com/sentinel-playground", cat: ["Satellite Images"], desc: "Browse and download free satellite imagery." },
  { name: "EO Browser", url: "https://apps.sentinel-hub.com/eo-browser", cat: ["Satellite Images"], desc: "Advanced analysis of satellite data from your browser." },
  { name: "Landsat Explorer", url: "https://landsatexplorer.usgs.gov", cat: ["Satellite Images"], desc: "Explore decades of Earth history from space." },
  { name: "Copernicus Browser", url: "https://dataspace.copernicus.eu/browser", cat: ["Satellite Images"], desc: "Access the full archive of EU satellite data." },

  // Gemstones
  { name: "Gem Rock Auctions", url: "https://gemrockauctions.com", cat: ["Gemstones"], desc: "The leading marketplace for loose gemstones." },
  { name: "Mindat", url: "https://mindat.org", cat: ["Gemstones"], desc: "The world's largest mineralogy database." },
  { name: "GemSelect", url: "https://gemselect.com", cat: ["Gemstones"], desc: "High quality loose gemstones online." },
  { name: "Gem Society", url: "https://gemsociety.org", cat: ["Gemstones"], desc: "Education and resources for gem enthusiasts." },
  { name: "Gem Encyclopedia", url: "https://gia.edu/gem-encyclopedia", cat: ["Gemstones"], desc: "Trusted gemological information from GIA." },

  // Board Games
  { name: "BoardGameGeek", url: "https://boardgamegeek.com", cat: ["Board Games"], desc: "The definitive library for board gamers." },
  { name: "Yucata", url: "https://yucata.de", cat: ["Board Games"], desc: "Play professional board games for free online." },
  { name: "Rally the Troops", url: "https://rally-the-troops.com", cat: ["Board Games"], desc: "Classic strategy and war games in your browser." },
  { name: "Board Game Arena", url: "https://boardgamearena.com", cat: ["Board Games"], desc: "The largest online board game platform." },
  { name: "Tabletopia", url: "https://tabletopia.com", cat: ["Board Games"], desc: "A digital sandbox for playing board games." },

  // Tabletop RPG
  { name: "Donjon", url: "https://donjon.bin.sh", cat: ["Tabletop RPG"], desc: "Massive suite of RPG generators and tools." },
  { name: "Roll20", url: "https://roll20.net", cat: ["Tabletop RPG"], desc: "The best virtual tabletop for TTRPGs." },
  { name: "Owlbear Rodeo", url: "https://owlbear.rodeo", cat: ["Tabletop RPG"], desc: "Simple, easy virtual tabletop maps." },
  { name: "Kobold Fight Club", url: "https://koboldplus.club", cat: ["Tabletop RPG"], desc: "D&D 5E encounter builder and manager." },
  { name: "D&D Beyond", url: "https://dndbeyond.com", cat: ["Tabletop RPG"], desc: "Official digital tools for Dungeons & Dragons." },

  // Magic Tricks
  { name: "Ellusionist", url: "https://ellusionist.com", cat: ["Magic Tricks"], desc: "Leading magic training and playing card store." },
  { name: "Theory11", url: "https://theory11.com", cat: ["Magic Tricks"], desc: "Professional magic tricks and luxury cards." },
  { name: "Penguin Magic", url: "https://penguinmagic.com", cat: ["Magic Tricks"], desc: "Massive online store for magicians." },
  { name: "Magic Tricks", url: "https://magictricks.com", cat: ["Magic Tricks"], desc: "Easy to learn magic for beginners." },
  { name: "Vanishing Inc", url: "https://vanishingincmagic.com", cat: ["Magic Tricks"], desc: "Modern and professional magic resources." },

  // Live Cameras
  { name: "SkylineWebcams", url: "https://skylinewebcams.com", cat: ["Live Cameras"], desc: "Live streaming webcams from around the world." },
  { name: "EarthCam Live", url: "https://earthcam.com", cat: ["Live Cameras"], desc: "The largest network of live streaming cameras." },
  { name: "Explore.org", url: "https://explore.org", cat: ["Live Cameras"], desc: "Nature and wildlife live streams." },
  { name: "Webcamtaxi", url: "https://webcamtaxi.com", cat: ["Live Cameras"], desc: "Global directory of live webcams." },
  { name: "Live Beach Cam", url: "https://livebeachcam.net", cat: ["Live Cameras"], desc: "Surf and beach cameras globally." },

  // Watches
  { name: "WatchCharts", url: "https://watchcharts.com", cat: ["Watches"], desc: "Price tracking and market analysis for luxury watches." },
  { name: "Chrono24", url: "https://chrono24.com", cat: ["Watches"], desc: "The world's leading marketplace for luxury watches." },
  { name: "WatchBase", url: "https://watchbase.com", cat: ["Watches"], desc: "Massive database of watches and movements." },
  { name: "Caliber Corner", url: "https://calibercorner.com", cat: ["Watches"], desc: "Technical data on watch movements." },
  { name: "TimeZone", url: "https://timezone.com", cat: ["Watches"], desc: "The premier luxury watch forum." },

  // Gifts
  { name: "Uncommon Goods", url: "https://uncommongoods.com", cat: ["Gifts"], desc: "Unique and creative gifts from independent makers." },
  { name: "ThisIsWhyImBroke", url: "https://thisiswhyimbroke.com", cat: ["Gifts"], desc: "The best unusual gift ideas on the web." },
  { name: "Giftlab", url: "https://giftlab.com", cat: ["Gifts"], desc: "Curated gift guides for every occasion." },
  { name: "Cool Material", url: "https://coolmaterial.com", cat: ["Gifts"], desc: "The best gear and gifts for men." },
  { name: "Firebox", url: "https://firebox.com", cat: ["Gifts"], desc: "Shop the unusual and the extraordinary." },
];

export const MOCK_WEBSITES: Website[] = Array.from(new Set(RAW_SITES.map(s => s.url)))
  .map((url, index) => {
    const site = RAW_SITES.find(s => s.url === url)!;
    
    // Assign deterministic pricing to avoid hydration mismatch
    const pricingOptions: ("Paid" | "Freemium" | "Free")[] = ["Paid", "Freemium", "Free"];
    const pricing = pricingOptions[index % pricingOptions.length];

    return {
      id: `site-${index}`,
      name: site.name,
      developer: "Bessites Curator",
      description: site.desc,
      longDescription: `${site.name} is a leading platform for ${site.cat.join(" and ")}. It provides high-quality resources and tools for the niche community.`,
      rating: 0,
      reviewCount: 0,
      categories: site.cat,
      imageUrl: "", 
      screenshots: [],
      url: site.url,
      size: "N/A",
      version: "1.0",
      updatedAt: "2024",
      pricing: pricing
    };
  });
