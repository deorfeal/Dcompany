jQuery(document).ready(function () {

    // Инициализация MixItUp
    if (document.querySelector('.portfolio__wrapper')) {
        var mixer = mixitup('.portfolio__wrapper', {
            load: {
                filter: '.best'
            },
            animation: {
                enable: true
            },
            callbacks: {
                onMixEnd: function (state) {
                    // Реинициализация AOS после каждой фильтрации
                    AOS.refresh();
                }
            }
        });
    }

    // Функция для подсчета элементов и обновления span
    function updateButtonCounts() {
        // Объект для хранения количества элементов для каждого фильтра
        const filters = {
            all: 0,
            best: 0,
            land: 0,
            'internet-shop': 0,
            animated: 0,
            multipage: 0,
            quiz: 0
        };

        // Подсчет количества элементов для каждого фильтра
        for (let filter in filters) {
            filters[filter] = document.querySelectorAll(`.mix.${filter}`).length;
        }

        // Обновление кнопок с количеством элементов
        for (let filter in filters) {
            const button = document.querySelector(`.tubs__button[data-filter=".${filter}"]`);
            if (button) {
                const span = button.querySelector('span');
                if (span) {
                    span.textContent = ` (${filters[filter]})`;
                }
            }
        }
    }

    // Вызов функции для обновления количества элементов
    updateButtonCounts();

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    const once = isMobileDevice() ? true : false;

    (function () {
        // Инициализация AOS
        AOS.init({
            duration: 750,
            offset: 0, // смещение (в пикселях) от оригинальной точки срабатывания
            anchorPlacement: 'top-bottom', // определяет, где будут срабатывать анимации AOS
            once: once
        });
    })();
});

// Определяем язык страницы
const lang = document.documentElement.lang;

function createNotificationContainer() {
    let container = document.querySelector('.notifications');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notifications';
        document.body.appendChild(container);
    }
    return container;
}

// Вызываем перед добавлением уведомления
const notificationContainer = createNotificationContainer();

let notificationCount = 0;
function showNotification(message, type) {
    const notificationsContainer = document.querySelector('.notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    notification.innerText = message;

    notificationsContainer.appendChild(notification);
    updatePositions();

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
            updatePositions();
        }, 300);
    }, 3000);
}

function updatePositions() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((el, index) => {
        el.style.transform = `translateY(${index * 60}px)`;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    if (!form) {
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Остановить стандартную отправку формы

        // Получаем элементы формы
        const nameInput = document.getElementById("name");
        const contactInput = document.querySelector(".contact-form__box-input#contact");
        const messageInput = document.getElementById("message");
        const consentCheckbox = document.getElementById("consent");
        const consentCheckboxElement = document.querySelector(".contact .checkmark");

        let isValid = true;

        function getValue(input) {
            return input && input.value ? input.value.trim() : "";
        }

        function showError(input, message) {
            if (input) {
                input.classList.add("error-field");
                input.setAttribute("data-error", message);
            }
            isValid = false;
        }

        function clearError(input) {
            if (input) {
                input.classList.remove("error-field");
                input.removeAttribute("data-error");
            }
        }

        // Получаем значения
        const nameValue = getValue(nameInput);
        const contactValue = getValue(contactInput);
        const messageValue = getValue(messageInput);

        if (nameValue === "") {
            if (lang === 'en') {
                showNotification("Enter your name", "error"), showError(nameInput);
            } else {
                showNotification("Введите ваше имя", "error"), showError(nameInput);
            }
        } else {
            clearError(nameInput);
        }

        if (contactValue === "") {
            if (lang === 'en') {
                showNotification("Enter your contact", "error"), showError(contactInput);
            } else {
                showNotification("Введите ваш контакт", "error"), showError(contactInput);
            }

        } else {
            clearError(contactInput);
        }


        if (messageValue === "") {
            if (lang === 'en') {
                showNotification("Enter your question", "error"), showError(messageInput);
            } else {
                showNotification("Введите ваш вопрос", "error"), showError(messageInput);
            }
        } else {
            clearError(messageInput);
        }

        if (!consentCheckbox || !consentCheckbox.checked) {
            if (lang === 'en') {
                showNotification("Please accept our privacy policy", "error");
            } else {
                showNotification("Пожалуйста, принимите нашу политику конфиденциальности ", "error");
            }

            showError(consentCheckboxElement);
            isValid = false;
        } else {
            clearError(consentCheckboxElement);
        }

        if (!isValid) return; // Если есть ошибки, прекращаем выполнение

        // Отправка в Telegram
        const BOT_TOKEN = "7918877031:AAEv9vqtG-sDgyI_SMY80EoD0jZ90uA4R5A";
        const CHAT_ID = "624283568";
        const text = `📩 Новое сообщение:\n👤 Имя: ${nameValue}\n✉️ Контакт: ${contactValue}\n📝 Вопрос: ${messageValue}`;

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "HTML" })
        })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    if (lang === 'en') {
                        showNotification("Message sent successfully!", "success");
                    } else {
                        showNotification("Сообщение успешно отправлено!", "success");
                    }

                    form.reset();
                } else {
                    if (lang === 'en') {
                        showNotification("Message sending error", "error");
                    } else {
                        showNotification("Ошибка отправки сообщения", "error");
                    }
                }
            })
            .catch(() => {
                if (lang === 'en') {
                    showNotification("Message sending error", "error");
                } else {
                    showNotification("Ошибка отправки сообщения", "error");
                }
            });
    });
});


