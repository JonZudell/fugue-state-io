'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { updateName } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '../input';

export default function NameForm({ userName }: { userName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new name is the same as the old name
    if (e.currentTarget.fullName.value === userName) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateName, router);
    setIsSubmitting(false);
  };

  return (
    <Card
      className='p-6 text-black w-full'
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        <h1 className="text-2xl font-semibold">Your Name</h1>
        <p className="text-sm">Please enter your full name, or a display name you are comfortable with.</p>
        <form id="nameForm" onSubmit={(e) => handleSubmit(e)}>
          <Input
            type="text"
            name="fullName"
            className="w-1/2"
            defaultValue={userName}
            placeholder="Your name"
            maxLength={64}
          />
        </form>
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">64 characters maximum</p>
          <Button
            variant="default"
            type="submit"
            form="nameForm"
            loading={isSubmitting}
          >
            Update Name
          </Button>
        </div>
      </div>
    </Card>
  );
}