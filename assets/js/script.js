import { StudentList } from "./data.js";
let students = StudentList;
let formMode ="Add";
let selectedStudentsID = -1;

const tbody = document.getElementById("student-data")

const addBtn = document.getElementById("add-btn");
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

const txtlastname = document.getElementById("lastname");
const txtfirstname = document.getElementById("firstname");
const txtmiddlename = document.getElementById("middlename");
const txtgender = document.getElementById("gender");
const txtyearlevel = document.getElementById("year-level");
const txtsection = document.getElementById("section");
const txtemail = document.getElementById("email");

const placeholderLastname = document.getElementById("placeholder-lastname");   
const placeholderFirstname = document.getElementById("placeholder-firstname");
const placeholderMiddlename = document.getElementById("placeholder-middlename");
const placeholderGender = document.getElementById("placeholder-gender");
const placeholderYearLevel = document.getElementById("placeholder-year-level");
const placeholderSection = document.getElementById("placeholder-section");
const placeholderEmail = document.getElementById("placeholder-email");             

document.addEventListener("DOMContentLoaded", function(){
   resetForm();
   fetchStudentData();
});

addBtn.addEventListener("click", () => {
  formMode = "Add";
  resetForm();
   enableFormFields(true);
   toggleButtons(true, false);
});

editBtn.addEventListener("click", () => {
formMode = "Edit";
resetForm();
enableFormFields(true);
toggleButtons(true, false);
populateFormFields(getStudentById(selectedStudentsID));

});

deleteBtn.addEventListener("click", () => {
formMode = "Delete";
 if (confirm("Are you sure you want to delete this student?")){
       deletestudent();
       resetForm();
       fetchStudentData();
 }
});


saveBtn.addEventListener("click", () => {
 if (validateForm().length > 0) return;

 if (formMode === "Add") {
      addStudent();
    }

    if (formMode === "Edit") {
      editStudents();

    }
    
     
    resetForm();    
     displayStudentDetails(getStudentById(selectedStudentsID));
     fetchStudentData();   
});

cancelBtn.addEventListener("click", () => {
     displayStudentDetails(getStudentById(selectedStudentsID));
    resetForm();
});


function addStudent() {
  selectedStudentsID = students.length + 1;
  const student = {
    id: selectedStudentsID,
    lastname: txtlastname.value,
    firstname: txtfirstname.value,
    middlename: txtmiddlename.value,
    gender: txtgender.value,
    year_level: txtyearlevel.value,
    section: txtsection.value,
    email: txtemail.value
  };
  students.push(student);
  formMode= "";
}

function editStudents(){
  let getStudent = getStudentById(selectedStudentsID);
  if (getStudent) {
    getStudent.lastname = txtlastname.value;
    getStudent.firstname = txtfirstname.value;
    getStudent.middlename = txtmiddlename.value;
    getStudent.gender = txtgender.value;
    getStudent.year_level = txtyearlevel.value;
    getStudent.section = txtsection.value;
    getStudent.email = txtemail.value;
  }
  formMode = "";
}
function deletestudent(){
  if(selectedStudentsID === -1) return;
  students.splice(students.findIndex((s) => s.id === selectedStudentsID), 1);
  formMode = "";
}


function fetchStudentData() {
tbody.innerHTML = "";
students.forEach(student => {
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
        resetForm();
        displayStudentDetails(student);
        toggleButtons(false, true);
    });

    tbody.appendChild(row);
})
}

function displayStudentDetails(student) {
   selectedStudentsID = student.id;
    placeholderLastname.querySelector("#placeholder-lastname-value").textContent = student.lastname;
    placeholderFirstname.querySelector("#placeholder-firstname-value").textContent = student.firstname;
    placeholderMiddlename.querySelector("#placeholder-middlename-value").textContent = student.middlename;
    placeholderGender.querySelector("#placeholder-gender-value").textContent = student.gender;
    placeholderYearLevel.querySelector("#placeholder-year-level-value").textContent = student.year_level;
    placeholderSection.querySelector("#placeholder-section-value").textContent = student.section;
    placeholderEmail.querySelector("#placeholder-email-value").textContent = student.email;
}

function populateFormFields(student) {
  txtlastname.value = student.lastname;
  txtfirstname.value = student.firstname;
  txtmiddlename.value = student.middlename;
  txtgender.value = student.gender;
  txtyearlevel.value =  student.year_level;
  txtsection.value = student.section;
  txtemail.value = student.email;
}

function resetForm() {
    toggleButtons(false, false);
    enableFormFields(false);
    resetPlaceholders();
    resetInputFields();
}

function toggleButtons(ShowSaveCancelBtn = false, ShowAddEditDeleteBtn = false) {
    saveBtn.classList.toggle("display-none", !ShowSaveCancelBtn);
    cancelBtn.classList.toggle("display-none", !ShowSaveCancelBtn);
    editBtn.classList.toggle("display-none", !ShowAddEditDeleteBtn);
    deleteBtn.classList.toggle("display-none", !ShowAddEditDeleteBtn);
}

function enableFormFields(enable = false) {
    let txtboxes =  document.getElementsByClassName("textbox");
    Array.from(txtboxes).forEach((txtbox) => {
        txtbox.classList.toggle("default-text", !enable);
    });

 [txtlastname, txtfirstname, txtmiddlename, txtgender, txtyearlevel, txtsection, txtemail]
 .forEach((input) => {
        input.disabled = !enable;
    });
}

function resetPlaceholders() {
    placeholderLastname.innerHTML = `Last Name: <span id="placeholder-lastname-value"></span>`;
    placeholderFirstname.innerHTML = `First Name: <span id="placeholder-firstname-value"></span>`;
    placeholderMiddlename.innerHTML = `Middle Name: <span id="placeholder-middlename-value"></span>`;
    placeholderGender.innerHTML = `Gender: <span id="placeholder-gender-value"></span>`;
    placeholderYearLevel.innerHTML = `Year Level: <span id="placeholder-year-level-value"></span>`;
    placeholderSection.innerHTML = `Section: <span id="placeholder-section-value"></span>`;
    placeholderEmail.innerHTML = `Email: <span id="placeholder-email-value"></span>`;
}
function resetInputFields() {
    [txtlastname, txtfirstname, txtmiddlename, txtgender, txtyearlevel, txtsection, txtemail]
    .forEach((input) => {
        input.value = "";
    });
}

function validateForm() {
  const errors = [];
  if (!txtlastname.value) errors.push("Last Name is required.");
  if (!txtfirstname.value) errors.push("First Name is required.");
  if (!txtmiddlename.value) errors.push("Middle Name is required.");
  if (!txtgender.value) errors.push("Gender is required.");
  if (!txtyearlevel.value) errors.push("Year Level is required.");
  if (!txtsection.value) errors.push("Section is required.");
  if (!txtemail.value) errors.push("Email is required.");

  if(errors.length > 0){
  alert(errors.join("\n"));
  }
  return errors;  
}

function getStudentById(studentId){
  return students.find((student) => student.id === studentId);
}