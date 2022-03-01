import { render, screen, fireEvent, waitFor, within } from "../../test-utils";
import { FolderChooser } from "../FolderChooser";
import { Tools } from "../Tools.component";

describe("<FolderChooser />", () => {
  it("should open the root folder", async () => {
    render(<FolderChooser />, {
      folderChooserOpened: true,
    });

    const rootFolder = screen.getByRole("list");
    const childList = await waitFor(() => within(rootFolder).getByRole("list"));

    expect(screen.getByRole("listitem", { name: "/" })).toBeInTheDocument();
    expect(screen.getByRole("listitem", { name: "foo" })).toBeInTheDocument();
    expect(screen.getByRole("listitem", { name: "bar" })).toBeInTheDocument();
    expect(childList).toBeInTheDocument();
  });

  it("should open sub folder", async () => {
    render(<FolderChooser />, {
      folderChooserOpened: true,
    });

    const folder = screen.getByRole("listitem", { name: "bar" });
    fireEvent.click(folder);

    const subFolder = await waitFor(() =>
      screen.getByRole("listitem", { name: "babar" })
    );

    expect(subFolder).toBeInTheDocument();
  });

  it("should toggle button", async () => {
    render(<FolderChooser />, {
      folderChooserOpened: true,
    });

    const button = screen.getByRole("button", { name: "See this folder" });

    expect(button).toBeDisabled();

    const folder = screen.getByRole("listitem", { name: "bar" });
    fireEvent.click(folder);

    expect(button).toBeEnabled();
  });

  it("should toggle the modal", async () => {
    render(
      <>
        <FolderChooser />
        <Tools />
      </>
    );

    const openFolderChooserButton = screen.getByRole("button", {
      name: "choose a folder",
    });

    let modal = screen.queryByRole("dialog");

    expect(modal).not.toBeInTheDocument();

    fireEvent.click(openFolderChooserButton);

    modal = await screen.findByRole("dialog");

    expect(modal).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    fireEvent.click(cancelButton);

    expect(modal).not.toBeInTheDocument();
  });
});
