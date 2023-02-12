const passwordForm = document.getElementById('password-form');
const urlInput = document.getElementById('url');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const saveButton = document.getElementById('save-button');
const editButton = document.getElementById('edit-button');
const deleteButton = document.getElementById('delete-button');
const latestPassword = document.getElementById('latest-password');
const passwordHistory = document.getElementById('password-history');
const passwordList = document.getElementById('password-list');
const showPasswordsButton = document.getElementById('show-passwords-button');
const hidePasswordsButton = document.getElementById('hide-passwords-button');
const downloadPdfButton = document.getElementById('download-pdf-button');

// Save password to local storage
const savePassword = (password) => {
  let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
  passwords.unshift(password);
  localStorage.setItem('passwords', JSON.stringify(passwords));
};

// Render latest password
const renderLatestPassword = () => {
  let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
  let password = passwords[0];
  if (!password) {
    latestPassword.innerHTML = 'No password saved yet.';
    return;
  }
  latestPassword.innerHTML = `
    URL: ${password.url}<br>
    Username: ${password.username}<br>
    Password: *******
  `;
};

// Render password history
const renderPasswordHistory = () => {
  passwordList.innerHTML = '';
  let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
  passwords.forEach(password => {
    let passwordRow = document.createElement('tr');
    passwordRow.innerHTML = `
      <td>${password.url}</td>
      <td>${password.username}</td>
      <td>${password.password}</td>
      <td>
        <button class="delete-history-button">Delete</button>
      </td>
    `;
    passwordList.appendChild(passwordRow);
  });
};

// Show password history
const showPasswordHistory = () => {
  passwordHistory.style.display = 'block';
  renderPasswordHistory();
};

// Hide password history
const hidePasswordHistory = () => {
  passwordHistory.style.display = 'none';
};

// Handle save password form submission
passwordForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let password = {
    url: urlInput.value,
    username: usernameInput.value,
    password: passwordInput.value
  };
  savePassword(password);
  passwordForm.reset();
  renderLatestPassword();
});

// Handle show passwords button click
showPasswordsButton.addEventListener('click', (event) => {
  showPasswordHistory();
});

// Handle hide passwords button click
hidePasswordsButton.addEventListener('click', (event) => {
  hidePasswordHistory();
});

// Edit last password
editButton.addEventListener('click', (e) => {
  e.preventDefault();
  let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
  let password = passwords[0];
  if (!password) {
    return;
  }
  urlInput.value = password.url;
  usernameInput.value = password.username;
  passwordInput.value = password.password;
});


// Handle password history delete button click
passwordList.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-history-button')) {
    let passwordRow = event.target.parentElement.parentElement;
    let url = passwordRow.children[0].textContent;
    let username = passwordRow.children[1].textContent;
    let password = passwordRow.children[2].textContent;
    let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
    passwords = passwords.filter(passwordData => {
      return passwordData.url !== url || passwordData.username !== username || passwordData.password !== password;
    });
    localStorage.setItem('passwords', JSON.stringify(passwords));
    renderPasswordHistory();
  }
});

// Handle download as PDF button click
document.getElementById("download-pdf-button").addEventListener("click", function () {
  const passwordTable = document.getElementById("password-table");
  const passwordList = document.getElementById("password-list");

  // Create a new instance of the jsPDF object
  var doc = new jsPDF();

  // Add the data from the password table to the PDF
  for (var i = 0; i < passwordList.rows.length; i++) {
    var url = passwordList.rows[i].cells[0].innerHTML;
    var username = passwordList.rows[i].cells[1].innerHTML;
    var password = passwordList.rows[i].cells[2].innerHTML;

    doc.text(20, 20 + (i * 10), url + " / " + username + " / " + password);
  }

  // Download the PDF
  doc.save("passwords.pdf");
});

renderLatestPassword();

