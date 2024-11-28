function addToDisplay(value) {
    // Get the display element
    let display = document.getElementById("display");
    // Append the value to the current display value
    display.value += value;
}

function clearDisplay() {
    // Get the display element
    let display = document.getElementById("display");
    // Clear the display value
    display.value = "";
}

function deleteLast() {
    // Get the display element
    let display = document.getElementById("display");
    // Remove the last character from the display value
    display.value = display.value.slice(0, -1);
}

function calculateAdvance() {
    try {
        // Get the display element
        let display = document.getElementById("display");
        // Evaluate the expression in the display value
        let result = eval(display.value);
        // Set the display value to the result
        display.value = result;
    } catch (error) {
        // If an error occurs, display an error message
        display.value = "Błąd";
    }
}



// Function to calculate the total weight for the first calculator
function calculateTotalWeight1() {
    var weightPerItem = parseFloat(document.getElementById("weightPerItem1").value.replace(",", "."));
    var quantityPerRow = parseFloat(document.getElementById("quantityPerRow1").value.replace(",", "."));
    var totalRows = parseFloat(document.getElementById("totalRows1").value.replace(",", "."));
    var currentWeight = parseFloat(document.getElementById("currentWeight1").value.replace(",", "."));
    var currentQuantity = parseFloat(document.getElementById("currentQuantity1").value.replace(",", "."));
    var requiredQuantity = parseFloat(document.getElementById("requiredQuantity1").value.replace(",", "."));

    if (!isNaN(weightPerItem) && !isNaN(quantityPerRow) && !isNaN(totalRows) && !isNaN(currentWeight) && !isNaN(currentQuantity) && !isNaN(requiredQuantity)) {
        var currentItems = currentWeight / weightPerItem;
        var totalItems = currentItems + currentQuantity + quantityPerRow * totalRows;
        var remainingItems = requiredQuantity - totalItems;
        var totalWeight = remainingItems * weightPerItem;
        if (totalWeight < 0) {
            var excessParaffin = Math.abs(totalWeight).toFixed(2);
            document.getElementById("result1").value = `Masz nadmiar parafiny (${excessParaffin} kg)`;
        } else {
            document.getElementById("result1").value = `${totalWeight.toFixed(2)} kg`;
        }
        clearSecondCalculatorFields();
        // Przeniesienie wartości z pierwszego kalkulatora do drugiego
        document.getElementById("quantityPerRow2").value = quantityPerRow;
        document.getElementById("currentQuantity2").value = currentQuantity;
        document.getElementById("requiredQuantity2").value = requiredQuantity;


        var calculation = {
            calculatorName: "Pierwszy",
            fieldValues: `Waga na sztukę: ${weightPerItem} kg, Swieczek w rzędzie: ${quantityPerRow}, Rzędów: ${totalRows}, Obecna waga: ${currentWeight} kg, Obecna ilość: ${currentQuantity}, Wymagana ilość: ${requiredQuantity}`,
            totalWeight: totalWeight.toFixed(2),
            excessParaffin: (totalWeight < 0) ? excessParaffin : null
        };

        saveCalculationToServer(calculation);
    } else {
        document.getElementById("result1").value = "Niepoprawnie wypełnione pola";
    }
}


function calculateTotalWeight2() {
    let weightPerItem = parseFloat(document.getElementById("weightPerItem2").value.replace(",", "."));
    var quantityPerRow = parseFloat(document.getElementById("quantityPerRow2").value.replace(",", "."));
    var totalRows = parseFloat(document.getElementById("totalRows2").value.replace(",", "."));
    var currentWeight = parseFloat(document.getElementById("currentWeight2").value.replace(",", "."));
    var currentQuantity = parseFloat(document.getElementById("currentQuantity2").value.replace(",", "."));
    var requiredQuantity = parseFloat(document.getElementById("requiredQuantity2").value.replace(",", "."));

    if (!isNaN(weightPerItem) && !isNaN(quantityPerRow) && !isNaN(totalRows) && !isNaN(currentWeight) && !isNaN(currentQuantity) && !isNaN(requiredQuantity)) {
        var currentItems = currentWeight / weightPerItem;
        var totalItems = currentItems + currentQuantity + quantityPerRow * totalRows;
        var remainingItems = requiredQuantity - totalItems;
        var totalWeight = remainingItems * weightPerItem;
        if (totalWeight < 0) {
            var excessParaffin = Math.abs(totalWeight).toFixed(2);
            document.getElementById("result2").value = `Nadmiar parafiny (${excessParaffin} kg)`;
        } else {
            document.getElementById("result2").value = `${totalWeight.toFixed(2)} kg`;
        }

        var calculation = {
            calculatorName: "Drugi",
            fieldValues: `Waga na sztukę: ${weightPerItem} kg, Swieczek w rzędzie: ${quantityPerRow}, Rzędów: ${totalRows}, Obecna waga: ${currentWeight} kg, Obecna ilość: ${currentQuantity}, Wymagana ilość: ${requiredQuantity}`,
            totalWeight: totalWeight.toFixed(2),
            excessParaffin: (totalWeight < 0) ? excessParaffin : null
        };

        saveCalculationToServer(calculation);
    } else {
        document.getElementById("result2").value = "Niepoprawnie wypełnione pola";
    }
}




