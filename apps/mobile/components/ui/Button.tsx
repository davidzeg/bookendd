import { Button as TamaguiButton, type GetProps } from "tamagui";

export type ButtonProps = GetProps<typeof TamaguiButton>;

const ButtonFrame = TamaguiButton.styleable((props: ButtonProps, ref) => {
  const { pressStyle, ...rest } = props;

  return (
    <TamaguiButton
      ref={ref}
      {...rest}
      pressStyle={{
        scale: 0.98,
        opacity: 0.9,
        ...pressStyle,
      }}
    />
  );
});

export const Button = Object.assign(ButtonFrame, {
  Apply: TamaguiButton.Apply,
  Frame: TamaguiButton.Frame,
  Text: TamaguiButton.Text,
  Icon: TamaguiButton.Icon,
});

Button.displayName = "Button";
