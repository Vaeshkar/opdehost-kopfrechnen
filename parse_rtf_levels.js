const fs = require('fs');
const path = require('path');

// Simple RTF parser to extract math problems and descriptions
function parseRTF(rtfContent) {
  const result = {
    title: '',
    description: '',
    problems: [],
    instructions: ''
  };

  // Extract title (Kopfrechnen X-Y:)
  const titleMatch = rtfContent.match(/Kopfrechnen[^\\]*?([0-9-]+[^\\]*?)\\[\\f]/);
  if (titleMatch) {
    result.title = titleMatch[1].replace(/\\/g, '').trim();
  }

  // Extract description after title
  const descMatch = rtfContent.match(/Kopfrechnen[^\\]*?\\[\\f][^\\]*?\\[\\f][^\\]*?([^\\]+?)\\[\\f]/);
  if (descMatch) {
    result.description = descMatch[1].replace(/\\/g, '').trim();
  }

  // Extract math problems (pattern: number+number, number-number, etc.)
  const mathProblems = rtfContent.match(/\\fs\d+[^}]*?(\d+[\+\-\*\/]\d+)/g);
  if (mathProblems) {
    result.problems = mathProblems
      .map(match => {
        const problem = match.match(/(\d+[\+\-\*\/]\d+)/);
        return problem ? problem[1] : null;
      })
      .filter(p => p !== null)
      .filter((p, index, arr) => arr.indexOf(p) === index); // Remove duplicates
  }

  // Extract special instructions (like "Bitte die Karten von Stufe...")
  const instructMatch = rtfContent.match(/Bitte[^\\]*?([^\\]+?)\\[\\f]/);
  if (instructMatch) {
    result.instructions = instructMatch[1].replace(/\\/g, '').trim();
  }

  // Check for "ALLE AUFGABEN" or "GEMISCHT" patterns
  if (rtfContent.includes('ALLE AUFGABEN') || rtfContent.includes('GEMISCHT')) {
    result.isMixedLevel = true;
  }

  return result;
}

// Parse all RTF files
const docsDir = './docs/kopferechnen_karten1_1-16';
const levels = {};

for (let i = 1; i <= 16; i++) {
  const filename = `Kopfrechnen NEU 1-${i} Karten.rtf`;
  const filepath = path.join(docsDir, filename);
  
  try {
    const rtfContent = fs.readFileSync(filepath, 'utf8');
    const parsed = parseRTF(rtfContent);
    
    levels[`1-${i}`] = {
      id: `1-${i}`,
      level: i,
      title: parsed.title || `Level 1-${i}`,
      description: parsed.description || '',
      problems: parsed.problems || [],
      instructions: parsed.instructions || '',
      isMixedLevel: parsed.isMixedLevel || false,
      unlockCode: generateCode(i)
    };
    
    console.log(`Level 1-${i}: ${parsed.problems.length} problems`);
    if (parsed.instructions) {
      console.log(`  Instructions: ${parsed.instructions}`);
    }
    
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
  }
}

// Generate 3-digit codes
function generateCode(level) {
  const codes = [
    '123', '456', '789', '321', '654', '987', '147', '258', '369', '741',
    '852', '963', '159', '357', '468', '246'
  ];
  return codes[level - 1] || '000';
}

// Output the structured data
console.log('\n=== LEVEL STRUCTURE ===');
console.log(JSON.stringify(levels, null, 2));

// Save to file
fs.writeFileSync('./src/levelData.json', JSON.stringify(levels, null, 2));
console.log('\nLevel data saved to src/levelData.json');
