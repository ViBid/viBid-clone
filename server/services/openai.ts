import OpenAI from "openai";
import { SearchParams } from "@shared/schema";

// Ensure we have the OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.warn("Warning: OPENAI_API_KEY is not set. AI features will not work correctly.");
}

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Parse natural language property search query into structured search parameters
 */
export async function parseSearchQuery(query: string, language: string = 'en'): Promise<SearchParams> {
  try {
    const systemPrompt = language === 'ar' 
      ? "أنت محلل عقارات محترف. حلل استفسار البحث وقم بتحويله إلى معايير بحث منظمة. استجب بكائن JSON فقط."
      : "You are a professional real estate analyst. Analyze the search query and convert it to structured search criteria. Respond with a JSON object only.";
    
    const userPrompt = language === 'ar' 
      ? `حلل استفسار البحث التالي عن العقارات وقم بتحويله إلى معايير بحث هيكلية: "${query}". 
      استخرج المعلومات التالية إن وجدت: الغرض (شراء/إيجار/تجاري)، نوع العقار، الموقع، نطاق السعر (الحد الأدنى والأقصى)، 
      عدد غرف النوم، عدد الحمامات، المساحة (الحد الأدنى والأقصى). قدم الإخراج بتنسيق JSON فقط، بدون أي نص إضافي.`
      : `Analyze the following real estate search query and convert it to structured search criteria: "${query}".
      Extract the following information if present: purpose (buy/rent/commercial), property type, location, price range (min and max),
      number of bedrooms, number of bathrooms, area (min and max). Provide the output in JSON format only, with no additional text.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || '{}';
    const result = JSON.parse(content);
    
    // Convert purpose string to the format expected by the API
    if (result.purpose) {
      if (["buy", "purchase", "buying"].includes(result.purpose.toLowerCase())) {
        result.purpose = "buy";
      } else if (["rent", "rental", "renting", "lease", "leasing"].includes(result.purpose.toLowerCase())) {
        result.purpose = "rent";
      } else if (["commercial", "business", "office"].includes(result.purpose.toLowerCase())) {
        result.purpose = "commercial";
      }
    }
    
    return result as SearchParams;
  } catch (error) {
    console.error("Error parsing search query:", error);
    return {};
  }
}

/**
 * Generate property insights using AI
 */
export async function generatePropertyInsights(propertyData: any, language: string = 'en') {
  try {
    const systemPrompt = language === 'ar' 
      ? "أنت محلل عقارات خبير. قدم تحليلًا وملاحظات حول العقار التالي. كن موضوعيًا وقدم رؤى مفيدة."
      : "You are an expert real estate analyst. Provide analysis and observations about the following property. Be objective and provide useful insights.";
    
    const userPrompt = language === 'ar' 
      ? `قم بتحليل العقار التالي وقدم رؤى مفيدة للمشترين المحتملين: ${JSON.stringify(propertyData)}`
      : `Analyze the following property and provide useful insights for potential buyers: ${JSON.stringify(propertyData)}`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating property insights:", error);
    return null;
  }
}

/**
 * Process a message for the AI property consultant chatbot
 */
export async function processPropertyConsultantMessage(messages: any[], language: string = 'en') {
  try {
    const systemMessage = language === 'ar'
      ? `أنت مستشار عقارات محترف ومفيد يساعد العملاء في العثور على العقارات المناسبة. أنت متخصص في سوق العقارات في دبي والإمارات العربية المتحدة. 
         قدم معلومات دقيقة ومفيدة حول العقارات، وأسعار السوق، والمناطق، والاستثمارات، ونصائح الشراء/الإيجار. 
         استخدم لغة محترفة وودية. كن مفيدًا واستجب لجميع الاستفسارات بطريقة مفيدة.`
      : `You are a professional and helpful real estate consultant who assists clients in finding suitable properties. You specialize in the Dubai and UAE real estate market.
         Provide accurate and helpful information about properties, market prices, areas, investments, and buying/renting tips.
         Use professional and friendly language. Be helpful and respond to all queries in a helpful manner.`;

    // Prepare the messages array for OpenAI with the system message first
    const aiMessages = [
      { role: "system", content: systemMessage },
      ...messages
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: aiMessages,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error processing consultant message:", error);
    return language === 'ar' 
      ? "عذراً، واجهت خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى لاحقاً."
      : "Sorry, I encountered an error processing your message. Please try again later.";
  }
}

/**
 * Translate text between languages 
 */
export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: `You are a professional translator. Translate the following text from ${sourceLang} to ${targetLang}. Provide only the translated text with no additional information.` 
        },
        { role: "user", content: text }
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error translating text:", error);
    return text; // Return original text if translation fails
  }
}