import { useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "@/theme";
import { AccessibleButton } from "./AccessibleButton";
import { AccessibleTextField } from "./AccessibleTextField";

type OnboardingValues = {
  displayName: string;
  email: string;
};

type OnboardingErrors = Partial<Record<keyof OnboardingValues, string>>;

type FocusRef = {
  current: Pick<TextInput, "focus"> | null;
};

type FieldRefs = Record<keyof OnboardingValues, FocusRef>;

export function validateOnboardingFields(values: OnboardingValues) {
  const errors: OnboardingErrors = {};

  if (values.displayName.trim().length === 0) {
    errors.displayName = "Enter your display name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

export function focusFirstInvalidField(
  errors: OnboardingErrors,
  refs: FieldRefs
) {
  const firstInvalid = (["displayName", "email"] as const).find(
    (fieldName) => errors[fieldName]
  );

  if (firstInvalid) {
    refs[firstInvalid].current?.focus();
  }
}

export function OnboardingAccessForm({
  fieldRefs,
}: {
  fieldRefs?: FieldRefs;
}) {
  const theme = useTheme();
  const displayNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const [values, setValues] = useState<OnboardingValues>({
    displayName: "",
    email: "",
  });
  const [errors, setErrors] = useState<OnboardingErrors>({});

  return (
    <View
      style={{
        backgroundColor: theme.color("surface.white"),
        borderColor: theme.color("neutral.200"),
        borderRadius: theme.radius("card"),
        borderWidth: 1,
        marginBottom: theme.spacing("md"),
        padding: theme.spacing("md"),
      }}
    >
      <AccessibleTextField
        ref={displayNameRef}
        error={errors.displayName}
        label="Display name"
        onChangeText={(displayName) =>
          setValues((current) => ({ ...current, displayName }))
        }
        testID="displayName"
        value={values.displayName}
      />
      <AccessibleTextField
        ref={emailRef}
        autoCapitalize="none"
        error={errors.email}
        keyboardType="email-address"
        label="Email"
        onChangeText={(email) =>
          setValues((current) => ({ ...current, email }))
        }
        testID="email"
        value={values.email}
      />
      <AccessibleButton
        label="Continue"
        onPress={() => {
          const nextErrors = validateOnboardingFields(values);
          setErrors(nextErrors);
          focusFirstInvalidField(
            nextErrors,
            fieldRefs ?? {
              displayName: displayNameRef,
              email: emailRef,
            }
          );
        }}
      />
    </View>
  );
}
