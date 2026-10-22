let students = [];
let formMode = "Add";
let selectedStudentID = -1;
let currentSearchTerm = "";
const baseURL = "http://192.168.100.54/student-info/tae/assets/php/student.php";

const $tbody = $("#student-data");
const $searchForm = $("#search-form");
const $searchInput = $("#search-input");

const $addBtn = $("#add-btn");
const $editBtn = $("#edit-btn");
const $deleteBtn = $("#delete-btn");
const $saveBtn = $("#save-btn");
const $cancelBtn = $("#cancel-btn");

const $txtLastname = $("#txt-lastName");
const $txtFirstname = $("#txt-firstName");
const $txtMiddlename = $("#txt-middleName");
const $txtGender = $("#txt-gender");
const $txtYearLevel = $("#txt-year-level");
const $txtSection = $("#txt-section");
const $txtEmail = $("#txt-email");

const $placeholderLastname = $("#placeholder-lastName");
const $placeholderFirstname = $("#placeholder-firstName");
const $placeholderMiddlename = $("#placeholder-middleName");
const $placeholderGender = $("#placeholder-gender");
const $placeholderYearLevel = $("#placeholder-year-level");
const $placeholderSection = $("#placeholder-section");
const $placeholderEmail = $("#placeholder-email");

$(document).ready(function () {
  resetForm();
  fetchStudentData();
  fetchAcadLevelData();
  fetchSectionData();
});

$searchForm.on("submit", function (event) {
  event.preventDefault();
  currentSearchTerm = $searchInput.val().trim();
  selectedStudentID = -1;
  resetForm();
  fetchStudentData(currentSearchTerm);
});

$addBtn.on("click", function () {
  formMode = "Add";
  resetForm();
  enableFormFields(true);
  toggleButtons(true, false);
  $txtLastname.trigger("focus");
});

$editBtn.on("click", function () {
  const student = getStudentById(selectedStudentID);
  if (!student) {
    alert("Select a student to edit.");
    return;
  }

  formMode = "Edit";
  resetForm();
  enableFormFields(true);
  populateFormFields(student);
  toggleButtons(true, false);
  $txtLastname.trigger("focus");
});

$deleteBtn.on("click", function () {
  if (selectedStudentID < 0 || !window.confirm("Delete this student?")) {
    return;
  }

  $deleteBtn.prop("disabled", true).val("Deleting...");
  deleteStudent(selectedStudentID)
    .done(function (response) {
      if (!response.success) {
        alert(response.error || "Unable to delete student.");
        return;
      }

      selectedStudentID = -1;
      resetForm();
      fetchStudentData();
    })
    .fail(function (xhr) {
      const response = xhr.responseJSON || {};
      alert(response.error || "Unable to delete student.");
    })
    .always(function () {
      $deleteBtn.prop("disabled", false).val("Delete");
    });
});


$saveBtn.on("click", function () {
  if (validateForm().length > 0) {
    return;
  }

  if (formMode === "Edit" && selectedStudentID < 0) {
    alert("Select a student to edit.");
    return;
  }

  const student = {
    lastname: $txtLastname.val().trim(),
    firstname: $txtFirstname.val().trim(),
    middlename: $txtMiddlename.val().trim(),
    gender: $txtGender.val(),
    acadlevel_id: $txtYearLevel.val(),
    section_id: $txtSection.val(),
    email: $txtEmail.val().trim(),
  };

  const request = formMode === "Add"
    ? addStudent(student)
    : editStudent({ ...student, id: selectedStudentID });

  $saveBtn.prop("disabled", true).val("Saving...");
  request
    .done(function (response) {
      if (!response.success) {
        alert(response.error || "Unable to save student.");
        return;
      }

      if (formMode === "Add") {
        selectedStudentID = Number(response.id);
      }

      resetForm();
      fetchStudentData();
    })
    .fail(function (xhr) {
      const response = xhr.responseJSON || {};
      alert(response.error || "Unable to save student.");
    })
    .always(function () {
      $saveBtn.prop("disabled", false).val("Save");
    });
});

$cancelBtn.on("click", function () {
  formMode = "Add";
  resetForm();
  displayStudentDetails(getStudentById(selectedStudentID));
  toggleButtons(false, selectedStudentID >= 0);
});

function resetForm() {
  toggleButtons(false, false);
  enableFormFields(false);
  resetPlaceholder();
  resetInputFields();
}

