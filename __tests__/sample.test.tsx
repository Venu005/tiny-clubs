import { render } from "@testing-library/react-native";
import { Text, View } from "react-native";

function SampleHarness() {
  return (
    <View>
      <Text testID="sample-harness">tiny-clubs test harness</Text>
    </View>
  );
}

describe("sample harness", () => {
  it("renders with React Native Testing Library", async () => {
    const { getByTestId } = await render(<SampleHarness />);

    expect(getByTestId("sample-harness")).toHaveTextContent(
      "tiny-clubs test harness"
    );
  });
});