function clearSecondCalculatorFields() {
    // Clear all input fields for the second calculator
    document.getElementById("weightPerItem2").value = "";
    document.getElementById("quantityPerRow2").value = "";
    document.getElementById("totalRows2").value = "";
    document.getElementById("currentWeight2").value = "";
    document.getElementById("currentQuantity2").value = "";
    document.getElementById("requiredQuantity2").value = "";
    document.getElementById("result2").value = ""; // Clear the result field
}

function saveCalculationToServer(calculation) {
    // Add order number to the calculation data
    calculation.orderNumber = document.getElementById("orderNumber").value;
    // Add line_name to the calculation data
    calculation.line_name = document.getElementById("lineSelect").value;
    // Log the line name for debugging purposes
    console.log("Zapis obliczeń dla linii:", calculation.line_name);

    // Create a new XMLHttpRequest to send data to the server
    let xhr = new XMLHttpRequest();
    let url = "save_calculation.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Define what happens when the request state changes
    xhr.onreadystatechange = function () {
        // Check if the request is complete and was successful
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText); // Log the server response
            displayCalculationHistory(); // Refresh the calculation history display
        }
    };

    // Send the calculation data as a JSON string
    xhr.send(JSON.stringify(calculation));
}

function displayCalculationHistory() {
    // Get the selected line name
    let line_name = document.getElementById("lineSelect").value;
    // Create a new XMLHttpRequest to get calculation history from the server
    let xhr = new XMLHttpRequest();
    let url = "get_history.php?line_name=" + line_name;
    xhr.open("GET", url, true);

    // Define what happens when the request state changes
    xhr.onreadystatechange = function () {
        // Check if the request is complete and was successful
        if (xhr.readyState === 4 && xhr.status === 200) {
            let history = JSON.parse(xhr.responseText); // Parse the response as JSON
            renderCalculationHistory(history); // Render the calculation history
        }
    };

    // Send the request
    xhr.send();
}

function renderCalculationHistory(history) {
    // Get the calculation history table element
    let table = document.getElementById("calculationHistory");
    table.innerHTML = ""; // Clear existing table content

    // Create header row
    let headerRow = table.insertRow(0);
    let headers = ["Numer", "Nazwa Linii", "Kalkulator", "Wartości Pola", "Całkowita Waga", "Nadmiar Parafiny", "Numer Zamówienia", "Czas"];
    for (let i = 0; i < headers.length; i++) {
        let headerCell = document.createElement("th"); // Create header cell
        headerCell.textContent = headers[i]; // Set header cell text
        headerRow.appendChild(headerCell); // Append header cell to header row
    }

    // Sort calculation history from newest to oldest
    history.sort(function(a, b) {
        return b.timestamp - a.timestamp; // Sort by timestamp
    });

    // Add calculation entries to the table
    for (let j = 0; j < history.length; j++) {
        let calculation = history[j]; // Get individual calculation entry
        let row = table.insertRow(j + 1); // Insert a new row for the calculation
        row.insertCell(0).textContent = j + 1; // Serial number
        row.insertCell(1).textContent = calculation.line_name; // Line name
        row.insertCell(2).textContent = calculation.calculatorName; // Calculator name
        row.insertCell(3).textContent = calculation.fieldValues; // Field values
        row.insertCell(4).textContent = calculation.totalWeight; // Total weight
        row.insertCell(5).textContent = calculation.excessParaffin || "-"; // Excess paraffin or "-" if not available
        row.insertCell(6).textContent = calculation.orderNumber; // Order number
        row.insertCell(7).textContent = formatTimestamp(calculation.timestamp); // Formatted timestamp
    }
}

// Function to format timestamp (assuming timestamp is in seconds since Unix epoch)
function formatTimestamp(timestamp) {
    let date = new Date(timestamp * 1000); // Create a date object
    let day = date.getDate(); // Get day
    let month = date.getMonth() + 1; // Get month (0-indexed)
    let year = date.getFullYear(); // Get year
    let hours = date.getHours(); // Get hours
    let minutes = ("0" + date.getMinutes()).slice(-2); // Get minutes and pad with zero
    let seconds = ("0" + date.getSeconds()).slice(-2); // Get seconds and pad with zero
    let formattedDate = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds; // Format date
    return formattedDate; // Return formatted date
}


