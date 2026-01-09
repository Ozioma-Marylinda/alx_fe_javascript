const formQuote = document.querySelector(".form-quote");
const formCategory = document.getElementById("category");
const formInput = document.getElementById("quote");
const quoteDisplaySect = document.getElementById("quoteDisplay");
const quoteButton = document.getElementById("newQuote");

const quotes = [];

function createAddQuoteForm(text, category) {
  quotes.push({ text, category });

  quoteDisplaySect.innerHTML += `
    <div class="quotes">
      <p>${text}</p>
      <small>${category}</small>
    </div>
  `;
}

function showRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplaySect.innerHTML = `
    <div class="quotes">
      <p>${randomQuote.text}</p>
      <small>${randomQuote.category}</small>
    </div>
  `;
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
