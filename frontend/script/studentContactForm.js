// teamAPI.js - API ühendus teami andmete haldamiseks

import createFetch from "./utils/createFetch";

// Uue teami loomine (POST) - täiustatud veakäsitlusega
export async function createTeam(teamData) {
  try {
    // Valideerime sisendandmed
    if (!teamData.email || !teamData.name) {
      throw new Error("Email ja teami nimi on kohustuslikud");
    }

    // Valideerime emaili formaat
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(teamData.email)) {
      throw new Error("Vigane email formaat");
    }

    const dataToSend = {
      email: teamData.email.trim(),
      name: teamData.name.trim()
    };

    console.log("Saadan andmed:", dataToSend); // Debug info

    const result = await createFetch("/team", "POST", dataToSend);
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    console.log("Vastus serverist:", result); // Debug info
    return result;
  } catch (error) {
    console.error("Viga teami loomisel:", error);
    // Näitame kasutajale sõbralikumat veateadet
    if (error.message.includes("500")) {
      throw new Error("Serveri viga. Palun proovige hiljem uuesti.");
    }
    throw error;
  }
}

// Testimise funktsioon
export async function testTeamAPI() {
  try {
    const testData = {
      email: "test@example.com",
      name: "Test Team"
    };
    
    console.log("Testin API ühendust...");
    const result = await createTeam(testData);
    console.log("Test edukas:", result);
    return result;
  } catch (error) {
    console.error("Test ebaõnnestus:", error);
    throw error;
  }
}