function renderStudents() {
  $tbody.empty();
  students.forEach(function (student) {
    const $row = $("<tr></tr>");
    $("<td></td>").text(student.lastname).appendTo($row);
    $("<td></td>").text(student.firstname).appendTo($row);
    $("<td></td>").text(student.middlename).appendTo($row);
    $("<td></td>").text(student.gender).appendTo($row);
    $("<td></td>").text(student.acadlevel).appendTo($row);
    $("<td></td>").text(student.section).appendTo($row);
    $("<td></td>").text(student.email).appendTo($row);

    $row.on("click", function () {
      resetForm();
      displayStudentDetails(student);
      toggleButtons(false, true);
    });

    $tbody.append($row);
  });
}

function displayStudentDetails(student) {
  if (!student) return;

  selectedStudentID = student.id;

  $("#placeholder-value-lastname").text(student.lastname);
  $("#placeholder-value-firstname").text(student.firstname);
  $("#placeholder-value-middlename").text(student.middlename);
  $("#placeholder-value-gender").text(student.gender);
  $("#placeholder-value-acadlevel_id").text(student.acadlevel);
  $("#placeholder-value-section").text(student.section);
  $("#placeholder-value-email").text(student.email);
}

function populateFormFields(student) {
  if (!student) {
    return;
  }

  $txtLastname.val(student.lastname);
  $txtFirstname.val(student.firstname);
  $txtMiddlename.val(student.middlename);
  $txtGender.val(student.gender);
  $txtYearLevel.val(student.acadlevel_id);
  $txtSection.val(student.section_id);
  $txtEmail.val(student.email);
}

function toggleButtons(
  showSaveCancelBtn = false,
  showAddEditDeleteBtn = false,
) {
  $saveBtn.toggleClass("display-none", !showSaveCancelBtn);

  $cancelBtn.toggleClass("display-none", !showSaveCancelBtn);

  $editBtn.toggleClass("display-none", !showAddEditDeleteBtn);

  $deleteBtn.toggleClass("display-none", !showAddEditDeleteBtn);
}

function enableFormFields(enable = false) {
  $(".textbox").toggleClass("default-text", !enable);
  $(".option-box").toggleClass("default-text", !enable);


  const $inputs = $(
      "#txt-lastName, " +
      "#txt-firstName, " +
      "#txt-middleName, " +
      "#txt-gender, " +
      "#txt-year-level, " +
      "#txt-section, " +
      "#txt-email",
  );

  $inputs.prop("disabled", !enable);
}

function resetPlaceholder() {
  $placeholderLastname.html(
    `Last Name: <span id="placeholder-value-lastname"></span>`,
  );

  $placeholderFirstname.html(
    `First Name: <span id="placeholder-value-firstname"></span>`,
  );

  $placeholderMiddlename.html(
    `Middle Name: <span id="placeholder-value-middlename"></span>`,
  );

  $placeholderGender.html(
    `Gender: <span id="placeholder-value-gender"></span>`,
  );

  $placeholderYearLevel.html(
    `Year Level: <span id="placeholder-value-acadlevel_id"></span>`,
  );

  $placeholderSection.html(
    `Section: <span id="placeholder-value-section"></span>`,
  );

  $placeholderEmail.html(`Email: <span id="placeholder-value-email"></span>`);
}

function resetInputFields() {
  const $inputs = $(
    "#txt-lastName, " +
      "#txt-firstName, " +
      "#txt-middleName, " +
      "#txt-gender, " +
      "#txt-year-level, " +
      "#txt-section, " +
      "#txt-email",
  );

  $inputs.val("");
}

function validateForm() {

    const errors = [];

    if (!$txtLastname.val()) {
        errors.push("Last name is required");
    }

    if (!$txtFirstname.val()) {
        errors.push("First name is required");
    }

    if (!$txtMiddlename.val()) {
        errors.push("Middle name is required");
    }

    if (!$txtGender.val()) {
        errors.push("Gender is required");
    }

    if (!$txtYearLevel.val()) {
        errors.push("Year level is required");
    }

    if (!$txtSection.val()) {
        errors.push("Section is required");
    }

    if (!$txtEmail.val()) {
        errors.push("Email is required");
    }

    if (errors.length > 0) {

        alert(
            errors.join("\n")
        );
    }

    return errors;
}

function fetchStudentData(searchTerm = currentSearchTerm) {
  $tbody.html(`
        <tr>
            <td colspan="7">Loading student records...</td>
        </tr>
    `);

  getAllStudents(searchTerm)
    .done(function (response) {
      if (!response.success) {
        showTableMessage(response.error || "Unable to fetch students.");
        return;
      }

      students = response.data.map(normalizeStudent);
      if (!students.length) {
        selectedStudentID = -1;
        resetForm();
        showTableMessage("No students found.");
        toggleButtons(false, false);
        return;
      }

      if (!getStudentById(selectedStudentID)) {
        selectedStudentID = -1;
      }

      renderStudents();
      displayStudentDetails(getStudentById(selectedStudentID));
      toggleButtons(false, selectedStudentID >= 0);
    })
    .fail(function (xhr) {
      const response = xhr.responseJSON || {};
      const message = response.error || "Unable to fetch student records.";

      showTableMessage(message);
    });
}


