import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RequestError } from "@/components/feedback/request-error";

describe("RequestError", () => {
  it("announces the error and retries when requested", () => {
    const onRetry = vi.fn();

    render(<RequestError onRetry={onRetry}>Falha de conexão.</RequestError>);

    expect(screen.getByRole("alert")).toHaveTextContent("Falha de conexão.");
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
