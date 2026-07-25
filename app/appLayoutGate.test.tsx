/* eslint-disable import/first */
const mockUseAuth = jest.fn();
const mockUseMutation = jest.fn();
const mockUseQuery = jest.fn();
const mockUsePathname = jest.fn();
const mockRedirect = jest.fn();

jest.mock("@clerk/expo", () => ({
  useAuth: (...args: unknown[]) => mockUseAuth(...args),
}));

jest.mock("convex/react", () => ({
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}));

jest.mock("expo-router", () => ({
  Redirect: (props: { href: string }) => {
    mockRedirect(props.href);
    const { Text } = jest.requireActual("react-native");
    return <Text>{props.href}</Text>;
  },
  Stack: () => null,
  usePathname: () => mockUsePathname(),
}));

import { render } from "@testing-library/react-native";
import AppLayout from "./(app)/_layout";
import { ThemeProvider } from "@/theme";

function renderLayout() {
  return render(
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}

describe("app layout profile gate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
    mockUseMutation.mockReturnValue(jest.fn());
    mockUsePathname.mockReturnValue("/");
  });

  it("keeps authenticated users without a completed username in profile setup", async () => {
    mockUseQuery.mockReturnValue({ isComplete: true, username: null });

    const { findByText } = await renderLayout();

    expect(await findByText("/profile-setup")).toBeTruthy();
    expect(mockRedirect).toHaveBeenCalledWith("/profile-setup");
  });

  it("sends expired app sessions to sign-in with a recoverable reason", async () => {
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false });
    mockUseQuery.mockReturnValue(undefined);

    const { findByText } = await renderLayout();

    expect(await findByText("/sign-in?reason=session-expired")).toBeTruthy();
    expect(mockRedirect).toHaveBeenCalledWith(
      "/sign-in?reason=session-expired"
    );
  });
});
