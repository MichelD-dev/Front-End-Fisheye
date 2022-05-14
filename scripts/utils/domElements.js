// DOM Elements
const DOM = {
  photographersSection: document.querySelector('.photographers-section'),

  mediasSection: document.querySelector('.medias__section'),

  contactBtn: document.querySelector('.contact-button'),

  modal: document.querySelector('.modal'),
  modalForm: document.getElementById('form-modal'),
  modalCloseBtn: document.querySelector('.modal__close'),

  firstNameInput: document.getElementById('firstname'),
  lastNameInput: document.getElementById('lastname'),
  emailInput: document.getElementById('email'),
  messageInput: document.getElementById('message'),

  lightbox: document.getElementById('lightbox'),
  lightboxContainer: document.querySelector('.lightbox-container'),
  lightboxLikeInCaption: document.querySelector(
    '.lightbox-caption__like-display'
  ),
  lightboxLeftArrow: document.querySelector('.fa-chevron-left'),
  lightboxRightArrow: document.querySelector('.fa-chevron-right'),
  lightboxClose: document.querySelector('.lightbox__close'),

  totalLikesNbr: document.querySelector('.photographer__likes'),

  hiddenLikeCheckbox: document.querySelector('.lightbox-caption__like-btn'),

  selector: document.querySelector('.select'),
}

export default DOM
