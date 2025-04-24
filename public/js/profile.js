function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.getElementById('preview');
    output.src = reader.result;
    output.style.display = 'block';
  };
  reader.readAsDataURL(event.target.files[0]);
}

function toggleEditForm() {
  const editForm = document.getElementById('editForm');
  const passwordForm = document.getElementById('changePasswordForm');
  const editBtn = document.getElementById('toggleEditBtn');

  // Hide password form if open
  passwordForm.style.display = 'none';
  document.getElementById('togglePasswordBtn').textContent = 'Change Password';

  if (editForm.style.display === 'none' || editForm.style.display === '') {
    editForm.style.display = 'block';
    editBtn.textContent = 'Hide Edit Form';
  } else {
    editForm.style.display = 'none';
    editBtn.textContent = 'Edit Profile';
  }
}

function togglePasswordForm() {
  const passwordForm = document.getElementById('changePasswordForm');
  const editForm = document.getElementById('editForm');
  const passwordBtn = document.getElementById('togglePasswordBtn');

  // Hide edit form if open
  editForm.style.display = 'none';
  document.getElementById('toggleEditBtn').textContent = 'Edit Profile';

  if (passwordForm.style.display === 'none' || passwordForm.style.display === '') {
    passwordForm.style.display = 'block';
    passwordBtn.textContent = 'Hide Password Form';
  } else {
    passwordForm.style.display = 'none';
    passwordBtn.textContent = 'Change Password';
  }
}