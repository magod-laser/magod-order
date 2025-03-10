import React, { useEffect, useState } from "react";
import { TimeoutWarningModal } from "../components/TimeoutWarningModal";

import {
  addEventListeners,
  removeEventListeners,
} from "../../utils/eventListenerUtil";

export const TimeoutLogic = () => {
  const [isWarningModalOpen, setWarningModalOpen] = useState(false);
  useEffect(() => {
    const createTimeout1 = () =>
      setTimeout(() => {
        console.log("modal openeddddddd");
        setWarningModalOpen(true);
      }, 900000);

    // 15 min we fixed the timout so, 900000 ms

    const createTimeout2 = () =>
      setTimeout(() => {
        localStorage.clear();

        window.location.href = "/";
      }, 900000);

    const listener = () => {
      if (!isWarningModalOpen) {
        clearTimeout(timeout);
        timeout = createTimeout1();
      }
    };

    // Initialization
    let timeout = isWarningModalOpen ? createTimeout2() : createTimeout1();
    addEventListeners(listener);

    // Cleanup
    return () => {
      removeEventListeners(listener);
      clearTimeout(timeout);
    };
  }, [isWarningModalOpen]);
  return (
    <div>
      {isWarningModalOpen && (
        <TimeoutWarningModal
          isOpen={isWarningModalOpen}
          onRequestClose={() => setWarningModalOpen(false)}
        />
      )}
    </div>
  );
};
