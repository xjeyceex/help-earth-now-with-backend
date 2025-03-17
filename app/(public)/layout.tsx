type PublicLayoutProps = {
  children: React.ReactNode;
};

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return <main>{children}</main>;
};
export default PublicLayout;
