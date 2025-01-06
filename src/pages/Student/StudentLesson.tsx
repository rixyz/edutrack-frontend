import { Button, Card } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState, LoadingGrid } from "../../components/LoadingAndError";
import {
  fetchCourseDetails,
} from "../../services/academic.service";
import { Lesson } from "../../types";


interface SafeHTMLProps {
  html: string;
}

const SafeHTML: React.FC<SafeHTMLProps> = ({ html }) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};


const StudentCourseLessons = () => {
  const { courseID } = useParams<{ courseID: string }>();
  const courseId = parseInt(courseID || "0", 10);
  const navigate = useNavigate();

  const [expandedLesson, setExpandedLesson] = useState<number | null>(0);

  const {
    data: response,
    isPending,
    error,
  } = useQuery({
    queryKey: ["course"],
    queryFn: () => fetchCourseDetails(courseId),
  });

  const courseData = response?.data;

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error while fetching Lessons"
        message={(error as Error).message}
        variant="full"
      />
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center space-x-4">
              <Button
                variant="subtle"
                onClick={() => navigate("/student/course")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
              {courseData?.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {courseData?.description}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {courseData?.lesson_list.map((lesson: Lesson, index: number) => (
            <Card key={lesson.id} className="bg-white dark:bg-gray-800">
              <div
                className="cursor-pointer p-4"
                onClick={() =>
                  setExpandedLesson(expandedLesson === index ? null : index)
                }
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Lesson {lesson.order}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {lesson.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {lesson.duration_minutes} min
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transform transition-transform text-gray-500 ${
                        expandedLesson === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
              {expandedLesson === index && (
                <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700">
                  <div className="prose dark:prose-invert max-w-none dark:text-gray-100 py-4 ">
                    <SafeHTML html={lesson.content} />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StudentCourseLessons;
