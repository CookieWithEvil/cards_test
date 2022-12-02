const cardContainer = document.getElementById("cards-container");
let fillingOn = false;
const SMALL_CARDS_AMOUNT = 3;
const DELETED_CARDS_KEY = "deleted-cards";

window.addEventListener("load", () => {
  const deletedCardsLength = localStorage.getItem(DELETED_CARDS_KEY);

  const items = { ...localStorage };
  const cards = Object.keys(items).filter((key) => key.includes("card-"));

  const setCardContent = (newCard, isDeleted, i, isSaved) => {
    const rand =
      isDeleted || isSaved
        ? 0
        : Math.round(Math.random() * (CARDS_CONTENT.length - 1));

    const innerContent =
      isSaved && !isDeleted
        ? localStorage
            .getItem(`card-${i || Number(cards.length) + 1}`)
            ?.split("--")
        : isDeleted
        ? localStorage
            .getItem(`deleted-${i || Number(cards.length) + 1}`)
            ?.split("--")
        : null;

    const innerTitle = innerContent && innerContent[0];
    const innerText = innerContent && innerContent[1];

    const cardTitle = innerTitle || CARDS_CONTENT[rand].title;
    const cardText = innerText || CARDS_CONTENT[rand].text;

    newCard.className = "card";
    const title = document.createElement("h3");
    const text = document.createElement("pre");
    title.className = "title";
    text.className = "text";
    title.innerHTML = cardTitle;
    text.innerHTML = cardText;
    newCard.append(title);
    newCard.append(text);

    if (!isDeleted || !isSaved) {
      localStorage.setItem(
        `card-${i || Number(cards.length) + 1}`,
        `${cardTitle}--${cardText}`
      );
    }

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "button-container";
    const seeMorebutton = document.createElement("button");
    const movebutton = document.createElement("button");

    seeMorebutton.innerHTML = "See Details";
    seeMorebutton.onclick = () => fillDetailModal("card-detail", i);
    movebutton.innerHTML = isDeleted && !isSaved ? "Restore" : "Delete";
    movebutton.onclick = () =>
      isDeleted && !isSaved ? addCard() : deleteCard();

    buttonsContainer.append(seeMorebutton);
    buttonsContainer.append(movebutton);

    newCard.append(buttonsContainer);
  };

  const addCard = (toSave = true, i, isSaved) => {
    const newCard = document.createElement("div");
    newCard.className = "card new-card";
    cardContainer.append(newCard);
    setTimeout(() => {
      setCardContent(newCard, !toSave, i, isSaved);
    }, 3000);
    const cardsArray = document.getElementsByClassName("card");
    cardsArray[0].disabled = false;

    if (cardsArray.length <= SMALL_CARDS_AMOUNT) {
      cardContainer.style.justifyContent = "center";
    }
  };

  const fillDetailModal = (id, i) => {
    const modal = document.getElementById("modal");
    modal.className = "visible";
    const content = document.getElementById(id);
    content.className = "visible";

    console.log("i", i, localStorage.getItem(`card-${i}-title`));

    const title = document.getElementById("detail-title");
    const text = document.getElementById("detail-text");
    const innerText = localStorage.getItem(`card-${i}`)?.split("--");
    title.innerHTML = innerText && innerText[0];
    text.innerHTML = innerText && innerText[1];
  };

  const closePreview = () => {
    const modal = document.getElementById("modal");
    const detail = document.getElementById("card-detail");
    const history = document.getElementById("history-content");
    modal.className = "";
    detail.className = "";
    history.className = "";
  };

  const deleteCard = (i) => {
    const cardsArray = document.getElementsByClassName("card");
    cardsArray[cardsArray.length - 1].remove();

    if (cardsArray.length <= SMALL_CARDS_AMOUNT) {
      cardContainer.style.justifyContent = "center";
    }

    const innerText = localStorage
      .getItem(`card-${i || Number(cards.length) - 1}`)
      ?.split("--");
    const cardTitle = innerText && innerText[0]; // localStorage.getItem(`card-${i}-title`);
    const cardText = innerText && innerText[1];

    localStorage.removeItem(`card-${Number(deletedCardsLength) + 1}`);
    localStorage.setItem(DELETED_CARDS_KEY, Number(deletedCardsLength) + 1);

    localStorage.setItem(
      `deleted-${Number(deletedCardsLength) + 1}`,
      `${cardTitle}--${cardText}`
    );

    if (!document.getElementById("history")) {
      const header = document.getElementById("header");

      const historyButton = document.createElement("button");
      historyButton.innerHTML = "See History";
      historyButton.id = "history";
      header.append(historyButton);
    }
  };

  const toggleFill = () => {
    fillingOn = !fillingOn;

    const intervalID = setTimeout(function () {
      if (fillingOn) {
        addCard();
      } else {
        clearInterval(intervalID);
      }
    }, 800);
  };

  const clearCards = () => {
    const cardsArray = document.getElementsByClassName("card");
    for (let i = cardsArray.length - 1; i > 0; i--) {
      cardsArray[i].remove();
    }
    document.getElementById("fill").disabled = true;

    if (cardsArray.length <= SMALL_CARDS_AMOUNT) {
      cardContainer.style.justifyContent = "center";
    }
  };

  document
    .getElementById("close-preview")
    .addEventListener("click", closePreview);
  document
    .getElementById("close-history")
    .addEventListener("click", closePreview);

  document.getElementById("add").addEventListener("click", (e) => addCard());
  document
    .getElementById("delete")
    .addEventListener("click", (e) => deleteCard());
  document
    .getElementById("fill")
    .addEventListener("click", (e) => toggleFill());
  document
    .getElementById("clear")
    .addEventListener("click", (e) => clearCards());

  document.getElementById("history").addEventListener("click", () => {
    const modal = document.getElementById("modal");
    const content = document.getElementById("history-content");
    const cardsContainer = document.getElementById("history-cards-container");

    modal.className = "visible";
    content.className = "visible";

    const deletedCards = Object.keys(items).filter((key) =>
      key.includes("deleted-")
    );

    for (let i = 0; i < deletedCards.length; i++) {
      const deletedCard = document.createElement("div");
      deletedCard.className = "card deleted";
      cardsContainer.append(deletedCard);
      setCardContent(deletedCard, true, i);
    }
  });

  if (cards.length) {
    for (let i = 0; i < cards.length; i++) {
      addCard(false, cards[i].split("card-")[1], true);
    }
  }
});
