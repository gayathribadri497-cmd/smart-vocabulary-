import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. AI Personalized Mnemonic Generator Endpoint
app.post('/api/ai/mnemonic', async (req, res) => {
  try {
    const { word, meaning, interest, studentLevel } = req.body;
    if (!word || !meaning) {
      return res.status(400).json({ error: 'Word and meaning are required' });
    }

    const ai = getGeminiClient();
    const prompt = `You are a memory grandmaster and linguistic expert.
Generate a memorable, punchy, high-retention mnemonic memory aid for the vocabulary word "${word}" (Meaning: "${meaning}").
Target Student Level: ${studentLevel || 'Intermediate'}.
Student's Personal Interest / Hobby Anchor: "${interest || 'General'}".

Requirements:
1. Trick: A short (1-2 sentences) catchy mental trick or soundalike association connecting the word to the student's interest in "${interest}".
2. VisualEmoji: 1 or 2 high-contrast visual emojis representing this memory scene.
3. HookStory: A vivid, memorable 1-2 sentence real-world micro-scenario.
4. RhymeOrChunk: A 3 to 7 word rhythmic phrase or phonetic chunk.

Return strictly JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trick: { type: Type.STRING, description: 'Catchy 1-2 sentence mnemonic association' },
            visualEmoji: { type: Type.STRING, description: '1-2 emojis representing the scene' },
            hookStory: { type: Type.STRING, description: 'Vivid micro-scenario connecting to user interest' },
            rhymeOrChunk: { type: Type.STRING, description: 'Rhythmic memory hook phrase' }
          },
          required: ['trick', 'visualEmoji', 'hookStory', 'rhymeOrChunk']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      data: {
        interest: interest || 'General',
        trick: parsed.trick || `Think: "${word}" sounds like a memorable spark!`,
        visualEmoji: parsed.visualEmoji || '💡',
        hookStory: parsed.hookStory || `Whenever you encounter "${word}", picture this vivid moment.`,
        rhymeOrChunk: parsed.rhymeOrChunk || `${word} = ${meaning.slice(0, 30)}`
      }
    });
  } catch (error: any) {
    console.error('Error generating mnemonic:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate personalized mnemonic'
    });
  }
});

// 2. AI "Why Did I Forget This?" Remediation Endpoint
app.post('/api/ai/remediate', async (req, res) => {
  try {
    const { word, meaning, forgotCount, userInterest, previousConfusion } = req.body;
    if (!word || !meaning) {
      return res.status(400).json({ error: 'Word and meaning are required' });
    }

    const ai = getGeminiClient();
    const prompt = `You are a cognitive psychologist and master learning coach.
The student has struggled or forgotten the word "${word}" (${forgotCount || 2} times).
Meaning: "${meaning}".
Student's Personal Interest: "${userInterest || 'Everyday Life'}".
Previous confusion/notes: "${previousConfusion || 'Kept mixing it up with similar sounding words or vague meanings'}".

Your mission is to perform a cognitive rescue:
1. Diagnose why students commonly forget or confuse this specific word (e.g. false cognates, abstractness, prefix confusion).
2. Create a radically different, ultra-sticky new mnemonic tailored to ${userInterest || 'real world'}.
3. Create a vivid new example sentence that makes the meaning unmistakable.
4. Give a "Memory Anchor" rule of thumb (under 10 words).

Return strictly JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            whyYouForgot: { type: Type.STRING, description: 'Cognitive diagnosis of why this word is tricky' },
            newMnemonic: { type: Type.STRING, description: 'Fresh, unforgettable mnemonic hook' },
            newExample: { type: Type.STRING, description: 'Crystal-clear contextual example sentence' },
            memoryAnchor: { type: Type.STRING, description: 'Punchy 3-8 word memory rule' },
            visualMetaphor: { type: Type.STRING, description: 'A sensory or visual metaphor' },
            emoji: { type: Type.STRING, description: '1-2 representative emojis' }
          },
          required: ['whyYouForgot', 'newMnemonic', 'newExample', 'memoryAnchor', 'visualMetaphor', 'emoji']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      data: parsed
    });
  } catch (error: any) {
    console.error('Error generating remediation:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze memory roadblock'
    });
  }
});

