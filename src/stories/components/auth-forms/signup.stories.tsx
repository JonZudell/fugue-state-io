import type { Meta, StoryObj } from "@storybook/react";
import SignUp from "@/components/ui/auth-forms/signup";
import { Card } from "@/components/ui/card";

const meta: Meta<typeof SignUp> = {
  title: "Auth Forms/Sign Up",
  parameters: {
    controls: { expanded: true },
  },
  component: SignUp,
} satisfies Meta<typeof SignUp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Password: Story = {
  render: () => (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-96">
        <Card>
          <SignUp redirectMethod={null} />
        </Card>
      </div>
    </div>
  ),
};
