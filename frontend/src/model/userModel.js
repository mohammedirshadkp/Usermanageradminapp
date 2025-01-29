class UserModel {
  constructor(user) {
    this.username = user.username || '';
    this.email = user.email || '';
    this.mobile = user.mobile || '';
    this.password = user.password || '';
    this.lastLoginTime = user.lastLoginTime || null; // Add lastLoginTime field
  }

  // Method to update the last login time
  updateLastLoginTime() {
    this.lastLoginTime = new Date().toISOString(); // Set the current time as the last login time
  }
}

export default UserModel;
