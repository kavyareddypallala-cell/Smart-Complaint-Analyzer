const categories = {

    Water: {
        keywords: [
            "water",
            "pipe",
            "pipeline",
            "leak",
            "leakage",
            "drinking",
            "tap",
            "supply"
        ],
        department: "Water Supply Department"
    },

    Electricity: {
        keywords: [
            "electricity",
            "power",
            "current",
            "transformer",
            "wire",
            "electric",
            "voltage",
            "street light"
        ],
        department: "Electricity Department"
    },

    Garbage: {
        keywords: [
            "garbage",
            "waste",
            "trash",
            "dustbin",
            "rubbish",
            "cleaning",
            "dump"
        ],
        department: "Sanitation Department"
    },

    Roads: {
        keywords: [
            "road",
            "pothole",
            "street",
            "highway",
            "bridge",
            "traffic",
            "damaged road"
        ],
        department: "Road Maintenance Department"
    },

    Transport: {
        keywords: [
            "bus",
            "transport",
            "vehicle",
            "train",
            "auto",
            "driver",
            "stop"
        ],
        department: "Transport Department"
    },

    Drainage: {
        keywords: [
            "drain",
            "drainage",
            "sewage",
            "sewer",
            "flood",
            "waterlogging"
        ],
        department: "Drainage Department"
    }
};


const urgencyWords = {

    high: [
        "emergency",
        "danger",
        "dangerous",
        "accident",
        "fire",
        "flood",
        "immediately",
        "urgent",
        "critical",
        "life threatening"
    ],

    medium: [
        "problem",
        "issue",
        "broken",
        "damaged",
        "leak",
        "blocked",
        "unsafe"
    ],

    low: [
        "request",
        "suggestion",
        "improvement",
        "please",
        "would like"
    ]
};


