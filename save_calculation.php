<?php
include('./core/db.php');

// Check if connection is successful
if (!$conn) {
    error_log("Database connection failed: " . mysqli_connect_error());
    http_response_code(500);
    die("Database connection error");
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Check for valid input data
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    die("Invalid JSON input");
}

// Prepare data
$line_name = $conn->real_escape_string($data['line_name']);
$calculatorName = $conn->real_escape_string($data['calculatorName']);
$fieldValues = $conn->real_escape_string($data['fieldValues']);
$totalWeight = $conn->real_escape_string($data['totalWeight']);
$excessParaffin = isset($data['excessParaffin']) ? $conn->real_escape_string($data['excessParaffin']) : null;
$orderNumber = $conn->real_escape_string($data['orderNumber']);

// SQL statement
$sql = "INSERT INTO calculation_history (line_name, calculatorName, fieldValues, totalWeight, excessParaffin, orderNumber)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    error_log("SQL prepare failed: " . $conn->error);
    http_response_code(500);
    die("Database error");
}

// Bind parameters
$stmt->bind_param("ssssss", $line_name, $calculatorName, $fieldValues, $totalWeight, $excessParaffin, $orderNumber);

// Execute and check for success
if ($stmt->execute()) {
    echo json_encode(["message" => "New record created successfully"]);
} else {
    error_log("SQL execute failed: " . $stmt->error);
    http_response_code(500);
    echo json_encode(["error" => "Error: " . $stmt->error]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>


