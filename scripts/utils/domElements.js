// DOM Elements
const DOM = {
  photographersSection: document.querySelector('.photographers-section'),

  mediasSection: document.querySelector('.medias__section'),

  contactBtn: document.querySelector('.contact-button'),

  modal: document.querySelector('.modal'),
  formModal: document.getElementById('form-modal'),
  formModalCloseBtn: document.querySelector('.modal__close'),
  form: document.getElementById('form'),

  firstNameInput: document.getElementById('firstname'),
  lastNameInput: document.getElementById('lastname'),
  emailInput: document.getElementById('email'),
  messageInput: document.getElementById('message'),

  lightbox: document.getElementById('lightbox'),
  lightboxContainer: document.querySelector('.lightbox-container'),
  lightboxCaption: document.querySelector('.lightbox-caption__text'),
  lightboxLikeInCaption: document.querySelector(
    '.lightbox-caption__like-display',
  ),
  hiddenLikeCheckbox: document.querySelector('.lightbox-caption__like-btn'),
  lightboxLeftArrow: document.querySelector('.lightbox__previous'),
  lightboxRightArrow: document.querySelector('.lightbox__next'),
  lightboxClose: document.querySelector('.lightbox__close'),

  imageDisplay: document.querySelector('.lightbox__image'),
  videoDisplay: document.querySelector('.lightbox__video'),
  videoDescription: document.querySelector('#lightbox__video-description'),

  totalLikesNbr: document.querySelector('.photographer__likes'),

  selector: document.querySelector('#selector'),
  summary: document.querySelector('#summary'),
}

export default DOM
