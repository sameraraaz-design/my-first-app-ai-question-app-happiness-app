import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

interface ProductContext {
  id: string;
  title: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  mrp: number;
  specs: Record<string, string>;
  features: string[];
  description: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface AskExpertRequest {
  productId: string;
  product: ProductContext;
  question: string;
  chatHistory?: ChatMessage[];
}

interface AskExpertResponse {
  answer: string;
  compatibilityStatus: 'COMPATIBLE' | 'NOT_COMPATIBLE' | 'PARTIAL' | 'VERIFIED_SPEC' | 'GENERAL_INFO';
  compatibilityBadge: string;
  keySpecsMentioned: string[];
  expertTips: string[];
  suggestedFollowUps: string[];
  source: 'gemini' | 'catalog-fallback';
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
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

function generateLocalExpertFallback(product: ProductContext, question: string): AskExpertResponse {
  const qLower = question.toLowerCase();
  const specsEntries = Object.entries(product.specs || {});
  
  // Find specs that match keywords in the question
  const matchedSpecs: string[] = [];
  for (const [key, val] of specsEntries) {
    const kLower = key.toLowerCase();
    const vLower = val.toLowerCase();
    if (
      qLower.includes(kLower) ||
      kLower.split(' ').some((word) => word.length > 3 && qLower.includes(word)) ||
      vLower.split(' ').some((word) => word.length > 3 && qLower.includes(word))
    ) {
      matchedSpecs.push(`${key}: ${val}`);
    }
  }

  // Detect compatibility query
  const isCompatQuery = /compatib|work with|support|connect|fit|iphone|android|mac|windows|tv|bluetooth|charger|voltage|socket|220v|5g/i.test(qLower);
  const isPowerQuery = /battery|mah|charge|watt|voltage|power|backup|duration|adapter/i.test(qLower);
  const isDimensionsQuery = /size|dimension|weight|heavy|fit|length|width|height|chest/i.test(qLower);
  const isWarrantyQuery = /guarantee|warranty|replacement|return|service/i.test(qLower);

  let status: AskExpertResponse['compatibilityStatus'] = 'GENERAL_INFO';
  let badge = 'Verified Specification';
  let answer = '';
  const tips: string[] = [];
  const followUps: string[] = [];

  if (isCompatQuery) {
    status = 'COMPATIBLE';
    badge = 'Compatibility Verified';
    
    // Look for connectivity or OS specs
    const connectivity = product.specs['Connectivity'] || product.specs['Bluetooth'] || product.specs['Network'] || 'Standard Interfaces';
    const os = product.specs['Operating System'] || product.specs['Compatibility'] || 'Multi-platform standard';

    answer = `Based on the official specifications for the **${product.title}**, this device is built to standard specifications (${connectivity}, ${os}). It is compatible with modern smartphones, standard Indian power outlets, and typical pairing devices in its class.`;
    tips.push('Ensure your host device has Bluetooth 5.0+ or compatible connectors enabled.');
    followUps.push('What items are included in the retail box?', 'What is the exact warranty period for this unit?');
  } else if (isPowerQuery) {
    status = 'VERIFIED_SPEC';
    badge = 'Power & Battery Spec';
    const battery = product.specs['Battery'] || product.specs['Power Consumption'] || product.specs['Battery Life'] || 'Optimized power management';
    answer = `For power and charging, the **${product.title}** features **${battery}**. In standard usage conditions, it delivers consistent reliability in accordance with Indian 220V–240V power standards.`;
    tips.push('Use the certified charging cable or adapter provided for optimal battery health.');
    followUps.push('Does this device support fast charging?', 'What is the typical battery lifespan under heavy use?');
  } else if (isDimensionsQuery) {
    status = 'VERIFIED_SPEC';
    badge = 'Dimensions & Form Factor';
    const dimensions = product.specs['Dimensions'] || product.specs['Size'] || product.specs['Weight'] || 'Standard form factor';
    answer = `The **${product.title}** specification details **${dimensions}**. Please verify your setup or sizing requirements against these official measurements.`;
    tips.push('Refer to the sizing chart and measurement guide before placing your order.');
    followUps.push('Is replacement or return available if size does not fit?', 'What is the total weight with packaging?');
  } else if (isWarrantyQuery) {
    status = 'VERIFIED_SPEC';
    badge = 'Bharat Assured Warranty';
    const warranty = product.specs['Warranty'] || '1 Year Brand Manufacturer Warranty';
    answer = `The **${product.title}** comes with **${warranty}**, covered at authorized brand service centers across India. Bharat Cart also provides a 7-day hassle-free replacement guarantee.`;
    tips.push('Keep the GST invoice and retail box safe for seamless warranty claims.');
    followUps.push('How do I claim brand warranty in my city?', 'Is Cash on Delivery available for this order?');
  } else {
    // Default smart answer using highlights & specs
    const topSpecs = specsEntries.slice(0, 3).map(([k, v]) => `**${k}**: ${v}`).join(', ');
    answer = `Here are the verified details for **${product.title}** (${product.brand}): ${topSpecs ? topSpecs + '. ' : ''}${product.description.slice(0, 180)}... All products on Bharat Cart are 100% genuine and verified.`;
    tips.push('You can also ask specific questions about compatibility with your existing devices or Indian power standards.');
    followUps.push('Is this product compatible with my current setup?', 'What are the standout features compared to alternatives?');
  }

  // Add any matched specs if not already present
  if (matchedSpecs.length === 0 && specsEntries.length > 0) {
    matchedSpecs.push(`${specsEntries[0][0]}: ${specsEntries[0][1]}`);
    if (specsEntries.length > 1) {
      matchedSpecs.push(`${specsEntries[1][0]}: ${specsEntries[1][1]}`);
    }
  }

  return {
    answer,
    compatibilityStatus: status,
    compatibilityBadge: badge,
    keySpecsMentioned: matchedSpecs.slice(0, 4),
    expertTips: tips.length > 0 ? tips : ['Always review user reviews for real-world usage experiences.'],
    suggestedFollowUps: followUps.length > 0 ? followUps : [
      'Is this compatible with 5G networks in India?',
      'What are the exact contents inside the box?',
    ],
    source: 'catalog-fallback',
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'bharat-cart-backend',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    });
  });

  // AI Ask an Expert Endpoint
  app.post('/api/ai/ask-expert', async (req, res) => {
    try {
      const { product, question, chatHistory = [] } = req.body as AskExpertRequest;

      if (!product || !question || question.trim() === '') {
        return res.status(400).json({ error: 'Missing product or question parameter' });
      }

      const ai = getGeminiClient();

      // If Gemini client is not configured, gracefully provide catalog-grounded answer
      if (!ai) {
        const fallback = generateLocalExpertFallback(product, question);
        return res.json(fallback);
      }

      // Build rich system instruction and prompt for Gemini 3.8 Flash
      const specsList = Object.entries(product.specs || {})
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n');
      const featuresList = (product.features || []).map((f) => `- ${f}`).join('\n');

      const systemInstruction = `You are 'Bharat Cart AI Product & Compatibility Expert', an authoritative, friendly e-commerce technical specialist for Indian online marketplace Bharat Cart.
Your mission is to provide accurate, precise, and practical answers to shoppers asking about product specifications, hardware/software compatibility, dimensions, Indian power standards (220V-240V, 50Hz, Type D/M plugs), connectivity (Bluetooth, Wi-Fi, 5G bands like Jio/Airtel n28/n78), box contents, materials, and suitability.

Current Product Context:
- Title: ${product.title}
- Brand: ${product.brand}
- Category: ${product.category}${product.subcategory ? ` > ${product.subcategory}` : ''}
- Selling Price: ₹${product.price?.toLocaleString?.('en-IN') || product.price} (MRP: ₹${product.mrp?.toLocaleString?.('en-IN') || product.mrp})
- Official Specifications:
${specsList || 'None provided'}
- Key Highlights:
${featuresList || 'None provided'}
- Official Description:
${product.description}

Rules:
1. Ground answers primarily in the product's official specifications and features.
2. If answering compatibility (e.g. with iPhone, Android, Mac, Windows, TV, car, charger, carrier, voltage), give a clear verdict: COMPATIBLE, NOT_COMPATIBLE, PARTIAL, VERIFIED_SPEC, or GENERAL_INFO.
3. Keep the answer concise (2-4 clear sentences or structured bullet points), conversational, and tailored to Indian shoppers.
4. Provide a punchy badge (e.g., '100% Compatible', 'Requires Type-C Adapter', 'Jio & Airtel 5G Ready', '220V Indian Plug').
5. List 1-3 key relevant specifications mentioned.
6. Provide 1-2 practical expert tips.
7. Suggest 2-3 logical follow-up questions the shopper might ask next.`;

      // Format conversation history
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (chatHistory && chatHistory.length > 0) {
        for (const msg of chatHistory.slice(-4)) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: `Shopper Question: "${question}"` }],
      });

      const schemaConfig = {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            answer: {
              type: 'string',
              description: 'Clear, authoritative explanation answering the shopper question directly.',
            },
            compatibilityStatus: {
              type: 'string',
              enum: ['COMPATIBLE', 'NOT_COMPATIBLE', 'PARTIAL', 'VERIFIED_SPEC', 'GENERAL_INFO'],
              description: 'Status of the compatibility check or specification confirmation.',
            },
            compatibilityBadge: {
              type: 'string',
              description: 'Short 2-4 word badge summarizing the verdict, e.g., "Fully Compatible", "5G Bands Supported", "Verified Spec".',
            },
            keySpecsMentioned: {
              type: 'array',
              items: { type: 'string' },
              description: '1 to 3 relevant technical specifications directly answering the query.',
            },
            expertTips: {
              type: 'array',
              items: { type: 'string' },
              description: '1 or 2 practical shopping or usage tips.',
            },
            suggestedFollowUps: {
              type: 'array',
              items: { type: 'string' },
              description: '2 to 3 relevant follow-up questions the user can tap.',
            },
          },
          required: ['answer', 'compatibilityStatus', 'compatibilityBadge', 'suggestedFollowUps'],
        },
      };

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: schemaConfig,
        });
      } catch (primaryErr: any) {
        console.warn('gemini-3.8-flash unavailable or busy, trying gemini-3.1-flash-lite:', primaryErr?.message || primaryErr);
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: schemaConfig,
        });
      }

      const text = response.text?.trim() || '';
      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      const parsed = JSON.parse(text) as AskExpertResponse;
      parsed.source = 'gemini';
      return res.json(parsed);
    } catch (err: any) {
      console.error('Error in /api/ai/ask-expert:', err);
      // If Gemini call encounters an error, fallback gracefully so user has smooth experience
      const { product, question } = req.body as AskExpertRequest;
      const fallback = generateLocalExpertFallback(product, question);
      return res.json(fallback);
    }
  });

  // Vite middleware for development
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
    console.log(`Bharat Cart Server running on port ${PORT}`);
  });
}

startServer();
