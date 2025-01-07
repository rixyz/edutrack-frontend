import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ErrorState, LoadingGrid } from "../../components/LoadingAndError";
import PageHeader from "../../components/PageHeader";
import { AuthService } from "../../services/auth.service";
import { fetchStudentResult } from "../../services/evaluations.service";
import { SemesterResults, StudentResults } from "../../types";

const calculateSemesterGPA = (subjects: SemesterResults): string => {
  let totalPoints = 0;
  let totalCredits = 0;

  Object.values(subjects).forEach((subject) => {
    totalPoints += subject.GPA * subject.CREDIT_HOUR;
    totalCredits += subject.CREDIT_HOUR;
  });

  return (totalPoints / totalCredits).toFixed(2);
};

const calculateCumulativeGPA = (
  data: StudentResults,
  currentSemester: number
): string => {
  let totalPoints = 0;
  let totalCredits = 0;

  const semesters = Object.keys(data)
    .map(Number)
    .sort((a, b) => a - b);
  const currentSemesterIndex = semesters.indexOf(currentSemester);

  for (let i = 0; i <= currentSemesterIndex; i++) {
    const subjects = data[semesters[i]];
    Object.values(subjects).forEach((subject) => {
      totalPoints += subject.GPA * subject.CREDIT_HOUR;
      totalCredits += subject.CREDIT_HOUR;
    });
  }

  return (totalPoints / totalCredits).toFixed(2);
};

const getGrade = (gpa: number): string => {
  if (gpa >= 3.7) return "A";
  if (gpa >= 3.0) return "B";
  if (gpa >= 2.0) return "C";
  if (gpa >= 1.0) return "D";
  if (gpa == 0) return "Incomplete";
  return "F";
};

const StudentResult: React.FC = () => {
  const studentId = AuthService.getCurrentUserId();

  const {
    data: response,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["studentResult"],
    queryFn: () => fetchStudentResult(studentId),
  });

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error while fetching Results"
        message={error.message}
        error={error}
        variant="full"
      />
    );
  }

  const studentResult = response.data;
  const sortedSemesters = Object.keys(studentResult)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Student Semester Result" />

        <div className="flex-1 overflow-auto">
          <div className="space-y-8">
            {sortedSemesters.map((semester) => {
              const subjects = studentResult[semester];
              const semesterGPA = calculateSemesterGPA(subjects);
              const semesterGrade = getGrade(parseFloat(semesterGPA));
              const cumulativeGPA = calculateCumulativeGPA(
                studentResult,
                semester
              );
              const cumulativeGrade = getGrade(parseFloat(cumulativeGPA));

              return (
                <div
                  key={semester}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                      Semester {semester}
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                          <th className="px-6 py-3 border border-gray-200 dark:border-gray-700">
                            Subject Code
                          </th>
                          <th className="px-6 py-3 border border-gray-200 dark:border-gray-700">
                            Subject Name
                          </th>
                          <th className="px-6 py-3 border border-gray-200 dark:border-gray-700">
                            Credit Hour
                          </th>
                          <th className="px-6 py-3 border border-gray-200 dark:border-gray-700">
                            Grade
                          </th>
                          <th className="px-6 py-3 border border-gray-200 dark:border-gray-700">
                            GPA
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(subjects).map(
                          ([subjectCode, details], index) => (
                            <tr
                              key={subjectCode}
                              className={`${
                                index % 2 === 0
                                  ? "bg-white dark:bg-gray-800"
                                  : "bg-gray-50 dark:bg-gray-700/50"
                              } hover:bg-gray-100 dark:hover:bg-gray-600`}
                            >
                              <td className="px-6 py-4 border border-gray-200 dark:border-gray-700">
                                {details.SUBJECT_CODE}
                              </td>
                              <td className="px-6 py-4 border border-gray-200 dark:border-gray-700">
                                {details.SUBJECT_NAME}
                              </td>
                              <td className="px-6 py-4 border border-gray-200 dark:border-gray-700">
                                {details.CREDIT_HOUR}
                              </td>
                              <td className="px-6 py-4 border border-gray-200 dark:border-gray-700">
                                {getGrade(details.GPA)}
                              </td>
                              <td className="px-6 py-4 border border-gray-200 dark:border-gray-700">
                                {details.GPA}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-gray-700 dark:text-gray-300 space-y-2">
                      <p>
                        <strong>Semester GPA:</strong> {semesterGPA} (Grade:{" "}
                        {semesterGrade})
                      </p>
                      <p>
                        <strong>Cumulative GPA:</strong> {cumulativeGPA} (Grade:{" "}
                        {cumulativeGrade})
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResult;
