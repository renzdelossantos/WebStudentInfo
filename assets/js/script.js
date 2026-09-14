import { StudentList } from "./data.js";
let students = StudentList;
let formMode = "add";
let selectedStudentID = -1;

const tbody = document.getElementById("student-data");

const addBtn = document.getElementById("add-btn");
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

const txtFirstName = document.getElementById("txt-firstName");
const txtMiddleName = document.getElementById("txt-middleName");
const txtLastName = document.getElementById("txt-lastName");
const txtGender = document.getElementById("txt-gender");
const txtYearLevel = document.getElementById("txt-year-level");
const txtSection = document.getElementById("txt-section");
const txtEmail = document.getElementById("txt-email");

const placeholderFirstName = document.getElementById("placeholder-firstName");
const placeholderMiddleName = document.getElementById("placeholder-middleName");
const placeholderLastName = document.getElementById("placeholder-lastName");
const placeholderGender = document.getElementById("placeholder-gender");
const placeholderYearLevel = document.getElementById("placeholder-year-level");
const placeholderSection = document.getElementById("placeholder-section");
const placeholderEmail = document.getElementById("placeholder-email");

document.addEventListener("DOMContentLoaded", function () {
  resetform();
  fetchStudentData();
});

addBtn.addEventListener("click", () => {
  formMode = "add";
  selectedStudentID = -1;
  resetform();
  enableformfields(true);
  togglebuttons(true, false);
});

editBtn.addEventListener("click", () => {
  formMode = "edit";
  resetform();
  enableformfields(true);
  togglebuttons(true, false);
  populateFormFields(getStudentById(selectedStudentID));
});

deleteBtn.addEventListener("click", () => {
  formMode = "delete";
  if (confirm("Are you sure you want to delete this student?")) {
    deleteStudent();
    resetform();
    fetchStudentData();
  }
});

saveBtn.addEventListener("click", () => {
  if (validateInputForm().length > 0) return;

  if (formMode === "add") {
    addStudent();
  }
  if (formMode === "edit"){
    editStudent();
  }


  resetform();
  displayStudentDetails(students[students.length - 1]);
  fetchStudentData();
});

cancelBtn.addEventListener("click", () => {
  formMode = "";
  resetform();

  const selectedStudent = getStudentById(selectedStudentID);
  if (selectedStudent) {
    displayStudentDetails(selectedStudent);
    togglebuttons(false, true);
  }
});
resetform();
  displayStudentDetails(students[students.length - 1]);


function addStudent() {
  selectedStudentID = students.length + 1;
  const student = {
    id: selectedStudentID,
    lastname: txtLastName.value,
    firstname: txtFirstName.value,
    middlename: txtMiddleName.value,
    gender: txtGender.value,
    year_level: txtYearLevel.value,
    section: txtSection.value,
    email: txtEmail.value,
  };
  students.push(student);
  formMode = "";

}
function editStudent() {
 let getStudents = getStudentById(selectedStudentID);
 if (getStudents) {
  getStudents.lastname = txtLastName.value;
  getStudents.firstname = txtFirstName.value;
  getStudents.middlename = txtMiddleName.value;
  getStudents.gender = txtGender.value;
  getStudents.year_level = txtYearLevel.value;
  getStudents.section = txtSection.value;
  getStudents.email = txtEmail.value;
 }
 formMode = "";
}
function deleteStudent() {
  if (selectedStudentID === -1) return;
  const studentIndex = students.findIndex((student) => student.id === selectedStudentID);
  if (studentIndex !== -1) {
    students.splice(studentIndex, 1);
  }
  formMode = "";
}


