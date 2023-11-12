// Select the elements using their IDs and assert them as HTMLElements
const p1 = document.getElementById('p1') as HTMLElement | null;
const p2 = document.getElementById('p2') as HTMLElement | null;
const p3 = document.getElementById('p3') as HTMLElement | null;
const p4 = document.getElementById('p4') as HTMLElement | null;

window.addEventListener('scroll', () => {
    let value = window.scrollY;

    // Check if the elements exist before attempting to modify their styles
    if (p1) p1.style.backgroundPositionX = (400 + value) + 'px';
    if (p2) p2.style.backgroundPositionX = (200 + value) + 'px';
    if (p3) p3.style.backgroundPositionX = (100 + value) + 'px';
    if (p4) p4.style.backgroundPositionX = (50 + value) + 'px';
});
