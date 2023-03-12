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
      <td class="url">${password.url}</td>
      <td>${password.username}</td>
      <td><span class="password-span">${maskPassword(password.password, true)}</span></td>
      <td>
        <button class="edit-history-button">Edit</button>
        <button class="delete-history-button">Delete</button>
        <button class="show-password-button">Show</button>
      </td>
    `;
    passwordList.appendChild(passwordRow);
  });

  // A@Add event listeners to all show password buttons
  let showPasswordButtons = document.querySelectorAll(".show-password-button");
  showPasswordButtons.forEach(showPasswordButton => {
    showPasswordButton.addEventListener('click', (event) => {
      event.preventDefault();
      var passwordSpan = showPasswordButton.parentNode.previousElementSibling.querySelector(".password-span");
      let url = showPasswordButton.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
      if (passwordSpan.textContent.includes("#")) {
        passwordSpan.textContent = maskPassword(passwordSpan.textContent, false, url);
        showPasswordButton.textContent = "Hide";
      } else {
        passwordSpan.textContent = maskPassword(passwordSpan.textContent, true, url);
        showPasswordButton.textContent = "Show";
      }
    });
  });
};

//A@mask password in password history
function maskPassword(password, masked, url) {
  let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
  if (masked) {
    return "#".repeat(password.length);
  } else {
    for (var i = 0; i < passwords.length; i++) {
      console.log(passwords[i].url + '  ' + url)
      if (passwords[i].url == url) {
        password = passwords[i].password;
        break;
      }
    }
    //passwords.forEach(pass => {console.log(pass.url + ' ' + url); if (pass.url == url){console.log('pass.url' + pass.url + 'url' + url); password=pass.password;}});
    return password;
  }
}

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
  alert('Credentials saved! (scroll down and click `Show Passwords` to check)');//A@
  passwordForm.reset();
  renderLatestPassword();
  passwordForm.scrollIntoView({ behavior: "smooth" }); //A@
  location.reload(); //A@
});

// Handle show passwords button click
showPasswordsButton.addEventListener('click', (event) => {
  showPasswordHistory()
  showPasswordsButton.scrollIntoView({ behavior: "smooth" });
  // A@hide button and scroll down smoothly  
  showPasswordsButton.classList.add('hidden');
  showPasswordsButton.scrollIntoView({
    behavior: 'smooth',
    //block: 'nearest',
    //inline: 'center'
  });
});

// Handle hide passwords button click
hidePasswordsButton.addEventListener('click', (event) => {
  hidePasswordHistory();
  // A@show buttom
  showPasswordsButton.classList.remove('hidden');
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
  //A@ delete current password from password history
  deletePasswordUsable(password.url, password.username, password.password);
});

// A@Delete password
const deletePassword = () => {
  let passwordRow = event.target.parentElement.parentElement;
  let url = passwordRow.children[0].textContent;
  let username = passwordRow.children[1].textContent;
  let password = passwordRow.children[2].textContent;
  //M@ Start
  if (password.includes("#")) {
    alert('Please unmask password to delete');
  } else {
    let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
    passwords = passwords.filter(passwordData => {
      return passwordData.url !== url || passwordData.username !== username || passwordData.password !== password;
    });
    localStorage.setItem('passwords', JSON.stringify(passwords));
    alert('Credential deleted!');//A@
  }
  //M@ End
  renderPasswordHistory();
};

//A@Delete password Usable
const deletePasswordUsable = (url, username, password) => {
  let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
  passwords = passwords.filter(passwordData => {
    return passwordData.url !== url || passwordData.username !== username || passwordData.password !== password;
  });
  localStorage.setItem('passwords', JSON.stringify(passwords));
}

// Handle password history delete button click
passwordList.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-history-button')) {
    deletePassword(); //M@
    //alert('Credential deleted!');//D@
  }
});

// Handle password history edit button click
passwordList.addEventListener('click', (event) => {
  if (event.target.classList.contains('edit-history-button')) {
    let passwordRow = event.target.parentElement.parentElement;
    let url = passwordRow.children[0].textContent;
    let username = passwordRow.children[1].textContent;
    let password = passwordRow.children[2].textContent;
    //A@ delete current password from password history
    //M@ Start
    if (password.includes("#")) {
      alert('Please unmask password to edit');
    } else {
      urlInput.value = url;
      usernameInput.value = username;
      passwordInput.value = password;
      deletePasswordUsable(url, username, password);
    }
    //M@ End
    //deletePasswordUsable(url, username, password); //D@
    window.scrollTo(0, 0);
  }
});



// Handle download as PDF button click
downloadPdfButton.addEventListener('click', () => {
  // Define document definition object
  const docDefinition = {
    content: [
      { text: 'Password History', style: 'header' },
      '\n\n',
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*'],
          body: [
            [{ text: 'URL', bold: true }, { text: 'Username', bold: true }, { text: 'Password', bold: true }],
            ...(JSON.parse(localStorage.getItem('passwords')) || [])
              .map(({ url, username, password }) =>
                [url, username, password].filter(Boolean)
              )
              .filter(row => row.length === 3)
          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        font: 'Roboto'
      }
    }
  };


  // Define fonts for PDF document
  pdfMake.fonts = {
    Roboto: {
      normal: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf',
      bold: 'https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmWUlfBBc9.ttf',
      italic: 'https://fonts.gstatic.com/s/roboto/v27/KFOkCnqEu92Fr1Mu52xIIzIXKMny.ttf',
      bolditalic: 'https://fonts.gstatic.com/s/roboto/v27/KFOjCnqEu92Fr1Mu51S7ACc6CsE.ttf'
    }
  };

  // Generate and download PDF
  pdfMake.createPdf(docDefinition).download('password_history.pdf');
});


renderLatestPassword();

