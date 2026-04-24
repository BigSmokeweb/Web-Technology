<?php
require_once '../config/db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // READ all or search
    case 'GET':
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        $category = isset($_GET['category']) ? $_GET['category'] : '';
        $sql = "SELECT * FROM products WHERE 1=1";
        $params = [];
        $types = '';
        if ($search) {
            $sql .= " AND (name LIKE ? OR description LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $types .= 'ss';
        }
        if ($category) {
            $sql .= " AND category = ?";
            $params[] = $category;
            $types .= 's';
        }
        $sql .= " ORDER BY created_at DESC";
        $stmt = $conn->prepare($sql);
        if ($params) $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        echo json_encode(['success' => true, 'count' => count($result), 'data' => $result]);
        break;

    // CREATE
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare("INSERT INTO products (name, category, price, quantity, description) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('ssdis', $data['name'], $data['category'], $data['price'], $data['quantity'], $data['description']);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Product added successfully', 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => $stmt->error]);
        }
        break;

    // UPDATE
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare("UPDATE products SET name=?, category=?, price=?, quantity=?, description=? WHERE id=?");
        $stmt->bind_param('ssdisi', $data['name'], $data['category'], $data['price'], $data['quantity'], $data['description'], $data['id']);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => $stmt->error]);
        }
        break;

    // DELETE
    case 'DELETE':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $stmt = $conn->prepare("DELETE FROM products WHERE id=?");
        $stmt->bind_param('i', $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => $stmt->error]);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
$conn->close();
?>
