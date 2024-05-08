import React, { useEffect, useState } from 'react';

const ClockMeter = ({ value = 44 }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const calculateRotation = () => {
      const degrees = ((value - 50) / 100) * 180;
      setRotation(degrees);
    };
    calculateRotation();
  }, [value]);

  return (
    <div className="w-32 h-32 relative">
      {/* Meter background */}
      <div className="w-full h-full bg-gray-200 rounded-full absolute top-0 left-0"></div>
      
      {/* Needle */}
      <div className="w-0 h-0 border-t-4 border-solid border-black absolute left-1/2 transform -translate-x-1/2 -translate-y-full rotate-[180deg] origin-bottom" style={{ transform: `rotate(${rotation}deg)` }}></div>
      
      {/* Value */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
        <span className="text-black">{value}</span>
      </div>
    </div>
  );
};

export default ClockMeter;
