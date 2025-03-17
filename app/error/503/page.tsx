import ErrorView from "@/components/ErrorView";

const Error503 = () => {
  return (
    <ErrorView
      statusCode={503}
      errorTitle="Service Unavailable"
      errorDescription="Sorry, our service is temporarily unavailable due to high traffic or scheduled maintenance. Please try again in a few moments. If the problem persists, check our status page for updates."
    />
  );
};

export default Error503;
