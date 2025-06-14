// API base URL - muuda vastavalt oma backend URL-ile
const API_BASE_URL = 'http://localhost:3006/test'; // või sinu serveri URL

// Testi ID - võid saada URL parameetrist või muul viisil
let testId = null;

// DOM elementide viited
const elements = {
  loading: document.getElementById('loading'),
  errorMessage: document.getElementById('error-message'),
  mainContent: document.getElementById('main-content'),
  testTitle: document.getElementById('test-title'),
  testDuration: document.getElementById('test-duration'),
  questionCount: document.getElementById('question-count'),
  testDescription: document.getElementById('test-description'),
  testDescriptionSection: document.getElementById('test-description-section'),
  testStartDate: document.getElementById('test-start-date'),
  testEndDate: document.getElementById('test-end-date'),
  testStatus: document.getElementById('test-status'),
  statusIndicator: document.getElementById('status-indicator'),
  continueButton: document.getElementById('continue-button')
};

// Lehe laadimisel käivita
document.addEventListener('DOMContentLoaded', function() {
  // Võta testi ID URL parameetrist
  testId = getTestIdFromUrl();
  
  if (testId) {
    loadTestData(testId);
  } else {
    showError('Testi ID puudub URL-ist');
  }
});

// Funktsioon testi ID saamiseks URL parameetrist
function getTestIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('testId') || '47371e41-475d-11f0-9ae9-b6dee83d52ff'; // fallback testimiseks
}

// Peamine funktsioon testi andmete laadimiseks
async function loadTestData(testId) {
  try {
    showLoading();
    
    // Lae testi andmed läbi stubpi
    const testData = await fetchTestData(testId);
    
    // Lae küsimuste arv läbi stubpi
    const questionCount = await fetchQuestionCount(testId);
    
    // Täida HTML elemendid andmetega
    populateTestData(testData, questionCount);
    
    showMainContent();
    
  } catch (error) {
    console.error('Viga testi andmete laadimisel:', error);
    showError('Testi andmete laadimisel tekkis viga');
  }
}

// Stub-versioon API kutse testi andmete saamiseks
async function fetchTestData(testId) {
  // Simuleeri võttes ette näiteks dummy andmed.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'Näidis Test',
        time_limit: 3600, // 3600 sekundit ehk 60 minutit
        description: 'See on näidis testi kirjeldus.',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 tundi hiljem
      });
    }, 300);
  });
}

// Stub-versioon API kutse küsimuste arvu saamiseks
async function fetchQuestionCount(testId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Näiteks tagasta 10 küsimust
      resolve(10);
    }, 300);
  });
}

// Funktsioon HTML elementide täitmiseks
function populateTestData(testData, questionCount) {
  // Testi pealkiri
  elements.testTitle.textContent = testData.name || 'Nimetu test';
  
  // Testi kestus minutites
  const duration = testData.time_limit || 0;
  elements.testDuration.textContent = formatDuration(duration);
  
  // Küsimuste arv
  elements.questionCount.textContent = questionCount || 'Teadmata';
  
  // Testi kirjeldus (kuva ainult kui on olemas)
  if (testData.description && testData.description.trim()) {
    elements.testDescription.textContent = testData.description;
    elements.testDescriptionSection.style.display = 'block';
  } else {
    elements.testDescriptionSection.style.display = 'none';
  }
  
  // Testi algus- ja lõppkuupäev
  const startDate = new Date(testData.start);
  const endDate = new Date(testData.end);
  
  elements.testStartDate.textContent = formatDate(startDate);
  elements.testEndDate.textContent = formatDate(endDate);
  
  // Testi staatus
  updateTestStatus(startDate, endDate);
  
  // Jäta Continue nupp aktiivne ainult siis, kui test on aktiivne
  updateContinueButton(startDate, endDate);
}

// Funktsioon kestuse vormindamiseks
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  
  if (minutes < 60) {
    return `${minutes} minutit`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} tund${hours !== 1 ? 'i' : ''}`;
    } else {
      return `${hours} tund${hours !== 1 ? 'i' : ''} ja ${remainingMinutes} minutit`;
    }
  }
}

// Funktsioon kuupäeva vormindamiseks
function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('et-EE', options);
}

// Funktsioon testi staatuse uuendamiseks
function updateTestStatus(startDate, endDate) {
  const now = new Date();
  let statusText = '';
  let statusClass = '';

  if (now < startDate) {
    // Test pole veel alanud
    statusText = 'Test pole veel alanud';
    statusClass = 'status-upcoming';
  } else if (now > endDate) {
    // Test on lõppenud
    statusText = 'Test on lõppenud';
    statusClass = 'status-expired';
  } else {
    // Test on aktiivne
    statusText = 'Test on hetkel aktiivne';
    statusClass = 'status-active';
  }

  elements.statusIndicator.textContent = statusText;
  elements.testStatus.className = `test-status ${statusClass}`;
}

// Funktsioon Continue nupu staatuse uuendamiseks
function updateContinueButton(startDate, endDate) {
  const now = new Date();
  
  if (now < startDate || now > endDate) {
    // Test pole aktiivne - keela nupp
    elements.continueButton.style.opacity = '0.5';
    elements.continueButton.style.pointerEvents = 'none';
    elements.continueButton.textContent = 'Test ei ole saadaval';
  } else {
    // Test on aktiivne - luba nupp
    elements.continueButton.style.opacity = '1';
    elements.continueButton.style.pointerEvents = 'auto';
    elements.continueButton.textContent = 'Edasi';
    
    // Lisa testi ID URL-i järgmise lehe jaoks
    const currentHref = elements.continueButton.getAttribute('href');
    if (currentHref && !currentHref.includes('testId=')) {
      const separator = currentHref.includes('?') ? '&' : '?';
      elements.continueButton.setAttribute('href', `${currentHref}${separator}testId=${testId}`);
    }
  }
}

// Utility funktsioonid UI staatuse muutmiseks
function showLoading() {
  elements.loading.style.display = 'block';
  elements.errorMessage.style.display = 'none';
  elements.mainContent.style.display = 'none';
}

function showError(message) {
  elements.loading.style.display = 'none';
  elements.errorMessage.style.display = 'block';
  elements.mainContent.style.display = 'none';
  
  // Uuenda vea sõnumit kui vaja
  const errorP = elements.errorMessage.querySelector('p');
  if (errorP) {
    errorP.textContent = message;
  }
}

function showMainContent() {
  elements.loading.style.display = 'none';
  elements.errorMessage.style.display = 'none';
  elements.mainContent.style.display = 'block';
}

// Funktsioon auth tokeni saamiseks (kui kasutad autentimist)
function getAuthToken() {
  // Tagasta JWT token või muu auth token
  // Näiteks localStorage-st või sessionStorage-st
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// Export funktsioonid kui vajad neid mujal kasutada
window.TestGuide = {
  loadTestData,
  formatDate,
  formatDuration
};
