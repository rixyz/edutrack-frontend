/**
 * PageHeader Component
 * A reusable component to render page headers with optional actions.
 *
 * @param {string} title - The title of the page.
 * @param {React.ReactNode} action - Optional action element (e.g., a button) to display on the right.
 */
const PageHeader = ({
  title,
  action,
}: {
  title: string;
  action?: false | JSX.Element;
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
