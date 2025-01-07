import { Card, Grid, Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Book,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { ErrorState, LoadingGrid } from "../../components/LoadingAndError";
import PageHeader from "../../components/PageHeader";
import { getStudentPredictionList } from "../../services/evaluations.service";

const StudentPerformanceDashboard: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<{
    [key: string]: { [studentName: string]: boolean };
  }>({});

  const {
    data: response,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["studentPerformance"],
    queryFn: getStudentPredictionList,
  });

  const performanceData = response?.data;
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
      if (val > 90) return "text-green-600 bg-green-100";
      if (val > 80) return "text-yellow-600 bg-yellow-100";
      return "text-red-600 bg-red-100";
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

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error while fetching Student list"
        message={error.message}
        error={error}
        variant="full"
      />
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Student Performance" />
        <Grid gutter="xl">
          {performanceData &&
            Object.entries(performanceData).map(([subjectName, students]) => (
              <Grid.Col key={subjectName} span={12}>
                <Card
                  shadow="md"
                  padding="lg"
                  radius="lg"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4 space-x-3">
                    <Book size={28} className="text-blue-600" />
                    <Text
                      fw={700}
                      size="xl"
                      className="text-gray-900 dark:text-gray-100"
                    >
                      {subjectName}
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
                        <Table.Th className="w-10"></Table.Th>
                        <Table.Th>Student</Table.Th>
                        <Table.Th>Batch</Table.Th>
                        <Table.Th>Predicted Score</Table.Th>
                        <Table.Th>Current Average</Table.Th>
                        <Table.Th>Attendance</Table.Th>
                        <Table.Th>Assignment Completion</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {students.map((student) => {
                        const isRowExpanded =
                          expandedRows[subjectName]?.[student.name] || false;

                        return (
                          <React.Fragment key={student.id}>
                            <Table.Tr
                              className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer dark:bg-gray-900"
                              onClick={() =>
                                toggleStudentRowExpansion(
                                  subjectName,
                                  student.name
                                )
                              }
                            >
                              <Table.Td>
                                {isRowExpanded ? (
                                  <ChevronDown
                                    size={16}
                                    className="text-blue-600"
                                  />
                                ) : (
                                  <ChevronRight
                                    size={16}
                                    className="text-gray-400"
                                  />
                                )}
                              </Table.Td>
                              <Table.Td className="font-medium">
                                {student.name}
                              </Table.Td>
                              <Table.Td>{student.batch}</Table.Td>
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
                                  value={
                                    student.performance_metrics.attendance_rate
                                  }
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
                                  colSpan={7}
                                  className="bg-gray-50 dark:bg-gray-900"
                                >
                                  <div className="grid grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                                    <div className="col-span-1 space-y-3">
                                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                                        <h3 className="font-bold mb-2 text-blue-800  dark:text-blue-300 flex items-center">
                                          <TrendingUp className="mr-2 text-blue-600" />
                                          Attendance Impact
                                        </h3>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                          {
                                            student.predictions
                                              .attendance_impact.description
                                          }
                                        </p>
                                        <div className="mt-2 flex items-center">
                                          <CheckCircle className="mr-2 text-green-500" />
                                          <span>
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
                                          <TrendingUp className="mr-2 text-green-600" />
                                          Improvement Potential
                                        </h3>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                          Potential Improvement:{" "}
                                          {student.predictions.improvement_potential.potential_improvement.toFixed(
                                            1
                                          )}
                                          %
                                        </p>
                                        {student.predictions
                                          .improvement_potential.recommendations
                                          .length > 0 && (
                                          <ul className="list-disc pl-4 mt-2 text-sm text-gray-700 dark:text-gray-300">
                                            {student.predictions.improvement_potential.recommendations.map(
                                              (rec, index) => (
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
                                      <div className="g-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                                        <h3 className="font-bold mb-2 text-purple-800 dark:text-purple-300 flex items-center">
                                          <AlertTriangle className="mr-2 text-purple-600" />
                                          Confidence Level
                                        </h3>
                                        <div className="space-y-2">
                                          {student.predictions.confidence_level.factors.map(
                                            (factor, index) => (
                                              <div
                                                key={index}
                                                className={`p-2 rounded text-sm ${
                                                  factor.level === "High"
                                                    ? "bg-green-100 text-green-800"
                                                    : factor.level === "Medium"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
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
                  </Table>
                </Card>
              </Grid.Col>
            ))}
        </Grid>
      </div>
    </div>
  );
};

export default StudentPerformanceDashboard;
