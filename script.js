/**
 * ASHRAE CHD Study Planner JavaScript
 * Handles Calendar Generation, Interactivity, and Firebase Integration
 */

// 1. Firebase Configuration (Using your provided details)
const firebaseConfig = {
    apiKey: "AIzaSyAWi2fE6rxO2YwH3bayf7zB9NsEoPGXYM",
    authDomain: "chd-study-plan.firebaseapp.com",
    projectId: "chd-study-plan",
    storageBucket: "chd-study-plan.firebasestorage.app",
    messagingSenderId: "329855623463",
    appId: "1:329855623463:web:32be2774d68574ca910902"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();
const studyPlanRef = database.ref('study_notes'); // Root for collaborative data

// 2. Define Key Dates
const EXAM_DATE = new Date('2025-11-24');
const START_DATE = new Date(); // Start from today
const CALENDAR_CONTAINER = document.getElementById('calendar-container');

// 3. Example Study Topics (for initial planning)
// **Moustafa, you'll want to refine these topics to match the CHD syllabus!**
const CHD_TOPICS = [
    "Load Calculations (Psychrometrics)",
    "HVAC Systems (VAV, VRF, etc.)",
    "Piping and Pumping",
    "Ductwork Design and Sizing",
    "Refrigeration Cycles and Equipment",
    "ASHRAE Standards (90.1, 62.1, 55)",
    "Energy Modeling and Analysis",
    "Building Envelope and Heat Transfer",
    "Review & Practice Exams 1",
    "Review & Practice Exams 2",
    "Final Review of Weak Areas"
    // ... add more topics to cover all days
];

// 4. Main Calendar Generation Function
function generateCalendar() {
    let dayCount = 0;
    let currentDate = new Date(START_DATE);

    while (currentDate <= EXAM_DATE) {
        const dateKey = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const topicIndex = dayCount % CHD_TOPICS.length; // Cycle through topics
        const dailyTopic = CHD_TOPICS[topicIndex];
        const isExamDay = currentDate.toDateString() === EXAM_DATE.toDateString();

        const card = document.createElement('div');
        card.className = `day-card ${isExamDay ? 'exam-day' : ''}`;
        card.dataset.dateKey = dateKey;

        // Populate the card content
        card.innerHTML = `
            <div class="date-header">${currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
            <p class="daily-topic">Study Topic: ${isExamDay ? 'ASHRAE CHD EXAM DAY! 🎉' : dailyTopic}</p>
            
            <div class="feature-buttons">
                <button class="insight-btn" onclick="getInsight('${dailyTopic}')">💡 Get Insights</button>
                <button class="quiz-btn" onclick="startQuiz('${dailyTopic}')">❓ MCQ Quiz</button>
            </div>
            
            <label for="notes-${dateKey}">**Study Notes/Links (Collaborative):**</label>
            <textarea 
                id="notes-${dateKey}" 
                class="study-notes" 
                placeholder="Type your notes, links, or questions here..."
                onchange="saveNotes('${dateKey}', this.value)"
                ${isExamDay ? 'disabled' : ''}
            ></textarea>
        `;

        CALENDAR_CONTAINER.appendChild(card);
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        dayCount++;
    }

    // After generating, load and watch for collaborative data updates
    setupFirebaseListener();
}

// 5. Firebase Realtime Collaboration Listener
function setupFirebaseListener() {
    // This function ensures that when a friend updates their notes,
    // it automatically updates your planner in real-time.
    studyPlanRef.on('value', (snapshot) => {
        const notesData = snapshot.val();
        if (notesData) {
            Object.keys(notesData).forEach(dateKey => {
                const textarea = document.getElementById(`notes-${dateKey}`);
                if (textarea) {
                    // Update the textarea with the collaborative data
                    textarea.value = notesData[dateKey];
                }
            });
        }
    });
}

// 6. Function to Save Data to Firebase
function saveNotes(dateKey, notes) {
    // Pushes the user's notes to the Firebase Realtime Database
    studyPlanRef.child(dateKey).set(notes)
        .then(() => console.log(`Notes for ${dateKey} saved successfully!`))
        .catch(error => console.error("Firebase save failed:", error));
}

// 7. Interactive Feature Placeholders
// You would replace these with actual API calls or modals in a full app.
function getInsight(topic) {
    alert(`**Insight Feature:** You are researching ${topic}. In a full app, this would open a modal with definitions, key concepts, and links related to ${topic}.`);
    // Placeholder: You could integrate a search API here!
    window.open(`https://www.google.com/search?q=ASHRAE+CHD+${topic}+key+concepts`, '_blank');
}

function startQuiz(topic) {
    alert(`**MCQ Quiz Feature:** Starting a quiz on ${topic}. In a full app, this would load a set of multiple-choice questions from a data source.`);
    // Placeholder: Direct to a relevant external quiz resource
    window.open(`https://www.google.com/search?q=ASHRAE+CHD+${topic}+MCQ+quiz`, '_blank');
}

// Run the calendar generation when the page loads
document.addEventListener('DOMContentLoaded', generateCalendar);