import createFetch from "./utils/createFetch";

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.querySelector('.button');
    const uploadBox = document.getElementById('upload-box');
    const videoUpload = document.getElementById('video-upload');
    const uploadText = document.querySelector('.upload-text');
    
    // Video upload functionality
    uploadBox.addEventListener('click', function() {
        videoUpload.click();
    });

    uploadBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadBox.style.backgroundColor = '#f0f0f0';
    });

    uploadBox.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadBox.style.backgroundColor = '';
    });

    uploadBox.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadBox.style.backgroundColor = '';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            videoUpload.files = files;
            uploadText.textContent = files[0].name;
        }
    });

    videoUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            uploadText.textContent = this.files[0].name;
        }
    });

    // Start button functionality - saadab teami andmed andmebaasi
    startButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Kogume andmed vormist
        const email = document.getElementById('email').value.trim();
        const teamName = document.getElementById('team').value.trim();
        
        // Valideerime kohustuslikud väljad
        if (!email || !teamName) {
            alert('Palun täida email ja meeskonna nimi!');
            return;
        }
        
        // Valideerime emaili formaati
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Palun sisesta korrektne email aadress!');
            return;
        }
        
        try {
            // Näitame laadimise teadet
            startButton.textContent = 'Salvestame...';
            startButton.disabled = true;
            
            // Saadame teami andmed andmebaasi
            const result = await createFetch('/auth/register/team', 'POST', {
                email: email,
                name: teamName,
                userType: "guest"
            });
            
            // Kontrollime viga
            if (result.error) {
                throw new Error(result.error);
            }
            
            console.log('Team edukalt loodud:', result);
            
            // Salvestame teised andmed localStorage-sse (valikuline)
            const participantNames = document.getElementById('names').value.trim();
            const school = document.getElementById('school').value.trim();
            const videoLink = document.querySelector('.video-link-input').value.trim();
            
            if (participantNames || school || videoLink) {
                localStorage.setItem('additionalTeamData', JSON.stringify({
                    participantNames: participantNames,
                    school: school,
                    videoLink: videoLink,
                    teamId: result.id // kui server tagastab loodud teami ID
                }));
            }
            
            // Suuname kasutaja edasi
            window.location.href = 'solvingTest.html';
            
        } catch (error) {
            alert('Viga andmete salvestamisel: ' + error.message);
            console.error('Error:', error);
            
            // Taastame nupu
            startButton.textContent = 'Alusta lahendamist';
            startButton.disabled = false;
        }
    });
});