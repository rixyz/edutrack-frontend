import { Card, Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BarChart2,
  Book,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { ErrorState, LoadingGrid } from "../../components/LoadingAndError";
import { API_URL } from "../../services/api";
import { getStudentPredictionList } from "../../services/evaluations.service";
import { getUserDetails } from "../../services/user.service";
import { ConfidenceFactor, ImprovementRecommendation } from "../../types";

const ProfileCard = () => {
  const {
    data: userData,
    isPending: userDataLoading,
    error: userDataError,
  } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getUserDetails,
  });

  if (userDataLoading)
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <Text className="dark:text-white">Loading user data...</Text>
      </div>
    );

  if (userDataError)
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <Text className="dark:text-white">Error</Text>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-all">
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src="https://static.vecteezy.com/system/resources/previews/002/012/024/non_2x/abstract-background-with-dynamic-effect-modern-pattern-suitable-for-wallpaper-banner-background-card-book-illustration-landing-page-gift-cover-flyer-report-bussiness-social-media-free-vector.jpg"
          alt="Profile Image"
        />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <img
            className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover"
            src={`http://${API_URL}${userData.user.profile_picture}`}
            alt="Profile Image"
          />
        </div>
      </div>
      <div className="pt-14 pb-6 px-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {userData.user.first_name} {userData?.user.last_name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Teacher
        </p>
        <div className="flex justify-center space-x-2 mb-4">
          <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-xs">
            Web
          </span>
          <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-xs">
            UI/UX
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">
            Design
          </span>
        </div>
      </div>
    </div>
  );
};

