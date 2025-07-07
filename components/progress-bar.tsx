"use client";

import { HiOutlineCheckCircle } from "react-icons/hi2";

interface ProgressBarProps {
  stage: number;
}

const ProgressBar = ({ stage }: ProgressBarProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= stage
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step < stage ? <HiOutlineCheckCircle className="w-4 h-4" /> : step}
          </div>
        ))}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
          style={{ width: `${(stage / 3) * 100}%` }}
        />
      </div>
    </div>
  );
};
export default ProgressBar;
