import React, { useEffect } from "react";
import ContactCard from "../Components/ContactCard";

export default function ContactPage(): React.JSX.Element {
  useEffect(() => {
    document.title = "Contact | Sid Geddam";
  }, []);

  return (
    <section className="flex flex-1 w-full items-center justify-center p-4 pb-24 md:pb-32">
      <h1 className="sr-only">Contact</h1>
      <ContactCard />
    </section>
  );
}
