import ErrorView from "@/components/ErrorView";

export const metadata = {
  title: "Error | Page Not Found",
  description: "Page not found",
};

const NotFound = () => {
  return (
    <ErrorView
      statusCode={404}
      errorTitle="Page Not Found"
      errorDescription="Sorry, we can't find the page you're looking for. Please check the URL or try again."
    />
  );
};

export default NotFound;
