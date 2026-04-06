import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyD2nTsTHJsnKotMhgrVNtRh0gdwM0yra98");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
model.generateContent("hello").then(r => console.log(r)).catch(e => { console.error("Message:", e.message); console.error("Status:", e.status); });
