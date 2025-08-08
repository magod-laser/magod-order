// configStore.js

const globalConfig = require("../Utils/globalConfig");

function getBaseDirectory() {
  const config = globalConfig.getAll();
//   console.log("Full config object from globalConfig:", config);

  if (!config) {
    throw new Error(" WORKORDER path is missing in globalConfig");
  }

  return config.WORKORDER;
}

setTimeout(() => {
  try {
    const baseDir = getBaseDirectory();
    console.log(" Base Directory after  SEC delay:", baseDir);
  } catch (err) {
    // console.error(" Error fetching base directory:", err.message);
  }
}, 1 * 1000); 


module.exports = {
  getBaseDirectory
};

