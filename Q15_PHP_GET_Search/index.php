<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CourseSearch | GET Method PHP</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="app">
    <header>
        <div class="logo"><span>🎓</span><h1>CourseSearch</h1></div>
        <p>Search using PHP GET method — $_GET captures the keyword</p>
    </header>

    <!-- Search Form using GET -->
    <div class="search-section card">
        <h2>Find Your Course</h2>
        <form method="GET" action="results.php" class="search-form">
            <div class="search-row">
                <input type="text" name="keyword" id="keyword"
                       placeholder="e.g. Python, Web Design, Data Science..."
                       value="<?php echo isset($_GET['keyword']) ? htmlspecialchars($_GET['keyword']) : ''; ?>" />
                <button type="submit" class="btn btn-primary">Search 🔍</button>
            </div>
        </form>
        <div class="quick-tags">
            <span>Popular:</span>
            <a href="results.php?keyword=Python" class="tag">Python</a>
            <a href="results.php?keyword=JavaScript" class="tag">JavaScript</a>
            <a href="results.php?keyword=MySQL" class="tag">MySQL</a>
            <a href="results.php?keyword=PHP" class="tag">PHP</a>
            <a href="results.php?keyword=React" class="tag">React</a>
        </div>
    </div>

    <!-- PHP Results Section -->
    <?php
    if (isset($_GET['keyword']) && trim($_GET['keyword']) !== '') {
        $keyword = htmlspecialchars(trim($_GET['keyword']));

        // Sample course database (in real app, fetch from MySQL)
        $courses = [
            ['id'=>1,'name'=>'Python for Beginners','category'=>'Programming','duration'=>'8 weeks','level'=>'Beginner','rating'=>4.8],
            ['id'=>2,'name'=>'Advanced JavaScript','category'=>'Web Dev','duration'=>'10 weeks','level'=>'Advanced','rating'=>4.9],
            ['id'=>3,'name'=>'MySQL Database Design','category'=>'Database','duration'=>'6 weeks','level'=>'Intermediate','rating'=>4.7],
            ['id'=>4,'name'=>'PHP Web Development','category'=>'Backend','duration'=>'12 weeks','level'=>'Intermediate','rating'=>4.6],
            ['id'=>5,'name'=>'React Frontend Mastery','category'=>'Web Dev','duration'=>'10 weeks','level'=>'Advanced','rating'=>4.9],
            ['id'=>6,'name'=>'Data Science with Python','category'=>'Data','duration'=>'14 weeks','level'=>'Intermediate','rating'=>4.8],
            ['id'=>7,'name'=>'Web Design Fundamentals','category'=>'Design','duration'=>'6 weeks','level'=>'Beginner','rating'=>4.5],
            ['id'=>8,'name'=>'Node.js Backend Dev','category'=>'Backend','duration'=>'8 weeks','level'=>'Intermediate','rating'=>4.7],
        ];

        // Filter using $_GET keyword
        $results = array_filter($courses, function($c) use ($keyword) {
            return stripos($c['name'], $keyword) !== false ||
                   stripos($c['category'], $keyword) !== false;
        });
        $results = array_values($results);
        $count = count($results);
    ?>
    <div class="results-section">
        <div class="results-header">
            <div class="results-label">
                <span class="label-tag">Results for:</span>
                <span class="keyword-display">"<?php echo $keyword; ?>"</span>
            </div>
            <span class="result-count"><?php echo $count; ?> course<?php echo $count !== 1 ? 's' : ''; ?> found</span>
        </div>

        <?php if ($count === 0): ?>
        <div class="no-results card">
            <div class="nr-icon">🔍</div>
            <h3>No courses found for "<?php echo $keyword; ?>"</h3>
            <p>Try a different keyword like Python, PHP, or JavaScript.</p>
        </div>
        <?php else: ?>
        <div class="courses-grid">
            <?php foreach ($results as $course): ?>
            <div class="course-card">
                <div class="cc-header">
                    <span class="cc-cat"><?php echo $course['category']; ?></span>
                    <span class="cc-rating">⭐ <?php echo $course['rating']; ?></span>
                </div>
                <h3 class="cc-name"><?php echo $course['name']; ?></h3>
                <div class="cc-meta">
                    <span>⏱ <?php echo $course['duration']; ?></span>
                    <span class="cc-level <?php echo strtolower($course['level']); ?>"><?php echo $course['level']; ?></span>
                </div>
                <button class="btn btn-enroll">Enroll Now →</button>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
    <?php } ?>
</div>
</body>
</html>
