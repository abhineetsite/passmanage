document.addEventListener('DOMContentLoaded', function () {
  // Get references to form elements
  const form = document.querySelector('form');
  const urlInput = document.querySelector('#url');
  const usernameInput = document.querySelector('#username');
  const passwordInput = document.querySelector('#password');
  const dataTable = document.querySelector('#data');

  /// Load data from file
  chrome.storage.local.get('data', function (result) {
    let data = result.data || [];
    const table = document.querySelector('table tbody');

    // Display data in table
    function displayData() {
      data.forEach(function (item) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.url}</td>
          <td>${item.username}</td>
          <td>${item.password}</td>
          <td><button class="remove">X</button></td>
        `;
        table.appendChild(row);
      });
    }
    displayData();

    // Add data to file
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const url = form.elements.url.value;
      const username = form.elements.username.value;
      const password = form.elements.password.value;
      data.push({ url, username, password });
      chrome.storage.local.set({ data: data }, function () {
        // Clear form
        form.reset();

        // Add row to table
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${url}</td>
          <td>${username}</td>
          <td>${password}</td>
          <td><button class="remove">X</button></td>
        `;
        table.appendChild(row);
      });
    });

    // Remove data from file
    table.addEventListener('click', function (event) {
      if (event.target.className === 'remove') {
        const row = event.target.parentNode.parentNode;

        // Remove data from file
        const url = row.querySelector('td:nth-child(1)').textContent;
        const username = row.querySelector('td:nth-child(2)').textContent;
        const password = row.querySelector('td:nth-child(3)').textContent;

        const index = data.findIndex(function (item) {
          return item.url === url && item.username === username && item.password === password;
        });
        data.splice(index, 1);
        chrome.storage.local.set({ data: data }, function () {
          // Remove row from table
          row.remove();
        });
      }
    });
  });
})