const RecentActivities = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Recent Activities
      </h3>
      <Calendar className="text-violet-600 dark:text-violet-400" />
    </div>
    <div className="space-y-4">
      {[
        {
          icon: <FileText className="text-blue-500" size={20} />,
          title: "Assignment Graded",
          description: "CS101 Midterm Exam Scores Published",
        },
        {
          icon: <Users className="text-green-500" size={20} />,
          title: "New Student Added",
          description: "Emily Johnson joined MATH202",
        },
        {
          icon: <MessageSquare className="text-purple-500" size={20} />,
          title: "New Discussion",
          description: "PHYS301 Group Discussion Started",
        },
      ].map((activity, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
        >
          {activity.icon}
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              {activity.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activity.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PerformanceOverview = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Performance Overview
      </h3>
      <BarChart2 className="text-violet-600 dark:text-violet-400" />
    </div>
    <div className="space-y-4">
      {[
        {
          title: "Avg. Class Performance",
          value: "78%",
          icon: <TrendingUp className="text-green-500" size={20} />,
          trend: "up",
        },
        {
          title: "Avg. Attendance",
          value: "85%",
          icon: <Clock className="text-blue-500" size={20} />,
          trend: "up",
        },
      ].map((stat, index) => (
        <div
          key={index}
          className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-4">
            {stat.icon}
            <span className="text-gray-800 dark:text-gray-200">
              {stat.title}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {stat.value}
            </span>
            {stat.trend === "up" ? (
              <span className="text-green-500 text-sm">▲</span>
            ) : (
              <span className="text-red-500 text-sm">▼</span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StudentPerformanceDashboard: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<{
    [key: string]: { [studentName: string]: boolean };
  }>({});

  const scoreThreshold = 93;

  const {
    data: response,
    isPending: performanceDataLoading,
    error: performanceDataError,
  } = useQuery({
    queryKey: ["studentPerformance"],
    queryFn: getStudentPredictionList,
  });

  const performanceData = response?.data;

  const statistics = useMemo(() => {
    if (!performanceData) return { totalStudents: 0, atRiskStudents: 0 };

    let totalStudents = 0;
    let atRiskStudents = 0;

    Object.values(performanceData).forEach((students) => {
      const studentArray = Object.values(students);
      totalStudents += studentArray.length;
      atRiskStudents += studentArray.filter(
        (student) =>
          student.predictions.predicted_score_range.predicted_score <
          scoreThreshold
      ).length;
    });

    return { totalStudents, atRiskStudents };
  }, [performanceData, scoreThreshold]);

  const toggleStudentRowExpansion = (
    subjectName: string,
    studentName: string
  ) => {
    setExpandedRows((prev) => ({
      ...prev,
      [subjectName]: {
        ...prev[subjectName],
        [studentName]: !prev[subjectName]?.[studentName],
      },
    }));
  };

  const PerformanceIndicator = ({ value }: { value: number }) => {
    const getPerformanceColor = (val: number) => {
      if (val > 90)
        return "text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900";
      if (val > 80)
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900";
      return "text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900";
    };

    return (
      <div className="flex items-center space-x-2">
        <div
          className={`px-2 py-1 rounded-full font-semibold text-xs ${getPerformanceColor(
            value
          )}`}
        >
          {value.toFixed(1)}%
        </div>
      </div>
    );
  };

  if (performanceDataLoading) {
    return <LoadingGrid />;
  }

  if (performanceDataError) {
    return (
      <ErrorState
        title="Error while fetching Student Performance"
        message={(performanceDataError as Error).message}
        variant="full"
      />
    );
  }

  return (
    <Card
      shadow="md"
      padding="lg"
      radius="lg"
      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center mb-4 space-x-3">
        <Book size={28} className="text-blue-600 dark:text-blue-400" />
        <Text fw={700} size="xl" className="text-red-900 dark:text-red-200">
          Students Requiring Immediate Intervention
        </Text>
      </div>

      <Table
        highlightOnHover
        withRowBorders={false}
        withTableBorder={false}
        striped
        className="rounded-lg overflow-hidden"
      >
        <Table.Thead className="bg-blue-50 dark:bg-gray-600">
          <Table.Tr>
            <Table.Th className="w-10 dark:text-gray-300"></Table.Th>
            <Table.Th className="dark:text-gray-300">Student</Table.Th>
            <Table.Th className="dark:text-gray-300">Subject</Table.Th>
            <Table.Th className="dark:text-gray-300">Batch</Table.Th>
            <Table.Th className="dark:text-gray-300">Predicted Score</Table.Th>
            <Table.Th className="dark:text-gray-300">Current Average</Table.Th>
            <Table.Th className="dark:text-gray-300">Attendance</Table.Th>
            <Table.Th className="dark:text-gray-300">
              Assignment Completion
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        {performanceData &&
          Object.entries(performanceData).map(([subjectName, students]) => (
            <Table.Tbody key={subjectName} className="dark:bg-gray-800">
              {Object.values(students)
                .filter(
                  (student) =>
                    student.predictions.predicted_score_range.predicted_score <
                    scoreThreshold
                )
                .map((student) => {
                  const isRowExpanded =
                    expandedRows[subjectName]?.[student.name] || false;

                  return (
                    <React.Fragment key={student.id}>
                      <Table.Tr
                        className="hover:bg-blue-50 dark:bg-gray-700 cursor-pointer group"
                        onClick={() =>
                          toggleStudentRowExpansion(subjectName, student.name)
                        }
                      >
                        <Table.Td>
                          {isRowExpanded ? (
                            <ChevronDown
                              size={16}
                              className="text-blue-600 dark:text-blue-400"
                            />
                          ) : (
                            <ChevronRight
                              size={16}
                              className="text-gray-400 dark:text-gray-600"
                            />
                          )}
                        </Table.Td>
                        <Table.Td className="font-medium dark:text-gray-300">
                          {student.name}
                        </Table.Td>
                        <Table.Td className="dark:text-gray-300">
                          {subjectName}
                        </Table.Td>
                        <Table.Td className="dark:text-gray-300">
                          {student.batch}
                        </Table.Td>
                        <Table.Td>
                          <PerformanceIndicator
                            value={
                              student.predictions.predicted_score_range
                                .predicted_score
                            }
                          />
                        </Table.Td>
                        <Table.Td>
                          <PerformanceIndicator
                            value={student.predictions.current_average}
                          />
                        </Table.Td>
                        <Table.Td>
                          <PerformanceIndicator
                            value={student.performance_metrics.attendance_rate}
                          />
                        </Table.Td>
                        <Table.Td>
                          <PerformanceIndicator
                            value={
                              student.performance_metrics
                                .assignment_completion_rate
                            }
                          />
                        </Table.Td>
                      </Table.Tr>

                      {isRowExpanded && (
                        <Table.Tr>
                          <Table.Td
                            colSpan={8}
                            className="bg-gray-50 dark:bg-gray-900"
                          >
                            <div className="grid grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="col-span-1 space-y-3">
                                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                                  <h3 className="font-bold mb-2 text-blue-800 dark:text-blue-300 flex items-center">
                                    <TrendingUp className="mr-2 text-blue-600 dark:text-blue-400" />
                                    Attendance Impact
                                  </h3>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {
                                      student.predictions.attendance_impact
                                        .description
                                    }
                                  </p>
                                  <div className="mt-2 flex items-center">
                                    <CheckCircle className="mr-2 text-green-500 dark:text-green-400" />
                                    <span className="dark:text-gray-300">
                                      Rate:{" "}
                                      {student.performance_metrics.attendance_rate.toFixed(
                                        1
                                      )}
                                      %
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="col-span-1 space-y-3">
                                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                                  <h3 className="font-bold mb-2 text-green-800 dark:text-green-300 flex items-center">
                                    <TrendingUp className="mr-2 text-green-600 dark:text-green-400" />
                                    Improvement Potential
                                  </h3>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Potential Improvement:{" "}
                                    {student.predictions.improvement_potential.potential_improvement.toFixed(
                                      1
                                    )}
                                    %
                                  </p>
                                  {student.predictions.improvement_potential
                                    .recommendations.length > 0 && (
                                    <ul className="list-disc pl-4 mt-2 text-sm text-gray-700 dark:text-gray-300">
                                      {student.predictions.improvement_potential.recommendations.map(
                                        (
                                          rec: ImprovementRecommendation,
                                          index: number
                                        ) => (
                                          <li key={index}>
                                            {rec.recommendation} (Impact:{" "}
                                            {rec.impact})
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                                </div>
                              </div>

                              <div className="col-span-1 space-y-3">
                                <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                                  <h3 className="font-bold mb-2 text-purple-800 dark:text-purple-300 flex items-center">
                                    <AlertTriangle className="mr-2 text-purple-600 dark:text-purple-400" />
                                    Confidence Level
                                  </h3>
                                  <div className="space-y-2">
                                    {student.predictions.confidence_level.factors.map(
                                      (
                                        factor: ConfidenceFactor,
                                        index: number
                                      ) => (
                                        <div
                                          key={index}
                                          className={`p-2 rounded text-sm ${
                                            factor.level === "High"
                                              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                              : factor.level === "Medium"
                                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                                              : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                                          }`}
                                        >
                                          <strong>
                                            {factor.level} Confidence:
                                          </strong>{" "}
                                          {factor.reason}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </React.Fragment>
                  );
                })}
            </Table.Tbody>
          ))}
      </Table>
      <div className="mt-6 text-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <div className="flex justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <Users className="text-gray-600 dark:text-gray-400" />
            <span className="text-gray-800 dark:text-gray-200">
              Total Student Counter:{" "}
              <span className="font-bold">{statistics.totalStudents}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-red-500 dark:text-red-400" />
            <span className="text-gray-800 dark:text-gray-200">
              At-Risk Student Counter:{" "}
              <span className="font-bold text-red-600 dark:text-red-400">
                {statistics.atRiskStudents}
              </span>
              {statistics.totalStudents > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  (
                  {(
                    (statistics.atRiskStudents / statistics.totalStudents) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const TeacherDashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <ProfileCard />
          </div>
          <RecentActivities />
          <PerformanceOverview />
        </div>

        <StudentPerformanceDashboard />
      </div>
    </div>
  );
};

export default TeacherDashboard;