function fetchAcadLevelData(){
  const $placeholder = $("<option></option>")
  .val("")
  .text("")
  .attr("disabled", true)
  .attr("selected", true)
  .prop("hidden", true);

  $txtYearLevel
    .prop("disabled", true)
    .empty()
    .append($("<option></option>").val("").text("Loading year levels..."));

  getAllAcadLevel()
    .done(function (response) {
    $txtYearLevel.empty().append($placeholder).prop("disabled", false);
    
    if (!response.success || !Array.isArray(response.data) || response.data.length === 0) {
      $("<option></option>")
        .val("")
        .text("No year levels available")
        .appendTo($txtYearLevel);
      return;
    }
 
    response.data.forEach(function (acadLevel) {
      $("<option></option>")
        .val(acadLevel.id)
        .text(acadLevel.name)
        .appendTo($txtYearLevel);
    });

    })
    .fail(function (){
      $txtYearLevel.empty().append($placeholder).prop("disabled", true);
      $("<option></option>")
        .val("")
        .text("Unable to load year levels")
        .appendTo($txtYearLevel);
    })
}

function fetchSectionData(){
  const $placeholder = $("<option></option>")
  .val("")
  .text("")
  .attr("disabled", true)
  .attr("selected", true)
  .prop("hidden", true);

  $txtSection
    .prop("disabled", true)
    .empty()
    .append($("<option></option>").val("").text("Loading sections..."));

  getAllSections()
    .done(function (response) {
    $txtSection.empty().append($placeholder).prop("disabled", false);
    
    if (!response.success || !Array.isArray(response.data) || response.data.length === 0) {
      $("<option></option>")
        .val("")
        .text("No section available")
        .appendTo($txtSection);
      return;
    }
 
    response.data.forEach(function (acadLevel) {
      $("<option></option>")
        .val(acadLevel.id)
        .text(acadLevel.name)
        .appendTo($txtSection);
    });

    })
    .fail(function (){
      $txtSection.empty().append($placeholder).prop("disabled", true);
      $("<option></option>")
        .val("")
        .text("Unable to load sections")
        .appendTo($txtSection);
    })
}

function showTableMessage(message) {
  const $row = $("<tr></tr>");
  $("<td></td>").attr("colspan", 7).text(message).appendTo($row);

  $tbody.empty().append($row);
}

function normalizeStudent(student) {
  const gender = student.gender === "M" ? "Male" : 
  student.gender === "F" ? "Female" :
  student.gender === "T" ? "Transformer": student.gender;
  return {
    id: Number(student.id),
    lastname: student.lastname || "",
    firstname: student.firstname || "",
    middlename: student.middlename || "",
    gender: gender || "",
    acadlevel: student.acadlevel_name || "",
    section: student.section_name || student.section || "",
    email: student.email || "",
    acadlevel_id: student.acadlevel_id || "",
    section_id: student.section_id || "",
  };
}

function getStudentById(studentId) {
  return students.find((student) => student.id === studentId);
}

function getAllStudents(searchTerm = "") {
  return $.ajax({
    url: baseURL,
    type: "GET",
    data: searchTerm
      ? { search: searchTerm }
      : { "get-all-students": 1 },
    dataType: "json",
  });
}

function getAllAcadLevel() {
  return $.ajax({
    url: baseURL,
    type: "GET",
    data: {
      "get-all-acadlevel": 1,
    },
    dataType: "json",
  });
}

function getAllSections() {
  return $.ajax({
    url: baseURL,
    type: "GET",
    data: {
      "get-all-sections": 1,
    },
    dataType: "json",
  });
}
function addStudent(student) {
  return $.ajax({
    url: baseURL,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(student),
    dataType: "json",
  });
}

function editStudent(student) {
  return $.ajax({
    url: baseURL,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(student),
    dataType: "json",
  });
}

$deleteBtn.on("click", function () {
  if (selectedStudentID === -1) return;

  if (confirm("Are you sure you want to delete this student?")) {
    $deleteBtn.prop("disabled", true).val("Deleting...");
    deleteStudent(selectedStudentID)
      .done(function (response) {
        if (!response.success) {
          alert(response.error || "Unable to delete student.");
          return;
        }

        resetForm();
        fetchStudentData();
      })
      .fail(function (xhr) {
        const response = xhr.responseJSON || {};
        const message = response.error || "Unable to delete student.";
        alert(message);
      })
      .always(function () {
        $deleteBtn.prop("disabled", false).val("Delete");
      });
  }
});
