"use client";

import { useUserStore } from "@/stores/userStore";

const PurchaserPage = () => {
  const { user } = useUserStore();

  return (
    <div>
      PurchaserPage
      {JSON.stringify(user)}
    </div>
  );
};
export default PurchaserPage;
