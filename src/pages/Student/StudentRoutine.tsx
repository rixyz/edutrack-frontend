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
    date: "2024-02-02T09:00:00+05:45",
    location: "Hall A",
  },
  {
    subjectName: "Database System",
    subjectCode: "CDS300",
    date: "2024-02-02T11:00:00+05:45",
    location: "Hall B",
  },
  {
    subjectName: "Human Computer Interaction",
    subjectCode: "CHC401",
    date: "2024-02-02T14:00:00+05:45",
    location: "Hall C",
  },
  {
    subjectName: "Operating Systems",
    subjectCode: "COS305",
    date: "2024-02-02T15:30:00+05:45",
    location: "Room 201",
  },
  {
    subjectName: "Information Literacy And Research Skills",
    subjectCode: "UCS105",
    date: "2024-02-02T17:00:00+05:45",
    location: "Lab 1",
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
    
    if (now > examDateTime) {
      return "Completed";
    } else if (now.toDateString() === examDateTime.toDateString()) {
      return "Today";
    } else {
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
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
      case "Today":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "Upcoming":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
    }
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
                  return (
                    <tr
                      key={exam.subjectCode + index}
                      className={`${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-700/50"
                      } hover:bg-gray-100 dark:hover:bg-gray-600`}
                    >
                      <td className="px-6 py-4">{exam.subjectName}</td>
                      <td className="px-6 py-4">{exam.subjectCode}</td>
                      <td className="px-6 py-4">{date}</td>
                      <td className="px-6 py-4">{time}</td>
                      <td className="px-6 py-4">{exam.location}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
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