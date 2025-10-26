import { GoogleGenAI, Type } from "@google/genai";
import { ACCOUNTING_ACCOUNTS } from '../constants';
import type { InvoiceData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    invoiceNumber: { type: Type.STRING, description: "The invoice number." },
    invoiceDate: { type: Type.STRING, description: "The invoice date in DD.MM.YYYY format." },
    totalNet: { type: Type.NUMBER, description: "The total net amount." },
    totalTax: { type: Type.NUMBER, description: "The total tax amount (MwSt.)." },
    totalGross: { type: Type.NUMBER, description: "The total gross amount (Brutto)." },
    lineItems: {
      type: Type.ARRAY,
      description: "An array of all line items from the invoice.",
      items: {
        type: Type.OBJECT,
        properties: {
          pos: { type: Type.INTEGER, description: "The position number of the line item." },
          articleNumber: { type: Type.STRING, description: "The article number (A.Nr), if available." },
          description: { type: Type.STRING, description: "The description of the article (Artikelbezeichnung)." },
          quantity: { type: Type.NUMBER, description: "The quantity (Menge) of the item." },
          unitPrice: { type: Type.NUMBER, description: "The price per unit (Preis)." },
          totalPrice: { type: Type.NUMBER, description: "The total price for the line item (Betrag)." },
          taxRate: { type: Type.NUMBER, description: "The tax rate percentage (S%) for the item." },
          suggestedAccountNumber: { type: Type.STRING, description: "The suggested accounting account number from the provided list." }
        },
        required: ["pos", "description", "quantity", "unitPrice", "totalPrice", "taxRate", "suggestedAccountNumber"]
      }
    }
  },
  required: ["invoiceNumber", "invoiceDate", "totalNet", "totalTax", "totalGross", "lineItems"]
};

export const analyzeInvoice = async (imageBase64: string, mimeType: string): Promise<InvoiceData> => {
  const accountsString = JSON.stringify(ACCOUNTING_ACCOUNTS.map(a => ({number: a.number, name: a.name, description: a.description})), null, 2);

  const prompt = `
    You are an expert AI assistant for accounting, specialized in parsing German invoices and categorizing line items.
    Your task is to analyze the provided invoice document (image or PDF) and do the following:
    1. Extract key invoice details: invoice number (Rg.-Nummer), invoice date (Rg.-Datum), total net amount (Netto), total tax amount (MwSt. EUR), and total gross amount (RG Betrag -Euro or Brutto).
    2. Extract all line items. For each item, capture the position (Pos), article number (A.Nr), description (Artikelbezeichnung), quantity (Menge), unit price (Preis), total price (Betrag), and tax rate (S%).
    3. For each line item, suggest the most appropriate accounting account number from the chart of accounts provided below. Base your suggestion on the item's description. For example, if an item is 'Döner ekmegi', suggest '5308' (Dönerbrot). If an item is 'lahmacun', suggest '5309' (Lahmacun).
    4. Return all extracted data in a single, valid JSON object that adheres to the provided schema. Ensure all monetary values are numbers (e.g., 644,63 becomes 644.63).

    Chart of Accounts:
    ${accountsString}
  `;

  const imagePart = {
    inlineData: {
      mimeType,
      data: imageBase64,
    },
  };
  const textPart = { text: prompt };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonString = response.text;
    return JSON.parse(jsonString) as InvoiceData;

  } catch (error) {
    console.error("Error analyzing invoice with Gemini:", error);
    throw new Error("Failed to analyze the invoice. The AI model could not process the request.");
  }
};