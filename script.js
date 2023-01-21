"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};
/////////////////////////////////////////////
//USING FOREACH
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
//FOR LOOP
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener("click", openModal);
//////////////////////////////////////////
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//////////////////////////////////////////////
// Button Scrolling

btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});
//////////////////////////////////////////////
//Page Navigation using event delegation

//1.Add event listener to common parent element
//2.Determine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  //Matching stratergy
  if (e.target.classList.contains("nav__link")) {
    e.preventDefault();
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});
///////////////////////////////////////////////
//Tabbed component

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  if (!clicked) {
    //(null)
    return;
  }
  //Removing active status from all button
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));

  //Adding active status from clicked button
  clicked.classList.add("operations__tab--active");

  //removing all text content
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  //displaying clicked text content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//////////////////////////////////////////////
//Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
//Passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
//mouseout opposite is mouseover
nav.addEventListener("mouseout", handleHover.bind(1));

//////////////////////////////////////////////
//Sticky nav bar:Intersection Observer API
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries; //destructuring,entries is array in that only intreseted in entries[0]
  // console.log(entries);
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, //when header is 0% visible in viewport trigger callBack function
  rootMargin: `-${navHeight}px`, //in the nav height px of header it will be visible
});
headerObserver.observe(header);

//////////////////////////////////////////////
//Revealing sections when we scroll
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    return;
  }
  entry.target.classList.remove("section--hidden");
  observer.unobserver(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});
///////////////////////////////////////////////
//Lazy Loading of images in section--1
const imgTargets = document.querySelectorAll("img[data-src]");
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    return;
  }
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserver(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});
imgTargets.forEach((img) => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
//////////////////////////////////////////////
///////////////////////////////////////////////

//Page Navigation
// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

// //COOKIE
// //Creating Cookie
// const message = document.createElement("div");
// message.classList.add("cookie-message");

// //Inserting the created cookie
// message.innerHTML = `we use cookie for improved services to be given.<button class="btn btn--close--cookie">Got it!</button>`;

// const header = document.querySelector(".header");
// header.append(message);

// //Deleting the cookie
// document
//   .querySelector(".btn--close--cookie")
//   .addEventListener("click", function () {
//     message.remove();
//   });

// //STYLE
// message.style.backgroundColor = "red";
// message.style.width = "80%";

// //ATTRIBUTE
// const logo = document.querySelector(".nav__logo");
// logo.alt = "Beautiful logo";
// logo.src; //(ouput)http://127..0..............
// logo.getAttribute("src"); //(output)img/logo.png
// logo.setAttribute("company", "Bankist");

// //CLASSES
// logo.classList.add('c','j');
// logo.classList.remove('c','j');
// logo.classList.toggle('c','j');
// logo.classList.contains('c','j');

// //Dont use this
// logo.className="shamitha";
//////////////////////////////////////////////
///////////////////////////////////////////////
// const alertH1 = function (e) {
//   alert("Great");
// };

// const h1 = document.querySelector("h1");
// h1.addEventListener("mouseenter", alertH1);

// setTimeout(() => h1.removeEventListener("mouseenter", alertH1), 3000);
