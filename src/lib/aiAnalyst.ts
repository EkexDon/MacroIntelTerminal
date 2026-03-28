import Sentiment from 'sentiment';

const sentiment = new Sentiment();

/**
 * Analyzes the raw text and calculates a math-based AFINN sentiment score.
 * Maps the standard (-20 to +20) lexicon scale into our 0-100 UI threshold.
 */
export function analyzeSentiment(text: string) {
  const result = sentiment.analyze(text);
  
  // Base is 50. Words like "Attack" (-3) drop it, "Growth" (+2) raise it.
  // We use a massive 5x multiplier to make the UI highly reactive to news.
  let normalized = 50 + (result.score * 5);
  
  if (normalized > 100) normalized = 100;
  if (normalized < 0) normalized = 0;

  let label = 'NEUTRAL';
  if (normalized >= 60) label = 'BULLISH';
  if (normalized <= 40) label = 'BEARISH';
  if (normalized <= 20) label = 'RADIOLOGICAL';

  return { 
    score: normalized, 
    label,
    // Add specific extreme trigger words to the response if they exist
    triggers: result.words.length > 0 ? result.words.slice(0, 3) : null 
  };
}

/**
 * A Zero-Cost "Extractive Summarizer" approximating TF-IDF.
 * It mathematically scans an array of articles, finds the most information-dense keywords,
 * and extracts the 3 sentences containing the absolute maximum global data relevance.
 */
export function generateBriefing(texts: string[]): string[] {
  if (!texts || texts.length === 0) return ["No significant intelligence intercepted. Monitoring continuous."];

  // 1. Explode all paragraphs into distinct sentences.
  const rawSentences = texts
    .join('. ')
    .replace(/[!?]/g, '.')
    .split('.')
    .map(s => s.trim())
    .filter(s => s.length > 40 && s.length < 200); // Filter out fragments and massive blocks

  // 2. Count mathematical frequency of significant words across the entire global state.
  const globalFrequency: Record<string, number> = {};
  rawSentences.forEach(sentence => {
    const words = sentence.toLowerCase().match(/\b(\w+)\b/g);
    if (words) {
      words.forEach(w => {
        // Ignore tiny glue words
        if (w.length > 4) {
          globalFrequency[w] = (globalFrequency[w] || 0) + 1;
        }
      });
    }
  });

  // 3. Score each sentence based on its density of high-frequency global keywords.
  const scoredSentences = rawSentences.map(sentence => {
    const words = sentence.toLowerCase().match(/\b(\w+)\b/g) || [];
    let score = 0;
    words.forEach(w => {
      if (w.length > 4) score += globalFrequency[w];
    });
    // Divide by length to heavily penalize run-on "word salad" sentences
    return { sentence, score: score / (words.length || 1) };
  });

  // 4. Sort and extract the absolute Top 3 Intelligence Sentences.
  scoredSentences.sort((a, b) => b.score - a.score);
  
  const extractedBriefing: string[] = [];
  const similaritySet = new Set<string>();

  for (const item of scoredSentences) {
    const root = item.sentence.substring(0, 20); // Basic anti-duplicate check for identical prefixes
    if (!similaritySet.has(root) && extractedBriefing.length < 3) {
      extractedBriefing.push(item.sentence + ".");
      similaritySet.add(root);
    }
  }

  return extractedBriefing.length > 0 ? extractedBriefing : ["Awaiting cross-validation of global metrics."];
}
