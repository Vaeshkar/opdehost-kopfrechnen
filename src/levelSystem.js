// Level System for Kopfrechnen Trainer
import levelData from './levelData.json';

export class LevelSystem {
  constructor() {
    this.levels = this.processLevelData();
    this.progress = this.loadProgress();
  }

  processLevelData() {
    const processed = { ...levelData };
    
    // Level 7: Mixed levels 1-6
    processed['1-7'] = {
      ...processed['1-7'],
      title: "Gemischte Übung 1-6",
      description: "Alle Aufgaben der Stufen 1 bis 6",
      problems: this.combineLevels(['1-1', '1-2', '1-3', '1-4', '1-5', '1-6']),
      isMixedLevel: true,
      isTextLevel: false
    };

    // Level 9: Special explanation level
    processed['1-9'] = {
      ...processed['1-9'],
      title: "Plus und Minus bis 20 OHNE Zehnerübergang",
      description: "Hier werden die Karten von Stufe 8 verwendet - diesmal werden auch die Ergebnisse genannt.",
      explanation: `Die Aufgaben sollen immer mit Hilfe des „Kleinen Bruders" gelöst werden!

Zum Beispiel:
13 + 6 = 19
WEIL
3 + 6 = 9

Und

19 - 5 = 14
WEIL
9 - 5 = 4`,
      problems: [...levelData['1-8'].problems],
      isTextLevel: true,
      showResults: true
    };

    // Level 14: Mixed levels 10-13
    processed['1-14'] = {
      ...processed['1-14'],
      title: "Gemischte Übung 10-13",
      description: "Alle Aufgaben der Stufen 10 bis 13",
      problems: this.combineLevels(['1-10', '1-11', '1-12', '1-13']),
      isMixedLevel: true,
      isTextLevel: false
    };

    // Level 15: All levels 1-14 mixed
    processed['1-15'] = {
      ...processed['1-15'],
      title: "Alle Aufgaben gemischt",
      description: "ALLE AUFGABEN der Stufen 1 bis 14 GEMISCHT trainiert!",
      problems: this.combineLevels([
        '1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8',
        '1-10', '1-11', '1-12', '1-13', '1-14'
      ]),
      isMixedLevel: true,
      isTextLevel: false
    };

    return processed;
  }

  combineLevels(levelIds) {
    const allProblems = [];
    levelIds.forEach(levelId => {
      if (levelData[levelId] && levelData[levelId].problems) {
        allProblems.push(...levelData[levelId].problems);
      }
    });
    // Remove duplicates and filter out invalid problems
    return [...new Set(allProblems)].filter(p => p && p.includes && (p.includes('+') || p.includes('-')));
  }

  loadProgress() {
    const saved = localStorage.getItem('kopfrechnen-progress');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      currentLevel: '1-1',
      completedLevels: [],
      unlockedLevels: ['1-1'],
      levelStats: {}, // { '1-1': { correct: 5, total: 10, completed: false } }
      totalCorrect: 0,
      totalAttempts: 0,
      lastPlayed: null
    };
  }

  saveProgress() {
    localStorage.setItem('kopfrechnen-progress', JSON.stringify(this.progress));
  }

  isLevelUnlocked(levelId) {
    return this.progress.unlockedLevels.includes(levelId);
  }

  isLevelCompleted(levelId) {
    return this.progress.completedLevels.includes(levelId);
  }

  getCurrentLevel() {
    return this.levels[this.progress.currentLevel];
  }

  getLevel(levelId) {
    return this.levels[levelId];
  }

  getAllLevels() {
    return Object.values(this.levels).sort((a, b) => a.level - b.level);
  }

  getUnlockedLevels() {
    return this.progress.unlockedLevels.map(id => this.levels[id]).filter(Boolean);
  }

  generateProblems(levelId) {
    const level = this.levels[levelId];
    if (!level || !level.problems) return [];
    
    // Shuffle problems randomly
    return this.shuffleArray([...level.problems]);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  recordAnswer(levelId, isCorrect) {
    if (!this.progress.levelStats[levelId]) {
      this.progress.levelStats[levelId] = { correct: 0, total: 0, completed: false };
    }
    
    this.progress.levelStats[levelId].total++;
    this.progress.totalAttempts++;
    
    if (isCorrect) {
      this.progress.levelStats[levelId].correct++;
      this.progress.totalCorrect++;
    }
    
    this.saveProgress();
  }

  completeLevel(levelId) {
    const level = this.levels[levelId];
    if (!level) return null;

    // Mark level as completed
    if (!this.progress.completedLevels.includes(levelId)) {
      this.progress.completedLevels.push(levelId);
    }
    
    if (this.progress.levelStats[levelId]) {
      this.progress.levelStats[levelId].completed = true;
    }

    // Unlock next level
    const nextLevelNum = level.level + 1;
    const nextLevelId = `1-${nextLevelNum}`;
    
    if (nextLevelNum <= 16 && !this.progress.unlockedLevels.includes(nextLevelId)) {
      this.progress.unlockedLevels.push(nextLevelId);
    }

    this.progress.lastPlayed = new Date().toISOString();
    this.saveProgress();

    return {
      levelCompleted: levelId,
      unlockCode: level.unlockCode,
      nextLevelUnlocked: nextLevelNum <= 16 ? nextLevelId : null
    };
  }

  setCurrentLevel(levelId) {
    if (this.isLevelUnlocked(levelId)) {
      this.progress.currentLevel = levelId;
      this.saveProgress();
      return true;
    }
    return false;
  }

  getLevelProgress(levelId) {
    const stats = this.progress.levelStats[levelId];
    if (!stats) return { correct: 0, total: 0, percentage: 0, completed: false };
    
    return {
      correct: stats.correct,
      total: stats.total,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      completed: stats.completed || false
    };
  }

  getOverallProgress() {
    const totalLevels = 16;
    const completedCount = this.progress.completedLevels.length;
    const unlockedCount = this.progress.unlockedLevels.length;
    
    return {
      completedLevels: completedCount,
      unlockedLevels: unlockedCount,
      totalLevels: totalLevels,
      completionPercentage: Math.round((completedCount / totalLevels) * 100),
      totalCorrect: this.progress.totalCorrect,
      totalAttempts: this.progress.totalAttempts,
      overallAccuracy: this.progress.totalAttempts > 0 
        ? Math.round((this.progress.totalCorrect / this.progress.totalAttempts) * 100) 
        : 0
    };
  }

  resetProgress() {
    this.progress = {
      currentLevel: '1-1',
      completedLevels: [],
      unlockedLevels: ['1-1'],
      levelStats: {},
      totalCorrect: 0,
      totalAttempts: 0,
      lastPlayed: null
    };
    this.saveProgress();
  }
}

export default LevelSystem;
