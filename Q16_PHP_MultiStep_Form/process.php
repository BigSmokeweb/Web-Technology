<?php
session_start();

// Initialize step
if (!isset($_SESSION['step'])) $_SESSION['step'] = 1;

// Reset
if (isset($_POST['reset'])) {
    session_destroy();
    header('Location: index.php');
    exit;
}

// Process Step 1
if (isset($_POST['step1_submit'])) {
    $errors = [];
    $name  = trim($_POST['name']  ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $dob   = trim($_POST['dob']   ?? '');

    if (strlen($name) < 3)            $errors[] = 'Full name must be at least 3 characters.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Please enter a valid email address.';
    if (!preg_match('/^[6-9]\d{9}$/', $phone)) $errors[] = 'Enter a valid 10-digit Indian mobile number.';
    if (empty($dob))                  $errors[] = 'Date of birth is required.';

    if (empty($errors)) {
        $_SESSION['form']['name']  = htmlspecialchars($name);
        $_SESSION['form']['email'] = htmlspecialchars($email);
        $_SESSION['form']['phone'] = htmlspecialchars($phone);
        $_SESSION['form']['dob']   = $dob;
        $_SESSION['step'] = 2;
    }
}

// Process Step 2
if (isset($_POST['step2_submit'])) {
    $errors = [];
    $address = trim($_POST['address'] ?? '');
    $city    = trim($_POST['city']    ?? '');
    $state   = trim($_POST['state']   ?? '');
    $pincode = trim($_POST['pincode'] ?? '');

    if (strlen($address) < 5)          $errors[] = 'Address must be at least 5 characters.';
    if (empty($city))                  $errors[] = 'City is required.';
    if (empty($state))                 $errors[] = 'State is required.';
    if (!preg_match('/^\d{6}$/', $pincode)) $errors[] = 'Enter a valid 6-digit PIN code.';

    if (empty($errors)) {
        $_SESSION['form']['address'] = htmlspecialchars($address);
        $_SESSION['form']['city']    = htmlspecialchars($city);
        $_SESSION['form']['state']   = htmlspecialchars($state);
        $_SESSION['form']['pincode'] = htmlspecialchars($pincode);
        $_SESSION['step'] = 3;
    }
}

$step = $_SESSION['step'];
$form = $_SESSION['form'] ?? [];
?>

<!-- Step Indicator -->
<div class="steps-indicator">
    <div class="step-dot <?= $step >= 1 ? 'done' : '' ?> <?= $step == 1 ? 'active' : '' ?>">
        <span><?= $step > 1 ? '✓' : '1' ?></span><label>Personal</label>
    </div>
    <div class="step-line <?= $step >= 2 ? 'done' : '' ?>"></div>
    <div class="step-dot <?= $step >= 2 ? 'done' : '' ?> <?= $step == 2 ? 'active' : '' ?>">
        <span><?= $step > 2 ? '✓' : '2' ?></span><label>Address</label>
    </div>
    <div class="step-line <?= $step >= 3 ? 'done' : '' ?>"></div>
    <div class="step-dot <?= $step >= 3 ? 'active' : '' ?>">
        <span>3</span><label>Summary</label>
    </div>
</div>

<!-- STEP 1: Personal Details -->
<?php if ($step === 1): ?>
<div class="form-card">
    <h2>👤 Step 1: Personal Details</h2>
    <?php if (!empty($errors)): ?>
        <div class="alert alert-error"><?= implode('<br>', $errors) ?></div>
    <?php endif; ?>
    <form method="POST">
        <div class="fg"><label>Full Name</label><input type="text" name="name" value="<?= $form['name'] ?? '' ?>" placeholder="Your full name" required /></div>
        <div class="fg"><label>Email Address</label><input type="email" name="email" value="<?= $form['email'] ?? '' ?>" placeholder="you@example.com" required /></div>
        <div class="fg"><label>Phone Number</label><input type="text" name="phone" value="<?= $form['phone'] ?? '' ?>" placeholder="10-digit mobile number" required /></div>
        <div class="fg"><label>Date of Birth</label><input type="date" name="dob" value="<?= $form['dob'] ?? '' ?>" required /></div>
        <button type="submit" name="step1_submit" class="btn-next">Next: Address Details →</button>
    </form>
</div>

<!-- STEP 2: Address Details -->
<?php elseif ($step === 2): ?>
<div class="form-card">
    <h2>🏠 Step 2: Address Details</h2>
    <div class="saved-data">
        <span>👤 <?= $form['name'] ?></span><span>📧 <?= $form['email'] ?></span>
    </div>
    <?php if (!empty($errors)): ?>
        <div class="alert alert-error"><?= implode('<br>', $errors) ?></div>
    <?php endif; ?>
    <form method="POST">
        <div class="fg"><label>Street Address</label><input type="text" name="address" value="<?= $form['address'] ?? '' ?>" placeholder="House No, Street, Area" required /></div>
        <div class="form-row">
            <div class="fg"><label>City</label><input type="text" name="city" value="<?= $form['city'] ?? '' ?>" placeholder="City" required /></div>
            <div class="fg"><label>State</label><input type="text" name="state" value="<?= $form['state'] ?? '' ?>" placeholder="State" required /></div>
        </div>
        <div class="fg"><label>PIN Code</label><input type="text" name="pincode" value="<?= $form['pincode'] ?? '' ?>" placeholder="6-digit PIN" required /></div>
        <div class="btn-row">
            <form method="POST" style="display:inline"><button type="submit" name="reset" class="btn-back">← Back</button></form>
            <button type="submit" name="step2_submit" class="btn-next">Next: Review →</button>
        </div>
    </form>
</div>

<!-- STEP 3: Final Summary -->
<?php elseif ($step === 3): ?>
<div class="form-card summary-card">
    <div class="summary-icon">🎉</div>
    <h2>Registration Complete!</h2>
    <p class="summary-sub">PHP has stored your data across all steps. Here's your summary:</p>

    <div class="summary-section">
        <h3>👤 Personal Details</h3>
        <div class="summary-grid">
            <div class="si"><span>Name</span><strong><?= $form['name'] ?></strong></div>
            <div class="si"><span>Email</span><strong><?= $form['email'] ?></strong></div>
            <div class="si"><span>Phone</span><strong><?= $form['phone'] ?></strong></div>
            <div class="si"><span>Date of Birth</span><strong><?= date('d M Y', strtotime($form['dob'])) ?></strong></div>
        </div>
    </div>
    <div class="summary-section">
        <h3>🏠 Address Details</h3>
        <div class="summary-grid">
            <div class="si"><span>Address</span><strong><?= $form['address'] ?></strong></div>
            <div class="si"><span>City</span><strong><?= $form['city'] ?></strong></div>
            <div class="si"><span>State</span><strong><?= $form['state'] ?></strong></div>
            <div class="si"><span>PIN Code</span><strong><?= $form['pincode'] ?></strong></div>
        </div>
    </div>
    <form method="POST">
        <button type="submit" name="reset" class="btn-next">← Start Over</button>
    </form>
</div>
<?php endif; ?>
