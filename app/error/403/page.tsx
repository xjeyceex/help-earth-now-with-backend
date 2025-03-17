import ErrorView from "@/components/ErrorView";

export const metadata = {
  title: "Error | Access Forbidden",
  description: "Access Forbidden",
};

const Error403 = () => {
  return (
    <ErrorView
      statusCode={403}
      errorTitle="Access Forbidden"
      errorDescription="Sorry, you don't have permission to access this resource. Please contact your administrator if you believe this is a mistake."
    />
  );
};

export default Error403;
