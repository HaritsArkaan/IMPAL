import natural from 'natural';
import aposToLexForm from 'apos-to-lex-form';
import SpellCorrector from 'spelling-corrector';
import stopword from 'stopword';

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

const tokenizer = new natural.WordTokenizer();
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

function preprocessText(text) {
const lexedText = aposToLexForm(text);

const casedText = lexedText.toLowerCase();

const alphaOnlyText = casedText.replace(/[^a-zA-Z\s]+/g, '');

const tokens = tokenizer.tokenize(alphaOnlyText);
  
const correctedTokens = tokens.map(token => spellCorrector.correct(token));
  
const filteredTokens = stopword.removeStopwords(correctedTokens);
  
return filteredTokens;
}

function analyzeSentiment(review) {
  const preprocessedReview = preprocessText(review);
  const sentiment = analyzer.getSentiment(preprocessedReview);
  
  if (sentiment > 0) {
    return { score: sentiment, label: 'Positive' };
  } else if (sentiment < 0) {
    return { score: sentiment, label: 'Negative' };
  } else {
    return { score: sentiment, label: 'Neutral' };
  }
}

const reviews = [
  "This snack is absolutely delicious! I love the crunchiness and flavor.",
  "Not impressed. The taste is bland and it's too salty.",
  "It's okay, nothing special but not bad either.",
  "I can't believe how amazing these chips are! Best I've ever had!",
  "Terrible. Wouldn't recommend to anyone. Complete waste of money."
];

reviews.forEach((review, index) => {
  const result = analyzeSentiment(review);
  console.log(`Review ${index + 1}:`);
  console.log(`Text: ${review}`);
  console.log(`Sentiment: ${result.label} (Score: ${result.score.toFixed(2)})`);
  console.log('---');
});