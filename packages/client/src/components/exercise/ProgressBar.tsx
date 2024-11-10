// client/src/components/exercise/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  progress: number; // Percentage of progress (0 to 100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden my-4">
      <div
        className="h-full bg-blue-500 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
