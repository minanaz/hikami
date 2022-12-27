// !====================== SWIPER START =================================
// Инициализируем свайпер
new Swiper(".image-slider", {
    // Стрелки
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    // Навигация, буллеты
    pagination: {
        el: ".swiper-pagination", // достаем объект
        clickable: true, // кликабельность точек
        dynamicBullets: true, // динамические точки
    },

    // Полоса прокрутки
    scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
    },

    // Курсор перетаскивания
    grabCursor: true,

    // Управление клавиатурой
    keyboard: {
        enabled: true,
        onlyInViewPort: true,
        pageUpDown: true,
    },
    // Автовысота
    autoHeight: true,

    // Бесконечность
    loop: true,

    // Автопрокрутка
    autoplay: {
        // пауза между прокрутками
        delay: 3000,
        // Отключить после ручного переключения
        disableOnIteration: false,
    },

    // Скорость прокрутки
    speed: 800,

    // Эффект переключения слайдов
    effect: "fade",
    // Дополнение к эффекту
    fadeEffect: {
        // Параллельная смена прозрачности
        crossFade: true,
    },

    // // вертикальный слайдер
    //// direction: "vertical",
});

// ?====================== SWIPER END =================================

// !====================== NOW ITS THE  START =================================

// инпуты для создания новых анимешек
const API = "http://localhost:8000/anime";
const inpDesc = document.getElementsByClassName("desc-input")[0];
const inpName = document.getElementsByClassName("name-input")[0];
const inpGenre = document.getElementsByClassName("genre-input")[0];
const inpUrl = document.getElementsByClassName("url-input")[0];
const inpTime = document.getElementsByClassName("time-input")[0];
const btnAdd = document.getElementsByClassName("btn-add")[0];
const accordion = document.getElementsByClassName("accordion__header")[0];
const accordionBody = document.getElementById("accordion__body");

// селекторы админа
const sectionAdd = document.getElementsByClassName("section__add")[0];
const openApmin = document.getElementById("open-admin");
const adminsPanels = document.getElementsByClassName("admin-panel");

// поиск
const inpSearch = document.getElementsByClassName("search-txt")[0];
let searchValue = inpSearch.value;

// тег для отображения карточек
const animeList = document.getElementsByClassName("anime-list")[0];

// достаем инпуты для редактирования
const inpEditName = document.getElementsByClassName("modal-input-name")[0];
const inpEditGenre = document.getElementsByClassName("modal-input-genre")[0];
const inpEditTime = document.getElementsByClassName("modal-input-time")[0];
const inpEditDesc = document.getElementsByClassName("modal-input-desc")[0];
const inpEditUrl = document.getElementsByClassName("modal-input-url")[0];
const btnSave = document.getElementsByClassName("modal-save")[0];

// селектор модалки
const mainModal = document.getElementsByClassName("modal-wrapper")[0];
const btnClose = document.getElementsByClassName("close-btn")[0];

// пагинация
const prevBtn = document.getElementsByClassName("prev-btn")[0];
const nextBtn = document.getElementsByClassName("next-btn")[0];
const limit = 3;
let currentPage = 1;
let genre = "all";

// ! ============ ADMIN START ==============
let password = "";
// проверяем пароль
function checkAdmin() {
    if (password === "123") {
        for (let i of adminsPanels) {
            i.style.display = "block";
        }
        sectionAdd.style.display = "block";
    } else {
        for (let i of adminsPanels) {
            i.style.display = "none";
        }
        sectionAdd.style.display = "none";
    }
}

// событие на иконку админа
openApmin.addEventListener("click", function () {
    password = prompt("Введите пароль");
    checkAdmin();
});
// ? =========== ADMIN END ==============

// ! ============ ACCORDION START ==============
// событие на кнопку 'добавить товар'
accordion.addEventListener("click", function () {
    accordion.classList.toggle("active");
    if (accordion.classList.contains("active")) {
        //! contains проверка есть ли такой класс
        accordionBody.style.maxHeight = accordionBody.scrollHeight + "px";
    } else {
        accordionBody.style.maxHeight = 0;
    }
});
// ? ============ ACCORDION END ==============

// ! ============ CREATE START ==============
// Добавляем карточку с аниме
btnAdd.addEventListener("click", function () {
    if (
        !inpDesc.value.trim() ||
        !inpName.value.trim() ||
        !inpGenre.value.trim() ||
        !inpTime.value.trim() ||
        !inpUrl.value.trim()
    ) {
        alert("Заполните поля!");
        return;
    }
    const newAnime = {
        desc: inpDesc.value,
        name: inpName.value,
        genre: inpGenre.value,
        time: inpTime.value,
        url: inpUrl.value,
        liked: false,
    };
    createAnime(newAnime);
    inpDesc.value = "";
    inpName.value = "";
    inpGenre.value = "";
    inpTime.value = "";
    inpUrl.value = "";
    render();
});

