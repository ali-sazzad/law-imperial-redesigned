"use client";

/** Link to the contact form that first tells the form what the visitor was looking at. */
export function LeadLink({
  event,
  detail,
  className,
  children,
}: {
  event: "lead-type" | "lead-topic";
  detail: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href="#contact" onClick={() => window.dispatchEvent(new CustomEvent(event, { detail }))} className={className}>
      {children}
    </a>
  );
}
