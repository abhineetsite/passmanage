let accountUrl = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");

// LOCALSTORAGE CAN STORE JUST STRING VALUES

const accUrlFromLocalStorage = JSON.parse(localStorage.getItem("accountUrl"));
console.log(accUrlFromLocalStorage);

const tabBtn = document.getElementById("tab-btn");

if (accUrlFromLocalStorage) {
  accountUrl = accUrlFromLocalStorage;
  render(accountUrl);
}

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    accountUrl.push(tabs[0].url);
    // Save the accountUrl array to localStorage after transformed it into a string
    localStorage.setItem("accountUrl", JSON.stringify(accountUrl));
    render(accountUrl);
  });
});

function render(accUrl) {
  let listItems = "";
  for (let i = 0; i < accUrl.length; i++) {
    listItems += `<li>
                        <a target="_blank" href="${accUrl[i]}">
                        ${accUrl[i]}
                        </a>
                </li>`;
  }
  ulEl.innerHTML = listItems;
}

// Listen for double clicks on the delete button
deleteBtn.addEventListener("dblclick", function () {
  // When double clicked, clear localStorage, accountUrl, and the DOM
  localStorage.clear();
  accountUrl = [];
  render(accountUrl);
});

inputBtn.addEventListener("click", function () {
  accountUrl.push(inputEl.value);
  inputEl.value = "";

  // Save the accountUrl array to localStorage after transformed it into a string
  localStorage.setItem("accountUrl", JSON.stringify(accountUrl));
  render(accountUrl);
});
