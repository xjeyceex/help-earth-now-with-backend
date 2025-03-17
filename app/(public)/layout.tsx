import Navbar from "@/components/Navbar";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
};
export default PublicLayout;
