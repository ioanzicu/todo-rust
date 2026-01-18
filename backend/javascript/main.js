function renderItems(items, action, containerId, handler) {
  const container = document.getElementById(containerId);
  let html = "";

  items.forEach((item, index) => {
    html += `
          <div class="itemContainer">
            <p>${item.title}</p>
            <button
              class="actionButton"
              data-title="${item.title}"
              id="${action}-${index}">
              ${action}
            </button>
          </div>
        `;
  });

  container.innerHTML = html;

  items.forEach((_, index) => {
    document
      .getElementById(`${action}-${index}`)
      .addEventListener("click", handler);
  });
}

function apiCall(url, method, callback) {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      if (callback) {
        callback(JSON.parse(xhr.responseText));
      }
    }
  };

  xhr.open(method, url);
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("user-token", "token");

  return xhr;
}

function editItem() {
  const title = this.dataset.title;
  const call = apiCall("/v1/item/edit", "POST", getItems);
  call.send(JSON.stringify({ title, status: "DONE" }));
}

function deleteItem() {
  const title = this.dataset.title;
  const call = apiCall("/v1/item/delete", "POST", getItems);
  call.send(JSON.stringify({ title, status: "DONE" }));
}

function getItems() {
  const call = apiCall("/v1/item/get", "GET", data => {
    renderItems(data.pending_items, "edit", "pendingItems", editItem);
    renderItems(data.done_items, "delete", "doneItems", deleteItem);
 
    // Update Header Stat
    document.getElementById("completeNum").innerHTML =
        data.done_item_count;
    
    document.getElementById("pendingNum").innerHTML =
        data.pending_items_count;
  });

  call.send();
}

function createItem() {
  const input = document.getElementById("name");
  const title = input.value.trim();
  if (!title) return;

  const call = apiCall(
    "/v1/item/create/" + encodeURIComponent(title),
    "POST",
    getItems
  );
  call.send();
  input.value = "";
}

document
  .getElementById("create-button")
  .addEventListener("click", createItem);

getItems();


