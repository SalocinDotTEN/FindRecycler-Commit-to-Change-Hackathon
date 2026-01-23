
import { GoogleGenAI } from "@google/genai";
import { RecyclingFacility, GroundingSource } from "../types";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findFacilitiesNearby = async (lat: number, lng: number, query: string = "recycling centers") => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${query} near my location`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    // Access .text property directly (do not call as method)
    const text = response.text || "I found some recycling facilities nearby.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = chunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        title: chunk.maps.title,
        uri: chunk.maps.uri
      }));

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Sorry, I couldn't fetch real-time data right now.", sources: [] };
  }
};

export const chatWithAssistant = async (message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: "You are FindRecycler Assistant. You help users understand how to recycle materials, the environmental impact of recycling, and where to find local facilities. Be friendly and environmentally focused.",
        tools: [{ googleSearch: {} }]
      }
    });

    // Access .text property directly (do not call as method)
    const text = response.text || "I'm sorry, I couldn't process that request.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return { text, sources };
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return { text: "Oops, something went wrong with the AI assistant.", sources: [] };
  }
};
