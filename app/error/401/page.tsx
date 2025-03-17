import ErrorView from "@/components/ErrorView";

export const metadata = {
  title: "Error | Unauthorized Access",
  description: "Unauthorized Access",
};

const Error401 = () => {
  return (
    <ErrorView
      statusCode={401}
      errorTitle="Unauthorized Access"
      errorDescription="Sorry, you don't have permission to access this page. Please log in with appropriate credentials or contact the administrator for access."
    />
  );
};

export default Error401;
