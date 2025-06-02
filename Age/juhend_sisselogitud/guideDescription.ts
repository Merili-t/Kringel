document.querySelectorAll<HTMLElement>('.guide-description').forEach(description => {
    description.style.display = 'none';
});

document.querySelectorAll<HTMLElement>('.expand-arrow').forEach(arrow => {
    arrow.style.transform = 'rotate(0deg)';
});

// Expandable sections functionality
document.querySelectorAll<HTMLElement>('.expand-arrow').forEach(arrow => {
    arrow.addEventListener('click', function (this: HTMLElement) {
        const isExpanded = this.style.transform === 'rotate(180deg)';
        const section = this.closest('.guide-section') as HTMLElement | null;
        const description = section?.querySelector<HTMLElement>('.guide-description');

        this.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        if (description) {
            description.style.display = isExpanded ? 'none' : 'block';
        }
    });
});