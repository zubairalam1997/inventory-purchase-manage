// Timeline.js
import React from "react";

const statuses = ["raised", "approved", "bought", "sent", "delivered", "confirmed"];

const Timeline = ({ currentStatus }) => {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="flex justify-between items-center mt-6">
      {statuses.map((status, index) => (
        <div key={status} className="flex-1 text-center">
          <div
            className={`w-8 h-8 mx-auto rounded-full text-white flex items-center justify-center ${
              index <= currentIndex ? "bg-green-500" : "bg-orange-400"
            }`}
          >
            {index + 1}
          </div>
          <div className="mt-2 text-sm font-medium capitalize">{status}</div>
          {index !== statuses.length - 1 && (
            <div className={`h-1 w-full mx-auto mt-1 ${index < currentIndex ? 'bg-green-500' : 'bg-orange-300'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
