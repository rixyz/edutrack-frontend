import { useState } from "react";
import PageHeader from "../../components/PageHeader";

interface ExamRecord {
  subjectName: string;
  subjectCode: string;
  date: string;
  location: string;
}

type SortKey = keyof ExamRecord;

interface SortConfig {
  key: SortKey;
  direction: "asc" | "desc";
}

const examData: ExamRecord[] = [
  {
    subjectName: "Object Oriented Programming",
    subjectCode: "CCP313",
    date: "2025-02-02T09:00:00+05:45",
    location: "Room 201",
  },
  {
    subjectName: "Database System",
    subjectCode: "CDS300",
    date: "2025-02-02T09:00:00+05:45",
    location: "Room 202",
  },
  {
    subjectName: "Human Computer Interaction",
    subjectCode: "CHC401",
    date: "2025-02-02T09:00:00+05:45",
    location: "Room 203",
  },
  {
    subjectName: "Operating Systems",
    subjectCode: "COS305",
    date: `${new Date()}`,
    location: "Room 204",
  },
  {
    subjectName: "Information Literacy And Research Skills",
    subjectCode: "UCS105",
    date: "2024-02-02T17:00:00+05:45",
    location: "Training Hall",
  }
];

const StudentRoutine: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "asc",
  });

  const [data, setData] = useState<ExamRecord[]>([...examData]);

  const getExamStatus = (examDate: string) => {
    const now = new Date();
    const examDateTime = new Date(examDate);
    if (now.toLocaleDateString() === examDateTime.toLocaleDateString()) {
      return "Today";
    }
    else if (now > examDateTime) {
      return "Completed";
    }  else {
      return "Upcoming";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })
    };
  };

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-600 dark:text-gray-400",
          ring: "ring-gray-500/30 dark:ring-gray-400/30",
          hover: "hover:bg-gray-200 dark:hover:bg-gray-700"
        };
      case "Today":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          text: "text-yellow-700 dark:text-yellow-500",
          ring: "ring-yellow-500/30 dark:ring-yellow-400/30",
          hover: "hover:bg-yellow-200 dark:hover:bg-yellow-900/40"
        };
      case "Upcoming":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-700 dark:text-green-500",
          ring: "ring-green-500/30 dark:ring-green-400/30",
          hover: "hover:bg-green-200 dark:hover:bg-green-900/40"
        };
      default:
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-700 dark:text-blue-500",
          ring: "ring-blue-500/30 dark:ring-blue-400/30",
          hover: "hover:bg-blue-200 dark:hover:bg-blue-900/40"
        };
    }
  };

  const getRowStyles = (status: string) => {
    const colors = getStatusColor(status);
    return `transition-colors duration-200 ${colors.hover}`;
  };

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Examination Routine" />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th
                    className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("subjectName")}
                  >
                    Subject Name{getSortIndicator("subjectName")}
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("subjectCode")}
                  >
                    Course Code{getSortIndicator("subjectCode")}
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("date")}
                  >
                    Date{getSortIndicator("date")}
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("date")}
                  >
                    Time{getSortIndicator("date")}
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("location")}
                  >
                    Location{getSortIndicator("location")}
                  </th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((exam, index) => {
                  const status = getExamStatus(exam.date);
                  const { date, time } = formatDateTime(exam.date);
                  const colors = getStatusColor(status);
                  return (
                    <tr
                      key={exam.subjectCode + index}
                      className={getRowStyles(status)}
                    >
                      <td className="px-6 py-4">{exam.subjectName}</td>
                      <td className="px-6 py-4">{exam.subjectCode}</td>
                      <td className="px-6 py-4">{date}</td>
                      <td className="px-6 py-4">{time}</td>
                      <td className="px-6 py-4">{exam.location}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ring-1 ring-inset ${colors.bg} ${colors.text} ${colors.ring}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRoutine;