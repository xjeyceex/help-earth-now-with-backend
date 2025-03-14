import CanvassForm from "@/components/CanvassForm";

const ticketData = {
  ticketId: "78b3c1a5-5d6c-4a7f-90e7-b8a53f16c9d1",
  ticketItemName: "Dell XPS 15 Laptop",
  ticketItemDescription:
    "High-performance laptop with Intel Core i7, 16GB RAM, and 512GB SSD.",
  ticketQuantity: 2,
  ticketSpecification:
    "Intel Core i7-12700H, 16GB DDR5 RAM, 512GB NVMe SSD, 15.6-inch FHD Display",
  ticketNotes:
    "Urgent request for software development team. Requires approval before purchase.",
  ticketReviewer: [
    {
      user_id: "a4af9b6c-1240-46be-9d0f-10471fd70f65",
      user_full_name: "John Doe",
      user_email: "johndoe@example.com",
    },
  ],
};

export default function Home() {
  return (
    <main>
      <CanvassForm ticketData={ticketData} />
    </main>
  );
}
