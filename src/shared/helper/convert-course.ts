export function convertCourse(course) {
  const { _id, title, description, thumbnail, price } = course;

  const { faculty } = course;
  const {
    _id: facultyId,
    user_id: { username: facultyName },
  } = faculty;

  return {
    _id,
    title,
    description,
    thumbnail,
    price,
    faculty: {
      _id: facultyId,
      name: facultyName,
    },
  };
}

export function convertSingleCourse(
  course,
  validFacultyCoures,
  facultyAverageRating,
  totalRatings,
  averageRating,
  enrolledStudents,
  purchased,
  wishlisted,
) {
  return {
    // offer_price: course.offer_price,
    _id: course._id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    faculty: {
      _id: course.faculty._id,
      name: course.faculty.user_id.username,
      // expertise: course.faculty.expertise.name,
      faculty_students: course.faculty.students.length,
      // faculty_number_of_courses: validFacultyCoures.length,
      faculty_number_of_rating: course.faculty.ratings.length,
      faculty_average_rating: facultyAverageRating,
    },
    topic: course.topic,
    price: course.price,
    // video: course.sections[0]?.lectures[0]?.video,
    video: course.sections[0]?.lectures[0],
    // students: course.students,
    ratings: course.ratings,
    status: course.status,
    created_at: course.created_at,
    updated_at: course.updated_at,
    ip_address: course.ip_address,
    total_rating: totalRatings,
    average_rating: averageRating,
    enrolled_students: enrolledStudents,
    purchased: purchased ? true : false,
    wishlisted: wishlisted ? true : false,
  };
}

export function convertCourseForFaculty(course) {
  const { _id, title, description, thumbnail, price } = course;

  const { faculty } = course;
  const {
    _id: facultyId,
    user_id: { username: facultyName },
  } = faculty;

  return {
    _id,
    title,
    description,
    thumbnail,
    price,
    faculty: {
      _id: facultyId,
      name: facultyName,
    },
    enrolled_students: course.students.length,
  };
}
