export default function modal(action) {
    const modal = document.getElementById("contact-modal");
	modal.style.display = action === 'display' ?  "block" : 'none';
}

