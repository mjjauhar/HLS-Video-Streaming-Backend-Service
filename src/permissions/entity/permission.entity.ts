export enum Permission {
  //ADMIN
  MANAGE_USERS = 'manage_users',
  MANAGE_COURSES = 'manage_courses',
  MANAGE_CATEGORIES = 'manage_categories',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_PAYMENTS = 'manage_payments',
  MANAGE_REPORTS = 'manage_reports',
  MANAGE_SETTINGS = 'manage_settings',
  MANAGE_CONTENT = 'manage_content',
  //STUDENT
  ACCESS_CONTENT = 'access_content',
  ENROLL_COURSES = 'enroll_courses',
  SUBMIT_ASSIGNMENTS = 'submit_assignments',
  VIEW_PROGRESS = 'view_progress',
  VIEW_ENROLLMENTS = 'view_enrollments',
  //FACULTY
  CREATE_COURSES = 'create_courses',
  VIEW_REPORTS = 'view_reports',
  VIEW_EARNINGS = 'view_earnings',
}
