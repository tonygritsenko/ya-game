(function () {
  const gameList = document.querySelector(".game__list");
  const items = document.querySelectorAll(".game__item");
  const cart = document.querySelector(".game__cart");
  const cartTop = cart.getBoundingClientRect().top + window.scrollY;
  const cartList = document.querySelector(".game__cart-list");
  const cartLink = document.querySelector(".game__cart-link");

  // Ф-я вкл/выкл курсора (в стилях - cursor: not-allowed;)
  function updateDraggableState() {
    if (cartList.children.length > 2) {
      items.forEach((item) => {
        item.classList.add("not-draggable");
      });
    } else {
      items.forEach((item) => {
        item.classList.remove("not-draggable");
      });
    }
  }

  items.forEach((item) => {
    // Старт перетаскивания
    item.addEventListener("touchstart", onTouchStart);

    function onTouchStart(e) {
      handleDragStart(e.touches[0]);
    }

    // Ф-я перетаскивания
    function handleDragStart(e) {
      // Проверка кол-ва элементов в корзине
      if (cartList.children.length > 2) {
        return;
      }

      // Установка стилей
      item.style.opacity = 0.5;

      // Ф-я, позволяющая оставить элемент при отпускании кнопки мыши
      item.ondragstart = function () {
        return false;
      };

      // Запись изначальных координат элементов
      const initialLeft = item.style.left;
      const initialTop = item.style.top;

      // Ф-и движения элемента
      function moveAt(e) {
        item.style.left = e.pageX - item.offsetWidth / 2 + "px";
        item.style.top = e.pageY - item.offsetHeight / 2 + "px";
      }

      moveAt(e);

      function onMouseMove(e) {
        moveAt(e);
      }

      function onTouchMove(e) {
        moveAt(e.touches[0]);
      }

      // Перемещение движущегося элемента в body
      document.body.append(item);

      // Установка стилей
      item.style.zIndex = 1;

      // Ф-и завершения движения
      function onMouseUp() {
        handleDragEnd();
      }

      function onTouchEnd() {
        handleDragEnd();
      }

      function handleDragEnd() {
        // Удаление слушателей
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);

        // Проверка координат элемента
        const itemTop = item.getBoundingClientRect().top + window.scrollY;

        if (
          itemTop >= cartTop - item.offsetHeight &&
          itemTop <= cartTop + cart.offsetHeight
        ) {
          // Добавление классов и стилей
          item.classList.add("game__cart-item");
          cartList.append(item);
          item.style.opacity = 1;

          // Добавление активной ссылки, если в корзине 3 элемента
          if (cartList.children.length > 2) {
            cartLink.classList.add("game__cart-link--active");
          }
        } else {
          // Если элемент вне корзины при отпускании кнопки мыши -
          // возврат элемента на предустановленные координаты
          gameList.append(item);
          item.style.left = initialLeft;
          item.style.top = initialTop;
          item.style.opacity = 1;
        }

        // Выключение курсора
        updateDraggableState();
      }

      // Добавление слушателей
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onTouchEnd);
    }

    // Окончание перетаскивания
    item.addEventListener("mousedown", onMouseDown);
    function onMouseDown(e) {
      handleDragStart(e);
    }
  });

  // Включение курсора
  updateDraggableState();
})();
