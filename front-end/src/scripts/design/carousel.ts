/**
 * Script for handling image slider navigation.
 */

// Element selectors for navigation buttons and slider.
const prev = document.getElementById('prev') as HTMLElement | null;
const next = document.getElementById('next') as HTMLElement | null;
const slider = document.querySelector('.slider') as HTMLElement | null;
const imgs = document.querySelectorAll('.slider img');

// Calculate the width of a single image, assuming all images have the same width.
let width = imgs.length > 0 && imgs[0] instanceof HTMLElement ? imgs[0].clientWidth : 0;
console.log(width);

/**
 * Event listener for the 'next' button to slide to the next image.
 */
next?.addEventListener('click', () => {
    let index = 0;
    if (slider && imgs.length > 0) {
        index++;
        slider.style.transform = `translate(${-index * (width + 10)}px)`;

        if (index === imgs.length - 1) {
            next.classList.add('disable');
        } else {
            prev?.classList.remove('disable');
        }
    }
});

/**
 * Event listener for the 'prev' button to slide to the previous image.
 */
prev?.addEventListener('click', () => {
    let index = 0;
    if (slider && imgs.length > 0) {
        index--;
        slider.style.transform = `translate(${-index * (width + 10)}px)`;
        if (index === 0) {
            prev?.classList.add('disable');
        } else {
            next?.classList.remove('disable');
        }
    }
});

prev?.classList.remove('disable');
