import { VocabularyWord, UserWordProgress } from '../types';

export const INITIAL_VOCABULARY_WORDS: VocabularyWord[] = [
  {
    id: 'word-meticulous',
    word: 'Meticulous',
    meaning: 'Showing great attention to detail; very careful and precise.',
    pronunciation: '/meh-TIK-yuh-lus/',
    ipa: '/məˈtɪkjələs/',
    partOfSpeech: 'adjective',
    example: 'She was meticulous when checking every single line of her research project.',
    example2: 'The watchmaker assembled the gears with meticulous precision.',
    synonyms: ['Diligent', 'Scrupulous', 'Fastidious', 'Painstaking', 'Thorough'],
    antonyms: ['Careless', 'Sloppy', 'Negligent', 'Slapdash'],
    difficulty: 'Intermediate',
    category: 'Competitive Exams',
    origin: 'From Latin meticulosus ("fearful"), later evolving into fearful of making mistakes → excessively careful.',
    relatedWords: ['Meticulously', 'Meticulousness', 'Exactitude'],
    defaultMnemonic: 'Think: "Meticulous = Details Matter To Us!" or "Check every tick on the list".',
    defaultVisualEmoji: '🔍',
    personalizedMnemonics: {
      Cricket: {
        interest: 'Cricket',
        trick: 'Think of MS Dhoni meticulously measuring the batsman’s crease before whipping off the bails.',
        visualEmoji: '🏏',
        hookStory: 'Dhoni’s stumping precision is so meticulous it leaves zero room for millimeter error.'
      },
      Gaming: {
        interest: 'Gaming',
        trick: 'Think of a speedrunner meticulously planning every single frame input to bypass obstacles.',
        visualEmoji: '🎮',
        hookStory: 'In Souls-like games, your timing must be meticulous or one boss hit ends your run.'
      },
      Tech: {
        interest: 'Tech',
        trick: 'Meticulous code review = hunting down that single missing semicolon in 5,000 lines.',
        visualEmoji: '💻',
        hookStory: 'NASA engineers write meticulous unit tests before launching satellite firmware.'
      }
    }
  },
  {
    id: 'word-ubiquitous',
    word: 'Ubiquitous',
    meaning: 'Present, appearing, or found everywhere at the same time.',
    pronunciation: '/yoo-BIK-wih-tus/',
    ipa: '/juːˈbɪkwɪtəs/',
    partOfSpeech: 'adjective',
    example: 'Smartphones have become ubiquitous in modern daily life.',
    example2: 'Wi-Fi hotspots are now ubiquitous across public transportation hubs.',
    synonyms: ['Omnipresent', 'Pervasive', 'Universal', 'Everywhere', 'Widespread'],
    antonyms: ['Rare', 'Scarce', 'Infrequent', 'Localized'],
    difficulty: 'Advanced',
    category: 'Technology',
    origin: 'From Latin ubique ("everywhere"), modeled on the concept of omnipresence.',
    relatedWords: ['Ubiquity', 'Ubiquitously'],
    defaultMnemonic: 'Think: "You Be Everywhere" (U-BI-QU-ITOUS) → Ubiquitous!',
    defaultVisualEmoji: '🌐',
    personalizedMnemonics: {
      Cricket: {
        interest: 'Cricket',
        trick: 'Cricket talk in India during the World Cup is ubiquitous—on buses, chai stalls, and TV screens.',
        visualEmoji: '📺',
        hookStory: 'No matter where you turn, cricket score updates are ubiquitous.'
      },
      Gaming: {
        interest: 'Gaming',
        trick: 'Microtransactions and battle passes have become ubiquitous in multiplayer titles.',
        visualEmoji: '🕹️',
        hookStory: 'Just like RGB lighting on gamer setups, game patches are ubiquitous.'
      },
      Cinema: {
        interest: 'Cinema',
        trick: 'Stan Lee cameos used to be ubiquitous across the entire Marvel Cinematic Universe.',
        visualEmoji: '🍿',
        hookStory: 'Popcorn aromas are ubiquitous the moment you enter any movie theater.'
      }
    }
  },
  {
    id: 'word-ephemeral',
    word: 'Ephemeral',
    meaning: 'Lasting for a very short, fleeting period of time; transitory.',
    pronunciation: '/ih-FEM-er-ul/',
    ipa: '/ɪˈfemərəl/',
    partOfSpeech: 'adjective',
    example: 'Fame on social media can be ephemeral, disappearing within days.',
    example2: 'The ephemeral morning mist vanished as soon as the sun rose over the valley.',
    synonyms: ['Transient', 'Fleeting', 'Momentary', 'Brief', 'Evanescent'],
    antonyms: ['Permanent', 'Enduring', 'Eternal', 'Perpetual'],
    difficulty: 'Advanced',
    category: 'Academic',
    origin: 'From Greek ephemeros ("lasting only one day", from epi "on" + hemera "day").',
    relatedWords: ['Ephemera', 'Ephemerality'],
    defaultMnemonic: 'Think: "E-Femeral = disappears quickly like a camera flash or fairy dust".',
    defaultVisualEmoji: '⏳',
    personalizedMnemonics: {
      Tech: {
        interest: 'Tech',
        trick: 'Think of "Ephemeral storage" in Docker or serverless cloud containers that wipes on reboot.',
        visualEmoji: '☁️',
        hookStory: 'Temporary caching keys live an ephemeral lifecycle before garbage collection.'
      },
      Nature: {
        interest: 'Nature',
        trick: 'Think of the cherry blossom bloom in spring—gorgeous but wonderfully ephemeral.',
        visualEmoji: '🌸',
        hookStory: 'Dewdrops on morning grass are ephemeral jewels that disappear with warmth.'
      },
      Gaming: {
        interest: 'Gaming',
        trick: 'A temporary power-up boost lasting 10 seconds is an ephemeral stat buff.',
        visualEmoji: '⚡',
        hookStory: 'Grab the glowing speed star quickly before its ephemeral timer expires.'
      }
    }
  },
  {
    id: 'word-resilient',
    word: 'Resilient',
    meaning: 'Able to withstand or recover quickly from difficult conditions or setbacks.',
    pronunciation: '/rih-ZIL-yunt/',
    ipa: '/rɪˈzɪliənt/',
    partOfSpeech: 'adjective',
    example: 'The startup proved resilient, bouncing back stronger after the market downturn.',
    example2: 'Resilient bamboo bends in severe storms without snapping.',
    synonyms: ['Tough', 'Adaptable', 'Robust', 'Hardy', 'Tenacious'],
    antonyms: ['Fragile', 'Vulnerable', 'Brittle', 'Weak'],
    difficulty: 'Intermediate',
    category: 'Daily English',
    origin: 'From Latin resilire ("to spring back, rebound", from re- "back" + salire "to leap").',
    relatedWords: ['Resilience', 'Resiliency', 'Resiliently'],
    defaultMnemonic: 'Think: "Re-silient springs back like silicone or a rubber band".',
    defaultVisualEmoji: '🌱',
    personalizedMnemonics: {
      Cricket: {
        interest: 'Cricket',
        trick: 'A resilient batting lineup that recovers from 20/3 to chase down a 300-run target.',
        visualEmoji: '🛡️',
        hookStory: 'Virat Kohli’s resilient mindset shines when facing intense pressure in run chases.'
      },
      Tech: {
        interest: 'Tech',
        trick: 'A resilient microservice architecture with auto-scaling that self-heals after traffic spikes.',
        visualEmoji: '💾',
        hookStory: 'Distributed databases maintain resilient consensus even if nodes crash.'
      }
    }
  },
  {
    id: 'word-pragmatic',
    word: 'Pragmatic',
    meaning: 'Dealing with things sensibly and realistically based on practical rather than theoretical considerations.',
    pronunciation: '/prag-MAT-ik/',
    ipa: '/præɡˈmætɪk/',
    partOfSpeech: 'adjective',
    example: 'Instead of debating ideals, she proposed a pragmatic solution that solved the budget crisis.',
    example2: 'A pragmatic developer picks the tool that ships the feature reliably today.',
    synonyms: ['Practical', 'Realistic', 'Sensible', 'Hard-headed', 'Functional'],
    antonyms: ['Idealistic', 'Impractical', 'Quixotic', 'Theoretical'],
    difficulty: 'Intermediate',
    category: 'Business',
    origin: 'From Greek pragmatikos ("relating to fact or deed", from pragma "deed/action").',
    relatedWords: ['Pragmatism', 'Pragmatist', 'Pragmatically'],
    defaultMnemonic: 'Think: "PRAGMATIC = Practical Program + Magic deed in real life".',
    defaultVisualEmoji: '⚙️',
    personalizedMnemonics: {
      Business: {
        interest: 'Business',
        trick: 'A pragmatic CEO cuts vanity marketing and invests directly into customer support.',
        visualEmoji: '📈',
        hookStory: 'Prioritizing cash flow over fancy office perks is the ultimate pragmatic move.'
      },
      Gaming: {
        interest: 'Gaming',
        trick: 'A pragmatic gamer equips the weapon with high DPS rather than just cool skins.',
        visualEmoji: '🎯',
        hookStory: 'Picking the highest win-rate champion is a pragmatic climb strategy.'
      }
    }
  },
  {
    id: 'word-ambiguous',
    word: 'Ambiguous',
    meaning: 'Open to more than one interpretation; not having one obvious meaning.',
    pronunciation: '/am-BIG-yoo-us/',
    ipa: '/æmˈbɪɡjuəs/',
    partOfSpeech: 'adjective',
    example: 'The contract contained ambiguous phrasing that confused both legal teams.',
    example2: 'His ambiguous reply left everyone guessing whether he accepted the offer.',
    synonyms: ['Equivocal', 'Unclear', 'Vague', 'Cryptic', 'Obscure'],
    antonyms: ['Clear', 'Unambiguous', 'Explicit', 'Definite', 'Lucid'],
    difficulty: 'Intermediate',
    category: 'Competitive Exams',
    origin: 'From Latin ambiguus ("uncertain, doubtful", from ambigere "to wander around, dispute").',
    relatedWords: ['Ambiguity', 'Ambiguously'],
    defaultMnemonic: 'Think: "AMBI = Both/Two (like ambidextrous)" → can be interpreted both ways!',
    defaultVisualEmoji: '❓',
    personalizedMnemonics: {
      Cinema: {
        interest: 'Cinema',
        trick: 'The ending of Inception with the spinning totem is deliberately ambiguous.',
        visualEmoji: '🌀',
        hookStory: 'Did the spinning top fall or keep spinning? Christopher Nolan left it ambiguous.'
      },
      Tech: {
        interest: 'Tech',
        trick: 'An ambiguous bug report saying "the app is broken" without error logs.',
        visualEmoji: '🐛',
        hookStory: 'Developers spend hours deciphering ambiguous requirements without user stories.'
      }
    }
  },
  {
    id: 'word-inevitable',
    word: 'Inevitable',
    meaning: 'Certain to happen; unavoidable.',
    pronunciation: '/in-EV-ih-tuh-bul/',
    ipa: '/ɪnˈevɪtəbl/',
    partOfSpeech: 'adjective',
    example: 'With continuous heavy rainfall, minor flooding in the lowlands was inevitable.',
    example2: 'Technological shifts make automation inevitable across manufacturing.',
    synonyms: ['Unavoidable', 'Inescapable', 'Bound to happen', 'Fated', 'Certain'],
    antonyms: ['Avoidable', 'Preventable', 'Uncertain', 'Doubtful'],
    difficulty: 'Intermediate',
    category: 'Daily English',
    origin: 'From Latin inevitabilis (in- "not" + evitabilis "avoidable", from evitare "to shun").',
    relatedWords: ['Inevitability', 'Inevitably'],
    defaultMnemonic: 'Think: "In-EVIT-able = Cannot Evade it!" Evade → Inevitable.',
    defaultVisualEmoji: '⚡',
    personalizedMnemonics: {
      Cinema: {
        interest: 'Cinema',
        trick: 'Thanos in Avengers: "I am... Inevitable!" (Unstoppable destiny).',
        visualEmoji: '🧤',
        hookStory: 'Just like Thanos snapping his fingers, destiny felt completely inevitable.'
      },
      Tech: {
        interest: 'Tech',
        trick: 'System updates restarting your computer right in the middle of a work session feel inevitable.',
        visualEmoji: '🔄',
        hookStory: 'Software obsolescence is inevitable as new standards emerge.'
      }
    }
  },
  {
    id: 'word-concise',
    word: 'Concise',
    meaning: 'Giving a lot of information clearly and in a few words; brief but comprehensive.',
    pronunciation: '/kun-SYSE/',
    ipa: '/kənˈsaɪs/',
    partOfSpeech: 'adjective',
    example: 'Her presentation was concise, delivering all key financial insights in five minutes.',
    example2: 'Write a concise summary highlighting the primary milestones.',
    synonyms: ['Succinct', 'Pithy', 'Brief', 'Terse', 'Compact'],
    antonyms: ['Wordy', 'Verbose', 'Rambling', 'Prolix'],
    difficulty: 'Beginner',
    category: 'Interview Vocabulary',
    origin: 'From Latin concisus ("cut short", from concidere "to cut to pieces").',
    relatedWords: ['Concisely', 'Conciseness', 'Concision'],
    defaultMnemonic: 'Think: "Scissors Cut down size → Concise!" Cut out fluff.',
    defaultVisualEmoji: '✂️',
    personalizedMnemonics: {
      Tech: {
        interest: 'Tech',
        trick: 'Writing concise clean code with arrow functions instead of bloated 20-line loops.',
        visualEmoji: '💻',
        hookStory: 'A concise git commit message tells the entire release note in 50 characters.'
      },
      Business: {
        interest: 'Business',
        trick: 'An elevator pitch must be concise enough to pitch an investor in 30 seconds.',
        visualEmoji: '⏱️',
        hookStory: 'Executives love concise bullet points over 40-page PDF reports.'
      }
    }
  },
  {
    id: 'word-galvanize',
    word: 'Galvanize',
    meaning: 'To shock or excite someone into taking immediate action.',
    pronunciation: '/GAL-vuh-nyze/',
    ipa: '/ˈɡælvənaɪz/',
    partOfSpeech: 'verb',
    example: 'The captain’s stirring half-time speech galvanized the team to score three goals.',
    example2: 'The urgent climate report galvanized global leaders into drafting a new treaty.',
    synonyms: ['Stimulate', 'Jolt', 'Electrify', 'Spur', 'Motivate', 'Rouse'],
    antonyms: ['Demotivate', 'Deter', 'Dull', 'Pacify'],
    difficulty: 'Advanced',
    category: 'Academic',
    origin: 'Named after Italian scientist Luigi Galvani, who stimulated frog muscles with electric current.',
    relatedWords: ['Galvanization', 'Galvanizing'],
    defaultMnemonic: 'Think: "Galvani’s Electric Jolt" → Shocking muscles into instant action!',
    defaultVisualEmoji: '⚡',
    personalizedMnemonics: {
      Cricket: {
        interest: 'Cricket',
        trick: 'A spectacular diving catch in the 5th over galvanizes the entire fielding unit.',
        visualEmoji: '🏏',
        hookStory: 'The crowd’s deafening roar galvanized the bowler to bowl a fierce yorker.'
      },
      Gaming: {
        interest: 'Gaming',
        trick: 'When the game soundtrack drops into battle beat, it galvanizes you to counterattack.',
        visualEmoji: '🎧',
        hookStory: 'A rally ping from your team leader galvanizes everyone to rush the objective.'
      }
    }
  },
  {
    id: 'word-synergistic',
    word: 'Synergistic',
    meaning: 'Relating to the interaction or cooperation of two or more organizations, substances, or agents to produce a combined effect greater than the sum of their separate effects.',
    pronunciation: '/sin-er-JIS-tik/',
    ipa: '/ˌsɪnərˈdʒɪstɪk/',
    partOfSpeech: 'adjective',
    example: 'The merger created synergistic value that boosted revenue by forty percent.',
    example2: 'Pairing deep learning with computer vision creates a synergistic breakthrough.',
    synonyms: ['Collaborative', 'Cooperative', 'Combined', 'Harmonious', 'Symbiotic'],
    antonyms: ['Antagonistic', 'Conflicting', 'Counterproductive'],
    difficulty: 'Intermediate',
    category: 'Business',
    origin: 'From Greek synergos ("working together", from syn- "together" + ergon "work").',
    relatedWords: ['Synergy', 'Synergize', 'Synergistically'],
    defaultMnemonic: 'Think: "SYN = Together + ENERGY" → Combined energy 1 + 1 = 3!',
    defaultVisualEmoji: '🤝',
    personalizedMnemonics: {
      Gaming: {
        interest: 'Gaming',
        trick: 'A tank drawing enemy fire while a DPS casts spells is a synergistic combo.',
        visualEmoji: '🛡️',
        hookStory: 'Synergistic team ultimate abilities wipe the entire enemy squad in seconds.'
      },
      Cooking: {
        interest: 'Cooking',
        trick: 'Tomatoes and fresh basil produce a synergistic flavor greater than either alone.',
        visualEmoji: '🍳',
        hookStory: 'A pinch of salt and dark chocolate create a synergistic taste sensation.'
      }
    }
  },
  {
    id: 'word-conundrum',
    word: 'Conundrum',
    meaning: 'A confusing, intricate, and difficult problem or question.',
    pronunciation: '/kuh-NUN-drum/',
    ipa: '/kəˈnʌndrəm/',
    partOfSpeech: 'noun',
    example: 'Balancing economic growth with strict carbon reduction is a global conundrum.',
    example2: 'She faced the classic conundrum of needing experience to get her first job.',
    synonyms: ['Puzzle', 'Enigma', 'Dilemma', 'Paradox', 'Quandary'],
    antonyms: ['Solution', 'Answer', 'Certainty', 'Simplicity'],
    difficulty: 'Intermediate',
    category: 'Competitive Exams',
    origin: 'Originally 16th-century Oxford university slang for a pedantic or eccentric riddle.',
    relatedWords: ['Conundrums'],
    defaultMnemonic: 'Think: "Co-NUN-Drum: A nun beating a drum trying to solve a tricky riddle".',
    defaultVisualEmoji: '🧩',
    personalizedMnemonics: {
      Gaming: {
        interest: 'Gaming',
        trick: 'Solving a Zelda water temple puzzle is an intricate conundrum.',
        visualEmoji: '🗝️',
        hookStory: 'You have only one key and three locked doors—a nerve-wracking conundrum.'
      },
      Tech: {
        interest: 'Tech',
        trick: 'The CAP theorem is a classic conundrum: choose between Consistency, Availability, or Partition tolerance.',
        visualEmoji: '📊',
        hookStory: 'Optimizing for both maximum battery life and 120Hz display is an engineer’s conundrum.'
      }
    }
  },
  {
    id: 'word-lucid',
    word: 'Lucid',
    meaning: 'Expressed clearly; easy to understand; showing the ability to think clearly.',
    pronunciation: '/LOO-sid/',
    ipa: '/ˈluːsɪd/',
    partOfSpeech: 'adjective',
    example: 'The professor gave a remarkably lucid lecture on quantum entanglement.',
    example2: 'During a lucid dream, you become fully aware that you are dreaming.',
    synonyms: ['Clear', 'Comprehensible', 'Articulate', 'Coherent', 'Intelligible', 'Luminous'],
    antonyms: ['Confusing', 'Murky', 'Ambiguous', 'Unclear', 'Obscure'],
    difficulty: 'Beginner',
    category: 'Daily English',
    origin: 'From Latin lucidus ("light, clear, shining", from lux "light").',
    relatedWords: ['Lucidity', 'Lucidly', 'Luciferous'],
    defaultMnemonic: 'Think: "LUCID = LUX (Light) shining through" → crystal clear light!',
    defaultVisualEmoji: '💡',
    personalizedMnemonics: {
      Tech: {
        interest: 'Tech',
        trick: 'Well-documented API endpoints and lucid comments make onboarding effortless.',
        visualEmoji: '📖',
        hookStory: 'Writing lucid documentation saves hundreds of support tickets.'
      },
      Cricket: {
        interest: 'Cricket',
        trick: 'The commentator’s lucid tactical breakdown explained the bowler’s field placement.',
        visualEmoji: '🎙️',
        hookStory: 'A captain needs a lucid mind when making bowling changes under tight pressure.'
      }
    }
  },
  {
    id: 'word-serendipity',
    word: 'Serendipity',
    meaning: 'The occurrence and development of events by chance in a happy or beneficial way.',
    pronunciation: '/seh-ren-DIP-ih-tee/',
    ipa: '/ˌserənˈdɪpəti/',
    partOfSpeech: 'noun',
    example: 'Meeting her co-founder at an airport coffee shop was pure serendipity.',
    example2: 'The discovery of penicillin was a famous scientific serendipity.',
    synonyms: ['Chance', 'Happy coincidence', 'Good fortune', 'Fluke', 'Blessing'],
    antonyms: ['Misfortune', 'Bad luck', 'Calculated design'],
    difficulty: 'Intermediate',
    category: 'Literature & Arts',
    origin: 'Coined by Horace Walpole in 1754 from the Persian fairy tale "The Three Princes of Serendip".',
    relatedWords: ['Serendipitous', 'Serendipitously'],
    defaultMnemonic: 'Think: "Serene + Dip into good luck" → Dipping into unexpected happiness!',
    defaultVisualEmoji: '🍀',
    personalizedMnemonics: {
      Tech: {
        interest: 'Tech',
        trick: 'Stumbling upon the exact StackOverflow answer posted 8 years ago is pure coder serendipity.',
        visualEmoji: '🔍',
        hookStory: 'Post-it notes were born from serendipity when an adhesive failed to stick permanently.'
      },
      Cinema: {
        interest: 'Cinema',
        trick: 'A sudden rain shower during an outdoor film shoot creating an iconic romantic scene.',
        visualEmoji: '🎬',
        hookStory: 'Actors improvising an unscripted line that becomes the most quoted movie quote.'
      }
    }
  },
  {
    id: 'word-erudite',
    word: 'Erudite',
    meaning: 'Having or showing profound knowledge and scholarship.',
    pronunciation: '/AIR-yoo-dyte/',
    ipa: '/ˈerʊdaɪt/',
    partOfSpeech: 'adjective',
    example: 'The erudite scholar quoted ancient manuscripts in four different languages.',
    example2: 'He contributed erudite essays on constitutional philosophy.',
    synonyms: ['Scholarly', 'Learned', 'Knowledgeable', 'Intellectual', 'Literate'],
    antonyms: ['Ignorant', 'Illiterate', 'Uneducated'],
    difficulty: 'Mastery',
    category: 'Academic',
    origin: 'From Latin eruditus ("instructed, educated", from e- "out" + rudis "rude, untaught").',
    relatedWords: ['Erudition', 'Eruditely'],
    defaultMnemonic: 'Think: "E-RUDITE = Rude ignorance exited" → thoroughly cultured & learned.',
    defaultVisualEmoji: '📚',
    personalizedMnemonics: {
      Anime: {
        interest: 'Anime',
        trick: 'Think of the master wizard or strategist character with thousands of ancient scrolls.',
        visualEmoji: '🧙',
        hookStory: 'An erudite alchemist who calculates spell equations in their head before casting.'
      },
      Tech: {
        interest: 'Tech',
        trick: 'An erudite computer science professor who explains compiler optimization from memory.',
        visualEmoji: '🎓',
        hookStory: 'Reading erudite research papers on LLM transformer architecture.'
      }
    }
  },
  {
    id: 'word-adept',
    word: 'Adept',
    meaning: 'Very skilled or proficient at something.',
    pronunciation: '/uh-DEPT/',
    ipa: '/əˈdept/',
    partOfSpeech: 'adjective',
    example: 'He is adept at mediating heated arguments and finding common ground.',
    example2: 'She quickly became adept at negotiating multi-million dollar contracts.',
    synonyms: ['Skillful', 'Expert', 'Proficient', 'Talented', 'Dexterous'],
    antonyms: ['Clumsy', 'Incompetent', 'Inept', 'Amateur'],
    difficulty: 'Beginner',
    category: 'Interview Vocabulary',
    origin: 'From Latin adeptus ("having attained or acquired skill", from adipisci "to obtain").',
    relatedWords: ['Adeptly', 'Adeptness'],
    defaultMnemonic: 'Think: "Adept vs Inept" (A = Ace skill, In = Incompetent).',
    defaultVisualEmoji: '🎯',
    personalizedMnemonics: {
      Gaming: {
        interest: 'Gaming',
        trick: 'An adept sniper who lands headshots while sliding across the map.',
        visualEmoji: '🎮',
        hookStory: 'Mastering weapon recoil patterns makes you an adept combatant.'
      },
      Cricket: {
        interest: 'Cricket',
        trick: 'An adept wicketkeeper who anticipates ball spin without flinching.',
        visualEmoji: '🧤',
        hookStory: 'An adept captain knows the exact bowler to deploy for the final death over.'
      }
    }
  },
  {
    id: 'word-fastidious',
    word: 'Fastidious',
    meaning: 'Very attentive to and concerned about accuracy and detail; very hard to please.',
    pronunciation: '/fas-TID-ee-us/',
    ipa: '/fæˈstɪdiəs/',
    partOfSpeech: 'adjective',
    example: 'The Michelin-star chef was fastidious about the plating temperature of every dish.',
    example2: 'He was fastidious about keeping his desk spotless and aligned.',
    synonyms: ['Meticulous', 'Fussy', 'Perfectionist', 'Critical', 'Exact'],
    antonyms: ['Carefree', 'Lax', 'Indifferent', 'Sloppy'],
    difficulty: 'Advanced',
    category: 'Competitive Exams',
    origin: 'From Latin fastidium ("loathing, distaste, squeamishness").',
    relatedWords: ['Fastidiousness', 'Fastidiously'],
    defaultMnemonic: 'Think: "FASTIDIOUS = Fast to get TIDY, insists on everything being spotless".',
    defaultVisualEmoji: '✨',
    personalizedMnemonics: {
      Cooking: {
        interest: 'Cooking',
        trick: 'A fastidious pastry chef measuring sugar on milligram scales for perfect macarons.',
        visualEmoji: '🧁',
        hookStory: 'If the chocolate sauce is 1 degree too hot, the fastidious chef remakes it.'
      },
      Tech: {
        interest: 'Tech',
        trick: 'A fastidious linter that rejects a pull request for trailing whitespace.',
        visualEmoji: '🧹',
        hookStory: 'Setting strict TypeScript type checking satisfies even the most fastidious architect.'
      }
    }
  },
  {
    id: 'word-taciturn',
    word: 'Taciturn',
    meaning: 'Reserved or uncommunicative in speech; saying little.',
    pronunciation: '/TAS-ih-turn/',
    ipa: '/ˈtæsɪtɜːrn/',
    partOfSpeech: 'adjective',
    example: 'After a grueling day, the investigator grew quiet and taciturn.',
    example2: 'Her taciturn demeanor masked a sharp and observant intellect.',
    synonyms: ['Untalkative', 'Reticent', 'Quiet', 'Silent', 'Reserved', 'Mute'],
    antonyms: ['Loquacious', 'Talkative', 'Garrulous', 'Voluble'],
    difficulty: 'Mastery',
    category: 'Literature & Arts',
    origin: 'From Latin taciturnus (from tacitus "silent").',
    relatedWords: ['Taciturnity', 'Tacit', 'Tacitly'],
    defaultMnemonic: 'Think: "TACITURN = Takes a turn to talk, otherwise silent like a mime".',
    defaultVisualEmoji: '🤫',
    personalizedMnemonics: {
      Cinema: {
        interest: 'Cinema',
        trick: 'Think of the classic taciturn lone ranger or John Wick who lets actions do the talking.',
        visualEmoji: '🤠',
        hookStory: 'The taciturn protagonist enters the saloon, drinks silently, and leaves without a word.'
      },
      Anime: {
        interest: 'Anime',
        trick: 'Think of Levi Ackerman or Sasuke: calm, taciturn, and lethal.',
        visualEmoji: '⚔️',
        hookStory: 'The taciturn swordsman simply draws his blade rather than indulging in villain monologues.'
      }
    }
  },
  {
    id: 'word-pernicious',
    word: 'Pernicious',
    meaning: 'Having a harmful effect, especially in a gradual or subtle way.',
    pronunciation: '/per-NISH-us/',
    ipa: '/pərˈnɪʃəs/',
    partOfSpeech: 'adjective',
    example: 'Spreading rumors had a pernicious effect on company morale over several months.',
    example2: 'The pernicious habits of poor sleep slowly degraded athletic performance.',
    synonyms: ['Harmful', 'Destructive', 'Insidious', 'Deleterious', 'Malignant'],
    antonyms: ['Beneficial', 'Innocuous', 'Harmless', 'Wholesome'],
    difficulty: 'Advanced',
    category: 'Competitive Exams',
    origin: 'From Latin perniciosus ("ruinous, destructive", from pernicies "ruin, death").',
    relatedWords: ['Perniciously', 'Perniciousness'],
    defaultMnemonic: 'Think: "Pernicious = Poisonous & Vicious over time".',
    defaultVisualEmoji: '☣️',
    personalizedMnemonics: {
      Gaming: {
        interest: 'Gaming',
        trick: 'A poison damage-over-time (DoT) debuff that subtly chips away your health bar.',
        visualEmoji: '☠️',
        hookStory: 'The boss inflicts a pernicious curse that slows movement speed by 1% each second.'
      },
      Tech: {
        interest: 'Tech',
        trick: 'A slow memory leak is a pernicious bug that crashes production servers after three weeks.',
        visualEmoji: '📉',
        hookStory: 'Subtle technical debt has a pernicious compounding effect on sprint velocity.'
      }
    }
  }
];

