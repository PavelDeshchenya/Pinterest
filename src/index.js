document.addEventListener("DOMContentLoaded", function () {
  const parentDiv = document.getElementById("root");

  const childDiv = document.createElement("div");
  parentDiv.append(childDiv);
  const header = document.createElement("div");

  /// Header
  childDiv.append(header);
  // header logo
  const headerLogo = document.createElement("div");
  header.append(headerLogo);
  const headerLogoImg = document.createElement("img");
  headerLogo.append(headerLogoImg);

  // header input search
  const headerSearch = document.createElement("div");
  header.append(headerSearch);

  const headerSearchDivInput = document.createElement("div");
  headerSearch.append(headerSearchDivInput);
  const headerSearchInput = document.createElement("input");
  headerSearchDivInput.append(headerSearchInput);

  // header pin
  const headerPin = document.createElement("div");
  header.append(headerPin);

  const selectWrapper = document.createElement("div");
  headerPin.append(selectWrapper);

  const selectPin = document.createElement("select");
  selectPin.setAttribute("name", "select-category");
  selectWrapper.append(selectPin);

  const selectPin0 = document.createElement("option");
  selectPin.append(selectPin0);
  selectPin0.setAttribute("value", 0);
  selectPin0.textContent = "Выбрать доску";

  const selectPin1 = document.createElement("option");
  selectPin.append(selectPin1);
  selectPin1.setAttribute("value", 1);
  selectPin1.textContent = "Доска 1";

  const selectPin2 = document.createElement("option");
  selectPin.append(selectPin2);
  selectPin2.setAttribute("value", 2);
  selectPin2.textContent = "Доска 2";

  const selectPin3 = document.createElement("option");
  selectPin.append(selectPin3);
  selectPin3.setAttribute("value", 3);
  selectPin3.textContent = "Доска 3";

  ///// Создание классов SCSS

  parentDiv.classList.add("parentDiv");
  childDiv.classList.add("childDiv");

  header.classList.add("header");

  headerLogo.classList.add("headerLogo");
  headerLogoImg.classList.add("headerLogoImg");

  headerSearch.classList.add("headerSearch");
  headerSearchDivInput.classList.add("headerSearchDivInput");
  headerSearchInput.classList.add("headerSearchInput");
  headerSearchInput.setAttribute("placeholder", "Поиск...");

  headerPin.classList.add("headerPin");
  selectWrapper.classList.add("selectWrapper");
  selectPin.classList.add("selectPin");

  const cards = document.createElement("div");
  cards.classList.add("cards");
  childDiv.append(cards);
  const searchedCards = [];
  let allCards = []; // Сохраняем все карточки

  // массивы для досок
  let board1Cards = [];
  let board2Cards = [];
  let board3Cards = [];

  fetch("https://65e440a73070132b3b246db5.mockapi.io/Pinterest")
    .then((r) => r.json())
    .then((data) => {
      searchedCards.push(...data);
      allCards = [...searchedCards]; // Сохраняем все карточки
      displayCards(searchedCards);
      // console.log(searchedCards);
    })
    .catch(() => {
      console.log("error");
    });

  // Функция для отображения карточек
  function displayCards(cardsToDisplay) {
    cards.innerHTML = ""; // Очищаем контейнер с карточками
    cardsToDisplay.forEach((cardData) => {
      const card = createCard(cardData);
      cards.appendChild(card);
    });
  }

  // Проверка LS

  if (localStorage.getItem("board1Cards")) {
    board1Cards = JSON.parse(localStorage.getItem("board1Cards"));
  }

  if (localStorage.getItem("board2Cards")) {
    board2Cards = JSON.parse(localStorage.getItem("board2Cards"));
  }

  if (localStorage.getItem("board3Cards")) {
    board3Cards = JSON.parse(localStorage.getItem("board3Cards"));
  }

  // Функция поиска карточек по заголовку
  function searchCards(searchTerm, board) {
    let cardsToSearch = allCards; // Используем переменную allCards для поиска всех карточек

    if (board !== "0") {
      // Если выбрана конкретная доска, фильтруем карточки по доске
      cardsToSearch = allCards.filter((card) => card.board === board);
    }
    // Карточки соответствующие поисковому запросу
    const filteredCards = cardsToSearch.filter((card) => {
      const lowerCaseTitle = card.title.toLowerCase(); // title
      const lowerCaseSearchTerm = searchTerm.toLowerCase(); // ввод в input

      return lowerCaseSearchTerm.startsWith("#")
        ? lowerCaseTitle.includes(lowerCaseSearchTerm.slice(1))
        : lowerCaseTitle.includes(lowerCaseSearchTerm);
    });

    displayCards(filteredCards);
  }

  // Слушатель событий для поля ввода поиска
  headerSearchInput.addEventListener("input", function () {
    const selectedBoard = selectPin.value;
    searchCards(headerSearchInput.value, selectedBoard);
  });
  // Слушатель событий для выбора доски
  selectPin.addEventListener("change", function () {
    const selectedValue = selectPin.value;
    switch (selectedValue) {
      case "1":
        displayBoardCards("1");
        break;
      case "2":
        displayBoardCards("2");
        break;
      case "3":
        displayBoardCards("3");

        break;
      default:
        displayCards(allCards); // Отображаем все карточки
        console.log("Все карточки");
        searchCards(headerSearchInput.value, selectedValue); // Передаем значение доски в функцию searchCards
        break;
    }
  });

  // Создание карточки

  function createCard(cardData) {
    const card = document.createElement("div");
    card.classList.add("card");

    // Проверяем наличие свойства id в объекте cardData
    // if (cardData.hasOwnProperty("id")) {
    //   card.dataset.id = cardData.id;
    // }

    const cardPicture = document.createElement("img");
    cardPicture.src = cardData.picture + "?random" + cardData.id; // Используем id или пустую строку, если его нет
    card.appendChild(cardPicture);
    cardPicture.classList.add("cardPicture");

    const cardAvatarTitle = document.createElement("div");
    card.appendChild(cardAvatarTitle);
    cardAvatarTitle.classList.add("cardAvatarTitle");

    const cardAvatar = document.createElement("img");
    cardAvatarTitle.appendChild(cardAvatar);

    cardAvatar.src = cardData.avatar + "?random" + cardData.id; // Используем id или пустую строку, если его нет
    cardAvatar.classList.add("cardAvatar");

    const cardTitle = document.createElement("div");
    cardAvatarTitle.appendChild(cardTitle);
    cardTitle.classList.add("cardTitle");
    cardTitle.textContent = `#${cardData.title}`;

    // Обработчик при наведении на карточку
    card.addEventListener("mouseenter", function () {
      const form = createMenu(cardData);
      card.appendChild(form);
    });
    card.addEventListener("mouseleave", function () {
      const form = card.querySelector(".form");
      if (form) {
        form.remove();
      }
    });

    return card;
  }

  // Слушатель событий для поля ввода поиска

  function createMenu(cardData) {
    const form = document.createElement("div");
    form.classList.add("form");

    const ButtonChooseBoard = document.createElement("button");
    ButtonChooseBoard.textContent = "Выбрать доску";
    ButtonChooseBoard.dataset.type = "choose";

    ButtonChooseBoard.addEventListener("click", function (e) {
      const modalMenu = createButtonsModalMenu();
      const childDiv = document.querySelector(".childDiv");
      childDiv.append(modalMenu);

      // Привязываем обработчики событий к кнопкам

      modalMenu.querySelectorAll(".modalMenuBtns__btnPin").forEach((btn) => {
        btn.addEventListener("click", function (e) {
          const board = e.target.dataset.id;
          cardData.board = board;
          // console.log(board);

          addCardToBoard(cardData, board); // Передаем данные текущей карточки
        });
      });
    });
    form.appendChild(ButtonChooseBoard);
    ButtonChooseBoard.classList.add("buttonPin");

    const buttonComplaint = document.createElement("button");
    buttonComplaint.textContent = "Пожаловаться";

    buttonComplaint.addEventListener("click", function (e) {
      e.preventDefault();
      const complaintMenu = createComplaintModalMenu();
      const childDiv = document.querySelector(".childDiv");
      childDiv.append(complaintMenu);
      lockScroll();

      console.log("Пожаловаться");
    });
    form.appendChild(buttonComplaint);
    buttonComplaint.classList.add("buttonDelete");
    return form;
  }

  //Создание меню кнопок для добавление на соотв доски
  function createButtonsModalMenu() {
    const modalMenu = document.createElement("div");
    const modalMenuBtns = document.createElement("div");
    modalMenu.appendChild(modalMenuBtns);

    modalMenu.classList.add("modalMenu");
    modalMenuBtns.classList.add("modalMenu__modalMenuBtns");
    const btnBoardClose = document.createElement("button");
    const btnBoard1 = document.createElement("button");
    const btnBoard2 = document.createElement("button");
    const btnBoard3 = document.createElement("button");

    modalMenuBtns.appendChild(btnBoardClose);
    modalMenuBtns.appendChild(btnBoard1);
    modalMenuBtns.appendChild(btnBoard2);
    modalMenuBtns.appendChild(btnBoard3);

    btnBoardClose.setAttribute("data-closeModal", "0");
    btnBoard1.setAttribute("data-id", "1");
    btnBoard2.setAttribute("data-id", "2");
    btnBoard3.setAttribute("data-id", "3");

    btnBoardClose.classList.add("modalMenuBtns__btnPin0");
    btnBoard1.classList.add("modalMenuBtns__btnPin");
    btnBoard2.classList.add("modalMenuBtns__btnPin");
    btnBoard3.classList.add("modalMenuBtns__btnPin");

    btnBoardClose.textContent = "x";
    btnBoard1.textContent = "Доска 1";
    btnBoard2.textContent = "Доска 2";
    btnBoard3.textContent = "Доска 3";

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModalWindowPin();
        unlockScroll();
      }
    });
    function closeModalWindowPin() {
      modalMenu.remove();
    }

    btnBoardClose.addEventListener("click", function () {
      unlockScroll();
      closeModalWindowPin();
    });

    btnBoard1.addEventListener("click", function () {
      unlockScroll();
      closeModalWindowPin();
      console.log("Доска 1");
    });

    btnBoard2.addEventListener("click", function () {
      unlockScroll();
      console.log("Доска 2");
      closeModalWindowPin();
    });
    btnBoard3.addEventListener("click", function () {
      unlockScroll();
      console.log("Доска 3");
      closeModalWindowPin();
    });

    return modalMenu;
  }

  function createComplaintModalMenu() {
    const complaintMenu = document.createElement("div");
    const complaintContainer = document.createElement("div");
    complaintMenu.append(complaintContainer);

    const complaintContent = document.createElement("div");
    complaintContainer.append(complaintContent);

    const complaintHeader = document.createElement("div");
    complaintContent.append(complaintHeader);
    complaintHeader.textContent = "Жалоба на пин";
    const inputRadioWrapper = document.createElement("div");
    complaintContent.append(inputRadioWrapper);

    for (let i = 1; i <= 9; i++) {
      // Создаем радиокнопку

      const radioContainer = document.createElement("div");
      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.classList.add("complaint-radio");
      radioInput.name = "complaint";
      radioInput.value = i;

      // Создаем метку для радиокнопки
      const label = document.createElement("label");
      label.classList.add("complaint-label");
      label.textContent = `Complaint ${i}`;
      label.setAttribute("for", `complaint${i}`);

      // Добавляем радиокнопку и метку на страницу
      radioContainer.appendChild(radioInput);
      radioContainer.appendChild(label);
      inputRadioWrapper.appendChild(radioContainer);
      inputRadioWrapper.classList.add("inputRadioWrapper");
      radioContainer.classList.add("complaintContent__radioContainer");
    }

    const complaintBtns = document.createElement("div");
    complaintContent.append(complaintBtns);

    const complaintBtnClose = document.createElement("button");
    complaintBtns.append(complaintBtnClose);

    complaintBtnClose.addEventListener("click", function () {
      complaintMenu.remove();
      unlockScroll();
    });

    const complaintBtnApprove = document.createElement("button");
    complaintBtns.append(complaintBtnApprove);

    complaintBtnApprove.addEventListener("click", function (e) {
      e.preventDefault();
      setTimeout(() => complaintMenu.remove(), 500);
      setTimeout(() => alert("Спасибо! Ваша жалоба принята"), 1500);
    });

    complaintMenu.classList.add("complaintMenu");
    complaintContainer.classList.add("complaintMenu__complaintContainer");
    complaintContent.classList.add("complaintContainer__complaintContent");
    complaintHeader.classList.add("complaintContent__complaintHeader");
    inputRadioWrapper.classList.add("inputRadioWrapper");
    complaintBtns.classList.add("complaintContent__complaintBtns");
    complaintBtnClose.classList.add("complaintBtns__complaintBtnClose");
    complaintBtnApprove.classList.add("complaintBtns__complaintBtnApprove");
    // complaintBtnApprove.classList.add(
    //   "complaintBtns__complaintBtnApprove_checkStyle"
    // );
    complaintBtnClose.textContent = "Отмена";
    complaintBtnApprove.textContent = "Подтвердить";
    // complaintBtnApprove.disabled = true;

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModalComplaintWindowPin();
        unlockScroll();
      }
    });
    function closeModalComplaintWindowPin() {
      complaintMenu.remove();
    }

    // Добавляем обработчик событий для каждой радиокнопки
    const radioInputs = document.querySelectorAll(".complaint-radio");

    radioInputs.forEach((radioInput) => {
      radioInput.addEventListener("change", function (e) {
        console.log("Выбрана радиокнопка с значением:", e.target.value);
      });
    });

    return complaintMenu;
  }

  function addCardToBoard(cardData, board) {
    switch (board) {
      case "1":
        board1Cards.push(cardData);

        break;
      case "2":
        board2Cards.push(cardData);

        break;
      case "3":
        board3Cards.push(cardData);

        break;
      default:
        break;
    }
    saveCardsToLocalStorage();
  }

  function displayBoardCards(board) {
    switch (board) {
      case "1":
        displayCards(board1Cards);
        saveCardsToLocalStorage();

        break;
      case "2":
        displayCards(board2Cards);
        saveCardsToLocalStorage();

        break;
      case "3":
        displayCards(board3Cards);
        saveCardsToLocalStorage();

        break;
      default:
        displayCards(searchedCards);

        break;
    }
  }

  // Функция для сохранения карточек в localStorage

  function saveCardsToLocalStorage() {
    localStorage.setItem("board1Cards", JSON.stringify(board1Cards));
    localStorage.setItem("board2Cards", JSON.stringify(board2Cards));
    localStorage.setItem("board3Cards", JSON.stringify(board3Cards));
  }

  function lockScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.body.style.overflow = "auto";
  }
});
// lighthouse расширеие для браузера