// 3. AI Word Lookup & Deep Generation Endpoint (Look up ANY word)
app.post('/api/ai/word-lookup', async (req, res) => {
  try {
    const { word, category, interest } = req.body;
    if (!word || typeof word !== 'string') {
      return res.status(400).json({ error: 'Word string is required' });
    }

    const ai = getGeminiClient();
    const prompt = `You are an elite lexicographer, dictionary compiler, and vocabulary coach.
Generate a comprehensive vocabulary learning profile for the word "${word.trim()}".
Category target: "${category || 'General'}".
Student interest anchor: "${interest || 'General'}".

Generate:
- meaning: Clear, concise dictionary definition
- pronunciation: Easy phonetic breakdown e.g. /meh-TIK-yuh-lus/
- ipa: Standard International Phonetic Alphabet representation
- partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'idiom'
- example: Engaging primary example sentence
- example2: Secondary real-world context example sentence
- synonyms: 4-5 high-quality synonyms
- antonyms: 3-4 antonyms
- difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery'
- category: 'Academic' | 'Competitive Exams' | 'Business' | 'Technology' | 'Daily English' | 'Interview Vocabulary' | 'Literature & Arts'
- origin: Fascinating concise etymology and word root origin
- relatedWords: 2-3 derivative or related word forms
- defaultMnemonic: Short, memorable mnemonic memory trick
- defaultVisualEmoji: 1-2 expressive emojis
- personalizedTrick: A mnemonic customized to interest: "${interest || 'everyday life'}"

Return strictly JSON matching schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            meaning: { type: Type.STRING },
            pronunciation: { type: Type.STRING },
            ipa: { type: Type.STRING },
            partOfSpeech: { type: Type.STRING, enum: ['noun', 'verb', 'adjective', 'adverb', 'idiom'] },
            example: { type: Type.STRING },
            example2: { type: Type.STRING },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced', 'Mastery'] },
            category: { type: Type.STRING },
            origin: { type: Type.STRING },
            relatedWords: { type: Type.ARRAY, items: { type: Type.STRING } },
            defaultMnemonic: { type: Type.STRING },
            defaultVisualEmoji: { type: Type.STRING },
            personalizedTrick: { type: Type.STRING }
          },
          required: ['word', 'meaning', 'pronunciation', 'partOfSpeech', 'example', 'synonyms', 'antonyms', 'difficulty', 'category', 'defaultMnemonic', 'defaultVisualEmoji']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const wordId = `word-${parsed.word.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;

    const newWord = {
      id: wordId,
      word: parsed.word || word,
      meaning: parsed.meaning,
      pronunciation: parsed.pronunciation || `/${word}/`,
      ipa: parsed.ipa || '',
      partOfSpeech: parsed.partOfSpeech || 'noun',
      example: parsed.example,
      example2: parsed.example2 || '',
      synonyms: parsed.synonyms || [],
      antonyms: parsed.antonyms || [],
      difficulty: parsed.difficulty || 'Intermediate',
      category: parsed.category || 'Academic',
      origin: parsed.origin || '',
      relatedWords: parsed.relatedWords || [],
      defaultMnemonic: parsed.defaultMnemonic || `Think of ${word} in action.`,
      defaultVisualEmoji: parsed.defaultVisualEmoji || '📖',
      personalizedMnemonics: interest ? {
        [interest]: {
          interest,
          trick: parsed.personalizedTrick || parsed.defaultMnemonic,
          visualEmoji: parsed.defaultVisualEmoji || '💡',
          hookStory: `In the context of ${interest}, ${word} stands out clearly.`
        }
      } : {}
    };

    res.json({ success: true, data: newWord });
  } catch (error: any) {
    console.error('Error in word lookup:', error);
    res.status(500).json({ success: false, error: error?.message || 'Failed to generate word profile' });
  }
});

// 4. AI Quiz Generator Endpoint
app.post('/api/ai/quiz', async (req, res) => {
  try {
    const { words, count = 5, studentLevel = 'Intermediate' } = req.body;
    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: 'Word list is required to generate quiz' });
    }

    const ai = getGeminiClient();
    const prompt = `You are an expert test designer and vocabulary evaluator.
Create an adaptive ${count}-question vocabulary quiz using the following words:
${JSON.stringify(words.slice(0, 10).map((w: any) => ({ id: w.id, word: w.word, meaning: w.meaning })))}

Student Level: ${studentLevel}.

Include a variety of question formats:
1. 'multiple-choice': Meaning of word or Word that matches definition (4 distinct, plausible options).
2. 'fill-in-blank': Context sentence with blank '____' (4 word options).
3. 'meaning-to-word': Which word means "..."?
4. 'context-usage': Which scenario correctly applies the word?

Make sure:
- 'options' is an array of 4 distinct choices for every question.
- 'correctAnswer' is exactly one of the strings inside 'options'.
- 'explanation' provides clear rationale and highlights the memory trick.
- 'hint' is a subtle clue.

Return strictly JSON matching schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              wordId: { type: Type.STRING },
              word: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['multiple-choice', 'fill-in-blank', 'meaning-to-word', 'context-usage'] },
              prompt: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
              hint: { type: Type.STRING }
            },
            required: ['id', 'wordId', 'word', 'type', 'prompt', 'options', 'correctAnswer', 'explanation']
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ success: false, error: error?.message || 'Failed to generate quiz' });
  }
});

// 5. AI Deep Tutor Conversation / Explain Endpoint
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { word, meaning, userQuestion, context } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are Socrates & Mary Poppins combined—a charming, razor-sharp vocabulary tutor.
The student is studying the word "${word}" (Meaning: "${meaning}").
Context: ${context || 'General study'}.
Student's Question: "${userQuestion || 'How do native speakers use this in conversation, and what are common mistakes?'}"

Provide a concise (2-3 paragraphs), vivid, pedagogical explanation with:
1. Real-world nuance & tone (formal vs casual vs academic).
2. Common pitfalls/mistakes people make when using this word.
3. A memorable conversational dialogue snippet.

Keep formatting clean with bullet points and bold highlights.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt
    });

    res.json({ success: true, explanation: response.text });
  } catch (error: any) {
    console.error('Error explaining word:', error);
    res.status(500).json({ success: false, error: error?.message || 'Failed to generate tutor explanation' });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Vocabulary Trainer Server running on http://localhost:${PORT}`);
  });
}

startServer();
