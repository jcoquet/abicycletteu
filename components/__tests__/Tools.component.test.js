import { render, screen } from "../../test-utils";
import { Tools } from "../Tools.component";

describe("<Tools />", () => {
  it("renders zoom in/out, folder and expand buttons", () => {
    render(<Tools />);

    const zoomIn = screen.getByRole("button", {
      name: "zoom in",
    });

    const zoomOut = screen.getByRole("button", {
      name: "zoom out",
    });

    const folder = screen.getByRole("button", {
      name: "choose a folder",
    });

    const expand = screen.getByRole("button", {
      name: "see all markers",
    });

    expect(zoomIn).toBeInTheDocument();
    expect(zoomOut).toBeInTheDocument();
    expect(folder).toBeInTheDocument();
    expect(expand).toBeInTheDocument();
  });
});
