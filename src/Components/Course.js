import React, { useEffect, useState } from "react";
import facade from "../apiFacade";
import "../App.css";

const CourseRow = ({ course }) => {
  return (
    <tr>
      <td> {course.courseName} </td>
      <td> {course.description} </td>
      <Semesters items={course.schoolclasses} />
    </tr>
  );
};

const Semesters = ({ items }) => {
  const semester = items.map(item => item.semester);
  return <td>{semester.join(", ")}</td>;
};

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const getCourse = async () => {
      try {
        const data = await facade.getCourses();
        setCourses(data);
        setFetching(true);
      } catch (error) {
        alert("UPSSS " + error);
      }
    };
    getCourse();
  }, []);

  const tableItemsCourse = courses.map((course, id) => (
    <CourseRow key={id} course={course} />
  ));

  const CourseTable = () => {
    return fetching ? (
      <table id="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Semester</th>
          </tr>
        </thead>
        <tbody>{tableItemsCourse}</tbody>
      </table>
    ) : (
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    );
  };
  return (
    <div>
      <h2>Courses</h2>
      <p>
        Here you see the the courses the school offers, and on which semester
        they are avaliable
      </p>
      <br></br>
      <CourseTable />
    </div>
  );
}
