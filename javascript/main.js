function renderItems(items, processType, elementId, processFunction) {
    const container = document.getElementById(elementId);
    let html = "<div>";

    for (let i = 0; i < items.length; i++) {
        const title = items[i].title;
        const buttonId = `${processType}-${i}`;

        html += `
          <div>
            <p>${title}</p>
            <button
              id="${buttonId}"
              data-title="${title}">
              ${processType}
            </button>
          </div>
        `;
    }

    html += "</div>";
    container.innerHTML = html;

    for (let i = 0; i < items.length; i++) {
        document
            .getElementById(`${processType}-${i}`)
            .addEventListener("click", processFunction);
    }
}

/* =======================
   API
======================= */

function apiCall(url, method, onDone) {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            if (onDone) {
                onDone(JSON.parse(xhr.responseText));
            }
        }
    };

    xhr.open(method, url);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("user-token", "token");

    return xhr;
}

/* =======================
   Actions
======================= */

function editItem() {
    const title = this.dataset.title;

    const call = apiCall("/v1/item/edit", "POST", getItems);
    call.send(JSON.stringify({
        title: title,
        status: "DONE"
    }));
}

function deleteItem() {
    const title = this.dataset.title;

    const call = apiCall("/v1/item/delete", "POST", getItems);
    call.send(JSON.stringify({
        title: title
    }));
}

/* =======================
   Fetch & Render
======================= */

function getItems() {
    const call = apiCall("/v1/item/get", "GET", function (data) {
        renderItems(
            data.pending_items,
            "edit",
            "pendingItems",
            editItem
        );

        renderItems(
            data.done_items,
            "delete",
            "doneItems",
            deleteItem
        );
    });

    call.send();
}

/* =======================
   Create
======================= */

document
    .getElementById("create-button")
    .addEventListener("click", createItem);

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

/* =======================
   Initial Load
======================= */

getItems();