export const PRESET_ACHIEVEMENTS = [
  {
    id: 'first-step',
    title: 'First Word Master',
    description: 'Learn and review your very first vocabulary word.',
    icon: '🌱',
    unlockedAt: '2026-08-15T10:00:00Z',
    progress: 100
  },
  {
    id: 'streak-3',
    title: 'Habit Builder',
    description: 'Maintain a 3-day active learning streak.',
    icon: '🔥',
    unlockedAt: '2026-08-18T10:00:00Z',
    progress: 100
  },
  {
    id: 'streak-7',
    title: 'Unstoppable Momentum',
    description: 'Maintain a 7-day active learning streak.',
    icon: '⚡',
    unlockedAt: '2026-08-20T10:00:00Z',
    progress: 100
  },
  {
    id: 'quiz-ace',
    title: 'Quiz Prodigy',
    description: 'Score 100% on any AI-generated vocabulary quiz.',
    icon: '🎯',
    unlockedAt: '2026-08-19T14:30:00Z',
    progress: 100
  },
  {
    id: 'mnemonic-explorer',
    title: 'Memory Architect',
    description: 'Unlock personalized interest-based mnemonics for 5+ words.',
    icon: '🧠',
    unlockedAt: '2026-08-20T12:00:00Z',
    progress: 100
  },
  {
    id: 'retention-champion',
    title: 'Spaced Repetition Pro',
    description: 'Reach a SM-2 repetition interval of 14+ days on 3 words.',
    icon: '🏆',
    unlockedAt: null,
    progress: 66
  },
  {
    id: 'weak-word-slayer',
    title: 'Radar Conqueror',
    description: 'Remediate and rescue 3 struggling words from the Weak Word Radar.',
    icon: '🛡️',
    unlockedAt: null,
    progress: 40
  },
  {
    id: 'polyglot-grand',
    title: 'Grand Lexicographer',
    description: 'Master 25 vocabulary words with 100% retention.',
    icon: '👑',
    unlockedAt: null,
    progress: 48
  }
];

