const formQuote = document.querySelector(".form-quote");
const formCategory = document.getElementById("category");
const formInput = document.getElementById("quote");
const quoteDisplaySect = document.getElementById("quoteDisplay");
const quoteButton = document.getElementById("newQuote");

const quotes = [];

function createAddQuoteForm(text, category) {
const newQuote = { text, category };
  quotes.push(newQuote);

  const quoteDiv = document.createElement("div");
  const quoteText = document.createElement("p");
  const quoteCategory = document.createElement("small");

  quoteText.textContent = text;
  quoteCategory.textContent = category;

  quoteDiv.appendChild(quoteText);
  quoteDiv.appendChild(quoteCategory);
  quoteDisplaySect.appendChild(quoteDiv);
}

function showRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplaySect.innerHTML = "";

  const quoteDiv = document.createElement("div");
  const quoteText = document.createElement("p");
  const quoteCategory = document.createElement("small");

  quoteText.textContent = randomQuote.text;
  quoteCategory.textContent = randomQuote.category;

  quoteDiv.appendChild(quoteText);
  quoteDiv.appendChild(quoteCategory);
  quoteDisplaySect.appendChild(quoteDiv);
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
