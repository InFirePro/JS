<?php
include('./core/db.php');

if (!$conn) {
    error_log("Database connection failed: " . mysqli_connect_error());
    http_response_code(500);
    die("Error connecting to the database");
}

// Prepare SQL query to fetch calculation history
$sql = "SELECT * FROM calculation_history";
$params = [];
$whereClauses = [];

// Check if line_name is provided
if (isset($_GET['line_name'])) {
    $line_name = trim($_GET['line_name']); // Trim the input
    if (!empty($line_name)) {
        $whereClauses[] = "line_name = ?";
        $params[] = $line_name; // Add to parameters for prepared statement
    }
}

// Check if orderNumber is provided
if (isset($_GET['orderNumber'])) {
    $orderNumber = trim($_GET['orderNumber']); // Trim the input
    if (!empty($orderNumber)) {
        $whereClauses[] = "order_number = ?";
        $params[] = $orderNumber; // Add to parameters for prepared statement
    }
}

// Construct the SQL query based on provided parameters
if (!empty($whereClauses)) {
    $sql .= " WHERE " . implode(' AND ', $whereClauses);
}

// Prepare the statement
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    error_log("Statement preparation failed: " . $conn->error);
    http_response_code(500);
    die("Error preparing query");
}

// Bind parameters if any
if (!empty($params)) {
    $stmt->bind_param(str_repeat('s', count($params)), ...$params);
}

// Execute the statement
$stmt->execute();
$result = $stmt->get_result();

// Check for results and fetch rows
if ($result->num_rows > 0) {
    $rows = array();
    while ($row = $result->fetch_assoc()) {
        // Convert timestamp to proper format (if necessary)
        $row['timestamp'] = strtotime($row['timestamp']); // Assuming 'timestamp' is fetched as a UNIX timestamp
        $rows[] = $row;
    }
    echo json_encode($rows);
} else {
    echo json_encode(array()); // Return empty array if no results
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>












