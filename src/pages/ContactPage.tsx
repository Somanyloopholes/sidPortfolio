import React from "react";
import ContactCard from "../Components/ContactCard";

export default function ContactPage(): React.JSX.Element {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center p-4">
      <ContactCard />
    </section>
  );
}
