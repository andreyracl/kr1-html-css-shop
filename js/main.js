// Скрипт подключён на страницах index.html (модальное окно) и order.html (форма на странице).
// Поэтому перед работой с элементом проверяем, что он есть на текущей странице.

// Модальное окно и элементы, связанные с ним (есть только на главной).
const orderDialog = document.getElementById('order-dialog');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');
const dialogProductName = document.getElementById('order-dialog-product');

// Кнопки «Заказать» в карточках товаров.
// [data-product] нужен, чтобы не захватить ссылки «Подробнее» с тем же БЭМ-классом.
const orderButtons = document.querySelectorAll('.product-card__button[data-product]');

// Форма заявки и сообщение об успехе (есть на главной и на order.html).
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

// Открываем модальное окно по кнопке «Заказать».
if (orderDialog) {
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Получаем название товара из data-атрибута.
      const productName = button.dataset.product;

      // Записываем товар в скрытое поле и показываем его в окне.
      selectedProductInput.value = productName;
      dialogProductName.textContent = productName;

      // Прячем сообщение от предыдущей заявки.
      successMessage.hidden = true;

      orderDialog.showModal();
    });
  });

  // Закрываем модальное окно по кнопке «Закрыть».
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });
}

// Обрабатываем отправку формы.
if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    // Отменяем стандартную отправку формы, потому что backend пока не подключён.
    event.preventDefault();

    // Сбрасываем предыдущие признаки ошибок.
    const formElements = Array.from(orderForm.elements);

    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    // Проверяем встроенные HTML-ограничения формы.
    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });

      // Показываем стандартные сообщения браузера.
      orderForm.reportValidity();
      return;
    }

    // Показываем сообщение об успешной отправке и очищаем форму.
    successMessage.hidden = false;
    orderForm.reset();

    // Если форма была в модальном окне — закрываем его.
    if (orderDialog) {
      orderDialog.close();
    }
  });
}