function analyzeComplaint() {

    const input = document.getElementById("complaint");

    const text = input.value.trim();

    if (text === "") {

        alert("Please enter a complaint.");

        return;
    }

    const lowerText = text.toLowerCase();


    // --------------------------------
    // CATEGORY DETECTION
    // --------------------------------

    let categoryScores = {};

    for (const category in categories) {

        let score = 0;

        categories[category].keywords.forEach(keyword => {

            if (lowerText.includes(keyword)) {
                score++;
            }

        });

        categoryScores[category] = score;
    }


    let detectedCategory = "General";

    let highestScore = 0;

    for (const category in categoryScores) {

        if (categoryScores[category] > highestScore) {

            highestScore = categoryScores[category];

            detectedCategory = category;
        }
    }


    // --------------------------------
    // KEYWORD EXTRACTION
    // --------------------------------

    let detectedKeywords = [];

    for (const category in categories) {

        categories[category].keywords.forEach(keyword => {

            if (
                lowerText.includes(keyword) &&
                !detectedKeywords.includes(keyword)
            ) {

                detectedKeywords.push(keyword);

            }

        });

    }


    // --------------------------------
    // URGENCY DETECTION
    // --------------------------------

    let highScore = 0;
    let mediumScore = 0;
    let lowScore = 0;


    urgencyWords.high.forEach(word => {

        if (lowerText.includes(word)) {
            highScore++;
        }

    });


    urgencyWords.medium.forEach(word => {

        if (lowerText.includes(word)) {
            mediumScore++;
        }

    });


    urgencyWords.low.forEach(word => {

        if (lowerText.includes(word)) {
            lowScore++;
        }

    });


    let urgency = "Low";

    if (highScore > 0) {

        urgency = "High";

    } else if (mediumScore > 0) {

        urgency = "Medium";

    }


    // --------------------------------
    // PRIORITY SCORE
    // --------------------------------

    let priorityScore = 20;

    priorityScore += highestScore * 10;

    priorityScore += highScore * 30;

    priorityScore += mediumScore * 15;

    priorityScore += detectedKeywords.length * 5;


    if (priorityScore > 100) {
        priorityScore = 100;
    }


    // --------------------------------
    // DEPARTMENT
    // --------------------------------

    let department = "General Public Services";

    if (detectedCategory !== "General") {

        department =
            categories[detectedCategory].department;

    }


    // --------------------------------
    // SUMMARY
    // --------------------------------

    let summary =
        `This complaint has been classified as a ${detectedCategory.toLowerCase()} issue. ` +
        `The detected urgency level is ${urgency.toLowerCase()} ` +
        `with a priority score of ${priorityScore}/100.`;


    // --------------------------------
    // RECOMMENDED ACTION
    // --------------------------------

    let action = "";

    if (urgency === "High") {

        action =
            "The complaint should be reviewed immediately and forwarded to the responsible department.";

    } else if (urgency === "Medium") {

        action =
            "The complaint should be assigned to the responsible department for timely resolution.";

    } else {

        action =
            "The complaint can be added to the department's normal service queue.";

    }


    // --------------------------------
    // DISPLAY RESULT
    // --------------------------------

    document.getElementById("result")
        .classList.remove("hidden");


    document.getElementById("category")
        .textContent = detectedCategory;


    document.getElementById("department")
        .textContent = department;


    document.getElementById("urgency")
        .textContent = urgency;


    document.getElementById("priority")
        .textContent = priorityScore + "/100";


    document.getElementById("summary")
        .textContent = summary;


    document.getElementById("action")
        .textContent = action;


    // --------------------------------
    // DISPLAY KEYWORDS
    // --------------------------------

    const keywordContainer =
        document.getElementById("keywords");

    keywordContainer.innerHTML = "";


    if (detectedKeywords.length === 0) {

        keywordContainer.innerHTML =
            "<p>No specific keywords detected.</p>";

    } else {

        detectedKeywords.forEach(keyword => {

            const span =
                document.createElement("span");

            span.className = "keyword";

            span.textContent = keyword;

            keywordContainer.appendChild(span);

        });

    }


    // --------------------------------
    // SAVE HISTORY
    // --------------------------------

    saveComplaint({

        text: text,

        category: detectedCategory,

        urgency: urgency,

        priority: priorityScore,

        department: department

    });

}


// --------------------------------
// SAMPLE COMPLAINT
// --------------------------------

function loadSample() {

    document.getElementById("complaint").value =
        "There is a large amount of garbage near our street. " +
        "The waste has not been collected for three days and " +
        "the area has become unsafe and unhealthy.";


}


// --------------------------------
// LOCAL STORAGE
// --------------------------------

function saveComplaint(data) {

    let history =
        JSON.parse(
            localStorage.getItem("complaints")
        ) || [];


    history.unshift({

        ...data,

        date: new Date().toLocaleString()

    });


    // Keep only latest 10 complaints

    history = history.slice(0, 10);


    localStorage.setItem(
        "complaints",
        JSON.stringify(history)
    );


    displayHistory();

}


// --------------------------------
// DISPLAY HISTORY
// --------------------------------

function displayHistory() {

    const container =
        document.getElementById("history");


    let history =
        JSON.parse(
            localStorage.getItem("complaints")
        ) || [];


    container.innerHTML = "";


    if (history.length === 0) {

        container.innerHTML =
            "<p>No complaints analyzed yet.</p>";

        return;
    }


    history.forEach(item => {

        const div =
            document.createElement("div");

        div.className = "history-item";


        div.innerHTML = `

            <strong>
                ${item.category} — ${item.urgency}
            </strong>

            <p>
                ${item.text}
            </p>

            <small>
                Department: ${item.department}
                |
                Priority: ${item.priority}/100
                |
                ${item.date}
            </small>

        `;


        container.appendChild(div);

    });

}


// --------------------------------
// CLEAR HISTORY
// --------------------------------

function clearHistory() {

    localStorage.removeItem("complaints");

    displayHistory();

}


// Load previous complaints

displayHistory();