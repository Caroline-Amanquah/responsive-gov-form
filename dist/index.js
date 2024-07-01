document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");

  const fullNameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("event-name");
  const niInput = document.getElementById("national-insurance-number");
  const passwordInput = document.getElementById("password-input");
  const dobDayInput = document.getElementById("dob-day");
  const dobMonthInput = document.getElementById("dob-month");
  const dobYearInput = document.getElementById("dob-year");
  const originInputs = document.querySelectorAll(
    'input[name="whereDoYouLive"]',
  );
  const purposeInputs = document.querySelectorAll(
    'input[name="accountPurpose"]',
  );
  const phoneInput = document.getElementById("telephone-number");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateForm()) {
      submitForm();
    }
  });

  fullNameInput.addEventListener("input", () => validateFullName());
  emailInput.addEventListener("input", () => validateEmail());
  niInput.addEventListener("input", () => validateNI());
  passwordInput.addEventListener("input", () => validatePassword());
  dobDayInput.addEventListener("input", () => validateDOB());
  dobMonthInput.addEventListener("input", () => validateDOB());
  dobYearInput.addEventListener("input", () => validateDOB());
  phoneInput.addEventListener("input", () => validatePhone());

  originInputs.forEach((input) =>
    input.addEventListener("change", () => validateOrigin()),
  );
  purposeInputs.forEach((input) =>
    input.addEventListener("change", () => validatePurpose()),
  );

  function validateForm() {
    let formIsValid = true;

    if (!validateFullName()) formIsValid = false;
    if (!validateEmail()) formIsValid = false;
    if (!validateNI()) formIsValid = false;
    if (!validatePassword()) formIsValid = false;
    if (!validateDOB()) formIsValid = false;
    if (!validateOrigin()) formIsValid = false;
    if (!validatePurpose()) formIsValid = false;
    if (!validatePhone()) formIsValid = false;

    return formIsValid;
  }

  function validateFullName() {
    const fullNameRegex = /^[A-Za-z\s]{2,}$/;
    if (!fullNameRegex.test(fullNameInput.value.trim())) {
      displayError(fullNameInput, "full-name-error", "Enter your full name.");
      return false;
    } else {
      clearError(fullNameInput, "full-name-error");
      return true;
    }
  }

  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      displayError(
        emailInput,
        "email-error",
        "Enter an email address in the correct format, like name@example.com.",
      );
      return false;
    } else {
      clearError(emailInput, "email-error");
      return true;
    }
  }

  function validateNI() {
    const niRegex = /^[A-CEGHJ-PR-TW-Z]{2}[0-9]{6}[A-D]?$/;
    if (!niRegex.test(niInput.value.trim())) {
      displayError(
        niInput,
        "national-insurance-number-error",
        "Enter your National Insurance number in the correct format.",
      );
      return false;
    } else {
      clearError(niInput, "national-insurance-number-error");
      return true;
    }
  }

  function validatePassword() {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;
    if (!passwordRegex.test(passwordInput.value.trim())) {
      displayError(passwordInput, "password-error", "Enter a valid password.");
      return false;
    } else {
      clearError(passwordInput, "password-error");
      return true;
    }
  }

  function validateDOB() {
    const dobFormGroup = document.getElementById("dob-form-group");
    const errorContainer = document.getElementById("dob-error-container");

    if (
      !dobDayInput.value.trim() ||
      !dobMonthInput.value.trim() ||
      !dobYearInput.value.trim()
    ) {
      displayError(
        dobFormGroup,
        "dob-error",
        "Enter a valid date.",
        errorContainer,
      );
      dobDayInput.classList.add("govuk-input--error");
      dobMonthInput.classList.add("govuk-input--error");
      dobYearInput.classList.add("govuk-input--error");
      return false;
    } else {
      clearError(dobFormGroup, "dob-error", errorContainer);
      dobDayInput.classList.remove("govuk-input--error");
      dobMonthInput.classList.remove("govuk-input--error");
      dobYearInput.classList.remove("govuk-input--error");
      return true;
    }
  }

  function validateOrigin() {
    let originSelected = false;
    originInputs.forEach((input) => {
      if (input.checked) {
        originSelected = true;
      }
    });
    if (!originSelected) {
      displayError(
        originInputs[0],
        "origin-error",
        "Select the country where you live.",
        document.getElementById("origin-error-container"),
      );
      return false;
    } else {
      clearError(originInputs[0], "origin-error");
      return true;
    }
  }

  function validatePurpose() {
    let purposeSelected = false;
    purposeInputs.forEach((input) => {
      if (input.checked) {
        purposeSelected = true;
      }
    });
    if (!purposeSelected) {
      displayError(
        purposeInputs[0],
        "purpose-error",
        "Select an account purpose.",
        document.getElementById("purpose-error-container"),
      );
      return false;
    } else {
      clearError(purposeInputs[0], "purpose-error");
      return true;
    }
  }

  function validatePhone() {
    const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
    if (!phoneRegex.test(phoneInput.value.trim())) {
      displayError(phoneInput, "phone-error", "Enter a UK telephone number.");
      return false;
    } else {
      clearError(phoneInput, "phone-error");
      return true;
    }
  }

  function displayError(
    inputElement,
    errorId,
    errorMessage,
    errorContainer = null,
  ) {
    const formGroup = inputElement.closest(".govuk-form-group");
    formGroup.classList.add("govuk-form-group--error");
    inputElement.classList.add("govuk-input--error");

    let errorElement = document.getElementById(errorId);
    if (!errorElement) {
      errorElement = document.createElement("p");
      errorElement.id = errorId;
      errorElement.className = "govuk-error-message";
      errorElement.innerHTML = `<span class="govuk-visually-hidden">Error:</span> ${errorMessage}`;
      if (errorContainer) {
        errorContainer.appendChild(errorElement);
      } else {
        const labelElement = formGroup.querySelector("label, legend");
        formGroup.insertBefore(errorElement, labelElement.nextSibling);
      }
    }

    inputElement.setAttribute("aria-describedby", errorId);
  }

  function clearError(inputElement, errorId) {
    const formGroup = inputElement.closest(".govuk-form-group");
    formGroup.classList.remove("govuk-form-group--error");
    inputElement.classList.remove("govuk-input--error");

    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.remove();
    }

    inputElement.removeAttribute("aria-describedby");
  }

  function submitForm() {
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      if (key !== "fileUpload1") {
        // Exclude fileUpload1 field
        if (!data[key]) {
          data[key] = value;
        } else {
          if (!Array.isArray(data[key])) {
            data[key] = [data[key]];
          }
          data[key].push(value);
        }
      }
    });

    // Ensure accountPurpose is an array
    data.accountPurpose = formData.getAll("accountPurpose");

    console.log("Form Data:", data); // Debugging line

    fetch("http://localhost:3000/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
