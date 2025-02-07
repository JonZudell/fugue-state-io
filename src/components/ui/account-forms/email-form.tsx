'use client';

import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import { updateEmail } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '../input';

export default function EmailForm({
  userEmail
}: {
  userEmail: string | undefined;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new email is the same as the old email
    if (e.currentTarget.newEmail.value === userEmail) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateEmail, router);
    setIsSubmitting(false);
  };

  return (
    <Card
      className='p-6 text-black w-full'
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        <h1 className="text-2xl font-semibold">Your Email</h1>
        <p className="text-sm">Please enter the email address you want to use to login.</p>
        <form id="emailForm" onSubmit={(e) => handleSubmit(e)}>
          <Input
            type="text"
            name="newEmail"
            className="w-1/2"
            defaultValue={userEmail ?? ''}
            placeholder="Your email"
            maxLength={64}
          />
        </form>
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">
            We will email you to verify the change.
          </p>
          <Button
            variant="default"
            type="submit"
            form="emailForm"
            loading={isSubmitting}
          >
            Update Email
          </Button>
        </div>
      </div>
    </Card>
  );
}