document.addEventListener("DOMContentLoaded", function () {
  const startDateInput = document.getElementById("start-date-picker");
  const endDateInput = document.getElementById("end-date-picker");
  const month=document.getElementById('month')
  const excludedDatesInput = document.getElementById("excluded-dates");
  const numberOfDays = document.getElementById("number-of-days");
  const Expected_DRR = document.getElementById("DRR");
  const Lead = document.getElementById("lead-count");
  const updateButton = document.getElementById("update-button");
  const updateTime = document.getElementById("update-time");
  updateButton.addEventListener("click", showUpdateTime);
  const drrTable = document.querySelector(".drr-table"); // Get the table element

  updateButton.addEventListener("click", function () {
    // Validate the form fields before saving
    if (validateForm()) {
      printAllData();
    } else {
      alert("Please fill in all required details before saving.");
    }
  });
  function validateForm() {
    // Check if any of the required fields are empty
    if (
      startDateInput.value.trim() === "" ||
      endDateInput.value.trim() === "" ||
      Lead.value.trim() === ""
    ) {
      return false; //if  Validation failed
    }
    return true; // Validation passed
  }
  function printAllData() {
    
    const dataRow = document.createElement("tr");

    // Create cells for all the data
    const startDateCell = document.createElement("td");
    startDateCell.textContent = "Start Date: " + startDateInput.value;

    const endDateCell = document.createElement("td");
    endDateCell.textContent = "End Date: " + endDateInput.value;

    const monthYear=document.createElement("td");
    monthYear.textContent=month.textContent

    const excludedDatesCell = document.createElement("td");
    excludedDatesCell.textContent = "Excluded Dates: " + excludedDatesInput.value;

    const numberOfDaysCell = document.createElement("td");
    numberOfDaysCell.textContent = "Number of Days: " + numberOfDays.textContent;

    const leadCell = document.createElement("td");
    leadCell.textContent = "Lead Count: " + Lead.value;

    const DRRCell = document.createElement("td");
    DRRCell.textContent = "Expected DRR: " + Expected_DRR.textContent;

    const time=document.createElement("td");
    time.textContent="last updated:"+updateTime.textContent;

    // Append the cells to the row
    dataRow.appendChild(startDateCell);
    dataRow.appendChild(endDateCell);
    dataRow.appendChild(monthYear);
    dataRow.appendChild(excludedDatesCell);
    dataRow.appendChild(numberOfDaysCell);
    dataRow.appendChild(leadCell);
    dataRow.appendChild(DRRCell);
    dataRow.appendChild(time);

    // Append the row to the table
    drrTable.appendChild(dataRow);

    startDateInput.value = "";
    endDateInput.value = "";
    excludedDatesInput.value = "";
    Lead.value = "";

    // Clear other content
    month.textContent="";
    numberOfDays.textContent = "";
    Expected_DRR.textContent = "";
   
  }

  function showUpdateTime() {
    const currentTime = new Date();
    updateTime.textContent = currentTime.toLocaleString();
  }

  const startDatePicker = flatpickr(startDateInput, {
    dateFormat: "Y-m-d",
    onChange: calculateDaysAndDRR,
    onChange:getMonth,
  });

  const endDatePicker = flatpickr(endDateInput, {
    dateFormat: "Y-m-d",
    onChange: calculateDaysAndDRR,
  });

  const excludedDatesPicker = flatpickr(excludedDatesInput, {
    dateFormat: "Y-m-d",
    mode: "multiple",
    onChange: calculateDaysAndDRR,
  });
  function getMonth() {
    const start_date = new Date(startDateInput.value); // Convert the input value to a Date object
    const selectedMonth = start_date.getMonth();
    const selectedYear = start_date.getFullYear();
    month.textContent = selectedMonth + " " + selectedYear;
  }

  function calculateDaysAndDRR() {
    const startDate = startDatePicker.selectedDates[0];
    const endDate = endDatePicker.selectedDates[0];
    const excludedDates = excludedDatesPicker.selectedDates;

    const daysDifference = endDate - startDate; //WILL CALCULATE IN MILLISECONDS
    const daysInMilliseconds = 24 * 60 * 60 * 1000;

    let totalDays = Math.floor(daysDifference / daysInMilliseconds) + 1; //CONVERT IT INTO DAYS

    if (excludedDates && Array.isArray(excludedDates)) {
      totalDays -= excludedDates.length; // DECREASE EXCLUDED DATES FROM TOTTAL DAYS
    }

    numberOfDays.textContent = totalDays;
    updateDRR(); //UPDATE VALUE OF DRR ACCORDING TO EXCUDED DATES OR IF ANY DATE CHANGED
  }

  function updateDRR() {
    const lead = parseInt(Lead.value);
    const daysValue = parseInt(numberOfDays.textContent);

    if (!isNaN(lead) && !isNaN(daysValue) && daysValue !== 0) {
      const drr = Math.ceil(lead / daysValue);
      Expected_DRR.textContent = drr;
    } else {
      Expected_DRR.textContent = "Invalid Input";
    }
  }

  Lead.addEventListener("input", updateDRR); // AS WE INPUT LEAD VALUE IT WILL CALCULATE DRR

  
});
