document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('account-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        validateForm();
    });
});

function validateForm() {
    const fullNameInput = document.getElementById('full-name');
    const nameGroup = document.getElementById('name-group');
    const fullNameValue = fullNameInput.value.trim();

    // Remove any existing error messages
    const existingErrorMessage = document.getElementById('full-name-error');
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }

    // Check if the full name is empty
    if (!fullNameValue) {
        nameGroup.classList.add('govuk-form-group--error');
        fullNameInput.classList.add('govuk-input--error');

        // Create and append the error message
        const errorMessage = document.createElement('p');
        errorMessage.id = 'full-name-error';
        errorMessage.className = 'govuk-error-message';
        errorMessage.innerHTML = '<span class="govuk-visually-hidden">Error:</span> Enter your full name';
        nameGroup.appendChild(errorMessage);

        // Add aria-describedby to the input
        fullNameInput.setAttribute('aria-describedby', 'full-name-error');
    } else {
        nameGroup.classList.remove('govuk-form-group--error');
        fullNameInput.classList.remove('govuk-input--error');
        fullNameInput.removeAttribute('aria-describedby');
        form.submit();
    }
}
