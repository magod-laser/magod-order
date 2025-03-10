/** @format */

export const getRequest = async (url, callback) => {
	let response = await fetch(url, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});
	let content = await response.json();
	callback(content);
};

// export const postRequest = async (url, body, callback) => {
// 	let urls = url.split("/");
// 	if (urls.includes("undefined")) {
// 		alert("route not defined");
// 		return;
// 	}
// 	let response = await fetch(url, {
// 		method: "POST",
// 		headers: {
// 			Accept: "application/json",
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify(body),
// 	});
// 	let content = await response.json();
// 	callback(content);
// };

export const postRequest = async (url, body, callback = null) => {
  try {
    // Validate the URL
    if (!url || url.includes("undefined")) {
      console.error("Route not defined or URL is invalid.");
      throw new Error("Route not defined or invalid URL.");
    }

    // Perform the POST request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Handle HTTP errors
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response
    const content = await response.json();

    // Handle callback if provided, or return the content
    if (typeof callback === "function") {
      callback(content);
    }

    return content; // Return the content for async/await usage
  } catch (error) {
    console.error("Error in postRequest:", error.message);
    throw error; // Rethrow the error to be caught by the caller
  }
};

export const postRequestFormData = async (url, data, callback) => {
	let response = await fetch(url, {
		method: "POST",
		headers: {
			Accept: "multipart/form-data",
			// 'Content-Type': 'multipart/form-data'
		},
		body: data,
	});
	callback(response);
};

export const getFileRequest = async (url, callback) => {
	let response = await fetch(url, {
		method: "GET",
		headers: {
			Accept: "*/*",
			"Content-Type": "*/*",
		},
	});
	callback(response);
};
