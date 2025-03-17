import ErrorView from "@/components/ErrorView";

export const metadata = {
  title: "Error | Internal Server Error",
  description: "Internal server error",
};

const Error500 = () => {
  return (
    <ErrorView
      statusCode={500}
      errorTitle="Internal Server Error"
      errorDescription="Sorry, something went wrong on our end. Please try again later or contact our support team for assistance."
    />
  );
};

export default Error500;