function changeLineColor() {
  // Get the selected line from the dropdown
  let lineSelect = document.getElementById("lineSelect");
  let selectedLine = lineSelect.value;
  
  // Save the selected line to localStorage
  localStorage.setItem("selectedLine", selectedLine);

  // Get the header element
  let header = document.querySelector(".header");
  header.className = "header"; // Remove existing classes

  // Apply the class corresponding to the selected line
  switch (selectedLine) {
    case "vt9":
      header.classList.add("vt9");
      break;
    case "vt8":
      header.classList.add("vt8");
      break;
    case "vt7":
      header.classList.add("vt7");
      break;
    case "vt6":
      header.classList.add("vt6");
      break;
    case "vt5":
      header.classList.add("vt5");
      break;
    case "vt4":
      header.classList.add("vt4");
      break;
    case "vt3":
      header.classList.add("vt3");
      break;
    case "vt2":
      header.classList.add("vt2");
      break;
    default:
      // Remove classes if none of the options match
      header.classList.remove("vt9", "vt8", "vt7", "vt6", "vt5", "vt4", "vt3", "vt2");
  }

  displayCalculationHistory(selectedLine); // Update the calculation history display based on the selected line
}

function changeOperation() {
  // Get the selected operation type from the dropdown
  let operation = document.getElementById("operation").value;

  if (operation === "balance") {
    // Hide fields related to adding paraffin if they are visible
    document.getElementById("rowsA").style.display = "none";
    document.getElementById("quantityPerRowA").style.display = "none";
    document.getElementById("containerBWeight").style.display = "block"; // Show weight field for container B
    document.getElementById("containerBConsumption").style.display = "block"; // Show consumption field for container B
  } else if (operation === "order") {
    // Show fields related to adding paraffin
    document.getElementById("rowsA").style.display = "block";
    document.getElementById("quantityPerRowA").style.display = "block";
    document.getElementById("containerBWeight").style.display = "none"; // Hide weight field for container B
    document.getElementById("containerBConsumption").style.display = "none"; // Hide consumption field for container B
  }
}

// Event listener for changes in the calculation type
document.getElementById('calculationType').addEventListener('change', function() {
  if (this.value === 'transfer') {
    // Get modal and buttons
    let modal = document.getElementById("myModal");
    let closeButton = document.getElementsByClassName("close")[0];
    let confirmButton = document.getElementById("modalConfirmButton");
    let cancelButton = document.getElementById("modalCancelButton");

    modal.style.display = "block"; // Show modal

    // Close modal when close button is clicked
    closeButton.onclick = function() {
      modal.style.display = "none";
      document.getElementById('calculationType').value = 'equalize'; // Reset calculation type
    }

    // Confirm button action
    confirmButton.onclick = function() {
      modal.style.display = "none";
      transferParaffin(); // Call the function to transfer paraffin
    }

    // Cancel button action
    cancelButton.onclick = function() {
      modal.style.display = "none";
      document.getElementById('calculationType').value = 'equalize'; // Reset calculation type
    }

    // Close modal if clicked outside of it
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
        document.getElementById('calculationType').value = 'equalize'; // Reset calculation type
      }
    }
  }
});

// Function to calculate paraffin based on the selected calculation type
function calculate() {
  let calculationType = document.getElementById("calculationType").value;

  if (calculationType === "transfer") {
    // Show the modal for transfer confirmation
    let modal = document.getElementById("myModal");
    let closeButton = document.getElementsByClassName("close")[0];
    let confirmButton = document.getElementById("modalConfirmButton");

    modal.style.display = "block"; // Show modal

    // Close modal when close button is clicked
    closeButton.onclick = function() {
      modal.style.display = "none";
    }

    // Confirm button action
    confirmButton.onclick = function() {
      modal.style.display = "none";
      transferParaffin(); // Call the function to transfer paraffin
    }

    // Close modal if clicked outside of it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  } else if (calculationType === "equalize") {
    equalizeParaffin(); // Call function to equalize paraffin
  }
}