$(document).on('scroll', function () {
    var $footer = $('.footer');
    var $socials = $('.socials');
    var footerTop = $footer.offset().top;
    var footerBottom = footerTop + $footer.outerHeight();
    var windowBottom = $(window).scrollTop() + $(window).height();

    if (windowBottom > footerTop && $(window).scrollTop() < footerBottom) {
        $socials.addClass('socials--disabled');
    } else {
        $socials.removeClass('socials--disabled');
    }
});

// 

document.addEventListener('DOMContentLoaded', function () {
    const duration = 1500; // Длительность анимации в миллисекундах

    // Получаем все элементы с классом score-item__digit
    const targets = document.querySelectorAll('.counter');

    // Создаем Observer
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Начинаем счетчик для каждого элемента
                const target = entry.target;
                const endValue = parseFloat(target.getAttribute('data-value'));
                startCounter(target, endValue, duration);
                observer.unobserve(target);
            }
        });
    });

    // Наблюдаем за каждым элементом
    targets.forEach(target => observer.observe(target));

    function startCounter(element, endValue, duration) {
        let startValue = 0;
        let startTime = null;

        function updateCounter(currentTime) {
            if (!startTime) startTime = currentTime;
            let progress = currentTime - startTime;
            let currentValue = Math.min(endValue, startValue + (progress / duration) * (endValue - startValue));
            element.textContent = Math.round(currentValue);

            if (currentValue < endValue) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = Math.round(endValue);
            }
        }

        requestAnimationFrame(updateCounter);
    }
});

// 

$(function () {

    $('.socials').on('click', function (event) {
        event.stopPropagation(); // Останавливаем всплытие события
        $(this).toggleClass('socials--active');
    });

    $(document).on('click', function () {
        $('.socials').removeClass('socials--active');
    });

    $('.faq-list__item').on('click', function (event) {
        // Закрываем все активные элементы
        $('.faq-list__item--active').not(this).removeClass('faq-list__item--active');

        // Переключаем состояние элемента, на который кликнули
        $(this).toggleClass('faq-list__item--active');
    });

    $('.burger').on('click', function (event) {
        $('body').toggleClass('body--menu');
    });

    $('.menu__list-link').on('click', function (event) {
        $('body').removeClass('body--menu');
    });

})

$(function () {
    // Функция для проверки на мобильные устройства
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Если устройство мобильное, то используем событие клика
    if (isMobileDevice()) {
        $(document).on('click', function (event) {
            // Проверяем, является ли цель клика элементом с классом '.lang'
            if (!$(event.target).closest('.lang').length) {
                // Если нет, убираем класс 'lang--active' у всех элементов с этим классом
                $('.lang').removeClass('lang--active');
            } else {
                // Иначе добавляем/убираем класс 'lang--active' для элемента с классом '.lang'
                $(event.target).closest('.lang').toggleClass('lang--active');
            }
        });
    } else { // Иначе используем событие ховера
        $('.lang').on('mouseover', function () {
            $(this).addClass('lang--active');
        });

        $('.lang').on('mouseout', function () {
            $(this).removeClass('lang--active');
        });
    }
});

// Массивы строк для разных языков
const strings = lang === 'en'
    ? ["I'm a Front-end developer", "I'm a Web Designer", "I'm not afraid of Back-end", "I'll strengthen your team!"]
    : ["Я Front-end developer", "Я Web Designer", "Я не боюсь Back-end", "Я усилю Вашу команду!"];

// Инициализация Typed.js
$(".typed").typed({
    strings: strings,
    stringsElement: null,
    typeSpeed: 30,
    startDelay: 250,
    backSpeed: 30,
    backDelay: 500,
    loop: true,
    loopCount: 2,
    showCursor: true,
    cursorChar: "|",
    attr: null,
    contentType: 'text',
    callback: function () { },
    preStringTyped: function () { },
    onStringTyped: function () { },
    resetCallback: function () { }
});


