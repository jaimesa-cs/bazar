import Container from "@components/ui/container";

interface DefaultErrorProps {
  error: Error | null;
}
export default function DefaultError({ error }: DefaultErrorProps) {
  return (
    <Container>
      <div style={{ padding: "10px", margin: 10, color: "#FF7777", border: "1px solid", borderRadius: "10px" }}>
        <h3>{JSON.stringify(error)}</h3>
      </div>
    </Container>
  );
}
