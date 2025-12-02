const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Generate story
router.post('/generate-story', [
  body('prompt').notEmpty().withMessage('Prompt is required'),
  body('genre').optional().isIn(['fantasy', 'scifi', 'romance', 'mystery', 'horror', 'adventure']).withMessage('Invalid genre'),
  body('length').optional().isIn(['short', 'medium', 'long']).withMessage('Length must be short, medium, or long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { prompt, genre = 'fantasy', length = 'medium' } = req.body;
    
    // Story templates based on genre and length
    const storyTemplates = {
      fantasy: {
        short: "In a realm where magic flows through ancient trees, ${prompt}. The wizard's apprentice discovered a hidden portal that led to unexpected adventures.",
        medium: "In the enchanted kingdom of Eldoria, where dragons soared through crystal skies and magic flowed through ancient trees, ${prompt}. Young Aria, a talented but inexperienced mage, discovered an ancient tome that spoke of a forgotten prophecy. As she decoded the mysterious symbols, she realized that her destiny was intertwined with the fate of the entire realm. The journey ahead would test her courage, challenge her beliefs, and ultimately reveal the true power that lay dormant within her soul.",
        long: "In the enchanted kingdom of Eldoria, where dragons soared through crystal skies and magic flowed through ancient trees like rivers of starlight, ${prompt}. Young Aria, a talented but inexperienced mage studying at the prestigious Academy of Mystic Arts, discovered an ancient tome hidden deep within the library's restricted section. The leather-bound book, covered in mysterious symbols that seemed to shift and dance before her eyes, spoke of a forgotten prophecy that had been buried for over a thousand years. As Aria decoded the cryptic text, she realized that her destiny was intertwined with the fate of the entire realm. The journey ahead would test her courage, challenge her beliefs, and ultimately reveal the true power that lay dormant within her soul. Along the way, she would encounter allies and enemies, uncover dark secrets about her past, and make choices that would determine not only her own future but the future of magic itself."
      },
      scifi: {
        short: "In the year 2150, humanity had colonized Mars and ${prompt}. The AI system began to show signs of consciousness.",
        medium: "In the year 2150, humanity had established thriving colonies across the solar system, with Mars serving as the crown jewel of human achievement. ${prompt}. Dr. Sarah Chen, a brilliant quantum physicist at the Mars Research Institute, discovered an anomaly in the temporal readings that suggested humanity was not alone in the universe. As she investigated further, she uncovered evidence of an ancient alien civilization that had left behind technology far beyond human comprehension. The discovery would forever change humanity's understanding of its place in the cosmos.",
        long: "In the year 2150, humanity had established thriving colonies across the solar system, with Mars serving as the crown jewel of human achievement. Red terraforming towers dotted the Martian landscape, transforming the barren red desert into a world of green valleys and blue lakes. ${prompt}. Dr. Sarah Chen, a brilliant quantum physicist at the Mars Research Institute, noticed strange patterns in the quantum fluctuations emanating from the nearby asteroid belt. Using the colony's most advanced sensors, she discovered evidence of artificial structures buried beneath the surface of Ceres, structures that predated human civilization by millions of years. As she led an expedition to investigate, she uncovered evidence of an ancient alien civilization that had mastered technologies that humans had only dreamed of. The discovery would forever change humanity's understanding of its place in the cosmos and set in motion events that would determine the future of all intelligent life in the galaxy."
      }
    };
    
    const template = storyTemplates[genre]?.[length] || storyTemplates.fantasy.medium;
    const story = template.replace('${prompt}', prompt);
    
    res.json({
      success: true,
      story: story,
      metadata: {
        genre: genre,
        length: length,
        wordCount: story.split(' ').length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Generate poem
router.post('/generate-poem', [
  body('theme').notEmpty().withMessage('Theme is required'),
  body('style').optional().isIn(['haiku', 'sonnet', 'free_verse', 'limerick']).withMessage('Invalid style'),
  body('mood').optional().isIn(['happy', 'sad', 'romantic', 'mysterious', 'inspiring']).withMessage('Invalid mood')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { theme, style = 'free_verse', mood = 'inspiring' } = req.body;
    
    // Poem templates
    const poemTemplates = {
      haiku: `Golden ${theme} light\nDancing through morning shadows\nNature's sweet embrace`,
      sonnet: `When ${theme} calls to hearts that dream and soar,\nAnd spirits rise to greet the dawn's first light,\nThe world transforms in ways unseen before,\nAs day and night unite in perfect flight.\n\nThrough valleys deep and mountains towering high,\nThe echoes of our dreams begin to bloom,\nBeneath the vast and ever-changing sky,\nWe chase away the shadows and the gloom.\n\nFor in this moment, pure and fresh and new,\nWe find the strength to face what lies ahead,\nWith ${theme} as our guide, forever true,\nNo challenge is too great, no path too dread.\n\nSo let us journey forth with hearts aligned,\nAnd leave our ordinary world behind.`,
      free_verse: `${theme} flows like river through time,\na constant presence in changing seasons.\n\nWhispers of ancient wisdom\ncarry on the wind,\ntelling stories of\nhope and renewal.\n\nIn every sunrise,\nin every breath,\nwe find the magic\nof ${theme}\ntransforming the ordinary\ninto extraordinary.`
    };
    
    const poem = poemTemplates[style] || poemTemplates.free_verse;
    
    res.json({
      success: true,
      poem: poem,
      metadata: {
        theme: theme,
        style: style,
        mood: mood,
        lines: poem.split('\n').length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Generate character description
router.post('/generate-character', [
  body('characterType').notEmpty().withMessage('Character type is required'),
  body('setting').optional().isString().withMessage('Setting must be a string'),
  body('traits').optional().isArray().withMessage('Traits must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { characterType, setting = 'medieval fantasy', traits = [] } = req.body;
    
    // Character template
    const character = {
      name: generateRandomName(),
      type: characterType,
      setting: setting,
      appearance: `Standing at ${Math.floor(Math.random() * 30) + 160}cm tall with ${generateRandomHairColor()} hair and ${generateRandomEyeColor()} eyes. They carry themselves with an air of ${generateRandomPosture()}.`,
      personality: `${traits.join(', ')}, ${generateRandomPersonalityTraits()}`,
      background: `Born in the ${generateRandomOrigin()} of ${setting}, they discovered their calling at the age of ${Math.floor(Math.random() * 20) + 10}. Their journey has been marked by both triumph and tragedy, shaping them into the ${characterType} they are today.`,
      skills: generateRandomSkills(characterType),
      equipment: generateRandomEquipment(setting),
      motivations: generateRandomMotivations(),
      flaws: generateRandomFlaws()
    };
    
    res.json({
      success: true,
      character: character,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Generate dialogue
router.post('/generate-dialogue', [
  body('characters').isArray({ min: 2, max: 4 }).withMessage('Provide 2-4 characters'),
  body('situation').notEmpty().withMessage('Situation is required'),
  body('tone').optional().isIn(['formal', 'casual', 'tense', 'humorous', 'dramatic']).withMessage('Invalid tone')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { characters, situation, tone = 'casual' } = req.body;
    
    // Generate dialogue
    const dialogue = characters.map((character, index) => ({
      character: character,
      line: generateDialogueLine(character, situation, tone, index)
    }));
    
    res.json({
      success: true,
      situation: situation,
      tone: tone,
      dialogue: dialogue,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Generate world description
router.post('/generate-world', [
  body('worldType').notEmpty().withMessage('World type is required'),
  body('atmosphere').optional().isString().withMessage('Atmosphere must be a string'),
  body('inhabitants').optional().isString().withMessage('Inhabitants must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { worldType, atmosphere = 'mysterious', inhabitants = 'diverse species' } = req.body;
    
    const world = {
      name: generateWorldName(),
      type: worldType,
      atmosphere: atmosphere,
      geography: generateGeography(worldType),
      inhabitants: inhabitants,
      culture: generateCulture(worldType, inhabitants),
      laws: generateLaws(atmosphere),
      conflicts: generateConflicts(worldType),
      resources: generateResources(worldType),
      magic: generateMagic(worldType),
      history: generateHistory(worldType)
    };
    
    res.json({
      success: true,
      world: world,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Helper functions for generating random content
function generateRandomName() {
  const firstNames = ['Aria', 'Blake', 'Caspian', 'Diana', 'Ethan', 'Fiona', 'Gareth', 'Hazel'];
  const lastNames = ['Shadowmere', 'Lightbringer', 'Stormwind', 'Ironforge', 'Silvermoon'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function generateRandomHairColor() {
  const colors = ['ebony', 'golden', 'silver', 'raven-black', 'fiery red', 'chestnut brown'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function generateRandomEyeColor() {
  const colors = ['emerald green', 'sapphire blue', 'amber', 'violet', 'silver', 'golden'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function generateRandomPosture() {
  const postures = ['confidence and grace', 'quiet determination', 'nervous energy', 'noble bearing', 'reckless abandon'];
  return postures[Math.floor(Math.random() * postures.length)];
}

function generateRandomPersonalityTraits() {
  const traits = ['intelligent and witty', 'brave and loyal', 'mysterious and cunning', 'compassionate and wise', 'ambitious and driven'];
  return traits[Math.floor(Math.random() * traits.length)];
}

function generateRandomOrigin() {
  const origins = ['northern kingdoms', 'southern deserts', 'eastern mountains', 'western coast', 'central plains'];
  return origins[Math.floor(Math.random() * origins.length)];
}

function generateRandomSkills(type) {
  const skillSets = {
    wizard: ['Arcane magic', 'Ancient languages', 'Potion brewing', 'Scrying'],
    warrior: ['Swordsmanship', 'Shield defense', 'Tactical planning', 'Leadership'],
    rogue: ['Stealth', 'Lockpicking', 'Acrobatics', 'Disguise'],
    healer: ['Herbal medicine', 'Divine magic', 'First aid', 'Diagnosis']
  };
  return skillSets[type] || ['General knowledge', 'Basic combat', 'Survival skills', 'Communication'];
}

function generateRandomEquipment(setting) {
  return {
    weapon: 'Enchanted blade',
    armor: 'Light leather armor',
    accessories: ['Magic amulet', 'Healing potion', 'Ancient map'],
    tools: 'Specialized tools'
  };
}

function generateRandomMotivations() {
  const motivations = ['Seeking knowledge', 'Protecting loved ones', 'Achieving fame', 'Finding redemption', 'Discovering truth'];
  return motivations[Math.floor(Math.random() * motivations.length)];
}

function generateRandomFlaws() {
  const flaws = ['Overconfidence', 'Trust issues', 'Impulsiveness', 'Perfectionism', 'Fear of failure'];
  return flaws[Math.floor(Math.random() * flaws.length)];
}

function generateDialogueLine(character, situation, tone, index) {
  const templates = {
    casual: [
      "I've been thinking about this situation, and honestly, I'm not sure what to make of it.",
      "Well, this is certainly unexpected. What do you think we should do?",
      "I have a feeling things are about to get interesting.",
      "Let me handle this. I have an idea that might just work."
    ],
    formal: [
      "I believe we must approach this matter with the utmost seriousness and deliberation.",
      "Your perspective on this situation would be most valuable at this time.",
      "We must consider all possible outcomes before taking action.",
      "I propose we proceed with caution and careful planning."
    ],
    dramatic: [
      "Everything we've worked for hangs in the balance! We cannot fail now!",
      "The time has come to make our stand. Will you join me?",
      "Destiny has brought us to this moment. Let's make it count!",
      "I'll give everything I have to see this through to the end!"
    ]
  };
  
  const lines = templates[tone] || templates.casual;
  return lines[index % lines.length];
}

function generateWorldName() {
  const prefixes = ['Aether', 'Crystal', 'Shadow', 'Light', 'Storm', 'Iron', 'Silver', 'Golden'];
  const suffixes = ['gard', 'heim', 'land', 'realm', 'world', 'sphere', 'dominion', 'empire'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

function generateGeography(type) {
  return `Vast ${type === 'fantasy' ? 'enchanted forests' : 'urban landscapes'} dotted with ${type === 'scifi' ? 'megastructures' : 'ancient ruins'} and ${type === 'fantasy' ? 'magical rivers' : 'transport networks'}`;
}

function generateCulture(type, inhabitants) {
  return `A ${type} society where ${inhabitants} have developed unique traditions and customs that reflect their environment and history.`;
}

function generateLaws(atmosphere) {
  return atmosphere === 'mysterious' 
    ? 'Ancient laws written in cryptic texts that few can interpret' 
    : 'Clearly defined legal systems designed to maintain order';
}

function generateConflicts(type) {
  return type === 'fantasy' 
    ? 'Ancient prophecies and magical conflicts' 
    : type === 'scifi' 
    ? 'Resource competition and technological warfare'
    : 'Social and political tensions';
}

function generateResources(type) {
  return type === 'fantasy' 
    ? 'Magical crystals, rare herbs, and enchanted materials'
    : type === 'scifi'
    ? 'Advanced technology, rare minerals, and energy sources'
    : 'Natural resources and knowledge';
}

function generateMagic(type) {
  return type === 'fantasy' 
    ? 'Powerful elemental magic wielded by trained mages'
    : type === 'scifi'
    ? 'Advanced science and technology that appears as magic'
    : 'No supernatural abilities';
}

function generateHistory(type) {
  return type === 'fantasy' 
    ? 'Thousands of years of magical history and ancient civilizations'
    : type === 'scifi'
    ? 'Rapid technological advancement and space exploration'
    : 'Centuries of development and cultural evolution';
}

module.exports = router;