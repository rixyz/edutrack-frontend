import { Button, Card } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Clock, Edit, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { CourseModal } from "../../components/CourseModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { ErrorState, LoadingGrid } from "../../components/LoadingAndError";
import { deleteCourse, fetchCourses } from "../../services/academic.service";
import { Course } from "../../types";

import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

const CourseCard = ({
  course,
  onEdit,
  onDelete,
}: {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Link to={`/teacher/course/${course.id}/lessons`} className="block h-full">
    <Card className="flex flex-col h-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col h-full p-5">
        <div className="flex-grow space-y-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 capitalize">
            {course.title}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 capitalize">
            {course.subject_data.name}
          </div>
          <div className="w-16 h-0.5 bg-blue-500 mt-3"></div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-2 text-purple-500" />
              <span>Lessons: {course.lesson_list.length}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {course.description}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button
            variant="subtle"
            size="sm"
            color="blue"
            onClick={(e) => {
              e.preventDefault();
              onEdit();
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="subtle"
            size="sm"
            color="red"
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  </Link>
);

const TeacherCourses = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const {
    isPending,
    isError,
    data: response,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchCourses("teacher"),
  });

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error while fetching Courses"
        message={error.message}
        error={error}
        variant="full"
      />
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Manage Courses"
          action={
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Course
            </Button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {response?.data.map((course: Course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => {
                setSelectedCourse(course);
                setEditModalOpen(true);
              }}
              onDelete={() => {
                setSelectedCourse(course);
                setDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>

        <CourseModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          mode="create"
        />
        <CourseModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedCourse(null);
          }}
          initialData={selectedCourse}
          mode="edit"
        />

        {selectedCourse && (
          <DeleteConfirmationModal
            isOpen={deleteDialogOpen}
            onClose={() => {
              setDeleteDialogOpen(false);
              setSelectedCourse(null);
            }}
            title="Delete Courses"
            entityName="Courses"
            deleteFn={deleteCourse}
            queryKey={["courses"]}
            itemId={selectedCourse.id}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherCourses;
