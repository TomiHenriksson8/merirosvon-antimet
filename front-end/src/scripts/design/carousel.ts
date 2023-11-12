const prev = document.getElementById('prev') as HTMLElement | null;
const next = document.getElementById('next') as HTMLElement | null;
const slider = document.querySelector('.slider') as HTMLElement | null;
const imgs = document.querySelectorAll('.slider img');

// Checking if the first image is present and is an HTMLElement to access clientWidth
let width = imgs.length > 0 && imgs[0] instanceof HTMLElement ? imgs[0].clientWidth : 0;

console.log(width);

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
