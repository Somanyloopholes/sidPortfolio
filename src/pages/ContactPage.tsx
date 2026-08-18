import React from "react";
import ContactCard from "../Components/ContactCard";

export default function ContactPage(): React.JSX.Element {
  return (
    <section className="flex flex-1 w-full items-center justify-center p-4 pb-24 md:pb-32">
      <ContactCard />
    </section>
  );
}
