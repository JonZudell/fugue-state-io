import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "@/components/ui/card";
import ForgotPassword from "@/components/ui/auth-forms/forgot-password";

const meta: Meta<typeof ForgotPassword> = {
  title: "Auth Forms/Forgot Password",
  parameters: {
    controls: { expanded: true },
  },
  component: ForgotPassword,
} satisfies Meta<typeof ForgotPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Forgot: Story = {
  render: () => (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-96">
        <Card>
          <ForgotPassword redirectMethod={null} />
        </Card>
      </div>
    </div>
  ),
};
