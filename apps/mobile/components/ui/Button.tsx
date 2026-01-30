// apps/mobile/components/ui/Button.tsx
import { forwardRef } from "react";
import { Button as TamaguiButton, type GetProps } from "tamagui";

export type ButtonProps = GetProps<typeof TamaguiButton>;

export const Button = forwardRef<typeof TamaguiButton, ButtonProps>((props) => {
  return (
    <TamaguiButton
      {...props}
      pressStyle={{
        scale: 0.98,
        opacity: 0.9,
        ...props.pressStyle,
      }}
    />
  );
});

Button.displayName = "Button";
