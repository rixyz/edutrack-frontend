import { Button, Card, Modal, NumberInput, TextInput } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowLeft,
  Bold,
  ChevronDown,
  Edit,
  Heading,
  Italic,
  List,
  ListOrdered,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState, LoadingGrid } from "../../components/LoadingAndError";
import {
  createLesson,
  deleteLesson,
  fetchCourseDetails,
  updateLesson,
} from "../../services/academic.service";
import { showError, showSuccess } from "../../services/notification.service";
import { Lesson } from "../../types";

interface SafeHTMLProps {
  html: string;
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const SafeHTML: React.FC<SafeHTMLProps> = ({ html }) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md dark:border-gray-700">
      <div className="border-b dark:border-gray-700 p-2 flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${
            editor.isActive("bold")
              ? "bg-gray-200 dark:bg-gray-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${
            editor.isActive("italic")
              ? "bg-gray-200 dark:bg-gray-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${
            editor.isActive("bulletList")
              ? "bg-gray-200 dark:bg-gray-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${
            editor.isActive("orderedList")
              ? "bg-gray-200 dark:bg-gray-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200 dark:bg-gray-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Heading className="w-4 h-4" />
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="p-4 min-h-[200px] prose dark:prose-invert max-w-none"
      />
    </div>
  );
};

const LessonModal = ({
  isOpen,
  onClose,
  courseId,
  initialData = null,
  mode = "create",
  currentOrder = 0,
}: {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  initialData?: Lesson | null;
  mode?: "create" | "edit";
  currentOrder?: number;
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    duration_minutes: initialData?.duration_minutes || 30,
    order: initialData?.order || currentOrder + 1,
    course: courseId,
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<Lesson>) => {
      return mode === "create"
        ? createLesson(data)
        : updateLesson(initialData!.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      onClose();
      showSuccess(
        `Lesson ${mode === "create" ? "created" : "edited"} successfully!`
      );
    },
    onError: (error) => {
      console.error(`Failed to ${mode} lesson:`, error);
      showError(`${error}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={`${mode === "create" ? "Add" : "Edit"} Lesson`}
      centered
      size="lg"
      classNames={{
        header:
          "dark:bg-gray-800 dark:text-white border-b dark:border-gray-700",
        body: "dark:bg-gray-800",
        close: "dark:text-gray-400 dark:hover:text-white",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 dark:bg-gray-800 dark:text-gray-100"
      >
        <TextInput
          label="Lesson Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter lesson title"
          classNames={{
            input: "dark:bg-gray-700 dark:text-white dark:border-gray-600",
            label: "dark:text-gray-200",
          }}
        />

        <div>
          <label className="block mb-2 dark:text-gray-200">
            Lesson Content
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(newContent: string) =>
              setFormData({ ...formData, content: newContent })
            }
          />
        </div>

        <NumberInput
          label="Duration (minutes)"
          required
          min={1}
          value={formData.duration_minutes}
          onChange={(value) =>
            setFormData({
              ...formData,
              duration_minutes: typeof value === "number" ? value : 30,
            })
          }
          placeholder="Enter duration in minutes"
          classNames={{
            input: "dark:bg-gray-700 dark:text-white dark:border-gray-600",
            label: "dark:text-gray-200",
            control: "dark:border-gray-600 dark:hover:bg-gray-600",
          }}
        />

        <NumberInput
          label="Order"
          required
          min={1}
          value={formData.order}
          onChange={(value) =>
            setFormData({
              ...formData,
              order: typeof value === "number" ? value : currentOrder + 1,
            })
          }
          placeholder="Enter lesson order"
          classNames={{
            input: "dark:bg-gray-700 dark:text-white dark:border-gray-600",
            label: "dark:text-gray-200",
            control: "dark:border-gray-600 dark:hover:bg-gray-600",
          }}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="subtle"
            onClick={onClose}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={mutation.isPending}
            className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
          >
            {mutation.isPending ? "Saving..." : "Save Lesson"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const TeacherCourseLessons = () => {
  const { courseID } = useParams<{ courseID: string }>();
  const courseId = parseInt(courseID || "0", 10);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [expandedLesson, setExpandedLesson] = useState<number | null>(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const {
    data: response,
    isPending,
    error,
  } = useQuery({
    queryKey: ["course"],
    queryFn: () => fetchCourseDetails(courseId),
  });

  const courseData = response?.data;

  const deleteMutation = useMutation({
    mutationFn: (lessonId: number) => deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      setDeleteDialogOpen(false);
      setSelectedLesson(null);
    },
  });

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error while fetching Lessons"
        message={error.message}
        error={error}
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
                onClick={() => navigate("/teacher/course")}
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
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lesson
          </Button>
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
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLesson(lesson);
                        setEditModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="subtle"
                      size="sm"
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLesson(lesson);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <LessonModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          courseId={Number(courseId)}
          mode="create"
          currentOrder={courseData?.lesson_list.length || 0}
        />

        <LessonModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedLesson(null);
          }}
          courseId={Number(courseId)}
          initialData={selectedLesson}
          mode="edit"
        />

        <Modal
          opened={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedLesson(null);
          }}
          title="Delete Lesson"
          centered
        >
          <p>
            Are you sure you want to delete this lesson? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="subtle"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedLesson(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              loading={deleteMutation.isPending}
              onClick={() =>
                selectedLesson && deleteMutation.mutate(selectedLesson.id)
              }
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TeacherCourseLessons;
