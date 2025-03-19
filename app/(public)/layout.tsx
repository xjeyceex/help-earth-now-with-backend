type PublicLayoutProps = {
  children: React.ReactNode;
};

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <main>
      {/* Navbar */}
      {children}
      {/* Footer */}
    </main>
  );
};
export default PublicLayout;
