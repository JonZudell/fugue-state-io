import type { Meta, StoryObj } from "@storybook/react";
import PasswordSignIn from "@/components/ui/auth-forms/password-signin";
import { Card } from "@/components/ui/card";

const meta: Meta<typeof PasswordSignIn> = {
  title: "Auth Forms/Password Signin",
  parameters: {
    controls: { expanded: true },
  },
  component: PasswordSignIn,
} satisfies Meta<typeof PasswordSignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Password: Story = {
  render: () => (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-96">
        <Card>
          <PasswordSignIn redirectMethod={null} />
        </Card>
      </div>
    </div>
  ),
};
