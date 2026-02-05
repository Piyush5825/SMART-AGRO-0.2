
import { GoogleGenAI, Modality, Type } from "@google/genai";

let currentAudioSource: AudioBufferSourceNode | null = null;
let audioContext: AudioContext | null = null;

const handleAIError = (error: any): string => {
  console.error("AI API Error:", error);
  if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota")) {
    return "क्षमस्व, एआय कोटा संपला आहे. कृपया थोड्या वेळाने प्रयत्न करा.";
  }
  return "तांत्रिक अडचण आली आहे. कृपया पुन्हा प्रयत्न करा.";
};

/**
 * Optimized AI Audio Player for Marathi responses.
 */
export const speakMarathi = async (text: string) => {
  try {
    window.speechSynthesis.cancel();
    if (currentAudioSource) {
      try {
        currentAudioSource.stop();
      } catch (e) {}
      currentAudioSource = null;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `मराठीत स्पष्ट आणि अत्यंत थोडक्यात बोला: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      await playRawPcm(base64Audio);
    }
  } catch (e) {
    console.warn("Gemini TTS failed, using Web Speech fallback", e);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'mr-IN';
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  }
};

const playRawPcm = async (base64: string) => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    currentAudioSource = source;
    source.start();
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

export const getFertilizerAdvice = async (params: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `खत व्यवस्थापन सल्ला (Fertilizer Management):
    पीक: ${params.targetCrop}, क्षेत्र: ${params.landArea} एकर, माती: ${params.soilType}.
    माती परीक्षण माहिती (असल्यास): नत्र(N): ${params.nLevel}, स्फुरद(P): ${params.pLevel}, पालाश(K): ${params.kLevel}.
    मागील पीक: ${params.prevCrop}.

    कृपया खालील माहिती मराठीत JSON फॉरमॅटमध्ये द्या:
    {
      "cropName": "पिकाचे नाव",
      "soilSummary": "मातीची स्थिती आणि आवश्यकतेचा थोдक्यात आढावा",
      "schedules": [
        {
          "stage": "टप्पा (उदा. पायाभूत डोस / फुटव्याच्या वेळी)",
          "timing": "वेळ (उदा. पेरणीच्या वेळी)",
          "fertilizers": ["खतांची नावे उदा. Urea, DAP"],
          "quantity": "प्रमाण (उदा. २ गोण्या प्रति एकर)",
          "method": "देण्याची पद्धत"
        }
      ],
      "organicTips": "सेंद्रिय खते आणि जिवाणू खतांचा वापर",
      "warningNotice": "महत्त्वाची सूचना किंवा इशारा"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error(handleAIError(error));
  }
};

export const getSowingAdvice = async (params: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `शेती पेरणी सल्ला (Sowing Advice):
    माहिती: क्षेत्रफळ ${params.landArea} एकर, माती ${params.soilType}, हंगाम ${params.season}, ओलावा ${params.soilMoisture}, पाऊस ${params.lastRainfall}.
    कृपया खालील बाबींवर अत्यंत थोडक्यात मराठीत सल्ला द्या:
    १. ट्रॅक्टर चालवण्याची योग्य वेळ (अचूक दिवस/वेळ).
    २. पाण्याची टक्केवारी (किती पाणी द्यावे %).
    ३. पेरणीची खोली आणि अंतर.
    
    उत्तर JSON फॉरमॅटमध्ये द्या:
    {
      "tractorTiming": "ट्रॅक्टर चालवण्याची वेळ",
      "waterPercentage": "पाण्याची टक्केवारी",
      "depthAndSpacing": "खोली आणि अंतर",
      "proTip": "महत्त्वाची टीप"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error(handleAIError(error));
  }
};

export const agroChat = async (message: string, profile: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `तुम्ही 'स्मार्ट अ‍ॅग्रो' एआय सहाय्यक आहात. 
    नाव: ${profile.name || 'शेतकरी'}. नियम: १. फक्त मराठीत बोला. २. अत्यंत थोडक्यात उत्तर द्या. ३. थेट मुद्द्यावर बोला. ४. जर प्रश्न शेतीबाहेरचा असेल तर नम्रपणे नकार द्या.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: { 
        systemInstruction, 
        temperature: 0.5,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text || "क्षमस्व, मी आता उत्तर देऊ शकत नाही.";
  } catch (error) {
    return handleAIError(error);
  }
};

export const getSmartAgroAdvice = async (params: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `तुम्ही एक तज्ज्ञ कृषी सल्लागार आहात. महाराष्ट्र राज्यातील एका शेतकऱ्यासाठी खालील माहितीच्या आधारे सविस्तर शिफारसी करा:
    क्षेत्रफळ: ${params.landArea} एकर, मातीचा प्रकार: ${params.soilType}, pH पातळी: ${params.pH}, हंगाम: ${params.season}.

    कृपया खालील नेमक्या JSON फॉरमॅटमध्ये उत्तर द्या:
    {
      "recommendations": [
        {
          "cropName": "पिकाचे नाव",
          "expectedYield": "अपेक्षित उत्पन्न (उदा. १०-१२ क्विंटल)",
          "estimatedProfit": "अंदाजित नफा (रु. प्रति एकर)",
          "fertilizerPlan": "खत व्यवस्थापनाचा थोडक्यात सल्ला",
          "irrigationStrategy": "पाणी देण्याचे नियोजन",
          "soilAdvice": "माती सुधारण्यासाठी सल्ला"
        }
      ],
      "futureAdvice": {
        "investmentAdvice": "गुंतवणूक सल्ला",
        "marketPrediction": "बाजारभाव अंदाज",
        "cropTransitionAdvice": "पीक बदल सल्ला",
        "riskMitigation": "धोका निवारण उपाय"
      }
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json", 
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error(handleAIError(error));
  }
};

export const getFuturePlannerAdvice = async (profile: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `दीर्घकालीन कृषी नियोजन JSON: { "marketPrediction": "...", "investmentAdvice": "...", "cropTransitionAdvice": "...", "riskMitigation": "..." }
    प्रोफाइल: ${JSON.stringify(profile)}. मराठीत उत्तर द्या.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error(handleAIError(error));
  }
};

export const fetchAgroNews = async (district: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `महाराष्ट्र आणि ${district} जिल्ह्यासाठी ताज्या कृषी बातम्या आणि सरकारी योजनांची यादी JSON फॉरमॅटमध्ये द्या:
    {
      "news": [
        { "id": "1", "title": "बातम्यांचे शीर्षक", "content": "बातम्यांचा सारांश", "date": "तारीख", "source": "स्त्रोत" }
      ]
    }
    फक्त मराठीत लिहा.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) { return { news: [] }; }
};

export const inspectCrop = async (mediaBase64: string, mimeType: string = "image/jpeg") => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `You are a World-Class Fast Crop Diagnostic Expert. Analyze the provided ${mimeType.startsWith('video') ? 'video frames' : 'image'} carefully.
    
    Output strictly in JSON format in the Marathi language.
    
    IMPORTANT: For treatment, fertilizers, and herbicides, you MUST provide SPECIFIC DOSAGE (प्रमाण) based on the CROP AGE or SIZE (पिकाची अवस्था) detected in the media.
    
    JSON Schema: {
      "cropName": "पिकाचे नाव",
      "diseaseName": "रोगाचे नाव किंवा 'निरोगी'",
      "accuracy": 0-100,
      "explanation": "रोगाची कारणे आणि लक्षणे",
      "treatment": "तात्काळ मुख्य उपचार",
      "cropStage": "पिकाची अवस्था/वय (उदा. ३० दिवसांचे रोप, किंवा मोठे फळझाड)",
      "fertilizerDetails": {
        "name": "खताचे नाव",
        "dosage": "अचूक प्रमाण (उदा. ५० ग्रॅम प्रति झाड, किंवा २ गोण्या प्रति एकर)"
      },
      "herbicideDetails": {
        "name": "कीटकनाशक/औषध नाव",
        "dosage": "अचूक प्रमाण (उदा. २ मिली प्रति लिटर पाणी)"
      },
      "compostDetails": {
        "name": "सेंद्रिय खत/कंपोस्ट नाव",
        "dosage": "अचूक प्रमाण (उदा. ५ किलो प्रति झाड)"
      },
      "preventiveMeasures": "भविष्यातील खबरदारी",
      "isSafe": boolean (फळ/पीक खाण्यासाठी सुरक्षित आहे का)
    }`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ 
        parts: [
          { inlineData: { data: mediaBase64, mimeType: mimeType } },
          { text: "या पिकाचे विश्लेषण करा आणि पिकाचे वय/आकार ओळखून खत, औषध आणि कंपोस्टचे अचूक प्रमाण सांगा." }
        ]
      }],
      config: { 
        responseMimeType: "application/json",
        systemInstruction,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) { 
    throw new Error(handleAIError(error)); 
  }
};
