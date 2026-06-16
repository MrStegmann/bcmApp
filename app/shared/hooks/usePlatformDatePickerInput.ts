import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

type UsePlatformDatePickerInputParams = {
  value: Date | null | undefined;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
};

type UsePlatformDatePickerInputResult = {
  isWeb: boolean;
  displayValue: string;
  webValue: string;
  onWebChange: (nextValue: string) => void;
  showNativePicker: boolean;
  openNativePicker: () => void;
  nativePickerProps: {
    value: Date;
    mode: "date";
    display: "default";
    minimumDate?: Date;
    maximumDate?: Date;
    onChange: (event: DateTimePickerEvent, date?: Date) => void;
  };
};

const isValidDate = (value: Date | null | undefined): value is Date => {
  return value instanceof Date && !Number.isNaN(value.getTime());
};

const toYyyyMmDd = (date: Date): string => {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseYyyyMmDd = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  return parsedDate;
};

const formatStringToValidDate = (rawValue: string): Date | null => {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return null;
  }

  const onlyNumbersAndSeparators = trimmed.replace(/[^0-9/\-.]/g, "");
  const normalizedSeparators = onlyNumbersAndSeparators.replace(/[./]/g, "-");

  // Acepta entrada libre de usuario en formato local dd-mm-yyyy.
  const localMatch = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(normalizedSeparators);
  if (localMatch) {
    const day = Number(localMatch[1]);
    const month = Number(localMatch[2]);
    const year = Number(localMatch[3]);
    return parseYyyyMmDd(
      `${String(year)}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    );
  }

  // Acepta también formato ISO yyyy-mm-dd.
  return parseYyyyMmDd(normalizedSeparators);
};

const usePlatformDatePickerInput = ({
  value,
  onChange,
  minimumDate,
  maximumDate,
  placeholder = "Seleccionar fecha",
}: UsePlatformDatePickerInputParams): UsePlatformDatePickerInputResult => {
  const [showNativePicker, setShowNativePicker] = useState(false);

  const isWeb = Platform.OS === "web";

  const safeDate = useMemo(() => {
    if (isValidDate(value)) {
      return value;
    }

    return new Date();
  }, [value]);

  const webValue = useMemo(() => {
    if (!isValidDate(value)) {
      return "";
    }

    return toYyyyMmDd(value);
  }, [value]);

  const [webInputValue, setWebInputValue] = useState(webValue);

  useEffect(() => {
    setWebInputValue(webValue);
  }, [webValue]);

  const displayValue = useMemo(() => {
    if (!isValidDate(value)) {
      return placeholder;
    }

    return toYyyyMmDd(value);
  }, [placeholder, value]);

  const onWebChange = (nextValue: string) => {
    setWebInputValue(nextValue);

    const parsedDate = formatStringToValidDate(nextValue);

    if (!parsedDate) {
      return;
    }

    onChange(parsedDate);
  };

  const onNativeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowNativePicker(false);
      return;
    }

    if (selectedDate) {
      onChange(selectedDate);
    }

    setShowNativePicker(false);
  };

  return {
    isWeb,
    displayValue,
    webValue: webInputValue,
    onWebChange,
    showNativePicker,
    openNativePicker: () => setShowNativePicker(true),
    nativePickerProps: {
      value: safeDate,
      mode: "date",
      display: "default",
      minimumDate,
      maximumDate,
      onChange: onNativeChange,
    },
  };
};

export { usePlatformDatePickerInput };
