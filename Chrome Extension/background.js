chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {file: "lib/readability.js"});
  chrome.tabs.executeScript(null, {file: "lib/jquery.js"});
  chrome.tabs.executeScript(null, {file: "lib/poet.js"});
  chrome.tabs.executeScript(null, {file: "lib/pronouncing.js"});
  //chrome.tabs.executeScript(null, {file: "lib/pronouncing-browser.js"});
});
