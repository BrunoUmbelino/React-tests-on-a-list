import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Posts from "./Post";

const mockPosts = [
  {
    userId: 1,
    id: 1,
    title:
      "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  },
  {
    userId: 1,
    id: 2,
    title: "qui est esse",
    body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
  },
  {
    userId: 1,
    id: 3,
    title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
  },
];

const mockNewPost = {
  userId: 2,
  id: 11,
  title: "et ea vero quia laudantium autem",
  body: "delectus reiciendis molestiae occaecati non minima eveniet qui voluptatibus\naccusamus in eum beatae sit\nvel qui neque voluptates ut commodi qui incidunt\nut animi commodi",
};

describe("Posts", () => {
  beforeEach(() => {
    global.fetch = jest.fn((_, options) => {
      if (options?.method === "POST") {
        return Promise.resolve({
          json: () => Promise.resolve(mockNewPost),
        });
      } else {
        return Promise.resolve({
          json: () => Promise.resolve(mockPosts),
        });
      }
    });
  });

  test("fetch and render posts", async () => {
    render(<Posts />);

    await waitFor(() =>
      mockPosts.forEach((post) =>
        expect(screen.getByText(post.title)).toBeInTheDocument()
      )
    );
  });

  test("click on cancel should hide the form and reset input to default value", async () => {
    render(<Posts />);

    await waitFor(() =>
      fireEvent.click(screen.getByRole("button", { name: "Add New Post" }))
    );

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "New Post Title" },
    });
    expect(screen.queryByPlaceholderText("Title").value).toBe("New Post Title");

    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByPlaceholderText("Title")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Add New Post"));
    expect(screen.queryByPlaceholderText("Title").value).toBe("");
  });

  test("create and render a new post and submit a form", async () => {
    render(<Posts />);

    // Open the form
    await waitFor(() => fireEvent.click(screen.getByText("Add New Post")));

    const titleInputEl = screen.getByPlaceholderText("Title");
    const bodyTextareaEl = screen.getByPlaceholderText("Body");
    const submitBtnEl = screen.getByRole("button", { name: "Submit" });

    expect(titleInputEl.value).toBe("");
    expect(bodyTextareaEl.value).toBe("");
    expect(submitBtnEl).toBeInTheDocument();

    // Start typing
    fireEvent.change(titleInputEl, {
      target: { value: mockNewPost.title },
    });
    fireEvent.change(bodyTextareaEl, {
      target: { value: mockNewPost.body },
    });

    // Submit the form
    await waitFor(() => fireEvent.click(submitBtnEl));

    // Form should be hidden
    expect(titleInputEl).not.toBeInTheDocument();
    expect(bodyTextareaEl).not.toBeInTheDocument();

    // New post is displayed
    expect(screen.getByText(mockNewPost.title)).toBeInTheDocument();
    expect(
      screen.getByText(/et ea vero quia laudantium autem/)
    ).toBeInTheDocument();
  });
});
