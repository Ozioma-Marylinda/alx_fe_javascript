const formQuote = document.querySelector(".form-quote");
const formCategory = document.getElementById("category");
const formInput = document.getElementById("quote");
const quoteDisplaySect = document.getElementById("quoteDisplay");
const quoteButton = document.getElementById("showRandomQuote");
const categoryFilter = document.getElementById("categoryFilter");
const importFileInput = document.getElementById("importFile");
const exportBtn = document.getElementById("exportJson");
const syncStatus = document.getElementById("syncStatus");


const quotes = [];
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    const parsedQuotes = JSON.parse(storedQuotes);
    parsedQuotes.forEach(q => addQuote(q.text, q.category, false));
  }
}

function displayQuote(quote) {
  const quoteDiv = document.createElement("div");
  const quoteText = document.createElement("p");
  const quoteCategory = document.createElement("small");

  quoteText.textContent = quote.text;
  quoteCategory.textContent = quote.category;

  quoteDiv.appendChild(quoteText);
  quoteDiv.appendChild(quoteCategory);
  quoteDisplaySect.appendChild(quoteDiv);
}


function addQuote(text, category, save = true) {
  const newQuote = { text, category };
  quotes.push(newQuote);
  displayQuote(newQuote);

  if (save) saveQuotes();

  populateCategories();
}

function showRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplaySect.innerHTML = "";
  displayQuote(randomQuote);

  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const selectedCategory = localStorage.getItem("lastFilter") || "all";
  categoryFilter.value = selectedCategory;

  filterQuotes();
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;

  localStorage.setItem("lastFilter", selectedCategory);

  quoteDisplaySect.innerHTML = "";

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  filteredQuotes.forEach(q => displayQuote(q));
}

async function fetchServerQuotes() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  return data.slice(0, 5).map(item => ({
    text: item.title,
    category: "server"
  }));
}

async function syncWithServer() {
  try {
    const serverQuotes = await fetchServerQuotes();
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    const conflict =
      JSON.stringify(serverQuotes) !== JSON.stringify(localQuotes);

    if (conflict) {
      localStorage.setItem("quotes", JSON.stringify(serverQuotes));
quotes.length = 0;
      serverQuotes.forEach(q => quotes.push(q));

      quoteDisplaySect.innerHTML = "";
      filterQuotes();

      syncStatus.textContent = "⚠️ Server data applied.";
    } else {
      syncStatus.textContent = "✅ Data already in sync.";
    }
  } catch {
    syncStatus.textContent = "❌ Sync failed.";
  }
}

formQuote.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = formInput.value.trim();
  const category = formCategory.value.trim();

  if (!text || !category) return;

  addQuote(text, category);

  formInput.value = "";
  formCategory.value = "";
});

quoteButton.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuotes);

exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
});

importFileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      importedQuotes.forEach(q => addQuote(q.text, q.category));
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file!");
    }
  };
  reader.readAsText(file);
});

document
  .getElementById("manualSync")
  .addEventListener("click", syncWithServer);

loadQuotes();
populateCategories();

const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) displayQuote(JSON.parse(lastQuote));

setInterval(syncWithServer, 15000);
