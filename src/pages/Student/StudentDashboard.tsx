import { Card, Grid, Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import {
  BarChart2,
  Book,
  ChevronDown,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { ErrorState, LoadingGrid } from "../../components/LoadingAndError";
import { AuthService } from "../../services/auth.service";
import { getStudentPrediction } from "../../services/evaluations.service";
import { SubjectPrediction } from "../../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceIndicatorProps {
  value: number;
}

const PerformanceIndicator: React.FC<PerformanceIndicatorProps> = ({
  value,
}) => {
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

interface PerformanceDashboardProps {
  subjectData: Record<string, SubjectPrediction>;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  subjectData,
}) => {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const toggleSubjectExpansion = (subjectName: string) => {
    setExpandedSubject(expandedSubject === subjectName ? null : subjectName);
  };

  const subjectNames = Object.values(subjectData).map((subject) =>
    subject.subject_name.length > 15
      ? `${subject.subject_name.substring(0, 15)}...`
      : subject.subject_name
  );

  const attendanceChartData = {
    labels: subjectNames,
    datasets: [
      {
        label: "Attendance Rate",
        data: Object.values(subjectData).map(
          (subject) => subject.attendance_impact.rate
        ),
        backgroundColor: Object.values(subjectData).map((subject) =>
          subject.attendance_impact.rate > 90
            ? "rgba(34, 197, 94, 0.7)"
            : subject.attendance_impact.rate > 80
            ? "rgba(234, 179, 8, 0.7)"
            : "rgba(244, 63, 94, 0.7)"
        ),
        borderColor: Object.values(subjectData).map((subject) =>
          subject.attendance_impact.rate > 90
            ? "rgba(34, 197, 94, 1)"
            : subject.attendance_impact.rate > 80
            ? "rgba(234, 179, 8, 1)"
            : "rgba(244, 63, 94, 1)"
        ),
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const attendanceChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Attendance Rate (%)",
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const gpaChartData = {
    labels: subjectNames,
    datasets: [
      {
        label: "Current Average",
        data: Object.values(subjectData).map(
          (subject) => subject.current_average
        ),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Predicted Score",
        data: Object.values(subjectData).map(
          (subject) => subject.predicted_score_range.predicted_score
        ),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const gpaChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-gray-50">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6}}>
          <Card
            shadow="md"
            padding="lg"
            radius="lg"
            withBorder
            className="bg-white border-gray-200 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <BarChart2 size={24} className="mr-2 text-green-600" />
              <Text fw={600} size="lg" className="text-gray-800">
                Subject Attendance
              </Text>
            </div>
            <Bar data={attendanceChartData} options={attendanceChartOptions} />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6}}>
          <Card
            shadow="md"
            padding="lg"
            radius="lg"
            withBorder
            className="bg-white border-gray-200 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <TrendingUp size={24} className="mr-2 text-blue-600" />
              <Text fw={600} size="lg" className="text-gray-800">
                Subject Performance
              </Text>
            </div>
            <Line data={gpaChartData} options={gpaChartOptions} />
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card
            shadow="md"
            padding="lg"
            radius="lg"
            withBorder
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 overflow-auto"
          >
            <div className="flex items-center mb-4">
              <Book size={24} className="mr-2 text-blue-600" />
              <Text
                fw={700}
                size="xl"
                className="text-gray-900 dark:text-gray-200"
              >
                Subject Performance
              </Text>
            </div>
            <Table
              highlightOnHover
              withRowBorders={false}
              withTableBorder={false}
              striped
              className="rounded-lg overflow-hidden"
            >
              <Table.Thead className="bg-blue-50 dark:bg-gray-700">
                <Table.Tr>
                  <Table.Th className="w-10 dark:text-gray-300" />
                  <Table.Th className="text-gray-700 dark:text-gray-300 font-bold">
                    Subject
                  </Table.Th>
                  <Table.Th className="text-gray-700 dark:text-gray-300 font-bold">
                    Current Average
                  </Table.Th>
                  <Table.Th className="text-gray-700 dark:text-gray-300 font-bold">
                    Attendance
                  </Table.Th>
                  <Table.Th className="text-gray-700 dark:text-gray-300 font-bold">
                    Assignment Completion
                  </Table.Th>
                  <Table.Th className="text-gray-700 dark:text-gray-300 font-bold">
                    Predicted Score
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody className="dark:bg-gray-800">
                {Object.values(subjectData).map((subject) => (
                  <React.Fragment key={subject.subject_id}>
                    <Table.Tr
                      className="hover:bg-blue-50 dark:bg-gray-700 cursor-pointer group"
                      onClick={() =>
                        toggleSubjectExpansion(subject.subject_name)
                      }
                    >
                      <Table.Td>
                        {expandedSubject === subject.subject_name ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </Table.Td>
                      <Table.Td>{subject.subject_name}</Table.Td>
                      <Table.Td>
                        <PerformanceIndicator value={subject.current_average} />
                      </Table.Td>
                      <Table.Td>
                        <div className="flex items-center">
                          <PerformanceIndicator
                            value={subject.attendance_impact.rate}
                          />
                          <span
                            className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                              subject.attendance_impact.impact === "Positive"
                                ? "bg-green-100 text-green-800"
                                : subject.attendance_impact.impact === "Neutral"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {subject.attendance_impact.impact}
                          </span>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <PerformanceIndicator
                          value={subject.assignment_completion}
                        />
                      </Table.Td>
                      <Table.Td>
                        <div className="flex flex-col">
                          <span>
                            {subject.predicted_score_range.predicted_score.toFixed(
                              1
                            )}
                          </span>
                          <span className="text-xs text-gray-500">
                            (
                            {subject.predicted_score_range.range.lower.toFixed(
                              1
                            )}{" "}
                            -{" "}
                            {subject.predicted_score_range.range.upper.toFixed(
                              1
                            )}
                            )
                          </span>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                    {expandedSubject === subject.subject_name && (
                      <Table.Tr>
                        <Table.Td colSpan={6}>
                          <div className="p-4 bg-blue-50 rounded-lg grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-bold mb-2 text-blue-800">
                                Attendance Impact
                              </h3>
                              <p className="text-sm text-gray-700">
                                {subject.attendance_impact.description}
                              </p>
                            </div>
                            <div>
                              <h3 className="font-bold mb-2 text-blue-800">
                                Improvement Potential
                              </h3>
                              <p className="text-sm text-gray-700">
                                Potential Improvement:{" "}
                                {subject.improvement_potential.potential_improvement.toFixed(
                                  1
                                )}
                                %
                              </p>
                              {subject.improvement_potential.recommendations
                                .length > 0 && (
                                <ul className="list-disc pl-4 mt-2">
                                  {subject.improvement_potential.recommendations.map(
                                    (rec, index) => (
                                      <li
                                        key={index}
                                        className="text-sm text-gray-700"
                                      >
                                        {rec.recommendation} (Impact:{" "}
                                        {rec.impact})
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            </div>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </React.Fragment>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  const studentId = AuthService.getCurrentUserId();

  const {
    data: response,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["studentPerformance"],
    queryFn: () => getStudentPrediction(studentId),
  });

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (isError) {
    return (
      <ErrorState
        title={
          isAxiosError(error) && error.response?.data.error
            ? error.response?.data.error
            : "Error while fetching Student Information"
        }
        message={
          isAxiosError(error) && error.response?.data.message
            ? error.response?.data.message
            : error.message
        }
        variant="full"
      />
    );
  }

  return response?.data ? (
    <PerformanceDashboard subjectData={response.data} />
  ) : null;
};

export default StudentDashboard;
