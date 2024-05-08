import React, { useEffect, useState } from 'react';
import './style/meter_style.css';

const ClockMeter = ({ value = 98 }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const calculateRotation = () => {
      const degrees = ((value - 50) / 100) * 180;
      setRotation(degrees);
    };
    calculateRotation();
  }, [value]);

  return (
    <div className="container  h-[150px] ">
      <div className="meter  ">
        <div className="outer-circle center">
        <div className="inner-circle">
            <div
                className="needle center relative"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <div className="label">
                <span className='rounded-full p-2 text-white font-bold bg-[#7BD757] '>{value}</span>
            </div>
            </div>
            
            </div>


        </div>
      </div>
    </div>
  );
};

export default ClockMeter;
