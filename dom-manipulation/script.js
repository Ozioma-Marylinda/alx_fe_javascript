const formQuote = document.querySelector(".form-quote");
const formCategory = document.getElementById("category");
const formInput = document.getElementById("quote");
const quoteDisplaySect = document.getElementById("quoteDisplay");
const quoteButton = document.getElementById("showRandomQuote");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

const quotes = [];
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  storedQuotes.forEach(q => quotes.push(q));
}

function displayQuotes(list) {
  quoteDisplaySect.innerHTML = "";

  list.forEach(q => {
    const div = document.createElement("div");
    const p = document.createElement("p");
    const small = document.createElement("small");

    p.textContent = q.text;
    small.textContent = q.category;

    div.appendChild(p);
    div.appendChild(small);
    quoteDisplaySect.appendChild(div);
  });
}

function addQuote(text, category) {
  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  displayQuotes(quotes);
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  displayQuotes(filtered);
}

async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  return data.slice(0, 5).map(item => ({
    text: item.title,
    category: "server"
  }));
}

async function postQuoteToServer(quote) {
  await fetch(SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote)
  });
}

async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    if (JSON.stringify(serverQuotes) !== JSON.stringify(localQuotes)) {
      // SERVER WINS
      localStorage.setItem("quotes", JSON.stringify(serverQuotes));
      quotes.length = 0;
      serverQuotes.forEach(q => quotes.push(q));

      displayQuotes(quotes);
      syncStatus.innerText = "⚠️ Server data synced and conflicts resolved.";
    } else {
      syncStatus.innerText = "✅ Data already in sync.";
    }
  } catch (error) {
    syncStatus.innerText = "❌ Error syncing with server.";
  }
}

formQuote.addEventListener("submit", e => {
  e.preventDefault();

  const text = formInput.value.trim();
  const category = formCategory.value.trim();
  if (!text || !category) return;

  const newQuote = { text, category };
  addQuote(text, category);
  postQuoteToServer(newQuote);

  formInput.value = "";
  formCategory.value = "";
});

categoryFilter.addEventListener("change", filterQuotes);

quoteButton.addEventListener("click", () => {
  if (!quotes.length) return;
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  displayQuotes([random]);
});


loadQuotes();
displayQuotes(quotes);

const savedCategory = localStorage.getItem("selectedCategory") || "all";
categoryFilter.value = savedCategory;
filterQuotes();

setInterval(syncQuotes, 15000);
