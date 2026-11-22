
const API_URL = "PASTE_YOUR_WEB_APP_URL_HERE";

let students = [];
let ascending = true;

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const statusText = document.getElementById("status");

// Load Google Sheet data
async function loadStudents() {

    try {

        statusText.textContent = "Loading records...";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch data");
        }

        students = await response.json();

        displayStudents(students);

        statusText.textContent =
            students.length + " Student Records Found";

    } catch (error) {

        statusText.textContent =
            "Error! Please check your Google Sheet URL.";

        console.error(error);
    }
}

// Display student records
function displayStudents(data) {

    tableBody.innerHTML = "";

    if (data.length === 0) {

        tableBody.innerHTML =
        '<tr><td colspan="7">No Records Found</td></tr>';

        return;
    }

    data.forEach(student => {

        const row = document.createElement("tr");

        const fields = [
            "Sr No",
            "Roll No",
            "Student Name",
            "10th",
            "12th",
            "Sem 1",
            "Sem 2"
        ];

        fields.forEach(field => {

            const cell = document.createElement("td");

            cell.textContent = student[field] ?? "";

            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

// Search by Roll Number or Name
searchInput.addEventListener("input", function() {

    const value = this.value.toLowerCase();

    const result = students.filter(student => {

        return String(student["Roll No"])
        .toLowerCase().includes(value) ||

        String(student["Student Name"])
        .toLowerCase().includes(value);

    });

    displayStudents(result);

    statusText.textContent =
        result.length + " Student Records Found";
});

// Sort student records
function sortData(key) {

    students.sort((a, b) => {

        let x = a[key];
        let y = b[key];

        let result;

        if (!isNaN(Number(x)) && !isNaN(Number(y))) {
            result = Number(x) - Number(y);
        } else {
            result = String(x).localeCompare(String(y));
        }

        return ascending ? result : -result;

    });

    ascending = !ascending;

    searchInput.dispatchEvent(new Event("input"));
}

// Start website
loadStudents();
