const closePopup = (popupContainerClass: string) => {
    const popupOverlay = document.querySelector(`.${popupContainerClass}`) as HTMLElement;
    if (popupOverlay) {
        popupOverlay.style.display = 'none';
    }
};

const attachCloseButtonListeners = () => {
    const closeButtons = document.querySelectorAll('.close-popup');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.closest('.popup-ok-container')) {
                closePopup('popup-ok-container');
            } else if (button.closest('.popup-fail-container')) {
                closePopup('popup-fail-container');
            }
        });
    });
};

const popUpOk = () => {
    const cartDialog = document.getElementById('shoppingCart') as HTMLDialogElement;
    const popupOverlay = document.querySelector('.popup-ok-container') as HTMLElement;
    if (popupOverlay && cartDialog) {
        cartDialog.close();
        popupOverlay.style.display = 'flex';
        const popupOk = document.querySelector('.popup-ok') as HTMLElement;
        popupOk.style.transform = 'scale(1)';
        attachCloseButtonListeners();
    }
};

const popUpFail = () => {
    const popupOverlay = document.querySelector('.popup-fail-container') as HTMLElement;
    const cartDialog = document.getElementById('shoppingCart') as HTMLDialogElement;
    if (popupOverlay && cartDialog) {
        cartDialog.close();
        popupOverlay.style.display = 'flex';
        const popupFail = document.querySelector('.popup-fail') as HTMLElement;
        popupFail.style.transform = 'scale(1)';
        attachCloseButtonListeners();
    }
};

export { popUpOk, popUpFail, closePopup };
