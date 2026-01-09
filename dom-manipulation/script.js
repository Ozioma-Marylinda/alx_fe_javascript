const formQuote = document.querySelector(".form-quote");
const formCategory = document.getElementById("category");
const formInput = document.getElementById("quote");
const quoteDisplaySect = document.getElementById("quoteDisplay");
const quoteButton = document.getElementById("newQuote"); 

const quoteContainer = [];

formQuote.addEventListener("submit", (e) => {
  e.preventDefault();
  createAddQuoteForm();
});

function createAddQuoteForm() {
//converting quotes to objects, so as to be stored in the array
 const text = formInput.value.trim();
  const category = formCategory.value.trim();

  if (!text || !category) return;

  // 1️⃣ store quote as object
  const newQuote = {
    text,
    category
  };

  quoteContainer.push(newQuote);

  const quotesDiv = document.createElement("div");
  quotesDiv.classList.add("quotes");

  const quotesParagragh = document.createElement("p");
  quotesParagragh.classList.add("quotesP");
  quotesParagragh.textContent = formInput.value;

  const quotesCategory = document.createElement("small");
  quotesCategory.classList.add("quotesC");
  quotesCategory.textContent = formCategory.value;

  quotesDiv.append(quotesParagragh, quotesCategory);

  quoteDisplaySect.appendChild(quotesDiv);

  formCategory.value = "";
  formInput.value = "";

}

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quoteContainer.length);
  const randomQuote = quoteContainer[randomIndex];
}

