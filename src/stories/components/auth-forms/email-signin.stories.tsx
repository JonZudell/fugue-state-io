import type { Meta, StoryObj } from "@storybook/react";
import EmailSignIn from "@/components/ui/auth-forms/email-signin";
import { Card } from "@/components/ui/card";

const meta: Meta<typeof EmailSignIn> = {
  title: "Auth Forms/Email Signin",
  parameters: {
    controls: { expanded: true },
  },
  component: EmailSignIn,
} satisfies Meta<typeof EmailSignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Password: Story = {
  render: () => (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-96">
        <Card>
          <EmailSignIn redirectMethod={null} />
        </Card>
      </div>
    </div>
  ),
};
