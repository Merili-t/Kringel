document.getElementById('add-question').addEventListener('click', function () {
    document.getElementById('add-popup').style.display = 'flex';
});

document.getElementById('popup-close').addEventListener('click', function () {
    document.getElementById('add-popup').style.display = 'none';
});

// Näited valikute käitlemisest
document.getElementById('add-block').addEventListener('click', function () {
    alert('Blokk lisatud!');
    document.getElementById('add-popup').style.display = 'none';
});

document.getElementById('add-question-option').addEventListener('click', function () {
    alert('Küsimus lisatud!');
    document.getElementById('add-popup').style.display = 'none';
});