function fetchStudentData() {
  tbody.innerHTML = "";

  students.forEach((student) => {

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${student.lastname}</td>
            <td>${student.firstname}</td>
            <td>${student.middlename}</td>
            <td>${student.gender}</td>
            <td>${student.year_level}</td>
            <td>${student.section}</td>
            <td>${student.email}</td>
        `;

    row.addEventListener("click", () => {
      resetform();
      displayStudentDetails(student);
      togglebuttons(false, true);
    });

    tbody.appendChild(row);
  });
}

function displayStudentDetails(student) {
  selectedStudentID = student.id;
  placeholderFirstName.querySelector(
    "#placeholder-value-firstName",
  ).textContent = student.firstname;
  placeholderMiddleName.querySelector(
    "#placeholder-value-middleName",
  ).textContent = student.middlename;
  placeholderLastName.querySelector("#placeholder-value-lastName").textContent =
    student.lastname;
  placeholderGender.querySelector("#placeholder-value-gender").textContent =
    student.gender;
  placeholderYearLevel.querySelector(
    "#placeholder-value-year-level",
  ).textContent = student.year_level;
  placeholderSection.querySelector("#placeholder-value-section").textContent =
    student.section;
  placeholderEmail.querySelector("#placeholder-value-email").textContent =
    student.email;
}

function populateFormFields(student) {
  txtFirstName.value = student.firstname;
  txtMiddleName.value = student.middlename;
  txtLastName.value = student.lastname;
  txtGender.value = student.gender;
  txtYearLevel.value = student.year_level;
  txtSection.value = student.section;
  txtEmail.value = student.email;
}

function resetform() {
  togglebuttons(true, false);
  enableformfields(false);
  resetPlaceholder();
  resetInputFields();
}

function togglebuttons(ShowSaveCancelBtns = false, ShowEditDeleteBtns = false) {
  saveBtn.classList.toggle("display-none", !ShowSaveCancelBtns);
  cancelBtn.classList.toggle("display-none", !ShowSaveCancelBtns);
  editBtn.classList.toggle("display-none", !ShowEditDeleteBtns);
  deleteBtn.classList.toggle("display-none", !ShowEditDeleteBtns);
}

function enableformfields(enable = false) {
  let txtbox = document.getElementsByClassName("textbox");
  Array.from(txtbox).forEach((txtbox) => {
    txtbox.classList.toggle("default-text", !enable);
  });

  [
    txtFirstName,
    txtMiddleName,
    txtLastName,
    txtGender,
    txtYearLevel,
    txtSection,
    txtEmail,
  ].forEach((input) => {
    input.disabled = !enable;
  });
}

function resetPlaceholder() {
  placeholderFirstName.innerHTML = `First Name: <span id = "placeholder-value-firstName"></span>`;
  placeholderMiddleName.innerHTML = `Middle Name: <span id = "placeholder-value-middleName"></span>`;
  placeholderLastName.innerHTML = `Last Name: <span id = "placeholder-value-lastName"></span>`;
  placeholderGender.innerHTML = `Gender: <span id = "placeholder-value-gender"></span>`;
  placeholderYearLevel.innerHTML = `Year Level: <span id = "placeholder-value-year-level"></span>`;
  placeholderSection.innerHTML = `Section: <span id = "placeholder-value-section"></span>`;
  placeholderEmail.innerHTML = `Email: <span id = "placeholder-value-email"></span>`;
}

function resetInputFields() {
  [
    txtFirstName,
    txtMiddleName,
    txtLastName,
    txtGender,
    txtYearLevel,
    txtSection,
    txtEmail,
  ].forEach((input) => {
    input.value = "";
  });
}

function validateInputForm() {
  const errors = [];
  if (!txtFirstName.value) errors.push("First Name is required.");
  if (!txtMiddleName.value) errors.push("Middle Name is required.");
  if (!txtLastName.value) errors.push("Last Name is required.");
  if (!txtGender.value) errors.push("Gender is required.");
  if (!txtYearLevel.value) errors.push("Year Level is required.");
  if (!txtSection.value) errors.push("Section is required.");
  if (!txtEmail.value) errors.push("Email is required.");

  if (errors.length > 0) {
    alert(errors.join("\n"));
  }

  return errors;
}

function getStudentById(studentId) {
  return students.find((student) => student.id === studentId);
}