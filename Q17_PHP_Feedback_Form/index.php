<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FeedbackHub | PHP Feedback Form</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="app">
    <header>
        <div class="logo"><span>💬</span><h1>FeedbackHub</h1></div>
        <p>PHP processes your feedback and displays a confirmation</p>
    </header>
    <div class="content">
        <?php include 'process.php'; ?>
    </div>
</div>
</body>
</html>
