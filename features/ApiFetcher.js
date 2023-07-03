function checkUserId(apiUrl, requestBody) {
  return fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text(); // Retrieve the response as text
    })
    .then(responseText => {
      console.log("Email:", responseText);
      return { statusCode: 200, message: responseText }; // Return predefined object
    })
    .catch(error => {
      console.error(error);
      return { statusCode: 500, message: "Internal Server Error" }; // Return predefined error object
    });
}

const ApiFetcher = {
  checkUserId: checkUserId,
};

export default ApiFetcher;