export const DEFAULT_STUDENT_PROFILE = {
  id: 'student-prathibha',
  name: 'Prathibha',
  email: 'prathibha@learning.edu',
  avatarUrl: '',
  learningLevel: 'Intermediate' as const,
  targetCategory: 'Competitive Exams' as const,
  dailyGoalWords: 10,
  interests: ['Cricket', 'Tech', 'Cinema', 'Gaming'],
  xp: 1240,
  level: 8,
  levelTitle: 'Vocabulary Explorer',
  currentStreak: 7,
  longestStreak: 12,
  lastActiveDate: new Date().toISOString().split('T')[0],
  wordsLearnedCount: 12,
  wordsMasteredCount: 6,
  achievements: PRESET_ACHIEVEMENTS,
  createdAt: '2026-08-01T08:00:00Z'
};

export const INITIAL_USER_PROGRESS: Record<string, UserWordProgress> = {
  'word-meticulous': {
    wordId: 'word-meticulous',
    status: 'mastered',
    easeFactor: 2.65,
    intervalDays: 14,
    repetitionCount: 4,
    lastReviewed: '2026-08-18T10:00:00Z',
    nextReviewDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    consecutiveCorrect: 4,
    totalAttempts: 5,
    forgotCount: 0,
    retentionRiskScore: 12
  },
  'word-ubiquitous': {
    wordId: 'word-ubiquitous',
    status: 'reviewing',
    easeFactor: 2.5,
    intervalDays: 3,
    repetitionCount: 2,
    lastReviewed: new Date(Date.now() - 4 * 86400000).toISOString(),
    nextReviewDate: new Date(Date.now() - 1 * 86400000).toISOString(), // Due now!
    consecutiveCorrect: 2,
    totalAttempts: 3,
    forgotCount: 1,
    retentionRiskScore: 68
  },
  'word-ephemeral': {
    wordId: 'word-ephemeral',
    status: 'learning',
    easeFactor: 2.3,
    intervalDays: 1,
    repetitionCount: 1,
    lastReviewed: new Date(Date.now() - 2 * 86400000).toISOString(),
    nextReviewDate: new Date(Date.now() - 12 * 3600000).toISOString(), // Due now!
    consecutiveCorrect: 1,
    totalAttempts: 3,
    forgotCount: 2,
    retentionRiskScore: 78
  },
  'word-resilient': {
    wordId: 'word-resilient',
    status: 'mastered',
    easeFactor: 2.7,
    intervalDays: 21,
    repetitionCount: 5,
    lastReviewed: '2026-08-16T10:00:00Z',
    nextReviewDate: new Date(Date.now() + 15 * 86400000).toISOString(),
    consecutiveCorrect: 5,
    totalAttempts: 5,
    forgotCount: 0,
    retentionRiskScore: 18
  },
  'word-ambiguous': {
    wordId: 'word-ambiguous',
    status: 'struggling',
    easeFactor: 1.6,
    intervalDays: 0.5,
    repetitionCount: 0,
    lastReviewed: new Date(Date.now() - 1 * 86400000).toISOString(),
    nextReviewDate: new Date(Date.now() - 6 * 3600000).toISOString(), // High urgency due now!
    consecutiveCorrect: 0,
    totalAttempts: 6,
    forgotCount: 4,
    retentionRiskScore: 92,
    remediationHistory: [
      {
        date: '2026-08-19T15:00:00Z',
        reason: 'Confused between Ambiguous (unclear meaning) and Ambivalent (mixed feelings).',
        newMnemonic: 'Think: "AMBI = Both/Two possible meanings". A coin standing on edge is ambiguous.',
        newExample: 'The referee made an ambiguous hand signal that confused both captains.'
      }
    ]
  },
  'word-pragmatic': {
    wordId: 'word-pragmatic',
    status: 'reviewing',
    easeFactor: 2.2,
    intervalDays: 2,
    repetitionCount: 2,
    lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(),
    nextReviewDate: new Date(Date.now() - 8 * 3600000).toISOString(), // Due now!
    consecutiveCorrect: 1,
    totalAttempts: 4,
    forgotCount: 2,
    retentionRiskScore: 74
  },
  'word-inevitable': {
    wordId: 'word-inevitable',
    status: 'reviewing',
    easeFactor: 2.5,
    intervalDays: 4,
    repetitionCount: 3,
    lastReviewed: new Date(Date.now() - 5 * 86400000).toISOString(),
    nextReviewDate: new Date(Date.now() - 2 * 86400000).toISOString(), // Due now!
    consecutiveCorrect: 2,
    totalAttempts: 3,
    forgotCount: 1,
    retentionRiskScore: 62
  },
  'word-concise': {
    wordId: 'word-concise',
    status: 'mastered',
    easeFactor: 2.8,
    intervalDays: 30,
    repetitionCount: 6,
    lastReviewed: '2026-08-10T10:00:00Z',
    nextReviewDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    consecutiveCorrect: 6,
    totalAttempts: 6,
    forgotCount: 0,
    retentionRiskScore: 10
  },
  'word-galvanize': {
    wordId: 'word-galvanize',
    status: 'learning',
    easeFactor: 2.4,
    intervalDays: 1,
    repetitionCount: 1,
    lastReviewed: new Date(Date.now() - 1 * 86400000).toISOString(),
    nextReviewDate: new Date(Date.now() + 12 * 3600000).toISOString(),
    consecutiveCorrect: 1,
    totalAttempts: 2,
    forgotCount: 1,
    retentionRiskScore: 45
  },
  'word-synergistic': {
    wordId: 'word-synergistic',
    status: 'mastered',
    easeFactor: 2.6,
    intervalDays: 18,
    repetitionCount: 4,
    lastReviewed: '2026-08-12T10:00:00Z',
    nextReviewDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    consecutiveCorrect: 4,
    totalAttempts: 4,
    forgotCount: 0,
    retentionRiskScore: 15
  },
  'word-conundrum': {
    wordId: 'word-conundrum',
    status: 'reviewing',
    easeFactor: 2.35,
    intervalDays: 3,
    repetitionCount: 2,
    lastReviewed: new Date(Date.now() - 4 * 86400000).toISOString(),
    nextReviewDate: new Date(Date.now() - 10 * 3600000).toISOString(), // Due now!
    consecutiveCorrect: 2,
    totalAttempts: 3,
    forgotCount: 1,
    retentionRiskScore: 58
  },
  'word-lucid': {
    wordId: 'word-lucid',
    status: 'mastered',
    easeFactor: 2.8,
    intervalDays: 25,
    repetitionCount: 5,
    lastReviewed: '2026-08-14T10:00:00Z',
    nextReviewDate: new Date(Date.now() + 18 * 86400000).toISOString(),
    consecutiveCorrect: 5,
    totalAttempts: 5,
    forgotCount: 0,
    retentionRiskScore: 8
  }
};
