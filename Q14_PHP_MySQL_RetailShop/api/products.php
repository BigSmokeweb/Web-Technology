<?php
require_once '../config/db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        if ($search) {
            $stmt = $conn->prepare("SELECT * FROM products WHERE name LIKE ? OR product_id LIKE ? ORDER BY created_at DESC");
            $s = "%$search%";
            $stmt->bind_param('ss', $s, $s);
        } else {
            $stmt = $conn->prepare("SELECT * FROM products ORDER BY created_at DESC");
        }
        $stmt->execute();
        $data = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        echo json_encode(['success'=>true,'count'=>count($data),'data'=>$data]);
        break;

    case 'POST':
        $d = json_decode(file_get_contents('php://input'), true);
        $pid = 'PRD-' . strtoupper(substr(uniqid(), -6));
        $stmt = $conn->prepare("INSERT INTO products (product_id, name, price, quantity) VALUES (?,?,?,?)");
        $stmt->bind_param('ssdi', $pid, $d['name'], $d['price'], $d['quantity']);
        if ($stmt->execute())
            echo json_encode(['success'=>true,'message'=>'Product added','product_id'=>$pid]);
        else
            echo json_encode(['success'=>false,'message'=>$stmt->error]);
        break;

    case 'PUT':
        $d = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare("UPDATE products SET name=?, price=?, quantity=? WHERE id=?");
        $stmt->bind_param('sdii', $d['name'], $d['price'], $d['quantity'], $d['id']);
        if ($stmt->execute())
            echo json_encode(['success'=>true,'message'=>'Product updated']);
        else
            echo json_encode(['success'=>false,'message'=>$stmt->error]);
        break;

    case 'DELETE':
        $id = intval($_GET['id']);
        $stmt = $conn->prepare("DELETE FROM products WHERE id=?");
        $stmt->bind_param('i', $id);
        if ($stmt->execute())
            echo json_encode(['success'=>true,'message'=>'Product deleted']);
        else
            echo json_encode(['success'=>false,'message'=>$stmt->error]);
        break;
}
$conn->close();
?>
