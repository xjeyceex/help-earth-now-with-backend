"use client";

type TicketsLayoutProps = {
  children: React.ReactNode;
};

const TicketsLayout = ({ children }: TicketsLayoutProps) => {
  return <main>{children}</main>;
};
export default TicketsLayout;
