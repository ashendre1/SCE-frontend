import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { getCourses, getCourseData } from "../ApiService/apiService";
import GradeDistribution from "../Graphs/GradeDistribution";
import StudentProgression from "../Graphs/NotProgressingGraph";
import CustomGraph from "../Graphs/CustomGraph";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [GDGraphData, setGDGraphData] = useState([]);
  const [notProgressing, setNotProgressing] = useState([]);
  const [customGraphData, setCustomGraphData] = useState([]);
  const [selectedH, setSelectedH] = useState("50"); // State for H value
  const [selectedL, setSelectedL] = useState("75"); // State for L value
  const [selectedGhost, setSelectedGhost] = useState("ghost_h50_l75"); // Combined ghost value
  const [selectedLost, setSelectedLost] = useState("lost_version1");
  const [collapsedSections, setCollapsedSections] = useState({
    jets: true,
    ghosts: true,
    lost: true,
    shocked: true,
    assignmentCategories: true,
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getCourses();
        console.log("Data: ", response);
        setData(response);

        const courses = response.course_list;
        setCourseList(courses);
        console.log("Courses:", courses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  const handleCourseClick = async (course) => {
    setSelectedCourse(course);
    console.log("Selected course:", course);
    try {
      const response = await getCourseData(course);
      console.log("Response:", response.courseData);
      const grades = [
        { label: "A", value: response.courseData.grade_A },
        { label: "B", value: response.courseData.grade_B },
        { label: "C", value: response.courseData.grade_C },
        { label: "D", value: response.courseData.grade_D },
        { label: "F", value: response.courseData.grade_F },
        { label: "W", value: response.courseData.grade_W },
      ];
      console.log("Grades:", grades);
      setGDGraphData(grades);

      const notProgressing = [
        { label: "Not Progressing", value: response.courseData.notProgressing },
        { label: "Progressing", value: 1 - response.courseData.notProgressing },
      ];
      setNotProgressing(notProgressing);
      console.log("Not progressing:", notProgressing);

      const customData = [
        { label: "Ghost", value: response.courseData[selectedGhost] },
        { label: "Lost", value: response.courseData[selectedLost] },
        { label: "Shocked", value: response.courseData.shocked },
        { label: "Jets/W", value: response.courseData.jet_w },
      ];
      console.log("Custom Graph Data:", customData);
      setCustomGraphData(customData);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const handleHChange = (event) => {
    const newH = event.target.value;
    setSelectedH(newH);
    setSelectedGhost(`ghost_h${newH}_l${selectedL}`); // Update ghost format dynamically
  };

  const handleLChange = (event) => {
    const newL = event.target.value;
    setSelectedL(newL);
    setSelectedGhost(`ghost_h${selectedH}_l${newL}`); // Update ghost format dynamically
  };

  const handleLostChange = (event) => {
    setSelectedLost(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedCourse) {
      try {
        const response = await getCourseData(selectedCourse);
        const customData = [
          { label: "Ghost", value: response.courseData[selectedGhost] },
          { label: "Lost", value: response.courseData[selectedLost] },
          { label: "Shocked", value: response.courseData.shocked },
          { label: "Jet/W", value: response.courseData.jet_w },
        ];
        console.log("Custom Graph Data:", customData);
        setCustomGraphData(customData);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    }
  };

  const toggleSection = (section) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <ul>
          {courseList.map((course, index) => (
            <li
              key={index}
              onClick={() => handleCourseClick(course)}
              className={selectedCourse === course ? "selected" : ""}
            >
              {course}
            </li>
          ))}
        </ul>
      </aside>
      <main className="main-content">
        {!selectedCourse ? (
          <h1>Select from the courses listed to view analysis</h1>
        ) : (
          <div>
            <h1>Analysis for {selectedCourse}</h1>
            <h2>Grade distribution</h2>
            <GradeDistribution data={GDGraphData} />
            <h2>Student Progression</h2>
            <StudentProgression data={notProgressing} />
            <h2>Student Learning Personas</h2>
            <div className="student-persona-info">
              <h3
                onClick={() => toggleSection("jets")}
                style={{ cursor: "pointer" }}
              >
                <span>Jets (Withdrawn)</span>
                <span>{collapsedSections.jets ? "▼" : "▲"}</span>
              </h3>
              {!collapsedSections.jets && (
                <p>
                  These students officially withdrew from the course before its
                  completion.
                </p>
              )}

              <h3
                onClick={() => toggleSection("ghosts")}
                style={{ cursor: "pointer" }}
              >
                <span>Ghosts</span>
                <span> {collapsedSections.ghosts ? "▼" : "▲"} </span>
              </h3>
              {!collapsedSections.ghosts && (
                <p>
                  These students remained enrolled in the course but did not
                  engage meaningfully. Select the percentage of high stakes and
                  low stakes assignments in the dropdown to get customized
                  graphs.
                </p>
              )}

              <h3
                onClick={() => toggleSection("lost")}
                style={{ cursor: "pointer" }}
              >
                <span>Lost</span>
                <span>{collapsedSections.lost ? "▼" : "▲"} </span>
              </h3>
              {!collapsedSections.lost && (
                <>
                  <p>
                    These students consistently underperformed across both small
                    and large assignments:
                  </p>
                  <ul>
                    <li>
                      <strong>Version 1:</strong> The student's{" "}
                      <strong>average score</strong> in both{" "}
                      <strong>low-stakes</strong> and{" "}
                      <strong>high-stakes</strong> assignments is{" "}
                      <strong>below 70%</strong>.
                    </li>
                    <li>
                      <strong>Version 2:</strong> The student's{" "}
                      <strong>low-stakes average is below 70%</strong>, and they
                      scored <strong>below 70%</strong> on both of the{" "}
                      <strong>two highest-weighted assignments</strong>.
                    </li>
                    <li>
                      <strong>Version 3:</strong> The student's{" "}
                      <strong>low-stakes average is below 70%</strong>, and they
                      scored <strong>below 70%</strong> on at least one of the{" "}
                      <strong>two highest-weighted assignments</strong>.
                    </li>
                  </ul>
                </>
              )}

              <h3
                onClick={() => toggleSection("shocked")}
                style={{ cursor: "pointer" }}
              >
                <span>Shocked </span>
                <span>{collapsedSections.shocked ? "▼" : "▲"} </span>
              </h3>
              {!collapsedSections.shocked && (
                <>
                  <p>
                    These students performed well on day-to-day tasks but
                    faltered when it came to major assessments. A student is
                    considered <strong>Shocked</strong> if:
                  </p>
                  <ul>
                    <li>
                      Their <strong>low-stakes average is 70% or higher</strong>
                      , but
                    </li>
                    <li>
                      They scored <strong>below 70%</strong> on{" "}
                      <strong>at least one</strong> of the{" "}
                      <strong>two highest-weighted assignments</strong>.
                    </li>
                  </ul>
                </>
              )}

              <h3
                onClick={() => toggleSection("assignmentCategories")}
                style={{ cursor: "pointer" }}
              >
                <span>Assignment Categories </span>
                <span>
                  {collapsedSections.assignmentCategories ? "▼" : "▲"}{" "}
                </span>
              </h3>
              {!collapsedSections.assignmentCategories && (
                <>
                  <h4>Low-Stakes Assignments</h4>
                  <p>
                    These are assessments that contribute <strong>less</strong>{" "}
                    to the final grade. They are determined by calculating the{" "}
                    <strong>median assignment weight</strong>. Any assignment
                    with a weight <strong>at or below the median</strong> is
                    considered <strong>low-stakes</strong>.
                  </p>

                  <h4>High-Stakes Assignments</h4>
                  <p>
                    These are <strong>heavily weighted assessments</strong>,
                    such as midterms, finals, or major projects. An assignment
                    is classified as <strong>high-stakes</strong> if its weight
                    is <strong>above the median</strong> in the course's grading
                    scheme.
                  </p>
                </>
              )}
            </div>
            <div className="custom-graph-controls">
              <label>
                Select High:
                <select value={selectedH} onChange={handleHChange}>
                  <option value="50">50</option>
                  <option value="25">25</option>
                  <option value="10">10</option>
                </select>
              </label>
              <label>
                Select Low:
                <select value={selectedL} onChange={handleLChange}>
                  <option value="75">75</option>
                  <option value="60">60</option>
                  <option value="50">50</option>
                  <option value="25">25</option>
                  <option value="10">10</option>
                </select>
              </label>
              <label>
                Select Lost:
                <select value={selectedLost} onChange={handleLostChange}>
                  <option value="lost_version1">Lost Version 1</option>
                  <option value="lost_version2">Lost Version 2</option>
                  <option value="lost_version3">Lost Version 3</option>
                </select>
              </label>
              <button className="generate-graphs-button" onClick={handleSubmit}>
                Generate Graph
              </button>
            </div>
            <CustomGraph data={customGraphData} />
            <h3> Once you've identified your struggling students, click  
            <a href="https://sites.google.com/charlotte.edu/sce-initiative/strategies" target="_blank" rel="noopener noreferrer"> here </a> 
             for possible ways to support them </h3>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
