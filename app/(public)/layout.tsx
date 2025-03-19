type PublicLayoutProps = {
  children: React.ReactNode;
};

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <main>
      {children}
      {/* Footer */}
    </main>
  );
};
export default PublicLayout;
