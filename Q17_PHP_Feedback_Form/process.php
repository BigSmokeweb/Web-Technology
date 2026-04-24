<?php
// ── PHP Feedback Form Processor ──────────────────────────────
$submitted = false;
$errors = [];
$feedback_data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_feedback'])) {
    $name     = trim($_POST['name']     ?? '');
    $email    = trim($_POST['email']    ?? '');
    $rating   = intval($_POST['rating'] ?? 0);
    $message  = trim($_POST['message']  ?? '');

    // Validation
    if (strlen($name) < 2) $errors[] = 'Name must be at least 2 characters.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Enter a valid email address.';
    if ($rating < 1 || $rating > 5) $errors[] = 'Please select a rating.';
    if (strlen($message) < 10) $errors[] = 'Feedback message must be at least 10 characters.';

    if (empty($errors)) {
        // Store feedback temporarily in a text file (simple storage)
        $feedback_data = [
            'name'    => htmlspecialchars($name),
            'email'   => htmlspecialchars($email),
            'rating'  => $rating,
            'message' => htmlspecialchars($message),
            'time'    => date('d M Y, h:i A')
        ];

        // Append to feedbacks.txt file
        $line = date('Y-m-d H:i:s') . " | $name | $email | Rating:$rating | $message\n";
        file_put_contents('feedbacks.txt', $line, FILE_APPEND | LOCK_EX);
        $submitted = true;
    }
}

// Load stored feedbacks for display
$stored = [];
if (file_exists('feedbacks.txt')) {
    $lines = array_filter(file('feedbacks.txt', FILE_IGNORE_NEW_LINES));
    foreach (array_slice(array_reverse($lines), 0, 5) as $line) {
        $parts = explode(' | ', $line, 5);
        if (count($parts) === 5) {
            $stored[] = ['time'=>$parts[0],'name'=>$parts[1],'email'=>$parts[2],'rating'=>$parts[3],'message'=>$parts[4]];
        }
    }
}
?>

<?php if ($submitted): ?>
<!-- Confirmation Screen -->
<div class="confirm-card">
    <div class="confirm-icon">✅</div>
    <h2>Thank You, <?= $feedback_data['name'] ?>!</h2>
    <p class="confirm-sub">Your feedback has been received and stored successfully.</p>
    <div class="confirm-details">
        <div class="cd-row"><span>📧 Email</span><strong><?= $feedback_data['email'] ?></strong></div>
        <div class="cd-row"><span>⭐ Rating</span><strong><?= str_repeat('★', $feedback_data['rating']) ?><?= str_repeat('☆', 5 - $feedback_data['rating']) ?></strong></div>
        <div class="cd-row"><span>💬 Message</span><em>"<?= $feedback_data['message'] ?>"</em></div>
        <div class="cd-row"><span>🕐 Submitted</span><strong><?= $feedback_data['time'] ?></strong></div>
    </div>
    <a href="index.php" class="btn-back-link">← Submit Another Feedback</a>
</div>

<?php else: ?>
<!-- Feedback Form -->
<div class="form-section">
    <div class="form-card">
        <h2>📝 Share Your Feedback</h2>
        <p class="form-sub">Your opinion helps us improve our services</p>

        <?php if (!empty($errors)): ?>
        <div class="alert-error"><?= implode('<br>', array_map('htmlspecialchars', $errors)) ?></div>
        <?php endif; ?>

        <form method="POST">
            <div class="fg"><label>Your Name</label><input type="text" name="name" value="<?= htmlspecialchars($_POST['name'] ?? '') ?>" placeholder="Full name" required /></div>
            <div class="fg"><label>Email Address</label><input type="email" name="email" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" placeholder="you@example.com" required /></div>

            <div class="fg">
                <label>Rating</label>
                <div class="star-rating">
                    <?php for ($i = 5; $i >= 1; $i--): ?>
                    <input type="radio" name="rating" id="star<?=$i?>" value="<?=$i?>" <?= (isset($_POST['rating']) && $_POST['rating']==$i) ? 'checked' : '' ?> />
                    <label for="star<?=$i?>">★</label>
                    <?php endfor; ?>
                </div>
            </div>

            <div class="fg"><label>Feedback Message</label><textarea name="message" rows="5" placeholder="Tell us about your experience..." required><?= htmlspecialchars($_POST['message'] ?? '') ?></textarea></div>
            <button type="submit" name="submit_feedback" class="btn-submit">Submit Feedback 💬</button>
        </form>
    </div>

    <!-- Stored Feedbacks -->
    <?php if (!empty($stored)): ?>
    <div class="stored-section">
        <h3>📋 Recent Feedback (Stored)</h3>
        <?php foreach ($stored as $fb): ?>
        <div class="stored-card">
            <div class="sc-header">
                <strong><?= htmlspecialchars($fb['name']) ?></strong>
                <span class="sc-time"><?= htmlspecialchars($fb['time']) ?></span>
            </div>
            <div class="sc-rating"><?= htmlspecialchars($fb['rating']) ?></div>
            <p class="sc-msg">"<?= htmlspecialchars($fb['message']) ?>"</p>
        </div>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>
</div>
<?php endif; ?>
