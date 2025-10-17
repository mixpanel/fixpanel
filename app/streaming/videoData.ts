// Large video pool for AI playlist generation
// Every video links to Rick Roll: https://storage.googleapis.com/mp-customer-upload/RickRoll.mp4

export interface Video {
  id: number;
  title: string;
  channel: string;
  views: string;
  duration: string;
  thumbnail: string;
  category: string;
  uploadTime: string;
  tags: string[];
}

export const videoPool: Video[] = [
  // Fitness & Workout (20 videos)
  { id: 1, title: "10-Minute Morning Yoga Flow", channel: "YogaMaster", views: "2.3M", duration: "10:15", thumbnail: "🧘", category: "Fitness", uploadTime: "1 week ago", tags: ["yoga", "morning", "stretching", "beginner"] },
  { id: 2, title: "HIIT Cardio Blast Workout", channel: "FitnessGuru", views: "5.1M", duration: "20:30", thumbnail: "💪", category: "Fitness", uploadTime: "3 days ago", tags: ["hiit", "cardio", "intense", "fat-burning"] },
  { id: 3, title: "Beginner Home Abs Workout", channel: "CoreStrength", views: "3.8M", duration: "15:45", thumbnail: "🏋️", category: "Fitness", uploadTime: "5 days ago", tags: ["abs", "core", "beginner", "home"] },
  { id: 4, title: "Full Body Pilates Session", channel: "PilatesPro", views: "1.9M", duration: "45:20", thumbnail: "🤸", category: "Fitness", uploadTime: "2 weeks ago", tags: ["pilates", "full-body", "strength", "flexibility"] },
  { id: 5, title: "Running Tips for Beginners", channel: "RunCoach", views: "4.2M", duration: "12:30", thumbnail: "🏃", category: "Fitness", uploadTime: "1 week ago", tags: ["running", "beginner", "tips", "cardio"] },
  { id: 6, title: "Arm Toning with Dumbbells", channel: "StrengthLab", views: "2.7M", duration: "18:15", thumbnail: "🦾", category: "Fitness", uploadTime: "4 days ago", tags: ["arms", "dumbbells", "toning", "strength"] },
  { id: 7, title: "Stretch & Mobility Routine", channel: "FlexibilityFirst", views: "3.3M", duration: "25:40", thumbnail: "🤸‍♀️", category: "Fitness", uploadTime: "6 days ago", tags: ["stretching", "mobility", "recovery", "flexibility"] },
  { id: 8, title: "Dance Workout Party Mix", channel: "DanceFit", views: "6.5M", duration: "30:00", thumbnail: "💃", category: "Fitness", uploadTime: "2 days ago", tags: ["dance", "fun", "cardio", "party"] },
  { id: 9, title: "Leg Day Destroyer", channel: "LegendaryLegs", views: "2.1M", duration: "35:20", thumbnail: "🦵", category: "Fitness", uploadTime: "1 week ago", tags: ["legs", "squats", "intense", "strength"] },
  { id: 10, title: "Meditation for Athletes", channel: "MindfulMoves", views: "1.5M", duration: "15:00", thumbnail: "🧘‍♂️", category: "Fitness", uploadTime: "3 days ago", tags: ["meditation", "recovery", "mindfulness", "relaxation"] },
  { id: 11, title: "Boxing Fundamentals Training", channel: "BoxingBasics", views: "3.9M", duration: "28:45", thumbnail: "🥊", category: "Fitness", uploadTime: "5 days ago", tags: ["boxing", "fundamentals", "cardio", "technique"] },
  { id: 12, title: "Resistance Band Full Body", channel: "BandWorkouts", views: "2.4M", duration: "22:30", thumbnail: "🎯", category: "Fitness", uploadTime: "1 week ago", tags: ["resistance-bands", "full-body", "home", "strength"] },
  { id: 13, title: "Cycling Indoor Intervals", channel: "SpinCycle", views: "4.7M", duration: "40:00", thumbnail: "🚴", category: "Fitness", uploadTime: "2 days ago", tags: ["cycling", "intervals", "cardio", "endurance"] },
  { id: 14, title: "Bodyweight Boot Camp", channel: "BootCampFit", views: "5.3M", duration: "32:15", thumbnail: "⚡", category: "Fitness", uploadTime: "4 days ago", tags: ["bodyweight", "bootcamp", "intense", "no-equipment"] },
  { id: 15, title: "Prenatal Yoga Gentle Flow", channel: "MamaYoga", views: "1.2M", duration: "20:00", thumbnail: "🤰", category: "Fitness", uploadTime: "1 week ago", tags: ["prenatal", "yoga", "gentle", "pregnancy"] },
  { id: 16, title: "Kettlebell Swing Masterclass", channel: "KettlebellKing", views: "2.9M", duration: "18:30", thumbnail: "🏋️‍♀️", category: "Fitness", uploadTime: "6 days ago", tags: ["kettlebell", "swings", "power", "technique"] },
  { id: 17, title: "Cool Down & Recovery Stretches", channel: "RecoveryZone", views: "1.8M", duration: "12:45", thumbnail: "🌊", category: "Fitness", uploadTime: "3 days ago", tags: ["cooldown", "recovery", "stretching", "relaxation"] },
  { id: 18, title: "Swimming Technique Drills", channel: "SwimPro", views: "3.1M", duration: "25:20", thumbnail: "🏊", category: "Fitness", uploadTime: "5 days ago", tags: ["swimming", "technique", "drills", "efficiency"] },
  { id: 19, title: "Chair Yoga for Seniors", channel: "GoldenYears", views: "2.6M", duration: "16:40", thumbnail: "🪑", category: "Fitness", uploadTime: "1 week ago", tags: ["chair-yoga", "seniors", "gentle", "accessible"] },
  { id: 20, title: "CrossFit WOD of the Day", channel: "CrossFitDaily", views: "4.4M", duration: "38:50", thumbnail: "🔥", category: "Fitness", uploadTime: "2 days ago", tags: ["crossfit", "wod", "intense", "advanced"] },

  // Cooking & Food (20 videos)
  { id: 21, title: "Perfect Homemade Pizza Dough", channel: "ChefMaster", views: "8.9M", duration: "15:30", thumbnail: "🍕", category: "Cooking", uploadTime: "1 week ago", tags: ["pizza", "dough", "italian", "baking"] },
  { id: 22, title: "30-Minute Stir Fry Basics", channel: "WokWizard", views: "5.6M", duration: "12:20", thumbnail: "🥘", category: "Cooking", uploadTime: "4 days ago", tags: ["stir-fry", "quick", "asian", "vegetables"] },
  { id: 23, title: "Chocolate Lava Cake Tutorial", channel: "DessertQueen", views: "12.3M", duration: "18:45", thumbnail: "🍰", category: "Cooking", uploadTime: "2 weeks ago", tags: ["dessert", "chocolate", "cake", "fancy"] },
  { id: 24, title: "Sushi Rolling for Beginners", channel: "SushiSensei", views: "7.2M", duration: "22:10", thumbnail: "🍣", category: "Cooking", uploadTime: "5 days ago", tags: ["sushi", "japanese", "beginner", "seafood"] },
  { id: 25, title: "Farm-to-Table Salad Ideas", channel: "FreshGreens", views: "3.4M", duration: "14:25", thumbnail: "🥗", category: "Cooking", uploadTime: "3 days ago", tags: ["salad", "healthy", "vegetables", "fresh"] },
  { id: 26, title: "BBQ Ribs Masterclass", channel: "SmokeHouse", views: "9.1M", duration: "35:40", thumbnail: "🍖", category: "Cooking", uploadTime: "1 week ago", tags: ["bbq", "ribs", "smoking", "meat"] },
  { id: 27, title: "French Pastry Basics", channel: "ParisianBaker", views: "6.7M", duration: "28:15", thumbnail: "🥐", category: "Cooking", uploadTime: "6 days ago", tags: ["pastry", "french", "baking", "technique"] },
  { id: 28, title: "Vegan Meal Prep Sunday", channel: "PlantPowered", views: "4.9M", duration: "42:30", thumbnail: "🥬", category: "Cooking", uploadTime: "2 days ago", tags: ["vegan", "meal-prep", "healthy", "plant-based"] },
  { id: 29, title: "Thai Curry from Scratch", channel: "SpiceLand", views: "5.8M", duration: "24:50", thumbnail: "🍛", category: "Cooking", uploadTime: "1 week ago", tags: ["thai", "curry", "spicy", "authentic"] },
  { id: 30, title: "Bread Baking for Beginners", channel: "BreadHead", views: "10.2M", duration: "45:20", thumbnail: "🍞", category: "Cooking", uploadTime: "3 weeks ago", tags: ["bread", "baking", "beginner", "yeast"] },
  { id: 31, title: "Street Tacos Authentic Recipe", channel: "TacoTuesday", views: "7.8M", duration: "16:35", thumbnail: "🌮", category: "Cooking", uploadTime: "4 days ago", tags: ["tacos", "mexican", "street-food", "authentic"] },
  { id: 32, title: "Breakfast Smoothie Bowl Art", channel: "SmoothieArtist", views: "3.9M", duration: "11:20", thumbnail: "🥤", category: "Cooking", uploadTime: "5 days ago", tags: ["smoothie", "breakfast", "healthy", "artistic"] },
  { id: 33, title: "Italian Pasta Making 101", channel: "NonnaKitchen", views: "11.5M", duration: "32:45", thumbnail: "🍝", category: "Cooking", uploadTime: "2 weeks ago", tags: ["pasta", "italian", "homemade", "traditional"] },
  { id: 34, title: "Air Fryer Recipe Collection", channel: "AirFryEverything", views: "8.3M", duration: "19:30", thumbnail: "🔥", category: "Cooking", uploadTime: "1 week ago", tags: ["air-fryer", "healthy", "quick", "crispy"] },
  { id: 35, title: "Indian Curry Spice Guide", channel: "CurryMaster", views: "6.1M", duration: "27:15", thumbnail: "🌶️", category: "Cooking", uploadTime: "6 days ago", tags: ["indian", "curry", "spices", "guide"] },
  { id: 36, title: "Knife Skills Masterclass", channel: "ChefAcademy", views: "9.7M", duration: "38:20", thumbnail: "🔪", category: "Cooking", uploadTime: "3 days ago", tags: ["knife-skills", "technique", "professional", "basics"] },
  { id: 37, title: "Greek Mezze Platter", channel: "MediterraneanTable", views: "4.6M", duration: "21:40", thumbnail: "🧆", category: "Cooking", uploadTime: "1 week ago", tags: ["greek", "mezze", "appetizers", "mediterranean"] },
  { id: 38, title: "Coffee Brewing Techniques", channel: "BaristaLife", views: "5.4M", duration: "15:50", thumbnail: "☕", category: "Cooking", uploadTime: "4 days ago", tags: ["coffee", "brewing", "techniques", "caffeine"] },
  { id: 39, title: "Sous Vide Steak Perfect", channel: "SteakHouse", views: "7.9M", duration: "29:30", thumbnail: "🥩", category: "Cooking", uploadTime: "5 days ago", tags: ["sous-vide", "steak", "perfect", "technique"] },
  { id: 40, title: "Cookie Decorating Fun", channel: "SweetArt", views: "6.8M", duration: "23:15", thumbnail: "🍪", category: "Cooking", uploadTime: "2 days ago", tags: ["cookies", "decorating", "fun", "baking"] },

  // Relaxing & ASMR (15 videos)
  { id: 41, title: "Rainy Day Window Sounds 10 Hours", channel: "RelaxNow", views: "15.2M", duration: "600:00", thumbnail: "🌧️", category: "Relaxing", uploadTime: "1 month ago", tags: ["rain", "asmr", "sleep", "relaxing"] },
  { id: 42, title: "Ocean Waves Beach Ambience", channel: "NatureSounds", views: "22.7M", duration: "480:00", thumbnail: "🌊", category: "Relaxing", uploadTime: "2 months ago", tags: ["ocean", "waves", "nature", "calming"] },
  { id: 43, title: "Fireplace Crackling 4K", channel: "CozyVibes", views: "18.3M", duration: "360:00", thumbnail: "🔥", category: "Relaxing", uploadTime: "3 weeks ago", tags: ["fireplace", "cozy", "winter", "relaxing"] },
  { id: 44, title: "Forest Walk Birdsong Nature", channel: "WildernessWalk", views: "9.8M", duration: "120:00", thumbnail: "🌲", category: "Relaxing", uploadTime: "1 week ago", tags: ["forest", "nature", "birds", "peaceful"] },
  { id: 45, title: "Lo-Fi Beats Study Session", channel: "ChillHop", views: "45.6M", duration: "240:00", thumbnail: "🎵", category: "Relaxing", uploadTime: "6 months ago", tags: ["lofi", "study", "chill", "music"] },
  { id: 46, title: "Meditation Tibetan Bowls", channel: "ZenMaster", views: "12.4M", duration: "60:00", thumbnail: "🎶", category: "Relaxing", uploadTime: "2 weeks ago", tags: ["meditation", "tibetan", "healing", "sounds"] },
  { id: 47, title: "Waterfall Ambience 8 Hours", channel: "NatureHeals", views: "11.9M", duration: "480:00", thumbnail: "💧", category: "Relaxing", uploadTime: "1 month ago", tags: ["waterfall", "nature", "white-noise", "sleep"] },
  { id: 48, title: "Soft Jazz Evening Vibes", channel: "JazzLounge", views: "8.7M", duration: "180:00", thumbnail: "🎷", category: "Relaxing", uploadTime: "3 days ago", tags: ["jazz", "evening", "smooth", "relaxing"] },
  { id: 49, title: "Guided Sleep Meditation", channel: "SleepWell", views: "28.3M", duration: "45:30", thumbnail: "😴", category: "Relaxing", uploadTime: "4 months ago", tags: ["sleep", "meditation", "guided", "insomnia"] },
  { id: 50, title: "Cat Purring Therapy 2 Hours", channel: "PurrfectASMR", views: "6.5M", duration: "120:00", thumbnail: "😺", category: "Relaxing", uploadTime: "2 weeks ago", tags: ["cat", "purring", "asmr", "soothing"] },
  { id: 51, title: "Piano Lullabies Peaceful", channel: "PianoSerenity", views: "14.1M", duration: "90:00", thumbnail: "🎹", category: "Relaxing", uploadTime: "1 week ago", tags: ["piano", "lullaby", "peaceful", "sleep"] },
  { id: 52, title: "Northern Lights Timelapse", channel: "CosmosChill", views: "19.2M", duration: "30:45", thumbnail: "🌌", category: "Relaxing", uploadTime: "5 days ago", tags: ["aurora", "timelapse", "nature", "beautiful"] },
  { id: 53, title: "Library Ambience Study Sounds", channel: "StudySpace", views: "7.9M", duration: "300:00", thumbnail: "📚", category: "Relaxing", uploadTime: "3 weeks ago", tags: ["library", "study", "ambience", "focus"] },
  { id: 54, title: "Zen Garden Meditation Walk", channel: "ZenPath", views: "5.3M", duration: "25:20", thumbnail: "🪷", category: "Relaxing", uploadTime: "1 week ago", tags: ["zen", "garden", "meditation", "mindfulness"] },
  { id: 55, title: "Thunder & Rain Storm Sleep", channel: "StormSounds", views: "31.6M", duration: "600:00", thumbnail: "⛈️", category: "Relaxing", uploadTime: "8 months ago", tags: ["thunder", "rain", "storm", "sleep"] },

  // Gaming (15 videos)
  { id: 56, title: "Elden Ring Complete Walkthrough", channel: "GameMaster", views: "12.8M", duration: "85:30", thumbnail: "🎮", category: "Gaming", uploadTime: "1 month ago", tags: ["elden-ring", "walkthrough", "rpg", "souls"] },
  { id: 57, title: "Minecraft Building Tips", channel: "BlockBuilder", views: "23.4M", duration: "18:45", thumbnail: "⛏️", category: "Gaming", uploadTime: "2 weeks ago", tags: ["minecraft", "building", "tips", "creative"] },
  { id: 58, title: "Speedrun World Record Attempt", channel: "SpeedRunner", views: "8.9M", duration: "42:15", thumbnail: "⚡", category: "Gaming", uploadTime: "5 days ago", tags: ["speedrun", "world-record", "attempt", "fast"] },
  { id: 59, title: "Fortnite Victory Royale Tips", channel: "BattleRoyalePro", views: "15.6M", duration: "22:30", thumbnail: "🏆", category: "Gaming", uploadTime: "3 days ago", tags: ["fortnite", "victory", "tips", "battle-royale"] },
  { id: 60, title: "Retro Gaming NES Collection", channel: "RetroGamer", views: "6.7M", duration: "35:20", thumbnail: "🕹️", category: "Gaming", uploadTime: "1 week ago", tags: ["retro", "nes", "collection", "nostalgia"] },
  { id: 61, title: "League of Legends Pro Plays", channel: "ProLeague", views: "19.3M", duration: "28:40", thumbnail: "⚔️", category: "Gaming", uploadTime: "2 days ago", tags: ["league", "lol", "pro", "highlights"] },
  { id: 62, title: "Zelda Tears of the Kingdom Secrets", channel: "ZeldaFan", views: "21.5M", duration: "45:55", thumbnail: "🗡️", category: "Gaming", uploadTime: "1 month ago", tags: ["zelda", "totk", "secrets", "nintendo"] },
  { id: 63, title: "Horror Games Compilation", channel: "ScareGaming", views: "11.2M", duration: "52:30", thumbnail: "👻", category: "Gaming", uploadTime: "1 week ago", tags: ["horror", "scary", "compilation", "reactions"] },
  { id: 64, title: "Valorant Aim Training Guide", channel: "AimLab", views: "9.4M", duration: "19:15", thumbnail: "🎯", category: "Gaming", uploadTime: "4 days ago", tags: ["valorant", "aim", "training", "fps"] },
  { id: 65, title: "Stardew Valley Perfect Farm", channel: "FarmLife", views: "14.7M", duration: "38:25", thumbnail: "🌾", category: "Gaming", uploadTime: "2 weeks ago", tags: ["stardew-valley", "farm", "perfect", "relaxing"] },
  { id: 66, title: "GTA 6 Trailer Breakdown", channel: "GameNews", views: "45.9M", duration: "15:40", thumbnail: "🚗", category: "Gaming", uploadTime: "1 day ago", tags: ["gta", "trailer", "breakdown", "analysis"] },
  { id: 67, title: "Pokemon Nuzlocke Challenge", channel: "PokeMaster", views: "7.8M", duration: "62:10", thumbnail: "⚡", category: "Gaming", uploadTime: "1 week ago", tags: ["pokemon", "nuzlocke", "challenge", "hardcore"] },
  { id: 68, title: "Among Us Best Impostor Plays", channel: "SusGaming", views: "18.1M", duration: "24:35", thumbnail: "🔴", category: "Gaming", uploadTime: "6 days ago", tags: ["among-us", "impostor", "plays", "social"] },
  { id: 69, title: "Dark Souls Boss Rush No Hit", channel: "SoulsVeteran", views: "5.9M", duration: "78:50", thumbnail: "☠️", category: "Gaming", uploadTime: "3 weeks ago", tags: ["dark-souls", "boss-rush", "no-hit", "challenge"] },
  { id: 70, title: "Indie Game Hidden Gems 2024", channel: "IndieSpotlight", views: "10.3M", duration: "32:20", thumbnail: "💎", category: "Gaming", uploadTime: "5 days ago", tags: ["indie", "hidden-gems", "2024", "recommendations"] },

  // Tech & Education (15 videos)
  { id: 71, title: "AI Explained Simple Terms", channel: "TechSimple", views: "18.9M", duration: "14:25", thumbnail: "🤖", category: "Tech", uploadTime: "1 week ago", tags: ["ai", "explained", "simple", "education"] },
  { id: 72, title: "Python Programming Crash Course", channel: "CodeAcademy", views: "25.3M", duration: "120:00", thumbnail: "🐍", category: "Tech", uploadTime: "2 months ago", tags: ["python", "programming", "tutorial", "beginner"] },
  { id: 73, title: "Smartphone Photography Hacks", channel: "PhotoPro", views: "12.4M", duration: "18:30", thumbnail: "📱", category: "Tech", uploadTime: "5 days ago", tags: ["photography", "smartphone", "hacks", "tips"] },
  { id: 74, title: "Build Your Own PC 2024 Guide", channel: "PCBuilder", views: "16.7M", duration: "42:15", thumbnail: "💻", category: "Tech", uploadTime: "2 weeks ago", tags: ["pc", "build", "guide", "hardware"] },
  { id: 75, title: "Cybersecurity for Everyone", channel: "SecureLife", views: "9.8M", duration: "28:40", thumbnail: "🔒", category: "Tech", uploadTime: "1 week ago", tags: ["cybersecurity", "safety", "privacy", "tips"] },
  { id: 76, title: "Quantum Computing Explained", channel: "QuantumLeap", views: "7.6M", duration: "22:50", thumbnail: "⚛️", category: "Tech", uploadTime: "3 days ago", tags: ["quantum", "computing", "science", "explained"] },
  { id: 77, title: "Web3 Blockchain Basics", channel: "CryptoEd", views: "11.2M", duration: "35:20", thumbnail: "⛓️", category: "Tech", uploadTime: "1 week ago", tags: ["web3", "blockchain", "crypto", "basics"] },
  { id: 78, title: "Space Exploration Documentary", channel: "CosmosNow", views: "28.5M", duration: "90:00", thumbnail: "🚀", category: "Tech", uploadTime: "1 month ago", tags: ["space", "exploration", "documentary", "science"] },
  { id: 79, title: "Climate Change Solutions", channel: "EarthFirst", views: "14.3M", duration: "38:15", thumbnail: "🌍", category: "Tech", uploadTime: "2 weeks ago", tags: ["climate", "environment", "solutions", "sustainability"] },
  { id: 80, title: "Excel Power User Tips", channel: "OfficeNinja", views: "19.7M", duration: "32:45", thumbnail: "📊", category: "Tech", uploadTime: "1 week ago", tags: ["excel", "tips", "productivity", "business"] },
  { id: 81, title: "Machine Learning Fundamentals", channel: "MLMaster", views: "22.1M", duration: "65:30", thumbnail: "🧠", category: "Tech", uploadTime: "3 weeks ago", tags: ["machine-learning", "ai", "fundamentals", "education"] },
  { id: 82, title: "Drone Photography Cinematography", channel: "SkyView", views: "8.9M", duration: "24:20", thumbnail: "🛸", category: "Tech", uploadTime: "4 days ago", tags: ["drone", "photography", "cinematography", "aerial"] },
  { id: 83, title: "3D Printing Beginner Guide", channel: "PrintMaster", views: "13.6M", duration: "29:40", thumbnail: "🖨️", category: "Tech", uploadTime: "2 weeks ago", tags: ["3d-printing", "guide", "beginner", "making"] },
  { id: 84, title: "Smart Home Automation Setup", channel: "SmartLiving", views: "10.4M", duration: "36:15", thumbnail: "🏠", category: "Tech", uploadTime: "1 week ago", tags: ["smart-home", "automation", "iot", "setup"] },
  { id: 85, title: "Electric Vehicle Future", channel: "EVRevolution", views: "15.8M", duration: "42:30", thumbnail: "⚡", category: "Tech", uploadTime: "5 days ago", tags: ["ev", "electric", "future", "sustainability"] },

  // Music & Entertainment (15 videos)
  { id: 86, title: "Guitar Lessons for Beginners", channel: "GuitarHero", views: "31.2M", duration: "45:20", thumbnail: "🎸", category: "Music", uploadTime: "3 months ago", tags: ["guitar", "lessons", "beginner", "music"] },
  { id: 87, title: "Epic Movie Soundtrack Collection", channel: "CinematicSound", views: "42.8M", duration: "180:00", thumbnail: "🎬", category: "Music", uploadTime: "6 months ago", tags: ["movie", "soundtrack", "epic", "orchestral"] },
  { id: 88, title: "Stand-Up Comedy Special", channel: "LaughFactory", views: "19.5M", duration: "58:30", thumbnail: "😂", category: "Entertainment", uploadTime: "2 weeks ago", tags: ["comedy", "standup", "funny", "entertainment"] },
  { id: 89, title: "Magic Tricks Revealed Tutorial", channel: "MagicSecrets", views: "26.7M", duration: "32:15", thumbnail: "🎩", category: "Entertainment", uploadTime: "1 month ago", tags: ["magic", "tricks", "tutorial", "revealed"] },
  { id: 90, title: "DJ Mixing Masterclass", channel: "DJAcademy", views: "14.3M", duration: "52:40", thumbnail: "🎧", category: "Music", uploadTime: "3 weeks ago", tags: ["dj", "mixing", "edm", "tutorial"] },
  { id: 91, title: "Broadway Musical Highlights", channel: "TheaterLife", views: "18.9M", duration: "38:25", thumbnail: "🎭", category: "Entertainment", uploadTime: "1 week ago", tags: ["broadway", "musical", "theater", "performance"] },
  { id: 92, title: "Piano Classics Beautiful", channel: "ClassicalPiano", views: "35.6M", duration: "120:00", thumbnail: "🎹", category: "Music", uploadTime: "4 months ago", tags: ["piano", "classical", "beautiful", "relaxing"] },
  { id: 93, title: "Beatboxing Tutorial Basics", channel: "BeatboxBattle", views: "12.8M", duration: "22:50", thumbnail: "🎤", category: "Music", uploadTime: "2 weeks ago", tags: ["beatbox", "tutorial", "basics", "vocal"] },
  { id: 94, title: "Anime Opening Collection 2024", channel: "AnimeMusic", views: "28.4M", duration: "65:30", thumbnail: "🎌", category: "Entertainment", uploadTime: "1 month ago", tags: ["anime", "opening", "collection", "japanese"] },
  { id: 95, title: "Music Production FL Studio", channel: "ProducerLife", views: "16.2M", duration: "48:15", thumbnail: "🎛️", category: "Music", uploadTime: "3 weeks ago", tags: ["production", "fl-studio", "daw", "tutorial"] },
  { id: 96, title: "Singing Voice Training", channel: "VocalCoach", views: "21.7M", duration: "35:40", thumbnail: "🎵", category: "Music", uploadTime: "2 weeks ago", tags: ["singing", "voice", "training", "vocal"] },
  { id: 97, title: "Festival EDM Mix 2024", channel: "FestivalVibes", views: "39.3M", duration: "90:00", thumbnail: "🎪", category: "Music", uploadTime: "2 months ago", tags: ["edm", "festival", "mix", "dance"] },
  { id: 98, title: "Podcast Interesting Stories", channel: "StoryTime", views: "11.4M", duration: "72:20", thumbnail: "🎙️", category: "Entertainment", uploadTime: "1 week ago", tags: ["podcast", "stories", "interesting", "talk"] },
  { id: 99, title: "Drum Solo Compilation Epic", channel: "DrumLife", views: "9.8M", duration: "28:35", thumbnail: "🥁", category: "Music", uploadTime: "5 days ago", tags: ["drums", "solo", "compilation", "epic"] },
  { id: 100, title: "Karaoke Night Popular Songs", channel: "KaraokeKing", views: "24.1M", duration: "150:00", thumbnail: "🎤", category: "Entertainment", uploadTime: "1 month ago", tags: ["karaoke", "songs", "popular", "sing-along"] },
];

// Helper function to get random videos from the pool
export function getRandomVideos(count: number): Video[] {
  const shuffled = [...videoPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to search videos by tags/keywords
export function searchVideos(query: string, maxResults: number = 10): Video[] {
  const queryLower = query.toLowerCase();
  const matches = videoPool.filter(video =>
    video.title.toLowerCase().includes(queryLower) ||
    video.category.toLowerCase().includes(queryLower) ||
    video.tags.some(tag => tag.includes(queryLower)) ||
    video.channel.toLowerCase().includes(queryLower)
  );

  // Return shuffled matches up to maxResults
  return matches.sort(() => 0.5 - Math.random()).slice(0, maxResults);
}
