import { forwardRef } from "react";
import {
  Button as TamaguiButton,
  type GetProps,
  type TamaguiElement,
} from "tamagui";

export type ButtonProps = GetProps<typeof TamaguiButton>;

export const Button = forwardRef<TamaguiElement, ButtonProps>((props, ref) => {
  return (
    <TamaguiButton
      ref={ref}
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
