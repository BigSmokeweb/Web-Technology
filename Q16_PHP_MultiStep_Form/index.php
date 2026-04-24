<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MultiStep Form | PHP Session</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="app">
    <header>
        <div class="logo"><span>📋</span><h1>Multi-Step Form</h1></div>
        <p>PHP processes and stores data across steps using sessions</p>
    </header>
    <div class="form-wrapper">
        <?php include 'process.php'; ?>
    </div>
</div>
</body>
</html>
