import { applyDateMask } from "../../utils/dateValidation";

declare const jest: any;

describe("InputDateMask Component & Auto-Formatting Tests (T007 - US1)", () => {
  // Simulates Input's internal formatDate handler
  const createInputHandler = (type: string, onChange: (text: string) => void) => {
    return (text: string) => {
      if (!onChange) return;
      if (type !== "date") return onChange(text);
      const masked = applyDateMask(text);
      onChange(masked);
    };
  };

  it("should format raw consecutive numbers with slashes when type is date", () => {
    const onChangeMock = jest.fn();
    const handleTextChange = createInputHandler("date", onChangeMock);

    handleTextChange("23102026");
    expect(onChangeMock).toHaveBeenCalledWith("23/10/2026");
  });

  it("should strip non-numeric characters from user input", () => {
    const onChangeMock = jest.fn();
    const handleTextChange = createInputHandler("date", onChangeMock);

    handleTextChange("23abc10xyz2026");
    expect(onChangeMock).toHaveBeenCalledWith("23/10/2026");
  });

  it("should format partial dates cleanly during typing", () => {
    const onChangeMock = jest.fn();
    const handleTextChange = createInputHandler("date", onChangeMock);

    handleTextChange("2");
    expect(onChangeMock).toHaveBeenCalledWith("2");

    handleTextChange("23");
    expect(onChangeMock).toHaveBeenCalledWith("23");

    handleTextChange("231");
    expect(onChangeMock).toHaveBeenCalledWith("23/1");

    handleTextChange("2310");
    expect(onChangeMock).toHaveBeenCalledWith("23/10");

    handleTextChange("23102");
    expect(onChangeMock).toHaveBeenCalledWith("23/10/2");
  });

  it("should allow graceful deletion / backspacing", () => {
    const onChangeMock = jest.fn();
    const handleTextChange = createInputHandler("date", onChangeMock);

    // User had "23/10/2026" and backspaces the last digit
    handleTextChange("23/10/202");
    expect(onChangeMock).toHaveBeenCalledWith("23/10/202");

    // User backspaces the slash
    handleTextChange("23/10");
    expect(onChangeMock).toHaveBeenCalledWith("23/10");
  });

  it("should truncate input exceeding 8 numeric digits", () => {
    const onChangeMock = jest.fn();
    const handleTextChange = createInputHandler("date", onChangeMock);

    handleTextChange("231020269999");
    expect(onChangeMock).toHaveBeenCalledWith("23/10/2026");
  });

  it("should pass non-date type text directly to onChange without masking", () => {
    const onChangeMock = jest.fn();
    const handleTextChange = createInputHandler("text", onChangeMock);

    handleTextChange("Lakers 2026");
    expect(onChangeMock).toHaveBeenCalledWith("Lakers 2026");
  });
});
