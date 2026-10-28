type Props = {
  as?: "h1" | "h2" | "h3";
  text: string;
  muted?: string;
  className?: string;
  mutedClassName?: string;
};

/** Лид-заголовок: тёмная часть + продолжение серым. */
export function LeadHeading({ as: Tag = "h2", text, muted, className = "", mutedClassName = "text-muted-2" }: Props) {
  return (
    <Tag className={`m-0 text-pretty ${className}`}>
      {text}
      {muted ? (
        <>
          {" "}
          <span className={mutedClassName}>{muted}</span>
        </>
      ) : null}
    </Tag>
  );
}
