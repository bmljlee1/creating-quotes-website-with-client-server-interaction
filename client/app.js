const quotesContainer = document.getElementById("quotes");

async function getQuotes() {
  const response = await fetch("http://localhost:8080/quotes");
  const data = await response.json();
  console.log(data);

  quotesContainer.innerHTML = "";

  data.forEach(function (lotr) {
    const quoteElement = document.createElement("div");
    quoteElement.id = `quote-${lotr.id}`;

    const p = document.createElement("p");
    p.textContent = `${lotr.character} ${lotr.quote} (likes: ${lotr.likes})`;
    quoteElement.appendChild(p);

    const likeButton = document.createElement("button");
    likeButton.textContent = `Like (${lotr.likes})`;
    likeButton.addEventListener("click", async () => {
      await likeQuote(lotr.id);
    });
    quoteElement.appendChild(likeButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      await deleteQuote(lotr.id);
      removeQuote(lotr.id);
    });
    quoteElement.appendChild(deleteButton);

    quotesContainer.appendChild(quoteElement);
  });
}

async function likeQuote(id) {
  const response = await fetch(`http://localhost:8080/quotes/${id}/like`, {
    method: "POST",
  });
  await getQuotes();
}

getQuotes();

async function deleteQuote(id) {
  await fetch(`http://localhost:8080/quotes/${id}`, {
    method: "DELETE",
  });
}

function removeQuote(id) {
  const quoteElement = document.getElementById(`quote-${id}`);
  if (quoteElement) {
    quoteElement.remove();
  }
}

const form = document.getElementById("quotes-form");

async function handlePostQuotes(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  console.log(data);
  await fetch("http://localhost:8080/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  getQuotes();
}
getQuotes();
form.addEventListener("submit", handlePostQuotes);
