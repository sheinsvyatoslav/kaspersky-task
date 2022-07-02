import './index.css';
import mobilePromoImage from '../images/mobile_promo_image.png'
import promoImage from '../images/promo_image.png'

const bigBuyBlock = document.querySelector('.buy-block__type_big');
const smallBuyBlock = document.querySelector('.buy-block_type_small');
const currencies = document.querySelector('.header__currency');
const oldPrice = document.querySelector('.buy-block__old-price');
const newPriceSmall = document.querySelector('.buy-block__new-price_type_small');
const newPrice = document.querySelector('.buy-block__new-price_type_big');
const options = Array.from(document.querySelectorAll('.buy-block__option'));
const conditions = document.querySelector('.buy-block__conditions-list');
const header = document.querySelector('.header');
const productName = document.querySelector('.buy-block__name_type_small');
const buyButton = document.querySelector('.buy-block__button');
const promoImageSelector = document.querySelector('.promo__image');
const imageBlock = document.querySelector('.features__image-block');

const smallScreen = window.matchMedia('(max-width: 767px)');
const angle = width => 90 + (Math.atan(width / 34) * 180 / Math.PI);
let lastScrollTop = 0;

const regExpCurrencies = /[£\$€]/g;
const regExpPrice = /(?<=[£\$€])\d+/;
const regExpCents = /(?<=[\.])\d+/;
const regExpSelectedCondition = /.+(?=[£\$€])/;
const regExpInitialCondition = /(?<=(\s-\s)).+(?=<)/;
  
function changeCurrency(element, value) {
  element.innerHTML = element.innerHTML.replace(regExpCurrencies, value);
}

function changePrices(element, value, regex) {
  element.innerHTML = element.innerHTML.replace(regex, value.match(regex)[0]);
}

//прилипание header
function stickHeader(e) {
  let currentScroll = window.pageYOffset;
    if(currentScroll > lastScrollTop) {
      header.classList.remove('header_sticky');
    } else {
      header.classList.add('header_sticky');
    }
  lastScrollTop = currentScroll;
}

//открыть полный блок покупки
function openBigBuyBlock() {
  bigBuyBlock.classList.remove('buy-block_hidden');
  smallBuyBlock.classList.add('buy-block_hidden');
}

function openSmallBuyBlock() {
  bigBuyBlock.classList.add('buy-block_hidden');
  smallBuyBlock.classList.remove('buy-block_hidden');
}

//отправить данные о покупке
function buySubmit(event) {
  event.preventDefault();
}

if(smallScreen.matches) {
  bigBuyBlock.classList.add('buy-block_hidden');
  window.addEventListener('scroll', stickHeader);
  promoImageSelector.src = mobilePromoImage;
  imageBlock.style.transform = `skewY(${angle(window.innerWidth)}deg)`
} else {
  smallBuyBlock.classList.add('buy-block_hidden');
  promoImageSelector.src = promoImage;
  imageBlock.style.transform = `skewX(-9deg)`
}

//изменяем валюту
currencies.addEventListener('change', function() {
  changeCurrency(oldPrice, this.value);
  changeCurrency(newPrice, this.value);
  changeCurrency(newPriceSmall, this.value);
  options.map(option => changeCurrency(option, this.value));
})

//изменяем ценник
conditions.addEventListener('change', function() {
  changePrices(newPrice, this.value, regExpPrice);
  changePrices(newPrice, this.value, regExpCents);
  changePrices(newPriceSmall, this.value, regExpPrice);
  changePrices(newPriceSmall, this.value, regExpCents);
  newPriceSmall.innerHTML = newPriceSmall.innerHTML.replace(regExpInitialCondition, this.value.match(regExpSelectedCondition)[0]);
})

//добавляем/удаляем обработчик при изменении ширины экрана
window.addEventListener('resize', function() {
  if(smallScreen.matches) {
    window.addEventListener('scroll', stickHeader);
    promoImageSelector.src = mobilePromoImage;
    imageBlock.style.transform = `skewY(${angle(window.innerWidth)}deg)`
    openSmallBuyBlock();
  } else {
    header.classList.remove('header_sticky');
    window.removeEventListener('scroll', stickHeader);
    openBigBuyBlock();
    promoImageSelector.src = promoImage;
    imageBlock.style.transform = `skewX(-9deg)`
  }
})

productName.addEventListener('click', openBigBuyBlock);
newPriceSmall.addEventListener('click', openBigBuyBlock);
buyButton.addEventListener('submit', buySubmit)