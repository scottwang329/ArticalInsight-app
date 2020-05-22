var baseUrl = "http://127.0.0.1:8080";

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "fact_check",
    title: "Fact check this with TruthBeTold",
    type: "normal",
    contexts: ["selection"],
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ["https"] },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.contextMenus.onClicked.addListener(async function (info) {
  //handle context menu actions
  fetch(urlBase + "/fact_check", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "text=" + info.selectionText,
  })
    .then((response) => response.json())
    .then((data) => {
      alert(
        "That fact is: " +
          data.results[0].truthRating +
          ". Read more at: " +
          data.results[0].url
      );
      console.log("Success:", data);
    })
    .catch((error) => {
      alert("We were unable to fact check this statement.");
    });
});