let codeSwiper = new Swiper('.code-swiper', {
    slidesPerView: 3.5,
    loop: true,
    initialSlide: 0,
    centeredSlides: true,
    speed: 750,
    direction: 'vertical',
    spaceBetween: 4,
    autoplay: {
        delay: 2000, // Set the delay (in milliseconds) between each slide transition
        disableOnInteraction: false, // Set to true to keep autoplay running even when the user interacts with the slider (e.g., swipes manually)
    },
    breakpoints: {
        320: {
            slidesPerView: 1.5,
            loop: true,
            initialSlide: 0,
            centeredSlides: false,
            speed: 750,
            direction: 'horizontal',
            spaceBetween: 12,
        },
        551: {
            slidesPerView: 1.75,
            loop: true,
            initialSlide: 0,
            centeredSlides: false,
            speed: 750,
            direction: 'horizontal',
            spaceBetween: 12,
        },
        651: {
            slidesPerView: 2.5,
            loop: true,
            initialSlide: 0,
            centeredSlides: false,
            speed: 750,
            direction: 'horizontal',
            spaceBetween: 12,
        },
        801: {
            slidesPerView: 3.5,
            loop: true,
            initialSlide: 0,
            centeredSlides: true,
            speed: 750,
            direction: 'vertical',
            spaceBetween: 4,
        },
    }
});

codeSwiper.on('slideChange', function () {
    document.querySelector('.code-swiper').classList.add('code-swiper--active');
});

let codeSwiperContainer = document.querySelector('.code-swiper');

if (codeSwiperContainer) {
    codeSwiperContainer.addEventListener('mouseenter', function () {
        codeSwiper.autoplay.stop();
    });

    codeSwiperContainer.addEventListener('mouseleave', function () {
        codeSwiper.autoplay.start();
    });
}

new Swiper('.skills-swiper--first', {
    slidesPerView: 7,
    loop: true,
    initialSlide: 0,
    centeredSlides: true,
    speed: 750,
    spaceBetween: 20,
    autoplay: {
        delay: 750, // Set the delay (in milliseconds) between each slide transition
        disableOnInteraction: false, // Set to true to keep autoplay running even when the user interacts with the slider (e.g., swipes manually)
    },
    // breakpoints: {
    //     301: {
    //         slidesPerView: 2.2,
    //         centeredSlides: true,
    //         initialSlide: 1,
    //         slidesPerGroup: 1,
    //         loopedSlides: 6,
    //     },
    //     501: {
    //         slidesPerView: 2.5,
    //         centeredSlides: true,
    //         initialSlide: 1,
    //         slidesPerGroup: 1,
    //         loopedSlides: 6,
    //     },
    // }
});

new Swiper('.skills-swiper--second', {
    slidesPerView: 7,
    loop: true,
    initialSlide: 0,
    centeredSlides: true,
    speed: 750,
    spaceBetween: 20,
    // direction: 'vertical',
    autoplay: {
        reverseDirection: true,
        delay: 750, // Set the delay (in milliseconds) between each slide transition
        disableOnInteraction: false, // Set to true to keep autoplay running even when the user interacts with the slider (e.g., swipes manually)
    },
    // breakpoints: {
    //     301: {
    //         slidesPerView: 2.2,
    //         centeredSlides: true,
    //         initialSlide: 1,
    //         slidesPerGroup: 1,
    //         loopedSlides: 6,
    //     },
    //     501: {
    //         slidesPerView: 2.5,
    //         centeredSlides: true,
    //         initialSlide: 1,
    //         slidesPerGroup: 1,
    //         loopedSlides: 6,
    //     },
    // }
});


let testimonialsSwiper = new Swiper('.testimonials-swiper', {
    slidesPerView: 3,
    loop: true,
    initialSlide: 1,
    centeredSlides: true,
    speed: 1000,
    spaceBetween: 20,
    autoplay: {
        delay: 1000, // Delay between slides in milliseconds (3 seconds in this example)
        disableOnInteraction: false, // Autoplay continues even when the user interacts with the slider
    },
    // navigation: {
    //     prevEl: '.catalog-first-swiper-button-prev',
    //     nextEl: '.catalog-first-swiper-button-next',
    // },
    // pagination: {
    //     el: '.recalls-swiper__pagination',
    //     type: 'bullets',
    // },
    breakpoints: {
        301: {
            slidesPerView: 1.2,
            loop: true,
            initialSlide: 1,
            centeredSlides: true,
            speed: 1000,
            spaceBetween: 15,
        },
        551: {
            slidesPerView: 2.2,
            loop: true,
            initialSlide: 1,
            centeredSlides: true,
            speed: 1000,
            spaceBetween: 15,
        },
        751: {
            slidesPerView: 3.2,
            loop: true,
            initialSlide: 1,
            centeredSlides: true,
            speed: 1000,
            spaceBetween: 15,
        },
        1351: {
            slidesPerView: 3,
            loop: true,
            initialSlide: 1,
            centeredSlides: true,
            speed: 1000,
            spaceBetween: 20,
        },
    }
});

let testimonialsSwiperContainer = document.querySelector('.testimonials-swiper');

if (testimonialsSwiperContainer) {
    testimonialsSwiperContainer.addEventListener('mouseenter', function () {
        testimonialsSwiper.autoplay.stop();
    });

    testimonialsSwiperContainer.addEventListener('mouseleave', function () {
        testimonialsSwiper.autoplay.start();
    });
}

