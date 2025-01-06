import {
  Badge,
  Card,
  Group,
  Input,
  MultiSelect,
  Pagination,
  Select,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Book, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorState, LoadingGrid } from "../../components/LoadingAndError";
import PageHeader from "../../components/PageHeader";
import { fetchCourses } from "../../services/academic.service";
import { API_URL } from "../../services/api";
import { Course } from "../../types";

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      className="w-full transition-all duration-200 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 border"
    >
      <div className="space-y-4">
        <Link to={`/student/course/${course.id}/lessons`} className="block">
          <Text
            size="lg"
            className="line-clamp-2 hover:text-blue-600 dark:text-gray-200 transition-colors duration-200"
          >
            {course.title}
          </Text>
        </Link>

        <Group>
          <Badge
            color="blue"
            variant="light"
            className="dark:bg-blue-900 dark:text-blue-100"
          >
            {course.subject_data.name}
          </Badge>
        </Group>

        <Group className="justify-start gap-6">
          <Badge
            variant="outline"
            className="dark:border-gray-600 dark:text-gray-300"
          >
            {course.type}
          </Badge>
          <Group className="gap-1">
            <Book size={16} className="text-gray-600 dark:text-gray-400" />
            <Text size="sm" className="text-gray-600 dark:text-gray-400">
              {course.lessons} Lessons
            </Text>
          </Group>

          <Group className="gap-1">
            <Clock size={16} className="text-gray-600 dark:text-gray-400" />
            <Text size="sm" className="text-gray-600 dark:text-gray-400">
              {course.duration}
            </Text>
          </Group>
        </Group>

        <Group className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <img
            src={`http://${API_URL}${course.teacher.user.profile_picture}`}
            className="w-5 h-5 rounded-full"
          />
          <Text size="sm" className="text-gray-600 dark:text-gray-400">
            {course.teacher.user.first_name} {course.teacher.user.last_name}
          </Text>
        </Group>
      </div>
    </Card>
  );
};

const FeaturedCourses = () => {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const {
    isPending,
    isError,
    data: response,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchCourses("student"),
  });

  const uniqueSubjects = isPending
    ? []
    : Array.from(new Set(response?.data.map((course) => course.subject_data.name)));

  const uniqueTags = isPending
    ? []
    : Array.from(new Set(response?.data.map((course) => course.type)));

  const uniqueSkillLevels = ["Beginner", "Intermediate", "Advanced"];

  const filteredCourses = isPending
    ? []
    : response?.data.filter(
        (course) =>
          course.title.toLowerCase().includes(search.toLowerCase()) &&
          (!subjectFilter || course.subject_data.name === subjectFilter) &&
          (!tagFilter.length || tagFilter.includes(course.type)) &&
          (!skillLevel || true)
      ) || [];

  const paginatedCourses = filteredCourses.slice((page - 1) * 6, page * 6);

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (isError) {
    return (
      <ErrorState
        title={
          isAxiosError(error) && error.response?.data.error
            ? error.response?.data.error
            : "Error while fetching Courses"
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

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Courses List" />

        <Card className="bg-gray-100 dark:bg-gray-800 mb-6">
          <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
            <div className="min-w-[200px] flex-1">
              <Text className="mb-2 text-sm dark:text-gray-300">
                Search Courses
              </Text>
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                classNames={{
                  input:
                    "dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400",
                  wrapper: "dark:bg-gray-700",
                }}
              />
            </div>

            <div className="min-w-[200px] flex-1">
              <Text className="mb-2 text-sm dark:text-gray-300">Subjects</Text>
              <Select
                placeholder="Select Subject"
                data={uniqueSubjects}
                value={subjectFilter}
                onChange={setSubjectFilter}
                clearable
                classNames={{
                  input:
                    "dark:bg-gray-700 dark:text-white dark:border-gray-600",
                  dropdown:
                    "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100",
                  wrapper: "dark:bg-gray-700",
                }}
              />
            </div>

            <div className="min-w-[200px] flex-1">
              <Text className="mb-2 text-sm dark:text-gray-300">Type</Text>
              <MultiSelect
                data={uniqueTags}
                value={tagFilter}
                onChange={setTagFilter}
                placeholder="Select types..."
                clearable
                classNames={{
                  input:
                    "dark:bg-gray-700 dark:text-white dark:border-gray-600",
                  dropdown:
                    "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100",
                  wrapper: "dark:bg-gray-700",
                }}
              />
            </div>

            <div className="min-w-[200px] flex-1">
              <Text className="mb-2 text-sm dark:text-gray-300">
                Skill Level
              </Text>
              <Select
                placeholder="Select Skill Level"
                data={uniqueSkillLevels}
                value={skillLevel}
                onChange={setSkillLevel}
                clearable
                classNames={{
                  input:
                    "dark:bg-gray-700 dark:text-white dark:border-gray-600",
                  dropdown:
                    "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100",
                  wrapper: "dark:bg-gray-700",
                }}
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Pagination
            total={Math.ceil(filteredCourses.length / 6)}
            value={page}
            onChange={setPage}
            classNames={{
              control:
                "dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600",
              dots: "dark:text-gray-400",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourses;