// Function to equalize paraffin in the containers
function equalizeParaffin() {
  // Retrieve user input values
  let containerAWeight = parseFloat(document.getElementById("containerAWeight").value.replace(",", "."));
  let containerAConsumption = parseFloat(document.getElementById("containerAConsumption").value.replace(",", "."));
  let rowsA = parseInt(document.getElementById("rowsA").value);
  let quantityPerRowA = parseInt(document.getElementById("quantityPerRowA").value);
  let containerBWeight = parseFloat(document.getElementById("containerBWeight").value.replace(",", "."));
  let containerBConsumption = parseFloat(document.getElementById("containerBConsumption").value.replace(",", "."));

  // Check if input values are valid
  if (!isNaN(containerAWeight) && !isNaN(containerAConsumption) && !isNaN(rowsA) && !isNaN(quantityPerRowA) && !isNaN(containerBWeight) && !isNaN(containerBConsumption)) {
    // Calculate total amount of paraffin to add to the first container
    let totalAmountOfParaffinToAdd = rowsA * quantityPerRowA * containerAConsumption;

    // Calculate new weight of the first container after adding paraffin
    let newContainerAWeight = containerAWeight + totalAmountOfParaffinToAdd;

    // Calculate time until paraffin is consumed in both containers
    let timeContainerA = newContainerAWeight / containerAConsumption;
    let timeContainerB = containerBWeight / containerBConsumption;

    // Determine how much is needed to balance the first and second containers
    let shortfallForContainerA = timeContainerB * containerAConsumption - newContainerAWeight; // Shortfall for the first container
    let shortfallForContainerB = timeContainerA * containerBConsumption - containerBWeight; // Shortfall for the second container

    // Prepare result text
    let result;
    if (shortfallForContainerA > 0) {
      result = `Brakuje do pierwszego: ${shortfallForContainerA.toFixed(2)} kg`; // Shortfall message for container A
    } else if (shortfallForContainerB > 0) {
      result = `Brakuje do drugiego: ${shortfallForContainerB.toFixed(2)} kg`; // Shortfall message for container B
    } else {
      result = "Oba pojemniki są wyrównane"; // Both containers are balanced
    }
    
    // Update the result field in the HTML
    document.getElementById("result").value = result;
  } else {
    // Handle case where input data is invalid
    document.getElementById("result").value = "Nieprawidłowe dane wejściowe"; // Invalid input message
  }
}


// Function to transfer paraffin between containers
function transferParaffin() {
  // Retrieve user input values
  let containerAWeight = parseFloat(document.getElementById("containerAWeight").value.replace(",", "."));
  let containerAConsumption = parseFloat(document.getElementById("containerAConsumption").value.replace(",", "."));
  let rowsA = parseInt(document.getElementById("rowsA").value);
  let quantityPerRowA = parseInt(document.getElementById("quantityPerRowA").value);
  let containerBWeight = parseFloat(document.getElementById("containerBWeight").value.replace(",", "."));
  let containerBConsumption = parseFloat(document.getElementById("containerBConsumption").value.replace(",", "."));

  // Check if input values are valid
  if (!isNaN(containerAWeight) && !isNaN(containerAConsumption) && !isNaN(rowsA) && !isNaN(quantityPerRowA) && !isNaN(containerBWeight) && !isNaN(containerBConsumption)) {
    // Calculate total amount of paraffin in the first container including the wax in candles
    let totalCandlesA = rowsA * quantityPerRowA; // Total number of candles in container A
    let waxInCandlesA = totalCandlesA * containerAConsumption; // Total wax amount in candles
    let totalWaxA = containerAWeight + waxInCandlesA; // Total wax in container A

    // Define consumption rates
    let k1 = containerAConsumption; // Consumption rate for container A
    let k2 = containerBConsumption; // Consumption rate for container B

    // Check if k1 + k2 is zero to avoid division by zero
    if (k1 + k2 === 0) {
      document.getElementById('result').value = "Error: Consumption values cannot be zero.";
      return;
    }

    // Calculate the amount of paraffin needed to balance both containers
    let transferAmount = (totalWaxA * k2 - containerBWeight * k1) / (k1 + k2);

    // Prepare result text
    let resultMessage;
    if (transferAmount > 0) {
      // If the transfer amount is positive, paraffin should be moved from A to B
      resultMessage = `Przenieść ${transferAmount.toFixed(2)} kg parafiny z pierwszego do drugiego pojemnika.`;
    } else if (transferAmount < 0) {
      // If the transfer amount is negative, paraffin should be moved from B to A
      resultMessage = `Przenieść ${Math.abs(transferAmount).toFixed(2)} kg parafiny z drugiego do pierwszego pojemnika.`;
    } else {
      // If transferAmount is zero, no transfer is needed
      resultMessage = "Oba pojemniki są wyrównane.";
    }

    // Display the result in the HTML result field
    document.getElementById("result").value = resultMessage;
  } else {
    // Handle case where input data is invalid
    document.getElementById("result").value = "Invalid input data.";
  }
}


// On window load, check localStorage for a selected line and apply styles
window.onload = function() {
  let selectedLine = localStorage.getItem("selectedLine");

  if (selectedLine) {
    let lineSelect = document.getElementById("lineSelect");
    lineSelect.value = selectedLine; // Set the dropdown value to the saved line
    changeLineColor(); // Apply styles based on the saved value
  }

  displayCalculationHistory(selectedLine); // Update calculation history display based on selected style
};
