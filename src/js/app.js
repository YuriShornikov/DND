class AddCard {
  constructor() {
    this.btn = document.querySelectorAll('.btn.add');
    this.board = document.querySelector('.board');
  }

  init() {
    this.toShow();
    this.loadBoardState();
    this.setupAddCardButtons();
  }

  static get addHtml() {
    return `
      <div class="newCard">
        <textarea class="textarea" placeholder="Enter a title for this card..." name="" id=""></textarea>
        <div class="button">
          <button class="addCard" type="submit">Add card</button>
          <button class="deleteCard" type="submit">Delete</button>
        </div>
      </div>
    `;
  }

  // Обработчик добавления новой карточки
  setupAddCardButtons() {
    this.btn.forEach((btlEl) => {
      let count = 0;
      btlEl.addEventListener('click', (e) => {
        count += 1;
        if (count <= 1) {
          btlEl.insertAdjacentHTML('afterend', AddCard.addHtml);
          const column = e.target.closest('.column');
          const addCard = column.querySelector('.addCard');
          const deleteCard = column.querySelector('.deleteCard');
          const newCard = column.querySelector('.newCard');

          deleteCard.addEventListener('click', () => this.delete(newCard));
          addCard.addEventListener('click', () => this.add(column, btlEl));
          count = 0;
        }
      });
    });
  }

  // Drag and Grop
  toShow() {
    const cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
      this.enableDragDrop(card);
      this.addEffectCard(card);
    });

    this.board.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const activeEl = this.board.querySelector('.selected');
      const targetEl = e.target.closest('.card');

      if (targetEl && this.board.contains(targetEl) && targetEl !== activeEl) {
        /* eslint-disable max-len */
        const nextEl = (targetEl === activeEl.nextElementSibling) ? targetEl.nextElementSibling : targetEl;

        activeEl.style.opacity = 0.3;
        targetEl.parentNode.insertBefore(activeEl, nextEl);
      } else {
        activeEl.style.opacity = 0.3;
        if (e.target.closest('.btn.add')) {
          e.target.closest('.btn.add').before(activeEl);
        }
      }
    });
  }

  // Drag and Drop start/end
  enableDragDrop(card) {
    /* eslint no-param-reassign: "error" */
    card.draggable = true;
    card.addEventListener('dragstart', (e) => {
      e.target.classList.add('selected');
    });
    card.addEventListener('dragend', (e) => {
      const activeEl = document.querySelector('.selected');
      activeEl.style.opacity = 1;
      e.target.classList.remove('selected');
      this.saveBoardState();
    });
  }

  // Метод удаления карточки
  delete(htmlElement) {
    htmlElement.remove();
    this.saveBoardState();
  }

  // Метод добавления карточки
  add(htmlElement, targetElement) {
    const textareaVal = htmlElement.querySelector('.textarea').value;
    if (textareaVal.trim() === '') {
      // eslint-disable-next-line no-alert
      alert('Заполните поле');
    } else {
      const newCard = htmlElement.querySelector('.newCard');
      const card = document.createElement('div');
      card.className = 'card';
      card.textContent = textareaVal;
      targetElement.before(card);

      this.enableDragDrop(card);
      this.addEffectCard(card);

      this.delete(newCard);
      this.saveBoardState();
    }
  }

  // Добавление эффекта для карточки
  addEffectCard(card) {
    card.addEventListener('mouseenter', () => this.addButton(card));
    card.addEventListener('mouseleave', () => this.deleteButton(card));
  }

  // Добавление кнопки закрыть на карточке
  addButton(card) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = '&#10006;';
    card.appendChild(deleteButton);

    // Удаление карточки по кнопке
    deleteButton.addEventListener('click', () => this.delete(card));
  }

  // Удаление отображения кнопки закрыть на карточке
  static deleteButton(card) {
    const deleteButton = card.querySelector('.delete-button');
    if (deleteButton) {
      deleteButton.remove();
    }
  }

  // Сохранение в localstorage
  saveBoardState() {
    const boardHTML = this.board.innerHTML;
    localStorage.setItem('boardState', boardHTML);
  }

  // Загрузка состояния доски из localStorage
  loadBoardState() {
    const savedBoardState = localStorage.getItem('boardState');
    if (savedBoardState) {
      this.board.innerHTML = savedBoardState;

      this.toShow();
      this.setupAddCardButtons();
      this.btn = document.querySelectorAll('.btn.add');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const addCard = new AddCard();
  addCard.init();
});
