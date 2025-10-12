import React from 'react';
import { Lock, CheckCircle, Play, Star, Trophy } from 'lucide-react';

const LevelSelector = ({ levelSystem, onLevelSelect, onBack }) => {
  const allLevels = levelSystem.getAllLevels();
  const overallProgress = levelSystem.getOverallProgress();

  const getLevelIcon = (level) => {
    const isCompleted = levelSystem.isLevelCompleted(level.id);
    const isUnlocked = levelSystem.isLevelUnlocked(level.id);
    const isCurrent = levelSystem.progress.currentLevel === level.id;

    if (isCompleted) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    } else if (isCurrent) {
      return <Play className="w-6 h-6 text-blue-500" />;
    } else if (isUnlocked) {
      return <Star className="w-6 h-6 text-yellow-500" />;
    } else {
      return <Lock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getLevelStyle = (level) => {
    const isCompleted = levelSystem.isLevelCompleted(level.id);
    const isUnlocked = levelSystem.isLevelUnlocked(level.id);
    const isCurrent = levelSystem.progress.currentLevel === level.id;

    if (isCompleted) {
      return 'bg-green-100 border-green-400 text-green-800 hover:bg-green-200';
    } else if (isCurrent) {
      return 'bg-blue-100 border-blue-400 text-blue-800 hover:bg-blue-200 ring-2 ring-blue-300';
    } else if (isUnlocked) {
      return 'bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100 cursor-pointer';
    } else {
      return 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed';
    }
  };

  const handleLevelClick = (level) => {
    if (levelSystem.isLevelUnlocked(level.id)) {
      onLevelSelect(level.id);
    }
  };

  const getSpecialLevelInfo = (level) => {
    if (level.level === 7) return "📚 Gemischt 1-6";
    if (level.level === 9) return "🎯 Kleiner Bruder";
    if (level.level === 14) return "📚 Gemischt 10-13";
    if (level.level === 15) return "🏆 Alle Aufgaben";
    if (level.level === 16) return "🎉 Finale";
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-purple-600">Level Auswahl</h1>
              <p className="text-gray-600">Wähle dein Level zum Üben</p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              Zurück
            </button>
          </div>

          {/* Progress Overview */}
          <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-700">Dein Fortschritt</h3>
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{overallProgress.completedLevels}</div>
                <div className="text-sm text-gray-600">Abgeschlossen</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{overallProgress.unlockedLevels}</div>
                <div className="text-sm text-gray-600">Freigeschaltet</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{overallProgress.completionPercentage}%</div>
                <div className="text-sm text-gray-600">Fortschritt</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{overallProgress.overallAccuracy}%</div>
                <div className="text-sm text-gray-600">Genauigkeit</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress.completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Level Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {allLevels.map((level) => {
              const progress = levelSystem.getLevelProgress(level.id);
              const specialInfo = getSpecialLevelInfo(level);
              
              return (
                <div
                  key={level.id}
                  onClick={() => handleLevelClick(level)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105
                    ${getLevelStyle(level)}
                  `}
                >
                  {/* Level Number */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold">{level.level}</span>
                    {getLevelIcon(level)}
                  </div>

                  {/* Special Level Info */}
                  {specialInfo && (
                    <div className="text-xs mb-2 font-medium">
                      {specialInfo}
                    </div>
                  )}

                  {/* Problem Count */}
                  {level.problems && level.problems.length > 0 && (
                    <div className="text-xs text-gray-600 mb-1">
                      {level.problems.length} Aufgaben
                    </div>
                  )}

                  {/* Progress */}
                  {progress.total > 0 && (
                    <div className="text-xs">
                      <div className="flex justify-between">
                        <span>{progress.correct}/{progress.total}</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-50 rounded-full h-1 mt-1">
                        <div 
                          className="bg-current h-1 rounded-full transition-all"
                          style={{ width: `${progress.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Unlock Code (if completed) */}
                  {levelSystem.isLevelCompleted(level.id) && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                      {level.unlockCode}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-700 mb-2">Legende:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                <span>Gesperrt</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Verfügbar</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-500" />
                <span>Aktuell</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Abgeschlossen</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;