//  Отправляем объект с аниме в базу данных
async function createAnime(newAnime) {
    const options = {
        method: "POST",
        body: JSON.stringify(newAnime),
        headers: {
            "Content-Type": "application/json",
        },
    };
    await fetch(API, options);
    render();
}
// ? ============ CREATE END ==============

// ! ============ GET ANIME START ==============
//  Получаем массив с объектами из базы данных
async function getAnime() {
    const response = await fetch(`
      ${API}?q=${searchValue}&_limit=${limit}&_page=${currentPage}&${
        genre === "all" ? "" : "genre=" + genre
    }`);
    // const response = await fetch(`${API}?q=${searchValue}`);
    const result = await response.json();
    return result;
}

// получаем анимешку по айди
async function getAnimeById(id) {
    const response = await fetch(`${API}/${id}`);
    const result = await response.json();
    return result;
}
// ? ============ GET ANIME END ==============

// ! ============ RENDER START ==============
async function render() {
    const data = await getAnime();
    animeList.innerHTML = "";
    data.forEach((anime) => {
        animeList.innerHTML += ` <div class="anime-card">
        <div class="anime-card__img">
            <img
                src="${anime.url}"
                alt=""
            />
        </div>
        <div class="anime-info">
            <div class="anime-genre">
                <p>${anime.genre}</p>
            </div>
            <div class="anime-name">
                <p>${anime.name}</p>
            </div>
            <div class="anime-time">
                <p>${anime.time}</p>
            </div>
            <div class="anime-desc">
                <p>
                   ${anime.desc}
                </p>
            </div>
        </div>
        <div class= "admin-panel" id= "admin">
        <img 
        src= "https://cdn-icons-png.flaticon.com/512/6073/6073601.png"
        alt= ""
        width= "30"
        onclick= "deleteProduct(${anime.id})"
        />
        <img 
        src= "https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png"
        alt= ""
        width= "30"
        onclick= "handleEdit(${anime.id})"
        />
    </div>
    </div>`;
    });
    checkTotalPages();
    checkAdmin();
}
// ? ============ RENDER END ==============

// ! ============ DELETE START ==============
// удаляем карточку
async function deleteProduct(id) {
    await fetch(`${API}/${id}`, {
        method: "DELETE",
    });
    render();
}
// ? ============ DELETE END ==============

// ! ============ EDIT START ==============
let editId = ""; // айди анимешки

async function handleEdit(id) {
    mainModal.style.display = "block";

    const animeToEdit = await getAnimeById(id);
    console.log(animeToEdit);

    inpEditName.value = animeToEdit.name;
    inpEditGenre.value = animeToEdit.genre;
    inpEditTime.value = animeToEdit.time;
    inpEditDesc.value = animeToEdit.desc;
    inpEditUrl.value = animeToEdit.url;
    editId = animeToEdit.id;
}

// изменяет анимешку в базе данных
async function editAnime(id, editedAnime) {
    await fetch(`${API}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(editedAnime),
        headers: {
            "Content-Type": "application/json",
        },
    });
    render();
}

btnSave.addEventListener("click", function () {
    if (
        !inpEditName.value.trim() ||
        !inpEditGenre.value.trim() ||
        !inpEditTime.value.trim() ||
        !inpEditDesc.value.trim() ||
        !inpEditUrl.value.trim()
    ) {
        alert("Заполните поля!");
        return;
    }
    const editedAnime = {
        name: inpEditName.value,
        genre: inpEditGenre.value,
        time: inpEditTime.value,
        desc: inpEditDesc.value,
        url: inpEditUrl.value,
        liked: false,
    };
    editAnime(editId, editedAnime);
    mainModal.style.display = "none";
});
btnClose.addEventListener("click", function () {
    mainModal.style.display = "none";
});
// ? ============ EDIT END ==============

// ! ============ SEARCH START ==============
inpSearch.addEventListener("input", function (e) {
    searchValue = e.target.value;
    render();
});
// ? ============ SEARCH END ==============

// ! ============ PAGINATION START ==============
let countPage = 1;
async function checkTotalPages() {
    const response = await fetch(`${API}?q=${searchValue}`);
    const data = await response.json();
    countPage = Math.ceil(data.length / limit);
    console.log(data.length);
}
prevBtn.addEventListener("click", function () {
    if (currentPage <= 1) return;
    currentPage--;
    render();
});
nextBtn.addEventListener("click", function () {
    if (currentPage >= countPage) return;
    currentPage++;
    render();
});
// ? ============ PAGINATION END ==============
render();

// спасибочки, вы лучшие ребят <3
